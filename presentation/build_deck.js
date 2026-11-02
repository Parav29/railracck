// Builds presentation/RakeFlow_Final_Presentation.pptx in the visual style of the submitted proposal deck
// (blocky scene backgrounds, dark translucent cards, yellow section tags, Lilita One titles, Nunito body).
// Numbers come from model/results/summary_tables.md (harness, 30 replications, common random numbers).
// Run:  node presentation/build_deck.js   (needs pptxgenjs; apply_theme.js from the pptx skill is optional)
const path = require("path");
const pptxgen = require("pptxgenjs");

const OUT = path.join(__dirname, "RakeFlow_Final_Presentation.pptx");
const A = (f) => path.join(__dirname, "assets", f);

const THEME = {
  name: "RakeFlow Blocky",
  headFontFace: "Lilita One",
  bodyFontFace: "Nunito",
  colors: {
    dk1: "16181C", lt1: "FFFFFF", dk2: "1D2126", lt2: "B9C2CC",
    accent1: "FFD23F", accent2: "2FB35A", accent3: "5FD0FF", accent4: "E0452B", accent5: "7EE07A", accent6: "FF8A1F",
    hlink: "5FB4F0", folHlink: "9AA3AD",
  },
};
// hex copies for options that only take hex (chart colours, grid lines)
const HX = { card: "16181C", ink: "1D2126", mute: "B9C2CC", grid: "3A4048", yel: "FFD23F", grn: "2FB35A", lgrn: "7EE07A",
             cyan: "5FD0FF", red: "E0452B", org: "FF8A1F", grey: "9AA3AD", white: "FFFFFF" };

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5 in, same as the proposal deck
pres.title = "RakeFlow - Coal Rake Cycle, final presentation";
pres.author = "IE305 Team RakeFlow";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;
const HEAD = THEME.headFontFace, BODY = THEME.bodyFontFace;

// ---------- layouts: one per scene, title placeholder in the sky ----------
const SCENES = { SYSTEM: "scene_system.png", OFFICE: "scene_office.png", LINES: "scene_lines.png" };
for (const [k, f] of Object.entries(SCENES)) {
  pres.defineSlideMaster({
    title: "SCENE_" + k,
    background: { path: A(f) },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.89, y: 0.75, w: 11.6, h: 0.62, fontFace: HEAD,
        fontSize: 32, color: C.background1, margin: 0, valign: "middle", align: "left" }, text: "" } },
    ],
    slideNumber: { x: 12.55, y: 7.08, w: 0.5, h: 0.28, fontFace: BODY, fontSize: 10, color: C.background1, align: "right" },
  });
}

