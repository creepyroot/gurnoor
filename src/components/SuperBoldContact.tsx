import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Phone, Copy, Check, Terminal, ExternalLink, Zap, ShieldAlert } from "lucide-react";
import { portfolioData } from "../data/portfolioData";

export default function SuperBoldContact() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmissionLog, setTransmissionLog] = useState<string[]>([]);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const email = "gurnoor.creepyroot@gmail.com";
  const phone = "+91 82188 10186";

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

  const handleTransmittingMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsTransmitting(true);
    setTransmissionLog([
      `[SYS_INIT] PREPARING BULLETPROOF ENCRYPTED TUNNEL FOR INGRESS LOG TRANSMISSIONS...`,
      `[RECON] IP ADDRESS PINPOINT: SECURE HANDSHAKE ESTABLISHED.`,
    ]);

    const logs = [
      `[TUNNEL] PACKETIZING USER DATAGRAM [SENDER: ${formData.name.toUpperCase()}]`,
      `[CRYPT] APPLYING AES-256 SYMMETRIC ENCRYPTION ON MESSAGE BODY...`,
      `[TRANSMIT] ROUTING LOG THROUGH DEEP SECURED SOCKETS...`,
      `[SUCCESS] TRANSMISSION LOG INGRESS CODES SECURED! GURNOOR SINGH WILL RESPOND SHORTLY.`
    ];

    const userName = formData.name;
    const userEmail = formData.email;
    const userMessage = formData.message;

    let step = 0;
    const interval = setInterval(() => {
      if (step < logs.length) {
        setTransmissionLog((prev) => [...prev, logs[step]]);
        step++;
      } else {
        clearInterval(interval);
        setIsTransmitting(false);

        // Pre-fill and trigger native mailto transmission to Gurnoor Singh so the message actually works!
        const subject = encodeURIComponent(`Secure Ingress: Message from ${userName}`);
        const body = encodeURIComponent(`Visitor Name: ${userName}\nReply Port: ${userEmail}\n\nMessage Payload:\n${userMessage}\n\n---\nSent securely via Portfolio Encrypted Datagram Systems.`);
        const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;
        
        // Open the user's email client to actually send the message
        window.location.href = mailtoUrl;

        setFormData({ name: "", email: "", message: "" });
      }
    }, 600);
  };

  return (
    <section id="contact" className="py-24 bg-black relative border-b-8 border-brand-red">
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-20" />

      {/* Gigantic visual warning banner representing heavy system connections */}
      <div className="h-10 w-full overflow-hidden flex items-center relative z-20 shadow-md">
        <div className="absolute inset-0 hazard-red-bg pointer-events-none opacity-90" />
        <div className="w-full relative flex whitespace-nowrap py-1.5 bg-black/90 font-mono text-xs font-black tracking-widest text-brand-red border-t-2 border-b-2 border-brand-red">
          <div className="animate-marquee flex gap-12 select-none uppercase">
            <span>● SECURE SHELL COMMUNICATIONS COMPILED</span>
            <span>● DIAL EXPLOIT: {phone} IPSEC DIRECT CONNECTION ONLINE</span>
            <span>● SMTP LINK: {email}</span>
            <span>● WARNING: DISCLOSURE SYSTEMS PREEMPTED ON TERMINATION LAYER</span>
          </div>
          <div className="animate-marquee flex gap-12 select-none uppercase absolute top-1.5 left-full">
            <span>● SECURE SHELL COMMUNICATIONS COMPILED</span>
            <span>● DIAL EXPLOIT: {phone} IPSEC DIRECT CONNECTION ONLINE</span>
            <span>● SMTP LINK: {email}</span>
            <span>● WARNING: DISCLOSURE SYSTEMS PREEMPTED ON TERMINATION LAYER</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 mt-16">
        
        {/* Large typographic layout */}
        <div className="text-center md:text-left border-b-2 border-neutral-900 pb-8 mb-16">
          <span className="font-mono text-xs text-brand-yellow tracking-[0.3em] uppercase block mb-3 font-black">[ COMMUNICATION SYSTEM ]</span>
          <h2 className="text-5xl sm:text-7xl lg:text-9xl font-display font-black tracking-tighter text-white leading-none uppercase italic drop-shadow-[5px_5px_0px_#FF0000]">
            ESTABLISH <br />
            <span className="text-transparent" style={{ WebkitTextStroke: "2.5px #FFD700" }}>CONNECTION</span>
          </h2>
        </div>

        {/* Outer Split layout */}
        <div className="grid grid-cols-12 gap-8 items-stretch">
          
          {/* Left Side: ULTRA BOLD CONTACT NODES */}
          <div className="col-span-12 lg:col-span-12 xl:col-span-7 space-y-8 flex flex-col justify-between" style={{ perspective: "1500px" }}>
            <div className="space-y-8">
              
              <span className="font-mono text-[9px] text-[#FFD700] font-black uppercase block tracking-widest leading-none font-bold">
                DIRECT INGRESS PORTS
              </span>

              {/* 1. Email Port Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.85, rotateX: 15, rotateY: -8, translateZ: -120, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0, translateZ: 0, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ 
                  rotateX: 6, 
                  rotateY: -6, 
                  translateZ: 15,
                  scale: 1.018,
                  boxShadow: "0 20px 40px -10px rgba(255, 0, 0, 0.25)"
                }}
                style={{ transformStyle: "preserve-3d" }}
                className="bg-neutral-950 p-6 md:p-8 border-4 border-brand-yellow rounded-lg relative overflow-hidden group shadow-[8px_8px_0px_#FF0000]"
              >
                <div className="absolute top-0 right-0 w-16 h-16 hazard-bg pointer-events-none opacity-20 transform translate-x-6 -translate-y-6 rotate-45" />
                
                <span className="font-mono text-[10px] text-brand-red font-black uppercase block mb-2">[ SECURED TRANSMISSION PROTOCOL ]</span>
                <span className="font-mono text-xs text-neutral-500 block font-bold">SMTP ROUTE:</span>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                  <a 
                    href={`mailto:${email}`}
                    className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-white hover:text-brand-yellow transition-colors tracking-tight select-all truncate max-w-full italic"
                  >
                    {email}
                  </a>
                  
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={handleCopyEmail}
                      className="p-3 bg-brand-red hover:bg-red-700 text-white rounded-lg transition-all border border-brand-red flex items-center gap-1.5 font-mono text-xs font-black shadow-[3px_3px_0px_#FFD700]"
                    >
                      {copiedEmail ? <Check className="w-4.5 h-4.5 text-glow-yellow" /> : <Copy className="w-4.5 h-4.5" />}
                      {copiedEmail ? "COPIED" : "COPY"}
                    </button>
                    <a
                      href={`mailto:${email}`}
                      className="p-3 bg-black hover:bg-neutral-900 border-2 border-neutral-800 text-neutral-400 hover:text-brand-yellow rounded-lg transition-all"
                    >
                      <ExternalLink className="w-4.5 h-4.5" />
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* 2. Number Port Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.85, rotateX: 15, rotateY: -8, translateZ: -120, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0, translateZ: 0, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ 
                  rotateX: 6, 
                  rotateY: -6, 
                  translateZ: 15,
                  scale: 1.018,
                  boxShadow: "0 20px 40px -10px rgba(255, 215, 0, 0.25)"
                }}
                style={{ transformStyle: "preserve-3d" }}
                className="bg-neutral-950 p-6 md:p-8 border-4 border-brand-red rounded-lg relative overflow-hidden group shadow-[8px_8px_0px_#FFD700]"
              >
                <div className="absolute top-0 right-0 w-16 h-16 hazard-red-bg pointer-events-none opacity-20 transform translate-x-6 -translate-y-6 rotate-45" />

                <span className="font-mono text-[10px] text-[#FFD700] font-black uppercase block mb-2">[ SECURED VOICE LINK ROUTE ]</span>
                <span className="font-mono text-xs text-neutral-500 block font-bold">IPSEC TELEPHONY PORT:</span>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                  <a 
                    href={`tel:${phone.replace(/\s+/g, '')}`}
                    className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white hover:text-brand-red transition-colors tracking-tighter select-all italic"
                  >
                    {phone}
                  </a>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={handleCopyPhone}
                      className="p-3 bg-brand-yellow hover:bg-yellow-500 text-black rounded-lg transition-all border border-brand-yellow flex items-center gap-1.5 font-mono text-xs font-black shadow-[3px_3px_0px_#FF0000]"
                    >
                      {copiedPhone ? <Check className="w-4.5 h-4.5" /> : <Copy className="w-4.5 h-4.5" />}
                      {copiedPhone ? "COPIED" : "COPY"}
                    </button>
                    <a
                      href={`tel:${phone.replace(/\s+/g, '')}`}
                      className="p-3 bg-black hover:bg-neutral-900 border-2 border-neutral-800 text-neutral-400 hover:text-brand-red rounded-lg transition-all"
                    >
                      <ExternalLink className="w-4.5 h-4.5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Quick statement details */}
            <div className="bg-neutral-950/60 p-6 border-2 border-neutral-900 rounded font-mono text-xs text-neutral-500 leading-relaxed uppercase space-y-2 select-none shadow-[4px_4px_0px_#FF0000]">
              <span className="text-brand-yellow font-black block">AUDITING COMMUNICATION LINK PRE-REQUIREMENTS:</span>
              <p className="font-bold">
                All data relayed through this portal remains sandboxed. If you find high-risk vulnerability exposures, please configure urgent secure SMTP pipelines immediately.
              </p>
            </div>
          </div>

          {/* Right Side: SECURE ENCRYPTED INGRESS MESSENGER */}
          <div className="col-span-12 lg:col-span-12 xl:col-span-5 flex flex-col" style={{ perspective: "1500px" }}>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.85, rotateX: -15, rotateY: 8, translateZ: -120, y: 40 }}
              whileInView={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0, translateZ: 0, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ 
                rotateX: -5, 
                rotateY: 5, 
                translateZ: 15,
                scale: 1.012,
                boxShadow: "0 25px 50px -12px rgba(255, 0, 0, 0.25)"
              }}
              style={{ transformStyle: "preserve-3d" }}
              transition={{ type: "spring", stiffness: 220, damping: 25 }}
              className="bg-zinc-950 border-4 border-brand-yellow rounded-lg p-6 md:p-8 flex flex-col justify-between h-full shadow-[12px_12px_0px_#FF0000] relative"
            >
              
              <div>
                <div className="flex items-center justify-between border-b border-neutral-900 pb-3 mb-6">
                  <span className="font-mono text-[9px] text-brand-red font-black uppercase tracking-widest flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-glow-yellow" /> ENCRYPTED DATAGRAM SYSTEM
                  </span>
                  <span className="font-mono text-[8px] text-neutral-500">[TLS_OK]</span>
                </div>

                <form onSubmit={handleTransmittingMessage} className="space-y-4">
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] text-neutral-500 block uppercase font-bold">VISITOR CADRE NAME</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. AGENT COOPER"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={isTransmitting}
                      className="w-full bg-black border-2 border-neutral-800 focus:border-brand-red rounded p-3 font-mono text-xs text-white uppercase placeholder-neutral-700 outline-none transition-all font-black"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[9px] text-neutral-500 block uppercase font-bold">REPLY EMAIL PORT</label>
                    <input 
                      type="email" 
                      required
                      placeholder="e.g. COOPER@AGENCY.COM"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={isTransmitting}
                      className="w-full bg-black border-2 border-neutral-800 focus:border-brand-red rounded p-3 font-mono text-xs text-white uppercase placeholder-neutral-700 outline-none transition-all font-black"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[9px] text-neutral-500 block uppercase font-bold">MESSAGE PAYLOAD</label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="e.g. INGRESS CRITICAL SECURITY CONTRACT BRIEF..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      disabled={isTransmitting}
                      className="w-full bg-black border-2 border-neutral-800 focus:border-brand-red rounded p-3 font-mono text-xs text-white uppercase placeholder-neutral-700 outline-none transition-all resize-none font-black"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isTransmitting}
                    className="w-full py-3 mt-4 bg-brand-red hover:bg-red-700 text-white font-mono text-xs font-black uppercase tracking-widest rounded-lg transition-all border border-brand-red flex items-center justify-center gap-2 shadow-[4px_4px_0px_#FFD700] active:translate-y-0.5 active:shadow-[1px_1px_0px_#FFD700]"
                  >
                    <Zap className="w-4 h-4 text-glow-yellow" />
                    {isTransmitting ? "TRANSMITTING..." : "TRANSMIT PAYLOAD"}
                  </button>
                </form>

                {/* Live stream logs of transmission status */}
                <AnimatePresence>
                  {transmissionLog.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-6 bg-black p-4 border border-neutral-900 rounded font-mono text-[10px] text-glow-yellow text-brand-yellow space-y-1.5 overflow-hidden leading-tight font-black"
                    >
                      {transmissionLog.map((logStr, idx) => {
                        if (!logStr) return null;
                        return (
                          <div key={idx} className={`${logStr.includes("[SUCCESS]") ? "text-emerald-400 font-bold" : ""}`}>
                            &gt; {logStr}
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-8 border-t border-neutral-900 pt-3 flex items-center justify-between text-[9px] font-mono text-neutral-500 uppercase">
                <span>RECON ENVELOPE: COMPLETE</span>
                <span className="text-brand-yellow font-black">READY</span>
              </div>

            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
}
