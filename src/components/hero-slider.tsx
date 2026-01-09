
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { heroSliderConfig } from '@/lib/site-config';
import type { SiteSettings, HeroSlide } from '@/lib/types';

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1 + 0.3, duration: 0.5, ease: 'easeOut' },
  }),
};

export default function HeroSlider({ settings }: { settings: SiteSettings }) {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isHovered, setIsHovered] = useState(false);

  const slideIndex = page % heroSliderConfig.slides.length;
  const currentSlide = heroSliderConfig.slides[slideIndex];

  const paginate = useCallback((newDirection: number) => {
    setPage(([prevPage, _]) => [prevPage + newDirection, newDirection]);
  }, []);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      paginate(1);
    }, heroSliderConfig.rotateInterval);
    return () => clearInterval(interval);
  }, [isHovered, paginate]);

  // Parallax scroll effect
  const scrollY = useMotionValue(0);
  useEffect(() => {
    const handleScroll = () => scrollY.set(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollY]);

  const y = useTransform(scrollY, [0, 500], [0, -100]);
  const springY = useSpring(y, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <section 
      className="relative h-[65vh] md:h-[75vh] w-full text-white flex items-center overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          className="absolute inset-0"
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 },
          }}
        >
          <motion.div style={{ y: springY }} className="h-full w-full">
            <Image
              src={currentSlide.imageUrl}
              alt={currentSlide.title}
              fill
              className="object-cover"
              priority={page === 0}
              data-ai-hint={currentSlide.imageHint}
              sizes="100vw"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-20 container mx-auto px-4 text-center">
        <motion.p
            custom={0}
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="text-sm md:text-base font-semibold uppercase tracking-widest text-primary mb-2"
        >
          Shop: {currentSlide.categoryName}
        </motion.p>
        <motion.h1 
            custom={1}
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="text-4xl md:text-6xl font-extrabold font-headline"
            style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}
        >
          {currentSlide.title}
        </motion.h1>
        <motion.p 
            custom={2}
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="mt-4 text-lg md:text-xl max-w-2xl mx-auto"
            style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}
        >
          {currentSlide.subtitle}
        </motion.p>
        <motion.div 
            custom={3}
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <Button asChild size="lg" className="font-bold">
            <Link href={currentSlide.primaryCta.href}>
              {currentSlide.primaryCta.label}
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary" className="font-bold">
            <Link href={currentSlide.secondaryCta.href}>
              {currentSlide.secondaryCta.label}
            </Link>
          </Button>
        </motion.div>
        <motion.div 
            custom={4}
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="mt-6 text-xs text-white/70 space-x-4"
        >
            <span>2 locations in San Fernando</span>
            <span>&bull;</span>
            <span>Fast replies on WhatsApp</span>
        </motion.div>
      </div>
      
      {/* Navigation Arrows */}
      <div className="absolute z-30 top-1/2 -translate-y-1/2 left-4">
        <Button variant="outline" size="icon" className="rounded-full bg-white/20 hover:bg-white/40 border-none" onClick={() => paginate(-1)}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      <div className="absolute z-30 top-1/2 -translate-y-1/2 right-4">
        <Button variant="outline" size="icon" className="rounded-full bg-white/20 hover:bg-white/40 border-none" onClick={() => paginate(1)}>
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
        {heroSliderConfig.slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setPage([i, i > slideIndex ? 1 : -1])}
            className={cn(
              "h-2 w-2 rounded-full transition-colors",
              i === slideIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
            )}
          />
        ))}
      </div>
    </section>
  );
}