// ---------- reusable pieces (same geometry as the proposal deck) ----------
function tag(s, text) {
  const w = 0.4 + text.length * 0.112;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.89, y: 0.39, w, h: 0.29, rectRadius: 0.06,
    fill: { color: C.accent1 }, line: { type: "none" }, objectName: "Section tag" });
  s.addText(text, { x: 0.99, y: 0.39, w: w - 0.1, h: 0.29, fontFace: BODY, fontSize: 12, bold: true, color: C.text2,
    margin: 0, valign: "middle", charSpacing: 1, isTextBox: true, objectName: "Section tag text" });
}
function card(s, x, y, w, h, name) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.12, fill: { color: C.text1, transparency: 14 },
    line: { type: "none" }, objectName: name || "Card" });
}
function chip(s, x, y, w, text, name) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 0.32, rectRadius: 0.06, fill: { color: C.text1, transparency: 18 },
    line: { type: "none" }, objectName: (name || "Chip") + " bg" });
  s.addText(text, { x: x + 0.11, y, w: w - 0.2, h: 0.32, fontFace: BODY, fontSize: 12, bold: true, color: C.background1,
    margin: 0, valign: "middle", isTextBox: true, objectName: name || "Chip" });
}
function head(s, x, y, w, text, color) {
  s.addText(text, { x, y, w, h: 0.4, fontFace: HEAD, fontSize: 19, color, margin: 0, valign: "middle", isTextBox: true,
    objectName: "Card heading" });
}
function badge(s, x, y, n, color, dark) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 0.31, h: 0.28, rectRadius: 0.05, fill: { color },
    line: { type: "none" }, objectName: "Badge " + n });
  s.addText(String(n), { x, y, w: 0.31, h: 0.28, fontFace: BODY, fontSize: 13, bold: true, align: "center",
    color: dark ? C.text2 : C.background1, margin: 0, valign: "middle", isTextBox: true, objectName: "Badge text " + n });
}
// one numbered row: bold lead + muted rest
function row(s, x, y, w, n, color, lead, rest, dark, size) {
  badge(s, x, y, n, color, dark);
  s.addText([{ text: lead, options: { bold: true, color: C.background1 } },
             { text: rest ? "  " + rest : "", options: { color: C.background2 } }],
    { x: x + 0.42, y: y - 0.04, w: w - 0.42, h: 0.36, fontFace: BODY, fontSize: size || 14, margin: 0, valign: "middle",
      isTextBox: true, objectName: "Row " + n });
}
function bullets(s, x, y, w, h, items, size) {
  s.addText(items.map((t, i) => {
    const runs = Array.isArray(t) ? t : [{ text: t }];
    return runs.map((r, j) => ({ text: r.text, options: { bullet: j === 0 ? { indent: 14 } : undefined,
      bold: !!r.bold, color: r.bold ? C.background1 : C.background2, breakLine: j === runs.length - 1 && i < items.length - 1,
      paraSpaceAfter: 5 } }));
  }).flat(), { x, y, w, h, fontFace: BODY, fontSize: size || 13, valign: "top", margin: 0, isTextBox: true,
    objectName: "Bullets" });
}
function label(s, x, y, w, text, opts) {
  s.addText(text, Object.assign({ x, y, w, h: 0.3, fontFace: BODY, fontSize: 12, color: C.background2, margin: 0,
    valign: "middle", isTextBox: true, objectName: "Label" }, opts || {}));
}
function stat(s, x, y, w, big, color, small, sub) {
  s.addText(big, { x, y, w, h: 0.85, fontFace: HEAD, fontSize: 44, color, margin: 0, valign: "bottom", isTextBox: true,
    objectName: "Stat value" });
  s.addText(small, { x, y: y + 0.9, w, h: 0.3, fontFace: BODY, fontSize: 14, bold: true, color: C.background1, margin: 0,
    isTextBox: true, objectName: "Stat label" });
  if (sub) s.addText(sub, { x, y: y + 1.2, w, h: 0.5, fontFace: BODY, fontSize: 12, color: C.background2, margin: 0,
    valign: "top", isTextBox: true, objectName: "Stat note" });
}
const chartBase = {
  catAxisLabelColor: HX.mute, valAxisLabelColor: HX.mute, catAxisLabelFontFace: "+mn-lt", valAxisLabelFontFace: "+mn-lt",
  catAxisLabelFontSize: 11, valAxisLabelFontSize: 10, dataLabelFontFace: "+mn-lt", dataLabelFontSize: 11,
  dataLabelColor: HX.white, valGridLine: { color: HX.grid, size: 0.5 }, catGridLine: { style: "none" },
  catAxisLineShow: false, valAxisLineShow: false, showLegend: false, titleFontFace: "+mn-lt",
};
const addSlide = (scene, section) => pres.addSlide({ masterName: "SCENE_" + scene, sectionTitle: section });

