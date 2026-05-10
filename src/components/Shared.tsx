import Link from 'next/link';
import { ArrowRight, Target } from 'lucide-react';
import { FaLinkedin, FaGithub, FaDribbble, FaInstagram } from 'react-icons/fa';

export function Navbar() {
  return (
    <nav className="navbar" id="navbar">
      <div className="container nav-container">
        <Link href="/" className="logo">
          MIZ<span className="dot">.</span>
        </Link>
        <div className="nav-links">
          <Link href="/#services">Services</Link>
          <Link href="/#about">About</Link>
          <Link href="/projects">Works</Link>
        </div>
        <Link href="/#contact" className="btn btn-primary" style={{ backgroundColor: '#fff', color: '#000' }}>
          <span className="btn-inner-text">Contact Me</span>
        </Link>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top reveal">
          <div className="footer-brand">
            <Link href="/" className="logo">MIZ<span className="dot">.</span></Link>
            <p>I design and build digital products through a structured, collaborative process, helping you turn ideas into reliable, scalable solutions.</p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4>Explore</h4>
              <ul>
                <li><Link href="/#about">About Me</Link></li>
                <li><Link href="/projects">My Works</Link></li>
                <li><Link href="/#why">Why Me</Link></li>
                <li><Link href="/#services">My Services</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Services</h4>
              <ul>
                <li><Link href="/#services">Design &amp; Discovery</Link></li>
                <li><Link href="/#services">UX/UI Design</Link></li>
                <li><Link href="/#services">Web Development</Link></li>
                <li><Link href="/#services">Mobile Development</Link></li>
                <li><Link href="/#services">Startups, MVPs &amp; POCs</Link></li>
                <li><Link href="/#services">QA &amp; Testing</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Contact Me</h4>
              <ul>
                <li><a href="mailto:mizanmujadid2436@gmail.com">Email: mizanmujadid2436@gmail.com</a></li>
                <li><a href="https://wa.me/6281294815544" target="_blank" rel="noopener noreferrer">WhatsApp: +62 812 9481 5544</a></li>
              </ul>
              <h4 style={{ marginTop: '32px' }}>Follow Me</h4>
              <div style={{ display: 'flex', gap: '16px' }}>
                <a href="https://www.linkedin.com/in/mizan-mujadid" target="_blank" rel="noopener noreferrer"><FaLinkedin size={20} /></a>
                <a href="https://github.com/janbu12" target="_blank" rel="noopener noreferrer"><FaGithub size={20} /></a>
                <a href="https://www.instagram.com/_mznm" target="_blank" rel="noopener noreferrer"><FaInstagram size={20} /></a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-huge-text reveal delay-1">
          MIZAN DEV
        </div>

        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} - Mizan Dev | All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export function WorksSection({ portfolioData }: { portfolioData: any[] }) {
  return (
    <section className="section" id="works">
      <div className="container">
        <div className="section-label reveal">/ My Works</div>
        <div className="split-header reveal delay-1">
          <div className="split-header-left">
            <h2>SELECTED WORK, BUILT WITH PURPOSE</h2>
          </div>
          <div className="split-header-right">
            <p>A snapshot of projects I've designed and developed through structured collaboration. Each work reflects real needs, clear goals, and thoughtful execution.</p>
            <Link href="/projects" className="btn btn-outline">
              <span className="btn-inner-text">View My Work</span>
              <span className="btn-inner-icon"><ArrowRight size={16} /></span>
            </Link>
          </div>
        </div>

        <div className="works-list">
          {portfolioData.map((work, index) => (
            <div className="work-item reveal delay-1" key={work.id}>
              <div className="work-info">
                <div className="work-logo">
                  <span className="icon"><Target size={16} /></span> MIZAN PORTFOLIO
                </div>
                <h3>{work.title}</h3>
                <p>{work.description}</p>
                <div className="work-tag">{work.tags?.join(' / ')}</div>
                <div>
                  <Link href={`/projects/${work.id}`} className="btn btn-outline">
                    <span className="btn-inner-text">View Case Study</span>
                    <span className="btn-inner-icon"><ArrowRight size={16} /></span>
                  </Link>
                </div>
              </div>
              <div className="work-image-container" style={{ padding: 0, position: 'relative', overflow: 'hidden', borderRadius: '0 12px 12px 0' }}>
                {work.image ? (
                  <img src={work.image} alt={work.title} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div className="work-image-mock" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                    <div className="mockup-header"><div className="mockup-dot" /><div className="mockup-dot" /><div className="mockup-dot" /></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
