'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: 'default' | 'muted' | 'dark';
}

export function SectionWrapper({
  children,
  className,
  id,
  background = 'default',
}: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const bgClasses = {
    default: 'bg-background',
    muted: 'bg-muted/50',
    dark: 'bg-foreground text-background',
  };

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(
        'py-section-mobile md:py-section',
        bgClasses[background],
        className
      )}
    >
      <div className="container-wide">{children}</div>
    </motion.section>
  );
}
