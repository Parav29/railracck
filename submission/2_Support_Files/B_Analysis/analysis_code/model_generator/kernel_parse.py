"""Parse kernel.java into class code + functions, and build the TIMETABLE constant from the erail CSV."""
import csv
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
TIMETABLE_CSV = os.path.join(ROOT, "research", "timetable_tadali_chandrapur.csv")

# DN trains pass Tadali this many minutes before their Chandrapur arrival (CD-TAE ~13-15 km,
# research/section_capacity_notes.md: "CD timing minus ~12-15 min"). UP trains are referenced
# at their Chandrapur departure, which is where an empty rake leaves for Tadali.
DN_OFFSET_MIN = 13


def parse_kernel(path=os.path.join(HERE, "kernel.java")):
    src = open(path).read()
    classcode = re.search(r"//@classcode\n(.*?)//@end", src, re.S).group(1)
    funcs = []
    for m in re.finditer(r"//@fn (.+?)\n//@doc (.+?)\n(.*?)//@end", src, re.S):
        sig, doc, body = m.group(1).strip(), m.group(2).strip(), m.group(3).rstrip()
        sm = re.match(r"(.+?)\s+(\w+)\((.*)\)$", sig)
        ret, name, args = sm.group(1).strip(), sm.group(2), sm.group(3).strip()
        arglist = []
        if args:
            # split on commas not inside <>
            depth, cur = 0, ""
            for ch in args:
                if ch == "<":
                    depth += 1
                elif ch == ">":
                    depth -= 1
                if ch == "," and depth == 0:
                    arglist.append(cur.strip())
                    cur = ""
                else:
                    cur += ch
            arglist.append(cur.strip())
        params = []
        for a in arglist:
            t, n = a.rsplit(" ", 1)
            params.append((t.strip(), n.strip()))
        funcs.append(dict(ret=ret, name=name, params=params, doc=doc, body=body, sig=sig))
    return classcode, funcs


def hhmm(s):
    h, m = s.split(":")
    return int(h) * 60 + int(m)


def timetable_rows():
    """Rows 'DN|UP,minuteOfDay,MTWTFSS bits,trainNo' for the Java TIMETABLE constant."""
    rows = []
    with open(TIMETABLE_CSV) as f:
        for r in csv.DictReader(f):
            bits = r["days_bits_MTWTFSS"].strip().zfill(7)
            no = r["train_no"].strip()
            if r["direction"].startswith("DN"):
                if r["tae_dep"].strip():
                    m = hhmm(r["tae_dep"])
                else:
                    m = hhmm(r["cd_arr"] or r["cd_dep"]) - DN_OFFSET_MIN
                if m < 0:
                    # passes Tadali the evening before its Chandrapur day: shift the run days back one day
                    m += 1440
                    bits = bits[1:] + bits[0]
                rows.append(f"DN,{m},{bits},{no}")
            else:
                m = hhmm(r["cd_dep"] or r["cd_arr"])
                rows.append(f"UP,{m},{bits},{no}")
    return rows


def timetable_java():
    rows = timetable_rows()
    body = ",\n    ".join(f'"{r}"' for r in rows)
    return ("// 115 scheduled passenger trains, erail.in scrape 13-Oct-2026 (research/timetable_tadali_chandrapur.csv)\n"
            "// DN: minute of day passing Tadali (CD arrival - 13 min, or TAE time if it stops); UP: departure from Chandrapur.\n"
            "// Run-day bits are Monday..Sunday.\n"
            f"static final String[] TIMETABLE = {{\n    {body} }};\n")


if __name__ == "__main__":
    cc, fs = parse_kernel()
    print(len(fs), "functions")
    rows = timetable_rows()
    print(len(rows), "trains", sum(r.startswith("DN") for r in rows), "DN")
    w = sum(r.split(",")[2].count("1") for r in rows)
    print("passings per week", w, "per day", round(w / 7, 1))
