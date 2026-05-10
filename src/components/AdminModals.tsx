"use client";

import { X, Upload, Link as LinkIcon, Hash, Type, FileText, Calendar, Trash2, AlertCircle } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { parseISO, format } from 'date-fns';
import { useState, useEffect } from 'react';
import { useLenis } from 'lenis/react';
import { ProjectFormData } from '@/types/project';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  formData: ProjectFormData;
  setFormData: (data: ProjectFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  uploading: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  handleFileChange
}: ProjectModalProps) {
  const lenis = useLenis();

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
      <div className="modal-content" data-lenis-prevent>
        <header className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isEditing ? <Type size={20} /> : <Type size={20} />}
            {isEditing ? 'Edit Project' : 'Add New Project'}
          </h3>
          <button onClick={onClose} className="modal-close">
            <X size={24} />
          </button>
        </header>

        <div className="modal-body">
          <form onSubmit={onSubmit}>
            <div className="admin-form-group">
              <label><Type size={12} style={{marginRight: '6px'}}/> Title</label>
              <input 
                type="text" 
                className="admin-input" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                placeholder="Project name" 
                required 
              />
            </div>

            <div className="admin-form-group">
              <label><FileText size={12} style={{marginRight: '6px'}}/> Description</label>
              <textarea 
                className="admin-input" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                placeholder="Describe the project..." 
                required 
                rows={4} 
              />
            </div>

            <div className="admin-form-group">
              <label><Hash size={12} style={{marginRight: '6px'}}/> Tags</label>
              <input 
                type="text" 
                className="admin-input" 
                value={formData.tags} 
                onChange={e => setFormData({...formData, tags: e.target.value})} 
                placeholder="React, Fastify, Docker..." 
              />
            </div>

            <div className="admin-form-group">
              <label><Calendar size={12} style={{marginRight: '6px'}}/> Project Period</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '10px', display: 'block', marginBottom: '8px' }}>Start Date</label>
                  <CustomDatePicker
                    selected={formData.startDate ? parseISO(formData.startDate) : null}
                    onChange={(date) => setFormData({ ...formData, startDate: date ? format(date, 'yyyy-MM-dd') : '' })}
                    placeholder="Select start date"
                  />
                </div>
                <div className={formData.isOngoing ? 'date-picker-disabled' : ''}>
                  <label style={{ fontSize: '10px', display: 'block', marginBottom: '8px' }}>End Date</label>
                  <CustomDatePicker
                    selected={formData.endDate ? parseISO(formData.endDate) : null}
                    onChange={(date) => setFormData({ ...formData, endDate: date ? format(date, 'yyyy-MM-dd') : '' })}
                    placeholder="Select end date"
                    disabled={formData.isOngoing}
                  />
                </div>
              </div>
              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center' }}>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={formData.isOngoing} 
                    onChange={e => setFormData({...formData, isOngoing: e.target.checked})} 
                  />
                  <span className="slider"></span>
                </label>
                <span 
                  style={{ fontSize: '12px', color: 'var(--text-primary)', cursor: 'pointer' }} 
                  onClick={() => setFormData({...formData, isOngoing: !formData.isOngoing})}
                >
                  Project is currently ongoing
                </span>
              </div>
            </div>

            <div className="admin-form-group">
              <label><Upload size={12} style={{marginRight: '6px'}}/> Cover Image</label>
              <div className="custom-file-upload">
                <input 
                  type="file" 
                  id="modal-file-upload"
                  accept="image/*" 
                  onChange={handleFileChange} 
                  style={{ display: 'none' }} 
                />
                <label htmlFor="modal-file-upload" className="file-upload-label">
                  <Upload size={20} />
                  <span>{uploading ? 'Uploading to R2...' : 'Click to upload image'}</span>
                </label>
              </div>
              {uploading && <span className="upload-status" style={{color: 'var(--accent-orange)'}}>Synchronizing with Cloudflare R2...</span>}
            </div>

            <div className="admin-form-group">
              <label><LinkIcon size={12} style={{marginRight: '6px'}}/> Image URL</label>
              <input 
                type="text" 
                className="admin-input" 
                value={formData.image} 
                onChange={e => setFormData({...formData, image: e.target.value})} 
                placeholder="https://..." 
                required 
              />
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
              <button type="button" onClick={onClose} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>
                <span className="btn-inner-text">Cancel</span>
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
  const lenis = useLenis();

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
          <h3 style={{ marginBottom: '12px' }}>Delete Project?</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '32px' }}>
            Are you sure you want to delete <strong>"{title}"</strong>? This action will also delete the associated image from Cloudflare R2 and cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={onConfirm} 
              className="btn btn-primary" 
              style={{ flex: 1, backgroundColor: '#ef4444', borderColor: '#ef4444', justifyContent: 'center' }}
            >
              <span className="btn-inner-text">Delete Permanently</span>
            </button>
            <button 
              onClick={onClose} 
              className="btn btn-outline" 
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <span className="btn-inner-text">Cancel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
