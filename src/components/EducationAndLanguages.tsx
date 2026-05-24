import React, { useState } from "react";
import { motion } from "motion/react";
import {
  GraduationCap,
  Award,
  BookOpen,
  Globe,
  CheckCircle,
} from "lucide-react";
import { portfolioData } from "../data/portfolioData";

export default function EducationAndLanguages() {
  const education = portfolioData.education;
  const languages = portfolioData.languages;
  const [activeLanguage, setActiveLanguage] = useState<string>("English");

  // Custom descriptions to make languages super high-fidelity
  const languageSpecs: Record<
    string,
    { fluency: string; usage: string; cryptoKey: string }
  > = {
    English: {
      fluency: "NATIVE STRENGTH / HIGHEST PROFESSIONAL PROFICIENCY",
      usage:
        "System documentation, vulnerability write-ups, clean codebase development, and client dialogue.",
      cryptoKey: "ENG_CORE_ACTIVE",
    },
    Hindi: {
      fluency: "NATIVE STRENGTH / NATIVE BILINGUAL COLLABORATOR",
      usage:
        "Project management, localized leadership, team sync, and nation-wide strategic deployments.",
      cryptoKey: "HIN_CORE_ACTIVE",
    },
    Punjabi: {
      fluency: "NATIVE STRENGTH / BILINGUAL HERITAGE LANGUAGE",
      usage:
        "Cultural fluency, community cooperation, and local cohort alignment.",
      cryptoKey: "PAN_CORE_ACTIVE",
    },
  };

  return (
    <section
      id="education"
      className="py-24 bg-black relative border-b-8 border-brand-red"
    >
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-20" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-neutral-900 pb-8 mb-16">
          <div>
            <span className="font-mono text-xs text-brand-red tracking-[0.3em] uppercase block mb-2">
              [ DOSSIER CREDENTIALS ]
            </span>
            <h2 className="text-5xl sm:text-7xl font-display font-black tracking-tighter text-white uppercase italic drop-shadow-[5px_5px_0px_#FFD700]">
              EDUCATION &{" "}
              <span className="text-brand-yellow drop-shadow-[5px_5px_0px_#FF0000]">
                LANGUAGES
              </span>
            </h2>
          </div>
          <p className="mt-4 md:mt-0 font-mono text-[10px] text-neutral-500 uppercase max-w-sm md:text-right leading-relaxed font-bold">
            Academic pathways and regional verbal competencies tracking secure
            computer science theory and language assets.
          </p>
        </div>

        {/* Outer Split frame */}
        <div className="grid grid-cols-12 gap-8">
          {/* Left: Academic milestones cards */}
          <div
            className="col-span-12 lg:col-span-12 xl:col-span-7 space-y-6"
            style={{ perspective: "1500px" }}
          >
            <span className="font-mono text-[9px] text-[#FFD700] font-black uppercase mb-2 block tracking-widest font-bold">
              ACADEMIC TRAINING DOSSIER
            </span>

            {education.map((edu, idx) => (
              <motion.div
                key={idx}
                initial={{
                  opacity: 0,
                  scale: 0.85,
                  rotateX: 15,
                  rotateY: -6,
                  translateZ: -120,
                  y: 40,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                  rotateX: 0,
                  rotateY: 0,
                  translateZ: 0,
                  y: 0,
                }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.7,
                  delay: idx * 0.15,
                  ease: "easeOut",
                }}
                whileHover={{
                  rotateX: 6,
                  rotateY: -6,
                  translateZ: 15,
                  scale: 1.018,
                  boxShadow: "0 20px 40px -10px rgba(255, 0, 0, 0.25)",
                }}
                style={{ transformStyle: "preserve-3d" }}
                className="bg-neutral-950 p-6 md:p-8 border-4 border-neutral-900 rounded-lg flex gap-5 md:gap-7 items-start relative overflow-hidden shadow-[6px_6px_0px_#FFD700] hover:border-brand-yellow hover:shadow-[6px_6px_0px_#FF0000] transition-all"
              >
                {/* Number index box */}
                <div className="bg-red-950/45 border-2 border-brand-red text-brand-red font-mono text-xs font-black w-10 md:w-12 h-10 md:h-12 flex items-center justify-center rounded shrink-0">
                  0{idx + 1}
                </div>

                {/* Info block */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-neutral-900 pb-2">
                    <h3 className="font-display font-black text-lg md:text-xl text-white uppercase tracking-tight italic">
                      {edu.institution}
                    </h3>
                    <span className="font-mono text-xs text-brand-yellow bg-yellow-950/40 px-2.5 py-1 rounded border border-brand-yellow/30 font-black">
                      {edu.period}
                    </span>
                  </div>

                  <p className="font-mono text-xs text-neutral-400 flex items-center gap-1.5 uppercase font-black">
                    <GraduationCap className="w-4.5 h-4.5 text-brand-red shrink-0" />
                    {edu.degree}
                  </p>

                  {edu?.institution && edu.institution.includes("SGT") ? (
                    <p className="font-sans text-[11px] text-neutral-550 leading-relaxed mt-2.5">
                      Focused pathway specializing intensely in Offensive
                      Cybersecurity principles, cryptography math, cloud server
                      hardening, penetration practices, and security metrics.
                    </p>
                  ) : (
                    <p className="font-sans text-[11px] text-neutral-550 leading-relaxed mt-2.5">
                      Foundational schooling with honors coursework, structuring
                      key methodologies in math science engineering, and design
                      paradigms.
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: Interactive Languages interface */}
          <div
            className="col-span-12 lg:col-span-12 xl:col-span-5 flex flex-col justify-between select-none"
            style={{ perspective: "1500px" }}
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.85,
                rotateX: 15,
                rotateY: 8,
                translateZ: -120,
                y: 40,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
                rotateX: 0,
                rotateY: 0,
                translateZ: 0,
                y: 0,
              }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{
                rotateX: 5,
                rotateY: 5,
                translateZ: 15,
                scale: 1.015,
                boxShadow: "0 20px 40px -10px rgba(255, 0, 0, 0.25)",
              }}
              style={{ transformStyle: "preserve-3d" }}
              transition={{ type: "spring", stiffness: 220, damping: 25 }}
              className="bg-zinc-950 border-4 border-brand-red rounded-lg p-6 md:p-8 h-full flex flex-col justify-between shadow-[10px_10px_0px_#FFD700]"
            >
              <div>
                <span className="font-mono text-[9px] text-brand-red font-black uppercase mb-4 block tracking-widest border-b border-neutral-900 pb-2">
                  VERBAL ROUTING MATRICES
                </span>

                <div className="flex gap-2.5 mb-6">
                  {languages.map((lang) => {
                    const isActive = activeLanguage === lang;
                    return (
                      <button
                        key={lang}
                        onClick={() => setActiveLanguage(lang)}
                        className={`font-mono text-xs font-black uppercase py-2.5 px-4 rounded-lg border-2 transition-all flex-1 ${
                          isActive
                            ? "bg-brand-yellow text-black border-brand-yellow font-black shadow-[4px_4px_0px_#FF0000]"
                            : "bg-black text-neutral-400 border-neutral-900 hover:text-white"
                        }`}
                      >
                        {lang}
                      </button>
                    );
                  })}
                </div>

                <div className="bg-black p-5 border border-neutral-900 rounded space-y-4">
                  <div>
                    <span className="font-mono text-[9px] text-neutral-500 block">
                      KEY ENCRYPTION STATE:
                    </span>
                    <span className="font-mono text-xs font-black text-brand-red block leading-none mt-1 animate-pulse uppercase">
                      &gt; {languageSpecs[activeLanguage].cryptoKey}
                    </span>
                  </div>

                  <div>
                    <span className="font-mono text-[9px] text-neutral-500 block">
                      FLUENCY INDEX:
                    </span>
                    <span className="font-mono text-[11px] font-black text-white block mt-1 uppercase leading-normal tracking-wide">
                      {languageSpecs[activeLanguage].fluency}
                    </span>
                  </div>

                  <div className="border-t border-neutral-900 pt-3">
                    <span className="font-mono text-[9px] text-neutral-500 block">
                      USAGE DETAILS:
                    </span>
                    <p className="font-sans text-xs text-neutral-300 leading-relaxed mt-1 font-bold">
                      {languageSpecs[activeLanguage].usage}
                    </p>
                  </div>
                </div>
              </div>

              {/* dossier footer graphics */}
              <div className="mt-8 border-t border-neutral-900 pt-4 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                <span className="flex items-center gap-1.5 uppercase font-black">
                  <Globe className="w-4 h-4 text-brand-red" /> LOCAL LINK CODES
                </span>
                <span className="text-brand-yellow font-black uppercase">
                  SECURED
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
