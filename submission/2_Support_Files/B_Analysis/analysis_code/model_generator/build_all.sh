#!/bin/bash
# Regenerate and verify RakeFlow end to end.
set -e
cd "$(dirname "$0")"
echo "== 1. generate harness Main.java + compile (stub engine) + API check (real AnyLogic engine)"
python3 gen_harness.py
../harness/build.sh 2>&1 | grep -v "^Note:"
echo "== 2. invariants after every event, 5 seeds x 3 phases"
J="/Applications/AnyLogic 8 PLE.app/Contents/jre/bin/java"
for ph in 1 2 3; do (cd ../harness && "$J" -cp out Runner reps=5 check=true noheader modelPhase=$ph > /dev/null) && echo "   phase $ph: OK"; done
echo "== 3. generate RakeFlow.alp"
python3 gen_alp.py
echo "== 4. AnyLogic ObjectModelSerializer round-trip (IDE file reader)"
roundtrip/roundtrip.sh "$PWD/../RakeFlow/RakeFlow.alp" /tmp/RakeFlow_roundtrip.alp
echo "== 5. compile inside AnyLogic-generated classes (needs the model opened once in AnyLogic)"
python3 check_generated.py || echo "   (skipped/failed - see above)"
