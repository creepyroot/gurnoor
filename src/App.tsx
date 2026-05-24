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
import PayloadInjector from "./components/PayloadInjector";
import NeonDefender from "./components/NeonDefender";
import CyberSnake from "./components/CyberSnake";
import CyberRacer from "./components/CyberRacer";
import ZeroDayBreach from "./components/ZeroDayBreach";
import MemoryGrid from "./components/MemoryGrid";
import NeonPong from "./components/NeonPong";
import TerminalTyper from "./components/TerminalTyper";
import CyberClicker from "./components/CyberClicker";
import NeonRunner from "./components/NeonRunner";
import DataBreaker from "./components/DataBreaker";
import {
  Shield,
  Activity,
  Terminal,
  ArrowUp,
  Menu,
  X,
  Cpu,
  ChevronDown,
} from "lucide-react";
import { portfolioData } from "./data/portfolioData";
import { playSound } from "./utils/audio";

export const ARCADE_GAMES = [
  {
    id: "zero-day",
    label: "Zero-Day Breach",
    color: "hover:text-brand-red text-[#ff3333]",
  },
  {
    id: "hacker-cam",
    label: "Hacker Camera",
    color: "hover:text-brand-red text-[#ff3333]",
  },
  {
    id: "cyber-racer",
    label: "Cyber Racer",
    color: "hover:text-brand-red text-[#ff3333]",
  },
  {
    id: "payload-injector",
    label: "Payload Injector",
    color: "hover:text-brand-red text-[#ff3333]",
  },
  {
    id: "neon-defender",
    label: "Neon Defender",
    color: "hover:text-brand-red text-[#ffbb00]",
  },
  {
    id: "cyber-snake",
    label: "Cyber Snake",
    color: "hover:text-brand-yellow text-brand-yellow",
  },
  {
    id: "memory-grid",
    label: "Memory Matrix",
    color: "hover:text-cyan-400 text-cyan-400",
  },
  {
    id: "neon-pong",
    label: "Neon Pong",
    color: "hover:text-pink-500 text-pink-500",
  },
  {
    id: "terminal-typer",
    label: "Terminal Typer",
    color: "hover:text-cyan-500 text-cyan-500",
  },
  {
    id: "cyber-clicker",
    label: "Cyber Clicker",
    color: "hover:text-brand-yellow text-brand-yellow",
  },
  {
    id: "neon-runner",
    label: "Neon Runner",
    color: "hover:text-fuchsia-500 text-fuchsia-400",
  },
  {
    id: "data-breaker",
    label: "Data Breaker",
    color: "hover:text-[#00FFFF] text-[#00FFFF]",
  },
];

