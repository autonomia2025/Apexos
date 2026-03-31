import React from 'react';
import { motion } from 'framer-motion';

interface PageWrapperProps {
  children: React.ReactNode;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="p-4 md:p-8 pt-safe pb-[100px] md:pb-12 ml-0 md:ml-20 xl:ml-64 relative min-h-screen"
    >
      {/* Subtle top gradient on scroll indication */}
      <div className="fixed top-0 left-0 md:left-20 xl:left-64 right-0 h-10 bg-gradient-to-b from-navy-900 to-transparent z-30 pointer-events-none" />
      
      {children}
    </motion.div>
  );
};
