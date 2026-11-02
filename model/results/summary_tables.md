# RakeFlow harness results

30 replications per case, each 3 days warm-up + 30 days statistics, seeds 1-30 shared by every case (common random numbers). Mean +- 95% CI half-width (t, 29 df). Delta = paired difference in rakes/day against the phase-3 baseline (same seeds).


## Phase build-up

| case | rakes/day | cycle h | P90 cycle h | line util | line queue | Tadali queue | siding occ | tippler util | DN merge wait h | demurrage Rs/rake | crew expiries /100 trips | exam h/rake/month | BPC share | stock min days | delta rakes/day vs baseline |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| P1 core cycle (no crew, no BPC) | 5.75 +- 0.03 | 33.4 +- 0.2 | 37.4 | 25% | 0.05 | 0.033 | 100% | 26% | 0.14 | 33,200 | 0.00 | 0.0 | 0.0% | 7.7 | +0.98 +- 0.06 |
| P2 + crew duty clock | 4.81 +- 0.04 | 39.9 +- 0.4 | 46.0 | 21% | 0.09 | 0.026 | 81% | 22% | 0.13 | 33,273 | 0.00 | 0.0 | 0.0% | 5.0 | +0.04 +- 0.07 |
| P3 + BPC exam detours (baseline) | 4.77 +- 0.06 | 40.3 +- 0.5 | 47.1 | 21% | 0.09 | 0.026 | 80% | 21% | 0.13 | 33,328 | 0.02 | 24.3 | 5.5% | 5.0 | +0.00 +- 0.00 |

## E1 fleet size (A-18)

| case | rakes/day | cycle h | P90 cycle h | line util | line queue | Tadali queue | siding occ | tippler util | DN merge wait h | demurrage Rs/rake | crew expiries /100 trips | exam h/rake/month | BPC share | stock min days | delta rakes/day vs baseline |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| fleet 4 | 3.07 +- 0.02 | 31.2 +- 0.2 | 35.5 | 13% | 0.03 | 0.017 | 42% | 14% | 0.13 | 33,682 | 0.00 | 22.4 | 4.1% | 0.7 | -1.70 +- 0.06 |
| fleet 6 | 4.30 +- 0.03 | 33.4 +- 0.2 | 38.8 | 19% | 0.08 | 0.024 | 63% | 19% | 0.13 | 33,367 | 0.01 | 23.0 | 4.6% | 3.9 | -0.46 +- 0.06 |
| fleet 8 | 4.77 +- 0.06 | 40.3 +- 0.5 | 47.1 | 21% | 0.09 | 0.026 | 80% | 21% | 0.13 | 33,328 | 0.02 | 24.3 | 5.5% | 5.0 | +0.00 +- 0.00 |
| fleet 10 | 4.83 +- 0.05 | 49.6 +- 0.5 | 57.7 | 21% | 0.08 | 0.025 | 81% | 22% | 0.12 | 33,374 | 0.00 | 24.3 | 6.8% | 5.5 | +0.06 +- 0.08 |
| fleet 12 | 4.80 +- 0.05 | 59.9 +- 0.6 | 69.4 | 21% | 0.09 | 0.026 | 80% | 21% | 0.13 | 33,269 | 0.02 | 25.7 | 8.5% | 5.0 | +0.03 +- 0.08 |
| fleet 14 | 4.79 +- 0.04 | 70.0 +- 0.6 | 81.3 | 21% | 0.09 | 0.027 | 81% | 22% | 0.14 | 33,396 | 0.03 | 26.0 | 10.0% | 5.3 | +0.02 +- 0.08 |
| fleet 16 | 4.86 +- 0.04 | 79.0 +- 0.7 | 91.8 | 21% | 0.09 | 0.026 | 79% | 22% | 0.13 | 33,242 | 0.00 | 26.5 | 11.3% | 5.3 | +0.09 +- 0.06 |
| fleet 18 | 4.87 +- 0.04 | 88.6 +- 0.9 | 103.3 | 21% | 0.10 | 0.026 | 79% | 22% | 0.13 | 33,064 | 0.02 | 27.3 | 12.6% | 5.3 | +0.10 +- 0.06 |
| fleet 20 | 4.84 +- 0.05 | 98.9 +- 1.1 | 115.0 | 21% | 0.09 | 0.028 | 79% | 22% | 0.14 | 33,190 | 0.01 | 26.8 | 13.8% | 5.4 | +0.07 +- 0.08 |

