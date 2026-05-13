"use client";

import { X, Upload, Link as LinkIcon, Hash, Type, FileText, Calendar, Trash2, User, Briefcase, Image as ImageIcon } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { parseISO, format } from 'date-fns';
import { useState, useEffect } from 'react';
import { ProjectFormData } from '@/types/project';

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Ganti spasi dengan -
    .replace(/[^\w-]+/g, '')    // Hapus karakter non-word
    .replace(/--+/g, '-');      // Ganti multiple - dengan single -
};

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  formData: ProjectFormData;
  setFormData: (data: ProjectFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  uploading: boolean;
  galleryUploading: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGalleryFiles: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeGalleryImage: (index: number) => void;
}

const CustomDatePicker = ({ selected, onChange, placeholder, disabled }: { 
  selected: Date | null, 
  onChange: (date: Date | null) => void, 
  placeholder: string,
  disabled?: boolean 
}) => {
  const [view, setView] = useState<'days' | 'months' | 'years'>('days');

  return (
    <DatePicker
      selected={selected}
      onSelect={(date: Date | null) => {
        if (view === 'years') {
          setView('months');
        } else if (view === 'months') {
          setView('days');
        }
      }}
      onChange={(date: Date | null) => {
        onChange(date);
      }}
      className="admin-input"
      dateFormat="yyyy-MM-dd"
      placeholderText={placeholder}
      disabled={disabled}
      showYearPicker={view === 'years'}
      showMonthYearPicker={view === 'months'}
      shouldCloseOnSelect={view === 'days'}
      onKeyDown={(e) => e.preventDefault()}
      renderCustomHeader={({
        date,
        changeYear,
        changeMonth,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      }) => (
        <div className="custom-datepicker-header">
          <button
            type="button"
            onClick={decreaseMonth}
            disabled={prevMonthButtonDisabled}
            className="nav-btn"
          >
            {"<"}
          </button>
          
          <div 
            className="header-label" 
            onClick={() => setView(view === 'days' ? 'years' : 'days')}
          >
            {view === 'days' ? (
              format(date, 'MMMM yyyy')
            ) : view === 'months' ? (
              format(date, 'yyyy')
            ) : (
              "Select Year"
            )}
          </div>

          <button
            type="button"
            onClick={increaseMonth}
            disabled={nextMonthButtonDisabled}
            className="nav-btn"
          >
            {">"}
          </button>
        </div>
      )}
    />
  );
};

