import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Lock, Unlock, Server, Terminal as TerminalIcon, AlertTriangle } from 'lucide-react';

const TARGET_PASSWORD = "ACCESS_GRANTED_GURNOOR_ADMIN";
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+~`|}{[]:;?><,./-=";

export default function PasswordCracker() {
  const [displayText, setDisplayText] = useState(Array(TARGET_PASSWORD.length).fill("-").join(""));
  const [status, setStatus] = useState<"idle" | "cracking" | "success">("idle");
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const startCracking = () => {
    if (status === "cracking") return;
    setStatus("cracking");
    setProgress(0);
    setLogs(["[SYSTEM] INITIATING BRUTE FORCE ATTACK...", "[NETWORK] BYPASSING FIREWALL..."]);
    
    let currentIteration = 0;
    const maxIterations = 40; 
    let revealedLength = 0;

    const interval = setInterval(() => {
      currentIteration++;
      
      // Add random logs
      if (currentIteration % 5 === 0) {
        setLogs(prev => [...prev, `[NODE_${Math.floor(Math.random() * 999)}] TESTING HASH COMBINATION...`].slice(-10));
      }

      // Progress bar update
      setProgress(Math.min((currentIteration / maxIterations) * 100, 100));

      // Reveal characters progressively
      if (currentIteration % Math.floor(maxIterations / TARGET_PASSWORD.length) === 0) {
        revealedLength++;
      }

      let newText = "";
      for (let i = 0; i < TARGET_PASSWORD.length; i++) {
        if (i < revealedLength) {
          newText += TARGET_PASSWORD[i];
        } else {
          newText += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      setDisplayText(newText);

      if (currentIteration >= maxIterations || revealedLength >= TARGET_PASSWORD.length) {
        clearInterval(interval);
        setDisplayText(TARGET_PASSWORD);
        setStatus("success");
        setProgress(100);
        setLogs(prev => [...prev, "[SUCCESS] MAINFRAME ENCRYPTION BROKEN.", "[ACCESS] ADMIN PRIVILEGES GRANTED."].slice(-10));
      }
    }, 50);
  };

  const reset = () => {
    setStatus("idle");
    setDisplayText(Array(TARGET_PASSWORD.length).fill("-").join(""));
    setProgress(0);
    setLogs([]);
  };

  return (
    <section className="py-20 bg-neutral-950 border-t-4 border-b-4 border-brand-yellow font-mono text-white relative flex flex-col items-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900/50 via-black to-black pointer-events-none" />
      
      <div className="w-full max-w-5xl px-4 z-10">
        <div className="mb-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 text-brand-yellow text-xs font-black tracking-widest mb-2 border border-brand-yellow/30 px-3 py-1 rounded bg-brand-yellow/10">
            <AlertTriangle className="w-3.5 h-3.5" /> INTERACTIVE MINIGAME
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-2">
            Brute Force <span className="text-brand-yellow">Simulator</span>
          </h2>
          <p className="text-neutral-400 text-xs md:text-sm max-w-2xl uppercase">
            Test your deck's processing power. Break through the simulated encryption layer to reveal the hidden admin payload.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Cracker Panel */}
          <div className="md:col-span-2 bg-black border-2 border-neutral-800 rounded p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="flex justify-between text-[10px] text-neutral-500 font-bold mb-6 border-b border-neutral-800 pb-2 uppercase">
              <span>TARGET: GURNOOR_MAINFRAME</span>
              <span>ENCRYPTION: AES-256</span>
            </div>

            <div className="flex-grow flex flex-col items-center justify-center py-10">
              {status === "success" ? (
                <Unlock className="w-16 h-16 text-green-500 mb-6 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
              ) : (
                <Lock className={`w-16 h-16 ${status === "cracking" ? "text-brand-yellow animate-pulse" : "text-neutral-600"} mb-6`} />
              )}
              
              <div className={`text-xl md:text-3xl font-black tracking-[0.2em] break-all text-center px-4 py-3 rounded border-2 select-all transition-colors ${
                status === "success" ? "bg-green-900/30 text-green-400 border-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]" : "bg-neutral-900 border-neutral-700 text-white"
              }`}>
                {displayText}
              </div>
            </div>

            <div className="mt-8">
              <div className="flex justify-between text-xs font-bold mb-2 uppercase">
                <span className={status === "success" ? "text-green-500" : "text-brand-yellow"}>
                  {status === "idle" ? "READY" : status === "cracking" ? "DECRYPTING..." : "DECRYPTED"}
                </span>
                <span className="text-neutral-400">{Math.floor(progress)}%</span>
              </div>
              <div className="h-2 w-full bg-neutral-900 rounded overflow-hidden border border-neutral-800">
                <motion.div 
                  className={`h-full ${status === "success" ? "bg-green-500" : "bg-brand-yellow"}`}
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>

              <div className="mt-6 flex gap-4">
                {status !== "cracking" && (
                  <button 
                    onClick={startCracking}
                    className="flex-1 bg-brand-yellow text-black font-black py-3 rounded text-sm hover:bg-yellow-400 transition-colors uppercase flex items-center justify-center gap-2"
                  >
                    <Server className="w-4 h-4" /> {status === "success" ? "Run Again" : "Inject Payload"}
                  </button>
                )}
                {status === "success" && (
                  <button 
                    onClick={reset}
                    className="flex-1 bg-neutral-800 text-white font-black py-3 rounded text-sm hover:bg-neutral-700 transition-colors uppercase border border-neutral-600"
                  >
                    Reset Connection
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Terminal Logs */}
          <div className="bg-black border-2 border-neutral-800 rounded flex flex-col overflow-hidden max-h-[400px]">
            <div className="bg-neutral-900 py-2 px-4 border-b border-neutral-800 flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase">
              <TerminalIcon className="w-3.5 h-3.5" /> Attack Logs
            </div>
            <div className="flex-grow p-4 overflow-y-auto text-[10px] space-y-1.5 custom-scrollbar bg-neutral-950 font-mono">
              {logs.length === 0 ? (
                <div className="text-neutral-600 italic">Waiting for command...</div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className={log.includes("SUCCESS") ? "text-green-400" : log.includes("ERROR") ? "text-brand-red" : "text-brand-yellow"}>
                    <span className="text-neutral-500 pr-2">{new Date().toISOString().substring(11, 19)}</span>
                    {log}
                  </div>
                ))
              )}
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