// =====================================================================================
// 1. Title + the answer
pres.addSection({ title: "Opening" });
{
  const s = addSlide("SYSTEM", "Opening");
  tag(s, "IE305 · FINAL PRESENTATION");
  s.addText("RakeFlow: Coal Rake Cycle", { placeholder: "title" });
  s.addText("Ghugus → Tadali → Chandrapur · AnyLogic 8.9.9", { x: 0.89, y: 1.45, w: 6.4, h: 0.4, fontFace: BODY,
    fontSize: 17, bold: true, color: C.background1, margin: 0, isTextBox: true, objectName: "Subtitle" });
  chip(s, 0.89, 2.0, 1.55, "8 rakes today", "Chip fleet");
  chip(s, 2.56, 2.0, 2.05, "40.3 h mean cycle", "Chip cycle");
  chip(s, 4.73, 2.0, 2.15, "4.77 rakes/day", "Chip throughput");
  card(s, 7.36, 0.42, 5.08, 2.62, "Answer card");
  head(s, 7.6, 0.55, 4.6, "The answer", C.accent1);
  s.addText("Time is lost at the terminals, not on the single line.", { x: 7.6, y: 0.98, w: 4.65, h: 0.62, fontFace: BODY,
    fontSize: 16, bold: true, color: C.background1, margin: 0, valign: "top", isTextBox: true, objectName: "Answer" });
  row(s, 7.6, 1.72, 4.7, 1, HX.red, "Single line + Tadali merge:", "0.6 h of 40 h");
  row(s, 7.6, 2.1, 4.7, 2, HX.grn, "Order crew during loading:", "+1.0 rakes/day");
  row(s, 7.6, 2.48, 4.7, 3, HX.yel, "₹228 cr doubling:", "+0.1 rakes/day", true);
  s.addNotes("Headline first. We built the closed-circuit coal rake cycle in AnyLogic and ran every what-if from the proposal. The single line and the Tadali merge, which we expected to be the problem, cost only about 0.6 h of a 40 h cycle. The time goes at the two terminals and in waiting for crews. One free operating change, ordering the crew while the rake is still loading, adds about one rake a day, roughly nine times what the Rs 228 crore doubling adds in our model.");
}

// =====================================================================================
// 2. How the model is built
pres.addSection({ title: "Model" });
{
  const s = addSlide("OFFICE", "Model");
  tag(s, "01 · THE MODEL");
  s.addText("How the AnyLogic model works", { placeholder: "title" });
  card(s, 0.89, 1.55, 6.25, 3.85, "Cycle card");
  head(s, 1.11, 1.7, 5.9, "One rake, one cycle", HX.lgrn);
  const steps = [
    ["Load at Ghugus", "placement, CHP siding, release"], ["Wait for crew", "booked at Balharshah, 9 h clock"],
    ["Single line 14 km", "one block; needs a free Tadali loop"], ["Merge at Tadali", "gap ≥ A-05 from 115 real trains"],
    ["Unload at CSTPS", "placement, 4 tipplers, release"], ["Return empty", "held until loops free (A-27)"],
    ["BPC exam when due", "6000 km / 30 d, daylight only"],
  ];
  steps.forEach(([a, b], i) => row(s, 1.11, 2.2 + i * 0.44, 5.9, i + 1, i === 6 ? HX.yel : HX.grn, a, b, i === 6, 13.5));
  card(s, 7.36, 1.55, 5.08, 3.85, "Build card");
  head(s, 7.58, 1.7, 4.7, "Built in three phases", HX.cyan);
  bullets(s, 7.58, 2.2, 4.7, 3.1, [
    [{ text: "Phase 1 core: ", bold: true }, { text: "loops, sidings, single line, Tadali paths, tipplers" }],
    [{ text: "Phase 2 + crew: ", bold: true }, { text: "9 h duty, 2 h notice → 11 h, relief, HQ rest" }],
    [{ text: "Phase 3 + BPC: ", bold: true }, { text: "km/day validity, depot detour, 06–18 h exam" }],
    [{ text: "Event kernel in Main; ", bold: true }, { text: "AnyLogic gives the clock, animation, charts and experiments" }],
    [{ text: "100 parameters, ", bold: true }, { text: "each named by its source ID (CR-01, A-13…)" }],
  ], 13);
  chip(s, 0.97, 5.62, 4.3, "model/RakeFlow/RakeFlow.alp · 20 timed stages", "Chip file");
  s.addNotes("The model follows one rake round the loop: placement and loading at the Ghugus CHP siding, waiting for a crew that comes from the Balharshah lobby, the 14 km single line worked as one block that a rake may only enter when a loop is free at the far end, a path at Tadali that keeps the A-05 gap from every one of the 115 timetabled passenger trains plus through goods, unloading at CSTPS, and the empty return. Three clocks run against every rake: crew duty, BPC validity and demurrage. We added realism in three phases and checked each before the next. Every cycle is split into 20 timed stages, which gives the decomposition on the results slides.");
}

