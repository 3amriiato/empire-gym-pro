## Plan: Mythos Exploits Security Dashboard

A single-page interactive dashboard at `/` with a dark, premium "Enterprise Security" aesthetic and rich animations.

### Design tokens (src/styles.css)
- Dark background `oklch(0.16 0.02 250)` with cyan accent `oklch(0.78 0.15 200)`, amber/red criticals.
- JetBrains Mono for CVE IDs, Inter for body.
- Custom keyframes: `myt-grid` (drifting cyber-grid), `myt-blob` (floating orbs), `myt-orbit` / `myt-orbit-rev`, `myt-pulse-ring`, `myt-scan` (radar sweep), `myt-marquee`, `myt-shimmer`, `myt-glitch`, `myt-row-in`, `myt-fade-up`.

### Page structure (src/routes/index.tsx)
1. **Ambient layer** — animated cyber-grid bg, 3 floating colored blobs, mouse-following cyan spotlight.
2. **Header** — logo with counter-rotating orbital rings, brand mark "MYTHOS // SECOPS", live-feed pulse dot, classification tag.
3. **Live threat ticker** — horizontal marquee with edge gradient masks.
4. **4 KPI cards** — Total Exploits, Pending CVEs, Critical Priorities, Resolved + Avg CVSS. Each: count-up numbers (custom `useCountUp` with rAF), animated SVG sparkline (stroke-dashoffset draw), 3D tilt + cyan glow on hover, shimmer sweep, staggered entry. Critical card gets pulsing concentric rings.
5. **Filter pills + search** — category filter rail, search across ID/product/CVE/category/type. Active pill scales + glows.
6. **Sortable data table** — columns: ID, Category, Document Type, Product/Project, Known CVE, Priority, Status, Target Date, CVSS. Click headers to sort asc/desc. Rows cascade in (35ms stagger), replay on sort/filter via `key={tableKey}`. Continuous radar scan-line sweeps vertically. Row hover: slide right, left accent bar, gradient sweep, category icon turns cyan, CVE chevron slides in. Critical badges get RGB-split glitch text-shadow.

### Mock data (~20 entries)
Realistic Mythos entries: Chromium V8/Blink, Firefox Gecko/SpiderMonkey, WebKit, Linux kernel io_uring/eBPF/nftables/mm, OpenSSL, BoringSSL, glibc TLS, libgcrypt, systemd, KVM. Each with proper CVE-YYYY-NNNNN ID, document type (Advisory/Patch/PoC/Disclosure), priority (Critical/High/Medium/Low), status (Pending/In Review/Resolved), target date, CVSS 0-10.

### Components
- Atoms inline in route file: `KpiCard`, `Badge`, `SortHeader`, `Sparkline`, `useCountUp` hook.
- Lucide icons: Shield, Bug, AlertTriangle, CheckCircle2, Activity, Search, ChevronUp/Down, ExternalLink, Cpu, Globe, Lock, Terminal.
- Filtering/sorting composed in a single `useMemo` pipeline.

### SEO
Update root `head()` title to "Mythos Exploits — Security Operations Dashboard" and matching meta description.

### Out of scope
No backend, no auth, no routing beyond `/`. Pure frontend with mock data.