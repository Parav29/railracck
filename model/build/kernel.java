//@classcode
// =====================================================================================
// RakeFlow kernel - closed-circuit coal rake cycle GGS -> TAE -> CD/CSTPS -> back
// Central Railway, Nagpur Division. IE305 Team RakeFlow.
//
// The rake-cycle logic is a small deterministic event kernel (own future-event list,
// own Random(seed)). AnyLogic supplies the clock (one DynamicEvent armed at the next
// kernel event), the animation, charts and experiments. The same Java is run by the
// test harness in model/harness, so a given seed gives identical numbers in both.
// Every number below is a parameter whose name carries the ID used in MODEL_BRIEF.md.
// Model time unit: HOUR. Day 0 = Monday 05-Oct-2026 00:00.
// =====================================================================================

// ---- cycle-time components (a rake is always in exactly one phase) ----
static final int P_PLACE_GGS = 0, P_WAIT_SIDING = 1, P_LOAD = 2, P_READY_GGS = 3, P_WAIT_CREW_L = 4,
                 P_WAIT_PATH_GGS = 5, P_SPUR_L = 6, P_WAIT_MERGE_DN = 7, P_MAIN_L = 8, P_PLACE_CD = 9,
                 P_WAIT_TIPPLER = 10, P_UNLOAD = 11, P_RELEASE_CD = 12, P_WAIT_CREW_E = 13,
                 P_WAIT_PATH_CD = 14, P_MAIN_E = 15, P_WAIT_LINE_TAE = 16, P_SPUR_E = 17,
                 P_WAIT_RELIEF = 18, P_BPC = 19, NPH = 20;
static final String[] PH_NAME = {
    "Placement at GGS (A-13)", "Wait for loading siding", "Loading (LD-03/04)", "Release->ready GGS (A-14)",
    "Wait for crew (loaded)", "Wait single line + TAE loop", "Run GGS->TAE spur", "Wait DN path at TAE",
    "Run TAE->CD (loaded)", "Placement at CSTPS (A-15)", "Wait for tippler", "Unloading (UL-02)",
    "Release->despatch CD (A-16)", "Wait for crew (empty)", "Held at CD: loops/UP path", "Run CD->TAE (empty)",
    "Wait single line at TAE", "Run TAE->GGS spur", "Crew relief (duty expired)", "BPC exam detour" };

// KPI groups used in the bar chart and reports (brief section 4.5)
static final String[] GRP_NAME = { "Ghugus terminal", "Crew waits", "Single-line waits", "Running",
                                   "Tadali DN merge", "CSTPS terminal", "UP path at CD", "Crew relief", "BPC detour" };
static final int[] PH_GROUP = { 0, 0, 0, 0, 1, 2, 3, 4, 3, 5, 5, 5, 5, 1, 6, 3, 2, 3, 7, 8 };

// rake locations (for relief resume and animation)
static final int L_GGS = 0, L_SPUR = 1, L_TAE = 2, L_MAIN = 3, L_CD = 4, L_DEPOT = 5;

// blocker kinds on the main line
static final int B_PAX = 0, B_GOODS = 1, B_OWN = 2;

class Rake {
    int id;
    boolean loaded;
    int loc = L_CD;
    int phase = -1;
    double phaseStart, phaseEnd = -1;
    double[] comp = new double[NPH];
    double cycleStart = -1;
    int cycleNo;
    double placedAt;
    int sidingNo = -1, tipplerNo = -1;
    boolean onSiding, holdsGgsLoop, holdsTaeLoop, taeLoopReserved;
    Crew crew;
    boolean needRelief;
    int token;                    // bumps cancel scheduled actions after a relief
    Blocker planned;              // reserved main-line slot
    double bpcKm, bpcDue;
    boolean bpcThisCycle, reliefThisCycle;
    double crewHoursLoaded;
    double[] stamp = new double[18];   // timestamps for the RAKE_cycle_log export
}

class Crew {
    int id;
    boolean busy;
    double signOn;
    boolean extended;
    int dutyNo;
    Rake rake;
}

class Blocker {
    double t;
    int kind;
    String label;
    Blocker(double t, int kind, String label) { this.t = t; this.kind = kind; this.label = label; }
}

class Ev {
    double t;
    long seq;
    Runnable job;
}

// ---- kernel state ----
java.util.Random rng;
java.util.PriorityQueue<Ev> fel = new java.util.PriorityQueue<Ev>(64,
    (a, b) -> a.t != b.t ? Double.compare(a.t, b.t) : Long.compare(a.seq, b.seq));
long evSeq;
DynamicEvent wake;
double wakeAt = Double.POSITIVE_INFINITY;
boolean inRun, inDispatch, dispatchAgain;

java.util.ArrayList<Rake> rakes = new java.util.ArrayList<Rake>();
java.util.ArrayList<Crew> crews = new java.util.ArrayList<Crew>();
java.util.ArrayList<Rake> qSiding = new java.util.ArrayList<Rake>();
java.util.ArrayList<Rake> qDepartGGS = new java.util.ArrayList<Rake>();
java.util.ArrayList<Rake> qLineTAE = new java.util.ArrayList<Rake>();
java.util.ArrayList<Rake> qDepartCD = new java.util.ArrayList<Rake>();
java.util.ArrayList<Rake> qTippler = new java.util.ArrayList<Rake>();
java.util.ArrayList<Rake> qCrew = new java.util.ArrayList<Rake>();
java.util.ArrayList<Rake> qExam = new java.util.ArrayList<Rake>();
java.util.ArrayList<Blocker> dnBlock = new java.util.ArrayList<Blocker>();   // DN passings at TAE
java.util.ArrayList<Blocker> upBlock = new java.util.ArrayList<Blocker>();   // UP passings at CD

boolean[] sidingUsed = new boolean[16];
boolean[] tipplerUsed = new boolean[16];
int sidingsBusy, tipplersBusy, ggsLoopUsed, taeLoopLoaded, taeLoopEmpty;
boolean lineBusyDN, lineBusyUP, examBusy;
int lastGeneratedDay = -2;

// ---- effective configuration (parameters, then scenario overrides) ----
int cFleet, cSidings, cGgsLoops, cTaeLoops, cTipplers, cCrewPool, cPolicy, cPhase;
boolean cDoubled, cRls, cCrewOn, cBpcOn, cLocalLobby, cAllowExt, cAbsBlock;
double cThroughPerDay;

// ---- statistics (reset at the end of warm-up) ----
double statsStart, lastTouch;
int delivered, cyclesDone, reliefEvents, extensions, bpcDetours, bpcOverdue, crewTrips;
int loadOverFree, unloadOverFree, loadEnds, unloadEnds;
double tonnes, sumCycle, sumCycleSq, demurrageRs, demurrageLoadRs, demurrageUnloadRs, demurrageHours;
double[] compSum = new double[NPH];
double areaLineDN, areaLineUP, areaSidings, areaTipplers, areaGgsLoops, areaTaeLoops, areaCrewOnDuty;
double mergeWaitSum; int mergeCount;
double dutySum; int reliefCycles, bpcCycles;
java.util.ArrayList<Double> deliveryTimes = new java.util.ArrayList<Double>();

// ---- CSTPS coal stock (kt) ----
double stockKt, stockMinDays = Double.POSITIVE_INFINITY;
int daysBelow7;