// =====================================================================================
// 3. Data and inputs
{
  const s = addSlide("OFFICE", "Model");
  tag(s, "02 · DATA & INPUTS");
  s.addText("Inputs: public sources, every number tagged", { placeholder: "title" });
  card(s, 0.89, 1.55, 7.3, 2.05, "Stats card");
  stat(s, 1.15, 1.55, 2.3, "115", C.accent1, "passenger trains", "erail timetable, real days of run");
  stat(s, 3.55, 1.55, 2.2, "100", C.accent5, "model parameters", "HARD / SOFT / ASSUMPTION");
  stat(s, 5.85, 1.55, 2.2, "29", C.accent3, "flagged assumptions", "A-01 … A-29, all tested");
  card(s, 0.89, 3.78, 7.3, 1.62, "Distributions card");
  head(s, 1.11, 3.88, 7, "How inputs enter the model", HX.lgrn);
  bullets(s, 1.11, 4.3, 7.0, 1.05, [
    [{ text: "Triangular (min, mode, max) ", bold: true }, { text: "for times with no record: CAG Table 18, RB norms" }],
    [{ text: "Lognormal lateness, Poisson goods trains; ", bold: true }, { text: "hard rules as constraints" }],
  ], 13);
  card(s, 8.4, 1.55, 4.04, 3.85, "Gaps card");
  head(s, 8.62, 1.7, 3.7, "What we did not get", HX.red);
  bullets(s, 8.62, 2.2, 3.65, 3.1, [
    "No Central Railway or WCL records arrived; every input is public or assumed",
    "Data request letter and 8 collection templates are ready",
    "The model exports RAKE_cycle_log in the template's columns, so real logs drop straight in",
  ], 13);
  chip(s, 0.97, 5.62, 6.3, "data/RakeFlow_Parameter_Sheet.xlsx · research/ · templates/", "Chip files");
  s.addNotes("The proposal planned to get section records through Prof. Rangaraj; those did not arrive, so the model runs on public sources. The passenger timetable is real: 115 trains with their days of run from erail. Rules (crew duty, BPC, free time, demurrage) come from Railway Board letters and CAG audits. Everything else is an explicit assumption with an ID, a default and a reason, and each was varied in the sensitivity runs. The data request letter and the collection templates are in the repository, and the model writes its cycle log in exactly the template format so real data can be compared directly.");
}

// =====================================================================================
// 4. Verification and validation
{
  const s = addSlide("LINES", "Model");
  tag(s, "03 · VERIFICATION & VALIDATION");
  s.addText("Does the model behave, and does it match reality?", { placeholder: "title" });
  card(s, 0.89, 1.55, 5.0, 3.85, "Verification card");
  head(s, 1.11, 1.7, 4.6, "Verification", HX.lgrn);
  bullets(s, 1.11, 2.2, 4.6, 3.1, [
    [{ text: "Invariants checked after every event: ", bold: true }, { text: "capacities, one direction on the single line, crew ≤ 11 h, no rake lost" }],
    [{ text: "Same Java in AnyLogic and the test harness: ", bold: true }, { text: "seed 1 gives 4.70 rakes/day in both" }],
    [{ text: "Little's law holds: ", bold: true }, { text: "8 rakes ÷ 40.3 h × 24 = 4.77 rakes/day" }],
    [{ text: "30 reps × 30 days, ", bold: true }, { text: "3-day warm-up, common random numbers" }],
  ], 13);
  const H = { fontFace: BODY, fontSize: 12, bold: true, color: HX.yel, fill: { color: HX.ink } };
  const c = (t, o) => ({ text: t, options: Object.assign({ fontFace: BODY, fontSize: 12, color: HX.white }, o || {}) });
  const ok = (t) => c(t, { color: HX.lgrn, bold: true }), bad = (t) => c(t, { color: HX.org, bold: true });
  card(s, 6.1, 1.55, 6.34, 3.85, "Validation card");
  head(s, 6.32, 1.7, 5.9, "Validation vs public benchmarks", HX.cyan);
  s.addTable([
    [{ text: "Measure", options: H }, { text: "Benchmark", options: H }, { text: "Model", options: H }, { text: "", options: H }],
    [c("Mean cycle"), c("24–72 h"), c("40.3 h"), ok("inside")],
    [c("Rakes/day to CSTPS"), c("6–10 (CEA)"), c("4.77"), bad("below")],
    [c("Ghugus detention"), c("≤ 15–16 h"), c("15.5 h"), ok("inside")],
    [c("CSTPS detention"), c("≤ 15–16 h"), c("21.2 h"), bad("above")],
    [c("Rakes over free time"), c("many, not all"), c("load 100%"), bad("all")],
  ], { x: 6.32, y: 2.2, w: 5.9, colW: [1.95, 1.5, 1.35, 1.1], rowH: 0.36, border: { type: "solid", pt: 0.5, color: HX.grid },
    fill: { color: HX.card }, valign: "middle", margin: [0.02, 0.08, 0.02, 0.08], objectName: "Validation table" });
  label(s, 6.32, 4.45, 5.9, "Gaps trace to assumed Ghugus loops (A-01), yard times (A-13/14) and loading LD-03 > 3 h free time.",
    { h: 0.75, valign: "top", fontSize: 12 });
  s.addNotes("Verification: the harness checks physical and rule invariants after every single event over many stress configurations, and the AnyLogic run reproduces the harness numbers exactly for the same seed. Little's law ties fleet, cycle time and throughput together. Validation: cycle time and Ghugus detention sit inside public benchmarks. Throughput is below the CEA-implied 6 to 10 rakes per day. Per our brief that points at the assumption table, not the data: the model is limited by the two assumed Ghugus loops and the CAG yard handling times. All loading rakes exceed the 3 h free time because the published loading-time range starts at 4 h. These are the first numbers to check against field data.");
}

