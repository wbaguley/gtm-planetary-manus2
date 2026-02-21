import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [expandedPainPoint, setExpandedPainPoint] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const particlesInitialized = useRef(false);

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
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  // AI Capabilities for floating cards
  const aiCapabilities = [
    {
      id: "voice",
      icon: "fa-phone-volume",
      title: "Voice AI Agents",
      shortDesc: "Answer calls 24/7",
      fullDesc: "AI voice agents that answer every call, qualify leads, book appointments, and handle customer service inquiries. Never miss a call again. Works 24/7 without breaks, sick days, or turnover.",
      color: "from-purple-500 to-pink-500"
    },
    {
      id: "document",
      icon: "fa-file-invoice",
      title: "Document Intelligence",
      shortDesc: "Extract data instantly",
      fullDesc: "AI that reads invoices, contracts, permits, and forms—extracting key information automatically. Eliminate manual data entry and reduce errors. Processes hundreds of documents in seconds.",
      color: "from-cyan-500 to-blue-500"
    },
    {
      id: "scheduling",
      icon: "fa-calendar-check",
      title: "Predictive Scheduling",
      shortDesc: "Optimize routes & timing",
      fullDesc: "AI-powered scheduling that optimizes routes, forecasts demand, prevents conflicts, and maximizes technician utilization. Reduce drive time by 30% and increase jobs per day.",
      color: "from-green-500 to-emerald-500"
    },
    {
      id: "bidding",
      icon: "fa-search-dollar",
      title: "Bid Automation",
      shortDesc: "Find & win contracts",
      fullDesc: "AI agents that find contract opportunities, generate competitive bids, and track proposals automatically. Never miss a bidding opportunity. Win more contracts with data-driven pricing.",
      color: "from-orange-500 to-red-500"
    },
    {
      id: "customer",
      icon: "fa-users-cog",
      title: "Customer Intelligence",
      shortDesc: "Predict needs & automate follow-ups",
      fullDesc: "AI that analyzes customer history, predicts service needs, automates follow-ups, and identifies upsell opportunities. Turn one-time customers into lifetime relationships.",
      color: "from-violet-500 to-purple-500"
    },
    {
      id: "copilot",
      icon: "fa-robot",
      title: "Operations Copilot",
      shortDesc: "One AI for all systems",
      fullDesc: "Your AI teammate that connects all your systems—CRM, accounting, scheduling, inventory. Ask it anything, get instant answers. Automate workflows and approvals across your entire business.",
      color: "from-pink-500 to-rose-500"
    }
  ];

  // Trade Pain Points
  const painPoints = [
    {
      id: "chaos",
      icon: "fa-calendar-times",
      title: "Job Management Chaos",
      problem: "Missed deadlines. Scheduling nightmares. No visibility into who's doing what.",
      solution: "AI agents that schedule, dispatch, and track every job in real-time. Complete visibility across your entire operation.",
      color: "border-red-500"
    },
    {
      id: "systems",
      icon: "fa-link-slash",
      title: "System Overload",
      problem: "5-10 tools that don't talk. Entering the same data 4 times. Information silos.",
      solution: "One AI copilot that connects everything. Ask it anything, get instant answers from all your systems.",
      color: "border-orange-500"
    },
    {
      id: "cashflow",
      icon: "fa-money-bill-wave",
      title: "Cash Flow Crunch",
      problem: "Slow payments. Can't track profitability per job. Financial blind spots.",
      solution: "AI that tracks every dollar, automates invoicing, and predicts cash flow. Get paid faster.",
      color: "border-yellow-500"
    },
    {
      id: "contracts",
      icon: "fa-bullseye",
      title: "Contract Hunting",
      problem: "Manual bidding. Leads slip away. No follow-up system.",
      solution: "AI agents that find contracts, generate bids, and nurture leads automatically. Never miss an opportunity.",
      color: "border-green-500"
    },
    {
      id: "admin",
      icon: "fa-clock",
      title: "Admin Time Sink",
      problem: "60% of your day on paperwork instead of billable work.",
      solution: "AI handles quotes, invoices, follow-ups, and CRM updates while you work. Reclaim your time.",
      color: "border-blue-500"
    },
    {
      id: "scaling",
      icon: "fa-chart-line",
      title: "Scaling Wall",
      problem: "Can't grow without adding headcount. 6-month ramp time. Turnover risk.",
      solution: "AI workforce scales instantly. No hiring. No training. No turnover. Deploy agents in days, not months.",
      color: "border-indigo-500"
    },
    {
      id: "service",
      icon: "fa-phone-slash",
      title: "Customer Service Gaps",
      problem: "Overwhelmed front desk. Slow response times. Calls go to voicemail.",
      solution: "AI voice agents answer every call, book appointments, and handle FAQs 24/7. Zero missed calls.",
      color: "border-purple-500"
    },
    {
      id: "tech",
      icon: "fa-file-alt",
      title: "Tech Resistance",
      problem: "Stuck on paper and spreadsheets. New systems are too complicated.",
      solution: "Just talk to your AI copilot. No training needed. Works like a team member, not software.",
      color: "border-pink-500"
    }
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

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Particles.js initialization
  useEffect(() => {
    if (!particlesInitialized.current && typeof window !== 'undefined') {
      particlesInitialized.current = true;
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
      script.async = true;
      script.onload = () => {
        if ((window as any).particlesJS) {
          (window as any).particlesJS('particles-js', {
        particles: {
          number: {
            value: 80,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: '#ad18fc'
          },
          shape: {
            type: 'circle',
            stroke: {
              width: 0,
              color: '#000000'
            }
          },
          opacity: {
            value: 0.5,
            random: true,
            anim: {
              enable: true,
              speed: 1,
              opacity_min: 0.1,
              sync: false
            }
          },
          size: {
            value: 3,
            random: true,
            anim: {
              enable: true,
              speed: 2,
              size_min: 0.1,
              sync: false
            }
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: '#ad18fc',
            opacity: 0.5,
            width: 1
          },
          move: {
            enable: true,
            speed: 1,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
              enable: true,
              rotateX: 600,
              rotateY: 1200
            }
          }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: {
              enable: true,
              mode: 'grab'
            },
            onclick: {
              enable: true,
              mode: 'push'
            },
            resize: true
          },
          modes: {
            grab: {
              distance: 140,
              line_linked: {
                opacity: 1
              }
            },
            push: {
              particles_nb: 4
            }
          }
        },
        retina_detect: true
          });
        }
      };
      document.head.appendChild(script);
    }
  }, []);

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
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
              <ul className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row absolute md:relative top-20 md:top-0 left-0 right-0 bg-background md:bg-transparent border-b md:border-0 border-border md:space-x-8 p-4 md:p-0`}>
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
                        {section === "capabilities" ? "AI Capabilities" : section === "how-it-works" ? "How It Works" : section}
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

      {/* Hero Section with Parallax */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Parallax Background Layers */}
        <div 
          className="absolute inset-0 grid-bg" 
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        ></div>
        <div 
          id="particles-js" 
          className="absolute inset-0"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        ></div>
        
        {/* Hero Content */}
        <div className="container relative z-10 text-center px-4">
          <h1 className="font-orbitron text-3xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight">
            STOP HIRING. <span className="glitch neon-glow inline-block" data-text="START DEPLOYING.">START DEPLOYING.</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-muted-foreground">
            Custom AI models and autonomous agents that handle operations, bidding, scheduling, and customer service—so you can focus on the work that matters.
          </p>
          
          {/* Floating AI Capability Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            {aiCapabilities.map((capability, index) => (
              <div
                key={capability.id}
                className={`floating-card floating-card-${index + 1} cursor-pointer transition-all duration-300 ${
                  expandedCard === capability.id ? 'scale-105 z-20' : 'hover:scale-105'
                }`}
                onClick={() => setExpandedCard(expandedCard === capability.id ? null : capability.id)}
                style={{
                  animationDelay: `${index * 0.2}s`
                }}
              >
                <Card className={`bg-black/80 backdrop-blur-sm border-2 ${expandedCard === capability.id ? 'border-primary' : 'border-primary/30'} hover:border-primary transition-all duration-300 h-full`}>
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${capability.color} rounded-full flex items-center justify-center mb-4 mx-auto`}>
                      <i className={`fas ${capability.icon} text-2xl text-white`}></i>
                    </div>
                    <h3 className="font-orbitron text-lg font-bold mb-2 text-white">{capability.title}</h3>
                    <p className="text-sm text-gray-400 mb-3">{capability.shortDesc}</p>
                    {expandedCard === capability.id && (
                      <div className="mt-4 pt-4 border-t border-primary/30">
                        <p className="text-sm text-gray-300">{capability.fullDesc}</p>
                      </div>
                    )}
                    <div className="text-xs text-primary mt-3">
                      {expandedCard === capability.id ? 'Click to collapse' : 'Click for details'}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center animate-bounce">
          <span className="block text-sm mb-2">Scroll Down</span>
          <i className="fas fa-chevron-down text-primary"></i>
        </div>
      </section>

      {/* Pain Points Section */}
      <section id="solutions" className="py-20 bg-black relative">
        <div className="container">
          <div className="text-center mb-16 reveal">
            <h2 className="font-orbitron text-4xl md:text-5xl font-bold mb-4">
              WHAT'S <span className="text-primary neon-glow">HOLDING YOU BACK?</span>
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              These are the frustrations we hear from trade businesses every day. Sound familiar?
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {painPoints.map((point, index) => (
              <div
                key={point.id}
                className={`reveal cursor-pointer transition-all duration-300 ${
                  expandedPainPoint === point.id ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setExpandedPainPoint(expandedPainPoint === point.id ? null : point.id)}
              >
                <Card className={`bg-black/80 border-2 ${point.color} hover:border-primary transition-all duration-300 h-full hover:scale-105 hover:shadow-2xl hover:shadow-primary/20`}>
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                      <i className={`fas ${point.icon} text-3xl text-primary`}></i>
                    </div>
                    <h3 className="font-orbitron text-xl font-bold mb-3 text-white">{point.title}</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">The Problem:</p>
                        <p className="text-sm text-gray-400">{point.problem}</p>
                      </div>
                      {expandedPainPoint === point.id && (
                        <div className="mt-4 pt-4 border-t border-primary/30">
                          <p className="text-xs text-primary uppercase tracking-wider mb-1">Our Solution:</p>
                          <p className="text-sm text-gray-300">{point.solution}</p>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-primary mt-4">
                      {expandedPainPoint === point.id ? '▲ Click to collapse' : '▼ Click to see solution'}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-black">
        <div className="container">
          <div className="text-center mb-16 reveal">
            <h2 className="font-orbitron text-4xl md:text-5xl font-bold mb-4">
              THREE WAYS TO <span className="text-primary neon-glow">DEPLOY AI</span>
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-black border-primary/30 hover:border-primary transition-all duration-300 card-3d reveal">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <i className="fas fa-phone-volume text-3xl text-white"></i>
                </div>
                <h3 className="font-orbitron text-2xl font-bold mb-4 text-white text-center">Voice AI Agents</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check text-primary mt-1"></i>
                    <span>Answer calls, qualify leads, book appointments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check text-primary mt-1"></i>
                    <span>Handle customer service inquiries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check text-primary mt-1"></i>
                    <span>Follow up with quotes and reminders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check text-primary mt-1"></i>
                    <span>Works 24/7, never misses a call</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-black border-primary/30 hover:border-primary transition-all duration-300 card-3d reveal">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <i className="fas fa-file-invoice text-3xl text-white"></i>
                </div>
                <h3 className="font-orbitron text-2xl font-bold mb-4 text-white text-center">Document & Data AI</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check text-primary mt-1"></i>
                    <span>Extract info from invoices, contracts, permits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check text-primary mt-1"></i>
                    <span>Analyze job history and customer patterns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check text-primary mt-1"></i>
                    <span>Generate quotes and proposals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check text-primary mt-1"></i>
                    <span>Track inventory and supplies</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-black border-primary/30 hover:border-primary transition-all duration-300 card-3d reveal">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <i className="fas fa-robot text-3xl text-white"></i>
                </div>
                <h3 className="font-orbitron text-2xl font-bold mb-4 text-white text-center">Operations Copilot</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check text-primary mt-1"></i>
                    <span>Connect all your systems (CRM, accounting, scheduling)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check text-primary mt-1"></i>
                    <span>Answer questions about any job, customer, or metric</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check text-primary mt-1"></i>
                    <span>Automate workflows and approvals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check text-primary mt-1"></i>
                    <span>Predict problems before they happen</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section - Updated Messaging */}
      <section id="about" className="py-20 bg-black">
        <div className="container">
          <div className="text-center mb-12 reveal">
            <h2 className="font-orbitron text-4xl md:text-5xl font-bold mb-4">
              BUILT FOR <span className="text-primary neon-glow">TRADES, NOT TECH COMPANIES</span>
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>

          <div className="max-w-4xl mx-auto space-y-6 reveal">
            <p className="text-lg text-gray-300">
              GTM Planetary builds custom AI models and autonomous agents exclusively for trade businesses.
            </p>
            <p className="text-gray-400">
              We're not a typical SaaS company selling software subscriptions. We're your AI workforce partner—deploying specialized agents that handle the operations, admin, and customer service that keep you from the work you're actually good at.
            </p>
            <p className="text-gray-400">
              HVAC, plumbing, electrical, construction, and skilled trades have been underserved by technology for decades. Generic tools don't understand your workflows. We do.
            </p>
            <p className="text-gray-400">
              Every AI agent we build is fine-tuned on your business—your processes, your customers, your data. They learn how you work and get better over time.
            </p>
            <p className="text-lg text-primary font-bold mt-8">
              Stop fighting for hiring budget. Start deploying AI agents that work alongside your team, scale instantly, and never call in sick.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-black">
        <div className="container">
          <div className="text-center mb-12 reveal">
            <h2 className="font-orbitron text-4xl md:text-5xl font-bold mb-4">
              LET'S BUILD YOUR <span className="text-primary neon-glow">AI WORKFORCE</span>
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
            <div className="reveal">
              <h3 className="font-orbitron text-2xl font-bold mb-6 text-white">Get In Touch</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-phone text-primary"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <a href="tel:888-451-2290" className="text-lg font-bold text-primary hover:text-primary/80 transition-colors">
                      888-451-2290
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-envelope text-primary"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <a href="mailto:wyatt@gtmplanetary.com" className="text-lg font-bold text-primary hover:text-primary/80 transition-colors">
                      wyatt@gtmplanetary.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-globe text-primary"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Website</p>
                    <a href="https://gtmplanetary.com" target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-primary hover:text-primary/80 transition-colors">
                      gtmplanetary.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="reveal">
              <h3 className="font-orbitron text-2xl font-bold mb-6 text-white">Send A Message</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-black border-primary/30 focus:border-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-black border-primary/30 focus:border-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-black border-primary/30 focus:border-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="bg-black border-primary/30 focus:border-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={4}
                    className="bg-black border-primary/30 focus:border-primary"
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
      <footer className="py-8 bg-black border-t border-border">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2026 GTM Planetary LLC. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-gray-400 hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-primary transition-colors">
                Terms & Conditions
              </a>
              <a href="/admin/blog" className="text-sm text-gray-400 hover:text-primary transition-colors opacity-20">
                ·
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
