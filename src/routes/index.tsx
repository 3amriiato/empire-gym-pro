import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Award,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Dumbbell,
  Flame,
  Heart,
  Instagram,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Send,
  Star,
  Target,
  Trophy,
  Users,
  X,
  Zap,
} from "lucide-react";
import heroImg from "@/assets/gym-hero.jpg";
import weightsImg from "@/assets/gym-weights.jpg";
import cablesImg from "@/assets/gym-cables.jpg";
import cardioImg from "@/assets/gym-cardio.jpg";

export const Route = createFileRoute("/")({
  component: EmpireGym,
});

// ----- CONFIG (edit these to ship to a different gym) -----
const CFG = {
  name: "Empire Gym",
  city: "Khalda, Amman",
  whatsapp: "+962799999999", // TODO: replace with owner's WhatsApp (with country code, no + or spaces in URL)
  email: "owner@empiregym.jo", // TODO: replace with owner's email — booking form is wired here
  instagram: "empiregym.jo", // TODO: replace with handle
  mapsQuery: "Empire Gym Khalda Amman",
  hours: [
    { d: "Saturday – Thursday", t: "6:00 AM – 12:00 AM" },
    { d: "Friday", t: "2:00 PM – 11:00 PM" },
  ],
};

const WHATSAPP_URL = `https://wa.me/${CFG.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
  `Hi ${CFG.name}, I'd like to book a free trial session.`
)}`;

// ---------- Atoms ----------

function Stripe({ className = "" }: { className?: string }) {
  return <div className={`h-2 eg-stripe ${className}`} />;
}

function SectionTag({ icon: Icon, children }: { icon: typeof Flame; children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[oklch(0.72_0.21_45/0.4)] bg-[oklch(0.72_0.21_45/0.08)] text-[oklch(0.85_0.15_55)] text-xs font-mono uppercase tracking-[0.18em]">
      <Icon size={12} /> {children}
    </div>
  );
}

// ---------- Page ----------

function EmpireGym() {
  const [navOpen, setNavOpen] = useState(false);
  const [bookingState, setBookingState] = useState<"idle" | "sending" | "sent">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  // Reveal on scroll
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("eg-rise");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const handleBooking = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBookingState("sending");
    // FormSubmit.co — zero-config: sends form to CFG.email, no signup needed.
    // Activate by submitting once and confirming the email Owner receives.
    const fd = new FormData(e.currentTarget);
    fetch(`https://formsubmit.co/ajax/${CFG.email}`, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: fd,
    })
      .then((r) => r.json())
      .then(() => {
        setBookingState("sent");
        formRef.current?.reset();
      })
      .catch(() => setBookingState("idle"));
  };

  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#facilities", label: "Facilities" },
    { href: "#pricing", label: "Pricing" },
    { href: "#schedule", label: "Schedule" },
    { href: "#location", label: "Visit" },
  ];

  return (
    <div className="eg-body min-h-screen overflow-x-hidden">
      {/* ============= NAV ============= */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[oklch(0.14_0.012_50/0.7)] border-b border-[var(--eg-border)]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2.5 group">
            <div className="relative h-9 w-9 rounded-lg bg-gradient-to-br from-[oklch(0.72_0.21_45)] to-[oklch(0.78_0.19_70)] flex items-center justify-center shadow-[0_0_24px_oklch(0.72_0.21_45/0.5)] group-hover:rotate-6 transition-transform">
              <Dumbbell size={18} className="text-[oklch(0.14_0.012_50)]" strokeWidth={2.6} />
            </div>
            <div className="leading-none">
              <div className="eg-display text-[15px]">Empire</div>
              <div className="text-[9px] font-mono tracking-[0.3em] text-[var(--eg-muted)]">
                GYM · KHALDA
              </div>
            </div>
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm text-[var(--eg-muted)]">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-[var(--eg-text)] transition-colors">
                {l.label}
              </a>
            ))}
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[oklch(0.72_0.21_45)] text-[oklch(0.14_0.012_50)] text-sm font-semibold hover:bg-[oklch(0.78_0.21_50)] transition-colors"
          >
            <MessageCircle size={14} /> Book Now
          </a>
          <button onClick={() => setNavOpen(true)} className="md:hidden p-2 -mr-2">
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {navOpen && (
        <div className="fixed inset-0 z-[60] bg-[oklch(0.14_0.012_50/0.97)] backdrop-blur-xl md:hidden flex flex-col">
          <div className="flex items-center justify-between px-5 h-16 border-b border-[var(--eg-border)]">
            <span className="eg-display">Menu</span>
            <button onClick={() => setNavOpen(false)} className="p-2 -mr-2">
              <X size={22} />
            </button>
          </div>
          <div className="flex flex-col gap-6 p-8 text-2xl eg-display">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setNavOpen(false)}>
                {l.label}
              </a>
            ))}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              onClick={() => setNavOpen(false)}
              className="mt-4 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[oklch(0.72_0.21_45)] text-[oklch(0.14_0.012_50)] text-base"
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* ============= HERO ============= */}
      <section id="top" className="relative pt-16 min-h-screen flex flex-col">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Empire Gym interior"
            className="w-full h-full object-cover opacity-50"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.14_0.012_50/0.6)] via-[oklch(0.14_0.012_50/0.5)] to-[var(--eg-bg)]" />
          <div className="absolute inset-0 eg-noise opacity-40 mix-blend-overlay" />
        </div>

        <div className="relative flex-1 flex items-center max-w-7xl mx-auto px-5 lg:px-8 py-20 w-full">
          <div className="max-w-3xl">
            <div data-reveal className="opacity-0">
              <SectionTag icon={MapPin}>Khalda · Amman · Jordan</SectionTag>
            </div>
            <h1
              data-reveal
              className="opacity-0 mt-6 eg-display text-[clamp(3rem,11vw,7.5rem)] leading-[0.85] tracking-[-0.05em]"
              style={{ animationDelay: "120ms" }}
            >
              Train like
              <br />
              <span className="bg-gradient-to-r from-[oklch(0.72_0.21_45)] via-[oklch(0.78_0.19_70)] to-[oklch(0.72_0.21_45)] bg-clip-text text-transparent">
                a king.
              </span>
            </h1>
            <p
              data-reveal
              className="opacity-0 mt-6 max-w-lg text-base sm:text-lg text-[var(--eg-muted)] leading-relaxed"
              style={{ animationDelay: "240ms" }}
            >
              Heavy iron, modern machines, and coaches who actually care.
              No crowds. No contracts. Just the work.
            </p>
            <div
              data-reveal
              className="opacity-0 mt-8 flex flex-wrap gap-3"
              style={{ animationDelay: "360ms" }}
            >
              <a
                href="#book"
                className="eg-pulse-cta inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[oklch(0.72_0.21_45)] text-[oklch(0.14_0.012_50)] font-semibold hover:bg-[oklch(0.78_0.21_50)] transition-all hover:translate-y-[-2px]"
              >
                Free Trial Session <ArrowRight size={16} />
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-[var(--eg-border)] hover:border-[oklch(0.72_0.21_45/0.6)] hover:bg-[oklch(0.72_0.21_45/0.06)] transition-all"
              >
                <MessageCircle size={16} /> WhatsApp
              </a>
            </div>

            <div
              data-reveal
              className="opacity-0 mt-12 flex flex-wrap gap-x-8 gap-y-4"
              style={{ animationDelay: "480ms" }}
            >
              {[
                { v: "500+", l: "Members strong" },
                { v: "8", l: "Expert coaches" },
                { v: "18h", l: "Open daily" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="eg-display text-2xl text-[oklch(0.85_0.18_55)]">{s.v}</div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--eg-muted)] font-mono">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <a
          href="#about"
          className="relative mx-auto mb-8 text-[var(--eg-muted)] flex flex-col items-center gap-1 text-[10px] font-mono tracking-[0.3em] animate-bounce"
        >
          SCROLL <ChevronDown size={14} />
        </a>
      </section>

      {/* ============= MARQUEE ============= */}
      <Stripe />
      <div className="bg-[oklch(0.18_0.015_50)] py-5 overflow-hidden border-y border-[var(--eg-border)]">
        <div className="eg-marquee-track items-center gap-12 px-6 text-3xl eg-display text-[var(--eg-muted)]">
          {Array.from({ length: 2 }).map((_, dup) => (
            <div key={dup} className="flex items-center gap-12 shrink-0">
              {["Strength", "Discipline", "Community", "No Excuses", "Results", "Iron"].map((t, i) => (
                <span key={`${dup}-${i}`} className="flex items-center gap-12 shrink-0">
                  {t}
                  <Flame size={20} className="text-[oklch(0.72_0.21_45)]" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ============= ABOUT ============= */}
      <section id="about" className="max-w-7xl mx-auto px-5 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div data-reveal className="opacity-0 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img
                src={weightsImg}
                alt="Weights"
                loading="lazy"
                width={1280}
                height={1280}
                className="rounded-2xl aspect-square object-cover w-full"
              />
              <img
                src={cardioImg}
                alt="Cardio area"
                loading="lazy"
                width={1280}
                height={1280}
                className="rounded-2xl aspect-[4/5] object-cover w-full"
              />
            </div>
            <div className="pt-12">
              <img
                src={cablesImg}
                alt="Cable machine"
                loading="lazy"
                width={1280}
                height={1600}
                className="rounded-2xl aspect-[4/5] object-cover w-full"
              />
            </div>
          </div>

          <div data-reveal className="opacity-0">
            <SectionTag icon={Trophy}>About Empire</SectionTag>
            <h2 className="mt-5 eg-display text-4xl sm:text-5xl lg:text-6xl leading-[0.95]">
              Built for the
              <br />
              <span className="text-[oklch(0.78_0.19_70)]">grind.</span>
            </h2>
            <p className="mt-6 text-[var(--eg-muted)] text-lg leading-relaxed">
              Empire Gym is Khalda's home for serious training. We built this
              place for people who show up — not just to be seen, but to put
              in the work. Heavy free weights, modern machines, recovery space,
              and coaches who actually train themselves.
            </p>
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {[
                { i: Award, t: "Certified coaches" },
                { i: Heart, t: "Recovery & stretch zone" },
                { i: Users, t: "Women's training hours" },
                { i: Zap, t: "Open 18 hours / day" },
              ].map((f) => (
                <div
                  key={f.t}
                  className="flex items-center gap-3 p-4 rounded-xl border border-[var(--eg-border)] bg-[oklch(0.18_0.015_50/0.5)]"
                >
                  <f.i size={18} className="text-[oklch(0.72_0.21_45)] shrink-0" />
                  <span className="text-sm">{f.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============= FACILITIES ============= */}
      <section id="facilities" className="relative py-24 lg:py-32 border-y border-[var(--eg-border)] bg-[oklch(0.16_0.013_50)]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div data-reveal className="opacity-0 max-w-2xl">
            <SectionTag icon={Dumbbell}>What's inside</SectionTag>
            <h2 className="mt-5 eg-display text-4xl sm:text-5xl lg:text-6xl leading-[0.95]">
              Everything you need.
              <br />
              <span className="text-[oklch(0.72_0.21_45)]">Nothing you don't.</span>
            </h2>
          </div>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { i: Dumbbell, t: "Free Weights Zone", d: "Olympic platforms, dumbbells up to 60kg, premium barbells & racks." },
              { i: Target, t: "Modern Machines", d: "Cable crossovers, plate-loaded selection, smith machines — full coverage." },
              { i: Heart, t: "Cardio Floor", d: "Treadmills, ellipticals, bikes & stair climbers facing the front window." },
              { i: Users, t: "Group Classes", d: "HIIT, boxing fundamentals, strength circuits — small groups, big energy." },
              { i: Award, t: "Personal Training", d: "1-on-1 coaching with certified pros. Programming built around you." },
              { i: Zap, t: "Recovery Zone", d: "Stretch space, foam rollers, and a quiet corner for cool-down." },
            ].map((f, i) => (
              <div
                key={f.t}
                data-reveal
                className="opacity-0 eg-card p-6 group"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="h-11 w-11 rounded-xl border border-[oklch(0.72_0.21_45/0.4)] bg-[oklch(0.72_0.21_45/0.1)] flex items-center justify-center text-[oklch(0.85_0.18_55)] group-hover:rotate-6 transition-transform">
                  <f.i size={20} />
                </div>
                <h3 className="mt-5 eg-display text-xl">{f.t}</h3>
                <p className="mt-2 text-sm text-[var(--eg-muted)] leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============= PRICING ============= */}
      <section id="pricing" className="max-w-7xl mx-auto px-5 lg:px-8 py-24 lg:py-32">
        <div data-reveal className="opacity-0 text-center">
          <SectionTag icon={Star}>Membership</SectionTag>
          <h2 className="mt-5 eg-display text-4xl sm:text-5xl lg:text-6xl">
            Honest pricing.
          </h2>
          <p className="mt-4 text-[var(--eg-muted)] max-w-xl mx-auto">
            No hidden fees. No long contracts. Cancel anytime — but you won't want to.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {[
            { name: "Monthly", price: 25, unit: "JOD", period: "/ month", perks: ["Full gym access", "Locker use", "Free wifi", "Open 18h/day"] },
            { name: "Quarterly", price: 65, unit: "JOD", period: "/ 3 months", perks: ["Everything in Monthly", "1 free PT session", "10% off supplements", "Bring a friend (1x)"], featured: true },
            { name: "Annual", price: 220, unit: "JOD", period: "/ year", perks: ["Everything in Quarterly", "4 PT sessions free", "Member-only events", "Locked-in price"] },
          ].map((p, i) => (
            <div
              key={p.name}
              data-reveal
              className={`opacity-0 eg-card p-7 relative ${p.featured ? "border-[oklch(0.72_0.21_45/0.7)] shadow-[0_30px_80px_-30px_oklch(0.72_0.21_45/0.5)]" : ""}`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {p.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[oklch(0.72_0.21_45)] text-[oklch(0.14_0.012_50)] text-[10px] font-mono uppercase tracking-[0.2em]">
                  Most Popular
                </div>
              )}
              <div className="text-[var(--eg-muted)] text-sm font-mono uppercase tracking-[0.2em]">
                {p.name}
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="eg-display text-6xl text-[oklch(0.96_0.005_60)]">{p.price}</span>
                <span className="text-[oklch(0.85_0.18_55)] font-mono text-sm">{p.unit}</span>
              </div>
              <div className="text-xs text-[var(--eg-muted)] font-mono">{p.period}</div>
              <ul className="mt-6 space-y-2.5 text-sm">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[oklch(0.72_0.21_45)] shrink-0 mt-0.5" />
                    <span className="text-[oklch(0.92_0.005_60)]">{perk}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#book"
                className={`mt-7 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm transition-all ${
                  p.featured
                    ? "bg-[oklch(0.72_0.21_45)] text-[oklch(0.14_0.012_50)] hover:bg-[oklch(0.78_0.21_50)]"
                    : "border border-[var(--eg-border)] hover:border-[oklch(0.72_0.21_45/0.6)] hover:bg-[oklch(0.72_0.21_45/0.06)]"
                }`}
              >
                Get Started <ArrowRight size={14} />
              </a>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center text-xs font-mono uppercase tracking-[0.2em] text-[var(--eg-muted)]">
          Student discount available · Family rates on request
        </div>
      </section>

      {/* ============= SCHEDULE / HOURS ============= */}
      <section id="schedule" className="border-y border-[var(--eg-border)] bg-[oklch(0.16_0.013_50)]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-24 lg:py-32 grid lg:grid-cols-2 gap-12">
          <div data-reveal className="opacity-0">
            <SectionTag icon={Clock}>Hours & Schedule</SectionTag>
            <h2 className="mt-5 eg-display text-4xl sm:text-5xl lg:text-6xl leading-[0.95]">
              Doors open
              <br />
              <span className="text-[oklch(0.72_0.21_45)]">when you do.</span>
            </h2>
            <div className="mt-8 space-y-3">
              {CFG.hours.map((h) => (
                <div
                  key={h.d}
                  className="flex items-center justify-between p-5 rounded-xl border border-[var(--eg-border)] bg-[oklch(0.18_0.015_50/0.6)]"
                >
                  <span className="font-medium">{h.d}</span>
                  <span className="font-mono text-[oklch(0.85_0.18_55)]">{h.t}</span>
                </div>
              ))}
            </div>
          </div>

          <div data-reveal className="opacity-0">
            <div className="eg-card p-6">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[var(--eg-muted)]">
                <Calendar size={12} /> This week's classes
              </div>
              <div className="mt-5 space-y-2">
                {[
                  { day: "Sun", time: "7:00 PM", name: "HIIT Bootcamp", coach: "Coach Yousef" },
                  { day: "Mon", time: "6:00 PM", name: "Boxing Fundamentals", coach: "Coach Salem" },
                  { day: "Tue", time: "8:00 PM", name: "Strength Circuit", coach: "Coach Lara" },
                  { day: "Wed", time: "7:00 PM", name: "Mobility & Stretch", coach: "Coach Reem" },
                  { day: "Thu", time: "6:00 PM", name: "Power Hour", coach: "Coach Yousef" },
                ].map((c) => (
                  <div
                    key={c.day + c.name}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-[oklch(0.72_0.21_45/0.06)] transition-colors group"
                  >
                    <div className="w-12 text-center">
                      <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--eg-muted)]">{c.day}</div>
                      <div className="text-xs font-mono text-[oklch(0.85_0.18_55)]">{c.time}</div>
                    </div>
                    <div className="flex-1 border-l border-[var(--eg-border)] pl-4">
                      <div className="text-sm font-semibold">{c.name}</div>
                      <div className="text-xs text-[var(--eg-muted)]">{c.coach}</div>
                    </div>
                    <ArrowRight size={14} className="text-[var(--eg-muted)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============= TESTIMONIALS ============= */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-24 lg:py-32">
        <div data-reveal className="opacity-0 text-center max-w-2xl mx-auto">
          <SectionTag icon={Star}>Members</SectionTag>
          <h2 className="mt-5 eg-display text-4xl sm:text-5xl lg:text-6xl">
            Real people.
            <br />
            <span className="text-[oklch(0.78_0.19_70)]">Real progress.</span>
          </h2>
        </div>
        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {[
            { n: "Omar K.", q: "Best gym I've trained at in Amman. Equipment is solid and the coaches actually push you.", r: 5 },
            { n: "Layla H.", q: "Love the women's hours and the recovery zone. Place feels safe and clean every time.", r: 5 },
            { n: "Hamzeh N.", q: "Switched from a chain gym and never looked back. Real iron, real people.", r: 5 },
          ].map((t, i) => (
            <div
              key={t.n}
              data-reveal
              className="opacity-0 eg-card p-6"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex gap-0.5 text-[oklch(0.85_0.18_55)]">
                {Array.from({ length: t.r }).map((_, j) => (
                  <Star key={j} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="mt-4 text-[oklch(0.92_0.005_60)] leading-relaxed">"{t.q}"</p>
              <div className="mt-5 text-sm font-mono text-[var(--eg-muted)]">— {t.n}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ============= LOCATION + BOOKING ============= */}
      <section id="location" className="border-t border-[var(--eg-border)] bg-[oklch(0.16_0.013_50)]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-24 lg:py-32 grid lg:grid-cols-2 gap-12">
          {/* Booking form */}
          <div id="book" data-reveal className="opacity-0">
            <SectionTag icon={Send}>Book Your Free Trial</SectionTag>
            <h2 className="mt-5 eg-display text-4xl sm:text-5xl lg:text-6xl leading-[0.95]">
              Stop scrolling.
              <br />
              <span className="text-[oklch(0.72_0.21_45)]">Start lifting.</span>
            </h2>
            <p className="mt-5 text-[var(--eg-muted)]">
              Drop your info — we'll text you back within an hour to schedule your free session.
            </p>

            <form ref={formRef} onSubmit={handleBooking} className="mt-7 space-y-3">
              {/* FormSubmit hidden config */}
              <input type="hidden" name="_subject" value={`New trial booking — ${CFG.name}`} />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="text" name="_honey" style={{ display: "none" }} />

              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  required
                  name="name"
                  placeholder="Your name"
                  className="px-4 py-3 rounded-lg bg-[oklch(0.18_0.015_50)] border border-[var(--eg-border)] text-sm placeholder:text-[oklch(0.55_0.015_60)] outline-none focus:border-[oklch(0.72_0.21_45/0.6)] focus:shadow-[0_0_0_4px_oklch(0.72_0.21_45/0.12)] transition-all"
                />
                <input
                  required
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  className="px-4 py-3 rounded-lg bg-[oklch(0.18_0.015_50)] border border-[var(--eg-border)] text-sm placeholder:text-[oklch(0.55_0.015_60)] outline-none focus:border-[oklch(0.72_0.21_45/0.6)] focus:shadow-[0_0_0_4px_oklch(0.72_0.21_45/0.12)] transition-all"
                />
              </div>
              <select
                name="goal"
                className="w-full px-4 py-3 rounded-lg bg-[oklch(0.18_0.015_50)] border border-[var(--eg-border)] text-sm outline-none focus:border-[oklch(0.72_0.21_45/0.6)] transition-all"
              >
                <option>Goal — build muscle</option>
                <option>Goal — lose fat</option>
                <option>Goal — general fitness</option>
                <option>Goal — train for sport</option>
              </select>
              <textarea
                name="message"
                rows={3}
                placeholder="Anything we should know? (optional)"
                className="w-full px-4 py-3 rounded-lg bg-[oklch(0.18_0.015_50)] border border-[var(--eg-border)] text-sm placeholder:text-[oklch(0.55_0.015_60)] outline-none focus:border-[oklch(0.72_0.21_45/0.6)] transition-all resize-none"
              />
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={bookingState !== "idle"}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg bg-[oklch(0.72_0.21_45)] text-[oklch(0.14_0.012_50)] font-semibold text-sm hover:bg-[oklch(0.78_0.21_50)] transition-colors disabled:opacity-60"
                >
                  {bookingState === "sending" && "Sending…"}
                  {bookingState === "sent" && (
                    <>
                      <CheckCircle2 size={16} /> Sent — see you soon
                    </>
                  )}
                  {bookingState === "idle" && (
                    <>
                      Send Booking <Send size={14} />
                    </>
                  )}
                </button>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg border border-[var(--eg-border)] hover:border-[oklch(0.72_0.21_45/0.6)] hover:bg-[oklch(0.72_0.21_45/0.06)] text-sm transition-all"
                >
                  <MessageCircle size={14} /> WhatsApp instead
                </a>
              </div>
            </form>
          </div>

          {/* Map */}
          <div data-reveal className="opacity-0">
            <SectionTag icon={MapPin}>Visit us</SectionTag>
            <h3 className="mt-5 eg-display text-2xl">
              {CFG.name} · {CFG.city}
            </h3>
            <div className="mt-5 rounded-2xl overflow-hidden border border-[var(--eg-border)] aspect-[4/3]">
              <iframe
                title="Empire Gym location"
                src={`https://www.google.com/maps?q=${encodeURIComponent(CFG.mapsQuery)}&output=embed`}
                className="w-full h-full grayscale-[30%] contrast-110"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CFG.mapsQuery)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl border border-[var(--eg-border)] bg-[oklch(0.18_0.015_50/0.6)] hover:border-[oklch(0.72_0.21_45/0.6)] transition-colors"
              >
                <MapPin size={18} className="text-[oklch(0.72_0.21_45)]" />
                <div className="text-sm">
                  <div className="font-semibold">Get directions</div>
                  <div className="text-xs text-[var(--eg-muted)]">{CFG.city}</div>
                </div>
              </a>
              <a
                href={`tel:${CFG.whatsapp}`}
                className="flex items-center gap-3 p-4 rounded-xl border border-[var(--eg-border)] bg-[oklch(0.18_0.015_50/0.6)] hover:border-[oklch(0.72_0.21_45/0.6)] transition-colors"
              >
                <Phone size={18} className="text-[oklch(0.72_0.21_45)]" />
                <div className="text-sm">
                  <div className="font-semibold">Call us</div>
                  <div className="text-xs text-[var(--eg-muted)]">{CFG.whatsapp}</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============= FINAL CTA ============= */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--eg-bg)] via-transparent to-[var(--eg-bg)]" />
        </div>
        <div className="relative max-w-3xl mx-auto px-5 text-center">
          <h2 data-reveal className="opacity-0 eg-display text-5xl sm:text-7xl leading-[0.9]">
            Your first session
            <br />
            is on us.
          </h2>
          <p data-reveal className="opacity-0 mt-6 text-[var(--eg-muted)] text-lg" style={{ animationDelay: "150ms" }}>
            Walk in. Lift heavy. Decide if it's home.
          </p>
          <div data-reveal className="opacity-0 mt-8 flex justify-center gap-3 flex-wrap" style={{ animationDelay: "300ms" }}>
            <a
              href="#book"
              className="eg-pulse-cta inline-flex items-center gap-2 px-7 py-4 rounded-lg bg-[oklch(0.72_0.21_45)] text-[oklch(0.14_0.012_50)] font-semibold hover:bg-[oklch(0.78_0.21_50)] transition-all"
            >
              Book Free Trial <ArrowRight size={16} />
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-lg border border-[var(--eg-border)] hover:border-[oklch(0.72_0.21_45/0.6)] hover:bg-[oklch(0.72_0.21_45/0.06)] transition-all"
            >
              <MessageCircle size={16} /> Message us
            </a>
          </div>
        </div>
      </section>

      {/* ============= FOOTER ============= */}
      <Stripe />
      <footer className="bg-[oklch(0.12_0.012_50)] py-12">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[oklch(0.72_0.21_45)] to-[oklch(0.78_0.19_70)] flex items-center justify-center">
                <Dumbbell size={18} className="text-[oklch(0.14_0.012_50)]" strokeWidth={2.6} />
              </div>
              <div className="leading-none">
                <div className="eg-display text-[15px]">Empire</div>
                <div className="text-[9px] font-mono tracking-[0.3em] text-[var(--eg-muted)]">
                  GYM · KHALDA
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm text-[var(--eg-muted)] leading-relaxed">
              Khalda's home for serious training. Real iron, real coaches, real progress.
            </p>
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--eg-muted)]">Visit</div>
            <div className="mt-3 text-sm space-y-1.5">
              <div>{CFG.city}</div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CFG.mapsQuery)}`}
                target="_blank"
                rel="noreferrer"
                className="text-[oklch(0.85_0.18_55)] hover:underline"
              >
                Get directions →
              </a>
            </div>
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--eg-muted)]">Hours</div>
            <div className="mt-3 text-sm space-y-1.5 text-[var(--eg-muted)]">
              {CFG.hours.map((h) => (
                <div key={h.d}>
                  <span className="text-[oklch(0.92_0.005_60)]">{h.d}</span> · {h.t}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--eg-muted)]">Connect</div>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-[oklch(0.85_0.18_55)]">
                <MessageCircle size={14} /> WhatsApp
              </a>
              <a href={`https://instagram.com/${CFG.instagram}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-[oklch(0.85_0.18_55)]">
                <Instagram size={14} /> @{CFG.instagram}
              </a>
              <a href={`tel:${CFG.whatsapp}`} className="inline-flex items-center gap-2 hover:text-[oklch(0.85_0.18_55)]">
                <Phone size={14} /> {CFG.whatsapp}
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-5 lg:px-8 mt-10 pt-6 border-t border-[var(--eg-border)] flex flex-col sm:flex-row justify-between gap-3 text-xs text-[var(--eg-muted)] font-mono uppercase tracking-[0.18em]">
          <div>© {new Date().getFullYear()} {CFG.name}. All rights reserved.</div>
          <div>Made with iron in Amman.</div>
        </div>
      </footer>
    </div>
  );
}