// =====================================================================================
// 5. Where the time goes
pres.addSection({ title: "Results" });
{
  const s = addSlide("SYSTEM", "Results");
  tag(s, "04 · RESULTS");
  s.addText("Where a rake's 40 hours go", { placeholder: "title" });
  card(s, 0.89, 1.5, 7.6, 3.95, "Decomposition chart card");
  const cats = ["Ghugus terminal", "CSTPS terminal", "Empties held at CD", "Crew waits", "Running", "BPC exam detour",
                "Single-line waits", "Tadali DN merge"];
  const vals = [12.69, 11.95, 7.54, 4.44, 1.70, 1.37, 0.44, 0.13];
  s.addChart(pres.charts.BAR, [{ name: "Mean h per cycle", labels: cats, values: vals }], Object.assign({}, chartBase, {
    x: 1.0, y: 1.6, w: 7.4, h: 3.75, barDir: "bar", catAxisOrientation: "maxMin", barGapWidthPct: 45,
    chartColors: [HX.org, HX.org, HX.org, HX.yel, HX.grey, HX.grey, HX.cyan, HX.cyan], invertedColors: undefined,
    showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: "0.0 \"h\"", valAxisHidden: true,
    valGridLine: { style: "none" }, showTitle: true, title: "Mean hours per cycle, baseline (30 reps)",
    titleColor: HX.white, titleFontSize: 13, objectName: "Cycle decomposition chart" }));
  card(s, 8.7, 1.5, 3.74, 3.95, "Takeaway card");
  stat(s, 8.95, 1.5, 3.3, "80%", C.accent6, "at the two terminals", "Ghugus + CSTPS + empties held at CD: 32.2 h of 40.3 h");
  stat(s, 8.95, 3.3, 3.3, "0.6 h", C.accent3, "single line + merge", "line 21% busy; Tadali queue 0.03 rakes on average");
  s.addNotes("This is the cycle split into causes, averaged over 30 replications. Orange is terminal time: placement, loading, release and handling at both ends, plus empties held at Chandrapur until the controller can give them a loop at Tadali and at Ghugus. That is about 80% of the cycle. Crew waits are another 4.4 h. The single line and the Tadali merge together are about 0.6 h; the line is only 21% busy and on average 0.03 rakes are queued at the merge. The 90th percentile cycle is 47 h.");
}

