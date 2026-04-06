'use client';

import { TypeAnimation } from 'react-type-animation';
import { cn } from '@/lib/utils';
import { ComponentProps } from 'react';

type LibrarySpeedType = ComponentProps<typeof TypeAnimation>['speed'];

type SpeedType = number | 'slow' | 'normal' | 'fast';

interface TypeanimationProps {
  words?: string[];
  className?: string;
  typingSpeed?: SpeedType;
  deletingSpeed?: SpeedType;
  pauseDuration?: number;
}

const Typeanimation = ({
  words = [' existence', ' reality', ' the Internet'],
  className,
  typingSpeed = 50,
  deletingSpeed = 50,
  pauseDuration = 1000,
}: TypeanimationProps) => {
  const sequence = words.flatMap((word) => [word, pauseDuration]);

  return (
    <div className={cn("block min-h-[1.5em]", className)}>
      <TypeAnimation
        sequence={sequence}
        wrapper="span"
        repeat={Infinity}
        speed={typingSpeed as LibrarySpeedType}
        deletionSpeed={deletingSpeed as LibrarySpeedType}
      />
    </div>
  );
};

export default Typeanimation;