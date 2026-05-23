import React, { useEffect, useState, useRef } from "react";
import HeroSection from "./components/HeroSection";
import Philosophies from "./components/Philosophies";
import BugBountyTerminal from "./components/BugBountyTerminal";
import ExperienceTimeline from "./components/ExperienceTimeline";
import SkillBrutalistHex from "./components/SkillBrutalistHex";
import EducationAndLanguages from "./components/EducationAndLanguages";
import SuperBoldContact from "./components/SuperBoldContact";
import Scroll3DEntrance from "./components/Scroll3DEntrance";
import HackerCamera from "./components/HackerCamera";
import PasswordCracker from "./components/PasswordCracker";
import CyberTracker from "./components/CyberTracker";
import PayloadInjector from "./components/PayloadInjector";
import { Shield, Activity, Terminal, ArrowUp, Menu, X, Cpu } from "lucide-react";
import { portfolioData } from "./data/portfolioData";

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showRocket, setShowRocket] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  // Monitor screen alignment and dimensions
  useEffect(() => {
    // Force manual scroll restoration to prevent jumps on reload
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Temporarily turn off smooth-scrolling behavior during mounting
    // this ensures the initial scrolling page-mount return is instant and doesn't auto-scroll slowly
    const originalScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      document.documentElement.style.scrollBehavior = originalScrollBehavior || "smooth";
      window.scrollTo(0, 0);
    }, 100);

    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }

    const handleScroll = () => {
      // Calculate scroll velocity
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
      
      // Toggle "Up" rocket
      setShowRocket(window.scrollY > 500);
    };

    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1024);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    
    // Initial calls
    handleScroll();
    handleResize();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  // Monitor mouse position for custom floating HUD pointer
  useEffect(() => {
    if (!isDesktop) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isDesktop]);

  const navLinks = [
    { label: "RECON", target: "#hero" },
    { label: "PARADIGM", target: "#philosophy" },
    { label: "EXPLOITS", target: "#terminal" },
    { label: "TIMELINE", target: "#experience" },
    { label: "ABILITIES", target: "#skills" },
    { label: "DOSSIER", target: "#education" },
    { label: "CONNECT", target: "#contact" }
  ];

  return (
    <div className="relative min-h-screen bg-black text-white font-sans selection:bg-brand-red selection:text-black">
      
      {/* 1. Custom Floating HUD Target Pointer (Desktop Only) */}
      {isDesktop && (
        <div 
          ref={cursorRef}
          className="fixed w-8 h-8 pointer-events-none z-50 mix-blend-difference -left-4 -top-4"
          style={{ willChange: "transform" }}
        >
          {/* Targeted crosshair HUD icon */}
          <div className="absolute inset-0 border border-brand-yellow rounded-full animate-spin-slow opacity-60"></div>
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-brand-red opacity-60"></div>
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-brand-red opacity-60"></div>
          <div className="absolute w-1.5 h-1.5 bg-brand-yellow rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      )}

      {/* 2. Reading progress index bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-neutral-900 z-50">
        <div 
          className="h-full bg-brand-red transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 3. Main Fixed HUD Menu Board */}
      <header className="fixed top-1.5 left-0 right-0 z-40 bg-black/95 select-none border-b border-neutral-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Gurnoor's custom logo */}
          <a href="#hero" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-sm bg-brand-red flex items-center justify-center font-mono font-black text-white border-2 border-brand-yellow shadow-[2px_2px_0px_#FFD700] active:translate-y-0.5 active:shadow-[1px_1px_0px_#FFD700]">
              G
            </div>
            <div>
              <span className="font-display font-black text-sm tracking-widest text-white block group-hover:text-brand-yellow transition-colors uppercase leading-none">
                GURNOOR SINGH
              </span>
              <span className="font-mono text-[9px] text-brand-red block tracking-wider uppercase leading-tight mt-0.5 font-bold">
                @CREEPY_ROOT
              </span>
            </div>
          </a>

          {/* Desktop Nav Actions */}
          <nav className="hidden lg:flex items-center space-x-1 font-mono text-[11px] font-bold">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.target}
                className="px-3 py-1.5 text-neutral-400 hover:text-brand-yellow transition-colors rounded uppercase border border-transparent hover:border-neutral-900 hover:bg-neutral-950/40"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Interactive latency stats */}
          <div className="hidden lg:flex items-center space-x-4 bg-zinc-950/90 px-3.5 py-1.5 border border-neutral-900 rounded font-mono text-[10px] text-neutral-400">
            <span className="flex items-center text-brand-red font-bold">
              <Activity className="w-3.5 h-3.5 mr-1" /> CORE LEVEL: SECURE
            </span>
          </div>

          {/* Mobile responsive toggler */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-400 hover:text-brand-yellow bg-neutral-950 rounded border border-neutral-900 hover:border-neutral-800 transition-all"
            aria-label="Toggle Navigation Board"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* 4. Mobile Anchors Side-Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-35 bg-black/98 flex flex-col justify-center items-center p-8 select-none border-b-4 border-brand-yellow">
          <div className="absolute top-4 left-4 flex items-center space-x-2 font-mono text-[10px] text-brand-red">
            <Terminal className="w-4 h-4 text-glow-red animate-pulse" />
            <span>CREEPYROOT PORTABLE INTERCONNECT</span>
          </div>
          
          <nav className="flex flex-col space-y-6 text-center font-display font-extrabold text-2xl tracking-wider select-none">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.target}
                onClick={() => setMobileMenuOpen(false)}
                className="text-neutral-300 hover:text-brand-yellow uppercase transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          
          <div className="mt-16 font-mono text-[10px] text-neutral-500 flex flex-col items-center uppercase space-y-1.5 border-t border-neutral-900 pt-6 w-full">
            <span>PORTFOLIO FOR GURNOOR SINGH</span>
            <span className="text-brand-yellow font-bold">NEW DELHI, IN</span>
          </div>
        </div>
      )}

      {/* 5. Main Component Stack (Adds padding at top for fixed header) */}
      <main className="pt-20 overflow-x-hidden">
        <HeroSection />
        <Scroll3DEntrance>
          <Philosophies />
        </Scroll3DEntrance>
        <Scroll3DEntrance>
          <BugBountyTerminal />
        </Scroll3DEntrance>
        <Scroll3DEntrance>
          <ExperienceTimeline />
        </Scroll3DEntrance>
        <Scroll3DEntrance>
          <SkillBrutalistHex />
        </Scroll3DEntrance>
        <Scroll3DEntrance>
          <EducationAndLanguages />
        </Scroll3DEntrance>
        <Scroll3DEntrance>
          <SuperBoldContact />
        </Scroll3DEntrance>
        <HackerCamera />
        <PayloadInjector />
        <PasswordCracker />
        <CyberTracker />
      </main>

      {/* 6. Legal / Technical Footer */}
      <footer className="bg-black py-12 border-t-2 border-neutral-900 select-none">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-[10px] text-neutral-500 tracking-wider">
          
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 rounded-full bg-brand-yellow animate-ping"></div>
            <span>
              SYSTEM STATUS: <span className="text-brand-yellow font-bold">ONLINE</span>
            </span>
            <span className="text-neutral-700">|</span>
            <span>CYBER INTEL COMPILED SUCCESSFULLY</span>
          </div>

          <div className="text-center md:text-right uppercase space-y-1">
            <p>&copy; {new Date().getFullYear()} GURNOOR SINGH. ALL RIGHTS RESERVED.</p>
            <p className="text-glow-yellow text-xs text-brand-red font-black tracking-widest mt-0.5">
              SECURED BY CREEPY_ROOT COHORT
            </p>
          </div>

        </div>
      </footer>

      {/* 7. Animated Scroll to Top Rocket Button */}
      {showRocket && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-40 p-3 bg-brand-red hover:bg-neutral-900 text-white rounded border border-brand-red transition-all flex items-center justify-center shadow-[4px_4px_0px_#FFD700] hover:scale-105 active:translate-y-0.5"
          aria-label="Secure Scroll Return"
        >
          <ArrowUp className="w-5 h-5 text-glow-yellow animate-bounce" />
        </button>
      )}

    </div>
  );
}
