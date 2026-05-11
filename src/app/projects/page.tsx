import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';
import { Navbar, Footer } from '@/components/Shared';
import { ArrowUpRight, Calendar } from 'lucide-react';
import { PROJECT_SORT } from '@/lib/constants';
import { formatProjectDate } from '@/lib/dateUtils';
import { Project as ProjectType } from '@/types/project';
import ProjectCard from '@/components/ProjectCard';

export default async function ProjectsPage() {
  await dbConnect();
  // Fetch all projects (without limit)
  const projects = await Project.find({}).sort(PROJECT_SORT).lean();
  
  const portfolioData: ProjectType[] = projects.map(p => ({
    id: p._id.toString(),
    title: p.title,
    description: p.description,
    tags: p.tags,
    startDate: p.startDate ? p.startDate.toISOString() : undefined,
    endDate: p.endDate ? p.endDate.toISOString() : undefined,
    isOngoing: p.isOngoing,
    image: p.image
  }));

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '120px', paddingBottom: '40px', backgroundColor: 'var(--bg-primary)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <h1 style={{ fontSize: 'clamp(40px, 6vw, 64px)', textTransform: 'uppercase', marginBottom: '24px' }}>
            ALL <span className="text-orange">PROJECTS</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>
            A comprehensive list of all projects I've worked on, from frontend development to full-stack UI/UX solutions.
          </p>
        </div>
      </div>
      <section className="gallery-section">
        <div className="container">
          <div className="gallery-grid">
            {portfolioData.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
