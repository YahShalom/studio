
'use client';

import { motion, HTMLMotionProps } from 'framer-motion';

export const MotionDiv = (props: HTMLMotionProps<'div'>) => {
  return <motion.div {...props} />;
};
