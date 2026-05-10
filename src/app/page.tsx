import Link from 'next/link';
import { ArrowRight, Code, Zap, Target, Search, Layers, Sparkles } from 'lucide-react';
import { FaLinkedin, FaGithub, FaDribbble } from 'react-icons/fa';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';
import { Navbar, WorksSection, Footer } from '@/components/Shared';
import { PROJECT_SORT } from '@/lib/constants';

export default async function Home() {
  await dbConnect();
  const projects = await Project.find({}).sort(PROJECT_SORT).limit(3).lean();
  
  const portfolioData = projects.map(p => ({
    id: p._id.toString(),
    title: p.title,
    description: p.description,
    tags: p.tags,
    image: p.image
  }));

  return (
    <>
      <Navbar />
      <Hero />
      <AboutSection />
      <WorksSection portfolioData={portfolioData} />
      <div style={{display: 'flex', justifyContent: 'center', marginBottom: '80px'}}>
        <Link href="/projects" className="btn btn-outline">
          <span className="btn-inner-text">See More Work</span>
          <span className="btn-inner-icon"><ArrowRight size={16} /></span>
        </Link>
      </div>
      <ServicesSection />
      <WhyWorkSection />
      <CTASection />
      <Footer />
    </>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-layout">
        <div className="hero-side-mockup reveal delay-3 left">
          <div className="mockup-header"><div className="mockup-dot"/><div className="mockup-dot"/><div className="mockup-dot"/></div>
          <div className="mockup-body" style={{background: 'var(--bg-secondary)', padding: '16px', overflow: 'hidden'}}>
            <pre style={{ margin: 0, color: 'var(--text-muted)', fontSize: '8px', fontFamily: 'monospace', lineHeight: 1.4, textAlign: 'left' }}>
              <span style={{color: '#c678dd'}}>import</span> Fastify <span style={{color: '#c678dd'}}>from</span> <span style={{color: '#98c379'}}>'fastify'</span>;<br/>
              <span style={{color: '#c678dd'}}>import</span> jwt <span style={{color: '#c678dd'}}>from</span> <span style={{color: '#98c379'}}>'@fastify/jwt'</span>;<br/>
              <span style={{color: '#c678dd'}}>import</span> cors <span style={{color: '#c678dd'}}>from</span> <span style={{color: '#98c379'}}>'@fastify/cors'</span>;<br/>
              <br/>
              <span style={{color: '#c678dd'}}>const</span> app = <span style={{color: '#61afef'}}>Fastify</span>({'{'} logger: <span style={{color: '#d19a66'}}>true</span> {'}'});<br/>
              app.<span style={{color: '#61afef'}}>register</span>(cors, {'{'} origin: <span style={{color: '#98c379'}}>'*'</span> {'}'});<br/>
              app.<span style={{color: '#61afef'}}>register</span>(jwt, {'{'} secret: process.env.<span style={{color: '#e06c75'}}>JWT_SECRET</span> {'}'});<br/>
              <br/>
              app.<span style={{color: '#61afef'}}>addHook</span>(<span style={{color: '#98c379'}}>'onRequest'</span>, <span style={{color: '#c678dd'}}>async</span> (req, reply) =&gt; {'{'}<br/>
              &nbsp;&nbsp;<span style={{color: '#c678dd'}}>try</span> {'{'}<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<span style={{color: '#c678dd'}}>await</span> req.<span style={{color: '#61afef'}}>jwtVerify</span>();<br/>
              &nbsp;&nbsp;{'}'} <span style={{color: '#c678dd'}}>catch</span> (err) {'{'}<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;reply.<span style={{color: '#61afef'}}>send</span>(err);<br/>
              &nbsp;&nbsp;{'}'}<br/>
              {'}'});<br/>
              <br/>
              app.<span style={{color: '#61afef'}}>post</span>(<span style={{color: '#98c379'}}>'/upload'</span>, {'{'}<br/>
              &nbsp;&nbsp;schema: {'{'} body: {'{'} type: <span style={{color: '#98c379'}}>'object'</span>, properties: {'{'} file: {'{'} type: <span style={{color: '#98c379'}}>'string'</span> {'}'} {'}'} {'}'} {'}'}<br/>
              {'}'}, <span style={{color: '#c678dd'}}>async</span> (req, reply) =&gt; {'{'}<br/>
              &nbsp;&nbsp;<span style={{color: '#c678dd'}}>const</span> fileId = <span style={{color: '#c678dd'}}>await</span> <span style={{color: '#61afef'}}>processFile</span>(req.body.file);<br/>
              &nbsp;&nbsp;<span style={{color: '#c678dd'}}>return</span> {'{'} success: <span style={{color: '#d19a66'}}>true</span>, fileId {'}'};<br/>
              {'}'});
            </pre>
          </div>
        </div>

        <div className="hero-content">
          <h1 className="reveal">
            SOFTWARE ENGINEER AND<br />
            <span className="text-orange">FULLSTACK DEVELOPER</span>
          </h1>
          <p className="reveal delay-1">
            Hi, I'm Mizan. I help founders and teams build digital products through a structured, collaborative, and deliberate process. Architecting with purpose, building with precision.
          </p>
          <div className="hero-ctas reveal delay-2">
            <a href="/#contact" className="btn btn-primary">
              <span className="btn-inner-text">Start A Project</span>
              <span className="btn-inner-icon"><ArrowRight size={16} /></span>
            </a>
            <a href="/projects" className="btn btn-outline">
              <span className="btn-inner-text">View My Work</span>
              <span className="btn-inner-icon"><ArrowRight size={16} /></span>
            </a>
          </div>
        </div>

        <div className="hero-side-mockup reveal delay-3 right">
          <div className="mockup-header"><div className="mockup-dot"/><div className="mockup-dot"/><div className="mockup-dot"/></div>
          <div className="mockup-body" style={{background: 'var(--bg-secondary)', padding: '16px', overflow: 'hidden'}}>
            <pre style={{ margin: 0, color: 'var(--text-muted)', fontSize: '8px', fontFamily: 'monospace', lineHeight: 1.4, textAlign: 'left' }}>
              <span style={{color: '#e06c75'}}>version:</span> <span style={{color: '#98c379'}}>'3.8'</span><br/>
              <span style={{color: '#e06c75'}}>services:</span><br/>
              &nbsp;&nbsp;<span style={{color: '#e06c75'}}>nginx:</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<span style={{color: '#e06c75'}}>image:</span> <span style={{color: '#98c379'}}>nginx:alpine</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<span style={{color: '#e06c75'}}>ports:</span> [<span style={{color: '#98c379'}}>"80:80"</span>, <span style={{color: '#98c379'}}>"443:443"</span>]<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<span style={{color: '#e06c75'}}>volumes:</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span style={{color: '#98c379'}}>./nginx.conf:/etc/nginx/nginx.conf</span><br/>
              <br/>
              &nbsp;&nbsp;<span style={{color: '#e06c75'}}>postgres:</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<span style={{color: '#e06c75'}}>image:</span> <span style={{color: '#98c379'}}>postgres:15-alpine</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<span style={{color: '#e06c75'}}>environment:</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{color: '#d19a66'}}>POSTGRES_USER:</span> <span style={{color: '#abb2bf'}}>${'{'}DB_USER{'}'}</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{color: '#d19a66'}}>POSTGRES_PASSWORD:</span> <span style={{color: '#abb2bf'}}>${'{'}DB_PASS{'}'}</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<span style={{color: '#e06c75'}}>volumes:</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span style={{color: '#98c379'}}>pgdata:/var/lib/postgresql/data</span><br/>
              <br/>
              &nbsp;&nbsp;<span style={{color: '#e06c75'}}>minio:</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<span style={{color: '#e06c75'}}>image:</span> <span style={{color: '#98c379'}}>minio/minio</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<span style={{color: '#e06c75'}}>command:</span> <span style={{color: '#98c379'}}>server /data --console-address ":9001"</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<span style={{color: '#e06c75'}}>environment:</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{color: '#d19a66'}}>MINIO_ROOT_USER:</span> <span style={{color: '#abb2bf'}}>${'{'}S3_USER{'}'}</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{color: '#d19a66'}}>MINIO_ROOT_PASSWORD:</span> <span style={{color: '#abb2bf'}}>${'{'}S3_PASS{'}'}</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<span style={{color: '#e06c75'}}>volumes:</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span style={{color: '#98c379'}}>s3data:/data</span><br/>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="section bg-secondary" id="about">
      <div className="container">
        <div className="section-label reveal">/ About Me</div>
        <div className="split-header reveal delay-1 about-header">
          <div className="split-header-left about-profile-row">
            <div className="profile-image-container">
              <img src="/profile.jpg" alt="Mizan" />
            </div>
            <h2>BRIDGING THE GAP BETWEEN DESIGN AND ENGINEERING</h2>
          </div>
          <div className="split-header-right">
            <p>I am an independent digital creator offering end-to-end design and frontend development services. I collaborate directly with you to build solutions that are clear in purpose and solid in execution.</p>
            <a href="/#contact" className="btn btn-outline">
              <span className="btn-inner-text">Contact Me</span>
              <span className="btn-inner-icon"><ArrowRight size={16} /></span>
            </a>
          </div>
        </div>
        
        <div className="process-cards reveal delay-2">
          <div className="process-card">
            <div className="process-card-header">Built on a clear process</div>
            <div className="process-card-body">
              <p>Every project follows a workflow, from discovery to delivery, keeping decisions aligned and outcomes measurable.</p>
              <div className="process-graphic"></div>
            </div>
          </div>
          <div className="process-card" style={{borderColor: 'var(--accent-orange)'}}>
            <div className="process-card-header" style={{backgroundColor: 'var(--accent-orange)', color: '#000'}}>Design with purpose</div>
            <div className="process-card-body">
              <p>I design to solve real business problems, not just to look good. Every decision is tied to user needs and product goals.</p>
              <div className="process-graphic"></div>
            </div>
          </div>
          <div className="process-card">
            <div className="process-card-header">Collaborative by default</div>
            <div className="process-card-body">
              <p>I work closely with your team throughout the process. You stay involved, informed, and confident in every step.</p>
              <div className="process-graphic"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section className="section bg-secondary" id="services">
      <div className="container">
        <div className="section-label reveal">/ My Services</div>
        <div className="split-header reveal delay-1">
          <div className="split-header-left">
            <h2>END-TO-END SERVICES TO DESIGN, BUILD, AND GROW DIGITAL PRODUCTS</h2>
          </div>
          <div className="split-header-right">
            <p>I support teams through every stage of product development, from early design to long-term maintenance.</p>
            <a href="#services" className="btn btn-outline">
              <span className="btn-inner-text">Explore My Services</span>
              <span className="btn-inner-icon"><ArrowRight size={16} /></span>
            </a>
          </div>
        </div>
        
        <div className="services-grid reveal delay-2">
          <div className="service-card">
            <div className="service-graphic"></div>
            <h3>Design &amp; Discovery</h3>
            <h4>UX / UI Design</h4>
            <p>User-centered design grounded in research and system thinking—aligned with development from day one.</p>
            <hr style={{borderColor: 'var(--card-border)', margin: '16px 0'}} />
            <h4>Startups, MVPs &amp; POCs</h4>
            <p>From early validation to MVP delivery, I help bring your ideas to life with clear scope and scalable foundations.</p>
          </div>
          <div className="service-card">
            <div className="service-graphic"></div>
            <h3>Product Development</h3>
            <h4>Web Development</h4>
            <p>Custom web applications designed around your goals—maintainable, secure, and ready to grow as your product evolves.</p>
            <hr style={{borderColor: 'var(--card-border)', margin: '16px 0'}} />
            <h4>Mobile Development</h4>
            <p>Create mobile experiences users can rely on. Native or cross-platform mobile apps focused on performance.</p>
          </div>
          <div className="service-card">
            <div className="service-graphic"></div>
            <h3>Quality &amp; Intelligence</h3>
            <h4>QA &amp; Testing</h4>
            <p>Structured testing to reduce risk, improve reliability, and prepare your product for real-world use.</p>
            <hr style={{borderColor: 'var(--card-border)', margin: '16px 0'}} />
            <h4>AI &amp; Data Solutions</h4>
            <p>I integrate AI and data-driven features that support decision-making, automation, and product efficiency.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyWorkSection() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-label reveal">/ Why Me</div>
        <div className="split-header reveal delay-1">
          <div className="split-header-left">
            <h2>BUILT AS A LONG-TERM PARTNER, NOT JUST A VENDOR</h2>
          </div>
          <div className="split-header-right">
            <p>I work closely with your team to design and develop digital products that are clear, scalable, and ready to grow with your business.</p>
            <a href="#contact" className="btn btn-outline">
              <span className="btn-inner-text">Work With Me</span>
              <span className="btn-inner-icon"><ArrowRight size={16} /></span>
            </a>
          </div>
        </div>
        
        <div className="why-grid reveal delay-2">
          <div className="why-card">
            <div className="why-graphic"></div>
            <h3>End-to-end ownership</h3>
            <p>From early discovery to delivery, I handle the full design and development process. This keeps decisions aligned and reduces handoff friction.</p>
          </div>
          <div className="why-card">
            <div className="why-graphic"></div>
            <h3>Structured and transparent process</h3>
            <p>My workflow is clear at every stage. You always know what's happening, what's next, and why it matters.</p>
          </div>
          <div className="why-card">
            <div className="why-graphic"></div>
            <h3>Collaborative by default</h3>
            <p>I work as an extension of your team. Feedback, iteration, and alignment are built into the process from day one.</p>
          </div>
          <div className="why-card">
            <div className="why-graphic"></div>
            <h3>Built for maintainability</h3>
            <p>I focus on solutions that are practical to maintain and scale. This helps you move forward without unnecessary rework.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="section bg-secondary" id="contact">
      <div className="container">
        <div className="cta-block reveal">
          <div className="cta-text">
            <h2>
              DESIGN INFORMS DEVELOPMENT.<br />
              DEVELOPMENT SHARPENS DESIGN.<br />
              <span className="text-orange">THAT'S HOW I DELIVER PRODUCTS WITH PURPOSE AND PRECISION.</span>
            </h2>
          </div>
          <div className="cta-graphic"></div>
        </div>
      </div>
    </section>
  );
}
