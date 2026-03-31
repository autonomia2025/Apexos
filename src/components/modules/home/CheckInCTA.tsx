import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { GlassCard } from '../../ui/GlassCard';

export const CheckInCTA: React.FC = () => {
  return (
    <div className="hidden md:block w-full fixed bottom-0 left-[72px] right-0 p-6 pointer-events-none z-40 bg-gradient-to-t from-navy-900 via-navy-900/80 to-transparent">
      <div className="max-w-5xl mx-auto flex justify-end pointer-events-auto">
        <GlassCard 
          className="px-6 py-4 flex items-center gap-4 cursor-pointer hover:border-gold-400 group"
        >
          <div className="flex flex-col">
            <h4 className="text-white font-display font-bold text-lg">Check-in Diario</h4>
            <p className="text-gray-400 text-sm font-body">Registrá el progreso de tu día</p>
          </div>
          
          <motion.div 
            className="w-10 h-10 rounded-full bg-gold-400 text-navy-900 flex items-center justify-center ml-2"
            animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 0px rgba(240,192,64,0)", "0 0 15px rgba(240,192,64,0.5)", "0 0 0px rgba(240,192,64,0)"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </motion.div>
        </GlassCard>
      </div>
    </div>
  );
};
