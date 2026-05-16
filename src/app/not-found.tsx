import Link from 'next/link';
import { Navbar, Footer } from '@/components/Shared';

export default function NotFound() {
  return (
    <main style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 20px', marginTop: '80px' }}>
        <h1 style={{ fontSize: 'clamp(100px, 20vw, 200px)', fontWeight: 800, color: 'var(--accent-orange)', lineHeight: 1, marginBottom: '20px', letterSpacing: '-5px' }}>
          404
        </h1>
        <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', marginBottom: '16px', fontWeight: 600 }}>
          Oops! You're lost in the void.
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '500px', marginBottom: '50px', fontSize: '18px', lineHeight: 1.6 }}>
          The page you are looking for doesn't exist, has been moved, or is temporarily unavailable. Let's get you back on track.
        </p>
        <Link href="/" className="btn btn-primary" style={{ padding: '16px 32px', backgroundColor: '#fff', color: '#000', borderRadius: '100px', fontWeight: 600, display: 'inline-block' }}>
          Back to Home
        </Link>
      </div>
      <Footer />
    </main>
  );
}
