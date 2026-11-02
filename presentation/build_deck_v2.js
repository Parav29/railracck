// RakeFlow final presentation v2: situation, goal, how the trains work, data, distributions, model, experiments, results.
// Same visual style as the submitted proposal deck (scene backgrounds, dark translucent cards, yellow tags,
// Lilita One / Nunito). Numbers: model/results/key_experiments.md and summary_tables.md (30 paired replications).
// Run:  node presentation/build_deck_v2.js
const path = require("path");
const pptxgen = require("pptxgenjs");

const OUT = path.join(__dirname, "RakeFlow_Final_Presentation_v2.pptx");
const A = (f) => path.join(__dirname, "assets", f);

const THEME = {
  name: "RakeFlow Blocky", headFontFace: "Lilita One", bodyFontFace: "Nunito",
  colors: { dk1: "16181C", lt1: "FFFFFF", dk2: "1D2126", lt2: "B9C2CC", accent1: "FFD23F", accent2: "2FB35A",
            accent3: "5FD0FF", accent4: "E0452B", accent5: "7EE07A", accent6: "FF8A1F", hlink: "5FB4F0", folHlink: "9AA3AD" },
};
const HX = { card: "16181C", ink: "1D2126", mute: "B9C2CC", grid: "3A4048", yel: "FFD23F", grn: "2FB35A", lgrn: "7EE07A",
             cyan: "5FD0FF", red: "E0452B", org: "FF8A1F", grey: "9AA3AD", white: "FFFFFF" };

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.title = "RakeFlow - Coal Rake Cycle, final presentation";
pres.author = "IE305 Team RakeFlow";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;
const HEAD = THEME.headFontFace, BODY = THEME.bodyFontFace;

const SCENES = { SYSTEM: "scene_system.png", OFFICE: "scene_office.png", LINES: "scene_lines.png" };
for (const [k, f] of Object.entries(SCENES)) {
  pres.defineSlideMaster({
    title: "SCENE_" + k,
    background: { path: A(f) },
    objects: [{ placeholder: { options: { name: "title", type: "title", x: 0.89, y: 0.75, w: 11.6, h: 0.62, fontFace: HEAD,
      fontSize: 32, color: C.background1, margin: 0, valign: "middle", align: "left" }, text: "" } }],
    slideNumber: { x: 12.55, y: 7.08, w: 0.5, h: 0.28, fontFace: BODY, fontSize: 10, color: C.background1, align: "right" },
  });
}

// ---------- pieces ----------
function tag(s, text) {
  const w = 0.4 + text.length * 0.112;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.89, y: 0.39, w, h: 0.29, rectRadius: 0.06, fill: { color: C.accent1 },
    line: { type: "none" }, objectName: "Section tag" });
  s.addText(text, { x: 0.99, y: 0.39, w: w - 0.1, h: 0.29, fontFace: BODY, fontSize: 12, bold: true, color: C.text2, margin: 0,
    valign: "middle", charSpacing: 1, isTextBox: true, objectName: "Section tag text" });
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
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 0.31, h: 0.28, rectRadius: 0.05, fill: { color }, line: { type: "none" },
    objectName: "Badge " + n });
  s.addText(String(n), { x, y, w: 0.31, h: 0.28, fontFace: BODY, fontSize: 13, bold: true, align: "center",
    color: dark ? C.text2 : C.background1, margin: 0, valign: "middle", isTextBox: true, objectName: "Badge text " + n });
}
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
    return runs.map((r, j) => ({ text: r.text, options: { bullet: j === 0 ? { indent: 14 } : undefined, bold: !!r.bold,
      color: r.bold ? C.background1 : C.background2, breakLine: j === runs.length - 1 && i < items.length - 1, paraSpaceAfter: 5 } }));
  }).flat(), { x, y, w, h, fontFace: BODY, fontSize: size || 13, valign: "top", margin: 0, isTextBox: true, objectName: "Bullets" });
}
function stat(s, x, y, w, big, color, small, sub, bigSize) {
  s.addText(big, { x, y, w, h: 0.8, fontFace: HEAD, fontSize: bigSize || 40, color, margin: 0, valign: "bottom", isTextBox: true,
    objectName: "Stat value" });
  s.addText(small, { x, y: y + 0.84, w, h: 0.3, fontFace: BODY, fontSize: 13, bold: true, color: C.background1, margin: 0,
    isTextBox: true, objectName: "Stat label" });
  if (sub) s.addText(sub, { x, y: y + 1.14, w, h: 0.5, fontFace: BODY, fontSize: 12, color: C.background2, margin: 0,
    valign: "top", isTextBox: true, objectName: "Stat note" });
}
const TH = { fontFace: BODY, fontSize: 12, bold: true, color: HX.yel, fill: { color: HX.ink } };
const tc = (t, o) => ({ text: t, options: Object.assign({ fontFace: BODY, fontSize: 12, color: HX.white }, o || {}) });
const tg = (t) => tc(t, { color: HX.lgrn, bold: true }), tm = (t) => tc(t, { color: HX.mute }), to = (t) => tc(t, { color: HX.org, bold: true });
const tableOpts = (x, y, w, colW, rowH, name) => ({ x, y, w, colW, rowH, fill: { color: HX.card },
  border: { type: "solid", pt: 0.5, color: HX.grid }, valign: "middle", margin: [0.02, 0.08, 0.02, 0.08], objectName: name });
