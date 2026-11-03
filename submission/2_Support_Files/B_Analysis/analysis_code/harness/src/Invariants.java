/** Physical and rule invariants checked after every event when the harness runs with check=true. */
public class Invariants {
    static long checks;
    static void fail(Main m, String msg) {
        throw new IllegalStateException(String.format("t=%.3f h seed %d: %s", m.time(), m.seed, msg));
    }
    static void check(Main m) {
        checks++;
        int ggs = 0, sid = 0, taeL = 0, taeE = 0, tip = 0, spurL = 0, spurE = 0, onDuty = 0;
        for (Main.Rake r : m.rakes) {
            if (r.holdsGgsLoop) ggs++;
            if (r.sidingNo >= 0) sid++;
            if (r.holdsTaeLoop && r.loaded) taeL++;
            if ((r.holdsTaeLoop && !r.loaded) || r.taeLoopReserved) taeE++;
            if (r.tipplerNo >= 0) tip++;
            if (r.phase == Main.P_SPUR_L) spurL++;
            if (r.phase == Main.P_SPUR_E) spurE++;
            int inQ = 0;
            for (java.util.ArrayList<Main.Rake> q : java.util.Arrays.asList(m.qSiding, m.qDepartGGS, m.qLineTAE, m.qDepartCD, m.qTippler, m.qCrew, m.qExam))
                for (Main.Rake x : q) if (x == r) inQ++;
            if (inQ > 1) fail(m, "rake " + r.id + " in " + inQ + " queues");
        }
        if (ggs != m.ggsLoopUsed || ggs > m.cGgsLoops) fail(m, "GGS loops " + ggs + "/" + m.ggsLoopUsed + " cap " + m.cGgsLoops);
        if (sid != m.sidingsBusy || sid > m.cSidings) fail(m, "sidings " + sid + "/" + m.sidingsBusy);
        if (taeL != m.taeLoopLoaded || taeE != m.taeLoopEmpty) fail(m, "TAE loop count " + taeL + "," + taeE + " vs " + m.taeLoopLoaded + "," + m.taeLoopEmpty);
        if (taeL + taeE > m.cTaeLoops) fail(m, "TAE loops over capacity");
        if (taeE > m.cTaeLoops - 1) fail(m, "empties took the loop kept for loaded rakes");
        if (tip != m.tipplersBusy || tip > m.cTipplers) fail(m, "tipplers");
        if (spurL > 1 || spurE > 1) fail(m, "two rakes on one line");
        if (!m.cDoubled && spurL + spurE > 1) fail(m, "single line used both ways at once");
        if (spurL != (m.lineBusyDN ? 1 : 0) || spurE != (m.lineBusyUP ? 1 : 0)) fail(m, "line flags");
        for (Main.Crew c : m.crews) {
            if (c.rake == null) continue;
            onDuty++;
            double duty = m.time() - c.signOn;
            if (duty > m.extendedLimit_CR02 + 1e-6) fail(m, "crew " + c.id + " on duty " + duty + " h > 11 h");
            if (!c.extended && duty > m.dutyLimit_CR01 + 1e-6) fail(m, "crew " + c.id + " on duty " + duty + " h > 9 h without notice");
            if (c.rake.crew != c) fail(m, "crew/rake link broken");
        }
        if (onDuty > m.cCrewPool) fail(m, "more crews on duty than pool");
        // own paths keep >= minimum gap A-05 to every other train passing the same point
        for (java.util.ArrayList<Main.Blocker> list : java.util.Arrays.asList(m.dnBlock, m.upBlock))
            for (int i = 1; i < list.size(); i++) {
                Main.Blocker a = list.get(i - 1), b = list.get(i);
                if ((a.kind == Main.B_OWN || b.kind == Main.B_OWN) && b.t - a.t < m.mergeGapMin_A05 / 60.0 - 1e-9)
                    fail(m, String.format("own path %.4f too close to %s at %.4f", a.kind == Main.B_OWN ? a.t : b.t, a.kind == Main.B_OWN ? b.label : a.label, a.kind == Main.B_OWN ? b.t : a.t));
            }
        if (m.rakes.size() != m.cFleet) fail(m, "rake lost");
    }
}
