'use client'

import React, { useState, useEffect } from 'react';
import { Terminal, Code2, Database, Layout, Github, Linkedin, Mail, ExternalLink, ChevronRight, Command, Server, Twitter, Cpu, Layers, GitBranch, Shield, Zap, Quote, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DeveloperTemplate() {
  const [activeSection, setActiveSection] = useState('home');
  const [activeFilter, setActiveFilter] = useState('All');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'stack', 'experience', 'projects', 'testimonials', 'contact'];
      let current = 'home';
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 250) {
          current = section;
        }
      }
      setActiveSection(current);
    };
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const projects = [
    { 
      id: 1,
      title: "E-Commerce Microservices", 
      desc: "A highly scalable e-commerce backend built with Go and gRPC. Handles 10k+ concurrent requests with 99.9% uptime. Includes custom auth, payment gateway integration, and inventory management.",
      tech: ["Go", "gRPC", "PostgreSQL", "Redis"],
      img: "https://placehold.co/1200x800/111111/333333?text=E-Commerce+Microservices",
      category: "Backend",
      link: "#"
    },
    { 
      id: 2,
      title: "Real-time Analytics Dashboard", 
      desc: "Frontend dashboard for monitoring server metrics in real-time. Built with Next.js App Router, heavily utilizing Server Components and WebSockets for live data streaming.",
      tech: ["Next.js", "TypeScript", "Tailwind", "WebSockets"],
      img: "https://placehold.co/1200x800/111111/333333?text=Real-time+Dashboard",
      category: "Frontend",
      link: "#"
    },
    { 
      id: 3,
      title: "Cloud Resource Provisioner", 
      desc: "A full-stack internal tool to automate AWS/GCP resource provisioning. Reduced infrastructure setup time by 80% for engineering teams.",
      tech: ["React", "Node.js", "Terraform", "AWS"],
      img: "https://placehold.co/1200x800/111111/333333?text=Cloud+Provisioner",
      category: "Fullstack",
      link: "#"
    }
  ];

  const filteredProjects = activeFilter === 'All' ? projects : projects.filter(p => p.category === activeFilter);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0a0a0a] text-zinc-300 font-sans selection:bg-zinc-800 selection:text-white relative">
      
      {/* Interactive Cursor Glow */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300 hidden md:block"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.03), transparent 40%)`
        }}
      />

      {/* BACKGROUND PATTERN */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}>
      </div>
      
      {/* NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo('home')}>
            <Terminal className="w-5 h-5 text-zinc-100" />
            <span className="font-bold text-sm text-zinc-100 tracking-tight">dev.portfolio</span>
          </div>

          <nav className="hidden md:flex items-center gap-1 bg-zinc-900/50 p-1 rounded-full border border-zinc-800/50">
            {['home', 'about', 'stack', 'experience', 'projects', 'contact'].map(item => (
              <button 
                key={item} 
                onClick={() => scrollTo(item)} 
                className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${activeSection === item ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md text-[10px] text-zinc-500 font-mono hover:bg-zinc-800 transition-colors cursor-pointer">
              <Command className="w-3 h-3" /> <span>K</span>
            </div>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-zinc-400 p-2 z-50">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-lg pt-24 px-4 sm:px-6 md:hidden border-b border-zinc-800/50 flex flex-col min-h-dvh pb-8 shadow-2xl overflow-y-auto"
          >
            <div className="flex flex-col gap-2">
               {['home', 'about', 'stack', 'experience', 'projects', 'contact'].map(item => (
                <button 
                  key={item} 
                  onClick={() => scrollTo(item)} 
                  className={`text-2xl font-bold capitalize text-left p-4 rounded-xl transition-all ${activeSection === item ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 max-w-6xl mx-auto overflow-x-hidden">
        {/* HERO SECTION */}
        <section id="home" className="pt-28 sm:pt-36 md:pt-40 pb-16 md:pb-20 px-4 sm:px-6 min-h-[90svh] flex flex-col justify-center">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="w-full">
            <motion.div variants={fadeUpVariant} className="inline-flex max-w-full items-center gap-3 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] sm:text-xs font-mono text-zinc-400 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              System Online: Ready for deployment
            </motion.div>
            
            <motion.h1 variants={fadeUpVariant} className="text-[2.6rem] min-[380px]:text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.05] md:leading-tight mb-6 max-w-4xl break-words">
              Engineering robust systems & <span className="text-zinc-500">scalable architectures.</span>
            </motion.h1>
            
            <motion.p variants={fadeUpVariant} className="text-zinc-400 text-base md:text-lg max-w-2xl leading-relaxed mb-10">
              Senior Software Engineer specializing in full-stack development, modern cloud infrastructure, and building high-performance applications that handle millions of requests.
            </motion.p>
            
            <motion.div variants={fadeUpVariant} className="flex flex-col min-[420px]:flex-row flex-wrap items-stretch min-[420px]:items-center gap-3 sm:gap-4">
              <button onClick={() => scrollTo('projects')} className="px-6 py-3 bg-white hover:bg-zinc-200 text-black text-sm font-semibold rounded-lg transition-colors flex items-center gap-2">
                Init Deployment <ChevronRight className="w-4 h-4" />
              </button>
              <button onClick={() => scrollTo('contact')} className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
                <Github className="w-4 h-4" /> Source Code
              </button>
            </motion.div>
            
            {/* Terminal Mockup snippet */}
            <motion.div variants={fadeUpVariant} className="mt-12 sm:mt-20 max-w-3xl rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
              <div className="flex items-center px-4 py-2 bg-zinc-900 border-b border-zinc-800 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                <div className="text-[10px] text-zinc-500 font-mono ml-2">~ /dev/portfolio/init.sh</div>
              </div>
              <div className="overflow-x-auto p-4 sm:p-6 font-mono text-xs sm:text-sm text-zinc-400 space-y-2">
                <div className="flex gap-2">
                  <span className="text-green-500">➜</span>
                  <span className="text-blue-400">~</span>
                  <span className="text-zinc-300">npm start</span>
                </div>
                <div className="text-zinc-500">Starting production server...</div>
                <div className="text-zinc-500">Compiling 140 modules...</div>
                <div className="text-green-400">✓ Compiled successfully in 1240ms</div>
                <div className="text-zinc-300 pt-2">&gt; Server listening on port 3000</div>
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ repeat: Infinity, duration: 1 }}
                  className="w-2 h-4 bg-zinc-400 inline-block align-middle mt-2"
                ></motion.div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ABOUT SECTION (SYSTEM OVERVIEW) */}
        <section id="about" className="py-16 md:py-24 px-4 sm:px-6 border-t border-zinc-900/50">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="flex flex-col md:flex-row gap-12 lg:gap-20 items-center">
            
            {/* Image / Identity */}
            <div className="w-full md:w-5/12 relative group aspect-[4/5] md:aspect-auto md:min-h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 to-zinc-900 p-[1px] rounded-2xl group-hover:from-zinc-500 group-hover:to-zinc-800 transition-colors duration-500">
                <div className="w-full h-full bg-[#0a0a0a] rounded-2xl overflow-hidden relative">
                   <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                   <img src="https://placehold.co/800x1000/111111/333333?text=YOUR+PHOTO+800x1000" alt="Developer Profile" className="w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-700" />
                   
                   {/* Overlay Stats */}
                   <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md border border-zinc-800 p-4 rounded-xl flex justify-between items-center transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                     <div>
                       <div className="text-[10px] text-zinc-500 font-mono uppercase mb-1">ID_Hash</div>
                       <div className="text-sm font-bold text-white uppercase tracking-wider">YOUR NAME</div>
                     </div>
                     <div className="text-right">
                       <div className="text-[10px] text-zinc-500 font-mono uppercase mb-1">Status</div>
                       <div className="text-sm font-bold text-green-400 flex items-center justify-end gap-1.5">
                         <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online
                       </div>
                     </div>
                   </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="w-full md:w-7/12 flex flex-col gap-8">
              <div>
                <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400">
                  <User className="w-4 h-4" /> root@system:~/about.md
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                  I write code that <span className="text-zinc-500">scales</span>, not code that <span className="text-red-900/80 line-through">breaks</span>.
                </h2>
              </div>
              
              <div className="space-y-4 text-zinc-400 text-base leading-relaxed">
                <p>
                  As a self-taught engineer turned Lead Developer, my focus has always been on creating resilient systems. I don't just build websites; I engineer solutions that survive peak traffic and evolving business logic.
                </p>
                <p>
                  My journey started with scripting in Python and eventually led me into the complex world of distributed systems and microservices. I believe in clean code, robust testing, and treating infrastructure as code.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-zinc-900/50 mt-4">
                {[
                  { value: "5+", label: "Years Exp" },
                  { value: "40+", label: "Repositories" },
                  { value: "100%", label: "Uptime" },
                  { value: "99+", label: "Commits/Mo" }
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <span className="text-3xl font-bold text-white">{stat.value}</span>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* TECH STACK & ARCHITECTURE */}
        <section id="stack" className="py-16 md:py-24 px-4 sm:px-6 border-t border-zinc-900/50">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="mb-16">
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="w-5 h-5 text-zinc-500" />
              <h2 className="text-2xl font-bold text-white tracking-tight">System Architecture</h2>
            </div>
            <p className="text-zinc-400 max-w-2xl text-sm leading-relaxed">Comprehensive overview of my preferred technology stack, infrastructure tools, and development methodologies.</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                icon: <Code2/>, 
                title: "Frontend Layer", 
                desc: "Expertise in building complex, interactive user interfaces with React, Next.js, and modern CSS architectures.",
                tech: ['React', 'Next.js', 'TypeScript', 'Tailwind', 'Redux', 'Framer Motion'],
                colSpan: "md:col-span-2",
                gradient: "from-zinc-900 to-zinc-950"
              },
              { 
                icon: <Server/>, 
                title: "Backend Services", 
                desc: "Designing scalable REST and GraphQL APIs, microservices, and reliable background jobs.",
                tech: ['Node.js', 'Go', 'Express', 'GraphQL'],
                colSpan: "md:col-span-1",
                gradient: "bg-zinc-900"
              },
              { 
                icon: <Database/>, 
                title: "Data & Cloud", 
                desc: "Managing state, caching, and deploying to modern cloud providers.",
                tech: ['PostgreSQL', 'Redis', 'MongoDB', 'AWS', 'Docker'],
                colSpan: "md:col-span-1",
                gradient: "bg-zinc-900"
              },
              { 
                icon: <Shield/>, 
                title: "DevOps & Security", 
                desc: "Implementing CI/CD pipelines, automated testing, and ensuring application security standards.",
                tech: ['GitHub Actions', 'Jest', 'Cypress', 'OAuth'],
                colSpan: "md:col-span-2",
                gradient: "from-zinc-900 to-[#111]"
              }
            ].map((box, i) => (
              <motion.div variants={fadeUpVariant} key={i} className={`${box.colSpan} ${box.gradient} ${box.gradient.includes('from') ? 'bg-gradient-to-br' : ''} border border-zinc-800/80 p-8 rounded-2xl flex flex-col justify-between group hover:border-zinc-700 transition-colors relative overflow-hidden`}>
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity scale-150">
                  {box.icon}
                </div>
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center text-zinc-400 mb-6 group-hover:text-white group-hover:bg-zinc-800 transition-all border border-zinc-700/50">
                    {box.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{box.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-8">{box.desc}</p>
                </div>
                <div className="flex flex-wrap gap-2 relative z-10">
                  {box.tech.map(tech => (
                    <span key={tech} className="px-3 py-1.5 bg-black/50 border border-zinc-800 rounded-md text-[10px] font-mono text-zinc-400 uppercase tracking-wider hover:border-zinc-600 transition-colors cursor-default">{tech}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* CAREER TIMELINE / EXPERIENCE (NEW) */}
        <section id="experience" className="py-16 md:py-24 px-4 sm:px-6 border-t border-zinc-900/50">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="mb-16">
            <div className="flex items-center gap-2 mb-4">
              <GitBranch className="w-5 h-5 text-zinc-500" />
              <h2 className="text-2xl font-bold text-white tracking-tight">Execution History</h2>
            </div>
            <p className="text-zinc-400 max-w-2xl text-sm leading-relaxed">A timeline of my professional journey, highlighting key roles and impactful contributions.</p>
          </motion.div>

          <div className="relative border-l border-zinc-800 ml-3 md:ml-6 space-y-12">
            {[
              {
                role: "Senior Software Engineer",
                company: "TechNexus Inc.",
                time: "2023 - Present",
                desc: "Spearheaded the migration from a monolithic architecture to Go-based microservices, reducing server response times by 40%. Led a team of 4 engineers in developing a real-time analytics dashboard used by 50,000+ daily active users."
              },
              {
                role: "Full Stack Developer",
                company: "CloudData Systems",
                time: "2020 - 2023",
                desc: "Developed and maintained multiple React/Next.js applications. Implemented a robust CI/CD pipeline using GitHub Actions that cut deployment time in half. Integrated complex third-party payment gateways (Stripe, PayPal)."
              },
              {
                role: "Frontend Engineer",
                company: "StartupLab",
                time: "2018 - 2020",
                desc: "Built responsive, accessible user interfaces for early-stage startups. Transitioned legacy jQuery codebases to modern React components. Collaborated closely with UI/UX designers to implement pixel-perfect designs."
              }
            ].map((job, i) => (
              <motion.div 
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
                variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: i * 0.1 } } }}
                key={i} className="relative pl-8 md:pl-12"
              >
                <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-zinc-900 border border-zinc-700 ring-4 ring-[#0a0a0a]"></div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                  <h3 className="text-lg font-bold text-white">{job.role}</h3>
                  <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800 w-fit">{job.time}</span>
                </div>
                <div className="text-sm font-medium text-zinc-400 mb-4">{job.company}</div>
                <p className="text-sm text-zinc-500 leading-relaxed max-w-3xl">{job.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* PROJECTS SECTION (INTERACTIVE) */}
        <section id="projects" className="py-16 md:py-24 px-4 sm:px-6 border-t border-zinc-900/50">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5 text-zinc-500" />
                <h2 className="text-2xl font-bold text-white tracking-tight">Active Deployments</h2>
              </div>
              <p className="text-zinc-400 text-sm">Recent work showcasing full-stack capabilities.</p>
            </div>
            
            {/* Filter Buttons */}
            <div className="flex w-full overflow-x-auto gap-2 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800/50 md:w-auto">
              {['All', 'Frontend', 'Backend', 'Fullstack'].map(filter => (
                <button 
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-1.5 rounded-md text-xs font-mono uppercase transition-all ${
                    activeFilter === filter 
                    ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700' 
                    : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div layout className="flex flex-col gap-12">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
                  transition={{ duration: 0.4 }}
                  key={project.id} 
                  className="group flex flex-col lg:flex-row gap-6 lg:gap-8 items-center bg-zinc-900/20 p-3 sm:p-4 rounded-2xl border border-zinc-800/40 lg:border-transparent hover:border-zinc-800/50 transition-colors"
                >
                  <div className="w-full lg:w-1/2 aspect-video rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 relative">
                    <img src={project.img} alt={project.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-60"></div>
                    <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-zinc-800 text-[10px] font-mono uppercase px-3 py-1 rounded-full text-zinc-300">
                      {project.category}
                    </div>
                  </div>
                  <div className="w-full lg:w-1/2 flex flex-col p-2">
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">{project.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-6">{project.desc}</p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {project.tech.map(t => (
                        <span key={t} className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">{t}</span>
                      ))}
                    </div>
                    <div className="flex flex-col min-[420px]:flex-row min-[420px]:items-center gap-3 min-[420px]:gap-4">
                      <a href={project.link} className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-zinc-300 transition-colors bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-700">
                        View Source <Github className="w-4 h-4" />
                      </a>
                      <a href={project.link} className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                        Live Demo <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* PEER RECOMMENDATIONS / TESTIMONIALS (NEW) */}
        <section className="py-16 md:py-24 px-4 sm:px-6 border-t border-zinc-900/50">
           <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="mb-16">
            <div className="flex items-center gap-2 mb-4">
              <Quote className="w-5 h-5 text-zinc-500" />
              <h2 className="text-2xl font-bold text-white tracking-tight">Peer Output logs</h2>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                text: "An exceptional engineer who consistently writes clean, maintainable code. Their architectural decisions on our microservices migration saved us months of technical debt.",
                author: "Lead Architect, TechNexus",
                id: "7f8a9b2"
              },
              {
                text: "Not only do they ship features fast, but they also care deeply about performance and DX. The internal tooling they built is still used by our entire engineering team daily.",
                author: "Engineering Manager, CloudData",
                id: "3e4c1d9"
              }
            ].map((testi, i) => (
              <motion.div 
                initial="hidden" whileInView="visible" viewport={{ once: true }} 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.2 } } }}
                key={i} className="bg-[#111] border border-zinc-800 rounded-xl p-6 font-mono text-xs relative group"
              >
                <div className="absolute top-0 right-0 bg-zinc-800 text-zinc-500 px-2 py-1 rounded-bl-lg rounded-tr-xl opacity-50 group-hover:opacity-100 transition-opacity">
                  commit: {testi.id}
                </div>
                <div className="text-zinc-600 mb-4">/* peer_review.txt */</div>
                <p className="text-zinc-400 leading-relaxed mb-6">"{testi.text}"</p>
                <div className="flex items-center gap-2 text-zinc-500 border-t border-zinc-800/50 pt-4">
                  <span className="text-green-500">~</span> 
                  <span className="text-white">{testi.author}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="py-16 md:py-24 px-4 sm:px-6 border-t border-zinc-900/50">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 mb-6">
                <Zap className="w-5 h-5 text-yellow-500" />
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight mb-4">Initialize Connection</h2>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-lg mx-auto">
                Execute the contact protocol below to establish a secure transmission line.
              </p>
            </div>

            {/* Terminal Form */}
            <div className="bg-[#0a0a0a] border border-zinc-800 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] max-w-2xl mx-auto mb-16">
              {/* Terminal Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#111] border-b border-zinc-800">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                </div>
                <div className="text-xs font-mono text-zinc-500">~/send_message.sh</div>
                <div className="w-12"></div> {/* Spacer for center alignment */}
              </div>
              
              {/* Terminal Body as Form */}
              <form className="p-6 sm:p-8 font-mono text-sm space-y-6">
                <div>
                  <label className="flex flex-wrap items-center gap-2 text-zinc-400 mb-2">
                    <span className="text-green-500">➜</span>
                    <span className="text-blue-400">const</span>
                    <span className="text-yellow-200">name</span>
                    <span className="text-white">=</span>
                  </label>
                  <input type="text" placeholder="'Enter your name...'" className="w-full bg-transparent border-b border-zinc-800 focus:border-green-500 outline-none text-zinc-300 placeholder:text-zinc-700 py-2 transition-colors font-mono" />
                </div>
                
                <div>
                  <label className="flex flex-wrap items-center gap-2 text-zinc-400 mb-2">
                    <span className="text-green-500">➜</span>
                    <span className="text-blue-400">const</span>
                    <span className="text-yellow-200">email</span>
                    <span className="text-white">=</span>
                  </label>
                  <input type="email" placeholder="'your@email.com'" className="w-full bg-transparent border-b border-zinc-800 focus:border-green-500 outline-none text-zinc-300 placeholder:text-zinc-700 py-2 transition-colors font-mono" />
                </div>

                <div>
                  <label className="flex flex-wrap items-center gap-2 text-zinc-400 mb-2">
                    <span className="text-green-500">➜</span>
                    <span className="text-blue-400">const</span>
                    <span className="text-yellow-200">payload</span>
                    <span className="text-white">=</span>
                  </label>
                  <textarea rows="4" placeholder="`Type your message here...`" className="w-full bg-zinc-900/30 border border-zinc-800 focus:border-green-500 outline-none text-zinc-300 placeholder:text-zinc-700 p-4 rounded-lg resize-none transition-colors font-mono mt-2"></textarea>
                </div>

                <div className="pt-4 flex flex-col min-[420px]:flex-row min-[420px]:items-center justify-between gap-4">
                  <div className="text-xs text-zinc-600 animate-pulse">Awaiting input...</div>
                  <button type="button" className="px-6 py-2 bg-white text-black font-bold font-sans text-sm rounded hover:bg-zinc-200 transition-colors flex items-center gap-2 group shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                    <Terminal className="w-4 h-4 group-hover:text-blue-600 transition-colors" /> Execute
                  </button>
                </div>
              </form>
            </div>

            <div className="flex items-center justify-center gap-8 border-t border-zinc-900 pt-10">
              <a href="#" className="text-zinc-500 hover:text-white hover:scale-110 transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-zinc-500 hover:text-white hover:scale-110 transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-zinc-500 hover:text-white hover:scale-110 transition-all">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
            
            <div className="mt-10 flex items-center justify-center gap-2 text-[10px] text-zinc-600 font-mono uppercase tracking-widest">
              <Terminal className="w-3 h-3" /> System normal. All rights reserved © 2026.
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
