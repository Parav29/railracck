# Indian Railways norms: Brake Power Certificate (BPC) and freight-rake examination

Purpose: parameters for the "BPC validity / intensive examination" events in the coal
rake-cycle DES (closed-circuit BOXN rakes). Primary source is the Railway Board Joint
Procedure Order (JPO) on freight train examination as reproduced in IRIMEE (Indian
Railways Institute of Mechanical & Electrical Engineering) course notes; the JPO
derives from Railway Board (Mechanical) letters cited below. IRCA Conference Rules
Part III govern interchange/fitness but the time standards used in practice are
these JPO figures.

Primary sources:
* IRIMEE "Pattern of freight train examination" (JPO summary):
  https://rskr.irimee.in/sites/default/files/Pattern%20of%20freight%20train%20examination.pdf
* IRIMEE "Freight Train examination" (JPO):
  https://rskr.irimee.in/sites/default/files/Freight%20Train%20examination.pdf
* IRIMEE BPC note: https://rskr.irimee.in/sites/default/files/BPC.pdf
* IRIMEE C&W refresher material 16-10-2018:
  https://rskr.irimee.in/sites/default/files/RC%20C&W%20material%2016-10-2018.pdf
* SECR Zonal Safety Circular 05/2022 (BPC):
  https://secr.indianrailways.gov.in/uploads/files/1660131557781-Zonal%20Safety%20Circular%20No.%2005-2022.pdf

Railway Board letters cited in the JPO: 94/M(N)/951/57 Vol-II dated 25.10.2004
(CC rake formation, revised JPO basis); 2005/M(N)/951/13 dated 07.04.2005; even-number
letters dated 25.04.2006 and 05.11.2007.
https://rskr.irimee.in/sites/default/files/Pattern%20of%20freight%20train%20examination.pdf

---

## 1. BPC validity by examination pattern

| Pattern | Validity | Grace / notes | Source |
|---|---|---|---|
| Closed-circuit (CC) rake examined at "A" category depot | **6,000 km or 30 days**, whichever earlier | 5-day grace if rake is moving toward base depot; if km not logged continuously, BPC valid only 20 days | Pattern of FTE pdf |
| CC rake examined at Special "A" depot | **7,500 km or 35 days** | same grace | Pattern of FTE pdf |
| CC rake, lower-class depot | 4,500 km or 20 days | | Freight Train examination pdf |
| Premium end-to-end (PEE) | **12 days** incl. date of issue | +3 days grace if loaded; on day 15 rake must be unloaded and offered; invalid if stabled > 24 h without offering | Pattern of FTE pdf |
| Intensive end-to-end (E2E) | Valid for one loaded trip to destination endorsed on BPC | examined empty; rake integrity disturbed by <= 4 wagons; empty rake must reach loading point within 4 days of BPC | both pdfs |
| CC rake leaving the closed circuit | treated as running on invalid BPC; returned to base depot for re-certification | | Freight Train examination pdf |

CAG Report 31 of 2014, para 3.2.2(f) (compliance reality): of 1,962 rakes with 6,000 km
BPCs, 770 (39%) travelled 789-884 km beyond the authorised distance; of 1,772 rakes with
7,500 km BPCs, 662 (37%) ran 534-996 km beyond; MoR admitted >35% of 3,734 rakes ran
500-996 km after BPC expiry.
https://cag.gov.in/uploads/download_audit_report/2014/Union_Performance_Railways_Management_Goods_trains_31_2014_chapter_7.pdf

## 2. Where examination is done

* CC rakes: at the **nominated base depot** where the rake was formed, on a nominated
  examination line jointly fixed by CRSE and CFTM; rake must not be stabled >= 24 h at an
  examination yard.
* Premium rakes: nominated "A" category yard chosen by CME & COM.
* Intensive E2E: nominated intensive yard, empty condition; back-loading examination at
  a nearby intensive yard after unloading.
  https://rskr.irimee.in/sites/default/files/Pattern%20of%20freight%20train%20examination.pdf

## 3. Time / manpower for intensive examination

| Pattern | Man-hours (JPO) | Gang | Elapsed time | Source |
|---|---|---|---|---|
| Intensive E2E | 56 man-h (Pattern pdf) / 40 man-h (FTE pdf) | 2 examiners + 12 staff + welder | ~4-5 h with full gang | both pdfs |
| Premium E2E | 75 man-h | same | ~6 h | both pdfs |
| CC rake | **100 man-h or 08 hours** (FTE pdf); 100 man-h (Pattern pdf); 75 man-h in one JPO item | same | **8 h** nominal | https://rskr.irimee.in/sites/default/files/Freight%20Train%20examination.pdf |

The JPO sets the CC-rake examination at "100 man/hr or 08 hours" with a standard gang
of two trained examiners, 12 staff and a welder.

## 4. Daylight rule

* CC rakes "should be examined in day light only (morning to sun set)". Night
  examination permitted only with minimum illumination of **100-150 lux** for
  under-gear examination/repair.
  https://rskr.irimee.in/sites/default/files/Pattern%20of%20freight%20train%20examination.pdf
  https://rskr.irimee.in/sites/default/files/Freight%20Train%20examination.pdf

Modelling implication: if a CC rake arrives at the base depot after ~15:00 it
generally waits for the next morning; examination window ~06:00-18:00, 8 h duration,
so at most one CC examination per examination line per day unless the yard is lit.

## 5. Sick-line and detachment detentions (for the "sick wagon" branch)

* CAG 2014 para 4.2.1: 53,815 wagons in four zones detained in sick lines for **more than
  9 h** (9 h being the norm for sick-line turnout); para 4.2.2: 2,484 wagons held 48-173
  days after being declared fit.
  https://cag.gov.in/uploads/download_audit_report/2014/Union_Performance_Railways_Management_Goods_trains_31_2014_chapter_7.pdf
* Rake integrity: an examined E2E rake may lose/replace up to 4 wagons without
  invalidating the BPC (JPO).

## 6. Suggested parameters for the model

| Quantity | Value | Basis |
|---|---|---|
| CC BPC validity | 6,000 km / 30 days (A depot); 7,500 km / 35 days (Special A) | JPO |
| Grace | +5 days when heading to base depot | JPO |
| Intensive CC examination duration | tri(6, 8, 12) h | JPO "100 man-h or 8 h"; 12 h allows for repairs/welding |
| Examination window | 06:00-18:00 only (daylight) unless lit yard | JPO |
| Wait at base depot before examination (arrival->placement on exam line) | tri(0.5, 2, 10) h | CAG Table 18 arrival-to-placement ranges |
| Probability a wagon is detached sick at examination | model input; CAG shows 4 wagons tolerance | JPO |
| Sick-line repair time for a detached wagon | tri(6, 9, 24) h | CAG 9 h norm |