// ---- cycle log ----
java.util.ArrayList<String> cycleLog = new java.util.ArrayList<String>();
boolean resultsWritten;
static final String LOG_HEADER = "rake_id,cycle_no,empty_arr_ghugus,placed_loading,loading_start,loading_end,released,"
    + "loco_attached,crew_signon,dep_ghugus,arr_tadali,dep_tadali,arr_cstps,placed_tippler,unload_start,unload_end,"
    + "released_empty,dep_cstps,bpc_km_remaining,bpc_days_remaining,crew_hours_used,notes,source";
static final int S_ARR_GGS = 0, S_PLACED = 1, S_LOAD_START = 2, S_LOAD_END = 3, S_RELEASED = 4, S_LOCO = 5,
                 S_CREW = 6, S_DEP_GGS = 7, S_ARR_TAE = 8, S_DEP_TAE = 9, S_ARR_CD = 10, S_PLACED_TIP = 11,
                 S_UNLOAD_START = 12, S_UNLOAD_END = 13, S_REL_EMPTY = 14, S_DEP_CD = 15;

// ---- animation layout (pixels) ----
static final double X_GGS = 330, X_TAE = 880, Y_SPUR = 260, X_DN = 985, X_UP = 1015, Y_TAE = 260, Y_CD = 600;
//@end

//@fn void schedAt(double t, Runnable job)
//@doc Kernel: put a job on the future-event list at absolute model time t (hours).
Ev e = new Ev();
e.t = Math.max(t, time());
e.seq = evSeq++;
e.job = job;
fel.add(e);
if (!inRun) armClock();
//@end

//@fn void schedAfter(double dt, Runnable job)
//@doc Kernel: run a job dt hours from now.
schedAt(time() + Math.max(0, dt), job);
//@end

//@fn void armClock()
//@doc Kernel: make sure exactly one AnyLogic DynamicEvent is armed at the earliest kernel event.
Ev e = fel.peek();
if (e == null) return;
if (wake != null && wakeAt <= e.t) return;
if (wake != null) wake.reset();
wakeAt = e.t;
wake = new DynamicEvent(this, Math.max(0, e.t - time()), TimeUnits.HOUR) {
    @Override
    public void execute() {
        wake = null;
        wakeAt = Double.POSITIVE_INFINITY;
        runDue();
    }
};
//@end

//@fn void runDue()
//@doc Kernel: execute every kernel job that is due now (ties in scheduling order), then re-arm the clock.
inRun = true;
while (!fel.isEmpty() && fel.peek().t <= time() + 1e-9) {
    Ev e = fel.poll();
    touchStats();
    e.job.run();
}
inRun = false;
armClock();
//@end

//@fn double rUnif(double a, double b)
//@doc Uniform(a,b) from the model's own stream (seeded by parameter seed).
return a + (b - a) * rng.nextDouble();
//@end

//@fn double rTri(double min, double mode, double max)
//@doc Triangular(min, mode, max) by inverse CDF. NOTE argument order is min, MODE, max as in the brief.
if (max <= min) return min;
double u = rng.nextDouble();
double f = (mode - min) / (max - min);
if (u < f) return min + Math.sqrt(u * (max - min) * (mode - min));
return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
//@end

//@fn double rLogn(double mean, double sd)
//@doc Lognormal with the given mean and standard deviation (A-21 passenger lateness).
if (mean <= 0) return 0;
double s2 = Math.log(1 + (sd * sd) / (mean * mean));
double mu = Math.log(mean) - s2 / 2;
return Math.exp(mu + Math.sqrt(s2) * rng.nextGaussian());
//@end

//@fn int rPois(double lambda)
//@doc Poisson count (through goods trains per day, A-24).
if (lambda <= 0) return 0;
double L = Math.exp(-lambda), p = 1;
int k = 0;
do { k++; p *= rng.nextDouble(); } while (p > L);
return k - 1;
//@end

//@fn void setPhase(Rake r, int p, double endExpected)
//@doc Close the current cycle-time component of rake r and open component p (endExpected used by the animation).
double t = time();
if (r.phase >= 0) r.comp[r.phase] += t - r.phaseStart;
r.phase = p;
r.phaseStart = t;
r.phaseEnd = endExpected;
//@end

//@fn void initModel()
//@doc Start-up: read parameters (and scenario overrides), build timetable blockers, create rakes and crews.
rng = new java.util.Random(seed);
cFleet = fleetSize; cSidings = loadingSidings; cGgsLoops = ghugusLoops_A01; cTaeLoops = tadaliLoops_A02;
cTipplers = tipplersInService_A17; cCrewPool = crewPoolSize_A25; cPolicy = pathPolicy; cPhase = modelPhase;
cDoubled = lineDoubled_INF04; cRls = loadingByRLS_LD04; cLocalLobby = crewAtChandrapur_A06;
cAllowExt = allowDutyExtension_CR02; cAbsBlock = absoluteBlockTAE_CD_A23; cThroughPerDay = throughGoodsPerDay_A24;
applyScenario(scenario);
cCrewOn = cPhase >= 2;
cBpcOn = cPhase >= 3;
cTaeLoops = Math.max(2, cTaeLoops);   // one TAE loop is always kept for loaded rakes (deadlock rule)
cSidings = Math.max(1, Math.min(16, cSidings));
cTipplers = Math.max(1, Math.min(16, cTipplers));
for (int d = -1; d <= 2; d++) genDay(d);
lastGeneratedDay = 2;
for (int i = 0; i < cCrewPool; i++) { Crew c = new Crew(); c.id = i + 1; crews.add(c); }
stockKt = initialStock_kt;
for (int i = 0; i < cFleet; i++) {
    Rake r = new Rake();
    r.id = i + 1;
    r.loaded = false;
    r.loc = L_CD;
    r.bpcKm = rUnif(1500, bpcKm_BPC01);
    r.bpcDue = rUnif(1, bpcDays_BPC01) * 24;
    rakes.add(r);
    setPhase(r, P_RELEASE_CD, -1);
    // rakes start as released empties at CSTPS, staggered so they do not all start together
    schedAfter(i * 2.5, () -> releasedAtCD(r));
}
for (int d = 1; d <= 400; d++) {
    final int day = d;
    schedAt(day * 24.0, () -> dailyTick(day));
}
schedAt(warmupDays * 24.0, () -> resetStats());
// results are written at the end of the horizon (and, if the run is stopped early, on destroy)
schedAt((warmupDays + runDays) * 24.0 - 1e-6, () -> writeResults());
//@end

//@fn void applyScenario(int s)
//@doc Experiment presets E2-E7 (scenario 0 = use the parameter values as set).
switch (s) {
    case 1: cRls = true; break;                          // E2 RLS / silo loading
    case 2: cPolicy = 1; break;                          // E3 planned DN slot, crew ordered to match
    case 3: cPolicy = 2; break;                          // E3 priority to crews with < 2 h left
    case 4: cLocalLobby = true; break;                   // E4 crew booked at Chandrapur
    case 5: cDoubled = true; break;                      // E5 Ghugus-Tadali doubling
    case 6: cTipplers = 3; break;                        // E6
    case 7: cTipplers = 5; break;                        // E6
    case 8: cGgsLoops += 1; cTaeLoops += 1; break;       // E7 loops +20% (rounded up to +1)
    case 9: cCrewPool = (int) Math.ceil(cCrewPool * 1.2); break;   // E7 crew +20%
    case 10: cSidings += 1; break;                       // E7 loading sidings +1
    case 11: cThroughPerDay = 0; break;                  // sensitivity: no through goods on main line
    default: break;
}
//@end

