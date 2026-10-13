# CSTPS coal unloading facilities, free time and demurrage rules

Research date: 2026-10-13.

## 1. Unloading facilities at CSTPS (from MAHAGENCO / CPRI documents)

Primary source: CPRI vetting report on MAHAGENCO CSTPS coal handling plants (filed with MERC data-gap replies)
https://www.mahagenco.in/uploade/Petition/Data%20Gaps%20Set-I%20Annexures/DG%20-%20026%20_Vetting%20Reports/CPRI%20Vetting%20REPORT.pdf

| CHP | Units served | Receiving equipment | Notes |
|---|---|---|---|
| CHP-A | 3-4 (2x210 MW) | Rail, aerial ropeway (1.2 km from WCL Durgapur mine, ~7,000 t/day), road | daily need ~8,000 t |
| CHP-B | 5-7 (3x500 MW) | **2 wagon tipplers** (L&T, commissioned 1992) + **track hopper** for BOXN and BOBR(N) wagons; 2 stacker-reclaimers (Elecon, 1992); 22 km of conveyors, 33 conveyor streams | daily need ~24,000 t |
| CHP-C | shared | **Track hopper** (single conveyor stream) for BOBR/UTS bottom-discharge wagons; road unloading; closed pipe conveyor from WCL Bhatadi OCM | — |
| CHP-D | 8-9 (2x500 MW) | **3 wagon tipplers** (Elecon, commissioned 2016) | MAHAGENCO tender Jul-2026 for strengthening end frames of a CHP-D wagon tippler (tender ID 3000070885, https://tender18.com/tenders-details/16552146) |

Total: **5 wagon tipplers + 2 track-hopper lines**, i.e. up to 5 independent BOXN unloading streams plus the
BOBRN hopper route. Rated capacities are not stated in the CPRI document. Industry norms (for sizing the simulation):
- Rotaside / rota-tippler for BOXN: typically rated 20-25 tips/hour (one tipple = one wagon of ~60-65 t), i.e.
  1,200-1,500 t/h each; a 58-59 wagon rake takes ~2.5-3 h on one tippler at rated speed, 4-6 h in practice with
  shunting (side-arm charger, placement of cuts of ~10-20 wagons). Source for typical tippler rating: NTPC CHP
  technical specs, e.g. Lara STPP 2x800 MW spec https://ntpctender.ntpc.co.in/uploads/tech_job_15486.html and
  Darlipali https://ntpctender.ntpc.co.in/uploads/tech_job_15561.html (tippler systems specified at ~20 tips/h,
  1,500 t/h conveyors, track hopper at 1,500-4,000 t/h).
- Track hopper (bottom-discharge BOBRN rake): whole rake discharges in ~30-60 min at walking speed; free time 2.5 h.

No merry-go-round (MGR) system at CSTPS; the plant is fed by IR rakes placed into the power-house siding at
Chandrapur, plus ropeway and pipe conveyor from the adjacent WCL Durgapur/Bhatadi/Padmapur mines.

## 2. Indian Railways free time for unloading (official figures)

Governing document: Railway Board "Rates Master Circular/Demurrage-Wharfage-Waiver/2016/0" (Chapter I, paras
2.2-2.5) with corrigenda up to No. 54 (07-11-2024). The zonal railways republish the tables; the Central Railway
goods tariff ARN No. 136 of 2024 reproduces the current table:
https://cr.indianrailways.gov.in/cris/uploads/files/1731569594339-ARN%20No%20136%20of%202024%20Goods.pdf
A clean HTML version of the same table is on Konkan Railway's site (same Board rules apply IR-wide):
https://konkanrailway.com/node/5508

Free time at railway terminals and private/assisted sidings (non-steel-plant, non-EOL), per rake:

| Wagon type | Mechanised loading | Mechanised unloading | Manual loading | Manual unloading |
|---|---|---|---|---|
| Open wagons (BOXN, BOXNHL, BOXNHS, BOST, BOX...) | 5 h | **7 h** | 9 h | **9 h** |
| Hopper wagons (BOBR, BOBRN, BOBY, BOBS) | 5 h | **2 h 30 min** | n.a. | n.a. |
| Flat (BRN, BFNS...) | 6 h | n.a. | 8 h | 8 h |
| Containers | 3 h | 3 h | — | — |

