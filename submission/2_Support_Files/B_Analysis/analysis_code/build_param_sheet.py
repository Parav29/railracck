"""Build RakeFlow_Parameter_Sheet.xlsx: every model input with value, distribution,
source URL and confidence, plus the passenger-timetable hour profile and the
data-gap register. Run from the project root: python scripts/build_param_sheet.py
"""
import csv, os
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "data", "RakeFlow_Parameter_Sheet.xlsx")

F = "Arial"
HDR = Font(name=F, bold=True, color="FFFFFF", size=10)
HFILL = PatternFill("solid", fgColor="1F3864")
INPUT = Font(name=F, color="0000FF", size=10)
BODY = Font(name=F, size=10)
BOLD = Font(name=F, bold=True, size=10)
YEL = PatternFill("solid", fgColor="FFFF00")
GREY = PatternFill("solid", fgColor="F2F2F2")
thin = Side(style="thin", color="BFBFBF")
BRD = Border(left=thin, right=thin, top=thin, bottom=thin)
WRAP = Alignment(wrap_text=True, vertical="top")

wb = Workbook()

# ---------------------------------------------------------------- Parameters
ws = wb.active
ws.title = "Parameters"
cols = ["ID", "Stage", "Parameter", "Unit", "Distribution", "Min", "Mode", "Max",
        "Fixed value", "Confidence", "Basis / notes", "Source URL", "Replace with field data?"]
ws.append(cols)