//@fn void genDay(int d)
//@doc Build the blockers for day d: scheduled passenger trains on their days of run + lognormal lateness (A-21) + through goods trains (A-24).
int dow = ((d % 7) + 7) % 7;   // 0 = Monday
for (String row : TIMETABLE) {
    String[] f = row.split(",");
    boolean dn = f[0].equals("DN");
    if (f[2].charAt(dow) != '1') continue;
    double late = rLogn(latenessMean_A21, latenessSd_A21) / 60.0;
    double t = d * 24.0 + Integer.parseInt(f[1]) / 60.0 + late;
    insertBlocker(dn ? dnBlock : upBlock, new Blocker(t, B_PAX, f[3]));
}
for (int k = 0; k < 2; k++) {
    int n = rPois(cThroughPerDay);
    for (int j = 0; j < n; j++)
        insertBlocker(k == 0 ? dnBlock : upBlock, new Blocker(d * 24.0 + rUnif(0, 24), B_GOODS, "goods"));
}
//@end

//@fn void insertBlocker(java.util.ArrayList<Blocker> list, Blocker b)
//@doc Insert keeping the list sorted by passing time.
int lo = 0, hi = list.size();
while (lo < hi) { int m = (lo + hi) >>> 1; if (list.get(m).t <= b.t) lo = m + 1; else hi = m; }
list.add(lo, b);
//@end

//@fn double nextGap(java.util.ArrayList<Blocker> list, double t0, double gLead, double run)
//@doc Earliest t >= t0 with no train passing in (t - gLead, t + gTrail). gTrail adds the catch-up margin for a following passenger train when A-23 absolute block is on.
double t = t0;
double paxRun = mainKm_INF08 / 80.0;
double maxTrail = gLead + (cAbsBlock ? Math.max(0, run - paxRun) : 0);
int lo = 0, hi = list.size();
while (lo < hi) { int m = (lo + hi) >>> 1; if (list.get(m).t <= t - gLead) lo = m + 1; else hi = m; }
for (int i = lo; i < list.size(); i++) {
    Blocker b = list.get(i);
    if (b.t >= t + maxTrail) break;
    double trail = gLead + ((cAbsBlock && b.kind == B_PAX) ? Math.max(0, run - paxRun) : 0);
    if (b.t > t - gLead && b.t < t + trail) t = b.t + gLead;
}
return t;
//@end

//@fn void dailyTick(int day)
//@doc 00:00 every day: extend the timetable two days ahead, drop old blockers, update CSTPS coal stock.
while (lastGeneratedDay < day + 2) { lastGeneratedDay++; genDay(lastGeneratedDay); }
double cut = time() - 12;
while (!dnBlock.isEmpty() && dnBlock.get(0).t < cut) dnBlock.remove(0);
while (!upBlock.isEmpty() && upBlock.get(0).t < cut) upBlock.remove(0);
double burn = rTri(consumptionMin_kt, consumptionMode_kt, consumptionMax_kt);
stockKt += nonRailSupply_kt - burn;
if (time() >= statsStart && time() >= warmupDays * 24.0) {
    double days = stockKt / normativeDaily_kt;
    stockMinDays = Math.min(stockMinDays, days);
    if (days < 7) daysBelow7++;
}
//@end

//@fn void dispatch()
//@doc The section controller: keep allocating sidings, crews, the single line, CD departures, tipplers and the exam line until nothing more can move.
if (inDispatch) { dispatchAgain = true; return; }
inDispatch = true;
do {
    dispatchAgain = false;
    boolean p = true;
    while (p) {
        p = false;
        if (drawOutBlocked()) p = true;
        if (startLoading()) p = true;
        if (assignCrew()) p = true;
        if (allocLine()) p = true;
        if (departCD()) p = true;
        if (startTippler()) p = true;
        if (startExam()) p = true;
    }
} while (dispatchAgain);
inDispatch = false;
//@end

//@fn void arriveGGS(Rake r)
//@doc Empty rake arrives at Ghugus (it already holds a GGS loop). Closes the previous cycle and starts a new one.
if (r.cycleStart >= 0) closeCycle(r);
r.cycleStart = time();
r.cycleNo++;
java.util.Arrays.fill(r.comp, 0);
java.util.Arrays.fill(r.stamp, -1);
r.stamp[S_ARR_GGS] = time();
r.bpcThisCycle = false;
r.reliefThisCycle = false;
r.loaded = false;
r.loc = L_GGS;
setPhase(r, P_PLACE_GGS, -1);
schedAfter(rTri(placeLoadMin_A13, placeLoadMode_A13, placeLoadMax_A13), () -> {
    setPhase(r, P_WAIT_SIDING, -1);
    qSiding.add(r);
    dispatch();
});
//@end

//@fn boolean startLoading()
//@doc Place the first waiting empty on a free loading siding (CHP) and start loading.
if (qSiding.isEmpty() || sidingsBusy >= cSidings) return false;
Rake r = qSiding.remove(0);
int k = 0;
while (sidingUsed[k]) k++;
sidingUsed[k] = true;
sidingsBusy++;
r.sidingNo = k;
r.onSiding = true;
if (r.holdsGgsLoop) { r.holdsGgsLoop = false; ggsLoopUsed--; }
r.placedAt = time();
r.stamp[S_PLACED] = time();
r.stamp[S_LOAD_START] = time();
double lt = cRls ? rTri(loadRlsMin_LD04, loadRlsMode_LD04, loadRlsMax_LD04)
                 : rTri(loadMin_LD03, loadMode_LD03, loadMax_LD03);
setPhase(r, P_LOAD, time() + lt);
schedAfter(lt, () -> loadDone(r));
return true;
//@end

//@fn void loadDone(Rake r)
//@doc Loading finished = release. Demurrage on placement->release over FT-01. Rake is drawn out to a GGS loop if one is free, else it is prepared on the siding (blocking it).
r.loaded = true;
r.stamp[S_LOAD_END] = time();
r.stamp[S_RELEASED] = time();
chargeDemurrage(time() - r.placedAt, freeTimeLoad_FT01, true);
if (ggsLoopUsed < cGgsLoops) { ggsLoopUsed++; r.holdsGgsLoop = true; releaseSiding(r); }
setPhase(r, P_READY_GGS, -1);
schedAfter(rTri(readyMin_A14, readyMode_A14, readyMax_A14), () -> readyGGS(r));
dispatch();
//@end

//@fn void releaseSiding(Rake r)
//@doc Free the loading siding held by rake r.
if (r.sidingNo >= 0) { sidingUsed[r.sidingNo] = false; sidingsBusy--; }
r.sidingNo = -1;
r.onSiding = false;
//@end

//@fn boolean drawOutBlocked()
//@doc A loaded rake still standing on a siding is drawn out to a GGS loop as soon as one frees, so the siding can take the next empty.
if (ggsLoopUsed >= cGgsLoops) return false;
for (Rake r : rakes) {
    if (r.loaded && r.onSiding && r.loc == L_GGS && r.phase != P_LOAD) {
        ggsLoopUsed++;
        r.holdsGgsLoop = true;
        releaseSiding(r);
        return true;
    }
}
return false;
//@end

//@fn void readyGGS(Rake r)
//@doc Loaded rake ready to leave Ghugus (A-14 done): ask for a crew. Policy 1 first plans the DN path at Tadali and orders the crew to match it.
r.stamp[S_LOCO] = time();
if (cPolicy == 1 && cCrewOn) {
    double lead = expectedCrewLead(true);
    double spur = spurOccMode_A04 / 60.0;
    double run = mainKm_INF08 / mainSpeedMode_A03;
    double slot = nextGap(dnBlock, time() + lead + spur, mergeGapMode_A05 / 60.0, run);
    double orderAt = Math.max(time(), slot - spur - 0.25 - lead);
    setPhase(r, P_WAIT_PATH_GGS, -1);
    schedAt(orderAt, () -> requestCrew(r));
} else {
    requestCrew(r);
}
//@end

