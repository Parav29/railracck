# RakeFlow — IE305 submission

Discrete-event simulation (AnyLogic 8.9.9) of the closed-circuit coal rake cycle Ghugus → Tadali → Chandrapur Super
Thermal Power Station, Central Railway, Nagpur Division. Team RakeFlow, IEOR, IIT Bombay.

**Start here:** `PROJECT_FLOW.md` (or `PROJECT_FLOW.pdf`) explains the whole project in detail.

## Contents

### 1. AnyLogic model — `1_AnyLogic_Model/`
| File | What it is |
|---|---|
| `RakeFlow.alp` | The model. Open in AnyLogic 8.9.9 (PLE is fine). Experiments: Simulation (animated), Replications30, E1_FleetSize, E2toE7_Scenarios, KeyExperiments |
| `Model_Description_and_How_to_Run.pdf` | Model structure, phases, scenarios, verification, how to run |

### 2. Support files — `2_Support_Files/`

**A. Data collection — `A_Data_Collection/`**
| File | What it is |
|---|---|
| `RakeFlow_Parameter_Sheet.xlsx` | Every model input: value, distribution, source, confidence; hourly passenger profile; data gaps |
| `Passenger_Timetable_Tadali_Chandrapur.csv` | 115 passenger trains (times at Tadali/Chandrapur, days of run), scraped from erail.in |
| `Research_Notes_and_Data_Sources.pdf` | All research notes with the URL behind every number (originals in `research_notes/`) |
| `Model_Brief_Inputs_Sources_Assumptions.pdf` | Hard data, soft data, assumptions A-01…A-22, model specification |
| `Data_Request_Letter_CR_WCL.pdf` | Data request to Central Railway, WCL and CSTPS |
| `data_collection_templates/` | 8 CSV templates for field data (loading, unloading, crew, BPC exams, lateness, CSTPS stock, section facts, rake cycle log) |

**B. Analysis — `B_Analysis/`**
| File | What it is |
|---|---|
| `Experiment_Results.pdf` | All experiment tables (key experiments, factorial, fleet, scenarios, sensitivity, cycle breakdown) |
| `Experiment_Results.xlsx` | Same results as a workbook: summaries + one row per replication |
| `raw_runs/` | Raw replication data (CSV) |
| `figures/` | Cycle-time breakdown, fleet size, lever ranking (PNG) |
| `analysis_code/` | Test harness (same Java as the model, invariant checks), experiment scripts, model generator, parameter-sheet builder |
| `simulator_website/` | Local presentation page (open `index.html`, or serve with nginx — see its README) |

### 3. Presentation slides — `3_Presentation_Slides/`
| File | What it is |
|---|---|
| `RakeFlow_Final_Presentation.pptx` / `.pdf` | Final presentation (22 slides, speaker notes) |
| `RakeFlow_Proposal_Presentation_submitted.pptx` / `.pdf` | The proposal deck as submitted earlier |

## Key result
Three changes at Ghugus — book the crew while the rake is loading, add a third loop, a rapid loading silo — raise
throughput from **4.77 to 7.76 rakes/day (+63%)** and cut the cycle from **40.3 h to 24.7 h (−39%)**; the ₹228 crore
line doubling adds +0.11 rakes/day for today's traffic. All results: 30 replications, 3-day warm-up + 30 days,
common random numbers, 95% confidence intervals.
