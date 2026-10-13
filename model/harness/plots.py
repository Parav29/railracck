"""Figures for model/results from runs_all.csv (static PNGs for the report)."""
import csv, os, statistics as st
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

RES = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "results")
rows = list(csv.DictReader(open(os.path.join(RES, "runs_all.csv"))))
BLUE, GREY, INK, MUTED, SURF = "#2a78d6", "#b9b8b2", "#0b0b0b", "#52514e", "#fcfcfb"
plt.rcParams.update({"font.size": 10, "axes.edgecolor": "#cfcec8", "axes.labelcolor": MUTED, "xtick.color": MUTED,
                     "ytick.color": MUTED, "axes.spines.top": False, "axes.spines.right": False, "figure.facecolor": SURF,
                     "axes.facecolor": SURF, "savefig.facecolor": SURF})
def sel(args): return [r for r in rows if r["args"] == args and r["experiment"] != "Assumption sensitivity" or (r["args"] == args and args != "scenario=0")]
def mci(v): return st.mean(v), 2.045 * st.stdev(v) / len(v) ** 0.5

# 1 decomposition
base = [r for r in rows if r["args"] == "modelPhase=3"]
stages = ["Placement at GGS (A-13)", "Wait for loading siding", "Loading (LD-03/04)", "Release->ready GGS (A-14)",
          "Wait for crew (loaded)", "Wait single line + TAE loop", "Run GGS->TAE spur", "Wait DN path at TAE",
          "Run TAE->CD (loaded)", "Placement at CSTPS (A-15)", "Wait for tippler", "Unloading (UL-02)",
          "Release->despatch CD (A-16)", "Wait for crew (empty)", "Held at CD: loops/UP path", "Run CD->TAE (empty)",
          "Wait single line at TAE", "Run TAE->GGS spur", "Crew relief (duty expired)", "BPC exam detour"]
vals = [st.mean(float(r[s]) for r in base) for s in stages]
fig, ax = plt.subplots(figsize=(8, 6.2))
y = list(range(len(stages)))[::-1]
ax.barh(y, vals, color=BLUE, height=0.7)
for yi, v in zip(y, vals):
    if v >= 0.3: ax.text(v + 0.1, yi, f"{v:.1f} h", va="center", color=INK, fontsize=9)
ax.set_yticks(y); ax.set_yticklabels(stages)
ax.set_xlabel("mean hours per rake cycle")
tot = st.mean(float(r["meanCycle_h"]) for r in base)
ax.set_title(f"Where a rake loses time - baseline, mean cycle {tot:.1f} h (30 reps)", loc="left", color=INK, fontsize=12)
ax.grid(axis="x", color="#e6e5df", lw=0.8); ax.set_axisbelow(True)
fig.tight_layout(); fig.savefig(os.path.join(RES, "fig1_cycle_decomposition.png"), dpi=150); plt.close(fig)

# 2 fleet size: two panels, one axis each
fl = [4, 6, 8, 10, 12, 14]
rp = [mci([float(r["rakesPerDay"]) for r in rows if r["args"] == f"fleetSize={n}"]) for n in fl]
ct = [mci([float(r["meanCycle_h"]) for r in rows if r["args"] == f"fleetSize={n}"]) for n in fl]
fig, axs = plt.subplots(1, 2, figsize=(10, 3.8))
for ax, data, lab, t in [(axs[0], rp, "rakes placed at CSTPS per day", "Throughput saturates at ~4.8 rakes/day"),
                         (axs[1], ct, "mean cycle time (h)", "Extra rakes only add queueing")]:
    ax.errorbar(fl, [d[0] for d in data], yerr=[d[1] for d in data], color=BLUE, lw=2, marker="o", ms=6, capsize=3)
    ax.set_xlabel("closed-circuit fleet (rakes), A-18"); ax.set_ylabel(lab); ax.set_xticks(fl)
    ax.set_title(t, loc="left", color=INK); ax.grid(color="#e6e5df", lw=0.8); ax.set_axisbelow(True)
axs[0].axhspan(6, 10, color="#e6e5df", zorder=0); axs[0].text(4.1, 6.15, "validation band 6-10/day (CEA)", color=MUTED, fontsize=8)
axs[0].set_ylim(0, 10.5)
fig.suptitle("E1 fleet size - 30 replications per point, 95% CI", x=0.01, ha="left", color=INK)
fig.tight_layout(); fig.savefig(os.path.join(RES, "fig2_fleet_size.png"), dpi=150); plt.close(fig)

# 3 lever deltas (paired vs baseline)
bseed = {r["seed"]: float(r["rakesPerDay"]) for r in rows if r["args"] == "scenario=0" and r["experiment"].startswith("E2")}
cases = []
seen = set()
for r in rows:
    if r["experiment"] in ("E2-E7 levers (one at a time vs baseline)", "Assumption sensitivity", "Combinations to reach LD-01 (7-8 rakes/day)") and r["case"] != "baseline":
        seen.add((r["experiment"], r["case"], r["args"]))
for e, c, a in seen:
    d = [float(r["rakesPerDay"]) - bseed[r["seed"]] for r in rows if r["args"] == a and r["experiment"] == e]
    cases.append((c, *mci(d), e))
cases.sort(key=lambda x: x[1])
fig, ax = plt.subplots(figsize=(9, 8.5))
y = range(len(cases))
cols = [BLUE if abs(m) > h else GREY for _, m, h, _ in cases]
ax.barh(list(y), [m for _, m, _, _ in cases], xerr=[h for _, _, h, _ in cases], color=cols, height=0.7, error_kw={"ecolor": MUTED, "lw": 1})
ax.set_yticks(list(y)); ax.set_yticklabels([c for c, _, _, _ in cases], fontsize=9)
ax.axvline(0, color=INK, lw=0.8)
for yi, (_, m, h, _) in zip(y, cases):
    ax.text(max(m, 0) + 0.12, yi, f"{m:+.2f}", va="center", ha="left", fontsize=8, color=INK)
ax.set_xlabel("change in loaded rakes/day at CSTPS vs baseline 4.77 (paired, same seeds, 95% CI)")
ax.set_title("Which lever moves throughput? (grey = not distinguishable from zero)", loc="left", color=INK, fontsize=12)
ax.grid(axis="x", color="#e6e5df", lw=0.8); ax.set_axisbelow(True)
fig.tight_layout(); fig.savefig(os.path.join(RES, "fig3_levers.png"), dpi=150); plt.close(fig)
print("figures written")
