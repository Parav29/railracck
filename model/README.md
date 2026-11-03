# RakeFlow AnyLogic model

Closed-circuit coal rakes, Ghugus (GGS) -> Tadali (TAE) -> Chandrapur TPS (CSTPS) and back, Central Railway Nagpur
Division. Built from `docs/MODEL_BRIEF.md`; every number is a parameter named after its brief ID
(`ghugusLoops_A01`, `freeTimeLoad_FT01`, `dutyLimit_CR01` ...).

```
model/
  RakeFlow/RakeFlow.alp      <- open this in AnyLogic 8.9.9 (PLE is fine)
  results/                   harness experiments: summary_tables.md, runs_all.csv, fig1-3 *.png
  build/                     generator: kernel.java (all model logic), params.py, gen_alp.py, checks
  harness/                   the same Java run outside AnyLogic for 30-replication experiments + invariant tests
```

## Open and run

1. AnyLogic -> File -> Open -> `model/RakeFlow/RakeFlow.alp`.
2. Projects tree -> RakeFlow -> **Simulation** -> Run (green arrow). One animated replication, seed 1,
   33 days (3 warm-up + 30). Speed it up with the toolbar or switch to virtual time.
3. Multi-run experiments (Parameter Variation, PLE allows them): **Replications30** (seeds 1-30),
   **E1_FleetSize** (4-20 rakes x 10 seeds), **E2toE7_Scenarios** (scenarios 0-18 x 10 seeds), **KeyExperiments**
   (scenarios 19-27 x 30 seeds: baseline, crew during loading, third Ghugus loop, RLS, doubling, all three, the pairs;
   reproduces `results/key_experiments.md`). Each shows a
   mean +- 95% CI table (rakes/day, mean and P90 cycle, utilisations, demurrage, Tadali queue, crew expiries per 100
   trips, exam h/rake/month) and writes a `*_summary.txt`.
4. Every run appends a KPI row to `model/RakeFlow/RakeFlow_runs.csv`; the Simulation run also writes
   `RAKE_cycle_log_sim.csv` in the column format of `data/templates/RAKE_cycle_log.csv`.

Change inputs in the Simulation experiment's Parameters (seed, modelPhase, scenario, fleetSize are listed there) or
on Main's canvas (all 100 parameters, x >= 1600, grouped and described).

Scenario numbers: 0 parameters as set; 1 RLS; 2 planned DN slot; 3 crew-critical priority; 4 Chandrapur lobby;
5 doubling; 6/7 tipplers 3/5; 8 loops +1; 9 crew +20%; 10 sidings +1; 11 no through goods; **12 alternating dispatch;
13 batched dispatch (3 per direction); 14 crew ordered during loading; 15/16/17 exam trigger 3/5/7 days left;
18 exam at expiry** (12-18 are the what-ifs promised in the proposal deck).

## What the model does

| Phase (`modelPhase`) | Adds |
|---|---|
| 1 core cycle | GGS loops (A-01) and loading sidings, loading LD-03/04, single line GGS-TAE as one block (A-04), TAE loops (A-02), DN path at Tadali between the 115 real trains (erail timetable, run days, lognormal lateness A-21) plus through goods trains (A-24) with gap A-05 either side, run to CD, placement A-15, tipplers A-17, release A-16, UP path back |
| 2 + crew clock | crew pool at the Balharshah lobby, sign-on A-08 + travel A-07, 9 h duty, 2 h notice -> 11 h, relief A-09 when duty expires while standing, HQ rest 12/16 h (CR-01..04) |
| 3 + BPC (default) | 6,000 km / 30-day validity, detour to Balharshah depot, exam only 06:00-18:00 (BPC-01..03) |

Always on: demurrage at both ends (FT-01/02, graded DM-01), CSTPS coal stock in days, cycle-time decomposition into
20 stages, utilisations.

Controller rules (a single line with two-loop stations dead-locks without them; all are flagged assumptions):
one TAE loop is always kept for loaded rakes; a loaded rake that cannot get a GGS loop is prepared and leaves from the
siding; loaded rakes have priority on the single line (A-22); **A-27** an empty is ordered out of CSTPS, and its crew
booked, only when a TAE loop and a GGS loop are free (line clear needs a clear reception line).

Proposal scenarios (added Nov 2026): **A-28** single-line dispatch when rakes wait at both ends - loaded first
(A-22, default), alternating, or batches of `batchSize_A28`; **A-29** crew ordered during loading so it should
arrive when the rake is ready (the A-14 time is drawn at placement; the duty clock starts at sign-on, so an early crew
burns duty and is relieved if it expires before departure); exam trigger `bpcLookaheadDays` 0/3/5/7.
New KPIs: P90 cycle time, tonnes/day, time-average queue at the Tadali merge and at the single line, crew expiries
per 100 crew trips, BPC exam detention hours per rake per month.

