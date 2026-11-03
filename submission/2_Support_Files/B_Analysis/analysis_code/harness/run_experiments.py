"""Brief section 4.6 experiments on the harness: 30 replications x (3 d warm-up + 30 d), seeds 1-30 shared
across cases (common random numbers). Writes model/results/runs_all.csv and summary_tables.md."""
import csv
import io
import os
import statistics as st
import subprocess
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__))
RES = os.path.join(os.path.dirname(HERE), "results")
JAVA = os.environ.get("RAKEFLOW_JAVA", "/Applications/AnyLogic 8 PLE.app/Contents/jre/bin/java")
REPS = 30
T29 = 2.045

EXPERIMENTS = [
    ("Phase build-up", [
        ("P1 core cycle (no crew, no BPC)", "modelPhase=1"),
        ("P2 + crew duty clock", "modelPhase=2"),
        ("P3 + BPC exam detours (baseline)", "modelPhase=3"),
    ]),
    ("E1 fleet size (A-18)", [(f"fleet {n}", f"fleetSize={n}") for n in (4, 6, 8, 10, 12, 14, 16, 18, 20)]),
    ("E2-E7 levers (one at a time vs baseline)", [
        ("baseline", "scenario=0"),
        ("E2 RLS/silo loading (LD-04)", "scenario=1"),
        ("E3 planned DN slot + crew to match", "scenario=2"),
        ("E3 priority to crews < 2 h left", "scenario=3"),
        ("E4 crew booked at Chandrapur", "scenario=4"),
        ("E5 Tadali-Ghugus doubling", "scenario=5"),
        ("E6 tipplers 3", "scenario=6"),
        ("E6 tipplers 5", "scenario=7"),
        ("E7 loops +1 at GGS and TAE", "scenario=8"),
        ("E7 crew pool +20%", "scenario=9"),
        ("E7 loading sidings +1", "scenario=10"),
        ("no through goods on main line (A-24 = 0)", "scenario=11"),
    ]),
    ("Proposal scenarios (submitted deck): dispatch, crew booking, exam trigger", [
        ("baseline (loaded first, crew when ready, exam 1 day left)", "scenario=0"),
        ("Dispatch: alternating directions", "scenario=12"),
        ("Dispatch: batches of 3", "scenario=13"),
        ("Crew ordered during loading (A-29)", "scenario=14"),
        ("Exam trigger: at expiry", "scenario=18"),
        ("Exam trigger: 3 days left", "scenario=15"),
        ("Exam trigger: 5 days left", "scenario=16"),
        ("Exam trigger: 7 days left", "scenario=17"),
    ]),
    ("Line doubling vs best operating policy (free levers)", [
        ("baseline (single line)", "scenario=0"),
        ("Doubling only (Rs 228 cr)", "scenario=5"),
        ("Best free policy: crew ordered during loading", "crewOrderedAtLoading_A29=true"),
        ("Best free policy + doubling", "crewOrderedAtLoading_A29=true lineDoubled_INF04=true"),
    ]),
    ("Assumption sensitivity", [
        ("baseline", "scenario=0"),
        ("A-01 GGS loops 3", "ghugusLoops_A01=3"),
        ("A-02 TAE loops 3", "tadaliLoops_A02=3"),
        ("A-13/A-14 yard handling halved", "placeLoadMin_A13=0.25 placeLoadMode_A13=0.5 placeLoadMax_A13=2 readyMin_A14=0.4 readyMode_A14=0.75 readyMax_A14=3"),
        ("A-15/A-16 CSTPS handling halved", "placeUnloadMin_A15=0.3 placeUnloadMode_A15=1 placeUnloadMax_A15=4 releaseMin_A16=0.75 releaseMode_A16=1.5 releaseMax_A16=4"),
        ("A-24 through goods 40/day", "throughGoodsPerDay_A24=40"),
        ("A-23 absolute block TAE-CD + A-24 40/day", "absoluteBlockTAE_CD_A23=true throughGoodsPerDay_A24=40"),
        ("A-21 lateness mean 60 sd 60 min", "latenessMean_A21=60 latenessSd_A21=60"),
        ("A-25 crew pool 10", "crewPoolSize_A25=10"),
        ("A-27 controller does not hold empties", "controllerHoldsEmptiesAtCD_A27=false"),
        ("CR-02 no duty extension", "allowDutyExtension_CR02=false"),
    ]),
    ("Combinations to reach LD-01 (7-8 rakes/day)", [
        ("crew at loading + loops +1", "scenario=8 crewOrderedAtLoading_A29=true"),
        ("crew at loading + loops +1 + RLS", "scenario=8 crewOrderedAtLoading_A29=true loadingByRLS_LD04=true"),
        ("loops +1 + Chandrapur lobby", "scenario=8 crewAtChandrapur_A06=true"),
        ("loops +1 + lobby + RLS", "scenario=8 crewAtChandrapur_A06=true loadingByRLS_LD04=true"),
        ("loops +1 + lobby + RLS, fleet 10", "scenario=8 crewAtChandrapur_A06=true loadingByRLS_LD04=true fleetSize=10"),
        ("loops 3/3, sidings 3, lobby, fleet 10", "ghugusLoops_A01=3 tadaliLoops_A02=3 loadingSidings=3 crewAtChandrapur_A06=true fleetSize=10"),
        ("loops 4/3, sidings 3, lobby, RLS, fleet 12", "ghugusLoops_A01=4 tadaliLoops_A02=3 loadingSidings=3 crewAtChandrapur_A06=true loadingByRLS_LD04=true fleetSize=12"),
    ]),
]

