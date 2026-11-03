// RakeFlow simulator page. Plays back model runs recorded by build_data.py and shows their 30-replication results.
(function () {
  "use strict";
  const R = window.RF_RESULTS;
  const SVG = "http://www.w3.org/2000/svg";
  const map = document.getElementById("map");

  // ---------- experiments and parameters ----------
  const EXP = {
    base: { name: "Baseline", f: 8, l: 2, c: 0, r: 0, d: 0 },
    A: { name: "A · Crew during loading", f: 8, l: 2, c: 1, r: 0, d: 0 },
    B: { name: "B · Third Ghugus loop", f: 8, l: 3, c: 0, r: 0, d: 0 },
    C: { name: "C · Loading silo", f: 8, l: 2, c: 0, r: 1, d: 0 },
    D: { name: "D · Line doubling", f: 8, l: 2, c: 0, r: 0, d: 1 },
    E: { name: "E · A + B + C", f: 8, l: 3, c: 1, r: 1, d: 0 },
  };
  const P = { f: 8, l: 2, c: 0, r: 0, d: 0 };
  const key = (p) => `f${p.f}_l${p.l}_c${p.c}_r${p.r}_d${p.d}`;
  const BASEKEY = key(EXP.base);

  // ---------- geometry (SVG units) ----------
  const YS = 230, XS0 = 290, XS1 = 650;            // single line
  const XDN = 840, XUP = 880, YTAE = 230, YCD = 520; // main line
  const PX_PER_H_PAX = 1970;                        // ~80 km/h on screen scale
  const PH = { SPUR_L: 6, MAIN_L: 8, UNLOAD: 11, WAIT_TIP: 10, MAIN_E: 15, SPUR_E: 17 };
  const L = { GGS: 0, SPUR: 1, TAE: 2, MAIN: 3, CD: 4, DEPOT: 5 };

  // ---------- state ----------
  let trace = null, byRake = [], deliveries = [], trains = [[], []];
  let T = 72, speed = 1, playing = true, lastTs = null;
  const rakeEls = [], trainEls = [];

  function el(tag, attrs, parent) {
    const e = document.createElementNS(SVG, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    (parent || map).appendChild(e);
    return e;
  }
  function text(x, y, s, cls, anchor) {
    const t = el("text", { x, y, class: cls || "lbl", "text-anchor": anchor || "start" });
    t.textContent = s;
    return t;
  }
  function track(x1, y1, x2, y2, w) { el("line", { x1, y1, x2, y2, stroke: "#A9B1BA", "stroke-width": w || 3, "stroke-linecap": "round" }); }

  // ---------- static map ----------
  function drawMap() {
    map.innerHTML = "";
    const st = el("style", {});
    st.textContent = ".lbl{font:600 16px Calibri,Segoe UI,Arial,sans-serif;fill:#3B4550}.sm{font:14px Calibri,Segoe UI,Arial,sans-serif;fill:#6B7785}" +
      ".ttl{font:700 17px Calibri,Segoe UI,Arial,sans-serif;fill:#1E2328}.rk{font:700 10px Arial,sans-serif;fill:#fff}";
    // Ghugus
    el("rect", { x: 30, y: 70, width: 240, height: 280, rx: 8, fill: "#F5F6F7", stroke: "#E1E4E8" });
    text(45, 92, "Ghugus · WCL coal sidings", "ttl");
    text(45, 112, trace && P.r ? "Loading: rapid silo" : "Loading: pay-loader / CHP", "sm");
    for (let k = 0; k < 2; k++) { track(60, 135 + k * 32, 240, 135 + k * 32, 3); text(60, 128 + k * 32, `Siding ${k + 1}`, "sm"); }
    for (let k = 0; k < P.l; k++) { track(60, 260 + k * 30, 250, 260 + k * 30, 3); }
    text(60, 252, `Loops (${P.l})`, "sm");
    for (let k = 0; k < P.l; k++) track(250, 260 + k * 30, XS0, YS, 2);
    track(240, 135, XS0, YS, 2); track(240, 167, XS0, YS, 2);
    // single line
    track(XS0, YS, XDN, YS, 4);
    if (P.d) track(XS0, YS + 16, XS1, YS + 16, 4), track(XS1, YS + 16, XDN, YS, 2);
    text((XS0 + XS1) / 2, YS + (P.d ? 44 : 28), P.d ? "Ghugus–Tadali · doubled · 14 km" : "Ghugus–Tadali · single line · 14 km", "lbl", "middle");
    // Tadali
    text(725, 150, "Tadali", "ttl", "middle");
    for (let k = 0; k < 2; k++) { track(665, 176 + k * 24, 790, 176 + k * 24, 3); }
    track(XS1, YS, 665, 176, 2); track(XS1, YS, 665, 200, 2); track(790, 176, XDN, YS, 2); track(790, 200, XDN, YS, 2);
    text(725, 168, "Loops (2)", "sm", "middle");
    // main line
    track(XDN, 40, XDN, 610, 4); track(XUP, 40, XUP, 610, 4);
    text(860, 30, "Wardha", "sm", "middle"); text(860, 630, "Balharshah", "sm", "middle");
    text(XUP + 14, 84, "Main line", "lbl"); text(XUP + 14, 100, "DN ↓ · UP ↑", "sm");
    text(XUP + 14, YTAE + 4, "Tadali jn", "sm"); text(XDN - 6, YCD - 8, "Chandrapur", "sm", "end");
    // CSTPS
    el("rect", { x: 400, y: 440, width: 345, height: 175, rx: 8, fill: "#F5F6F7", stroke: "#E1E4E8" });
    text(415, 462, "Chandrapur power station (CSTPS)", "ttl");
    track(745, YCD, XDN, YCD, 2);
    text(415, 556, "Tipplers", "sm");
    for (let k = 0; k < 5; k++) {
      el("rect", { x: 440 + k * 58, y: 565, width: 52, height: 30, rx: 4, fill: k < 4 ? "#FFFFFF" : "#E1E4E8", stroke: "#C9CED4" });
      if (k === 4) text(466 + k * 58, 584, "spare", "sm", "middle");
    }
    // depot
    el("rect", { x: 920, y: 470, width: 165, height: 145, rx: 8, fill: "#F5F6F7", stroke: "#E1E4E8" });
    text(935, 492, "Balharshah depot", "ttl"); text(935, 508, "brake (BPC) exam", "sm");
    // dynamic layers
    const gT = el("g", { id: "trains" }), gR = el("g", { id: "rakes" });
    trainEls.length = 0; rakeEls.length = 0;
    for (let i = 0; i < 12; i++) trainEls.push(el("rect", { width: 10, height: 34, rx: 2, fill: "#4A6FA5", visibility: "hidden" }, gT));
    const n = trace ? trace.rakes : 0;
    for (let i = 0; i < n; i++) {
      const g = el("g", {}, gR);
      const r = el("rect", { x: -23, y: -6, width: 46, height: 12, rx: 2 }, g);
      const t = el("text", { x: 0, y: 3.5, class: "rk", "text-anchor": "middle" }, g); t.textContent = i + 1;
      rakeEls.push({ g, r, t });
    }
  }

  // ---------- trace handling ----------
  function prepare(tr) {
    trace = tr;
    byRake = Array.from({ length: tr.rakes }, () => []);
    deliveries = [];
    for (const e of tr.ev) {
      const s = { t: e[0], p: e[2], end: e[3], loaded: e[4], loc: e[5], sid: e[6], tip: e[7] };
      byRake[e[1] - 1].push(s);
      if (s.p === PH.UNLOAD) deliveries.push(s.t);   // every delivered rake is tippled once
    }
    trains = [[], []];
    for (const x of tr.trains) trains[x[1]].push(x);
    trains.forEach((a) => a.sort((u, v) => u[0] - v[0]));
  }
  function stateAt(list, t) {
    let lo = 0, hi = list.length - 1, ans = 0;
    while (lo <= hi) { const m = (lo + hi) >> 1; if (list[m].t <= t) { ans = m; lo = m + 1; } else hi = m - 1; }
    return list[ans];
  }
  const lerp = (a, b, u) => a + (b - a) * Math.max(0, Math.min(1, u));

  function render() {
    if (!trace) return;
    const slots = {};
    const pos = [];
    for (let i = 0; i < byRake.length; i++) {
      const s = stateAt(byRake[i], T);
      const u = s.end > s.t ? (T - s.t) / (s.end - s.t) : 0;
      let x, y, vertical = false;
      if (s.p === PH.SPUR_L) { x = lerp(XS0, XS1, u); y = YS; }
      else if (s.p === PH.SPUR_E) { x = lerp(XS1, XS0, u); y = P.d ? YS + 16 : YS; }
      else if (s.p === PH.MAIN_L) { x = XDN; y = lerp(YTAE, YCD, u); vertical = true; }
      else if (s.p === PH.MAIN_E) { x = XUP; y = lerp(YCD, YTAE, u); vertical = true; }
      else if (s.p === PH.UNLOAD && s.tip >= 0) { x = 466 + s.tip * 58; y = 580; }
      else {
        let area = s.loc === L.GGS ? (s.sid >= 0 ? "sid" + s.sid : "ggs") : s.loc === L.TAE ? "tae" : s.loc === L.DEPOT ? "dep" : s.loc === L.SPUR ? "spur" : "cd";
        const k = (slots[area] = (slots[area] || 0) + 1) - 1;
        if (area.startsWith("sid")) { x = 150; y = 135 + Number(area.slice(3)) * 32; }
        else if (area === "ggs") { x = 155 - Math.floor(k / P.l) * 52; y = 260 + (k % P.l) * 30; }
        else if (area === "tae") { x = 727; y = 176 + (k % 2) * 24 - Math.floor(k / 2) * 14; }
        else if (area === "dep") { x = 965 + (k % 2) * 60; y = 535 + Math.floor(k / 2) * 22; }
        else if (area === "spur") { x = (XS0 + XS1) / 2; y = YS; }
        else { x = 440 + (k % 6) * 52; y = 488 + Math.floor(k / 6) * 24; }
      }
      pos.push([x, y, vertical, s.loaded]);
    }
    pos.forEach(([x, y, v, loaded], i) => {
      const e = rakeEls[i];
      e.g.setAttribute("transform", `translate(${x.toFixed(1)},${y.toFixed(1)})${v ? " rotate(90)" : ""}`);
      e.r.setAttribute("fill", loaded ? "#1E2328" : "#C98A2B");
    });
    // main-line trains
    let n = 0;
    for (let d = 0; d < 2; d++) {
      const a = trains[d];
      let lo = 0, hi = a.length;
      while (lo < hi) { const m = (lo + hi) >> 1; if (a[m][0] < T - 0.35) lo = m + 1; else hi = m; }
      for (let i = lo; i < a.length && a[i][0] < T + 0.35 && n < trainEls.length; i++) {
        const dt = T - a[i][0];
        const y = d === 0 ? YTAE + dt * PX_PER_H_PAX : YCD - dt * PX_PER_H_PAX;
        if (y < 40 || y > 610) continue;
        const e = trainEls[n++];
        e.setAttribute("x", (d === 0 ? XDN : XUP) - 5); e.setAttribute("y", y - 17);
        e.setAttribute("fill", a[i][2] === 0 ? "#4A6FA5" : "#8A96A3"); e.setAttribute("visibility", "visible");
      }
    }
    for (; n < trainEls.length; n++) trainEls[n].setAttribute("visibility", "hidden");
    // live counters
    const day = Math.floor(T / 24) + 1, hh = Math.floor(T % 24), mm = Math.floor((T * 60) % 60);
    document.getElementById("clock").textContent = `Day ${day} · ${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
    let del = 0; for (const t of deliveries) if (t >= trace.warmup && t <= T) del++;
    document.getElementById("delivered").textContent = del;
    const span = (T - trace.warmup) / 24;
    document.getElementById("rateLive").textContent = span > 0.5 ? (del / span).toFixed(2) : "–";
  }

  function frame(ts) {
    if (lastTs !== null && playing && trace) {
      T += speed * (ts - lastTs) / 1000;
      if (T > trace.days * 24) T = trace.warmup;
      render();
    }
    lastTs = ts;
    requestAnimationFrame(frame);
  }

  // ---------- results panel ----------
  const fmt = (v, d) => v.toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d });
  function showResults() {
    const r = R[key(P)], b = R[BASEKEY];
    document.getElementById("rRate").textContent = fmt(r.rakesPerDay[0], 2);
    const dl = document.getElementById("rRateDelta");
    if (key(P) === BASEKEY) { dl.textContent = "Baseline (today's operation)"; dl.className = "delta flat"; }
    else {
      const d = r.delta_rakesPerDay;
      dl.textContent = `${d[0] >= 0 ? "+" : "−"}${fmt(Math.abs(d[0]), 2)} ± ${fmt(d[1], 2)} vs baseline ${fmt(b.rakesPerDay[0], 2)}`;
      dl.className = "delta " + (Math.abs(d[0]) <= d[1] ? "flat" : d[0] > 0 ? "up" : "down");
    }
    document.getElementById("rTonnes").textContent = fmt(Math.round(r.tonnesPerDay[0] / 100) * 100, 0) + " t/day";
    document.getElementById("rCycle").textContent = fmt(r.meanCycle_h[0], 1) + " h";
    document.getElementById("rP90").textContent = fmt(r.p90Cycle_h[0], 1) + " h";
    document.getElementById("rDem").textContent = "₹" + fmt(Math.round(r.demurrageRsPerRake[0] / 100) * 100, 0);
    document.getElementById("rLine").textContent = Math.round(r.lineUtil[0] * 100) + "%";
    document.getElementById("rStock").textContent = fmt(r.stockMinDays[0], 1) + " days";
    const G = (x, ks) => ks.reduce((s, k) => s + x[k][0], 0);
    const rows = [
      ["Ghugus terminal", ["Ghugus_terminal"], ""], ["CSTPS terminal", ["CSTPS_terminal"], ""],
      ["Held at Chandrapur", ["UP_path_at_CD"], ""], ["Crew waits", ["Crew_waits"], "alt"],
      ["Running", ["Running"], "low"], ["BPC exam", ["BPC_detour", "Crew_relief"], "low"],
      ["Single line + Tadali", ["Single-line_waits", "Tadali_DN_merge"], "low"],
    ];
    const max = 30;
    document.getElementById("bars").innerHTML = rows.map(([n, ks, c]) => {
      const v = G(r, ks), bv = G(b, ks);
      return `<div class="bar"><span class="name">${n}</span><span class="track"><span class="fill ${c}" style="width:${Math.min(100, v / max * 100)}%;display:block"></span>` +
        `<span class="base" style="left:${Math.min(100, bv / max * 100)}%"></span></span><span class="val">${fmt(v, 1)} h</span></div>`;
    }).join("") + `<div class="barnote">Hours per cycle · black tick = baseline · total ${fmt(r.meanCycle_h[0], 1)} h</div>`;
    const tb = document.querySelector("#compare tbody");
    tb.innerHTML = Object.entries(EXP).map(([id, e]) => {
      const x = R[key(e)];
      return `<tr data-exp="${id}" class="${key(e) === key(P) ? "on" : ""}"><td>${e.name}</td><td>${fmt(x.rakesPerDay[0], 2)}</td><td>${fmt(x.meanCycle_h[0], 1)} h</td></tr>`;
    }).join("");
    tb.querySelectorAll("tr").forEach((tr) => tr.addEventListener("click", () => setExp(tr.dataset.exp)));
  }

  // ---------- controls ----------
  function syncButtons() {
    document.querySelectorAll(".seg[data-param]").forEach((s) => s.querySelectorAll("button").forEach((b) =>
      b.classList.toggle("on", Number(b.dataset.v) === P[s.dataset.param])));
    const k = key(P);
    document.querySelectorAll("#experiments button").forEach((b) => b.classList.toggle("on", key(EXP[b.dataset.exp]) === k));
    document.querySelectorAll("#speed button").forEach((b) => b.classList.toggle("on", Number(b.dataset.v) === speed));
  }
  function load() {
    const k = key(P);
    syncButtons(); showResults();
    const go = () => { prepare(window.RF_TRACE[k]); drawMap(); T = trace.warmup; render(); };
    if (window.RF_TRACE && window.RF_TRACE[k]) return go();
    const s = document.createElement("script");
    s.src = `data/trace_${k}.js`; s.onload = go;
    document.body.appendChild(s);
  }
  function setExp(id) { Object.assign(P, EXP[id]); delete P.name; load(); }

  document.querySelectorAll("#experiments button").forEach((b) => b.addEventListener("click", () => setExp(b.dataset.exp)));
  document.querySelectorAll(".seg[data-param]").forEach((s) => s.querySelectorAll("button").forEach((b) =>
    b.addEventListener("click", () => { P[s.dataset.param] = Number(b.dataset.v); load(); })));
  document.querySelectorAll("#speed button").forEach((b) => b.addEventListener("click", () => { speed = Number(b.dataset.v); syncButtons(); }));
  const playBtn = document.getElementById("play");
  playBtn.addEventListener("click", () => { playing = !playing; playBtn.textContent = playing ? "Pause" : "Play"; });
  document.getElementById("restart").addEventListener("click", () => { if (trace) { T = trace.warmup; render(); } });

  setExp("base");
  requestAnimationFrame(frame);
})();
