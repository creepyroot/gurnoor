import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Camera, RefreshCw, Download, Monitor, ShieldCheck, AlertTriangle, Play, Pause, Cpu } from "lucide-react";
import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";
import FullscreenBtn from "./FullscreenBtn";
import { playSound } from "../utils/audio";

export default function HackerCamera() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const virtualCanvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraState, setCameraState] = useState<"off" | "loading" | "active" | "error">("off");
  const [isVirtual, setIsVirtual] = useState(false);
  const [feedType, setFeedType] = useState<"webcam" | "screen" | "virtual">("virtual");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<"cyber" | "matrix" | "thermal" | "none">("cyber");
  const [isFlashing, setIsFlashing] = useState(false);
  const [customName, setCustomName] = useState("GUEST_AGENT");
  
  const [model, setModel] = useState<blazeface.BlazeFaceModel | null>(null);
  const [faceBounds, setFaceBounds] = useState<{ x: number, y: number, width: number, height: number, landmarks?: {x: number, y: number}[] | null } | null>(null);

  // Initialize Face Detector
  useEffect(() => {
    async function initModel() {
      try {
        await tf.setBackend('webgl');
        const loadedModel = await blazeface.load();
        setModel(loadedModel);
      } catch (err) {
        console.error("TFJS Model Initialization Failed", err);
      }
    }
    initModel();
  }, []);

  // Face Tracking Loop
  useEffect(() => {
    let isCanceled = false;

    async function trackFace() {
      if (cameraState !== "active" || isVirtual || !model || !videoRef.current || capturedImage) return;
      
      if (videoRef.current.readyState === 4) {
        try {
          const predictions = await model.estimateFaces(videoRef.current, false);
          if (!isCanceled && predictions.length > 0 && videoRef.current) {
            const pred = predictions[0];
            const topLeft = pred.topLeft as [number, number];
            const bottomRight = pred.bottomRight as [number, number];
            const landmarks = pred.landmarks as [number, number][]; // 0:eye, 1:eye, 2:nose, 3:mouth, 4:ear, 5:ear
            
            const videoW = videoRef.current.videoWidth;
            const videoH = videoRef.current.videoHeight;
            
            if (videoW > 0 && videoH > 0) {
              const rectWidth = ((bottomRight[0] - topLeft[0]) / videoW) * 100;
              const rectHeight = ((bottomRight[1] - topLeft[1]) / videoH) * 100;
              
              // Raw X in percentage
              const rawX = (topLeft[0] / videoW) * 100;
              // Video is mirrored via CSS scale-x-[-1] so we mirror the X coordinate!
              const xPos = 100 - rawX - rectWidth;
              const yPos = (topLeft[1] / videoH) * 100;

              let parsedLandmarks = null;
              if (landmarks && landmarks.length >= 4) {
                 parsedLandmarks = landmarks.map(p => ({
                   x: 100 - ((p[0] / videoW) * 100),
                   y: (p[1] / videoH) * 100
                 }));
              }

              setFaceBounds({ 
                x: xPos, y: yPos, width: rectWidth, height: rectHeight,
                landmarks: parsedLandmarks
              });
            }
          } else {
            setFaceBounds(null);
          }
        } catch (e) {}
      }
      
      if (!isCanceled) {
        requestAnimationFrame(trackFace);
      }
    }
    
    if (cameraState === "active" && !isVirtual && !capturedImage) {
      trackFace();
    }
    
    return () => {
      isCanceled = true;
      setFaceBounds(null);
    };
  }, [cameraState, isVirtual, model, capturedImage]);

  const [telemetry, setTelemetry] = useState({
    ip: "103.88.22.14",
    fps: 30,
    status: "ENCRYPTED_FEED",
  });

  const [tickerText, setTickerText] = useState("STREAM_LOCK_SECURE");

  // Cycle through some random cyber-attack strings for terminal immersion
  useEffect(() => {
    if (cameraState !== "active") return;
    const interval = setInterval(() => {
      const statuses = [
        "DECRYPTING_PIXELS",
        "GRID_SYS_LOCK_AUTHENTICATED",
        "MEM_BUFFER_READY",
        "DUMMY_DEVIATION_SYNC_0x7F",
        "OVERLAY_HUD_READY",
      ];
      setTickerText(statuses[Math.floor(Math.random() * statuses.length)]);
      setTelemetry((prev) => ({
        ...prev,
        fps: Math.floor(Math.random() * 5) + (isVirtual ? 60 : 26),
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, [cameraState, isVirtual]);

  // Attach stream to video element when it mounts
  useEffect(() => {
    if (videoRef.current && stream && cameraState === "active" && !isVirtual) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play();
      };
    }
  }, [stream, cameraState, isVirtual]);

  // Virtual Biometric Face & Screen Gaze Scanner Animation Loop
  useEffect(() => {
    if (!isVirtual || cameraState !== "active" || !virtualCanvasRef.current) return;
    
    const canvas = virtualCanvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;
    
    let animationId: number;
    let frame = 0;

    const render = () => {
      frame++;
      const w = canvas.width = 640;
      const h = canvas.height = 360;
      context.fillStyle = "#030303";
      context.fillRect(0, 0, w, h);

      // 1. Draw futuristic cyber background grid
      context.strokeStyle = "rgba(255, 51, 51, 0.08)";
      context.lineWidth = 1;
      const gridSize = 25;
      for (let x = frame % gridSize; x < w; x += gridSize) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, h);
        context.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(w, y);
        context.stroke();
      }

      // 2. Draw Simulated Computer Desktop Workspace
      // Top Taskbar
      context.fillStyle = "rgba(10, 10, 10, 0.9)";
      context.fillRect(0, 0, w, 22);
      context.strokeStyle = "rgba(255, 215, 0, 0.2)";
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(0, 22);
      context.lineTo(w, 22);
      context.stroke();

      context.fillStyle = "#FF3333";
      context.font = "bold 8px 'Courier New', monospace";
      context.fillText("AI_SCREEN_ATTENTION_MONITOR // V4.1", 12, 14);

      context.fillStyle = "#FFD700";
      context.font = "8px 'Courier New', monospace";
      context.textAlign = "right";
      context.fillText("TARGET: " + (customName || "GUEST_AGENT").toUpperCase(), w - 12, 14);
      context.textAlign = "left";

      // Left Sidebar File System
      context.fillStyle = "rgba(15, 15, 15, 0.6)";
      context.fillRect(0, 22, 110, h - 22);
      context.strokeStyle = "rgba(255, 215, 0, 0.1)";
      context.beginPath();
      context.moveTo(110, 22);
      context.lineTo(110, h);
      context.stroke();

      context.fillStyle = "rgba(255, 255, 255, 0.3)";
      context.font = "bold 8px 'Courier New', monospace";
      context.fillText("▼ PROJECT FILES", 10, 38);
      
      const files = ["index.html", "src/App.tsx", "src/types.ts", "HackerCamera.tsx", "portfolioData.ts"];
      files.forEach((file, idx) => {
        const isFocused = idx === Math.floor((frame / 120) % files.length);
        context.fillStyle = isFocused ? "#FFD700" : "rgba(255, 255, 255, 0.5)";
        context.fillText((isFocused ? "▶ " : "  ") + file, 12, 53 + idx * 14);
      });

      // 3. Central Simulated Browser View representing creepyroot.github.io/gurnoorsingh
      const bx = 120, by = 30, bw = 345, bh = h - 42;
      context.fillStyle = "rgba(5, 5, 5, 0.9)";
      context.fillRect(bx, by, bw, bh);
      context.strokeStyle = "rgba(255, 51, 51, 0.25)";
      context.strokeRect(bx, by, bw, bh);

      // Browser Header bar
      context.fillStyle = "rgba(20, 20, 20, 0.8)";
      context.fillRect(bx, by, bw, 20);
      context.strokeStyle = "rgba(255, 51, 51, 0.2)";
      context.beginPath();
      context.moveTo(bx, by + 20);
      context.lineTo(bx + bw, by + 20);
      context.stroke();

      // Mock URL text bar
      context.fillStyle = "#000000";
      context.fillRect(bx + 40, by + 4, bw - 50, 12);
      context.fillStyle = "rgba(0, 255, 170, 0.9)";
      context.font = "8px 'Courier New', monospace";
      context.fillText("https://creepyroot.github.io/gurnoor_portfolio", bx + 45, by + 12);

      // Draw three browser buttons
      context.fillStyle = "#FF3333";
      context.beginPath(); context.arc(bx + 12, by + 10, 3, 0, Math.PI * 2); context.fill();
      context.fillStyle = "#FFD700";
      context.beginPath(); context.arc(bx + 20, by + 10, 3, 0, Math.PI * 2); context.fill();
      context.fillStyle = "#00FF66";
      context.beginPath(); context.arc(bx + 28, by + 10, 3, 0, Math.PI * 2); context.fill();

      // Inside simulated portfolio web-page content
      context.fillStyle = "rgba(255, 255, 255, 0.8)";
      context.font = "bold 11px font-sans, sans-serif";
      context.fillText("GURNOOR SINGH // FULLSTACK PORTFOLIO", bx + 15, by + 40);

      // Draw elegant paragraphs of text lines inside browser
      context.fillStyle = "rgba(255, 255, 255, 0.3)";
      for (let i = 0; i < 8; i++) {
        context.fillRect(bx + 15, by + 55 + i * 10, 140 + Math.sin(i * 3 + frame * 0.01) * 35, 4);
      }

      // Draw mock image card on browser page
      context.fillStyle = "rgba(255, 51, 51, 0.1)";
      context.fillRect(bx + 15, by + 145, 130, 45);
      context.strokeStyle = "rgba(255, 51, 51, 0.3)";
      context.strokeRect(bx + 15, by + 145, 130, 45);
      context.fillStyle = "rgba(255, 51, 51, 0.4)";
      context.font = "bold 8px 'Courier New', monospace";
      context.fillText("SKILLS CORES // WEB3", bx + 22, by + 160);

      // 4. Draw USER GAZE EYE TRACKER BOX (The simulated AI Tool looking at what the user is looking at on screen!)
      // Calculated smoothly via trigonometry
      const tAngle = frame * 0.015;
      const targetGazeX = bx + bw / 2 + Math.sin(tAngle * 1.8) * 90;
      const targetGazeY = by + bh / 2 + Math.cos(tAngle * 1.2) * 55 + 20;

      // Draw blinking focal box (Just a box pointing at their attention area on the screen!)
      const boxS = 35 + Math.sin(frame * 0.1) * 3;
      context.strokeStyle = "#FFD700";
      context.lineWidth = 1.5;
      context.strokeRect(targetGazeX - boxS / 2, targetGazeY - boxS / 2, boxS, boxS);

      // Draw four targeted corner highlights
      context.fillStyle = "#FF3333";
      const cL = 6;
      context.fillRect(targetGazeX - boxS / 2 - 1, targetGazeY - boxS / 2 - 1, cL, 2);
      context.fillRect(targetGazeX - boxS / 2 - 1, targetGazeY - boxS / 2 - 1, 2, cL);

      context.fillRect(targetGazeX + boxS / 2 - cL + 1, targetGazeY - boxS / 2 - 1, cL, 2);
      context.fillRect(targetGazeX + boxS / 2 - 1, targetGazeY - boxS / 2 - 1, 2, cL);

      context.fillRect(targetGazeX - boxS / 2 - 1, targetGazeY + boxS / 2 - 2, cL, 2);
      context.fillRect(targetGazeX - boxS / 2 - 1, targetGazeY + boxS / 2 - cL + 1, 2, cL);

      context.fillRect(targetGazeX + boxS / 2 - cL + 1, targetGazeY + boxS / 2 - 2, cL, 2);
      context.fillRect(targetGazeX + boxS / 2 - 1, targetGazeY + boxS / 2 - cL + 1, 2, cL);

      // Gaze Tracker labeling
      context.fillStyle = "rgba(0, 0, 0, 0.85)";
      context.fillRect(targetGazeX - boxS / 2, targetGazeY + boxS / 2 + 3, boxS + 35, 23);
      context.strokeStyle = "#FFD700";
      context.strokeRect(targetGazeX - boxS / 2, targetGazeY + boxS / 2 + 3, boxS + 35, 23);

      context.fillStyle = "#FFD700";
      context.font = "bold 6px 'Courier New', monospace";
      context.fillText("GAZE TRACKING // ON", targetGazeX - boxS / 2 + 3, targetGazeY + boxS / 2 + 10);
      context.fillStyle = "#FFFFFF";
      context.fillText("COORD: [" + Math.round(targetGazeX) + ", " + Math.round(targetGazeY) + "]", targetGazeX - boxS / 2 + 3, targetGazeY + boxS / 2 + 16);
      context.fillStyle = "#FF3333";
      context.fillText("ATTENTION: HIGH", targetGazeX - boxS / 2 + 3, targetGazeY + boxS / 2 + 22);

      // Connect Gaze pointer to the top bar
      context.strokeStyle = "rgba(255, 215, 0, 0.15)";
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(targetGazeX, 22);
      context.lineTo(targetGazeX, targetGazeY - boxS / 2);
      context.stroke();

      // 5. Drawer Quadrant: Right Sidebar showing "AI detector looking at Person"
      const rx = 475, ry = 30, rw = 155, rh = h - 42;
      context.fillStyle = "rgba(10, 10, 10, 0.9)";
      context.fillRect(rx, ry, rw, rh);
      context.strokeStyle = "rgba(255, 215, 0, 0.15)";
      context.strokeRect(rx, ry, rw, rh);

      // Scanner mini title
      context.fillStyle = "rgba(255, 255, 255, 0.45)";
      context.font = "bold 7px 'Courier New', monospace";
      context.fillText("LIVE SUBJECT ANALYSIS", rx + 10, ry + 15);

      // Draw a mini simulated face camera box
      const fcX = rx + 15, fcY = ry + 25, fcW = 125, fcH = 85;
      context.fillStyle = "#000000";
      context.fillRect(fcX, fcY, fcW, fcH);
      context.strokeStyle = "rgba(255, 51, 51, 0.3)";
      context.strokeRect(fcX, fcY, fcW, fcH);

      // Draw vector head inside the camera box
      const hx = fcX + fcW / 2;
      const hy = fcY + fcH / 2 - 5;
      context.strokeStyle = "rgba(255, 51, 51, 0.5)";
      context.beginPath();
      context.arc(hx, hy, 15, 0, Math.PI * 2); // head outer circle
      context.stroke();
      context.beginPath();
      context.arc(hx, hy + 28, 22, Math.PI, Math.PI * 2); // collarbone / body
      context.stroke();

      // Draw AI target box over the head/avatar person in the mini view
      const aboxW = 38, aboxH = 38;
      context.strokeStyle = "rgba(0, 255, 127, 0.9)";
      context.lineWidth = 1.2;
      context.strokeRect(hx - aboxW / 2, hy - 16, aboxW, aboxH);

      // Corner green brackets of the face box
      context.fillStyle = "rgba(0, 255, 127, 0.3)";
      context.fillRect(hx - aboxW / 2 + 1, hy - 15, aboxW - 2, aboxH - 2);

      // Identity tag on face box
      context.fillStyle = "#00FF7F";
      context.font = "6px 'Courier New', sans-serif";
      context.fillText("ID: " + (customName || "GUEST").substring(0, 10).toUpperCase(), hx - aboxW / 2 + 2, hy + 30);

      // Draw eyes target lights
      context.fillStyle = "#FFD700";
      context.beginPath(); context.arc(hx - 5, hy - 2, 2, 0, Math.PI * 2); context.fill();
      context.beginPath(); context.arc(hx + 5, hy - 2, 2, 0, Math.PI * 2); context.fill();

      // Diagnostic output below mini feedback
      context.fillStyle = "rgba(255, 255, 255, 0.5)";
      context.font = "7px 'Courier New', monospace";
      context.fillText("• SIGNAL: AUTHENTIC", rx + 15, ry + 125);
      context.fillStyle = "#FFD700";
      context.fillText("• OPERATOR: ACTIVE", rx + 15, ry + 138);
      context.fillStyle = "#00FF7F";
      context.fillText("• CONFIDENCE: 98.67%", rx + 15, ry + 151);

      // Bottom dynamic wave chart representing EEG Attention waves
      context.strokeStyle = "rgba(255, 51, 51, 0.35)";
      context.lineWidth = 1;
      context.beginPath();
      for (let i = 0; i < rw - 30; i++) {
        const py = ry + 195 + Math.sin(i * 0.12 + frame * 0.1) * 12 + Math.cos(i * 0.05) * 4;
        if (i === 0) context.moveTo(rx + 15 + i, py);
        else context.lineTo(rx + 15 + i, py);
      }
      context.stroke();

      context.fillStyle = "rgba(255, 255, 255, 0.35)";
      context.font = "5px 'Courier New', monospace";
      context.fillText("COGNITIVE ATTENDANCE STIMULATOR", rx + 15, ry + 218);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [isVirtual, cameraState, customName]);

  // Start the webcam feed
  const startCamera = async (forceSimulated = false) => {
    setCapturedImage(null);
    setErrorMessage("");

    if (forceSimulated) {
      setIsVirtual(true);
      setCameraState("active");
      setFeedType("virtual");
      return;
    }

    setCameraState("loading");
    setIsVirtual(false);
    setFeedType("webcam");

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("SECURE FRAME RESTRICTION: Hardware API not available in nested context.");
      }

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: false,
      });

      setStream(mediaStream);
      setCameraState("active");
    } catch (err: any) {
      console.error("Camera access error, falling back to virtual simulator:", err);
      // Instead of failing completely, smoothly launch the simulated virtual biometric feed!
      setIsVirtual(true);
      setCameraState("active");
      setFeedType("virtual");
      
      // Keep a mini error notifier in state so they know they are using the virtual backup
      const errName = err.name || "Default";
      setErrorMessage(`HARDWARE ACCESS PORT CLOSED (${errName}). INTEGRATING EMULATED CYBER BIOMETRIC NODE.`);
    }
  };

  // Start screen capture feed to capture what user is looking on the screen
  const startScreenCapture = async () => {
    setCapturedImage(null);
    setErrorMessage("");
    setCameraState("loading");
    setIsVirtual(false);
    setFeedType("screen");

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        throw new Error("Screen sharing API not available or blocked in this browser context.");
      }

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      // Handle stream end (user clicks "Stop sharing" from system dialog)
      mediaStream.getVideoTracks()[0].onended = () => {
        stopCamera();
      };

      setStream(mediaStream);
      setCameraState("active");
    } catch (err: any) {
      console.error("Screen capture failed, falling back to attention simulator:", err);
      setIsVirtual(true);
      setCameraState("active");
      setFeedType("virtual");
      
      const errName = err.name || "Error";
      setErrorMessage(`SCREEN PORT BLOCKED OR DECLINED (${errName}). INTEGRATING EMULATED EYE ATTENTION MONITOR.`);
    }
  };

  // Stop the feeds
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setStream(null);
    setCameraState("off");
    setIsVirtual(false);
  };

  // Cleanup feed
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  // Trigger snapshot picture
  const takeSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Flash feed
    playSound('shoot');
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use standardized HD resolution
    const videoWidth = 1280;
    const videoHeight = 720;
    canvas.width = videoWidth;
    canvas.height = videoHeight;

    if (isVirtual && virtualCanvasRef.current) {
      // 1. Snapshot the Virtual simulator drawing
      ctx.drawImage(virtualCanvasRef.current, 0, 0, canvas.width, canvas.height);
    } else if (videoRef.current) {
      // 1. Snapshot the actual live video mirrored
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    } else {
      // Fallback blank slate
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 2. Apply chosen custom aesthetic Filters
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    if (activeFilter === "cyber") {
      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];
        // Immersive cybernetic red tint matching branding
        data[i] = Math.min(255, r * 1.35); 
        data[i + 1] = g * 0.45; 
        data[i + 2] = b * 0.55; 
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (activeFilter === "matrix") {
      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        data[i] = 0; 
        data[i + 1] = Math.min(255, luminance * 1.55); 
        data[i + 2] = 0; 
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (activeFilter === "thermal") {
      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];
        const v = 0.299 * r + 0.587 * g + 0.114 * b;
        if (v < 64) {
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = v * 4;
        } else if (v < 128) {
          data[i] = 0;
          data[i + 1] = (v - 64) * 4;
          data[i + 2] = 255 - (v - 64) * 4;
        } else if (v < 192) {
          data[i] = (v - 128) * 4;
          data[i + 1] = 255;
          data[i + 2] = 0;
        } else {
          data[i] = 255;
          data[i + 1] = 255 - (v - 192) * 4;
          data[i + 2] = (v - 192) * 4;
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }

    // Apply clean AI Target Bounding Box over person's face inside takeSnapshot
    let boxCX = canvas.width / 2;
    let boxCY = canvas.height / 2;
    let boxW = 200;
    let boxH = 240;

    if (faceBounds) {
      boxCX = (faceBounds.x + faceBounds.width / 2) / 100 * canvas.width;
      boxCY = (faceBounds.y + faceBounds.height / 2) / 100 * canvas.height;
      boxW = (faceBounds.width / 100) * canvas.width * 1.5;
      boxH = (faceBounds.height / 100) * canvas.height * 1.5;
    } else {
      boxCX = (maskPos.x) / 100 * canvas.width;
      boxCY = (maskPos.y) / 100 * canvas.height;
    }

    ctx.save();
    
    // Draw neon emerald/amber AI Bounding target box
    ctx.strokeStyle = "#00FF7F";
    ctx.lineWidth = 3;
    ctx.strokeRect(boxCX - boxW / 2, boxCY - boxH / 2, boxW, boxH);

    // Semi-transparent overlay inside target
    ctx.fillStyle = "rgba(0, 255, 127, 0.05)";
    ctx.fillRect(boxCX - boxW / 2, boxCY - boxH / 2, boxW, boxH);

    // Sweeping scan highlight
    ctx.strokeStyle = "rgba(255, 215, 0, 0.4)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(boxCX - boxW / 2, boxCY);
    ctx.lineTo(boxCX + boxW / 2, boxCY);
    ctx.stroke();

    // Corner brackets of the snapshot target box
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 4;
    const sLen = 25;
    
    // Top-Left corner link
    ctx.beginPath();
    ctx.moveTo(boxCX - boxW / 2, boxCY - boxH / 2 + sLen);
    ctx.lineTo(boxCX - boxW / 2, boxCY - boxH / 2);
    ctx.lineTo(boxCX - boxW / 2 + sLen, boxCY - boxH / 2);
    ctx.stroke();

    // Top-Right corner link
    ctx.beginPath();
    ctx.moveTo(boxCX + boxW / 2, boxCY - boxH / 2 + sLen);
    ctx.lineTo(boxCX + boxW / 2, boxCY - boxH / 2);
    ctx.lineTo(boxCX + boxW / 2 - sLen, boxCY - boxH / 2);
    ctx.stroke();

    // Bottom-Left corner link
    ctx.beginPath();
    ctx.moveTo(boxCX - boxW / 2, boxCY + boxH / 2 - sLen);
    ctx.lineTo(boxCX - boxW / 2, boxCY + boxH / 2);
    ctx.lineTo(boxCX - boxW / 2 + sLen, boxCY + boxH / 2);
    ctx.stroke();

    // Bottom-Right corner link
    ctx.beginPath();
    ctx.moveTo(boxCX + boxW / 2, boxCY + boxH / 2 - sLen);
    ctx.lineTo(boxCX + boxW / 2, boxCY + boxH / 2);
    ctx.lineTo(boxCX + boxW / 2 - sLen, boxCY + boxH / 2);
    ctx.stroke();

    // Pupil target indicators inside HD snapshot
    ctx.fillStyle = "#00FF7F";
    ctx.beginPath(); ctx.arc(boxCX - boxW * 0.22, boxCY - boxH * 0.15, 6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(boxCX + boxW * 0.22, boxCY - boxH * 0.15, 6, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(boxCX - boxW * 0.22, boxCY - boxH * 0.15, 12, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(boxCX + boxW * 0.22, boxCY - boxH * 0.15, 12, 0, Math.PI * 2); ctx.stroke();

    // AI Classification Badge Stamp on top of target
    ctx.fillStyle = "#FFD700";
    ctx.fillRect(boxCX - boxW / 2, boxCY - boxH / 2 - 32, boxW, 32);
    ctx.strokeStyle = "#FFD700";
    ctx.strokeRect(boxCX - boxW / 2, boxCY - boxH / 2 - 32, boxW, 32);

    ctx.fillStyle = "#000000";
    ctx.font = "bold 11px 'Courier New', monospace";
    ctx.textAlign = "left";
    ctx.fillText("● AI_LOCK: " + (customName || "GUEST_AGENT").toUpperCase(), boxCX - boxW / 2 + 10, boxCY - boxH / 2 - 12);

    // Bottom classification metrics stamp
    ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    ctx.fillRect(boxCX - boxW / 2, boxCY + boxH / 2, boxW, 25);
    ctx.strokeStyle = "#FF3333";
    ctx.strokeRect(boxCX - boxW / 2, boxCY + boxH / 2, boxW, 25);
    ctx.fillStyle = "#FF3333";
    ctx.font = "bold 9px 'Courier New', monospace";
    ctx.textAlign = "left";
    ctx.fillText("CLASS: HUMAN_SUBJECT | CONFID: 99.87%", boxCX - boxW / 2 + 8, boxCY + boxH / 2 + 16);

    ctx.restore();

    // 3. Cyber horizontal render scanlines
    ctx.strokeStyle = "rgba(0, 0, 0, 0.18)";
    ctx.lineWidth = 2;
    for (let y = 0; y < canvas.height; y += 4) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // 4. Paint Cyber Grid brackets Corner overlays
    const margin = 40;
    const len = 35;
    ctx.strokeStyle = "#FF3333";
    ctx.lineWidth = 5;

    // Corner L links
    ctx.beginPath();
    ctx.moveTo(margin + len, margin);
    ctx.lineTo(margin, margin);
    ctx.lineTo(margin, margin + len);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvas.width - margin - len, margin);
    ctx.lineTo(canvas.width - margin, margin);
    ctx.lineTo(canvas.width - margin, margin + len);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(margin + len, canvas.height - margin);
    ctx.lineTo(margin, canvas.height - margin);
    ctx.lineTo(margin, canvas.height - margin - len);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvas.width - margin - len, canvas.height - margin);
    ctx.lineTo(canvas.width - margin, canvas.height - margin);
    ctx.lineTo(canvas.width - margin, canvas.height - margin - len);
    ctx.stroke();

    // 5. Draw solid watermark bottom dashboard
    ctx.fillStyle = "rgba(0, 0, 0, 0.92)";
    ctx.fillRect(0, canvas.height - 80, canvas.width, 80);

    // Hazard Gurnoor Yellow Bar
    ctx.fillStyle = "#FFD700";
    ctx.fillRect(0, canvas.height - 84, canvas.width, 4);

    // Branding / System Information
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 15px 'Courier New', monospace";
    ctx.textAlign = "left";
    ctx.fillText(`OPERATOR: ${(customName || "GUEST_AGENT").toUpperCase()}`, 50, canvas.height - 40);
    
    ctx.fillStyle = "#FF3333";
    ctx.font = "bold 18px 'Courier New', monospace";
    ctx.fillText("CREEPYROOT // CYBER SECURITY CERTIFIED", 50, canvas.height - 15);

    // Dynamic right-aligned requested watermark website URL
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 18px 'Courier New', monospace";
    ctx.textAlign = "right";
    ctx.fillText("CREEPYROOT.GITHUB.IO/GURNOORSINGH", canvas.width - 50, canvas.height - 15);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "12px 'Courier New', monospace";
    ctx.fillText("INTELLIGENCE OVERLAY ACCESSIBLE", canvas.width - 50, canvas.height - 42);

    // Center targeting HUD
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255, 51, 51, 0.85)";
    ctx.font = "bold 26px Arial, sans-serif";
    ctx.fillText("[ DETECTOR ONLINE ]", canvas.width / 2, 75);

    // Target radar crosshair lines
    ctx.strokeStyle = "rgba(255, 215, 0, 0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 60, 0, Math.PI * 2);
    ctx.moveTo(canvas.width / 2 - 100, canvas.height / 2);
    ctx.lineTo(canvas.width / 2 + 100, canvas.height / 2);
    ctx.moveTo(canvas.width / 2, canvas.height / 2 - 100);
    ctx.lineTo(canvas.width / 2, canvas.height / 2 + 100);
    ctx.stroke();

    const dataUrl = canvas.toDataURL("image/png");
    setCapturedImage(dataUrl);
  };

  const downloadPhoto = () => {
    if (!capturedImage) return;
    const downloadLink = document.createElement("a");
    downloadLink.href = capturedImage;
    downloadLink.download = `creepyroot_cyber_pass_${Date.now()}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // CSS Filters for live feed
  const getFilterStyle = (filter: string) => {
    switch (filter) {
      case "cyber":
        return { filter: "grayscale(100%) sepia(100%) hue-rotate(320deg) saturate(400%) contrast(120%)" };
      case "matrix":
        return { filter: "grayscale(100%) sepia(100%) hue-rotate(70deg) saturate(400%) contrast(120%)" };
      case "thermal":
        // A rough simulation of thermal camera using color inversion and hue shift
        return { filter: "invert(100%) sepia(100%) hue-rotate(130deg) saturate(500%) contrast(150%) brightness(120%)" };
      default:
        return {};
    }
  };

  // Interactive Target Mask State
  const [maskPos, setMaskPos] = useState({ x: 50, y: 50 }); // in percentages
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only track mouse if not tracking face
    if (!faceBounds) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMaskPos({ x, y });
    }
  };

  const currentX = faceBounds ? faceBounds.x + faceBounds.width / 2 : maskPos.x;
  const currentY = faceBounds ? faceBounds.y + faceBounds.height / 2 : maskPos.y;
  const widthPerc = faceBounds ? faceBounds.width * 1.5 : 20; // fallback relative width ~20%
  const heightPerc = faceBounds ? faceBounds.height * 1.5 : 25;
  const showMask = !!faceBounds || isHovering;

  const interactiveMaskOverlay = (
    <AnimatePresence>
      {showMask && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="absolute pointer-events-none z-20 flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
          style={{ 
            left: `${currentX}%`, 
            top: `${currentY}%`, 
            width: `${widthPerc}%`, 
            height: `${heightPerc}%` 
          }}
        >
          {/* Main Bounding Container */}
          <div className="absolute inset-0 border border-emerald-500 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.15)] rounded-sm" />

          {/* Sweeping scan focus bar */}
          <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-yellow to-transparent shadow-[0_0_8px_#FFD700] top-1/2 opacity-70 animate-pulse" />

          {/* AI Eye Ocular Focus Tracker */}
          <div className="absolute top-[35%] left-[28%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
             <div className="w-5 h-5 border border-dashed border-emerald-400 rounded-full animate-spin duration-7000" />
             <div className="absolute w-1 h-1 bg-emerald-400 rounded-full" />
             <span className="absolute -top-3.5 text-[5px] font-mono text-emerald-400 bg-black/70 px-0.5 tracking-tighter">L_PUPIL</span>
          </div>
          <div className="absolute top-[35%] right-[28%] translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
             <div className="w-5 h-5 border border-dashed border-emerald-400 rounded-full animate-spin duration-7000" />
             <div className="absolute w-1 h-1 bg-emerald-400 rounded-full" />
             <span className="absolute -top-3.5 text-[5px] font-mono text-emerald-400 bg-black/70 px-0.5 tracking-tighter">R_PUPIL</span>
          </div>

          {/* Nose targeting reticle */}
          <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-[1px] bg-brand-yellow/60">
             <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-4 bg-brand-yellow/60" />
          </div>

          {/* Top Stamp Label with Custom Agent Identity Name */}
          <div className="absolute -top-7 left-0 bg-brand-yellow text-black text-[9px] uppercase font-mono font-black border border-brand-yellow px-2 py-0.5 whitespace-nowrap flex items-center gap-1.5 shadow-md rounded-sm">
            <span className="animate-pulse">● TARGET ACQUIRED</span>
            <span className="text-neutral-950 border-l border-neutral-800/40 pl-1.5 font-bold tracking-widest">
              {customName.toUpperCase() || "GUEST_AGENT"}
            </span>
          </div>

          {/* Bottom Stamp Label with Classification telemetry */}
          <div className="absolute -bottom-7 left-0 bg-black/90 text-brand-red text-[8px] uppercase font-mono px-2 py-0.5 tracking-wider border border-brand-red/30 whitespace-nowrap flex items-center gap-1.5 rounded-sm">
            <span>CLASS: SUBJECT_AGNT</span>
            <span className="text-zinc-400 border-l border-neutral-800/40 pl-1.5">CONF: 99.82%</span>
            <span className="text-emerald-400 border-l border-neutral-800/40 pl-1.5 animate-pulse">LOCK_V2</span>
          </div>

          {/* Corner Brackets mapping to face bounds bounding box */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-brand-yellow" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-brand-yellow" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-brand-yellow" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-brand-yellow" />
          
          <div className="absolute -bottom-11 right-0 text-[7px] font-mono font-black text-brand-yellow bg-black/80 px-1 whitespace-nowrap border border-neutral-900 rounded-sm">
            CALIP: X{currentX.toFixed(0)} Y{currentY.toFixed(0)}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <section ref={containerRef} id="hacker-cam" className="relative py-20 bg-black border-t-8 border-brand-red text-white flex flex-col items-center">
      <FullscreenBtn targetRef={containerRef} />
      <div className="w-full max-w-6xl px-4 flex flex-col animate-fadeIn">
        
        {/* Title Block */}
        <div className="mb-10 text-center md:text-left relative">
          <div className="absolute top-0 left-0 w-24 h-1 bg-brand-red" />
          <span className="font-mono text-[10px] text-brand-yellow font-black tracking-widest block uppercase pt-3 mb-2">
            SECURITY BIOMETRIC GRID CAPTURE
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-3 text-white">
            Cyber Webc<span className="text-brand-red">am Node</span>
          </h2>
          <p className="text-neutral-400 font-mono text-xs md:text-sm max-w-3xl uppercase">
            Start your sensor grid dynamically. Seamlessly switch between active webcams or a virtual AI wireframe headpiece. Capture your identity credentials watermarked with Gurnoor's site.
          </p>
        </div>

        {/* Display Alert Info when camera falls back automatically */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-zinc-950 border-l-4 border-brand-yellow text-zinc-300 font-mono text-[11px] leading-relaxed uppercase rounded flex items-start gap-3">
            <Cpu className="w-5 h-5 text-brand-yellow shrink-0 mt-0.5 animate-pulse" />
            <div>
              <span className="font-bold text-brand-yellow block">SYSTEM FALLBACK SUCCESSFUL</span>
              {errorMessage}
            </div>
          </div>
        )}

        {/* Dynamic Grid split */}
        <div className="grid grid-cols-12 gap-6 items-stretch">
          
          {/* Main Visual Terminal Area */}
          <div className="col-span-12 lg:col-span-8 flex flex-col">
            <div className="bg-zinc-950 border-4 border-brand-red rounded p-3 md:p-5 shadow-[8px_8px_0px_rgba(255,0,0,0.1)] flex flex-col justify-between h-full relative overflow-hidden">
              
              {/* Telemetry labels bar */}
              <div className="flex flex-wrap items-center justify-between border-b border-neutral-900 pb-3 mb-4 font-mono text-[10px] uppercase text-zinc-400 gap-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${cameraState === "active" ? "bg-brand-red animate-ping" : "bg-neutral-800"}`} />
                  <span className="text-white font-black">
                    FEED: {cameraState} {isVirtual && "(AI_SIMULATION)"}
                  </span>
                </div>
                <div className="hidden sm:flex gap-4">
                  <span>LOC: <span className="text-brand-yellow">{telemetry.ip}</span></span>
                  <span>TIC: <span className="text-brand-red">{tickerText}</span></span>
                  <span>FPS: <span className="text-white">{telemetry.fps}</span></span>
                </div>
              </div>

              {/* Central frame viewer ratio */}
              <div className="aspect-video w-full bg-black border-2 border-neutral-900 rounded relative overflow-hidden flex items-center justify-center">
                
                {/* Captured flash layer effect */}
                <AnimatePresence>
                  {isFlashing && (
                    <motion.div
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-white z-50 pointer-events-none"
                    />
                  )}
                </AnimatePresence>

                {cameraState === "off" && !capturedImage && (
                  <div className="flex flex-col items-center justify-center text-center p-6 space-y-5">
                    <div className="w-16 h-16 rounded-full bg-neutral-900 border-2 border-dashed border-brand-red flex items-center justify-center text-brand-red">
                      <Monitor className="w-8 h-8 animate-pulse text-brand-yellow" />
                    </div>
                    <div>
                      <span className="font-mono text-xs uppercase tracking-widest text-brand-red font-black block mb-1">
                        AI MONITOR STAGE READY
                      </span>
                      <p className="text-[10px] text-neutral-500 max-w-sm uppercase font-mono leading-relaxed">
                        To lock credentials, click to initiate your camera stream or initiate screen-capture to analyze what you are looking at in real-time.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={startScreenCapture}
                        className="bg-brand-red text-black font-black font-mono text-xs px-5 py-3 hover:bg-red-500 rounded flex items-center justify-center gap-2 transition-all uppercase tracking-wider"
                      >
                        <Monitor className="w-4 h-4" /> Start Screen Capture
                      </button>
                      <button
                        onClick={() => startCamera(false)}
                        className="bg-neutral-900 text-neutral-200 border border-neutral-800 font-bold font-mono text-xs px-5 py-3 hover:bg-neutral-800 rounded flex items-center justify-center gap-2 transition-all uppercase tracking-wider"
                      >
                        <Camera className="w-4 h-4" /> Webcam Feed
                      </button>
                      <button
                        onClick={() => startCamera(true)}
                        className="bg-neutral-900 text-brand-yellow border-2 border-brand-yellow font-black font-mono text-xs px-5 py-3 hover:bg-neutral-800 rounded flex items-center justify-center gap-2 transition-all uppercase tracking-wider"
                      >
                        <Cpu className="w-4 h-4" /> Virtual Simulator
                      </button>
                    </div>
                  </div>
                )}

                {cameraState === "loading" && (
                  <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <RefreshCw className="w-10 h-10 text-brand-yellow animate-spin" />
                    <span className="font-mono text-xs text-brand-yellow uppercase tracking-widest animate-pulse font-bold">
                      ACQUIRING ATTENTION SCANNING SIGNAL...
                    </span>
                  </div>
                )}

                {/* Webcam or Screen real video feed elements */}
                {cameraState === "active" && !isVirtual && !capturedImage && (
                  <div 
                    className="relative w-full h-full cursor-crosshair overflow-hidden" 
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    {interactiveMaskOverlay}
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      autoPlay
                      className={`absolute inset-0 w-full h-full object-cover ${feedType === "screen" ? "" : "scale-x-[-1]"}`}
                      style={getFilterStyle(activeFilter)}
                    />
                    
                    {/* Cyber overlay elements */}
                    <div className="absolute inset-0 border-2 border-brand-red/35 pointer-events-none p-4 flex flex-col justify-between">
                      <div className="flex justify-between text-brand-red font-mono text-[9px] font-bold">
                        <span>[ FEED_SOURCE_SECURE: {feedType.toUpperCase()} ]</span>
                        <span>[ ATTENTION_AI_HUD ]</span>
                      </div>
                      
                      {/* Technical targeting crosshair */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                        <div className="w-12 h-12 border border-dashed border-brand-yellow rounded-full animate-spin duration-7000" />
                        <div className="absolute w-2.5 h-2.5 bg-brand-red rounded-full" />
                      </div>

                      <div className="flex justify-between items-end text-neutral-400 font-mono text-[8px] uppercase">
                        <div>
                          <p>SCANMODE: {activeFilter.toUpperCase()}</p>
                          <p>TARGETING: LOK_ACTIVE</p>
                        </div>
                        <div className="text-right">
                          <p>SECURE: AES_256</p>
                          <p>RATE: {telemetry.fps}FPS</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Virtual Biometric Face & Screen Scanner Canvas */}
                {cameraState === "active" && isVirtual && !capturedImage && (
                  <div 
                    className="relative w-full h-full cursor-crosshair overflow-hidden"
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    {interactiveMaskOverlay}
                    <canvas
                      ref={virtualCanvasRef}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={getFilterStyle(activeFilter)}
                    />

                    {/* Cyber overlay elements duplication for design parity */}
                    <div className="absolute inset-0 border-2 border-brand-yellow/35 pointer-events-none p-4 flex flex-col justify-between">
                      <div className="flex justify-between text-brand-yellow font-mono text-[9px] font-bold">
                        <span>[ EMULATION_NODE_SECURE ]</span>
                        <span>[ VIRTUAL_GAZE_ACTIVE ]</span>
                      </div>

                      {/* Visual coordinates tracking */}
                      <div className="flex justify-between items-end text-neutral-400 font-mono text-[8px] uppercase">
                        <div>
                          <p>EMULATOR: ENGAGED</p>
                          <p>FILTER: {activeFilter.toUpperCase()}</p>
                        </div>
                        <div className="text-right">
                          <p>PORT: SCREEN_DECK</p>
                          <p>RATE: 60FPS</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Screen Snapshot Image Preview */}
                {capturedImage && (
                  <div className="relative w-full h-full flex flex-col items-center justify-center bg-black">
                    <img
                      src={capturedImage}
                      alt="Watermarked Hacker Capture"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute top-4 right-4 bg-brand-red text-black text-xs font-mono font-black py-1 px-3 uppercase shadow-lg border border-red-900 rounded">
                      ID_PASS GENERATED
                    </div>
                  </div>
                )}

              </div>

              {/* Control Deck Action Buttons */}
              <div className="mt-4 flex flex-wrap gap-3 items-center justify-between">
                <div className="flex items-center gap-2">
                  {cameraState === "active" && !capturedImage && (
                    <button
                      onClick={takeSnapshot}
                      className="bg-brand-red text-black text-xs font-black px-5 py-3 tracking-widest hover:bg-red-500 flex items-center gap-2 transition-all uppercase rounded font-mono"
                    >
                      <Camera className="w-4 h-4" /> Snap Identity!
                    </button>
                  )}

                  {capturedImage && (
                    <button
                      onClick={downloadPhoto}
                      className="bg-brand-yellow text-black text-xs font-black px-5 py-3 tracking-widest hover:bg-yellow-400 flex items-center gap-2 transition-all uppercase rounded font-mono"
                    >
                      <Download className="w-4 h-4" /> Get HD Badge
                    </button>
                  )}

                  {cameraState === "active" && !capturedImage && (
                    <button
                      onClick={stopCamera}
                      className="bg-neutral-900 text-neutral-300 text-xs font-bold px-4 py-3 hover:bg-neutral-800 flex items-center gap-1.5 transition-all uppercase rounded font-mono border border-neutral-800"
                    >
                      <Pause className="w-3.5 h-3.5" /> Stop Feed
                    </button>
                  )}

                  {capturedImage && (
                    <button
                      onClick={() => setCapturedImage(null)}
                      className="bg-neutral-900 text-neutral-300 text-xs font-bold px-4 py-3 hover:bg-neutral-800 flex items-center gap-1.5 transition-all uppercase rounded font-mono border border-neutral-800"
                    >
                      Reset Capture
                    </button>
                  )}
                </div>

                {/* LUT shader picker controls */}
                {cameraState === "active" && !capturedImage && (
                  <div className="flex items-center gap-1 bg-black border border-neutral-800 p-1 rounded">
                    <span className="font-mono text-[9px] text-neutral-500 uppercase px-2 font-bold select-none hidden sm:inline">
                      COLOR ROUTER:
                    </span>
                    {(["cyber", "matrix", "thermal", "none"] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`text-[9px] font-mono uppercase px-2 py-1 rounded transition-all font-bold ${
                          activeFilter === filter
                            ? "bg-brand-red text-white"
                            : "text-neutral-400 hover:text-white"
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Right Information Legend Panel */}
          <div className="col-span-12 lg:col-span-4 flex flex-col justify-between">
            <div className="bg-zinc-950 border-4 border-brand-yellow rounded p-6 flex flex-col justify-between h-full shadow-[8px_8px_0px_rgba(255,215,0,0.08)]">
              
              <div>
                <span className="font-mono text-[9px] text-brand-yellow font-black uppercase mb-4 block tracking-widest border-b border-neutral-900 pb-2">
                  SECURE BADGE SPECIFICATION
                </span>

                {/* Custom Name Customization Box */}
                <div className="mb-4 p-3.5 bg-neutral-950 border border-brand-red rounded shadow-[0_0_8px_rgba(255,0,0,0.15)]">
                  <label className="text-zinc-200 block font-black text-[10px] tracking-wider mb-2 font-mono uppercase">
                    [ AGENT IDENTITY NAME ]
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value.replace(/[^a-zA-Z0-9_\-\s]/g, "").substring(0, 22))}
                    placeholder="ENTER NAME..."
                    className="w-full bg-black border border-neutral-800 focus:border-brand-yellow px-3 py-2 rounded text-xs text-white uppercase outline-none font-mono tracking-widest transition-all"
                  />
                  <div className="mt-1.5 flex justify-between text-[8px] text-neutral-500 font-mono">
                    <span>* MAXIMUM 22 CHARACTERS</span>
                    <span>ALPHANUMERIC ONLY</span>
                  </div>
                </div>

                <div className="space-y-4 font-mono text-[11px] text-neutral-400 uppercase leading-relaxed">
                  <div className="p-3 bg-neutral-950 border border-neutral-900 rounded">
                    <span className="text-white block font-black text-[10px] mb-1">
                      Target Website Overlay
                    </span>
                    <p className="text-brand-yellow font-bold text-xs">
                      creepyroot.github.io/gurnoorsingh
                    </p>
                    <p className="text-[9px] text-neutral-500 mt-1">
                      Rendered on the raster layer of both digital models and live camera snapshots.
                    </p>
                  </div>

                  <div className="p-3 bg-neutral-950 border border-neutral-900 rounded">
                    <span className="text-white block font-black text-[10px] mb-1">
                      Certified Credentials
                    </span>
                    <p className="text-[10px]">
                      Watermarked with <span className="text-brand-red">"CREEPYROOT // CYBER SECURITY"</span> to establish system authorization credentials.
                    </p>
                  </div>

                  <div className="p-3 bg-neutral-950 border border-neutral-900 rounded">
                    <span className="text-white block font-black text-[10px] mb-1">
                      Shader Options
                    </span>
                    <p className="text-[10px]">
                      Switch filters to match different terminal outputs: Cyber-Red, Emerald-Matrix, or Thermal ranges.
                    </p>
                  </div>
                </div>
              </div>

              {/* Status block with encryption label */}
              <div className="mt-8 border-t border-neutral-900 pt-4 flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-brand-yellow shrink-0" />
                  <div>
                    <span className="text-[8px] text-zinc-500 block">ENCRYPTION LEVEL</span>
                    <span className="text-white font-black text-[10px]">GURNOOR_AI_APPROVED</span>
                  </div>
                </div>
                <span className="text-brand-yellow font-black animate-pulse">SYSTEM SECURE</span>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Hidden high-res compiler canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </section>
  );
}
