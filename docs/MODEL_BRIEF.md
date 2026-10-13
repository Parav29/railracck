# RakeFlow - Model Brief for Claude Code

Discrete-event simulation of the closed-circuit coal rake cycle
**Ghugus (GGS) -> Tadali (TAE) -> Chandrapur TPS (CSTPS) -> back**, Central Railway, Nagpur Division.
IE305 Simulation Lab, IEOR, IIT Bombay. Team RakeFlow. Brief date: 14 Oct 2026.

This file is the single hand-off document. Everything the model needs is either stated here
with its source, or marked ASSUMPTION. Supporting files live in this project folder:

```
data/RakeFlow_Parameter_Sheet.xlsx        all parameters (sheet Parameters), hourly passenger profile, data gaps
research/timetable_tadali_chandrapur.csv  115 passenger trains with times at Chandrapur (CD) and Tadali (TAE)
research/*.md                             full citations behind every number below
data/templates/*.csv                      field-data templates (empty except example row)
```

---

## 0. One-paragraph problem statement

Loaded coal rakes from WCL sidings at Ghugus must traverse a 14.11 km **single line** to Tadali,
merge onto the heavily used Wardha-Balharshah double/triple line between passenger trains, run
~13 km south to Chandrapur, unload at CSTPS, and return empty over the same single line.
Three clocks run against each rake: the **crew duty clock** (9 h, max 11 h), the **Brake Power
Certificate clock** (6,000 km / 30 days, 8 h daylight examination), and the **demurrage clock**
(free time 3 h loading / 7 h unloading, Rs 150 per wagon per hour). The question: where does
a rake lose time in its cycle, and which operational levers (path allocation at Tadali, crew
booking, fleet size, loading method, line doubling) reduce mean cycle time and raise rakes
delivered per day.

---

## 1. HARD DATA - primary / official sources, use as given

### 1.1 Infrastructure

| ID | Quantity | Value | Source |
|---|---|---|---|
| INF-01 | Ghugus-Tadali line length | **14.11 km** | Gazette of India notification, Ministry of Railways, 4 Jun 2026, declaring the Tadali-Ghugus doubling a Special Railway Project. https://egazette.gov.in/WriteReadData/2026/273346.pdf |
| INF-02 | Track configuration today | **Single line**, electrified, goods-only; Ghugus listed "closed for passengers" | RailPost 17 Jul 2026 https://www.railpost.in/ir-approves-14-km-tadali-ghugus-section-doubling-at-a-cost-of-228-crore/ ; Nagpur CR division station list https://en.wikipedia.org/wiki/Nagpur_CR_railway_division ; CR 100% electrified Feb 2023 |
| INF-03 | Intermediate block stations on spur | **None listed** in any CR Nagpur division station list -> model as ONE block section | same as INF-02 (Medium confidence: absence in lists, not an explicit statement) |
| INF-04 | Doubling project | **Rs 228 crore, 14 km, +4.5 MTPA**, sanctioned ~16 Jul 2026 | RailPost (above); Drishti IAS state PCS note; Kashmir Despatch. 4.5 MTPA / 3,990 t / 365 d = **~3.1 extra loaded rakes/day** |
| INF-05 | Wardha-Balharshah main line | Part of Delhi-Chennai HDN; line capacity utilisation **145% UP / 163% DN** (2023); 3rd line 132.34 km 67% complete Mar 2025 (Tadali-Ballarshah section already opened); 4th line Rs 2,318 cr sanctioned May 2025, target 2029-30 | The Hitavada 2023; CR "List of Projects Progress upto Mar 2025" https://cr.indianrailways.gov.in/cris//uploads/files/1742449942265-List_of%20Projects_%20Progress_%20upto_Mar2025.pdf |
| INF-06 | Station codes | Ghugus **GGS**, Tadali **TAE**, Chandrapur **CD**, Balharshah **BPQ**, Wardha **WR** | https://erail.in/stations/GGS |
| INF-07 | Sidings at Ghugus | GSG "Ghugus Colliery Siding" (4 km from GGS), CESG "ACC cement siding" (2 km); WCL also refers to "Ghugus Old Siding" | erail GGS page; WCL Marketing notice https://docs.westerncoal.in (rake seniority list, Ghugus Old Siding) |
| INF-08 | Tadali-Chandrapur distance | **~13 km** | Wikipedia Tadali / Chandrapur station pages (Medium) |