//@fn double expectedCrewLead(boolean toGhugus)
//@doc Mean sign-on + travel time of a crew from the booking lobby to the train.
double signOn = (signOnMin_A08 + signOnMode_A08 + signOnMax_A08) / 3.0;
if (toGhugus) return signOn + (cLocalLobby ? localLobbyTravel_A06 : (travelMin_A07 + travelMode_A07 + travelMax_A07) / 3.0);
return signOn + (cLocalLobby ? 0.25 : (travelCdMin_A26 + travelCdMode_A26 + travelCdMax_A26) / 3.0);
//@end

//@fn void requestCrew(Rake r)
//@doc Queue rake r for a crew from the lobby pool (phase 1: crew always available, no clock).
if (!cCrewOn) { crewReady(r); return; }
setPhase(r, r.loaded ? P_WAIT_CREW_L : P_WAIT_CREW_E, -1);
qCrew.add(r);
dispatch();
//@end

//@fn boolean assignCrew()
//@doc Give the next waiting rake a free crew. Duty clock starts at sign-on in the lobby (CR-01..CR-05).
if (qCrew.isEmpty()) return false;
Crew c = null;
for (Crew x : crews) if (!x.busy) { c = x; break; }
if (c == null) return false;
Rake r = qCrew.remove(0);
c.busy = true;
c.rake = r;
c.signOn = time();
c.extended = false;
c.dutyNo++;
r.crew = c;
if (r.stamp[S_CREW] < 0) r.stamp[S_CREW] = time();
double lead;
if (r.needRelief) lead = rTri(reliefMin_A09, reliefMode_A09, reliefMax_A09);
else {
    lead = rTri(signOnMin_A08, signOnMode_A08, signOnMax_A08);
    if (r.loaded) lead += cLocalLobby ? localLobbyTravel_A06 : rTri(travelMin_A07, travelMode_A07, travelMax_A07);
    else lead += cLocalLobby ? 0.25 : rTri(travelCdMin_A26, travelCdMode_A26, travelCdMax_A26);
}
final Crew cc = c;
final int duty = c.dutyNo;
// 2 h notice point (CR-02): if the crew is still on this trip, the controller gives notice -> limit becomes 11 h
schedAfter(dutyLimit_CR01 - noticeHours_CR02, () -> {
    if (cc.dutyNo == duty && cc.rake != null && cAllowExt && !cc.extended) { cc.extended = true; extensions++; }
});
schedAfter(dutyLimit_CR01, () -> expiryCheck(cc, duty));
schedAfter(extendedLimit_CR02, () -> expiryCheck(cc, duty));
crewTrips++;
schedAfter(lead, () -> crewReady(r));
return true;
//@end

//@fn void crewReady(Rake r)
//@doc Crew is on the train: resume according to where the rake stands.
r.needRelief = false;
if (r.loc == L_GGS) { setPhase(r, P_WAIT_PATH_GGS, -1); qDepartGGS.add(r); }
else if (r.loc == L_TAE && r.loaded) { planMerge(r); }
else if (r.loc == L_TAE) { setPhase(r, P_WAIT_LINE_TAE, -1); qLineTAE.add(r); }
else { planDepartCD(r); }
dispatch();
//@end

//@fn double dutyLimitFor(Crew c)
//@doc Latest time crew c may still be working: 9 h, or 11 h if notice was / can still be given 2 h before expiry.
if (c == null) return Double.POSITIVE_INFINITY;
if (c.extended) return c.signOn + extendedLimit_CR02;
if (cAllowExt && time() <= c.signOn + dutyLimit_CR01 - noticeHours_CR02 + 1e-9) return c.signOn + extendedLimit_CR02;
return c.signOn + dutyLimit_CR01;
//@end

//@fn void expiryCheck(Crew c, int duty)
//@doc Duty limit reached while the train is standing: stable it and ask for relief (A-09).
if (c.dutyNo != duty || c.rake == null) return;
Rake r = c.rake;
if (r.phase == P_SPUR_L || r.phase == P_SPUR_E || r.phase == P_MAIN_L || r.phase == P_MAIN_E) return;
if (time() + 1e-9 >= dutyLimitFor(c)) relieve(r);
//@end

//@fn void relieve(Rake r)
//@doc Crew signs off where the train stands; cancel its planned path; request a relief crew (A-09).
Crew c = r.crew;
if (c == null) return;
signOff(c, r.loc);
r.crew = null;
r.token++;
reliefEvents++;
r.reliefThisCycle = true;
if (r.planned != null) { (r.loaded ? dnBlock : upBlock).remove(r.planned); r.planned = null; }
qDepartGGS.remove(r);
qLineTAE.remove(r);
qDepartCD.remove(r);
r.needRelief = true;
setPhase(r, P_WAIT_RELIEF, -1);
qCrew.add(r);
dispatch();
//@end

//@fn void signOff(Crew c, int where)
//@doc Crew signs off; returns to the Balharshah lobby and takes HQ rest (CR-04: 12 h after < 8 h duty, 16 h after >= 8 h).
double duty = time() - c.signOn;
dutySum += duty;
if (c.rake != null && c.rake.loaded && where == L_CD) c.rake.crewHoursLoaded = duty;
c.rake = null;
c.dutyNo++;
double back = where == L_GGS ? (cLocalLobby ? localLobbyTravel_A06 : rTri(travelMin_A07, travelMode_A07, travelMax_A07))
                             : (cLocalLobby ? 0.25 : rTri(travelCdMin_A26, travelCdMode_A26, travelCdMax_A26));
double rest = duty >= 8 ? hqRestLong_CR04 : hqRestShort_CR04;
final Crew cc = c;
schedAfter(back + rest, () -> { cc.busy = false; dispatch(); });
//@end

//@fn boolean allocLine()
//@doc Single-line controller (A-22): loaded rakes from GGS first (needs a TAE loop), then empties from TAE (needs a GGS loop). Doubling (E5) gives each direction its own line.
// loaded GGS -> TAE
if (!lineBusyDN && !(!cDoubled && lineBusyUP) && !qDepartGGS.isEmpty() && taeLoopLoaded + taeLoopEmpty < cTaeLoops) {
    Rake r = pickLoaded();
    boolean emptyFirst = false;
    if (cPolicy == 2 && !cDoubled && !qLineTAE.isEmpty() && ggsLoopUsed < cGgsLoops) {
        Rake e = qLineTAE.get(0);
        emptyFirst = crewLeft(e) < 2 && crewLeft(r) >= 2;
    }
    if (!emptyFirst) {
        double occ = rTri(spurOccMin_A04, spurOccMode_A04, spurOccMax_A04) / 60.0;
        if (cCrewOn && time() + occ > dutyLimitFor(r.crew)) { relieve(r); return true; }
        qDepartGGS.remove(r);
        lineBusyDN = true;
        taeLoopLoaded++;
        r.holdsTaeLoop = true;
        if (r.onSiding) releaseSiding(r);
        if (r.holdsGgsLoop) { r.holdsGgsLoop = false; ggsLoopUsed--; }
        r.bpcKm -= spurKm_INF01;
        r.loc = L_SPUR;
        r.stamp[S_DEP_GGS] = time();
        setPhase(r, P_SPUR_L, time() + occ);
        schedAfter(occ, () -> {
            lineBusyDN = false;
            r.loc = L_TAE;
            r.stamp[S_ARR_TAE] = time();
            planMerge(r);
            dispatch();
        });
        return true;
    }
}
// empty TAE -> GGS
if (!lineBusyUP && !(!cDoubled && lineBusyDN) && !qLineTAE.isEmpty() && ggsLoopUsed < cGgsLoops) {
    Rake r = qLineTAE.get(0);
    double occ = rTri(spurOccMin_A04, spurOccMode_A04, spurOccMax_A04) / 60.0;
    if (cCrewOn && time() + occ > dutyLimitFor(r.crew)) { relieve(r); return true; }
    qLineTAE.remove(0);
    lineBusyUP = true;
    ggsLoopUsed++;
    r.holdsGgsLoop = true;
    taeLoopEmpty--;
    r.holdsTaeLoop = false;
    r.bpcKm -= spurKm_INF01;
    r.loc = L_SPUR;
    setPhase(r, P_SPUR_E, time() + occ);
    schedAfter(occ, () -> {
        lineBusyUP = false;
        if (r.crew != null) signOff(r.crew, L_GGS);
        r.crew = null;
        arriveGGS(r);
        dispatch();
    });
    return true;
}
return false;
//@end

