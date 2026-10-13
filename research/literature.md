# Literature: simulation / modelling of Indian coal-rake cycles, rake turnround and rail terminals

Each entry: citation, URL, what was modelled, and the numeric parameters reported that
are usable for a triangular-distribution DES of a coal rake cycle. Entries marked
[no numbers] were checked and give no activity-time data in the accessible text.

---

## A. Directly on Indian coal rakes / power-plant unloading

1. **Bhatnagar A., Gupta R., Pappu S., Dutta G. (2004). "Mathematical Modeling for
   Demurrage Reduction in Coal Transportation for an Indian Thermal Power Plant."
   IIMA Working Paper WP 2004-09-06.**
   PDF: https://iima.ac.in/sites/default/files/rnpfiles/2004-09-06gdutta.pdf
   Abstract: https://www.iima.ac.in/publication/mathematical-modeling-demurrage-reduction-coal-transportation-indian-thermal-power-plant
   * 490 MW plant, ~4,600 t/day coal, ~1.5 rakes/day; rake = 56-58 wagons x 56-58 t
     (~3,300 t); 3 inlet lines, 1 outlet, 2 wagon tipplers, 2 x 100 t weighbridges, waiting
     room 6 rakes; mine distance ~1,250 km.
   * Inter-arrival times observed 0.1-1.9 days (27 months of logbooks); arrival
     processes tested: deterministic, Uniform(6,14) h, Exp(mean 14 h), N(14,4), N(12,4),
     N(10,4) h.
   * **Unloading time per rake: mean 14 h, sd 4 h** (current); scenarios 6-14 h.
   * **Free unloading time (then) 10 h**; mean demurrage ~4.0 h/rake in all arrival
     scenarios (Table 4: 4.001-4.028 h); "successive detention" (queueing behind
     previous rake) explains R^2 = 0.85 of demurrage; Table 3 cause-wise demurrage
     hours per rake 1.5-12.4.
   * Use: unloading-service-time distribution shape (approx. normal, CV ~0.3) and the
     insight that terminal queueing, not the service itself, drives demurrage.

