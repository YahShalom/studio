
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
import { PlaceHolderImages } from '@/lib/placeholder-images';

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

const BackgroundImage = ({ imageUrl, imageHint, isPriority, y }: { imageUrl: string; imageHint: string; isPriority: boolean; y: any }) => (
    <motion.div style={{ y }} className="h-full w-full">
        {imageUrl && (
            <Image
            src={imageUrl}
            alt={imageHint}
            fill
            className="object-cover"
            priority={isPriority}
            data-ai-hint={imageHint}
            sizes="100vw"
            />
        )}
    </motion.div>
);

const SlideContent = ({ slide, page, direction }: { slide: HeroSlide, page: number, direction: number }) => {
    const [imageIndex, setImageIndex] = useState(0);
    const fallbackImage = PlaceHolderImages.find(p => p.id === 'hero-image') || { imageUrl: "https://picsum.photos/seed/hero/1920/1080", imageHint: "fashion background" };

    const images = (Array.isArray(slide.imageUrl) && slide.imageUrl.length > 0)
        ? slide.imageUrl
        : (typeof slide.imageUrl === 'string' && slide.imageUrl)
        ? [slide.imageUrl]
        : [fallbackImage.imageUrl];

    useEffect(() => {
        if (images.length <= 1) return;
        const timer = setInterval(() => {
            setImageIndex(prev => (prev + 1) % images.length);
        }, heroSliderConfig.rotateInterval / 1.5);
        return () => clearInterval(timer);
    }, [images.length]);
    
    // Parallax scroll effect
    const scrollY = useMotionValue(0);
    useEffect(() => {
        const handleScroll = () => scrollY.set(window.scrollY);
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (!mediaQuery.matches) {
            window.addEventListener('scroll', handleScroll);
        }
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrollY]);
    
    const y = useSpring(useTransform(scrollY, [0, 500], [0, -100]), { stiffness: 100, damping: 30, restDelta: 0.001 });

    const currentImageUrl = images[imageIndex] || fallbackImage.imageUrl;

    return (
        <motion.div
            key={page}
            className="absolute inset-0"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.5 } }}
        >
            <AnimatePresence initial={false} mode="wait">
                <motion.div
                    key={`${page}-${imageIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                    className="absolute inset-0"
                >
                    <BackgroundImage imageUrl={currentImageUrl} imageHint={slide.imageHint} isPriority={page === 0} y={y} />
                </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10" />

            <div className="relative z-20 container mx-auto px-4 text-center flex flex-col items-center justify-center h-full">
                 <motion.p
                    key={`${page}-category`}
                    custom={0}
                    initial="hidden"
                    animate="visible"
                    variants={textVariants}
                    className="text-sm md:text-base font-semibold uppercase tracking-widest text-primary mb-2"
                >
                    Shop: {slide.categoryName}
                </motion.p>
                <motion.h1
                    key={`${page}-title`}
                    custom={1}
                    initial="hidden"
                    animate="visible"
                    variants={textVariants}
                    className="text-4xl md:text-6xl font-extrabold font-headline"
                    style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}
                >
                    {slide.title}
                </motion.h1>
                <motion.p
                    key={`${page}-subtitle`}
                    custom={2}
                    initial="hidden"
                    animate="visible"
                    variants={textVariants}
                    className="mt-4 text-lg md:text-xl max-w-2xl mx-auto"
                    style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}
                >
                    {slide.subtitle}
                </motion.p>
                <motion.div
                    key={`${page}-ctas`}
                    custom={3}
                    initial="hidden"
                    animate="visible"
                    variants={textVariants}
                    className="mt-8 flex flex-wrap justify-center gap-4"
                >
                    <Button asChild size="lg" className="font-bold">
                        <Link href={slide.primaryCta.href}>
                        {slide.primaryCta.label}
                        </Link>
                    </Button>
                    <Button asChild size="lg" variant="secondary" className="font-bold">
                        <Link href={slide.secondaryCta.href}>
                        {slide.secondaryCta.label}
                        </Link>
                    </Button>
                </motion.div>
                <motion.div
                    key={`${page}-subtext`}
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
        </motion.div>
    );
};

export default function HeroSlider({ settings }: { settings: SiteSettings }) {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isHovered, setIsHovered] = useState(false);

  const slideIndex = page % heroSliderConfig.slides.length;
  const currentSlide = heroSliderConfig.slides[slideIndex];

  const paginate = useCallback((newDirection: number) => {
    setPage(([prevPage, _]) => [(prevPage + newDirection + heroSliderConfig.slides.length) % heroSliderConfig.slides.length, newDirection]);
  }, []);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      paginate(1);
    }, heroSliderConfig.rotateInterval);
    return () => clearInterval(interval);
  }, [isHovered, paginate]);

  return (
    <section 
      className="relative h-[65vh] md:h-[75vh] w-full text-white flex items-center overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence initial={false} custom={direction}>
        <SlideContent slide={currentSlide} page={page} direction={direction} />
      </AnimatePresence>
      
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
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