//@fn Rake pickLoaded()
//@doc Which loaded rake at GGS goes first: FCFS, or (policy 2) the one whose crew has least duty left.
Rake best = qDepartGGS.get(0);
if (cPolicy == 2) for (Rake r : qDepartGGS) if (crewLeft(r) < crewLeft(best)) best = r;
return best;
//@end

//@fn double crewLeft(Rake r)
//@doc Hours of duty left for the crew on rake r.
if (r == null || r.crew == null) return 99;
return dutyLimitFor(r.crew) - time();
//@end

//@fn void planMerge(Rake r)
//@doc Loaded rake in a TAE loop: find the first DN path with gap A-05 either side of every passenger/goods train and reserve it.
setPhase(r, P_WAIT_MERGE_DN, -1);
double run = mainKm_INF08 / rTri(mainSpeedMin_A03, mainSpeedMode_A03, mainSpeedMax_A03);
double g = rTri(mergeGapMin_A05, mergeGapMode_A05, mergeGapMax_A05) / 60.0;
double t = nextGap(dnBlock, time(), g, run);
// the crew cannot reach CSTPS inside its duty: relief is ordered now, the train waits in the loop
if (cCrewOn && t + run > dutyLimitFor(r.crew)) { relieve(r); return; }
Blocker b = new Blocker(t, B_OWN, "Rake " + r.id);
insertBlocker(dnBlock, b);
r.planned = b;
final int tok = r.token;
schedAt(t, () -> { if (r.token == tok) mergeDN(r, run); });
//@end

//@fn void mergeDN(Rake r, double run)
//@doc Rake leaves the TAE loop onto the DN main line and runs ~13 km to CD/CSTPS.
r.planned = null;
taeLoopLoaded--;
r.holdsTaeLoop = false;
mergeWaitSum += time() - r.phaseStart;
mergeCount++;
r.bpcKm -= mainKm_INF08;
r.loc = L_MAIN;
r.stamp[S_DEP_TAE] = time();
setPhase(r, P_MAIN_L, time() + run);
schedAfter(run, () -> arriveCSTPS(r));
dispatch();
//@end

//@fn void arriveCSTPS(Rake r)
//@doc Loaded rake reaches CSTPS: crew signs off, railway places the rake (A-15); free time FT-02 runs from placement.
r.loc = L_CD;
r.stamp[S_ARR_CD] = time();
if (r.crew != null) signOff(r.crew, L_CD);
r.crew = null;
setPhase(r, P_PLACE_CD, -1);
schedAfter(rTri(placeUnloadMin_A15, placeUnloadMode_A15, placeUnloadMax_A15), () -> {
    r.placedAt = time();
    r.stamp[S_PLACED_TIP] = time();
    if (time() >= statsStart) { delivered++; tonnes += payload_t; deliveryTimes.add(time()); }
    setPhase(r, P_WAIT_TIPPLER, -1);
    qTippler.add(r);
    dispatch();
});
//@end

//@fn boolean startTippler()
//@doc Next placed rake goes to a free tippler (A-17 in service).
if (qTippler.isEmpty() || tipplersBusy >= cTipplers) return false;
Rake r = qTippler.remove(0);
int k = 0;
while (tipplerUsed[k]) k++;
tipplerUsed[k] = true;
tipplersBusy++;
r.tipplerNo = k;
r.stamp[S_UNLOAD_START] = time();
double ut = rTri(unloadMin_UL02, unloadMode_UL02, unloadMax_UL02);
setPhase(r, P_UNLOAD, time() + ut);
schedAfter(ut, () -> unloadDone(r));
return true;
//@end

//@fn void unloadDone(Rake r)
//@doc Tippling finished: coal into CSTPS stock, demurrage on placement->release over FT-02, then A-16 release->despatch.
tipplerUsed[r.tipplerNo] = false;
tipplersBusy--;
r.tipplerNo = -1;
r.loaded = false;
stockKt += payload_t / 1000.0;
r.stamp[S_UNLOAD_END] = time();
r.stamp[S_REL_EMPTY] = time();
chargeDemurrage(time() - r.placedAt, freeTimeUnload_FT02, false);
setPhase(r, P_RELEASE_CD, -1);
schedAfter(rTri(releaseMin_A16, releaseMode_A16, releaseMax_A16), () -> releasedAtCD(r));
dispatch();
//@end

//@fn void releasedAtCD(Rake r)
//@doc Empty ready at CSTPS: divert to the BPC exam if due (phase 3), otherwise ask for a crew.
r.loc = L_CD;
r.loaded = false;
if (cBpcOn && (time() >= r.bpcDue - bpcLookaheadDays * 24 || r.bpcKm < 2 * (spurKm_INF01 + mainKm_INF08) + 2 * depotKm_A10)) {
    goBpc(r);
    return;
}
setPhase(r, P_WAIT_PATH_CD, -1);
qDepartCD.add(r);
dispatch();
//@end

//@fn boolean departCD()
//@doc Controller orders the next empty out of CSTPS only when a TAE loop (not the one kept for loaded rakes) is free and, if A-27, Ghugus has a free loop; then the crew is booked.
if (qDepartCD.isEmpty()) return false;
if (taeLoopLoaded + taeLoopEmpty >= cTaeLoops || taeLoopEmpty >= cTaeLoops - 1) return false;
if (controllerHoldsEmptiesAtCD_A27 && ggsLoopUsed >= cGgsLoops) return false;
Rake r = qDepartCD.remove(0);
taeLoopEmpty++;
r.taeLoopReserved = true;
requestCrew(r);
return true;
//@end

//@fn void planDepartCD(Rake r)
//@doc Empty at CD with crew and a reserved TAE loop: take the first UP path with gap A-05 and run to Tadali.
setPhase(r, P_WAIT_PATH_CD, -1);
double run = mainKm_INF08 / rTri(mainSpeedMin_A03, mainSpeedMode_A03, mainSpeedMax_A03);
double g = rTri(mergeGapMin_A05, mergeGapMode_A05, mergeGapMax_A05) / 60.0;
double t = nextGap(upBlock, time(), g, run);
if (cCrewOn && t + run > dutyLimitFor(r.crew)) { relieve(r); return; }
Blocker b = new Blocker(t, B_OWN, "Rake " + r.id);
insertBlocker(upBlock, b);
r.planned = b;
final int tok = r.token;
schedAt(t, () -> {
    if (r.token != tok) return;
    r.planned = null;
    r.taeLoopReserved = false;
    r.holdsTaeLoop = true;
    r.bpcKm -= mainKm_INF08;
    r.loc = L_MAIN;
    r.stamp[S_DEP_CD] = time();
    setPhase(r, P_MAIN_E, time() + run);
    schedAfter(run, () -> {
        r.loc = L_TAE;
        setPhase(r, P_WAIT_LINE_TAE, -1);
        qLineTAE.add(r);
        dispatch();
    });
});
//@end