P = [
 # ID, stage, parameter, unit, dist, min, mode, max, fixed, conf, basis, url, replace
 ("INF-01","Infrastructure","Ghugus (GGS) - Tadali (TAE) single-line length","km","Fixed",None,None,None,14.11,"High",
  "Gazette of India 4 Jun 2026; RailPost 17 Jul 2026 (14 km). Station code is GGS, not GUGS.",
  "https://egazette.gov.in/WriteReadData/2026/273346.pdf","No"),
 ("INF-02","Infrastructure","Intermediate block stations on spur","count","Fixed",None,None,None,0,"Medium",
  "No intermediate station in any CR Nagpur division list; treat as ONE block section. Confirm with CR.",
  "https://en.wikipedia.org/wiki/Nagpur_CR_railway_division","Yes - ask CR"),
 ("INF-03","Infrastructure","Sectional speed on spur (loaded coal train)","km/h","Triangular",30,40,50,None,"Low",
  "Not published. IR average goods speed 23.8-25 km/h network-wide includes stops; branch-line MPS likely 50-75. Use as scenario.",
  "https://prsindia.org (Standing Committee on Railways 2024-25 summary)","Yes - ask CR"),
 ("INF-04","Infrastructure","Block occupancy, one train, 14 km (run + clearance)","min","Derived",25,31,38,None,"Medium",
  "Run time at 50/40/30 km/h = 17/21/28 min + ~7-10 min block clearance/line-clear (Scott's formula t = 1.5-6 min).",
  "research/ir_freight_stats_and_capacity.md","No"),
 ("INF-05","Infrastructure","Loops at Ghugus yard usable for stabling rakes","count","Fixed",None,None,None,2,"Low",
  "Not published. GGS has two sidings branching: GSG Ghugus Colliery siding (4 km), CESG ACC siding (2 km). ASSUMPTION.",
  "https://erail.in/stations/GGS","Yes - ask CR / site visit"),
 ("INF-06","Infrastructure","Loops at Tadali for freight reception","count","Fixed",None,None,None,2,"Low",
  "Not published. Tadali has goods shed, IOBT POL siding, PVIT coal siding, MDIT Dhariwal siding; Rs 26.94 cr 4th line + goods platform sanctioned Jan 2025.",
  "https://www.thehitavada.com/Encyc/2025/1/25/Rs-100-crore-works-ayed-for-upgradation","Yes - ask CR / OpenRailwayMap"),
 ("INF-07","Infrastructure","Tadali - Chandrapur main-line distance (loaded run to CSTPS)","km","Fixed",None,None,None,13,"Medium",
  "Tadali Jn to Chandrapur approx 13 km on Wardha-Balharshah double line (3rd line Tadali-Ballarshah opened 2025).",
  "https://en.wikipedia.org/wiki/Tadali","No"),
 ("INF-08","Infrastructure","Line capacity utilisation Wardha-Balharshah (UP / DN)","%","Fixed",None,None,None,"145 / 163","Medium",
  "Hitavada 2023 quoting CR; 3rd line under construction (67% Mar 2025), 4th line sanctioned May 2025 Rs 2318 cr.",
  "research/section_capacity_notes.md","No"),

 ("TT-01","Main-line traffic","Passenger/express trains through Chandrapur per day (DN southbound / UP northbound)","trains/day","Fixed",None,None,None,"20.7 / 20.0","High",
  "115 scheduled trains weighted by days of run = 285 passings/week. Only 2 MEMUs stop at Tadali. See sheet Timetable_Profile.",
  "https://erail.in/trains-between-stations/chandrapur-CD/balharshah-BPQ","No - refresh monthly"),
 ("TT-02","Main-line traffic","DN quiet window (freight paths for loaded rakes)","clock","Fixed",None,None,None,"20:30-06:20","High",
  "No daily DN train between 19:35 and 09:38 at CD; busiest 12:58-13:41 (5 daily trains).",
  "research/section_capacity_notes.md","No"),
 ("TT-03","Main-line traffic","Passenger train lateness at Chandrapur (per-train mean, last 3 months)","min","Empirical",0,30,90,None,"Medium",
  "etrain.info history tabs: 12723 at CD 26 min; 12724 86 min; 61127 at TAE 32 min. Collect for all 115 trains (template TT_lateness.csv).",
  "https://etrain.info/train/<slug>-<no>/history","Yes - scrape 90 days"),
 ("TT-04","Main-line traffic","Minimum headway behind/ahead of passenger train for a freight merge","min","Triangular",6,10,15,None,"Low",
  "IR practice 5-10 min absolute block headway on automatic/absolute sections; add margin for 3.9 kt train acceleration. ASSUMPTION.",
  "research/ir_freight_stats_and_capacity.md","Yes - ask CR"),

 ("LD-01","Loading (Ghugus)","Rakes loaded per day at Ghugus sidings (WCL)","rakes/day","Triangular",5,7.5,10,None,"Medium",
  "Dec 2018: 4-5 -> 7-8 rakes/day, plan 9-10. Plus NRS auction rakes via Ghugus Old Siding (peak 8/month). Doubling adds 4.5 MTPA = ~3 rakes/day.",
  "research/wcl_ghugus_loading.md","Yes - ask WCL Wani Area"),
 ("LD-02","Loading (Ghugus)","Loading method at Ghugus Old Siding","category","Scenario",None,None,None,"Pay-loader/CHP (not RLS)","Low",
  "MoEF compliance doc: Ghugus OC dispatches via Old Railway Siding with two CHPs and tippers; no silo/RLS reported. CONFIRM.",
  "research/wcl_ghugus_loading.md","Yes - ask WCL"),
 ("LD-03","Loading (Ghugus)","Loading time, BOXN rake, pay-loader/CHP","h","Triangular",4,6,9,None,"Medium",
  "RB free time 5 h (old) / 9 h manual; MCL pre-silo 8-10 h; CAG placement->release 5-56 h zonal avg.",
  "https://konkanrailway.com/node/5508","Yes"),
 ("LD-04","Loading (Ghugus)","Loading time, BOXN rake, RLS/silo (scenario)","h","Triangular",1,1.5,3,None,"Medium",
  "CCL Karo/Konar: 5 h -> 1 h (PIB); MCL Basundhara ~90 min; current RB free time 3 h at sidings loading >=2 rakes/day.",
  "https://www.coal.nic.in/sites/default/files/2024-10/PIB2062752.pdf","No (scenario)"),
 ("LD-05","Loading (Ghugus)","Railway free time for loading coal rake (demurrage clock)","h","Fixed",None,None,None,3,"High",
  "RB letter TC-I/2019/201/6-Part(2) 22.01.2024: 5 h -> 3 h where >=2 coal rakes/day loaded from single line.",
  "https://indianrailways.gov.in/railwayboard/uploads/directorate/traffic_comm/Rates-Letters/2024/free%20time%20for%20loading%20and%20unloading%20of%20rakes%20of%20Coal%20and%20Iron%20Ore%20-Power%20to%20Zone%20dated%2012_04_2024.pdf","No"),
 ("LD-06","Loading (Ghugus)","Arrival at siding -> placement on loading line","h","Triangular",0.5,1,4,None,"Medium",
  "CAG 31/2014 Table 18 zonal averages 0.5-10 h; railway allowance 1 h.",
  "https://cag.gov.in/uploads/download_audit_report/2014/Union_Performance_Railways_Management_Goods_trains_31_2014_chapter_7.pdf","Yes"),
 ("LD-07","Loading (Ghugus)","Release -> ready to despatch (paperwork, BPC check, loco attach)","h","Triangular",0.8,1.5,6,None,"Medium",
  "CAG Table 18 release->despatch 0.8-21 h zonal avg.",
  "same as LD-06","Yes"),
 ("LD-08","Loading (Ghugus)","Loading siding working hours","clock","Fixed",None,None,None,"24x7 (assumed)","Low",
  "Mechanised CHP sidings normally work round the clock; pay-loader sidings sometimes daylight only. CONFIRM.",
  "-","Yes - ask WCL"),

 ("CR-01","Crew","Max running duty before relief (planning)","h","Fixed",None,None,None,9,"High",
  "RBE 143/2016: running duty should not ordinarily exceed 9 h.",
  "https://www.airfindia.org/2016/12/04/recommendations-of-the-high-power-committeehpc-to-review-the-duty-hours-of-running-staff-decisions-thereof-rbe-1432016/","No"),
 ("CR-02","Crew","Extension if >=2 h notice given before 9 h expires","h","Fixed",None,None,None,"up to 11 (12 exigency)","High",
  "RBE 143/2016 total sign-on to sign-off <= 11 h; RB Oct 2023 absolute cap 12 h.",
  "same as CR-01","No"),
 ("CR-03","Crew","Sign-on to departure (booking, loco/BPC check)","h","Triangular",0.5,0.75,2,None,"Medium",
  "CAG 47/2015: sign-on 10-45 min before ordering; 68% approvals >30 min; CMS pre-departure detention.",
  "https://cag.gov.in/webroot/uploads/download_audit_report/2015/Union_Performance_Railways_Crew_mgmt_Report_47_2015.pdf","Yes"),
 ("CR-04","Crew","Relief-crew arrival when crew expires en route (stabled train)","h","Triangular",1,2.5,6,None,"Low",
  "No published norm. CAG: 18% of late-started goods trains for want of crew/path. CALIBRATE.",
  "same as CR-03","Yes - ask CR crew lobby"),
 ("CR-05","Crew","Crew booking point for Ghugus coal links","place","Fixed",None,None,None,"Balharshah / Chandrapur (assumed)","Low",
  "Ballarshah is the major crew-change and interchange point (SCR ~50 trains/day). CONFIRM which lobby books Ghugus crews.",
  "https://www.thehitavada.com/Encyc/2025/11/4/eyeing-3000-mt-loading-rlys-plans-to-end-detention-at-inter-changes.html","Yes - ask CR"),
 ("CR-06","Crew","Outstation rest before next duty","h","Fixed",None,None,None,"6 (duty 5-8 h) / 8 (duty >=8 h)","High",
  "RB circular 03.06.2025.","research/ir_norms_crew.md","No"),
 ("CR-07","Crew","HQ rest before next duty","h","Fixed",None,None,None,"12 (<8 h duty) / 16 (>=8 h)","High",
  "IREM Rule 1511.","https://indianrailways.gov.in/railwayboard/uploads/directorate/establishment/estbl-chap15-p01-p16.htm","No"),

 ("BPC-01","BPC / examination","CC rake BPC validity","km / days","Fixed",None,None,None,"6000 km or 30 days (A depot)","High",
  "JPO via IRIMEE; 7500 km/35 days at Special A depot; +5 days grace toward base depot.",
  "https://rskr.irimee.in/sites/default/files/Pattern%20of%20freight%20train%20examination.pdf","No"),
 ("BPC-02","BPC / examination","Intensive CC examination duration","h","Triangular",6,8,12,None,"High",
  "JPO: 100 man-h or 8 h, gang 2 examiners + 12 staff + welder.",
  "https://rskr.irimee.in/sites/default/files/Freight%20Train%20examination.pdf","No"),
 ("BPC-03","BPC / examination","Examination window","clock","Fixed",None,None,None,"06:00-18:00 daylight","High",
  "JPO: CC rakes examined in daylight only unless 100-150 lux lighting.","same as BPC-01","No"),
 ("BPC-04","BPC / examination","Wait at base depot before exam placement","h","Triangular",0.5,2,10,None,"Medium",
  "CAG Table 18 arrival->placement ranges.","research/ir_norms_bpc_examination.md","Yes"),
 ("BPC-05","BPC / examination","Share of CC rakes exceeding km validity (compliance reality)","%","Fixed",None,None,None,"37-39","Medium",
  "CAG 31/2014: 39% of 6000-km BPC rakes overran by 789-884 km.","same as LD-06","No"),
 ("BPC-06","BPC / examination","Nominated base examination depot for Ghugus CC rakes","place","Fixed",None,None,None,"Ballarshah / Ajni (assumed)","Low",
  "Not published. CONFIRM with CR Mechanical (Sr DME Nagpur).","-","Yes - ask CR"),
 ("BPC-07","BPC / examination","Sick-wagon detach probability at exam / repair time","% / h","Triangular",6,9,24,"model input","Low",
  "CAG sick-line turnout norm 9 h; JPO allows <=4 wagons replaced.","research/ir_norms_bpc_examination.md","Yes"),

 ("UL-01","Unloading (CSTPS)","Wagon tipplers at CSTPS","count","Fixed",None,None,None,5,"Medium",
  "2 at CHP-B (1992 L&T) + 3 at CHP-D (2016 Elecon); track hoppers at CHP-B/C for BOBRN. No MGR.",
  "research/unloading_facilities.md","Yes - confirm"),
 ("UL-02","Unloading (CSTPS)","Unloading time, BOXN rake, rotary tippler","h","Triangular",2,4,7,None,"Medium",
  "BigMint 2-3 h rapid tippler; RB free time 7 h; IIMA 2004 mean 14 h (sd 4) was 2-tippler 490 MW plant era.",
  "https://www.bigmint.co/insights/detail/indias-coal-supply-chain-strong-on-output-weak-on-delivery-747729","Yes"),
 ("UL-03","Unloading (CSTPS)","Railway free time for mechanised unloading of open wagons","h","Fixed",None,None,None,7,"High",
  "Rates Master Circular 2016 / CR ARN 136/2024; hopper 2.5 h; manual 9 h.",
  "https://cr.indianrailways.gov.in/cris/uploads/files/1731569594339-ARN%20No%20136%20of%202024%20Goods.pdf","No"),
 ("UL-04","Unloading (CSTPS)","Demurrage rate","Rs/wagon/h","Fixed",None,None,None,150,"High",
  "Corrigendum 32 (13.09.2022); graded +10/25/50%, 2x, 3x beyond 6/12/24/48/72 h.",
  "https://sr.indianrailways.gov.in/cris//uploads/files/1751884201884-waier%20updated%2030062025.pdf","No"),
 ("UL-05","Unloading (CSTPS)","Arrival at CSTPS siding -> placement at tippler","h","Triangular",0.6,2,8,None,"Medium",
  "CAG Table 18 unloading arrival->placement 0.6-15 h zonal avg.","same as LD-06","Yes"),
 ("UL-06","Unloading (CSTPS)","Release -> despatch empty","h","Triangular",1.5,3,8,None,"Medium",
  "CAG Table 18 1.5-11 h.","same as LD-06","Yes"),

 ("DM-01","Demand","CSTPS normative coal requirement at 85% PLF","kt/day","Fixed",None,None,None,47.8,"High",
  "CEA daily coal report (49.5 late 2025). 2920 MW rail-fed.",
  "https://npp.gov.in/public-reports/cea/daily/fuel/02-06-2026/dailyCoal1-2026-06-02.pdf","No - refresh"),
 ("DM-02","Demand","CSTPS actual consumption (PLF 50-58%)","kt/day","Triangular",18.7,33,47.8,None,"High",
  "9 CEA daily reports Jul 2024 - Sep 2026; median ~33 kt.","research/cstps_coal_demand.md","No - collect 90 days"),
 ("DM-03","Demand","CSTPS daily receipt","kt/day","Empirical",3.9,30,47.5,None,"High",
  "Same CEA reports; implies ~6-10 rakes/day by rail (peak ~12); also ~7 kt/day by ropeway/conveyor.",
  "research/cstps_coal_demand.md","No - collect 90 days"),
 ("DM-04","Demand","Rakes/day arriving CSTPS by rail (all origins)","rakes/day","Triangular",6,8,12,None,"Medium",
  "Derived from DM-03 / 3.9 kt per rake minus non-rail modes. Ghugus share unknown.","derived","Yes - ask CSTPS"),
 ("DM-05","Demand","Dhariwal TPP (Tadali, 600 MW) rakes/day sharing Tadali yard","rakes/day","Fixed",None,None,None,2,"Medium",
  "CEA: requirement 7.8 kt/day, receipt 5-6 kt/day; coal from SECL so uses main line + Tadali yard, not the Ghugus spur.",
  "research/cstps_coal_demand.md","No"),

 ("RK-01","Rake","Wagons per rake (BOXN/BOXNHL)","count","Fixed",None,None,None,58,"High",
  "CR record day 2448 wagons / 42 rakes = 58.3.","research/rake_payload_norms.md","No"),
 ("RK-02","Rake","Payload per rake","t","Triangular",3700,3900,4150,None,"High",
  "CR 2024-25 aggregate 3990 t/rake; BOXN CC 58.8 t/wagon, CC+8+2 ~66 t; BOXNHL 71 t.","research/rake_payload_norms.md","No"),
 ("RK-03","Rake","Closed-circuit rakes in Ghugus-CSTPS pool","count","Decision var",4,8,14,None,"Low",
  "Unknown. Decision variable in experiments. CT ~ 20-30 h and 7 rakes/day implies 7-9 rakes circulating.","-","Yes - ask CR"),

 ("ST-01","Benchmarks","IR average freight train speed","km/h","Fixed",None,None,None,"23.8 (2024-25); 25.14 (2013-24)","High",
  "Standing Committee on Railways Dec 2024; PRS summary.","research/cr_freight_statistics.md","No"),
 ("ST-02","Benchmarks","CR Nagpur division wagon turnround","days","Fixed",None,None,None,"1.46 (2024-25) vs 1.54","High",
  "CR Highlights 2024-25. IR network WTR 5.11 days (2023-24).",
  "https://cr.indianrailways.gov.in/cris//uploads/files/1753868156096-Highlights%202024-25.pdf","No"),
 ("ST-03","Benchmarks","Nagpur division coal rakes loaded per day","rakes/day","Fixed",None,None,None,"26-29","High",
  "May 2024: 910 coal rakes/month; FY25 to Jan: 6723 coal rakes. The '100+ rakes/day' figure is NOT supported.",
  "research/wcl_ghugus_loading.md","No"),
 ("ST-04","Benchmarks","Railway Board target total terminal detention per rake","h","Fixed",None,None,None,16,"High",
  "CAG 31/2014 para 3.2.5; CR yard detention norm 15 h.","same as LD-06","No"),
 ("ST-05","Benchmarks","Agreed vs actual coal rake turnaround (industry)","h","Fixed",None,None,None,"48-72 agreed; 96-120 summer actual","Medium",
  "BigMint industry analysis (secondary).","same as UL-02","No"),
]