2. **Mukherjee A., Som A., Adak A., Raj P., Kirtania S. (2012). "Augmenting an Inbound
   Raw Material Handling System of a Steel Plant by Uncovering Hidden Logistics
   Capacity." Proc. Winter Simulation Conference 2012 (Dastur, Kolkata).**
   https://www.informs-sim.org/wsc12papers/includes/files/con273.pdf
   (also https://promodel.com/media/pdf/PR-ML-Dastur.pdf)
   * ProModel DES of an Indian integrated steel plant's raw-material unloading yard
     (iron ore, coal, coke, limestone rakes). One year of rake-arrival data fitted
     (distribution not named).
   * Table 4 mean stage times (minutes) for **coal rake to tippler**: wait arrival ->
     release of railway engine t0 = 365; release -> departure Yard 1 t1 = 144; travel to
     tippler t2 = 61; **unloading t3 = 828 (13.8 h)**; post-unloading handover t4 = 126;
     total T = 1,159 min (19.3 h). Iron-ore rake: t3 = 251 min, T = 348. Coke T = 410.
   * Coal tippler utilisation 26-30%; plant loco utilisation 71%; adding locos did not
     raise capacity (track-bound). Traditional expansion implied 14.5 h average
     demurrage per coal rake.

3. **Mukherjee A., Som A., Adak A. (2013). "Reducing Wagon Turnaround Times by
   Redesigning the Outbound Dispatch Operations of a Steel Plant." Proc. WSC 2013.**
   https://informs-sim.org/wsc13papers/includes/files/309.pdf
   * Loading-side DES; current wagon turnaround ~24 h vs Railway's new 6 h limit.
   * Table 2 railway-side activity ranges (min): pre-loading 25-30; wagon preparation
     50-60; **train examiner (TXR) activities 50-60**; documentation 25-30; total
     rail-involved time <= 180 min. Loading 160-180 min with efficient cranes.
   * Breakdown of 24 h: loading 27%, weighing 32%, internal movement 13%, receipt 5%,
     tare weighing 4%, placement 5%, waiting for full rake 7%, documentation 7%.

4. **Shambharkar S. et al. (2015). "Simulation of Intra & Inter Yard Movement ... Indian
   Steel Industry." Proc. WSC 2015 (Tata Steel).** [no numbers for rake times]
   https://www.informs-sim.org/wsc15papers/102.pdf

5. **Manikutty S., Raghuram G., Venkata Rao V. (1992). "Simulation Models to Evaluate
   Railway Operating Policies." IIMA WP 1992-04-01.**
   https://ideas.repec.org/p/iim/iimawp/wp01096.html
   * Two IR simulations: loco assignment at a junction for iron-ore trains; and a 43 km
     double-line section with 5 originating/terminating stations for coal and cement,
     evaluating twin-single-line working, line capacity and section travel time.
     [parameters not in abstract]

6. **Raghuram G. et al. "A Decision Support System for Improving Railway Line
   Capacity." IIMA.** https://iima.ac.in/publication/decision-support-system-improving-railway-line-capacity
   [IR line-capacity DSS; numbers not accessible]

## B. Official audits and committee reports with activity-time distributions

7. **C&AG Report No. 31 of 2014, "Management of Goods Trains in Indian Railways."**
   Ch. 3-4: https://cag.gov.in/uploads/download_audit_report/2014/Union_Performance_Railways_Management_Goods_trains_31_2014_chapter_7.pdf
   Exec summary: https://cag.gov.in/uploads/download_audit_report/2014/Union_Performance_Railways_Management_Goods_trains_31_2014_chapter_5_Exe_Summ.pdf
   * Table 18 stage-wise detention ranges (see ir_freight_stats_and_capacity.md);
     32% of wagons detained > 24 h at terminals; 16 h envisaged; speed histogram 71% /
     17% / 12% for <= 20, 20-40, 40-100 km/h; BPC overrun 37-39% of CC rakes; late
     starts 63% loco / 18% crew+path; sick-line norm 9 h.

8. **C&AG Report No. 47 of 2015, "Crew Management in Indian Railways."**
   https://cag.gov.in/webroot/uploads/download_audit_report/2015/Union_Performance_Railways_Crew_mgmt_Report_47_2015.pdf
   * Sign-on 10-45 min before ordering; 26% late sign-on; 68% sign-on approvals > 30
     min; 8% of crews > 10 h continuous running; call-acknowledgement distribution.

9. **Public Accounts Committee, 36th Report (18th Lok Sabha), "Punctuality and travel
   time in Indian Railways" (follow-up to C&AG Report 22 of 2021).**
   https://eparlib.sansad.in/bitstream/123456789/3017115/1/18_Public_Accounts_36.pdf
   * Goods speed 23.6 km/h (2019-20); interchange detention ranges 66-262 min at NKJ,
     BHC, ITR; line utilisation 137-175% on NCR/ECR sections.

10. **Standing Committee on Railways (Dec 2025), "Increasing Freight Related Earnings
    ... Dedicated Freight Corridors" (PRS summary).**
    https://prsindia.org/files/policy/policy_committee_reports/Railways_enhancing_freight_revenue.pdf
    * Freight speed 23.8 km/h (2024-25); DFC 37 km/h; coal ~50% of freight earnings.

11. **Indian Railways Annual Report & Accounts 2023-24.**
    https://indianrailways.gov.in/railwayboard/uploads/directorate/stat_econ/2025/Indian%20Railways%20Annual%20Report%20%20Accounts%202023-24%20-English.pdf
    * WTR 5.11 days; speed 25.00 km/h; 192 wagon-km/wagon-day; 1,899 t net per train.

## C. Line-capacity theory used in India

12. **Sangphong O., Siridhara S., Ratanavaraha V. (2017). "Determining Critical Rail
    Line Blocks and Minimum Train Headways..." Engineering Journal 21(3).**
    https://engj.eng.chula.ac.th/ej/article/download/1266/580
    * States Scott's formula C = 1440/(T+t) x E; 8 km block -> 10 min headway; 50 km/h
      freight braking distance 400 m -> 600 m minimum block.

13. **"Who is Scott?" Business Standard, 05.10.2017 (IR line-capacity practice).**
    https://business-standard.com/amp/article/opinion/who-is-scott-117100501278_1.html
    * 1440 - 120 maintenance = 1320 min; divide by (slowest running time + section
      preparation time); x 70%; 40% of 1,219 sections > 100% in 2015 White Paper.

14. **Nippon Foundation / JICA (1996), "Seminar on Railway Modernization in Myanmar",
    s.4 Block system for single-track sections.**
    https://nippon.zaidan.info/seikabutsu/1996/00501/contents/096.htm
    * N = 1440 f/(T + C); block handling C = 2.5 min (tablet), 1.5 min (automatic);
      f = 0.5-0.75.

15. **Shukla U. (2026). "Track Allocation in Indian Railways..." UCLA capstone; policy
    brief "A Corridor Pilot for Better Track-Time Governance in Indian Railways".**
    https://escholarship.org/uc/item/0sn0942s ; https://rosap.ntl.bts.gov/view/dot/92706
    [reviews IR line-capacity and maintenance-block rules; no numbers in accessible text]

## D. Industry / press sources on loading technology (secondary)

16. BigMint (2026), "India's coal supply chain: strong on output, weak on delivery."
    https://www.bigmint.co/insights/detail/indias-coal-supply-chain-strong-on-output-weak-on-delivery-747729
    * Silo loading 8-10 h -> ~90 min; unloading 2-3 h (rapid), 6-8 h (grab), 12-15 h
      (manual); agreed turnaround 48-72 h vs 96-120 h summer.
17. Ministry of Coal PIB 2062752 (Karo/Konar CHP): loading 5 h -> 1 h.
    https://www.coal.nic.in/sites/default/files/2024-10/PIB2062752.pdf
18. Bulk-online RLS thread: IR allows 4 h to load a rake (previously 10, then 6-7 h);
    5,500 tph chute. https://www.bulk-online.com/en/node/60840
19. Indiainfrahub (Jan 2022): hopper-rake unloading ~3 h.
    https://indiainfrahub.com/news/road-map-in-place-for-supplying-rakes-to-long-distance-thermal-power-stations-says-railways/

## E. Gaps

* No peer-reviewed Indian paper was found that publishes fitted distributions for the
  full coal rake cycle (loading, BPC examination, crew, en-route). The IIMA 2004 paper
  (unloading N(14,4) h) and the Dastur WSC 2012/2013 papers (stage means and ranges)
  are the closest. FOIS-based detention distributions exist only in CAG summaries
  (ranges and >24 h shares), not as raw histograms.