//@fn void goBpc(Rake r)
//@doc BPC detour (phase 3): empty runs CD -> Balharshah depot (A-10), waits for placement (A-11), then the 8 h intensive exam (A-12) in daylight only.
r.bpcThisCycle = true;
if (time() >= statsStart) bpcDetours++;
r.loc = L_DEPOT;
setPhase(r, P_BPC, -1);
r.bpcKm -= depotKm_A10;
double travel = depotKm_A10 / rTri(mainSpeedMin_A03, mainSpeedMode_A03, mainSpeedMax_A03) + depotPathWait_A10;
schedAfter(travel + rTri(examWaitMin_A11, examWaitMode_A11, examWaitMax_A11), () -> { qExam.add(r); dispatch(); });
//@end

//@fn boolean startExam()
//@doc One examination line at the depot (capacity 1).
if (examBusy || qExam.isEmpty()) return false;
Rake r = qExam.remove(0);
examBusy = true;
if (time() > r.bpcDue + bpcGraceDays * 24 && time() >= statsStart) bpcOverdue++;
examWork(r, rTri(examMin_A12, examMode_A12, examMax_A12));
return true;
//@end

//@fn void examWork(Rake r, double remaining)
//@doc Exam work only progresses between examOpenHour and examCloseHour (BPC-03 daylight window).
double h = time() % 24;
if (h < examOpenHour - 1e-6) { schedAfter(examOpenHour - h, () -> examWork(r, remaining)); return; }
if (h >= examCloseHour - 1e-6) { schedAfter(24 - h + examOpenHour, () -> examWork(r, remaining)); return; }
double can = examCloseHour - h;
if (remaining <= can) {
    schedAfter(remaining, () -> {
        examBusy = false;
        r.bpcKm = bpcKm_BPC01;
        r.bpcDue = time() + bpcDays_BPC01 * 24;
        double back = depotKm_A10 / rTri(mainSpeedMin_A03, mainSpeedMode_A03, mainSpeedMax_A03) + depotPathWait_A10;
        r.bpcKm -= depotKm_A10;
        schedAfter(back, () -> { r.loc = L_CD; setPhase(r, P_WAIT_PATH_CD, -1); qDepartCD.add(r); dispatch(); });
        dispatch();
    });
} else {
    schedAfter(can, () -> examWork(r, remaining - can));
}
//@end

//@fn void chargeDemurrage(double hours, double freeTime, boolean loading)
//@doc DM-01: Rs/wagon/hour or part over free time, graded slabs (+10% 6-12 h, +25% 12-24 h, +50% 24-48 h, 2x 48-72 h, 3x > 72 h).
if (time() < statsStart) return;
if (loading) loadEnds++; else unloadEnds++;
double over = hours - freeTime;
if (over <= 1e-9) return;
if (loading) loadOverFree++; else unloadOverFree++;
int h = (int) Math.ceil(over - 1e-9);
double rs = 0;
for (int k = 1; k <= h; k++) {
    double m = k <= 6 ? 1.0 : k <= 12 ? 1.10 : k <= 24 ? 1.25 : k <= 48 ? 1.5 : k <= 72 ? 2.0 : 3.0;
    rs += demurrageRate_DM01 * wagonsPerRake * m;
}
demurrageRs += rs;
demurrageHours += h;
if (loading) demurrageLoadRs += rs; else demurrageUnloadRs += rs;
//@end

//@fn void closeCycle(Rake r)
//@doc A rake is back at Ghugus: record the cycle (if it started after warm-up) and write a RAKE_cycle_log row.
setPhase(r, r.phase, -1);
double ct = time() - r.cycleStart;
if (r.cycleStart >= statsStart && statsStart > 0) {
    cyclesDone++;
    sumCycle += ct;
    sumCycleSq += ct * ct;
    for (int k = 0; k < NPH; k++) compSum[k] += r.comp[k];
    if (r.reliefThisCycle) reliefCycles++;
    if (r.bpcThisCycle) bpcCycles++;
}
if (writeCycleLog) {
    StringBuilder sb = new StringBuilder();
    sb.append(String.format("CC-%02d,%d", r.id, r.cycleNo));
    int[] cols = { S_ARR_GGS, S_PLACED, S_LOAD_START, S_LOAD_END, S_RELEASED, S_LOCO, S_CREW, S_DEP_GGS,
                   S_ARR_TAE, S_DEP_TAE, S_ARR_CD, S_PLACED_TIP, S_UNLOAD_START, S_UNLOAD_END, S_REL_EMPTY, S_DEP_CD };
    for (int k : cols) sb.append(',').append(r.stamp[k] < 0 ? "" : stampText(r.stamp[k]));
    sb.append(String.format(java.util.Locale.US, ",%.0f,%.1f,%.2f,%s,sim seed %d phase %d scenario %d",
        r.bpcKm, (r.bpcDue - time()) / 24, r.crewHoursLoaded,
        (r.reliefThisCycle ? "crew relief " : "") + (r.bpcThisCycle ? "BPC detour" : ""), seed, cPhase, scenario));
    cycleLog.add(sb.toString());
}
//@end

//@fn String stampText(double t)
//@doc Model hours -> "yyyy-MM-dd HH:mm" (day 0 = 2026-10-05).
java.time.LocalDateTime d = java.time.LocalDateTime.of(2026, 10, 5, 0, 0).plusSeconds(Math.round(t * 3600));
return String.format("%04d-%02d-%02d %02d:%02d", d.getYear(), d.getMonthValue(), d.getDayOfMonth(), d.getHour(), d.getMinute());
//@end

//@fn void touchStats()
//@doc Time-weighted utilisation integrals (called before every kernel event).
double t = time();
double dt = t - lastTouch;
if (dt > 0 && t > statsStart) {
    areaLineDN += (lineBusyDN ? 1 : 0) * dt;
    areaLineUP += (lineBusyUP ? 1 : 0) * dt;
    areaSidings += sidingsBusy * dt;
    areaTipplers += tipplersBusy * dt;
    areaGgsLoops += ggsLoopUsed * dt;
    areaTaeLoops += (taeLoopLoaded + taeLoopEmpty) * dt;
    int onDuty = 0;
    for (Crew c : crews) if (c.rake != null) onDuty++;
    areaCrewOnDuty += onDuty * dt;
}
lastTouch = t;
//@end

//@fn void resetStats()
//@doc End of warm-up (3 days): zero every statistic.
statsStart = time();
lastTouch = time();
delivered = 0; cyclesDone = 0; reliefEvents = 0; extensions = 0; bpcDetours = 0; bpcOverdue = 0; crewTrips = 0;
loadOverFree = 0; unloadOverFree = 0; loadEnds = 0; unloadEnds = 0;
tonnes = 0; sumCycle = 0; sumCycleSq = 0; demurrageRs = 0; demurrageLoadRs = 0; demurrageUnloadRs = 0; demurrageHours = 0;
java.util.Arrays.fill(compSum, 0);
areaLineDN = 0; areaLineUP = 0; areaSidings = 0; areaTipplers = 0; areaGgsLoops = 0; areaTaeLoops = 0; areaCrewOnDuty = 0;
mergeWaitSum = 0; mergeCount = 0; dutySum = 0; reliefCycles = 0; bpcCycles = 0;
deliveryTimes.clear();
stockMinDays = stockKt / normativeDaily_kt;
daysBelow7 = 0;
//@end

