# RakeFlow — slide content, restructured in the simulation-study order (13 slides, 13 minutes)

**Instructions for the slide generator**
- **Keep the current visual design exactly** (Voxel Rail: dark title/closing slides, light content slides, gold
  section chips, pixel titles, Nunito body, block cards with hard shadows). Only the **order and content** change.
- Replace the old breadcrumb (CONTEXT > APPROACH > DIAGNOSIS > SOLUTION) with this one, top right on every content
  slide, current stage underlined:
  **PROBLEM > INPUT > MODEL > OUTPUT > WHAT-IFS**
- Use the on-slide text as written; put the speaker notes in each slide's notes; build charts as editable charts
  with the exact numbers given.
- Reuse existing visuals where marked "(reuse slide N of current deck)".

**Flow (the standard simulation study)**
Problem & objective → System → Input data → Input data analysis → Model building → Verification & validation →
Output analysis method → Baseline output → What-if experiments → Combined design → Conclusion

| # | Slide | Breadcrumb stage | Time |
|---|---|---|---|
| 1 | Title | — | 0:30 |
| 2 | Executive summary | — | 0:45 |
| 3 | Problem, objective and KPIs | PROBLEM | 1:00 |
| 4 | The system | PROBLEM | 1:00 |
| 5 | Input data: what we collected | INPUT | 1:00 |
| 6 | Input data analysis: from data to distributions | INPUT | 1:30 |
| 7 | Model building in AnyLogic | MODEL | 1:15 |
| 8 | Verification and validation | MODEL | 1:00 |
| 9 | Output analysis method | OUTPUT | 1:00 |
| 10 | Baseline output and root cause | OUTPUT | 1:15 |
| 11 | What-if experiments (one change at a time) | WHAT-IFS | 1:15 |
| 12 | Combined 2×2×2 experiment | WHAT-IFS | 1:00 |
| 13 | Conclusion and recommendations | — | 0:30 |
| | **Total** | | **13:00** |

---

## Slide 1 — Title  *(reuse slide 1 of current deck, unchanged)*

**Tag:** `IE305 / SIMULATION LAB`
**Title:** RakeFlow: Where do a coal rake's 40 hours go?
**Subtitle:** Discrete-event simulation of the Ghugus – Tadali – Chandrapur coal circuit, built in AnyLogic
**Chips:** `4.77 -> 7.76 rakes/day` · `40.3 -> 24.7 h cycle` · `Rs 33,300 -> Rs 0 demurrage`
**Line:** Team RakeFlow | IEOR, IIT Bombay
**Visual:** the voxel route strip along the bottom.

**Notes:** "RakeFlow simulates the coal trains between the Ghugus sidings and Chandrapur power station. A loaded
trip is only about 27 km, yet a full round trip takes about 40 hours. We'll follow the standard simulation study:
problem, input data and its analysis, the model and its checks, output analysis, then what-if experiments."

---

## Slide 2 — Executive summary  *(reuse slide 2 layout; rows renamed to the study steps)*

**Tag:** `EXECUTIVE SUMMARY`
**Title:** Three changes at Ghugus deliver 63% more coal; doubling the line adds only 2%

Five labelled rows (label block left, text right):
- **PROBLEM** (diamond): A rake is moving for only ~1.7 h of a 40.3 h round trip; ₹228 cr is sanctioned to double the single line.
- **INPUT** (dirt): Public data — 115-train timetable, rules, audits, coal reports — turned into distributions; every gap is a labelled assumption.
- **MODEL** (ink): AnyLogic discrete-event model with a Java event kernel; built in 3 phases, rules checked after every event.
- **OUTPUT** (redstone): 80% of the cycle is spent at the terminals; the single line is busy only 21% of the time.
- **WHAT-IFS** (grass): Crew booked during loading + third Ghugus loop + loading silo: **4.77 → 7.76 rakes/day (+63%)**; doubling alone: +0.11.

**Notes:** "In one slide: the problem, how we built the inputs and the model, what the output shows, and which
changes work. The rest of the talk follows these five steps."

---

## Slide 3 — Problem, objective and KPIs

**Tag:** `01 / PROBLEM`  · **Breadcrumb:** PROBLEM
**Title:** A short trip, a 40-hour cycle: what limits coal delivery?

