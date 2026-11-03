# Section capacity notes: Wardha–Chandrapur–Balharshah (CR Nagpur Division) and the Tadali–Ghugus spur

Research date: 2026-10-13. All figures are quoted from the cited public sources; nothing here is from an official
Working Time Table (WTT), which is not published online for CR Nagpur division.

## 1. Passenger-train traffic profile at Chandrapur (derived from `timetable_tadali_chandrapur.csv`)

Source: erail.in trains-between-stations pages and raw endpoint (URLs in the CSV). 115 distinct scheduled trains
(58 southbound/DN toward Balharshah, 57 northbound/UP toward Wardha/Nagpur). Weighted by days-of-run this is
**146 DN + 139 UP = 285 passenger-train passings per week, i.e. about 40.7 per day (≈20.9 DN, ≈19.9 UP).**
Only 15 DN and 14 UP trains are daily; the rest are weekly/bi-weekly, so the actual count on a given weekday varies
roughly 17–24 per direction.

Only two trains stop at Tadali (TAE): 61127 WR–BPQ MEMU (TAE dep 09:27, CD arr 09:52, DN) and 61128 BPQ–WR MEMU
(CD dep 18:53, TAE arr 19:12, UP). Everything else runs through Tadali non-stop; CD timing minus ~12–15 min (DN) or
plus ~15–19 min (UP) gives the Tadali passing time (CD–TAE is 15 km per erail).

Hour-of-day histogram (average passings per day = weekly count / 7; "daily" = number of 7-day trains in that hour):

| Hour | DN (south) /day | DN daily trains | UP (north) /day | UP daily trains | Both /day |
|---|---|---|---|---|---|
| 00 | 0.43 | 0 | 1.00 | 1 | 1.43 |
| 01 | 0.43 | 0 | 0.00 | 0 | 0.43 |
| 02 | 0.14 | 0 | 0.00 | 0 | 0.14 |
| 03 | 0.00 | 0 | 1.00 | 0 | 1.00 |
| 04 | 0.14 | 0 | 0.43 | 0 | 0.57 |
| 05 | 0.00 | 0 | 1.43 | 1 | 1.43 |
| 06 | 1.14 | 0 | 1.57 | 1 | 2.71 |
| 07 | 1.29 | 0 | 0.71 | 0 | 2.00 |
| 08 | 1.00 | 0 | 1.71 | 1 | 2.71 |
| 09 | 2.00 | 2 | 0.71 | 0 | 2.71 |
| 10 | 0.14 | 0 | 1.00 | 0 | 1.14 |
| 11 | 1.00 | 0 | 1.00 | 1 | 2.00 |
| 12 | 1.57 | 1 | 1.29 | 1 | 2.86 |
| 13 | **4.14** | 4 | 1.14 | 0 | **5.29** |
| 14 | 1.00 | 1 | 0.00 | 0 | 1.00 |
| 15 | 1.00 | 1 | 1.00 | 1 | 2.00 |
| 16 | 0.86 | 0 | 0.14 | 0 | 1.00 |
| 17 | 0.71 | 0 | 1.29 | 0 | 2.00 |
| 18 | 1.29 | 1 | 2.00 | 2 | 3.29 |
| 19 | 1.71 | 1 | 0.00 | 0 | 1.71 |
| 20 | 0.29 | 0 | 0.00 | 0 | 0.29 |
| 21 | 0.43 | 0 | 0.00 | 0 | 0.43 |
| 22 | 0.00 | 0 | 1.71 | 1 | 1.71 |
| 23 | 0.14 | 0 | 0.71 | 0 | 0.86 |

**Quiet windows (likely freight paths):**
- **DN line (the one loaded Ghugus rakes merge onto at Tadali, heading to CD/CSTPS):**
  - **20:30 – 06:20** is almost empty: only 12670 (21:07, Tu/Th), 22614 (21:47, Th), 04109 (23:59, Sa), 12772 (00:12, W/F/Su),
    22664/22738 (01:10), 01925 (02:22, Th), 04171 (04:22, Su). No daily train at all between 19:35 (12722 Dakshin) and 09:38 (12724 Telangana).
  - **10:00 – 10:55** (only 22109 on Wednesdays), **14:16 – 15:04**, **15:09 – 16:04**.
  - **Peak to avoid: 12:58 – 13:41** (five daily trains 20806, 12616, 12655, 12792 plus weekly 22151 in 43 min) and 11:36–12:20.
- **UP line (empties returning Chandrapur → Tadali → Ghugus):**
  - **19:00 – 22:00** empty; **23:35 – 03:20** empty except 12656 (00:27); **13:58 – 15:24**; **15:28 – 17:29**.
  - Peaks: 03:25–03:42 (up to 5 weekly trains bunch), 06:00–06:32, 07:15–08:27, 10:15–10:45, 12:45–13:02, 17:30–18:53.
- Both lines quiet together: **19:50 – 22:00 (DN)** / **20:30 – 22:00**, and **01:15 – 03:20**.

Caveat on days-of-run: the 7-bit MTWTFSS string is what erail returns for the CD→X query. erail normally shows the
running day at the "from" station, but for long-distance trains that reach CD on day 2/3 this should be verified
train-by-train before being used to generate a specific calendar day.

## 2. Line capacity utilisation and traffic (news / official)

- **Wardha–Ballarshah line-capacity utilisation: 145 % (UP) and 163 % (DN)**; Itarsi–Nagpur 151 %/154 %. Goods trains
  average ~10 km/h on the corridor (including detentions). Third line "nearly 60 % complete" (Jan 2023); 4th line
  (88 km Wardha–Ballarshah) at survey stage; traffic expected to grow ~20 % after 3rd line.
  Source: The Hitavada, 28 Jan 2023, https://thehitavada.com/Encyc/2023/1/28/Indian-Railways-plans-4th-corridor-on-Itarsi-Ngp-Wardha-Ballarshah-routes.html
