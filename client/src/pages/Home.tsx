import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";
import ParticleMorph from "@/components/ParticleMorph";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedPainPoint, setExpandedPainPoint] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [heroProgress, setHeroProgress] = useState(0);
  const [painProgress, setPainProgress] = useState(0);
  const particlesInitialized = useRef(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const painRef = useRef<HTMLDivElement>(null);
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

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP ScrollTrigger for pinned sections
  useEffect(() => {
    // Hero section pin - morphing object stays while you scroll
    if (heroRef.current) {
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "+=400%",
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          setHeroProgress(self.progress);
        },
      });
    }

    // Pain points section pin - longer duration to reveal all 8 pain points
    if (painRef.current) {
      ScrollTrigger.create({
        trigger: painRef.current,
        start: "top top",
        end: "+=400%",
        pin: true,
        scrub: 0.8,
        onUpdate: (self) => {
          setPainProgress(self.progress);
        },
      });
    }

    // Capabilities section reveal animations
    if (capabilitiesRef.current) {
      const cards = capabilitiesRef.current.querySelectorAll(".cap-card");
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 60, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // Particles.js initialization
  useEffect(() => {
    if (!particlesInitialized.current && typeof window !== "undefined") {
      particlesInitialized.current = true;
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";
      script.async = true;
      script.onload = () => {
        if ((window as any).particlesJS) {
          (window as any).particlesJS("particles-js", {
            particles: {
              number: { value: 60, density: { enable: true, value_area: 900 } },
              color: { value: "#ad18fc" },
              shape: { type: "circle" },
              opacity: { value: 0.4, random: true, anim: { enable: true, speed: 0.8, opacity_min: 0.1 } },
              size: { value: 2.5, random: true, anim: { enable: true, speed: 1.5, size_min: 0.1 } },
              line_linked: { enable: true, distance: 150, color: "#ad18fc", opacity: 0.3, width: 0.8 },
              move: { enable: true, speed: 0.8, direction: "none", random: true, straight: false, out_mode: "out" },
            },
            interactivity: {
              detect_on: "canvas",
              events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" }, resize: true },
              modes: { grab: { distance: 140, line_linked: { opacity: 0.6 } }, push: { particles_nb: 3 } },
            },
            retina_detect: true,
          });
        }
      };
      document.head.appendChild(script);
    }
  }, []);

  // Scroll reveal animation for non-pinned sections
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

  // Determine which pain points to show based on scroll progress
  // First 10% shows the heading, then each pain point gets ~11% of the remaining scroll
  const adjustedProgress = Math.max(0, (painProgress - 0.05) / 0.9);
  const visiblePainPoints = Math.min(painPoints.length, Math.floor(adjustedProgress * (painPoints.length + 1)) + 1);

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
          HERO SECTION — Pinned, text left, 3D morphing object right
         ═══════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        id="home"
        className="relative h-screen flex items-center overflow-hidden"
      >
        {/* Parallax Background */}
        <div className="absolute inset-0 grid-bg" style={{ transform: `translateY(${heroProgress * 100}px)` }} />
        <div id="particles-js" className="absolute inset-0" style={{ transform: `translateY(${heroProgress * 60}px)` }} />

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent z-[1]" />

        {/* Hero Content */}
        <div className="container relative z-10 px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left: Text Content — fades/moves based on scroll progress */}
            <div
              className="space-y-8"
              style={{
                opacity: Math.max(0, 1 - heroProgress * 0.8),
                transform: `translateY(${heroProgress * -30}px)`,
              }}
            >
              <div className="inline-block px-4 py-1.5 border border-primary/40 rounded-full text-xs font-orbitron uppercase tracking-widest text-primary mb-4">
                AI Workforce for Trades
              </div>
              <h1 className="font-orbitron text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
                STOP HIRING.
                <br />
                <span className="glitch neon-glow inline-block" data-text="START DEPLOYING.">
                  START DEPLOYING.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
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
            </div>

            {/* Right: Real-time particle morphing */}
            <div
              className="h-[500px] lg:h-[600px] relative flex items-center justify-center"
              style={{
                transform: `scale(${1 + heroProgress * 0.15}) translateY(${heroProgress * -10}px)`,
              }}
            >
              <ParticleMorph
                scrollProgress={heroProgress}
                variant="hero"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center z-10"
          style={{ opacity: Math.max(0, 1 - heroProgress * 2) }}
        >
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
          <div className="text-center mb-16">
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
            {aiCapabilities.map((cap, i) => (
              <div
                key={cap.id}
                className={`cap-card group relative bg-black/80 backdrop-blur-sm border ${cap.borderColor} rounded-xl p-6 hover:border-primary/60 transition-all duration-500 cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10`}
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
          PAIN POINTS — Pinned section, scifi retro reveal
         ═══════════════════════════════════════════════════════════════ */}
      <section
        ref={painRef}
        id="solutions"
        className="relative h-screen flex items-center overflow-hidden bg-black"
      >
        {/* Animated scan line */}
        <div
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background: `linear-gradient(transparent ${painProgress * 100}%, rgba(168,85,247,0.05) ${painProgress * 100 + 0.5}%, transparent ${painProgress * 100 + 1}%)`,
          }}
        />

        {/* Grid background */}
        <div className="absolute inset-0 opacity-15">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(168,85,247,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.08) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
              transform: `translateY(${painProgress * 30}px)`,
            }}
          />
        </div>

        <div className="container relative z-10 px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: Pain points list — revealed one by one */}
            <div className="space-y-2 max-h-[80vh] overflow-hidden">
              <div className="mb-8">
                <div className="inline-block px-4 py-1.5 border border-red-500/30 rounded-full text-xs font-orbitron uppercase tracking-widest text-red-400 mb-4">
                  Sound Familiar?
                </div>
                <h2 className="font-orbitron text-3xl md:text-4xl font-bold">
                  WHAT'S <span className="text-red-400">HOLDING YOU BACK?</span>
                </h2>
              </div>

              {painPoints.map((point, index) => {
                const isVisible = index < visiblePainPoints;
                const isActive = index === visiblePainPoints - 1;
                return (
                <div
                  key={point.id}
                  className="cursor-pointer transition-all duration-700 ease-out"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: `translateX(${isVisible ? 0 : -40}px) scale(${isActive ? 1.02 : 1})`,
                    maxHeight: isVisible ? "200px" : "0px",
                    overflow: "hidden",
                    transitionDelay: isVisible ? `${index * 50}ms` : "0ms",
                  }}
                  onClick={() => setExpandedPainPoint(expandedPainPoint === point.id ? null : point.id)}
                >
                  <div className={`flex items-start gap-3 py-3 px-4 rounded-lg hover:bg-white/5 transition-all duration-500 group ${isActive ? 'bg-white/5 border-l-2 border-primary' : 'border-l-2 border-transparent'}`}>
                    <div className="w-8 h-8 bg-red-500/10 border border-red-500/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-red-500/20 transition-colors">
                      <i className={`fas ${point.icon} text-sm text-red-400`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-red-400/60">&gt;_</span>
                        <h3 className="font-orbitron text-sm font-bold text-white">{point.title}</h3>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{point.problem}</p>
                      {expandedPainPoint === point.id && (
                        <div className="mt-2 pt-2 border-t border-green-500/20">
                          <p className="text-xs text-green-400/80 leading-relaxed">
                            <span className="font-mono text-[10px] text-green-500 mr-1">RESOLVE:</span>
                            {point.solution}
                          </p>
                        </div>
                      )}
                    </div>
                    <i className={`fas fa-chevron-${expandedPainPoint === point.id ? "up" : "down"} text-xs text-gray-600 mt-1`}></i>
                  </div>
                </div>
                );
              })}
            </div>

            {/* Right: Real-time particle morphing for pain points */}
            <div className="h-[500px] lg:h-[600px] relative flex items-center justify-center">
              <ParticleMorph
                scrollProgress={painProgress}
                variant="painPoints"
                className="w-full h-full"
              />
            </div>
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
              Our models are trained on trade-specific data: HVAC service codes, plumbing regulations, electrical specs, construction workflows. Not generic ChatGPT. Industry-specific intelligence that understands YOUR trade.
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
              <a href="#" className="text-sm text-gray-500 hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-primary transition-colors">
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