New assumptions beyond the brief: A-23 absolute block TAE-CD (default off), A-24 20 through goods trains/day/direction,
A-25 crew pool 16, A-26 crew travel BPQ->CSTPS tri(0.3, 0.5, 1) h, A-27 above, and `loadingSidings = 2`
(two CHPs, LD-02; 2 x tri(4,6,9) h = 7.6 rakes/day, matching LD-01).

How it is built: the rake cycle is a deterministic event kernel (own event list, own `Random(seed)`) in Main's
functions and Additional class code; AnyLogic provides the clock (one DynamicEvent armed at the next kernel event),
animation, charts and experiments. Because of that, the harness runs the identical Java and a given seed gives the
same numbers in both.

## Verification done

- `.alp` read and re-written by AnyLogic's own `ObjectModelSerializer` (the IDE file reader): no elements lost.
- Model opened in AnyLogic 8.9.9 PLE; the IDE generated its classes; all 82 function bodies, 330 shape/chart
  expressions and the 3 experiments' after-run code compile inside those generated classes against AnyLogic's own
  classpath (`build/check_generated.py`).
- Harness: invariants checked after every event (loop/siding/tippler/line capacity, single line never used both ways,
  no crew past 9 h without notice or past 11 h, every own path >= A-05 minimum from every other train, no rake lost)
  over 15 stress configurations.
- **Not yet done by me:** pressing Run inside AnyLogic (no screen access from this session). The first Simulation run
  with default parameters should reproduce the harness seed-1 row: 4.70 rakes/day, mean cycle 40.5 h, 135 cycles.

Rebuild everything: `bash model/build/build_all.sh`; experiments: `python3 model/harness/run_experiments.py`.

## Results (harness, 30 replications, see results/summary_tables.md)

Proposal what-ifs (paired vs baseline 4.77 rakes/day, same seeds):

| what-if | rakes/day | mean / P90 cycle h | verdict |
|---|---|---|---|
| Dispatch alternating / batched | 4.77 / 4.77 | 40.3 / 47.1 | no effect: line only 21% busy, rakes almost never wait at both ends at once |
| Tadali reserved DN slot (E3) | 4.78 | 40.2 / 47.1 | no effect: merge wait already 0.13 h |
| **Crew ordered during loading** | **5.77 (+1.00 +- 0.06)** | **33.3 / 38.3** | biggest free lever; 0 crew expiries per 100 trips |
| Exam trigger at expiry / 3 / 5 / 7 days | 4.80 / 4.75 / 4.78 / 4.75 | ~40 | no throughput effect; exam detention 23.2 -> 29.5 h/rake/month as trigger moves earlier |
| Fleet 8 -> 20 | 4.77 -> 4.84 | 40 -> 99 | flat beyond 8; extra rakes only queue |
| Doubling (Rs 228 cr) | 4.88 (+0.11) | 39.4 / 45.9 | small |
| Crew during loading + doubling | 5.78 (+1.01) | 33.2 / 38.3 | doubling adds nothing once the crew rule is fixed |


| | value | brief 4.7 target |
|---|---|---|
| Mean cycle | 40.3 +- 0.5 h | 24-72 h - inside |
| Rakes/day to CSTPS | 4.77 +- 0.06 | 6-10 - **below** |
| Terminal detention GGS / CSTPS | 15.5 h / 21.2 h | ~15-16 h - GGS inside, CSTPS above (7.5 h held for a path to GGS) |
| Rakes over free time | loading 100%, unloading 0% | substantial, not universal |

The throughput gap has a known reason, so per brief 4.7 it points at the assumption table: the binding constraint is
the Ghugus yard (A-01 two loops, A-13/A-14 CAG yard times, crew from Balharshah A-06/A-07), not the single line (21%
busy) or the Tadali merge (0.13 h). Fleet beyond 8 adds nothing (fig2). Ranked levers (fig3, paired, same seeds):
one more GGS loop +1.00 rakes/day, faster yard handling +0.73, one more siding +0.39, Chandrapur crew lobby +0.37,
RLS +0.35 (and removes Rs 33k demurrage per rake), doubling +0.11, tipplers and crew pool 0. A third TAE loop alone
lowers throughput (-0.23): it lets more empties crowd the Ghugus loops. Loops +1 + local lobby + RLS reaches 7.6
rakes/day, i.e. LD-01's observed 7-8.

Field data that would change the answer most: GGS loop count and placement/release times (A-01, A-13, A-14), crew
booking point (A-06), then Tadali gaps (A-05, A-23, A-24).
