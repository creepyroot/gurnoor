import React, { useRef, useState, useEffect } from "react";
import { Zap, Play, RefreshCcw } from "lucide-react";
import FullscreenBtn from "./FullscreenBtn";
import { playSound } from "../utils/audio";

const CANVAS_W = 800;
const CANVAS_H = 400;

export default function NeonRunner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">(
    "idle",
  );
  const [score, setScore] = useState(0);

  const player = useRef({ y: 300, dy: 0, w: 30, h: 40, isJumping: false });
  const obstacles = useRef<{ x: number; y: number; w: number; h: number }[]>(
    [],
  );
  const frameRef = useRef(0);
  const speed = useRef(5);

  const jump = () => {
    if (!player.current.isJumping && gameState === "playing") {
      player.current.dy = -15;
      player.current.isJumping = true;
      playSound("shoot");
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        if (gameState === "playing") {
          e.preventDefault();
          jump();
        }
      }
    };
    window.addEventListener("keydown", handleKey, { passive: false });
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameState]);

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    player.current = { y: 300, dy: 0, w: 30, h: 40, isJumping: false };
    obstacles.current = [];
    speed.current = 5;
    playSound("beep");
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Grid Floor
    ctx.beginPath();
    ctx.moveTo(0, 340);
    ctx.lineTo(CANVAS_W, 340);
    ctx.strokeStyle = "#00FF00";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Player
    ctx.fillStyle = "#FF00FF";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#FF00FF";
    ctx.fillRect(50, player.current.y, player.current.w, player.current.h);

    // Obstacles
    ctx.fillStyle = "#FF0000";
    ctx.shadowColor = "#FF0000";
    obstacles.current.forEach((ob) => {
      ctx.fillRect(ob.x, ob.y, ob.w, ob.h);
    });
    ctx.shadowBlur = 0;
  };

  const update = () => {
    if (gameState !== "playing") return;

    // Player Physics
    player.current.dy += 0.8; // gravity
    player.current.y += player.current.dy;

    if (player.current.y > 340 - player.current.h) {
      player.current.y = 340 - player.current.h;
      player.current.dy = 0;
      player.current.isJumping = false;
    }

    // Spawn Obstacles
    if (
      Math.random() < 0.01 + speed.current * 0.002 &&
      obstacles.current.length < 3
    ) {
      // Only spawn if last obstacle is far enough
      const last = obstacles.current[obstacles.current.length - 1];
      if (!last || last.x < CANVAS_W - 300) {
        obstacles.current.push({
          x: CANVAS_W,
          y: 340 - 40, // Height 40
          w: 20,
          h: 40,
        });
      }
    }

    // Move Obstacles & Collision
    for (let i = 0; i < obstacles.current.length; i++) {
      let ob = obstacles.current[i];
      ob.x -= speed.current;

      // Collision
      if (
        50 < ob.x + ob.w &&
        50 + player.current.w > ob.x &&
        player.current.y < ob.y + ob.h &&
        player.current.y + player.current.h > ob.y
      ) {
        setGameState("gameover");
        playSound("explosion");
      }
    }

    // Remove off-screen
    obstacles.current = obstacles.current.filter((ob) => ob.x + ob.w > 0);

    // Increase score and speed
    speed.current += 0.001;
    setScore((s) => s + 1);
  };

  const loop = () => {
    update();
    draw();
    if (gameState === "playing") {
      frameRef.current = requestAnimationFrame(loop);
    }
  };

  useEffect(() => {
    if (gameState === "playing") {
      frameRef.current = requestAnimationFrame(loop);
    } else {
      draw();
    }
    return () => cancelAnimationFrame(frameRef.current);
  }, [gameState]);

  return (
    <section
      ref={containerRef}
      className="relative py-20 bg-neutral-950 font-mono text-white flex flex-col items-center border-t-4 border-fuchsia-500 overflow-hidden min-h-[500px]"
    >
      <FullscreenBtn targetRef={containerRef} />

      <div className="w-full max-w-4xl px-4 relative z-10 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 text-fuchsia-500 font-black tracking-widest text-xs border border-fuchsia-500/30 px-3 py-1 bg-fuchsia-500/10 mb-6">
          <Zap className="w-4 h-4 animate-pulse" />
          NEON RUNNER INFILTRATION
        </div>

        <div className="text-xl md:text-3xl font-black mb-4 flex justify-between w-full max-w-[800px]">
          <span className="text-neutral-500">SCORE:</span>{" "}
          <span className="text-fuchsia-500">{score}</span>
        </div>

        <div
          className="relative border-4 border-neutral-900 bg-black p-2 rounded w-full max-w-[800px] shadow-[0_0_30px_rgba(255,0,255,0.15)] flex justify-center cursor-pointer"
          onClick={jump}
        >
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            className="w-full h-auto bg-black"
          />

          {gameState === "idle" && (
            <div className="absolute inset-0 z-10 bg-black/60 flex flex-col justify-center items-center backdrop-blur-sm">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startGame();
                }}
                className="bg-fuchsia-600 text-white font-black px-8 py-4 uppercase hover:bg-white hover:text-black transition-all flex items-center gap-2"
              >
                <Play className="w-5 h-5" /> START RUN
              </button>
            </div>
          )}

          {gameState === "gameover" && (
            <div className="absolute inset-0 z-10 bg-black/80 flex flex-col justify-center items-center backdrop-blur-sm">
              <div className="text-brand-red font-black text-4xl mb-2">
                SYSTEM CRASHED
              </div>
              <div className="text-white text-xl mb-6">
                HACK DISTANCE: {score}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startGame();
                }}
                className="bg-white text-black font-black px-6 py-3 uppercase hover:bg-fuchsia-600 hover:text-white transition-all flex items-center gap-2"
              >
                <RefreshCcw className="w-5 h-5" /> RESTART RUN
              </button>
            </div>
          )}
        </div>

        <p className="mt-6 text-neutral-500 uppercase tracking-widest text-[10px]">
          Tap/Click Canvas or Press SPACE / UP ARROW to Jump. Avoid Red
          Redactions.
        </p>
      </div>
    </section>
  );
}
