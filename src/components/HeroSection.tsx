import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Shield, Cpu, Activity, Clock, Terminal } from "lucide-react";
import { portfolioData } from "../data/portfolioData";

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [threatLevel, setThreatLevel] = useState("SECURE");
  const [systemAlerts, setSystemAlerts] = useState<string[]>([
    "INITIALIZING COGNITIVE INTERFACE...",
    "SECURE SHELL ESTABLISHED AT NEW DELHI",
    "POLYMATH BRAINWAVES SYNCHRONIZED",
  ]);

  // Matrix-style falling code animation customized in Yellow/Amber and Red
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width =
      canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = 700);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width =
        canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = 700;
    };
    window.addEventListener("resize", handleResize);

    // Characters for digital rain
    const chars =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン1234567890ABCDEF@#$%-+*=";
    const charArray = chars.split("");

    const fontSize = 14;
    const columns = Math.floor(width / fontSize) + 1;
    const drops: number[] = Array(columns)
      .fill(0)
      .map(() => Math.floor(Math.random() * -100));

    const draw = () => {
      // Semi-transparent background to create trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];

        // Randomly choose between cybersecurity yellow/amber and target red
        const isRed = Math.random() < 0.15;
        ctx.fillStyle = isRed ? "#ef4444" : "#facc15";
        ctx.font = `bold ${fontSize}px monospace`;

        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        // Reset drop to top randomly
        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    // Rotate quick threat simulator
    const alertInterval = setInterval(() => {
      const dangerStates = [
        "SECURE",
        "WARNING: PORT SCAN DETECTED",
        "ACTIVE AUDIT IN PROGRESS",
        "LEVEL 4 CLEARAPPED",
      ];
      const messages = [
        "AUDITING STACK INTEGRITY...",
        "BUG EXPULSION SEQUENCE ARMED...",
        "PULLING TELEMETRY FROM CREATOR DATABASE...",
        "AI COPILOT AGENT LINKED AND STABILIZED...",
        "THREAT SHIELD ACTIVE (99.8% RESILIENT)",
      ];

      const randomState =
        dangerStates[Math.floor(Math.random() * dangerStates.length)];
      setThreatLevel(randomState);

      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      setSystemAlerts((prev) => [randomMsg, prev[0], prev[1]].slice(0, 3));
    }, 4500);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      clearInterval(alertInterval);
    };
  }, []);

  const { scrollY } = useScroll();

  // Parallax translating rates
  const backgroundY = useTransform(scrollY, (value) => value * 0.4);
  const textY = useTransform(scrollY, (value) => value * 0.2);
  const overlayY = useTransform(scrollY, (value) => value * -0.12);

  const personal = portfolioData.personalInfo;

  return (
    <section
      id="hero"
      className="relative min-h-[720px] h-[92vh] flex flex-col justify-between bg-black overflow-hidden border-b-[16px] border-brand-red select-none cursor-crosshair"
    >
      {/* Background circular glowing blur zones from Bold Typography theme */}
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-brand-red rounded-full opacity-20 blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand-yellow rounded-full opacity-10 blur-[120px] pointer-events-none z-0"></div>

      {/* Decorative Parallax Giant Watermark Layers */}
      <div className="absolute top-[80px] right-[2%] text-[220px] font-black text-white/5 pointer-events-none select-none uppercase z-0 font-display leading-none">
        SEC
      </div>
      <div className="absolute bottom-[140px] left-[-30px] text-[130px] font-black text-brand-red/10 pointer-events-none select-none -rotate-90 uppercase z-0 font-display tracking-widest leading-none">
        ROOT
      </div>

      {/* Parallax layered backgrounds */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none opacity-35"
        style={{ y: backgroundY }}
      >
        <canvas ref={canvasRef} className="w-full h-full" />
      </motion.div>

      <div className="absolute inset-0 z-10 pointer-events-none cyber-grid h-full" />

      {/* Heavy brutalist design markers */}
      <div className="absolute top-0 left-0 w-full flex justify-between z-20 items-center px-4 py-2 border-b-2 border-neutral-900 bg-black/95">
        <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-brand-yellow">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-red animate-pulse inline-block"></span>
          <span>CREEPY_ROOT CORE TERMINAL v4.2.16</span>
        </div>
        <div className="hidden md:flex items-center space-x-6 text-[10px] font-mono text-neutral-400">
          <span>PORT: 3000 / INGRESS OK</span>
          <span>LATENCY: 14MS</span>
          <span className="flex items-center text-brand-red">
            <Activity className="w-3.5 h-3.5 animate-bounce mr-1" />
            THREAT: <span className="ml-1 font-bold">{threatLevel}</span>
          </span>
        </div>
      </div>

      {/* Left sidebar metric lines */}
      <div className="absolute left-0 top-16 bottom-0 w-12 hidden lg:flex flex-col items-center justify-between py-6 border-r border-neutral-900 font-mono text-[9px] text-neutral-500 z-20 select-none">
        <div className="rotate-90 origin-left translate-x-2.5 mt-8 tracking-widest whitespace-nowrap uppercase">
          [ DEEP SECURITY ]
        </div>
        <div className="flex flex-col space-y-4 items-center">
          <Shield className="w-4 h-4 text-brand-red animate-spin" />
          <Cpu className="w-4 h-4 text-brand-yellow" />
        </div>
        <div className="rotate-90 origin-left translate-x-2.5 mb-16 tracking-widest uppercase">
          SYS_OP // {new Date().getFullYear()}
        </div>
      </div>

      {/* Main typography stack with scroll parallax */}
      <div className="flex-1 flex flex-col justify-center items-start px-6 md:px-16 lg:px-28 relative z-25">
        {/* Dynamic scanning line overlay */}
        <div className="absolute left-0 right-0 h-0.5 bg-brand-yellow/20 shadow-md shadow-brand-yellow top-1/4 animate-bounce pointer-events-none" />

        <motion.div style={{ y: textY }} className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-block px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-[0.25em] bg-brand-red text-black rounded-sm border border-black shadow-[4px_4px_0px_#FFD700]"
            >
              SYS_OPERATOR // SECURED PORTFOLIO
            </motion.div>

            {/* Rotated Creative badge from theme */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: 3 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-brand-yellow text-black px-3 py-1 font-black text-xs uppercase tracking-wider rounded-sm select-none"
            >
              AVAILABLE FOR SEC-AUDIT
            </motion.div>
          </div>

          {/* Large display name styling - Custom text strokes and mega solid shadows */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative mt-8"
          >
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[130px] font-display font-black tracking-tighter text-brand-red select-none leading-[0.85] uppercase italic drop-shadow-[8px_8px_0px_#FFD700]">
              GURNOOR
              <br />
              <span className="text-white drop-shadow-[8px_8px_0px_#FF0000]">
                SINGH
              </span>
            </h1>
            <div className="absolute -top-6 md:-top-8 -right-2 font-mono text-[10px] select-none tracking-widest uppercase bg-brand-yellow text-black px-1.5 py-0.5 pointer-events-none rounded font-extrabold shadow-[2px_2px_0px_#FF0000]">
              @CREEPY_ROOT
            </div>
          </motion.div>

          {/* Subtitle taglines */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-brand-yellow font-mono text-sm sm:text-xl tracking-widest font-black max-w-2xl uppercase flex flex-wrap items-center gap-x-2"
          >
            <span>ETHICAL HACKER</span>{" "}
            <span className="text-brand-red font-black">•</span>
            <span>AI DEVELOPER</span>{" "}
            <span className="text-brand-red font-black">•</span>
            <span>DESIGNER THINKER</span>
          </motion.p>

          {/* Quote block */}
          <motion.blockquote
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="mt-6 border-l-4 border-brand-red pl-4 italic text-neutral-400 max-w-xl text-xs sm:text-sm font-sans"
          >
            {personal.quote}
          </motion.blockquote>

          {/* Quick buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <a
              href="#terminal"
              className="px-6 py-3 bg-brand-yellow hover:bg-yellow-500 text-black font-mono font-black text-xs uppercase tracking-widest border-2 border-black transition-all rounded shadow-[5px_5px_0px_#FF0000] active:translate-y-1 active:shadow-[1px_1px_0px_#FF0000]"
            >
              INITIATE SEC-AUDIT
            </a>
            <a
              href="#contact"
              className="px-6 py-3 bg-black hover:bg-neutral-900 text-brand-red font-mono font-black text-xs uppercase tracking-widest border-2 border-brand-red transition-all rounded shadow-[5px_5px_0px_#FFD700] active:translate-y-1 active:shadow-[1px_1px_0px_#FFD700]"
            >
              COMMUNICATION LINK
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Cyber diagnostics right panel HUD */}
      <motion.div
        className="absolute right-0 bottom-24 w-80 hidden md:flex flex-col p-4 bg-neutral-950/90 border-2 border-neutral-800 rounded-sm font-mono text-[10px] space-y-3 z-30 shadow-2xl mr-6"
        style={{ y: overlayY }}
      >
        <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5 text-brand-red font-bold">
          <span className="flex items-center gap-1.5 uppercase">
            <Terminal className="w-3 h-3 text-brand-yellow" /> SYSTEM MONITOR
          </span>
          <span className="text-neutral-500">[ONLINE]</span>
        </div>

        <div className="space-y-1 text-slate-300">
          <div className="flex justify-between">
            <span className="text-neutral-500">MEMBER IP:</span>
            <span className="text-brand-yellow">127.0.0.1</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">SECTOR COORDS:</span>
            <span className="text-brand-red">28.6139° N, 77.2090° E</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">TARGET ACQUISITION:</span>
            <span className="text-green-500 font-bold">ENGAGED</span>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-2 space-y-1.5 text-neutral-400">
          <span className="text-[9px] text-[#facc15] font-bold block">
            CONSOLE LOGS:
          </span>
          {systemAlerts.map((log, idx) => (
            <div
              key={idx}
              className="truncate text-glow-yellow leading-tight text-[9px]"
            >
              &gt; {log}
            </div>
          ))}
        </div>

        <div className="bg-black/60 p-1.5 border border-brand-red/20 text-[9px] flex items-center gap-1 text-neutral-400 rounded">
          <Clock className="w-3.5 h-3.5 text-brand-red animate-pulse" />
          <span>PORTFOLIO COMPILED // MAY 2026</span>
        </div>
      </motion.div>

      {/* Scrolling Hazard bottom ribbon */}
      <div className="h-10 w-full overflow-hidden flex items-center relative z-20 shadow-md">
        <div className="absolute inset-0 hazard-bg pointer-events-none opacity-90" />
        <div className="w-full relative flex whitespace-nowrap py-1.5 bg-black/90 font-mono text-xs font-bold tracking-widest text-brand-yellow border-t-2 border-b-2 border-brand-yellow">
          <div className="animate-marquee flex gap-12 select-none uppercase">
            <span>● SECURE SHELL ACTIVE</span>
            <span>● RED TEAM DISCLOSURES APPLIED</span>
            <span>● PENETRATION RESILIENT UI</span>
            <span>● DESIGN THOUGHT PROCESS EXPLOITED</span>
            <span>
              ● BUG BOUNTY DISCLOSER TO GOOGLE, TESLA, MICROSOFT, APPLE & TINDER
            </span>
            <span>● ARTIFICIAL INTELLIGENCE PIPELINES ONLINE</span>
          </div>
          <div className="animate-marquee flex gap-12 select-none uppercase absolute top-1.5 left-full">
            <span>● SECURE SHELL ACTIVE</span>
            <span>● RED TEAM DISCLOSURES APPLIED</span>
            <span>● PENETRATION RESILIENT UI</span>
            <span>● DESIGN THOUGHT PROCESS EXPLOITED</span>
            <span>
              ● BUG BOUNTY DISCLOSER TO GOOGLE, TESLA, MICROSOFT, APPLE & TINDER
            </span>
            <span>● ARTIFICIAL INTELLIGENCE PIPELINES ONLINE</span>
          </div>
        </div>
      </div>
    </section>
  );
}
