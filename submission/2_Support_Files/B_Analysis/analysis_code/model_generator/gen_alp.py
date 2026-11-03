"""Generate model/RakeFlow/RakeFlow.alp (AnyLogic 8.9.9) from kernel.java + params.py.

XML element shapes follow AnyLogic 8.9.9 project files (the same version that wrote the team's
lab models); the output is then read back and re-written by AnyLogic's own ObjectModelSerializer
(model/build/roundtrip) to make sure the IDE accepts it.
"""
import os
from xml.sax.saxutils import escape

from kernel_parse import parse_kernel, timetable_java
from params import GROUPS, PARAMS

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(os.path.dirname(HERE), "RakeFlow")
OUT = os.path.join(OUT_DIR, "RakeFlow.alp")

START_MS = 1791138600000          # 2026-10-05 00:00 IST (Monday), epoch ms as AnyLogic stores model start date
MAX_RAKES = 16
_id = [1791000000000]


def nid():
    _id[0] += 1
    return _id[0]


def cdata(s):
    return "<![CDATA[" + s.replace("]]>", "]]]]><![CDATA[>") + "]]>"


def color(r, g, b, a=255):
    v = (a << 24) | (r << 16) | (g << 8) | b
    return v - (1 << 32) if v >= (1 << 31) else v


BLACK = color(0, 0, 0)
DARK = color(40, 40, 40)
GREY = color(150, 150, 150)
LIGHT = color(242, 242, 238)
PANEL = color(250, 250, 246)
NAVY = color(25, 55, 110)
RED = color(190, 40, 40)
WHITE = color(255, 255, 255)
TRACK = color(70, 70, 70)
BLUE = color(30, 90, 200)

MAIN_ID = nid()
LEVEL_ID = nid()

# --------------------------------------------------------------------------- shapes

def common(name, x, y, draw="SHAPE_DRAW_2D", label=(10, 0)):
    return (f"<Id>{nid()}</Id>\n<Name>{cdata(name)}</Name>\n<X>{x}</X><Y>{y}</Y>\n"
            f"<Label><X>{label[0]}</X><Y>{label[1]}</Y></Label>\n<PublicFlag>true</PublicFlag>\n"
            f"<PresentationFlag>true</PresentationFlag>\n<ShowLabel>false</ShowLabel>\n<DrawMode>{draw}</DrawMode>\n"
            f"<EmbeddedIcon>false</EmbeddedIcon>\n<Z>0</Z>\n")


def dyn(**codes):
    out = ""
    for k, v in codes.items():
        if v is not None:
            out += f"<{k}>{cdata(v)}</{k}>\n"
    return out


def rect(name, x, y, w, h, fill=LIGHT, line=GREY, lw=1, **codes):
    linec = f"<LineColor>{line}</LineColor>" if line is not None else "<LineColor/>"
    fillc = f"<FillColor>{fill}</FillColor>" if fill is not None else "<FillColor/>"
    return (f"<Rectangle>\n{common(name, x, y)}<ZHeight>10</ZHeight>\n<LineWidth>{lw}</LineWidth>\n{linec}\n"
            f"<LineMaterial>null</LineMaterial>\n<LineStyle>SOLID</LineStyle>\n<Width>{w}</Width>\n<Height>{h}</Height>\n"
            f"<Rotation>0.0</Rotation>\n{fillc}\n<FillMaterial>null</FillMaterial>\n{dyn(**codes)}</Rectangle>\n")


def line(name, x, y, dx, dy, col=TRACK, lw=3, style="SOLID", **codes):
    return (f"<Line>\n{common(name, x, y)}<ZHeight>10</ZHeight>\n<LineWidth>{lw}</LineWidth>\n<LineColor>{col}</LineColor>\n"
            f"<LineMaterial>null</LineMaterial>\n<LineStyle>{style}</LineStyle>\n<BeginArrowSize>1</BeginArrowSize>\n"
            f"<BeginArrowStyle>0</BeginArrowStyle>\n<EndArrowSize>1</EndArrowSize>\n<EndArrowStyle>0</EndArrowStyle>\n"
            f"<Dx>{dx}</Dx>\n<Dy>{dy}</Dy>\n<Dz>0</Dz>\n{dyn(**codes)}</Line>\n")


def oval(name, x, y, r, fill=BLUE, **codes):
    return (f"<Oval>\n{common(name, x, y, label=(0, 0))}<ZHeight>10</ZHeight>\n<LineWidth>1</LineWidth>\n<LineColor/>\n"
            f"<LineMaterial>null</LineMaterial>\n<LineStyle>SOLID</LineStyle>\n<RadiusX>{r}</RadiusX>\n<RadiusY>{r}</RadiusY>\n"
            f"<Rotation>0.0</Rotation>\n<FillColor>{fill}</FillColor>\n<FillMaterial>null</FillMaterial>\n{dyn(**codes)}</Oval>\n")


def text(name, x, y, s, size=12, bold=False, col=DARK, font="SansSerif", align="LEFT", **codes):
    return (f"<Text>\n{common(name, x, y, label=(0, -10))}<Rotation>0.0</Rotation>\n<Color>{col}</Color>\n"
            f"<Text>{cdata(s)}</Text>\n{dyn(**codes)}<Font>\n<Name>{font}</Name>\n<Size>{size}</Size>\n"
            f"<Style>{1 if bold else 0}</Style>\n</Font>\n<Alignment>{align}</Alignment>\n</Text>\n")


def recurrence(minutes=60):
    return (f"<RecurrenceProperties>\n<Id>{nid()}</Id>\n<OccurrenceAtTime>true</OccurrenceAtTime>\n"
            f"<OccurrenceDate>{START_MS}</OccurrenceDate>\n<OccurrenceTime Class=\"CodeUnitValue\">\n<Code>{cdata('0')}</Code>\n"
            f"<Unit Class=\"TimeUnits\">{cdata('HOUR')}</Unit>\n</OccurrenceTime>\n<RecurrenceCode Class=\"CodeUnitValue\">\n"
            f"<Code>{cdata(str(minutes))}</Code>\n<Unit Class=\"TimeUnits\">{cdata('MINUTE')}</Unit>\n</RecurrenceCode>\n"
            f"</RecurrenceProperties>\n")