**Left (three icon rows, reuse slide 3):**
- **Power station short of coal:** CSTPS (2,920 MW) holds 6–17 days; the norm is 20–26 days.
- **Busy railway:** the shared main line runs at 145–163% of capacity.
- **Big investment planned:** ₹228 crore to double the 14 km Ghugus–Tadali single line.

**Right (hero block):** **~1.7 h** moving (grass) vs **40.3 h** round trip (redstone)

**Bottom: objective + KPIs (one block card, two columns):**
**Objective:** maximise rakes/day to CSTPS and minimise rake cycle time, within crew-duty and brake-exam rules.

| Primary KPIs | Supporting KPIs |
|---|---|
| Rakes/day (and tonnes/day) | Demurrage per rake |
| Mean and P90 cycle time | Lowest coal stock at CSTPS (days) |
| Cycle-time breakdown (20 stages) | Utilisation of line, sidings, tipplers; crew expiries |

**Notes:** "The plant is short of coal and the railway plans a ₹228 crore doubling. Running takes 1.7 of 40 hours,
so the question is what really limits delivery. Our objective is more rakes per day in less cycle time, within the
rules. These are the KPIs we report for every experiment: throughput and cycle time first, then demurrage, the
plant's coal stock, and utilisations to locate the bottleneck."

---

## Slide 4 — The system  *(merge slides 4 and 5 of current deck)*

**Tag:** `02 / SYSTEM`  · **Breadcrumb:** PROBLEM
**Title:** Eight rakes circulate in one closed loop with three clocks

**Left (≈45%):** the railway route-map excerpt (reuse slide 4 image) with the 14.11 km single line circled.

**Right (≈55%):** the 5-block route strip (reuse slide 5): Ghugus sidings (2 sidings + 2 loops) → Single line
(14.11 km, one train at a time) → Tadali Jn (2 loops, 115 passenger trains) → Main line (~13 km, DN and UP) →
CSTPS (4 of 5 tipplers).

**Bottom row:** the 8-step cycle strip (Load → Crew → Single line → Merge → Unload → Empty held at CD → Run back →
BPC exam) and three small clock cards:
- **Crew:** 9 h (11 h with notice), then relief
- **Brake certificate:** every 6,000 km / 30 days; 8 h exam, daylight only
- **Demurrage:** 3 h free to load, 7 h to unload; then ₹150/wagon/h

**Caption:** Each rake = 58 wagons ≈ 3,990 t. Crew lobby and BPC depot at Balharshah.

**Notes:** "Here's the system we model: eight rakes on one closed loop. Load at Ghugus, wait for a crew, cross the
single line, merge at Tadali between passenger trains, unload at the plant, then return empty. A loop is a waiting
track; a siding is where loading happens. Three clocks run on every rake — crew duty, the brake certificate, and
demurrage."

---

## Slide 5 — Input data: what we collected

**Tag:** `03 / INPUT DATA`  · **Breadcrumb:** INPUT
**Title:** All inputs come from public, cited sources

**Table (block card):**

| Source | What we collected | Type |
|---|---|---|
| erail.in timetable | 115 passenger trains: times at Tadali/Chandrapur, days of run | Hard data |
| etrain.info history | Lateness samples: 26, 86, 32 min | Sample |
| Railway Board letters | Crew duty 9/11 h, rest, free time, demurrage slabs | Rules |
| IRIMEE / JPO | BPC 6,000 km / 30 days, 8 h exam, daylight only | Rules |
| CAG audit reports | Yard-time ranges (arrival→placement, release→despatch), crew sign-on delays | Ranges |
| CEA daily coal reports (9 dates) | CSTPS consumption, receipts, stock | Hard data |
| Gazette, CR highlights | 14.11 km line, 58 wagons, 3,990 t, ₹228 cr | Hard data |

**Right strip (gravel chips "ASSUMPTION"):** A-01 2 loops at Ghugus · A-06 crew lobby at Balharshah · A-27 empties
held at Chandrapur until loops are free · A-29 crew ordered when the rake is ready

**Footer note (redstone outline):** No railway rake-level logs were received. A data request letter and 8 collection
templates are ready; the model exports its cycle log in the same format.

**Notes:** "Input data first. Everything we used is public and cited: the real timetable, train lateness samples,
Railway Board rules, brake-exam rules, audit reports for yard and crew times, and the power station's daily coal
reports. What we could not get — the railway's own rake logs — we replaced with labelled assumptions. The four
most important are listed on the right."

---

