import React, { useRef, useState, useEffect } from "react";
import { Maximize2, Minimize2, Play, RotateCcw, Crosshair } from "lucide-react";
import { soundEngine } from "../utils/audio";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

export default function NeonDefender() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [gameState, setGameState] = useState<"start" | "playing" | "gameover">(
    "start",
  );
  const [currentScore, setCurrentScore] = useState(0);

  const state = useRef({
    player: {
      x: CANVAS_WIDTH / 2 - 20,
      y: CANVAS_HEIGHT - 60,
      w: 40,
      h: 20,
      speed: 7,
    },
    bullets: [] as any[],
    enemies: [] as any[],
    particles: [] as any[],
    score: 0,
    lastShot: 0,
    lastEnemySpawn: 0,
    difficultyMultiplier: 1,
  });

  // Handle pointer tracking for ship movement
  const handlePointerMove = (e: React.PointerEvent) => {
    if (gameState !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const x = (e.clientX - rect.left) * scaleX;

    // Clamp to boundaries
    state.current.player.x = Math.max(
      0,
      Math.min(
        CANVAS_WIDTH - state.current.player.w,
        x - state.current.player.w / 2,
      ),
    );
  };

  const startGame = () => {
    state.current = {
      player: {
        x: CANVAS_WIDTH / 2 - 20,
        y: CANVAS_HEIGHT - 60,
        w: 40,
        h: 20,
        speed: 7,
      },
      bullets: [],
      enemies: [],
      particles: [],
      score: 0,
      lastShot: performance.now(),
      lastEnemySpawn: performance.now(),
      difficultyMultiplier: 1,
    };
    setCurrentScore(0);
    setGameState("playing");
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else {
          alert(
            "Your browser/frame prevents fullscreen mode. Try opening in a new tab!",
          );
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (error) {
      console.warn("Fullscreen toggle failed:", error);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;
    let animationId: number;
    let lastRenderTime = performance.now();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const loop = (time: number) => {
      const dt = (time - lastRenderTime) / 1000;
      lastRenderTime = time;

      // Update Difficulty
      state.current.difficultyMultiplier =
        1 + Math.floor(state.current.score / 500) * 0.2;

      // Auto-Fire Mechanics
      if (time - state.current.lastShot > 200) {
        soundEngine.shoot();
        state.current.bullets.push({
          x: state.current.player.x + state.current.player.w / 2 - 2.5,
          y: state.current.player.y,
          w: 5,
          h: 15,
          speed: 10,
        });
        state.current.lastShot = time;
      }

      // Enemy Spawning Mechanics
      const spawnRate = Math.max(
        300,
        1000 - state.current.difficultyMultiplier * 100,
      ); // Gets faster
      if (time - state.current.lastEnemySpawn > spawnRate) {
        const size = Math.random() > 0.8 ? 40 : 25; // Sometimes large bruteforcers
        state.current.enemies.push({
          x: Math.random() * (CANVAS_WIDTH - size),
          y: -50,
          w: size,
          h: size,
          speed: (Math.random() * 2 + 2) * state.current.difficultyMultiplier,
          hp: size === 40 ? 3 : 1,
        });
        state.current.lastEnemySpawn = time;
      }

      // --- PHYSICS & COLLISIONS ---

      // Move Bullets
      for (let i = state.current.bullets.length - 1; i >= 0; i--) {
        const b = state.current.bullets[i];
        b.y -= b.speed;
        if (b.y < -20) state.current.bullets.splice(i, 1);
      }

      // Move Enemies & Check Collisions
      for (let i = state.current.enemies.length - 1; i >= 0; i--) {
        const e = state.current.enemies[i];
        e.y += e.speed;

        // Player Collision (Game Over)
        const p = state.current.player;
        if (
          p.x < e.x + e.w &&
          p.x + p.w > e.x &&
          p.y < e.y + e.h &&
          p.y + p.h > e.y
        ) {
          soundEngine.explosion();
          setGameState("gameover");
          return; // Stop processing loop
        }

        // Bullet Collisions
        for (let j = state.current.bullets.length - 1; j >= 0; j--) {
          const b = state.current.bullets[j];
          if (
            b.x < e.x + e.w &&
            b.x + b.w > e.x &&
            b.y < e.y + e.h &&
            b.y + b.h > e.y
          ) {
            // Hit!
            e.hp--;
            state.current.bullets.splice(j, 1);

            // Add Hit Particles
            for (let p = 0; p < 5; p++) {
              state.current.particles.push({
                x: b.x,
                y: b.y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 1,
                color: "#FFD700", // Hit sparking
              });
            }

            if (e.hp <= 0) {
              soundEngine.explosion();
              state.current.score += e.w === 40 ? 50 : 10;
              state.current.enemies.splice(i, 1);

              // Add Explosion Particles
              for (let p = 0; p < 15; p++) {
                state.current.particles.push({
                  x: e.x + e.w / 2,
                  y: e.y + e.h / 2,
                  vx: (Math.random() - 0.5) * 10,
                  vy: (Math.random() - 0.5) * 10,
                  life: 1,
                  color: "#FF3333", // Enemy explode color
                });
              }
              break; // Enemy destroyed, exit bullet check for this enemy
            }
          }
        }

        // Penalty for letting enemies pass
        if (e.y > CANVAS_HEIGHT) {
          state.current.score -= 20; // Subtract points!
          state.current.enemies.splice(i, 1);
        }
      }

      // Ensure score doesn't go below 0
      state.current.score = Math.max(0, state.current.score);

      // Move Particles
      for (let i = state.current.particles.length - 1; i >= 0; i--) {
        const p = state.current.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.03;
        if (p.life <= 0) state.current.particles.splice(i, 1);
      }

      // --- RENDERING ---

      // Draw dark background with trail effect (alpha composite)
      ctx.fillStyle = "rgba(10, 10, 10, 0.35)";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw Grid line aesthetics
      ctx.strokeStyle = "rgba(255, 51, 51, 0.05)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < CANVAS_WIDTH; i += 40) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, CANVAS_HEIGHT);
      }
      for (let i = 0; i < CANVAS_HEIGHT; i += 40) {
        ctx.moveTo(0, i);
        ctx.lineTo(CANVAS_WIDTH, i);
      }
      ctx.stroke();

      // Draw Player
      ctx.fillStyle = "#FFD700";
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#FFD700";
      ctx.fillRect(
        state.current.player.x,
        state.current.player.y,
        state.current.player.w,
        state.current.player.h,
      );

      // Draw Bullets
      ctx.fillStyle = "#00ffff";
      ctx.shadowColor = "#00ffff";
      state.current.bullets.forEach((b) => {
        ctx.fillRect(b.x, b.y, b.w, b.h);
      });

      // Draw Enemies
      ctx.fillStyle = "#FF3333";
      ctx.shadowColor = "#FF3333";
      state.current.enemies.forEach((e) => {
        ctx.fillRect(e.x, e.y, e.w, e.h);
        // Inner core
        ctx.fillStyle = "#000";
        ctx.shadowBlur = 0;
        ctx.fillRect(e.x + 4, e.y + 4, e.w - 8, e.h - 8);
        ctx.fillStyle = "#FF3333";
        ctx.shadowBlur = 15;
      });

      // Draw Particles
      ctx.shadowBlur = 5;
      state.current.particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.globalAlpha = p.life;
        ctx.fillRect(p.x, p.y, 3, 3);
      });
      ctx.globalAlpha = 1.0;

      // Draw HUD (Performance-friendly rendering in-canvas)
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#fff";
      ctx.font = "bold 20px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`SCORE: ${state.current.score}`, 20, 35);
      ctx.fillStyle = "#FF3333";
      ctx.fillText(
        `THREAT LVL: ${state.current.difficultyMultiplier.toFixed(1)}x`,
        20,
        65,
      );

      if (time % 10 === 0) {
        setCurrentScore(state.current.score);
      }

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, [gameState]);

  return (
    <section className="py-20 bg-neutral-950 font-mono text-white flex flex-col items-center justify-center">
      <div className="w-full max-w-5xl px-4 flex flex-col items-center">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-brand-yellow text-xs font-black tracking-widest mb-2 border border-brand-yellow/30 px-3 py-1 rounded bg-brand-yellow/10">
            <Crosshair className="w-3.5 h-3.5 animate-pulse" /> INTRUSION
            COUNTERMEASURE
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">
            Neon <span className="text-brand-yellow">Defender</span>
          </h2>
          <p className="text-neutral-400 mt-2 uppercase text-xs">
            Sweep falling malicious nodes before they corrupt your grid.
          </p>
        </div>

        <div
          ref={containerRef}
          className={`w-full max-w-[800px] border-4 border-neutral-800 rounded relative overflow-hidden bg-black shadow-[0_0_50px_rgba(255,215,0,0.05)] ${isFullscreen ? "h-screen max-w-none border-none rounded-none flex items-center justify-center" : "aspect-[4/3]"}`}
        >
          {/* Action Overlay */}
          {gameState !== "playing" && (
            <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
              {gameState === "gameover" && (
                <div className="mb-6 animate-pulse">
                  <h3 className="text-brand-red font-black text-4xl uppercase tracking-[0.2em] mb-2">
                    System Failure
                  </h3>
                  <p className="text-brand-yellow font-bold text-xl uppercase tracking-widest">
                    Final Score: {currentScore}
                  </p>
                </div>
              )}

              <button
                onClick={startGame}
                className="bg-brand-yellow text-black px-8 py-4 font-black uppercase tracking-widest hover:bg-white transition-all rounded shadow-[0_0_20px_#FFD700] flex items-center gap-3"
              >
                {gameState === "gameover" ? (
                  <RotateCcw className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
                {gameState === "gameover"
                  ? "Reboot System"
                  : "Initialize Defense"}
              </button>
            </div>
          )}

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 z-30 bg-black/50 hover:bg-neutral-800 border border-neutral-700 p-2 rounded text-neutral-400 hover:text-white transition-all backdrop-blur"
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5" />
            ) : (
              <Maximize2 className="w-5 h-5" />
            )}
          </button>

          {/* The Game Canvas */}
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onPointerMove={handlePointerMove}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              handlePointerMove(e);
            }}
            onPointerUp={(e) =>
              e.currentTarget.releasePointerCapture(e.pointerId)
            }
            className="w-full h-auto object-contain cursor-crosshair touch-none"
            style={{ touchAction: "none" }} // Prevents mobile scrolling when interacting
          />
        </div>
      </div>
    </section>
  );
}
