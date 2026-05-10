'use client';

import { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="contact-form-container">
      {status === 'success' ? (
        <div className="contact-success">
          <CheckCircle size={48} color="var(--accent-orange)" />
          <h3>Message Sent!</h3>
          <p>Thank you for reaching out. I'll get back to you as soon as possible.</p>
          <button onClick={() => setStatus('idle')} className="btn btn-outline" style={{marginTop: '20px'}}>
            <span className="btn-inner-text">Send Another Message</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                required
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              placeholder="How can I help you?"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              required
              rows={5}
              placeholder="Tell me about your project..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            ></textarea>
          </div>

          {status === 'error' && (
            <div className="form-error">
              <AlertCircle size={16} />
              <span>Something went wrong. Please try again.</span>
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={status === 'loading'}
            style={{width: '100%', justifyContent: 'center'}}
          >
            {status === 'loading' ? (
              <span className="btn-inner-text" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                <Loader2 size={18} className="animate-spin" />
                <span style={{marginLeft: '10px'}}>Sending...</span>
              </span>
            ) : (
              <>
                <span className="btn-inner-text">Send Message</span>
                <span className="btn-inner-icon"><Send size={16} /></span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