## Slide 6 — Input data analysis: from data to distributions

**Tag:** `04 / INPUT ANALYSIS`  · **Breadcrumb:** INPUT
**Title:** Each input was analysed and given a distribution

**Top-left: chart — passenger trains per hour at Tadali (from the 115-train timetable, weighted by days of run).**
Column chart, two series (DN = diamond, UP = rail), x = hour 0–23:

| Hour | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| DN | 0.43 | 0.43 | 0.14 | 0.00 | 0.14 | 0.00 | 1.14 | 1.29 | 1.00 | 2.00 | 0.14 | 1.00 | 1.57 | 4.14 | 1.00 | 1.00 | 0.86 | 0.71 | 1.29 | 1.71 | 0.29 | 0.43 | 0.00 | 0.14 |
| UP | 1.00 | 0.00 | 0.00 | 1.00 | 0.43 | 1.43 | 1.57 | 0.71 | 1.71 | 0.71 | 1.00 | 1.00 | 1.29 | 1.14 | 0.00 | 1.00 | 0.14 | 1.29 | 2.00 | 0.00 | 0.00 | 0.00 | 1.71 | 0.71 |

Caption under chart: 115 trains → **40.7 passings/day** (20.9 DN, 19.9 UP); peak 13:00 (5 trains in 43 min);
no daily DN train 19:35–09:38. **Used exactly** in the model (no distribution needed).

**Top-right: three "finding → model input" mini cards:**
- **CEA coal reports (9 dates):** consumption 18.7–47.8 kt/day, median ~33 → **Tri(18.7, 33, 47.8) kt/day**; receipts imply ~6–10 rakes/day (validation target).
- **Lateness samples (26, 86, 32 min):** positive, long right tail → **Lognormal, mean 30, sd 30 min** (assumed; only 3 samples).
- **Extra goods trains:** ~50/day at Ballarshah, random → **Poisson, 20/day each direction**.

**Bottom: "No record? Tri(min, most likely, max)" table** (reuse slide 7 tables):

| Activity | Distribution | Basis |
|---|---|---|
| Loading, pay-loader | Tri(4, 6, 9) h | RB norms (5 h old free time, 9 h manual) |
| Loading, silo | Tri(1, 1.5, 3) h | CCL / MCL silo results |
| Unloading, tippler | Tri(2, 4, 7) h | industry data, RB 7 h |
| Ghugus yard: placement / release | Tri(0.5, 1, 4) / Tri(0.8, 1.5, 6) h | CAG Table 18 |
| CSTPS yard: placement / release | Tri(0.6, 2, 8) / Tri(1.5, 3, 8) h | CAG Table 18 |
| Crew sign-on + travel | Tri(0.5, 0.75, 2) + Tri(1, 1.5, 2.5) h | CAG 47/2015, ~40 km road |
| Single-line block / merge gap | Tri(25, 31, 38) / Tri(6, 10, 15) min | speed + headway |

**Small note (italic):** Too few raw samples for goodness-of-fit tests, so triangular ranges from norms and audits
are used and the key ones are tested in sensitivity runs (slide 8).

**Notes:** "Input data analysis. The timetable we used exactly: 40.7 passings a day, with a sharp peak around 1 pm
and a quiet night window. From the coal reports we took the range and median of daily consumption to build a
triangular distribution, and the receipts give our validation target of 6–10 rakes a day. Lateness is never
negative and has a long tail, so we used a lognormal with mean 30 and sd 30 minutes — chosen to match the
scale of the three samples, not a statistical fit. Extra goods trains arrive
randomly, so Poisson. For times with no records we used triangular distributions from the minimum, most likely and
maximum in the norms and audit tables. We didn't have enough raw samples for goodness-of-fit tests, which is why we
test the important inputs in sensitivity runs."

---

## Slide 7 — Model building in AnyLogic

**Tag:** `05 / MODEL`  · **Breadcrumb:** MODEL
**Title:** A discrete-event model: entities, resources and one controller

**Card 1 — Conceptual model (diamond):**
- **Entities:** 8 rakes, 16 crews, passenger/goods trains (as timed blockers)
- **Resources:** 2 sidings, 2 Ghugus loops, single line (1 train), 2 Tadali loops, 4 tipplers, 1 exam line
- **Clocks:** crew duty, BPC validity, demurrage, CSTPS coal stock

