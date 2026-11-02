// RakeFlow final presentation - professional edition (clean, no illustrated scenes).
// Every number is from model/results/key_experiments.md and model/results/summary_tables.md
// (30 replications x 30 days after a 3-day warm-up, common random numbers, paired 95% CIs).
// Run:  node presentation/build_deck_pro.js   (needs pptxgenjs, react, react-dom, react-icons, sharp)
const path = require("path");
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa");

const OUT = path.join(__dirname, "RakeFlow_Final_Presentation_Professional.pptx");

const THEME = {
  name: "RakeFlow Charcoal Amber", headFontFace: "Cambria", bodyFontFace: "Calibri",
  colors: { dk1: "1E2328", lt1: "FFFFFF", dk2: "3B4550", lt2: "F3F4F6", accent1: "D98E04", accent2: "2E7D5B",
            accent3: "4A6FA5", accent4: "B03A2E", accent5: "8A96A3", accent6: "E9C46A", hlink: "4A6FA5", folHlink: "8A96A3" },
};
const HX = { ink: "1E2328", slate: "3B4550", mute: "6B7785", line: "E1E4E8", tint: "F3F4F6", amber: "D98E04", green: "2E7D5B",
             steel: "4A6FA5", red: "B03A2E", grey: "8A96A3", sand: "E9C46A", white: "FFFFFF" };

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.title = "RakeFlow - Coal rake cycle simulation, final presentation";
pres.author = "IE305 Team RakeFlow";
pres.subject = "Ghugus-Tadali-Chandrapur closed-circuit coal rakes, AnyLogic discrete-event simulation";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;
const HEAD = THEME.headFontFace, BODY = THEME.bodyFontFace;

// ---------------- layouts ----------------
pres.defineSlideMaster({
  title: "DARK",
  background: { color: C.text1 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.8, y: 2.2, w: 7.4, h: 1.3, fontFace: HEAD, fontSize: 44,
      bold: true, color: C.background1, margin: 0, valign: "bottom", align: "left" }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: 0.8, y: 3.65, w: 7.2, h: 1.2, fontFace: BODY, fontSize: 18,
      color: C.background2, margin: 0, valign: "top", align: "left" }, text: "" } },
  ],
});
pres.defineSlideMaster({
  title: "CONTENT",
  background: { color: C.background1 },
  margin: [0.5, 0.6, 0.6, 0.6],
  objects: [
    { placeholder: { options: { name: "kicker", type: "body", x: 0.6, y: 0.32, w: 9, h: 0.3, fontFace: BODY, fontSize: 12,
      bold: true, color: C.accent1, margin: 0, valign: "middle", align: "left", charSpacing: 2 }, text: "" } },
    { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.62, w: 12.1, h: 0.75, fontFace: HEAD, fontSize: 26,
      bold: true, color: C.text1, margin: 0, valign: "middle", align: "left" }, text: "" } },
    { text: { text: "RakeFlow · IE305 Simulation Lab · Ghugus–Tadali–Chandrapur coal rake cycle",
      options: { x: 0.6, y: 7.05, w: 9, h: 0.25, fontFace: BODY, fontSize: 10, color: C.accent5, margin: 0, valign: "middle" } } },
  ],
  slideNumber: { x: 12.23, y: 7.05, w: 0.5, h: 0.25, fontFace: BODY, fontSize: 10, color: C.accent5, align: "right" },
});

// ---------------- helpers ----------------
async function icon(Comp, color, px = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Comp, { color: "#" + color, size: px }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}
function slide(section, kicker, title) {
  const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: section });
  s.addText(kicker.toUpperCase(), { placeholder: "kicker" });
  s.addText(title, { placeholder: "title" });
  return s;
}
function panel(s, x, y, w, h, name) {
  s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: C.background2 }, line: { type: "none" }, objectName: name || "Panel" });
}
function heading(s, x, y, w, text, color) {
  s.addText(text, { x, y, w, h: 0.36, fontFace: BODY, fontSize: 15, bold: true, color: color || C.text1, margin: 0,
    valign: "middle", isTextBox: true, objectName: "Panel heading" });
}
function para(s, x, y, w, h, text, opts) {
  s.addText(text, Object.assign({ x, y, w, h, fontFace: BODY, fontSize: 14, color: C.text2, margin: 0, valign: "top",
    isTextBox: true, objectName: "Text" }, opts || {}));
}
function bullets(s, x, y, w, h, items, size) {
  s.addText(items.map((t, i) => {
    const runs = Array.isArray(t) ? t : [{ text: t }];
    return runs.map((r, j) => ({ text: r.text, options: { bullet: j === 0 ? { indent: 15 } : undefined, bold: !!r.bold,
      color: r.bold ? C.text1 : C.text2, breakLine: j === runs.length - 1 && i < items.length - 1, paraSpaceAfter: 6 } }));
  }).flat(), { x, y, w, h, fontFace: BODY, fontSize: size || 14, valign: "top", margin: 0, isTextBox: true, objectName: "Bullets" });
}
function stat(s, x, y, w, big, color, label, note, size) {
  s.addText(big, { x, y, w, h: 0.75, fontFace: HEAD, fontSize: size || 36, bold: true, color, margin: 0, valign: "bottom",
    isTextBox: true, objectName: "Stat value" });
  s.addText(label, { x, y: y + 0.8, w, h: 0.3, fontFace: BODY, fontSize: 14, bold: true, color: C.text1, margin: 0,
    isTextBox: true, objectName: "Stat label" });
  if (note) s.addText(note, { x, y: y + 1.1, w, h: 0.5, fontFace: BODY, fontSize: 12, color: C.accent5, margin: 0,
    valign: "top", isTextBox: true, objectName: "Stat note" });
}
function num(s, x, y, n, color) {
  s.addShape(pres.shapes.OVAL, { x, y, w: 0.42, h: 0.42, fill: { color: color || C.accent1 }, line: { type: "none" },
    objectName: "Number " + n });
  s.addText(String(n), { x, y, w: 0.42, h: 0.42, fontFace: BODY, fontSize: 14, bold: true, color: C.background1, align: "center",
    valign: "middle", margin: 0, isTextBox: true, objectName: "Number text " + n });
}
function source(s, text) {
  s.addText(text, { x: 0.6, y: 6.7, w: 12.1, h: 0.28, fontFace: BODY, fontSize: 10, italic: true, color: C.accent5, margin: 0,
    valign: "middle", isTextBox: true, objectName: "Source note" });
}
// tables
const TH = { fontFace: BODY, fontSize: 12, bold: true, color: HX.white, fill: { color: HX.ink }, valign: "middle" };
const cell = (t, o) => ({ text: t, options: Object.assign({ fontFace: BODY, fontSize: 12, color: HX.slate }, o || {}) });
const good = (t) => cell(t, { color: HX.green, bold: true });
const bad = (t) => cell(t, { color: HX.red, bold: true });
const strong = (t) => cell(t, { color: HX.ink, bold: true });
function table(s, rows, x, y, w, colW, rowH, name) {
  const body = rows.map((r, i) => i === 0 ? r.map((t) => (typeof t === "string" ? { text: t, options: TH } : t))
    : r.map((c) => { const o = typeof c === "string" ? cell(c) : c; o.options.fill = { color: i % 2 ? HX.white : HX.tint }; return o; }));
  s.addTable(body, { x, y, w, colW, rowH, border: { type: "solid", pt: 0.75, color: HX.line }, valign: "middle",
    margin: [0.03, 0.1, 0.03, 0.1], objectName: name });
}
const chartBase = {
  catAxisLabelColor: HX.slate, valAxisLabelColor: HX.mute, catAxisLabelFontFace: "+mn-lt", valAxisLabelFontFace: "+mn-lt",
  catAxisLabelFontSize: 12, valAxisLabelFontSize: 11, dataLabelFontFace: "+mn-lt", dataLabelFontSize: 12, dataLabelColor: HX.ink,
  valGridLine: { color: HX.line, size: 0.5 }, catGridLine: { style: "none" }, catAxisLineShow: true, valAxisLineShow: false,
  catAxisLineColor: HX.line, showLegend: false, titleFontFace: "+mn-lt", titleColor: HX.ink, titleFontSize: 13,
  legendFontFace: "+mn-lt", legendFontSize: 12, legendColor: HX.slate, catAxisTitleFontFace: "+mn-lt",
  valAxisTitleFontFace: "+mn-lt", catAxisTitleColor: HX.mute, valAxisTitleColor: HX.mute, catAxisTitleFontSize: 12,
  valAxisTitleFontSize: 12,
};

