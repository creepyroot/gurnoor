export interface Experience {
  role: string;
  company: string;
  period: string;
  duration?: string;
  bullets: string[];
  vulnerabilities?: {
    target: string;
    description: string;
    severity: "Critical" | "High" | "Medium";
    cve?: string;
    bountyStatus: string;
  }[];
}

export interface Skill {
  name: string;
  category: "cybersecurity" | "development" | "design" | "marketing";
  level: number; // 0 to 100
  details: string;
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
}

export const portfolioData = {
  personalInfo: {
    name: "GURN00R SINGH",
    title: "ETHICAL HACKER • AI DEVELOPER • DESIGNER THINKER",
    phone: "+91 82188 10186",
    email: "gurnoor.creepyroot@gmail.com",
    location: "NEW DELHI",
    handle: "@CREEPY_ROOT",
    bio: "I am Gurnoor Singh, an ethical hacker by profession and a designer by soul. I approach problems the way a customer experiences them, always looking for the real-world impact behind every system. You can call me a polymath. I think like an owner and work smartly, lowering time and cost in the path of my work.",
    quote: "“Eyes are useless when the mind is blind.”",
    motto: {
      mindset: "Thinking like an attacker.",
      security: "Building like an engineer.",
      design: "Designing like a creator.",
    }
  },
  experiences: [
    {
      role: "Chief Technology Officer",
      company: "Shiv Khera",
      period: "2025 – Present",
      bullets: [
        "Worked on website based on WordPress to handle extreme high traffic with resilient custom patches.",
        "Managed social media and interactive leadership programs across the country.",
        "Created custom network-attached storage (NAS) backup systems and securely handled external affairs."
      ]
    },
    {
      role: "Machine Learning & Automation Developer",
      company: "WebNeed",
      period: "4 Months",
      bullets: [
        "Designed and streamlined production automations and AI pipeline integrations.",
        "Created high-throughput web scrapers and performed detailed cybersecurity compliance audits.",
        "Developed custom highly personalized conversational chatbots and enhanced main website's front-end speed."
      ]
    },
    {
      role: "Bug Bounty Hunter",
      company: "HackerOne",
      period: "4 Years",
      bullets: [
        "Disclosed critical security vulnerabilities to international tech corporations including Google, Tinder, Microsoft, Tesla, and Apple.",
        "Specialized in finding API security bypasses, token leakages, and privilege escalations.",
        "Acted as an active threat researcher on HackerOne's global leaderboard."
      ],
      vulnerabilities: [
        {
          target: "Google",
          description: "Responsible disclosure of Server-Side Request Forgery (SSRF) bypass in testing workspace endpoints.",
          severity: "Critical",
          cve: "CVE-2023-CONFIDENTIAL",
          bountyStatus: "Rewarded & Patched"
        },
        {
          target: "Tesla",
          description: "Identification of authentication flow bypass in remote telemetry system dashboard leading to info disclosure.",
          severity: "Critical",
          cve: "CVE-2023-SECURED",
          bountyStatus: "Triaged & Resolved"
        },
        {
          target: "Microsoft",
          description: "Subdomain takeover possibility and leaked third-party OAuth app identifiers in cloud resource setup.",
          severity: "High",
          cve: "CVE-2024-CONFIDENTIAL",
          bountyStatus: "Bounty Issued & Fixed"
        },
        {
          target: "Tinder",
          description: "IDOR (Insecure Direct Object Reference) yielding leak of sensitive API telemetry parameters.",
          severity: "High",
          bountyStatus: "Resolved & Merged"
        },
        {
          target: "Apple",
          description: "Race condition in validation handler for custom developers' subscription status verification.",
          severity: "Medium",
          bountyStatus: "Acknowledged & Solved"
        }
      ]
    }
  ] as Experience[],
  skills: [
    { name: "Red Teaming Specialist", category: "cybersecurity", level: 96, details: "Penetration testing, Active Directory attacks, threat simulation, security auditing." },
    { name: "Cybersecurity Specialist", category: "cybersecurity", level: 94, details: "Vulnerability assessment, code auditing, secure architecture design." },
    { name: "Front End & Backend Developer", category: "development", level: 92, details: "Advanced React, Node.js, Next.js, API engineering, custom state engines." },
    { name: "AI Developer", category: "development", level: 89, details: "Machine learning, conversational NLP agents, prompt engineering, automation." },
    { name: "Cloud Computing", category: "development", level: 85, details: "NAS setup, docker, network storage configuration, secure cloud instances." },
    { name: "Digital Marketing & Crypto Mining", category: "marketing", level: 80, details: "Crypto mining rig setup, optimization, SEO algorithms, tactical campaigns." },
    { name: "Designer Thinker", category: "design", level: 95, details: "Human-centric UX engineering, wireframes, high-impact CSS art, branding." },
    { name: "Photo & Video Editing", category: "design", level: 88, details: "Technical editing, asset optimization, dynamic motion graphics, content composition." },
    { name: "SEO & Copywriting / Lead Gen", category: "marketing", level: 82, details: "Conversion writing, search authority generation, secure B2B capture forms." }
  ] as Skill[],
  education: [
    {
      institution: "SGT University",
      degree: "B.Tech CSE Cybersecurity",
      period: "2025 – 2029"
    },
    {
      institution: "The Air Force School",
      degree: "12th Standard",
      period: "2024 – 2025"
    },
    {
      institution: "The Air Force School",
      degree: "10th Standard",
      period: "2022 – 2023"
    }
  ] as Education[],
  languages: ["English", "Hindi", "Punjabi"]
};
