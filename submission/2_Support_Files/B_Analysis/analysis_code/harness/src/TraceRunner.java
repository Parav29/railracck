import com.anylogic.engine.StubEngine;

/**
 * Records one replication of the model for the website animation (website/).
 *   java TraceRunner days=15 [field=value ...]
 * Prints JSON: {"rakes":N, "ev":[[t,rake,phase,phaseEnd,loaded,loc,siding,tippler],...], "trains":[[t,dir,kind],...],
 *               "delivered":[t,...]}
 * dir 0 = DN (southbound, passing Tadali), 1 = UP (northbound, leaving Chandrapur); kind 0 passenger, 1 goods.
 */
public class TraceRunner {
    public static void main(String[] args) throws Exception {
        double days = 15;
        Main m = new Main();
        m.writeCycleLog = false;
        m.resultsWritten = true;
        for (String a : args) {
            String[] kv = a.split("=", 2);
            if (kv[0].equals("days")) days = Double.parseDouble(kv[1]);
            else Runner.set(m, kv[0], kv[1]);
        }
        StubEngine.reset();
        final StringBuilder ev = new StringBuilder();
        final StringBuilder tr = new StringBuilder();
        final java.util.IdentityHashMap<Object, Boolean> seen = new java.util.IdentityHashMap<Object, Boolean>();
        final java.util.HashMap<Integer, String> last = new java.util.HashMap<Integer, String>();
        final Main mm = m;
        StubEngine.afterEvent = () -> {
            for (Main.Rake r : mm.rakes) {
                String key = r.phase + "|" + r.loc + "|" + (r.loaded ? 1 : 0) + "|" + r.sidingNo + "|" + r.tipplerNo;
                if (key.equals(last.get(r.id))) continue;
                last.put(r.id, key);
                if (ev.length() > 0) ev.append(',');
                ev.append(String.format(java.util.Locale.US, "[%.4f,%d,%d,%.4f,%d,%d,%d,%d]", mm.time(), r.id, r.phase,
                    r.phaseEnd, r.loaded ? 1 : 0, r.loc, r.sidingNo, r.tipplerNo));
            }
            for (int d = 0; d < 2; d++)
                for (Main.Blocker b : d == 0 ? mm.dnBlock : mm.upBlock) {
                    if (b.kind == Main.B_OWN || seen.containsKey(b)) continue;
                    seen.put(b, true);
                    if (tr.length() > 0) tr.append(',');
                    tr.append(String.format(java.util.Locale.US, "[%.4f,%d,%d]", b.t, d, b.kind == Main.B_PAX ? 0 : 1));
                }
        };
        m.startup();
        StubEngine.runUntil(days * 24.0);
        StringBuilder del = new StringBuilder();
        for (double t : m.deliveryTimes) { if (del.length() > 0) del.append(','); del.append(String.format(java.util.Locale.US, "%.4f", t)); }
        System.out.println("{\"rakes\":" + m.cFleet + ",\"ggsLoops\":" + m.cGgsLoops + ",\"taeLoops\":" + m.cTaeLoops
            + ",\"sidings\":" + m.cSidings + ",\"tipplers\":" + m.cTipplers + ",\"doubled\":" + m.cDoubled
            + ",\"warmup\":" + (m.warmupDays * 24) + ",\"days\":" + days
            + ",\"ev\":[" + ev + "],\"trains\":[" + tr + "],\"delivered\":[" + del + "]}");
    }
}