for row in P:
    ws.append(list(row))

widths = [8, 18, 46, 10, 12, 7, 7, 7, 22, 10, 60, 50, 20]
for i, w in enumerate(widths, 1):
    ws.column_dimensions[get_column_letter(i)].width = w
for c in ws[1]:
    c.font = HDR; c.fill = HFILL; c.alignment = WRAP; c.border = BRD
for r in ws.iter_rows(min_row=2, max_row=ws.max_row):
    for c in r:
        c.font = BODY; c.alignment = WRAP; c.border = BRD
    for idx in (5, 6, 7, 8):  # distribution params are editable inputs
        r[idx].font = INPUT
    if str(r[9].value) == "Low":
        r[9].fill = YEL
ws.freeze_panes = "A2"
ws.auto_filter.ref = ws.dimensions

# Expected value helper column (triangular mean) -------------------------------
ws.cell(row=1, column=14, value="Tri mean (h)").font = HDR
ws.cell(row=1, column=14).fill = HFILL
ws.column_dimensions["N"].width = 12
for rr in range(2, ws.max_row + 1):
    ws.cell(row=rr, column=14, value=f'=IF(AND(ISNUMBER(F{rr}),ISNUMBER(G{rr}),ISNUMBER(H{rr})),(F{rr}+G{rr}+H{rr})/3,"")').font = BODY
    ws.cell(row=rr, column=14).border = BRD

