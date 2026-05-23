import React, { useState, useEffect } from 'react';
import { Globe, Radio, Signal, Wifi, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NodeActivity {
  id: number;
  ip: string;
  location: string;
  status: "active" | "breached" | "defending";
  x: number; // Percentage X for map
  y: number; // Percentage Y for map
}

export default function CyberTracker() {
  const [nodes, setNodes] = useState<NodeActivity[]>([]);
  const [scanActive, setScanActive] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const locations = [
    { loc: "TOKYO_JP", x: 80, y: 35 },
    { loc: "LONDON_UK", x: 45, y: 30 },
    { loc: "NEW_YORK_US", x: 25, y: 35 },
    { loc: "FRANKFURT_DE", x: 50, y: 30 },
    { loc: "SINGAPORE_SG", x: 75, y: 55 },
    { loc: "SYDNEY_AU", x: 85, y: 75 },
    { loc: "SAO_PAULO_BR", x: 33, y: 70 },
    { loc: "MUMBAI_IN", x: 68, y: 50 },
  ];

  const generateRandomIP = () => {
    return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  };

  useEffect(() => {
    if (!scanActive) return;

    // Simulate scan progress
    const progressInterval = setInterval(() => {
      setScanProgress(p => {
        if (p >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => setScanActive(false), 2000);
          return 100;
        }
        return p + 2;
      });
    }, 100);

    // Simulate discovering nodes
    const nodeInterval = setInterval(() => {
      setNodes(current => {
        if (current.length >= 8) return current;
        
        const locMap = locations[current.length % locations.length];
        const statusRandom = Math.random();
        
        const newNode: NodeActivity = {
          id: Date.now(),
          ip: generateRandomIP(),
          location: locMap.loc,
          status: statusRandom > 0.8 ? "breached" : statusRandom > 0.4 ? "active" : "defending",
          x: locMap.x + (Math.random() * 4 - 2), // Slight random offset
          y: locMap.y + (Math.random() * 4 - 2),
        };
        
        return [...current, newNode];
      });
    }, 800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(nodeInterval);
    };
  }, [scanActive]);

  const initiateSweep = () => {
    setScanActive(true);
    setScanProgress(0);
    setNodes([]);
  };

  return (
    <section className="py-20 bg-black border-y border-neutral-900 font-mono text-white">
      <div className="w-full max-w-6xl mx-auto px-4">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-brand-red text-xs font-black tracking-widest mb-2 border border-brand-red/30 px-3 py-1 rounded bg-brand-red/10">
              <Globe className="w-3.5 h-3.5" /> GLOBAL NETWORK THREAT MAP
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">
              Dark Web <span className="text-neutral-500">Node Sweep</span>
            </h2>
          </div>
          
          <button 
            onClick={initiateSweep}
            disabled={scanActive}
            className="bg-brand-red text-black font-black text-xs px-6 py-3 rounded uppercase flex items-center gap-2 hover:bg-red-500 transition-colors disabled:opacity-50 border-2 border-red-900 focus:outline-none"
          >
            {scanActive ? <Activity className="w-4 h-4 animate-pulse" /> : <RadarScanIcon />}
            {scanActive ? "Sweeping Frequencies..." : "Initiate Global Sweep"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Map Viewer */}
          <div className="lg:col-span-3 bg-neutral-950 border-2 border-neutral-800 rounded relative overflow-hidden h-[400px] flex items-center justify-center p-2">
            
            {/* World Map Grid Style Background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" 
                 style={{ 
                   backgroundImage: 'linear-gradient(rgba(255, 0, 0, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 0, 0, 0.2) 1px, transparent 1px)',
                   backgroundSize: '40px 40px' 
                 }}>
            </div>

            {/* Simulated Continents abstract layout */}
            <div className="absolute w-[80%] h-[70%] border border-neutral-800 rounded-full opacity-10 pointer-events-none" />
            <div className="absolute w-[60%] h-[50%] border border-neutral-700 rounded-full opacity-15 pointer-events-none" />
            
            {/* Radar Sweep Effect */}
            {scanActive && (
              <motion.div 
                className="absolute inset-0 rounded-full origin-center border-t-2 border-r-2 border-brand-red/40"
                style={{ width: '150%', height: '150%', left: '-25%', top: '-25%' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            )}

            {/* Render Nodes */}
            <AnimatePresence>
              {nodes.map(node => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute flex flex-col items-center pointer-events-none"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                >
                  <div className="relative flex items-center justify-center">
                    {/* Ping ripple */}
                    <div className={`absolute w-8 h-8 rounded-full animate-ping opacity-50 ${
                      node.status === 'breached' ? 'bg-brand-red' : 
                      node.status === 'defending' ? 'bg-brand-yellow' : 'bg-green-500'
                    }`} />
                    {/* Core Point */}
                    <div className={`w-3 h-3 rounded-full relative z-10 ${
                      node.status === 'breached' ? 'bg-brand-red shadow-[0_0_10px_red]' : 
                      node.status === 'defending' ? 'bg-brand-yellow shadow-[0_0_10px_yellow]' : 'bg-green-500 bg-green-500 shadow-[0_0_10px_lime]'
                    }`} />
                  </div>
                  <div className="mt-2 bg-black/80 backdrop-blur border border-neutral-800 px-2 py-1 rounded text-[8px] whitespace-nowrap text-center">
                    <span className="block text-white font-bold">{node.location}</span>
                    <span className={`block ${
                      node.status === 'breached' ? 'text-brand-red' : 
                      node.status === 'defending' ? 'text-brand-yellow' : 'text-green-500'
                    }`}>
                      {node.ip}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {!scanActive && nodes.length === 0 && (
              <div className="text-neutral-600 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <Wifi className="w-4 h-4 opacity-50" /> System Standby. Awaiting command.
              </div>
            )}
          </div>

          {/* Right Data List */}
          <div className="bg-neutral-950 border-2 border-neutral-800 rounded flex flex-col h-[400px]">
            <div className="p-3 border-b border-neutral-800 flex justify-between items-center bg-neutral-900">
              <span className="text-[10px] font-bold text-neutral-400 uppercase">Live Intercepts</span>
              <span className="text-[10px] font-bold text-brand-red">{nodes.length} FOUND</span>
            </div>
            
            {scanActive && (
               <div className="px-3 py-2 bg-brand-red/10 border-b border-brand-red/20">
                 <div className="flex justify-between text-[8px] mb-1 font-bold text-brand-red">
                   <span>SCAN PROGRESS</span>
                   <span>{scanProgress}%</span>
                 </div>
                 <div className="h-1 bg-black rounded w-full overflow-hidden">
                    <div className="h-full bg-brand-red" style={{ width: `${scanProgress}%` }} />
                 </div>
               </div>
            )}

            <div className="flex-grow p-3 overflow-y-auto custom-scrollbar space-y-2">
              {nodes.map((node) => (
                <div key={node.id} className="text-[9px] border border-neutral-800 bg-black p-2 rounded flex flex-col gap-1">
                  <div className="flex justify-between items-center border-b border-neutral-800 pb-1 mb-1">
                    <span className="text-white font-bold">{node.location}</span>
                    <span className={`uppercase font-bold tracking-widest ${
                      node.status === 'breached' ? 'text-brand-red animate-pulse' : 
                      node.status === 'defending' ? 'text-brand-yellow' : 'text-green-500'
                    }`}>
                      {node.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>IP: {node.ip}</span>
                    <span>PING: {Math.floor(Math.random() * 150) + 10}ms</span>
                  </div>
                </div>
              ))}
              
              {!scanActive && nodes.length === 0 && (
                <div className="h-full flex items-center justify-center text-[10px] text-neutral-600 text-center uppercase p-4">
                  No intercepts detected in current airspace. Run sweep to populate.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function RadarScanIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 12v.01" />
      <path d="M19.071 4.929a10 10 0 0 0-14.142 0" />
      <path d="M16.243 7.757a6 6 0 0 0-8.486 0" />
      <path d="M13.414 10.586a2 2 0 0 0-2.828 0" />
    </svg>
  );
}