async function build() {
  const ICON = {
    train: await icon(fa.FaTrain, HX.amber), line: await icon(fa.FaExchangeAlt, HX.amber), loops: await icon(fa.FaWarehouse, HX.amber),
    crew: await icon(fa.FaUserClock, HX.amber), bpc: await icon(fa.FaClipboardCheck, HX.amber), money: await icon(fa.FaRupeeSign, HX.amber),
    plant: await icon(fa.FaIndustry, HX.amber), chart: await icon(fa.FaChartBar, HX.amber),
  };

  // =========================================================================== 1 Title
  pres.addSection({ title: "Introduction" });
  {
    const s = pres.addSlide({ masterName: "DARK", sectionTitle: "Introduction" });
    s.addText("IE305 SIMULATION LAB · FINAL PRESENTATION", { x: 0.8, y: 1.55, w: 7.4, h: 0.35, fontFace: BODY, fontSize: 13, bold: true,
      color: C.accent1, charSpacing: 2, margin: 0, isTextBox: true, objectName: "Kicker" });
    s.addText("RakeFlow", { placeholder: "title" });
    s.addText("Simulating the Ghugus–Tadali–Chandrapur closed-circuit coal rake cycle in AnyLogic", { placeholder: "body" });
    s.addText("Team RakeFlow · IEOR, IIT Bombay", { x: 0.8, y: 6.3, w: 7, h: 0.35, fontFace: BODY, fontSize: 14, color: C.accent5,
      margin: 0, isTextBox: true, objectName: "Team" });
    const st = [["4.77 → 7.76", "rakes/day to the power station"], ["40.3 → 24.7 h", "mean rake cycle time"], ["₹33,300 → ₹0", "demurrage per rake"]];
    st.forEach(([b, l], i) => {
      s.addText(b, { x: 8.9, y: 1.7 + i * 1.45, w: 4, h: 0.7, fontFace: HEAD, fontSize: 32, bold: true, color: C.accent1, margin: 0,
        valign: "bottom", isTextBox: true, objectName: "Title stat" });
      s.addText(l, { x: 8.9, y: 2.42 + i * 1.45, w: 4, h: 0.35, fontFace: BODY, fontSize: 14, color: C.background2, margin: 0,
        isTextBox: true, objectName: "Title stat label" });
    });
    s.addNotes("RakeFlow is our discrete-event simulation of the coal rakes that shuttle between the WCL sidings at Ghugus and Chandrapur Super Thermal Power Station. The three numbers on the right are the headline: with three changes at the Ghugus end, throughput rises from 4.77 to 7.76 rakes a day, the round trip falls from 40 to under 25 hours, and loading demurrage disappears.");
  }

  // =========================================================================== 2 Executive summary
  {
    const s = slide("Introduction", "Executive summary", "Three terminal changes raise throughput 63% without new track");
    const pts = [
      ["Time is lost at the terminals, not on the line.", "80% of the 40.3 h cycle is spent at Ghugus and Chandrapur; the single line and Tadali merge cost 0.6 h."],
      ["Ordering the crew during loading adds 1.0 rake/day at no cost.", "Loaded rakes stop holding one of only two Ghugus loops while waiting for a crew."],
      ["A third loop adds another 1.0; a loading silo ends demurrage.", "Together the three reach 7.76 rakes/day, matching the 7–8 reported for Ghugus."],
      ["The ₹228 crore doubling adds only 0.11 rakes/day for today's traffic.", "The single line is 21% busy; its value is for future growth, not this circuit."],
    ];
    pts.forEach(([h, t], i) => {
      num(s, 0.6, 1.7 + i * 1.18, i + 1);
      s.addText(h, { x: 1.2, y: 1.66 + i * 1.18, w: 6.6, h: 0.4, fontFace: BODY, fontSize: 16, bold: true, color: C.text1, margin: 0,
        valign: "middle", isTextBox: true, objectName: "Summary point" });
      para(s, 1.2, 2.08 + i * 1.18, 6.6, 0.6, t);
    });
    panel(s, 8.35, 1.6, 4.38, 4.85, "Summary stats panel");
    stat(s, 8.7, 1.7, 3.8, "+63%", C.accent2, "rakes/day (4.77 → 7.76)", "crew timing + 3rd loop + loading silo");
    stat(s, 8.7, 3.25, 3.8, "−39%", C.accent2, "mean cycle (40.3 → 24.7 h)", "P90 47.1 → 28.6 h");
    stat(s, 8.7, 4.8, 3.8, "+2%", C.accent4, "doubling alone (4.88)", "₹228 cr, same seeds, 95% CI ± 0.06");
    source(s, "All results: 30 replications × 30 days after 3-day warm-up, common random numbers, paired 95% confidence intervals.");
    s.addNotes("Four findings. First, where the time goes: terminals, not track. Second, the cheapest fix is changing when the crew is ordered. Third, adding a loop and a rapid loading silo completes the package and reaches the throughput Ghugus actually reports. Fourth, the line doubling barely moves today's coal circuit.");
  }

  // =========================================================================== 3 What we did
  {
    const s = slide("Introduction", "Project overview", "What we did, from proposal to recommendations");
    const steps = [
      ["Proposal", "Problem, questions, 7 what-if scenarios, KPIs (submitted deck)"],
      ["Data collection", "Timetable of 115 trains, rules, audit reports, CEA coal data"],
      ["Input modelling", "100 parameters; distributions where no records exist"],
      ["Model build", "AnyLogic 8.9.9, built in 3 phases: core, crew, brake certificate"],
      ["Verify & validate", "Invariants every event; benchmarks for cycle and throughput"],
      ["Experiments", "~60 cases × 30 replications; 2×2×2 factorial; sensitivity"],
    ];
    const w = 1.9, gap = 0.142;
    steps.forEach(([h, t], i) => {
      const x = 0.6 + i * (w + gap);
      s.addShape(pres.shapes.RECTANGLE, { x, y: 1.75, w, h: 0.08, fill: { color: i === 5 ? C.accent1 : C.text2 }, line: { type: "none" },
        objectName: "Timeline segment" });
      num(s, x, 2.05, i + 1, i === 5 ? C.accent1 : C.text2);
      s.addText(h, { x, y: 2.6, w, h: 0.4, fontFace: BODY, fontSize: 15, bold: true, color: C.text1, margin: 0, isTextBox: true,
        objectName: "Step heading" });
      para(s, x, 3.0, w - 0.1, 1.3, t, { fontSize: 13 });
    });
    panel(s, 0.6, 4.55, 12.13, 1.9, "Deliverables panel");
    heading(s, 0.85, 4.7, 6, "Deliverables");
    bullets(s, 0.85, 5.1, 5.7, 1.3, [
      [{ text: "AnyLogic model: ", bold: true }, { text: "RakeFlow.alp with 4 experiments, 100 parameters" }],
      [{ text: "Support files: ", bold: true }, { text: "parameter workbook, 15 research notes, 8 data templates" }],
    ], 13);
    bullets(s, 6.75, 5.1, 5.8, 1.3, [
      [{ text: "Analysis: ", bold: true }, { text: "test harness, experiment scripts, result tables and figures" }],
      [{ text: "This presentation ", bold: true }, { text: "and the submitted proposal deck" }],
    ], 13);
    s.addNotes("The project in six stages. We started from the proposal, collected every number we could from public sources, turned them into model inputs, built the AnyLogic model in three phases, checked it, and then ran the experiments. The deliverables required by the course are listed at the bottom; everything is in the project repository.");
  }

  // =========================================================================== 4 Context
  pres.addSection({ title: "Problem" });
  {
    const s = slide("Problem", "Context", "A power station short of coal, fed by a 14 km single line");
    bullets(s, 0.6, 1.65, 6.0, 4.6, [
      [{ text: "Closed circuit: ", bold: true }, { text: "8 rakes of 58 BOXN wagons (~3,990 t) shuttle between WCL sidings at Ghugus and CSTPS Chandrapur." }],
      [{ text: "Route: ", bold: true }, { text: "14.11 km single line Ghugus–Tadali, then 13 km on the busy Wardha–Balharshah main line." }],
      [{ text: "Constraints: ", bold: true }, { text: "crew duty 9 h, brake certificate 6,000 km / 30 days, demurrage after 3 h loading / 7 h unloading." }],
      [{ text: "Investment on the table: ", bold: true }, { text: "Railways sanctioned ₹228 crore in July 2026 to double the single line." }],
      [{ text: "Our question: ", bold: true }, { text: "running time is under an hour, the round trip is ~40 h. Where does the time go, and what raises coal delivered per day?" }],
    ], 14);
    const st = [["6–17 days", C.accent4, "coal stock at CSTPS", "norm 20–26 days (CEA)"], ["6–10", C.accent1, "rakes/day received", "2,920 MW plant, rail-fed"],
                ["145–163%", C.accent1, "main-line utilisation", "Wardha–Balharshah, 2023"], ["₹228 cr", C.accent3, "doubling sanctioned", "+4.5 MTPA planned"]];
    st.forEach(([b, c, l, n], i) => {
      const x = 7.0 + (i % 2) * 2.95, y = 1.65 + Math.floor(i / 2) * 2.4;
      panel(s, x, y, 2.75, 2.15, "Context stat panel");
      stat(s, x + 0.2, y + 0.12, 2.4, b, c, l, n, 28);
    });
    source(s, "Sources: CEA daily coal stock reports; Gazette of India 4 Jun 2026; RailPost 17 Jul 2026; The Hitavada 2023.");
    s.addNotes("The plant holds 6 to 17 days of coal against a norm of 20 to 26 and receives 6 to 10 rakes a day. The main line it shares runs at 145 to 163 percent of capacity, and Rs 228 crore has been sanctioned to double the single line. The puzzle is the gap between under an hour of running and a 40-hour round trip.");
  }

  // =========================================================================== 5 System flow
  {
    const s = slide("Problem", "The system", "One rake's round trip: eight steps, 40.3 hours");
    const top = [["Load at Ghugus", "placement, loading, release", 12.7, true], ["Wait for crew", "crew travels from Balharshah", 2.8, false],
                 ["Single line", "14 km, one train at a time", 0.6, false], ["Tadali merge + run", "gap in 115-train timetable", 0.5, false],
                 ["Unload at CSTPS", "placement, tippler, release", 12.0, true]];
    const bot = [["BPC exam detour", "when certificate is due", 1.4, false], ["Run back", "Tadali, single line", 1.3, false],
                 ["Empty held at CD", "until loops free + crew", 9.2, true]];
    const bw = 2.15, bh = 1.45, gx = 0.34;
    const box = (x, y, [h, t, hrs, hot], i) => {
      s.addShape(pres.shapes.RECTANGLE, { x, y, w: bw, h: bh, fill: { color: hot ? "FBF1DF" : HX.tint },
        line: { color: hot ? HX.amber : HX.line, width: 1 }, objectName: "Step box " + i });
      s.addText(h, { x: x + 0.12, y: y + 0.1, w: bw - 0.24, h: 0.35, fontFace: BODY, fontSize: 14, bold: true, color: C.text1, margin: 0,
        isTextBox: true, objectName: "Step name" });
      s.addText(t, { x: x + 0.12, y: y + 0.45, w: bw - 0.24, h: 0.45, fontFace: BODY, fontSize: 12, color: C.text2, margin: 0,
        valign: "top", isTextBox: true, objectName: "Step detail" });
      s.addText(hrs.toFixed(1) + " h", { x: x + 0.12, y: y + 0.92, w: bw - 0.24, h: 0.42, fontFace: HEAD, fontSize: 20, bold: true,
        color: hot ? C.accent1 : C.text2, margin: 0, valign: "middle", isTextBox: true, objectName: "Step hours" });
    };
    top.forEach((b, i) => {
      const x = 0.6 + i * (bw + gx); box(x, 1.7, b, i);
      if (i < 4) s.addShape(pres.shapes.LINE, { x: x + bw + 0.04, y: 2.42, w: gx - 0.08, h: 0, line: { color: HX.mute, width: 1.5, endArrowType: "triangle" }, objectName: "Arrow" });
    });
    const xr = [0.6 + 2 * (bw + gx), 0.6 + 3 * (bw + gx), 0.6 + 4 * (bw + gx)];
    bot.forEach((b, i) => {
      box(xr[i], 3.85, b, i + 5);
      if (i > 0) s.addShape(pres.shapes.LINE, { x: xr[i] - gx + 0.04, y: 4.57, w: gx - 0.08, h: 0, line: { color: HX.mute, width: 1.5, beginArrowType: "triangle" }, objectName: "Arrow back" });
    });
    s.addShape(pres.shapes.LINE, { x: xr[2] + bw / 2, y: 1.7 + bh + 0.04, w: 0, h: 3.85 - 1.7 - bh - 0.08, line: { color: HX.mute, width: 1.5, endArrowType: "triangle" }, objectName: "Arrow down" });
    s.addShape(pres.shapes.LINE, { x: 0.6 + bw / 2, y: 1.7 + bh + 0.04, w: 0, h: 4.57 - 1.7 - bh - 0.04, line: { color: HX.mute, width: 1.5, beginArrowType: "triangle" }, objectName: "Arrow up" });
    s.addShape(pres.shapes.LINE, { x: 0.6 + bw / 2, y: 4.57, w: xr[0] - 0.6 - bw / 2 - 0.04, h: 0, line: { color: HX.mute, width: 1.5 }, objectName: "Arrow return" });
    s.addText("back to Ghugus", { x: 0.75, y: 4.62, w: 2.6, h: 0.3, fontFace: BODY, fontSize: 12, italic: true, color: C.accent5, margin: 0,
      isTextBox: true, objectName: "Return label" });
    panel(s, 0.6, 5.55, 12.13, 0.95, "Clock panel");
    s.addText([{ text: "Three clocks run on every rake:  ", options: { bold: true, color: C.text1 } },
               { text: "crew duty (9 h, 11 h with notice, then relief)  ·  brake power certificate (6,000 km / 30 days, 8 h daylight exam)  ·  demurrage (₹150 per wagon-hour after free time)", options: { color: C.text2 } }],
      { x: 0.85, y: 5.55, w: 11.7, h: 0.95, fontFace: BODY, fontSize: 14, margin: 0, valign: "middle", isTextBox: true, objectName: "Clocks" });
    source(s, "Hours: baseline mean per cycle from the model (30 replications). Highlighted steps are the three largest.");
    s.addNotes("This is the cycle the model follows, with the average hours of each step today. The three highlighted boxes, loading-side work at Ghugus, unloading-side work at Chandrapur, and empties held at Chandrapur waiting for loop space and a crew, add up to 34 of the 40 hours. The single line and the Tadali merge, where we expected the problem, take about one hour together.");
  }

  // =========================================================================== 6 Objective & KPIs
  {
    const s = slide("Problem", "Objective and KPIs", "What we tried to improve, and how we measured it");
    panel(s, 0.6, 1.6, 12.13, 0.75, "Objective panel");
    s.addText([{ text: "Objective   ", options: { bold: true, color: C.accent1 } },
               { text: "maximise rakes/day to CSTPS and minimise mean cycle time, within crew-duty and brake-certificate rules", options: { color: C.text1 } }],
      { x: 0.85, y: 1.6, w: 11.7, h: 0.75, fontFace: BODY, fontSize: 15, margin: 0, valign: "middle", isTextBox: true, objectName: "Objective" });
    table(s, [
      ["KPI", "Type", "Better", "Baseline", "Definition in the model"],
      [strong("Rakes/day to CSTPS"), "Primary", good("↑"), "4.77", "loaded rakes placed at CSTPS per day after warm-up"],
      [strong("Coal delivered, t/day"), "Primary", good("↑"), "19,000", "rakes/day × 3,990 t"],
      [strong("Mean and P90 cycle time"), "Primary", good("↓"), "40.3 / 47.1 h", "Ghugus arrival to next Ghugus arrival, per rake"],
      [strong("Cycle-time breakdown"), "Diagnostic", "—", "20 stages", "hours per cycle in each stage (load, crew, line, merge …)"],
      [strong("Demurrage per rake"), "Cost", good("↓"), "₹33,300", "₹150/wagon/h over free time, graded slabs (DM-01)"],
      [strong("CSTPS stock, lowest"), "Outcome", good("↑"), "5.0 days", "daily stock: receipts + non-rail supply − burn"],
      [strong("Utilisation, queues"), "Diagnostic", "—", "line 21%", "single line, sidings, tipplers; Tadali queue length"],
      [strong("Crew expiries, exam hours"), "Constraint", "≈ 0", "0.02 / 100 trips", "duty expiries per 100 trips; exam h/rake/month"],
    ], 0.6, 2.6, 12.13, [2.75, 1.25, 0.8, 1.6, 5.73], 0.42, "KPI table");
    s.addNotes("The objective is the one set in our proposal: more rakes per day in less cycle time, within the rules. Primary KPIs are throughput and cycle time, mean and 90th percentile. Demurrage and the plant's coal stock show the money and the outcome. Utilisations and queues tell us where the bottleneck is. Crew expiries and exam hours are constraints any solution must respect.");
  }

  // =========================================================================== 7 Features
  pres.addSection({ title: "Model" });
  {
    const s = slide("Model", "Model features", "What the AnyLogic model represents");
    const f = [
      [ICON.train, "Real timetable", "115 passenger trains on their days of run, lognormal lateness, Poisson goods trains"],
      [ICON.line, "Single-line block", "one train at a time; enters only if a loop is free at the far end"],
      [ICON.loops, "Loops and sidings", "2 Ghugus loops, 2 Tadali loops, 2 loading sidings; deadlock-free rules"],
      [ICON.crew, "Crew duty clock", "sign-on, travel, 9 h / 11 h duty, relief, 12–16 h rest, pool of 16"],
      [ICON.bpc, "Brake certificate", "6,000 km / 30 days; depot detour; 8 h exam in daylight only"],
      [ICON.money, "Demurrage", "free time from placement; graded ₹150/wagon/h slabs at both ends"],
      [ICON.plant, "Plant side", "4 of 5 tipplers; CSTPS coal stock with burn and non-rail supply"],
      [ICON.chart, "Measurement", "20-stage cycle breakdown; per-rake cycle log in the data-template format"],
    ];
    f.forEach(([ic, h, t], i) => {
      const x = 0.6 + (i % 4) * 3.07, y = 1.65 + Math.floor(i / 4) * 2.45;
      panel(s, x, y, 2.9, 2.25, "Feature panel");
      s.addShape(pres.shapes.OVAL, { x: x + 0.22, y: y + 0.22, w: 0.62, h: 0.62, fill: { color: C.background1 }, line: { type: "none" },
        objectName: "Icon circle" });
      s.addImage({ data: ic, x: x + 0.37, y: y + 0.37, w: 0.32, h: 0.32, objectName: "Icon " + h });
      s.addText(h, { x: x + 0.22, y: y + 0.95, w: 2.5, h: 0.35, fontFace: BODY, fontSize: 15, bold: true, color: C.text1, margin: 0,
        isTextBox: true, objectName: "Feature name" });
      para(s, x + 0.22, y + 1.3, 2.5, 0.9, t, { fontSize: 12 });
    });
    source(s, "Built in three phases (1 core cycle, 2 + crew, 3 + brake certificate); each phase verified before the next.");
    s.addNotes("Eight features of the model. The timetable is real, not a random arrival stream. The single line is worked as one absolute block, as the railway does. Loops and sidings have finite capacity, with controller rules that prevent deadlock. Crew, brake certificate and demurrage are each implemented from the Railway Board rules. On the plant side we track tipplers and coal stock. Every cycle is broken into 20 stages so we can see where time goes.");
  }

  // =========================================================================== 8 Parameters
  {
    const s = slide("Model", "Parameters", "Key parameters and where each value comes from");
    table(s, [
      ["Parameter", "Value", "Type", "ID"],
      ["Fleet in the closed circuit", "8 rakes", "assumption", "A-18"],
      ["Rake: wagons / payload", "58 / 3,990 t", "hard", "CR 2024-25"],
      ["Ghugus loops / Tadali loops", "2 / 2", "assumption", "A-01, A-02"],
      ["Loading sidings at Ghugus", "2", "inferred", "LD-02"],
      ["Single line length", "14.11 km", "hard", "INF-01"],
      ["Tadali–Chandrapur distance", "13 km", "soft", "INF-08"],
      ["Tipplers in service", "4 of 5", "assumption", "A-17, UL-01"],
    ], 0.6, 1.65, 6.0, [2.55, 1.35, 1.1, 1.0], 0.5, "Parameter table A");
    table(s, [
      ["Parameter", "Value", "Type", "ID"],
      ["Crew duty / with notice", "9 h / 11 h", "hard", "CR-01, 02"],
      ["Crew rest at HQ", "12 h / 16 h", "hard", "CR-04"],
      ["Crew pool, booking lobby", "16, Balharshah", "assumption", "A-25, A-06"],
      ["BPC validity", "6,000 km / 30 d", "hard", "BPC-01"],
      ["Free time load / unload", "3 h / 7 h", "hard", "FT-01, 02"],
      ["Demurrage rate", "₹150/wagon/h", "hard", "DM-01"],
      ["Warm-up / run / reps", "3 d / 30 d / 30", "design", "brief 4.1"],
    ], 6.73, 1.65, 6.0, [2.4, 1.55, 1.05, 1.0], 0.5, "Parameter table B");
    panel(s, 0.6, 5.85, 12.13, 0.7, "Parameter note panel");
    s.addText([{ text: "100 parameters in total, ", options: { bold: true, color: C.text1 } },
               { text: "each on the AnyLogic canvas and named by its source ID: hard = official rule or record, soft = secondary source, assumption = no source, tested in sensitivity runs.", options: { color: C.text2 } }],
      { x: 0.85, y: 5.85, w: 11.7, h: 0.7, fontFace: BODY, fontSize: 13, margin: 0, valign: "middle", isTextBox: true, objectName: "Parameter note" });
    s.addNotes("The main fixed parameters. Rules from the Railway Board are hard data. Layout quantities such as the number of loops at Ghugus and Tadali, and the fleet size, are assumptions because no public source gives them; they are exactly the ones we vary in the experiments and sensitivity runs. All 100 parameters, with sources and confidence, are in the parameter workbook.");
  }

  // =========================================================================== 9 Data sources
  pres.addSection({ title: "Data" });
  {
    const s = slide("Data", "Data sources", "All inputs come from public, cited sources");
    table(s, [
      ["Source", "What we extracted", "How the model uses it"],
      [strong("erail.in timetable"), "115 passenger trains: times at Tadali and Chandrapur, days of run", "exact blocking schedule for the Tadali merge"],
      [strong("etrain.info running history"), "lateness samples, 26–86 min", "lognormal lateness for every train"],
      [strong("Railway Board letters (RBE 143/2016 …)"), "crew duty, rest, free time, demurrage slabs", "hard rules in the logic"],
      [strong("IRIMEE / JPO freight examination"), "BPC 6,000 km / 30 days, 8 h exam, daylight", "exam trigger, duration, time window"],
      [strong("CAG Reports 31/2014, 47/2015"), "yard detention times, crew sign-on delays", "triangular min / mode / max"],
      [strong("CEA daily coal stock reports"), "CSTPS consumption, receipts, stock", "coal-stock KPI and validation target"],
      [strong("Gazette, CR highlights, RailPost"), "14.11 km line, 58 wagons, 3,990 t, ₹228 cr", "fixed inputs and the doubling scenario"],
    ], 0.6, 1.65, 12.13, [3.6, 4.4, 4.13], 0.52, "Data source table");
    panel(s, 0.6, 5.95, 12.13, 0.62, "Data gap panel");
    s.addText([{ text: "Data gap:  ", options: { bold: true, color: C.accent4 } },
               { text: "no Central Railway / WCL rake records were received. Eight collection templates and the model's cycle-log export are ready for them.", options: { color: C.text2 } }],
      { x: 0.85, y: 5.95, w: 11.7, h: 0.62, fontFace: BODY, fontSize: 13, margin: 0, valign: "middle", isTextBox: true, objectName: "Data gap" });
    s.addNotes("Every number has a cited public source, listed in the research folder of the repository. The request for railway records did not return data, so field data is the main open item; the collection templates already match the model's output format.");
  }

  // =========================================================================== 10 Distributions
  {
    const s = slide("Data", "Input distributions", "Where no record exists: triangular from min / most likely / max");
    table(s, [
      ["Activity", "Distribution", "Basis"],
      ["Loading, pay-loader / CHP", "Tri(4, 6, 9) h", "RB free time, manual norm"],
      ["Loading, rapid silo (RLS)", "Tri(1, 1.5, 3) h", "PIB, MCL silos"],
      ["Arrival → placement, Ghugus", "Tri(0.5, 1, 4) h", "CAG Table 18"],
      ["Release → ready, Ghugus", "Tri(0.8, 1.5, 6) h", "CAG Table 18"],
      ["Single-line block occupancy", "Tri(25, 31, 38) min", "speed + line clear"],
      ["Main-line freight speed", "Tri(30, 40, 50) km/h", "IR goods average"],
      ["Gap to a train at Tadali", "Tri(6, 10, 15) min", "block headway"],
      ["Passenger lateness", "Lognormal(30, 30) min", "etrain samples"],
    ], 0.6, 1.65, 6.0, [2.6, 1.85, 1.55], 0.5, "Distribution table A");
    table(s, [
      ["Activity", "Distribution", "Basis"],
      ["Arrival → placement, CSTPS", "Tri(0.6, 2, 8) h", "CAG Table 18"],
      ["Unloading by tippler", "Tri(2, 4, 7) h", "industry, RB 7 h"],
      ["Release → despatch, CSTPS", "Tri(1.5, 3, 8) h", "CAG Table 18"],
      ["Crew sign-on", "Tri(0.5, 0.75, 2) h", "CAG 47/2015"],
      ["Crew travel to Ghugus", "Tri(1, 1.5, 2.5) h", "~40 km by road"],
      ["Relief crew arrival", "Tri(1, 2.5, 6) h", "assumed"],
      ["BPC exam duration", "Tri(6, 8, 12) h", "JPO 8 h + repairs"],
      ["Through goods trains", "Poisson, 20/day/dir", "Ballarshah ~50/day"],
    ], 6.73, 1.65, 6.0, [2.6, 1.85, 1.55], 0.5, "Distribution table B");
    source(s, "Triangular as proposed in the submitted deck; lognormal because lateness is positive and right-skewed; replace each with a fitted distribution when field data arrives.");
    s.addNotes("Where no record exists we follow the approach from our proposal: experts' or audit minimum, most likely and maximum values define a triangular distribution. Lateness uses a lognormal; additional goods trains on the main line arrive as a Poisson process. Each row maps to a data template so it can be replaced by a fitted distribution.");
  }

  // =========================================================================== 11 Build phases
  {
    const s = slide("Data", "Model build", "Built in three phases; each added clock costs throughput");
    s.addChart(pres.charts.BAR, [{ name: "Rakes/day", labels: ["Phase 1: core cycle", "Phase 2: + crew clock", "Phase 3: + BPC (full)"],
      values: [5.75, 4.81, 4.77] }], Object.assign({}, chartBase, { x: 0.6, y: 1.6, w: 6.6, h: 4.9, barDir: "col", barGapWidthPct: 60,
      chartColors: [HX.grey, HX.steel, HX.amber], showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: "0.00",
      valAxisMinVal: 0, valAxisMaxVal: 7, showTitle: true, title: "Rakes/day at CSTPS (30 replications)", objectName: "Phase chart" }));
    heading(s, 7.6, 1.7, 5, "What each phase adds");
    bullets(s, 7.6, 2.15, 5.1, 3.0, [
      [{ text: "Phase 1, core: ", bold: true }, { text: "loops, sidings, single line, Tadali paths, tipplers. 5.75 rakes/day, 33.4 h cycle." }],
      [{ text: "Phase 2, crew: ", bold: true }, { text: "crews travel from Balharshah under the 9 h rule. Throughput falls to 4.81; cycle 39.9 h." }],
      [{ text: "Phase 3, BPC: ", bold: true }, { text: "exam detours in daylight only. 4.77 rakes/day, 40.3 h. This is the baseline." }],
    ], 14);
    panel(s, 7.6, 5.2, 5.13, 1.3, "Phase insight panel");
    para(s, 7.85, 5.32, 4.7, 1.1, "The crew clock alone removes almost a rake a day: a first hint that crew timing is a lever.", { fontSize: 14, bold: true, color: C.text1, valign: "middle" });
    s.addNotes("We built in three phases and checked each before adding the next. Adding the crew clock drops throughput by nearly one rake a day, because loaded rakes now wait for a crew that has to travel from Balharshah. That observation is what led to experiment 1.");
  }

  // =========================================================================== 12 V&V
  {
    const s = slide("Data", "Verification and validation", "The model is consistent and matches public benchmarks");
    heading(s, 0.6, 1.6, 5.6, "Verification");
    bullets(s, 0.6, 2.05, 5.6, 4.3, [
      [{ text: "Invariants checked after every event: ", bold: true }, { text: "loop, siding and tippler capacity; single line used one way at a time; crew never past 11 h; no rake lost." }],
      [{ text: "Identical results in AnyLogic and the test harness ", bold: true }, { text: "for the same seed (seed 1: 4.70 rakes/day, 40.5 h)." }],
      [{ text: "Little's law holds: ", bold: true }, { text: "8 rakes ÷ 40.3 h × 24 = 4.77 rakes/day." }],
      [{ text: "Stress-tested ", bold: true }, { text: "over 15 extreme configurations with no violations." }],
    ], 14);
    heading(s, 6.73, 1.6, 6, "Validation");
    table(s, [
      ["Measure", "Benchmark", "Model", "Verdict"],
      ["Mean cycle time", "24–72 h", "40.3 h", good("inside")],
      ["Ghugus terminal detention", "≤ 15–16 h (RB)", "15.5 h", good("inside")],
      ["Rakes/day, today's layout", "6–10 (CEA)", "4.77", bad("below")],
      ["Rakes/day, with 3 changes", "7–8 (Ghugus)", "7.76", good("inside")],
      ["Crew duty expiries", "rare", "0.02 / 100", good("inside")],
      ["Rakes over loading free time", "many, not all", "100%", bad("all")],
    ], 6.73, 2.05, 6.0, [2.45, 1.45, 1.1, 1.0], 0.48, "Validation table");
    para(s, 6.73, 5.55, 6.0, 0.9, "Gaps trace to assumed Ghugus loops and yard times, and to loading time (min 4 h) exceeding the 3 h free time.", { fontSize: 13 });
    s.addNotes("Verification asks whether the model does what we intended; validation asks whether it matches reality. Cycle time, detention and crew behaviour fall inside published ranges. Throughput with today's assumed layout is below the observed 6 to 10; with the three changes it is 7.8, matching Ghugus' reported 7 to 8. Every loading exceeds free time because the published loading range starts above the 3-hour allowance.");
  }

  // =========================================================================== 13 Baseline
  pres.addSection({ title: "Results" });
  {
    const s = slide("Results", "Baseline result", "80% of the cycle is spent at the two terminals");
    const cats = ["Ghugus terminal", "CSTPS terminal", "Empties held at CD", "Crew waits", "Running", "BPC exam detour", "Single-line waits", "Tadali merge"];
    s.addChart(pres.charts.BAR, [{ name: "Hours per cycle", labels: cats, values: [12.69, 11.95, 7.54, 4.44, 1.70, 1.37, 0.44, 0.13] }],
      Object.assign({}, chartBase, { x: 0.6, y: 1.55, w: 7.6, h: 5.0, barDir: "bar", catAxisOrientation: "maxMin", barGapWidthPct: 40,
        chartColors: [HX.amber, HX.amber, HX.amber, HX.steel, HX.grey, HX.grey, HX.grey, HX.grey], showValue: true,
        dataLabelPosition: "outEnd", dataLabelFormatCode: "0.0 \"h\"", valAxisHidden: true, valGridLine: { style: "none" },
        showTitle: true, title: "Mean hours per cycle, baseline (total 40.3 h)", objectName: "Baseline chart" }));
    panel(s, 8.55, 1.6, 4.18, 4.9, "Baseline stats panel");
    stat(s, 8.85, 1.7, 3.7, "32.2 h", C.accent1, "at the terminals (80%)", "Ghugus, CSTPS and empties held at CD");
    stat(s, 8.85, 3.25, 3.7, "4.4 h", C.accent3, "waiting for crews", "travel from the Balharshah lobby");
    stat(s, 8.85, 4.8, 3.7, "0.6 h", C.accent5, "single line + merge", "line 21% busy; Tadali queue 0.03");
    s.addNotes("The baseline breakdown. Amber bars are terminal time: 32 of 40 hours. Crew waiting is another 4.4 hours. The single line and Tadali merge, grey at the bottom, are 0.6 hours. So the experiments target the terminals and crews, and we test the doubling for comparison.");
  }

  // =========================================================================== 14 Experiment inventory
  {
    const s = slide("Results", "Experiment plan", "Every experiment we ran");
    table(s, [
      ["Group", "Factor varied", "Levels", "Cases"],
      [strong("Key experiments"), "crew timing · Ghugus loops · loading method · line doubling", "one change each vs baseline", "5"],
      [strong("2×2×2 factorial"), "crew timing × Ghugus loops × loading method", "all 8 combinations", "8"],
      [strong("Proposal what-ifs"), "single-line dispatch · Tadali slots · exam trigger", "alternate, batch; slot; 0/3/5/7 days", "8"],
      [strong("Fleet size (E1)"), "rakes in the circuit", "4, 6, 8 … 20", "9"],
      [strong("Resource levers (E2–E7)"), "RLS, Chandrapur lobby, doubling, tipplers, loops, crew pool, sidings", "+20% or one unit each", "12"],
      [strong("Assumption sensitivity"), "loops, yard times, CSTPS times, goods trains, lateness, crew pool, controller rule", "one at a time", "11"],
      [strong("Model phases"), "core → + crew → + BPC", "3 phases", "3"],
    ], 0.6, 1.65, 12.13, [2.6, 5.4, 3.13, 1.0], 0.52, "Experiment table");
    panel(s, 0.6, 5.95, 12.13, 0.62, "Experiment method panel");
    s.addText([{ text: "Every case:  ", options: { bold: true, color: C.text1 } },
               { text: "30 replications · 30 days after a 3-day warm-up · same 30 seeds as the baseline (common random numbers) · paired 95% t-interval", options: { color: C.text2 } }],
      { x: 0.85, y: 5.95, w: 11.7, h: 0.62, fontFace: BODY, fontSize: 13, margin: 0, valign: "middle", isTextBox: true, objectName: "Method" });
    s.addNotes("About sixty cases in seven groups, each run 30 times with the same random numbers as the baseline so differences are paired and tight. The key experiments and the factorial are the core of the results; the proposal what-ifs answer the questions we committed to; fleet size, resource levers and assumption sensitivity check how robust the conclusions are.");
  }

  // =========================================================================== 15 Key experiments
  {
    const s = slide("Results", "Key experiments", "Crew timing and a third loop each add a full rake per day");
    s.addChart(pres.charts.BAR, [{ name: "Δ rakes/day", labels: ["1  Crew ordered during loading", "2  Third loop at Ghugus",
      "3  Rapid loading silo", "4  Line doubling (₹228 cr)"], values: [1.00, 1.00, 0.35, 0.11] }],
      Object.assign({}, chartBase, { x: 0.6, y: 1.55, w: 6.2, h: 3.4, barDir: "bar", catAxisOrientation: "maxMin", barGapWidthPct: 45,
        chartColors: [HX.green, HX.green, HX.steel, HX.grey], showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: "+0.00",
        valAxisHidden: true, valGridLine: { style: "none" }, valAxisMinVal: 0, valAxisMaxVal: 1.25, showTitle: true,
        title: "Change in rakes/day vs baseline 4.77", objectName: "Key experiment chart" }));
    table(s, [
      ["Experiment", "Rakes/day", "Δ (95% CI)", "Cycle h", "Demurrage"],
      ["Baseline", "4.77", "—", "40.3", "₹33,300"],
      ["1  Crew during loading", good("5.77"), good("+1.00 ± 0.06"), good("33.3"), "₹33,400"],
      ["2  Third Ghugus loop", good("5.77"), good("+1.00 ± 0.09"), good("33.3"), "₹33,200"],
      ["3  Rapid loading silo", "5.12", "+0.35 ± 0.07", "37.5", good("₹0")],
      ["4  Line doubling", "4.88", "+0.11 ± 0.06", "39.4", "₹33,300"],
    ], 7.0, 1.65, 5.73, [1.8, 0.9, 1.15, 0.73, 1.15], 0.5, "Key experiment table");
    table(s, [
      ["Experiment", "What changed in the model", "What moved (hours per cycle)"],
      ["1  Crew timing", "crew booked when loading starts so it arrives as the rake is ready", "crew wait 4.4 → 1.8; empties held at CD 7.5 → 3.8"],
      ["2  Ghugus loop", "Ghugus loops 2 → 3", "empties held at CD 7.5 → 1.7"],
      ["3  Loading silo", "loading Tri(4, 6, 9) h → Tri(1, 1.5, 3) h", "Ghugus terminal 12.7 → 6.4; but held at CD 7.5 → 10.6"],
      ["4  Doubling", "one line per direction Ghugus–Tadali", "line use 21% → 11%; cycle −0.9"],
    ], 0.6, 5.1, 12.13, [1.9, 5.0, 5.23], 0.31, "Mechanism table");
    s.addNotes("The four headline experiments. Crew timing and the third loop each add one rake a day and cut the cycle by 7 hours, for different reasons: one frees loop space sooner, the other adds space. The loading silo removes all demurrage but gains only a third of a rake because the time saved turns into waiting for a Ghugus loop. Doubling halves line use but the line was not the constraint.");
  }

  // =========================================================================== 16 Factorial
  {
    const s = slide("Results", "2×2×2 factorial", "Combined, the three changes reach 7.76 rakes/day");
    s.addChart(pres.charts.BAR, [{ name: "Rakes/day", labels: ["None", "Silo", "Crew", "Loop", "Crew + loop", "Loop + silo", "Crew + silo", "All three"],
      values: [4.77, 5.12, 5.77, 5.77, 6.37, 6.74, 6.76, 7.76] }],
      Object.assign({}, chartBase, { x: 0.6, y: 1.55, w: 7.8, h: 5.0, barDir: "col", barGapWidthPct: 40,
        chartColors: [HX.grey, HX.steel, HX.steel, HX.steel, HX.green, HX.green, HX.green, HX.amber], showValue: true,
        dataLabelPosition: "outEnd", dataLabelFormatCode: "0.00", valAxisMinVal: 0, valAxisMaxVal: 9, showTitle: true,
        title: "Rakes/day for each combination (30 paired reps, CI ≤ ± 0.07)", objectName: "Factorial chart" }));
    heading(s, 8.75, 1.6, 4, "Estimated effects on rakes/day");
    table(s, [
      ["Effect", "Δ rakes/day"],
      ["Crew during loading", good("+1.07")], ["Third Ghugus loop", good("+1.06")], ["Rapid loading silo", good("+0.92")],
      ["Crew × loop", bad("−0.26")], ["Crew × silo", good("+0.27")], ["Loop × silo", good("+0.25")], ["Crew × loop × silo", "−0.06"],
    ], 8.75, 2.05, 3.98, [2.68, 1.3], 0.4, "Effects table");
    para(s, 8.75, 5.4, 3.98, 1.1, "Crew and loop overlap because both free loop space; the silo pays off once loop space is fixed.", { fontSize: 13 });
    s.addNotes("All eight combinations. Main effects are each about one rake a day. The crew-loop interaction is negative because both address the same bottleneck. The silo interacts positively with both, because once loops are no longer the constraint, faster loading converts directly into throughput. All three together give 7.76 rakes a day.");
  }

  // =========================================================================== 17 Fleet
  {
    const s = slide("Results", "Fleet size (E1)", "More rakes only lengthen the cycle");
    const fl = ["4", "6", "8", "10", "12", "14", "16", "18", "20"];
    s.addChart(pres.charts.LINE, [{ name: "Rakes/day", labels: fl, values: [3.07, 4.30, 4.77, 4.83, 4.80, 4.79, 4.86, 4.87, 4.84] }],
      Object.assign({}, chartBase, { x: 0.6, y: 1.55, w: 6.0, h: 4.6, chartColors: [HX.amber], lineSize: 3, lineDataSymbol: "circle",
        lineDataSymbolSize: 7, showValue: true, dataLabelPosition: "t", dataLabelFormatCode: "0.0", valAxisMinVal: 0, valAxisMaxVal: 6,
        showTitle: true, title: "Rakes/day at CSTPS", showCatAxisTitle: true, catAxisTitle: "rakes in the circuit", objectName: "Fleet throughput chart" }));
    s.addChart(pres.charts.LINE, [{ name: "Mean cycle", labels: fl, values: [31.2, 33.4, 40.3, 49.6, 59.9, 70.0, 79.0, 88.6, 98.9] },
      { name: "P90 cycle", labels: fl, values: [35.5, 38.8, 47.1, 57.7, 69.4, 81.3, 91.8, 103.3, 115.0] }],
      Object.assign({}, chartBase, { x: 6.73, y: 1.55, w: 6.0, h: 4.6, chartColors: [HX.steel, HX.grey], lineSize: 3, lineDataSymbol: "circle",
        lineDataSymbolSize: 6, showLegend: true, legendPos: "b", valAxisMinVal: 0, showTitle: true, title: "Cycle time, hours",
        showCatAxisTitle: true, catAxisTitle: "rakes in the circuit", objectName: "Fleet cycle chart" }));
    source(s, "Throughput saturates at 8 rakes because the Ghugus loops are full; by Little's law extra rakes add only waiting time.");
    s.addNotes("Fleet size from 4 to 20 rakes. Throughput saturates at about 4.8 rakes a day from 8 rakes on; every extra rake just queues, so mean and 90th-percentile cycle times climb in a straight line to 99 and 115 hours at 20 rakes. More rakes are not a lever until the Ghugus bottleneck is removed.");
  }

  // =========================================================================== 18 Proposal what-ifs
  {
    const s = slide("Results", "Proposal what-ifs", "Results for the seven scenarios we committed to");
    table(s, [
      ["#", "Scenario from the proposal", "Rakes/day", "Δ vs base", "Cycle mean / P90", "Finding"],
      ["1", "Base case: loaded first, crew when ready", "4.77", "—", "40.3 / 47.1 h", "reference"],
      ["2", "Dispatch: alternating / batches of 3", "4.77", "0.00", "40.3 / 47.1 h", "no effect: line 21% busy"],
      ["3", "Tadali: reserved path vs take gaps", "4.78", "+0.01", "40.2 / 47.1 h", "no effect: merge wait 0.13 h"],
      ["4", "Crew booked during loading", good("5.77"), good("+1.00"), good("33.3 / 38.3 h"), good("largest free gain")],
      ["5", "Exam trigger at expiry / 3 / 5 / 7 days", "4.80–4.75", "± 0.03", "≈ 40 / 47 h", "exam h/rake/month 23 → 30"],
      ["6", "Fleet size 8 → 20 rakes", "4.77–4.87", "≤ +0.10", "40 → 99 h", "throughput flat"],
      ["7", "Line doubling vs best policy", "4.88 / 5.78", "+0.11 / +1.01", "39.4 / 33.2 h", "policy beats track"],
    ], 0.6, 1.65, 12.13, [0.45, 3.8, 1.35, 1.35, 1.75, 3.43], 0.55, "Proposal table");
    source(s, "Scenario 7: 'best policy' = crew booked during loading; with doubling added it reaches 5.78 rakes/day (+1.01), i.e. doubling adds nothing on top.");
    s.addNotes("Each scenario promised in our proposal, with its result. Dispatch rules and reserved Tadali paths do nothing because neither the line nor the merge is congested. Exam timing does not change throughput but sending rakes early wastes exam hours. Fleet size is flat. And for scenario 7, the best operating policy alone outperforms the doubling, and adding doubling to it gives no further gain.");
  }

  // =========================================================================== 19 Sensitivity
  {
    const s = slide("Results", "Sensitivity", "Which assumptions the answer depends on");
    const lab = ["Ghugus loops 2 → 3 (A-01)", "Ghugus yard times halved (A-13/14)", "Loading sidings 2 → 3", "Crew lobby at Chandrapur (A-06)",
      "CSTPS handling halved (A-15/16)", "Through goods 20 → 40/day (A-24)", "Passenger lateness doubled (A-21)", "Crew pool 16 → 10 (A-25)",
      "No duty extension (CR-02)", "Empties not held at CD (A-27)", "Tadali loops 2 → 3 (A-02)"];
    s.addChart(pres.charts.BAR, [{ name: "Δ rakes/day", labels: lab, values: [1.00, 0.73, 0.39, 0.37, 0.04, 0.03, 0.00, 0.00, -0.01, -0.21, -0.23] }],
      Object.assign({}, chartBase, { x: 0.6, y: 1.55, w: 8.1, h: 5.0, barDir: "bar", catAxisOrientation: "maxMin", barGapWidthPct: 35,
        chartColors: [HX.green, HX.green, HX.green, HX.green, HX.grey, HX.grey, HX.grey, HX.grey, HX.grey, HX.red, HX.red],
        showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: "+0.00;-0.00;0.00", valAxisMinVal: -0.4, valAxisMaxVal: 1.2,
        catAxisLabelFontSize: 11, catAxisLabelPos: "low", showTitle: true, title: "Change in rakes/day when one assumption changes", objectName: "Sensitivity chart" }));
    panel(s, 9.0, 1.6, 3.73, 4.9, "Sensitivity panel");
    heading(s, 9.25, 1.75, 3.3, "Reading this chart");
    bullets(s, 9.25, 2.2, 3.3, 4.2, [
      [{ text: "Ghugus layout and yard times ", bold: true }, { text: "move the answer most: collect these first." }],
      [{ text: "Main-line traffic and lateness ", bold: true }, { text: "barely matter: the merge is not binding." }],
      [{ text: "A third Tadali loop hurts: ", bold: true }, { text: "it lets more empties crowd the Ghugus loops." }],
    ], 13);
    s.addNotes("One assumption changed at a time. The answer is most sensitive to Ghugus: its loop count and its yard handling times. Main-line traffic, passenger lateness and crew pool size hardly matter. Two changes reduce throughput: dropping the rule that holds empties at Chandrapur, and a third Tadali loop, both of which let more empties crowd Ghugus. This ranking tells the railway which field data to collect first.");
  }

  // =========================================================================== 20 Scorecard
  {
    const s = slide("Results", "Scorecard", "Today vs the recommended package vs doubling");
    table(s, [
      ["KPI", "Today", "Crew + loop + silo", "Change", "Doubling only"],
      [strong("Rakes/day to CSTPS"), "4.77", good("7.76"), good("+63%"), "4.88 (+2%)"],
      [strong("Coal delivered, t/day"), "19,000", good("31,000"), good("+12,000 t"), "19,500"],
      [strong("Mean rake cycle"), "40.3 h", good("24.7 h"), good("−39%"), "39.4 h"],
      [strong("P90 rake cycle"), "47.1 h", good("28.6 h"), good("−39%"), "45.9 h"],
      [strong("Demurrage per rake"), "₹33,300", good("₹0"), good("−100%"), "₹33,300"],
      [strong("CSTPS stock, lowest"), "5.0 days", good("10.4 days"), good("× 2"), "5.4 days"],
      [strong("Single-line utilisation"), "21%", "34%", "still low", "11%"],
      [strong("Crew expiries / 100 trips"), "0.02", good("0"), "rule kept", "0.01"],
    ], 0.6, 1.65, 12.13, [3.3, 1.9, 2.5, 2.0, 2.43], 0.52, "Scorecard table");
    source(s, "30 paired replications per column; 95% CI on rakes/day ≤ ± 0.06.");
    s.addNotes("The scorecard against every KPI we defined. The recommended package raises coal delivered by 12,000 tonnes a day, cuts mean and 90th-percentile cycle by 39 percent, removes demurrage and doubles the plant's lowest stock. Even then the single line is only 34 percent busy. The doubling alone changes almost nothing for today's circuit.");
  }

  // =========================================================================== 21 Recommendations
  pres.addSection({ title: "Conclusion" });
  {
    const s = slide("Conclusion", "Recommendations", "What to do, in order of cost");
    const rec = [
      ["Book crews when loading starts", "free · +1.0 rake/day · −7 h cycle", C.accent2],
      ["Add a third loop at Ghugus", "small yard work · +1.0 rake/day (with 1: +1.6)", C.accent2],
      ["Install a rapid loading silo", "removes ₹33,300 demurrage per rake · all three: +3.0 rakes/day", C.accent2],
      ["Treat the doubling as a growth project", "+0.11 rake/day for today's traffic", C.accent1],
      ["Keep the fleet at 8; examine rakes near expiry", "more rakes or early exams only add waiting", C.accent5],
    ];
    rec.forEach(([h, t, c], i) => {
      num(s, 0.6, 1.7 + i * 0.95, i + 1, c);
      s.addText(h, { x: 1.2, y: 1.62 + i * 0.95, w: 6.0, h: 0.38, fontFace: BODY, fontSize: 16, bold: true, color: C.text1, margin: 0,
        valign: "middle", isTextBox: true, objectName: "Recommendation" });
      para(s, 1.2, 2.0 + i * 0.95, 6.0, 0.4, t, { fontSize: 13 });
    });
    panel(s, 7.6, 1.6, 5.13, 3.3, "Limitations panel");
    heading(s, 7.85, 1.75, 4.7, "Limitations and next steps", C.accent4);
    bullets(s, 7.85, 2.2, 4.7, 4.2, [
      [{ text: "Assumed layout: ", bold: true }, { text: "Ghugus loops and yard times drive the result; confirm with Central Railway." }],
      [{ text: "Dispatcher rule: ", bold: true }, { text: "empties held at Chandrapur (A-27) is our assumption." }],
      [{ text: "Closed circuit only: ", bold: true }, { text: "other traffic that would use a doubled line is not modelled." }],
      [{ text: "Next: ", bold: true }, { text: "fit distributions to CR / WCL rake logs using the ready templates; rerun." }],
    ], 13);
    s.addNotes("Recommendations, cheapest first. Change crew booking; add a loop at Ghugus; then a rapid loading silo. Treat the doubling as a project for future traffic. Keep the fleet at eight and examine rakes close to expiry. The main limitation is that the Ghugus layout and yard times are assumptions; collecting those is the next step, and the model is ready to take the data.");
  }

  // =========================================================================== 22 Close
  {
    const s = pres.addSlide({ masterName: "DARK", sectionTitle: "Conclusion" });
    s.addText("Fix the terminals before the track", { placeholder: "title" });
    s.addText("Three changes at Ghugus deliver 63% more coal per day and a 39% shorter cycle; the ₹228 crore doubling adds 2%.", { placeholder: "body" });
    s.addText("Thank you · Questions", { x: 0.8, y: 6.3, w: 7, h: 0.4, fontFace: BODY, fontSize: 16, bold: true, color: C.accent1, margin: 0,
      isTextBox: true, objectName: "Close" });
    const st = [["+1.00", "crew booked during loading"], ["+1.00", "third Ghugus loop"], ["7.76", "rakes/day with all three"]];
    st.forEach(([b, l], i) => {
      s.addText(b, { x: 8.9, y: 1.7 + i * 1.45, w: 4, h: 0.7, fontFace: HEAD, fontSize: 32, bold: true, color: C.accent1, margin: 0,
        valign: "bottom", isTextBox: true, objectName: "Close stat" });
      s.addText(l, { x: 8.9, y: 2.42 + i * 1.45, w: 4, h: 0.35, fontFace: BODY, fontSize: 14, color: C.background2, margin: 0,
        isTextBox: true, objectName: "Close stat label" });
    });
    s.addNotes("To close: the delay in this coal circuit is at the terminals. Fixing crew booking, Ghugus loop space and loading speed delivers far more than new track. Thank you; happy to take questions, and the model, data and scripts are all in the submission.");
  }

  await pres.writeFile({ fileName: OUT });
  try { const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js"); await applyTheme(OUT, THEME); }
  catch (e) { console.log("theme not applied (" + e.message + ")"); }
  console.log("wrote " + OUT);
}
build();
