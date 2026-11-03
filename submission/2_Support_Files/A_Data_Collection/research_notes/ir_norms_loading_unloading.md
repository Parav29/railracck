# Indian Railways norms: loading / unloading free time, demurrage, wharfage

Purpose: published norms to anchor triangular (min, mode, max) distributions for the
"placement -> release" activities at the coal siding (loading) and the power-house
siding (unloading) in the rake-cycle DES. All figures carry a URL. Where the source
is secondary (zonal web page, quiz bank, news), it is flagged.

---

## 1. Governing document

* The master document is **Rates Master Circular/Demurrage-Wharfage-Waiver/2016/0
  dated 19.05.2016** (Railway Board, Traffic Commercial Dte), amended by numbered
  corrigenda (No. 32 of 13.09.2022 revised demurrage rates; No. 42/45 hopper-in-lieu-
  of-open; No. 54 of 07.11.2024 crane handling).
  Source (SR schedule of powers quoting the circular):
  https://sr.indianrailways.gov.in/cris//uploads/files/1751884201884-waier%20updated%2030062025.pdf
  CR Annexure to Corrigendum 54:
  https://cr.indianrailways.gov.in/cris/uploads/files/1731569594339-ARN%20No%20136%20of%202024%20Goods.pdf
* Free time is reckoned **from the time of placement of the rake** (Railway Board
  letter TC-V/2024/201/efile/3 (3462079) dated 13.05.2024, "Free time for
  loading/unloading of long haul rakes"):
  https://indianrailways.gov.in/railwayboard/uploads/directorate/traffic_comm/Rates-Letters/2024/Free-13_05_2024.pdf

## 2. Free-time table (goods sheds and private/assisted sidings)

Source: Konkan Railway "Demurrage Rules – Free Time & Charges" page, reproducing the
Rates Master Circular table (zonal web page; verify against the master circular).
https://konkanrailway.com/node/5508

| Wagon type | Mechanised loading / unloading | Manual loading / unloading |
|---|---|---|
| Open (BOXN, BOXNHA, BOXNHS, BOST, BOX) | **5 h 00 / 7 h 00** | 9 h 00 / 9 h 00 |
| Hopper (BOBR, BOBRN, BOBS, BOBY) | **5 h 00 / 2 h 30** | N.A. |
| Flat (BFR, BRN, BFNS, BFKI) | 6 h 00 / N.A. | 8 h 00 / 8 h 00 |
| Covered (BCN, BCNA, BCNHS) | N.A. | 5 h (1-20 wagons), 7 h (21-30), 9 h (31+) |
| Container | 3 h 00 / 3 h 00 | |
| Crane-handled | 7 h loading / 8 h unloading | |

Historical confirmation of these magnitudes (Lok Sabha Unstarred Q 2785, answered
11.08.2005, demurrage rules effective 15.07.2005): jumbo rakes 8 h -> 9 h for loading
and unloading; mechanised unloading of open wagons 5 h -> 6 h; extra free time for
additional shunting/placement capped at 2 h.
https://eparlib.nic.in/bitstream/123456789/516626/1/17329.pdf

Rule when both methods are used on one rake: the more restrictive (mechanised) free
time applies (CR Annexure to Corrigendum 54):
https://cr.indianrailways.gov.in/cris/uploads/files/1731569594339-ARN%20No%20136%20of%202024%20Goods.pdf

Engine-on-load (EOL) sidings (Rates Circular No. 21 of 2004, letter 2004/TC-I/94/214/9
Vol II dated 12.07.2004): loading all wagon types, bulk **3 h**; unloading all types
except BOBRN, bulk **4 h**; unloading BOBRN **2 h**.
https://indianrailways.gov.in/railwayboard/uploads/directorate/traffic_comm/rate_inst_21-2k4.jsp

## 3. Coal-specific free time (loading end) -- 2024 Railway Board letters

* **Railway Board letter TC-I/2019/201/6-Part(2)(3328629) dated 22.01.2024** ("Free
  time for loading of rakes of Coal and iron ore"): free time for loading at goods
  sheds / sidings where **two or more coal/iron-ore rakes are loaded per day from a
  single line** was **reduced from 5 h to 3 h**.
* **Same file, letter dated 12.04.2024** ("...Power to Zone"): zonal railway may
  review (restore) the free time where single-line loading is below two rakes/day.
  Demurrage for sidings payable by the 10th of the following month.
  https://indianrailways.gov.in/railwayboard/uploads/directorate/traffic_comm/Rates-Letters/2024/free%20time%20for%20loading%20and%20unloading%20of%20rakes%20of%20Coal%20and%20Iron%20Ore%20-Power%20to%20Zone%20dated%2012_04_2024.pdf
* Bulk-online (industry forum, RLS vendor, secondary): Indian Railways "now giving
  4 hours to load the entire rake", previously 10 h then 6-7 h; retractable loading
  chute rated up to 5,500 tph, reclaim 2,200-2,400 tph; classic Indian load-out used a
  3,000 t concrete silo.
  https://www.bulk-online.com/en/node/60840
* Departmental quiz bank (secondary): coal demurrage slab after a **4-hour free time**:
  2x base rate 0-4 h, 2.5x 4-8 h, 3x beyond 8 h.
  https://mycbt.in/posts/knowledge-booster-com-ldce-edition-19-jul-2026

**Modelling implication:** at a WCL/CIL siding loading >= 2 rakes/day the current
Railway free time for loading a BOXN rake is 3 h (reduced from 5 h); 5 h still applies
at low-throughput sidings. Pay-loader (manual-category) sidings historically used 9 h.

## 4. Loading time actuals (RLS/silo vs pay-loader) -- Coal India / press

| Method | Time per rake | Source |
|---|---|---|
| Mechanised CHP + silo (Basundhara, MCL) | **8-10 h -> ~90 min** | BigMint analysis https://www.bigmint.co/insights/detail/indias-coal-supply-chain-strong-on-output-weak-on-delivery-747729 |
| CCL Karo (7 MTPA) & Konar (5 MTPA) CHP+silo | "rake loading time will be reduced **from 5 hours to 1 hour**" | PIB release 2062752 (Ministry of Coal) https://www.coal.nic.in/sites/default/files/2024-10/PIB2062752.pdf |
| Retractable chute RLS | up to 5,500 tph (a 58-wagon, ~3,800 t rake in ~45-60 min of flow) | https://www.bulk-online.com/en/node/60840 |
| SECL Dipka RLS (25 MTPA, commissioned 21.02.2025) | no time given | https://powerline.net.in/2025/02/26/secl-commissions-rapid-loading-system-at-dipka-megaproject/ |
| BCCL Maheshpur RLS (5 MTPA) trial rake 20.09.2026 | no time given | https://indianpsu.com/?p=41081 |
| Truck + pay-loader, Korba | trucks wait 6-8 h to unload at siding; 150-200 truck trips per rake | https://www.bigmint.co/insights/detail/indias-coal-supply-chain-strong-on-output-weak-on-delivery-747729 |

CIL loaded 280.7 rakes/day overall and 255.6 rakes/day to power in FY2018-19
(Ministry of Coal Annual Report 2019-20 ch. 5):
https://www.coal.gov.in/sites/default/files/2020-09/Chapter5-en.pdf

## 5. Unloading free time at power-house sidings

* Tariff: open wagons (BOXN) mechanised unloading (tippler) **7 h**; hopper (BOBRN)
  **2 h 30**; manual **9 h** (Konkan table above). EOL sidings: 4 h (open) / 2 h (BOBRN).
* Actual unloading times (BigMint, secondary): rapid unloaders / rotary tipplers **2-3 h**,
  mechanical grabs **6-8 h**, manual **12-15 h**; about 24 h of the lost turnaround is
  typically at the unloading end; agreed rake turnaround 48-72 h vs summer actual
  96-120 h.
  https://www.bigmint.co/insights/detail/indias-coal-supply-chain-strong-on-output-weak-on-delivery-747729
* Railways (Jan 2022) said hopper-rake unloading at a plant is about **3 h per rake**,
  "much less" than tippler system.
  https://indiainfrahub.com/news/road-map-in-place-for-supplying-rakes-to-long-distance-thermal-power-stations-says-railways/
* IIMA WP 2004-09-06 (Bhatnagar, Gupta, Pappu, Dutta) on a 490 MW Indian plant:
  rakes of 56-58 wagons of 56-58 t (~3,300 t), ~1.5 rakes/day, 2 tipplers, free
  unloading time then **10 h**, observed mean unloading **14 h (sd 4 h)**, mean
  demurrage ~4 h/rake, waiting room 6 rakes.
  https://iima.ac.in/sites/default/files/rnpfiles/2004-09-06gdutta.pdf

## 6. Demurrage and wharfage

* Base demurrage **Rs 150 per 8-wheeled wagon per hour or part** (Corrigendum 32,
  letter TC-I/2022/201/efile/2(3394909) dated 13.09.2022, effective 01.10.2022).
  Graded: up to 6 h beyond free time base; 6-12 h +10%; 12-24 h +25%; 24-48 h +50%;
  48-72 h 2x; >72 h 3x. Penal demurrage up to 6x base at congested terminals with
  24 h notice (para 3.4.1).
  https://sr.indianrailways.gov.in/cris//uploads/files/1751884201884-waier%20updated%2030062025.pdf
  https://konkanrailway.com/node/5508
* Earlier rates: Rs 100/wagon/h from 2008 until raised to Rs 150 from 1 April 2013
  (CAG Report 31 of 2014 para 3.6); Rs 60/bogie wagon/h under the 2004 EOL scheme.
  https://cag.gov.in/uploads/download_audit_report/2014/Union_Performance_Railways_Management_Goods_trains_31_2014_chapter_7.pdf
  https://indianrailways.gov.in/railwayboard/uploads/directorate/traffic_comm/rate_inst_21-2k4.jsp
* Wharfage (goods lying in railway premises after unloading) is not relevant to a
  siding-to-siding coal rake cycle; the Rates Master Circular covers it in Chapter II.
  Reckoning of free time for removal of consignment (Railway Board 24.01.2024):
  https://indianrailways.gov.in/railwayboard/uploads/directorate/traffic_comm/Rates_Master_Circulars/2024/Reckoning%20of%20free%20time%20for%20removal%20of%20consignment%20-(%20%20dated%2024_01_2024%20(i).pdf
* Demurrage waiver: 25% (Rs 267.07 cr) of accrued demurrage was waived IR-wide in
  2008-13; Rs 1,056.96 cr accrued on 223,208 of 450,852 rakes (CAG 2014 para 3.6).

## 7. Observed "placement to release" and "arrival to placement" (CAG 31 of 2014, para 3.2.5, Table 18)

Source: https://cag.gov.in/uploads/download_audit_report/2014/Union_Performance_Railways_Management_Goods_trains_31_2014_chapter_7.pdf

| Stage | Range of zonal averages 2011-13 |
|---|---|
| Loading: arrival -> placement | 0 h 32 m to 10 h 15 m |
| Loading: placement -> release (party account) | 5 h 03 m to 56 h 32 m |
| Loading: release -> despatch | 0 h 49 m to 21 h 03 m |
| Unloading: arrival -> placement | 0 h 38 m to 15 h 07 m |
| Unloading: placement -> release (party account) | 9 h 27 m to 124 h 12 m |
| Unloading: release -> despatch | 1 h 28 m to 11 h 04 m |

* Railway Board's envisaged total terminal detention: **16 h**; 32% of wagons at 128
  points detained > 24 h; average detention during loading ranged 12-86 h and during
  unloading 13-141 h across points. Party free time 5-11 h by wagon type; railway
  account allowance 1 h each for arrival->placement and release->despatch (footnote 25).
* Terminal-yard detention norms set by zones: ECoR 1 h, ECR 8 h, WR 10 h, **CR 15 h**,
  ER 24 h (para 3.2.6).

## 8. Suggested triangular parameters (hours) for the model

| Activity | min | mode | max | Basis |
|---|---|---|---|---|
| Loading BOXN rake, RLS/silo (incl. positioning) | 1.0 | 1.5 | 3.0 | CCL 1 h; MCL ~1.5 h; RB free time 3 h |
| Loading BOXN rake, pay-loader | 4.0 | 6.0 | 9.0 | RB 5 h (old free time), manual 9 h, Basundhara 8-10 h pre-silo |
| Placement (arrival at siding -> placed) | 0.5 | 1.0 | 4.0 | CAG Table 18, 1 h railway allowance |
| Release -> despatch (paperwork, BPC check, loco) | 0.8 | 1.5 | 6.0 | CAG Table 18 |
| Unloading BOXN rake, rotary tippler x2 | 2.0 | 4.0 | 7.0 | BigMint 2-3 h; RB free time 7 h; IIMA 14 h was 2004 era |
| Unloading BOBRN rake (hopper) | 1.5 | 2.5 | 4.0 | RB 2 h 30 free time; IR "about 3 h" |
| Unloading BOXN, grab/manual | 6.0 | 9.0 | 15.0 | BigMint 6-8 h grab, 12-15 h manual; manual free time 9 h |