**Card 2 — How it runs in AnyLogic (ink header):**
- `Main` agent: animated network + **100 parameters** + Java functions
- **Event kernel:** the clock jumps to the next event (loading done, crew arrives, line free)
- **Controller `dispatch()`** decides who gets a siding, crew, line, tippler, exam
- **No deadlock:** enter the single line only if a loop is free at the far end
- Experiments: Simulation (animated), Replications30, E1_FleetSize, E2toE7_Scenarios, KeyExperiments

**Card 3 — Built in 3 phases (bar chart, reuse slide 8):**

| Phase | Rakes/day |
|---|---|
| 1 Core cycle | 5.75 |
| 2 + Crew duty rules | 4.81 |
| 3 + Brake exams (full model) | 4.77 |

Caption: *Crew rules cost almost one rake/day — the first clue.*

**Notes:** "The conceptual model has three parts: entities — rakes, crews and the other trains; resources — sidings,
loops, the single line, tipplers and the exam line; and the clocks. In AnyLogic, the Main agent holds the animation,
100 parameters and the logic as Java functions. It's discrete-event: the clock jumps to the next event, and a
controller decides what can move, never letting a rake enter the single line without room at the far end. We built
it in three phases, checking each one; adding crew rules alone cost almost one rake a day."

---

## Slide 8 — Verification and validation

**Tag:** `06 / V&V`  · **Breadcrumb:** MODEL
**Title:** Verified at every event; validated against public benchmarks

**Left card — Verification ("built right?", grass):**
- Rules checked **after every event**: no loop/siding/tippler over capacity · single line one way only · crew ≤ 11 h · every path keeps the safety gap · no rake lost
- 15 stress configurations passed; every experiment run with checks on
- Same seed → same result in AnyLogic and the test harness (seed 1: 4.70 rakes/day)
- **Little's law:** 8 rakes ÷ 40.3 h × 24 = 4.77/day ✓

**Middle card — Validation ("right model?", diamond):**

| Measure | Real world | Model | |
|---|---|---|---|
| Mean cycle | 24–72 h | 40.3 h | ✓ |
| Ghugus detention | ≤ 15–16 h | 15.5 h | ✓ |
| Crew expiries | rare | 0.02 / 100 trips | ✓ |
| Rakes/day | 6–10 (CEA) | 4.77 | below |

Caption: *Below the observed range → our assumed Ghugus layout is conservative; calibrate with field data.*

**Right card — Sensitivity of key assumptions (small horizontal bars, Δ rakes/day):**

| Assumption changed | Δ rakes/day |
|---|---|
| Ghugus loops 2 → 3 (A-01) | +1.00 |
| Ghugus yard times halved | +0.73 |
| Passenger lateness doubled | 0.00 |
| Goods trains 20 → 40/day | +0.03 |
| Crew pool 16 → 10 | 0.00 |

Caption: *The answer depends on Ghugus inputs, not on main-line traffic → collect Ghugus data first.*

**Notes:** "Verification asks: did we build it right? Every rule is checked after every event, the AnyLogic and
harness runs agree seed for seed, and the output satisfies Little's law. Validation asks: is it the right model?
Cycle time, detention and crew behaviour fall inside published ranges. Throughput is below the 6–10 observed, which
tells us our assumed Ghugus layout is conservative. Sensitivity shows the answer depends on the Ghugus inputs, not on
main-line traffic or lateness — so those are the data to collect first."

---

## Slide 9 — Output analysis method

**Tag:** `07 / OUTPUT ANALYSIS`  · **Breadcrumb:** OUTPUT
**Title:** 3-day warm-up, 30 replications, 95% confidence intervals

**Left: chart — Welch warm-up plot.** Line chart: average rakes delivered per day over 30 replications, days 1–33,
with no warm-up removed. Shade days 1–3 grey and label "warm-up (discarded)". Horizontal dashed line at 4.77
labelled "steady-state mean".

| Day | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Rakes | 1.43 | 4.60 | 4.80 | 4.77 | 5.03 | 4.53 | 4.87 | 4.67 | 4.53 | 4.73 | 4.67 | 4.73 | 4.83 | 4.87 | 4.80 | 4.77 | 4.90 |

| Day | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Rakes | 5.03 | 4.80 | 4.83 | 4.53 | 4.80 | 4.93 | 4.77 | 4.87 | 4.70 | 4.73 | 4.67 | 4.63 | 4.73 | 5.00 | 4.87 | 4.47 |

