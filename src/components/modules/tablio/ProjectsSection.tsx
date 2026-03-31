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
      case 'Alta': return { color: '#f87171', background: 'rgba(248,113,113,0.1)', borderColor: 'rgba(248,113,113,0.3)' };
      case 'Media': return { color: '#facc15', background: 'rgba(250,204,21,0.1)', borderColor: 'rgba(250,204,21,0.3)' };
      case 'Baja': return { color: '#4ade80', background: 'rgba(74,222,128,0.1)', borderColor: 'rgba(74,222,128,0.3)' };
    }
  };

  const getDeptColor = (dept: Department) => {
    switch (dept) {
      case 'Informática': return '#60a5fa';
      case 'Desarrollo IA': return '#a78bfa';
      case 'Ventas': return '#4ade80';
      case 'Marketing': return '#facc15';
    }
  };

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
        <h2 style={{ fontSize: '24px', fontFamily: '"Playfair Display", serif', fontWeight: 700, color: '#fff', margin: 0 }}>Proyectos Activos</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {projects.map((project) => (
          <motion.div key={project.id} whileTap={{ scale: 0.98 }}>
            <GlassCard style={{ padding: '20px', borderColor: 'rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', gap: '16px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, border: '1px solid rgba(240,192,64,0.3)', color: '#f0c040', background: 'rgba(240,192,64,0.05)', whiteSpace: 'nowrap' }}>
                      {project.venture}
                    </span>
                    <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, border: '1px solid', ...getPriorityColor(project.priority) }}>
                      {project.priority} Prioridad
                    </span>
                     {project.status !== 'Activo' && (
                       <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, border: `1px solid ${project.status === 'En pausa' ? 'rgba(107,114,128,0.5)' : 'rgba(74,222,128,0.3)'}`, color: project.status === 'En pausa' ? 'rgba(255,255,255,0.55)' : '#4ade80', background: project.status === 'En pausa' ? 'rgba(107,114,128,0.1)' : 'rgba(74,222,128,0.1)' }}>
                         {project.status}
                       </span>
                     )}
                  </div>
                  <h3 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, color: '#fff', fontSize: '15px', lineHeight: 1.35, width: '100%', paddingRight: '16px', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {project.name}
                  </h3>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={10} /> {project.lastUpdated}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.75)', fontFamily: '"JetBrains Mono", monospace', fontSize: '12px', fontWeight: 700 }}>{project.progress}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(8,15,35,0.9)', borderRadius: '999px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    style={{ height: '100%', borderRadius: '999px', background: project.status === 'Activo' ? '#f0c040' : 'rgba(156,163,175,0.8)', boxShadow: project.status === 'Activo' ? '0 0 10px rgba(240,192,64,0.5)' : 'none' }}
                  />
                </div>
              </div>

              {/* Owners (Departments) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>Owner:</span>
                <div style={{ display: 'flex', marginLeft: '-4px' }}>
                  {project.departments.map(dept => (
                    <div 
                      key={dept} 
                      title={dept}
                      style={{ width: '20px', height: '20px', borderRadius: '999px', border: '1px solid #060d1f', background: getDeptColor(dept), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 700, color: '#060d1f', boxShadow: '0 2px 6px rgba(0,0,0,0.2)', position: 'relative', marginLeft: '4px' }}
                    >
                      {dept.charAt(0)}
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