# ---------------------------------------------------------------- Legend
lg = wb.create_sheet("Legend")
legend = [
 ("RakeFlow parameter sheet - how to use", BOLD),
 ("Blue cells (Min / Mode / Max / Fixed value) are editable inputs. Change them and the Tri mean column recalculates.", BODY),
 ("Yellow Confidence = Low: an assumption that must be replaced by field data or a CR/WCL interview before final runs.", BODY),
 ("'Replace with field data?' tells the team which CSV template in data/templates to fill for that parameter.", BODY),
 ("Distribution types: Triangular(min,mode,max); Fixed; Empirical (fit from collected data); Scenario (model switch); Decision var (varied in experiments).", BODY),
 ("Every value carries a Source URL or a pointer to a file in research/ where the full citation is kept.", BODY),
 ("", BODY),
 ("Station codes: Ghugus = GGS, Tadali = TAE, Chandrapur = CD, Balharshah = BPQ, Wardha = WR.", BODY),
 ("Last refreshed: 13 Oct 2026 from public sources only; no Central Railway / WCL internal data yet.", BODY),
]
for t, f in legend:
    lg.append([t]); lg.cell(row=lg.max_row, column=1).font = f
lg.column_dimensions["A"].width = 120

# ---------------------------------------------------------------- Timetable profile
tt = wb.create_sheet("Timetable_Profile")
tt.append(["train_no","train_name","type","direction","cd_arr","cd_dep","tae_arr","tae_dep","days","days_per_week","hour_at_CD","weekly_weight"])
with open(os.path.join(ROOT, "research", "timetable_tadali_chandrapur.csv")) as f:
    rows = list(csv.DictReader(f))
