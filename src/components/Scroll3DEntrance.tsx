import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";

interface Scroll3DEntranceProps {
  children: React.ReactNode;
  className?: string;
}

export default function Scroll3DEntrance({ children, className = "" }: Scroll3DEntranceProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);
  
  // Track scroll from when the element starts entering from the bottom (start end)
  // to when its top reaches 65% of the viewport (start 65%).
  // This guarantees it is fully locked on and in perfect size/shape early as you scroll!
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 65%"],
  });

  // Balanced responsive spring engine: ultra-fast lock-on with zero lag
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 32,
    mass: 0.3,
    restDelta: 0.0001,
  });

  // Elegant front-coming 3D parallax offsets.
  // We use values designed to look premium but avoid layout breaking, huge memory overhead, or overlap.
  const scale = useTransform(smoothProgress, [0, 1], [isMobile ? 1.05 : 1.12, 1]);
  const rotateX = useTransform(smoothProgress, [0, 1], [isMobile ? -4 : -10, 0]);
  const translateZ = useTransform(smoothProgress, [0, 1], [isMobile ? 30 : 80, 0]);
  const y = useTransform(smoothProgress, [0, 1], [isMobile ? 15 : 40, 0]);
  const opacity = useTransform(smoothProgress, [0, 0.6], [0, 1]);
  const pointerEvents = useTransform(smoothProgress, (val) => (val < 0.2 ? "none" : "auto"));

  return (
    <div 
      ref={ref} 
      className={`w-full overflow-visible py-8 md:py-12 ${className}`}
      style={{ perspective: "1200px", perspectiveOrigin: "center center" }}
    >
      <motion.div
        style={{
          scale,
          rotateX,
          z: translateZ,
          y,
          opacity,
          pointerEvents,
          transformStyle: "preserve-3d",
          willChange: "transform, opacity",
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