export function ProjectModal({
  isOpen,
  onClose,
  isEditing,
  formData,
  setFormData,
  onSubmit,
  uploading,
  galleryUploading,
  handleFileChange,
  handleGalleryFiles,
  removeGalleryImage
}: ProjectModalProps) {

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Auto-generate slug from title ONLY for new projects
  useEffect(() => {
    if (!isEditing && formData.title) {
      setFormData({ ...formData, slug: slugify(formData.title) });
    }
  }, [formData.title, isEditing]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" data-lenis-prevent>
        <header className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Type size={20} />
            {isEditing ? 'Edit Project Details' : 'Design New Project'}
          </h3>
          <button onClick={onClose} className="modal-close">
            <X size={24} />
          </button>
        </header>

        <div className="modal-body">
          <form onSubmit={onSubmit}>
            <div className="admin-form-group">
              <label><Type size={12} style={{marginRight: '6px'}}/> Project Title</label>
              <input 
                type="text" 
                className="admin-input" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                placeholder="e.g. NoePOS Redesign" 
                required 
              />
            </div>

            <div className="admin-form-group">
              <label><Hash size={12} style={{marginRight: '6px'}}/> Project Slug (URL Identifier)</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={formData.slug} 
                  onChange={e => setFormData({...formData, slug: slugify(e.target.value)})} 
                  placeholder="pd-batu-hias" 
                  required 
                />
                <span style={{ 
                  position: 'absolute', 
                  right: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  fontSize: '10px',
                  color: 'var(--text-muted)'
                }}>
                  /projects/{formData.slug || '...'}
                </span>
              </div>
            </div>

            <div className="admin-form-group">
              <label><FileText size={12} style={{marginRight: '6px'}}/> Short Summary</label>
              <textarea 
                className="admin-input" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                placeholder="A brief overview for the gallery card..." 
                required 
                rows={3} 
              />
            </div>

            <div className="grid-cols-2">
              <div className="admin-form-group">
                <label><User size={12} style={{marginRight: '6px'}}/> Client</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={formData.client || ''} 
                  onChange={e => setFormData({...formData, client: e.target.value})} 
                  placeholder="Company name" 
                />
              </div>
              <div className="admin-form-group">
                <label><Briefcase size={12} style={{marginRight: '6px'}}/> Your Role</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={formData.role || ''} 
                  onChange={e => setFormData({...formData, role: e.target.value})} 
                  placeholder="Lead Developer" 
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label><Hash size={12} style={{marginRight: '6px'}}/> Tech Stack (Comma separated)</label>
              <input 
                type="text" 
                className="admin-input" 
                value={formData.tags} 
                onChange={e => setFormData({...formData, tags: e.target.value})} 
                placeholder="Next.js, Tailwind, MongoDB..." 
              />
            </div>

            <div className="admin-form-group">
              <label><Calendar size={12} style={{marginRight: '6px'}}/> Development Period</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '10px', display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Start Date</label>
                  <CustomDatePicker
                    selected={formData.startDate ? parseISO(formData.startDate) : null}
                    onChange={(date) => setFormData({ ...formData, startDate: date ? format(date, 'yyyy-MM-dd') : '' })}
                    placeholder="YYYY-MM-DD"
                  />
                </div>
                <div className={formData.isOngoing ? 'date-picker-disabled' : ''}>
                  <label style={{ fontSize: '10px', display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>End Date</label>
                  <CustomDatePicker
                    selected={formData.endDate ? parseISO(formData.endDate) : null}
                    onChange={(date) => setFormData({ ...formData, endDate: date ? format(date, 'yyyy-MM-dd') : '' })}
                    placeholder="YYYY-MM-DD"
                    disabled={formData.isOngoing}
                  />
                </div>
              </div>
              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={formData.isOngoing} 
                    onChange={e => setFormData({...formData, isOngoing: e.target.checked})} 
                  />
                  <span className="slider"></span>
                </label>
                <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>Ongoing Project</span>
              </div>
            </div>

            {/* Premium Upload: Hero Image */}
            <div className="admin-form-group">
              <label><Upload size={12} style={{marginRight: '6px'}}/> Main Hero Image</label>
              <div className={`custom-file-upload ${uploading ? 'uploading' : ''}`}>
                <input 
                  type="file" 
                  id="hero-upload"
                  accept="image/*" 
                  onChange={handleFileChange} 
                  style={{ display: 'none' }} 
                />
                <label htmlFor="hero-upload" className="file-upload-label">
                  {uploading ? (
                    <div className="upload-spinner"></div>
                  ) : (
                    <Upload size={20} />
                  )}
                  <span>{uploading ? 'Syncing Hero with R2...' : 'Choose high-res hero image'}</span>
                </label>
              </div>
              {formData.image && (
                <div className="preview-container hero-preview">
                  <img src={formData.image} alt="Hero Preview" />
                  <button type="button" onClick={() => setFormData({...formData, image: ''})} className="preview-remove">
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Gallery Manager Section */}
            <div className="admin-form-group">
              <label><ImageIcon size={12} style={{marginRight: '6px'}}/> Project Gallery Showcase</label>
              <div className={`custom-file-upload gallery-upload ${galleryUploading ? 'uploading' : ''}`}>
                <input 
                  type="file" 
                  id="gallery-upload"
                  accept="image/*" 
                  multiple
                  onChange={handleGalleryFiles} 
                  style={{ display: 'none' }} 
                />
                <label htmlFor="gallery-upload" className="file-upload-label">
                  {galleryUploading ? (
                    <div className="upload-spinner"></div>
                  ) : (
                    <Upload size={20} />
                  )}
                  <span>{galleryUploading ? 'Processing Multi-upload...' : 'Add multiple screenshots to gallery'}</span>
                </label>
              </div>
              
              {/* Gallery Preview Grid */}
              {formData.gallery && formData.gallery.length > 0 && (
                <div className="gallery-preview-grid">
                  {formData.gallery.map((url, index) => (
                    <div key={index} className="gallery-preview-item">
                      <img src={url} alt={`Gallery ${index}`} />
                      <button type="button" onClick={() => removeGalleryImage(index)} className="gallery-preview-remove">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="admin-form-group">
              <label><FileText size={12} style={{marginRight: '6px'}}/> Detailed Case Study (Markdown)</label>
              <textarea 
                className="admin-input" 
                value={formData.content || ''} 
                onChange={e => setFormData({...formData, content: e.target.value})} 
                placeholder="Tell the story, the challenges, and the solutions..." 
                rows={10} 
              />
            </div>

            <div className="grid-cols-2">
              <div className="admin-form-group">
                <label><LinkIcon size={12} style={{marginRight: '6px'}}/> Live Project Link</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={formData.demoUrl || ''} 
                  onChange={e => setFormData({...formData, demoUrl: e.target.value})} 
                  placeholder="https://example.com" 
                />
              </div>
              <div className="admin-form-group">
                <label><FaGithub size={12} style={{marginRight: '6px'}}/> Repository Source</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={formData.githubUrl || ''} 
                  onChange={e => setFormData({...formData, githubUrl: e.target.value})} 
                  placeholder="https://github.com/..." 
                />
              </div>
            </div>

            <div className="modal-footer-actions">
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={uploading || galleryUploading}>
                <span className="btn-inner-text">
                  {isEditing ? 'Sync Changes' : 'Publish Project'}
                </span>
              </button>
              <button type="button" onClick={onClose} className="btn btn-outline" style={{ flex: 1 }}>
                <span className="btn-inner-text">Discard</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, title }: DeleteConfirmModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content modal-delete" data-lenis-prevent>
        <div className="modal-body">
          <div className="delete-icon-wrapper">
            <Trash2 size={32} />
          </div>
          <h3 style={{ marginBottom: '12px' }}>Finalize Deletion?</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '32px', textAlign: 'center' }}>
            Are you sure you want to remove <strong>"{title}"</strong>? This will purge all associated data and assets from Cloudflare R2 storage.
          </p>
          <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
            <button 
              onClick={onConfirm} 
              className="btn btn-primary" 
              style={{ flex: 1, backgroundColor: '#ef4444', borderColor: '#ef4444', justifyContent: 'center' }}
            >
              <span className="btn-inner-text">Confirm Delete</span>
            </button>
            <button 
              onClick={onClose} 
              className="btn btn-outline" 
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <span className="btn-inner-text">Keep Project</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
