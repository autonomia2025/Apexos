import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { GlassCard } from '../../ui/GlassCard';
import { Project, Department } from '../../../types/tablio';
import { ProjectModal } from './ProjectModal';
import { FAB } from '../../ui/FAB';

interface ProjectsSectionProps {
  projects: Project[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getPriorityColor = (p: Project['priority']) => {
    switch (p) {
      case 'Alta': return 'text-red-400 bg-red-400/10 border-red-400/30';
      case 'Media': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'Baja': return 'text-green-400 bg-green-400/10 border-green-400/30';
    }
  };

  const getDeptColor = (dept: Department) => {
    switch (dept) {
      case 'Informática': return 'bg-blue-400';
      case 'Desarrollo IA': return 'bg-purple-400';
      case 'Ventas': return 'bg-green-400';
      case 'Marketing': return 'bg-yellow-400';
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-end mb-2">
        <h2 className="text-xl font-display font-bold text-white">Proyectos Activos</h2>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <motion.div key={project.id} whileTap={{ scale: 0.98 }}>
            <GlassCard className="p-5 border-white/5 group hover:border-gold-400/20 transition-colors">
              <div className="flex justify-between items-start mb-4 gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[9px] uppercase tracking-widest font-bold border border-gold-400/30 text-gold-400 bg-gold-400/5 whitespace-nowrap">
                      {project.venture}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-widest font-bold border ${getPriorityColor(project.priority)}`}>
                      {project.priority} Prioridad
                    </span>
                     {project.status !== 'Activo' && (
                       <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-widest font-bold border ${
                         project.status === 'En pausa' ? 'border-gray-500/50 text-gray-400 bg-gray-500/10' : 'border-green-400/30 text-green-400 bg-green-400/10'
                       }`}>
                         {project.status}
                       </span>
                     )}
                  </div>
                  <h3 className="font-display font-bold text-white text-[15px] leading-snug w-full pr-4 truncate">
                    {project.name}
                  </h3>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-mono text-[10px] uppercase tracking-widest flex items-center gap-1">
                    <Clock size={10} /> {project.lastUpdated}
                  </span>
                  <span className="text-gray-300 font-mono text-xs font-bold">{project.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-navy-800 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full rounded-full ${project.status === 'Activo' ? 'bg-gold-400 shadow-[0_0_10px_rgba(240,192,64,0.5)]' : 'bg-gray-500'}`}
                  />
                </div>
              </div>

              {/* Owners (Departments) */}
              <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Owner:</span>
                <div className="flex -space-x-1">
                  {project.departments.map(dept => (
                    <div 
                      key={dept} 
                      className={`w-5 h-5 rounded-full border border-navy-900 ${getDeptColor(dept)} flex items-center justify-center text-[8px] font-bold text-navy-900 shadow-sm relative group/tooltip`}
                    >
                      {dept.charAt(0)}
                      {/* Tooltip */}
                      <span className="absolute bottom-full mb-1 opacity-0 group-hover/tooltip:opacity-100 bg-navy-800 text-white px-2 py-1 text-[10px] rounded transition-opacity whitespace-nowrap pointer-events-none z-10 border border-white/10">
                        {dept}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <FAB onClick={() => setIsModalOpen(true)} pulse={false} isOpen={isModalOpen} />

      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        color="var(--color-gold-400)" 
      />
    </section>
  );
};
