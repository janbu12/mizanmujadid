"use client";

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const res = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    if (res?.error) {
      setError('Invalid credentials');
    } else {
      router.push('/admin');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)' }}>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px', padding: '40px', backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--card-border)' }}>
        <h2 style={{ marginBottom: '32px', textAlign: 'center' }}>Admin Login</h2>
        
        {error && <div style={{ color: 'red', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}
        
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Username</label>
          <input 
            type="text" 
            value={username} 
            onChange={e => setUsername(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--card-border)', backgroundColor: 'var(--bg-tertiary)', color: 'white' }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--card-border)', backgroundColor: 'var(--bg-tertiary)', color: 'white' }}
            required
          />
        </div>
        
        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
          <span className="btn-inner-text">Sign In</span>
        </button>
      </form>
    </div>
  );
}
