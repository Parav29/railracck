import com.anylogic.serialization.*;
import com.anylogic.DependencyInjector;
import java.io.*;
import java.lang.reflect.*;
/**
 * Reads an .alp with AnyLogic's own ObjectModelSerializer (the IDE's file reader) and writes it back.
 * A file that loads here is structurally valid for the AnyLogic 8.9.9 IDE; the written copy is in canonical form.
 * Usage: java -cp <all AnyLogic plugin jars>:. AlpRoundTrip in.alp out.alp ModelName
 */
public class AlpRoundTrip {
  @SuppressWarnings("unchecked")
  static <T> void stub(Class<T> c) {
    DependencyInjector.bind(c, () -> (T) Proxy.newProxyInstance(AlpRoundTrip.class.getClassLoader(), new Class[]{c},
      (p, m, args) -> {
        if (m.getName().equals("clone") && args != null && args.length > 0) return args[0];
        if (m.getName().equals("toString")) return "stub:" + c.getSimpleName();
        if (m.getName().equals("hashCode")) return 0;
        if (m.getName().equals("equals")) return p == args[0];
        Class<?> r = m.getReturnType();
        if (r == boolean.class) return false; if (r == int.class) return 0; if (r == long.class) return 0L; if (r == double.class) return 0.0;
        return null; }));
  }
  public static void main(String[] a) throws Exception {
    for (String n : System.getProperty("stubs", "").split(",")) if (!n.isBlank()) stub(Class.forName(n.trim()));
    ObjectModelSerializerImpl s = new ObjectModelSerializerImpl();
    LoadedModel lm = s.read(new FileInputStream(a[0]), a.length > 2 ? a[2] : "model", new File(a[0]).getAbsoluteFile().getParent());
    System.out.println("consistent=" + lm.isConsistentWithEdition());
    var m = lm.getRAWUnconvertedModel();
    System.out.println("model name=" + m.getName());
    if (a.length > 1) { s.write(m, new FileOutputStream(a[1])); System.out.println("written " + a[1]); }
  }
}