### 1.2 Passenger traffic on the main line (the blocking schedule for the Tadali merge)

Source: erail.in, trains between Chandrapur (CD) and Balharshah (BPQ) in both directions,
scraped 13 Oct 2026, stored in `research/timetable_tadali_chandrapur.csv`
(columns: train_no, train_name, type, direction, cd_arr, cd_dep, tae_arr, tae_dep, days, days_bits_MTWTFSS, origin, dest, source_url).

| Quantity | Value |
|---|---|
| Scheduled passenger trains | **115** (58 DN southbound toward BPQ, 57 UP northbound toward WR) |
| Weighted by days of run | **40.7 passings/day** (20.9 DN, 19.9 UP); only 15 DN + 14 UP run daily |
| Trains that stop at Tadali | only **61127** WR-BPQ MEMU (TAE 09:27 -> CD 09:52) and **61128** BPQ-WR MEMU (CD 18:53 -> TAE 19:12) |
| DN (southbound, the line loaded rakes merge onto) quiet window | **no daily train 19:35 -> 09:38**; also 10:00-10:55, 14:16-15:04, 15:09-16:04 |
| DN busiest window | **12:58-13:41**: 5 daily trains in 43 min |
| UP (northbound, empties) quiet windows | 19:00-22:00, 23:35-03:20, 13:58-15:24, 15:28-17:29 |

Hour-of-day expected passings (DN / UP), from sheet `Hourly_Profile` of the parameter workbook:

```
hour  DN    UP     hour  DN    UP     hour  DN    UP     hour  DN    UP
 00  0.43  1.00     06  1.14  1.57     12  1.57  1.29     18  1.29  2.00
 01  0.43  0.00     07  1.29  0.71     13  4.14  1.14     19  1.71  0.00
 02  0.14  0.00     08  1.00  1.71     14  1.00  0.00     20  0.29  0.00
 03  0.00  1.00     09  2.00  0.71     15  1.00  1.00     21  0.43  0.00
 04  0.14  0.43     10  0.14  1.00     16  0.86  0.14     22  0.00  1.71
 05  0.00  1.43     11  1.00  1.00     17  0.71  1.29     23  0.14  0.71
```

Lateness (digital-twin refresh input, partial so far): etrain.info station-wise history
(`https://etrain.info/train/<slug>-<no>/history`, tabs for last week / month / 3 months).
Samples this month: 12723 at CD **26 min**, 12724 at CD **86 min**, 61127 at TAE 32 min / CD 35 min.
Full 90-day collection is pending (template `data/templates/TT_lateness.csv`).

### 1.3 Railway Board rules - implement as hard constraints