function GamesPreviewSection({ onNavigate }: { onNavigate: () => void }) {
  return (
    <section
      id="games"
      className="py-24 bg-neutral-950 relative border-b-8 border-brand-red"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,0,0,0.05)_0,transparent_100%)] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-black text-white uppercase drop-shadow-[5px_5px_0px_#FF0000] mb-8 font-display italic">
          Interactive <span className="text-brand-red">Exploits</span>
        </h2>
        <p className="text-neutral-400 font-mono text-sm mb-12 uppercase tracking-widest max-w-2xl mx-auto border-l-4 border-r-4 border-brand-red px-4 py-2 bg-black/50">
          Access the Cyber Arcade to test your reflexes and problem solving
          against simulated corporate ICE security nodes. Twelve active payloads
          waiting for injection.
        </p>
        <button
          onClick={() => {
            window.scrollTo(0, 0);
            onNavigate();
          }}
          className="bg-brand-red text-black font-black font-mono text-xl md:text-2xl uppercase px-12 py-6 rounded-lg shadow-[8px_8px_0px_#FFD700] hover:-translate-y-1 transition-all active:translate-y-2 active:shadow-none border-2 border-brand-yellow"
        >
          ENTER ARCADE PORTAL
        </button>
      </div>
    </section>
  );
}

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showRocket, setShowRocket] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [gamesDropdownOpen, setGamesDropdownOpen] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [currentPage, setCurrentPage] = useState<"home" | "games">("home");

  const [showIntro, setShowIntro] = useState(true);
  const [introFade, setIntroFade] = useState(false);
  const [appEntrance, setAppEntrance] = useState(false);
  const [hudWipe, setHudWipe] = useState(false);

  // Anti-Inspect Security Measures & Intro Animation Control
  useEffect(() => {
    // Start fading out the loader
    const fadeTimer = setTimeout(() => {
      setIntroFade(true);
    }, 2200);

    // Completely remove the loader layer and trigger the main content's slide-up entrance
    const removeTimer = setTimeout(() => {
      setShowIntro(false);
      setAppEntrance(true);
      playSound("win");
      setHudWipe(true);
      setTimeout(() => {
        setHudWipe(false);
      }, 1500);
    }, 2900);

    // Basic anti-inspect script
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      console.log(
        "%c[SECURE SYSTEM] ACCESS DENIED.",
        "color: red; font-size: 20px; font-weight: bold; background: black; padding: 10px;",
      );
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "J") ||
        (e.ctrlKey && e.key === "U") ||
        (e.ctrlKey && e.shiftKey && e.key === "C")
      ) {
        e.preventDefault();
        console.log(
          "%c[SECURE SYSTEM] UNAUTHORIZED DEBUGGING DETECTED.",
          "color: red; font-weight: bold; background: black; padding: 5px;",
        );
      }
    };

    // Obfuscate console log
    console.log(
      "%cWARNING: DO NOT PASTE ANY COMMANDS HERE.",
      "color: yellow; font-size: 30px; font-weight: 900; -webkit-text-stroke: 1px red;",
    );

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Monitor screen alignment and dimensions
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
      setShowRocket(window.scrollY > 500);
    };

    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1024);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    handleScroll();
    handleResize();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
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
    { label: "ABILITIES", target: "#skills" },
    { label: "DOSSIER", target: "#education" },
    { label: "CONNECT", target: "#contact" },
  ];

  const selectGame = (anchor: string) => {
    setCurrentPage("games");
    setGamesDropdownOpen(false);
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(anchor);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.hash = `#${anchor}`;
      }
    }, 150);
  };

  // Close dropdown on click outside
  useEffect(() => {
    if (!gamesDropdownOpen) return;
    const clickOutside = () => {
      setGamesDropdownOpen(false);
    };
    window.addEventListener("click", clickOutside);
    return () => window.removeEventListener("click", clickOutside);
  }, [gamesDropdownOpen]);

  return (
    <div className="relative min-h-screen bg-black text-white font-sans selection:bg-brand-red selection:text-black select-none">
      {/* Intro Animation Layer */}
      {showIntro && (
        <div
          className={`fixed inset-0 z-[100] bg-black flex items-center justify-center pointer-events-none transition-all duration-[800ms] cubic-bezier(0.16, 1, 0.3, 1) ${
            introFade
              ? "opacity-0 scale-110 blur-xl"
              : "opacity-100 scale-100 blur-none"
          }`}
        >
          <div
            className="text-center font-display font-black text-5xl md:text-8xl uppercase tracking-tighter"
            style={{ textShadow: "4px 4px 0px #FF0000, -4px -4px 0px #00FFFF" }}
          >
            <span className="relative inline-block animate-glitch">
              GURNOOR
            </span>
            <br />
            <span
              className="relative inline-block text-brand-yellow animate-glitch"
              style={{ animationDelay: "0.1s" }}
            >
              SINGH
            </span>
            <div className="mt-8 text-sm md:text-xl font-mono text-cyan-400 tracking-widest text-glow-cyan animate-pulse">
              INITIALIZING SECURE TERMINAL...
            </div>
          </div>
        </div>
      )}
      {/* Glitch HUD Scan Laser Wipe Animation */}
      {hudWipe && (
        <div className="fixed inset-0 z-[101] pointer-events-none overflow-hidden">
          {/* Laser Sweep Bar */}
          <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-yellow to-transparent shadow-[0_0_20px_#FFD700] animate-laser-sweep" />
          <div className="absolute inset-0 bg-brand-red/5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] opacity-10" />
        </div>
      )}
      {/* Main App Content Revealed with Cinematic Entrance Zoom and Blur Dissolve */}
      <div
        className={`transition-all duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) ${
          appEntrance
            ? "opacity-100 translate-y-0 scale-100 filter-none"
            : "opacity-0 translate-y-8 scale-98 blur-[6px] pointer-events-none"
        }`}
      >
        {/* 1. Custom Floating HUD Target Pointer (Desktop Only) */}
        {isDesktop && (
          <div
            ref={cursorRef}
            className="fixed w-8 h-8 pointer-events-none z-50 mix-blend-difference -left-4 -top-4"
            style={{ willChange: "transform" }}
          >
            <div className="absolute inset-0 border border-brand-yellow rounded-full animate-spin-slow opacity-60"></div>
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-brand-red opacity-60"></div>
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-brand-red opacity-60"></div>
            <div className="absolute w-1.5 h-1.5 bg-brand-yellow rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        )}

        {/* 2. Reading progress index bar */}
        <div className="fixed top-0 left-0 right-0 h-1.5 bg-neutral-900 z-50 pointer-events-none">
          <div
            className="h-full bg-brand-red transition-all duration-75"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* 3. Main Fixed HUD Menu Board */}
        <header className="fixed top-1.5 left-0 right-0 z-[60] bg-black/95 border-b border-neutral-900 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => {
                setCurrentPage("home");
                window.scrollTo(0, 0);
              }}
              className="flex items-center space-x-2.5 group cursor-pointer text-left focus:outline-none"
            >
              <div className="w-8 h-8 rounded-sm bg-brand-red flex items-center justify-center font-mono font-black text-white border-2 border-brand-yellow shadow-[2px_2px_0px_#FFD700] group-active:translate-y-0.5 group-active:shadow-[1px_1px_0px_#FFD700]">
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
            </button>

            {/* Desktop Nav Actions */}
            <nav className="hidden lg:flex items-center space-x-1 font-mono text-[11px] font-bold relative">
              <button
                onClick={() => {
                  setCurrentPage("home");
                  window.scrollTo(0, 0);
                }}
                className="px-3 py-1.5 text-neutral-400 hover:text-brand-yellow transition-colors rounded uppercase border border-transparent hover:border-neutral-900 focus:outline-none"
              >
                HOME
              </button>
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setGamesDropdownOpen(!gamesDropdownOpen);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 text-brand-red hover:text-yellow-400 font-black transition-all rounded uppercase border border-neutral-900/70 hover:border-red-900 bg-red-950/20"
                >
                  GAMES ARCADE{" "}
                  <ChevronDown
                    className={`w-3 h-3 transition-transform ${gamesDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {/* Dropdown Menu */}
                {gamesDropdownOpen && (
                  <div className="absolute top-10 right-0 w-56 bg-black border-2 border-brand-red rounded shadow-[6px_6px_0px_rgba(255,0,0,0.4)] z-50 flex flex-col py-1.5 animate-fadeIn">
                    {ARCADE_GAMES.map((game) => (
                      <button
                        key={game.id}
                        onClick={() => selectGame(game.id)}
                        className={`text-left px-4 py-2.5 hover:bg-neutral-900/60 border-b border-neutral-900/30 text-xs font-black transition-all uppercase ${game.color}`}
                      >
                        {game.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {currentPage === "home" &&
                navLinks.map((link) => (
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
              <span className="flex items-center text-brand-red font-bold animate-pulse">
                <Activity className="w-3.5 h-3.5 mr-1" /> SECURE TUNNEL ACTIVE
              </span>
            </div>

            {/* Mobile responsive toggler */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-400 hover:text-brand-yellow bg-neutral-950 rounded border border-neutral-900 hover:border-neutral-800 transition-all font-mono"
              aria-label="Toggle Navigation Board"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </header>

        {/* 4. Mobile Anchors Side-Menu Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[55] bg-black/98 flex flex-col justify-start items-center px-8 pt-32 pb-8 border-b-4 border-brand-yellow overflow-y-auto">
            <div className="absolute top-24 left-4 flex items-center space-x-2 font-mono text-[10px] text-brand-red">
              <Terminal className="w-4 h-4 text-glow-red animate-pulse" />
              <span>CREEPYROOT PORTABLE INTERCONNECT</span>
            </div>

            <nav className="flex flex-col space-y-6 text-center font-display font-extrabold text-2xl tracking-wider mt-4 w-full">
              <button
                onClick={() => {
                  setCurrentPage("home");
                  setMobileMenuOpen(false);
                  window.scrollTo(0, 0);
                }}
                className="text-white hover:text-brand-yellow uppercase transition-colors"
              >
                HOME
              </button>
              <button
                onClick={() => {
                  setCurrentPage("games");
                  setMobileMenuOpen(false);
                  window.scrollTo(0, 0);
                }}
                className="text-brand-red border border-brand-red bg-red-950/20 py-3 rounded hover:bg-brand-red hover:text-black uppercase transition-colors"
              >
                GAMES ARCADE MAIN
              </button>
              <div className="flex flex-col text-sm space-y-4 border-l-2 border-brand-red pl-4 text-left">
                {ARCADE_GAMES.map((game) => (
                  <button
                    key={game.id}
                    onClick={() => selectGame(game.id)}
                    className="text-left font-black tracking-widest hover:text-brand-yellow uppercase text-xs text-neutral-300 py-1"
                  >
                    {game.label}
                  </button>
                ))}
              </div>
              {currentPage === "home" &&
                navLinks.map((link) => (
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

            <div className="mt-12 font-mono text-[10px] text-neutral-500 flex flex-col items-center uppercase space-y-1.5 border-t border-neutral-900 pt-6 w-full pb-8">
              <span>PORTFOLIO FOR GURNOOR SINGH</span>
              <span className="text-brand-yellow font-bold">
                SECURE CONNECTION ESTABLISHED
              </span>
            </div>
          </div>
        )}

        {/* 5. Main Component Stack */}
        <main className="pt-20 overflow-x-hidden min-h-[90vh]">
          {currentPage === "home" ? (
            <>
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
                <GamesPreviewSection
                  onNavigate={() => setCurrentPage("games")}
                />
              </Scroll3DEntrance>
              <Scroll3DEntrance>
                <SuperBoldContact />
              </Scroll3DEntrance>
            </>
          ) : (
            <div className="pb-24">
              <div className="py-16 text-center text-white border-b-8 border-brand-red relative overflow-hidden bg-neutral-950">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,0,0,0.1)_0,transparent_70%)] pointer-events-none" />
                <h1 className="text-5xl md:text-8xl font-display font-black text-white hover:text-brand-red italic uppercase tracking-tighter drop-shadow-[5px_5px_0px_#FFD700] relative z-10 duration-200">
                  CYBER ARCADE
                </h1>
                <p className="mt-6 font-mono text-neutral-400 uppercase tracking-[0.3em] font-bold">
                  GAMES AND EXPLOITS
                </p>
              </div>
              <div id="zero-day">
                <ZeroDayBreach />
              </div>
              <div id="hacker-cam">
                <HackerCamera />
              </div>
              <div id="cyber-racer">
                <CyberRacer />
              </div>
              <div id="payload-injector">
                <PayloadInjector />
              </div>
              <div id="neon-defender">
                <NeonDefender />
              </div>
              <div id="cyber-snake">
                <CyberSnake />
              </div>
              <div id="memory-grid">
                <MemoryGrid />
              </div>
              <div id="neon-pong">
                <NeonPong />
              </div>
              <div id="terminal-typer">
                <TerminalTyper />
              </div>
              <div id="cyber-clicker">
                <CyberClicker />
              </div>
              <div id="neon-runner">
                <NeonRunner />
              </div>
              <div id="data-breaker">
                <DataBreaker />
              </div>
            </div>
          )}
        </main>

        {/* 6. Legal / Technical Footer */}
        <footer className="bg-black py-12 border-t-4 border-brand-red">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-[10px] text-neutral-500 tracking-wider">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-brand-red animate-ping"></div>
              <span>
                SYSTEM STATUS:{" "}
                <span className="text-brand-red font-bold">ONLINE</span>
              </span>
              <span className="text-neutral-700">|</span>
              <span>DATA ENCRYPTED & SECURE</span>
            </div>

            <div className="text-center md:text-right uppercase space-y-1">
              <p>
                &copy; {new Date().getFullYear()} GURNOOR SINGH. ALL ALGORITHMS
                PROTECTED.
              </p>
              <p className="text-glow-yellow text-xs text-brand-yellow font-black tracking-widest mt-0.5">
                ROOT SHELL MAINTAINED BY CREEPY_ROOT
              </p>
            </div>
          </div>
        </footer>

        {/* 7. Animated Scroll to Top Rocket Button */}
        {showRocket && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-40 p-3 bg-brand-yellow hover:bg-neutral-900 text-black hover:text-brand-yellow rounded border-2 border-brand-yellow transition-all flex items-center justify-center shadow-[4px_4px_0px_#FF0000] hover:scale-105 active:translate-y-0.5"
            aria-label="Secure Scroll Return"
          >
            <ArrowUp className="w-5 h-5 font-black" strokeWidth={3} />
          </button>
        )}
      </div>{" "}
      {/* Close Main App Content Revealed */}
    </div>
  );
}