def chart_common(name, x, y, w, h, legend="SOUTH", legend_size=40, area_h=None):
    # AnyLogic engine rule (com.anylogic.engine.analysis.Chart): with a NORTH/SOUTH legend the plot area must fit in
    # height - legendSize, with EAST/WEST in width - legendSize; otherwise "Chart picture must be located within the chart area".
    xo, yo = 60, 30
    aw = w - 90
    ah = area_h if area_h is not None else h - 100
    avail_w = w - (legend_size if legend in ("EAST", "WEST") else 0)
    avail_h = h - (legend_size if legend in ("NORTH", "SOUTH") else 0)
    assert legend_size < (h if legend in ("NORTH", "SOUTH") else w), name
    assert xo + aw <= avail_w and yo + ah <= avail_h, f"chart {name}: plot area does not fit inside the chart"
    return (f"{common(name, x, y, draw='SHAPE_DRAW_2D3D', label=(0, -10))}<AutoUpdate>true</AutoUpdate>\n{recurrence(60)}"
            f"<EmbeddedIcon>false</EmbeddedIcon>\n<Width>{w}</Width>\n<Height>{h}</Height>\n<BackgroundColor/>\n<BorderColor/>\n"
            f"<ChartArea>\n<XOffset>{xo}</XOffset>\n<YOffset>{yo}</YOffset>\n<Width>{aw}</Width>\n<Height>{ah}</Height>\n"
            f"<BackgroundColor>-1</BackgroundColor>\n<BorderColor>-16777216</BorderColor>\n<GridColor>-12566464</GridColor>\n"
            f"</ChartArea>\n<Legend>\n<Place>{legend}</Place>\n<TextColor>-16777216</TextColor>\n<Size>{legend_size}</Size>\n</Legend>\n"
            f"<Labels>\n<HorLabelsPosition>DEFAULT</HorLabelsPosition>\n<VerLabelsPosition>DEFAULT</VerLabelsPosition>\n"
            f"<TextColor>-12566464</TextColor>\n</Labels>\n<ShowLegend>true</ShowLegend>\n")


def timeplot(name, x, y, w, h, items, window_h=24 * 33):
    body = chart_common(name, x, y, w, h)
    body += ("<TimeWindowsMovementType>MOVEMENT_WITH_TIME</TimeWindowsMovementType>\n"
             "<TimeWindowUnits>MODEL_TIME_UNIT</TimeWindowUnits>\n"
             f"<VerScaleFromExpression>{cdata('0')}</VerScaleFromExpression>\n<VerScaleToExpression>{cdata('1')}</VerScaleToExpression>\n"
             "<VerScaleType>AUTO</VerScaleType>\n<DrawLine>true</DrawLine>\n<Interpolation>LINEAR</Interpolation>\n")
    for title, ds, expr, col in items:
        body += (f"<DatasetExpression>\n<Title>{cdata(title)}</Title>\n<Id>{nid()}</Id>\n<Expression>{cdata(ds)}</Expression>\n"
                 f"<Color>{col}</Color>\n<Expression2>{cdata(expr)}</Expression2>\n<Expression2Flag>true</Expression2Flag>\n"
                 f"<PointStyle>NONE</PointStyle>\n<LineWidth>2.0</LineWidth>\n</DatasetExpression>\n")
    body += (f"<SamplesToKeep>2000</SamplesToKeep>\n<TimeWindowExpression>{cdata(str(window_h))}</TimeWindowExpression>\n"
             "<FillAreaUnderLine>false</FillAreaUnderLine>\n<LabelFormat>MODEL_TIME_UNITS</LabelFormat>\n")
    return f"<TimePlot>\n{body}</TimePlot>\n"


def barchart(name, x, y, w, h, items):
    body = chart_common(name, x, y, w, h, legend="SOUTH", legend_size=150, area_h=150)
    for title, expr, col in items:
        body += (f"<DataItem>\n<Id>{nid()}</Id>\n<Expression>{cdata(expr)}</Expression>\n<Color>{col}</Color>\n"
                 f"<Title>{cdata(title)}</Title>\n</DataItem>\n")
    body += (f"<ScaleFromExpression>{cdata('0')}</ScaleFromExpression>\n<ScaleToExpression>{cdata('1')}</ScaleToExpression>\n"
             "<ScaleType>AUTO</ScaleType>\n<Bars>\n<Direction>UP</Direction>\n<RelativeWidth>0.8</RelativeWidth>\n</Bars>\n")
    return f"<BarChart>\n{body}</BarChart>\n"


PALETTE = [color(*c) for c in [(31, 119, 180), (255, 127, 14), (44, 160, 44), (214, 39, 40), (148, 103, 189),
                                (140, 86, 75), (227, 119, 194), (127, 127, 127), (188, 189, 34), (23, 190, 207)]]

# --------------------------------------------------------------------------- Main presentation

