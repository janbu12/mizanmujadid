import Link from 'next/link';
import { ArrowRight, Code, Zap, Target, Search, Layers, Sparkles, Globe, Smartphone, Monitor, ShieldCheck, Key, TrendingUp, CheckCircle } from 'lucide-react';
import { FaLinkedin, FaGithub, FaDribbble } from 'react-icons/fa';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';
import { Navbar, WorksSection, Footer } from '@/components/Shared';
import { PROJECT_SORT } from '@/lib/constants';
import ContactForm from '@/components/ContactForm';
import { Project as ProjectType } from '@/types/project';

export default async function Home() {
  await dbConnect();
  const projects = await Project.find({}).sort(PROJECT_SORT).limit(3).lean();

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
      <Hero />
      <AboutSection />
      <WorksSection portfolioData={portfolioData} />
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '80px' }}>
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
          <div className="mockup-header"><div className="mockup-dot" /><div className="mockup-dot" /><div className="mockup-dot" /></div>
          <div className="mockup-body" style={{ background: 'var(--bg-secondary)', padding: '16px', overflow: 'hidden' }}>
            <pre style={{ margin: 0, color: 'var(--text-muted)', fontSize: '8px', fontFamily: 'monospace', lineHeight: 1.4, textAlign: 'left' }}>
              <span style={{ color: '#c678dd' }}>import</span> Fastify <span style={{ color: '#c678dd' }}>from</span> <span style={{ color: '#98c379' }}>'fastify'</span>;<br />
              <span style={{ color: '#c678dd' }}>import</span> jwt <span style={{ color: '#c678dd' }}>from</span> <span style={{ color: '#98c379' }}>'@fastify/jwt'</span>;<br />
              <span style={{ color: '#c678dd' }}>import</span> cors <span style={{ color: '#c678dd' }}>from</span> <span style={{ color: '#98c379' }}>'@fastify/cors'</span>;<br />
              <br />
              <span style={{ color: '#c678dd' }}>const</span> app = <span style={{ color: '#61afef' }}>Fastify</span>({'{'} logger: <span style={{ color: '#d19a66' }}>true</span> {'}'});<br />
              app.<span style={{ color: '#61afef' }}>register</span>(cors, {'{'} origin: <span style={{ color: '#98c379' }}>'*'</span> {'}'});<br />
              app.<span style={{ color: '#61afef' }}>register</span>(jwt, {'{'} secret: process.env.<span style={{ color: '#e06c75' }}>JWT_SECRET</span> {'}'});<br />
              <br />
              app.<span style={{ color: '#61afef' }}>addHook</span>(<span style={{ color: '#98c379' }}>'onRequest'</span>, <span style={{ color: '#c678dd' }}>async</span> (req, reply) =&gt; {'{'}<br />
              &nbsp;&nbsp;<span style={{ color: '#c678dd' }}>try</span> {'{'}<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#c678dd' }}>await</span> req.<span style={{ color: '#61afef' }}>jwtVerify</span>();<br />
              &nbsp;&nbsp;{'}'} <span style={{ color: '#c678dd' }}>catch</span> (err) {'{'}<br />
              &nbsp;&nbsp;&nbsp;&nbsp;reply.<span style={{ color: '#61afef' }}>send</span>(err);<br />
              &nbsp;&nbsp;{'}'}<br />
              {'}'});<br />
              <br />
              app.<span style={{ color: '#61afef' }}>post</span>(<span style={{ color: '#98c379' }}>'/upload'</span>, {'{'}<br />
              &nbsp;&nbsp;schema: {'{'} body: {'{'} type: <span style={{ color: '#98c379' }}>'object'</span>, properties: {'{'} file: {'{'} type: <span style={{ color: '#98c379' }}>'string'</span> {'}'} {'}'} {'}'} {'}'}<br />
              {'}'}, <span style={{ color: '#c678dd' }}>async</span> (req, reply) =&gt; {'{'}<br />
              &nbsp;&nbsp;<span style={{ color: '#c678dd' }}>const</span> fileId = <span style={{ color: '#c678dd' }}>await</span> <span style={{ color: '#61afef' }}>processFile</span>(req.body.file);<br />
              &nbsp;&nbsp;<span style={{ color: '#c678dd' }}>return</span> {'{'} success: <span style={{ color: '#d19a66' }}>true</span>, fileId {'}'};<br />
              {'}'});
            </pre>
          </div>
        </div>

        <div className="hero-content">
          <h1 className="reveal">
            FULLSTACK DEVELOPER<br />
            <span className="text-orange">WEB, MOBILE & DESKTOP</span>
          </h1>
          <p className="reveal delay-1">
            Hi, I'm <strong>Muhammad Mizan Al Mujadid</strong>. I specialize in building end-to-end digital solutions, from robust Web Systems and high-performance Mobile Apps (Flutter) to seamless Desktop Applications.
          </p>
          <div className="hero-ctas reveal delay-2">
            <Link href="/#contact" className="btn btn-primary">
              <span className="btn-inner-text">Start A Project</span>
              <span className="btn-inner-icon"><ArrowRight size={16} /></span>
            </Link>
            <Link href="/projects" className="btn btn-outline">
              <span className="btn-inner-text">View My Work</span>
              <span className="btn-inner-icon"><ArrowRight size={16} /></span>
            </Link>
          </div>
        </div>

        <div className="hero-side-mockup reveal delay-3 right">
          <div className="mockup-header"><div className="mockup-dot" /><div className="mockup-dot" /><div className="mockup-dot" /></div>
          <div className="mockup-body" style={{ background: 'var(--bg-secondary)', padding: '16px', overflow: 'hidden' }}>
            <pre style={{ margin: 0, color: 'var(--text-muted)', fontSize: '8px', fontFamily: 'monospace', lineHeight: 1.4, textAlign: 'left' }}>
              <span style={{ color: '#e06c75' }}>version:</span> <span style={{ color: '#98c379' }}>'3.8'</span><br />
              <span style={{ color: '#e06c75' }}>services:</span><br />
              &nbsp;&nbsp;<span style={{ color: '#e06c75' }}>nginx:</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#e06c75' }}>image:</span> <span style={{ color: '#98c379' }}>nginx:alpine</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#e06c75' }}>ports:</span> [<span style={{ color: '#98c379' }}>"80:80"</span>, <span style={{ color: '#98c379' }}>"443:443"</span>]<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#e06c75' }}>volumes:</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span style={{ color: '#98c379' }}>./nginx.conf:/etc/nginx/nginx.conf</span><br />
              <br />
              &nbsp;&nbsp;<span style={{ color: '#e06c75' }}>postgres:</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#e06c75' }}>image:</span> <span style={{ color: '#98c379' }}>postgres:15-alpine</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#e06c75' }}>environment:</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#d19a66' }}>POSTGRES_USER:</span> <span style={{ color: '#abb2bf' }}>${'{'}DB_USER{'}'}</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#d19a66' }}>POSTGRES_PASSWORD:</span> <span style={{ color: '#abb2bf' }}>${'{'}DB_PASS{'}'}</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#e06c75' }}>volumes:</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span style={{ color: '#98c379' }}>pgdata:/var/lib/postgresql/data</span><br />
              <br />
              &nbsp;&nbsp;<span style={{ color: '#e06c75' }}>minio:</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#e06c75' }}>image:</span> <span style={{ color: '#98c379' }}>minio/minio</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#e06c75' }}>command:</span> <span style={{ color: '#98c379' }}>server /data --console-address ":9001"</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#e06c75' }}>environment:</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#d19a66' }}>MINIO_ROOT_USER:</span> <span style={{ color: '#abb2bf' }}>${'{'}S3_USER{'}'}</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#d19a66' }}>MINIO_ROOT_PASSWORD:</span> <span style={{ color: '#abb2bf' }}>${'{'}S3_PASS{'}'}</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#e06c75' }}>volumes:</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span style={{ color: '#98c379' }}>s3data:/data</span><br />
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
              <img src="/profile.jpg" alt="Muhammad Mizan Al Mujadid" />
            </div>
            <h2>SCALABLE SOLUTIONS ACROSS ALL PLATFORMS</h2>
          </div>
          <div className="split-header-right">
            <p>I am a Fullstack Developer dedicated to creating high-performance applications. Whether it's a complex web system, a cross-platform mobile app, or a native desktop solution, I build with a focus on stability and scalability.</p>
            <Link href="/#contact" className="btn btn-outline">
              <span className="btn-inner-text">Contact Me</span>
              <span className="btn-inner-icon"><ArrowRight size={16} /></span>
            </Link>
          </div>
        </div>

        <div className="process-cards reveal delay-2">
          <div className="process-card">
            <div className="process-card-header">Architected for Growth</div>
            <div className="process-card-body">
              <p>Every line of code is written with scalability in mind, ensuring your application can handle growth from day one.</p>
              <div className="process-graphic">
                <div className="graphic-overlay"><TrendingUp size={48} /></div>
              </div>
            </div>
          </div>
          <div className="process-card" style={{ borderColor: 'var(--accent-orange)' }}>
            <div className="process-card-header" style={{ backgroundColor: 'var(--accent-orange)', color: '#000' }}>Cross-Platform Excellence</div>
            <div className="process-card-body">
              <p>Specializing in Flutter for mobile and robust frameworks for web and desktop, I deliver a consistent experience everywhere.</p>
              <div className="process-graphic">
                <div className="graphic-overlay"><Layers size={48} /></div>
              </div>
            </div>
          </div>
          <div className="process-card">
            <div className="process-card-header">End-to-End Delivery</div>
            <div className="process-card-body">
              <p>From database architecture to the final UI, I handle the entire development lifecycle to ensure a cohesive product.</p>
              <div className="process-graphic">
                <div className="graphic-overlay"><CheckCircle size={48} /></div>
              </div>
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
            <h2>FULLSTACK DEVELOPMENT TAILORED TO YOUR NEEDS</h2>
          </div>
          <div className="split-header-right">
            <p>I provide comprehensive development services across web, mobile, and desktop environments.</p>
            <a href="#services" className="btn btn-outline">
              <span className="btn-inner-text">Explore My Services</span>
              <span className="btn-inner-icon"><ArrowRight size={16} /></span>
            </a>
          </div>
        </div>

        <div className="services-grid reveal delay-2">
          <div className="service-card">
            <div className="service-graphic graphic-web">
              <div className="graphic-overlay"><Globe size={60} /></div>
            </div>
            <h3>Web Development</h3>
            <h4>Advanced Web Systems</h4>
            <p>Building scalable, secure, and maintainable web applications using modern fullstack technologies.</p>
            <hr style={{ borderColor: 'var(--card-border)', margin: '16px 0' }} />
            <h4>API & Backend Architecture</h4>
            <p>Designing robust server-side logic and database structures to power high-traffic applications.</p>
          </div>
          <div className="service-card">
            <div className="service-graphic graphic-mobile">
              <div className="graphic-overlay"><Smartphone size={60} /></div>
            </div>
            <h3>Mobile App Development</h3>
            <h4>Flutter Specialist</h4>
            <p>Expertise in creating high-performance, beautiful mobile apps for iOS and Android using a single codebase.</p>
            <hr style={{ borderColor: 'var(--card-border)', margin: '16px 0' }} />
            <h4>Native Performance</h4>
            <p>Ensuring smooth interactions and lightning-fast speeds that feel native to every device.</p>
          </div>
          <div className="service-card">
            <div className="service-graphic graphic-desktop">
              <div className="graphic-overlay"><Monitor size={60} /></div>
            </div>
            <h3>Desktop & Quality</h3>
            <h4>Desktop Applications</h4>
            <p>Extending your reach to Windows, macOS, and Linux with powerful and integrated desktop solutions.</p>
            <hr style={{ borderColor: 'var(--card-border)', margin: '16px 0' }} />
            <h4>QA & Maintenance</h4>
            <p>Rigorous testing and ongoing support to keep your products running flawlessly long after launch.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyWorkSection() {
  return (
    <section className="section" id="why">
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

        <div className="bento-grid reveal delay-2">
          {/* Large Card */}
          <div className="bento-item large">
            <div className="bento-tag">Primary Value</div>
            <h3>End-to-end ownership</h3>
            <p>From early discovery to delivery, I handle the full design and development process. This keeps decisions aligned and reduces handoff friction, ensuring your vision is realized exactly as intended without compromise.</p>
            <div className="why-graphic graphic-web" style={{ marginTop: 'auto', marginBottom: 0, height: '200px' }}>
              <div className="graphic-overlay"><Target size={60} /></div>
            </div>
          </div>

          {/* Wide Card */}
          <div className="bento-item wide">
            <div className="bento-tag">Process</div>
            <h3>Structured and transparent</h3>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <p style={{ margin: 0 }}>My workflow is clear at every stage. You always know what's happening, what's next, and why it matters.</p>
              <div className="why-graphic graphic-mobile" style={{ width: '240px', height: '100px', marginBottom: 0, flexShrink: 0 }}>
                <div className="graphic-overlay"><Zap size={32} /></div>
              </div>
            </div>
          </div>

          {/* Small Card */}
          <div className="bento-item small">
            <div className="bento-tag">Culture</div>
            <h3>Collaborative</h3>
            <p>I work as an extension of your team. Alignment is built-in.</p>
          </div>

          {/* Tall Card */}
          <div className="bento-item tall">
            <div className="bento-tag">Engineering</div>
            <h3>Built for maintainability</h3>
            <p>I focus on solutions that are practical to maintain and scale. This helps you move forward without rework.</p>
            <div className="why-graphic graphic-desktop" style={{ marginTop: 'auto', marginBottom: 0, height: '240px' }}>
              <div className="graphic-overlay"><ShieldCheck size={60} /></div>
            </div>
          </div>

          {/* Small Card */}
          <div className="bento-item small">
            <div className="bento-tag">Quality</div>
            <h3>Performance First</h3>
            <p>Optimized for speed and high-efficiency across all platforms.</p>
            <div className="graphic-overlay" style={{ position: 'relative', marginTop: '10px' }}><Sparkles size={32} /></div>
          </div>

          {/* New Wide Card to fill the gap */}
          <div className="bento-item wide">
            <div className="bento-tag">Philosophy</div>
            <h3>Custom-Tailored Solutions</h3>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <p style={{ margin: 0 }}>I don't believe in one-size-fits-all. Every project is built from the ground up to solve your specific challenges.</p>
              <div className="why-graphic graphic-web" style={{ width: '160px', height: '80px', marginBottom: 0, flexShrink: 0 }}>
                <div className="graphic-overlay"><Code size={24} /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="section bg-secondary" style={{ position: 'relative' }}>
      <div id="contact" style={{ position: 'absolute', top: '-30px' }}></div>
      <div className="container">
        <div className="section-label reveal">/ Contact</div>
        <div className="contact-grid">
          <div className="cta-text reveal">
            <h2>
              DESIGN INFORMS DEVELOPMENT.<br />
              DEVELOPMENT SHARPENS DESIGN.<br />
              <span className="text-orange">THAT'S HOW I DELIVER PRODUCTS WITH PURPOSE AND PRECISION.</span>
            </h2>
          </div>
          <div className="contact-form-wrapper reveal delay-1">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
