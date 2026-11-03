"""Run harness replications and print mean +- 95% CI half-width for key KPIs."""
import subprocess, sys, csv, io, statistics as st
J = "/Applications/AnyLogic 8 PLE.app/Contents/jre/bin/java"
KEYS = ["rakesPerDay", "meanCycle_h", "lineUtil", "sidingUtil", "tipplerUtil", "demurrageRsPerRake",
        "shareRelief", "shareBpc", "stockMinDays", "mergeWait_h", "maxStuck_h"]
T = {5: 2.776, 10: 2.262, 20: 2.093, 30: 2.045}
def run(args, reps=10):
    out = subprocess.run([J, "-cp", "out", "Runner", f"reps={reps}"] + args, capture_output=True, text=True, cwd=sys.path[0] or ".").stdout
    rows = list(csv.DictReader(io.StringIO(out)))
    return rows
def summ(rows, k):
    v = [float(r[k]) for r in rows]
    m = st.mean(v); hw = T.get(len(v), 2.0) * st.stdev(v) / len(v) ** 0.5 if len(v) > 1 else 0
    return m, hw
if __name__ == "__main__":
    reps = int(sys.argv[1]); cases = sys.argv[2:]
    print(f"{'case':38s}" + "".join(f"{k[:12]:>16s}" for k in KEYS))
    for c in cases:
        rows = run(c.split(), reps)
        print(f"{c:38s}" + "".join(f"{summ(rows,k)[0]:9.3g}±{summ(rows,k)[1]:<6.2g}" for k in KEYS))
