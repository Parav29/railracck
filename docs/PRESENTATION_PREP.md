# RakeFlow - presentation prep (read this the night before)

Deck to present: `presentation/RakeFlow_Final_Presentation_Professional.pptx` (22 slides, speaker notes on every slide).

---

## 1. The whole project in one minute

Coal rakes (trains of 58 wagons, ~3,990 t each) shuttle in a closed loop between the WCL coal sidings at
**Ghugus** and **Chandrapur power station (CSTPS)**. The route is a 14 km **single line** Ghugus-Tadali, then 13 km
on the busy Wardha-Balharshah **main line**. Running time is under an hour, but a round trip takes about **40 hours**.

We built an **AnyLogic discrete-event simulation** of this loop to find **where the 40 hours go** and **which
change gives the most coal per day**. Answer: the time is lost **at the terminals** (loading/unloading/waiting),
not on the single line. Three cheap changes at Ghugus - **book the crew while the rake is loading**, **add a third
loop**, **a rapid loading silo** - raise throughput from **4.77 to 7.76 rakes/day (+63%)** and cut the cycle from
**40.3 to 24.7 h (-39%)**. The Rs 228 crore line doubling adds only **+0.11 rakes/day** for today's traffic.

---

## 2. Background you must be able to explain

| Term | Meaning in one line |
|---|---|
| Rake | A full train of wagons; here 58 BOXN open wagons carrying ~3,990 t of coal |
| Closed circuit | The same 8 rakes go round and round between one mine and one plant |
| Single line | One track used in both directions; only one train on it at a time (absolute block) |
| Loop | A side track at a station where a rake can wait so others can pass; Ghugus and Tadali have 2 each (assumed) |
| Siding | Track at the mine where a rake is loaded; 2 at Ghugus (two coal handling plants) |
| Tadali merge | Where loaded rakes join the main line; they must find a gap between 115 timetabled passenger trains |
| Tippler | Machine at the plant that turns wagons over to unload; 5 installed, 4 working |
| Crew duty rule | Driver crew may work 9 h, 11 h with 2 h notice; then a relief crew is needed |
| BPC | Brake Power Certificate: rake must be examined every 6,000 km or 30 days; exam takes ~8 h, daylight only |
| Free time / demurrage | 3 h to load, 7 h to unload are free; after that the customer pays Rs 150 per wagon per hour |
| RLS | Rapid Loading System (silo) - loads a rake in ~1.5 h instead of ~6 h |
| CSTPS | Chandrapur Super Thermal Power Station, 2,920 MW; holds only 6-17 days of coal (norm 20-26) |

---

## 3. How the model works

**One rake's cycle (baseline mean hours, total 40.3 h)**

| Step | Hours |
|---|---|
| Placed, loaded and released at Ghugus | 12.7 |
| Waits for a crew (crew travels from Balharshah) | 2.8 |
| Single line Ghugus -> Tadali | 0.6 |
| Waits for a gap at Tadali, runs 13 km to CSTPS | 0.5 |
| Placed, tippled, released at CSTPS | 12.0 |
| Empty held at Chandrapur until loops are free (+ its crew wait) | 9.2 |
| Runs back to Ghugus | 1.3 |
| BPC exam detour when due | 1.4 |

**Resources rakes compete for:** 2 Ghugus loops, 2 loading sidings, the single line (1 train), 2 Tadali loops,
4 tipplers, 16 crews, 1 exam line (06:00-18:00).

**Controller rules (needed so the single line never deadlocks):**
- A rake enters the single line only if a loop is free at the far end (absolute block).
- Loaded rakes get the line before empties.
- One Tadali loop is always kept for loaded rakes.
- An empty is sent out of Chandrapur only when a Tadali loop and a Ghugus loop are free (assumption A-27).

**Main line:** two tracks, one each way (down/southbound, up/northbound). The 115 passenger trains are placed on
their real timetable and days of run, each with random lateness, plus ~20 extra goods trains/day each way.
A coal rake must keep a 6-15 min gap from every train. (The proposal picture showed 3 tracks; the model always
used 2. It hardly matters: the merge wait is only 0.13 h.)

**Built in three phases** (each checked before the next):

| Phase | Adds | Rakes/day |
|---|---|---|
| 1 Core | loops, sidings, single line, Tadali merge, tipplers | 5.75 |
| 2 + crew | crew travel, 9/11 h duty, relief, rest | 4.81 |
| 3 + BPC (full model = baseline) | exam detours in daylight only | 4.77 |

