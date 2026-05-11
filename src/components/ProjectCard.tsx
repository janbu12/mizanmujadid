'use client';

import { useState } from 'react';
import { ArrowUpRight, Calendar } from 'lucide-react';
import { formatProjectDate } from '@/lib/dateUtils';
import { Project as ProjectType } from '@/types/project';
import Link from 'next/link';

interface ProjectCardProps {
  project: ProjectType;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [isActive, setIsActive] = useState(false);

  const toggleActive = () => {
    setIsActive(!isActive);
  };

  return (
    <div 
      className={`gallery-item reveal ${isActive ? 'mobile-active' : ''}`}
      onClick={toggleActive}
    >
      <div className="gallery-image-wrapper">
        {project.image ? (
          <img src={project.image} alt={project.title} className="gallery-image" />
        ) : (
          <div className="gallery-placeholder">No Image Available</div>
        )}
        <div className="gallery-overlay">
          <div className="gallery-content">
            <div className="gallery-tags">
              {project.tags?.map((tag: string) => (
                <span key={tag} className="gallery-tag">{tag}</span>
              ))}
            </div>
            <h3 className="gallery-title">{project.title}</h3>
            <div className="gallery-duration" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--accent-orange)', marginBottom: '12px', fontWeight: 600 }}>
              <Calendar size={12} />
              {formatProjectDate(project.startDate, project.endDate, project.isOngoing)}
              {project.isOngoing && <span style={{ backgroundColor: 'var(--accent-orange)', color: '#000', padding: '1px 6px', borderRadius: '3px', fontSize: '9px' }}>ONGOING</span>}
            </div>
            <p className="gallery-desc">{project.description}</p>
            <div className="gallery-link-container" onClick={(e) => e.stopPropagation()}>
              <Link href={`/projects/${project.id}`} className="gallery-link">
                View Project <ArrowUpRight size={18} className="arrow" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
