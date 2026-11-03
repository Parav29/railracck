# Indian Railways freight statistics, terminal detention distributions, and single-line capacity

Purpose: system-level validation targets (wagon turnround, speed) and block-section /
crossing parameters for the coal rake-cycle DES (Central Railway, single-line
sections ~14 km).

---

## 1. Official all-India freight indices

Source: Indian Railways Annual Report & Accounts 2023-24 (Railway Board, Statistics &
Economics Dte), pp. 6, 13, 15.
https://indianrailways.gov.in/railwayboard/uploads/directorate/stat_econ/2025/Indian%20Railways%20Annual%20Report%20%20Accounts%202023-24%20-English.pdf

| Index (Broad Gauge) | 2022-23 | 2023-24 |
|---|---|---|
| **Wagon turnround (days)** | 4.70 | **5.11** |
| **Average speed of goods trains (km/h, all traction)** | 30.80 (rev.) | **25.00** |
| NTKM per wagon-day | 8,670 | 7,851 |
| Wagon-km per wagon-day | 223 | 192 |
| Net load per goods train (t) | 1,738 | 1,899 |
| Average load per wagon (t) | 60 | 65 |
| Average lead of revenue freight (km) | 636 | 613 |

Other years:
* 2021-22: NTKM/wagon-day 8,384; average lead 615 km (Railway Board statistical
  summary sheet 2021-22):
  https://indianrailways.gov.in/railwayboard/uploads/directorate/stat_econ/2024/REVISED%20Summery%20Sheet%202021-22%20(English).pdf
* 2014-15: WTR 5.6 days; goods average speed 25 km/h; lead 622 km (AITD training
  slides "Freight Operations & Operating Indices"; defines WTR = effective wagon
  holding / (loaded wagons + loaded receipts) and speed = train-km / train-engine-h):
  https://mail.aitd.net.in/ppt/21/5.%20Freight%20Operations%20&%20Operating%20Indices.pdf
* 2019-20: goods average 23.6 km/h vs Mission Raftaar target 50 km/h (PAC 36th
  Report, 18th Lok Sabha, para 14, following C&AG Report 22 of 2021):
  https://eparlib.sansad.in/bitstream/123456789/3017115/1/18_Public_Accounts_36.pdf
* May 2021 (Covid low-traffic): WTR 4.83 days (vs 6.61 in May 2019), speed 45.42 km/h
  (PIB via Rail Analysis): https://news.railanalysis.com/?p=41408
* 2024-25: average freight speed **23.8 km/h**; DFC 37 km/h (Standing Committee on
  Railways report of 16.12.2025, PRS summary):
  https://prsindia.org/files/policy/policy_committee_reports/Railways_enhancing_freight_revenue.pdf
* Standing Committee (Dec 2024): 25.14 km/h, stagnant ~11 years:
  https://indiaseatradenews.com/rail-freight-in-india-slow-speeds-and-missed-opportunities/
* CAG Report 31 of 2014 para 3.2.4: speed "almost static at around 25 km" 2008-13;
  FOIS Feb 2012 sample of 6,730 loaded trains in 7 zones: **71% averaged <= 20 km/h,
  17% 20-40 km/h, 12% 40-100 km/h**; permissible 60 km/h. All-India WTR 5.19 -> 5.08
  days (2008-13).
  https://cag.gov.in/uploads/download_audit_report/2014/Union_Performance_Railways_Management_Goods_trains_31_2014_chapter_7.pdf

Coal-chain specifics (BigMint, secondary): agreed rake turnaround 48-72 h vs summer
actual 96-120 h; colliery-to-trunk-route segment 12-24 h; Grand Chord utilisation
120-130% in summer; EDFC speeds 45-50 km/h vs 25-30 km/h on conventional lines.
https://www.bigmint.co/insights/detail/indias-coal-supply-chain-strong-on-output-weak-on-delivery-747729

## 2. Terminal and en-route detention distributions (CAG Report 31 of 2014)

Source: https://cag.gov.in/uploads/download_audit_report/2014/Union_Performance_Railways_Management_Goods_trains_31_2014_chapter_7.pdf
Executive summary: https://cag.gov.in/uploads/download_audit_report/2014/Union_Performance_Railways_Management_Goods_trains_31_2014_chapter_5_Exe_Summ.pdf

* Para 3.2.5: at 128 loading/unloading points (2008-13) **32% of wagons detained
  > 24 h**; 30% (loading) and 21% (unloading) of wagons suffered detention beyond free
  time in 2011-13; average detention during loading 12-86 h, during unloading 13-141 h;
  Railway Board's envisaged placement-to-release envelope **16 h** not achieved.
* Table 18 stage-wise zonal averages: loading arrival->placement 0:32-10:15;
  placement->release 5:03-56:32; release->despatch 0:49-21:03; unloading
  arrival->placement 0:38-15:07; placement->release 9:27-124:12; release->despatch
  1:28-11:04.
* Para 3.2.6 yard detention norms (zone-set): ECoR 1 h, ECR 8 h, WR 10 h, **CR 15 h**,
  ER 24 h; actual exceeded norms by 1.46-36.53 h.
* Para 3.2.4 en-route: NWR rake detained 14 h 25 m, 442 km journey took 21 h; ER 11
  rakes on the same route varied by 0-89 h; NR 32 trains detained > 24 h.