| ID | Rule | Value | Source |
|---|---|---|---|
| CR-01 | Running duty at a stretch | **<= 9 h** | RBE 143/2016, Railway Board letter E(LL)/2016/HPC/1 dated 28.11.2016 https://www.airfindia.org/2016/12/04/recommendations-of-the-high-power-committeehpc-to-review-the-duty-hours-of-running-staff-decisions-thereof-rbe-1432016/ |
| CR-02 | Extension | only with **>= 2 h notice** before the 9 h expire; total sign-on to sign-off **<= 11 h**; absolute cap **12 h** under severe exigency | RBE 143/2016; Railway Board consolidated guidelines Oct 2023 |
| CR-03 | Outstation rest | **6 h** after 5-8 h duty; **8 h** after >= 8 h duty | Railway Board circular to CRIS dated 03.06.2025 |
| CR-04 | HQ rest | **12 h** after < 8 h duty; **16 h** after >= 8 h | IREM Rule 1511 https://indianrailways.gov.in/railwayboard/uploads/directorate/establishment/estbl-chap15-p01-p16.htm |
| CR-05 | Sign-on lead | crew signs on **10-45 min** before ordering time; 68% of sign-on approvals take > 30 min | CAG Report 47 of 2015 (Crew Management) para 2.1.12-2.1.13 https://cag.gov.in/webroot/uploads/download_audit_report/2015/Union_Performance_Railways_Crew_mgmt_Report_47_2015.pdf |
| BPC-01 | Closed-circuit rake BPC validity | **6,000 km or 30 days** (A-category depot); 7,500 km / 35 days (Special A); **+5 days grace** when moving toward base depot | Railway Board JPO on freight train examination, reproduced in IRIMEE notes https://rskr.irimee.in/sites/default/files/Pattern%20of%20freight%20train%20examination.pdf |
| BPC-02 | Intensive CC examination | **100 man-hours or 8 h**, gang of 2 examiners + 12 staff + welder | https://rskr.irimee.in/sites/default/files/Freight%20Train%20examination.pdf |
| BPC-03 | Examination window | **daylight only** (morning to sunset) unless yard lit to 100-150 lux -> use 06:00-18:00 | same JPO |
| BPC-04 | Compliance reality | **37-39%** of CC rakes overran km validity by 500-996 km (2011-13) | CAG Report 31 of 2014 para 3.2.2(f) https://cag.gov.in/uploads/download_audit_report/2014/Union_Performance_Railways_Management_Goods_trains_31_2014_chapter_7.pdf |
| FT-01 | Free time, loading coal rake | **3 h** at sidings loading >= 2 coal rakes/day from a single line (was 5 h) | Railway Board letter TC-I/2019/201/6-Part(2)(3328629) dated 22.01.2024; zonal restore power 12.04.2024 https://indianrailways.gov.in/railwayboard/uploads/directorate/traffic_comm/Rates-Letters/2024/free%20time%20for%20loading%20and%20unloading%20of%20rakes%20of%20Coal%20and%20Iron%20Ore%20-Power%20to%20Zone%20dated%2012_04_2024.pdf |
| FT-02 | Free time, unloading BOXN (mechanised/tippler) | **7 h** (hopper BOBRN 2.5 h; manual 9 h) | Rates Master Circular/Demurrage-Wharfage-Waiver/2016/0 dated 19.05.2016, via CR ARN 136/2024 https://cr.indianrailways.gov.in/cris/uploads/files/1731569594339-ARN%20No%20136%20of%202024%20Goods.pdf and Konkan Railway table https://konkanrailway.com/node/5508 |
| FT-03 | Free time reckoned from | **time of placement** of the rake | RB letter TC-V/2024/201/efile/3 dated 13.05.2024 |
| DM-01 | Demurrage | **Rs 150 per wagon per hour** or part; graded: base up to 6 h over free time, +10% 6-12 h, +25% 12-24 h, +50% 24-48 h, 2x 48-72 h, 3x > 72 h | Corrigendum 32 to Rates Master Circular, letter TC-I/2022/201/efile/2 dated 13.09.2022, effective 01.10.2022 https://sr.indianrailways.gov.in/cris//uploads/files/1751884201884-waier%20updated%2030062025.pdf |
| DM-02 | Wagon registration fee (indent) | Rs 50,000 per rake, FOIS e-Demand | FOIS RailSAHAY FAQ https://fois.indianrail.gov.in/RailSAHAY/pages/FAQs.jsp |

### 1.4 Demand side - CSTPS Chandrapur

Source: CEA Daily Coal Stock Reports, npp.gov.in. URL pattern
`https://npp.gov.in/public-reports/cea/daily/fuel/DD-MM-YYYY/dailyCoal1-YYYY-MM-DD.pdf`.
Nine dated reports Jul 2024 - Sep 2026 are tabulated in `research/cstps_coal_demand.md`.

