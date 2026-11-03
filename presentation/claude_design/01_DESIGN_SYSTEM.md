# RakeFlow — "Voxel Rail" design system

A Minecraft-*inspired* blocky (voxel / pixel-art) design system for a 10-slide, 13-minute academic presentation
about a railway coal-logistics simulation. The aim is **playful but professional**: the block style makes the railway
system easy to picture, while the layout, typography and colours stay **clean and readable on a projector** for
faculty judges.

> **Important:** Minecraft-*style* only. Draw original pixel/voxel art. **Do not** use Mojang/Minecraft logos, the
> Minecraft font, game screenshots, textures or item sprites. No "Minecraft" wording on slides.

---

## 1. Design principles

1. **Blocks explain the system.** Every physical thing (rake, track, loop, silo, tippler, crew) is a simple voxel
   object, so judges see the railway, not abstract boxes.
2. **Readability beats decoration.** Body text is a clean sans-serif. Pixel type only for titles, labels and big
   numbers. Minimum body size 18 pt.
3. **One message per slide.** Every slide title is a full sentence takeaway (e.g. "80% of the cycle is spent at the
   terminals").
4. **Numbers are heroes.** Key results appear as big pixel-font stat blocks.
5. **Light canvas, dark text.** Content slides use a light background for projector contrast. Only the title and
   closing slides are dark.
6. **Honest labelling.** Assumptions are visibly tagged (an "ASSUMPTION" chip) so judges see the difference between
   facts and model inputs.

---

## 2. Colour palette

Contrast was checked (WCAG): every text colour below is ≥ 4.5:1 on `bg` and `surface`, except Gold, which is a fill colour only on light slides.

### 2.1 Core

| Token | Name | Hex | Use |
|---|---|---|---|
| `bg` | **Daylight Paper** | `#F6F4EE` | Background of all content slides (warm off-white, easy on projectors) |
| `surface` | **Birch** | `#FFFFFF` | Cards / block panels on content slides |
| `surface-2` | **Smooth Stone** | `#E7E4DC` | Secondary panels, table stripes |
| `ink` | **Coal** | `#1E1E1E` | Main text, loaded rakes, outlines |
| `ink-2` | **Deepslate** | `#4A4A4F` | Secondary text, captions |
| `line` | **Gravel** | `#BDB8AD` | Grid lines, borders, track sleepers |
| `dark-bg` | **Night Deepslate** | `#23262B` | Title and closing slide background |

### 2.2 Accents (each has one job)

| Token | Name | Hex | Meaning — use consistently |
|---|---|---|---|
| `grass` | **Grass Block** | `#2E7D22` | Improvement, "better", recommended option, positive Δ |
| `gold` | **Gold Ore** | `#E5A50A` | Highlight, section tags, the one key number per slide |
| `redstone` | **Redstone** | `#C0392B` | Bottleneck, problem, constraint, negative Δ |
| `diamond` | **Diamond** | `#17738A` | Data, information, model / method elements |
| `dirt` | **Dirt** | `#8B5A2B` | Empty rakes, terrain, Ghugus mine |
| `rail` | **Rail Iron** | `#6E6E73` | Tracks, neutral bars in charts |

**Chart colour order:** `grass` (improved case) · `rail` (baseline/neutral) · `diamond` (method/secondary) ·
`gold` (best case) · `redstone` (bottleneck/negative).

**Contrast rules (checked):**
- On light slides (`bg` / `surface`): text may be `ink` (15:1), `ink-2` (8:1), `redstone` (4.9:1), `diamond` (5.0:1), `dirt` (5.3:1), `grass` (4.7:1), `rail` (4.6:1). **Gold is never text on light slides** (2:1) — use it as a fill with `ink` text on top (7.7:1).
- On dark slides (`dark-bg`): text may be white (14:1), `#D9D6CF` (10:1) or `gold` (7:1) only. Use other accents only as block fills there.
- White text is fine on `ink`, `grass`, `redstone`, `diamond` and `dirt` fills.
- Never red on green, or colour as the only signal.

---

## 3. Typography

| Role | Font | Fallback | Size | Notes |
|---|---|---|---|---|
| Slide title | **Pixelify Sans** Bold | VT323 → Courier New Bold | 34–40 pt | Sentence case, max 2 lines |
| Section tag (kicker) | **Pixelify Sans** | Courier New Bold | 14 pt, letter-spaced, ALL CAPS | In a gold block chip above the title, e.g. `02 · THE SYSTEM` |
| Big stat numbers | **Pixelify Sans** Bold | Courier New Bold | 54–72 pt | One colour per meaning (grass = gain, redstone = problem) |
| Body text | **Nunito** | Calibri → Arial | 18–22 pt | Never pixel font for body |
| Labels / captions | **Nunito** SemiBold | Calibri | 14–16 pt | `ink-2` colour |
| Table text | **Nunito** | Calibri | 14–16 pt | Header row: `ink` fill, white text |

Line height 1.3 for body. Left-align all body text; centre only big stats.

---

## 4. Shape language: "blocks"

- **Block card:** rectangle with **square corners** (no rounding), 3 px `ink` outline, and a **hard pixel drop
  shadow** offset 6 px right and 6 px down in `#00000033` (no blur). This is the signature motif.
- **Stepped border (optional for hero cards):** corners cut in 2 pixel steps for a voxel feel.
- **Chips / tags:** small solid blocks (gold for section tags; grass "BETTER", redstone "BOTTLENECK", diamond
  "MODEL", gravel "ASSUMPTION").
- **Dividers:** a row of small square "track sleepers" (Gravel) instead of thin lines.
- **Grid:** 12-column grid on a 13.33 × 7.5 in (16:9) slide; 0.5 in outer margin; 0.3 in gutters. Snap everything
  to an 8 px "block" unit.
- **Iconography:** 16×16 or 24×24 **pixel icons**, drawn flat with 1 px outline, scaled by whole multiples (×4, ×6)
  so pixels stay crisp.

---

## 5. Pixel icon set (draw these, original art)

| Concept | Icon (describe to the illustrator) |
|---|---|
| Loaded rake | Black mine-cart-style wagon heaped with coal lumps |
| Empty rake | Same wagon in `dirt` brown, empty |
| Rake train | 3–4 wagons + a chunky locomotive block |
| Single line | One straight rail strip with sleepers |
| Main line | Two parallel rail strips (DN ↓ / UP ↑) |
| Loop | Rail strip with a side track bulging out and rejoining |
| Loading siding / CHP | Small shed with a conveyor block over a wagon |
| Rapid loading silo | Tall cylinder block with a funnel/chute over a wagon |
| Tippler (unloading) | Wagon tilted inside a ring frame |
| Power station | Blocky building with two chimneys and smoke pixels |
| Crew | Pixel worker head with cap + small clock |
| Clock / time | Square pixel clock face |
| BPC exam | Clipboard with a tick |
| Demurrage (₹) | Gold block coin with ₹ |
| Data source | Pixel book / scroll |
| Experiment | Pixel flask / lever switch |
| Bottleneck | Redstone barrier block with a stop hand |
| Improvement | Grass block with an up arrow |

---

## 6. Diagrams and illustrations

### 6.1 The route map (hero illustration, reused small on several slides)
Side-on or isometric voxel strip, left to right:
**Ghugus coal sidings** (black coal piles, conveyor shed, 2 loops) → **single line 14 km** → **Tadali junction**
(2 loops) → **double main line** (passenger trains in `diamond`, goods in `rail`) → **CSTPS power station**
(chimneys, 4 tipplers + 1 spare) → empty return arrow back to Ghugus. Optional **Balharshah depot** (BPC) and
**crew lobby** as small blocks off to the side. Label everything in Nunito.

### 6.2 Process flow
Blocks in a loop (8 steps), each with a pixel icon, step name and **hours** in pixel font. Steps where time is lost
are coloured `redstone`/`gold` fill; quick steps `surface-2`.

### 6.3 Causal chain
A vertical stack of 5 block cards joined by chunky pixel arrows ("domino" style), ending in a redstone
"fewer deliveries" block.

---

## 7. Charts

- **Style:** flat bars with square ends, no 3-D, no gradients. Optional "voxel bar": stack of small squares.
- **Data labels** on every bar in Nunito Bold 16 pt; axis labels 14 pt `ink-2`; light gravel gridlines or none.
- **Baseline** is always `rail` grey; **improvements** `grass`; **best case** `gold`; **bottleneck/negative**
  `redstone`.
- **Allowed chart types:** horizontal bar (time breakdown), vertical bar (experiments, factorial), line
  (fleet-size plateau), stat blocks (scorecards).
- **Native/editable charts preferred** (not images), using the exact numbers given in the content file.

---

## 8. Slide layouts (templates)

| Layout | Used for | Structure |
|---|---|---|
| **L1 Title (dark)** | Slide 1 | Night Deepslate background; voxel route illustration across the bottom third; title in pixel font (white), subtitle Nunito (`#D9D6CF`), 3 gold stat chips |
| **L2 Problem / hero stat** | Slide 2 | Left: 2–3 short statements; right: big contrast stat ("~1.7 h moving vs 40.3 h cycle") |
| **L3 System diagram** | Slide 3 | Full-width route illustration on top; process strip + 3 "clock" cards below |
| **L4 Two-column cards** | Slides 4, 5 | Two or three block cards side by side with icons and short bullets |
| **L5 Chart + insight** | Slides 6, 8 | Chart 60% left; insight card(s) 40% right with big stats |
| **L6 Causal chain** | Slide 7 | Domino chain left; evidence stat blocks right |
| **L7 Matrix + scorecard** | Slide 9 | 8-bar chart or 2×2×2 cube/table left; before → after scorecard right |
| **L8 Closing (dark)** | Slide 10 | Recommendations as 3 numbered blocks; limitations strip; "Thank you / Questions" |

**Every content slide:** gold section-tag chip top-left; sentence title below it; content; small footer
"RakeFlow · IE305 Simulation Lab" left and slide number right (14 pt, `ink-2`). **No** header/footer colour bars.

---

## 9. Motion (if the tool supports it)

- Simple "block drop" appear (fade + 10 px downward) for cards, one at a time.
- Bars grow from zero on the experiment slides.
- No spinning, bouncing or sound.

---

## 10. Accessibility checklist

- Body ≥ 18 pt, captions ≥ 14 pt; pixel font never below 14 pt.
- Contrast ≥ 4.5:1 for all text; check gold usage (chips with `ink` text only).
- Never rely on colour alone: pair with icons/labels ("+1.00 ▲", "BOTTLENECK").
- Max ~40 words of body text per slide; detail goes in speaker notes.
