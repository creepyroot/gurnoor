import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Camera, RefreshCw, Download, Monitor, ShieldCheck, AlertTriangle, Play, Pause, Cpu } from "lucide-react";

export default function HackerCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const virtualCanvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraState, setCameraState] = useState<"off" | "loading" | "active" | "error">("off");
  const [isVirtual, setIsVirtual] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<"cyber" | "matrix" | "thermal" | "none">("cyber");
  const [isFlashing, setIsFlashing] = useState(false);
  const [customName, setCustomName] = useState("GUEST_AGENT");
  
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

  // Virtual Biometric Face Scanner Animation Loop
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
      context.fillStyle = "black";
      context.fillRect(0, 0, w, h);

      // Draw futuristic digital background grid
      context.strokeStyle = "rgba(40, 40, 40, 0.4)";
      context.lineWidth = 1;
      const gridSize = 30;
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

      // Draw concentric radar lines
      context.strokeStyle = "rgba(255, 0, 0, 0.15)";
      context.lineWidth = 1.5;
      context.beginPath();
      context.arc(w / 2, h / 2, 120 + Math.sin(frame * 0.05) * 5, 0, Math.PI * 2);
      context.stroke();

      // Core Coordinates for Cyber Mesh
      const cx = w / 2;
      const cy = h / 2 - 10;
      const angle = frame * 0.02;

      // Draw a rotating 3D orbital rings around the head
      context.strokeStyle = "rgba(255, 215, 0, 0.25)";
      context.beginPath();
      context.ellipse(cx, cy + 90, 80, 20, Math.PI / 12, 0, Math.PI * 2);
      context.stroke();

      // Cyber Human Skull / Face Mask Wireframe Node Points structure
      const points: { [key: string]: [number, number] } = {
        chin: [cx, cy + 85],
        jawL: [cx - 60, cy + 50],
        jawR: [cx + 60, cy + 50],
        cheekL: [cx - 75, cy + 5],
        cheekR: [cx + 75, cy + 5],
        templeL: [cx - 70, cy - 40],
        templeR: [cx + 70, cy - 40],
        foreheadL: [cx - 45, cy - 80],
        foreheadR: [cx + 45, cy - 80],
        noseTip: [cx + Math.cos(angle) * 3, cy + 15],
        centerEye: [cx, cy - 15],
        eyeL: [cx - 30 + Math.sin(frame * 0.03) * 2, cy - 20],
        eyeR: [cx + 30 + Math.sin(frame * 0.03) * 2, cy - 20],
        mouthL: [cx - 25, cy + 45],
        mouthR: [cx + 25, cy + 45],
      };

      // Connect facial nodes dynamically
      const links = [
        ["chin", "jawL"], ["chin", "jawR"],
        ["jawL", "cheekL"], ["jawR", "cheekR"],
        ["cheekL", "templeL"], ["cheekR", "templeR"],
        ["templeL", "foreheadL"], ["templeR", "foreheadR"],
        ["foreheadL", "foreheadR"],
        // Nose details
        ["noseTip", "centerEye"], ["noseTip", "cheekL"], ["noseTip", "cheekR"],
        // Eyes to nose/temple
        ["eyeL", "templeL"], ["eyeR", "templeR"],
        ["eyeL", "centerEye"], ["eyeR", "centerEye"],
        // Mouth
        ["mouthL", "mouthR"], ["mouthL", "chin"], ["mouthR", "chin"],
        ["mouthL", "noseTip"], ["mouthR", "noseTip"],
      ];

      // Draw Glowing Links
      context.lineWidth = 1.5;
      context.strokeStyle = "rgba(255, 0, 0, 0.75)";
      links.forEach(([p1, p2]) => {
        const pt1 = points[p1];
        const pt2 = points[p2];
        if (pt1 && pt2) {
          context.beginPath();
          context.moveTo(pt1[0], pt1[1]);
          context.lineTo(pt2[0], pt2[1]);
          context.stroke();
        }
      });

      // Draw Nodes (Small matrix circles)
      context.fillStyle = "#FFD700";
      Object.entries(points).forEach(([name, [x, y]]) => {
        context.beginPath();
        context.arc(x, y, 3, 0, Math.PI * 2);
        context.fill();
        
        // Label node occasionally for full tech immersion
        if (frame % 40 < 20 && name === "noseTip") {
          context.fillStyle = "rgba(255, 255, 255, 0.8)";
          context.font = "bold 8px Courier New, monospace";
          context.fillText("TRACKING_NODE_0x2A", x + 8, y);
        }
      });

      // Sweeping green/red biometric scanner laser line
      const sweepY = cy - 100 + ((frame * 2.5) % 200);
      context.fillStyle = "rgba(255, 0, 0, 0.08)";
      context.fillRect(0, sweepY - 15, w, 15);
      
      context.strokeStyle = "#FF3333";
      context.lineWidth = 2.5;
      context.beginPath();
      context.moveTo(0, sweepY);
      context.lineTo(w, sweepY);
      context.stroke();

      // Extra tech overlays on scanner
      context.fillStyle = "rgba(255, 51, 51, 0.8)";
      context.font = "bold 8px Courier New, sans-serif";
      context.fillText("BIOMETRIC SCAN INTENSITY: 98.4%", 20, sweepY - 5);

      // Orbital target tracking circles
      context.strokeStyle = "#FFD700";
      context.lineWidth = 1;
      context.beginPath();
      context.arc(points.eyeL[0], points.eyeL[1], 15 + Math.sin(frame * 0.1) * 3, 0, Math.PI * 2);
      context.arc(points.eyeR[0], points.eyeR[1], 15 + Math.sin(frame * 0.1) * 3, 0, Math.PI * 2);
      context.stroke();

      // Match rate readout
      context.fillStyle = "#FFFFFF";
      context.font = "bold 13px 'Courier New', monospace";
      context.fillText(`SYS.DECOMP: IDENTIFIED_GURNOOR`, cx - 110, cy - 105);
      context.fillStyle = "#FFD700";
      context.fillText(`SECURE PASSCODE: [${Math.floor(89999 + Math.random() * 10000)}]`, cx - 110, cy - 90);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [isVirtual, cameraState]);

  // Start the webcam feed
  const startCamera = async (forceSimulated = false) => {
    setCapturedImage(null);
    setErrorMessage("");

    if (forceSimulated) {
      setIsVirtual(true);
      setCameraState("active");
      return;
    }

    setCameraState("loading");
    setIsVirtual(false);

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
      
      // Keep a mini error notifier in state so they know they are using the virtual backup
      const errName = err.name || "Default";
      setErrorMessage(`HARDWARE ACCESS PORT CLOSED (${errName}). INTEGRATING EMULATED CYBER BIOMETRIC NODE.`);
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

  return (
    <section id="hacker-cam" className="py-20 bg-black border-t-8 border-brand-red text-white flex flex-col items-center">
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
                      <Camera className="w-8 h-8 animate-pulse" />
                    </div>
                    <div>
                      <span className="font-mono text-xs uppercase tracking-widest text-brand-red font-black block mb-1">
                        INITIALIZATION STAGE READY
                      </span>
                      <p className="text-[10px] text-neutral-500 max-w-sm uppercase font-mono leading-relaxed">
                        To lock credentials, click to initiate your camera stream or run the simulated cyber biometric mask immediately.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => startCamera(false)}
                        className="bg-brand-red text-black font-black font-mono text-xs px-5 py-3 hover:bg-red-500 rounded flex items-center justify-center gap-2 transition-all uppercase tracking-wider"
                      >
                        <Play className="w-4 h-4" /> Real Webcam Feed
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
                      ACQUIRING WEBCAM GRID SIGNAL...
                    </span>
                  </div>
                )}

                {/* Webcam real video feed elements */}
                {cameraState === "active" && !isVirtual && !capturedImage && (
                  <div className="relative w-full h-full">
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      autoPlay
                      className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                      style={getFilterStyle(activeFilter)}
                    />
                    
                    {/* Cyber overlay elements */}
                    <div className="absolute inset-0 border-2 border-brand-red/35 pointer-events-none p-4 flex flex-col justify-between">
                      <div className="flex justify-between text-brand-red font-mono text-[9px] font-bold">
                        <span>[ HARDWARE_PORT_ACTIVE ]</span>
                        <span>[ SECURITY_HUD ]</span>
                      </div>
                      
                      {/* Technical targeting crosshair */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                        <div className="w-12 h-12 border border-dashed border-brand-yellow rounded-full animate-spin duration-7000" />
                        <div className="absolute w-2.5 h-2.5 bg-brand-red rounded-full" />
                      </div>

                      <div className="flex justify-between items-end text-neutral-400 font-mono text-[8px] uppercase">
                        <div>
                          <p>SCANMODE: {activeFilter.toUpperCase()}</p>
                          <p>TARGETING: LOCK</p>
                        </div>
                        <div className="text-right">
                          <p>SECURE: ENC</p>
                          <p>RATE: {telemetry.fps}FPS</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Virtual Biometric Face Simulator Canvas */}
                {cameraState === "active" && isVirtual && !capturedImage && (
                  <div className="relative w-full h-full">
                    <canvas
                      ref={virtualCanvasRef}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={getFilterStyle(activeFilter)}
                    />

                    {/* Cyber overlay elements duplication for design parity */}
                    <div className="absolute inset-0 border-2 border-brand-yellow/35 pointer-events-none p-4 flex flex-col justify-between">
                      <div className="flex justify-between text-brand-yellow font-mono text-[9px] font-bold">
                        <span>[ EMULATION_NODE_SECURE ]</span>
                        <span>[ VIRTUAL_MESH_ACTIVE ]</span>
                      </div>

                      {/* Visual coordinates tracking */}
                      <div className="flex justify-between items-end text-neutral-400 font-mono text-[8px] uppercase">
                        <div>
                          <p>EMULATOR: ACTIVE</p>
                          <p>FILTER: {activeFilter.toUpperCase()}</p>
                        </div>
                        <div className="text-right">
                          <p>PORT: SIM_DECK</p>
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
