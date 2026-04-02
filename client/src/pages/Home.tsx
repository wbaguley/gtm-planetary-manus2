import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

// ─── Hero Right-Side: AI Agent Dashboard Panel ────────────────────────────────
function HeroAgentPanel() {
  const [tick, setTick] = useState(0);
  const [taskIndices, setTaskIndices] = useState([0, 0, 0, 0, 0]);
  // fadingOut[i] = true while that agent's task is fading out before the swap
  const [fadingOut, setFadingOut] = useState([false, false, false, false, false]);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2000);
    return () => clearInterval(id);
  }, []);

  // Helper: fade out agent i, swap text, fade back in
  const rotateAgent = (i: number, lists: string[][]) => {
    setFadingOut((prev) => { const n = [...prev]; n[i] = true; return n; });
    setTimeout(() => {
      setTaskIndices((prev) => { const n = [...prev]; n[i] = (n[i] + 1) % lists[i].length; return n; });
      setFadingOut((prev) => { const n = [...prev]; n[i] = false; return n; });
    }, 300); // matches the CSS transition duration
  };

  // Rotate one random agent's task every 3 seconds on a staggered basis
  useEffect(() => {
    const lists = agentTaskLists;
    const rotations = [
      setTimeout(() => rotateAgent(0, lists), 0),
      setTimeout(() => rotateAgent(1, lists), 1200),
      setTimeout(() => rotateAgent(2, lists), 2400),
      setTimeout(() => rotateAgent(3, lists), 3600),
      setTimeout(() => rotateAgent(4, lists), 4800),
    ];
    const interval = setInterval(() => {
      const i = Math.floor(Math.random() * 5);
      rotateAgent(i, lists);
    }, 3000);
    return () => { rotations.forEach(clearTimeout); clearInterval(interval); };
  }, []);

  const agentTaskLists = [
    // Voice Agent
    ["Answering inbound call", "Qualifying new lead — HVAC install", "Booking appointment #2041", "Leaving voicemail for missed call", "Transferring to technician"],
    // Dispatch AI
    ["Routing 3 technicians", "Optimizing morning routes", "Reassigning job #847 — tech ran late", "Dispatching nearest crew to Caldwell", "Updating ETAs for 5 open jobs"],
    // Bid Automator
    ["Generating quote #1847", "Pulling material costs for bid", "Emailing estimate to Johnson HVAC", "Recalculating labor hours", "Submitting bid #1848 — $14,200"],
    // Invoice Bot
    ["Waiting for job completion", "Sending invoice #3312 to client", "Following up on overdue payment", "Reconciling QuickBooks entries", "Generating weekly revenue report"],
    // Lead Qualifier
    ["Scoring 12 new leads", "Flagging high-value prospect in CRM", "Sending follow-up to cold lead", "Enriching contact — Boise Plumbing Co.", "Routing hot lead to sales queue"],
  ];

  const agents = [
    { name: "Voice Agent",    status: "ACTIVE", task: agentTaskLists[0][taskIndices[0]], pct: 94 },
    { name: "Dispatch AI",    status: "ACTIVE", task: agentTaskLists[1][taskIndices[1]], pct: 78 },
    { name: "Bid Automator",  status: "ACTIVE", task: agentTaskLists[2][taskIndices[2]], pct: 61 },
    { name: "Invoice Bot",    status: "IDLE",   task: agentTaskLists[3][taskIndices[3]], pct: 0  },
    { name: "Lead Qualifier", status: "ACTIVE", task: agentTaskLists[4][taskIndices[4]], pct: 88 },
  ];

  const metrics = [
    { label: "Calls Handled",   value: tick % 2 === 0 ? "1,847" : "1,848" },
    { label: "Jobs Dispatched", value: "342" },
    { label: "Quotes Sent",     value: tick % 3 === 0 ? "219" : "220" },
    { label: "Uptime",          value: "99.9%" },
  ];

  return (
    <div
      className="w-[440px] rounded-2xl border border-primary/20 bg-black/70 backdrop-blur-md overflow-hidden scan-lines"
      style={{ boxShadow: "0 0 60px rgba(168,85,247,0.15), inset 0 0 40px rgba(168,85,247,0.04)" }}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-primary/15 bg-primary/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-orbitron text-xs text-primary tracking-widest uppercase">GTM Planetary — Live Agents</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-4 border-b border-primary/10">
        {metrics.map((m) => (
          <div key={m.label} className="px-3 py-3 text-center border-r border-primary/10 last:border-r-0">
            <div className="font-orbitron text-sm font-bold text-primary">{m.value}</div>
            <div className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide leading-tight">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Agent list */}
      <div className="divide-y divide-primary/8">
        {agents.map((agent) => (
          <div key={agent.name} className="px-5 py-3">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    agent.status === "ACTIVE" ? "bg-green-400 animate-pulse" : "bg-gray-600"
                  }`}
                />
                <span className="font-orbitron text-xs text-foreground/90">{agent.name}</span>
              </div>
              <span
                className={`text-[10px] font-orbitron px-1.5 py-0.5 rounded border ${
                  agent.status === "ACTIVE"
                    ? "text-green-400 border-green-400/30 bg-green-400/10"
                    : "text-gray-500 border-gray-600/30 bg-gray-800/30"
                }`}
              >
                {agent.status}
              </span>
            </div>
            <div
              className="text-[11px] text-gray-500 mb-1.5 pl-3.5"
              style={{
                opacity: fadingOut[agents.indexOf(agent)] ? 0 : 1,
                transform: fadingOut[agents.indexOf(agent)] ? "translateY(4px)" : "translateY(0)",
                transition: "opacity 300ms ease, transform 300ms ease",
              }}
            >
              {agent.task}
            </div>
            {agent.pct > 0 && (
              <div className="pl-3.5">
                <div className="h-1 rounded-full bg-primary/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-purple-400"
                    style={{
                      width: `${agent.pct}%`,
                      transition: "width 1.5s ease",
                      boxShadow: "0 0 6px rgba(168,85,247,0.6)",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-2.5 border-t border-primary/10 bg-primary/5 flex items-center justify-between">
        <span className="text-[10px] text-gray-600 font-orbitron uppercase tracking-widest">System nominal</span>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" />
          <span className="text-[10px] text-primary/60 font-orbitron">4 agents running</span>
        </div>
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function Home() {
  const [, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedPainPoint, setExpandedPainPoint] = useState<string | null>(null);
  const capabilitiesRef = useRef<HTMLDivElement>(null);

  const contactMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", phone: "", company: "", message: "" });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to send message. Please try again.");
    },
  });

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", company: "", message: "",
  });

  // AI Capabilities for floating cards
  const aiCapabilities = [
    {
      id: "voice",
      icon: "fa-phone-volume",
      title: "Voice AI Agents",
      desc: "Autonomous call handling, lead qualification, appointment booking, and technician dispatch. Trained on YOUR scripts and pricing.",
      color: "from-purple-500 to-pink-500",
      borderColor: "border-purple-500/40",
    },
    {
      id: "document",
      icon: "fa-file-invoice",
      title: "Document Processing",
      desc: "Reads invoices, contracts, permits—extracting data, updating CRM, routing approvals. Fine-tuned on trade documents.",
      color: "from-cyan-500 to-blue-500",
      borderColor: "border-cyan-500/40",
    },
    {
      id: "scheduling",
      icon: "fa-calendar-check",
      title: "Scheduling & Dispatch",
      desc: "Schedules jobs, optimizes routes, dispatches techs, rebalances workloads in real-time. Reduces drive time by 30%.",
      color: "from-green-500 to-emerald-500",
      borderColor: "border-green-500/40",
    },
    {
      id: "bidding",
      icon: "fa-search-dollar",
      title: "Bidding & Estimating",
      desc: "Monitors contract boards, generates estimates, submits bids automatically. Fine-tuned on your win rates and pricing.",
      color: "from-orange-500 to-red-500",
      borderColor: "border-orange-500/40",
    },
    {
      id: "customer",
      icon: "fa-users-cog",
      title: "Customer Lifecycle",
      desc: "Predicts maintenance needs, sends proactive reminders, identifies upsells. Turns one-time jobs into recurring revenue.",
      color: "from-violet-500 to-purple-500",
      borderColor: "border-violet-500/40",
    },
    {
      id: "models",
      icon: "fa-brain",
      title: "Custom Fine-Tuned Models",
      desc: "Trained on HVAC codes, plumbing regs, electrical specs. Not generic ChatGPT—YOUR trade, YOUR data, YOUR processes.",
      color: "from-pink-500 to-rose-500",
      borderColor: "border-pink-500/40",
    },
  ];

  // Trade Pain Points
  const painPoints = [
    {
      id: "chaos",
      icon: "fa-calendar-times",
      title: "Job Management Chaos",
      problem: "Missed deadlines. Scheduling nightmares. No visibility into who's doing what.",
      solution: "AI agents that schedule, dispatch, and track every job in real-time. Complete visibility across your entire operation.",
    },
    {
      id: "systems",
      icon: "fa-link-slash",
      title: "System Overload",
      problem: "5-10 tools that don't talk. Entering the same data 4 times. Information silos.",
      solution: "One AI copilot that connects everything. Ask it anything, get instant answers from all your systems.",
    },
    {
      id: "cashflow",
      icon: "fa-money-bill-wave",
      title: "Cash Flow Crunch",
      problem: "Slow payments. Can't track profitability per job. Financial blind spots.",
      solution: "AI that tracks every dollar, automates invoicing, and predicts cash flow. Get paid faster.",
    },
    {
      id: "contracts",
      icon: "fa-bullseye",
      title: "Contract Hunting",
      problem: "Manual bidding. Leads slip away. No follow-up system.",
      solution: "AI agents that find contracts, generate bids, and nurture leads automatically. Never miss an opportunity.",
    },
    {
      id: "admin",
      icon: "fa-clock",
      title: "Admin Time Sink",
      problem: "60% of your day on paperwork instead of billable work.",
      solution: "AI handles quotes, invoices, follow-ups, and CRM updates while you work. Reclaim your time.",
    },
    {
      id: "scaling",
      icon: "fa-chart-line",
      title: "Scaling Wall",
      problem: "Can't grow without adding headcount. 6-month ramp time. Turnover risk.",
      solution: "AI workforce scales instantly. No hiring. No training. No turnover. Deploy agents in days, not months.",
    },
    {
      id: "service",
      icon: "fa-phone-slash",
      title: "Customer Service Gaps",
      problem: "Overwhelmed front desk. Slow response times. Calls go to voicemail.",
      solution: "AI voice agents answer every call, book appointments, and handle FAQs 24/7. Zero missed calls.",
    },
    {
      id: "tech",
      icon: "fa-file-alt",
      title: "Tech Resistance",
      problem: "Stuck on paper and spreadsheets. New systems are too complicated.",
      solution: "Just talk to your AI copilot. No training needed. Works like a team member, not software.",
    },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - offset, behavior: "smooth" });
      setActiveSection(sectionId);
      setMobileMenuOpen(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("active");
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <img src="/logo.png" alt="GTM Planetary Logo" className="h-12" />
            </div>

            <button
              className="md:hidden text-foreground ml-auto"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <i className="fas fa-bars text-2xl"></i>
            </button>

            <div className="flex items-center gap-6">
              <ul
                className={`${
                  mobileMenuOpen ? "flex" : "hidden"
                } md:flex flex-col md:flex-row absolute md:relative top-20 md:top-0 left-0 right-0 bg-background md:bg-transparent border-b md:border-0 border-border md:space-x-8 p-4 md:p-0`}
              >
                {["home", "capabilities", "solutions", "how-it-works", "about", "blog", "contact"].map((section) => (
                  <li key={section}>
                    {section === "blog" ? (
                      <a
                        href="/blog"
                        className="block w-full md:w-auto text-left md:text-center py-2 md:py-0 font-orbitron uppercase text-sm tracking-wider transition-colors text-foreground hover:text-primary"
                      >
                        Blog
                      </a>
                    ) : (
                      <button
                        onClick={() => scrollToSection(section)}
                        className={`block w-full md:w-auto text-left md:text-center py-2 md:py-0 font-orbitron uppercase text-sm tracking-wider transition-colors ${
                          activeSection === section ? "text-primary" : "text-foreground hover:text-primary"
                        }`}
                      >
                        {section === "capabilities"
                          ? "AI Capabilities"
                          : section === "how-it-works"
                          ? "How It Works"
                          : section}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              <a
                href="tel:888-451-2290"
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary rounded-lg hover:bg-primary/20 transition-all animate-shake-periodic"
              >
                <i className="fas fa-phone text-primary"></i>
                <span className="font-bold text-primary">888-451-2290</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════
          HERO SECTION — Full viewport, centered, no sphere
         ═══════════════════════════════════════════════════════════════ */}
      <section
        id="home"
        className="relative min-h-screen flex items-center overflow-hidden"
      >
        {/* Animated radial glow background */}
        <div className="absolute inset-0 grid-bg" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 60% 50%, rgba(168,85,247,0.12) 0%, transparent 70%)",
          }}
        />
        {/* AI Agent Dashboard Visual */}
        <div className="absolute right-[4%] top-1/2 -translate-y-1/2 pointer-events-none hidden lg:block" style={{ zIndex: 2 }}>
          <HeroAgentPanel />
        </div>

        {/* Gradient overlay left */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent z-[1]" />

        {/* Hero Content */}
        <div className="container relative z-10 px-4 pt-24 pb-16">
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-1.5 border border-primary/40 rounded-full text-xs font-orbitron uppercase tracking-widest text-primary mb-6">
              AI Workforce for Trades
            </div>
            <h1 className="font-orbitron text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6">
              STOP HIRING.
              <br />
              <span className="glitch neon-glow inline-block" data-text="START DEPLOYING.">
                START DEPLOYING.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-10">
              Custom AI models and autonomous agents that handle operations, bidding, scheduling, and customer service—so you can focus on the work that matters.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="font-orbitron uppercase tracking-wider bg-primary hover:bg-primary/90 pulse-border"
                onClick={() => scrollToSection("contact")}
              >
                Build Your AI Workforce
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="font-orbitron uppercase tracking-wider"
                onClick={() => scrollToSection("solutions")}
              >
                See What We Solve
              </Button>
            </div>

            {/* Stats row */}
            <div className="mt-16 flex flex-wrap gap-8">
              {[
                { value: "24/7", label: "Always On" },
                { value: "0", label: "Missed Calls" },
                { value: "30%", label: "Less Drive Time" },
                { value: "Days", label: "Not Months to Deploy" },
              ].map((stat) => (
                <div key={stat.label} className="text-left">
                  <div className="font-orbitron text-3xl font-bold text-primary neon-glow">{stat.value}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center z-10">
          <span className="block text-sm mb-2 text-muted-foreground">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-primary/50 rounded-full mx-auto flex justify-center">
            <div className="w-1.5 h-3 bg-primary rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          AI CAPABILITIES — Floating cards with staggered reveal
         ═══════════════════════════════════════════════════════════════ */}
      <section id="capabilities" ref={capabilitiesRef} className="py-24 bg-black relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(168,85,247,0.3) 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="container relative z-10">
          <div className="text-center mb-16 reveal">
            <div className="inline-block px-4 py-1.5 border border-primary/30 rounded-full text-xs font-orbitron uppercase tracking-widest text-primary mb-6">
              What We Deploy
            </div>
            <h2 className="font-orbitron text-4xl md:text-5xl font-bold mb-4">
              YOUR <span className="text-primary neon-glow">AI WORKFORCE</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Not chatbots. Not software. Autonomous agents and custom models that execute real work.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiCapabilities.map((cap) => (
              <div
                key={cap.id}
                className={`reveal cap-card group relative bg-black/80 backdrop-blur-sm border ${cap.borderColor} rounded-xl p-6 hover:border-primary/60 transition-all duration-500 cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10`}
              >
                {/* Gradient accent top */}
                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${cap.color} rounded-t-xl opacity-60 group-hover:opacity-100 transition-opacity`} />

                <div className={`w-14 h-14 bg-gradient-to-br ${cap.color} rounded-lg flex items-center justify-center mb-4 shadow-lg`}>
                  <i className={`fas ${cap.icon} text-xl text-white`}></i>
                </div>
                <h3 className="font-orbitron text-lg font-bold text-white mb-3">{cap.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{cap.desc}</p>

                {/* Hover glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cap.color} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-500`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          PAIN POINTS — Clean card grid, no scroll pin
         ═══════════════════════════════════════════════════════════════ */}
      <section id="solutions" className="py-24 bg-black relative overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(168,85,247,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.08) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="container relative z-10 px-4">
          <div className="text-center mb-16 reveal">
            <div className="inline-block px-4 py-1.5 border border-red-500/30 rounded-full text-xs font-orbitron uppercase tracking-widest text-red-400 mb-6">
              Sound Familiar?
            </div>
            <h2 className="font-orbitron text-4xl md:text-5xl font-bold mb-4">
              WHAT'S <span className="text-red-400">HOLDING YOU BACK?</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Every one of these is solved by deploying the right AI agent.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {painPoints.map((point) => (
              <div
                key={point.id}
                className="reveal cursor-pointer group"
                onClick={() => setExpandedPainPoint(expandedPainPoint === point.id ? null : point.id)}
              >
                <div className={`flex items-start gap-4 py-4 px-5 rounded-xl border transition-all duration-300 ${
                  expandedPainPoint === point.id
                    ? "bg-primary/5 border-primary/40"
                    : "bg-white/[0.02] border-white/5 hover:border-primary/20 hover:bg-white/[0.04]"
                }`}>
                  <div className="w-10 h-10 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-red-500/20 transition-colors">
                    <i className={`fas ${point.icon} text-sm text-red-400`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-orbitron text-sm font-bold text-white">{point.title}</h3>
                      <i className={`fas fa-chevron-${expandedPainPoint === point.id ? "up" : "down"} text-xs text-gray-600 flex-shrink-0`}></i>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{point.problem}</p>
                    {expandedPainPoint === point.id && (
                      <div className="mt-3 pt-3 border-t border-green-500/20">
                        <p className="text-xs text-green-400/80 leading-relaxed">
                          <span className="font-mono text-[10px] text-green-500 mr-1">RESOLVE:</span>
                          {point.solution}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          HOW IT WORKS — Three deployment methods
         ═══════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-24 bg-black relative">
        <div className="container">
          <div className="text-center mb-16 reveal">
            <div className="inline-block px-4 py-1.5 border border-primary/30 rounded-full text-xs font-orbitron uppercase tracking-widest text-primary mb-6">
              Deployment
            </div>
            <h2 className="font-orbitron text-4xl md:text-5xl font-bold mb-4">
              THREE WAYS TO <span className="text-primary neon-glow">DEPLOY AI</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: "fa-phone-volume",
                title: "Autonomous Voice Agents",
                color: "from-purple-500 to-pink-500",
                items: [
                  "Answers calls, qualifies leads, books jobs autonomously",
                  "Dispatches technicians without escalation",
                  "Trained on YOUR pricing, services, and scripts",
                  "Executes tasks, not just conversations",
                ],
              },
              {
                icon: "fa-cogs",
                title: "Operational Agents",
                color: "from-cyan-500 to-blue-500",
                items: [
                  "Processes documents, updates CRM, routes approvals",
                  "Schedules jobs, dispatches techs in real-time",
                  "Monitors contract boards and submits bids",
                  "Fine-tuned on trade-specific workflows",
                ],
              },
              {
                icon: "fa-brain",
                title: "Custom Fine-Tuned Models",
                color: "from-green-500 to-emerald-500",
                items: [
                  "Trained on HVAC codes, plumbing regs, electrical specs",
                  "Understands YOUR trade, YOUR processes, YOUR data",
                  "Not generic ChatGPT—industry-specific intelligence",
                  "Connects all systems and executes autonomously",
                ],
              },
            ].map((method, i) => (
              <div key={i} className="reveal group relative bg-black/60 border border-primary/20 rounded-xl p-8 hover:border-primary/50 transition-all duration-500">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className={`w-16 h-16 bg-gradient-to-br ${method.color} rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                  <i className={`fas ${method.icon} text-2xl text-white`}></i>
                </div>
                <h3 className="font-orbitron text-xl font-bold mb-5 text-white">{method.title}</h3>
                <ul className="space-y-3">
                  {method.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-gray-400 text-sm">
                      <i className="fas fa-check text-primary mt-0.5 text-xs"></i>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          ABOUT — Updated messaging
         ═══════════════════════════════════════════════════════════════ */}
      <section id="about" className="py-24 bg-black relative">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle at 50% 50%, rgba(168,85,247,0.15) 0%, transparent 50%)",
            }}
          />
        </div>
        <div className="container relative z-10">
          <div className="text-center mb-12 reveal">
            <div className="inline-block px-4 py-1.5 border border-primary/30 rounded-full text-xs font-orbitron uppercase tracking-widest text-primary mb-6">
              Why GTM Planetary
            </div>
            <h2 className="font-orbitron text-4xl md:text-5xl font-bold mb-4">
              BUILT FOR <span className="text-primary neon-glow">TRADES, NOT TECH COMPANIES</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6 reveal">
            <p className="text-lg text-gray-300 leading-relaxed">
              GTM Planetary builds custom fine-tuned AI models and autonomous operational agents exclusively for trade businesses.
            </p>
            <p className="text-gray-400 leading-relaxed">
              We're not selling chatbots or software subscriptions. We deploy AI agents that execute real work—scheduling jobs, processing invoices, bidding contracts, managing customer lifecycles—without human intervention.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Our models are trained on trade-specific data: HVAC service codes, plumbing regulations, electrical specs, construction workflows. Not a generic Chat bot or Agent. Industry-specific intelligence that understands YOUR trade.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Every agent is fine-tuned on your business—your pricing, your processes, your customer data. They don't just answer questions. They complete tasks, make decisions, and improve operations autonomously.
            </p>
            <div className="pt-4 border-t border-primary/20 mt-8">
              <p className="text-lg text-primary font-bold">
                Stop fighting for hiring budget. Deploy autonomous agents that scale instantly, work 24/7, and execute tasks without supervision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CONTACT
         ═══════════════════════════════════════════════════════════════ */}
      <section id="contact" className="py-24 bg-black relative">
        <div className="container">
          <div className="text-center mb-12 reveal">
            <div className="inline-block px-4 py-1.5 border border-primary/30 rounded-full text-xs font-orbitron uppercase tracking-widest text-primary mb-6">
              Get Started
            </div>
            <h2 className="font-orbitron text-4xl md:text-5xl font-bold mb-4">
              LET'S BUILD YOUR <span className="text-primary neon-glow">AI WORKFORCE</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
            <div className="reveal">
              <h3 className="font-orbitron text-2xl font-bold mb-6 text-white">Get In Touch</h3>
              <div className="space-y-6">
                {[
                  { icon: "fa-phone", label: "Phone", value: "888-451-2290", href: "tel:888-451-2290" },
                  { icon: "fa-envelope", label: "Email", value: "wyatt@gtmplanetary.com", href: "mailto:wyatt@gtmplanetary.com" },
                  { icon: "fa-globe", label: "Website", value: "gtmplanetary.com", href: "https://gtmplanetary.com" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <i className={`fas ${item.icon} text-primary`}></i>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">{item.label}</p>
                      <a
                        href={item.href}
                        target={item.icon === "fa-globe" ? "_blank" : undefined}
                        rel={item.icon === "fa-globe" ? "noopener noreferrer" : undefined}
                        className="text-lg font-bold text-primary hover:text-primary/80 transition-colors"
                      >
                        {item.value}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="reveal">
              <h3 className="font-orbitron text-2xl font-bold mb-6 text-white">Send A Message</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { id: "name", label: "Name", type: "text", required: true },
                  { id: "email", label: "Email", type: "email", required: true },
                  { id: "phone", label: "Phone", type: "tel", required: false },
                  { id: "company", label: "Company", type: "text", required: false },
                ].map((field) => (
                  <div key={field.id}>
                    <Label htmlFor={field.id}>{field.label}</Label>
                    <Input
                      id={field.id}
                      type={field.type}
                      value={(formData as any)[field.id]}
                      onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                      required={field.required}
                      className="bg-black/50 border-primary/20 focus:border-primary"
                    />
                  </div>
                ))}
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={4}
                    className="bg-black/50 border-primary/20 focus:border-primary"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full font-orbitron uppercase tracking-wider bg-primary hover:bg-primary/90"
                  disabled={contactMutation.isPending}
                >
                  {contactMutation.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-black border-t border-border/30">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">© 2026 GTM Planetary LLC. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="/privacy-policy" className="text-sm text-gray-500 hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="/terms-and-conditions" className="text-sm text-gray-500 hover:text-primary transition-colors">
                Terms & Conditions
              </a>
              <a href="/admin/blog" className="text-sm text-gray-500 hover:text-primary transition-colors opacity-20">
                ·
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