| Quantity | Value |
|---|---|
| Plant | CSTPS, MAHAGENCO, **2,920 MW**, rail-fed (no MGR) |
| Normative daily requirement at 85% PLF | **47.8 kt/day** (49.5 in late 2025 reports) |
| Actual consumption observed | **18.7 - 47.8 kt/day**, median ~33 kt (PLF 50-58%) |
| Receipt of the day observed | **3.9 - 47.5 kt/day**, median ~30 kt |
| Stock | 280 - 806 kt = 6 - 17 days; normative 20-26 days |
| Non-rail supply | ~7 kt/day by 1.2 km ropeway (Durgapur mine) + pipe conveyor (Bhatadi); some road; imports present |
| Implied rail arrivals | **~6 - 10 rakes/day, peaks ~12** (receipt / 3.9 kt) |
| Dhariwal TPP, Tadali, 600 MW | requirement 7.8 kt/day, receipt 5-6 kt/day = **~2 rakes/day**, coal from **SECL** (uses main line + Tadali yard, NOT the Ghugus spur) |

### 1.5 Rake

| Quantity | Value | Source |
|---|---|---|
| Wagons per rake | **58** BOXN/BOXNHL | CR record day: 2,448 wagons / 42 rakes; standard formation |
| Payload per rake | **~3,990 t** (CR 2024-25: 536 WCL rakes = 2.14 MT); BOXN CC 58.8 t/wagon; BOXNHL 71 t | CR Highlights 2024-25 https://cr.indianrailways.gov.in/cris//uploads/files/1753868156096-Highlights%202024-25.pdf |

### 1.6 System benchmarks (use to validate model output)

| Quantity | Value | Source |
|---|---|---|
| IR average freight train speed | **23.8 km/h** (2024-25); 25.14 km/h average 2013-24 | Parliamentary Standing Committee on Railways, Dec 2024 (PRS summary) |
| CR Nagpur division wagon turnround | **1.46 days** (2024-25) vs 1.54 (2023-24) | CR Highlights 2024-25 |
| IR network wagon turnround | 5.11 days (2023-24) | IR Annual Report 2023-24 |
| Nagpur division coal loading | **~29 coal rakes/day** (910 rakes May 2024); 6,723 coal rakes Apr 2024-Jan 2025; ~37 rakes/day all commodities | CR press release via indiaseatradenews; CR Highlights to Jan 2025 |
| Railway Board target terminal detention per rake | **16 h**; CR yard detention norm **15 h** | CAG 31 of 2014 para 3.2.5-3.2.6 |
| CAG observed zonal averages 2011-13 (Table 18) | loading: arrival->placement 0.5-10 h, placement->release 5-56 h, release->despatch 0.8-21 h; unloading: arrival->placement 0.6-15 h, placement->release 9-124 h, release->despatch 1.5-11 h | CAG 31 of 2014 |
| Ballarshah interchange | ~50 trains/day, exchange lag 72 min (SCR), 207 min (SECR) | The Hitavada 4 Nov 2025 |

---

## 2. SOFT DATA - secondary sources or inferences; use but flag