## E2-E7 levers (one at a time vs baseline)

| case | rakes/day | cycle h | P90 cycle h | line util | line queue | Tadali queue | siding occ | tippler util | DN merge wait h | demurrage Rs/rake | crew expiries /100 trips | exam h/rake/month | BPC share | stock min days | delta rakes/day vs baseline |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| baseline | 4.77 +- 0.06 | 40.3 +- 0.5 | 47.1 | 21% | 0.09 | 0.026 | 80% | 21% | 0.13 | 33,328 | 0.02 | 24.3 | 5.5% | 5.0 | +0.00 +- 0.00 |
| E2 RLS/silo loading (LD-04) | 5.12 +- 0.03 | 37.5 +- 0.2 | 43.3 | 22% | 0.20 | 0.029 | 24% | 23% | 0.14 | 0 | 0.00 | 23.3 | 5.1% | 6.0 | +0.35 +- 0.07 |
| E3 planned DN slot + crew to match | 4.78 +- 0.05 | 40.2 +- 0.4 | 47.0 | 21% | 0.10 | 0.026 | 79% | 21% | 0.13 | 33,245 | 0.03 | 24.0 | 5.5% | 5.0 | +0.01 +- 0.08 |
| E3 priority to crews < 2 h left | 4.77 +- 0.06 | 40.3 +- 0.5 | 47.1 | 21% | 0.09 | 0.026 | 80% | 21% | 0.13 | 33,328 | 0.02 | 24.3 | 5.5% | 5.0 | +0.00 +- 0.00 |
| E4 crew booked at Chandrapur | 5.14 +- 0.03 | 37.4 +- 0.2 | 43.4 | 22% | 0.05 | 0.029 | 90% | 23% | 0.14 | 33,334 | 0.00 | 23.9 | 5.1% | 6.2 | +0.37 +- 0.07 |
| E5 Tadali-Ghugus doubling | 4.88 +- 0.05 | 39.4 +- 0.4 | 45.9 | 11% | 0.07 | 0.026 | 79% | 22% | 0.13 | 33,259 | 0.01 | 23.3 | 5.4% | 5.4 | +0.11 +- 0.06 |
| E6 tipplers 3 | 4.77 +- 0.06 | 40.3 +- 0.5 | 47.1 | 21% | 0.09 | 0.026 | 80% | 29% | 0.13 | 33,328 | 0.02 | 24.3 | 5.5% | 5.0 | +0.00 +- 0.00 |
| E6 tipplers 5 | 4.77 +- 0.06 | 40.3 +- 0.5 | 47.1 | 21% | 0.09 | 0.026 | 80% | 17% | 0.13 | 33,328 | 0.02 | 24.3 | 5.5% | 5.0 | +0.00 +- 0.00 |
| E7 loops +1 at GGS and TAE | 5.71 +- 0.07 | 33.7 +- 0.5 | 41.4 | 25% | 0.12 | 0.031 | 84% | 26% | 0.13 | 33,264 | 0.11 | 24.4 | 4.6% | 7.4 | +0.94 +- 0.09 |
| E7 crew pool +20% | 4.77 +- 0.06 | 40.3 +- 0.5 | 47.1 | 21% | 0.09 | 0.026 | 80% | 21% | 0.13 | 33,328 | 0.02 | 24.3 | 5.5% | 5.0 | +0.00 +- 0.00 |
| E7 loading sidings +1 | 5.16 +- 0.03 | 37.2 +- 0.2 | 43.4 | 22% | 0.18 | 0.028 | 50% | 23% | 0.13 | 33,299 | 0.26 | 23.5 | 5.1% | 6.3 | +0.39 +- 0.05 |
| no through goods on main line (A-24 = 0) | 4.78 +- 0.05 | 40.1 +- 0.4 | 47.1 | 21% | 0.09 | 0.012 | 81% | 22% | 0.06 | 33,462 | 0.02 | 23.2 | 5.2% | 5.2 | +0.01 +- 0.07 |