**How it is built in AnyLogic:** the rake logic is an event list inside Main (functions + Java); AnyLogic gives the
clock, animation, charts and the experiments (Simulation, Replications30, E1_FleetSize, E2toE7_Scenarios).
Every number is a parameter on the canvas (100 in total), named with its source ID (e.g. `ghugusLoops_A01`).

---

## 4. Data we used (all public; no railway records arrived)

| Source | What we took |
|---|---|
| erail.in timetable | 115 passenger trains, times at Tadali/Chandrapur, days of run |
| etrain.info history | passenger lateness samples (26-86 min) |
| Railway Board letters | crew duty and rest, free time, demurrage slabs |
| IRIMEE / JPO | BPC 6,000 km / 30 days, 8 h exam, daylight only |
| CAG audit reports | yard times (placement, release), crew sign-on delays |
| CEA daily coal reports | CSTPS burn, receipts, stock; 6-10 rakes/day received |
| Gazette, CR highlights | 14.11 km line, 58 wagons, 3,990 t, Rs 228 cr doubling |

**Where no record exists -> triangular distribution (min, most likely, max)**, as promised in the proposal:

| Activity | Distribution |
|---|---|
| Loading (normal) | Tri(4, 6, 9) h |
| Loading (silo) | Tri(1, 1.5, 3) h |
| Placement at Ghugus | Tri(0.5, 1, 4) h |
| Release -> ready at Ghugus | Tri(0.8, 1.5, 6) h |
| Single-line occupancy | Tri(25, 31, 38) min |
| Main-line speed | Tri(30, 40, 50) km/h |
| Gap at Tadali | Tri(6, 10, 15) min |
| Placement at CSTPS | Tri(0.6, 2, 8) h |
| Unloading | Tri(2, 4, 7) h |
| Release at CSTPS | Tri(1.5, 3, 8) h |
| Crew sign-on / travel / relief | Tri(0.5, 0.75, 2) / Tri(1, 1.5, 2.5) / Tri(1, 2.5, 6) h |
| BPC exam | Tri(6, 8, 12) h |
| Passenger lateness | Lognormal, mean 30, sd 30 min |
| Extra goods trains | Poisson, 20 per day per direction |

Why these shapes: triangular needs only 3 numbers that experts/audits give; lognormal because lateness is never
negative and has a long right tail; Poisson for random independent train arrivals.

---

## 5. Simulation method (examiners like these)

- **Run length:** 3-day warm-up (discarded, rakes start bunched) + 30 days of statistics.
- **Replications:** 30 per case, seeds 1-30 -> mean and 95% confidence interval (t, 29 df).
- **Common random numbers (CRN):** every case uses the same 30 seeds as the baseline, so each run is compared with
  its own "twin" -> paired differences, much tighter intervals.
- **Verification** (is the model built right?): rules checked after every event - no loop/siding/tippler over
  capacity, single line one way at a time, no crew over 11 h, no rake lost; AnyLogic and the test harness give the
  same answer for the same seed (seed 1: 4.70 rakes/day); 15 stress configurations passed.
- **Little's law check:** throughput = fleet / cycle -> 8 / 40.3 h x 24 = 4.77 rakes/day. Matches.
- **Validation** (is it the right model?):

| Measure | Real world | Model | |
|---|---|---|---|
| Mean cycle | 24-72 h | 40.3 h | inside |
| Ghugus detention | <= 15-16 h | 15.5 h | inside |
| Rakes/day, today's layout | 6-10 | 4.77 | below |
| Rakes/day, with 3 changes | 7-8 (Ghugus) | 7.76 | inside |

- **2x2x2 factorial:** all 8 on/off combinations of 3 changes; gives main effects and interactions.
- **Sensitivity analysis:** change one uncertain input at a time, see how much the answer moves.

---

## 6. Numbers cheat sheet

**KPIs (baseline):** 4.77 rakes/day (19,000 t/day) · mean cycle 40.3 h, P90 47.1 h · demurrage Rs 33,300/rake ·
CSTPS lowest stock 5.0 days · single line 21% busy · Tadali queue 0.03 rakes · crew expiries 0.02 per 100 trips.

**Where time goes:** terminals 32.2 h (80%) · crew waits 4.4 h · running 1.7 h · BPC 1.4 h ·
single line + merge 0.6 h.

