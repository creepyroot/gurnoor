import React, { useState, useEffect } from "react";
import { Maximize, Minimize } from "lucide-react";

export default function FullscreenBtn({
  targetRef,
}: {
  targetRef: React.RefObject<HTMLElement>;
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggle = () => {
    if (!document.fullscreenElement) {
      if (targetRef.current) {
        targetRef.current
          .requestFullscreen()
          .catch((err) => console.error(err));
      }
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
    }
  };

  return (
    <button
      onClick={toggle}
      className="absolute top-2 right-2 md:top-4 md:right-4 z-50 p-2 bg-black/80 hover:bg-white hover:text-black border border-brand-red rounded text-brand-red transition-all shadow-lg active:scale-95"
      aria-label="Toggle Fullscreen"
    >
      {isFullscreen ? (
        <Minimize className="w-4 h-4 md:w-5 md:h-5" />
      ) : (
        <Maximize className="w-4 h-4 md:w-5 md:h-5" />
      )}
    </button>
  );
}