## Proposal scenarios (submitted deck): dispatch, crew booking, exam trigger

| case | rakes/day | cycle h | P90 cycle h | line util | line queue | Tadali queue | siding occ | tippler util | DN merge wait h | demurrage Rs/rake | crew expiries /100 trips | exam h/rake/month | BPC share | stock min days | delta rakes/day vs baseline |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| baseline (loaded first, crew when ready, exam 1 day left) | 4.77 +- 0.06 | 40.3 +- 0.5 | 47.1 | 21% | 0.09 | 0.026 | 80% | 21% | 0.13 | 33,328 | 0.02 | 24.3 | 5.5% | 5.0 | +0.00 +- 0.00 |
| Dispatch: alternating directions | 4.77 +- 0.06 | 40.3 +- 0.5 | 47.1 | 21% | 0.09 | 0.026 | 80% | 21% | 0.13 | 33,328 | 0.02 | 24.3 | 5.5% | 5.0 | +0.00 +- 0.00 |
| Dispatch: batches of 3 | 4.77 +- 0.06 | 40.3 +- 0.5 | 47.1 | 21% | 0.09 | 0.026 | 80% | 21% | 0.13 | 33,328 | 0.02 | 24.3 | 5.5% | 5.0 | +0.00 +- 0.00 |
| Crew ordered during loading (A-29) | 5.77 +- 0.03 | 33.3 +- 0.2 | 38.3 | 25% | 0.04 | 0.031 | 89% | 26% | 0.13 | 33,440 | 0.00 | 24.2 | 4.6% | 7.9 | +1.00 +- 0.06 |
| Exam trigger: at expiry | 4.80 +- 0.04 | 40.0 +- 0.3 | 46.9 | 21% | 0.09 | 0.026 | 80% | 22% | 0.13 | 33,446 | 0.02 | 23.2 | 5.5% | 5.3 | +0.03 +- 0.07 |
| Exam trigger: 3 days left | 4.75 +- 0.04 | 40.4 +- 0.4 | 47.4 | 21% | 0.09 | 0.025 | 79% | 22% | 0.13 | 33,320 | 0.05 | 25.2 | 5.7% | 5.3 | -0.02 +- 0.06 |
| Exam trigger: 5 days left | 4.78 +- 0.04 | 40.1 +- 0.4 | 46.9 | 21% | 0.09 | 0.026 | 79% | 22% | 0.13 | 33,304 | 0.02 | 27.3 | 6.0% | 5.3 | +0.01 +- 0.07 |
| Exam trigger: 7 days left | 4.75 +- 0.03 | 40.3 +- 0.3 | 47.7 | 21% | 0.09 | 0.027 | 80% | 21% | 0.13 | 33,387 | 0.05 | 29.5 | 6.5% | 5.2 | -0.02 +- 0.06 |

## Line doubling vs best operating policy (free levers)

| case | rakes/day | cycle h | P90 cycle h | line util | line queue | Tadali queue | siding occ | tippler util | DN merge wait h | demurrage Rs/rake | crew expiries /100 trips | exam h/rake/month | BPC share | stock min days | delta rakes/day vs baseline |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| baseline (single line) | 4.77 +- 0.06 | 40.3 +- 0.5 | 47.1 | 21% | 0.09 | 0.026 | 80% | 21% | 0.13 | 33,328 | 0.02 | 24.3 | 5.5% | 5.0 | +0.00 +- 0.00 |
| Doubling only (Rs 228 cr) | 4.88 +- 0.05 | 39.4 +- 0.4 | 45.9 | 11% | 0.07 | 0.026 | 79% | 22% | 0.13 | 33,259 | 0.01 | 23.3 | 5.4% | 5.4 | +0.11 +- 0.06 |
| Best free policy: crew ordered during loading | 5.77 +- 0.03 | 33.3 +- 0.2 | 38.3 | 25% | 0.04 | 0.031 | 89% | 26% | 0.13 | 33,440 | 0.00 | 24.2 | 4.6% | 7.9 | +1.00 +- 0.06 |
| Best free policy + doubling | 5.78 +- 0.03 | 33.2 +- 0.2 | 38.3 | 13% | 0.02 | 0.031 | 91% | 26% | 0.13 | 33,354 | 0.00 | 23.7 | 4.5% | 7.8 | +1.01 +- 0.07 |

