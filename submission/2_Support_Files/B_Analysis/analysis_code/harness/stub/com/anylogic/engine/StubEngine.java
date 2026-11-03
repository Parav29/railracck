package com.anylogic.engine;
/** Minimal event scheduler standing in for the AnyLogic engine in the test harness. */
public class StubEngine {
    static double now = 0;
    static long seq = 0;
    static final java.util.PriorityQueue<DynamicEvent> q = new java.util.PriorityQueue<DynamicEvent>(
        (a, b) -> a.at != b.at ? Double.compare(a.at, b.at) : Long.compare(a.seq, b.seq));
    public static Runnable afterEvent;
    public static void reset() { now = 0; seq = 0; q.clear(); }
    public static void runUntil(double stop) {
        while (!q.isEmpty() && q.peek().at <= stop) {
            DynamicEvent e = q.poll();
            if (e.cancelled) continue;
            now = e.at;
            e.execute();
            if (afterEvent != null) afterEvent.run();
        }
        now = stop;
    }
}
