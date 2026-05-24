import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Mail,
  Phone,
  Copy,
  Check,
  Terminal,
  ExternalLink,
  Instagram,
} from "lucide-react";
import { portfolioData } from "../data/portfolioData";

export default function SuperBoldContact() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedInsta, setCopiedInsta] = useState(false);

  const email = "gurnoor.creepyroot@gmail.com";
  const phone = "+91 82188 10186";
  const insta = "@creepy_root";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleCopyInsta = () => {
    navigator.clipboard.writeText(insta);
    setCopiedInsta(true);
    setTimeout(() => setCopiedInsta(false), 2000);
  };

  return (
    <section
      id="contact"
      className="py-24 bg-black relative border-b-8 border-brand-red"
    >
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-20" />

      {/* Gigantic visual warning banner representing heavy system connections */}
      <div className="h-10 w-full overflow-hidden flex items-center relative z-20 shadow-md">
        <div className="absolute inset-0 hazard-red-bg pointer-events-none opacity-90" />
        <div className="w-full relative flex whitespace-nowrap py-1.5 bg-black/90 font-mono text-xs font-black tracking-widest text-brand-red border-t-2 border-b-2 border-brand-red">
          <div className="animate-marquee flex gap-12 select-none uppercase">
            <span>● SECURE SHELL COMMUNICATIONS COMPILED</span>
            <span>● DIAL EXPLOIT: {phone} IPSEC DIRECT CONNECTION ONLINE</span>
            <span>● SMTP LINK: {email}</span>
            <span>
              ● WARNING: DISCLOSURE SYSTEMS PREEMPTED ON TERMINATION LAYER
            </span>
          </div>
          <div className="animate-marquee flex gap-12 select-none uppercase absolute top-1.5 left-full">
            <span>● SECURE SHELL COMMUNICATIONS COMPILED</span>
            <span>● DIAL EXPLOIT: {phone} IPSEC DIRECT CONNECTION ONLINE</span>
            <span>● SMTP LINK: {email}</span>
            <span>
              ● WARNING: DISCLOSURE SYSTEMS PREEMPTED ON TERMINATION LAYER
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 mt-16">
        {/* Large typographic layout */}
        <div className="text-center md:text-left border-b-2 border-neutral-900 pb-8 mb-16">
          <span className="font-mono text-xs text-brand-yellow tracking-[0.3em] uppercase block mb-3 font-black">
            [ COMMUNICATION SYSTEM ]
          </span>
          <h2 className="text-5xl sm:text-7xl lg:text-9xl font-display font-black tracking-tighter text-white leading-none uppercase italic drop-shadow-[5px_5px_0px_#FF0000]">
            ESTABLISH <br />
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: "2.5px #FFD700" }}
            >
              CONNECTION
            </span>
          </h2>
        </div>

        {/* Outer Split layout */}
        <div className="grid grid-cols-12 gap-8 items-stretch">
          {/* Left Side: ULTRA BOLD CONTACT NODES */}
          <div
            className="col-span-12 lg:col-span-12 xl:col-span-12 space-y-8 flex flex-col justify-between"
            style={{ perspective: "1500px" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* 1. Email Port Card */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 20px 40px -10px rgba(255, 0, 0, 0.25)",
                }}
                className="bg-neutral-950 p-6 md:p-8 border-4 border-brand-yellow rounded-lg relative overflow-hidden group shadow-[8px_8px_0px_#FF0000]"
              >
                <div className="absolute top-0 right-0 w-16 h-16 hazard-bg pointer-events-none opacity-20 transform translate-x-6 -translate-y-6 rotate-45" />
                <span className="font-mono text-[10px] text-brand-red font-black uppercase block mb-2">
                  [ SECURED TRANSMISSION PROTOCOL ]
                </span>
                <span className="font-mono text-xs text-neutral-500 block font-bold mb-4">
                  SMTP ROUTE:
                </span>

                <a
                  href={`mailto:${email}`}
                  className="font-display font-black text-xl sm:text-2xl text-white hover:text-brand-yellow transition-colors tracking-tight select-all truncate block mb-6 italic"
                >
                  {email}
                </a>

                <div className="flex gap-2 shrink-0 mt-auto">
                  <button
                    onClick={handleCopyEmail}
                    className="flex-1 p-3 bg-brand-red hover:bg-red-700 text-white rounded-lg transition-all border border-brand-red flex items-center justify-center gap-1.5 font-mono text-xs font-black shadow-[3px_3px_0px_#FFD700]"
                  >
                    {copiedEmail ? (
                      <Check className="w-4.5 h-4.5 text-glow-yellow" />
                    ) : (
                      <Copy className="w-4.5 h-4.5" />
                    )}
                    {copiedEmail ? "COPIED" : "COPY"}
                  </button>
                  <a
                    href={`mailto:${email}`}
                    className="p-3 bg-black hover:bg-neutral-900 border-2 border-neutral-800 text-neutral-400 hover:text-brand-yellow rounded-lg transition-all flex items-center justify-center"
                  >
                    <ExternalLink className="w-4.5 h-4.5" />
                  </a>
                </div>
              </motion.div>

              {/* 2. Number Port Card */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 20px 40px -10px rgba(255, 215, 0, 0.25)",
                }}
                className="bg-neutral-950 p-6 md:p-8 border-4 border-brand-red rounded-lg relative overflow-hidden group shadow-[8px_8px_0px_#FFD700]"
              >
                <div className="absolute top-0 right-0 w-16 h-16 hazard-red-bg pointer-events-none opacity-20 transform translate-x-6 -translate-y-6 rotate-45" />

                <span className="font-mono text-[10px] text-[#FFD700] font-black uppercase block mb-2">
                  [ SECURED VOICE LINK ROUTE ]
                </span>
                <span className="font-mono text-xs text-neutral-500 block font-bold mb-4">
                  IPSEC TELEPHONY PORT:
                </span>

                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="font-display font-black text-2xl sm:text-3xl text-white hover:text-brand-red transition-colors tracking-tight select-all block mb-6 italic"
                >
                  {phone}
                </a>

                <div className="flex gap-2 shrink-0 mt-auto">
                  <button
                    onClick={handleCopyPhone}
                    className="flex-1 p-3 bg-brand-yellow hover:bg-yellow-500 text-black rounded-lg transition-all border border-brand-yellow flex items-center justify-center gap-1.5 font-mono text-xs font-black shadow-[3px_3px_0px_#FF0000]"
                  >
                    {copiedPhone ? (
                      <Check className="w-4.5 h-4.5" />
                    ) : (
                      <Copy className="w-4.5 h-4.5" />
                    )}
                    {copiedPhone ? "COPIED" : "COPY"}
                  </button>
                  <a
                    href={`tel:${phone.replace(/\s+/g, "")}`}
                    className="p-3 bg-black hover:bg-neutral-900 border-2 border-neutral-800 text-neutral-400 hover:text-brand-red rounded-lg transition-all flex items-center justify-center"
                  >
                    <ExternalLink className="w-4.5 h-4.5" />
                  </a>
                </div>
              </motion.div>

              {/* 3. Instagram Port Card */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 20px 40px -10px rgba(0, 255, 255, 0.25)",
                }}
                className="bg-neutral-950 p-6 md:p-8 border-4 border-cyan-500 rounded-lg relative overflow-hidden group shadow-[8px_8px_0px_#00FFFF]"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-[repeating-linear-gradient(45deg,rgba(0,255,255,0.1),rgba(0,255,255,0.1)_10px,transparent_10px,transparent_20px)] pointer-events-none opacity-50 transform translate-x-6 -translate-y-6 rotate-45" />

                <span className="font-mono text-[10px] text-cyan-500 font-black uppercase block mb-2">
                  [ VISUAL INTELLIGENCE FEED ]
                </span>
                <span className="font-mono text-xs text-neutral-500 block font-bold mb-4">
                  SOCIAL GRID ID:
                </span>

                <a
                  href={`https://instagram.com/${insta.replace("@", "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-display font-black text-2xl sm:text-3xl text-white hover:text-cyan-500 transition-colors tracking-tight select-all block mb-6 italic"
                >
                  {insta}
                </a>

                <div className="flex gap-2 shrink-0 mt-auto">
                  <button
                    onClick={handleCopyInsta}
                    className="flex-1 p-3 bg-cyan-500 hover:bg-cyan-600 text-black rounded-lg transition-all border border-cyan-500 flex items-center justify-center gap-1.5 font-mono text-xs font-black shadow-[3px_3px_0px_#FFFFFF]"
                  >
                    {copiedInsta ? (
                      <Check className="w-4.5 h-4.5 text-black" />
                    ) : (
                      <Copy className="w-4.5 h-4.5" />
                    )}
                    {copiedInsta ? "COPIED" : "COPY"}
                  </button>
                  <a
                    href={`https://instagram.com/${insta.replace("@", "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-black hover:bg-neutral-900 border-2 border-neutral-800 text-neutral-400 hover:text-cyan-500 rounded-lg transition-all flex items-center justify-center"
                  >
                    <Instagram className="w-4.5 h-4.5" />
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Quick statement details */}
            <div className="bg-neutral-950/60 p-6 border-2 border-neutral-900 rounded font-mono text-xs text-neutral-500 leading-relaxed uppercase space-y-2 select-none shadow-[4px_4px_0px_#FF0000]">
              <Terminal className="w-4 h-4 inline text-brand-red" />{" "}
              <span className="text-brand-yellow font-black">
                AUDITING COMMUNICATION LINK PRE-REQUIREMENTS:
              </span>
              <p className="font-bold border-l-2 border-brand-red pl-4 ml-2 my-2">
                All data relayed through this portal remains sandboxed. If you
                find high-risk vulnerability exposures, please configure urgent
                secure SMTP pipelines immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
