'use client';

import { useState, useMemo } from 'react';
import { Project as ProjectType } from '@/types/project';
import ProjectCard from './ProjectCard';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectGalleryProps {
  projects: ProjectType[];
}

const CATEGORIES = ['All', 'Web', 'Mobile', 'UI/UX'];

export default function ProjectGallery({ projects }: ProjectGalleryProps) {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const handleToggle = (id: string) => {
    setActiveProjectId(prev => prev === id ? null : id);
  };

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return projects;
    
    return projects.filter(project => {
      const tags = project.tags.map(t => t.toUpperCase());
      if (activeCategory === 'Web') {
        return tags.some(t => t.includes('WEB') || t.includes('NEXT') || t.includes('NODE') || t.includes('REACT'));
      }
      if (activeCategory === 'Mobile') {
        return tags.some(t => t.includes('MOBILE') || t.includes('FLUTTER') || t.includes('ANDROID') || t.includes('IOS'));
      }
      if (activeCategory === 'UI/UX') {
        return tags.some(t => t.includes('UI') || t.includes('UX') || t.includes('DESIGN') || t.includes('FIGMA'));
      }
      return false;
    });
  }, [activeCategory, projects]);

  return (
    <div className="gallery-container">
      {/* Category Tabs */}
      <div className="filter-tabs" style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '60px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => {
              setActiveCategory(category);
              setActiveProjectId(null);
            }}
            className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
            style={{
              padding: '12px 28px',
              borderRadius: '100px',
              border: activeCategory === category ? '1px solid var(--accent-orange)' : '1px solid var(--card-border)',
              backgroundColor: activeCategory === category ? 'var(--orange-dim)' : 'transparent',
              color: activeCategory === category ? 'var(--accent-orange)' : 'var(--text-muted)',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid with Animation */}
      <motion.div 
        layout
        className="gallery-grid"
      >
        <AnimatePresence mode='popLayout'>
          {filteredProjects.map((project) => {
            const projectId = project.id || project._id || '';
            return (
              <motion.div
                key={projectId}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: "circOut" }}
              >
                <ProjectCard 
                  project={project} 
                  isActive={activeProjectId === projectId}
                  onToggle={() => handleToggle(projectId)}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {filteredProjects.length === 0 && (
        <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>
          <p>No projects found in this category.</p>
        </div>
      )}
    </div>
  );
}
