"use client";

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, LogOut } from 'lucide-react';
import { ProjectModal, DeleteConfirmModal } from '@/components/AdminModals';
import { toast } from 'sonner';
import { Project, ProjectFormData } from '@/types/project';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState<ProjectFormData>({ 
    title: '', description: '', tags: '', image: '',
    startDate: '', endDate: '', isOngoing: false,
    content: '', client: '', role: '', githubUrl: '', demoUrl: '', gallery: []
  });
  
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);

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
        setFormData(prev => ({ ...prev, image: json.url }));
        toast.success('Cover image uploaded to Cloudflare R2!');
      } else {
        toast.error('Upload failed: ' + (json.error || 'Unknown error'));
      }
    } catch (err) {
      toast.error('Critical upload error.');
    }
    setUploading(false);
  };

  const handleGalleryFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setGalleryUploading(true);
    const files = Array.from(e.target.files);
    
    const uploadPromises = files.map(async (file) => {
      const data = new FormData();
      data.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: data });
      return res.json();
    });

    try {
      const results = await Promise.all(uploadPromises);
      const newUrls = results.map(r => r.url).filter(Boolean);
      
      setFormData(prev => ({
        ...prev,
        gallery: [...(prev.gallery || []), ...newUrls]
      }));
      
      toast.success(`${newUrls.length} gallery images uploaded to Cloudflare!`);
    } catch (err) {
      toast.error('Failed to upload some gallery images.');
    }
    setGalleryUploading(false);
    // Reset input
    e.target.value = '';
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: typeof formData.tags === 'string' ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : formData.tags,
      endDate: formData.isOngoing ? null : (formData.endDate || null),
    };

    const url = isEditing ? `/api/projects/${formData.id}` : '/api/projects';
    const method = isEditing ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      closeProjectModal();
      fetchProjects();
      toast.success(isEditing ? 'Project updated successfully!' : 'New project created successfully!');
    } else {
      toast.error('Failed to save project.');
    }
  };

  const handleEdit = (p: Project) => {
    setFormData({
      id: p._id,
      title: p.title,
      description: p.description,
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : p.tags,
      image: p.image,
      startDate: p.startDate ? new Date(p.startDate).toISOString().split('T')[0] : '',
      endDate: p.endDate ? new Date(p.endDate).toISOString().split('T')[0] : '',
      isOngoing: p.isOngoing || false,
      content: p.content || '',
      client: p.client || '',
      role: p.role || '',
      githubUrl: p.githubUrl || '',
      demoUrl: p.demoUrl || '',
      gallery: Array.isArray(p.gallery) ? p.gallery : []
    } as ProjectFormData);
    setIsEditing(true);
    setIsProjectModalOpen(true);
  };

  const openDeleteModal = (p: Project) => {
    setProjectToDelete(p);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    const res = await fetch(`/api/projects/${projectToDelete._id}`, { method: 'DELETE' });
    if (res.ok) {
      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
      fetchProjects();
      toast.success('Project deleted successfully.');
    } else {
      toast.error('Failed to delete project.');
    }
  };

  const openAddModal = () => {
    setFormData({ id: '', title: '', description: '', tags: '', image: '', startDate: '', endDate: '', isOngoing: false, content: '', client: '', role: '', githubUrl: '', demoUrl: '', gallery: [] });
    setIsEditing(false);
    setIsProjectModalOpen(true);
  };

  const closeProjectModal = () => {
    setIsProjectModalOpen(false);
  };

  if (status === 'loading' || loading) return <div className="admin-container" style={{color: 'white'}}>Loading dashboard...</div>;

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px' }}>Project CMS</h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Logged in as {session?.user?.email}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={openAddModal} className="btn btn-primary">
            <span className="btn-inner-text" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}>
              <Plus size={16} /> New Project
            </span>
          </button>
          <button onClick={() => signOut()} className="btn btn-outline">
            <span className="btn-inner-text" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}>
              <LogOut size={16} /> Sign Out
            </span>
          </button>
        </div>
      </header>

      <main className="admin-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', fontSize: '14px', letterSpacing: '2px', color: 'var(--accent-orange)' }}>
            Project Repository ({projects.length})
          </h3>
        </div>

        {projects.length === 0 ? (
          <div className="admin-empty-state">
            <p>Your repository is empty. Start by adding a new masterpiece!</p>
            <button onClick={openAddModal} className="btn btn-primary" style={{ marginTop: '24px' }}>
               <span className="btn-inner-text">Create Project</span>
            </button>
          </div>
        ) : (
          <div className="project-list-admin">
            {projects.map(p => (
              <div key={p._id} className="project-card-admin">
                <img src={p.image} alt={p.title} />
                <div className="project-admin-content">
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                    <h4 style={{fontSize: '20px', marginBottom: '8px', fontWeight: '600'}}>{p.title}</h4>
                    <span style={{fontSize: '11px', background: 'var(--bg-tertiary)', padding: '4px 12px', borderRadius: '6px', color: 'var(--text-muted)', border: '1px solid var(--card-border)'}}>
                      {p.startDate ? new Date(p.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'} - {p.isOngoing ? 'Present' : (p.endDate ? new Date(p.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A')}
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.6', maxWidth: '800px' }}>
                    {p.description.substring(0, 160)}{p.description.length > 160 ? '...' : ''}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {p.tags.map((tag: string) => (
                        <span key={tag} style={{ fontSize: '10px', background: 'rgba(255,102,0,0.05)', color: 'var(--accent-orange)', padding: '3px 10px', borderRadius: '6px', border: '1px solid rgba(255,102,0,0.2)' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="project-admin-actions">
                      <button onClick={() => handleEdit(p)} className="admin-btn-edit" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Edit size={14} /> Edit
                      </button>
                      <button onClick={() => openDeleteModal(p)} className="admin-btn-delete" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <ProjectModal 
        isOpen={isProjectModalOpen}
        onClose={closeProjectModal}
        isEditing={isEditing}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        uploading={uploading}
        galleryUploading={galleryUploading}
        handleFileChange={handleFileChange}
        handleGalleryFiles={handleGalleryFiles}
        removeGalleryImage={removeGalleryImage}
      />

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title={projectToDelete?.title || ''}
      />
    </div>
  );
}
