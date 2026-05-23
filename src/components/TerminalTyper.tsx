import React, { useState, useEffect, useRef } from "react";
import { Terminal, Shield, RefreshCcw } from "lucide-react";
import { playSound } from "../utils/audio";
import FullscreenBtn from "./FullscreenBtn";

const WORDS = ["ROOT", "HACK", "BREACH", "PAYLOAD", "PROXY", "BYPASS", "MALWARE", "FIREWALL", "NODE", "EXPLOIT", "WORM", "TROJAN", "BOTNET", "PHISH", "DDOS", "CIPHER", "ENCRYPT", "KEY"];

export default function TerminalTyper() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [words, setWords] = useState<{ id: number; text: string; y: number; speed: number }[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [score, setScore] = useState(0);
  const [hp, setHp] = useState(3);
  const requestRef = useRef<number>();
  const idCounter = useRef(0);

  const startGame = () => {
    setGameState("playing");
    setWords([]);
    setInputVal("");
    setScore(0);
    setHp(3);
    idCounter.current = 0;
    playSound('beep');
  };

  const spawnWord = () => {
    const text = WORDS[Math.floor(Math.random() * WORDS.length)];
    const newWord = { id: idCounter.current++, text, y: -20, speed: 0.5 + Math.random() * 0.5 + (score * 0.05) };
    setWords(prev => [...prev, newWord]);
  };

  useEffect(() => {
    if (gameState === "playing") {
      const interval = setInterval(() => {
        spawnWord();
      }, Math.max(800, 2500 - score * 50));
      return () => clearInterval(interval);
    }
  }, [gameState, score]);

  const update = () => {
    if (gameState === "playing") {
      setWords(prev => {
        let damage = 0;
        const next = prev.map(w => ({ ...w, y: w.y + w.speed })).filter(w => {
          if (w.y > 400) {
            damage += 1;
            return false;
          }
          return true;
        });

        if (damage > 0) {
          playSound('hit');
          setHp(h => {
            const nextHp = h - damage;
            if (nextHp <= 0) {
              setGameState("gameover");
              playSound('lose');
              return 0;
            }
            return nextHp;
          });
        }
        return next;
      });
    }
    requestRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    if (gameState === "playing") {
      requestRef.current = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(requestRef.current!);
  }, [gameState]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    setInputVal(val);

    const matchIndex = words.findIndex(w => w.text === val);
    if (matchIndex !== -1) {
      playSound('shoot');
      setScore(s => s + words[matchIndex].text.length * 10);
      setWords(prev => prev.filter((_, i) => i !== matchIndex));
      setInputVal("");
    }
  };

  return (
    <section ref={containerRef} className="relative py-20 bg-neutral-950 font-mono flex flex-col items-center border-t-4 border-cyan-500 min-h-[600px] overflow-hidden">
      <FullscreenBtn targetRef={containerRef} />
      
      <div className="w-full max-w-2xl px-6 relative z-10 flex flex-col h-full items-center">
        <div className="inline-flex items-center gap-2 text-cyan-400 font-black tracking-widest text-xs border border-cyan-400/30 px-3 py-1 bg-cyan-400/10 mb-6">
          <Terminal className="w-4 h-4 animate-pulse" />
          TERMINAL TYPER
        </div>

        <div className="flex w-full justify-between text-white font-black uppercase tracking-widest mb-4 z-20">
          <div>SCORE: <span className="text-cyan-400">{score}</span></div>
          <div className="flex gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Shield key={i} className={`w-5 h-5 ${i < hp ? "text-brand-red" : "text-neutral-700"}`} />
            ))}
          </div>
        </div>

        <div className="w-full h-[400px] bg-black border-2 border-neutral-800 relative overflow-hidden shadow-[inset_0_0_20px_rgba(0,255,255,0.05)] rounded z-20">
          {gameState === "idle" && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm z-30">
              <button onClick={startGame} className="bg-cyan-500 text-black px-6 py-3 font-black uppercase hover:bg-white transition-colors flex items-center gap-2">
                <Terminal className="w-5 h-5" /> BEGIN HACK
              </button>
            </div>
          )}

          {gameState === "gameover" && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm z-30">
              <div className="text-brand-red text-4xl font-black mb-2 animate-pulse">BREACH DETECTED</div>
              <div className="text-white mb-6">FINAL SCORE: {score}</div>
              <button onClick={startGame} className="bg-white text-black px-6 py-3 font-black uppercase hover:bg-cyan-500 transition-colors flex items-center gap-2">
                <RefreshCcw className="w-5 h-5" /> REBOOT
              </button>
            </div>
          )}

          {/* Falling Words */}
          {words.map(w => (
            <div 
              key={w.id} 
              className="absolute left-1/2 -translate-x-1/2 text-cyan-400 font-bold whitespace-nowrap px-2 py-1 bg-neutral-900 border border-cyan-900 rounded shadow-[0_0_10px_rgba(0,255,255,0.2)] text-sm z-10"
              style={{ top: `${w.y}px`, left: `${10 + Math.abs(Math.sin(w.id * 10)) * 80}%` }}
            >
              {w.text}
            </div>
          ))}
          
          {/* Danger Line */}
          <div className="absolute bottom-0 w-full h-1 bg-brand-red opacity-50 shadow-[0_0_10px_red]" />
        </div>

        <input 
          type="text" 
          value={inputVal}
          onChange={handleInput}
          disabled={gameState !== "playing"}
          className="w-full mt-6 bg-black border-2 border-cyan-500 p-4 text-white font-mono font-black text-xl text-center outline-none focus:border-white uppercase shadow-[0_0_20px_rgba(0,255,255,0.2)] z-20"
          placeholder={gameState === "playing" ? "TYPE TO DESTROY..." : "SYSTEM IDLE"}
          autoFocus={gameState === "playing"}
        />
      </div>
    </section>
  );
}
