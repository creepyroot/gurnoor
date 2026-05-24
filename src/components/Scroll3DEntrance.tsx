import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";

interface Scroll3DEntranceProps {
  children: React.ReactNode;
  className?: string;
}

export default function Scroll3DEntrance({
  children,
  className = "",
}: Scroll3DEntranceProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 1024);
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
    stiffness: 180,
    damping: 26,
    mass: 0.2,
    restDelta: 0.001,
  });

  // Elegant front-coming subtle 2.5D parallax offsets.
  // Highly optimized values prevent rendering bottlenecks and scrolling stutters on all machines.
  const scale = useTransform(
    smoothProgress,
    [0, 1],
    [isMobile ? 1.01 : 1.03, 1],
  );
  const rotateX = useTransform(smoothProgress, [0, 1], [isMobile ? -1 : -3, 0]);
  const translateZ = useTransform(
    smoothProgress,
    [0, 1],
    [isMobile ? 10 : 25, 0],
  );
  const y = useTransform(smoothProgress, [0, 1], [isMobile ? 10 : 20, 0]);
  const opacity = useTransform(smoothProgress, [0, 0.45], [0, 1]);
  const pointerEvents = useTransform(smoothProgress, (val) =>
    val < 0.2 ? "none" : "auto",
  );

  // On mobile frames or touch-based screen widths, render the children directly with static layout.
  // This avoids scroll-frame sync errors in embeds, saving performance and preventing elements from remaining invisible.
  if (isMobile) {
    return (
      <div
        id="static-mobile-contain"
        className={`w-full py-4 px-2 md:py-6 overflow-visible ${className}`}
      >
        {children}
      </div>
    );
  }

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