const chartBase = {
  catAxisLabelColor: HX.mute, valAxisLabelColor: HX.mute, catAxisLabelFontFace: "+mn-lt", valAxisLabelFontFace: "+mn-lt",
  catAxisLabelFontSize: 11, valAxisLabelFontSize: 10, dataLabelFontFace: "+mn-lt", dataLabelFontSize: 11, dataLabelColor: HX.white,
  valGridLine: { color: HX.grid, size: 0.5 }, catGridLine: { style: "none" }, catAxisLineShow: false, valAxisLineShow: false,
  showLegend: false, titleFontFace: "+mn-lt", titleColor: HX.white, titleFontSize: 13, legendColor: HX.mute,
  legendFontFace: "+mn-lt", legendFontSize: 11,
};
const addSlide = (scene, section) => pres.addSlide({ masterName: "SCENE_" + scene, sectionTitle: section });

// ---------- one experiment slide ----------
function experiment(o) {
  const s = addSlide(o.scene, "Experiments");
  tag(s, "05 · EXPERIMENT " + o.n);
  s.addText(o.title, { placeholder: "title" });
  card(s, 0.89, 1.5, 3.9, 3.95, "Change card");
  head(s, 1.11, 1.62, 3.5, "What we changed", HX.yel);
  s.addText(o.change, { x: 1.11, y: 2.04, w: 3.5, h: 0.75, fontFace: BODY, fontSize: 14, bold: true, color: C.background1,
    margin: 0, valign: "top", isTextBox: true, objectName: "Change text" });
  head(s, 1.11, 2.85, 3.5, "Why it should help", HX.cyan);
  s.addText(o.why, { x: 1.11, y: 3.27, w: 3.5, h: 2.05, fontFace: BODY, fontSize: 13, color: C.background2, margin: 0,
    valign: "top", isTextBox: true, objectName: "Why text" });
  card(s, 5.0, 1.5, 4.55, 3.95, "Chart card");
  s.addChart(pres.charts.BAR, [{ name: "Baseline", labels: o.cats, values: o.base }, { name: o.short, labels: o.cats, values: o.exp }],
    Object.assign({}, chartBase, { x: 5.08, y: 1.58, w: 4.4, h: 3.8, barDir: "bar", catAxisOrientation: "maxMin", barGapWidthPct: 40,
      chartColors: [HX.grey, o.color || HX.lgrn], showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: "0.0",
      valAxisHidden: true, valGridLine: { style: "none" }, showLegend: true, legendPos: "b", showTitle: true,
      title: "Hours per cycle, baseline vs change", objectName: "Experiment chart" }));
  card(s, 9.76, 1.5, 2.68, 3.95, "Result card");
  stat(s, 9.98, 1.52, 2.3, o.d1, o.c1 || C.accent5, "rakes/day", o.s1);
  stat(s, 9.98, 3.32, 2.3, o.d2, o.c2 || C.accent3, "mean cycle", o.s2);
  chip(s, 0.97, 5.62, o.chipW || 8.0, o.chip, "Chip result");
  s.addNotes(o.notes);
}

// =====================================================================================
// 1. Title
pres.addSection({ title: "Opening" });
{
  const s = addSlide("SYSTEM", "Opening");
  tag(s, "IE305 · FINAL PRESENTATION");
  s.addText("RakeFlow: Coal Rake Cycle", { placeholder: "title" });
  s.addText("Ghugus → Tadali → Chandrapur · AnyLogic 8.9.9", { x: 0.89, y: 1.45, w: 6.4, h: 0.4, fontFace: BODY, fontSize: 17,
    bold: true, color: C.background1, margin: 0, isTextBox: true, objectName: "Subtitle" });
  chip(s, 0.89, 2.0, 2.0, "4 experiments", "Chip a");
  chip(s, 3.01, 2.0, 2.4, "30 paired runs each", "Chip b");
  chip(s, 5.53, 2.0, 1.75, "100 inputs", "Chip c");
  card(s, 7.36, 0.42, 5.08, 2.62, "Answer card");
  head(s, 7.6, 0.55, 4.6, "In one line", C.accent1);
  s.addText("Three terminal fixes take Ghugus from 4.8 to 7.8 rakes/day, with no new track.", { x: 7.6, y: 0.98, w: 4.65, h: 0.7,
    fontFace: BODY, fontSize: 16, bold: true, color: C.background1, margin: 0, valign: "top", isTextBox: true, objectName: "Answer" });
  row(s, 7.6, 1.78, 4.7, 1, HX.grn, "Throughput", "4.77 → 7.76 rakes/day");
  row(s, 7.6, 2.16, 4.7, 2, HX.grn, "Cycle time", "40.3 → 24.7 h");
  row(s, 7.6, 2.54, 4.7, 3, HX.yel, "Demurrage", "₹33,300 → ₹0 per rake", true);
  s.addNotes("We modelled the closed circuit of coal rakes between the WCL sidings at Ghugus and Chandrapur power station in AnyLogic, measured where the time goes, and ran four experiments. Three changes at the terminals together raise throughput by 63% and cut the cycle by 39%, and none of them is the Rs 228 crore line doubling.");
}

// =====================================================================================
// 2. Situation
pres.addSection({ title: "Problem" });
{
  const s = addSlide("SYSTEM", "Problem");
  tag(s, "01 · WHAT HAS BEEN GOING ON");
  s.addText("A power station short of coal, a line being doubled", { placeholder: "title" });
  card(s, 0.89, 1.5, 11.55, 1.95, "Stats card");
  stat(s, 1.15, 1.5, 2.7, "6–17", C.accent4, "days of coal at CSTPS", "norm is 20–26 days (CEA)");
  stat(s, 4.0, 1.5, 2.7, "6–10", C.accent1, "rakes/day received", "2,920 MW plant, rail-fed");
  stat(s, 6.85, 1.5, 2.7, "145%", C.accent6, "main-line utilisation", "Wardha–Balharshah, 163% DN");
  stat(s, 9.7, 1.5, 2.6, "₹228 cr", C.accent3, "doubling sanctioned", "Ghugus–Tadali, Jul 2026");
  card(s, 0.89, 3.62, 11.55, 1.35, "Question card");
  head(s, 1.11, 3.74, 11, "The question we took on", HX.lgrn);
  s.addText("A loaded rake runs only ~27 km, yet its round trip takes about 40 hours. Where does that time go, and which change gives the most coal per day: new track, or better operation?",
    { x: 1.11, y: 4.16, w: 11.1, h: 1.1, fontFace: BODY, fontSize: 15, color: C.background1, margin: 0, valign: "top",
      isTextBox: true, objectName: "Question" });
  s.addNotes("Context. Chandrapur Super Thermal Power Station holds 6 to 17 days of coal against a norm of 20 to 26 and gets 6 to 10 rakes a day. The main line it shares is used at 145 to 163% of capacity. Railways sanctioned Rs 228 crore in July 2026 to double the 14 km Ghugus-Tadali single line. Our question: running time is under an hour, the round trip is about 40 hours; where is the rest, and is track the right fix?");
}

