'use client';

import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface LustreTextProps {
  words?: string[];
  text?: string;
  className?: string;
  shimmer?: boolean;
  duration?: number;
  pauseDuration?: number;
}

const LustreText: React.FC<LustreTextProps> = ({ 
  words,
  text, 
  className, 
  shimmer = true, 
  duration = 5,
  pauseDuration = 3000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const displayList = words || (text ? [text] : ["Lustre Text"]);

  useEffect(() => {
    if (!words || words.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, pauseDuration);

    return () => clearInterval(timer);
  }, [words, pauseDuration]);

  return (
    <span
      className={cn(
        "lustre-text lustre-dark transition-all duration-700",
        shimmer && "animate-shine",
        className
      )}
      style={{ animationDuration: `${duration}s` } as React.CSSProperties}
    >
      {displayList[currentIndex]}
    </span>
  );
};

export default LustreText;