**Experiments (each 30 paired runs vs baseline 4.77 rakes/day, 40.3 h):**

| # | Experiment | Rakes/day | Cycle |
|---|---|---|---|
| 1 | Crew booked while loading | 5.77 (+1.00) | 33.3 h |
| 2 | Third loop at Ghugus | 5.77 (+1.00) | 33.3 h |
| 3 | Rapid loading silo | 5.12 (+0.35), demurrage Rs 0 | 37.5 h |
| 4 | Line doubling (Rs 228 cr) | 4.88 (+0.11) | 39.4 h |
| 5 | 1 + 2 + 3 together | 7.76 (+2.99) | 24.7 h |
| 6 | Fleet 4 -> 20 rakes | flat at ~4.8 from 8 rakes | 40 -> 99 h |
| 7 | Dispatch alternating / batches | no change | |
| 8 | Reserved Tadali slots | no change | |
| 9 | BPC exam at expiry / 3 / 5 / 7 days early | no change in throughput; early = more exam hours (23 -> 30 h/rake/month) | |
| 10 | Tipplers, crew pool | no change | |
| 11 | Chandrapur crew lobby / extra siding | +0.37 / +0.39 | |

**Factorial effects:** crew +1.07, loop +1.06, silo +0.92; crew x loop -0.26 (both free loop space), silo pairs
well with either (+0.27, +0.25).

**Sensitivity:** most important inputs are Ghugus loops (+1.00 if 3) and Ghugus yard times (+0.73 if halved).
Lateness, extra goods trains, crew pool hardly matter. A 3rd Tadali loop *hurts* (-0.23): more empties crowd Ghugus.

**Scorecard, today -> all three changes:** 4.77 -> 7.76 rakes/day (+63%) · 19,000 -> 31,000 t/day ·
40.3 -> 24.7 h (-39%) · P90 47.1 -> 28.6 h · demurrage Rs 33,300 -> 0 · stock low 5.0 -> 10.4 days.

---

## 7. Why each result happens (the logic to explain)

- **Crew booked while loading:** today the crew is called only when the rake is ready and needs ~2 h to arrive.
  Meanwhile the loaded rake occupies one of only two Ghugus loops, so the next empty must wait at Chandrapur.
  Calling the crew earlier frees the loop sooner -> +1 rake/day, free of cost.
- **Third Ghugus loop:** empties wait at Chandrapur 7.5 h for a Ghugus loop; a third loop cuts that to 1.7 h.
- **Silo:** loading drops 6 h -> 1.5 h and demurrage disappears, but the gain is small alone because the saved time
  turns into waiting for a Ghugus loop (bottleneck moves). Best combined with 1 or 2.