// =====================================================================================
// 3. Goal and KPIs
{
  const s = addSlide("LINES", "Problem");
  tag(s, "01 · GOAL & WHAT WE MEASURE");
  s.addText("Goal: more rakes a day in less cycle time", { placeholder: "title" });
  card(s, 0.89, 1.5, 11.55, 0.62, "Goal card");
  s.addText([{ text: "Objective  ", options: { bold: true, color: C.accent1 } },
             { text: "maximise rakes/day delivered to CSTPS and minimise mean rake cycle time, within crew-duty and brake-certificate rules",
               options: { color: C.background1 } }],
    { x: 1.11, y: 1.5, w: 11.2, h: 0.62, fontFace: BODY, fontSize: 14, margin: 0, valign: "middle", isTextBox: true, objectName: "Goal" });
  card(s, 0.89, 2.3, 11.55, 3.1, "KPI card");
  s.addTable([
    [{ text: "KPI", options: TH }, { text: "Better is", options: TH }, { text: "Baseline today", options: TH }, { text: "Why it matters", options: TH }],
    [tc("Rakes/day to CSTPS (t/day)"), tg("higher ↑"), tc("4.77 (19,000 t)"), tm("coal the plant actually receives")],
    [tc("Mean / P90 rake cycle"), tg("lower ↓"), tc("40.3 h / 47.1 h"), tm("wagon turnround; fleet needed")],
    [tc("Demurrage per rake"), tg("lower ↓"), tc("₹33,300"), tm("money paid for detention over free time")],
    [tc("CSTPS stock (lowest)"), tg("higher ↑"), tc("5.0 days"), tm("risk of a coal shortage")],
    [tc("Crew expiries / 100 trips"), tm("must stay ~0"), tc("0.02"), tm("rule: 9 h duty, 11 h cap")],
    [tc("Single-line use, Tadali queue"), tm("diagnostic"), tc("21%, 0.03 rakes"), tm("is the track the bottleneck?")],
  ], tableOpts(1.08, 2.45, 11.2, [3.2, 1.6, 2.4, 4.0], 0.4, "KPI table"));
  s.addNotes("Our goal from the proposal: get more rakes to the plant per day while cutting the time a rake takes for a round trip. These are the measures we report for every experiment, with today's baseline values from 30 replications. Crew expiries and BPC are rules the solution must not break. Single-line use and the Tadali queue tell us whether track is really the constraint.");
}

// =====================================================================================
// 4. How the trains work
pres.addSection({ title: "System" });
{
  const s = addSlide("SYSTEM", "System");
  tag(s, "02 · HOW THE TRAINS WORK");
  s.addText("One closed loop, eight steps, three clocks", { placeholder: "title" });
  card(s, 0.89, 1.5, 7.3, 3.9, "Steps card");
  head(s, 1.11, 1.62, 7, "A rake's round trip (baseline mean hours)", HX.lgrn);
  const steps = [["Placed & loaded at Ghugus siding", "12.7 h"], ["Waits for a crew from Balharshah", "2.8 h"],
    ["Single line 14 km, one train at a time", "0.6 h"], ["Waits for a gap at Tadali, runs 13 km", "0.5 h"],
    ["Placed, tippled, released at CSTPS", "12.0 h"], ["Empty held at CD until loops free", "9.2 h"],
    ["Runs back via Tadali and the single line", "1.3 h"], ["BPC exam at Balharshah when due", "1.4 h"]];
  steps.forEach(([a, b], i) => row(s, 1.11, 2.1 + i * 0.4, 7.0, i + 1, i === 7 ? HX.yel : HX.grn, a, b, i === 7, 13));
  card(s, 8.4, 1.5, 4.04, 3.9, "Clocks card");
  head(s, 8.62, 1.62, 3.7, "Clocks on every rake", HX.red);
  bullets(s, 8.62, 2.1, 3.65, 3.2, [
    [{ text: "Crew: ", bold: true }, { text: "9 h duty, 11 h with 2 h notice, then relief" }],
    [{ text: "Brake certificate: ", bold: true }, { text: "6,000 km or 30 days; 8 h exam, daylight only" }],
    [{ text: "Demurrage: ", bold: true }, { text: "3 h free to load, 7 h to unload; ₹150 per wagon per hour" }],
    [{ text: "Fleet: ", bold: true }, { text: "8 rakes × 58 wagons, 3,990 t each" }],
  ], 13);
  chip(s, 0.97, 5.62, 7.3, "Hours are baseline means per cycle (30 reps); total 40.3 h", "Chip hours");
  s.addNotes("This is how a coal rake actually circulates, with the mean hours it spends at each step today. Loading-side handling at Ghugus is 12.7 hours, crew wait 2.8, the single line under an hour, the Tadali merge and run half an hour, the plant end 12 hours, and the empty is then held at Chandrapur for about 9 hours (including its crew wait) until a loop is free at Tadali and Ghugus. Three clocks run throughout: crew duty, brake certificate validity, and demurrage free time.");
}