// =====================================================================================
// 6. Fleet size
{
  const s = addSlide("LINES", "Results");
  tag(s, "04 · RESULTS");
  s.addText("More rakes do not mean more coal", { placeholder: "title" });
  card(s, 0.89, 1.5, 11.55, 3.95, "Fleet card");
  const fl = ["4", "6", "8", "10", "12", "14", "16", "18", "20"];
  s.addChart(pres.charts.LINE, [{ name: "Rakes/day", labels: fl, values: [3.07, 4.30, 4.77, 4.83, 4.80, 4.79, 4.86, 4.87, 4.84] }],
    Object.assign({}, chartBase, { x: 1.05, y: 1.6, w: 5.55, h: 3.7, chartColors: [HX.lgrn], lineSize: 3, lineDataSymbol: "circle",
      lineDataSymbolSize: 7, showValue: true, dataLabelPosition: "t", dataLabelFormatCode: "0.0", valAxisMinVal: 0, valAxisMaxVal: 6,
      showTitle: true, title: "Rakes/day at CSTPS vs fleet size", titleColor: HX.white, titleFontSize: 13,
      showCatAxisTitle: true, catAxisTitle: "rakes in the closed circuit", catAxisTitleColor: HX.mute, catAxisTitleFontSize: 11,
      objectName: "Fleet throughput chart" }));
  s.addChart(pres.charts.LINE, [
    { name: "Mean cycle h", labels: fl, values: [31.2, 33.4, 40.3, 49.6, 59.9, 70.0, 79.0, 88.6, 98.9] },
    { name: "P90 cycle h", labels: fl, values: [35.5, 38.8, 47.1, 57.7, 69.4, 81.3, 91.8, 103.3, 115.0] }],
    Object.assign({}, chartBase, { x: 6.75, y: 1.6, w: 5.55, h: 3.75, chartColors: [HX.org, HX.yel], lineSize: 3,
      lineDataSymbol: "circle", lineDataSymbolSize: 6, showLegend: true, legendPos: "b", legendColor: HX.mute,
      legendFontFace: "+mn-lt", legendFontSize: 11, valAxisMinVal: 0, showTitle: true, title: "Cycle time grows linearly (h)",
      titleColor: HX.white, titleFontSize: 13, showCatAxisTitle: true, catAxisTitle: "rakes in the closed circuit",
      catAxisTitleColor: HX.mute, catAxisTitleFontSize: 11, objectName: "Fleet cycle chart" }));
  chip(s, 0.97, 5.62, 6.4, "Beyond 8 rakes the Ghugus loops are full; extra rakes only queue", "Chip fleet");
  s.addNotes("Fleet size from 4 to 20 rakes, 30 replications each. Throughput rises to about 4.8 rakes a day at 8 rakes and is flat after that. Every extra rake simply waits, so cycle time and its 90th percentile rise in a straight line, from 40 h at 8 rakes to 99 h at 20. That is Little's law with a fixed bottleneck: the two Ghugus loops. Adding rakes is not a lever until that bottleneck moves.");
}

// =====================================================================================
// 7. The seven what-ifs
{
  const s = addSlide("LINES", "Results");
  tag(s, "04 · RESULTS");
  s.addText("The seven what-ifs we promised", { placeholder: "title" });
  card(s, 0.89, 1.5, 11.55, 3.95, "What-if card");
  const H = { fontFace: BODY, fontSize: 12, bold: true, color: HX.yel, fill: { color: HX.ink } };
  const c = (t, o) => ({ text: t, options: Object.assign({ fontFace: BODY, fontSize: 12, color: HX.white }, o || {}) });
  const g = (t) => c(t, { color: HX.lgrn, bold: true }), m = (t) => c(t, { color: HX.mute });
  s.addTable([
    [{ text: "#", options: H }, { text: "What-if", options: H }, { text: "Rakes/day", options: H }, { text: "Δ vs base (95% CI)", options: H },
     { text: "Cycle h, mean / P90", options: H }, { text: "Verdict", options: H }],
    [c("1"), c("Base case: loaded first, crew when ready"), c("4.77"), m("—"), c("40.3 / 47.1"), m("reference")],
    [c("2"), c("Dispatch: alternating / batches of 3"), c("4.77 / 4.77"), m("0.00"), c("40.3 / 47.1"), m("no effect, line 21% busy")],
    [c("3"), c("Tadali: reserved DN slot vs take gaps"), c("4.78"), m("+0.01 ± 0.08"), c("40.2 / 47.1"), m("no effect, merge 0.13 h")],
    [c("4"), c("Crew ordered during loading"), g("5.77"), g("+1.00 ± 0.06"), g("33.3 / 38.3"), g("best free lever")],
    [c("5"), c("Exam trigger: expiry / 3 / 5 / 7 days left"), c("4.80–4.75"), m("within ± 0.07"), c("≈ 40 / 47"), m("exam 23 → 30 h/rake/mo")],
    [c("6"), c("Fleet size 8 → 20 rakes"), c("4.77 → 4.84"), m("+0.07 ± 0.08"), c("40 → 99"), m("flat; rakes queue")],
    [c("7"), c("Line doubling, ₹228 cr"), c("4.88"), c("+0.11 ± 0.06"), c("39.4 / 45.9"), m("small; next slide")],
  ], { x: 1.08, y: 1.68, w: 11.2, colW: [0.4, 3.55, 1.35, 1.75, 1.85, 2.3], rowH: 0.44, fill: { color: HX.card },
    border: { type: "solid", pt: 0.5, color: HX.grid }, valign: "middle", margin: [0.02, 0.08, 0.02, 0.08], objectName: "What-if table" });
  chip(s, 0.97, 5.62, 8.4, "30 reps × 30 days each · paired with the same seeds · crew expiries < 0.1 per 100 trips", "Chip method");
  s.addNotes("These are exactly the seven scenarios from the proposal, each compared with the base case on the same random numbers, so the differences are paired. Dispatch rules and reserved Tadali slots change nothing because the single line is rarely contested and the merge wait is already small. Moving the exam trigger earlier does not change throughput but increases exam detention from 23 to 30 hours per rake per month, so waiting until close to expiry is better. The one scenario that matters is crew booking: ordering the crew while the rake is still loading so it arrives as the rake is ready adds one rake a day and cuts the cycle by seven hours. Crew expiries stay near zero in every scenario.");
}

