#!/bin/bash
# Validate an .alp with AnyLogic's own reader and write the canonical copy.  roundtrip.sh in.alp out.alp
cd "$(dirname "$0")"
J="/Applications/AnyLogic 8 PLE.app/Contents/jre/bin"
P="/Applications/AnyLogic 8 PLE.app/Contents/Resources/Java/plugins"
CP=$(find "$P" -name "*.jar" | tr '\n' ':')
[ -f AlpRoundTrip.class ] || "$J/javac" -nowarn -cp "$CP" AlpRoundTrip.java
"$J/java" -Dstubs=com.anylogic.objectmodel.elements.util.ICodeValueCloneUtility -cp "$CP:." AlpRoundTrip "$1" "$2" RakeFlow 2>&1 | grep -v "Eclipse Logger"
