package com.anylogic.engine;
/** Test double: only the Agent API the RakeFlow kernel uses. */
public class Agent {
    public double time() { return StubEngine.now; }
    public static void traceln(Object o) { System.out.println(o); }
}
