# RakeFlow — slide content (10 slides, 13 minutes)

**Instructions for the slide generator**
- Build a **10-slide, 16:9** deck using the **"Voxel Rail" design system** (`01_DESIGN_SYSTEM.md`).
- Use the **on-slide text exactly as written** (it is already short); put the **speaker notes** into each slide's
  notes.
- Build charts as **editable charts** using the exact numbers given.
- Keep every slide to **one message**: the title is that message.
- Footer on content slides: "RakeFlow · IE305 Simulation Lab" (left) and slide number (right).

**Talk plan (13 min)**

| Slide | Topic | Time |
|---|---|---|
| 1 | Title + the question | 0:45 |
| 2 | The problem | 1:00 |
| 3 | How the coal circuit works | 1:30 |
| 4 | Data, assumptions and distributions | 1:30 |
| 5 | The simulation model and method | 1:30 |
| 6 | Baseline: where the 40 hours go | 1:30 |
| 7 | Why Ghugus is the bottleneck | 1:00 |
| 8 | Experiments: one change at a time | 1:45 |
| 9 | Combined 2×2×2 result | 1:30 |
| 10 | Conclusions, limits, next steps | 1:00 |
| | **Total** | **13:00** |

*(Optional 1–2 min live demo of the AnyLogic model or the simulator page after slide 6 or at the end, if time
allows. If you add it, shorten slides 4 and 5.)*

---

## Slide 1 — Title

**Layout:** L1 Title (dark)
**Section tag:** `IE305 · SIMULATION LAB`

**Title:** RakeFlow: Where do a coal rake's 40 hours go?

**Subtitle:** Discrete-event simulation of the Ghugus → Tadali → Chandrapur coal circuit, built in AnyLogic

**Stat chips (gold, three in a row):**
- `4.77 → 7.76 rakes/day`
- `40.3 → 24.7 h cycle`
- `₹33,300 → ₹0 demurrage`

**Small line:** Team RakeFlow · IEOR, IIT Bombay

**Visual:** voxel route strip across the bottom: coal sidings → single line → Tadali → main line → power station
with chimneys; a loaded black rake on the single line.

**Speaker notes:**
> "Our project is RakeFlow. We study the coal trains that shuttle between the Ghugus coal sidings and Chandrapur
> Super Thermal Power Station. A loaded train runs only about 27 km and is moving for under an hour, yet a full
> round trip takes about 40 hours. We built a simulation to find where those 40 hours go, and which change gets
> more coal to the plant. The three numbers here are our headline, and I'll show how we got them."

---

## Slide 2 — The problem

**Layout:** L2 Problem / hero stat
**Section tag:** `01 · THE PROBLEM`

**Title:** The trip is short, but the round trip takes 40 hours

**Left column (3 short statements, each with a pixel icon):**
- 🏭 **Power station short of coal:** CSTPS (2,920 MW) holds 6–17 days of coal; the norm is 20–26 days.
- 🚂 **Busy railway:** the shared main line runs at 145–163% of capacity.
- 🛤️ **Big investment planned:** ₹228 crore sanctioned (July 2026) to double the 14 km Ghugus–Tadali single line.

**Right column (hero contrast block):**
- Big number (grass): **~1.7 h** — *time actually moving*
- vs.
- Big number (redstone): **40.3 h** — *full round trip*

**Bottom question block (diamond outline):**
**Our question:** Which constraints really limit coal delivery, and is new track the best fix?

**Speaker notes:**
> "Why does this matter? The power station keeps much less coal than the norm, so every extra rake per day helps.
> The railway's answer so far is a ₹228 crore project to double the single line. The natural assumption is that
> the single track is the problem. We didn't want to assume that. Running takes about 1.7 hours of a 40-hour cycle,
> so the real question is where the other 38 hours go, and whether track or operations is the better fix."

---

## Slide 3 — How the coal circuit works

**Layout:** L3 System diagram
**Section tag:** `02 · THE SYSTEM`

**Title:** Eight rakes circulate in one closed loop

