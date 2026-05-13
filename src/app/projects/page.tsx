import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';
import { Navbar, Footer } from '@/components/Shared';
import { Project as ProjectType } from '@/types/project';
import ProjectGallery from '@/components/ProjectGallery';

export default async function ProjectsPage() {
  await dbConnect();
  
  // Fetch all projects
  const projects = await Project.find({}).sort({ startDate: -1 }).lean();
  
  const portfolioData: ProjectType[] = projects.map(p => ({
    id: p._id.toString(),
    title: p.title,
    description: p.description,
    tags: p.tags,
    startDate: p.startDate ? p.startDate.toISOString() : undefined,
    endDate: p.endDate ? p.endDate.toISOString() : undefined,
    isOngoing: p.isOngoing,
    image: p.image,
    slug: p.slug
  }));

  const allTags = portfolioData.flatMap(p => p.tags);
  const uniqueTags = [...new Set(allTags)].slice(0, 5);

  return (
    <main style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
      <Navbar />
      
      <section className="projects-hero">
        {/* Background Accent */}
        <div style={{ 
          position: 'absolute', 
          top: '-10%', 
          right: '-5%', 
          width: '500px', 
          height: '500px', 
          background: 'radial-gradient(circle, rgba(255,107,26,0.08) 0%, transparent 70%)',
          zIndex: 0
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-label">Archive / {portfolioData.length} Projects</div>
          
          <h1 className="projects-title">
            Curated <span className="text-orange">Works</span> & Digital <span className="text-orange">Experiments</span>
          </h1>
          
          <div className="projects-tags-container">
            <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(16px, 2vw, 18px)', maxWidth: '500px', lineHeight: '1.6', marginBottom: '8px' }}>
              Exploring the intersection of design and technology through full-stack development and creative coding.
            </p>
            
            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              width: '100%',
              overflowX: 'auto', 
              paddingBottom: '15px',
              paddingRight: '20px',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none'
            }} className="hide-scrollbar">
              {uniqueTags.map(tag => (
                <span key={tag} style={{ 
                  fontSize: '10px', 
                  textTransform: 'uppercase', 
                  letterSpacing: '1px', 
                  color: 'var(--text-muted)',
                  padding: '8px 16px',
                  border: '1px solid var(--card-border)',
                  borderRadius: '100px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '0' }}>
        <div className="container">
          <div style={{ 
            height: '1px', 
            width: '100%', 
            background: 'linear-gradient(90deg, var(--card-border) 0%, transparent 100%)',
            marginBottom: '60px'
          }} />
          <ProjectGallery projects={portfolioData} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
