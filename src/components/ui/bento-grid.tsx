'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => (
  <div
    className={cn(
      'mx-auto grid w-full grid-cols-1 gap-3 md:auto-rows-[16rem] md:grid-cols-6',
      className,
    )}
  >
    {children}
  </div>
);

const BentoGridItem = ({
  className,
  containerClassName,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  containerClassName?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => (
  <div className={cn('w-full h-full', containerClassName)}>
    <div
      className={cn(
        'group/bento flex flex-col justify-between space-y-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition duration-200 hover:shadow-md w-full h-full overflow-hidden',
        className,
      )}
    >
      {header}
      <div className='transition duration-300 group-hover/bento:-translate-y-1'>
        {icon}
        <div className='mt-2 font-semibold text-gray-900'>{title}</div>
        {description && (
          <div className='mt-1 text-xs text-gray-400'>{description}</div>
        )}
      </div>
    </div>
  </div>
);

export { BentoGrid, BentoGridItem };
