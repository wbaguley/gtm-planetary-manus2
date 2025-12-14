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
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
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

  const products = [
    {
      icon: "fa-robot",
      title: "Custom AI Agent Workforce",
      description: "Empower your business with custom AI for voice and chat. From sales to success, these agents act as virtual employees, capable of reading and editing data within any system you use, including CRMs and dispatching tools.",
    },
    {
      icon: "fa-calendar-alt",
      title: "AI-Powered Scheduling Systems",
      description: "Automatically book, reschedule, and assign tasks based on availability, location, and urgency. Optimize staff allocation and reduce scheduling conflicts.",
    },
    {
      icon: "fa-tools",
      title: "Predictive Maintenance Tools",
      description: "Monitor equipment health, forecast issues, and reduce downtime through proactive interventions. Prevent costly breakdowns before they happen.",
    },
    {
      icon: "fa-users",
      title: "Custom CRM & Lead Management",
      description: "Automate follow-ups, lead scoring, and customer journey tracking. Keep your sales pipeline full and convert more prospects into customers.",
    },
    {
      icon: "fa-calculator",
      title: "Automated Quoting & Cost Estimation",
      description: "Provide accurate, AI-driven quotes and estimates based on project specifications and historical data. Win more business with faster, more accurate quotes.",
    },
    {
      icon: "fa-boxes",
      title: "Inventory Management Systems",
      description: "Automate inventory tracking, restocking, and analytics for optimal supply chain management. Never run out of critical supplies again.",
    },
    {
      icon: "fa-chart-bar",
      title: "Data Analytics & Reporting Dashboards",
      description: "Generate insights from data to enhance decision-making and improve operations. See your business performance at a glance.",
    },
    {
      icon: "fa-file-invoice-dollar",
      title: "AI-Powered Invoicing & Payment Systems",
      description: "Streamline billing, generate invoices, and accept payments through integrated platforms. Get paid faster and reduce accounting headaches.",
    },
    {
      icon: "fa-tasks",
      title: "Workflow Optimization Platforms",
      description: "Improve efficiency by automating repetitive tasks and organizing complex workflows. Eliminate bottlenecks and streamline operations.",
    },
    {
      icon: "fa-route",
      title: "Route Optimization & Fleet Management",
      description: "Optimize travel routes for efficiency, cost savings, and enhanced customer service. Reduce fuel costs and increase service calls per day.",
    },
    {
      icon: "fa-file-alt",
      title: "Document Processing & Data Entry Systems",
      description: "Automate form processing, OCR (optical character recognition), and data entry. Eliminate manual paperwork and reduce errors.",
    },
  ];

  // Case Studies Data - REMOVED
  /*const caseStudies = [
    {
      id: 1,
      title: "HVAC Company Automation",
      client: "Regional HVAC Service Provider",
      industry: "HVAC",
      challenge: "Manual scheduling causing double-bookings and missed appointments",
      solution: "AI-Powered Scheduling System + Custom CRM Integration",
      results: {
        efficiency: "+45%",
        revenue: "+32%",
        satisfaction: "4.8/5.0"
      },
      techStack: ["AI Agents", "CRM Integration", "SMS Automation", "Calendar Sync"],
      videoUrl: "", // Placeholder for future video
      image: "/case-study-hvac.jpg" // Placeholder
    },
    {
      id: 2,
      title: "Plumbing Fleet Optimization",
      client: "Multi-State Plumbing Company",
      industry: "Plumbing",
      challenge: "Inefficient routing leading to high fuel costs and delayed service",
      solution: "Route Optimization & Fleet Management System",
      results: {
        fuelSavings: "-28%",
        serviceCapacity: "+40%",
        responseTime: "-35%"
      },
      techStack: ["GPS Integration", "AI Route Planning", "Real-time Tracking", "Predictive Analytics"],
      videoUrl: "",
      image: "/case-study-plumbing.jpg"
    },
    {
      id: 3,
      title: "Electrical Contractor CRM",
      client: "Commercial Electrical Contractor",
      industry: "Electrical",
      challenge: "Lost leads and poor follow-up processes",
      solution: "Custom AI Agent Workforce + Lead Management",
      results: {
        leadConversion: "+55%",
        responseTime: "-80%",
        revenue: "+48%"
      },
      techStack: ["Voice AI", "Chat AI", "CRM Automation", "Email Integration"],
      videoUrl: "",
      image: "/case-study-electrical.jpg"
    }
  ];*/

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
      setMobileMenuOpen(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  const nextProduct = () => {
    setCurrentCarouselIndex((prev) => (prev + 1) % products.length);
  };

  const prevProduct = () => {
    setCurrentCarouselIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  useEffect(() => {
    const interval = setInterval(nextProduct, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!particlesInitialized.current && typeof window !== 'undefined') {
      particlesInitialized.current = true;
      
      // Dynamically load particles.js
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
      script.async = true;
      script.onload = () => {
        // @ts-ignore
        if (window.particlesJS) {
          // @ts-ignore
          window.particlesJS('particles-js', {
        particles: {
          number: {
            value: 100,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: ['#ad18fc', '#18f0fc', '#eb00ff', '#410081']
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
                {["home", "about", "services", "solutions", "pricing", "contact"].map((section) => (
                  <li key={section}>
                    <button
                      onClick={() => scrollToSection(section)}
                      className={`block w-full md:w-auto text-left md:text-center py-2 md:py-0 font-orbitron uppercase text-sm tracking-wider transition-colors ${
                        activeSection === section ? "text-primary" : "text-foreground hover:text-primary"
                      }`}
                    >
                      {section === "solutions" ? "Who We Serve" : section}
                    </button>
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

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 scan-lines">
        <div className="absolute inset-0 grid-bg"></div>
        <div id="particles-js" className="absolute inset-0"></div>
        <div className="container relative z-10 text-center">
          <h1 className="font-orbitron text-5xl md:text-7xl font-bold mb-6">
            WHERE TRADES <span className="glitch neon-glow" data-text="MEET AI">MEET AI</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-muted-foreground reveal">
            We build smart workflows, AI agents, and automation tools to save time, cut costs, and grow your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center reveal">
            <Button
              size="lg"
              className="font-orbitron uppercase tracking-wider bg-primary hover:bg-primary/90 pulse-border"
              onClick={() => scrollToSection("contact")}
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="font-orbitron uppercase tracking-wider"
              onClick={() => scrollToSection("services")}
            >
              Learn More
            </Button>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center animate-bounce">
          <span className="block text-sm mb-2">Scroll Down</span>
          <i className="fas fa-chevron-down text-primary"></i>
        </div>
      </section>

      {/* About Section - Updated with FINAL intro video */}
      <section id="about" className="py-20 bg-card">
        <div className="container">
          <div className="text-center mb-12 reveal">
            <h2 className="font-orbitron text-4xl md:text-5xl font-bold mb-4">
              ABOUT <span className="text-primary neon-glow">GTM PLANETARY</span>
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>

          <div className="flex justify-center reveal">
            <video 
              className="w-full max-w-xs rounded-lg border-2 border-primary/20" 
              controls
            >
              <source src="/intro-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20">
        <div className="container">
          <div className="text-center mb-12 reveal">
            <h2 className="font-orbitron text-4xl md:text-5xl font-bold mb-4">
              OUR <span className="text-primary neon-glow">SERVICES</span>
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="bg-[#1a1a3e] border-primary/30 hover:border-primary transition-all duration-300 card-3d reveal">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-brain text-3xl text-primary"></i>
                </div>
                <h3 className="font-orbitron text-lg font-bold mb-2 text-white">AI Consulting & Strategy</h3>
                <p className="text-sm text-gray-300">We build a comprehensive roadmap for automation. Our consulting services analyze your current workflows, identify inefficiencies, and develop strategic plans to implement AI solutions that deliver measurable results.</p>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a3e] border-primary/30 hover:border-primary transition-all duration-300 card-3d reveal">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-code text-3xl text-primary"></i>
                </div>
                <h3 className="font-orbitron text-lg font-bold mb-2 text-white">Custom AI Solution Development</h3>
                <p className="text-sm text-gray-300">We build tailored AI systems designed for your unique business challenges. Our custom development approach ensures that every tool we create addresses your specific operational needs and integrates with your existing systems.</p>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a3e] border-primary/30 hover:border-primary transition-all duration-300 card-3d reveal">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-plug text-3xl text-primary"></i>
                </div>
                <h3 className="font-orbitron text-lg font-bold mb-2 text-white">Automation Implementation & Integration</h3>
                <p className="text-sm text-gray-300">Our team handles the complete setup, connection, and optimization of AI tools to create seamless workflows. We ensure all your systems work together efficiently without requiring technical expertise from your team.</p>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a3e] border-primary/30 hover:border-primary transition-all duration-300 card-3d reveal">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-sync-alt text-3xl text-primary"></i>
                </div>
                <h3 className="font-orbitron text-lg font-bold mb-2 text-white">Fractional System Enablement & Optimization</h3>
                <p className="text-sm text-gray-300">We deliver ongoing optimization and adaptive system engineering to keep your AI and automation tools aligned with your evolving business. Our enablement team acts as your behind-the-scenes tech partner—tuning workflows, adding capabilities, and helping you squeeze more ROI out of every tool.</p>
              </CardContent>
            </Card>
          </div>

          {/* Products Carousel */}
          <div className="mt-16">
            <div className="text-center mb-8 reveal">
              <h2 className="font-orbitron text-4xl md:text-5xl font-bold mb-4">
                OUR <span className="text-primary neon-glow">PRODUCTS</span>
              </h2>
              <div className="w-24 h-1 bg-primary mx-auto"></div>
            </div>

            <div className="relative max-w-2xl mx-auto reveal">
              <Card className="bg-card border-primary/20 card-3d">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className={`fas ${products[currentCarouselIndex].icon} text-4xl text-primary`}></i>
                  </div>
                  <h3 className="font-orbitron text-2xl font-bold mb-4">{products[currentCarouselIndex].title}</h3>
                  <p className="text-muted-foreground">{products[currentCarouselIndex].description}</p>
                </CardContent>
              </Card>

              <button
                onClick={prevProduct}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center transition-colors"
              >
                <i className="fas fa-chevron-left text-primary"></i>
              </button>

              <button
                onClick={nextProduct}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center transition-colors"
              >
                <i className="fas fa-chevron-right text-primary"></i>
              </button>

              <div className="flex justify-center gap-2 mt-6">
                {products.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentCarouselIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentCarouselIndex ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Solutions Section */}
      <section id="solutions" className="py-20">
        <div className="container">
          <div className="text-center mb-12 reveal">
            <h2 className="font-orbitron text-4xl md:text-5xl font-bold mb-4">
              WHO <span className="text-primary neon-glow">WE SERVE</span>
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>

          <p className="text-center text-lg mb-12 max-w-3xl mx-auto reveal">
            We serve a wide range of trade and skilled-service industries with tailored AI solutions designed for their specific needs.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-card border-primary/20 card-3d reveal">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-tools text-3xl text-primary"></i>
                </div>
                <h3 className="font-orbitron text-2xl font-bold mb-4">Trade Businesses</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• HVAC</li>
                  <li>• Plumbing</li>
                  <li>• Electrical</li>
                  <li>• Construction</li>
                  <li>• Crop Dusting</li>
                  <li>• Fishing Charters</li>
                  <li>• Window Treatment Installers</li>
                  <li>• Mobile Service Technicians</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card border-primary/20 card-3d reveal">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-user-md text-3xl text-primary"></i>
                </div>
                <h3 className="font-orbitron text-2xl font-bold mb-4">Skilled Professionals</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• General Dentists</li>
                  <li>• Oral Surgeons</li>
                  <li>• Prosthodontists</li>
                  <li>• Orthodontists</li>
                  <li>• Optometrists</li>
                  <li>• Physical Therapists</li>
                  <li>• Specialty Clinics</li>
                  <li>• Small Surgical Practices</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-card">
        <div className="container">
          <div className="text-center mb-12 reveal">
            <h2 className="font-orbitron text-4xl md:text-5xl font-bold mb-4">
              PRICING <span className="text-primary neon-glow">PACKAGES</span>
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>

          <p className="text-center text-lg mb-12 reveal">
            GTM Planetary offers tailored AI-driven solutions with transparent, predictable costs. All packages include the first 14 days of support for free.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="bg-background border-primary/20 hover:border-primary transition-colors card-3d reveal">
              <CardContent className="p-6">
                <h3 className="font-orbitron text-xl font-bold mb-2">Standard Package</h3>
                <div className="text-3xl font-bold text-primary mb-4">$4,900</div>
                <ul className="space-y-2 mb-6 text-sm">
                  <li><i className="fas fa-check text-primary mr-2"></i>One product from our offerings</li>
                  <li><i className="fas fa-check text-primary mr-2"></i>1-hour training session</li>
                  <li><i className="fas fa-check text-primary mr-2"></i>30 days of free support</li>
                  <li><i className="fas fa-check text-primary mr-2"></i>Client portal for implementation</li>
                </ul>
                <Button className="w-full" onClick={() => scrollToSection("contact")}>Get Started</Button>
              </CardContent>
            </Card>

            <Card className="bg-primary/10 border-primary card-3d reveal">
              <CardContent className="p-6">
                <h3 className="font-orbitron text-xl font-bold mb-2">Plus Package</h3>
                <div className="text-3xl font-bold text-primary mb-4">$7,500</div>
                <ul className="space-y-2 mb-6 text-sm">
                  <li><i className="fas fa-check text-primary mr-2"></i>Up to 3 products from our offerings</li>
                  <li><i className="fas fa-check text-primary mr-2"></i>3-hour training session</li>
                  <li><i className="fas fa-check text-primary mr-2"></i>30 days of free support</li>
                  <li><i className="fas fa-check text-primary mr-2"></i>Client portal for implementation</li>
                  <li><i className="fas fa-check text-primary mr-2"></i>Playbook or user guide</li>
                </ul>
                <Button className="w-full" onClick={() => scrollToSection("contact")}>Get Started</Button>
              </CardContent>
            </Card>

            <Card className="bg-background border-primary/20 hover:border-primary transition-colors card-3d reveal">
              <CardContent className="p-6">
                <h3 className="font-orbitron text-xl font-bold mb-2">Premium Package</h3>
                <div className="text-3xl font-bold text-primary mb-4">$15,000</div>
                <ul className="space-y-2 mb-6 text-sm">
                  <li><i className="fas fa-check text-primary mr-2"></i>3-5 products (Complete AI solution)</li>
                  <li><i className="fas fa-check text-primary mr-2"></i>3-hour training session</li>
                  <li><i className="fas fa-check text-primary mr-2"></i>30 days of free priority support</li>
                  <li><i className="fas fa-check text-primary mr-2"></i>Client portal for implementation</li>
                  <li><i className="fas fa-check text-primary mr-2"></i>Advanced integrations</li>
                  <li><i className="fas fa-check text-primary mr-2"></i>Custom automation workflows</li>
                </ul>
                <Button className="w-full" onClick={() => scrollToSection("contact")}>Get Started</Button>
              </CardContent>
            </Card>

            <Card className="bg-background border-primary/20 hover:border-primary transition-colors card-3d reveal">
              <CardContent className="p-6">
                <h3 className="font-orbitron text-xl font-bold mb-2">Enterprise Package</h3>
                <div className="text-3xl font-bold text-primary mb-4">Call for Pricing</div>
                <ul className="space-y-2 mb-6 text-sm">
                  <li><i className="fas fa-check text-primary mr-2"></i>More than 5 products</li>
                  <li><i className="fas fa-check text-primary mr-2"></i>Fully customized enterprise solution</li>
                  <li><i className="fas fa-check text-primary mr-2"></i>Tailored training & support</li>
                  <li><i className="fas fa-check text-primary mr-2"></i>Advanced integrations</li>
                  <li><i className="fas fa-check text-primary mr-2"></i>Custom automation workflows</li>
                  <li><i className="fas fa-check text-primary mr-2"></i>Dedicated account manager</li>
                </ul>
                <Button className="w-full" onClick={() => scrollToSection("contact")}>Contact Us</Button>
              </CardContent>
            </Card>
          </div>

          <Card className="max-w-2xl mx-auto bg-background border-primary/20 reveal">
            <CardContent className="p-6 text-center">
              <i className="fas fa-credit-card text-4xl text-primary mb-4"></i>
              <h3 className="font-orbitron text-xl font-bold mb-2">Financing Available</h3>
              <p className="text-muted-foreground">Flexible payment options to help you get started with AI automation today. Contact us to learn about our financing programs.</p>
            </CardContent>
          </Card>

          {/* Optional Add-Ons */}
          <div className="mt-16 max-w-4xl mx-auto reveal">
            <h3 className="font-orbitron text-2xl font-bold mb-6 text-center">Optional Add-Ons</h3>
            <Card className="bg-background border-primary/20">
              <CardContent className="p-6">
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between items-start">
                    <span><strong>Custom Integration:</strong> $150/hr (e.g., syncing with niche tools or bespoke automation workflows) (Doesn't include 3rd party fees)</span>
                  </li>
                  <li className="flex justify-between items-start">
                    <span><strong>Automation and AI development time:</strong> $200/hr (for less than 8 hours of work)</span>
                  </li>
                  <li className="flex justify-between items-start">
                    <span><strong>Training:</strong> $300/hour (For larger teams or deep dives into specific processes)</span>
                  </li>
                  <li className="flex justify-between items-start">
                    <span><strong>Fractional Revenue and AI Architect:</strong> $4000/Month 15 hours per month</span>
                  </li>
                  <li className="flex justify-between items-start">
                    <span><strong>Additional AI Credits:</strong> $15 per month for every 1000 AI credits</span>
                  </li>
                  <li className="flex justify-between items-start">
                    <span><strong>Additional Workflow:</strong> $75 per workflow per month</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container">
          <div className="text-center mb-12 reveal">
            <h2 className="font-orbitron text-4xl md:text-5xl font-bold mb-4">
              CONTACT <span className="text-primary neon-glow">US</span>
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="reveal">
              <h3 className="font-orbitron text-2xl font-bold mb-4">Get In Touch</h3>
              <p className="text-lg mb-6">Ready to revolutionize your business with AI? Contact us today to schedule a consultation.</p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <i className="fas fa-phone text-primary text-xl"></i>
                  <div>
                    <a href="tel:888-451-2290" className="hover:text-primary transition-colors font-bold text-lg">
                      888-451-2290
                    </a>
                    <p className="text-sm text-muted-foreground">Want to talk to an AI agent? <em>Call this number!</em></p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fas fa-envelope text-primary text-xl"></i>
                  <a href="mailto:support@gtmplanetary.com" className="hover:text-primary transition-colors">
                    support@gtmplanetary.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fas fa-globe text-primary text-xl"></i>
                  <span>www.gtmplanetary.com</span>
                </div>
              </div>

              <div className="flex gap-4">
                <a href="https://www.linkedin.com/company/gtm-planetary/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center transition-colors">
                  <i className="fab fa-linkedin text-primary text-xl"></i>
                </a>
                <a href="https://www.facebook.com/people/GTM-Planetary/61574822383365/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center transition-colors">
                  <i className="fab fa-facebook text-primary text-xl"></i>
                </a>
                <a href="https://x.com/GTMPlanetary" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center transition-colors">
                  <i className="fab fa-twitter text-primary text-xl"></i>
                </a>
                <a href="https://www.instagram.com/gtm_planetary?igsh=OWQ4aTQ3dXJ2bGFq&utm_source=qr" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center transition-colors">
                  <i className="fab fa-instagram text-primary text-xl"></i>
                </a>
              </div>
            </div>

            <Card className="bg-card border-primary/20 reveal">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-background"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-background"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-background"
                    />
                  </div>

                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="bg-background"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="bg-background"
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={contactMutation.isPending}>
                    {contactMutation.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t border-border">
        <div className="container">
          <div className="flex flex-col items-center mb-8">
            <img src="/logo.png" alt="GTM Planetary Logo" className="h-16 mb-6" />
            
            <ul className="flex flex-wrap justify-center gap-6 mb-6">
              {["home", "about", "services", "solutions", "pricing", "contact"].map((section) => (
                <li key={section}>
                  <button
                    onClick={() => scrollToSection(section)}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {section === "solutions" ? "Solutions" : section === "case-studies" ? "Case Studies" : section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex gap-4 mb-6">
              <a href="https://www.linkedin.com/company/gtm-planetary/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <i className="fab fa-linkedin text-xl"></i>
              </a>
              <a href="https://www.facebook.com/people/GTM-Planetary/61574822383365/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="https://x.com/GTMPlanetary" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="https://www.instagram.com/gtm_planetary?igsh=OWQ4aTQ3dXJ2bGFq&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <i className="fab fa-instagram text-xl"></i>
              </a>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2025 GTM Planetary. All rights reserved.</p>
            <div className="mt-3 flex justify-center gap-4">
              <button onClick={() => setLocation("/blog")} className="text-white hover:text-primary transition-colors">
                Blog
              </button>
              <span className="text-white">|</span>
              <button onClick={() => setLocation("/privacy")} className="text-white hover:text-primary transition-colors">
                Privacy Policy
              </button>
              <span className="text-white">|</span>
              <button onClick={() => setLocation("/termsandconditions")} className="text-white hover:text-primary transition-colors">
                Terms & Conditions
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
