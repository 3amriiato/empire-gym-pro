import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Bug,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Cpu,
  ExternalLink,
  Globe,
  Lock,
  Search,
  Shield,
  Terminal,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mythos Exploits — Security Operations Dashboard" },
      {
        name: "description",
        content:
          "Interactive Mythos exploits and CVE commitments tracker. Browser, kernel, and cryptography vulnerabilities at a glance.",
      },
      { property: "og:title", content: "Mythos Exploits — SecOps Dashboard" },
      {
        property: "og:description",
        content: "Live tracker for browser, kernel, and crypto exploits across the Mythos program.",
      },
    ],
  }),
  component: MythosDashboard,
});

// ---------- Data ----------

type Priority = "Critical" | "High" | "Medium" | "Low";
type Status = "Pending" | "In Review" | "Resolved";
type Category =
  | "Browser"
  | "Kernel"
  | "Cryptography"
  | "Runtime"
  | "Hypervisor";
type DocType = "Advisory" | "Patch" | "PoC" | "Disclosure";

interface Exploit {
  id: string;
  category: Category;
  docType: DocType;
  product: string;
  cve: string;
  priority: Priority;
  status: Status;
  target: string;
  cvss: number;
}

const EXPLOITS: Exploit[] = [
  { id: "MYT-0419", category: "Browser", docType: "Advisory", product: "Chromium V8 — JIT type confusion", cve: "CVE-2024-7971", priority: "Critical", status: "Pending", target: "2026-05-22", cvss: 9.6 },
  { id: "MYT-0420", category: "Browser", docType: "PoC", product: "Chromium Blink — UAF in HTMLMediaElement", cve: "CVE-2024-6991", priority: "Critical", status: "In Review", target: "2026-05-19", cvss: 9.4 },
  { id: "MYT-0421", category: "Browser", docType: "Patch", product: "Firefox SpiderMonkey — OOB write", cve: "CVE-2024-9680", priority: "High", status: "Resolved", target: "2026-04-30", cvss: 8.8 },
  { id: "MYT-0422", category: "Browser", docType: "Disclosure", product: "Firefox Gecko — Sandbox escape", cve: "CVE-2024-10458", priority: "High", status: "Pending", target: "2026-06-04", cvss: 8.2 },
  { id: "MYT-0423", category: "Browser", docType: "Advisory", product: "WebKit JSC — Integer overflow", cve: "CVE-2024-44308", priority: "High", status: "In Review", target: "2026-05-30", cvss: 8.6 },
  { id: "MYT-0424", category: "Kernel", docType: "PoC", product: "Linux io_uring — Privilege escalation", cve: "CVE-2024-0582", priority: "Critical", status: "Pending", target: "2026-05-17", cvss: 9.8 },
  { id: "MYT-0425", category: "Kernel", docType: "Advisory", product: "Linux nftables — UAF in chain rules", cve: "CVE-2024-1086", priority: "Critical", status: "In Review", target: "2026-05-24", cvss: 9.7 },
  { id: "MYT-0426", category: "Kernel", docType: "Patch", product: "Linux eBPF — Verifier bypass", cve: "CVE-2024-26642", priority: "High", status: "Resolved", target: "2026-04-12", cvss: 8.4 },
  { id: "MYT-0427", category: "Kernel", docType: "Disclosure", product: "Linux mm/page_alloc — race condition", cve: "CVE-2024-36971", priority: "Medium", status: "Pending", target: "2026-06-15", cvss: 6.7 },
  { id: "MYT-0428", category: "Kernel", docType: "Advisory", product: "Linux KSMBD — Auth bypass", cve: "CVE-2024-26808", priority: "High", status: "In Review", target: "2026-05-28", cvss: 8.1 },
  { id: "MYT-0429", category: "Cryptography", docType: "Advisory", product: "OpenSSL — RSA timing side channel", cve: "CVE-2024-0727", priority: "High", status: "Pending", target: "2026-06-01", cvss: 7.5 },
  { id: "MYT-0430", category: "Cryptography", docType: "PoC", product: "BoringSSL — ChaCha20 nonce reuse", cve: "CVE-2024-32487", priority: "Critical", status: "Pending", target: "2026-05-21", cvss: 9.1 },
  { id: "MYT-0431", category: "Cryptography", docType: "Patch", product: "libgcrypt — ECDSA key recovery", cve: "CVE-2024-2236", priority: "High", status: "Resolved", target: "2026-04-22", cvss: 7.8 },
  { id: "MYT-0432", category: "Cryptography", docType: "Disclosure", product: "glibc TLS — Heap corruption in NSS", cve: "CVE-2024-2961", priority: "Critical", status: "In Review", target: "2026-05-26", cvss: 9.3 },
  { id: "MYT-0433", category: "Cryptography", docType: "Advisory", product: "GnuTLS — Certificate validation bypass", cve: "CVE-2024-28834", priority: "Medium", status: "Pending", target: "2026-06-08", cvss: 6.4 },
  { id: "MYT-0434", category: "Runtime", docType: "Patch", product: "systemd — Symlink race in journald", cve: "CVE-2024-3094", priority: "High", status: "Resolved", target: "2026-04-18", cvss: 8.0 },
  { id: "MYT-0435", category: "Runtime", docType: "Advisory", product: "glibc — __vsyslog_internal buffer overflow", cve: "CVE-2023-6246", priority: "Medium", status: "In Review", target: "2026-05-31", cvss: 7.2 },
  { id: "MYT-0436", category: "Hypervisor", docType: "PoC", product: "KVM — Nested VMX escape", cve: "CVE-2024-26926", priority: "Critical", status: "Pending", target: "2026-05-20", cvss: 9.5 },
  { id: "MYT-0437", category: "Hypervisor", docType: "Disclosure", product: "QEMU virtio-net — OOB read", cve: "CVE-2024-7409", priority: "Medium", status: "Pending", target: "2026-06-12", cvss: 6.9 },
  { id: "MYT-0438", category: "Browser", docType: "Patch", product: "Chromium ANGLE — Shader UAF", cve: "CVE-2024-5274", priority: "Low", status: "Resolved", target: "2026-04-05", cvss: 5.4 },
];