//@fn double statHours()
//@doc Length of the statistics window so far (hours).
return Math.max(1e-9, time() - statsStart);
//@end

//@fn double rakesPerDay()
//@doc KPI 2: loaded rakes placed at CSTPS per day after warm-up.
return statsStart <= 0 ? 0 : delivered / (statHours() / 24.0);
//@end

//@fn double meanCycle()
//@doc KPI 1: mean rake cycle time (h), GGS arrival to next GGS arrival.
return cyclesDone == 0 ? 0 : sumCycle / cyclesDone;
//@end

//@fn double compMean(int k)
//@doc Mean hours per cycle spent in component k.
return cyclesDone == 0 ? 0 : compSum[k] / cyclesDone;
//@end

//@fn double groupMean(int g)
//@doc Mean hours per cycle in KPI group g (bar chart).
double s = 0;
for (int k = 0; k < NPH; k++) if (PH_GROUP[k] == g) s += compMean(k);
return s;
//@end

//@fn double lineUtil()
//@doc KPI 3: single-line occupancy (both directions; 0..1 for a single line).
return statsStart <= 0 ? 0 : (areaLineDN + areaLineUP) / statHours() / (cDoubled ? 2 : 1);
//@end

//@fn double tipplerUtil()
//@doc KPI 3: tippler utilisation.
return statsStart <= 0 ? 0 : areaTipplers / statHours() / cTipplers;
//@end

//@fn double sidingUtil()
//@doc KPI 3: loading-siding occupancy (loading + loaded rakes standing on the siding).
return statsStart <= 0 ? 0 : areaSidings / statHours() / cSidings;
//@end

//@fn double demurragePerRake()
//@doc KPI 4: demurrage Rs per delivered rake (both ends).
return delivered == 0 ? 0 : demurrageRs / delivered;
//@end

//@fn double shareRelief()
//@doc KPI 5: share of completed cycles with a crew-expired stabling.
return cyclesDone == 0 ? 0 : (double) reliefCycles / cyclesDone;
//@end

//@fn double shareBpc()
//@doc KPI 5: share of completed cycles with a BPC exam detour.
return cyclesDone == 0 ? 0 : (double) bpcCycles / cyclesDone;
//@end

//@fn double stockDays()
//@doc KPI 6: CSTPS coal stock in days of normative requirement.
return stockKt / normativeDaily_kt;
//@end

//@fn double deliveredLast24h()
//@doc Rolling count of rakes placed at CSTPS in the last 24 h (time plot).
int n = 0;
for (int i = deliveryTimes.size() - 1; i >= 0 && deliveryTimes.get(i) > time() - 24; i--) n++;
return n;
//@end

//@fn String kpiText()
//@doc The KPI panel on the Main view.
String s = String.format(java.util.Locale.US,
    "Day %.1f   %s   (stats from day %.0f)\n\n" +
    "Rakes placed at CSTPS   %d   =  %.2f rakes/day   (%.1f kt/day)\n" +
    "Mean cycle time         %.1f h   over %d cycles\n" +
    "Single line busy        %.0f %%     Sidings busy %.0f %%     Tipplers busy %.0f %%\n" +
    "Mean wait for DN path   %.2f h at Tadali\n" +
    "Demurrage               Rs %.0f per rake  (loading %d/%d over FT, unloading %d/%d)\n" +
    "Crew relief cycles      %.0f %%   duty extensions %d\n" +
    "BPC detour cycles       %.0f %%   overdue exams %d\n" +
    "CSTPS stock             %.1f days  (min %.1f, days below 7: %d)",
    time() / 24, stampText(time()), statsStart / 24,
    delivered, rakesPerDay(), rakesPerDay() * payload_t / 1000,
    meanCycle(), cyclesDone,
    100 * lineUtil(), 100 * sidingUtil(), 100 * tipplerUtil(),
    mergeCount == 0 ? 0 : mergeWaitSum / mergeCount,
    demurragePerRake(), loadOverFree, loadEnds, unloadOverFree, unloadEnds,
    100 * shareRelief(), extensions,
    100 * shareBpc(), bpcOverdue,
    stockDays(), stockMinDays == Double.POSITIVE_INFINITY ? stockDays() : stockMinDays, daysBelow7);
return s;
//@end

//@fn String decompText()
//@doc Cycle-time decomposition table (KPI 1).
StringBuilder sb = new StringBuilder("Where a rake loses time (mean h per cycle)\n");
for (int k = 0; k < NPH; k++)
    sb.append(String.format(java.util.Locale.US, "%-30s %6.2f\n", PH_NAME[k], compMean(k)));
sb.append(String.format(java.util.Locale.US, "%-30s %6.2f", "TOTAL cycle", meanCycle()));
return sb.toString();
//@end

//@fn String nextTrainsText()
//@doc Next DN passings at Tadali and UP departures from Chandrapur (passenger + goods + own rakes).
StringBuilder sb = new StringBuilder("Next DN at Tadali            Next UP at Chandrapur\n");
java.util.ArrayList<String> a = new java.util.ArrayList<String>(), b = new java.util.ArrayList<String>();
for (Blocker x : dnBlock) if (x.t >= time() && a.size() < 6) a.add(blockerText(x));
for (Blocker x : upBlock) if (x.t >= time() && b.size() < 6) b.add(blockerText(x));
for (int i = 0; i < 6; i++)
    sb.append(String.format("%-29s%s\n", i < a.size() ? a.get(i) : "", i < b.size() ? b.get(i) : ""));
return sb.toString();
//@end

//@fn String blockerText(Blocker x)
//@doc One line of the next-trains board.
int m = (int) Math.round((x.t % 24) * 60) % 1440;
return String.format("%02d:%02d %s", m / 60, m % 60, x.kind == B_PAX ? x.label : x.kind == B_GOODS ? "goods" : x.label);
//@end

//@fn Rake rakeAt(int i)
//@doc Animation helper: rake with index i, or null.
return i < rakes.size() ? rakes.get(i) : null;
//@end

//@fn double rakeProgress(Rake r)
//@doc 0..1 progress through a moving phase.
if (r.phaseEnd <= r.phaseStart) return 1;
return Math.max(0, Math.min(1, (time() - r.phaseStart) / (r.phaseEnd - r.phaseStart)));
//@end

//@fn int slotOf(Rake r, int kind)
//@doc Animation helper: position of r among rakes standing in the same place.
int n = 0;
for (Rake x : rakes) {
    if (x == r) return n;
    if (kind == 0 && x.loc == L_GGS && x.holdsGgsLoop) n++;
    if (kind == 1 && x.loc == L_TAE) n++;
    if (kind == 2 && x.loc == L_CD && x.phase != P_UNLOAD) n++;
    if (kind == 3 && x.loc == L_DEPOT) n++;
}
return n;
//@end

//@fn double rakeX(int i)
//@doc Animation: x of rake i.
Rake r = rakeAt(i);
if (r == null) return -1000;
switch (r.phase) {
    case P_SPUR_L: return X_GGS + rakeProgress(r) * (X_TAE - X_GGS);
    case P_SPUR_E: return X_TAE - rakeProgress(r) * (X_TAE - X_GGS);
    case P_MAIN_L: return X_DN - 6;
    case P_MAIN_E: return X_UP - 6;
    case P_UNLOAD: return 1090 + r.tipplerNo * 52;
    default: break;
}
if (r.loc == L_GGS) return 150;
if (r.loc == L_TAE) return 880;
if (r.loc == L_DEPOT) return 1090 + (slotOf(r, 3) % 5) * 52;
return 1090 + (slotOf(r, 2) % 5) * 52;
//@end

