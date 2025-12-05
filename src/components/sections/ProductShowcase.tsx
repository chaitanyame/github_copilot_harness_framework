'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProductShowcaseProps {
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt: string;
  features?: string[];
  reversed?: boolean;
  className?: string;
}

export function ProductShowcase({
  title,
  description,
  imageSrc,
  imageAlt,
  features,
  reversed = false,
  className,
}: ProductShowcaseProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <div
      ref={ref}
      className={cn(
        'grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center',
        className
      )}
    >
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: reversed ? 30 : -30 }}
        animate={
          isInView
            ? { opacity: 1, x: 0 }
            : { opacity: 0, x: reversed ? 30 : -30 }
        }
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn(reversed && 'lg:order-2')}
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold tracking-tight text-foreground mb-6">
          {title}
        </h2>
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          {description}
        </p>
        {features && features.length > 0 && (
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{
                  duration: 0.4,
                  delay: 0.3 + index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex items-start gap-3"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                <span className="text-foreground">{feature}</span>
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>

      {/* Image */}
      <motion.div
        initial={{ opacity: 0, x: reversed ? -30 : 30 }}
        animate={
          isInView
            ? { opacity: 1, x: 0 }
            : { opacity: 0, x: reversed ? -30 : 30 }
        }
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className={cn(reversed && 'lg:order-1')}
      >
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <span className="text-lg">Product Image</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
