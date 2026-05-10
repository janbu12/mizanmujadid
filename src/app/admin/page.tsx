"use client";

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, LogOut, Upload, Link as LinkIcon, Hash, Type, FileText, Move } from 'lucide-react';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({ 
    id: '', title: '', description: '', tags: '', image: '',
    startDate: '', endDate: '', isOngoing: false 
  });
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchProjects();
    }
  }, [status, router]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch failed');
    }
    setLoading(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const file = e.target.files[0];
    const data = new FormData();
    data.append('file', file);
    
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data
      });
      const json = await res.json();
      if (json.url) {
        setFormData({ ...formData, image: json.url });
      } else {
        alert('Upload failed: ' + (json.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Upload failed');
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      description: formData.description,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      image: formData.image,
      startDate: formData.startDate || null,
      endDate: formData.isOngoing ? null : (formData.endDate || null),
      isOngoing: formData.isOngoing
    };

    const url = isEditing ? `/api/projects/${formData.id}` : '/api/projects';
    const method = isEditing ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      setFormData({ id: '', title: '', description: '', tags: '', image: '', startDate: '', endDate: '', isOngoing: false });
      setIsEditing(false);
      fetchProjects();
    } else {
      alert('Failed to save project');
    }
  };

  const handleEdit = (p: any) => {
    setFormData({
      id: p._id,
      title: p.title,
      description: p.description,
      tags: p.tags.join(', '),
      image: p.image,
      startDate: p.startDate ? new Date(p.startDate).toISOString().split('T')[0] : '',
      endDate: p.endDate ? new Date(p.endDate).toISOString().split('T')[0] : '',
      isOngoing: p.isOngoing || false
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchProjects();
    } else {
      alert('Delete failed');
    }
  };

  if (status === 'loading' || loading) return <div className="admin-container" style={{color: 'white'}}>Loading dashboard...</div>;

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px' }}>Project CMS</h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Logged in as {session?.user?.email}</p>
        </div>
        <button onClick={() => signOut()} className="btn btn-outline">
          <span className="btn-inner-text" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}>
            <LogOut size={16} /> Sign Out
          </span>
        </button>
      </header>

      <div className="admin-grid">
        {/* Form Panel */}
        <aside className="admin-panel">
          <h3>
            {isEditing ? <Edit size={18} style={{marginRight: '8px'}} /> : <Plus size={18} style={{marginRight: '8px'}} />}
            {isEditing ? 'Edit Project' : 'New Project'}
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div className="admin-form-group">
              <label><Type size={12} style={{marginRight: '6px'}}/> Title</label>
              <input type="text" className="admin-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Project name" required />
            </div>

            <div className="admin-form-group">
              <label><FileText size={12} style={{marginRight: '6px'}}/> Description</label>
              <textarea className="admin-input" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe the project..." required rows={4} />
            </div>

            <div className="admin-form-group">
              <label><Hash size={12} style={{marginRight: '6px'}}/> Tags</label>
              <input type="text" className="admin-input" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} placeholder="React, Fastify, Docker..." />
            </div>

            <div className="admin-form-group">
              <label><Move size={12} style={{marginRight: '6px'}}/> Project Period</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '10px' }}>Start Date</label>
                  <input type="date" className="admin-input" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '10px' }}>End Date</label>
                  <input type="date" className="admin-input" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} disabled={formData.isOngoing} />
                </div>
              </div>
              <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" id="isOngoing" checked={formData.isOngoing} onChange={e => setFormData({...formData, isOngoing: e.target.checked})} />
                <label htmlFor="isOngoing" style={{ fontSize: '12px', textTransform: 'none', margin: 0, cursor: 'pointer' }}>Project is currently ongoing</label>
              </div>
            </div>

            <div className="admin-form-group">
              <label><Upload size={12} style={{marginRight: '6px'}}/> Cover Image</label>
              <div className="custom-file-upload">
                <input 
                  type="file" 
                  id="file-upload"
                  accept="image/*" 
                  onChange={handleFileChange} 
                  style={{ display: 'none' }} 
                />
                <label htmlFor="file-upload" className="file-upload-label">
                  <Upload size={20} />
                  <span>{uploading ? 'Uploading to R2...' : 'Click to upload image'}</span>
                </label>
              </div>
              {uploading && <span className="upload-status" style={{color: 'var(--accent-orange)'}}>Synchronizing with Cloudflare R2...</span>}
            </div>

            <div className="admin-form-group">
              <label><LinkIcon size={12} style={{marginRight: '6px'}}/> Image URL</label>
              <input type="text" className="admin-input" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://..." required />
              {formData.image && (
                <div style={{ marginTop: '16px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--card-border)' }}>
                  <img src={formData.image} alt="Preview" style={{ width: '100%', display: 'block' }} />
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={uploading}>
                <span className="btn-inner-text">
                  {isEditing ? 'Save Changes' : 'Create Project'}
                </span>
              </button>
              {isEditing && (
                <button type="button" onClick={() => { setIsEditing(false); setFormData({ id: '', title: '', description: '', tags: '', image: '', startDate: '', endDate: '', isOngoing: false }); }} className="btn btn-outline">
                  <span className="btn-inner-text">Cancel</span>
                </button>
              )}
            </div>
          </form>
        </aside>

        {/* Project List */}
        <main>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', fontSize: '14px', letterSpacing: '2px' }}>
              Project List ({projects.length})
            </h3>
          </div>

          {projects.length === 0 ? (
            <div className="admin-empty-state">
              <p>No projects found. Create your first one!</p>
            </div>
          ) : (
            <div className="project-list-admin">
              {projects.map(p => (
                <div key={p._id} className="project-card-admin">
                  <img src={p.image} alt={p.title} />
                  <div className="project-admin-content">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                      <h4 style={{fontSize: '18px', marginBottom: '6px'}}>{p.title}</h4>
                      <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                         <span style={{fontSize: '10px', background: 'var(--bg-tertiary)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-muted)'}}>
                          {p.startDate ? new Date(p.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'} - {p.isOngoing ? 'Present' : (p.endDate ? new Date(p.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A')}
                        </span>
                      </div>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: '1.5' }}>
                      {p.description.substring(0, 100)}{p.description.length > 100 ? '...' : ''}
                    </p>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {p.tags.map((tag: string) => (
                        <span key={tag} style={{ fontSize: '9px', background: 'rgba(255,102,0,0.1)', color: 'var(--accent-orange)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(255,102,0,0.2)' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="project-admin-actions">
                      <button onClick={() => handleEdit(p)} className="admin-btn-edit">
                        <Edit size={12} style={{marginRight: '4px'}} /> Edit
                      </button>
                      <button onClick={() => handleDelete(p._id)} className="admin-btn-delete">
                        <Trash2 size={12} style={{marginRight: '4px'}} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