- **Doubling:** the single line is only 21% busy, so removing conflicts saves < 1 h per trip.
- **More rakes:** the loops are already full; extra rakes just queue (Little's law: throughput fixed, cycle grows).

---

## 8. Likely questions and answers

**Why is your baseline (4.77) below the real 6-10 rakes/day?**
The Ghugus loop count (2) and yard times are assumptions from audit averages. With 3 loops and faster handling the
model gives 7.76, matching the 7-8 Ghugus reports. So reality probably already has more capacity than we assumed;
those are the first numbers to get from the railway.

**You didn't get railway data - how can you trust it?**
Every input is cited; rules are exact; the timetable is real. We verified the logic every event, checked Little's
law, and the outputs fall inside published ranges. Conclusions are comparisons on the same random numbers, which are
robust even if absolute levels shift. Sensitivity shows which assumptions matter.

**Why triangular distributions?** No records; triangular needs only min / likely / max, which norms and audits give.
When data arrives, fit real distributions using the ready templates.

**Why 30 replications and a 3-day warm-up?** 30 gives confidence intervals of about +-0.06 rakes/day, small enough to
separate every effect we report. Rakes start bunched at Chandrapur; 3 days (several cycles) clears that.

**What are common random numbers?** Same random seeds for baseline and change, so differences come from the change,
not luck. We report paired confidence intervals.

**Why does doubling barely help? Isn't the single line the problem?** The model shows the line is 21% busy and
causes ~0.4 h waiting per trip. Doubling is still useful for future traffic growth (+4.5 MTPA), which our closed
loop does not include.

**Why 2 main-line tracks, not 3?** The model uses one track per direction. A third track would at most remove the
0.13 h Tadali wait, so results would not change.

**Doesn't calling the crew early waste duty hours?** The duty clock starts at sign-on, so an early crew uses duty
while waiting. We checked: crew expiries stay at zero.

**Why are empties held at Chandrapur?** Absolute-block practice: a train is sent only when the receiving end has
room. Without the rule rakes jam the Ghugus side; turning it off lowers throughput by 0.21.

**Why does every rake pay loading demurrage?** Published loading time is 4-9 h but free time is only 3 h. The silo
fixes this.

**What are the limitations?** Assumed Ghugus layout and yard times; assumed dispatcher rule A-27; closed circuit only
(no other traffic on a doubled line); no field data yet.

---

## 9. What we learned

- The obvious bottleneck (single line) was not the real one; measuring the cycle stage by stage found it.
- Operational changes (crew timing) can beat large capital projects.
- Bottlenecks move: fixing loading alone shifts the queue to the loops; combinations matter (factorial).
- Adding resources that are not the bottleneck (rakes, tipplers, crews) changes nothing - Little's law in practice.
- Good simulation practice: phased build, verification every event, CRN, paired CIs, sensitivity on assumptions.

---

## 10. Suggested slide flow (22 slides, ~15 min)

1 Title -> 2 Executive summary -> 3 What we did -> 4 Context -> 5 The rake cycle -> 6 Objective & KPIs ->
7 Model features -> 8 Parameters -> 9 Data sources -> 10 Distributions -> 11 Build phases -> 12 V&V ->
13 Baseline breakdown -> 14 Experiment plan -> 15 Key experiments -> 16 Factorial -> 17 Fleet size ->
18 Proposal scenarios -> 19 Sensitivity -> 20 Scorecard -> 21 Recommendations -> 22 Close.

If short on time, skip 8, 11, 17 and 19 and keep them for questions.

---

## 11. Live demo in AnyLogic (practise this once before the presentation)

**Before you present:** open `model/RakeFlow/RakeFlow.alp` in AnyLogic 8.9.9 and run **KeyExperiments** once so you
know it works and how long it takes (270 runs, no animation).

**Demo A - the animated model (2 min)**
1. Projects tree -> RakeFlow -> **Simulation**. In its Properties -> Parameters set `scenario = 19` (baseline).
2. Press Run. Show the rakes moving: Ghugus loops and sidings on the left, the single line, Tadali, the main line
   with passenger trains (blue) and goods trains (grey), CSTPS tipplers at the bottom. The header line names the
   scenario; the KPI panel shows rakes/day, cycle time, demurrage live. Speed it up with the speed slider.
3. Stop, set `scenario = 24` (all three changes), run again: rakes/day climbs towards ~7.8 instead of ~4.8.

**Demo B - the experiment that produced the slide numbers**
1. Projects tree -> **KeyExperiments** -> Run. It runs scenarios 19-27 with seeds 1-30 each.
2. The table shows, per scenario, mean +- 95% CI of rakes/day, cycle, P90 cycle, utilisations, demurrage, crew
   expiries, exam hours. It is also saved as `RakeFlow_key_experiments_summary.txt`.
3. Rakes/day you should see (same seeds as the slides, so the numbers match):

| Scenario | Case | Rakes/day | Cycle h |
|---|---|---|---|
| 19 | Baseline | 4.77 | 40.3 |
| 20 | Exp 1 crew booked during loading | 5.77 | 33.3 |
| 21 | Exp 2 third Ghugus loop | 5.77 | 33.3 |
| 22 | Exp 3 rapid loading silo | 5.12 | 37.5 |
| 23 | Exp 4 line doubling | 4.88 | 39.4 |
| 24 | All three | 7.76 | 24.7 |
| 25 / 26 / 27 | crew + loop / crew + silo / loop + silo | 6.37 / 6.76 / 6.74 | 30.1 / 28.4 / 28.4 |

Other ready experiments: **Replications30** (baseline, 30 seeds), **E1_FleetSize** (4-20 rakes), **E2toE7_Scenarios**
(scenarios 0-18: proposal what-ifs, levers).

**If asked "did you run this in AnyLogic?"** Yes - the logic lives in the AnyLogic model. For the many hundreds of
runs we also ran the identical Java code from a script (the test harness) to check every rule after every event; the
same seed gives the same result in both, which is itself a verification step.
