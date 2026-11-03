# Coal rake composition and payload norms (Indian Railways)

Research date: 2026-10-13.

## 1. Wagon specifications (RDSO / IRIMEE / IRFCA)

Sources:
- IRIMEE (Indian Railways Institute of Mechanical & Electrical Engineering) training note "Types of wagon stock":
  https://rskr.irimee.in/sites/default/files/TYPES%20OF%20WAGON%20STOCK.pdf
- IRIMEE note on stainless steel / higher axle load wagons (BOXNHL design data):
  https://rskr.irimee.in/sites/default/files/Stainless%20steel%20wagons%2C%20Aluminium%20wagons%2C%20Higher%20Axle%20load%20wagons.pdf
- IRFCA Rolling Stock FAQ (compiles RDSO figures and revised CC+ loading):
  https://irfca.org/faq/faq-stock2.html
- GATX India BOXNHL product page: https://www.gatx.com/products/bogie-open-wagon-boxnhl/

| Parameter | BOXN | BOXNHS | BOXNHL | BOBRN (hopper) |
|---|---|---|---|---|
| Tare (t) | 22.47 | 23.1-23.2 | 20.6 | 25.6 |
| Payload / CC per RDSO design (t) | 58.81 | 58.08-66.18 | 71.0 | 55.68 |
| Gross (t) | 81.28 | 81.28-89.28 | 91.6 | 81.28 |
| Axle load (t) | 20.32 | 20.32-22.32 | 22.9 | 20.32 |
| Length over couplers (mm) | 10,713 | 10,713 | 10,963 | 10,600 |
| Standard rake (wagons) | 58 | 58 | 58 | 58 (IRIMEE text; 55 in one table) |
| Payload under revised CC+8+2 loading incl. tolerance (t) | ~66 | ~66 | ~70 | ~62 (CC+6+2) |

Notes on "CC+8+2": Railway Board permits loading open wagons to Carrying Capacity + 8 t on routes cleared for
22.9 t axle load, with a further 2 t tolerance before overloading penalty (hence "CC+8+2"). For BOXN this gives
58.81 + 8 = 66.8 t nominal, ~66 t practical (IRFCA "revised payload incl. tolerance" = 66 t; gross 88.47 t,
rake 5,233 t gross). BOBRN on CC+6+2 routes: ~62 t. BOXNHL already designed for 22.9 t axle load: 70-71 t.
(IRFCA notes BOXNM1/BOXNHSM1 22.9 t variants give 5,399 t gross per rake under CC+8+2.)

## 2. Rake composition
- Standard IR coal block rake = **58 BOXN-family wagons** (+ brake van historically; most freight now runs with
  end-of-train telemetry, and 59-wagon formations are common when a spare wagon is attached). IRIMEE and IRFCA both
  state 58 wagons/rake for BOXN, BOXNHS, BOXNHL; some BOBRN rakes are 58-59.
- Central Railway Nagpur Division record day 5-Nov-2020: 42 coal rakes = 2,448 wagons => **58.3 wagons/rake**
  (https://news.railanalysis.com/?p=37597).
- Central Railway Highlights 2024-25: WCL loading fell by 536 rakes = 2.14 MT => **~3,990 t/rake** on CR coal
  (https://cr.indianrailways.gov.in/cris//uploads/files/1753868156096-Highlights%202024-25.pdf). Goods-shed coal:
  484 rakes = 1.93 MT => ~3,990 t/rake also.

## 3. Tonnes of coal per rake (payload, not gross)
| Formation | t/wagon | t/rake |
|---|---|---|
| 58 x BOXN at design CC | 58.8 | 3,411 (IRFCA cites 3,411 t for an "ordinary BOXN rake") |
| 58 x BOXN at CC+8 (+2 tol.) | 64-66 | 3,700-3,830 |
| 59 x BOXN at CC+8 | 64-66 | 3,780-3,900 |
| 58 x BOXNHL at CC (70-71) | 70-71 | 4,060-4,120 |
| 59 x BOXNHL | 70-71 | 4,130-4,190 |
| 58 x BOBRN at CC+6 | 60-62 | 3,480-3,600 |

The user's prior (58/59 wagons, ~58-64 t/wagon, 3,800-4,000 t/rake) is confirmed: it corresponds to BOXN-family
rakes loaded under CC+8+2. The CR 2024-25 aggregate (~3,990 t/rake) sits at the upper end because the WCL fleet is
now largely BOXNHL. For the CSTPS simulation use **~3,900 t/rake (range 3,700-4,150)**, 58-59 wagons.

Conversion to CEA daily receipt: CSTPS receipt of 29.9-47.5 kt/day ('000 T in CEA report) = 7.7-12.2 rake-
equivalents/day of all modes; after deducting ~7 kt/day of ropeway/pipe-conveyor coal, rail arrivals are about
6-10 rakes/day typically, up to ~11-12 at high PLF.

## 4. Wagon-type implications for unloading
- BOXN/BOXNHL/BOXNHS (open, top-loaded) need wagon tipplers (or manual/payloader) => 7 h free time.
- BOBRN (bottom-discharge hopper) discharge over a track hopper => 2.5 h free time; CSTPS has track hoppers at
  CHP-B and CHP-C, so some WCL rakes may arrive as BOBRN.
- Loaded BOXNHL rake gross ~5,300 t; WAG-9/WAG-7 single-headed on the Wardha-Ballarshah section.
