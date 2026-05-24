import React, { useRef, useState, useEffect } from "react";
import { ServerCrash, RefreshCcw, Hand } from "lucide-react";
import FullscreenBtn from "./FullscreenBtn";
import { playSound } from "../utils/audio";

const CANVAS_W = 600;
const CANVAS_H = 400;

export default function DataBreaker() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<
    "idle" | "playing" | "gameover" | "win"
  >("idle");
  const [score, setScore] = useState(0);

  const ball = useRef({ x: 300, y: 350, dx: 4, dy: -4, radius: 6 });
  const paddle = useRef({ x: 250, w: 100, h: 10, speed: 8 });
  const bricks = useRef<
    { x: number; y: number; w: number; h: number; status: number }[]
  >([]);
  const frameRef = useRef(0);
  const [keys, setKeys] = useState<{ [key: string]: boolean }>({});

  const initBricks = () => {
    let newBricks = [];
    const r = 5;
    const c = 8;
    for (let i = 0; i < c; i++) {
      for (let j = 0; j < r; j++) {
        newBricks.push({
          x: i * (CANVAS_W / c) + 10,
          y: j * 30 + 30,
          w: CANVAS_W / c - 20,
          h: 20,
          status: 1,
        });
      }
    }
    bricks.current = newBricks;
  };

  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => {
      if (
        e.code === "ArrowLeft" ||
        e.code === "ArrowRight" ||
        e.code === "KeyA" ||
        e.code === "KeyD"
      ) {
        if (gameState === "playing") e.preventDefault();
      }
      setKeys((k) => ({ ...k, [e.code]: true }));
    };
    const handleUp = (e: KeyboardEvent) =>
      setKeys((k) => ({ ...k, [e.code]: false }));
    window.addEventListener("keydown", handleDown, { passive: false });
    window.addEventListener("keyup", handleUp);
    return () => {
      window.removeEventListener("keydown", handleDown);
      window.removeEventListener("keyup", handleUp);
    };
  }, [gameState]);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (gameState !== "playing") return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const scaleX = CANVAS_W / rect.width;
    const canvasX = (e.clientX - rect.left) * scaleX;
    let targetX = canvasX - paddle.current.w / 2;

    if (targetX < 0) targetX = 0;
    if (targetX + paddle.current.w > CANVAS_W)
      targetX = CANVAS_W - paddle.current.w;
    paddle.current.x = targetX;
  };

  const draw = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "rgba(0,0,0,0.5)"; // trail
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Paddle
    ctx.fillStyle = "#FFD700";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#FFD700";
    ctx.fillRect(
      paddle.current.x,
      CANVAS_H - paddle.current.h - 10,
      paddle.current.w,
      paddle.current.h,
    );

    // Ball
    ctx.fillStyle = "#FFF";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#FFF";
    ctx.beginPath();
    ctx.arc(
      ball.current.x,
      ball.current.y,
      ball.current.radius,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.closePath();

    // Bricks
    ctx.shadowBlur = 5;
    bricks.current.forEach((b) => {
      if (b.status === 1) {
        ctx.fillStyle =
          b.y < 60 ? "#FF0000" : b.y < 100 ? "#FF00FF" : "#00FFFF";
        ctx.shadowColor = ctx.fillStyle;
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.strokeStyle = "#222";
        ctx.strokeRect(b.x, b.y, b.w, b.h);
      }
    });
    ctx.shadowBlur = 0;
  };

  const update = () => {
    if (gameState !== "playing") return;

    // Move paddle
    if ((keys["ArrowLeft"] || keys["KeyA"]) && paddle.current.x > 0) {
      paddle.current.x -= paddle.current.speed;
    }
    if (
      (keys["ArrowRight"] || keys["KeyD"]) &&
      paddle.current.x + paddle.current.w < CANVAS_W
    ) {
      paddle.current.x += paddle.current.speed;
    }

    // Move ball
    ball.current.x += ball.current.dx;
    ball.current.y += ball.current.dy;

    // Wall bounce
    if (
      ball.current.x - ball.current.radius < 0 ||
      ball.current.x + ball.current.radius > CANVAS_W
    ) {
      ball.current.dx *= -1;
    }
    if (ball.current.y - ball.current.radius < 0) {
      ball.current.dy *= -1;
    }

    // Paddle bounce
    if (
      ball.current.y + ball.current.radius > CANVAS_H - paddle.current.h - 10 &&
      ball.current.x > paddle.current.x &&
      ball.current.x < paddle.current.x + paddle.current.w
    ) {
      ball.current.dy *= -1.05; // speed up slightly!
      playSound("beep");
      // angle change based on hit pos
      const hitPos =
        (ball.current.x - (paddle.current.x + paddle.current.w / 2)) /
        (paddle.current.w / 2);
      ball.current.dx = hitPos * 5;
      ball.current.y = CANVAS_H - paddle.current.h - 10 - ball.current.radius;
    }

    // Bottom loss
    if (ball.current.y + ball.current.radius > CANVAS_H) {
      setGameState("gameover");
      playSound("lose");
    }

    // Bricks collision
    let activeBricks = 0;
    bricks.current.forEach((b) => {
      if (b.status === 1) {
        activeBricks++;
        if (
          ball.current.x > b.x &&
          ball.current.x < b.x + b.w &&
          ball.current.y - ball.current.radius < b.y + b.h &&
          ball.current.y + ball.current.radius > b.y
        ) {
          b.status = 0;
          ball.current.dy *= -1;
          setScore((s) => s + 10);
          playSound("hit");
        }
      }
    });

    if (activeBricks === 0 && bricks.current.length > 0) {
      setGameState("win");
      playSound("win");
    }
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

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    initBricks();
    ball.current = { x: CANVAS_W / 2, y: 300, dx: 4, dy: -4, radius: 6 };
    paddle.current = { x: CANVAS_W / 2 - 50, w: 100, h: 10, speed: 8 };
    playSound("beep");
  };

  return (
    <section
      ref={containerRef}
      className="relative py-20 bg-neutral-950 font-mono text-white flex flex-col items-center border-t-4 border-[#00FFFF] overflow-hidden min-h-[600px]"
    >
      <FullscreenBtn targetRef={containerRef} />

      <div className="w-full max-w-3xl px-4 flex flex-col items-center relative z-10">
        <div className="inline-flex items-center gap-2 text-cyan-400 font-black tracking-widest text-xs border border-cyan-400/30 px-3 py-1 bg-cyan-400/10 mb-6">
          <ServerCrash className="w-4 h-4 animate-pulse" />
          DATA BLOCK BREAKER
        </div>

        <div className="flex w-full justify-between items-center mb-4 max-w-[600px]">
          <div className="text-xl font-black text-white">
            SCORE:{" "}
            <span className="text-brand-yellow drop-shadow-[2px_2px_0px_red]">
              {score}
            </span>
          </div>
        </div>

        <div className="relative border-4 border-neutral-800 bg-black p-2 shadow-[0_0_30px_rgba(0,255,255,0.1)] rounded w-full max-w-[600px] flex justify-center touch-none">
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            onPointerMove={handlePointerMove}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              handlePointerMove(e);
            }}
            onPointerUp={(e) => {
              try {
                e.currentTarget.releasePointerCapture(e.pointerId);
              } catch (err) {}
            }}
            className="w-full h-auto bg-black border border-neutral-900 touch-none object-contain"
          />

          {gameState === "idle" && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
              <button
                onClick={startGame}
                className="bg-cyan-500 text-black px-6 py-3 font-black uppercase text-xl hover:bg-white hover:shadow-[0_0_20px_cyan] transition-all"
              >
                COMPILE BREAKER
              </button>
            </div>
          )}

          {gameState === "gameover" && (
            <div className="absolute inset-0 bg-red-950/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
              <div className="text-4xl text-brand-red font-black mb-4 drop-shadow-[5px_5px_0px_black] uppercase">
                CONNECTION LOST
              </div>
              <button
                onClick={startGame}
                className="bg-white text-black px-6 py-3 font-black uppercase flex items-center justify-center gap-2 hover:bg-brand-red hover:text-white transition-all shadow-[8px_8px_0px_black]"
              >
                <RefreshCcw className="w-5 h-5" /> RETRY
              </button>
            </div>
          )}

          {gameState === "win" && (
            <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
              <div className="text-4xl text-emerald-400 font-black mb-4 drop-shadow-[5px_5px_0px_black] uppercase animate-bounce">
                SERVER BREACHED
              </div>
              <button
                onClick={startGame}
                className="bg-emerald-400 text-black px-6 py-3 font-black uppercase flex items-center justify-center gap-2 hover:bg-white transition-all shadow-[8px_8px_0px_black]"
              >
                <RefreshCcw className="w-5 h-5" /> PLAY AGAIN
              </button>
            </div>
          )}
        </div>

        <p className="mt-4 text-[10px] text-neutral-500 tracking-widest uppercase">
          Use Arrow Keys / A D to move the extraction pad.
        </p>
      </div>
    </section>
  );
}