* Para 3.4: 63% of late starts for want of loco, 18% for crew/path.
* PAC 36th Report Table 2.8 (2018-19) goods detention at interchange points: NKJ
  171-262 min, BHC 151-248 min, ITR 66-186 min, Gudur 2-213 min; six internal causes
  = 66% of detentions; line-capacity utilisation 137-175% on NCR/ECR trunk sections.
  https://eparlib.sansad.in/bitstream/123456789/3017115/1/18_Public_Accounts_36.pdf

## 3. Single-line block section working and line capacity

### 3.1 Scott's formula (Indian Railways standard)

C = (1440 / (T + t)) x E

* C = trains per day (both directions on single line); 1440 = minutes/day;
  **T = running time of the slowest train over the critical (longest-time) block
  section**; **t = block operation time** (line-clear, signal, points, token);
  **E = efficiency factor**, conventionally **0.70 for single line, 0.80 for double
  line**. IR practice deducts a maintenance block first: 1440 - 120 = 1320 min.
  * Formula as written in Sangphong, Siridhara & Ratanavaraha, Engineering Journal
    21(3), 2017, eq. 1: https://engj.eng.chula.ac.th/ej/article/download/1266/580
  * IR recipe (1,320 min / (slowest-train running time + section preparation time) x
    70%), "Who is Scott?", Business Standard 05.10.2017:
    https://business-standard.com/amp/article/opinion/who-is-scott-117100501278_1.html
  * Departmental exam note (T = running time of slowest train, t = block operation time,
    E = efficiency): https://mycbt.in/posts/knowledge-booster-advance-operations-edition-12-jul-2026
  * Same structure in JICA/Nippon Foundation single-track formula N = 1440 f / (T + C):
    block handling time C = **2 min 30 s (tablet/token)**, **1 min 30 s (automatic)**;
    utilisation f 0.5-0.75: https://nippon.zaidan.info/seikabutsu/1996/00501/contents/096.htm
* IR 2015 White Paper: 492 of 1,219 sections (40%) above 100% utilisation; block
  sections typically 10-15 km outside urban areas (Business Standard, above).

### 3.2 Block operation time t (for the model)

No single Railway Board number; the values in use in IR line-capacity work:
tokenless block / panel interlocking **3-4 min**, token (Neale's) **5 min**, automatic
block **1.5-2 min**. The Nippon Foundation JICA figures (2.5 min tablet, 1.5 min auto)
bracket the low end; IR practice adds signal-clearance and reception time, so use
tri(3, 4, 6) min for a tokenless single-line block with a crossing station at each end.
General Rules ch. 14 (block working, line clear only after whole opposing train is
inside and clear of running line, GR 14.11(4)):
https://irfca.org/docs/rulebook/gr-block.html

### 3.3 Time to clear a 14 km single-line block

Pure running time at constant speed: 14 km / 50 km/h = **16.8 min**; / 40 = **21.0
min**; / 30 = **28.0 min**. Add start-from-stop and stop-at-loop allowances used in
IR working timetables (typically 2-3 min each for a loaded 4,000-5,000 t BOXN train;
illustrative station working rules: ECoR SWR documents
https://eastcoastrail.indianrailways.gov.in/uploads/files/1719289299569-KTGA_FULL_SWR_01042024.pdf)
and block operation t = 3-6 min:

| Case | Occupancy of block (min) |
|---|---|
| Loaded coal rake, 30 km/h sectional, stop-to-stop | 28 + 3 + 3 + 4 = **38** |
| Loaded, 40 km/h | 21 + 3 + 3 + 4 = **31** |
| Empty BOXN, 50 km/h | 17 + 2 + 2 + 4 = **25** |

Scott capacity of the 14 km block: with T = 31 min, t = 4 min, E = 0.7 ->
1320/35 x 0.7 = **26 trains/day**; with T = 38 -> **22 trains/day**.

### 3.4 Crossing / precedence at a loop station

Under absolute block on single line, a train waiting to cross must stand on the loop
until the opposing train has arrived complete and is clear (GR 14.11(4)). The crossing
delay for the waiting train = (time from its arrival until opposing train arrives) +
(block operation t) + (start allowance). Observed single-line crossing detentions in
IR operating studies are typically 10-30 min per crossing; IIMA WP 1992-04-01 studied a
43 km coal/cement section where cross movements caused detention (no figures in
abstract): https://ideas.repec.org/p/iim/iimawp/wp01096.html
Model as tri(5, 15, 40) min per crossing for a goods train giving precedence.

## 4. Suggested validation targets and parameters

| Quantity | Value | Basis |
|---|---|---|
| All-India WTR | 4.7-5.6 days (2014-15 to 2023-24) | Annual Report 2023-24; AITD |
| Short-lead coal circuit turnaround (CIL-Railway agreed) | 48-72 h; summer 96-120 h | BigMint |
| Freight average speed (incl. stops) | tri(18, 25, 32) km/h | Annual Report 25.0; CAG 71% <= 20 km/h; 2022-23 30.8 |
| Sectional running speed, loaded BOXN on single line | tri(30, 40, 50) km/h | CAG permissible 60; EDFC 45-50 |
| Block operation time t | tri(3, 4, 6) min | JICA 1.5-2.5 min + IR signalling allowances |
| Crossing wait at loop | tri(5, 15, 40) min | GR 14.11; IR operating practice |
| Terminal placement->release beyond free time (prob.) | 21% (unloading), 30% (loading) | CAG para 3.2.5 |
| Share of rakes detained > 24 h at terminals | 32% (2008-13 IR-wide; use as pessimistic bound) | CAG para 3.2.5 |
| Yard detention norm, CR | 15 h | CAG para 3.2.6 |