// =====================================================================================
// 5. Resources and rules
{
  const s = addSlide("LINES", "System");
  tag(s, "02 · RESOURCES & RULES");
  s.addText("What every rake competes for", { placeholder: "title" });
  card(s, 0.89, 1.5, 5.6, 3.9, "Resources card");
  head(s, 1.11, 1.62, 5.2, "Shared resources (model defaults)", HX.cyan);
  s.addTable([
    [{ text: "Resource", options: TH }, { text: "Capacity", options: TH }, { text: "Source", options: TH }],
    [tc("Ghugus loops"), tc("2"), tm("A-01 assumed")], [tc("Loading sidings (CHP)"), tc("2"), tm("LD-02 inferred")],
    [tc("Single line Ghugus–Tadali"), tc("1 train"), tm("INF-01 Gazette")], [tc("Tadali freight loops"), tc("2"), tm("A-02 assumed")],
    [tc("Tipplers in service"), tc("4 of 5"), tm("UL-01 tender")], [tc("Crews at lobby"), tc("16"), tm("A-25 assumed")],
    [tc("Exam line, Balharshah"), tc("1, 06–18 h"), tm("BPC-03 JPO")],
  ], tableOpts(1.08, 2.08, 5.2, [2.4, 1.2, 1.6], 0.4, "Resource table"));
  card(s, 6.7, 1.5, 5.74, 3.9, "Rules card");
  head(s, 6.92, 1.62, 5.3, "Rules the controller follows", HX.yel);
  bullets(s, 6.92, 2.1, 5.3, 3.2, [
    [{ text: "Absolute block: ", bold: true }, { text: "a rake enters the single line only if a loop is free at the far end" }],
    [{ text: "Loaded first: ", bold: true }, { text: "loaded rakes get the line before empties (A-22)" }],
    [{ text: "One Tadali loop kept for loaded rakes, ", bold: true }, { text: "so the loop never deadlocks" }],
    [{ text: "Empties wait at Chandrapur ", bold: true }, { text: "until Tadali and Ghugus loops are free (A-27)" }],
    [{ text: "Tadali merge: ", bold: true }, { text: "a gap of 6–15 min either side of each of 115 timetabled trains" }],
  ], 13);
  s.addNotes("The resources rakes queue for, with the capacities we used. Only the single line, tipplers and exam rules come from documents; loop counts and crew pool are assumptions we test. The controller rules are needed because a single line with two-loop stations deadlocks without them; they follow standard absolute-block practice.");
}

// =====================================================================================
// 6. Data used
pres.addSection({ title: "Data" });
{
  const s = addSlide("OFFICE", "Data");
  tag(s, "03 · DATA WE USED");
  s.addText("Where every number comes from", { placeholder: "title" });
  card(s, 0.89, 1.5, 11.55, 3.9, "Data card");
  s.addTable([
    [{ text: "Source", options: TH }, { text: "What we took", options: TH }, { text: "Used in the model as", options: TH }],
    [tc("erail.in timetable (115 trains)"), tm("times at Tadali / Chandrapur, days of run"), tc("exact blocking schedule at the merge")],
    [tc("etrain.info running history"), tm("lateness samples 26–86 min"), tc("lognormal lateness per train")],
    [tc("Railway Board letters, RBE 143/2016"), tm("crew 9/11 h, rest, free time, demurrage"), tc("hard rules in the logic")],
    [tc("IRIMEE / JPO freight exam"), tm("BPC 6,000 km / 30 d, 8 h, daylight"), tc("exam trigger and window")],
    [tc("CAG Reports 31/2014, 47/2015"), tm("yard times, sign-on delays"), tc("triangular min / mode / max")],
    [tc("CEA daily coal reports"), tm("CSTPS burn, receipts, stock"), tc("coal-stock KPI and validation")],
    [tc("Gazette, CR highlights, RailPost"), tm("14.11 km line, 58 wagons, 3,990 t"), tc("fixed inputs")],
  ], tableOpts(1.08, 1.66, 11.2, [3.4, 3.9, 3.9], 0.44, "Data table"));
  chip(s, 0.97, 5.62, 9.4, "No Central Railway / WCL records arrived; every source is public and cited in research/", "Chip data");
  s.addNotes("All inputs come from public sources, each cited with a URL in the research folder and the parameter workbook. The passenger timetable is used exactly, train by train, on its days of run. Rules come from Railway Board letters. Yard and terminal times come from CAG audit tables. CEA daily reports give the plant's burn rate and receipts, which we use to validate throughput. The rail-records request through Prof. Rangaraj did not return data, so field logs remain the main next step.");
}

