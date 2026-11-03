"""Compile-check RakeFlow inside the class AnyLogic itself generated.

When RakeFlow.alp is open in AnyLogic, the IDE writes code-completion sources to
~/.AnyLogicPLE/Workspace8.8/RakeFlow/src.generated/rakeflow/ (real imports, parameter fields,
shape fields, experiment classes; function bodies replaced by 'throw'). This script puts the
real function bodies back, adds one method holding every shape/chart/experiment expression with
the type AnyLogic expects, and compiles the lot with the jars listed in AnyLogic's .classpath.
"""
import os
import re
import shutil
import subprocess
import sys

from kernel_parse import parse_kernel, timetable_java

HOME = os.path.expanduser("~")
WS = os.path.join(HOME, ".AnyLogicPLE", "Workspace8.8", "RakeFlow")
GEN = os.path.join(WS, "src.generated", "rakeflow")
JAVAC = "/Applications/AnyLogic 8 PLE.app/Contents/jre/bin/javac"
HERE = os.path.dirname(os.path.abspath(__file__))
ALP = os.path.join(os.path.dirname(HERE), "RakeFlow", "RakeFlow.alp")
WORK = os.path.join(HERE, "_gencheck")

TYPES = {"XCode": "double", "YCode": "double", "WidthCode": "double", "HeightCode": "double",
         "FillColorCode": "java.awt.Color", "VisibleCode": "boolean", "TextCode": "Object"}


def main():
    if not os.path.isdir(GEN):
        sys.exit("AnyLogic has not generated sources yet - open model/RakeFlow/RakeFlow.alp in AnyLogic first")
    shutil.rmtree(WORK, ignore_errors=True)
    shutil.copytree(GEN, os.path.join(WORK, "rakeflow"))
    main_java = os.path.join(WORK, "rakeflow", "Main.java")
    src = open(main_java).read()
    classcode, funcs = parse_kernel()
    # replace AnyLogic's copy of the Additional class code with the current one
    a = src.index("/*INJ:Additional Code*/")
    b = src.index("/*INJ:Additional Code*/", a + 10)
    src = src[:a] + "/*INJ:Additional Code*/\n" + classcode + "\n" + timetable_java() + "\n" + src[b:]
    filled = 0
    for f in funcs:
        ps = ",".join(f"{t} {n}" for t, n in f["params"])
        stub = f"{f['ret']} {f['name']}({ps}) {{ throw new UnsupportedOperationException(); }}"
        if stub not in src:
            sys.exit(f"stub not found for {f['name']}: {stub}")
        src = src.replace(stub, f"{f['ret']} {f['name']}({ps}) {{\n{f['body']}\n}}", 1)
        filled += 1
    # every dynamic shape / chart expression from the .alp, typed as AnyLogic uses it
    alp = open(ALP).read()
    main_part = alp.split("<Experiments>")[0]
    checks = []
    for tag, typ in TYPES.items():
        for expr in re.findall(rf"<{tag}><!\[CDATA\[(.*?)\]\]></{tag}>", main_part, re.S):
            checks.append(f"{{ {typ} _v = ({expr}); }}")
    for expr in re.findall(r"<Expression2><!\[CDATA\[(.*?)\]\]></Expression2>", main_part, re.S):
        checks.append(f"{{ double _v = ({expr}); }}")
    for expr in re.findall(r"<DataItem>.*?<Expression><!\[CDATA\[(.*?)\]\]></Expression>", main_part, re.S):
        checks.append(f"{{ double _v = ({expr}); }}")
    for code in ("StartupCode", "DestroyCode"):
        m = re.search(rf"<{code}><!\[CDATA\[(.*?)\]\]></{code}>", main_part, re.S)
        checks.append("{ " + m.group(1) + " }")
    src = src.replace("/*INJ:Additional Code*/", "void _expressionCheck_() {\n" + "\n".join(checks) + "\n}\n/*INJ:Additional Code*/", 1)
    open(main_java, "w").write(src)
    # experiment after-run code, compiled inside each experiment class
    exps = 0
    for m in re.finditer(r"<ParamVariationExperiment[^>]*>.*?<Name><!\[CDATA\[(.*?)\]\]></Name>.*?<AfterSimulationRunCode><!\[CDATA\[(.*?)\]\]></AfterSimulationRunCode>", alp, re.S):
        p = os.path.join(WORK, "rakeflow", m.group(1) + ".java")
        s = open(p).read()
        s = s.replace("/*INJ:Additional Code*/", "void _afterRunCheck_(Main root) {\n" + m.group(2) + "\n}\n/*INJ:Additional Code*/", 1)
        open(p, "w").write(s)
        exps += 1
    cp = re.findall(r'kind="lib" path="([^"]+)"', open(os.path.join(WS, ".classpath")).read())
    out = os.path.join(WORK, "classes")
    os.makedirs(out)
    files = [os.path.join(WORK, "rakeflow", x) for x in os.listdir(os.path.join(WORK, "rakeflow")) if x.endswith(".java")]
    r = subprocess.run([JAVAC, "-nowarn", "-proc:none", "-encoding", "UTF-8", "-cp", ":".join(cp), "-d", out] + files,
                       capture_output=True, text=True)
    errs = [l for l in r.stderr.splitlines() if not l.startswith("Note:")]
    print(f"filled {filled} function bodies, {len(checks)} shape/chart expressions, {exps} experiment after-run blocks")
    if r.returncode == 0:
        print(f"COMPILED OK inside AnyLogic's generated classes ({len(files)} files, {len(cp)} jars on AnyLogic's classpath)")
    else:
        print("\n".join(errs[:60]))
        sys.exit(1)


if __name__ == "__main__":
    main()
