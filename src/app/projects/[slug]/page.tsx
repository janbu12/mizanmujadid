import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Calendar, User, Briefcase, ArrowRight } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';
import { formatProjectDate } from '@/lib/dateUtils';
import { Navbar, Footer } from '@/components/Shared';
import { PROJECT_SORT } from '@/lib/constants';
import RelatedProjectWrapper from './RelatedProjectWrapper';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  await dbConnect();
  
  // 1. Fetch current project
  let project;
  try {
    project = await Project.findOne({ slug }).lean();
  } catch (error) {
    return notFound();
  }

  if (!project) return notFound();

  // 2. Fetch all projects for "Continue Exploring" logic
  const allProjects = await Project.find({}).sort(PROJECT_SORT).lean();
  
  // Find current project index
  const currentIndex = allProjects.findIndex(p => p._id.toString() === project._id.toString());
  
  // Calculate 4 projects to recommend (wrap around logic)
  const recommendedProjects = [];
  if (allProjects.length > 1) {
    for (let i = 1; i <= 4; i++) {
      if (recommendedProjects.length >= allProjects.length - 1) break; // Don't include current or repeat
      const nextIndex = (currentIndex + i) % allProjects.length;
      if (nextIndex !== currentIndex) {
        const p = allProjects[nextIndex];
        recommendedProjects.push({
          ...p,
          id: p._id.toString(),
          startDate: p.startDate?.toISOString(),
          endDate: p.endDate?.toISOString(),
        });
      }
    }
  }

  const projectData = {
    ...project,
    id: project._id.toString(),
    startDate: project.startDate?.toISOString(),
    endDate: project.endDate?.toISOString(),
  };

  return (
    <main className="project-page" style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
      <Navbar />
      
      {/* Dynamic Hero Section */}
      <section 
        className="project-detail-hero" 
        style={{ backgroundImage: `url(${projectData.image})` }}
      >
        <div className="hero-overlay" />
        
        <div className="hero-content-wrapper">
          <div className="container">
            <Link href="/projects" className="back-link">
              <ArrowLeft size={18} /> Back to Archive
            </Link>
            <h1 className="project-title-large">{projectData.title}</h1>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {projectData.tags.map((tag: string) => (
                <span key={tag} className="project-detail-tag" style={{
                  padding: '8px 20px',
                  backgroundColor: 'rgba(255,107,26,0.1)',
                  color: 'var(--accent-orange)',
                  borderRadius: '100px',
                  fontSize: '10px',
                  fontWeight: '700',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  border: '1px solid rgba(255,107,26,0.2)'
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Case Study Content Section */}
      <section style={{ position: 'relative', zIndex: 5 }}>
        <div className="container">
          <div className="detail-grid">
            
            {/* Left Column: Narrative */}
            <div className="detail-main">
              <div className="section-label" style={{ marginBottom: '16px' }}>Project Background</div>
              <h2 style={{ fontSize: '32px', marginBottom: '24px' }}>Overview & Goals</h2>
              <p style={{ fontSize: '20px', lineHeight: '1.7', color: 'var(--text-primary)', marginBottom: '40px' }}>
                {projectData.description}
              </p>
              
              {projectData.content && (
                <div className="content-area">
                  <div className="section-label" style={{ marginBottom: '16px' }}>Technical Deep-Dive</div>
                  <div className="content-body">
                    {projectData.content}
                  </div>
                </div>
              )}

              {/* Enhanced Visual Gallery */}
              {projectData.gallery && projectData.gallery.length > 0 && (
                <div className="gallery-section" style={{ marginTop: '100px' }}>
                  <div className="section-label" style={{ marginBottom: '16px' }}>Showcase</div>
                  <h2 style={{ fontSize: '32px', marginBottom: '40px' }}>Interface Exploration</h2>
                  <div className="gallery-grid-detail">
                    {projectData.gallery.map((img: string, idx: number) => (
                      <div key={idx} className="gallery-item">
                        <img 
                          src={img} 
                          alt={`${projectData.title} exploration ${idx + 1}`}
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Metadata Sidebar */}
            <div className="detail-sidebar">
              <div className="sidebar-card" style={{ 
                backgroundColor: 'rgba(255,255,255,0.02)', 
                padding: '40px', 
                borderRadius: '24px',
                border: '1px solid var(--card-border)',
                backdropFilter: 'blur(10px)'
              }}>
                <h3 style={{ fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '40px', color: 'var(--text-muted)' }}>
                  Project Details
                </h3>
                
                <div className="info-item" style={{ marginBottom: '32px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ color: 'var(--accent-orange)' }}><Calendar size={24} /></div>
                  <div>
                    <div className="info-label" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>Timeline</div>
                    <div className="info-value" style={{ fontSize: '16px', fontWeight: '600' }}>{formatProjectDate(projectData.startDate, projectData.endDate, projectData.isOngoing)}</div>
                  </div>
                </div>

                {projectData.role && (
                  <div className="info-item" style={{ marginBottom: '32px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ color: 'var(--accent-orange)' }}><Briefcase size={24} /></div>
                    <div>
                      <div className="info-label" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>My Role</div>
                      <div className="info-value" style={{ fontSize: '16px', fontWeight: '600' }}>{projectData.role}</div>
                    </div>
                  </div>
                )}

                {projectData.client && (
                  <div className="info-item" style={{ marginBottom: '48px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ color: 'var(--accent-orange)' }}><User size={24} /></div>
                    <div>
                      <div className="info-label" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>Client</div>
                      <div className="info-value" style={{ fontSize: '16px', fontWeight: '600' }}>{projectData.client}</div>
                    </div>
                  </div>
                )}

                <div className="detail-action-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {projectData.demoUrl && (
                    <a href={projectData.demoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                      <span className="btn-inner-text">Live Preview</span>
                      <span className="btn-inner-icon"><ExternalLink size={18} /></span>
                    </a>
                  )}
                  {projectData.githubUrl && (
                    <a href={projectData.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                      <span className="btn-inner-text">Source Code</span>
                      <span className="btn-inner-icon"><FaGithub size={20} /></span>
                    </a>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Continue Exploring Section */}
      {recommendedProjects.length > 0 && (
        <section style={{ padding: '120px 0', borderTop: '1px solid var(--card-border)', marginTop: '100px' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
              <div>
                <div className="section-label" style={{ marginBottom: '16px' }}>Next Steps</div>
                <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: '800' }}>Continue Exploring</h2>
              </div>
              <Link href="/projects" className="btn-text" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                color: 'var(--text-muted)',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                View Full Archive <ArrowRight size={16} />
              </Link>
            </div>
            
            <RelatedProjectWrapper projects={recommendedProjects} />
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
