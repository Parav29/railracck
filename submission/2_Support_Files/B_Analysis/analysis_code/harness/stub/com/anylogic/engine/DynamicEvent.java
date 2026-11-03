package com.anylogic.engine;
/** Test double: same constructor/reset/execute surface as com.anylogic.engine.DynamicEvent. */
public class DynamicEvent {
    double at; long seq; boolean cancelled;
    public DynamicEvent(Agent owner, double dt, TimeUnits units) {
        if (units != TimeUnits.HOUR) throw new IllegalArgumentException("harness supports HOUR only");
        at = StubEngine.now + dt; seq = StubEngine.seq++;
        StubEngine.q.add(this);
    }
    public void execute() { }
    public void reset() { cancelled = true; }
}
