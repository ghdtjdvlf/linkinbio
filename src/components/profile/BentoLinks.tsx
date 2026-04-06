'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import { cn } from '@/lib/utils';
import { type SiteLink } from '@/lib/siteData';

const platformLogo: Record<string, string> = {
  instagram: "/uploads/instalogo.png",
  tiktok:    "/uploads/tiktoklogo.png",
};

function colSpan(link: SiteLink, index: number): string {
  if (link.span) return `md:col-span-${link.span}`;
  return index % 2 === 0 ? 'md:col-span-4' : 'md:col-span-2';
}

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

/* SeparatedCard 컴포넌트 */
function SeparatedCard({ link }: { link: SiteLink }) {
  const img = link.thumbnail ?? platformLogo[link.platform];
  return (
    <div className="flex flex-col w-full h-full min-h-[16rem] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-200 hover:shadow-md">
      <div className="relative flex-1 overflow-hidden">
        {img ? (
          <img src={img} alt={link.label} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gray-100" />
        )}
      </div>
      <div className="px-4 py-3 bg-white">
        <p className="font-semibold text-gray-900">{link.label}</p>
      </div>
    </div>
  );
}

/* MergedCard 컴포넌트 */
function MergedCard({ link }: { link: SiteLink }) {
  const img = link.thumbnail ?? platformLogo[link.platform];
  const minH = link.compact ? 'min-h-[5rem]' : 'min-h-[16rem]';
  return (
    <div className={`relative w-full h-full ${minH} overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-200 hover:shadow-md`}>
      {img ? (
        <img src={img} alt={link.label} className="absolute inset-0 h-full w-full object-contain" />
      ) : (
        <div className="absolute inset-0 bg-gray-100" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />        
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
        <p className="font-semibold text-white drop-shadow text-sm">{link.label}</p>
      </div>
    </div>
  );
}

interface BentoLinksProps {
  links: SiteLink[];
}

export default function BentoLinks({ links }: BentoLinksProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <BentoGrid>
        {links.map((link: SiteLink, i: number) => (
          <motion.div
            key={link.id}
            variants={itemVariants}
            className={cn('w-full h-full', colSpan(link, i))}
            animate={{
              scale:   hoveredIndex === null ? 1 : hoveredIndex === i ? 1 : 0.97,
              opacity: hoveredIndex === null ? 1 : hoveredIndex === i ? 1 : 0.5,
              filter:  hoveredIndex === null ? 'blur(0px)' : hoveredIndex === i ? 'blur(0px)' : 'blur(1.5px)',  
            }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onHoverStart={() => setHoveredIndex(i)}
            onHoverEnd={() => setHoveredIndex(null)}
          >
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="block w-full h-full">       
              {link.mix ? (
                <MergedCard link={link} />
              ) : (
                <SeparatedCard link={link} />
              )}
            </a>
          </motion.div>
        ))}
      </BentoGrid>
    </motion.div>
  );
}