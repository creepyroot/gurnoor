import React, { useState, useEffect, useRef } from 'react';
import { Target, Zap } from 'lucide-react';
import FullscreenBtn from './FullscreenBtn';
import { playSound } from '../utils/audio';

export default function ZeroDayBreach() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<'idle' | 'waiting' | 'ready' | 'done'>('idle');
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [message, setMessage] = useState('INITIATE ZERO-DAY BREACH');

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (gameState === 'waiting') {
      const waitTime = Math.floor(Math.random() * 3000) + 2000; // 2s to 5s
      timeout = setTimeout(() => {
        setGameState('ready');
        setStartTime(Date.now());
        setMessage('BREACH NOW!');
      }, waitTime);
    }
    return () => clearTimeout(timeout);
  }, [gameState]);

  const handleClick = () => {
    if (gameState === 'idle' || gameState === 'done') {
      setGameState('waiting');
      setMessage('ESTABLISHING CONNECTION... WAIT FOR SIGNAL');
      setReactionTime(null);
    } else if (gameState === 'waiting') {
      setGameState('done');
      setMessage('TOO EARLY! CONNECTION TRACED. TRY AGAIN.');
      setReactionTime(null);
      playSound('lose');
    } else if (gameState === 'ready') {
      const time = Date.now() - startTime;
      setReactionTime(time);
      setGameState('done');
      setMessage(time < 250 ? 'GHOST IN THE MACHINE' : 'BREACH SUCCESSFUL');
      playSound(time < 250 ? 'win' : 'hit');
    }
  };

  return (
    <section ref={containerRef} className="py-20 bg-black font-mono text-white border-y-2 border-brand-red relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
      <FullscreenBtn targetRef={containerRef} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.1)_0,transparent_60%)] pointer-events-none" />
      
      <div className="z-10 text-center max-w-2xl px-6">
        <div className="inline-flex items-center gap-2 text-brand-red text-xs font-black tracking-widest mb-6 border border-brand-red/30 px-3 py-1 rounded bg-brand-red/10">
          <Target className="w-4 h-4 text-brand-red animate-pulse" />
          PROTOCOL: ZERO_DAY
        </div>

        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-[0.2em] mb-4 text-white drop-shadow-[4px_4px_0px_#FFD700]">
          Zero-Day <span className="text-brand-red">Breach</span>
        </h2>
        
        <p className="text-neutral-400 text-sm mb-12 uppercase tracking-widest leading-relaxed">
          The mainframe firewall drops for milliseconds. Wait for the exact moment to inject the payload. Click too early, you get traced. Click too late, the port closes.
        </p>

        <button 
          onClick={handleClick}
          className={`w-full max-w-md mx-auto aspect-video flex flex-col items-center justify-center rounded-lg border-4 transition-all duration-75 shadow-[8px_8px_0px_#000] active:translate-y-2 active:shadow-[0px_0px_0px_#000] cursor-crosshair
            ${gameState === 'idle' || gameState === 'done' ? 'bg-neutral-900 border-neutral-700 hover:border-brand-red' : ''}
            ${gameState === 'waiting' ? 'bg-brand-yellow/20 border-brand-yellow text-brand-yellow' : ''}
            ${gameState === 'ready' ? 'bg-brand-red border-brand-red text-black scale-105' : ''}
          `}
        >
          {gameState === 'ready' && <Zap className="w-16 h-16 animate-ping mb-4" />}
          <span className="font-black text-xl md:text-2xl tracking-[0.2em] text-center px-4">
            {message}
          </span>
          {reactionTime !== null && (
            <div className="mt-4 text-white bg-black px-4 py-2 border border-brand-red rounded animate-pulse">
              TIME: <span className="text-brand-red font-black">{reactionTime}ms</span>
            </div>
          )}
        </button>
      </div>
    </section>
  );
}