// =====================================================================================
// 7. Distributions
{
  const s = addSlide("OFFICE", "Data");
  tag(s, "03 · DISTRIBUTIONS");
  s.addText("No record? Min / likely / max → triangular", { placeholder: "title" });
  card(s, 0.89, 1.5, 11.55, 3.9, "Distribution card");
  s.addTable([
    [{ text: "Activity", options: TH }, { text: "Distribution", options: TH }, { text: "Basis", options: TH },
     { text: "Activity", options: TH }, { text: "Distribution", options: TH }, { text: "Basis", options: TH }],
    [tc("Loading (CHP)"), tc("Tri(4, 6, 9) h"), tm("RB norms"), tc("Unloading by tippler"), tc("Tri(2, 4, 7) h"), tm("BigMint, RB 7 h")],
    [tc("Loading (RLS silo)"), tc("Tri(1, 1.5, 3) h"), tm("PIB, MCL"), tc("Placement at CSTPS"), tc("Tri(0.6, 2, 8) h"), tm("CAG Table 18")],
    [tc("Placement at Ghugus"), tc("Tri(0.5, 1, 4) h"), tm("CAG Table 18"), tc("Release at CSTPS"), tc("Tri(1.5, 3, 8) h"), tm("CAG Table 18")],
    [tc("Ready to leave Ghugus"), tc("Tri(0.8, 1.5, 6) h"), tm("CAG Table 18"), tc("Crew sign-on"), tc("Tri(0.5, 0.75, 2) h"), tm("CAG 47/2015")],
    [tc("Single-line block"), tc("Tri(25, 31, 38) min"), tm("speed + line clear"), tc("Crew travel to Ghugus"), tc("Tri(1, 1.5, 2.5) h"), tm("~40 km road")],
    [tc("Main-line speed"), tc("Tri(30, 40, 50) km/h"), tm("IR avg 23.8 km/h"), tc("Relief crew arrival"), tc("Tri(1, 2.5, 6) h"), tm("assumed")],
    [tc("Gap at Tadali merge"), tc("Tri(6, 10, 15) min"), tm("block headway"), tc("Exam duration"), tc("Tri(6, 8, 12) h"), tm("JPO 8 h + repairs")],
    [tc("Passenger lateness"), tc("Lognorm(30, 30) min"), tm("etrain samples"), tc("Through goods trains"), tc("Poisson 20/day"), tm("Ballarshah 50/day")],
  ], tableOpts(1.02, 1.62, 11.3, [1.95, 1.85, 1.6, 1.95, 1.85, 2.1], 0.4, "Distribution table"));
  chip(s, 0.97, 5.62, 9.2, "Each is a named parameter on the AnyLogic canvas; the key ones were varied in sensitivity runs", "Chip dist");
  s.addNotes("As in our proposal, where no record exists we use a triangular distribution from a minimum, most likely and maximum value taken from norms or the CAG audit tables. Lateness is lognormal because it is positive and right-skewed; extra goods trains arrive as a Poisson process. When field data arrives, each line here is replaced by a fitted distribution: the data templates are already in the repository.");
}

// =====================================================================================
// 8. Model + verification/validation
pres.addSection({ title: "Model" });
{
  const s = addSlide("LINES", "Model");
  tag(s, "04 · MODEL, VERIFIED & VALIDATED");
  s.addText("Can we trust the model?", { placeholder: "title" });
  card(s, 0.89, 1.5, 5.0, 3.9, "Verification card");
  head(s, 1.11, 1.62, 4.6, "Built and verified", HX.lgrn);
  bullets(s, 1.11, 2.1, 4.6, 3.2, [
    [{ text: "AnyLogic 8.9.9: ", bold: true }, { text: "event logic in Main, animation, charts, 3 parameter-variation experiments" }],
    [{ text: "Checked after every event: ", bold: true }, { text: "no loop over capacity, single line one way, crew ≤ 11 h, no rake lost" }],
    [{ text: "Same seed, same answer ", bold: true }, { text: "in AnyLogic and the test harness (4.70 rakes/day)" }],
    [{ text: "30 reps × 30 days, ", bold: true }, { text: "3-day warm-up, common random numbers" }],
  ], 13);
  card(s, 6.1, 1.5, 6.34, 3.9, "Validation card");
  head(s, 6.32, 1.62, 5.9, "Validated against public benchmarks", HX.cyan);
  s.addTable([
    [{ text: "Measure", options: TH }, { text: "Real world", options: TH }, { text: "Model", options: TH }, { text: "", options: TH }],
    [tc("Mean cycle"), tc("24–72 h"), tc("40.3 h"), tg("inside")],
    [tc("Ghugus detention"), tc("≤ 15–16 h"), tc("15.5 h"), tg("inside")],
    [tc("Rakes/day, today's setup"), tc("6–10 (CEA)"), tc("4.77"), to("below")],
    [tc("Rakes/day, with 3 fixes"), tc("7–8 (Ghugus)"), tc("7.76"), tg("inside")],
    [tc("Crew expiries"), tc("rare"), tc("0.02 / 100"), tg("inside")],
  ], tableOpts(6.32, 2.08, 5.9, [2.2, 1.4, 1.2, 1.1], 0.38, "Validation table"));
  s.addText("Throughput gap points to our assumed Ghugus loops and yard times; real Ghugus likely already runs part of these fixes.",
    { x: 6.32, y: 4.45, w: 5.9, h: 0.8, fontFace: BODY, fontSize: 12, color: C.background2, margin: 0, valign: "top",
      isTextBox: true, objectName: "Validation note" });
  s.addNotes("Verification: invariants are checked after every simulated event, and AnyLogic and the harness give identical numbers for the same seed. Validation: cycle time, Ghugus detention and crew behaviour sit inside published ranges. With today's assumed layout the model delivers 4.8 rakes a day, below the 6 to 10 observed; with the three changes it gives 7.8, matching the 7 to 8 rakes a day reported for Ghugus. That suggests the real yard already has more capacity than our conservative assumptions.");
}

