"use client";

import { useEffect, useState } from "react";

export default function ProgressBar() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(scrollPercent, 100));

      // Only show progress bar after scrolling a bit
      setIsVisible(scrollTop > 50);
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div
      className={`
        fixed top-0 left-0 right-0 z-50 h-1
        transition-opacity duration-300
        ${isVisible ? "opacity-100" : "opacity-0"}
      `}
    >
      {/* Track */}
      <div className="absolute inset-0 bg-border/30" />

      {/* Fill */}
      <div
        className="h-full progress-fill relative overflow-hidden"
        style={{ width: `${progress}%` }}
      >
        {/* Animated shine effect */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
            animate-[shimmer_2s_infinite]"
          style={{ backgroundSize: "200% 100%" }}
        />
      </div>

      {/* Glow effect at the end */}
      <div
        className="absolute top-0 h-full w-8 bg-gradient-to-r from-primary/50 to-transparent blur-sm
          transition-all duration-300"
        style={{
          left: `calc(${progress}% - 2rem)`,
          opacity: progress > 5 ? 0.6 : 0,
        }}
      />
    </div>
  );
}
