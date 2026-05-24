import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "motion/react";
import { Crosshair, ShieldAlert, Cpu, AlertCircle, Zap } from "lucide-react";
import FullscreenBtn from "./FullscreenBtn";
import { soundEngine } from "../utils/audio";

export default function PayloadInjector() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [direction, setDirection] = useState(1);
  const [level, setLevel] = useState(1);
  const [strikes, setStrikes] = useState(0);
  const [status, setStatus] = useState<
    "idle" | "playing" | "success" | "hacked" | "failed"
  >("idle");
  const requestRef = useRef<number>();

  // Game parameters per level (gets faster and target gets smaller)
  const speed = 1.5 + level * 0.8;
  const targetWidth = Math.max(10, 30 - level * 4); // percentages
  const targetPosition = 50; // Center is 50%

  const animate = () => {
    setSliderPosition((prev) => {
      let next = prev + speed * direction;
      if (next >= 100) {
        setDirection(-1);
        next = 100;
      } else if (next <= 0) {
        setDirection(1);
        next = 0;
      }
      return next;
    });
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (status === "playing") {
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [status, direction, speed]);

  const startGame = () => {
    setStatus("playing");
    setSliderPosition(0);
    setDirection(1);
    setLevel(1);
    setStrikes(0);
  };

  const handleInject = () => {
    if (status !== "playing") return;

    // Check if slider is within target bounds
    const lowerBound = targetPosition - targetWidth / 2;
    const upperBound = targetPosition + targetWidth / 2;

    if (sliderPosition >= lowerBound && sliderPosition <= upperBound) {
      // Hit!
      if (level >= 5) {
        soundEngine.success();
        setStatus("hacked");
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
      } else {
        soundEngine.success();
        setStatus("success");
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        setTimeout(() => {
          setLevel((l) => l + 1);
          setStatus("playing");
        }, 1500);
      }
    } else {
      // Miss!
      soundEngine.error();
      setStrikes((s) => s + 1);
      if (strikes >= 2) {
        // 3 strikes = fail
        setStatus("failed");
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
      } else {
        // Just flash red but keep going
        const cachedDir = direction;
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        // momentary stun
        setTimeout(() => {
          requestRef.current = requestAnimationFrame(animate);
        }, 500);
      }
    }
  };

  return (
    <section
      ref={containerRef}
      className="py-20 bg-neutral-950 font-mono text-white border-y-2 border-brand-red relative overflow-hidden"
    >
      <FullscreenBtn targetRef={containerRef} />
      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255, 0, 0, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 0, 0, 0.5) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      ></div>

      <div className="w-full max-w-4xl mx-auto px-4 relative z-10 flex flex-col items-center">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-brand-red text-xs font-black tracking-widest mb-2 border border-brand-red/30 px-3 py-1 rounded bg-brand-red/10">
            <Zap className="w-3.5 h-3.5 animate-pulse" /> NETWORK EXPLOIT
            MINIGAME
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-3">
            Payload <span className="text-brand-red">Injector</span>
          </h2>
          <p className="text-neutral-400 text-[11px] md:text-sm max-w-lg mx-auto uppercase">
            Timing matrix lock. Inject the phantom payload directly during the
            vulnerable server frame. Miss 3 times and the firewall burns you.
          </p>
        </div>

        <div className="w-full bg-black border-2 border-neutral-800 rounded p-6 md:p-10 shadow-2xl relative">
          {/* Game Stats */}
          <div className="flex justify-between items-center border-b border-neutral-900 pb-4 mb-8">
            <div className="font-bold text-xs uppercase flex items-center gap-2">
              <Cpu className="w-4 h-4 text-brand-yellow" /> FIREWALL LEVEL:{" "}
              <span className="text-brand-yellow">{level}/5</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold">
              <ShieldAlert className="w-4 h-4 text-brand-red" />
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full border border-brand-red ${i < strikes ? "bg-brand-red" : "bg-transparent"}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* The Lockpicking Track */}
          <div className="relative w-full h-16 bg-neutral-900 rounded border border-neutral-700 overflow-hidden shadow-inner flex items-center mb-10">
            {/* Safe Zone / Vulnerability Window */}
            <div
              className="absolute h-full bg-brand-yellow/30 border-x-2 border-brand-yellow flex items-center justify-center transition-all duration-300"
              style={{
                left: `${targetPosition - targetWidth / 2}%`,
                width: `${targetWidth}%`,
              }}
            >
              <Crosshair className="w-5 h-5 text-brand-yellow opacity-50" />
            </div>

            {/* Moving Injector Pin */}
            <motion.div
              className="absolute h-[120%] w-2 bg-white rounded-full shadow-[0_0_15px_white] z-10"
              style={{
                left: `${sliderPosition}%`,
                transform: "translateX(-50%)",
              }}
            />
          </div>

          {/* Controls & Feedback */}
          <div className="flex flex-col items-center justify-center h-24">
            {status === "idle" && (
              <button
                onClick={startGame}
                className="bg-brand-red hover:bg-red-500 text-black font-black text-sm uppercase px-8 py-4 rounded tracking-widest transition-all"
              >
                INITIALIZE EXPLOIT
              </button>
            )}

            {status === "playing" && (
              <button
                onClick={handleInject}
                className="bg-brand-yellow hover:bg-white text-black font-black text-xl uppercase px-12 py-4 rounded tracking-widest transition-all shadow-[0_0_20px_#FFD700]"
              >
                INJECT
              </button>
            )}

            {status === "success" && (
              <div className="text-green-400 font-black text-xl animate-pulse tracking-widest uppercase flex flex-col items-center">
                <span>BYPASS SUCCESSFUL</span>
                <span className="text-[10px] text-neutral-500">
                  PROCEEDING TO NEXT NODE...
                </span>
              </div>
            )}

            {status === "hacked" && (
              <div className="text-brand-yellow font-black text-2xl tracking-[0.3em] uppercase flex flex-col items-center">
                <span>SYSTEM OVERRIDDEN</span>
                <span className="text-[10px] text-green-500 tracking-normal mt-2 border border-green-500/30 px-3 py-1 rounded">
                  ROOT ACCESS GRANTED
                </span>
                <button
                  onClick={startGame}
                  className="mt-4 text-[10px] text-neutral-400 hover:text-white underline tracking-normal"
                >
                  PLAY AGAIN
                </button>
              </div>
            )}

            {status === "failed" && (
              <div className="text-brand-red font-black text-2xl tracking-[0.2em] uppercase flex flex-col items-center">
                <span>FIREWALL TRIGGERED</span>
                <span className="text-[10px] text-neutral-500 tracking-normal mt-2 border border-red-500/30 px-3 py-1 rounded">
                  CONNECTION TERMINATED
                </span>
                <button
                  onClick={startGame}
                  className="mt-4 text-[10px] text-neutral-400 hover:text-white underline tracking-normal"
                >
                  RETRY INFILTRATION
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