| ID | Quantity | Value | Source and caveat |
|---|---|---|---|
| LD-01 | Rakes loaded per day at Ghugus | **7-8 rakes/day** (Dec 2018), plan 9-10; plus ad-hoc NRS-auction rakes via Ghugus Old Siding (41 rakes Sep 2024-Nov 2025, peak 8/month) | RailCoal Week Jan 2019 (2018 figure); WCL Marketing notice. Use tri(5, 7.5, 10) |
| LD-02 | Loading method at Ghugus | **CHP + tippers / pay-loader, no silo reported** | MoEF compliance report for Ghugus OCP, Mar 2024 (mentions "Old Railway Siding", two CHPs). Inference, not a statement. |
| LD-03 | Loading time, pay-loader/CHP | **tri(4, 6, 9) h** | RB old free time 5 h, manual 9 h; MCL pre-silo 8-10 h (BigMint) |
| LD-04 | Loading time, RLS/silo (scenario) | **tri(1, 1.5, 3) h** | CCL Karo/Konar 5 h -> 1 h (PIB 2062752); MCL Basundhara ~90 min |
| UL-01 | Tipplers at CSTPS | **5** (2 at CHP-B, L&T 1992; 3 at CHP-D, Elecon 2016) + track hoppers at CHP-B/C | MAHAGENCO tender/EOI documents |
| UL-02 | Unloading time, BOXN by rotary tippler | **tri(2, 4, 7) h** | BigMint 2-3 h rapid tippler; RB free time 7 h; IIMA 2004 mean 14 h sd 4 (older 2-tippler plant) https://iima.ac.in/sites/default/files/rnpfiles/2004-09-06gdutta.pdf |
| TR-01 | Agreed vs actual coal rake turnaround (industry) | **48-72 h agreed; 96-120 h summer actual**; ~24 h of lost time at the unloading end | BigMint industry analysis https://www.bigmint.co/insights/detail/indias-coal-supply-chain-strong-on-output-weak-on-delivery-747729 |
| CAP-01 | Single-line capacity | Scott's formula C = (1440 - 120)/(T + t) x 0.7; t = 1.5-2.5 min (JICA) to 3-6 min IR practice | research/ir_freight_stats_and_capacity.md |
| LIT-01 | Literature | IIMA WP 2004-09-06 (Dutta et al.) coal unloading simulation; Dastur WSC 2012/2013 stage means (coal unloading 828 min, TXR 50-60 min). No paper models the full Indian coal rake cycle. | research/literature.md |

---

## 3. ASSUMPTIONS - no source; expose each as a config parameter and run sensitivity

| ID | Quantity | Default | Why this default | How to replace |
|---|---|---|---|---|
| A-01 | Loops at Ghugus usable for stabling loaded/empty rakes | **2** | Two sidings branch from GGS; typical small goods station | Ask CR Sr DOM; OpenRailwayMap |
| A-02 | Freight reception loops at Tadali | **2** | Tadali has goods shed, POL siding, 2 coal sidings; Rs 26.94 cr 4th line sanctioned Jan 2025 | Ask CR |
| A-03 | Sectional speed on spur, loaded | **tri(30, 40, 50) km/h** | IR goods average 23.8 km/h includes stops; branch MPS likely 50-75 | Nagpur division Working Time Table |
| A-04 | Block occupancy, one rake, 14.11 km | **tri(25, 31, 38) min** = run time + 7-10 min line-clear overhead | derived from A-03 and Scott's t | same |
| A-05 | Minimum gap to a passenger train for a freight merge at Tadali | **tri(6, 10, 15) min** each side | absolute block headway 5-10 min plus acceleration margin for a 3,990 t train | Ask CR section controller |
| A-06 | Crew booking point | **Balharshah** (alt: Chandrapur) | Ballarshah is the division's major crew change / interchange point | Ask CR crew lobby |
| A-07 | Crew travel from lobby to Ghugus if booked at Balharshah | **tri(1, 1.5, 2.5) h** by road/light engine | ~40 km | same |
| A-08 | Sign-on to departure | **tri(0.5, 0.75, 2) h** | CAG 47/2015 sign-on and approval delays (soft-sourced) | CR_crew_events.csv |
| A-09 | Relief crew arrival when duty expires en route | **tri(1, 2.5, 6) h** | no norm; CAG: 18% of late starts for want of crew/path | same |
| A-10 | Nominated BPC base depot | **Balharshah** (alt: Ajni) | major C&W depots of the division | Ask CR Sr DME |
| A-11 | Wait at depot before exam placement | **tri(0.5, 2, 10) h** | CAG Table 18 | BPC_exam_events.csv |
| A-12 | Exam duration | **tri(6, 8, 12) h**, window 06:00-18:00 | JPO 8 h + repairs | same |
| A-13 | Arrival at Ghugus -> placement on loading line | **tri(0.5, 1, 4) h** | CAG Table 18 | LD_loading_events.csv |
| A-14 | Release -> ready to despatch at Ghugus | **tri(0.8, 1.5, 6) h** | CAG Table 18 | same |
| A-15 | Arrival CSTPS -> placement at tippler | **tri(0.6, 2, 8) h** | CAG Table 18 | UL_unloading_events.csv |
| A-16 | Release empty -> despatch from CSTPS | **tri(1.5, 3, 8) h** | CAG Table 18 | same |
| A-17 | Tipplers normally in service at CSTPS | **4 of 5** | one under maintenance typical | Ask CSTPS |
| A-18 | Closed-circuit fleet size on this circuit | **8** (vary 4-14) | CT ~24 h and 7-8 rakes/day implies 7-9 circulating | Decision variable |
| A-19 | Loading siding working hours | **24x7** | CHP sidings normally continuous | Ask WCL |
| A-20 | Share of Ghugus output going to CSTPS vs other plants | **100%** (Phase 1 simplification) | unknown split | WCL rake seniority lists |
| A-21 | Passenger train lateness | **lognormal, mean 30 min, sd 30 min** per train until 90-day data collected | 3 sampled trains 26-86 min | TT_lateness.csv |
| A-22 | Empty return path priority | empties take any UP gap; loaded rakes get priority over empties for the single line | common practice | Ask CR |