**Top (full-width voxel route map), labelled:**
- Ghugus — WCL coal sidings: **2 loading sidings, 2 loops**
- Ghugus–Tadali: **14.11 km single line**, one train at a time
- Tadali junction: **2 loops**, merge onto main line between **115 timetabled passenger trains**
- Main line ~13 km: **DN ↓ / UP ↑** tracks
- CSTPS: **4 working tipplers** (5 installed)
- Side blocks: **Balharshah crew lobby**, **Balharshah BPC depot**

**Middle (process strip, 8 small blocks with icons):**
Load at Ghugus → Wait for crew → Single line → Tadali merge → Unload at CSTPS → Empty held at Chandrapur →
Run back → BPC exam (when due)

**Bottom (three "clock" cards):**
| ⏱ Crew duty | 🛡 Brake certificate (BPC) | ₹ Demurrage |
|---|---|---|
| 9 h, 11 h with notice; then relief | Every 6,000 km / 30 days; 8 h exam, daylight only | 3 h free to load, 7 h to unload; then ₹150/wagon/hour |

**Caption:** Each rake = 58 wagons ≈ 3,990 t of coal.

**Speaker notes:**
> "Here is the system. Eight rakes — each 58 wagons, about 4,000 tonnes — go round this loop. At Ghugus a rake is
> placed on one of two sidings, loaded, and waits in one of two loops. A crew comes from Balharshah. The rake
> crosses the 14 km single line, which only one train can use at a time, waits at Tadali for a gap between 115
> passenger trains, and runs to the power station. There it's tippled, released and sent back empty. Three clocks
> run on every rake: crew duty hours, the brake-certificate exam, and demurrage, the charge for holding wagons past
> the free time. A loop is a waiting track; a siding is where loading happens. That difference becomes important."

---

## Slide 4 — Data, assumptions and distributions

**Layout:** L4 Two/three-column cards
**Section tag:** `03 · DATA & INPUTS`

**Title:** Every input is either a published fact or a labelled assumption

**Card 1 — Published data (diamond, book icon):**
- erail.in timetable: **115 trains** (≈ 40.7 passings/day)
- Railway Board rules: crew duty, free time, demurrage
- IRIMEE / JPO: brake exam rules
- CAG audits: yard and crew delay ranges
- CEA reports: plant coal stock and receipts
- Gazette: 14.11 km line, ₹228 cr doubling

**Card 2 — Assumptions (gravel, "ASSUMPTION" chips):**
- **A-01** 2 loops at Ghugus
- **A-06** crew booked at Balharshah
- **A-27** empties held at Chandrapur until loops are free
- **A-29** baseline crew ordered when the rake is ready
- *No railway field logs were received; every assumption is a model parameter.*

**Card 3 — No record? Use a distribution (gold header):**

| Activity | Distribution |
|---|---|
| Loading (pay-loader) | Tri(4, 6, 9) h |
| Loading (silo) | Tri(1, 1.5, 3) h |
| Unloading (tippler) | Tri(2, 4, 7) h |
| Ghugus yard: placement / release | Tri(0.5, 1, 4) / Tri(0.8, 1.5, 6) h |
| CSTPS yard: placement / release | Tri(0.6, 2, 8) / Tri(1.5, 3, 8) h |
| Crew sign-on + travel | Tri(0.5, 0.75, 2) + Tri(1, 1.5, 2.5) h |
| Passenger lateness | Lognormal, mean 30, sd 30 min |
| Extra goods trains | Poisson, 20/day each way |

**Small visual:** a pixel triangular distribution (min · most likely · max) next to the table.

**Speaker notes:**
> "Our inputs come in two kinds. Published facts — the real timetable of 115 trains, Railway Board rules, audit
> reports and the plant's coal reports. And assumptions, which we label clearly, because we didn't receive the
> railway's own rake records. The most important ones are two loops at Ghugus, crews booked at Balharshah, and the
> rule that empties wait at Chandrapur until there's room ahead. Where there's no record, we use a triangular
> distribution from a minimum, most likely and maximum value; lateness is lognormal because it's never negative and
> has a long tail. So our results are conditional on these inputs, and we test the important ones."

---

## Slide 5 — The simulation model and method

**Layout:** L4 cards (three)
**Section tag:** `04 · THE MODEL`

**Title:** A discrete-event model in AnyLogic, built in three phases and checked at every event

