import React from "react";
import { motion } from "motion/react";
import {
  Briefcase,
  Calendar,
  Award,
  ExternalLink,
  ShieldCheck,
  Database,
  Bot,
} from "lucide-react";
import { portfolioData, Experience } from "../data/portfolioData";

export default function ExperienceTimeline() {
  const experiences = portfolioData.experiences;

  // Custom visual telemetry badges representing impact at each company
  const telemetryData = [
    {
      company: "Shiv Khera",
      impactLevel: "CRITICAL SYSTEM INFRASTRUCTURE",
      metrics: [
        { label: "TRAFFIC THROTTLING CAPACITY", value: "99.9%" },
        { label: "NAS BACKUP FAULT DEFENSE", value: "REDUNDANT" },
        { label: "DIGITAL REACH SCALE", value: "PAN-INDIA" },
      ],
      colorTheme: "yellow",
      accentBorder: "border-yellow-400",
      pillBg: "bg-yellow-400 text-black",
      icon: Database,
    },
    {
      company: "WebNeed",
      impactLevel: "AUTOMATED THREAT COMPLIANCE / AI DEV",
      metrics: [
        { label: "MIDDLEWARE BOT RESPONSIVELINESS", value: "<150MS" },
        { label: "COMPLIANCE AUDIT AUDITED", value: "100%" },
        { label: "SCRAPING SCRAPED VOLUME", value: "500K+ RECORDS" },
      ],
      colorTheme: "red",
      accentBorder: "border-red-600",
      pillBg: "bg-red-600 text-white",
      icon: Bot,
    },
    {
      company: "HackerOne",
      impactLevel: "VULNERABILITY EXPULSION LEAGUE",
      metrics: [
        { label: "COMPANIES COVERED", value: "5 MAJORS" },
        { label: "REPORT FIDELITY RATE", value: "AWAIT PATCH" },
        { label: "TOTAL ATTACK MATRIX VECTOR", value: "4 CYCLES" },
      ],
      colorTheme: "yellow",
      accentBorder: "border-yellow-400",
      pillBg: "bg-yellow-400 text-black",
      icon: ShieldCheck,
    },
  ];

  return (
    <section
      id="experience"
      className="py-24 bg-black relative border-b-8 border-brand-red"
    >
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-20" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-neutral-900 pb-8 mb-16">
          <div>
            <span className="font-mono text-xs text-brand-red tracking-[0.3em] uppercase block mb-2">
              [ CADRE HISTORY ]
            </span>
            <h2 className="text-5xl sm:text-7xl font-display font-black tracking-tighter text-white uppercase italic drop-shadow-[5px_5px_0px_#FFD700]">
              WORK{" "}
              <span className="text-brand-yellow drop-shadow-[5px_5px_0px_#FF0000]">
                EXPERIENCE
              </span>
            </h2>
          </div>
          <p className="mt-4 md:mt-0 font-mono text-[10px] text-neutral-500 uppercase max-w-sm md:text-right leading-relaxed">
            Deployment timeline tracking engineering sprints, high-volume
            automation audits, and secure local client integrations.
          </p>
        </div>

        {/* Experience Blocks with Parallax Scrolling Entrance */}
        <div className="space-y-16" style={{ perspective: "1500px" }}>
          {experiences.map((exp, index) => {
            const tel =
              telemetryData.find((t) => t.company === exp.company) ||
              telemetryData[0];
            const TelIcon = tel.icon;

            return (
              <motion.div
                key={exp.company}
                initial={{
                  opacity: 0,
                  scale: 0.84,
                  rotateX: 18,
                  rotateY: index % 2 === 0 ? -12 : 12,
                  translateZ: -140,
                  y: 80,
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
                  duration: 0.8,
                  ease: "easeOut",
                  delay: index * 0.1,
                }}
                whileHover={{
                  rotateX: 6,
                  rotateY: -3,
                  translateZ: 15,
                  scale: 1.012,
                  boxShadow: "0 25px 50px -12px rgba(255, 215, 0, 0.2)",
                }}
                style={{ transformStyle: "preserve-3d" }}
                className={`grid grid-cols-12 gap-8 bg-neutral-950 p-6 md:p-10 border-4 ${tel.accentBorder} rounded-lg relative overflow-hidden transition-all duration-300`}
              >
                {/* Lateral hazard strip element on left */}
                <div className="absolute top-0 bottom-0 left-0 w-2 hazard-bg opacity-70" />

                {/* Main Content Side */}
                <div className="col-span-12 lg:col-span-7 flex flex-col justify-between pl-4">
                  <div>
                    {/* Header line item */}
                    <div className="flex flex-wrap items-center gap-x-3 mb-4">
                      <span
                        className={`px-2.5 py-1 rounded text-[10px] font-mono tracking-widest uppercase font-black ${tel.pillBg}`}
                      >
                        {exp.company}
                      </span>
                      <span className="font-mono text-xs text-neutral-500 flex items-center gap-1.5 font-bold">
                        <Calendar className="w-3.5 h-3.5 text-brand-red" />
                        {exp.period}
                      </span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-display font-black text-white tracking-tight uppercase mb-4 italic text-glow-yellow">
                      {exp.role}
                    </h3>

                    {/* Bullet Points */}
                    <ul className="space-y-3.5 mb-6">
                      {exp.bullets.map((bullet, idx) => (
                        <li
                          key={idx}
                          className="flex items-start text-neutral-300 font-sans text-sm leading-relaxed"
                        >
                          <span className="text-brand-yellow font-black mr-3 text-base leading-none select-none">
                            //
                          </span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {exp.company === "HackerOne" && (
                    <div className="mt-4">
                      <a
                        href="#terminal"
                        className="inline-flex items-center gap-2 font-mono text-xs font-black text-brand-red hover:text-brand-yellow uppercase tracking-widest transition-colors border-b-2 border-brand-red hover:border-brand-yellow pb-1 font-extrabold"
                      >
                        Launch CVE Exploit Matrix{" "}
                        <ExternalLink className="w-4.5 h-4.5" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Cyber Diagnostics Telemetry Side */}
                <div className="col-span-12 lg:col-span-5 bg-black border-2 border-neutral-900 rounded p-6 flex flex-col justify-between select-none">
                  <div>
                    <div className="flex justify-between items-center border-b border-neutral-900 pb-3 mb-4">
                      <span className="font-mono text-[9px] text-[#ef4444] font-black uppercase tracking-widest flex items-center gap-1.5">
                        <TelIcon className="w-4 h-4 text-brand-yellow" />{" "}
                        TELEMETRY ANALYSIS
                      </span>
                      <span className="font-mono text-[8px] text-neutral-505 font-bold">
                        [RECORD_ID: #0{index + 1}]
                      </span>
                    </div>

                    <div className="mb-4">
                      <span className="font-mono text-[10px] text-neutral-500 block">
                        IMPACT ZONE
                      </span>
                      <span className="font-mono text-xs font-bold text-white uppercase block mt-0.5">
                        {tel.impactLevel}
                      </span>
                    </div>

                    {/* Custom progress indices */}
                    <div className="space-y-4 pt-1">
                      {tel.metrics.map((metric) => (
                        <div key={metric.label} className="space-y-1">
                          <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="text-neutral-400">
                              {metric.label}:
                            </span>
                            <span className="text-brand-yellow font-bold">
                              {metric.value}
                            </span>
                          </div>
                          {/* Mini dynamic grid meter */}
                          <div className="h-1.5 w-full bg-neutral-950 rounded-sm overflow-hidden flex gap-0.5">
                            <div className="h-full flex-1 bg-brand-red rounded-sm" />
                            <div className="h-full flex-1 bg-brand-red rounded-sm" />
                            <div className="h-full flex-1 bg-brand-yellow rounded-sm" />
                            <div className="h-full flex-1 bg-brand-yellow rounded-sm" />
                            <div
                              className={`h-full flex-1 rounded-sm ${index === 0 ? "bg-brand-yellow" : "bg-neutral-900"}`}
                            />
                            <div
                              className={`h-full flex-1 rounded-sm ${index === 1 ? "bg-brand-red" : "bg-neutral-900"}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 border-t border-neutral-900 pt-4 flex items-center justify-between text-[10px] font-mono text-neutral-500 uppercase leading-none">
                    <span>SECURITY CRITERIA: COMPLIANT</span>
                    <span className="text-brand-yellow font-black">
                      STABLE STATE
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
