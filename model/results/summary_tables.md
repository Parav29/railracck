# RakeFlow harness results

30 replications per case, each 3 days warm-up + 30 days statistics, seeds 1-30 shared by every case (common random numbers). Mean +- 95% CI half-width (t, 29 df). Delta = paired difference in rakes/day against the phase-3 baseline (same seeds).


## Phase build-up

| case | rakes/day | cycle h | line util | siding occ | tippler util | DN merge wait h | demurrage Rs/rake | crew relief share | BPC share | stock min days | delta rakes/day vs baseline |
|---|---|---|---|---|---|---|---|---|---|---|---|
| P1 core cycle (no crew, no BPC) | 5.75 +- 0.03 | 33.4 +- 0.2 | 25% | 100% | 26% | 0.14 | 33,200 | 0.0% | 0.0% | 7.7 | +0.98 +- 0.06 |
| P2 + crew duty clock | 4.81 +- 0.04 | 39.9 +- 0.4 | 21% | 81% | 22% | 0.13 | 33,273 | 0.0% | 0.0% | 5.0 | +0.04 +- 0.07 |
| P3 + BPC exam detours (baseline) | 4.77 +- 0.06 | 40.3 +- 0.5 | 21% | 80% | 21% | 0.13 | 33,328 | 0.1% | 5.5% | 5.0 | +0.00 +- 0.00 |

## E1 fleet size (A-18)

| case | rakes/day | cycle h | line util | siding occ | tippler util | DN merge wait h | demurrage Rs/rake | crew relief share | BPC share | stock min days | delta rakes/day vs baseline |
|---|---|---|---|---|---|---|---|---|---|---|---|
| fleet 4 | 3.07 +- 0.02 | 31.2 +- 0.2 | 13% | 42% | 14% | 0.13 | 33,682 | 0.0% | 4.1% | 0.7 | -1.70 +- 0.06 |
| fleet 6 | 4.30 +- 0.03 | 33.4 +- 0.2 | 19% | 63% | 19% | 0.13 | 33,367 | 0.0% | 4.6% | 3.9 | -0.46 +- 0.06 |
| fleet 8 | 4.77 +- 0.06 | 40.3 +- 0.5 | 21% | 80% | 21% | 0.13 | 33,328 | 0.1% | 5.5% | 5.0 | +0.00 +- 0.00 |
| fleet 10 | 4.83 +- 0.05 | 49.6 +- 0.5 | 21% | 81% | 22% | 0.12 | 33,374 | 0.0% | 6.8% | 5.5 | +0.06 +- 0.08 |
| fleet 12 | 4.80 +- 0.05 | 59.9 +- 0.6 | 21% | 80% | 21% | 0.13 | 33,269 | 0.1% | 8.5% | 5.0 | +0.03 +- 0.08 |
| fleet 14 | 4.79 +- 0.04 | 70.0 +- 0.6 | 21% | 81% | 22% | 0.14 | 33,396 | 0.1% | 10.0% | 5.3 | +0.02 +- 0.08 |

## E2-E7 levers (one at a time vs baseline)

| case | rakes/day | cycle h | line util | siding occ | tippler util | DN merge wait h | demurrage Rs/rake | crew relief share | BPC share | stock min days | delta rakes/day vs baseline |
|---|---|---|---|---|---|---|---|---|---|---|---|
| baseline | 4.77 +- 0.06 | 40.3 +- 0.5 | 21% | 80% | 21% | 0.13 | 33,328 | 0.1% | 5.5% | 5.0 | +0.00 +- 0.00 |
| E2 RLS/silo loading (LD-04) | 5.12 +- 0.03 | 37.5 +- 0.2 | 22% | 24% | 23% | 0.14 | 0 | 0.0% | 5.1% | 6.0 | +0.35 +- 0.07 |
| E3 planned DN slot + crew to match | 4.78 +- 0.05 | 40.2 +- 0.4 | 21% | 79% | 21% | 0.13 | 33,245 | 0.1% | 5.5% | 5.0 | +0.01 +- 0.08 |
| E3 priority to crews < 2 h left | 4.77 +- 0.06 | 40.3 +- 0.5 | 21% | 80% | 21% | 0.13 | 33,328 | 0.1% | 5.5% | 5.0 | +0.00 +- 0.00 |
| E4 crew booked at Chandrapur | 5.14 +- 0.03 | 37.4 +- 0.2 | 22% | 90% | 23% | 0.14 | 33,334 | 0.0% | 5.1% | 6.2 | +0.37 +- 0.07 |
| E5 Tadali-Ghugus doubling | 4.88 +- 0.05 | 39.4 +- 0.4 | 11% | 79% | 22% | 0.13 | 33,259 | 0.0% | 5.4% | 5.4 | +0.11 +- 0.06 |
| E6 tipplers 3 | 4.77 +- 0.06 | 40.3 +- 0.5 | 21% | 80% | 29% | 0.13 | 33,328 | 0.1% | 5.5% | 5.0 | +0.00 +- 0.00 |
| E6 tipplers 5 | 4.77 +- 0.06 | 40.3 +- 0.5 | 21% | 80% | 17% | 0.13 | 33,328 | 0.1% | 5.5% | 5.0 | +0.00 +- 0.00 |
| E7 loops +1 at GGS and TAE | 5.71 +- 0.07 | 33.7 +- 0.5 | 25% | 84% | 26% | 0.13 | 33,264 | 0.2% | 4.6% | 7.4 | +0.94 +- 0.09 |
| E7 crew pool +20% | 4.77 +- 0.06 | 40.3 +- 0.5 | 21% | 80% | 21% | 0.13 | 33,328 | 0.1% | 5.5% | 5.0 | +0.00 +- 0.00 |
| E7 loading sidings +1 | 5.16 +- 0.03 | 37.2 +- 0.2 | 22% | 50% | 23% | 0.13 | 33,299 | 0.5% | 5.1% | 6.3 | +0.39 +- 0.05 |
| no through goods on main line (A-24 = 0) | 4.78 +- 0.05 | 40.1 +- 0.4 | 21% | 81% | 22% | 0.06 | 33,462 | 0.0% | 5.2% | 5.2 | +0.01 +- 0.07 |

