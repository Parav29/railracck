# Lateness-history sources for trains at Chandrapur (CD) / Tadali (TAE)

Research date: 2026-10-13. Goal: obtain ~90 days of per-train, per-day delay at Chandrapur to
calibrate a stochastic passenger-train arrival process for the Tadali merge.

## Access notes (what could/could not be fetched from this sandbox)

| Site | Fetchable? | Notes |
|---|---|---|
| erail.in | Yes | Timetable pages and raw `getTrains.aspx` endpoint worked. No historical delay. |
| etrain.info | Yes | `/train/<Name>-<No>/history` worked. Station-wise average delay with period filter. |
| railmitra.com | Yes | Live run for yesterday/today/tomorrow only. |
| indiarailinfo.com | **No** (fetch error) | Known to hold per-run arrival/departure history behind member login. |
| runningstatus.in | **No** (fetch error) | Page `https://runningstatus.in/history/<train_no>` exists per search results; not verified. |
| railyatri.in | **No** (fetch error) | `https://www.railyatri.in/train-running-history/<train_no>`; not verified. |
| trainman.in | **No** (fetch error) | Not verified. |
| confirmtkt.com | **No** (domain approval not granted) | Not verified. |
| goibibo.com | **No** (robots disallowed) | |
| direct curl to any site | **No** (egress 403) | All fetching went through the WebFetch tool. |

## 1. etrain.info — best source actually verified (station-wise aggregate, up to 1 year)

URL pattern: `https://etrain.info/train/<Train-Name-Slug>-<train_no>/history`
(other sections: `/schedule`, `/live`, `/availability`, `/map`, `/fare`; site index at `https://etrain.info/train-history`).

What it shows (verified 2026-10-13):
- For every station on the route: **average delay (minutes)** for a selectable period.
- Period selector: *last week / this month / last 3 months / last 6 months / last year* (client-side tabs, no URL
  parameter visible in the fetched HTML; the default render is "this month").
- Colour bar per station with counts in bands: Right Time 0-15 min, Slight Delay 15-60 min, Significant >60 min,
  Cancelled/Unknown. The page states that hovering/clicking a station bar reveals "detailed delay history" — i.e. a
  per-day list is present in the page JS but was not visible in the static text fetch. **A headless browser
  (Playwright/Selenium) will be needed to pull the per-day list; the "last 3 months" tab gives exactly the 90-day window.**

Sample values (period = "this month", fetched 2026-10-13):

| Train | Station | Avg delay (min) | URL |
|---|---|---|---|
| 12723 Telangana SF (north/UP) | Chandrapur CD | 26 | https://etrain.info/train/Telangana-Exp-12723/history |
| 12723 | Balharshah BPQ | 21 | same |
| 12723 | Nagpur NGP | 30 | same |
| 12724 Telangana SF (south/DN) | Chandrapur CD | **86** | https://etrain.info/train/Telangana-Exp-12724/history |
| 12724 | Balharshah BPQ | 48 | same |
| 12724 | Nagpur NGP | 63 | same |
| 61127 WR-BPQ MEMU (south/DN) | Tadali TAE | 32 | https://etrain.info/train/WR-BPQ-MEMU-61127/history |
| 61127 | Chandrapur CD | 35 | same |
| 61127 | Balharshah BPQ | -1 (recovers slack) | same |

Observation useful for the model: southbound (DN) trains reach CD with much larger accumulated delay (they have come
~1000 km from Delhi) than northbound (UP) trains that just left Balharshah/Secunderabad. The DN line is the one the
loaded Ghugus coal rakes must merge onto at Tadali, so DN-direction lateness variance is the one that matters most.

## 2. railmitra.com — single-run actuals (yesterday / today / tomorrow)

URL pattern: `https://www.railmitra.com/train-running-status/<train_no>` (also
`https://www.railmitra.com/live-train-running-status/<slug>-<train_no>`).
Shows scheduled vs actual arr/dep and delay per station for the current run, with Yesterday/Today/Tomorrow tabs.
Depth: ~3 days only. Could be scraped daily to build a 90-day archive going forward.

Sample (run of 13-Oct-2026, train 12723): CD sched arr 12:15 / actual 12:26 (+11 min); dep 12:17 / 12:28 (+11).
Other stations same run: SC +8, KZJ +32, RDM +13, BPQ +5, NGP +20, BPL +14.

## 3. indiarailinfo.com — richest per-run archive (needs login; not fetchable here)

URL patterns (from prior knowledge, not verified this session):
- Train page: `https://indiarailinfo.com/train/<slug>/<internal_id>` ; running-status/history tab per train.
- Station arrivals: `https://indiarailinfo.com/arrivals/chandrapur-cd/1186`, departures for Tadali `/departures/tadali-tae/4139`.
Member-contributed and NTES-scraped per-run data goes back months to years, with station-wise actual times.
Requires free account; fetch from this sandbox failed. Recommend a student try it manually in a browser.

## 4. runningstatus.in / railyatri / trainman / confirmtkt — unverified

- `https://runningstatus.in/history/<train_no>` – appeared in search results; typically shows last ~7-30 days per-run
  delay at destination and at a chosen station. Fetch failed here.
- `https://www.railyatri.in/train-running-history/<train_no>` – historically shows ~7 days of per-day delay with
  "on-time %" summary. Fetch failed here.
- `https://www.trainman.in/running-history/<train_no>` – historically 7-day per-day history. Fetch failed.
- `https://www.confirmtkt.com/train-running-status/<train_no>` – live only.

## 5. Official

- NTES (`https://enquiry.indianrail.gov.in/mntes/`) gives live/one-day-back only; no public history API.
- RailRadar / Where-is-my-train apps hold history but no public bulk endpoint.

## Recommendation

1. Primary: **etrain.info `/history` with the "last 3 months" tab**, scraped with a headless browser for each of
   the ~115 trains in `timetable_tadali_chandrapur.csv`, reading the per-day popup for station `#CD` (and `#TAE` for
   the two MEMUs). Gives the 90-day per-day delay series directly.
2. Fallback / cross-check: indiarailinfo running-history (manual login) for the ~15 daily trains.
3. Going forward: cron-scrape railmitra "Yesterday" tab daily to accumulate an independent archive.
4. If only aggregates are obtainable, use etrain.info banded counts (0-15 / 15-60 / >60 / cancelled) per station to fit
   a mixture (e.g. point-mass near 0 + lognormal tail) per train and per direction.