def main_presentation():
    s = ""
    s += rect("bg", 0, 0, 1500, 1880, fill=WHITE, line=None)
    s += text("title", 20, 12, "RakeFlow  |  Ghugus (GGS) -> Tadali (TAE) -> Chandrapur TPS (CSTPS) closed-circuit coal rakes  |  Central Railway, Nagpur Division",
              size=17, bold=True, col=NAVY)
    s += text("clock", 20, 42, "-", size=12, bold=True, TextCode="headerText()")
    s += text("resources", 20, 64, "-", size=11, font="Monospaced", TextCode="resourceText()")

    # ---- Ghugus yard
    s += rect("ggsYard", 40, 230, 290, 300, fill=LIGHT, line=GREY)
    s += text("ggsName", 50, 238, "GHUGUS (GGS) - WCL sidings", size=13, bold=True, col=NAVY)
    s += text("ggsNote", 50, 256, "loops (A-01): empties before placement, loaded rakes until crew + path", size=9)
    for k in range(4):
        y = 284 + k * 28 + 6
        s += line(f"ggsLoop{k}", 60, y, 250, 0, col=TRACK, lw=2, VisibleCode=f"{k} < cGgsLoops")
        s += text(f"ggsLoopLbl{k}", 60, y - 16, f"Loop {k + 1}", size=9, col=GREY, VisibleCode=f"{k} < cGgsLoops")
    s += text("sidNote", 50, 392, "loading sidings / CHP (LD-01..03)", size=9)
    for k in range(4):
        y = 404 + k * 28
        s += rect(f"siding{k}", 60, y - 2, 70, 16, fill=LIGHT, line=GREY, FillColorCode=f"sidingColor({k})",
                  VisibleCode=f"{k} < cSidings")
        s += text(f"sidingLbl{k}", 66, y + 10, f"CHP {k + 1}", size=9, VisibleCode=f"{k} < cSidings")
        s += line(f"sidingTrack{k}", 130, y + 6, 180, 0, col=TRACK, lw=2, VisibleCode=f"{k} < cSidings")

    # ---- single line
    s += line("spur", 330, 262, 550, 0, col=TRACK, lw=4)
    s += line("spur2", 330, 280, 550, 0, col=TRACK, lw=4, VisibleCode="cDoubled")
    s += text("spurLbl", 420, 286, "Ghugus - Tadali single line, 14.11 km, one block section (INF-01..03)", size=11, bold=True)
    s += text("spurLbl2", 420, 302, "loaded rakes above the line, empties below; loaded rakes have priority (A-22)", size=9)
    s += text("spurDbl", 420, 318, "DOUBLED (E5): one line per direction", size=10, bold=True, col=RED, VisibleCode="cDoubled")

    # ---- Tadali
    s += rect("taeBox", 860, 150, 105, 80, fill=LIGHT, line=GREY)
    s += text("taeName", 862, 130, "TADALI (TAE)", size=13, bold=True, col=NAVY)
    s += text("taeNote", 862, 236, "loops (A-02)", size=9)
    for k in range(4):
        s += line(f"taeLoop{k}", 865, 176 + k * 22 + 6, 95, 0, col=TRACK, lw=2, VisibleCode=f"{k} < cTaeLoops")

    # ---- main line
    s += line("dnTrack", 985, 60, 0, 840, col=TRACK, lw=4)
    s += line("upTrack", 1015, 60, 0, 840, col=TRACK, lw=4)
    s += text("toWardha", 930, 44, "to Wardha / Nagpur", size=10, bold=True)
    s += text("toBpq", 935, 905, "to Balharshah (BPQ)", size=10, bold=True)
    s += text("dnLbl", 952, 420, "DN", size=10, bold=True)
    s += text("upLbl", 1020, 420, "UP", size=10, bold=True)
    s += text("mainLbl", 1022, 440, "Wardha-Balharshah main line\n(Delhi-Chennai HDN, line use\n145% UP / 163% DN, INF-05)\nTAE-CD ~13 km (INF-08)", size=9)
    for k in range(8):
        s += oval(f"paxDn{k}", 985, 0, 6, YCode=f"paxY({k}, true)", FillColorCode=f"paxColor({k}, true)",
                  VisibleCode=f"paxY({k}, true) > -500")
        s += oval(f"paxUp{k}", 1015, 0, 6, YCode=f"paxY({k}, false)", FillColorCode=f"paxColor({k}, false)",
                  VisibleCode=f"paxY({k}, false) > -500")

    # ---- Chandrapur / CSTPS
    s += text("cdName", 1030, 585, "CHANDRAPUR (CD)", size=13, bold=True, col=NAVY)
    s += rect("cstpsBox", 1070, 540, 300, 200, fill=LIGHT, line=GREY)
    s += text("cstpsName", 1080, 548, "CSTPS (MAHAGENCO, 2,920 MW) yard + tipplers", size=11, bold=True, col=NAVY)
    for k in range(5):
        s += rect(f"tippler{k}", 1088 + k * 52, 694, 48, 30, fill=LIGHT, line=GREY, FillColorCode=f"tipplerColor({k})")
        s += text(f"tipplerLbl{k}", 1092 + k * 52, 736, f"T{k + 1}", size=9)
    s += rect("bpqBox", 1070, 840, 300, 80, fill=LIGHT, line=GREY)
    s += text("bpqName", 1080, 846, "BALHARSHAH C&W depot: BPC exam 06-18 h (A-10..12)", size=10, bold=True, col=NAVY)

    # ---- rakes
    for i in range(MAX_RAKES):
        s += rect(f"rake{i}", 0, 0, 44, 12, fill=DARK, line=BLACK, XCode=f"rakeX({i})", YCode=f"rakeY({i})",
                  WidthCode=f"rakeVertical({i}) ? 12 : 44", HeightCode=f"rakeVertical({i}) ? 40 : 12",
                  FillColorCode=f"rakeColor({i})", VisibleCode=f"{i} < rakes.size()")
        s += text(f"rakeLbl{i}", 0, 0, "R", size=9, bold=True, col=WHITE, XCode=f"rakeX({i}) + 4",
                  YCode=f"rakeY({i}) + 10", TextCode=f"rakeLabel({i})", VisibleCode=f"{i} < rakes.size() && !rakeVertical({i})")
        s += text(f"rakeLblV{i}", 0, 0, "R", size=8, bold=True, col=BLACK, XCode=f"rakeX({i}) - 22",
                  YCode=f"rakeY({i}) + 24", TextCode=f"rakeLabel({i})", VisibleCode=f"{i} < rakes.size() && rakeVertical({i})")

    # ---- legend
    s += rect("legendBox", 40, 100, 290, 110, fill=PANEL, line=GREY)
    s += text("legendT", 50, 106, "Legend", size=11, bold=True)
    lg = [("loaded rake", color(40, 40, 40)), ("empty rake", color(176, 128, 80)), ("crew relief awaited", color(200, 40, 40)),
          ("BPC exam detour", color(240, 150, 30)), ("passenger train (main line)", BLUE), ("through goods train", GREY)]
    for k, (t, c) in enumerate(lg):
        s += rect(f"lg{k}", 50, 126 + k * 13, 20, 9, fill=c, line=None)
        s += text(f"lgt{k}", 76, 135 + k * 13, t, size=9)

    # ---- boards and KPI panel
    s += rect("boardBox", 1100, 56, 380, 150, fill=PANEL, line=GREY)
    s += text("board", 1108, 64, "-", size=10, font="Monospaced", TextCode="nextTrainsText()")
    s += rect("kpiBox", 20, 560, 470, 200, fill=PANEL, line=GREY)
    s += text("kpiT", 30, 566, "KPIs after warm-up (brief section 4.5)", size=12, bold=True, col=NAVY)
    s += text("kpi", 30, 586, "-", size=10, font="Monospaced", TextCode="kpiText()")
    s += rect("decBox", 500, 400, 400, 360, fill=PANEL, line=GREY)
    s += text("dec", 510, 408, "-", size=10, font="Monospaced", TextCode="decompText()")

    # ---- charts
    s += timeplot("plotStock", 20, 780, 470, 300, [
        ("CSTPS coal stock (days of normative 47.8 kt/day)", "dsStockDays", "stockDays()", PALETTE[0]),
        ("7-day critical level", "dsStockCritical", "7", PALETTE[3])])
    s += timeplot("plotRakes", 500, 780, 470, 300, [
        ("Loaded rakes placed at CSTPS, last 24 h", "dsRakes24", "deliveredLast24h()", PALETTE[2]),
        ("Validation band low (6/day, CEA)", "dsBandLo", "6", PALETTE[7]),
        ("LD-01 Ghugus loading 7.5/day", "dsLd01", "7.5", PALETTE[1])])
    s += barchart("chartDecomp", 980, 940, 500, 360,
                  [(f"{g}", f"groupMean({k})", PALETTE[k % len(PALETTE)]) for k, g in enumerate(
                      ["Ghugus terminal", "Crew waits", "Single-line waits", "Running", "Tadali DN merge",
                       "CSTPS terminal", "Held at CD (loops/UP path)", "Crew relief", "BPC detour"])])
    s += text("decompTitle", 990, 924, "Mean hours per cycle by stage", size=12, bold=True, col=NAVY)
    s += flow_panel()
    return s