- Wardha–Ballarshah 3rd line: 160 km, Rs 1,035 cr, 25 % done on 132 km section (Mar 2022); Sewagram–Sonegaon chord
  commissioned. Source: The Hitavada, 12 Mar 2022, https://www.thehitavada.com/Encyc/2022/3/12/No-solid-progress-in-Rly-projects-aimed-at-decongesting-clogged-network.html
  (Sewagram–Sonegaon section inauguration: https://indianinfrastructure.com/2019/09/18/mahrashtra-government-inaugurated-sewagram-sonegaon-section-of-the-wardha-sewagram-ballarshah-third-line-project/)
- Ballarshah interchange with SCR: "about 50 trains criss-cross daily", average interchange detention 72 min vs SCR and
  ~207 min vs SECR; ~5.5 rakes/day via Pimpalkuti crossover; 3rd line Wardha–Ballarshah "under progress", 4th line DPR
  being prepared (Nov 2025). Source: The Hitavada, 4 Nov 2025, https://www.thehitavada.com/Encyc/2025/11/4/eyeing-3000-mt-loading-rlys-plans-to-end-detention-at-inter-changes.html
- **CR Nagpur Division "About Us" (Dec 2023)**: 993 route-km; ~146 Mail/Express+Passenger trains/day division-wide
  (elsewhere in same doc 110.6 M/E + 14 passenger); **~225 freight trains interchanged per day**; 44.39 MT loaded in
  2022-23 of which **~90 % coal**; 7,142 coal rakes Apr–Dec 2023 (≈26/day division-wide); WCL loading points include
  **Ballarshah, Babupeth, Chandrapur, Majri, Ghugus, Wani**; private coal loading at **PVIT (Vimla siding, Tadali)**;
  coal unloading at **CSTPS Chandrapur**, Warora, Tadali and Sindi private plants; POL unloading at Tadali; ACC cement
  siding at Ghugus. Third-line works commissioned 2023: SEGM–CHJC (Sewagram–Chitoda-Hinganghat area), Narkher–Teegaon, Khapri–Butibori 3rd/4th.
  Source: https://cr.indianrailways.gov.in/cris//uploads/files/1705659988988-About%20us%20Dec23.pdf
- **Tadali–Ghugus doubling sanctioned (Jul 2026)**: 14 km, currently **single line**, Rs 228 cr, freight-oriented
  (coal, iron ore, gypsum, POL, sand, laterite ash), +4.5 MTPA expected. No commissioning date.
  Sources: https://www.itln.in/railway/indian-railways-doubles-tadalighugus-line-for-228-cr-1359929 ;
  https://indianinfrastructure.com/2026/07/22/ir-approves-tadali-ghugus-doubling-rail-line-project-in-maharashtra/ ;
  https://www.nbmcw.com/news/metro-railways/indian-railways-approves-doubling-of-tadali-ghugus-railway-section-in-maharashtra-at-rs-228-cr.html
- Ballarshah–Kazipet 3rd line (south of BPQ, SCR): Asifabad–Sirpur Kaghaznagar section completed Jul 2026.
  Source: https://indianinfrastructure.com/2026/07/27/work-completed-on-asifabad-sirpur-kaghaznagar-section-under-ballarshah-kazipet-third-line-project-in-telangana/

## 3. Station layouts (platforms / loops)

- **Chandrapur (CD)**: 3 platforms, **6 tracks** (so ~4 non-platform/goods loops incl. CSTPS siding takeoff); ~105
  passenger trains stopped daily (2018 figure); electrified 1988-89. Source: https://en.wikipedia.org/wiki/Chandrapur_railway_station
- **Balharshah (BPQ)**: 5 platforms, 8 tracks. Source: https://en.wikipedia.org/wiki/Balharshah_railway_station
- **Tadali (TAE)**: no public platform/loop count found (ixigo, railmitra, nativeplanet pages carry no layout data:
  https://www.ixigo.com/train-stations/tadali-tae-railway-station , https://www.railmitra.com/stations/Tadali-TAE ).
  It is the junction for the single-line Ghugus branch and hosts PVIT (Vimla) coal siding and a POL siding (CR About
  Us). For the simulation assume: 2 main lines + at least 1 branch reception/dispatch loop + siding lines; verify from
  Google Earth / OpenRailwayMap (https://www.openrailwaymap.org) before fixing the parameter.
- Nagpur division also lists "Talni converted to B class with two Long Haul Loops" (2023), indicating the division is
  adding long-haul (2-rake) loops on the corridor. Source: CR About Us Dec 2023 (above).

## 4. Implications for the model

- Treat the Wardha–Balharshah double line as saturated (>140 % chart utilisation): freight paths exist only in the gaps
  between the ~20 passenger passings/direction/day plus other freight (the division interchanges ~225 freight/day;
  the Nagpur–Ballarshah trunk carries the bulk of CR's coal traffic).
- DN-direction scheduled passenger gaps at Tadali are longest 20:30–06:20 (night) and 14:15–16:00; the mid-day
  12:55–13:45 bunching is the worst slot for a loaded rake to merge.
- Lateness is large and asymmetric: DN long-distance trains arrive at CD with ~25–90 min average delay (etrain.info,
  Oct 2026), so scheduled gaps shift substantially; use the 90-day per-day series (see lateness_sources.md) rather than
  the WTT gaps alone.
- Freight occupancy on the merge: a loaded ~59-BOXN rake at 30–40 km/h over the 15 km TAE→CD takes 25–30 min of
  block occupancy, versus ~10–12 min for an express; headway with intermediate block signals assumed ~8–10 min.