const CATEGORIES: ("All" | Category)[] = ["All", "Browser", "Kernel", "Cryptography", "Runtime", "Hypervisor"];

const CATEGORY_ICONS: Record<Category, typeof Globe> = {
  Browser: Globe,
  Kernel: Cpu,
  Cryptography: Lock,
  Runtime: Terminal,
  Hypervisor: Shield,
};

const PRIORITY_STYLES: Record<Priority, string> = {
  Critical: "bg-[oklch(0.68_0.24_25/0.12)] text-[oklch(0.78_0.22_25)] border-[oklch(0.68_0.24_25/0.4)]",
  High: "bg-[oklch(0.82_0.18_75/0.12)] text-[oklch(0.85_0.18_75)] border-[oklch(0.82_0.18_75/0.4)]",
  Medium: "bg-[oklch(0.82_0.15_200/0.12)] text-[oklch(0.85_0.15_200)] border-[oklch(0.82_0.15_200/0.35)]",
  Low: "bg-[oklch(0.5_0.02_250/0.3)] text-[oklch(0.75_0.02_250)] border-[oklch(0.5_0.02_250/0.5)]",
};

const STATUS_DOT: Record<Status, string> = {
  Pending: "bg-[oklch(0.82_0.18_75)]",
  "In Review": "bg-[oklch(0.82_0.15_200)]",
  Resolved: "bg-[oklch(0.78_0.18_155)]",
};

// ---------- Hooks ----------