## Assumption sensitivity

| case | rakes/day | cycle h | line util | siding occ | tippler util | DN merge wait h | demurrage Rs/rake | crew relief share | BPC share | stock min days | delta rakes/day vs baseline |
|---|---|---|---|---|---|---|---|---|---|---|---|
| baseline | 4.77 +- 0.06 | 40.3 +- 0.5 | 21% | 80% | 21% | 0.13 | 33,328 | 0.1% | 5.5% | 5.0 | +0.00 +- 0.00 |
| A-01 GGS loops 3 | 5.77 +- 0.06 | 33.3 +- 0.3 | 25% | 81% | 26% | 0.13 | 33,222 | 0.0% | 4.5% | 7.8 | +1.00 +- 0.09 |
| A-02 TAE loops 3 | 4.54 +- 0.04 | 42.2 +- 0.4 | 20% | 95% | 20% | 0.13 | 33,281 | 4.5% | 5.8% | 4.4 | -0.23 +- 0.08 |
| A-13/A-14 yard handling halved | 5.50 +- 0.06 | 34.9 +- 0.4 | 24% | 88% | 25% | 0.13 | 33,400 | 0.0% | 4.8% | 7.0 | +0.73 +- 0.08 |
| A-15/A-16 CSTPS handling halved | 4.81 +- 0.04 | 39.8 +- 0.3 | 21% | 80% | 22% | 0.13 | 33,432 | 0.0% | 5.4% | 5.2 | +0.04 +- 0.07 |
| A-24 through goods 40/day | 4.80 +- 0.03 | 39.9 +- 0.2 | 21% | 77% | 22% | 0.22 | 33,637 | 0.0% | 5.1% | 5.3 | +0.03 +- 0.06 |
| A-23 absolute block TAE-CD + A-24 40/day | 4.77 +- 0.03 | 40.2 +- 0.3 | 21% | 75% | 21% | 0.34 | 33,379 | 0.1% | 5.1% | 5.2 | +0.00 +- 0.06 |
| A-21 lateness mean 60 sd 60 min | 4.77 +- 0.05 | 40.2 +- 0.4 | 21% | 79% | 22% | 0.13 | 33,367 | 0.1% | 5.5% | 5.2 | +0.00 +- 0.09 |
| A-25 crew pool 10 | 4.77 +- 0.06 | 40.3 +- 0.5 | 21% | 80% | 21% | 0.13 | 33,328 | 0.1% | 5.5% | 5.0 | +0.00 +- 0.00 |
| A-27 controller does not hold empties | 4.56 +- 0.06 | 42.0 +- 0.5 | 20% | 95% | 21% | 0.13 | 33,374 | 2.1% | 5.7% | 4.7 | -0.21 +- 0.07 |
| CR-02 no duty extension | 4.76 +- 0.06 | 40.3 +- 0.4 | 21% | 80% | 22% | 0.13 | 33,451 | 0.5% | 5.5% | 5.0 | -0.01 +- 0.04 |

## Combinations to reach LD-01 (7-8 rakes/day)

| case | rakes/day | cycle h | line util | siding occ | tippler util | DN merge wait h | demurrage Rs/rake | crew relief share | BPC share | stock min days | delta rakes/day vs baseline |
|---|---|---|---|---|---|---|---|---|---|---|---|
| loops +1 + Chandrapur lobby | 5.99 +- 0.06 | 32.0 +- 0.4 | 26% | 87% | 27% | 0.14 | 33,315 | 0.0% | 4.4% | 8.4 | +1.22 +- 0.09 |
| loops +1 + lobby + RLS | 7.63 +- 0.03 | 25.1 +- 0.1 | 33% | 33% | 35% | 0.14 | 1 | 0.0% | 3.4% | 10.3 | +2.86 +- 0.06 |
| loops +1 + lobby + RLS, fleet 10 | 9.13 +- 0.03 | 26.2 +- 0.1 | 40% | 44% | 41% | 0.14 | 1 | 0.0% | 3.6% | 10.5 | +4.36 +- 0.06 |
| loops 3/3, sidings 3, lobby, fleet 10 | 7.81 +- 0.03 | 30.7 +- 0.1 | 34% | 74% | 35% | 0.13 | 33,357 | 0.0% | 4.2% | 10.1 | +3.04 +- 0.06 |
| loops 4/3, sidings 3, lobby, RLS, fleet 12 | 11.17 +- 0.05 | 25.8 +- 0.1 | 49% | 32% | 50% | 0.13 | 30 | 0.0% | 3.5% | 10.8 | +6.40 +- 0.06 |

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
