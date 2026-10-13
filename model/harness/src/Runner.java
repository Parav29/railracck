import com.anylogic.engine.StubEngine;

/**
 * Test harness for the RakeFlow kernel.
 *   java Runner [reps=N] [seed0=1] [field=value ...]
 * Any public parameter of Main can be overridden (e.g. modelPhase=2 scenario=5 fleetSize=10).
 * Prints one CSV row per replication.
 */
public class Runner {
    public static void main(String[] args) throws Exception {
        int reps = 1, seed0 = 1;
        boolean header = true, check = false;
        java.util.LinkedHashMap<String, String> over = new java.util.LinkedHashMap<String, String>();
        for (String a : args) {
            String[] kv = a.split("=", 2);
            if (kv[0].equals("reps")) reps = Integer.parseInt(kv[1]);
            else if (kv[0].equals("seed0")) seed0 = Integer.parseInt(kv[1]);
            else if (kv[0].equals("noheader")) header = false;
            else if (kv[0].equals("check")) check = Boolean.parseBoolean(kv[1]);
            else over.put(kv[0], kv[1]);
        }
        if (header) {
            StringBuilder h = new StringBuilder("seed,phase,scenario,fleet,rakesPerDay,meanCycle_h,cycles,lineUtil,sidingUtil,tipplerUtil,"
                + "demurrageRsPerRake,loadOverFreeShare,unloadOverFreeShare,shareRelief,shareBpc,bpcOverdue,stockMinDays,daysBelow7,"
                + "mergeWait_h,crewTrips,extensions,maxStuck_h,stuckPhase");
            for (String g : Main.GRP_NAME) h.append(",").append(g.replace(' ', '_'));
            for (String p : Main.PH_NAME) h.append(",\"").append(p).append("\"");
            System.out.println(h);
        }
        for (int k = 0; k < reps; k++) {
            StubEngine.reset();
            Main m = new Main();
            m.writeCycleLog = false;
            m.resultsWritten = true;   // the harness reports through stdout, not the model's CSV files
            for (java.util.Map.Entry<String, String> e : over.entrySet()) set(m, e.getKey(), e.getValue());
            if (reps > 1 || !over.containsKey("seed")) m.seed = seed0 + k;
            final Main mm = m;
            StubEngine.afterEvent = check ? () -> Invariants.check(mm) : null;
            m.startup();
            StubEngine.runUntil((m.warmupDays + m.runDays) * 24.0);
            StringBuilder s = new StringBuilder(String.format(java.util.Locale.US,
                "%d,%d,%d,%d,%.4f,%.3f,%d,%.4f,%.4f,%.4f,%.1f,%.4f,%.4f,%.4f,%.4f,%d,%.2f,%d,%.3f,%d,%d",
                m.seed, m.cPhase, m.scenario, m.cFleet, m.rakesPerDay(), m.meanCycle(), m.cyclesDone, m.lineUtil(),
                m.sidingUtil(), m.tipplerUtil(), m.demurragePerRake(),
                m.loadEnds == 0 ? 0 : (double) m.loadOverFree / m.loadEnds,
                m.unloadEnds == 0 ? 0 : (double) m.unloadOverFree / m.unloadEnds,
                m.shareRelief(), m.shareBpc(), m.bpcOverdue, m.stockMinDays, m.daysBelow7,
                m.mergeCount == 0 ? 0 : m.mergeWaitSum / m.mergeCount, m.crewTrips, m.extensions));
            double stuck = 0; String sp = "";
            for (Main.Rake r : m.rakes) { double d = m.time() - r.phaseStart; if (d > stuck) { stuck = d; sp = Main.PH_NAME[r.phase]; } }
            s.append(String.format(java.util.Locale.US, ",%.1f,%s", stuck, sp.replace(',', ' ')));
            for (int g = 0; g < Main.GRP_NAME.length; g++) s.append(String.format(java.util.Locale.US, ",%.3f", m.groupMean(g)));
            for (int p = 0; p < Main.NPH; p++) s.append(String.format(java.util.Locale.US, ",%.3f", m.compMean(p)));
            System.out.println(s);
        }
    }

    static void set(Main m, String f, String v) throws Exception {
        java.lang.reflect.Field fl = Main.class.getField(f);
        Class<?> t = fl.getType();
        if (t == int.class) fl.setInt(m, Integer.parseInt(v));
        else if (t == double.class) fl.setDouble(m, Double.parseDouble(v));
        else if (t == boolean.class) fl.setBoolean(m, Boolean.parseBoolean(v));
        else throw new IllegalArgumentException(f);
    }
}