## Assumption sensitivity

| case | rakes/day | cycle h | P90 cycle h | line util | line queue | Tadali queue | siding occ | tippler util | DN merge wait h | demurrage Rs/rake | crew expiries /100 trips | exam h/rake/month | BPC share | stock min days | delta rakes/day vs baseline |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| baseline | 4.77 +- 0.06 | 40.3 +- 0.5 | 47.1 | 21% | 0.09 | 0.026 | 80% | 21% | 0.13 | 33,328 | 0.02 | 24.3 | 5.5% | 5.0 | +0.00 +- 0.00 |
| A-01 GGS loops 3 | 5.77 +- 0.06 | 33.3 +- 0.3 | 39.1 | 25% | 0.03 | 0.032 | 81% | 26% | 0.13 | 33,222 | 0.00 | 23.4 | 4.5% | 7.8 | +1.00 +- 0.09 |
| A-02 TAE loops 3 | 4.54 +- 0.04 | 42.2 +- 0.4 | 48.4 | 20% | 0.47 | 0.025 | 95% | 20% | 0.13 | 33,281 | 2.43 | 23.3 | 5.8% | 4.4 | -0.23 +- 0.08 |
| A-13/A-14 yard handling halved | 5.50 +- 0.06 | 34.9 +- 0.4 | 41.2 | 24% | 0.06 | 0.031 | 88% | 25% | 0.13 | 33,400 | 0.00 | 23.7 | 4.8% | 7.0 | +0.73 +- 0.08 |
| A-15/A-16 CSTPS handling halved | 4.81 +- 0.04 | 39.8 +- 0.3 | 46.9 | 21% | 0.09 | 0.027 | 80% | 22% | 0.13 | 33,432 | 0.01 | 23.1 | 5.4% | 5.2 | +0.04 +- 0.07 |
| A-24 through goods 40/day | 4.80 +- 0.03 | 39.9 +- 0.2 | 46.5 | 21% | 0.10 | 0.045 | 77% | 22% | 0.22 | 33,637 | 0.05 | 23.6 | 5.1% | 5.3 | +0.03 +- 0.06 |
| A-23 absolute block TAE-CD + A-24 40/day | 4.77 +- 0.03 | 40.2 +- 0.3 | 46.5 | 21% | 0.10 | 0.067 | 75% | 21% | 0.34 | 33,379 | 0.06 | 23.4 | 5.1% | 5.2 | +0.00 +- 0.06 |
| A-21 lateness mean 60 sd 60 min | 4.77 +- 0.05 | 40.2 +- 0.4 | 47.1 | 21% | 0.09 | 0.026 | 79% | 22% | 0.13 | 33,367 | 0.05 | 24.4 | 5.5% | 5.2 | +0.00 +- 0.09 |
| A-25 crew pool 10 | 4.77 +- 0.06 | 40.3 +- 0.5 | 47.1 | 21% | 0.09 | 0.026 | 80% | 21% | 0.13 | 33,328 | 0.02 | 24.3 | 5.5% | 5.0 | +0.00 +- 0.00 |
| A-27 controller does not hold empties | 4.56 +- 0.06 | 42.0 +- 0.5 | 48.9 | 20% | 0.50 | 0.025 | 95% | 21% | 0.13 | 33,374 | 1.12 | 23.7 | 5.7% | 4.7 | -0.21 +- 0.07 |
| CR-02 no duty extension | 4.76 +- 0.06 | 40.3 +- 0.4 | 47.4 | 21% | 0.09 | 0.025 | 80% | 22% | 0.13 | 33,451 | 0.26 | 24.8 | 5.5% | 5.0 | -0.01 +- 0.04 |

