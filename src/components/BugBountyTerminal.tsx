import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, ShieldAlert, CheckCircle, ShieldCheck, Play, Radio, Flame, AlertOctagon } from "lucide-react";
import { portfolioData, Experience } from "../data/portfolioData";

export default function BugBountyTerminal() {
  const hackerExp = portfolioData.experiences.find((exp) => exp.company === "HackerOne") as Experience;
  const vulnerabilities = hackerExp?.vulnerabilities || [];

  const [selectedTarget, setSelectedTarget] = useState<string>("Google");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const logsContainerRef = useRef<HTMLDivElement | null>(null);

  const currentVulnerability = vulnerabilities.find(
    (v) => v.target.toLowerCase() === selectedTarget.toLowerCase()
  ) || vulnerabilities[0];

  // Auto-scroll inside terminal logger container without scrolling the entire page
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [consoleLogs]);

  const runVulnerabilityScan = (targetName: string) => {
    setSelectedTarget(targetName);
    setIsScanning(true);
    setScanProgress(0);
    setConsoleLogs([
      `[SYS_INIT] CONNECTING SOURCE CORE SHELL TO SECURE ENDPOINT [${targetName.toUpperCase()}]`,
      `[INFO] PING ENVELOPE ESTABLISHED. TIMEOUT: 14MS`,
      `[RECON] ROTATING PROXY BRIDGES THROUGH SHIELD_VPN...`,
    ]);

    const logs = [
      `[RECON] SCANNING PORT 443 / SSL ENCRYPTION HANDSHAKE STATUS CHECK...`,
      `[AUDIT] PARSING METADATA HEADERS FOR TOKEN EXPOSURES...`,
      `[THREAT_LOG] TRACING ENDPOINT CONTROLLER PATHS...`,
      `[ALERT] LOGIC BYPASS DETECTED IN AUTH INTERFACE!`,
      `[SUCCESS] DEEPLY ROOTED VULNERABILITY LOCATED! REPORTED BY GURNOOR SINGH (@CREEPY_ROOT)`,
      `[PATCH_STATUS] AUDITED, SEALED, AND CONFIRMED BY ${targetName.toUpperCase()} INFRASTRUCTURE TEAM.`
    ];

    let currentLogIdx = 0;
    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        const next = prev + 5;
        if (next >= 100) {
          clearInterval(progressInterval);
          setIsScanning(false);
          return 100;
        }
        
        // Stagger logs output matching the percentage
        if (next % 20 === 0 && currentLogIdx < logs.length) {
          setConsoleLogs((prevLogs) => [...prevLogs, logs[currentLogIdx]]);
          currentLogIdx++;
        }
        return next;
      });
    }, 100);
  };

  // Run initial scan for Google
  useEffect(() => {
    runVulnerabilityScan("Google");
  }, []);

  return (
    <section id="terminal" className="py-24 bg-black relative border-b-8 border-brand-yellow">
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-20" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header decoration */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-neutral-900 pb-8 mb-12">
          <div>
            <span className="font-mono text-xs text-brand-yellow tracking-[0.3em] uppercase block mb-2">[ RECON PORTFOLIO ]</span>
            <h2 className="text-5xl sm:text-7xl font-display font-black tracking-tighter text-white uppercase italic drop-shadow-[5px_5px_0px_#FFD700]">
              BUG BOUNTY <span className="text-brand-red drop-shadow-[5px_5px_0px_#FFD700]">TERMINAL</span>
            </h2>
          </div>
          <div className="mt-4 md:mt-0 font-mono text-xs text-neutral-400 border-2 border-brand-red bg-neutral-950 p-3 rounded shadow-[4px_4px_0px_#FFD700] max-w-sm flex items-center gap-3">
            <Radio className="w-5 h-5 text-brand-red animate-pulse" />
            <div>
              <span className="font-black text-[#FFD700] block uppercase">LEADERBOARD DISCLOSER</span>
              <span className="text-[10px] text-neutral-500">4+ Years active inside HackerOne platform auditing world-class systems</span>
            </div>
          </div>
        </div>

        {/* Real Shell console container with giant shadow from the Bold Typography theme */}
        <div style={{ perspective: "1500px" }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.88, rotateX: 12, rotateY: -8, translateZ: -120, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0, translateZ: 0, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            whileHover={{ 
              rotateX: 4, 
              rotateY: -4, 
              translateZ: 12,
              scale: 1.008,
              boxShadow: "0 30px 60px -15px rgba(255, 0, 0, 0.35)"
            }}
            style={{ transformStyle: "preserve-3d" }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className="grid grid-cols-12 gap-8 bg-neutral-950 border-4 border-brand-yellow shadow-[12px_12px_0px_#FF0000] p-2 sm:p-5 rounded-lg relative overflow-hidden"
          >
          
          {/* Top header styling for hacker station */}
          <div className="col-span-12 flex justify-between items-center border-b border-neutral-900 pb-4 mb-2 px-2">
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded-full bg-brand-red inline-block pointer-events-none"></span>
              <span className="w-3.5 h-3.5 rounded-full bg-brand-yellow inline-block pointer-events-none"></span>
              <span className="w-3.5 h-3.5 rounded-full bg-[#10b981] inline-block pointer-events-none"></span>
              <span className="ml-3 font-mono text-[11px] text-neutral-500 tracking-wider">HACKERONE_SIMULATOR_CORE_SHELL --creepy_root</span>
            </div>
            <div className="px-2.5 py-0.5 bg-red-950 text-brand-red font-mono text-[9px] border border-red-900 rounded font-bold uppercase animate-pulse">
              STATUS: THREAT TESTING
            </div>
          </div>

          {/* Target list selector buttons */}
          <div className="col-span-12 md:col-span-3 flex flex-col gap-2 p-2 bg-neutral-900/30 rounded border border-neutral-900 select-none">
            <span className="font-mono text-[9px] text-[#FFD700] font-black uppercase px-2 mb-2 block tracking-widest border-b border-neutral-800 pb-2">
              SELECT AUDIT TARGET
            </span>
            {vulnerabilities.map((vuln) => {
              const isActive = selectedTarget.toLowerCase() === vuln.target.toLowerCase();
              return (
                <button
                  key={vuln.target}
                  id={`target-${vuln.target.toLowerCase()}`}
                  onClick={() => runVulnerabilityScan(vuln.target)}
                  disabled={isScanning}
                  className={`px-4 py-3 font-mono text-xs font-black text-left uppercase transition-all rounded flex items-center justify-between border-l-4 ${
                    isActive
                      ? "bg-brand-yellow text-black border-brand-red font-black scale-102 shadow-[3px_3px_0px_#FF0000]"
                      : "bg-neutral-950 text-neutral-400 border-neutral-800 hover:bg-neutral-900 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-brand-red" : "bg-neutral-700 animate-pulse"}`}></span>
                    {vuln.target}
                  </span>
                  {vuln.severity === "Critical" && (
                    <span className={`px-1.5 py-0.5 text-[8px] rounded uppercase font-black tracking-widest ${
                      isActive ? "bg-black text-brand-red" : "bg-red-950/80 text-brand-red"
                    }`}>
                      CRIT
                    </span>
                  )}
                  {vuln.severity === "High" && (
                    <span className={`px-1.5 py-0.5 text-[8px] rounded uppercase font-black tracking-widest ${
                      isActive ? "bg-black text-brand-yellow" : "bg-yellow-950/80 text-brand-yellow"
                    }`}>
                      HIGH
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Interactive terminal output stream */}
          <div className="col-span-12 md:col-span-12 lg:col-span-5 flex flex-col bg-black border border-neutral-900 rounded p-4 h-[350px] relative font-mono text-[10px] sm:text-xs">
            
            {/* Overlay showing loading scanner */}
            <AnimatePresence>
              {isScanning && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/95 z-40 flex flex-col justify-center items-center p-6 border-2 border-brand-red"
                >
                  <Flame className="w-10 h-10 text-brand-red animate-bounce mb-3" />
                  <span className="font-mono text-xs text-brand-yellow text-glow-yellow uppercase tracking-widest font-black block">
                    SCANNING INFRASTRUCTURE...
                  </span>
                  
                  <div className="w-44 h-2 bg-neutral-900 mt-4 rounded-sm overflow-hidden border border-neutral-800">
                    <motion.div 
                      className="h-full bg-brand-red"
                      initial={{ width: 0 }}
                      animate={{ width: `${scanProgress}%` }}
                      transition={{ ease: "easeOut" }}
                    />
                  </div>
                  
                  <span className="font-mono text-[10px] text-neutral-500 mt-2 block tracking-widest">
                    PROGRESS: {scanProgress}% / RESOLVING SEC-ENDPOINT
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Simulated log scroll container */}
            <div ref={logsContainerRef} className="flex-1 overflow-y-auto space-y-2 pr-2">
              <span className="text-neutral-500 text-[10px] block border-b border-neutral-900 pb-1 mb-2">
                ACTIVE RECON STREAM LOGS // STACK OVERVIEW
              </span>
              {consoleLogs.map((log, index) => {
                if (!log) return null;
                let textClass = "text-neutral-300";
                if (log.includes("[ERROR]") || log.includes("[ALERT]")) textClass = "text-brand-red font-black";
                if (log.includes("[SUCCESS]")) textClass = "text-brand-yellow font-black text-glow-yellow";
                if (log.includes("[RECON]")) textClass = "text-purple-400";
                if (log.includes("[SYS_INIT]")) textClass = "text-cyan-400";

                return (
                  <div key={index} className={`leading-relaxed text-[11px] ${textClass}`}>
                    {log}
                  </div>
                );
              })}
            </div>

            <div className="border-t border-neutral-900 pt-2 flex items-center justify-between text-[11px] select-none text-neutral-400 font-mono">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 font-bold"></span>
                READY FOR REQUESTS
              </span>
              <button 
                onClick={() => runVulnerabilityScan(selectedTarget)}
                className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 hover:text-brand-yellow rounded text-[9px] uppercase border border-neutral-800 flex items-center gap-1 transition-all font-black text-glow-yellow"
              >
                <Play className="w-2.5 h-2.5" /> RE-RUN
              </button>
            </div>
          </div>

          {/* Vulnerability metrics details panel */}
          <div className="col-span-12 md:col-span-12 lg:col-span-4 flex flex-col justify-between p-4 bg-neutral-900/40 border-2 border-neutral-900 rounded select-none">
            <div>
              <span className="font-mono text-[9px] text-[#FF0000] font-black uppercase mb-2 block tracking-widest">
                VULNERABILITY METRICS // DEC-LEVELS
              </span>
              
              <div className="flex items-center justify-between mb-4 bg-black p-2 border border-neutral-850 rounded shadow-[3px_3px_0px_#FFD700]">
                <span className="font-mono text-xs text-neutral-400">TARGET SECURITY:</span>
                <span className="font-mono text-xs font-black uppercase text-brand-yellow bg-yellow-950/80 px-2 py-0.5 rounded border border-brand-yellow">
                  {currentVulnerability.target}
                </span>
              </div>

              {/* Severity Gauge */}
              <div className="space-y-1 mb-4">
                <div className="flex justify-between font-mono text-[10px] text-neutral-400">
                  <span>DISCLOSED SEVERITY:</span>
                  <span className={`font-black ${
                    currentVulnerability.severity === "Critical" 
                      ? "text-brand-red animate-pulse text-glow-red" 
                      : "text-brand-yellow"
                  }`}>
                    {currentVulnerability.severity.toUpperCase()}
                  </span>
                </div>
                <div className="h-2 w-full bg-neutral-950 rounded overflow-hidden flex gap-1 p-0.5">
                  <div className={`h-full flex-1 rounded-sm ${
                    currentVulnerability.severity === "Critical" || currentVulnerability.severity === "High" || currentVulnerability.severity === "Medium"
                      ? "bg-brand-red" : "bg-neutral-800"
                  }`} />
                  <div className={`h-full flex-1 rounded-sm ${
                    currentVulnerability.severity === "Critical" || currentVulnerability.severity === "High"
                      ? "bg-orange-500" : "bg-neutral-800"
                  }`} />
                  <div className={`h-full flex-1 rounded-sm ${
                    currentVulnerability.severity === "Critical"
                      ? "bg-brand-yellow" : "bg-neutral-800"
                  }`} />
                </div>
              </div>

              {/* Exploit description text */}
              <div className="bg-black p-4 border border-neutral-850 rounded mb-4">
                <span className="font-mono text-[10px] text-neutral-500 block mb-1 font-bold">AUDIT BRIEF:</span>
                <p className="font-sans text-xs text-neutral-300 leading-relaxed">
                  {currentVulnerability.description}
                </p>
                {currentVulnerability.cve && (
                  <div className="mt-3 font-mono text-[10px] text-brand-red flex items-center gap-1 bg-red-950/30 p-1 border border-brand-red/20 rounded font-black">
                    <AlertOctagon className="w-3.5 h-3.5" />
                    <span>CVE STATUS: {currentVulnerability.cve}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Resolved Badge */}
            <div className="bg-[#10b981]/5 p-3 border border-emerald-500/20 rounded flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#10b981]" />
              <div>
                <span className="font-mono text-[10px] text-neutral-400 block leading-none">PATCH DISCLOSURE</span>
                <span className="font-mono text-xs font-black text-[#10b981] uppercase leading-relaxed text-glow-yellow">
                  {currentVulnerability.bountyStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Quick statement on bottom */}
          <div className="col-span-12 font-mono text-[10px] text-neutral-500 border-t border-neutral-900 pt-3 flex flex-col sm:flex-row justify-between uppercase mx-2 tracking-wide gap-2">
            <span>AUDIT DISCLOSURE POLICY: ALL EXPLOITS WERE RESOLVED SAFELY FOLLOWING RESPONSIBLE AND COORDINATED DISCLOSURE.</span>
            <span className="text-brand-red font-black">SECURED THROUGH ZERO TRUST BLUEPRINT</span>
          </div>
        </motion.div>
      </div>

        {/* Text paragraph summarizing the hacker status */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-neutral-400 font-sans text-sm leading-relaxed border-l-4 border-brand-red pl-6 m-2">
          <div>
            <p>
              With over 4 years of dedicated freelance research, I’ve tracked and mapped security leakages alongside global engineering cohorts inside Google and Microsoft platforms. This provides a deep system strategy when planning server infrastructures.
            </p>
          </div>
          <div>
            <p>
              Thinking from an enemy’s vantage point allows me to design web applications with incredibly secure code sandboxing, encrypted payload delivery, resilient session tokens, and bulletproof multi-tenant routing architectures.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
