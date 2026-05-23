import React, { useState, useEffect, useRef } from "react";
import { Monitor, RefreshCcw, Activity } from "lucide-react";
import FullscreenBtn from "./FullscreenBtn";
import { playSound } from "../utils/audio";

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 10;
const PADDLE_SPEED = 10;
const BALL_SPEED_INIT = 5;

export default function NeonPong() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [score, setScore] = useState({ player: 0, ai: 0 });
  
  // Game state refs for animation loop
  const gameStateRef = useRef<"idle" | "playing" | "gameover">("idle");
  const scoreRef = useRef({ player: 0, ai: 0 });
  const p1Y = useRef((CANVAS_HEIGHT - PADDLE_HEIGHT) / 2);
  const p2Y = useRef((CANVAS_HEIGHT - PADDLE_HEIGHT) / 2);
  const ball = useRef({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, dx: BALL_SPEED_INIT, dy: BALL_SPEED_INIT });
  const upPressed = useRef(false);
  const downPressed = useRef(false);
  const animationRef = useRef<number>();

  // Synchronize refs with state changes
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStateRef.current !== "playing") return;
      if (e.key === "ArrowUp" || e.key === "w") { e.preventDefault(); upPressed.current = true; }
      if (e.key === "ArrowDown" || e.key === "s") { e.preventDefault(); downPressed.current = true; }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "w") upPressed.current = false;
      if (e.key === "ArrowDown" || e.key === "s") downPressed.current = false;
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (gameStateRef.current !== "playing") return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    // Convert client Y coordinate to vertical percentage inside canvas, then scale to CANVAS_HEIGHT
    const scaleY = CANVAS_HEIGHT / rect.height;
    const canvasY = (e.clientY - rect.top) * scaleY;
    let targetY = canvasY - PADDLE_HEIGHT / 2;

    if (targetY < 0) targetY = 0;
    if (targetY > CANVAS_HEIGHT - PADDLE_HEIGHT) targetY = CANVAS_HEIGHT - PADDLE_HEIGHT;
    p1Y.current = targetY;
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear and draw background
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)"; // Trail effect
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw center dashed line
    ctx.setLineDash([10, 15]);
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw Player 1 Paddle
    ctx.fillStyle = "#FF0055"; // neon pink/red
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#FF0055";
    ctx.fillRect(20, p1Y.current, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw AI Paddle
    ctx.fillStyle = "#00FFFF"; // neon cyan
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00FFFF";
    ctx.fillRect(CANVAS_WIDTH - 20 - PADDLE_WIDTH, p2Y.current, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw Ball
    ctx.fillStyle = "#FFF";
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#FFF";
    ctx.beginPath();
    ctx.arc(ball.current.x, ball.current.y, BALL_SIZE, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;
  };

  const update = () => {
    if (gameStateRef.current !== "playing") return;

    // Move player
    if (upPressed.current && p1Y.current > 0) p1Y.current -= PADDLE_SPEED;
    if (downPressed.current && p1Y.current < CANVAS_HEIGHT - PADDLE_HEIGHT) p1Y.current += PADDLE_SPEED;

    // Move AI (predictive & balanced challenge)
    const aiCenter = p2Y.current + PADDLE_HEIGHT / 2;
    // Only move if ball is moving towards AI OR return to center
    if (ball.current.dx > 0) {
      // Predict ball intersection
      let targetY = ball.current.y;
      // approximate prediction
      const timeToReach = (CANVAS_WIDTH - 20 - PADDLE_WIDTH - ball.current.x) / ball.current.dx;
      let predictedY = ball.current.y + ball.current.dy * timeToReach;
      
      // handle bounces in prediction
      while (predictedY < 0 || predictedY > CANVAS_HEIGHT) {
        if (predictedY < 0) predictedY = Math.abs(predictedY);
        if (predictedY > CANVAS_HEIGHT) predictedY = CANVAS_HEIGHT * 2 - predictedY;
      }
      
      targetY = predictedY;

      // Slower AI track speed to allow player to scores if angled well
      const aiSpeed = PADDLE_SPEED * 0.72;
      if (aiCenter < targetY - 10) p2Y.current += aiSpeed; 
      else if (aiCenter > targetY + 10) p2Y.current -= aiSpeed;
    } else {
      // return to center when ball is moving away
      if (aiCenter < CANVAS_HEIGHT / 2 - 10) p2Y.current += PADDLE_SPEED * 0.4;
      else if (aiCenter > CANVAS_HEIGHT / 2 + 10) p2Y.current -= PADDLE_SPEED * 0.4;
    }
    
    // clamp AI
    if (p2Y.current < 0) p2Y.current = 0;
    if (p2Y.current > CANVAS_HEIGHT - PADDLE_HEIGHT) p2Y.current = CANVAS_HEIGHT - PADDLE_HEIGHT;

    // Move ball
    ball.current.x += ball.current.dx;
    ball.current.y += ball.current.dy;

    // Wall collision (top/bot)
    if (ball.current.y - BALL_SIZE < 0) {
      ball.current.dy = Math.abs(ball.current.dy);
      ball.current.y = BALL_SIZE;
    } else if (ball.current.y + BALL_SIZE > CANVAS_HEIGHT) {
      ball.current.dy = -Math.abs(ball.current.dy);
      ball.current.y = CANVAS_HEIGHT - BALL_SIZE;
    }

    // Paddle collision
    // P1 (Left)
    if (
      ball.current.x - BALL_SIZE < 20 + PADDLE_WIDTH &&
      ball.current.x - BALL_SIZE > 20 &&
      ball.current.y > p1Y.current &&
      ball.current.y < p1Y.current + PADDLE_HEIGHT
    ) {
      // Force ball dx to be positive (moving right) and increase speed
      ball.current.dx = Math.abs(ball.current.dx) * 1.08;
      playSound('hit');
      const hitPoint = (ball.current.y - (p1Y.current + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
      ball.current.dy = hitPoint * BALL_SPEED_INIT * 1.5 + (Math.random() * 2 - 1); 
      ball.current.x = 20 + PADDLE_WIDTH + BALL_SIZE; // avoid getting stuck
    }
    
    // AI (Right)
    if (
      ball.current.x + BALL_SIZE > CANVAS_WIDTH - 20 - PADDLE_WIDTH &&
      ball.current.x + BALL_SIZE < CANVAS_WIDTH - 20 &&
      ball.current.y > p2Y.current &&
      ball.current.y < p2Y.current + PADDLE_HEIGHT
    ) {
      // Force ball dx to be negative (moving left) and increase speed
      ball.current.dx = -Math.abs(ball.current.dx) * 1.08;
      playSound('hit');
      const hitPoint = (ball.current.y - (p2Y.current + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
      ball.current.dy = hitPoint * Math.abs(ball.current.dx) * 0.8 + (Math.random() * 2 - 1);
      ball.current.x = CANVAS_WIDTH - 20 - PADDLE_WIDTH - BALL_SIZE;
    }

    // Scoring
    if (ball.current.x < 0) {
      scoreRef.current.ai += 1;
      setScore({ ...scoreRef.current });
      if (scoreRef.current.ai >= 5) {
        setGameState("gameover");
        playSound('lose');
      } else {
        playSound('explosion');
        resetBall(1);
      }
    } else if (ball.current.x > CANVAS_WIDTH) {
      scoreRef.current.player += 1;
      setScore({ ...scoreRef.current });
      if (scoreRef.current.player >= 5) {
        setGameState("gameover");
        playSound('win');
      } else {
        playSound('win');
        resetBall(-1);
      }
    }
  };

  const resetBall = (direction: number) => {
    ball.current = {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      dx: BALL_SPEED_INIT * direction,
      dy: (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED_INIT
    };
  };

  const gameLoop = () => {
    update();
    draw();
    if (gameStateRef.current === "playing") {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
  };

  useEffect(() => {
    if (gameState === "playing") {
      animationRef.current = requestAnimationFrame(gameLoop);
    } else {
      draw(); // Draw idle frame
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [gameState]); // Restart loop strictly on play

  const startGame = () => {
    scoreRef.current = { player: 0, ai: 0 };
    setScore({ player: 0, ai: 0 });
    p1Y.current = (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2;
    p2Y.current = (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2;
    resetBall((Math.random() > 0.5 ? 1 : -1));
    setGameState("playing");
  };

  return (
    <section ref={containerRef} className="relative py-20 bg-black font-mono text-white flex flex-col items-center justify-center border-t-4 border-brand-red min-h-[600px] overflow-hidden">
      <FullscreenBtn targetRef={containerRef} />
      <div className="w-full max-w-3xl px-4 flex flex-col items-center">
        
        <div className="inline-flex items-center gap-2 text-pink-500 text-xs font-black tracking-widest mb-4 border border-pink-500/30 px-3 py-1 bg-pink-500/10">
          <Activity className="w-4 h-4 text-pink-500 animate-pulse" />
          PONG.EXE : SECURITY DRILL
        </div>

        <div className="flex w-full justify-between items-center mb-6">
          <div className="text-left">
            <div className="text-[10px] text-pink-500 uppercase tracking-widest">PLAYER 1</div>
            <div className="text-4xl text-white font-black">{score.player}</div>
          </div>
          <div className="text-center font-black tracking-widest text-[#555] mx-4 uppercase">
            TARGET: 5 SECONDS
          </div>
          <div className="text-right">
            <div className="text-[10px] text-cyan-400 uppercase tracking-widest">AI FIREWALL</div>
            <div className="text-4xl text-white font-black">{score.ai}</div>
          </div>
        </div>

        <div className="relative border-4 border-neutral-900 bg-neutral-950 p-2 shadow-[0_0_50px_rgba(255,0,85,0.15)] rounded touch-none">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onPointerMove={handlePointerMove}
            onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); handlePointerMove(e); }}
            onPointerUp={(e) => { try { e.currentTarget.releasePointerCapture(e.pointerId); } catch(err){} }}
            className="bg-black max-w-full h-auto cursor-none border border-neutral-900 object-contain touch-none"
            style={{ imageRendering: "pixelated" }}
          />

          {gameState === "idle" && (
            <div className="absolute inset-0 z-10 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm">
              <Monitor className="w-16 h-16 text-pink-500 mb-6 animate-pulse" />
              <button 
                onClick={startGame}
                className="bg-pink-600 text-white font-black px-8 py-4 uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-colors"
              >
                INITIALIZE MATCH
              </button>
              <div className="mt-4 text-neutral-400 text-xs uppercase tracking-widest">Use ARROW UP / DOWN to move</div>
            </div>
          )}

          {gameState === "gameover" && (
            <div className="absolute inset-0 z-10 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm">
              <div className="text-5xl font-black uppercase tracking-widest mb-2 drop-shadow-[4px_4px_0px_#FF0055]">
                {score.player >= 5 ? <span className="text-pink-500">YOU WIN!</span> : <span className="text-cyan-400">AI WINS!</span>}
              </div>
              <div className="text-neutral-400 text-sm mb-8 uppercase tracking-widest">
                {score.player >= 5 ? "SECURITY NODE BYPASSED." : "CONNECTION REJECTED."}
              </div>
              <button 
                onClick={startGame}
                className="bg-white text-black font-black px-6 py-3 uppercase tracking-widest hover:bg-pink-500 hover:text-white transition-colors flex items-center gap-2"
              >
                <RefreshCcw className="w-4 h-4" /> PLAY AGAIN
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
