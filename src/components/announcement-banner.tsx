
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { announcementConfig } from '@/lib/site-config';

export function AnnouncementBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % announcementConfig.messages.length);
    }, announcementConfig.rotateInterval);

    return () => clearInterval(timer);
  }, []);

  const currentMessage = announcementConfig.messages[index];

  return (
    <div className="relative z-50 h-10 w-full overflow-hidden bg-accent text-accent-foreground">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={index}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="absolute inset-0 flex h-full w-full items-center justify-center"
        >
          <Link href={currentMessage.href} className="group flex h-full w-full items-center justify-center">
            <span className="text-sm font-semibold tracking-wide">
              {currentMessage.text}
            </span>
            <span
              className={cn(
                'absolute bottom-0 left-0 h-0.5 bg-accent-foreground/70 transition-all duration-300 group-hover:w-full',
                'motion-safe:group-focus-visible:w-full'
              )}
              style={{ width: 0 }}
            />
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
