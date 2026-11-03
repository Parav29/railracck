"""Builds website/data/ from the RakeFlow model (same Java as model/RakeFlow/RakeFlow.alp, run by the test harness).

For every combination of the five website settings it writes
  data/trace_<key>.js   one replication (seed 1, 15 days) for the animation
  data/results.js       30 replications (seeds 1-30, 3 d warm-up + 30 d): mean, 95% CI, paired delta vs baseline
Run from the repo root:  python3 website/build_data.py      (needs java; compiles the harness first)
"""
import csv, io, itertools, json, os, statistics as st, subprocess
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
H = os.path.join(ROOT, "model", "harness")
OUT = os.path.join(ROOT, "website", "data")
JAVA = os.environ.get("RAKEFLOW_JAVA", "java")
REPS, T29 = 30, 2.045

FLEET = (6, 8, 10, 12)
LOOPS = (2, 3)
CREW = (0, 1)      # 0 crew ordered when ready (today), 1 ordered during loading
RLS = (0, 1)       # 0 pay-loader / CHP, 1 rapid loading silo
DOUBLE = (0, 1)    # 0 single line, 1 doubled
BASE = (8, 2, 0, 0, 0)

GROUPS = ["Ghugus_terminal", "Crew_waits", "Single-line_waits", "Running", "Tadali_DN_merge", "CSTPS_terminal",
          "UP_path_at_CD", "Crew_relief", "BPC_detour"]
KPIS = ["rakesPerDay", "tonnesPerDay", "meanCycle_h", "p90Cycle_h", "demurrageRsPerRake", "lineUtil", "sidingUtil",
        "tipplerUtil", "mergeWait_h", "crewExpiriesPer100", "stockMinDays"]


def key(c):
    return "f%d_l%d_c%d_r%d_d%d" % c


def args(c):
    f, l, cr, r, d = c
    a = [f"fleetSize={f}", f"ghugusLoops_A01={l}"]
    if cr: a.append("crewOrderedAtLoading_A29=true")
    if r: a.append("loadingByRLS_LD04=true")
    if d: a.append("lineDoubled_INF04=true")
    return a


def java(cls, a):
    return subprocess.run([JAVA, "-cp", os.path.join(H, "out"), cls] + a, capture_output=True, text=True, check=True).stdout


def one(c):
    rows = list(csv.DictReader(io.StringIO(java("Runner", [f"reps={REPS}", "check=true"] + args(c)))))
    trace = java("TraceRunner", ["days=15"] + args(c)).strip()
    with open(os.path.join(OUT, f"trace_{key(c)}.js"), "w") as f:
        f.write(f"window.RF_TRACE=window.RF_TRACE||{{}};window.RF_TRACE['{key(c)}']={trace};\n")
    return c, rows


def main():
    os.makedirs(os.path.join(H, "out"), exist_ok=True)
    srcs = [os.path.join(H, "stub", "com", "anylogic", "engine", f) for f in os.listdir(os.path.join(H, "stub", "com", "anylogic", "engine"))]
    srcs += [os.path.join(H, "src", f) for f in os.listdir(os.path.join(H, "src")) if f.endswith(".java")]
    subprocess.run(["javac", "-nowarn", "-d", os.path.join(H, "out")] + srcs, check=True, capture_output=True)
    os.makedirs(OUT, exist_ok=True)
    combos = list(itertools.product(FLEET, LOOPS, CREW, RLS, DOUBLE))
    with ThreadPoolExecutor(max_workers=6) as ex:
        res = dict(ex.map(one, combos))
    base = {r["seed"]: r for r in res[BASE]}
    out = {}
    for c, rows in res.items():
        d = {}
        for k in KPIS + GROUPS:
            v = [float(r[k]) for r in rows]
            d[k] = [round(st.mean(v), 4), round(T29 * st.stdev(v) / len(v) ** 0.5, 4)]
        for k in ("rakesPerDay", "meanCycle_h"):
            v = [float(r[k]) - float(base[r["seed"]][k]) for r in rows]
            d["delta_" + k] = [round(st.mean(v), 4), round(T29 * st.stdev(v) / len(v) ** 0.5, 4) if c != BASE else 0]
        out[key(c)] = d
    with open(os.path.join(OUT, "results.js"), "w") as f:
        f.write("window.RF_RESULTS=" + json.dumps(out, separators=(",", ":")) + ";\n")
    b = out[key(BASE)]
    print(f"{len(out)} combinations; baseline {b['rakesPerDay'][0]:.2f} rakes/day, {b['meanCycle_h'][0]:.1f} h")
    for c in [(8, 2, 1, 0, 0), (8, 3, 0, 0, 0), (8, 2, 0, 1, 0), (8, 2, 0, 0, 1), (8, 3, 1, 1, 0)]:
        print(key(c), out[key(c)]["rakesPerDay"][0], out[key(c)]["meanCycle_h"][0])


if __name__ == "__main__":
    main()