**Card 1 — How it works (diamond):**
- **AnyLogic 8.9.9** + a custom **Java event kernel**
- The clock jumps from event to event (loading done, crew arrives, line free …)
- A **controller** allocates sidings, loops, line, crews, tipplers, exam line
- **No deadlock:** a rake enters the single line only if a loop is free at the far end

**Card 2 — Built in 3 phases (small vertical bar chart):**

| Phase | Rakes/day |
|---|---|
| 1 Core cycle | 5.75 |
| 2 + Crew duty rules | 4.81 |
| 3 + Brake exams (full model) | 4.77 |

Caption: *Adding crews costs almost one rake/day — the first clue.*

**Card 3 — Method & checks (grass):**
- 3-day warm-up + **30 days** measured
- **30 replications** per case, seeds 1–30
- **Same seeds for every scenario** (common random numbers) → paired 95% CIs
- Rules checked **after every event**: no over-capacity, single line one way, crew ≤ 11 h, no rake lost
- Little's law check: 8 rakes ÷ 40.3 h × 24 = **4.77/day** ✓

**Speaker notes:**
> "The model is a discrete-event simulation in AnyLogic, with the logic in a Java event kernel. The clock jumps
> from one event to the next, and a controller decides what can move: which rake gets a siding, a loop, the line,
> a crew or a tippler. A rake may only enter the single line if a loop is free at the other end; otherwise trains
> would deadlock. We built it in three phases. Adding crew rules dropped throughput by almost one rake a day — our
> first clue. Every case runs 30 times for 30 days after a warm-up, and every scenario uses the same random seeds as
> the baseline, so comparisons are like-for-like. The rules are checked after every single event, and the output
> satisfies Little's law."

---

## Slide 6 — Baseline: where the 40 hours go

**Layout:** L5 Chart + insight
**Section tag:** `05 · BASELINE`

**Title:** 80% of the cycle is spent at the terminals, not on the track

**Chart (horizontal bars, mean hours per cycle; terminal bars in `redstone`/`gold`, others `rail`):**

| Stage group | Hours |
|---|---|
| Ghugus terminal (placement, siding wait, loading, release) | 12.7 |
| CSTPS terminal (placement, unloading, release) | 12.0 |
| Empties held at Chandrapur | 7.5 |
| Crew waits (loaded 2.8 + empty 1.7) | 4.4 |
| Running | 1.7 |
| Brake exam detour | 1.4 |
| Single-line waits | 0.4 |
| Tadali merge | 0.1 |
| **Total** | **40.3** |

**Right: baseline scorecard (stat blocks):**
- **4.77** rakes/day (≈ 19,000 t/day)
- **40.3 h** mean cycle · P90 47.1 h
- **₹33,300** demurrage per rake
- **21%** single line busy
- **0.13 h** wait at Tadali merge

**Speaker notes:**
> "This is the baseline — today's assumed operation — averaged over 30 runs. 4.77 rakes a day, a 40-hour cycle,
> about ₹33,000 demurrage per rake. The chart splits the 40 hours: almost 13 at Ghugus, 12 at the power station,
> 7.5 hours of empties waiting at Chandrapur, and over 4 hours waiting for crews. The single line and the Tadali
> merge — what we expected to be the problem — together cost about half an hour. The line is busy only 21% of the
> time. So the delay is in the terminals, not on the track."

---

## Slide 7 — Why Ghugus is the bottleneck

**Layout:** L6 Causal chain
**Section tag:** `06 · DIAGNOSIS`

**Title:** Loaded rakes block Ghugus loops, so empties wait at Chandrapur

**Left: domino chain (5 blocks, top to bottom, pixel arrows):**
1. Crew is called only when the loaded rake is ready (≈ 2 h travel)
2. Loaded rake keeps one of only **2 Ghugus loops** while it waits
3. Ghugus has no room for the next empty rake
4. Controller holds the empty at Chandrapur (**7.5 h**)
5. 🟥 Longer cycle → fewer deliveries per day

**Right: evidence stat blocks:**
- **21%** single line busy → track is not the limit
- **0.13 h** Tadali merge wait
- **7.5 h** empties held at Chandrapur
- **2.8 h** loaded rake waits for its crew

**Note under evidence:** *Proof comes from experiments: change one thing, measure the effect (next slide).*

