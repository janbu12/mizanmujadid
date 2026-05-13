'use client';

import { useRef, useState, useEffect } from 'react';
import { ArrowUpRight, Calendar } from 'lucide-react';
import { formatProjectDate } from '@/lib/dateUtils';
import { Project as ProjectType } from '@/types/project';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectCardProps {
  project: ProjectType;
  isActive: boolean;
  onToggle: () => void;
  showDescription?: boolean;
  showTags?: boolean;
}

export default function ProjectCard({ 
  project, 
  isActive, 
  onToggle, 
  showDescription = true,
  showTags = true 
}: ProjectCardProps) {
  const lastInteractionTime = useRef(0);
  const [isDesktop, setIsDesktop] = useState(false);

  // Gunakan useEffect untuk mendeteksi layar setelah mount
  // Ini mencegah Hydration Mismatch
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth > 768);
    };
    
    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);
  
  const handleInteraction = (e: React.PointerEvent | React.MouseEvent) => {
    if (window.innerWidth <= 768) {
      const now = Date.now();
      if (now - lastInteractionTime.current < 300) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      lastInteractionTime.current = now;
      onToggle();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`gallery-item ${isActive ? 'mobile-active' : ''}`}
      onPointerDown={handleInteraction}
      onClick={(e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      style={{ touchAction: 'pan-y' }}
    >
      <div className="gallery-image-wrapper">
        {project.image ? (
          <img src={project.image} alt={project.title} className="gallery-image" />
        ) : (
          <div className="gallery-placeholder">No Image Available</div>
        )}
        
        <div className="gallery-overlay">
          <AnimatePresence mode="wait">
            {(isActive || isDesktop) && (
              <motion.div 
                key="content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="gallery-content"
              >
                {showTags && (
                  <div 
                    className="gallery-tags" 
                    onPointerDown={(e) => e.stopPropagation()} 
                    onClick={(e) => e.stopPropagation()}
                  >
                    {project.tags?.map((tag: string) => (
                      <span key={tag} className="gallery-tag">{tag}</span>
                    ))}
                  </div>
                )}
                <h3 className="gallery-title">{project.title}</h3>
                <div className="gallery-duration" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--accent-orange)', marginBottom: '12px', fontWeight: 600 }}>
                  <Calendar size={12} />
                  {formatProjectDate(project.startDate, project.endDate, project.isOngoing)}
                  {project.isOngoing && <span style={{ backgroundColor: 'var(--accent-orange)', color: '#000', padding: '1px 6px', borderRadius: '3px', fontSize: '9px' }}>ONGOING</span>}
                </div>
                {showDescription && <p className="gallery-desc">{project.description}</p>}
                
                <div className="gallery-link-container" onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
                  <Link href={`/projects/${project.slug}`} className="gallery-link">
                    View Project <ArrowUpRight size={18} className="arrow" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