Caption: rakes start bunched at Chandrapur, so day 1 is low (1.43); output is steady from day 3 → 3-day warm-up.

**Right: method blocks:**
- **Run length:** 3 days warm-up + **30 days** measured, per replication
- **Replications:** **30** (seeds 1–30). Across runs: 4.43–5.13 rakes/day, sd 0.15
- **Precision:** 95% CI half-width (t, 29 df) = **±0.06 rakes/day** (±1.2%)

  | Replications | 5 | 10 | 20 | 30 |
  |---|---|---|---|---|
  | CI half-width | ±0.19 | ±0.11 | ±0.07 | **±0.06** |
- **Comparisons:** every scenario uses the **same 30 seeds** (common random numbers) → paired difference with a 95% CI
- **Outputs per run:** rakes/day, mean & P90 cycle, 20-stage breakdown, utilisations, demurrage, coal stock

**Notes:** "Output analysis. Our rakes start bunched at Chandrapur, so the first day is unrepresentative. The Welch
plot — deliveries per day averaged over 30 runs — is low on day 1 and steady from day 3, so we discard 3 days and
measure 30. We run 30 replications; across runs throughput varies from 4.43 to 5.13. With 30 runs the 95% confidence
interval is plus or minus 0.06 rakes a day; with 10 runs it would be 0.11, too wide for the small effects we test.
Every scenario uses the same 30 seeds as the baseline, so each comparison is a paired difference."

---

## Slide 10 — Baseline output and root cause  *(merge slides 9 and 10 of current deck)*

**Tag:** `08 / BASELINE OUTPUT`  · **Breadcrumb:** OUTPUT
**Title:** 80% of the cycle is spent at the terminals, not on the track

**Left: horizontal bar chart (reuse slide 9), mean hours per cycle (30 runs):**

| Stage group | Hours |
|---|---|
| Ghugus terminal | 12.7 |
| CSTPS terminal | 12.0 |
| Empties held at Chandrapur | 7.5 |
| Crew waits (2.8 loaded + 1.7 empty) | 4.4 |
| Running | 1.7 |
| Brake exam detour | 1.4 |
| Single-line waits | 0.4 |
| Tadali merge | 0.1 |
| **Total** | **40.3** |

**Top-right: KPI strip:** **4.77** rakes/day (±0.06) · **40.3 h** cycle (P90 47.1 h) · **₹33.3k** demurrage/rake ·
**21%** single line busy · **0.13 h** merge wait

**Bottom-right: root-cause chain (compact, 4 blocks, reuse slide 10):**
Crew called only when rake is ready (~2 h travel) → loaded rake holds one of only **2 Ghugus loops** → no room for
the next empty → **empty held at Chandrapur 7.5 h** → longer cycle, fewer deliveries

**Notes:** "The baseline output: 4.77 rakes a day, plus or minus 0.06, and a 40-hour cycle. The breakdown shows
where the time goes — almost 13 hours at Ghugus, 12 at the plant, 7.5 hours of empties held at Chandrapur, 4.4
waiting for crews. The single line and merge cost half an hour; the line is busy only 21% of the time. The chain on
the right is why: the crew is called late, the loaded rake blocks one of two Ghugus loops, and the next empty must
wait at Chandrapur. That gives us hypotheses to test."

---

## Slide 11 — What-if experiments (one change at a time)

**Tag:** `09 / WHAT-IFS`  · **Breadcrumb:** WHAT-IFS
**Title:** Crew timing or a third loop each add a full rake/day; doubling adds 0.11

**Left: bar chart (reuse slide 11), rakes/day, 30 paired runs:**

| Case | Rakes/day | Δ (95% CI) | Cycle |
|---|---|---|---|
| Base | 4.77 | — | 40.3 h |
| A · Crew booked while loading | 5.77 | +1.00 ± 0.06 | 33.3 h |
| B · Third Ghugus loop | 5.77 | +1.00 ± 0.09 | 33.3 h |
| C · Rapid loading silo | 5.12 | +0.35 ± 0.07 | 37.5 h |
| D · Double the single line (₹228 cr) | 4.88 | +0.11 ± 0.06 | 39.4 h |

**Right: hypothesis verdict table (reuse slide 6 verdict chips, compact):**