# Process-flow panel: the rake cycle drawn as a flowchart (Queue / Delay / Seize / Decision boxes), each box bound
# to the kernel stage it represents. Pure presentation: it reads flowCount/compMean and changes no logic.
# (stage index or -1 decision / -2 end, kind 0 queue 1 delay 2 seize 3 decision/end, name, function)
FLOW_TOP = [(0, 1, "Arrive + placement", "arriveGGS()"), (1, 0, "Wait for siding", "qSiding"),
            (2, 2, "Loading (siding)", "startLoading()"), (3, 1, "Release -> ready", "loadDone()"),
            (4, 0, "Wait for crew", "assignCrew()"), (5, 0, "Wait line + TAE loop", "allocLine()"),
            (6, 2, "Single line GGS-TAE", "allocLine()"), (7, 0, "Wait gap at Tadali", "planMerge()"),
            (8, 1, "Run Tadali-CSTPS", "mergeDN()"), (9, 1, "Placement at CSTPS", "arriveCSTPS()")]
FLOW_BOTTOM = [(10, 0, "Wait for tippler", "qTippler"), (11, 2, "Unloading (tippler)", "startTippler()"),
               (12, 1, "Release at CSTPS", "unloadDone()"), (-1, 3, "BPC exam due?", "releasedAtCD()"),
               (14, 0, "Held at CD (loops)", "departCD()"), (13, 0, "Wait crew (empty)", "assignCrew()"),
               (15, 1, "Run CSTPS-Tadali", "planDepartCD()"), (16, 0, "Wait single line", "qLineTAE"),
               (17, 2, "Single line TAE-GGS", "allocLine()"), (-2, 3, "Cycle complete", "closeCycle()")]
FLOW_SIDE = [(6, 19, 1, "BPC exam (depot)", "goBpc() / examWork()"), (2, 18, 0, "Crew relief (wait)", "relieve()")]
KIND = ["QUEUE", "DELAY", "SEIZE", "DECISION"]
KIND_COL = [color(170, 110, 0), color(30, 80, 170), color(30, 120, 40), color(90, 90, 90)]
FX0, FDX, FW, FH = 25, 146, 132, 84
FY = (1400, 1580, 1760)


def flow_box(name, i, row_y, p, kind, label, fn):
    x = FX0 + i * FDX
    s = rect(f"{name}Box", x, row_y, FW, FH, fill=LIGHT, line=GREY, FillColorCode=f"flowColor({p}, {kind})")
    s += text(f"{name}Kind", x + 6, row_y + 4, KIND[kind], size=9, bold=True, col=KIND_COL[kind])
    s += text(f"{name}Name", x + 6, row_y + 19, label, size=10, bold=True, col=BLACK)
    s += text(f"{name}Fn", x + 6, row_y + 36, fn, size=9, col=color(90, 90, 90), font="Monospaced")
    s += text(f"{name}Live", x + 6, row_y + 56, "-", size=10, bold=True, col=NAVY, TextCode=f"flowText({p})")
    return s