So for CSTPS:
- BOXN/BOXNHL rake unloaded on wagon tipplers = "mechanised unloading of open wagons" = **7 hours free time**.
- BOBRN rake on track hopper = **2.5 hours free time**.
- A manual (payloader/road) unloading of BOXN = 9 h.
- Engine-on-load (EOL) terminals (para 2.5): "others" 3 h; steel-plant open-wagon unloading 5 h. Power-house sidings
  are not EOL by default; CSTPS placement is by the siding shunting engine, so the 7 h figure applies.
- Free time is reckoned from the time of placement (or from "placement advice"/expiry of 2 h after rake arrival at the
  serving station if the siding cannot accept, per Rates Master Circular). Railway Board letter dated 24-01-2024 on
  reckoning of free time: https://indianrailways.gov.in/railwayboard/uploads/directorate/traffic_comm/Rates_Master_Circulars/2024/Reckoning%20of%20free%20time%20for%20removal%20of%20consignment%20-(%20%20dated%2024_01_2024%20(i).pdf
- Coal/iron-ore LOADING sidings: free time cut from 5 h to 3 h where 2 or more rakes are loaded per day from a single
  line; zonal railways empowered to apply/review (Railway Board letters TC-I/2019/201/6-Part(2) dated 22-01-2024 and
  12-04-2024): https://indianrailways.gov.in/railwayboard/uploads/directorate/traffic_comm/Rates-Letters/2024/free%20time%20for%20loading%20and%20unloading%20of%20rakes%20of%20Coal%20and%20Iron%20Ore%20-Power%20to%20Zone%20dated%2012_04_2024.pdf
  Relevant for the WCL Ghugus/Wani sidings in the model: use **3 h loading free time** at busy WCL sidings.
- Ancillary circulars: SECR Rates Circular 234(G)/2022 (Corrigendum 32 dated 13-09-2022, waiver guidelines effective
  01-10-2022) https://secr.indianrailways.gov.in/uploads/files/1667385128436-sign%20rc%20234_rc%20234_merged.pdf ;
  Board letters on waiver/refund of demurrage 14-08-2024 and 2025.

## 3. Demurrage charges (same source: Rates Master Circular 2016 + Konkan/CR tariff pages)
- Base rate: **Rs 150 per 8-wheeled wagon per hour** (or part) of detention beyond free time.
  (Rate in force since the 2017 revision; private-owned wagons attract a lower/nil rate.)
- Escalation with excess detention (slab applies to whole period):
  | Detention beyond free time | Rate |
  |---|---|
  | up to 6 h | Rs 150 /wagon/h |
  | 6-12 h | Rs 165 (base +10%) |
  | 12-24 h | Rs 187.50 (base +25%) |
  | 24-48 h | Rs 225 (base +50%) |
  | 48-72 h | Rs 300 (2x) |
  | > 72 h | Rs 450 (3x) |
- For a 58-wagon rake: Rs 8,700 per hour for the first 6 h of overstay; a 12-hour overstay costs
  58 x 12 x 165 = Rs 1,14,840; a full day's overstay ~Rs 2.6 lakh.
- Demurrage at sidings is billed monthly, payable by the 10th of the following month (Board letter 12-04-2024 refused
  to extend to the 20th).
- Waiver: zonal CCMs may waive up to defined limits; requests judged by the policy in force on the date of completion
  of unloading (Corrigendum 32/2022).

## 4. Simulation parameters suggested from the above
- Unloading servers at CSTPS: 5 tipplers (2 at CHP-B, 3 at CHP-D) + 1-2 track-hopper lines for BOBRN.
- Service time per BOXN rake on a tippler: triangular(3, 4.5, 7) h; free time 7 h; demurrage per rake-hour beyond
  free time = 58 x 150 = Rs 8,700 (escalating as above).
- Service time per BOBRN rake on track hopper: 0.75-1.5 h; free time 2.5 h.
- Loading at WCL siding: free time 3 h (busy sidings) / 5 h (others), same demurrage scale.