// =====================================================================================
// 8. Doubling vs best policy
{
  const s = addSlide("LINES", "Results");
  tag(s, "04 · RESULTS");
  s.addText("Free crew rule beats ₹228 crore of track", { placeholder: "title" });
  card(s, 0.89, 1.5, 3.7, 2.3, "Doubling card");
  stat(s, 1.15, 1.6, 3.3, "+0.11", C.accent4, "rakes/day · line doubling", "₹228 cr; line use falls 21% → 11%, but the line was not the constraint");
  card(s, 4.81, 1.5, 3.7, 2.3, "Crew card");
  stat(s, 5.07, 1.6, 3.3, "+1.00", C.accent5, "rakes/day · crew during loading", "₹0; a ready loaded rake no longer holds a Ghugus loop for 2.8 h waiting for crew");
  card(s, 8.73, 1.5, 3.71, 2.3, "Both card");
  stat(s, 8.99, 1.6, 3.3, "+1.01", C.accent1, "rakes/day · both together", "Doubling adds nothing once the crew rule is in place");
  chip(s, 0.97, 4.0, 7.2, "≈ 365 extra rakes/yr ≈ 1.46 Mt of coal from one change in crew ordering", "Chip impact");
  s.addNotes("This is the headline comparison promised in the proposal: how much of the doubling benefit can operating rules recover for free. In our model the answer is more than all of it. Doubling removes single-line conflict, but the line was only 21% busy, so it adds 0.11 rakes a day. Ordering the crew during loading means a loaded rake stops occupying one of the two Ghugus loops while it waits for a crew, so the next empty can come in. That adds a full rake a day. With both, the gain is the same as the crew rule alone. Caveat: the doubling project is also meant for future traffic growth of 4.5 MTPA, which this closed circuit does not model.");
}

