# Central Railway / Indian Railways freight operating statistics

Research date: 2026-10-13.

## 1. Average speed of freight trains

| Figure | Value | Source |
|---|---|---|
| IR network average freight speed, 2013-24 | **25.14 km/h** ("stagnant at ~25 km/h over the last 11 years") — Parliamentary Standing Committee on Railways report tabled 13 Dec 2024 | https://www.maritimegateway.com/increasing-average-speed-of-freight-trains-is-of-prime-importance-report/ ; https://indiaseatradenews.com/rail-freight-in-india-slow-speeds-and-missed-opportunities/ |
| IR network average freight speed, 2024-25 | **23.8 km/h** ("due to prioritisation of passenger trains and ongoing works"); DFC average **37 km/h** — PRS summary of Standing Committee report | https://prsindia.org/files/policy/policy_committee_reports/Railways_enhancing_freight_revenue.pdf |
| Central Railway-specific average goods speed | **Not published** in the CR documents accessed (CR Highlights 2024-25, About Us Dec 2023). Use IR network values above. | https://cr.indianrailways.gov.in/cris//uploads/files/1753868156096-Highlights%202024-25.pdf |

## 2. Wagon turnround (Nagpur division / CR)

| Figure | Value | Source |
|---|---|---|
| Wagon turnround 2024-25 vs 2023-24 | **1.46 wagon-days vs 1.54** (−5.2 %); wagon-km per wagon-day 187 vs 177 (+5.6 %); NTKM per wagon-day 7,409 vs 6,810 (+8.8 %) | https://cr.indianrailways.gov.in/cris//uploads/files/1753868156096-Highlights%202024-25.pdf |
| Wagon turnround, FY25 to Jan-25 | 1.49 vs 1.69 wagon-days (−6.9 %) | https://cr.indianrailways.gov.in/cris//uploads/files/1740559903393-high%20lights.pdf |
| Freight interchange, Nagpur division | 228.6 trains/day (vs 222.3, +2.8 %), FY25 to Jan-25; punctuality 80.55 % | same |

(These two "Highlights" PDFs are hosted by CR and contain Nagpur-division-specific items — Tadali-Ghuggus caution orders, Majri–Tadali CRS, Hinganghat EI etc. — so the turnround figures are taken to be Nagpur division's; the documents do not say so explicitly.)

## 3. Detention / interchange delays (Nagpur area, Nov 2025)

| Location | Trains/day | Detention / crossing time | Source |
|---|---|---|---|
| Ballarshah, interchange with SCR | ~50 | 72 min | https://www.thehitavada.com/Encyc/2025/11/4/eyeing-3000-mt-loading-rlys-plans-to-end-detention-at-inter-changes.html |
| Ballarshah, interchange with SECR | ~50 | ~207 min | same |
| Nagpur station end (CR) | up to 34 | ~204 min | same |
| Nagpur end (SECR side) | ~35 | ~102 min | same |
| Godhni (with CR) | ~26 | ~67 min | same |
| Kiratgarh (SCR) | ~36 | ~30 min | same |
| Parasia (with SCR) | ~7 | ~138 min | same |
| Pimpalkuti crossover to SCR | ~5.5 rakes | n/a | same |
| Rail modal share | 27–29 % (2024-25) vs road 65–70 %; target 45 % by 2030-31; 3,000 MT IR loading goal | same |

Detention at WCL sidings specifically: **not published**; FOIS FAQ gives demurrage Rs 150/wagon/hour and says free time varies by terminal (https://fois.indianrail.gov.in/RailSAHAY/pages/FAQs.jsp).

## 4. Loading volumes

| Figure | Value | Source |
|---|---|---|
| Central Railway 2024-25 | 67.11 MT loading, Rs 7,217 crore (zonal) | https://indiaseatradenews.com/central-railway-records-freight-loading-of-67-11mt-fetches-%E2%82%B97217-crore-for-the-2024-25-fiscal/ ; https://indianinfrastructure.com/?p=207478 |
| Central Railway April 2026 | 6.72 MT (+2 %), 2,582 rakes, Rs 708 crore; Nagpur 3.97 MT / Rs 432 crore; Mumbai 1.59; Solapur 0.59; Bhusaval 0.43; Pune 0.14 | https://indianinfrastructure.com/2026/05/14/central-railway-achieves-freight-loading-of-6-72-mt-during-april-2026/ |
| Nagpur division 2022-23 | 44.39 MT, >54 % of CR; coal ≈ 90 %; 668/958.70 BG route-km electrified; 94 block stations; 26 IBS | https://cr.indianrailways.gov.in/cris//uploads/files/1705659988988-About%20us%20Dec23.pdf |
| Nagpur division 2024-25 | 45.47 MT (vs 50.05 MT), cement 94 units/day (+18.5 %), clinker −138 rakes, iron ore −228 rakes, containers −207 rakes | https://cr.indianrailways.gov.in/cris//uploads/files/1753868156096-Highlights%202024-25.pdf |
| Nagpur division monthly rake rate | May 2024: 1,142 rakes (≈37/day), coal 910 (≈29/day) | https://indiaseatradenews.com/central-railways-nagpur-division-records-freight-earnings-of-rs-427-cr-for-may/ |

## 5. Derived parameters for the simulation

- Tonnes per coal rake ≈ 2.14 MT / 536 rakes ≈ **3,990 t** (CR Highlights 2024-25).
- Section running speed: use 23.8–25 km/h network average as a conservative mean; allow 30–40 km/h on a short, light-traffic spur as an optimistic case.
- Wagon turnround 1.46 days is a system-level KPI for validating an extended (Ghugus → power plant → return) model, not the 14 km section alone.
- Interchange/junction detentions of 1–3.5 h at Ballarshah/Nagpur indicate the main-line side can block departures from Tadali; model main-line slot availability as a stochastic delay (mean ~1–2 h).