---

## 4. Model specification for Claude Code

### 4.1 Stack
Python 3.11+, **SimPy** for the DES, numpy/pandas, matplotlib for output plots. Read all
parameters from a single `config.yaml` (or `params.py`) that mirrors the IDs above, so every
assumption is one line to change. Load the passenger schedule from
`research/timetable_tadali_chandrapur.csv`. Seeded RNG; 30 replications x 30 simulated days
after a 3-day warm-up; report mean and 95% CI.

### 4.2 Entities
`Rake` (id, state loaded/empty, wagons=58, payload t, bpc_km_remaining, bpc_days_remaining,
cycle timestamps), `Crew` (duty_start, hours_used, booking_point), `PassengerTrain`
(scheduled slot at Tadali/Chandrapur + lateness draw), `Loco` (optional, Phase 2).

### 4.3 Resources
- `single_line` : SimPy Resource capacity 1, bidirectional, hold for block occupancy (A-04).
- `ghugus_loading_line` : capacity 1 (one rake loading at a time) - ASSUMPTION, make configurable.
- `ghugus_loops`, `tadali_loops` : capacity A-01, A-02; a rake cannot enter the single line unless a loop is free at the far end.
- `mainline_DN`, `mainline_UP` : represented by a time-varying "slot available" function built from the passenger schedule + lateness; a freight merge needs a gap >= A-05 on both sides.
- `tipplers` : capacity A-17.
- `crew_pool` : PreemptiveResource or custom; each crew carries its duty clock.
- `exam_line` : capacity 1, open 06:00-18:00 only.

### 4.4 Process (one rake, one cycle)
```
empty at Ghugus -> wait loading line -> placement (A-13) -> load (LD-03 or LD-04)
-> release; demurrage if placement->release > FT-01 -> ready (A-14)
-> request crew (sign-on A-08; travel A-07 if remote booking) -> request single_line
   AND a free Tadali loop -> traverse (A-04) -> wait at Tadali for mainline_DN gap (A-05)
-> run 13 km to CD (~25 min at 30 km/h) -> CSTPS: placement (A-15) -> unload (UL-02)
-> demurrage if > FT-02 -> release (A-16) -> empty: wait mainline_UP gap -> Tadali
-> wait single_line + free Ghugus loop -> traverse -> back at Ghugus. Loop.
Side branches:
 - crew clock: if hours_used would exceed 9 h before next safe point and no 2 h notice was
   given, stable train and wait A-09 for relief; never exceed 11 h.
 - BPC clock: decrement km per leg and days per calendar day; when remaining km < next
   round-trip or days <= 0 (+5 grace heading to depot), divert empty rake to exam depot
   (A-10), wait A-11, exam A-12 in daylight window, reset to 6,000 km / 30 days.
 - demand: CSTPS consumes DM-02 kt/day; track stock; record stock-outs below 7 days.
```

