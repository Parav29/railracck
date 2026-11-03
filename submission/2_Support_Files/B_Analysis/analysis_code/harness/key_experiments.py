"""Key experiments for the final presentation: four single-lever experiments plus a 2x2x2 factorial.

Each case: 30 replications x (3 d warm-up + 30 d), seeds 1-30 shared by every case (common random numbers),
so differences are paired. Writes model/results/key_experiments.csv and key_experiments.md.
Run:  RAKEFLOW_JAVA=java python3 model/harness/key_experiments.py
"""
import csv, io, itertools, os, statistics as st, subprocess
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__))
RES = os.path.join(os.path.dirname(HERE), "results")
JAVA = os.environ.get("RAKEFLOW_JAVA", "/Applications/AnyLogic 8 PLE.app/Contents/jre/bin/java")
REPS, T29 = 30, 2.045

CREW = "crewOrderedAtLoading_A29=true"
LOOP = "ghugusLoops_A01=3"
RLS = "loadingByRLS_LD04=true"
YARD = "placeLoadMin_A13=0.25 placeLoadMode_A13=0.5 placeLoadMax_A13=2 readyMin_A14=0.4 readyMode_A14=0.75 readyMax_A14=3"

SINGLE = [
    ("Baseline (today)", ""),
    ("Exp 1 Crew ordered during loading", CREW),
    ("Exp 2 One more loop at Ghugus (3 instead of 2)", LOOP),
    ("Exp 3 Rapid loading silo (RLS) at Ghugus", RLS),
    ("Exp 4 Line doubling Ghugus-Tadali (Rs 228 cr)", "lineDoubled_INF04=true"),
    ("Extra: yard handling at Ghugus halved", YARD),
    ("Extra: fleet 8 -> 12 rakes", "fleetSize=12"),
]
FACT = []
for c, l, r in itertools.product((0, 1), repeat=3):
    args = " ".join(a for a, on in ((CREW, c), (LOOP, l), (RLS, r)) if on)
    FACT.append((f"crew={'loading' if c else 'ready'} loops={3 if l else 2} loading={'RLS' if r else 'CHP'}", args, c, l, r))

KPI = [("rakesPerDay", "rakes/day"), ("tonnesPerDay", "t/day"), ("meanCycle_h", "cycle h"), ("p90Cycle_h", "P90 cycle h"),
       ("Ghugus_terminal", "Ghugus terminal h"), ("Crew_waits", "crew wait h"), ("UP_path_at_CD", "held at CD h"),
       ("demurrageRsPerRake", "demurrage Rs/rake"), ("lineUtil", "single-line util"), ("crewExpiriesPer100", "crew expiries/100"),
       ("stockMinDays", "CSTPS stock min days")]


def run(args):
    out = subprocess.run([JAVA, "-cp", os.path.join(HERE, "out"), "Runner", f"reps={REPS}", "check=true"] + args.split(),
                         capture_output=True, text=True, check=True).stdout
    return list(csv.DictReader(io.StringIO(out)))


def ci(v):
    return st.mean(v), T29 * st.stdev(v) / len(v) ** 0.5


def main():
    cases = [(n, a) for n, a in SINGLE] + [(n, a) for n, a, *_ in FACT]
    with ThreadPoolExecutor(max_workers=6) as ex:
        res = dict(zip([n for n, _ in cases], ex.map(lambda c: run(c[1]), cases)))
    base = {r["seed"]: r for r in res["Baseline (today)"]}
    rows = []
    for n, a in cases:
        for r in res[n]:
            rows.append({"case": n, "args": a, **r})
    with open(os.path.join(RES, "key_experiments.csv"), "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)

    def table(names):
        md = ["| case | " + " | ".join(k[1] for k in KPI) + " | delta rakes/day (paired 95% CI) | delta cycle h |",
              "|---|" + "---|" * (len(KPI) + 2)]
        for n in names:
            rr = res[n]
            cells = []
            for k, _ in KPI:
                m, h = ci([float(r[k]) for r in rr])
                cells.append(f"{m:.2f} +- {h:.2f}" if k in ("rakesPerDay", "meanCycle_h") else
                             (f"{m:,.0f}" if k in ("tonnesPerDay", "demurrageRsPerRake") else
                              (f"{m:.0%}" if k == "lineUtil" else f"{m:.2f}")))
            d = ci([float(r["rakesPerDay"]) - float(base[r["seed"]]["rakesPerDay"]) for r in rr])
            dc = ci([float(r["meanCycle_h"]) - float(base[r["seed"]]["meanCycle_h"]) for r in rr])
            cells += [f"{d[0]:+.2f} +- {d[1]:.2f}", f"{dc[0]:+.1f} +- {dc[1]:.1f}"]
            md.append(f"| {n} | " + " | ".join(cells) + " |")
        return md

    md = ["# Key experiments (harness, 30 paired replications, 3 d warm-up + 30 d, seeds 1-30, invariants checked)\n",
          "## Single levers vs baseline\n"] + table([n for n, _ in SINGLE])
    md += ["\n## 2x2x2 factorial: crew timing x Ghugus loops x loading method\n"] + table([n for n, *_ in FACT])
    # main effects and interactions on rakes/day (mean over the 8 cells, per seed)
    y = {(c, l, r): st.mean(float(x["rakesPerDay"]) for x in res[n]) for n, _, c, l, r in FACT}
    def eff(f):
        return st.mean(v * f(k) for k, v in y.items()) * 2
    sgn = lambda b: 1 if b else -1
    effects = [("Crew during loading", lambda k: sgn(k[0])), ("Loop +1", lambda k: sgn(k[1])), ("RLS", lambda k: sgn(k[2])),
               ("Crew x Loop", lambda k: sgn(k[0]) * sgn(k[1])), ("Crew x RLS", lambda k: sgn(k[0]) * sgn(k[2])),
               ("Loop x RLS", lambda k: sgn(k[1]) * sgn(k[2])), ("Crew x Loop x RLS", lambda k: sgn(k[0]) * sgn(k[1]) * sgn(k[2]))]
    md += ["\n## Factorial effects on rakes/day (effect = mean(high) - mean(low))\n", "| effect | rakes/day |", "|---|---|"]
    md += [f"| {n} | {eff(f):+.2f} |" for n, f in effects]
    open(os.path.join(RES, "key_experiments.md"), "w").write("\n".join(md) + "\n")
    print("\n".join(md))


if __name__ == "__main__":
    main()
