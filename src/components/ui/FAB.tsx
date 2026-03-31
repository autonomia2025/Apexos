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
      className="fab"
      style={{ bottom: 'calc(88px + env(safe-area-inset-bottom))', right: '24px', display: isOpen ? 'flex' : 'flex' }}
    >
      {pulse && !isOpen && (
        <motion.span animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }} transition={{ duration: 1.2, repeat: Infinity }} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', borderRadius: '999px', background: '#c1603a' }}></motion.span>
      )}
      <motion.div
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Plus size={24} style={{ position: 'relative', zIndex: 10 }} />
      </motion.div>
    </motion.button>
  );
};
