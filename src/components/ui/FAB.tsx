import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface FABProps {
  onClick: () => void;
  pulse?: boolean;
  isOpen?: boolean;
}

export const FAB: React.FC<FABProps> = ({ onClick, pulse = false, isOpen = false }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed right-6 w-14 h-14 bg-gold-400 text-navy-900 rounded-full flex items-center justify-center shadow-[0_10px_24px_rgba(240,192,64,0.38)] hover:bg-gold-300 transition-colors z-40 md:hidden"
      style={{ bottom: 'calc(88px + env(safe-area-inset-bottom))' }}
    >
      {pulse && !isOpen && (
        <span className="absolute inset-0 w-full h-full rounded-full bg-gold-400 opacity-50 animate-ping"></span>
      )}
      <motion.div
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Plus size={24} className="relative z-10" />
      </motion.div>
    </motion.button>
  );
};
