# Key experiments (harness, 30 paired replications, 3 d warm-up + 30 d, seeds 1-30, invariants checked)

## Single levers vs baseline

| case | rakes/day | t/day | cycle h | P90 cycle h | Ghugus terminal h | crew wait h | held at CD h | demurrage Rs/rake | single-line util | crew expiries/100 | CSTPS stock min days | delta rakes/day (paired 95% CI) | delta cycle h |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Baseline (today) | 4.77 +- 0.06 | 19,028 | 40.27 +- 0.45 | 47.13 | 12.69 | 4.44 | 7.54 | 33,328 | 21% | 0.02 | 5.03 | +0.00 +- 0.00 | +0.0 +- 0.0 |
| Exp 1 Crew ordered during loading | 5.77 +- 0.03 | 23,027 | 33.27 +- 0.21 | 38.25 | 12.55 | 1.77 | 3.84 | 33,440 | 25% | 0.00 | 7.93 | +1.00 +- 0.06 | -7.0 +- 0.5 |
| Exp 2 One more loop at Ghugus (3 instead of 2) | 5.77 +- 0.06 | 23,036 | 33.27 +- 0.33 | 39.13 | 12.10 | 4.43 | 1.67 | 33,222 | 25% | 0.00 | 7.82 | +1.00 +- 0.09 | -7.0 +- 0.6 |
| Exp 3 Rapid loading silo (RLS) at Ghugus | 5.12 +- 0.03 | 20,411 | 37.48 +- 0.24 | 43.25 | 6.43 | 4.43 | 10.61 | 0 | 22% | 0.00 | 5.99 | +0.35 +- 0.07 | -2.8 +- 0.5 |
| Exp 4 Line doubling Ghugus-Tadali (Rs 228 cr) | 4.88 +- 0.05 | 19,453 | 39.37 +- 0.39 | 45.89 | 12.37 | 4.44 | 7.02 | 33,259 | 11% | 0.01 | 5.38 | +0.11 +- 0.06 | -0.9 +- 0.5 |
| Extra: yard handling at Ghugus halved | 5.50 +- 0.06 | 21,954 | 34.95 +- 0.37 | 41.24 | 10.64 | 4.43 | 4.64 | 33,400 | 24% | 0.00 | 6.95 | +0.73 +- 0.08 | -5.3 +- 0.6 |
| Extra: fleet 8 -> 12 rakes | 4.80 +- 0.05 | 19,148 | 59.89 +- 0.57 | 69.44 | 12.68 | 4.43 | 26.30 | 33,269 | 21% | 0.02 | 5.04 | +0.03 +- 0.08 | +19.6 +- 0.7 |

## 2x2x2 factorial: crew timing x Ghugus loops x loading method

| case | rakes/day | t/day | cycle h | P90 cycle h | Ghugus terminal h | crew wait h | held at CD h | demurrage Rs/rake | single-line util | crew expiries/100 | CSTPS stock min days | delta rakes/day (paired 95% CI) | delta cycle h |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| crew=ready loops=2 loading=CHP | 4.77 +- 0.06 | 19,028 | 40.27 +- 0.45 | 47.13 | 12.69 | 4.44 | 7.54 | 33,328 | 21% | 0.02 | 5.03 | +0.00 +- 0.00 | +0.0 +- 0.0 |
| crew=ready loops=2 loading=RLS | 5.12 +- 0.03 | 20,411 | 37.48 +- 0.24 | 43.25 | 6.43 | 4.43 | 10.61 | 0 | 22% | 0.00 | 5.99 | +0.35 +- 0.07 | -2.8 +- 0.5 |
| crew=ready loops=3 loading=CHP | 5.77 +- 0.06 | 23,036 | 33.27 +- 0.33 | 39.13 | 12.10 | 4.43 | 1.67 | 33,222 | 25% | 0.00 | 7.82 | +1.00 +- 0.09 | -7.0 +- 0.6 |
| crew=ready loops=3 loading=RLS | 6.74 +- 0.02 | 26,897 | 28.43 +- 0.09 | 32.45 | 6.45 | 4.43 | 2.44 | 1 | 29% | 0.00 | 9.72 | +1.97 +- 0.06 | -11.8 +- 0.4 |
| crew=loading loops=2 loading=CHP | 5.77 +- 0.03 | 23,027 | 33.27 +- 0.21 | 38.25 | 12.55 | 1.77 | 3.84 | 33,440 | 25% | 0.00 | 7.93 | +1.00 +- 0.06 | -7.0 +- 0.5 |
| crew=loading loops=2 loading=RLS | 6.76 +- 0.03 | 26,981 | 28.38 +- 0.16 | 33.18 | 6.42 | 1.76 | 5.01 | 3 | 29% | 0.00 | 9.85 | +1.99 +- 0.07 | -11.9 +- 0.5 |
| crew=loading loops=3 loading=CHP | 6.37 +- 0.04 | 25,425 | 30.10 +- 0.16 | 35.07 | 12.24 | 1.77 | 1.15 | 33,299 | 28% | 0.00 | 9.29 | +1.60 +- 0.06 | -10.2 +- 0.5 |
| crew=loading loops=3 loading=RLS | 7.76 +- 0.04 | 30,971 | 24.73 +- 0.11 | 28.56 | 6.40 | 1.76 | 1.67 | 0 | 34% | 0.00 | 10.36 | +2.99 +- 0.06 | -15.5 +- 0.4 |

## Factorial effects on rakes/day (effect = mean(high) - mean(low))

| effect | rakes/day |
|---|---|
| Crew during loading | +1.07 |
| Loop +1 | +1.06 |
| RLS | +0.92 |
| Crew x Loop | -0.26 |
| Crew x RLS | +0.27 |
| Loop x RLS | +0.25 |
| Crew x Loop x RLS | -0.06 |