function useCountUp(target: number, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

// ---------- Atoms ----------

function Sparkline({ points, color }: { points: number[]; color: string }) {
  const w = 120, h = 36;
  const max = Math.max(...points), min = Math.min(...points);
  const range = max - min || 1;
  const path = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} className="myt-spark overflow-visible">
      <defs>
        <linearGradient id={`g-${color}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={path} stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function KpiCard({
  label,
  value,
  suffix,
  decimals = 0,
  icon: Icon,
  accent,
  spark,
  delay,
  pulse,
  caption,
}: {
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
  icon: typeof Shield;
  accent: string;
  spark: number[];
  delay: number;
  pulse?: boolean;
  caption?: string;
}) {
  const v = useCountUp(value);
  return (
    <div
      className="myt-card myt-fade-up p-5 overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="myt-card-shimmer" />
      <div className="flex items-start justify-between relative z-10">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-[oklch(0.7_0.02_250)] font-medium">
            {label}
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-4xl font-semibold tabular-nums tracking-tight" style={{ color: accent }}>
              {v.toFixed(decimals)}
            </span>
            {suffix && <span className="text-sm text-[oklch(0.7_0.02_250)]">{suffix}</span>}
          </div>
          {caption && (
            <div className="mt-1 text-xs text-[oklch(0.65_0.02_250)]">{caption}</div>
          )}
        </div>
        <div
          className={`relative h-10 w-10 rounded-lg flex items-center justify-center ${pulse ? "myt-pulse-ring" : ""}`}
          style={{ background: `${accent.replace(")", " / 0.12)").replace("oklch(", "oklch(")}`, color: accent, border: `1px solid ${accent.replace(")", " / 0.3)")}` }}
        >
          <Icon size={18} />
        </div>
      </div>
      <div className="mt-4 relative z-10">
        <Sparkline points={spark} color={accent} />
      </div>
    </div>
  );
}

function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium ${className}`}>
      {children}
    </span>
  );
}

type SortKey = keyof Exploit;

function SortHeader({
  label,
  k,
  sort,
  setSort,
  className = "",
}: {
  label: string;
  k: SortKey;
  sort: { key: SortKey; dir: "asc" | "desc" };
  setSort: (s: { key: SortKey; dir: "asc" | "desc" }) => void;
  className?: string;
}) {
  const active = sort.key === k;
  return (
    <th className={`text-left text-[11px] uppercase tracking-[0.14em] font-semibold text-[oklch(0.7_0.02_250)] py-3 px-4 ${className}`}>
      <button
        onClick={() => setSort({ key: k, dir: active && sort.dir === "asc" ? "desc" : "asc" })}
        className={`inline-flex items-center gap-1.5 hover:text-[oklch(0.85_0.15_200)] transition-colors ${active ? "text-[oklch(0.85_0.15_200)]" : ""}`}
      >
        {label}
        <span className="flex flex-col -space-y-1">
          <ChevronUp size={10} className={active && sort.dir === "asc" ? "opacity-100" : "opacity-30"} />
          <ChevronDown size={10} className={active && sort.dir === "desc" ? "opacity-100" : "opacity-30"} />
        </span>
      </button>
    </th>
  );
}

// ---------- Page ----------