// =====================================================================================
// 9. Baseline where time goes
{
  const s = addSlide("SYSTEM", "Model");
  tag(s, "04 · BASELINE RESULT");
  s.addText("Where a rake's 40 hours go today", { placeholder: "title" });
  card(s, 0.89, 1.5, 7.6, 3.95, "Decomposition card");
  const cats = ["Ghugus terminal", "CSTPS terminal", "Empties held at CD", "Crew waits", "Running", "BPC exam detour",
                "Single-line waits", "Tadali DN merge"];
  s.addChart(pres.charts.BAR, [{ name: "Mean h per cycle", labels: cats, values: [12.69, 11.95, 7.54, 4.44, 1.70, 1.37, 0.44, 0.13] }],
    Object.assign({}, chartBase, { x: 1.0, y: 1.6, w: 7.4, h: 3.75, barDir: "bar", catAxisOrientation: "maxMin", barGapWidthPct: 45,
      chartColors: [HX.org, HX.org, HX.org, HX.yel, HX.grey, HX.grey, HX.cyan, HX.cyan], showValue: true, dataLabelPosition: "outEnd",
      dataLabelFormatCode: "0.0 \"h\"", valAxisHidden: true, valGridLine: { style: "none" }, showTitle: true,
      title: "Mean hours per cycle, baseline (30 reps)", objectName: "Cycle decomposition chart" }));
  card(s, 8.7, 1.5, 3.74, 3.95, "Takeaway card");
  stat(s, 8.95, 1.52, 3.3, "80%", C.accent6, "at the two terminals", "Ghugus + CSTPS + empties held at CD: 32.2 of 40.3 h");
  stat(s, 8.95, 3.32, 3.3, "0.6 h", C.accent3, "single line + merge", "line 21% busy; Tadali queue 0.03 rakes");
  s.addNotes("Splitting the 40-hour cycle by cause shows the problem is at the terminals, about 80% of the time, plus 4.4 hours waiting for crews. The single line and the Tadali merge, which we expected to be the problem, are about 0.6 hours. So our experiments target terminal time and the Ghugus loops, and test doubling for comparison.");
}

// =====================================================================================
// 10. Experiment design
pres.addSection({ title: "Experiments" });
{
  const s = addSlide("LINES", "Experiments");
  tag(s, "05 · EXPERIMENT DESIGN");
  s.addText("Four experiments, one change each", { placeholder: "title" });
  card(s, 0.89, 1.5, 7.6, 3.05, "Design card");
  head(s, 1.11, 1.62, 7.2, "Change  →  what we expect it to improve", HX.lgrn);
  row(s, 1.11, 2.12, 7.2, 1, HX.grn, "Order the crew during loading", "→ less crew wait, loop freed sooner", false, 13.5);
  row(s, 1.11, 2.6, 7.2, 2, HX.grn, "One more loop at Ghugus (3)", "→ empties stop waiting at Chandrapur", false, 13.5);
  row(s, 1.11, 3.08, 7.2, 3, HX.grn, "Rapid loading silo (RLS)", "→ loading 6 h → 1.5 h, no demurrage", false, 13.5);
  row(s, 1.11, 3.56, 7.2, 4, HX.yel, "Double the Ghugus–Tadali line", "→ no single-line waiting", true, 13.5);
  row(s, 1.11, 4.04, 7.2, 5, HX.grey, "All combinations (2×2×2 of 1–3)", "→ interactions, best mix", false, 13.5);
  card(s, 8.7, 1.5, 3.74, 3.05, "Method card");
  head(s, 8.92, 1.62, 3.3, "How each is run", HX.cyan);
  bullets(s, 8.92, 2.1, 3.35, 3.2, [
    "30 replications, 30 days after a 3-day warm-up",
    "Same 30 seeds as the baseline (common random numbers)",
    "Paired difference with a 95% t-interval",
    "All rules checked every event",
  ], 13);
  s.addNotes("Each experiment changes one thing and keeps everything else at the baseline. Every run uses the same 30 random-number seeds as the baseline, so we compare each replication with its own twin and report a paired 95% confidence interval. Experiments 1 to 3 are terminal-side changes; experiment 4 is the sanctioned doubling. Then we run all eight combinations of the first three to see how they interact.");
}

