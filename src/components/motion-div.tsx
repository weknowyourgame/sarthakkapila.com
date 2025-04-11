"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type MotionDivProps = {
  children: ReactNode;
  initial?: any;
  animate?: any;
  whileHover?: any;
  key?: string | number;
  className?: string;
};

export default function MotionDiv({
  children,
  initial,
  animate,
  whileHover,
  key,
  className,
}: MotionDivProps) {
  return (
    <motion.div
      key={key}
      initial={initial}
      animate={animate}
      whileHover={whileHover}
      className={className}
    >
      {children}
    </motion.div>
  );
} 