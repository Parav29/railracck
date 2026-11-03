# RakeFlow — complete project walkthrough

**IE305 Simulation Lab · IEOR, IIT Bombay · Team RakeFlow**
Discrete-event simulation of the closed-circuit coal rake cycle **Ghugus → Tadali → Chandrapur Super Thermal Power
Station (CSTPS) → back**, Central Railway, Nagpur Division. Built in **AnyLogic 8.9.9**.

This document explains the whole project from start to finish, so that someone who was not part of the team can
understand what was done, why, how, and what came out of it. Nothing is assumed to be known in advance.

---

## Contents

1. [The project in one page](#1-the-project-in-one-page)
2. [The real-world system](#2-the-real-world-system)
3. [The problem and the questions](#3-the-problem-and-the-questions)
4. [Objective and KPIs](#4-objective-and-kpis)
5. [How the project was carried out (timeline)](#5-how-the-project-was-carried-out)
6. [Data collection](#6-data-collection)
7. [Input modelling: parameters and distributions](#7-input-modelling)
8. [Model design: what is simulated and how](#8-model-design)
9. [Implementation in AnyLogic](#9-implementation-in-anylogic)
10. [Verification](#10-verification)
11. [Validation](#11-validation)
12. [Simulation method (run length, replications, CRN)](#12-simulation-method)
13. [Baseline results: where the time goes](#13-baseline-results)
14. [Experiments: what was run and what came out](#14-experiments)
15. [Analysis and interpretation](#15-analysis-and-interpretation)
16. [Recommendations](#16-recommendations)
17. [Limitations and next steps](#17-limitations-and-next-steps)
18. [Deliverables and where to find them](#18-deliverables)
19. [How to run and reproduce everything](#19-how-to-run-and-reproduce)
20. [Glossary](#20-glossary)

---

## 1. The project in one page

- **System.** Eight coal trains ("rakes") of 58 wagons (~3,990 t each) shuttle in a closed loop between the WCL coal
  sidings at **Ghugus** and **CSTPS** at Chandrapur. The route is a **14.11 km single line** Ghugus–Tadali, then about
  **13 km** on the busy Wardha–Balharshah **main line**.
- **Puzzle.** Pure running time for a round trip is under an hour, but a full cycle takes about **40 hours**.
- **What we built.** An AnyLogic discrete-event simulation of the whole loop: loading, crews, the single line,
  merging between 115 real passenger trains, unloading, empty return, brake-certificate examinations and demurrage.
- **Main finding.** About **80% of the cycle is spent at the two terminals** (loading, unloading, waiting for loop
  space and crews). The single line and the Tadali merge together cost only **~0.6 h**.
- **Experiments.** Four key experiments plus a 2×2×2 factorial, fleet size, the proposal's what-if scenarios,
  resource levers and assumption sensitivity (about 60 cases × 30 replications).
- **Result.** Three changes at Ghugus — **book the crew while the rake is loading**, **add a third loop**, and a
  **rapid loading silo** — raise throughput from **4.77 to 7.76 rakes/day (+63%)** and cut the cycle from
  **40.3 h to 24.7 h (−39%)**, with demurrage falling from ₹33,300 per rake to zero. The sanctioned
  **₹228 crore line doubling adds only +0.11 rakes/day** for today's traffic.

---

## 2. The real-world system

### 2.1 Places

| Place | Code | Role |
|---|---|---|
| Ghugus | GGS | WCL coal sidings (two coal handling plants) where empty rakes are loaded |
| Ghugus–Tadali | — | 14.11 km **single line**, electrified, goods only, no station in between (one block section) |
| Tadali | TAE | Junction where the single line meets the Wardha–Balharshah main line; has freight loops |
| Wardha–Balharshah main line | — | Part of the Delhi–Chennai high-density route; capacity use **145% UP / 163% DN** |
| Chandrapur / CSTPS | CD | 2,920 MW power station; 5 wagon tipplers (4 assumed working) |
| Balharshah | BPQ | Crew lobby (where crews are booked) and the depot for brake examinations |

### 2.2 The rake and its round trip

A **rake** is a complete train: here 58 BOXN open wagons carrying about 3,990 t of coal. The same rakes go round
and round (a **closed circuit**). One cycle:

1. Empty rake arrives at Ghugus and is **placed** on a loading siding.
2. It is **loaded** (pay-loader / coal handling plant), then **released** and made **ready**.
3. A **crew** is booked; the crew travels from the Balharshah lobby and signs on.
4. The rake waits for the **single line** to be free *and* for a free loop at Tadali, then runs 14 km.
5. At Tadali it waits for a **gap in the main-line traffic** and runs ~13 km south to Chandrapur.
6. At CSTPS it is **placed**, **tippled** (unloaded) and **released** as an empty.
7. The empty waits for a crew and for room at Tadali and Ghugus, then runs back the same way.
8. Every 6,000 km or 30 days the rake must go to Balharshah for a **brake power certificate (BPC)** examination.

### 2.3 The three "clocks" on every rake

| Clock | Rule | Source |
|---|---|---|
| Crew duty | 9 h at a stretch; up to 11 h if 2 h notice is given; then a relief crew is needed. Rest at HQ 12 h (after < 8 h duty) or 16 h | RBE 143/2016; IREM Rule 1511 |
| Brake power certificate | Valid 6,000 km or 30 days; intensive exam ~8 h, daylight only (06:00–18:00) | Railway Board JPO via IRIMEE |
| Demurrage | Free time 3 h for loading, 7 h for unloading, counted from placement; then ₹150 per wagon per hour, graded upward for long delays | Railway Board rates circulars 2016–2024 |

---

## 3. The problem and the questions

**Context.**
- CSTPS holds only **6–17 days** of coal against a norm of **20–26 days**.
- It receives roughly **6–10 rakes/day** by rail.
- The main line it depends on runs at 145–163% of capacity.
- In July 2026 Railways sanctioned **₹228 crore to double the Ghugus–Tadali single line** (+4.5 MTPA planned).

**Core question.** A loaded rake runs only ~27 km and is moving for under an hour, yet its round trip takes about
40 hours. **Where does that time go, and which change delivers the most coal per day — new track, or better
operation?**

**What-if scenarios promised in the proposal (submitted deck):**

| # | Scenario |
|---|---|
| 1 | Base case — today's practice |
| 2 | Dispatch on the single line — batched vs alternating |
| 3 | Tadali paths — reserved slots vs taking gaps |
| 4 | Crew booking — at loading vs when the rake is ready |
| 5 | Exam trigger — 3 / 5 / 7 days of validity left vs at expiry |
| 6 | Fleet size — 8 to 20 rakes |
| 7 | Line doubling — best operating policy vs the ₹228 cr track |

---

## 4. Objective and KPIs

**Objective.** Maximise rakes/day delivered to CSTPS and minimise mean rake cycle time, without breaking the crew-duty
or brake-certificate rules.

| KPI | Type | Better | Baseline value | Definition in the model |
|---|---|---|---|---|
| Rakes/day to CSTPS | Primary | higher | 4.77 | loaded rakes placed at CSTPS per day after warm-up |
| Coal delivered, t/day | Primary | higher | ~19,000 | rakes/day × 3,990 t |
| Mean and P90 cycle time | Primary | lower | 40.3 h / 47.1 h | Ghugus arrival to the next Ghugus arrival of the same rake |
| Cycle-time breakdown | Diagnostic | — | 20 stages | hours per cycle spent in each stage |
| Demurrage per rake | Cost | lower | ₹33,300 | ₹150/wagon/h over free time, graded slabs |
| CSTPS coal stock, lowest | Outcome | higher | 5.0 days | daily stock = receipts + non-rail supply − consumption |
| Utilisations and queues | Diagnostic | — | single line 21% | single line, sidings, tipplers; Tadali queue length |
| Crew expiries per 100 trips | Constraint | ≈ 0 | 0.02 | crew duty running out before the trip ends |
| Exam hours per rake per month | Constraint | lower | 24.3 h | time spent on the BPC detour |

---

## 5. How the project was carried out

| Stage | What was done | Output |
|---|---|---|
| 1. Proposal | Defined the problem, the 7 what-if scenarios and the KPIs | Submitted proposal deck |
| 2. Data collection | Collected every number available from public sources; drafted a data request to the railway | `research/`, parameter workbook, request letter |
| 3. Input modelling | Turned the data into 100 model parameters; chose distributions where no records existed | `data/RakeFlow_Parameter_Sheet.xlsx`, `docs/MODEL_BRIEF.md` |
| 4. Model build | Built the model in three phases (core → + crew → + BPC), checking each before the next | `model/RakeFlow/RakeFlow.alp` |
| 5. Verification and validation | Rule checks after every event; comparison with public benchmarks | Section 10–11 |
| 6. Experiments | ~60 cases × 30 replications; factorial; sensitivity | `model/results/` |
| 7. Communication | Final presentation, simulator website, study guide | `presentation/`, `website/`, `docs/` |

---

## 6. Data collection

### 6.1 Sources used (all public and cited)

| Source | What was extracted | How the model uses it |
|---|---|---|
| erail.in timetable (scraped 13 Oct 2026) | **115 passenger trains** (58 southbound, 57 northbound) with times at Tadali and Chandrapur and days of run; 40.7 passings/day | Exact blocking schedule at the Tadali merge |
| etrain.info running history | Lateness samples (26–86 min) | Lognormal lateness for every passenger train |
| Railway Board letters (RBE 143/2016, rates circulars) | Crew duty and rest, free time, demurrage slabs | Hard rules in the logic |
| IRIMEE / Joint Procedure Order on freight examination | BPC 6,000 km / 30 days, 8 h exam, daylight only | Exam trigger, duration and time window |
| CAG Reports 31/2014 and 47/2015 | Yard times (arrival → placement, release → despatch), crew sign-on delays | Triangular min / most likely / max |
| CEA daily coal stock reports | CSTPS consumption 18.7–47.8 kt/day, receipts, stock 6–17 days | Coal-stock KPI and validation target (6–10 rakes/day) |
| Gazette of India, CR highlights, RailPost | 14.11 km line, 58 wagons, 3,990 t, ₹228 cr doubling | Fixed inputs and the doubling scenario |
| MAHAGENCO tenders, industry sources | 5 tipplers at CSTPS; tippler and silo loading times | Unloading and loading-time ranges |

Full notes with a URL for every number are in `research/` (15 notes) and in the parameter workbook.

### 6.2 What could not be obtained

No Central Railway or WCL rake-level records were received (the request through the faculty contact did not return
data). To prepare for them:
- a **data request letter** to the Sr DOM Nagpur, Sr DME, WCL and CSTPS (`docs/Data_Request_Letter_CR_WCL.md`);
- **8 data-collection templates** (`data/templates/`): loading events, unloading events, crew events, BPC exam
  events, passenger lateness, CSTPS daily stock, section facts, and a per-rake cycle log;
- the model **exports its own per-rake cycle log in the same columns** as the template, so real data can be
  compared directly with simulated data.

### 6.3 How every number is labelled

Each input is classified and named by an ID:
- **HARD** — official rule or record (e.g. CR-01 crew 9 h);
- **SOFT** — secondary source or inference (e.g. LD-03 loading time);
- **ASSUMPTION** — no source; exposed as a parameter and tested in sensitivity runs (A-01 … A-29).

---

## 7. Input modelling

### 7.1 Key fixed parameters

| Parameter | Value | Type | ID |
|---|---|---|---|
| Fleet in the closed circuit | 8 rakes | assumption | A-18 |
| Wagons / payload per rake | 58 / 3,990 t | hard | CR 2024-25 |
| Loops at Ghugus / Tadali | 2 / 2 | assumption | A-01 / A-02 |
| Loading sidings at Ghugus | 2 | inferred | LD-02 |
| Single line length | 14.11 km | hard | INF-01 |
| Tadali–Chandrapur distance | 13 km | soft | INF-08 |
| Tipplers in service | 4 of 5 | assumption | A-17 |
| Crew pool / booking lobby | 16 / Balharshah | assumption | A-25 / A-06 |
| Crew duty / with notice | 9 h / 11 h | hard | CR-01, CR-02 |
| Crew rest at HQ | 12 h / 16 h | hard | CR-04 |
| BPC validity | 6,000 km / 30 days | hard | BPC-01 |
| Exam window | 06:00–18:00 | hard | BPC-03 |
| Free time load / unload | 3 h / 7 h | hard | FT-01, FT-02 |
| Demurrage | ₹150 per wagon per hour, graded | hard | DM-01 |
| Through goods trains on main line | 20 per day per direction | assumption | A-24 |
| CSTPS start stock / consumption / non-rail supply | 500 kt / Tri(18.7, 33, 47.8) kt/day / 7 kt/day | CEA | — |

There are **100 parameters** in total, all on the AnyLogic canvas.

### 7.2 Distributions where no records exist

As stated in the proposal: if there is no record, take a **minimum, most likely and maximum** from norms or audit
tables and use a **triangular distribution**.

| Activity | Distribution | Basis |
|---|---|---|
| Loading, pay-loader / CHP | Tri(4, 6, 9) h | RB free-time norms, manual 9 h |
| Loading, rapid silo (RLS) | Tri(1, 1.5, 3) h | PIB, MCL silos |
| Arrival → placement, Ghugus | Tri(0.5, 1, 4) h | CAG Table 18 |
| Release → ready, Ghugus | Tri(0.8, 1.5, 6) h | CAG Table 18 |
| Single-line occupancy (one rake) | Tri(25, 31, 38) min | speed + line-clear overhead |
| Main-line freight speed | Tri(30, 40, 50) km/h | IR goods average 23.8 km/h incl. stops |
| Minimum gap to any train at Tadali | Tri(6, 10, 15) min | absolute-block headway + acceleration |
| Arrival → placement, CSTPS | Tri(0.6, 2, 8) h | CAG Table 18 |
| Unloading by tippler | Tri(2, 4, 7) h | industry data, RB 7 h |
| Release → despatch, CSTPS | Tri(1.5, 3, 8) h | CAG Table 18 |
| Crew sign-on | Tri(0.5, 0.75, 2) h | CAG 47/2015 |
| Crew travel Balharshah → Ghugus | Tri(1, 1.5, 2.5) h | ~40 km by road |
| Crew travel Balharshah → CSTPS | Tri(0.3, 0.5, 1) h | assumption A-26 |
| Relief crew arrival | Tri(1, 2.5, 6) h | assumption A-09 |
| Wait at depot before exam | Tri(0.5, 2, 10) h | CAG Table 18 |
| BPC exam duration | Tri(6, 8, 12) h | JPO 8 h + repairs |
| Passenger lateness | Lognormal, mean 30, sd 30 min | etrain samples |
| Extra goods trains on main line | Poisson, 20/day/direction, uniform times | ~50 trains/day at Ballarshah |

**Why these shapes.** Triangular needs only three numbers that experts and audits can give. Lognormal fits lateness
because lateness is never negative and has a long right tail. Poisson suits independent random train arrivals.

---

## 8. Model design

### 8.1 Entities

- **Rake** — loaded/empty, current stage, location, BPC km and days left, crew on board, timestamps per cycle.
- **Crew** — busy/free, sign-on time, whether the 2 h notice (extension to 11 h) was given.
- **Passenger / goods train** — a "blocker" on the main line at a given time (timetable time + random lateness).

### 8.2 Resources (with capacities)

| Resource | Capacity |
|---|---|
| Ghugus loops | 2 (A-01) |
| Loading sidings at Ghugus | 2 |
| Single line Ghugus–Tadali | 1 train at a time (2 independent tracks if doubled) |
| Tadali freight loops | 2 (one always kept for loaded rakes) |
| Main line Tadali–Chandrapur | 2 tracks: DN (southbound) and UP (northbound) |
| Tipplers at CSTPS | 4 |
| Crews at the Balharshah lobby | 16 |
| Exam line at Balharshah | 1, open 06:00–18:00 |

### 8.3 Process logic (one cycle)

```
Empty arrives at Ghugus (holds a Ghugus loop)
 -> placement (A-13) -> wait for a free loading siding -> loading (LD-03 or LD-04)
 -> release; demurrage if placement->release > 3 h
 -> release->ready (A-14)
 -> request crew (sign-on A-08 + travel A-07; duty clock starts at sign-on)
 -> wait until the single line is free AND a Tadali loop is free -> run 14 km (A-04)
 -> in the Tadali loop: find the first DN path keeping the A-05 gap from every train -> run 13 km
 -> CSTPS: crew signs off; placement (A-15) -> wait for a tippler -> unloading (UL-02)
 -> demurrage if placement->release > 7 h -> release->despatch (A-16)
 -> if BPC is due: detour to Balharshah depot, wait, 8 h exam in daylight only, return
 -> controller sends the empty only when a Tadali loop and a Ghugus loop are free (A-27); crew booked
 -> UP path at Chandrapur with the A-05 gap -> Tadali -> wait for single line -> run back to Ghugus
```

### 8.4 Controller rules (deadlock prevention and dispatching)

A single line with two-loop stations will **deadlock** without rules. The model uses:
1. **Absolute block:** a rake enters the single line only if a loop is free at the far end.
2. **Loaded first** on the single line (A-22). Alternatives available: alternating directions or batches of 3 (A-28).
3. **One Tadali loop is always reserved for loaded rakes.**
4. **Empties are held at Chandrapur** until a Tadali loop and a Ghugus loop are free (A-27).

### 8.5 Crew logic

- The crew is booked from the Balharshah lobby (or Chandrapur in one scenario), signs on, then travels to the train.
- **Default:** booked when the loaded rake is ready. **Option (A-29):** booked during loading, timed to arrive as the
  rake becomes ready.
- At 7 h of duty the controller gives notice, so the limit becomes 11 h.
- If duty would run out before the next move, the train is stabled and a relief crew is called (A-09).
- After signing off, the crew returns to the lobby and rests 12 h or 16 h.

### 8.6 BPC logic

- Every rake carries remaining km and days.
- When validity is close to running out (default: 1 day left, or km not enough for another round trip), the empty
  goes from Chandrapur to the Balharshah depot.
- There it waits, then is examined only between 06:00 and 18:00. Work pauses overnight and resumes the next morning.
- Validity is then reset to 6,000 km and 30 days.

### 8.7 Main-line merge logic

- The 115 passenger trains are placed on their **real timetable**, only on their **days of run**, each with a random
  lognormal lateness.
- About 20 extra goods trains per day per direction are added at random times.
- A coal rake at Tadali reserves the **earliest path** that keeps the safety gap (A-05) from every train before and
  after it. Empties do the same northbound at Chandrapur.

### 8.8 Demurrage and coal stock

- Demurrage is charged from placement to release beyond free time, with graded slabs: base up to 6 h over, +10%
  6–12 h, +25% 12–24 h, +50% 24–48 h, 2× 48–72 h, 3× beyond.
- CSTPS stock is updated daily: + coal from each unloaded rake + 7 kt non-rail supply − random daily burn.

### 8.9 Measurement

Every cycle is split into **20 timed stages**:

| # | Stage | # | Stage |
|---|---|---|---|
| 1 | Placement at Ghugus | 11 | Wait for tippler |
| 2 | Wait for loading siding | 12 | Unloading |
| 3 | Loading | 13 | Release → despatch at CSTPS |
| 4 | Release → ready at Ghugus | 14 | Wait for crew (empty) |
| 5 | Wait for crew (loaded) | 15 | Held at Chandrapur: loops / UP path |
| 6 | Wait for single line + Tadali loop | 16 | Run Chandrapur → Tadali (empty) |
| 7 | Run Ghugus → Tadali | 17 | Wait for single line at Tadali |
| 8 | Wait for DN path at Tadali | 18 | Run Tadali → Ghugus |
| 9 | Run Tadali → Chandrapur (loaded) | 19 | Crew relief |
| 10 | Placement at CSTPS | 20 | BPC exam detour |

### 8.10 Built in three phases

| Phase | Adds | Rakes/day | Cycle |
|---|---|---|---|
| 1 Core | loops, sidings, single line, Tadali merge, tipplers | 5.75 | 33.4 h |
| 2 + Crew | crew travel, duty limits, relief, rest | 4.81 | 39.9 h |
| 3 + BPC (full model = baseline) | exam detours, daylight window | 4.77 | 40.3 h |

The drop when crews are added (−0.94 rakes/day) was the first hint that crew timing is a lever.

---

## 9. Implementation in AnyLogic

- **File:** `model/RakeFlow/RakeFlow.alp` (AnyLogic 8.9.9; the free PLE edition is enough). Model time unit: hour.
  Day 0 is Monday 5 Oct 2026.
- **How it is built:**
  - The rake-cycle logic is a compact **event kernel** written in Java inside `Main`: its own future-event list and
    random-number stream, in Main's functions and additional class code.
  - AnyLogic supplies the **clock** (one dynamic event armed at the next kernel event), the **animation**, the
    **charts** and the **experiments**.
  - Because the logic is plain Java with its own seeded random stream, the same seed gives identical results in
    AnyLogic and in the test harness.
- **Main canvas:**
  - the animated network (Ghugus sidings and loops, single line, Tadali loops, the two main-line tracks with
    passenger and goods trains, CSTPS tipplers, the depot);
  - live KPI panel, cycle-time breakdown, next-trains board and resource occupancy;
  - all **100 parameters** grouped and described (x ≥ 1600);
  - the header line shows the date, phase, **scenario number and name**, fleet, seed and whether the model is still
    in warm-up.
- **Outputs:** each run appends one KPI row to `RakeFlow_runs.csv`. The Simulation run also writes
  `RAKE_cycle_log_sim.csv` in the format of the data template.

### 9.1 Experiments in the AnyLogic project

| Experiment | What it runs |
|---|---|
| **Simulation** | One animated run (33 days). Set `scenario`, `seed`, `modelPhase`, `fleetSize` in its Properties |
| **Replications30** | Baseline × seeds 1–30 → mean ± 95% CI |
| **E1_FleetSize** | Fleet 4–20 (step 2) × 10 seeds |
| **E2toE7_Scenarios** | Scenarios 0–18 × 10 seeds (proposal what-ifs and resource levers) |
| **KeyExperiments** | Scenarios 19–27 × 30 seeds — the key experiments and factorial; reproduces the slide numbers |

### 9.2 Scenario numbers

| No. | Scenario | No. | Scenario |
|---|---|---|---|
| 0 | Parameters as set (baseline) | 14 | Crew booked during loading |
| 1 | Rapid loading silo | 15 / 16 / 17 | BPC exam 3 / 5 / 7 days before expiry |
| 2 | Planned DN slot at Tadali, crew ordered to match | 18 | BPC exam at expiry |
| 3 | Priority to crews with < 2 h duty left | **19** | **Baseline** |
| 4 | Crew lobby at Chandrapur | **20** | **Exp 1 crew booked during loading** |
| 5 | Line doubling | **21** | **Exp 2 third Ghugus loop** |
| 6 / 7 | 3 / 5 tipplers | **22** | **Exp 3 rapid loading silo** |
| 8 | +1 loop at Ghugus and Tadali | **23** | **Exp 4 line doubling** |
| 9 | Crew pool +20% | **24** | **All three (19 + 20 + 21 + 22)** |
| 10 | Loading sidings +1 | 25 / 26 / 27 | Crew + loop / crew + silo / loop + silo |
| 11 / 12 / 13 | No extra goods trains / alternating / batched dispatch | | |

---

## 10. Verification

*Is the model built correctly?*

- **Invariants checked after every single event** (test harness, `check=true`):
  - no loop, siding or tippler over capacity;
  - the single line is never used in both directions at once;
  - no crew beyond 9 h without notice or beyond 11 h;
  - every reserved main-line path keeps the minimum gap from every other train;
  - no rake ever lost.
- **Stress-tested** over 15 extreme configurations with no violations; every scenario in every experiment also ran
  with the checks on.
- **Identical results in AnyLogic and the harness** for the same seed (seed 1: 4.70 rakes/day, 40.5 h, 135 cycles).
  This was confirmed by the team running the model in AnyLogic.
- **Phased build:** each phase was verified before the next was added.
- **Little's law:** throughput = fleet ÷ cycle time = 8 ÷ 40.3 h × 24 = 4.77 rakes/day, which matches the measured
  value.
- **File integrity:** the first `.alp` was read and rewritten by AnyLogic's own model serializer with no elements
  lost, and all function bodies compiled against AnyLogic's classes. Later versions come from the same generator and
  were opened and run by the team in AnyLogic.

---

## 11. Validation

*Is it the right model?* Compared with public benchmarks:

| Measure | Real world | Model | Verdict |
|---|---|---|---|
| Mean cycle time | 24–72 h (CR Nagpur wagon turnround 1.46 d; industry 48–72 h) | 40.3 h | inside |
| Ghugus terminal detention | ≤ 15–16 h (Railway Board target) | 15.5 h | inside |
| Rakes/day, today's assumed layout | 6–10 (CEA receipts) | 4.77 | below |
| Rakes/day with the three changes | 7–8 (reported for Ghugus) | 7.76 | inside |
| Crew duty expiries | rare | 0.02 per 100 trips | inside |
| Rakes over loading free time | many, not all (CAG) | 100% | too high |

**Interpretation.** The gaps trace to assumptions, not to the hard data:
- The two-loop Ghugus layout and the CAG-average yard times are conservative. With a third loop and faster handling
  the model reaches the observed range, which suggests the real yard already has more capacity than assumed.
- Every rake exceeds the 3 h loading free time because the published loading range starts at 4 h.

---

## 12. Simulation method

- **Run length:** 3-day warm-up (discarded; rakes start bunched at Chandrapur) + 30 days of statistics.
- **Replications:** 30 per case, seeds 1–30. Results are reported as the mean ± 95% confidence interval
  (t-distribution, 29 degrees of freedom).
- **Common random numbers (CRN):** every case uses the same 30 seeds as the baseline, so each replication is compared
  with its own "twin". Differences are reported as **paired** 95% intervals, which are much tighter (about ±0.06
  rakes/day).
- **Factorial design:** all 2×2×2 = 8 on/off combinations of the three main changes, giving main effects and
  interactions.
- **Sensitivity analysis:** uncertain inputs changed one at a time to see which assumptions drive the answer.
- **Tools:** experiments are defined in AnyLogic. For the many hundreds of runs, the identical Java was also run by a
  script-driven test harness (`model/harness/`), which checks all invariants after every event. The same seed gives
  the same result in both.

---

## 13. Baseline results

Today's operation (8 rakes, 2 Ghugus loops, crew booked when ready, pay-loader loading, single line), 30
replications:

| KPI | Value |
|---|---|
| Rakes/day to CSTPS | **4.77 ± 0.06** (~19,000 t/day) |
| Mean / P90 cycle | **40.3 h** / 47.1 h |
| Demurrage | ₹33,300 per rake (every loading over free time) |
| Single line busy | 21% |
| Tadali queue (average) | 0.03 rakes; DN merge wait 0.13 h |
| Crew expiries | 0.02 per 100 trips |
| BPC detour share | 5.5% of cycles; 24.3 exam h/rake/month |
| CSTPS lowest stock | 5.0 days |

**Where a rake's 40.3 hours go**

| Group | Hours | Share |
|---|---|---|
| Ghugus terminal (placement 1.8, siding wait 1.8, loading 6.3, release→ready 2.8) | 12.7 | 31% |
| CSTPS terminal (placement 3.5, unloading 4.3, release 4.2) | 12.0 | 30% |
| Empties held at Chandrapur (waiting for loop space) | 7.5 | 19% |
| Crew waits (loaded 2.8 + empty 1.7) | 4.4 | 11% |
| Running | 1.7 | 4% |
| BPC exam detour | 1.4 | 3% |
| Single-line waits | 0.4 | 1% |
| Tadali DN merge | 0.1 | 0% |

**Conclusion of the baseline:** about 80% of the time is terminal time. The single line and merge — the suspected
problem — cost about 0.6 h.

---

## 14. Experiments

All cases use 30 paired replications against the baseline (4.77 rakes/day, 40.3 h) unless noted.

### 14.1 Key experiments (one change each)

| # | What was changed | Rakes/day (Δ, 95% CI) | Cycle | What moved |
|---|---|---|---|---|
| 1 | **Crew booked during loading** (arrives as the rake is ready) | **5.77 (+1.00 ± 0.06)** | 33.3 h | crew wait 4.4 → 1.8 h; empties held at CD 7.5 → 3.8 h |
| 2 | **Third loop at Ghugus** (2 → 3) | **5.77 (+1.00 ± 0.09)** | 33.3 h | empties held at CD 7.5 → 1.7 h |
| 3 | **Rapid loading silo** (Tri(4, 6, 9) h → Tri(1, 1.5, 3) h) | 5.12 (+0.35 ± 0.07) | 37.5 h | Ghugus terminal 12.7 → 6.4 h; demurrage → ₹0; but held at CD 7.5 → 10.6 h |
| 4 | **Line doubling** (₹228 cr) | 4.88 (+0.11 ± 0.06) | 39.4 h | single-line use 21% → 11% |
| extra | Ghugus yard handling halved | 5.50 (+0.73) | 34.9 h | — |
| extra | Fleet 8 → 12 | 4.80 (+0.03) | 59.9 h | extra rakes only queue |

### 14.2 2×2×2 factorial (crew timing × Ghugus loops × loading method)

| Crew | Loops | Loading | Rakes/day | Cycle |
|---|---|---|---|---|
| when ready | 2 | pay-loader | 4.77 | 40.3 h |
| when ready | 2 | silo | 5.12 | 37.5 h |
| when ready | 3 | pay-loader | 5.77 | 33.3 h |
| during loading | 2 | pay-loader | 5.77 | 33.3 h |
| during loading | 3 | pay-loader | 6.37 | 30.1 h |
| when ready | 3 | silo | 6.74 | 28.4 h |
| during loading | 2 | silo | 6.76 | 28.4 h |
| **during loading** | **3** | **silo** | **7.76** | **24.7 h** |

**Estimated effects on rakes/day:**

| Effect | Δ rakes/day |
|---|---|
| Crew during loading | +1.07 |
| Third loop | +1.06 |
| Silo | +0.92 |
| Crew × loop | −0.26 |
| Crew × silo | +0.27 |
| Loop × silo | +0.25 |
| Three-way | −0.06 |

### 14.3 Proposal what-ifs

| # | Scenario | Rakes/day | Finding |
|---|---|---|---|
| 1 | Base case | 4.77 | reference |
| 2 | Dispatch alternating / batches of 3 | 4.77 / 4.77 | no effect — single line 21% busy |
| 3 | Reserved Tadali path vs take gaps | 4.78 | no effect — merge wait 0.13 h |
| 4 | Crew booked during loading | 5.77 | largest free gain |
| 5 | Exam trigger at expiry / 3 / 5 / 7 days early | 4.80 / 4.75 / 4.78 / 4.75 | no throughput effect; exam detention 23 → 30 h/rake/month as the trigger moves earlier |
| 6 | Fleet 8 → 20 | 4.77 → 4.84 | flat; cycle 40 → 99 h |
| 7 | Doubling vs best policy | 4.88 vs 5.77; both together 5.78 | operating policy beats track |

### 14.4 Fleet size (E1)

| Rakes | 4 | 6 | 8 | 10 | 12 | 14 | 16 | 18 | 20 |
|---|---|---|---|---|---|---|---|---|---|
| Rakes/day | 3.07 | 4.30 | 4.77 | 4.83 | 4.80 | 4.79 | 4.86 | 4.87 | 4.84 |
| Mean cycle h | 31.2 | 33.4 | 40.3 | 49.6 | 59.9 | 70.0 | 79.0 | 88.6 | 98.9 |
| P90 cycle h | 35.5 | 38.8 | 47.1 | 57.7 | 69.4 | 81.3 | 91.8 | 103.3 | 115.0 |

### 14.5 Resource levers (E2–E7)

| Lever | Δ rakes/day |
|---|---|
| +1 loop at Ghugus and Tadali | +0.94 |
| Loading sidings +1 | +0.39 |
| Crew lobby at Chandrapur | +0.37 |
| Rapid loading silo | +0.35 |
| Line doubling | +0.11 |
| Planned DN slot / crew-critical priority | +0.01 / 0.00 |
| Tipplers 3 or 5, crew pool +20% | 0.00 |
| No extra goods trains on main line | +0.01 |

### 14.6 Assumption sensitivity (one at a time)

| Assumption changed | Δ rakes/day |
|---|---|
| Ghugus loops 2 → 3 (A-01) | +1.00 |
| Ghugus yard times halved (A-13/14) | +0.73 |
| CSTPS handling halved (A-15/16) | +0.04 |
| Extra goods trains 20 → 40/day (A-24) | +0.03 |
| Absolute block Tadali–Chandrapur + 40 goods/day (A-23) | 0.00 |
| Passenger lateness doubled (A-21) | 0.00 |
| Crew pool 16 → 10 (A-25) | 0.00 |
| No duty extension (CR-02) | −0.01 |
| Controller does not hold empties at CD (A-27) | −0.21 |
| Tadali loops 2 → 3 (A-02) | −0.23 |

### 14.7 Scorecard: today vs the recommended package vs doubling

| KPI | Today | Crew + loop + silo | Change | Doubling only |
|---|---|---|---|---|
| Rakes/day | 4.77 | **7.76** | +63% | 4.88 |
| Coal t/day | 19,000 | **31,000** | +12,000 t | 19,500 |
| Mean cycle | 40.3 h | **24.7 h** | −39% | 39.4 h |
| P90 cycle | 47.1 h | **28.6 h** | −39% | 45.9 h |
| Demurrage per rake | ₹33,300 | **₹0** | −100% | ₹33,300 |
| CSTPS lowest stock | 5.0 days | **10.4 days** | ×2 | 5.4 days |
| Single-line use | 21% | 34% | still low | 11% |
| Crew expiries / 100 trips | 0.02 | 0 | rule kept | 0.01 |

---

## 15. Analysis and interpretation

- **The bottleneck is the Ghugus loops, not the track.** With two loops, a loaded rake waiting for its crew blocks a
  loop, so the next empty must wait at Chandrapur. That is why "empties held at CD" is 7.5 h.
- **Crew timing works by freeing the loop sooner.** The crew arrives as the rake is ready, so the rake leaves
  ~2.7 h earlier and the empty behind it can come in. Crew duty limits are never broken (the duty clock starts at
  sign-on; expiries stay ~0).
- **A third loop works by adding space.** It gives the same gain through a different mechanism, which is why the two
  overlap (negative interaction −0.26).
- **The silo alone moves the bottleneck.** Loading drops from 6.3 to 1.8 h and demurrage disappears, but the saved
  time turns into waiting for a loop. Combined with loop space it pays off fully (positive interactions).
- **Doubling barely helps today.** The single line is 21% busy and causes ~0.4 h of waiting per trip. Its value lies
  in future traffic growth, which this closed-circuit model does not include.
- **More rakes do not help.** Throughput is capped by the bottleneck; extra rakes add only waiting time (Little's
  law).
- **Robustness.** The ranking of levers holds under the sensitivity runs. What changes the absolute level most is
  the Ghugus layout and yard times, so these are the first data to collect.

---

## 16. Recommendations

In order of cost:

1. **Book crews when loading starts** — free; +1.0 rake/day; −7 h cycle.
2. **Add a third loop at Ghugus** — small yard work; +1.0 rake/day (+1.6 together with 1).
3. **Install a rapid loading silo** — removes ₹33,300 demurrage per rake; all three together: +3.0 rakes/day.
4. **Treat the ₹228 cr doubling as a growth project** — +0.11 rake/day for today's circuit.
5. **Keep the fleet at 8 and examine rakes close to expiry** — more rakes or earlier exams only add waiting.

---

## 17. Limitations and next steps

**Limitations**
- Ghugus loop count (A-01) and yard times (A-13/14) are assumptions, and they drive the absolute results.
- The rule that empties are held at Chandrapur (A-27) is an assumed dispatcher practice.
- Only the closed coal circuit is modelled; other traffic that a doubled line would carry is not.
- The main line is modelled as two tracks (one per direction). The partly opened third line would at most remove
  the 0.13 h merge wait.
- No railway field data yet; all inputs are public or assumed.

**Next steps**
1. Obtain CR/WCL records using the request letter and the 8 templates.
2. Fit real distributions to replace the triangular ones.
3. Re-run the experiments, starting with the inputs the sensitivity analysis ranks highest (Ghugus loops and yard
   times, crew booking point).
4. Extend to other traffic using the doubled line, and to the third and fourth main lines.

---

## 18. Deliverables

All deliverables are collected in the **`submission/`** folder:

| Required item | Where |
|---|---|
| **AnyLogic model** | `submission/1_AnyLogic_Model/RakeFlow.alp` + `Model_Description_and_How_to_Run.pdf` |
| **Support files — data collection** | `submission/2_Support_Files/A_Data_Collection/`: parameter workbook (xlsx), passenger timetable (csv), research notes and sources (pdf + md), model brief (pdf), data request letter (pdf), 8 data-collection templates (csv) |
| **Support files — analysis** | `submission/2_Support_Files/B_Analysis/`: experiment results (pdf + xlsx), raw replication data (csv), figures (png), analysis code (test harness, experiment scripts, model generator), simulator website |
| **Presentation slides** | `submission/3_Presentation_Slides/`: final presentation (pptx + pdf), proposal presentation as submitted (pptx + pdf) |

The working repository has the same material in its original layout: `model/`, `data/`, `research/`, `docs/`,
`presentation/` and `website/`.

---

## 19. How to run and reproduce

### 19.1 In AnyLogic (the model itself)

1. Open `RakeFlow.alp` in AnyLogic 8.9.9 (PLE is fine).
2. **Animated run:** select **Simulation**, set `scenario` in Properties → Parameters (e.g. 19 baseline, 24 all
   three), then Run. Use the speed control. The header line names the scenario.
3. **Results tables:** run **KeyExperiments** (scenarios 19–27 × 30 seeds). This reproduces the key-experiment
   numbers in this document exactly. Other ready experiments: Replications30, E1_FleetSize, E2toE7_Scenarios.
4. **A new experiment:** copy KeyExperiments, vary any parameter (Range) with `seed` 1–30, and change
   `collect(root.scenario, root)` to the varied parameter.

### 19.2 The test harness (same Java, outside AnyLogic)

```
cd model/harness
mkdir -p out && javac -d out stub/com/anylogic/engine/*.java src/*.java
java -cp out Runner reps=30 check=true scenario=24      # one case, 30 replications, invariants on
RAKEFLOW_JAVA=java python3 key_experiments.py           # key experiments + factorial -> model/results/
RAKEFLOW_JAVA=java python3 run_experiments.py           # all other experiment groups
python3 plots.py                                        # figures
```

### 19.3 The simulator website

A clean local page for presenting:
- experiment buttons (Baseline, A–E);
- parameters on the left;
- the animated circuit in the centre;
- 30-replication results on the right.

It plays back runs of the same model recorded by `website/build_data.py` for all 64 combinations of the left-hand
settings.

```
mkdir -p website/tmp && nginx -p "$PWD/website" -c nginx.conf     # then open http://localhost:8080
nginx -p "$PWD/website" -c nginx.conf -s stop                     # stop
```

Or simply open `website/index.html` in a browser.

### 19.4 Rebuilding the model file

`model/build/` generates the `.alp` from `kernel.java` (all logic) and `params.py` (all parameters):
`python3 model/build/gen_alp.py`.

---

## 20. Glossary

| Term | Meaning |
|---|---|
| Rake | A full train of wagons; here 58 BOXN wagons, ~3,990 t of coal |
| Closed circuit | The same rakes shuttle between one loading point and one unloading point |
| Single line | One track used in both directions; one train at a time |
| Absolute block | Signalling rule: one train per block section; the next may enter only when the line ahead is clear |
| Loop | Side track at a station where a train waits or is stabled |
| Siding | Track at the mine or plant where wagons are loaded or unloaded |
| DN / UP | Down (southbound, towards Balharshah) / Up (northbound, towards Wardha) |
| Tippler | Machine that rotates wagons to unload coal |
| RLS / silo | Rapid Loading System: overhead bin that loads a rake in ~1.5 h |
| CHP | Coal Handling Plant |
| BPC | Brake Power Certificate: rake examination every 6,000 km / 30 days |
| Free time | Time allowed for loading/unloading before demurrage is charged |
| Demurrage | Charge for keeping wagons beyond free time (₹150 per wagon per hour) |
| Crew lobby | Place where train crews sign on and off |
| CSTPS | Chandrapur Super Thermal Power Station (MAHAGENCO, 2,920 MW) |
| WCL | Western Coalfields Limited (the mine operator at Ghugus) |
| CEA | Central Electricity Authority (publishes daily coal stock reports) |
| CAG | Comptroller and Auditor General (audit reports with yard-time data) |
| Warm-up | Initial simulated period discarded so that start-up effects do not bias results |
| Replication | One independent run of the model with its own random seed |
| CRN | Common random numbers: the same seeds across scenarios so differences are due to the change, not chance |
| Paired CI | Confidence interval of the per-seed difference between a scenario and the baseline |
| P90 | 90th percentile: 90% of cycles are shorter than this |
| Little's law | Average number in the system = throughput × average time in the system |
| Factorial design | Running every combination of factor levels to measure main effects and interactions |
| Triangular distribution | Distribution defined by a minimum, most likely and maximum value |