experiment({
  n: 1, scene: "LINES", title: "Order the crew during loading", short: "Crew during loading",
  change: "Book the crew while the rake is still loading, timed to arrive as it becomes ready.",
  why: "Today the crew is called only when the loaded rake is ready, and it travels ~2 h from Balharshah. Meanwhile the rake sits in one of only two Ghugus loops, so the next empty is held back at Chandrapur.",
  cats: ["Crew waits", "Empties held at CD", "Ghugus terminal", "Total cycle"], base: [4.44, 7.54, 12.69, 40.27], exp: [1.77, 3.84, 12.55, 33.27],
  d1: "+1.00", s1: "4.77 → 5.77 (± 0.06)", d2: "−7.0 h", s2: "40.3 → 33.3 h (± 0.5)",
  chip: "Cost ≈ ₹0 · crew expiries stay at 0 · CSTPS stock low point 5.0 → 7.9 days",
  notes: "Experiment 1. A pure operating change. Crew wait falls from 4.4 to 1.8 hours per cycle, and because the loaded rake leaves the Ghugus loop sooner, the empty behind it waits half as long at Chandrapur. Throughput rises by one rake a day, about 4,000 tonnes, and the cycle shortens by 7 hours. The interval is plus or minus 0.06, so this is clearly not noise. Crew duty limits are never broken.",
});
experiment({
  n: 2, scene: "OFFICE", title: "Add one loop at Ghugus", short: "3 loops at Ghugus",
  change: "Give Ghugus a third loop for stabling loaded and empty rakes (2 → 3).",
  why: "With only two loops, an empty may leave Chandrapur only when a Ghugus loop is free. Empties therefore stand at Chandrapur for 7.5 h per cycle. A third loop lets them come straight back.",
  cats: ["Empties held at CD", "Ghugus terminal", "Crew waits", "Total cycle"], base: [7.54, 12.69, 4.44, 40.27], exp: [1.67, 12.10, 4.43, 33.27],
  d1: "+1.00", s1: "4.77 → 5.77 (± 0.09)", d2: "−7.0 h", s2: "40.3 → 33.3 h (± 0.6)",
  chip: "Small yard work, not a new line · empties held at CD 7.5 h → 1.7 h", chipW: 7.6,
  notes: "Experiment 2. One extra loop at Ghugus removes most of the time empties spend waiting at Chandrapur, from 7.5 to 1.7 hours. Throughput rises by one rake a day, the same size as the crew change but for a different reason: it adds space instead of freeing space sooner.",
});
experiment({
  n: 3, scene: "OFFICE", title: "Rapid loading silo at Ghugus", short: "RLS loading", color: HX.yel,
  change: "Replace pay-loader / CHP loading (Tri 4, 6, 9 h) with a rapid loading silo (Tri 1, 1.5, 3 h).",
  why: "Loading takes 6.3 h, longer than the 3 h free time, so every rake pays demurrage. A silo should cut loading and ends the demurrage.",
  cats: ["Ghugus terminal", "Empties held at CD", "Crew waits", "Total cycle"], base: [12.69, 7.54, 4.44, 40.27], exp: [6.43, 10.61, 4.43, 37.48],
  d1: "+0.35", s1: "4.77 → 5.12 (± 0.07)", d2: "−2.8 h", s2: "40.3 → 37.5 h (± 0.5)",
  chip: "Demurrage ₹33,300 → ₹0 per rake · but the bottleneck moves to the loops", chipW: 7.6,
  notes: "Experiment 3. The silo halves Ghugus terminal time and removes all loading demurrage, about Rs 33,000 per rake. But throughput only rises by a third of a rake, because the saving is eaten by empties waiting longer at Chandrapur: the two Ghugus loops are now the bottleneck. This is why the combination matters, on the next slides.",
});
experiment({
  n: 4, scene: "LINES", title: "Double the Ghugus–Tadali line", short: "Line doubled", color: HX.cyan, c1: C.accent4,
  change: "Two lines instead of one between Ghugus and Tadali (the ₹228 crore project).",
  why: "Each direction gets its own track, so loaded and empty rakes no longer wait for each other on the single line.",
  cats: ["Empties held at CD", "Single-line waits", "Ghugus terminal", "Total cycle"], base: [7.54, 0.44, 12.69, 40.27], exp: [7.02, 0.35, 12.37, 39.37],
  d1: "+0.11", s1: "4.77 → 4.88 (± 0.06)", d2: "−0.9 h", s2: "40.3 → 39.4 h (± 0.5)",
  chip: "Line use 21% → 11% · the line was not the constraint for today's traffic", chipW: 7.6,
  notes: "Experiment 4. Doubling works as intended, single-line use halves, but the single line was only 21% busy and caused under half an hour of waiting, so throughput rises by only 0.11 rakes a day. Caveat: the project is also meant for future growth of 4.5 million tonnes a year and other traffic, which this closed-circuit model does not include.",
});

// =====================================================================================
// 15. Factorial
{
  const s = addSlide("SYSTEM", "Experiments");
  tag(s, "05 · COMBINED 2×2×2");
  s.addText("Together the three fixes reach 7.8 rakes/day", { placeholder: "title" });
  card(s, 0.89, 1.5, 7.6, 3.95, "Factorial chart card");
  s.addChart(pres.charts.BAR, [{ name: "Rakes/day", labels: ["None", "RLS", "Crew", "Loop", "Crew + Loop", "Loop + RLS", "Crew + RLS",
      "All three"], values: [4.77, 5.12, 5.77, 5.77, 6.37, 6.74, 6.76, 7.76] }],
    Object.assign({}, chartBase, { x: 1.0, y: 1.6, w: 7.4, h: 3.75, barDir: "col", barGapWidthPct: 45,
      chartColors: [HX.grey, HX.lgrn, HX.lgrn, HX.lgrn, HX.grn, HX.grn, HX.grn, HX.yel], showValue: true, dataLabelPosition: "outEnd",
      dataLabelFormatCode: "0.00", valAxisMinVal: 0, valAxisMaxVal: 9, showTitle: true,
      title: "Rakes/day for all 8 combinations (30 paired reps each, CI ≤ ± 0.07)", objectName: "Factorial chart" }));
  card(s, 8.7, 1.5, 3.74, 3.95, "Effects card");
  head(s, 8.92, 1.62, 3.3, "Effects on rakes/day", HX.cyan);
  s.addTable([
    [{ text: "Effect", options: TH }, { text: "Δ", options: TH }],
    [tc("Crew during loading"), tg("+1.07")], [tc("Loop +1"), tg("+1.06")], [tc("RLS"), tg("+0.92")],
    [tc("Crew × Loop"), to("−0.26")], [tc("Crew × RLS"), tg("+0.27")], [tc("Loop × RLS"), tg("+0.25")],
  ], tableOpts(8.92, 2.08, 3.3, [2.3, 1.0], 0.36, "Effects table"));
  s.addText("Crew and loop overlap (both free loop space); RLS works best with either of them.", { x: 8.92, y: 4.7, w: 3.35, h: 0.65,
    fontFace: BODY, fontSize: 11, color: C.background2, margin: 0, valign: "top", isTextBox: true, objectName: "Effects note" });
  s.addNotes("All eight combinations of the three terminal changes. Every change helps on its own, and each pair helps more. All three together give 7.76 rakes a day. The effects table shows the main effects are each about one rake a day. Crew and loop interact negatively because both solve the same problem, loop space. The silo interacts positively with both, because once loop space is fixed, faster loading turns directly into throughput.");
}