| Hypothesis | Test | Verdict |
|---|---|---|
| H1 Single line is saturated | D: double the line | REJECTED |
| H2 Tadali merge causes delay | Reserved Tadali slots (+0.01) | REJECTED |
| H3 Too few Ghugus loops | B: third loop | CONFIRMED |
| H4 Crews called too late | A: book while loading | CONFIRMED |
| H5 Slow loading holds rakes | C: silo | PARTLY |
| H6 More rakes → more coal | Fleet 4–20: flat at ~4.8 from 8 | REJECTED |
| H7 Exams, tipplers, crew numbers limit flow | Exam 3/5/7 days early, ±tipplers, crew +20% | REJECTED |

**Bottom strip:** Also tested, no real effect: alternating / batched dispatch on the single line.

**Notes:** "Now the what-ifs. Each changes one thing, compared with the baseline on the same 30 seeds. Booking the
crew while the rake is loading adds one rake a day; a third Ghugus loop adds the same; a loading silo adds a third of
a rake because the queue moves to the loops; doubling the line adds 0.11. So of our seven hypotheses, the track and
the merge are rejected, loops and crew timing confirmed, loading partly, and more rakes, exams, tipplers or crews
make no difference."

---

## Slide 12 — Combined 2×2×2 experiment  *(reuse slide 12 of current deck)*

**Tag:** `10 / COMBINED 2×2×2`  · **Breadcrumb:** WHAT-IFS
**Title:** Together, three Ghugus changes deliver 63% more coal

**Left: 8-bar chart (rakes/day | cycle):** None 4.77 | 40.3 h · Silo 5.12 | 37.5 h · Crew 5.77 | 33.3 h ·
Loop 5.77 | 33.3 h · Crew + Loop 6.37 | 30.1 h · Loop + Silo 6.74 | 28.4 h · Crew + Silo 6.76 | 28.4 h ·
**All three 7.76 | 24.7 h** (gold)

**Under chart:** Main effects: Crew +1.07 · Loop +1.06 · Silo +0.92. Interactions: Crew × Loop −0.26 (overlap) ·
Crew × Silo +0.27 · Loop × Silo +0.25

**Right: scorecard:**

| KPI | Today | All three | Change |
|---|---|---|---|
| Rakes/day | 4.77 | 7.76 | +63% |
| Coal (t/day) | 19,000 | 31,000 | +12,000 |
| Mean cycle | 40.3 h | 24.7 h | −39% |
| P90 cycle | 47.1 h | 28.6 h | −39% |
| Demurrage / rake | ₹33,300 | ₹0 | −100% |
| Lowest coal stock | 5.0 days | 10.4 days | ×2 |

**Gold callout:** More than additive: single gains add up to 7.12; the simulation gives 7.76. Doubling alone: 4.88 (+2%).

**Notes:** "Because changes interact, we ran a full factorial: all eight on/off combinations of crew timing, the
third loop and the silo. Crew and loop overlap because both free loop space; the silo pays off once loops are
fixed. All three give 7.76 rakes a day — 63% more coal and a 39% shorter cycle, with no demurrage and the plant's
lowest stock doubled."

---

## Slide 13 — Conclusion and recommendations  *(reuse slide 13 of current deck)*

**Tag:** `11 / CONCLUSION`
**Title:** Fix the terminals before the track

**Three recommendation blocks:**
1. **Book crews while the rake is loading** — operating change, no new assets — **+1.0 rake/day**
2. **Add a third loop at Ghugus** — small yard work — **+1.0 rake/day**
3. **Add a rapid loading silo** — ends demurrage; all three together **+3.0 rakes/day (+63%)**

**What our results do not claim (gravel blocks):**
- Ghugus loops, yard times and crew booking are **assumptions**, not field-verified
- The crew test knows loading times in advance; a real controller must **forecast** them, so +1.0 is a best case
- Doubling is judged **only for this coal circuit**, not for network-wide growth

**Next steps (arrow strip):** 1 Get railway records → 2 Fit distributions & calibrate → 3 Pilot crew timing →
4 Cost the loop and silo

**Thank you | Questions?**

**Notes:** "To conclude: fix the terminals before the track. Book crews while loading, add a loop at Ghugus, then a
silo — about three more rakes a day. The limits: key Ghugus inputs are assumptions, the crew result is a best case,
and doubling is judged only for this circuit. Next we'd get railway records, fit real distributions, calibrate, and
pilot the crew change. Thank you."