## Combinations to reach LD-01 (7-8 rakes/day)

| case | rakes/day | cycle h | P90 cycle h | line util | line queue | Tadali queue | siding occ | tippler util | DN merge wait h | demurrage Rs/rake | crew expiries /100 trips | exam h/rake/month | BPC share | stock min days | delta rakes/day vs baseline |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| crew at loading + loops +1 | 6.33 +- 0.04 | 30.2 +- 0.2 | 35.7 | 28% | 0.07 | 0.035 | 89% | 28% | 0.13 | 33,482 | 0.00 | 23.7 | 4.1% | 9.0 | +1.57 +- 0.06 |
| crew at loading + loops +1 + RLS | 8.13 +- 0.03 | 23.6 +- 0.1 | 27.3 | 35% | 0.11 | 0.043 | 33% | 37% | 0.13 | 4 | 0.00 | 24.0 | 3.2% | 10.4 | +3.36 +- 0.06 |
| loops +1 + Chandrapur lobby | 5.99 +- 0.06 | 32.0 +- 0.4 | 38.5 | 26% | 0.09 | 0.034 | 87% | 27% | 0.14 | 33,315 | 0.00 | 23.9 | 4.4% | 8.4 | +1.22 +- 0.09 |
| loops +1 + lobby + RLS | 7.63 +- 0.03 | 25.1 +- 0.1 | 28.8 | 33% | 0.15 | 0.043 | 33% | 35% | 0.14 | 1 | 0.00 | 24.2 | 3.4% | 10.3 | +2.86 +- 0.06 |
| loops +1 + lobby + RLS, fleet 10 | 9.13 +- 0.03 | 26.2 +- 0.1 | 30.2 | 40% | 0.33 | 0.052 | 44% | 41% | 0.14 | 1 | 0.00 | 24.5 | 3.6% | 10.5 | +4.36 +- 0.06 |
| loops 3/3, sidings 3, lobby, fleet 10 | 7.81 +- 0.03 | 30.7 +- 0.1 | 35.4 | 34% | 0.20 | 0.044 | 74% | 35% | 0.13 | 33,357 | 0.00 | 24.5 | 4.2% | 10.1 | +3.04 +- 0.06 |
| loops 4/3, sidings 3, lobby, RLS, fleet 12 | 11.17 +- 0.05 | 25.8 +- 0.1 | 29.4 | 49% | 0.28 | 0.062 | 32% | 50% | 0.13 | 30 | 0.00 | 25.7 | 3.5% | 10.8 | +6.40 +- 0.06 |

## Baseline cycle-time decomposition (phase 3, mean h per cycle)

| stage | mean h | share |
|---|---|---|
| Placement at GGS (A-13) | 1.82 | 5% |
| Wait for loading siding | 1.78 | 4% |
| Loading (LD-03/04) | 6.32 | 16% |
| Release->ready GGS (A-14) | 2.77 | 7% |
| Wait for crew (loaded) | 2.76 | 7% |
| Wait single line + TAE loop | 0.04 | 0% |
| Run GGS->TAE spur | 0.52 | 1% |
| Wait DN path at TAE | 0.13 | 0% |
| Run TAE->CD (loaded) | 0.33 | 1% |
| Placement at CSTPS (A-15) | 3.50 | 9% |
| Wait for tippler | 0.00 | 0% |
| Unloading (UL-02) | 4.31 | 11% |
| Release->despatch CD (A-16) | 4.15 | 10% |
| Wait for crew (empty) | 1.68 | 4% |
| Held at CD: loops/UP path | 7.54 | 19% |
| Run CD->TAE (empty) | 0.33 | 1% |
| Wait single line at TAE | 0.40 | 1% |
| Run TAE->GGS spur | 0.52 | 1% |
| Crew relief (duty expired) | 0.00 | 0% |
| BPC exam detour | 1.37 | 3% |
| **total cycle** | **40.3** | |
