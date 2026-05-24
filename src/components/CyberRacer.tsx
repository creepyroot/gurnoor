import React, { useRef, useState, useEffect } from "react";
import {
  Maximize2,
  Minimize2,
  Play,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import FullscreenBtn from "./FullscreenBtn";
import { soundEngine } from "../utils/audio";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const LANES = [-250, -150, -50, 50, 150, 250]; // 6 Lanes in 3D units
const MAX_DEPTH = 3000;

export default function CyberRacer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [gameState, setGameState] = useState<"start" | "playing" | "gameover">(
    "start",
  );
  const [difficulty, setDifficulty] = useState<"easy" | "normal" | "hard">(
    "normal",
  );
  const [currentScore, setCurrentScore] = useState(0);

  const state = useRef({
    laneIndex: 2, // 0 to 5
    playerX: -50,
    speed: 25,
    score: 0,
    obstacles: [] as { laneIndex: number; z: number; type: string }[],
    lastObstacleTime: 0,
    time: 0,
  });

  const startGame = (selectedDifficulty?: "easy" | "normal" | "hard") => {
    const diff = selectedDifficulty || difficulty;
    setDifficulty(diff);
    soundEngine.success();

    let initialSpeed = 25;
    if (diff === "easy") initialSpeed = 15;
    if (diff === "hard") initialSpeed = 40;

    state.current = {
      laneIndex: 2,
      playerX: LANES[2],
      speed: initialSpeed,
      score: 0,
      obstacles: [],
      lastObstacleTime: performance.now(),
      time: 0,
    };
    setCurrentScore(0);
    setGameState("playing");
  };

  const changeLane = (direction: number) => {
    const newLane = state.current.laneIndex + direction;
    if (newLane >= 0 && newLane < LANES.length) {
      state.current.laneIndex = newLane;
      soundEngine.playTone(300 + newLane * 50, "square", 0.1, 0.2);
    }
  };

  const setLaneByFraction = (fraction: number) => {
    const targetLane = Math.max(
      0,
      Math.min(LANES.length - 1, Math.floor(fraction * LANES.length)),
    );
    if (targetLane !== state.current.laneIndex) {
      state.current.laneIndex = targetLane;
      soundEngine.playTone(300 + targetLane * 50, "square", 0.1, 0.2);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (gameState !== "playing") return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    setLaneByFraction((e.clientX - rect.left) / rect.width);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (gameState !== "playing") return;
    if (e.buttons === 0 && e.pointerType !== "touch") return; // Must hold click or use touch
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    setLaneByFraction((e.clientX - rect.left) / rect.width);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {}
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;
      if (e.key === "ArrowLeft" || e.key === "a") {
        e.preventDefault();
        changeLane(-1);
      }
      if (e.key === "ArrowRight" || e.key === "d") {
        e.preventDefault();
        changeLane(1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (e) {
      console.warn("Fullscreen toggle failed", e);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () =>
      setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Engine Loop
  useEffect(() => {
    if (gameState !== "playing") return;
    let animationId: number;
    let lastRenderTime = performance.now();
    let lastReportedScore = 0;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const loop = (sysTime: number) => {
      // Throttle massive frame spikes if tab paused
      const dt = Math.min(sysTime - lastRenderTime, 50);
      lastRenderTime = sysTime;
      const timeScale = dt / 16.66; // Normalize to 60fps

      const s = state.current;
      s.time += dt;

      // Player Movement Interpolation (Smooth Steering)
      const targetX = LANES[s.laneIndex];
      s.playerX += (targetX - s.playerX) * (0.15 * timeScale);

      // Speed Ramp
      s.speed += 0.003 * timeScale;

      // Spawn Obstacles (throttle based on speed)
      const spawnRate =
        difficulty === "easy" ? 15000 : difficulty === "hard" ? 7000 : 10000;
      if (sysTime - s.lastObstacleTime > spawnRate / s.speed) {
        const lane = Math.floor(Math.random() * LANES.length);
        s.obstacles.push({ laneIndex: lane, z: MAX_DEPTH, type: "red" });

        // Block clusters logic
        if (Math.random() > 0.4) {
          let l2;
          do {
            l2 = Math.floor(Math.random() * LANES.length);
          } while (l2 === lane);
          s.obstacles.push({ laneIndex: l2, z: MAX_DEPTH, type: "red" });

          if (Math.random() > 0.6) {
            let l3;
            do {
              l3 = Math.floor(Math.random() * LANES.length);
            } while (l3 === lane || l3 === l2);
            s.obstacles.push({ laneIndex: l3, z: MAX_DEPTH, type: "red" });
          }
        }

        s.lastObstacleTime = sysTime;
      }

      // Move & Filter Obstacles
      for (let i = s.obstacles.length - 1; i >= 0; i--) {
        const obs = s.obstacles[i];
        obs.z -= s.speed * timeScale;

        // Collision Check
        const obsX = LANES[obs.laneIndex];
        if (obs.z < 110 && obs.z > -20) {
          if (Math.abs(obsX - s.playerX) < 60) {
            soundEngine.explosion();
            setGameState("gameover");
            return; // Kill frame immediately
          }
        }

        if (obs.z < -200) {
          s.obstacles.splice(i, 1);
          s.score += 10;
        }
      }

      // Sync Score UI (throttled)
      if (s.score !== lastReportedScore && Math.floor(s.time) % 5 === 0) {
        setCurrentScore(s.score);
        lastReportedScore = s.score;
      }

      // --- RENDERING PIPELINE ---

      // Background
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      const time = s.time;
      const getCurve = (z: number) =>
        Math.sin(time * 0.002 + z * 0.002) * (z * 0.2);

      const CamX = s.playerX * 0.3; // Camera softly follows player
      const CamY = 180;
      const CamZ = -250;
      const FOV = 450;

      const project = (x: number, y: number, z: number) => {
        let dz = z - CamZ;
        if (dz < 1) dz = 1;
        let scale = FOV / dz;
        return {
          px: CANVAS_WIDTH / 2 + (x - CamX) * scale,
          // Fixed inverted Y: Y goes UP in 3D, so we SUBTRACT (y - CamY)
          py: CANVAS_HEIGHT / 2 - (y - CamY) * scale,
          scale,
        };
      };

      // Draw Horizon Sun
      const horizon = project(0, 0, MAX_DEPTH * 10);
      ctx.save();
      ctx.beginPath();
      ctx.arc(CANVAS_WIDTH / 2, horizon.py, 120, 0, Math.PI, true);
      const sunGradient = ctx.createLinearGradient(
        0,
        horizon.py - 120,
        0,
        horizon.py,
      );
      sunGradient.addColorStop(0, "#FF007F");
      sunGradient.addColorStop(1, "#FFD700");
      ctx.fillStyle = sunGradient;
      ctx.fill();

      // Sun Cutouts
      ctx.fillStyle = "#050505";
      for (let i = 0; i < 5; i++) {
        ctx.fillRect(
          CANVAS_WIDTH / 2 - 130,
          horizon.py - 10 - i * 18,
          260,
          4 + i * 2,
        );
      }
      ctx.restore();

      // Road Grid System
      ctx.strokeStyle = "rgba(0, 255, 255, 0.4)";
      ctx.lineWidth = 1;

      // Moving Horizontal Lines
      const offsetZ = (time * s.speed * 0.05) % 200;
      for (let z = MAX_DEPTH; z > 0; z -= 200) {
        const dz = z - offsetZ;
        if (dz > 0) {
          const c = getCurve(dz);
          const pl = project(-350 + c, 0, dz);
          const pr = project(350 + c, 0, dz);
          ctx.beginPath();
          ctx.moveTo(pl.px, pl.py);
          ctx.lineTo(pr.px, pr.py);
          ctx.stroke();
        }
      }

      // Vertical Lane lines (drawn between the lanes)
      [-300, -200, -100, 0, 100, 200, 300].forEach((lx) => {
        ctx.beginPath();
        for (let z = 0; z <= MAX_DEPTH; z += 100) {
          const p = project(lx + getCurve(z), 0, z);
          if (z === 0) ctx.moveTo(p.px, p.py);
          else ctx.lineTo(p.px, p.py);
        }
        ctx.stroke();
      });

      // Polygon Helper
      const drawPoly = (
        points: any[],
        faceColor: string,
        edgeColor: string,
        isSolid: boolean = true,
      ) => {
        ctx.fillStyle = faceColor;
        ctx.strokeStyle = edgeColor;
        ctx.beginPath();
        points.forEach((p, i) => {
          if (i === 0) ctx.moveTo(p.px, p.py);
          else ctx.lineTo(p.px, p.py);
        });
        ctx.closePath();
        if (isSolid) ctx.fill();
        ctx.stroke();
      };

      // 3D Box Renderer - Smart painters algorithm (Draws Far face first, Near Face last)
      const drawBox = (
        cx: number,
        cy: number,
        cz: number,
        w: number,
        h: number,
        d: number,
        faceColor: string,
        edgeColor: string,
        glow: boolean = false,
      ) => {
        const cNear = getCurve(cz - d / 2);
        const cFar = getCurve(cz + d / 2);

        // Near (Closer to camera) Face
        const nbl = project(cx - w / 2 + cNear, cy, cz - d / 2);
        const nbr = project(cx + w / 2 + cNear, cy, cz - d / 2);
        const ntl = project(cx - w / 2 + cNear, cy + h, cz - d / 2); // +h since we fixed projection
        const ntr = project(cx + w / 2 + cNear, cy + h, cz - d / 2);

        // Far (Deeper away) Face
        const fbl = project(cx - w / 2 + cFar, cy, cz + d / 2);
        const fbr = project(cx + w / 2 + cFar, cy, cz + d / 2);
        const ftl = project(cx - w / 2 + cFar, cy + h, cz + d / 2);
        const ftr = project(cx + w / 2 + cFar, cy + h, cz + d / 2);

        ctx.shadowColor = edgeColor;
        ctx.shadowBlur = glow ? 15 : 0;
        ctx.lineWidth = glow ? 2 : 1;

        // Draw Far Face
        drawPoly([fbl, fbr, ftr, ftl], faceColor, edgeColor);

        // Connecting Edges
        ctx.beginPath();
        ctx.moveTo(nbl.px, nbl.py);
        ctx.lineTo(fbl.px, fbl.py);
        ctx.moveTo(nbr.px, nbr.py);
        ctx.lineTo(fbr.px, fbr.py);
        ctx.moveTo(ntl.px, ntl.py);
        ctx.lineTo(ftl.px, ftl.py);
        ctx.moveTo(ntr.px, ntr.py);
        ctx.lineTo(ftr.px, ftr.py);
        ctx.stroke();

        // Draw Near Face
        drawPoly([nbl, nbr, ntr, ntl], faceColor, edgeColor);
        ctx.shadowBlur = 0; // Reset
      };

      const drawPagani = (cx: number, cy: number, cz: number) => {
        // Spliter / Front Bumper (Carbon)
        drawBox(
          cx,
          cy,
          cz + 50,
          70,
          4,
          30,
          "rgba(5,5,5,0.9)",
          "#00FFFF",
          false,
        );
        // Main Body Chassis (Low profile)
        drawBox(
          cx,
          cy + 4,
          cz,
          76,
          12,
          110,
          "rgba(10,10,10,0.9)",
          "#00FFFF",
          false,
        );
        // Wide Fenders (Left & Right)
        drawBox(
          cx - 36,
          cy,
          cz,
          16,
          20,
          115,
          "rgba(5,5,5,0.9)",
          "#00FFFF",
          false,
        );
        drawBox(
          cx + 36,
          cy,
          cz,
          16,
          20,
          115,
          "rgba(5,5,5,0.9)",
          "#00FFFF",
          false,
        );
        // Teardrop Glass Cabin (Tapered)
        drawBox(
          cx,
          cy + 16,
          cz + 10,
          36,
          14,
          45,
          "rgba(0,180,255,0.2)",
          "#FFF",
          true,
        );
        // Rear Deck Cover / Engine bay
        drawBox(
          cx,
          cy + 16,
          cz - 35,
          30,
          10,
          40,
          "rgba(5,5,5,0.9)",
          "#00FFFF",
          false,
        );
        // Signature Rear Spoiler (Huayra/Zonda style)
        drawBox(
          cx,
          cy + 34,
          cz - 55,
          90,
          3,
          20,
          "rgba(15,15,15,0.9)",
          "#FF00FF",
          true,
        );
        // Spoiler Struts
        drawBox(
          cx - 15,
          cy + 16,
          cz - 50,
          4,
          18,
          12,
          "rgba(5,5,5,0.9)",
          "#FF00FF",
          false,
        );
        drawBox(
          cx + 15,
          cy + 16,
          cz - 50,
          4,
          18,
          12,
          "rgba(5,5,5,0.9)",
          "#FF00FF",
          false,
        );
        // Central Quad Exhaust Unit (Glowing box)
        drawBox(cx, cy + 10, cz - 65, 14, 14, 6, "#000", "#FFD700", true);
      };

      // Z-Sort Obstacles - Draw furthest first
      const sortedObs = [...s.obstacles].sort((a, b) => b.z - a.z);

      // Render Obstacles in front of player
      const frontObs = sortedObs.filter((o) => o.z > 50);
      frontObs.forEach((obs) => {
        drawBox(
          LANES[obs.laneIndex],
          0,
          obs.z,
          65,
          45,
          60,
          "rgba(255,0,0,0.8)",
          "#FF3333",
          true,
        );
      });

      // Render the Pagani hypercar at z=50
      drawPagani(s.playerX, 0, 50);

      // Render Obstacles behind the player
      const backObs = sortedObs.filter((o) => o.z <= 50);
      backObs.forEach((obs) => {
        drawBox(
          LANES[obs.laneIndex],
          0,
          obs.z,
          65,
          45,
          60,
          "rgba(255,0,0,0.8)",
          "#FF3333",
          true,
        );
      });

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, [gameState]);

  return (
    <section
      ref={containerRef}
      className="relative py-20 bg-black font-mono text-white flex flex-col items-center justify-center border-t border-neutral-900 border-b-4 border-cyan-500"
    >
      <FullscreenBtn targetRef={containerRef} />
      <div className="w-full max-w-5xl px-4 flex flex-col items-center">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-cyan-500 text-xs font-black tracking-widest mb-2 border border-cyan-500/30 px-3 py-1 rounded bg-cyan-500/10">
            <ShieldAlert className="w-3.5 h-3.5" /> SYNTHWAVE INTERCEPTOR
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-2">
            Cyber <span className="text-cyan-500">Racer</span>
          </h2>
          <p className="text-[10px] md:text-sm text-neutral-400 max-w-xl mx-auto uppercase">
            Outrun the firewall. Avoid malignant packets blocking the
            transmission channels. Drag or tap across the screen to smooth
            steer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full">
          {/* Dashboard Left */}
          <div className="md:col-span-3 bg-zinc-950 border-2 border-neutral-800 rounded p-6 flex flex-col justify-center">
            <h3 className="text-neutral-500 uppercase font-black tracking-widest text-[10px] mb-4">
              Transmission Stats
            </h3>
            <div className="bg-black border border-neutral-800 p-4 rounded mb-6 text-center">
              <span className="block text-neutral-500 text-[10px] uppercase font-bold mb-1">
                Score
              </span>
              <span className="text-4xl font-black text-cyan-500">
                {currentScore}
              </span>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex justify-between text-xs text-neutral-400 border-b border-neutral-800 pb-2">
                <span>DIFFICULTY:</span>
                <span className="text-white uppercase">{difficulty}</span>
              </div>
              <div className="flex justify-between text-xs text-neutral-400 border-b border-neutral-800 pb-2">
                <span>SPEED HZ:</span>
                <span className="text-white">
                  {state.current.speed.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-neutral-400 border-b border-neutral-800 pb-2">
                <span>STATUS:</span>
                <span
                  className={
                    gameState === "gameover"
                      ? "text-brand-red"
                      : gameState === "playing"
                        ? "text-cyan-500"
                        : "text-neutral-500"
                  }
                >
                  {gameState === "gameover"
                    ? "CRASHED"
                    : gameState === "playing"
                      ? "ONLINE"
                      : "IDLE"}
                </span>
              </div>
            </div>

            <p className="text-center text-[10px] uppercase text-neutral-600 mt-4 leading-relaxed hidden sm:block">
              Use Keyboard Arrows (A/D) or Touch/Drag anywhere on the game
              display to steer smoothly across the 6-lane hyperway.
            </p>
          </div>

          <div
            ref={containerRef}
            className={`md:col-span-9 w-full bg-black border-4 border-neutral-800 rounded relative overflow-hidden shadow-[0_0_50px_rgba(0,255,255,0.05)] ${isFullscreen ? "h-screen w-screen max-w-none border-none rounded-none flex items-center justify-center fixed inset-0 z-50 bg-black" : "aspect-[4/3] max-h-[600px] mx-auto"}`}
          >
            {/* Overlay */}
            {gameState !== "playing" && (
              <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
                {gameState === "gameover" && (
                  <div className="mb-6 animate-pulse">
                    <h3 className="text-brand-red font-black text-4xl uppercase tracking-[0.2em] mb-2">
                      SYSTEM CRASH
                    </h3>
                    <p className="text-cyan-500 font-bold text-xl uppercase tracking-widest">
                      Final Score: {currentScore}
                    </p>
                  </div>
                )}

                {(gameState === "start" || gameState === "gameover") && (
                  <div className="mb-8 flex gap-4">
                    <button
                      onClick={() => setDifficulty("easy")}
                      className={`px-4 py-2 border rounded text-xs font-bold uppercase tracking-widest transition-colors ${difficulty === "easy" ? "bg-cyan-500 text-black border-cyan-500" : "bg-transparent text-neutral-400 border-neutral-700 hover:border-cyan-500 hover:text-cyan-500"}`}
                    >
                      Easy
                    </button>
                    <button
                      onClick={() => setDifficulty("normal")}
                      className={`px-4 py-2 border rounded text-xs font-bold uppercase tracking-widest transition-colors ${difficulty === "normal" ? "bg-cyan-500 text-black border-cyan-500" : "bg-transparent text-neutral-400 border-neutral-700 hover:border-cyan-500 hover:text-cyan-500"}`}
                    >
                      Normal
                    </button>
                    <button
                      onClick={() => setDifficulty("hard")}
                      className={`px-4 py-2 border rounded text-xs font-bold uppercase tracking-widest transition-colors ${difficulty === "hard" ? "bg-brand-red text-black border-brand-red" : "bg-transparent text-neutral-400 border-neutral-700 hover:border-brand-red hover:text-brand-red"}`}
                    >
                      Hard
                    </button>
                  </div>
                )}

                <button
                  onClick={() => startGame()}
                  className="bg-cyan-500 text-black px-8 py-4 font-black uppercase tracking-widest hover:bg-white transition-all rounded shadow-[0_0_20px_#00FFFF] flex items-center gap-3 cursor-pointer"
                >
                  {gameState === "gameover" ? (
                    <RotateCcw className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                  {gameState === "gameover" ? "Reboot Engine" : "Ignite Engine"}
                </button>
              </div>
            )}

            {/* GUI Controls */}
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-neutral-800 border border-neutral-700 p-2 rounded text-neutral-400 hover:text-white transition-all backdrop-blur"
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </button>

            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className="w-full h-auto object-contain touch-none cursor-crosshair relative z-30"
              style={{ touchAction: "none" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