KPIS = [("rakesPerDay", "rakes/day", "{:.2f}"), ("meanCycle_h", "cycle h", "{:.1f}"), ("p90Cycle_h", "P90 cycle h", "{:.1f}"),
        ("lineUtil", "line util", "{:.0%}"), ("lineQueueAvg", "line queue", "{:.2f}"), ("mergeQueueAvg", "Tadali queue", "{:.3f}"),
        ("sidingUtil", "siding occ", "{:.0%}"), ("tipplerUtil", "tippler util", "{:.0%}"),
        ("mergeWait_h", "DN merge wait h", "{:.2f}"), ("demurrageRsPerRake", "demurrage Rs/rake", "{:,.0f}"),
        ("crewExpiriesPer100", "crew expiries /100 trips", "{:.2f}"), ("examHoursPerRakeMonth", "exam h/rake/month", "{:.1f}"),
        ("shareBpc", "BPC share", "{:.1%}"), ("stockMinDays", "stock min days", "{:.1f}")]


def run(args):
    out = subprocess.run([JAVA, "-cp", os.path.join(HERE, "out"), "Runner", f"reps={REPS}"] + args.split(),
                         capture_output=True, text=True, check=True).stdout
    return list(csv.DictReader(io.StringIO(out)))


def ci(v):
    m = st.mean(v)
    return m, T29 * st.stdev(v) / len(v) ** 0.5


def main():
    os.makedirs(RES, exist_ok=True)
    jobs = [(e, label, args) for e, cases in EXPERIMENTS for label, args in cases]
    with ThreadPoolExecutor(max_workers=6) as ex:
        results = list(ex.map(lambda j: run(j[2]), jobs))
    allrows = []
    for (e, label, args), rows in zip(jobs, results):
        for r in rows:
            allrows.append({"experiment": e, "case": label, "args": args, **r})
    with open(os.path.join(RES, "runs_all.csv"), "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(allrows[0].keys()))
        w.writeheader()
        w.writerows(allrows)
    base = {int(r["seed"]): float(r["rakesPerDay"]) for r in results[[j[2] for j in jobs].index("scenario=0")]}
    md = [f"# RakeFlow harness results\n\n{REPS} replications per case, each 3 days warm-up + 30 days statistics, "
          "seeds 1-30 shared by every case (common random numbers). Mean +- 95% CI half-width (t, 29 df). "
          "Delta = paired difference in rakes/day against the phase-3 baseline (same seeds).\n"]
    for e, cases in EXPERIMENTS:
        md.append(f"\n## {e}\n")
        md.append("| case | " + " | ".join(k[1] for k in KPIS) + " | delta rakes/day vs baseline |")
        md.append("|---|" + "---|" * (len(KPIS) + 1))
        for label, args in cases:
            rows = results[jobs.index((e, label, args))]
            cells = []
            for key, _, fmt in KPIS:
                m, hw = ci([float(r[key]) for r in rows])
                cells.append(f"{fmt.format(m)} +- {fmt.format(hw)}" if key in ("rakesPerDay", "meanCycle_h") else fmt.format(m))
            d = [float(r["rakesPerDay"]) - base[int(r["seed"])] for r in rows]
            dm, dh = ci(d)
            cells.append(f"{dm:+.2f} +- {dh:.2f}")
            md.append(f"| {label} | " + " | ".join(cells) + " |")
    # decomposition for the baseline
    rows = results[[j[2] for j in jobs].index("modelPhase=3")]
    md.append("\n## Baseline cycle-time decomposition (phase 3, mean h per cycle)\n")
    md.append("| stage | mean h | share |")
    md.append("|---|---|---|")
    phase_cols = [k for k in rows[0].keys() if k not in KEYS_NON_PHASE]
    total = st.mean(float(r["meanCycle_h"]) for r in rows)
    for k in phase_cols:
        m = st.mean(float(r[k]) for r in rows)
        md.append(f"| {k} | {m:.2f} | {m / total:.0%} |")
    md.append(f"| **total cycle** | **{total:.1f}** | |")
    open(os.path.join(RES, "summary_tables.md"), "w").write("\n".join(md) + "\n")
    print("\n".join(md))


KEYS_NON_PHASE = {"seed", "phase", "scenario", "fleet", "rakesPerDay", "meanCycle_h", "cycles", "lineUtil", "sidingUtil",
                  "tipplerUtil", "demurrageRsPerRake", "loadOverFreeShare", "unloadOverFreeShare", "shareRelief", "shareBpc",
                  "bpcOverdue", "stockMinDays", "daysBelow7", "mergeWait_h", "crewTrips", "extensions", "maxStuck_h",
                  "p90Cycle_h", "tonnesPerDay", "mergeQueueAvg", "maxMergeQ", "lineQueueAvg", "crewExpiriesPer100",
                  "examHoursPerRakeMonth",
                  "stuckPhase", "Ghugus_terminal", "Crew_waits", "Single-line_waits", "Running", "Tadali_DN_merge",
                  "CSTPS_terminal", "UP_path_at_CD", "Crew_relief", "BPC_detour"}

if __name__ == "__main__":
    main()