for i, r in enumerate(rows, start=2):
    bits = r["days_bits_MTWTFSS"]
    dpw = sum(int(b) for b in bits) if bits and set(bits) <= {"0","1"} else 7
    t = r["cd_dep"] or r["cd_arr"]
    tt.append([r["train_no"], r["train_name"], r["type"], r["direction"], r["cd_arr"], r["cd_dep"],
               r["tae_arr"], r["tae_dep"], r["days"], dpw,
               f'=IF(F{i}<>"",VALUE(LEFT(F{i},2)),VALUE(LEFT(E{i},2)))', f"=J{i}/7"])
for c in tt[1]:
    c.font = HDR; c.fill = HFILL; c.border = BRD
for col, w in zip("ABCDEFGHIJKL", [9, 34, 7, 18, 8, 8, 8, 8, 12, 10, 10, 12]):
    tt.column_dimensions[col].width = w
tt.freeze_panes = "A2"
n = len(rows) + 1

# hourly histogram (expected passings per day by hour and direction)
hs = wb.create_sheet("Hourly_Profile")
hs.append(["hour", "DN south (loaded rakes merge here)", "UP north (empties)", "Total", "DN quiet? (<0.5/day)"])
for h in range(24):
    r = h + 2
    hs.append([h,
        f'=SUMPRODUCT((Timetable_Profile!$K$2:$K${n}=A{r})*(LEFT(Timetable_Profile!$D$2:$D${n},2)="DN")*Timetable_Profile!$L$2:$L${n})',
        f'=SUMPRODUCT((Timetable_Profile!$K$2:$K${n}=A{r})*(LEFT(Timetable_Profile!$D$2:$D${n},2)="UP")*Timetable_Profile!$L$2:$L${n})',
        f"=B{r}+C{r}", f'=IF(B{r}<0.5,"quiet","")'])