def flow_panel():
    s = rect("flowBg", 10, 1320, 1480, 540, fill=PANEL, line=GREY)
    s += text("flowTitle", 25, 1330, "PROCESS FLOW (live)  -  the rake cycle as a flowchart, driven by the event logic",
              size=15, bold=True, col=NAVY)
    s += text("flowNote", 25, 1354, "Each box is one stage of the cycle: QUEUE = waiting for a resource, DELAY = timed "
              "activity, SEIZE = holds a resource (siding, single line, tippler), DECISION = branch.  'now' = rakes in the "
              "stage at this moment, 'avg' = mean hours per cycle.  Closed loop: 8 rakes, no sink.", size=10)
    s += text("flowNote2", 25, 1370, "Controller: dispatch() re-checks every waiting rake after each event "
              "(sidings, crews, single line, CSTPS departures, tipplers, exam line).", size=10, col=color(90, 90, 90))
    for i, (p, k, lab, fn) in enumerate(FLOW_TOP):
        s += flow_box(f"flowT{i}", i, FY[0], p, k, lab, fn)
        if i < len(FLOW_TOP) - 1:
            s += text(f"flowTa{i}", FX0 + i * FDX + FW + 1, FY[0] + 30, "→", size=14, bold=True)
    for j, (p, k, lab, fn) in enumerate(FLOW_BOTTOM):
        i = len(FLOW_BOTTOM) - 1 - j          # bottom row runs right to left
        s += flow_box(f"flowB{j}", i, FY[1], p, k, lab, fn)
        if i > 0:
            s += text(f"flowBa{j}", FX0 + i * FDX - 13, FY[1] + 30, "←", size=14, bold=True)
    last = FX0 + (len(FLOW_TOP) - 1) * FDX + FW // 2 - 6
    s += text("flowDown", last, FY[0] + FH + 30, "↓", size=16, bold=True)
    s += text("flowUp", FX0 + FW // 2 - 6, FY[0] + FH + 30, "↑  next cycle", size=12, bold=True)
    for n, (i, p, k, lab, fn) in enumerate(FLOW_SIDE):
        s += flow_box(f"flowS{n}", i, FY[2], p, k, lab, fn)
    dec = FX0 + 6 * FDX + FW // 2 - 6
    s += text("flowYes", dec, FY[1] + FH + 30, "↓ yes: exam, then back to 'Held at CD'    (no: continue ←)",
              size=10, bold=True)
    s += text("flowRelief", FX0 + 2 * FDX + FW + 8, FY[2] + 30, "any standing stage -> relief crew (A-09), then resumes",
              size=10, col=color(90, 90, 90))
    return s


def param_xml(name, t, default, desc, x, y):
    editor = "CHECK_BOX" if t == "boolean" else "TEXT_BOX"
    return (f"<Variable Class=\"Parameter\">\n<Id>{nid()}</Id>\n<Name>{cdata(name)}</Name>\n<X>{x}</X><Y>{y}</Y>\n"
            f"<Label><X>10</X><Y>0</Y></Label>\n<PublicFlag>false</PublicFlag>\n<PresentationFlag>true</PresentationFlag>\n"
            f"<ShowLabel>true</ShowLabel>\n<Description>{cdata(desc)}</Description>\n"
            f"<Properties SaveInSnapshot=\"true\" ModificatorType=\"STATIC\">\n<Type>{cdata(t)}</Type>\n"
            f"<UnitType>{cdata('NONE')}</UnitType>\n<SdArray>false</SdArray>\n<DefaultValue Class=\"CodeValue\">\n"
            f"<Code>{cdata(default)}</Code>\n</DefaultValue>\n<ParameterEditor>\n<Id>{nid()}</Id>\n"
            f"<EditorContolType>{editor}</EditorContolType>\n<MinSliderValue>{cdata('0')}</MinSliderValue>\n"
            f"<MaxSliderValue>{cdata('100')}</MaxSliderValue>\n<DelimeterType>NO_DELIMETER</DelimeterType>\n"
            f"</ParameterEditor>\n</Properties>\n</Variable>\n")


PARAM_IDS = {}


def variables_xml():
    s = ""
    x0, y0 = 1600, 40
    col = 0
    y = y0
    for gname, plist in GROUPS:
        if y > 1150:
            col += 1
            y = y0
        y += 30
        for name, t, default, desc in plist:
            before = _id[0]
            s += param_xml(name, t, default, desc, x0 + col * 330, y)
            PARAM_IDS[name] = before + 1
            y += 22
    return s


def group_titles():
    s = ""
    x0, y0 = 1600, 40
    col = 0
    y = y0
    for gname, plist in GROUPS:
        if y > 1150:
            col += 1
            y = y0
        s += text(f"pg_{len(s)}", x0 + col * 330, y + 14, gname.upper(), size=12, bold=True, col=NAVY)
        y += 30 + 22 * len(plist)
    s += text("paramsTitle", 1600, 20, "PARAMETERS  (IDs as in docs/MODEL_BRIEF.md; edit in the Simulation experiment or here)",
              size=14, bold=True, col=RED)
    return s


def functions_xml(funcs):
    s = ""
    x0, y0 = 2400, 60
    for k, f in enumerate(funcs):
        x = x0 + (k // 28) * 260
        y = y0 + (k % 28) * 26
        ret = f["ret"]
        if ret == "void":
            mod, rtype = "VOID", "double"
        else:
            mod, rtype = "RETURNS_VALUE", ret
        ps = "".join(f"<Parameter>\n<Name>{cdata(n)}</Name>\n<Type>{cdata(t)}</Type>\n</Parameter>\n" for t, n in f["params"])
        s += (f"<Function AccessType=\"default\" StaticFunction=\"false\">\n<ReturnModificator>{mod}</ReturnModificator>\n"
              f"<ReturnType>{cdata(rtype)}</ReturnType>\n<Id>{nid()}</Id>\n<Name>{cdata(f['name'])}</Name>\n"
              f"<Description>{cdata(f['doc'])}</Description>\n"
              f"<X>{x}</X><Y>{y}</Y>\n<Label><X>10</X><Y>0</Y></Label>\n<PublicFlag>false</PublicFlag>\n"
              f"<PresentationFlag>true</PresentationFlag>\n<ShowLabel>true</ShowLabel>\n{ps}<Body>{cdata(f['body'])}</Body>\n</Function>\n")
    return s


def class_header():
    return f"""<Generic>false</Generic>
<GenericParameter>
<Id>{nid()}</Id>
<Name>{cdata('1791000000003')}</Name>
<GenericParameterValue Class="CodeValue">
<Code>{cdata('T extends Agent')}</Code>
</GenericParameterValue>
<GenericParameterLabel>{cdata('Generic parameter:')}</GenericParameterLabel>
</GenericParameter>
<FlowChartsUsage>ENTITY</FlowChartsUsage>
<SamplesToKeep>100</SamplesToKeep>
<LimitNumberOfArrayElements>false</LimitNumberOfArrayElements>
<ElementsLimitValue>100</ElementsLimitValue>
<MakeDefaultViewArea>true</MakeDefaultViewArea>
<SceneGridColor/>
<SceneBackgroundColor>-4144960</SceneBackgroundColor>
<EnvironmentResourceRef></EnvironmentResourceRef>
<EnvironmentType>NONE</EnvironmentType>
<EnvironmentRotationX>0</EnvironmentRotationX>
<EnvironmentRotationY>0</EnvironmentRotationY>
<EnvironmentRotationZ>0</EnvironmentRotationZ>
<EnvironmentIntensity>1</EnvironmentIntensity>
<AgentProperties>
<EnvironmentDefinesInitialLocation>true</EnvironmentDefinesInitialLocation>
<RotateAnimationTowardsMovement>true</RotateAnimationTowardsMovement>
<RotateAnimationVertically>false</RotateAnimationVertically>
<VelocityCode Class="CodeUnitValue">
<Code>{cdata('10')}</Code>
<Unit Class="SpeedUnits">{cdata('MPS')}</Unit>
</VelocityCode>
<PhysicalLength Class="CodeUnitValue">
<Code>{cdata('1')}</Code>
<Unit Class="LengthUnits">{cdata('METER')}</Unit>
</PhysicalLength>
<PhysicalWidth Class="CodeUnitValue">
<Code>{cdata('1')}</Code>
<Unit Class="LengthUnits">{cdata('METER')}</Unit>
</PhysicalWidth>
<PhysicalHeight Class="CodeUnitValue">
<Code>{cdata('1')}</Code>
<Unit Class="LengthUnits">{cdata('METER')}</Unit>
</PhysicalHeight>
</AgentProperties>
<EnvironmentProperties>
<EnableSteps>false</EnableSteps>
<StepDurationCode Class="CodeUnitValue">
<Code>{cdata('1.0')}</Code>
<Unit Class="TimeUnits">{cdata('SECOND')}</Unit>
</StepDurationCode>
<SpaceType>CONTINUOUS</SpaceType>
<WidthCode>{cdata('500')}</WidthCode>
<HeightCode>{cdata('500')}</HeightCode>
<ZHeightCode>{cdata('0')}</ZHeightCode>
<ColumnsCountCode>{cdata('100')}</ColumnsCountCode>
<RowsCountCode>{cdata('100')}</RowsCountCode>
<NeigborhoodType>MOORE</NeigborhoodType>
<LayoutType>USER_DEF</LayoutType>
<NetworkType>USER_DEF</NetworkType>
<ConnectionsPerAgentCode>{cdata('2')}</ConnectionsPerAgentCode>
<ConnectionsRangeCode>{cdata('50')}</ConnectionsRangeCode>
<NeighborLinkFractionCode>{cdata('0.95')}</NeighborLinkFractionCode>
<MCode>{cdata('10')}</MCode>
</EnvironmentProperties>
<DatasetsCreationProperties>
<AutoCreate>true</AutoCreate>
<Id>{nid()}</Id>
<OccurrenceAtTime>true</OccurrenceAtTime>
<OccurrenceDate>{START_MS}</OccurrenceDate>
<OccurrenceTime Class="CodeUnitValue">
<Code>{cdata('0')}</Code>
<Unit Class="TimeUnits">{cdata('HOUR')}</Unit>
</OccurrenceTime>
<RecurrenceCode Class="CodeUnitValue">
<Code>{cdata('1')}</Code>
<Unit Class="TimeUnits">{cdata('HOUR')}</Unit>
</RecurrenceCode>
</DatasetsCreationProperties>
<ScaleRuler>
<Id>{nid()}</Id>
<Name>{cdata('scale')}</Name>
<X>0</X><Y>-150</Y>
<PublicFlag>false</PublicFlag>
<PresentationFlag>false</PresentationFlag>
<ShowLabel>false</ShowLabel>
<DrawMode>SHAPE_DRAW_2D3D</DrawMode>
<Length>100</Length>
<Rotation>0</Rotation>
<ScaleType>BASED_ON_LENGTH</ScaleType>
<ModelLength>10</ModelLength>
<LengthUnits>METER</LengthUnits>
<Scale>10</Scale>
<InheritedFromParentAgentType>true</InheritedFromParentAgentType>
</ScaleRuler>
<CurrentLevel>{LEVEL_ID}</CurrentLevel>
<ConnectionsId>{nid()}</ConnectionsId>
"""


def model_time(final_h):
    final_ms = START_MS + int(final_h * 3600 * 1000)
    return (f"<ModelTimeProperties>\n<StopOption>{cdata('Stop at specified time')}</StopOption>\n"
            f"<InitialDate>{cdata(str(START_MS))}</InitialDate>\n<InitialTime>{cdata('0.0')}</InitialTime>\n"
            f"<FinalDate>{cdata(str(final_ms))}</FinalDate>\n<FinalTime>{cdata(str(float(final_h)))}</FinalTime>\n"
            f"</ModelTimeProperties>\n")


def level(shapes):
    return (f"<Presentation>\n<Level>\n<Id>{LEVEL_ID}</Id>\n<Name>{cdata('level')}</Name>\n<X>0</X><Y>0</Y>\n"
            f"<Label><X>10</X><Y>0</Y></Label>\n<PublicFlag>true</PublicFlag>\n<PresentationFlag>true</PresentationFlag>\n"
            f"<ShowLabel>false</ShowLabel>\n<DrawMode>SHAPE_DRAW_2D3D</DrawMode>\n<Z>0</Z>\n"
            f"<LevelVisibility>DIM_NON_CURRENT</LevelVisibility>\n<Presentation>\n{shapes}</Presentation>\n</Level>\n</Presentation>\n")


def exp_level(shapes):
    # experiment canvases hold shapes directly (no Level), as in AnyLogic 8.9.9 files
    return f"<Presentation>\n{shapes}</Presentation>\n"


STOP_H = 24 * (3 + 30)

EXP_CODE = r"""// Collected KPI rows, grouped by the value of the varied parameter shown in the summary.
java.util.TreeMap<Integer, java.util.ArrayList<double[]>> byKey = new java.util.TreeMap<Integer, java.util.ArrayList<double[]>>();
static final String[] KPI = { "rakes/day", "cycle h", "P90 cycle h", "line util", "siding util", "tippler util", "demurrage Rs/rake",
                              "relief share", "BPC share", "stock min days", "merge queue", "expiries/100", "exam h/rake/mo" };

double tCrit(int df) {
    final double[] t = { 12.706, 4.303, 3.182, 2.776, 2.571, 2.447, 2.365, 2.306, 2.262, 2.228, 2.201, 2.179, 2.160, 2.145,
                         2.131, 2.120, 2.110, 2.101, 2.093, 2.086, 2.080, 2.074, 2.069, 2.064, 2.060, 2.056, 2.052, 2.048, 2.045 };
    return df < 1 ? 0 : (df <= t.length ? t[df - 1] : 2.0);
}

void collect(int key, Main m) {
    double[] r = { m.rakesPerDay(), m.meanCycle(), m.p90Cycle(), m.lineUtil(), m.sidingUtil(), m.tipplerUtil(), m.demurragePerRake(),
                   m.shareRelief(), m.shareBpc(), m.stockMinDays, m.mergeQueueAvg(), m.crewExpiriesPer100(), m.examHoursPerRakeMonth() };
    if (!byKey.containsKey(key)) byKey.put(key, new java.util.ArrayList<double[]>());
    byKey.get(key).add(r);
}

String summaryText() {
    if (byKey.isEmpty()) return "Press Run. Each run uses parameter seed, so all keys share the same random numbers.";
    StringBuilder sb = new StringBuilder(String.format("%-8s %4s", KEY_NAME, "n"));
    for (String k : KPI) sb.append(String.format("  %18s", k));
    sb.append("\n");
    for (java.util.Map.Entry<Integer, java.util.ArrayList<double[]>> e : byKey.entrySet()) {
        java.util.ArrayList<double[]> rows = e.getValue();
        int n = rows.size();
        sb.append(String.format("%-8d %4d", e.getKey(), n));
        for (int k = 0; k < KPI.length; k++) {
            double m = 0, v = 0;
            for (double[] r : rows) m += r[k];
            m /= n;
            for (double[] r : rows) v += (r[k] - m) * (r[k] - m);
            double hw = n > 1 ? tCrit(n - 1) * Math.sqrt(v / (n - 1)) / Math.sqrt(n) : 0;
            sb.append(String.format(java.util.Locale.US, "  %9.3f +-%6.3f", m, hw));
        }
        sb.append("\n");
    }
    return sb.toString();
}

void save(String file) {
    try {
        java.io.PrintWriter w = new java.io.PrintWriter(new java.io.FileWriter(file, false));
        w.println("Mean +- 95% CI half-width (t), " + KEY_NAME + " as rows. Every run is also appended to RakeFlow_runs.csv.");
        w.print(summaryText());
        w.close();
    } catch (Exception ex) {
        traceln("Could not write " + file + ": " + ex);
    }
}
"""


def param_variation(name, title, ranges, key_expr, key_name, file):
    code = f'static final String KEY_NAME = "{key_name}";\n' + EXP_CODE
    shapes = text("expTitle", 20, 20, title, size=16, bold=True, col=NAVY)
    shapes += text("expNote", 20, 46, "Each run: 3 days warm-up + 30 days statistics (brief 4.1). Common random numbers via parameter seed.", size=11)
    shapes += text("expSummary", 20, 80, "-", size=11, font="Monospaced", TextCode="summaryText()")
    rv = ""
    for pname, a, b, st in ranges:
        rv += (f"<RangeVariationParamValue>\n<Id>{PARAM_IDS[pname]}</Id>\n<Type>RANGE</Type>\n"
               f"<From Class=\"CodeValue\">\n<Code>{cdata(str(a))}</Code>\n</From>\n<To Class=\"CodeValue\">\n<Code>{cdata(str(b))}</Code>\n</To>\n"
               f"<Step Class=\"CodeValue\">\n<Code>{cdata(str(st))}</Code>\n</Step>\n</RangeVariationParamValue>\n")
    return f"""<ParamVariationExperiment ActiveObjectClassId="{MAIN_ID}">
<Id>{nid()}</Id>
<Name>{cdata(name)}</Name>
<AdditionalClassCode>{cdata(code)}</AdditionalClassCode>
<CommandLineArguments>{cdata('')}</CommandLineArguments>
<MaximumMemory>1024</MaximumMemory>
<RandomNumberGenerationType>fixedSeed</RandomNumberGenerationType>
<CustomGeneratorCode>new Random()</CustomGeneratorCode>
<BeforeEachExperimentRunCode>{cdata('byKey.clear();')}</BeforeEachExperimentRunCode>
<AfterSimulationRunCode>{cdata(f'collect({key_expr}, root);' + chr(10) + f'save("{file}");')}</AfterSimulationRunCode>
<SeedValue>1</SeedValue>
<SelectionModeForSimultaneousEvents>LIFO</SelectionModeForSimultaneousEvents>
<VmArgs>{cdata('')}</VmArgs>
<LoadRootFromSnapshot>false</LoadRootFromSnapshot>
{exp_level(shapes)}<AllowParallelEvaluations>false</AllowParallelEvaluations>
<UseFreeformParameters>false</UseFreeformParameters>
<NumberOfRuns>10</NumberOfRuns>
{rv}{model_time(STOP_H)}<PresentationProperties>
<EnableZoomAndPanning>true</EnableZoomAndPanning>
<Title>{cdata('RakeFlow : ' + name)}</Title>
<EnableDeveloperPanel>true</EnableDeveloperPanel>
<ShowDeveloperPanelOnStart>false</ShowDeveloperPanelOnStart>
</PresentationProperties>
<ReplicationsProperties>
<UseReplication>false</UseReplication>
<FixedReplicationsNumber>true</FixedReplicationsNumber>
<ReplicationPerIteration>1</ReplicationPerIteration>
<MinimumReplication>2</MinimumReplication>
<MaximumReplication>30</MaximumReplication>
<ConfidenceLevel>LEVEL_95</ConfidenceLevel>
<ErrorPercent>0.5</ErrorPercent>
<ExpressionForConfidenceComputation>{cdata('0')}</ExpressionForConfidenceComputation>
</ReplicationsProperties>
</ParamVariationExperiment>
"""


def simulation_experiment():
    shown = ["seed", "modelPhase", "scenario", "fleetSize"]
    ps = "".join(f"<Parameter>\n<ParameterName>{cdata(p)}</ParameterName>\n<ParameterValue Class=\"CodeValue\">\n"
                 f"<Code>{cdata(next(d for n, t, d, _ in PARAMS if n == p))}</Code>\n</ParameterValue>\n</Parameter>\n" for p in shown)
    return f"""<SimulationExperiment ActiveObjectClassId="{MAIN_ID}">
<Id>{nid()}</Id>
<Name>{cdata('Simulation')}</Name>
<CommandLineArguments>{cdata('')}</CommandLineArguments>
<MaximumMemory>1024</MaximumMemory>
<RandomNumberGenerationType>fixedSeed</RandomNumberGenerationType>
<CustomGeneratorCode>new Random()</CustomGeneratorCode>
<SeedValue>1</SeedValue>
<SelectionModeForSimultaneousEvents>LIFO</SelectionModeForSimultaneousEvents>
<VmArgs>{cdata('')}</VmArgs>
<LoadRootFromSnapshot>false</LoadRootFromSnapshot>
<Parameters>
{ps}</Parameters>
<PresentationProperties>
<EnableZoomAndPanning>true</EnableZoomAndPanning>
<ExecutionMode>{cdata('realTimeScaled')}</ExecutionMode>
<Title>{cdata('RakeFlow : Simulation (one replication, animated)')}</Title>
<EnableDeveloperPanel>true</EnableDeveloperPanel>
<ShowDeveloperPanelOnStart>false</ShowDeveloperPanelOnStart>
<RealTimeScale>0.5</RealTimeScale>
</PresentationProperties>
{model_time(STOP_H)}<BypassInitialScreen>true</BypassInitialScreen>
</SimulationExperiment>
"""


def build():
    classcode, funcs = parse_kernel()
    classcode = classcode + "\n" + timetable_java()
    variables = variables_xml()
    shapes = main_presentation() + group_titles()
    shapes += text("fnTitle", 2400, 30, "FUNCTIONS - rake-cycle kernel, controller, crew, BPC, statistics, animation (see Additional class code for the classes)",
                   size=14, bold=True, col=RED)
    startup = "// Build the timetable, rakes and crews and start the kernel clock (see function initModel).\ninitModel();"
    destroy = "// Append this run's KPIs to RakeFlow_runs.csv and write the per-cycle log.\nwriteResults();"
    main = f"""<ActiveObjectClass>
<Id>{MAIN_ID}</Id>
<Name>{cdata('Main')}</Name>
<Description>{cdata('RakeFlow closed-circuit coal rake cycle, Ghugus - Tadali - Chandrapur TPS. See docs/MODEL_BRIEF.md and model/README.md.')}</Description>
<AdditionalClassCode>{cdata(classcode)}</AdditionalClassCode>
<StartupCode>{cdata(startup)}</StartupCode>
<DestroyCode>{cdata(destroy)}</DestroyCode>
{class_header()}<Variables>
{variables}</Variables>
<Functions>
{functions_xml(funcs)}</Functions>
{level(shapes)}</ActiveObjectClass>
"""
    experiments = simulation_experiment()
    experiments += param_variation("Replications30", "Baseline: 30 replications (seeds 1-30), mean and 95% CI",
                                   [("seed", 1, 30, 1)], "root.modelPhase", "phase", "RakeFlow_replications_summary.txt")
    experiments += param_variation("E1_FleetSize", "E1 fleet size 4-20 rakes x 10 seeds (common random numbers)",
                                   [("fleetSize", 4, 20, 2), ("seed", 1, 10, 1)], "root.fleetSize", "fleet",
                                   "RakeFlow_E1_fleet_summary.txt")
    experiments += param_variation("E2toE7_Scenarios", "Scenarios 0-18 (E2 RLS, E3 path policy, E4 lobby, E5 doubling, E6 tipplers, E7 +20%, dispatch, crew timing, exam trigger) x 10 seeds",
                                   [("scenario", 0, 18, 1), ("seed", 1, 10, 1)], "root.scenario", "scenario",
                                   "RakeFlow_scenarios_summary.txt")
    experiments += param_variation("KeyExperiments", "Key experiments x 30 seeds: 19 baseline, 20 crew during loading, 21 3rd Ghugus loop, 22 RLS silo, 23 doubling, 24 all three, 25 crew+loop, 26 crew+RLS, 27 loop+RLS",
                                   [("scenario", 19, 27, 1), ("seed", 1, 30, 1)], "root.scenario", "scenario",
                                   "RakeFlow_key_experiments_summary.txt")
    xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<!--
*************************************************
	         AnyLogic Project File
*************************************************
-->
<AnyLogicWorkspace WorkspaceVersion="1.9" AnyLogicVersion="8.9.9.202607020844" AlpVersion="8.9.9">
<Model>
<Id>{nid()}</Id>
<Name>{cdata('RakeFlow')}</Name>
<EngineVersion>6</EngineVersion>
<JavaPackageName>{cdata('rakeflow')}</JavaPackageName>
<ModelTimeUnit>{cdata('Hour')}</ModelTimeUnit>
<Folders>
</Folders>
<ActiveObjectClasses>
{main}</ActiveObjectClasses>
<DifferentialEquationsMethod>EULER</DifferentialEquationsMethod>
<MixedEquationsMethod>RK45_NEWTON</MixedEquationsMethod>
<AlgebraicEquationsMethod>MODIFIED_NEWTON</AlgebraicEquationsMethod>
<AbsoluteAccuracy>1.0E-5</AbsoluteAccuracy>
<FixedTimeStep>0.001</FixedTimeStep>
<RelativeAccuracy>1.0E-5</RelativeAccuracy>
<TimeAccuracy>1.0E-5</TimeAccuracy>
<Frame>
<Id>{nid()}</Id>
<Width>1500</Width>
<Height>950</Height>
</Frame>
<Database>
<Id>{nid()}</Id>
<Logging>false</Logging>
<AutoExport>false</AutoExport>
<ShutdownCompact>false</ShutdownCompact>
<ImportSettings>
</ImportSettings>
<ExportSettings>
</ExportSettings>
</Database>
<RunConfiguration ActiveObjectClassId="{MAIN_ID}">
<Id>{nid()}</Id>
<Name>{cdata('RunConfiguration')}</Name>
<MaximumMemory>1024</MaximumMemory>
{model_time(STOP_H)}<AnimationProperties>
<StopNever>true</StopNever>
<ExecutionMode>realTimeScaled</ExecutionMode>
<RealTimeScale>1.0</RealTimeScale>
<EnableZoomAndPanning>true</EnableZoomAndPanning>
<EnableDeveloperPanel>false</EnableDeveloperPanel>
<ShowDeveloperPanelOnStart>false</ShowDeveloperPanelOnStart>
</AnimationProperties>
<Inputs>
</Inputs>
<Outputs>
</Outputs>
</RunConfiguration>
<Experiments>
{experiments}</Experiments>
<RequiredLibraryReference>
<LibraryName>{cdata('com.anylogic.libraries.modules.markup_descriptors')}</LibraryName>
<VersionMajor>1</VersionMajor>
<VersionMinor>0</VersionMinor>
<VersionBuild>0</VersionBuild>
</RequiredLibraryReference>
</Model>
<ConvertersApplied>
<Uuid>bb27038a-0f3a-48bb-b235-4a44066a14aa</Uuid>
<Uuid>1f005f88-e6d7-4bdc-81fa-3acf4c89cf64</Uuid>
<Uuid>42dc5a7c-d7b1-4653-92b9-9359b46cc2d4</Uuid>
<Uuid>e25721a9-34f9-479c-a4c3-31f5ec9e117d</Uuid>
<Uuid>506d1de3-06df-4131-9e88-e43f1768e3d8</Uuid>
<Uuid>e6625695-25a2-43d0-9056-1e9a1a594b1e</Uuid>
<Uuid>91990287-4edf-4e38-aa6c-66d0e906807b</Uuid>
<Uuid>2216cdd0-177c-5678-9e88-dd8b95312234</Uuid>
<Uuid>1737c8c6-b526-4dd8-589e-ee4e205b06f4</Uuid>
<Uuid>6a43bef6-8b70-4253-a828-82c3ab399655</Uuid>
<Uuid>0a27038a-0f3a-48bb-b235-4a44066a1402</Uuid>
<Uuid>0a9ec2c3-5e18-4c0a-a183-fd86d9d9a08b</Uuid>
<Uuid>2216cdd0-177c-5678-9e88-dd8b95313334</Uuid>
<Uuid>2216cdd0-177c-5678-9e88-dd8b95313335</Uuid>
<Uuid>5b8ebeed-6b58-4c3a-8d5f-0958b1a90ce6</Uuid>
</ConvertersApplied>
</AnyLogicWorkspace>
"""
    os.makedirs(OUT_DIR, exist_ok=True)
    open(OUT, "w").write(xml)
    print("wrote", OUT, f"{len(xml) / 1024:.0f} KB,", len(funcs), "functions,", len(PARAMS), "parameters")


if __name__ == "__main__":
    build()
