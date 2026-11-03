#!/bin/bash
# Compile the harness twice: against the stub engine (to run) and against the real AnyLogic engine jar (API check).
set -e
cd "$(dirname "$0")"
J="/Applications/AnyLogic 8 PLE.app/Contents/jre/bin"
ENG="/Applications/AnyLogic 8 PLE.app/Contents/Resources/Java/plugins/com.anylogic.engine_8.9.9.202607020844/com.anylogic.engine.jar"
DU="/Applications/AnyLogic 8 PLE.app/Contents/Resources/Java/plugins/com.anylogic.engine.datautil_8.9.9.202607020844/com.anylogic.engine.datautil.jar"
rm -rf out apicheck && mkdir -p out apicheck
"$J/javac" -nowarn -d out stub/com/anylogic/engine/*.java src/Main.java src/Runner.java src/Invariants.java
ALCP=$(tr '\n' ':' < anylogic_model_classpath.txt)
"$J/javac" -nowarn -proc:none -cp "$ALCP" -d apicheck src/Main.java && echo "API check vs real AnyLogic engine: OK"