**Speaker notes:**
> "Why does this happen? Follow the chain. The crew is called only once the loaded rake is ready, and needs about
> two hours to arrive. Meanwhile that rake keeps one of only two loops at Ghugus. With both loops taken, Ghugus can't
> receive the next empty, so the controller keeps that empty at Chandrapur — 7.5 hours per cycle. A track can be
> completely free and the empty still can't come back. The real bottleneck is loop space at Ghugus, made worse by
> crew timing. But utilisation alone doesn't prove it — the experiments do."

---

## Slide 8 — Experiments: one change at a time

**Layout:** L5 Chart + insight
**Section tag:** `07 · EXPERIMENTS`

**Title:** Crew timing and one more loop each add a full rake per day; doubling adds 0.11

**Chart (vertical bars, rakes/day, 30 paired replications; baseline `rail`, A and B `grass`, C `diamond`, D `redstone`):**

| Case | Rakes/day | Δ vs baseline (95% CI) | Mean cycle |
|---|---|---|---|
| Baseline | 4.77 | — | 40.3 h |
| A · Crew booked while loading | 5.77 | +1.00 ± 0.06 | 33.3 h |
| B · Third loop at Ghugus | 5.77 | +1.00 ± 0.09 | 33.3 h |
| C · Rapid loading silo | 5.12 | +0.35 ± 0.07 | 37.5 h |
| D · Double the single line (₹228 cr) | 4.88 | +0.11 ± 0.06 | 39.4 h |

**Right: "why" cards (one line each):**
- **A:** crew arrives as the rake is ready → loop freed sooner (crew wait 4.4 → 1.8 h)
- **B:** more room → empties held at Chandrapur 7.5 → 1.7 h
- **C:** loading 6 h → 1.5 h, demurrage → ₹0, but empties now wait longer (bottleneck moves)
- **D:** line use 21% → 11%; the line wasn't the constraint

**Mini panel (small line chart) — "More rakes don't help":**

| Rakes | 4 | 6 | 8 | 10 | 12 | 16 | 20 |
|---|---|---|---|---|---|---|---|
| Rakes/day | 3.07 | 4.30 | 4.77 | 4.83 | 4.80 | 4.86 | 4.84 |
| Cycle h | 31.2 | 33.4 | 40.3 | 49.6 | 59.9 | 79.0 | 98.9 |

**Also tested, no real effect (small grey text):** alternating/batched dispatch, reserved Tadali slots, brake exam
3/5/7 days early, more tipplers, bigger crew pool.

**Speaker notes:**
> "Now we test changes one at a time, each against the same 30 random seeds. A: book the crew while the rake is
> still loading, timed to arrive as it's ready — plus one rake a day, seven hours off the cycle. B: add a third
> loop at Ghugus — the same gain, by adding space instead of freeing it sooner. C: a rapid loading silo cuts
> loading from six hours to one and a half and removes demurrage, but alone gains only a third of a rake, because
> the queue moves to the loops. D: the ₹228 crore doubling halves line use but adds only 0.11, because the line
> wasn't the constraint. And adding rakes just makes the cycle longer — throughput flattens at about 4.8. Dispatch
> rules, reserved slots, exam timing, tipplers and crew numbers made no real difference."

---

## Slide 9 — Combined 2×2×2 result

**Layout:** L7 Matrix + scorecard
**Section tag:** `08 · COMBINED`

**Title:** Together, three Ghugus changes deliver 63% more coal

**Left: bar chart of all 8 combinations (rakes/day; "All three" in `gold`):**

| Combination | Rakes/day | Cycle |
|---|---|---|
| None (baseline) | 4.77 | 40.3 h |
| Silo | 5.12 | 37.5 h |
| Crew | 5.77 | 33.3 h |
| Loop | 5.77 | 33.3 h |
| Crew + Loop | 6.37 | 30.1 h |
| Loop + Silo | 6.74 | 28.4 h |
| Crew + Silo | 6.76 | 28.4 h |
| **All three** | **7.76** | **24.7 h** |

**Small effects strip under the chart:** Main effects: Crew **+1.07** · Loop **+1.06** · Silo **+0.92** ·
Interactions: Crew×Loop **−0.26** (overlap) · Crew×Silo **+0.27** · Loop×Silo **+0.25**

