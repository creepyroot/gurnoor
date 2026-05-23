import React from "react";
import { motion } from "motion/react";
import { ShieldAlert, Cpu, Sparkles, Binary, Terminal } from "lucide-react";
import { portfolioData } from "../data/portfolioData";

export default function Philosophies() {
  const motto = portfolioData.personalInfo.motto;

  const coreMottos = [
    {
      label: "MINDSET",
      title: "THINKING LIKE AN ATTACKER",
      desc: "Probing architectures from an adversary's perspective to uncover unpatched vulnerabilities, logic bypasses, and zero-day risks.",
      icon: ShieldAlert,
      color: "red",
      tag: "THEME: RED TEAM / RECON",
      bentoSpan: "col-span-12 md:col-span-4",
      accentBg: "bg-red-950/20",
      border: "border-brand-red shadow-[6px_6px_0px_#FFD700]",
      accentText: "text-brand-red",
      bulletText: [
        "Systematic defensive audits",
        "Threat matrix emulation",
        "Logic & authentication checks"
      ]
    },
    {
      label: "SECURITY",
      title: "BUILDING LIKE AN ENGINEER",
      desc: "Translating security research into production systems with high-reliability automations and custom redundant storage pipelines.",
      icon: Cpu,
      color: "yellow",
      tag: "THEME: DEFENSIVE ENGINEERING",
      bentoSpan: "col-span-12 md:col-span-4",
      accentBg: "bg-yellow-950/20",
      border: "border-brand-yellow shadow-[6px_6px_0px_#FF0000]",
      accentText: "text-brand-yellow",
      bulletText: [
        "Custom storage arrays (NAS)",
        "Automated python scripts",
        "Resilient middleware APIs"
      ]
    },
    {
      label: "DESIGN",
      title: "DESIGNING LIKE A CREATOR",
      desc: "Crafting beautiful, responsive interfaces with precise typographic scale constraints and interactive animations.",
      icon: Sparkles,
      color: "amber",
      tag: "THEME: HUMAN-CENTRIC INTERACTION",
      bentoSpan: "col-span-12 md:col-span-4",
      accentBg: "bg-neutral-900",
      border: "border-neutral-700 shadow-[6px_6px_0px_#FFD700]",
      accentText: "text-brand-yellow",
      bulletText: [
        "High-contrast frameworks",
        "Pixel-perfect responsive grids",
        "Immersive interactive states"
      ]
    }
  ];

  return (
    <section id="philosophy" className="py-24 bg-black relative border-b-8 border-brand-red">
      {/* Decorative cyber grid lines */}
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-20" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-neutral-900 pb-8 mb-12">
          <div>
            <span className="font-mono text-xs text-brand-red tracking-[0.3em] uppercase block mb-2">[ CORE PARADIGM ]</span>
            <h2 className="text-5xl sm:text-7xl font-display font-black tracking-tighter text-white uppercase italic drop-shadow-[5px_5px_0px_#FF0000]">
              PHILOSOPHIES & <span className="text-brand-yellow drop-shadow-[5px_5px_0px_#FF0000]">MOTTO</span>
            </h2>
          </div>
          <p className="mt-4 md:mt-0 font-mono text-[10px] text-neutral-500 uppercase max-w-xs md:text-right leading-relaxed">
            A polymath mindset combining offensive security strategy with architectural engineering blueprints.
          </p>
        </div>

        {/* Intro profile statement */}
        <div className="grid grid-cols-12 gap-8 mb-16">
          <div className="col-span-12 lg:col-span-5 flex flex-col justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-zinc-950 p-8 border-l-[6px] border-brand-yellow border-t-2 border-r-2 border-b-2 border-neutral-950 rounded-sm relative shadow-[8px_8px_0px_#FF0000]"
            >
              <div className="absolute top-3 right-3 flex items-center space-x-1 font-mono text-[8px] text-neutral-500">
                <Binary className="w-3.5 h-3.5 text-brand-yellow" />
                <span>PROFILEID: #CREEPYROOT</span>
              </div>
              <h3 className="text-xl font-display font-black text-white mb-4 uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 bg-brand-yellow rounded-full animate-ping"></span>
                THE POLYMATH PERSPECTIVE
              </h3>
              <p className="text-neutral-400 font-sans text-sm leading-relaxed">
                {portfolioData.personalInfo.bio}
              </p>
            </motion.div>
          </div>

          <div className="col-span-12 lg:col-span-7 grid grid-cols-3 gap-4 font-mono text-xs text-neutral-500 bg-neutral-950/40 p-4 border border-neutral-900 rounded-sm select-none">
            <div className="p-4 border border-neutral-900 bg-black shadow-[4px_4px_0px_#FF0000]">
              <span className="text-brand-red font-bold block mb-2">01 / RECONNAISSANCE</span>
              Every security breach starts by observing target logic. The mind must think without limits or guardrails.
            </div>
            <div className="p-4 border border-neutral-900 bg-black shadow-[4px_4px_0px_#FFD700]">
              <span className="text-brand-yellow font-bold block mb-2">02 / DESTRUCTION</span>
              Deconstructing software systems allows us to rebuild them with zero vulnerabilities.
            </div>
            <div className="p-4 border border-neutral-900 bg-black shadow-[4px_4px_0px_#FFFFFF]">
              <span className="text-white font-bold block mb-2">03 / FABRICATION</span>
              A coder must be an artist. Writing lines of logic that represent beautiful visual frameworks.
            </div>
          </div>
        </div>

        {/* Bento Motto Cards with Hover Interaction */}
        <div className="grid grid-cols-12 gap-6" style={{ perspective: "1500px" }}>
          {coreMottos.map((m, index) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, scale: 0.82, rotateX: 18, rotateY: -10, translateZ: -150, y: 60 }}
                whileInView={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0, translateZ: 0, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
                whileHover={{ 
                  rotateX: 8, 
                  rotateY: -8, 
                  translateZ: 20,
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(255, 0, 0, 0.25)"
                }}
                style={{ transformStyle: "preserve-3d" }}
                className={`${m.bentoSpan} bg-neutral-950 ${m.accentBg} p-8 border-2 ${m.border} rounded-lg flex flex-col justify-between group transition-all duration-300 relative overflow-hidden`}
              >
                {/* Visual grid decor inside cards */}
                <div className="absolute right-0 bottom-0 top-1/2 left-1/2 opacity-[0.03] scale-150 pointer-events-none text-white overflow-hidden uppercase font-mono">
                  MATRIX CONTROL DISCLOSURE SECURE BLUEPRINT
                </div>

                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-mono text-xs tracking-wider bg-black/80 px-2.5 py-1 text-neutral-400 border border-neutral-800 rounded">
                      {m.tag}
                    </span>
                    <Icon className={`w-8 h-8 ${m.accentText} group-hover:scale-110 transition-transform duration-300`} />
                  </div>

                  <h3 className="font-display font-black text-2xl text-white mb-2 tracking-tight group-hover:text-brand-yellow transition-colors uppercase italic">
                    {m.title}
                  </h3>
                  
                  <p className="text-xs text-neutral-400 font-sans leading-relaxed mb-6">
                    {m.desc}
                  </p>
                </div>

                <div className="border-t border-neutral-900 pt-4 mt-4 bg-black/40 p-3 rounded">
                  <span className="font-mono text-[9px] text-neutral-500 block mb-2 tracking-widest uppercase">CAPABILITY PARADIGM:</span>
                  <ul className="space-y-1">
                    {m.bulletText.map((bullet, idx) => (
                      <li key={idx} className="flex items-center text-[11px] font-mono text-neutral-300">
                        <span className={`w-1.5 h-1.5 rounded-full ${m.color === 'red' ? 'bg-brand-red' : m.color === 'yellow' ? 'bg-brand-yellow' : 'bg-brand-yellow'} mr-2`} />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
