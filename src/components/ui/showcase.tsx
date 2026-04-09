'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface Step {
  label?: string;
  heading: string;
  description: string;
  media: string;
  link?: string;
}

interface ShowcaseProps {
  items: Step[];
  containerClass?: string;
  cycleDelay?: number;
  mediaClass?: string;
}

function Showcase({
  items,
  containerClass,
  cycleDelay = 4000,
  mediaClass = 'h-72 md:h-auto',
}: ShowcaseProps) {
  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  const handleClick = (idx: number) => {
    if (idx === active) return;
    setPrevious(active);
    setActive(idx);
    setHasAnimated(true);
  };

  const handleAnimationComplete = () => {
    setPrevious(active);
    setActive((c) => (c + 1) % items.length);
    setHasAnimated(true);
  };

  const activeItem = items[active];

  return (
    <div
      className={cn(
        'flex flex-col-reverse md:flex-row w-full md:items-stretch mx-auto rounded-2xl overflow-hidden',
        containerClass,
      )}
    >
      {/* 텍스트 목록 */}
      <div className='flex flex-col w-full md:w-1/2 border border-gray-100 divide-y divide-gray-100'>
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            layoutId={item.heading}
            onClick={() => handleClick(idx)}
            className={cn(
              'p-5 md:p-8 relative cursor-pointer transition-colors',
              idx === active ? 'bg-gray-50' : 'hover:bg-gray-50'
            )}
          >
            {item.link ? (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="block"
              >
                <h3 className='text-base md:text-lg font-semibold leading-none text-gray-900'>
                  {item.heading}
                </h3>
                <p className='mt-2 text-sm text-gray-400'>{item.description}</p>
              </a>
            ) : (
              <>
                <h3 className='text-base md:text-lg font-semibold leading-none text-gray-300'>
                  {item.heading}
                </h3>
                <p className='mt-2 text-sm text-gray-400'>{item.description}</p>
              </>
            )}
            {idx === active && (
              <motion.div
                key={`bar-${active}`}
                className='absolute h-px bottom-0 left-0 bg-gray-900'
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: cycleDelay / 1000, ease: 'linear' }}
                onAnimationComplete={handleAnimationComplete}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* 이미지 */}
      <div
        className={cn(
          'w-full md:w-1/2 border border-gray-100 md:border-l-0 border-b-0 md:border-b relative overflow-hidden',
          mediaClass,
        )}
      >
        <div className='absolute inset-0'>
          <Image
            src={items[previous].media}
            alt={items[previous].heading}
            fill
            className='object-cover'
          />
        </div>

        {hasAnimated && (
          <motion.div
            key={active}
            initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className='absolute inset-0'
          >
            <Image
              src={activeItem.media}
              alt={activeItem.heading}
              fill
              className='object-cover'
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}

Showcase.displayName = 'Showcase';
export { Showcase };