**Right: before → after scorecard (two columns, arrows):**

| KPI | Today | All three | Change |
|---|---|---|---|
| Rakes/day | 4.77 | **7.76** | **+63%** |
| Coal delivered | 19,000 t/day | **31,000 t/day** | +12,000 t |
| Mean cycle | 40.3 h | **24.7 h** | **−39%** |
| P90 cycle | 47.1 h | **28.6 h** | −39% |
| Demurrage / rake | ₹33,300 | **₹0** | −100% |
| Lowest coal stock | 5.0 days | **10.4 days** | ×2 |
| *Doubling alone* | | *4.88/day* | *+2%* |

**Callout (gold block):** Not simply additive: adding single gains predicts 7.12; the simulation gives **7.76**.

**Speaker notes:**
> "Because changes can interact, we ran all eight combinations of crew timing, the third loop and the silo. Each one
> helps; crew and loop overlap slightly because both free loop space, while the silo works much better once loop
> space is fixed. All three together give 7.76 rakes a day — 63% more coal, about 12,000 extra tonnes a day — with
> the cycle down 39% to under 25 hours, no demurrage, and the plant's lowest stock doubled. That's more than adding
> the single gains would predict, and far more than doubling the line, which gives 2%."

---

## Slide 10 — Conclusions, limits and next steps

**Layout:** L8 Closing (dark)
**Section tag:** `09 · CONCLUSION`

**Title:** Fix the terminals before the track

**Three numbered recommendation blocks (cheapest first):**
1. **Book crews while the rake is loading** — operating change, +1.0 rake/day
2. **Add a third loop at Ghugus** — small yard work, +1.0 rake/day
3. **Add a rapid loading silo** — ends demurrage; all three: **+3.0 rakes/day**

**Strip — what our results do *not* claim (gravel chips):**
- Ghugus loops, yard times and crew-booking practice are **assumptions**, not field-verified
- Crew experiment uses the model's known loading times — a real controller must **forecast** them, so +1.0 is a best case
- Doubling is judged **only for this coal circuit**, not for network-wide growth

**Next steps (one line):** Get railway records → calibrate the model → pilot crew timing → then evaluate loop and
silo costs.

**Closing line (large):** Thank you · Questions?

**Speaker notes:**
> "Our conclusion: fix the terminals before the track. In order of cost — book crews while the rake is loading,
> add a loop at Ghugus, then consider a rapid loading silo. Together they add about three rakes a day. We're careful
> about what this does not prove. The Ghugus layout, yard times and today's crew practice are assumptions; our
> crew experiment knows the loading time in advance, so in practice the gain would be somewhat smaller; and the
> doubling is judged only for this coal circuit, not for future network traffic. The next step is to get the
> railway's records, calibrate the model, and pilot the crew change. Thank you — happy to take questions."

---

## Backup: likely judge questions (not slides — keep for Q&A)

| Question | Short answer |
|---|---|
| Why is your baseline (4.77) below the reported 6–10 rakes/day? | Ghugus layout and yard times are conservative assumptions; the plant also receives coal from other sources. It shows the model needs field calibration. |
| How can 4.77 rakes/day arrive if one trip takes 40 h? | Eight rakes run at once: 8 × 24 ÷ 40.3 ≈ 4.77 (Little's law). |
| Did you observe late crew booking? | No — it's our baseline assumption (A-29). If crews are already booked early, that gain is already captured. |
| Why triangular distributions? | No records; min / most likely / max from norms and audits is transparent and easy to replace with fitted data. |
| Why does a third Tadali loop reduce throughput? | It lets more empties move towards Ghugus, which is still full, so they crowd it (−0.23). |
| Why does the silo help little alone? | Saved loading time turns into waiting for a Ghugus loop — the bottleneck moves. |
| Why 30 replications and common random numbers? | Gives tight paired CIs (±0.06 rakes/day) so small effects are distinguishable. |
| Is the ₹228 cr doubling a waste? | We can't say: we model only this circuit, not future traffic growth. For today's coal circuit it adds 0.11 rakes/day. |
| Did you run it in AnyLogic? | Yes — the model and all experiments are in the AnyLogic file (KeyExperiments reproduces these numbers). |
