import React, { useState, useEffect, useRef } from "react";
import { Grid, Zap, ShieldAlert, Cpu } from "lucide-react";
import FullscreenBtn from "./FullscreenBtn";
import { playSound } from "../utils/audio";

const GRID_SIZE = 9;

export default function MemoryGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerStep, setPlayerStep] = useState<number>(0);
  const [isPlayingSeq, setIsPlayingSeq] = useState(false);
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const startNewGame = () => {
    setScore(0);
    setSequence([]);
    setPlayerStep(0);
    setGameState("playing");
    addNodeToSequence([]);
  };

  const addNodeToSequence = (currentSeq: number[]) => {
    const nextNode = Math.floor(Math.random() * GRID_SIZE);
    const newSeq = [...currentSeq, nextNode];
    setSequence(newSeq);
    playSequence(newSeq);
  };

  const playSequence = async (seq: number[]) => {
    setIsPlayingSeq(true);
    // short delay before starting
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    for (let i = 0; i < seq.length; i++) {
      setActiveNode(seq[i]);
      playSound('hit');
      await new Promise((resolve) => setTimeout(resolve, 500));
      setActiveNode(null);
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
    
    setIsPlayingSeq(false);
    setPlayerStep(0);
  };

  const handleNodeClick = (index: number) => {
    if (gameState !== "playing" || isPlayingSeq) return;

    // Flash node
    setActiveNode(index);
    playSound('beep');
    setTimeout(() => setActiveNode(null), 200);

    if (index === sequence[playerStep]) {
      // Correct step
      const nextStep = playerStep + 1;
      setPlayerStep(nextStep);

      if (nextStep === sequence.length) {
        // level complete
        setScore(score + 1);
        playSound('win');
        if (score + 1 > highScore) setHighScore(score + 1);
        setTimeout(() => addNodeToSequence(sequence), 500);
      }
    } else {
      // Wrong step
      setGameState("gameover");
      playSound('lose');
    }
  };

  return (
    <section ref={containerRef} className="py-20 bg-neutral-950 font-mono text-white border-y flex flex-col items-center justify-center border-brand-red min-h-[500px] relative">
      <FullscreenBtn targetRef={containerRef} />
      <div className="w-full max-w-lg px-6 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-black tracking-widest mb-6 border border-cyan-400/30 px-3 py-1 rounded bg-cyan-400/10">
          <Grid className="w-4 h-4 text-cyan-400 animate-pulse" />
          MEMORY MATRIX INTRUSION
        </div>

        <div className="flex w-full justify-between items-end mb-6">
          <div>
            <h2 className="text-3xl font-black uppercase text-white tracking-widest">
              Matrix <span className="text-cyan-400">Unlock</span>
            </h2>
            <p className="text-neutral-500 text-[10px] mt-1 tracking-widest">MATCH THE ENCRYPTION PATTERN</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-white">LVL {score}</div>
            <div className="text-[10px] text-cyan-600">MAX {highScore}</div>
          </div>
        </div>

        <div className="w-full aspect-square bg-black border-4 border-neutral-900 rounded-lg p-3 grid grid-cols-3 gap-3 relative shadow-[0_0_30px_rgba(0,255,255,0.1)]">
          {gameState === "gameover" && (
            <div className="absolute inset-0 z-10 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm animate-fadeIn">
              <ShieldAlert className="w-16 h-16 text-brand-red mb-4 animate-bounce" />
              <div className="text-brand-red font-black text-2xl tracking-widest mb-2 shadow-[2px_2px_0px_#FFD700]">ACCESS DENIED</div>
              <div className="text-neutral-400 text-xs mb-6">INVALID SEQUENCE</div>
              <button 
                onClick={startNewGame}
                className="bg-brand-red text-black font-black px-6 py-3 uppercase tracking-widest hover:bg-white transition-colors text-sm"
              >
                RETRY HACK
              </button>
            </div>
          )}

          {gameState === "idle" && (
            <div className="absolute inset-0 z-10 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm">
              <Cpu className="w-16 h-16 text-cyan-400 mb-4 animate-pulse" />
              <button 
                onClick={startNewGame}
                className="bg-cyan-500 text-black font-black px-6 py-3 uppercase tracking-widest hover:bg-white transition-colors text-sm shadow-[4px_4px_0px_rgba(255,255,255,0.3)]"
              >
                START INTRUSION
              </button>
            </div>
          )}

          {Array.from({ length: GRID_SIZE }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleNodeClick(idx)}
              className={`rounded-md transition-all duration-100 border-2
                ${activeNode === idx 
                  ? "bg-cyan-400 border-white shadow-[0_0_20px_rgba(0,255,255,0.8)] scale-[1.02]" 
                  : "bg-neutral-900 border-neutral-800 hover:border-cyan-400/50"
                }
              `}
            />
          ))}
        </div>
        
        <div className="mt-6 text-[10px] text-neutral-500 w-full text-center tracking-[0.3em]">
          {isPlayingSeq ? "OBSERVE THE SECURE SEQUENCE" : (gameState === "playing" ? "REPLICATE SEQUENCE TO ADVANCE" : "")}
        </div>
      </div>
    </section>
  );
}
