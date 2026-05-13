'use client';

import { useState } from 'react';
import ProjectCard from '@/components/ProjectCard';

interface RelatedProjectWrapperProps {
  projects: any[];
}

export default function RelatedProjectWrapper({ projects }: RelatedProjectWrapperProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className="related-projects-grid" style={{ marginTop: '0' }}>
      {projects.map((project) => (
        <ProjectCard 
          key={project.id} 
          project={project} 
          isActive={activeId === project.id}
          onToggle={() => setActiveId(activeId === project.id ? null : project.id)}
          showDescription={false}
          showTags={false}
        />
      ))}
    </div>
  );
}
