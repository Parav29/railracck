# RakeFlow simulator page

A small local website to present the model: pick an experiment (Baseline, A-E) or change the parameters on the
left; the centre shows the rakes moving (Ghugus sidings and loops, the single line, Tadali, the two main-line tracks
with passenger and goods trains, CSTPS tipplers, the BPC depot); the right shows that case's results.

**Where the numbers come from:** `build_data.py` runs the RakeFlow model (the same Java as
`model/RakeFlow/RakeFlow.alp`, via the test harness) for every combination of the five settings
(fleet 6/8/10/12 x Ghugus loops 2/3 x crew timing x loading method x single/double line = 64 cases):
30 replications each for the results panel (3 d warm-up + 30 d, seeds 1-30, 95% CI, paired delta vs baseline),
and one recorded replication (seed 1, 15 days) for the animation. The page only plays these back.

## Run it

With nginx (from the repository root):
```
mkdir -p website/tmp
nginx -p "$PWD/website" -c nginx.conf          # start
# open http://localhost:8080
nginx -p "$PWD/website" -c nginx.conf -s stop  # stop
```
Without nginx: `python3 -m http.server 8080 --directory website`, or just double-click `website/index.html`.

## Rebuild the data (after changing the model)
```
python3 website/build_data.py      # needs Java; ~1 minute
```
