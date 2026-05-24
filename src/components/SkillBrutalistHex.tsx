import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Terminal,
  Shield,
  Cpu,
  Sparkles,
  Filter,
  Zap,
  ShieldAlert,
  CpuIcon,
} from "lucide-react";
import { portfolioData, Skill } from "../data/portfolioData";

export default function SkillBrutalistHex() {
  const skills = portfolioData.skills;
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [testedSkill, setTestedSkill] = useState<Skill | null>(null);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<string>("");

  const categories = [
    { id: "all", label: "ALL ABILITIES", icon: Filter },
    { id: "cybersecurity", label: "CYBERSECURITY", icon: Shield },
    { id: "development", label: "DEVELOPMENT", icon: Cpu },
    { id: "design", label: "DESIGN & MEDIA", icon: Sparkles },
    { id: "marketing", label: "MARKETING & CRYPTO", icon: Zap },
  ];

  const filteredSkills =
    activeCategory === "all"
      ? skills
      : skills.filter((s) => s.category === activeCategory);

  const triggerSkillDiagnostic = (skill: Skill) => {
    setTestedSkill(skill);
    setIsTesting(true);
    setTestResult("");

    const terminalSteps = [
      `Initializing telemetry for [${skill.name.toUpperCase()}]`,
      `Injecting test audit blocks into sandboxed memory...`,
      `Validating structural accuracy... CODE MATCHES ARCHITECTURE SPEC.`,
      `Analyzing threat level resistance indices...`,
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < terminalSteps.length) {
        setTestResult((prev) => prev + `\n> ${terminalSteps[step]}`);
        step++;
      } else {
        clearInterval(interval);
        setIsTesting(false);
        // Calculate random high-fidelity index centered around actual skill score
        const finalScore = Math.min(
          100,
          Math.floor(skill.level + Math.random() * 5),
        );
        setTestResult(
          (prev) =>
            prev +
            `\n\n[SUCCESS] DIAGNOSTIC LOG COMPLETE!\nPASS LEVEL: SECURE\nEVALUATION RATING: ${finalScore}% IMPACT LEVEL\nRESOURCE ALLOCATION STRENGTH: VERIFIED EXCELLENT.`,
        );
      }
    }, 550);
  };

  return (
    <section
      id="skills"
      className="py-24 bg-black relative border-b-8 border-brand-yellow"
    >
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-20" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-neutral-900 pb-8 mb-12">
          <div>
            <span className="font-mono text-xs text-brand-yellow tracking-[0.3em] uppercase block mb-2">
              [ CADRE ABILITIES ]
            </span>
            <h2 className="text-5xl sm:text-7xl font-display font-black tracking-tighter text-white uppercase italic drop-shadow-[5px_5px_0px_#FFD700]">
              ABILITIES &{" "}
              <span className="text-brand-red drop-shadow-[5px_5px_0px_#FFD700]">
                SKILLS
              </span>
            </h2>
          </div>
          <p className="mt-4 md:mt-0 font-mono text-[10px] text-neutral-500 uppercase max-w-sm md:text-right leading-relaxed">
            Continuous threat emulation matrix covering full stack client
            development, deep security hardening, and digital crypto assets.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2.5 mb-10 select-none">
          {categories.map((cat) => {
            const CatIcon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setTestedSkill(null);
                  setTestResult("");
                }}
                className={`flex items-center gap-2 px-4 py-2.5 font-mono text-xs font-black uppercase tracking-wider rounded transition-all border-2 ${
                  isSelected
                    ? "bg-brand-red text-white border-brand-red shadow-[4px_4px_0px_#FFD700]"
                    : "bg-neutral-950 text-neutral-400 border-neutral-850 hover:text-brand-yellow hover:border-brand-yellow hover:shadow-[3px_3px_0px_#FF0000]"
                }`}
              >
                <CatIcon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Grid layout containing cards + testing terminal side */}
        <div className="grid grid-cols-12 gap-8">
          {/* Left: Skills list (staggered animation) */}
          <div
            className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6"
            style={{ perspective: "1000px" }}
          >
            <AnimatePresence mode="popLayout">
              {filteredSkills.map((skill, index) => {
                const isTested = testedSkill?.name === skill.name;
                return (
                  <motion.div
                    key={skill.name}
                    id={`skill-${index}`}
                    layout
                    initial={{
                      opacity: 0,
                      scale: 0.8,
                      rotateX: 15,
                      translateZ: -100,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      rotateX: 0,
                      translateZ: 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.8,
                      rotateX: -15,
                      translateZ: -100,
                    }}
                    transition={{ duration: 0.4 }}
                    whileHover={{
                      rotateX: 6,
                      rotateY: -6,
                      scale: 1.025,
                      translateZ: 15,
                      boxShadow: "0 20px 40px -10px rgba(255, 0, 0, 0.2)",
                    }}
                    style={{ transformStyle: "preserve-3d" }}
                    className={`bg-zinc-950 p-6 border-4 rounded-lg flex flex-col justify-between transition-all group ${
                      isTested
                        ? "border-brand-red shadow-[6px_6px_0px_#FFD700]"
                        : "border-neutral-900 hover:border-[#FFD700] hover:shadow-[6px_6px_0px_#FF0000]"
                    }`}
                  >
                    <div>
                      {/* Title line */}
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-display font-black text-lg text-white group-hover:text-brand-yellow transition-colors uppercase leading-tight italic">
                          {skill.name}
                        </h3>
                        <span className="font-mono text-xs font-black text-brand-red bg-red-950/40 px-2 py-0.5 rounded border border-brand-red/30">
                          {skill.level}%
                        </span>
                      </div>

                      <p className="text-neutral-400 text-xs font-sans mb-5 leading-normal">
                        {skill.details}
                      </p>
                    </div>

                    {/* Industrial Index Bar */}
                    <div className="space-y-4">
                      <div className="h-2.5 w-full bg-black rounded-sm overflow-hidden flex gap-[2px] p-0.5 border border-neutral-900">
                        {Array.from({ length: 15 }).map((_, segmentIdx) => {
                          const percentageRepresented = (segmentIdx / 15) * 100;
                          const isActiveSegment =
                            percentageRepresented < skill.level;
                          return (
                            <div
                              key={segmentIdx}
                              className={`h-full flex-1 rounded-sm transition-all duration-500 ${
                                isActiveSegment
                                  ? skill.category === "cybersecurity"
                                    ? "bg-brand-red"
                                    : "bg-brand-yellow"
                                  : "bg-neutral-950"
                              }`}
                            />
                          );
                        })}
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-neutral-900">
                        <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest leading-none font-bold">
                          CAPABILITY AREA // 0{index + 1}
                        </span>

                        <button
                          onClick={() => triggerSkillDiagnostic(skill)}
                          className="font-mono text-[9px] font-black text-neutral-400 hover:text-brand-red uppercase flex items-center gap-1 transition-colors bg-black px-2 py-1 rounded border border-neutral-900 hover:border-brand-red"
                        >
                          <Terminal className="w-3 h-3 text-brand-yellow" />
                          RUN TEST
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Right: Simulated active testing diagnostic monitor */}
          <div
            className="col-span-12 lg:col-span-4 select-none"
            style={{ perspective: "1500px" }}
          >
            <motion.div
              whileHover={{
                rotateX: 5,
                rotateY: 5,
                translateZ: 18,
                scale: 1.01,
                boxShadow: "0 25px 50px -12px rgba(255, 215, 0, 0.2)",
              }}
              style={{ transformStyle: "preserve-3d" }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              className="sticky top-6 bg-zinc-950 border-4 border-brand-red rounded-lg p-6 shadow-2xl h-[470px] flex flex-col justify-between shadow-[10px_10px_0px_#FFD700]"
            >
              <div>
                <div className="flex items-center justify-between border-b border-neutral-900 pb-3.5 mb-4">
                  <span className="font-mono text-[10px] text-brand-red font-black uppercase tracking-widest flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-glow-red animate-pulse" />{" "}
                    TARGET COGPILOT DIAGNOSTICS
                  </span>
                  <span className="font-mono text-[9px] text-[#FFD700] font-black">
                    [ACTIVE]
                  </span>
                </div>

                {testedSkill ? (
                  <div>
                    <span className="font-mono text-[9px] text-neutral-500 block">
                      TESTED ENTITY:
                    </span>
                    <span className="font-display text-base font-black text-white uppercase block mt-0.5 tracking-tight border-b border-neutral-900 pb-2">
                      {testedSkill.name}
                    </span>

                    {/* Live Stream Stream */}
                    <div className="mt-4 bg-black p-4 border border-neutral-900 rounded font-mono text-[11px] leading-relaxed text-brand-yellow h-[220px] overflow-y-auto whitespace-pre-wrap">
                      {testResult}
                      {isTesting && (
                        <span className="inline-block w-2.5 h-3.5 bg-brand-yellow ml-1 animate-pulse" />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-neutral-800 rounded bg-black/40">
                    <CpuIcon className="w-10 h-10 text-neutral-700 animate-spin mb-4" />
                    <span className="font-mono text-xs text-neutral-500 uppercase tracking-wider block">
                      NO ACTIVE SKILL AUDITING
                    </span>
                    <p className="font-sans text-[11px] text-neutral-600 mt-2 max-w-[200px] leading-normal">
                      Click "RUN TEST" on any capability card to trigger
                      automated validation testing.
                    </p>
                  </div>
                )}
              </div>

              {/* Console Footing indicator */}
              <div className="border-t border-neutral-900 pt-3 flex items-center justify-between text-[10px] font-mono text-neutral-500 uppercase leading-none">
                <span>STABILITY VERIFICATION RANGE</span>
                <span className="text-red-500 font-bold">100% OK</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