hs.append(["Total/day", "=SUM(B2:B25)", "=SUM(C2:C25)", "=SUM(D2:D25)", ""])
for c in hs[1]:
    c.font = HDR; c.fill = HFILL; c.border = BRD; c.alignment = WRAP
for col, w in zip("ABCDE", [8, 30, 18, 8, 18]):
    hs.column_dimensions[col].width = w
for row in hs.iter_rows(min_row=2, max_row=26):
    for c in row[1:4]:
        c.number_format = "0.00"
hs["A28"] = "Expected passenger passings per day at Chandrapur, by hour of departure. Weighted by days of run / 7. Source: erail.in via research/timetable_tadali_chandrapur.csv."
hs["A28"].font = BODY

# ---------------------------------------------------------------- Data gaps
gp = wb.create_sheet("Data_Gaps")
gp.append(["#", "Gap", "Why it matters for the model", "Best way to close it", "Template", "Owner", "Status"])
gaps = [
 (1,"Loops / stabling capacity at Ghugus and Tadali","Caps how many rakes can wait at each end of the single line; drives W_single","Ask CR Nagpur Sr DOM; or trace OpenRailwayMap; or site visit","-","", "Open"),
 (2,"Sectional speed and block working type on spur","Sets block occupancy time (INF-04)","Ask CR; Working Time Table (WTT) Nagpur division","-","","Open"),
 (3,"Loading method and time at Ghugus Old Siding","Largest single service time; RLS vs pay-loader changes CT by 4-6 h","Ask WCL Wani Area GM / siding in-charge; MoEF compliance docs","LD_loading_events.csv","","Open"),
 (4,"Rakes/day actually loaded at Ghugus for CSTPS","Arrival rate of the system","WCL rake seniority lists (docs.westerncoal.in); CR FOIS summary","LD_loading_events.csv","","Open"),
 (5,"Crew booking point and relief practice for Ghugus coal links","Determines where crew clock starts and relief delay","CR crew lobby (Balharshah / Chandrapur) interview","CR_crew_events.csv","","Open"),
 (6,"Nominated BPC base depot for these CC rakes","Where examination detour happens and its daylight constraint","CR Sr DME Nagpur","BPC_exam_events.csv","","Open"),
 (7,"CSTPS tippler availability and actual unloading hours","Second largest service time","MAHAGENCO CSTPS coal handling; CEA reports; demurrage bills","UL_unloading_events.csv","","Open"),
 (8,"90-day passenger lateness per train at CD","Digital-twin daily refresh input; slot uncertainty","Scrape etrain.info history tabs for all 115 trains (scripts/scrape_lateness.py to be written)","TT_lateness.csv","","Open"),
 (9,"90-day CSTPS daily coal receipt / stock","Demand and arrival calibration","Download CEA daily PDFs (URL pattern in research/cstps_coal_demand.md)","DM_cstps_daily.csv","","Open"),
 (10,"Rake-level cycle log (any weeks)","Direct fit of every distribution; validation target","Request FOIS/COA extract via data request letter (docs/)","RAKE_cycle_log.csv","","Open"),
]
for g in gaps:
    gp.append(list(g))
for c in gp[1]:
    c.font = HDR; c.fill = HFILL; c.border = BRD; c.alignment = WRAP
for col, w in zip("ABCDEFG", [4, 44, 46, 50, 24, 12, 10]):
    gp.column_dimensions[col].width = w
for row in gp.iter_rows(min_row=2, max_row=gp.max_row):
    for c in row:
        c.font = BODY; c.alignment = WRAP; c.border = BRD
    row[5].fill = YEL; row[6].fill = YEL

wb.save(OUT)
print("saved", OUT)