### 4.5 KPIs (per replication, then mean and 95% CI)
1. Mean rake cycle time (h) and its decomposition:
   T_place_load + T_load + W_crew + W_single_line + W_loops + T_run + W_merge_DN + W_relief + T_place_unload + T_unload + W_merge_UP + T_exam_detour.
2. Rakes delivered to CSTPS per day; coal tonnes per day.
3. Single-line utilisation %; tippler utilisation %; loading-line utilisation %.
4. Demurrage hours and Rs per rake (Rs 150 x 58 wagons x graded hours).
5. Share of rakes with crew-expired stabling; share of trips with BPC detour.
6. CSTPS stock days (floor over horizon).

### 4.6 Experiments (each vs baseline, same seeds)
| # | Lever | Levels |
|---|---|---|
| E1 | Fleet size (A-18) | 4, 6, 8, 10, 12, 14 rakes |
| E2 | Loading method | pay-loader (LD-03) vs RLS (LD-04) |
| E3 | Tadali path policy | FCFS vs "pre-planned slots in the 19:35-09:38 DN quiet window" vs priority to rakes with < 2 h crew remaining |
| E4 | Crew booking point | Balharshah (A-06/A-07) vs local Chandrapur lobby (travel 0.5 h) |
| E5 | Line doubling (INF-04) | single_line capacity 1 -> 2 (independent directions) |
| E6 | Tipplers in service | 3, 4, 5 |
| E7 | Resource +20% sensitivity | each of loops, tipplers, crew, line one at a time; rank by delta in rakes/day |
| E8 | Digital-twin refresh | re-run next-day plan with observed lateness (A-21 replaced by TT_lateness.csv when collected) |

### 4.7 Validation targets
- Mean cycle time should sit within 24-72 h (CR Nagpur WTR 1.46 days ~ 35 h for the whole division; industry agreed 48-72 h; summer actual 96-120 h).
- Baseline throughput 6-10 rakes/day to CSTPS (CEA receipts).
- Terminal detention per end ~15-16 h or less (RB target).
- Fraction of rakes exceeding free time should be substantial (CAG: 32% of wagons detained > 24 h) but not universal.
If the model falls outside these without a known reason, the assumption table is wrong, not the data.

### 4.8 Build order
1. `config.yaml` with every ID above. 2. Timetable loader -> hourly slot function for DN and UP with lateness. 3. Phase 1: single line + loops + Tadali merge + fixed loading/unloading, no crew/BPC. Validate W_single_line and W_merge behaviour against the quiet-window pattern. 4. Phase 2: crew clock, relief. 5. Phase 3: BPC clock and exam detour. 6. Phase 4: experiments E1-E8, plots (cycle-time waterfall, rakes/day vs fleet size, utilisation bars). 7. Export per-rake event log CSV matching `data/templates/RAKE_cycle_log.csv` so real data, when it arrives, drops into the same analysis.

### 4.9 Things NOT to do
- Do not model intermediate stations on the main line beyond Tadali-Chandrapur.
- Do not model locomotive allocation in Phase 1-3 (assume loco stays with CC rake).
- Do not invent a Ghugus loading rate better than LD-03 unless running E2 explicitly.
- Do not quote "100+ coal rakes/day for Nagpur division" - the sourced figure is ~29.
- Do not treat anything in Section 3 as fact in write-ups; label it ASSUMPTION with its ID.

---

## 5. Open data requests (letter in docs/Data_Request_Letter_CR_WCL.md)
Loops at both ends; spur speed and block working; Ghugus loading method and placement-to-release
times; rakes/day loaded at Ghugus by destination; crew booking point and relief practice;
BPC base depot and exam hours; CSTPS tipplers in service and unloading hours; any weeks of
FOIS/COA rake-level timestamps. Each maps to a template in `data/templates/`.
