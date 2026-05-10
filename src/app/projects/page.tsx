import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';
import { Navbar, Footer } from '@/components/Shared';
import { ArrowUpRight, Calendar } from 'lucide-react';
import { PROJECT_SORT } from '@/lib/constants';
import { formatProjectDate } from '@/lib/dateUtils';
import { Project as ProjectType } from '@/types/project';

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
            {portfolioData.map((project, index) => (
              <div key={project.id} className="gallery-item reveal">
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
                      <div className="gallery-link">
                        View Project <ArrowUpRight size={18} className="arrow" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
