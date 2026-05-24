import React, { useRef, useState, useEffect } from "react";
import {
  Maximize2,
  Minimize2,
  Play,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Skull,
} from "lucide-react";
import FullscreenBtn from "./FullscreenBtn";
import { soundEngine } from "../utils/audio";

const GRID_SIZE = 25;
const CANVAS_SIZE = 600;
const CELL = CANVAS_SIZE / GRID_SIZE;

export default function CyberSnake() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [gameState, setGameState] = useState<"start" | "playing" | "gameover">(
    "start",
  );
  const [currentScore, setCurrentScore] = useState(0);

  const state = useRef({
    snake: [{ x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) }],
    dir: { x: 0, y: -1 },
    nextDir: { x: 0, y: -1 },
    food: { x: 5, y: 5 },
    score: 0,
  });

  const startGame = () => {
    state.current = {
      snake: [
        { x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) },
        { x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) + 1 },
      ],
      dir: { x: 0, y: -1 },
      nextDir: { x: 0, y: -1 },
      food: {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      },
      score: 0,
    };
    setCurrentScore(0);
    setGameState("playing");
  };

  const changeDir = (dx: number, dy: number) => {
    const { x, y } = state.current.dir;
    // Prevent 180 reverse suicide
    if (x === -dx && y === -dy && state.current.snake.length > 1) return;
    state.current.nextDir = { x: dx, y: dy };
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "w":
          e.preventDefault();
          changeDir(0, -1);
          break;
        case "ArrowDown":
        case "s":
          e.preventDefault();
          changeDir(0, 1);
          break;
        case "ArrowLeft":
        case "a":
          e.preventDefault();
          changeDir(-1, 0);
          break;
        case "ArrowRight":
        case "d":
          e.preventDefault();
          changeDir(1, 0);
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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

  // Main Game Loop Engine
  useEffect(() => {
    if (gameState !== "playing") return;
    let animationId: number;
    let lastTime = performance.now();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const loop = (time: number) => {
      const baseTickRate = 120; // Default ms per frame
      const speedRamp = Math.min(60, state.current.score * 1.5); // Caps out so it remains playable
      const tickRate = baseTickRate - speedRamp;

      if (time - lastTime > tickRate) {
        lastTime = time;

        state.current.dir = { ...state.current.nextDir };
        const head = { ...state.current.snake[0] };

        head.x += state.current.dir.x;
        head.y += state.current.dir.y;

        // Wall collisions
        if (
          head.x < 0 ||
          head.x >= GRID_SIZE ||
          head.y < 0 ||
          head.y >= GRID_SIZE
        ) {
          soundEngine.error();
          setGameState("gameover");
          return;
        }

        // Self collision
        if (
          state.current.snake.some(
            (segment) => segment.x === head.x && segment.y === head.y,
          )
        ) {
          soundEngine.error();
          setGameState("gameover");
          return;
        }

        state.current.snake.unshift(head);

        // Food eating logic (Data packet injection)
        if (
          head.x === state.current.food.x &&
          head.y === state.current.food.y
        ) {
          soundEngine.eat();
          state.current.score += 10;
          setCurrentScore(state.current.score);

          // Generate new food avoiding snake body
          let newFood;
          while (true) {
            newFood = {
              x: Math.floor(Math.random() * GRID_SIZE),
              y: Math.floor(Math.random() * GRID_SIZE),
            };
            if (
              !state.current.snake.some(
                (s) => s.x === newFood.x && s.y === newFood.y,
              )
            )
              break;
          }
          state.current.food = newFood;
        } else {
          // Normal move, pop tail
          state.current.snake.pop();
        }
      }

      // --- RENDER PASS --- //
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Draw Sub-Grid
      ctx.strokeStyle = "rgba(0, 255, 0, 0.05)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < CANVAS_SIZE; i += CELL) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, CANVAS_SIZE);
      }
      for (let i = 0; i < CANVAS_SIZE; i += CELL) {
        ctx.moveTo(0, i);
        ctx.lineTo(CANVAS_SIZE, i);
      }
      ctx.stroke();

      // Draw Food (Data payload)
      ctx.fillStyle = "#FF3333";
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#FF3333";
      ctx.fillRect(
        state.current.food.x * CELL + 2,
        state.current.food.y * CELL + 2,
        CELL - 4,
        CELL - 4,
      );

      // Draw Central inner dot for food
      ctx.fillStyle = "#FFF";
      ctx.shadowBlur = 0;
      ctx.fillRect(
        state.current.food.x * CELL + 8,
        state.current.food.y * CELL + 8,
        CELL - 16,
        CELL - 16,
      );

      // Draw Snake (Malware worm)
      state.current.snake.forEach((segment, i) => {
        const isHead = i === 0;
        ctx.fillStyle = isHead ? "#FFF" : "#00FF00";
        ctx.shadowBlur = isHead ? 20 : 10;
        ctx.shadowColor = "#00FF00";

        // Draw segment slightly smaller than cell for gap effect
        ctx.fillRect(
          segment.x * CELL + 1,
          segment.y * CELL + 1,
          CELL - 2,
          CELL - 2,
        );

        // Draw wireframe core
        if (!isHead) {
          ctx.fillStyle = "#002200";
          ctx.shadowBlur = 0;
          ctx.fillRect(
            segment.x * CELL + 6,
            segment.y * CELL + 6,
            CELL - 12,
            CELL - 12,
          );
        }
      });

      // Reset shadows
      ctx.shadowBlur = 0;

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, [gameState]);

  return (
    <section
      ref={containerRef}
      className="relative py-20 bg-black font-mono text-white flex flex-col items-center justify-center border-t-2 border-green-900 border-b border-neutral-900"
    >
      <FullscreenBtn targetRef={containerRef} />
      <div className="w-full max-w-5xl px-4 flex flex-col items-center">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-green-500 text-xs font-black tracking-widest mb-2 border border-green-500/30 px-3 py-1 rounded bg-green-500/10">
            <Skull className="w-3.5 h-3.5" /> GRID BREACH WORM PROTOCOL
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">
            Data <span className="text-green-500">Hunter</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full">
          {/* Information & Stats Panel (Left on Desktop) */}
          <div className="md:col-span-4 bg-zinc-950 border-2 border-neutral-800 rounded p-6 shadow-2xl flex flex-col justify-center">
            <h3 className="text-neutral-500 uppercase font-black tracking-widest text-[10px] mb-4">
              Operations Interface
            </h3>

            <div className="bg-black border border-neutral-800 p-4 rounded mb-6 text-center shadow-inner">
              <span className="block text-neutral-500 text-[10px] uppercase font-bold mb-1">
                Payload Extracted
              </span>
              <span className="text-4xl font-black text-green-500">
                {currentScore}
              </span>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex justify-between text-xs text-neutral-400 border-b border-neutral-800 pb-2">
                <span>SYSTEM STATUS:</span>
                <span
                  className={
                    gameState === "gameover"
                      ? "text-brand-red"
                      : gameState === "playing"
                        ? "text-green-500"
                        : "text-brand-yellow"
                  }
                >
                  {gameState === "gameover"
                    ? "CRITICAL FAILURE"
                    : gameState === "playing"
                      ? "ACTIVE BREACH"
                      : "STANDBY"}
                </span>
              </div>
              <div className="flex justify-between text-xs text-neutral-400 border-b border-neutral-800 pb-2">
                <span>LENGTH:</span>
                <span className="text-white">
                  {Math.floor(currentScore / 10) + 2} BLOCKS
                </span>
              </div>
            </div>

            {/* Mobile / Screen Controls */}
            <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto opacity-80 hover:opacity-100 transition-opacity">
              <div />
              <button
                onClick={() => changeDir(0, -1)}
                className="bg-neutral-800 hover:bg-green-500 hover:text-black p-4 rounded flex items-center justify-center transition-colors"
              >
                <ChevronUp className="w-6 h-6" />
              </button>
              <div />
              <button
                onClick={() => changeDir(-1, 0)}
                className="bg-neutral-800 hover:bg-green-500 hover:text-black p-4 rounded flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => changeDir(0, 1)}
                className="bg-neutral-800 hover:bg-green-500 hover:text-black p-4 rounded flex items-center justify-center transition-colors"
              >
                <ChevronDown className="w-6 h-6" />
              </button>
              <button
                onClick={() => changeDir(1, 0)}
                className="bg-neutral-800 hover:bg-green-500 hover:text-black p-4 rounded flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            <p className="text-center text-[10px] uppercase text-neutral-600 mt-4 leading-relaxed">
              Use Keyboard Arrows (WASD) or interface pads to direct the worm.
            </p>
          </div>

          <div
            ref={containerRef}
            className={`md:col-span-8 w-full border-4 border-neutral-800 rounded relative overflow-hidden bg-black shadow-[0_0_50px_rgba(0,255,0,0.05)] ${isFullscreen ? "h-screen w-screen max-w-none border-none rounded-none flex items-center justify-center fixed inset-0 z-50" : "aspect-square max-w-[600px] mx-auto"}`}
          >
            {/* Action Overlay */}
            {gameState !== "playing" && (
              <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
                {gameState === "gameover" && (
                  <div className="mb-6 animate-pulse">
                    <h3 className="text-brand-red font-black text-3xl uppercase tracking-[0.2em] mb-2">
                      CONNECTION TERMINATED
                    </h3>
                    <p className="text-green-500 font-bold text-lg uppercase tracking-widest">
                      Final Extraction: {currentScore}
                    </p>
                  </div>
                )}

                <button
                  onClick={startGame}
                  className="bg-green-500 text-black px-8 py-4 font-black uppercase tracking-widest hover:bg-white transition-all rounded shadow-[0_0_20px_#00FF00] flex items-center gap-3"
                >
                  {gameState === "gameover" ? (
                    <RotateCcw className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                  {gameState === "gameover"
                    ? "Restart Protocol"
                    : "Initialize Injection"}
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
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              className="w-full h-full object-contain touch-none"
              style={{ touchAction: "none" }} // Prevents mobile scrolling when interacting
            />
          </div>
        </div>
      </div>
    </section>
  );
}
