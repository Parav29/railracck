# CSTPS (Chandrapur STPS, MAHAGENCO) – coal demand, stock and receipt data

Research date: 2026-10-13. All figures are from the CEA "Daily Coal Stock Report" PDFs hosted on
the National Power Portal (npp.gov.in), unless stated otherwise. CSTPS appears as
"CHANDRAPUR (MAHARASHTRA) STPS", Sl. No. 31 (30 in 2024 reports), mode of transport = RAIL,
capacity 2920 MW (2x210 + 5x500; units 1-2 retired, units 3-9 operating).

Source URL pattern (dd-mm-yyyy): `https://npp.gov.in/public-reports/cea/daily/fuel/DD-MM-YYYY/dailyCoal1-YYYY-MM-DD.pdf`
Index page: https://npp.gov.in (Reports -> CEA daily fuel reports). Note: direct download via curl is
blocked by robots/proxy from our environment; open in browser.

## 1. Column definitions in the CEA daily report
- Capacity (MW)
- Normative Stock Reqd. (Days) – CEA norm; varies month to month (20-26 days observed; pithead/rail-fed norm)
- Daily Requirement @85% PLF ('000 T) – this is CEA's *normative* consumption, NOT actual
- Actual Stock ('000 T): Indigenous / Import / Total
- % of Actual Stock vis-a-vis Normative Stock; plant flagged "Critical (*)" when < 25% of normative
- Receipt of the day ('000 T)  <-- key input for the simulation (coal delivered that day)
- Consumption of the day ('000 T)  <-- actual burn
- Current month PLF (tentative)

## 2. CSTPS values by report date (all tonnes in '000 T)

| Report date | Norm. days | Daily req @85% PLF | Stock indig. | Stock import | Stock total | % of norm | Receipt of day | Consumption of day | Month PLF | URL |
|---|---|---|---|---|---|---|---|---|---|---|
| 25-07-2024 | 22 | 47.2 | 617.5 | 157.6 | 775.1 | 75% | 17.3 | 18.7 | 56% | https://npp.gov.in/public-reports/cea/daily/fuel/25-07-2024/dailyCoal1-2024-07-25.pdf |
| 15-10-2025 | 21 | 49.5 | 233.3 | 46.1 | 279.5 | 27% | 29.9 | 32.6 | 58% | https://npp.gov.in/public-reports/cea/daily/fuel/15-10-2025/dailyCoal1-2025-10-15.pdf |
| 08-12-2025 | 23 | 49.5 | 740.3 | 52.3 | 792.6 | 70% | 3.9 | 32.1 | 50% | https://npp.gov.in/public-reports/cea/daily/fuel/08-12-2025/dailyCoal1-2025-12-08.pdf |
| 02-06-2026 | 26 | 47.8 | 475.6 | 114.2 | 589.8 | 47% | 47.5 | 31.5 | 57% | https://npp.gov.in/public-reports/cea/daily/fuel/02-06-2026/dailyCoal1-2026-06-02.pdf |
| 14-06-2026 | 26 | 47.8 | 580.8 | 131.9 | 712.7 | 57% | 33.8 | 34.9 | 58% | https://npp.gov.in/public-reports/cea/daily/fuel/14-06-2026/dailyCoal1-2026-06-14.pdf |
| 17-07-2026 | 22 | 47.8 | 724.6 | 80.9 | 805.5 | 77% | 27.1 | 32.9 | 54% | https://npp.gov.in/public-reports/cea/daily/fuel/17-07-2026/dailyCoal1-2026-07-17.pdf |
| 31-07-2026 | 22 | 47.8 | 726.3 | 79.1 | 805.5 | 77% | 16.2 | 22.3 | 51% | https://npp.gov.in/public-reports/cea/daily/fuel/31-07-2026/dailyCoal1-2026-07-31.pdf |
| 02-09-2026 | 20 | 47.8 | 478.6 | 9.1 | 487.7 | 51% | 31.1 | 43.6 | 71% | https://npp.gov.in/public-reports/cea/daily/fuel/02-09-2026/dailyCoal1-2026-09-02.pdf |
| 05-09-2026 | 20 | 47.8 | 455.4 | 3.4 | 458.8 | 48% | 37.5 | 47.8 | 40%(?) | https://npp.gov.in/public-reports/cea/daily/fuel/05-09-2026/dailyCoal1-2026-09-05.pdf |

Caveats: values were extracted from PDF text (column layout scrambles in text extraction). Indigenous+Import=Total
reconciles in every row, so stock figures are reliable; receipt/consumption/PLF were mapped by column position
and should be spot-checked visually against the PDF before being quoted in a report. The 05-09-2026 PLF (40%)
looks inconsistent with consumption 47.8 kt and is probably mis-mapped.

### Derived numbers for the simulation
- CEA normative requirement at 85% PLF: **47.8 kt/day** (2026), 49.5 kt/day (late 2025), 47.2 (2024).
  Implied specific coal consumption: 47,800 t / (2920 MW x 0.85 x 24 h) = ~0.80 kg/kWh (typical for ~3,600-3,800 kcal/kg WCL coal).
- Actual consumption observed: 18.7 - 47.8 kt/day, median of the 9 observations ~32.6 kt/day (PLF 50-58%).
- Actual receipt observed: 3.9 - 47.5 kt/day, median ~29.9 kt/day. Receipt includes ALL modes (rail + ropeway + pipe conveyor + road).
- Stock on hand: 280 - 806 kt => 6 - 17 days of normative requirement.
- Normative stock: 20-26 days x 47.8 kt = 957 - 1,244 kt (CEA changes the day-norm seasonally).
- Nowhere in the reports is a "rakes per day" column; convert: receipt_kt / ~3.9 kt per rake (see rake_payload_norms.md).
  E.g. 31.1 kt/day => ~8 rakes-equivalent; 47.5 kt/day => ~12 rakes-equivalent. Subtract ~7 kt/day arriving by
  ropeway/pipe conveyor (see below) to get the rail share: roughly **6 - 10 rakes/day by rail** on normal days, with
  bursts to ~12. This is consistent with the "8-14 rakes/day" prior for a 2920 MW plant only at high PLF.

## 3. MAHAGENCO internal figure for daily requirement
CPRI vetting report for MAHAGENCO (Coal handling plants at CSTPS), hosted on mahagenco.in:
https://www.mahagenco.in/uploade/Petition/Data%20Gaps%20Set-I%20Annexures/DG%20-%20026%20_Vetting%20Reports/CPRI%20Vetting%20REPORT.pdf
- Sec 1.1: "The daily requirement of coal is @ 47000 MT for overall CSTPS."
- CHP-A (units 3-4, 2x210 MW): daily requirement ~8,000 MT; receives coal by Rail, Rope and Road; ~7,000 MT/day
  comes by the 1.2 km aerial ropeway from WCL Durgapur mine (Sec 4.12).
- CHP-B (units 5-7, 3x500 MW): daily requirement ~24,000 MT; rail (BOXN and BOBR wagons).
- CHP-C: track hopper for BOBR/UTS wagons, road receipt facility, and a closed pipe conveyor from WCL Bhatadi OCM.
- CHP-A/B/C combined handle ~32,000 MT/day for 2x210 + 3x500 MW (Sec 4.11).
- CHP-D (units 8-9, 2x500 MW): remainder (~15,000 MT/day implied), rail via 3 wagon tipplers.

## 4. Coal sources and modes (rail vs road vs conveyor; no MGR)
- MoEF&CC six-monthly EC compliance report Jan-Jun 2025 (MAHAGENCO):
  https://mahagenco.in/clearance_pdf/MoEF&CC_Six%20Monthly%20EC%20Compliance%20report%20for%20period%20of%20January%202025%20-%20June%202025%20for%20CSTPS%20Chandrapur_20250724120519827.pdf
  - Coal is from Western Coalfields Ltd (WCL); mines named around the plant: Bhatadi, Durgapur, Padmapur
    (WCL Chandrapur Area). CSTPS has a linkage to Durgapur OC mine.
  - Modes: rail wagons, aerial ropeway (Durgapur), closed pipe conveyor from Bhatadi/Padmapur mine area, trucks (road).
  - No quantities by mode are given. No merry-go-round (MGR) system exists at CSTPS (none mentioned in any
    MAHAGENCO/CPRI/EC document; the Wikipedia page lists Durgapur and Padmapur collieries as sources).
- Wikipedia: https://en.wikipedia.org/wiki/Chandrapur_Super_Thermal_Power_Station (coal from WCL Durgapur and Padmapur).
- Units 8&9 EC (MoEF letter J-13011/53/2008-IA.II(T), 30-01-2009, extended 31-03-2016): coal source stated as the
  Machakata coal block (Odisha; never developed) – in practice units 8-9 run on WCL linkage + imports.
  https://mahagenco.in/Content/File_pdf/EnvClearance/5.%20CSTPS%20U%208%20&%209%20EC%20&%20extension,%20ammendments.pdf
- CEA daily reports show a persistent "Import" stock component at CSTPS (3 - 158 kt), so imported/blended coal also
  arrives, by rail from ports.
- Rail-side origin (Central Railway, Nagpur Division): WCL loading sidings at Ghugus, Wani, Umrer, Majri, Ballarpur
  areas. Record-day data for Nagpur Division, 5-Nov-2020: 42 coal rakes loaded in the division in one day
  (Ghugus 16 rakes, Umrer 11, Wani 6); Oct-2020 division loading 3.28 MT.
  https://news.railanalysis.com/?p=37597
- Central Railway Highlights 2024-25: coal loading from WCL sidings fell by 1.5 rakes/day (536 rakes, -2.14 MT),
  implying ~4.0 kt/rake on CR coal loading. https://cr.indianrailways.gov.in/cris//uploads/files/1753868156096-Highlights%202024-25.pdf
- Tadali-Ghugus (14 km, Wardha-Ballarshah HDN route) is single line; doubling approved July 2026, expected to add
  4.5 MTPA freight. https://indianinfrastructure.com/2026/07/22/ir-approves-tadali-ghugus-doubling-rail-line-project-in-maharashtra/
  This is the critical section for rakes from Ghugus/Wani to CSTPS and to Dhariwal (Tadali).

## 5. Dhariwal Infrastructure (CESC), Tadali, 2x300 MW – competing user of Tadali
- CEA daily report lists it as "DHARIWAL TPP", IPP section, mode RAIL, 600 MW:
  - 17-07-2026: daily req @85% PLF 7.8 kt; stock 137.8 kt; receipt 5.8 kt; consumption 8.5 kt.
  - 05-09-2026: daily req 7.8 kt; stock 98.2 kt; receipt 5.1 kt; consumption 8.8 kt.
  => ~1.5 - 2.5 rakes/day (approx 2 rakes/day at ~3.9 kt/rake).
- Coal: FSA with **SECL** (not WCL) operational since March 2016, 1.58 MTPA for unit 2 (long-term PPAs); 1.15 MTPA
  under SHAKTI for unit 1 medium-term PPAs; shortfall via e-auction/imports. ICRA rationale 14-Sep-2026:
  https://www.icra.in/Rating/ShowRationalReportFilePdfViewer/145562 ; Infomerics PR 26-Aug-2016:
  https://infomericstorage.blob.core.windows.net/uploads/pr_Dhariwal_Infrastructure_feb16_528e229a5b.pdf
- Since its coal comes mostly from SECL (Chhattisgarh) it arrives on the Nagpur-Ballarshah trunk from the north,
  i.e. it uses the Tadali station/siding but does NOT use the Tadali-Ghugus single-line branch; it does compete for
  Tadali yard capacity and for trunk-line paths Wardha-Tadali. Wikipedia: https://en.wikipedia.org/wiki/Dhariwal_Power_Station
- GMR Warora (600 MW, Warora, also Nagpur division, flagged critical 05-09-2026: stock 36.4 kt, req 7.9 kt/day) is
  another WCL-fed plant on the Wardha-Ballarshah route.

## 6. Other data sources checked
- MERIT (meritindia.in) – gives merit-order/variable cost, not coal logistics; not used.
- MAHAGENCO website – plant pages have no daily coal data; the EC compliance reports (links above) and the CPRI
  vetting report are the useful documents. A list of all CSTPS EC/compliance PDFs is at
  https://mahagenco.in/Environmental-Clearance