//@fn double rakeY(int i)
//@doc Animation: y of rake i.
Rake r = rakeAt(i);
if (r == null) return -1000;
switch (r.phase) {
    case P_SPUR_L: return Y_SPUR - 12;
    case P_SPUR_E: return Y_SPUR + 4;
    case P_MAIN_L: return Y_TAE + rakeProgress(r) * (Y_CD - Y_TAE);
    case P_MAIN_E: return Y_CD - rakeProgress(r) * (Y_CD - Y_TAE);
    case P_UNLOAD: return 706;
    default: break;
}
if (r.loc == L_GGS) {
    if (r.onSiding && r.sidingNo >= 0) return 404 + r.sidingNo * 28;
    return 284 + slotOf(r, 0) * 28;
}
if (r.loc == L_TAE) return 176 + slotOf(r, 1) * 22;
if (r.loc == L_DEPOT) return 866 + (slotOf(r, 3) / 5) * 22;
return 566 + (slotOf(r, 2) / 5) * 22;
//@end

//@fn boolean rakeVertical(int i)
//@doc Rakes on the main line are drawn upright.
Rake r = rakeAt(i);
return r != null && (r.phase == P_MAIN_L || r.phase == P_MAIN_E);
//@end

//@fn java.awt.Color rakeColor(int i)
//@doc Loaded = coal black, empty = wagon brown, crew relief = red, BPC = orange.
Rake r = rakeAt(i);
if (r == null) return java.awt.Color.LIGHT_GRAY;
if (r.phase == P_WAIT_RELIEF) return new java.awt.Color(200, 40, 40);
if (r.phase == P_BPC) return new java.awt.Color(240, 150, 30);
return r.loaded ? new java.awt.Color(40, 40, 40) : new java.awt.Color(176, 128, 80);
//@end

//@fn String rakeLabel(int i)
//@doc Short label: rake number and phase code.
Rake r = rakeAt(i);
if (r == null) return "";
return "R" + r.id;
//@end

//@fn double paxY(int k, boolean dn)
//@doc Animation: y of the k-th passenger/goods train currently near the TAE-CD stretch (or -1000).
java.util.ArrayList<Blocker> list = dn ? dnBlock : upBlock;
int n = 0;
for (Blocker b : list) {
    if (b.kind == B_OWN) continue;
    double age = time() - b.t;     // hours since passing TAE (DN) / leaving CD (UP)
    if (age < -0.12 || age > 0.17) continue;
    if (n++ == k) return dn ? Y_TAE + age * 2000 : Y_CD - age * 2000;
}
return -1000;
//@end

//@fn java.awt.Color paxColor(int k, boolean dn)
//@doc Passenger trains blue, through goods grey.
java.util.ArrayList<Blocker> list = dn ? dnBlock : upBlock;
int n = 0;
for (Blocker b : list) {
    if (b.kind == B_OWN) continue;
    double age = time() - b.t;
    if (age < -0.12 || age > 0.17) continue;
    if (n++ == k) return b.kind == B_PAX ? new java.awt.Color(30, 90, 200) : java.awt.Color.GRAY;
}
return java.awt.Color.GRAY;
//@end

//@fn String resourceText()
//@doc Live occupancy of the constrained resources.
return String.format("GGS loops %d/%d   sidings %d/%d   single line %s%s   TAE loops %d/%d   tipplers %d/%d   crews free %d/%d   exam line %s",
    ggsLoopUsed, cGgsLoops, sidingsBusy, cSidings,
    lineBusyDN ? "DN busy" : (lineBusyUP && !cDoubled ? "UP busy" : "free"), cDoubled ? (lineBusyUP ? " / UP busy" : " / UP free") : "",
    taeLoopLoaded + taeLoopEmpty, cTaeLoops, tipplersBusy, cTipplers, freeCrews(), cCrewPool, examBusy ? "busy" : "free");
//@end

//@fn int freeCrews()
//@doc Crews resting-complete and available at the lobby.
int n = 0;
for (Crew c : crews) if (!c.busy) n++;
return n;
//@end

//@fn void writeResults()
//@doc At the end of a run: append one KPI row to RakeFlow_runs.csv and write the per-cycle log (RAKE_cycle_log format).
if (resultsWritten) return;
resultsWritten = true;
try {
    java.io.File f = new java.io.File("RakeFlow_runs.csv");
    boolean header = !f.exists();
    java.io.PrintWriter w = new java.io.PrintWriter(new java.io.FileWriter(f, true));
    if (header) {
        StringBuilder h = new StringBuilder("seed,phase,scenario,fleet,rakesPerDay,meanCycle_h,cycles,lineUtil,sidingUtil,tipplerUtil,demurrageRsPerRake,shareRelief,shareBpc,stockMinDays");
        for (int g = 0; g < GRP_NAME.length; g++) h.append(",grp_").append(GRP_NAME[g].replace(' ', '_'));
        w.println(h);
    }
    StringBuilder s = new StringBuilder(String.format(java.util.Locale.US, "%d,%d,%d,%d,%.4f,%.3f,%d,%.4f,%.4f,%.4f,%.1f,%.4f,%.4f,%.2f",
        seed, cPhase, scenario, cFleet, rakesPerDay(), meanCycle(), cyclesDone, lineUtil(), sidingUtil(), tipplerUtil(),
        demurragePerRake(), shareRelief(), shareBpc(), stockMinDays));
    for (int g = 0; g < GRP_NAME.length; g++) s.append(String.format(java.util.Locale.US, ",%.3f", groupMean(g)));
    w.println(s);
    w.close();
    if (writeCycleLog) {
        java.io.PrintWriter c = new java.io.PrintWriter(new java.io.FileWriter("RAKE_cycle_log_sim.csv", false));
        c.println(LOG_HEADER);
        for (String row : cycleLog) c.println(row);
        c.close();
    }
} catch (Exception e) {
    traceln("RakeFlow: could not write results: " + e);
}
//@end

//@fn java.awt.Color tipplerColor(int t)
//@doc Tippler t: green = tippling, light grey = idle, dark grey = not in service (A-17).
if (t >= cTipplers) return new java.awt.Color(110, 110, 110);
return tipplerUsed[t] ? new java.awt.Color(60, 170, 80) : new java.awt.Color(215, 215, 215);
//@end

//@fn java.awt.Color sidingColor(int k)
//@doc Loading siding k: amber = loading, red = loaded rake blocking it, light = free, dark = not provided.
if (k >= cSidings) return new java.awt.Color(110, 110, 110);
for (Rake r : rakes) if (r.sidingNo == k && r.onSiding) return r.phase == P_LOAD ? new java.awt.Color(235, 170, 40) : new java.awt.Color(200, 60, 60);
return new java.awt.Color(225, 225, 225);
//@end

//@fn String headerText()
//@doc Clock and configuration line on the Main view.
return String.format(java.util.Locale.US, "%s  |  day %.2f  |  phase %d (%s)  |  scenario %d  |  fleet %d rakes  |  seed %d  |  %s",
    stampText(time()), time() / 24, cPhase, cPhase == 1 ? "core cycle" : cPhase == 2 ? "+ crew clock" : "+ crew + BPC",
    scenario, cFleet, seed, time() < statsStart || statsStart == 0 ? "WARM-UP (stats not yet collected)" : "collecting statistics");
//@end