// =====================================================================================
// 16. Scorecard
pres.addSection({ title: "Results" });
{
  const s = addSlide("LINES", "Results");
  tag(s, "06 · SCORECARD");
  s.addText("Today vs all three fixes", { placeholder: "title" });
  card(s, 0.89, 1.5, 11.55, 3.9, "Scorecard card");
  s.addTable([
    [{ text: "KPI", options: TH }, { text: "Today", options: TH }, { text: "Crew + Loop + RLS", options: TH }, { text: "Change", options: TH },
     { text: "Doubling only", options: TH }],
    [tc("Rakes/day to CSTPS"), tc("4.77"), tg("7.76"), tg("+63%"), tm("4.88 (+2%)")],
    [tc("Coal delivered, t/day"), tc("19,000"), tg("31,000"), tg("+12,000 t"), tm("19,500")],
    [tc("Mean rake cycle"), tc("40.3 h"), tg("24.7 h"), tg("−39%"), tm("39.4 h")],
    [tc("P90 rake cycle"), tc("47.1 h"), tg("28.6 h"), tg("−39%"), tm("45.9 h")],
    [tc("Demurrage per rake"), tc("₹33,300"), tg("₹0"), tg("−100%"), tm("₹33,300")],
    [tc("CSTPS stock, lowest"), tc("5.0 days"), tg("10.4 days"), tg("×2"), tm("5.4 days")],
    [tc("Crew expiries / 100 trips"), tc("0.02"), tg("0"), tm("rule kept"), tm("0.01")],
  ], tableOpts(1.08, 1.66, 11.2, [3.0, 1.8, 2.4, 1.8, 2.2], 0.44, "Scorecard table"));
  chip(s, 0.97, 5.62, 8.2, "All values: 30 paired replications; 95% CI on rakes/day ≤ ± 0.06", "Chip scorecard");
  s.addNotes("The scorecard against every KPI we set at the start. With the crew change, one more loop and a rapid loading silo, throughput rises 63% to 7.8 rakes a day, about 12,000 more tonnes, the mean and 90th-percentile cycle each fall 39%, demurrage disappears, and the plant's lowest stock doubles from 5 to 10 days. Doubling alone, for comparison, moves almost nothing for today's traffic.");
}

// =====================================================================================
// 17. What doesn't help
{
  const s = addSlide("OFFICE", "Results");
  tag(s, "06 · WHAT DOES NOT HELP");
  s.addText("Levers that look useful but are not", { placeholder: "title" });
  card(s, 0.89, 1.5, 11.55, 3.9, "No-effect card");
  s.addTable([
    [{ text: "Lever", options: TH }, { text: "Δ rakes/day", options: TH }, { text: "Why", options: TH }],
    [tc("More rakes (8 → 12 → 20)"), tc("+0.03 / +0.07"), tm("loops are full; cycle grows 40 → 60 → 99 h")],
    [tc("Dispatch: alternate or batch directions"), tc("0.00"), tm("single line 21% busy, rarely contested")],
    [tc("Reserved paths at Tadali"), tc("+0.01"), tm("merge wait already 0.13 h")],
    [tc("Exam trigger 3 / 5 / 7 days early"), tc("−0.02 to +0.01"), tm("only adds exam time: 23 → 30 h/rake/month")],
    [tc("More tipplers, bigger crew pool"), tc("0.00"), tm("tipplers 21% busy; crew wait is travel, not shortage")],
    [tc("Faster handling at CSTPS"), tc("+0.04"), tm("plant end is not the bottleneck")],
  ], tableOpts(1.08, 1.66, 11.2, [3.9, 1.9, 5.4], 0.48, "No-effect table"));
  chip(s, 0.97, 5.62, 7.3, "Each tested with 30 paired replications against the baseline", "Chip none");
  s.addNotes("Just as useful: what not to spend on. More rakes only lengthen the cycle. Dispatch rules and reserved Tadali paths have nothing to fix. Earlier exams cost detention time. More tipplers or crews do nothing because neither is short. These were the remaining scenarios promised in our proposal.");
}

// =====================================================================================
// 18. Conclusions
pres.addSection({ title: "Close" });
{
  const s = addSlide("SYSTEM", "Close");
  tag(s, "07 · CONCLUSIONS");
  s.addText("What we recommend, and what to verify", { placeholder: "title" });
  card(s, 0.89, 1.45, 5.85, 2.95, "Recommendations card");
  head(s, 1.11, 1.58, 5.4, "Recommend, in this order", HX.lgrn);
  row(s, 1.11, 2.08, 5.5, 1, HX.grn, "Order crews during loading", "free, +1.0/day", false, 13.5);
  row(s, 1.11, 2.5, 5.5, 2, HX.grn, "Add a third Ghugus loop", "+1.0/day", false, 13.5);
  row(s, 1.11, 2.92, 5.5, 3, HX.grn, "Rapid loading silo", "with 1–2: +3.0/day", false, 13.5);
  row(s, 1.11, 3.34, 5.5, 4, HX.yel, "Doubling for future growth,", "not today's coal", true, 13.5);
  row(s, 1.11, 3.76, 5.5, 5, HX.grey, "Keep fleet at 8, exam near expiry", "", false, 13.5);
  card(s, 6.95, 1.45, 5.49, 2.95, "Limitations card");
  head(s, 7.17, 1.58, 5.1, "Verify with field data", HX.red);
  bullets(s, 7.17, 2.06, 5.1, 2.3, [
    "Ghugus loops (A-01) and yard times (A-13/14) are assumed; they drive the result",
    "Empties held at CD comes from a dispatcher rule we assumed (A-27)",
    "Data templates and a cycle-log export are ready for CR / WCL records",
  ], 13);
  s.addNotes("Recommendations, cheapest first: change crew ordering, add a loop at Ghugus, then a rapid loading silo, which together deliver three more rakes a day. Doubling is justified by future traffic growth, not by today's coal circuit. Limits: the key layout and yard-time inputs are assumptions; the first field data to collect are Ghugus loop counts, placement and release times, and where crews are booked. The model and templates are ready to take it.");
}

pres.writeFile({ fileName: OUT }).then(async (f) => {
  try { const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js"); await applyTheme(OUT, THEME); }
  catch (e) { console.log("theme not applied (" + e.message + ")"); }
  console.log("wrote " + f);
});
