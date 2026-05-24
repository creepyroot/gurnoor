import React, { useRef, useState, useEffect } from "react";
import { Database, RefreshCcw, Hand } from "lucide-react";
import FullscreenBtn from "./FullscreenBtn";
import { playSound } from "../utils/audio";

export default function CyberClicker() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bytes, setBytes] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [bps, setBps] = useState(0); // bytes per second
  const [upgrades, setUpgrades] = useState({
    script: 0,
    botnet: 0,
    mainframe: 0,
  });

  const COSTS = {
    script: 50 * Math.pow(1.5, upgrades.script),
    botnet: 500 * Math.pow(1.5, upgrades.botnet),
    mainframe: 5000 * Math.pow(1.5, upgrades.mainframe),
    power: 200 * Math.pow(2, clickPower - 1),
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (bps > 0) {
        setBytes((b) => b + bps / 10); // Update 10x a second for smoothness
      }
    }, 100);
    return () => clearInterval(interval);
  }, [bps]);

  const updateBps = (u: typeof upgrades) => {
    setBps(u.script * 2 + u.botnet * 20 + u.mainframe * 100);
  };

  const handleMainClick = (e: React.MouseEvent) => {
    setBytes((b) => b + clickPower);
    playSound("beep");

    // Spawn floaty text effect
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const floaty = document.createElement("div");
    floaty.textContent = `+${clickPower}`;
    floaty.className =
      "absolute pointer-events-none text-brand-yellow font-black font-mono animate-[floatUp_0.8s_ease-out_forwards]";
    floaty.style.left = `${x}px`;
    floaty.style.top = `${y}px`;
    btn.appendChild(floaty);
    setTimeout(() => floaty.remove(), 800);
  };

  const buyItem = (type: "script" | "botnet" | "mainframe" | "power") => {
    const cost = Math.floor(COSTS[type]);
    if (bytes >= cost) {
      playSound("win");
      setBytes((b) => b - cost);
      if (type === "power") {
        setClickPower((cp) => cp + 1);
      } else {
        const newU = { ...upgrades, [type]: upgrades[type] + 1 };
        setUpgrades(newU);
        updateBps(newU);
      }
    } else {
      playSound("hit");
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative py-20 bg-neutral-950 font-mono border-t-4 border-brand-yellow min-h-[600px] flex justify-center text-white"
    >
      <FullscreenBtn targetRef={containerRef} />

      <div className="w-full max-w-4xl px-4 grid grid-cols-1 md:grid-cols-2 gap-8 z-10">
        {/* Left Side: Clicker */}
        <div className="text-center flex flex-col items-center justify-center p-8 border border-neutral-800 bg-black rounded relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.05)_0,transparent_60%)] pointer-events-none" />

          <div className="inline-flex items-center gap-2 text-brand-yellow font-black tracking-widest text-xs mb-8 border border-brand-yellow/30 px-3 py-1 bg-brand-yellow/10">
            <Database className="w-4 h-4" /> CYBER CLICKER MINER
          </div>

          <div className="text-5xl md:text-7xl font-black text-white drop-shadow-[5px_5px_0px_#FFD700] mb-2 font-display italic">
            {Math.floor(bytes).toLocaleString()}
          </div>
          <div className="text-neutral-400 font-bold tracking-widest uppercase mb-12">
            Total Bytes Extracted
          </div>

          <div className="text-cyan-400 font-bold bg-cyan-900/30 px-4 py-2 border border-cyan-800 rounded-full mb-8">
            {Math.floor(bps).toLocaleString()} bytes / sec
          </div>

          <button
            onClick={handleMainClick}
            className="w-48 h-48 rounded-full border-4 border-brand-yellow bg-neutral-900 shadow-[0_0_50px_rgba(255,215,0,0.2)] hover:shadow-[0_0_80px_rgba(255,215,0,0.4)] hover:bg-neutral-800 transition-all hover:scale-105 active:scale-95 flex flex-col items-center justify-center relative select-none touch-none"
          >
            <Hand className="w-16 h-16 text-brand-yellow mb-2" />
            <span className="font-black">
              HACK <br /> PORTAL
            </span>
          </button>
        </div>

        {/* Right Side: Store */}
        <div className="flex flex-col gap-4 border border-neutral-800 bg-black p-6 rounded relative h-[500px] overflow-y-auto">
          <h3 className="text-xl font-black text-brand-red border-b border-neutral-800 pb-2 mb-4 uppercase sticky top-0 bg-black z-10">
            Black Market Store
          </h3>

          <UpgradeBtn
            name="Manual Override (Power)"
            desc={`+1 byte per click. (Curr: ${clickPower})`}
            cost={Math.floor(COSTS.power)}
            canAfford={bytes >= COSTS.power}
            onBuy={() => buyItem("power")}
          />
          <UpgradeBtn
            name="Basic Script"
            desc={`Auto-hacks 2 bps. (Owned: ${upgrades.script})`}
            cost={Math.floor(COSTS.script)}
            canAfford={bytes >= COSTS.script}
            onBuy={() => buyItem("script")}
          />
          <UpgradeBtn
            name="Zombie Botnet"
            desc={`Auto-hacks 20 bps. (Owned: ${upgrades.botnet})`}
            cost={Math.floor(COSTS.botnet)}
            canAfford={bytes >= COSTS.botnet}
            onBuy={() => buyItem("botnet")}
          />
          <UpgradeBtn
            name="Quantum Mainframe"
            desc={`Auto-hacks 100 bps. (Owned: ${upgrades.mainframe})`}
            cost={Math.floor(COSTS.mainframe)}
            canAfford={bytes >= COSTS.mainframe}
            onBuy={() => buyItem("mainframe")}
          />
        </div>
      </div>
    </section>
  );
}

function UpgradeBtn({ name, desc, cost, canAfford, onBuy }: any) {
  return (
    <button
      onClick={onBuy}
      disabled={!canAfford}
      className={`p-4 border-2 text-left rounded transition-all flex justify-between items-center ${
        canAfford
          ? "border-brand-yellow bg-neutral-900 hover:bg-neutral-800 cursor-pointer shadow-[cascade_shadow]"
          : "border-neutral-800 bg-neutral-950 opacity-50 cursor-not-allowed"
      }`}
    >
      <div>
        <div className="font-black text-white uppercase">{name}</div>
        <div className="text-neutral-400 text-xs mt-1">{desc}</div>
      </div>
      <div
        className={`font-black ${canAfford ? "text-brand-yellow" : "text-neutral-500"}`}
      >
        {cost.toLocaleString()} B
      </div>
    </button>
  );
}