function MythosDashboard() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"All" | Category>("All");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "target", dir: "asc" });
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!spotRef.current) return;
      spotRef.current.style.transform = `translate(${e.clientX - 240}px, ${e.clientY - 240}px)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const kpis = useMemo(() => {
    const total = EXPLOITS.length;
    const pending = EXPLOITS.filter((e) => e.status !== "Resolved").length;
    const critical = EXPLOITS.filter((e) => e.priority === "Critical").length;
    const resolved = EXPLOITS.filter((e) => e.status === "Resolved").length;
    const avgCvss = EXPLOITS.reduce((s, e) => s + e.cvss, 0) / total;
    return { total, pending, critical, resolved, avgCvss };
  }, []);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = EXPLOITS.filter((e) => filter === "All" || e.category === filter);
    if (q) {
      out = out.filter((e) =>
        [e.id, e.product, e.cve, e.category, e.docType].some((f) => f.toLowerCase().includes(q))
      );
    }
    const dirMul = sort.dir === "asc" ? 1 : -1;
    return [...out].sort((a, b) => {
      const av = a[sort.key], bv = b[sort.key];
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dirMul;
      return String(av).localeCompare(String(bv)) * dirMul;
    });
  }, [query, filter, sort]);

  const tableKey = `${filter}-${query}-${sort.key}-${sort.dir}`;

  return (
    <div className="relative min-h-screen text-[oklch(0.96_0.01_240)] overflow-hidden">
      {/* Ambient layer */}
      <div className="absolute inset-0 myt-grid-bg opacity-60 pointer-events-none" />
      <div className="myt-blob" style={{ top: "-10%", left: "-5%", width: 420, height: 420, background: "oklch(0.82 0.15 200)" }} />
      <div className="myt-blob" style={{ top: "30%", right: "-8%", width: 480, height: 480, background: "oklch(0.7 0.25 330)", animationDelay: "-6s" }} />
      <div className="myt-blob" style={{ bottom: "-10%", left: "30%", width: 380, height: 380, background: "oklch(0.82 0.18 75)", animationDelay: "-12s" }} />
      <div ref={spotRef} className="myt-spotlight" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-8">
        {/* Header */}
        <header className="flex items-center justify-between gap-4 myt-fade-up">
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[oklch(0.82_0.15_200)] to-[oklch(0.7_0.25_330)] flex items-center justify-center shadow-[0_0_30px_oklch(0.82_0.15_200/0.5)]">
                <Shield size={20} className="text-[oklch(0.16_0.02_250)]" strokeWidth={2.5} />
              </div>
              <div className="absolute -inset-1 rounded-xl border border-[oklch(0.82_0.15_200/0.3)] myt-orbit">
                <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[oklch(0.82_0.15_200)] shadow-[0_0_10px_oklch(0.82_0.15_200)]" />
              </div>
              <div className="absolute -inset-2 rounded-xl border border-[oklch(0.7_0.25_330/0.2)] myt-orbit-rev">
                <div className="absolute top-1/2 -right-1 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[oklch(0.7_0.25_330)] shadow-[0_0_8px_oklch(0.7_0.25_330)]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[oklch(0.7_0.02_250)] tracking-widest">
                MYTHOS // SECOPS
                <span className="px-1.5 py-0.5 rounded border border-[oklch(0.82_0.18_75/0.4)] text-[oklch(0.85_0.18_75)] text-[9px]">
                  TLP:AMBER
                </span>
              </div>
              <h1 className="text-xl font-semibold tracking-tight">Exploits & CVE Commitments</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-[oklch(0.7_0.02_250)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[oklch(0.78_0.18_155)] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[oklch(0.78_0.18_155)]" />
              </span>
              LIVE FEED · {new Date().toUTCString().slice(17, 25)} UTC
            </div>
            <Badge className="border-[oklch(0.82_0.15_200/0.4)] text-[oklch(0.85_0.15_200)] bg-[oklch(0.82_0.15_200/0.08)] font-mono">
              <Activity size={11} /> v3.14.2
            </Badge>
          </div>
        </header>

        {/* Threat ticker */}
        <div className="mt-6 myt-fade-up myt-mask-x relative h-9 rounded-lg border border-[var(--panel-border)] bg-[oklch(0.21_0.025_255/0.6)] backdrop-blur overflow-hidden" style={{ animationDelay: "100ms" }}>
          <div className="myt-marquee-track items-center h-full text-xs font-mono text-[oklch(0.78_0.02_250)] gap-12 px-6">
            {Array.from({ length: 2 }).map((_, dup) => (
              <div key={dup} className="flex items-center gap-12 shrink-0">
                {[
                  { c: "oklch(0.78 0.22 25)", t: "CRIT · CVE-2024-0582 · Linux io_uring privilege escalation" },
                  { c: "oklch(0.85 0.18 75)", t: "HIGH · CVE-2024-0727 · OpenSSL RSA timing leak" },
                  { c: "oklch(0.85 0.15 200)", t: "INFO · MYT-0438 patched in Chromium 124.0.6367.118" },
                  { c: "oklch(0.78 0.22 25)", t: "CRIT · CVE-2024-32487 · BoringSSL nonce reuse PoC" },
                  { c: "oklch(0.78 0.18 155)", t: "RES · CVE-2024-26642 · eBPF verifier bypass shipped" },
                  { c: "oklch(0.85 0.18 75)", t: "HIGH · CVE-2024-44308 · WebKit JSC integer overflow" },
                ].map((it, i) => (
                  <span key={`${dup}-${i}`} className="flex items-center gap-2 shrink-0">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: it.c, boxShadow: `0 0 8px ${it.c}` }} />
                    {it.t}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* KPIs */}
        <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Total Exploits Tracked"
            value={kpis.total}
            icon={Bug}
            accent="oklch(0.85 0.15 200)"
            spark={[3, 6, 4, 8, 7, 11, 9, 14, 13, 17, 16, 20]}
            delay={0}
            caption="Across 5 categories"
          />
          <KpiCard
            label="Pending CVEs"
            value={kpis.pending}
            icon={Activity}
            accent="oklch(0.85 0.18 75)"
            spark={[12, 14, 13, 16, 15, 17, 16, 18, 17, 16, 15, 16]}
            delay={120}
            caption="Awaiting remediation"
          />
          <KpiCard
            label="Critical Priorities"
            value={kpis.critical}
            icon={AlertTriangle}
            accent="oklch(0.78 0.22 25)"
            spark={[1, 2, 2, 3, 4, 4, 5, 5, 6, 6, 7, 7]}
            delay={240}
            pulse
            caption="Sev ≥ 9.0 CVSS"
          />
          <KpiCard
            label="Resolved · Avg CVSS"
            value={kpis.avgCvss}
            decimals={1}
            suffix={`  · ${kpis.resolved} closed`}
            icon={CheckCircle2}
            accent="oklch(0.78 0.18 155)"
            spark={[7, 7.2, 7.4, 7.6, 7.8, 7.9, 8.0, 8.1, 8.0, 8.0, 8.0, 8.0]}
            delay={360}
            caption="Mean across program"
          />
        </section>

        {/* Filters + search */}
        <section className="mt-8 flex flex-col lg:flex-row gap-3 lg:items-center justify-between myt-fade-up" style={{ animationDelay: "500ms" }}>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const active = filter === c;
              return (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-300 ${
                    active
                      ? "bg-[oklch(0.82_0.15_200/0.15)] border-[oklch(0.82_0.15_200/0.5)] text-[oklch(0.9_0.15_200)] scale-105 shadow-[0_0_24px_oklch(0.82_0.15_200/0.35)]"
                      : "bg-[oklch(0.21_0.025_255/0.5)] border-[var(--panel-border)] text-[oklch(0.78_0.02_250)] hover:-translate-y-0.5 hover:border-[oklch(0.82_0.15_200/0.3)]"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[oklch(0.65_0.02_250)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search ID, CVE, product…"
              className="w-full lg:w-80 pl-9 pr-3 py-2 rounded-lg bg-[oklch(0.21_0.025_255/0.6)] border border-[var(--panel-border)] text-sm placeholder:text-[oklch(0.55_0.02_250)] outline-none transition-all duration-300 focus:border-[oklch(0.82_0.15_200/0.6)] focus:shadow-[0_0_0_4px_oklch(0.82_0.15_200/0.1)]"
            />
          </div>
        </section>

        {/* Table */}
        <section className="mt-4 myt-card overflow-hidden myt-fade-up" style={{ animationDelay: "620ms" }}>
          <div className="relative overflow-x-auto">
            <div className="myt-scan" />
            <table className="w-full text-sm">
              <thead className="bg-[oklch(0.19_0.025_255/0.7)] border-b border-[var(--panel-border)]">
                <tr>
                  <SortHeader label="ID" k="id" sort={sort} setSort={setSort} />
                  <SortHeader label="Category" k="category" sort={sort} setSort={setSort} />
                  <SortHeader label="Doc Type" k="docType" sort={sort} setSort={setSort} />
                  <SortHeader label="Product / Project" k="product" sort={sort} setSort={setSort} />
                  <SortHeader label="Known CVE" k="cve" sort={sort} setSort={setSort} />
                  <SortHeader label="Priority" k="priority" sort={sort} setSort={setSort} />
                  <SortHeader label="Status" k="status" sort={sort} setSort={setSort} />
                  <SortHeader label="Target Date" k="target" sort={sort} setSort={setSort} />
                  <SortHeader label="CVSS" k="cvss" sort={sort} setSort={setSort} className="text-right" />
                </tr>
              </thead>
              <tbody key={tableKey}>
                {rows.map((r, i) => {
                  const Icon = CATEGORY_ICONS[r.category];
                  return (
                    <tr
                      key={r.id}
                      className="myt-row myt-row-in border-b border-[var(--panel-border)] last:border-0 group"
                      style={{ animationDelay: `${i * 35}ms` }}
                    >
                      <td className="py-3 px-4 font-mono text-xs text-[oklch(0.85_0.15_200)]">{r.id}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-2 text-[oklch(0.82_0.02_250)]">
                          <Icon size={14} className="text-[oklch(0.65_0.02_250)] group-hover:text-[oklch(0.85_0.15_200)] transition-all duration-300 group-hover:scale-110" />
                          {r.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[oklch(0.82_0.02_250)]">{r.docType}</td>
                      <td className="py-3 px-4 text-[oklch(0.92_0.01_240)]">{r.product}</td>
                      <td className="py-3 px-4">
                        <a
                          href={`https://nvd.nist.gov/vuln/detail/${r.cve}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-xs text-[oklch(0.85_0.15_200)] hover:underline"
                        >
                          {r.cve}
                          <ChevronRight size={12} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                          <ExternalLink size={11} className="opacity-50" />
                        </a>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={`${PRIORITY_STYLES[r.priority]} ${r.priority === "Critical" ? "myt-glitch" : ""}`}>
                          {r.priority === "Critical" && <AlertTriangle size={10} />}
                          {r.priority}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-2 text-[oklch(0.82_0.02_250)] text-xs">
                          <span className={`relative flex h-1.5 w-1.5`}>
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${STATUS_DOT[r.status]} opacity-60`} />
                            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${STATUS_DOT[r.status]}`} />
                          </span>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-[oklch(0.78_0.02_250)]">{r.target}</td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className="font-mono text-xs font-semibold tabular-nums"
                          style={{
                            color:
                              r.cvss >= 9 ? "oklch(0.78 0.22 25)"
                              : r.cvss >= 7 ? "oklch(0.85 0.18 75)"
                              : "oklch(0.85 0.15 200)",
                          }}
                        >
                          {r.cvss.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-sm text-[oklch(0.65_0.02_250)]">
                      No exploits match the current filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2.5 border-t border-[var(--panel-border)] flex items-center justify-between text-[11px] text-[oklch(0.65_0.02_250)] font-mono">
            <span>{rows.length} of {EXPLOITS.length} entries</span>
            <span>Last sync · {new Date().toISOString().slice(0, 19).replace("T", " ")}Z</span>
          </div>
        </section>

        <footer className="mt-8 text-center text-[11px] text-[oklch(0.55_0.02_250)] font-mono">
          MYTHOS SECOPS · INTERNAL TOOLING · NOT A SOURCE OF TRUTH FOR PUBLIC DISCLOSURE
        </footer>
      </div>
    </div>
  );
}