// =====================================================================================
// 9. Path to 7-8 rakes/day
{
  const s = addSlide("OFFICE", "Results");
  tag(s, "04 · RESULTS");
  s.addText("What it takes to reach 7–8 rakes/day", { placeholder: "title" });
  card(s, 0.89, 1.5, 7.6, 3.95, "Combination chart card");
  s.addChart(pres.charts.BAR, [{ name: "Rakes/day", labels: ["Base case", "+ crew during loading", "+ one more Ghugus loop",
      "+ rapid loading silo (RLS)"], values: [4.77, 5.77, 6.33, 8.13] }],
    Object.assign({}, chartBase, { x: 1.0, y: 1.6, w: 7.4, h: 3.75, barDir: "col", barGapWidthPct: 55,
      chartColors: [HX.grey, HX.lgrn, HX.grn, HX.yel], showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: "0.00",
      valAxisMinVal: 0, valAxisMaxVal: 9, showTitle: true, title: "Rakes/day at CSTPS, levers added in turn (30 reps)",
      titleColor: HX.white, titleFontSize: 13, objectName: "Combination chart" }));
  card(s, 8.7, 1.5, 3.74, 3.95, "Levers card");
  head(s, 8.92, 1.65, 3.3, "Ranked levers", HX.cyan);
  row(s, 8.92, 2.15, 3.4, 1, HX.grn, "Crew during loading", "+1.00", false, 13);
  row(s, 8.92, 2.58, 3.4, 2, HX.grn, "Ghugus loop +1", "+1.00", false, 13);
  row(s, 8.92, 3.01, 3.4, 3, HX.grn, "Yard times halved", "+0.73", false, 13);
  row(s, 8.92, 3.44, 3.4, 4, HX.grn, "Siding / lobby / RLS", "+0.35–0.39", false, 13);
  row(s, 8.92, 3.87, 3.4, 5, HX.yel, "Doubling", "+0.11", true, 13);
  row(s, 8.92, 4.3, 3.4, 6, HX.red, "Tipplers, crew pool", "0", false, 13);
  chip(s, 0.97, 5.62, 6.2, "All three together: 8.13 rakes/day, 23.6 h cycle, no demurrage", "Chip combo");
  s.addNotes("Stacking levers. The crew rule is free and gives 5.8 rakes a day. One more loop at Ghugus takes it to 6.3. A rapid loading silo then removes the loading bottleneck and its demurrage and reaches 8.1 rakes a day with a 24 h cycle, which matches the 7 to 8 rakes a day reported for Ghugus. Tipplers and the crew pool size do not matter: tipplers are 21% busy and the crew wait is travel time, not crew shortage.");
}

// =====================================================================================
// 10. Conclusions
pres.addSection({ title: "Close" });
{
  const s = addSlide("SYSTEM", "Close");
  tag(s, "05 · CONCLUSIONS");
  s.addText("What we recommend, and what to verify", { placeholder: "title" });
  card(s, 0.89, 1.45, 5.85, 2.95, "Recommendations card");
  head(s, 1.11, 1.58, 5.4, "Recommend", HX.lgrn);
  row(s, 1.11, 2.08, 5.5, 1, HX.grn, "Order crews during loading", "free, +1 rake/day", false, 13.5);
  row(s, 1.11, 2.5, 5.5, 2, HX.grn, "Add a Ghugus loop", "before doubling", false, 13.5);
  row(s, 1.11, 2.92, 5.5, 3, HX.grn, "Rapid loading silo", "ends loading demurrage", false, 13.5);
  row(s, 1.11, 3.34, 5.5, 4, HX.grn, "Exam close to expiry", "not 5–7 days early", false, 13.5);
  row(s, 1.11, 3.76, 5.5, 5, HX.yel, "Keep the fleet at 8", "more rakes only queue", true, 13.5);
  card(s, 6.95, 1.45, 5.49, 2.95, "Limitations card");
  head(s, 7.17, 1.58, 5.1, "Verify with field data", HX.red);
  bullets(s, 7.17, 2.06, 5.1, 2.3, [
    "Throughput 4.8 vs 6–10 observed: loops (A-01) and yard times (A-13/14) are assumed",
    "Empties held at CD 7.5 h comes from a dispatcher rule we assumed (A-27)",
    "No CR / WCL records yet; the cycle-log template is ready for them",
  ], 13);
  s.addNotes("Recommendations in order of cost: change crew ordering, which is free; add a loop at Ghugus; consider a rapid loading silo; send rakes for examination close to expiry; and do not add rakes. The limits: our throughput is below the observed range, and the biggest single delay, empties held at Chandrapur, comes from a dispatcher rule we assumed. The first field data to collect are the number of usable loops at Ghugus, placement and release times there, and where crews are actually booked. The model and the templates are ready to take that data.");
}

pres.writeFile({ fileName: OUT }).then(async (f) => {
  try {
    const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");
    await applyTheme(OUT, THEME);
  } catch (e) { console.log("theme not applied (" + e.message + ")"); }
  console.log("wrote " + f);
});
