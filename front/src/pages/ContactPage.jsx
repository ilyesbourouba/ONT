import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { contactAPI } from '../services/api';
import './ContactPage.css';

const ContactPage = () => {
  const { t, isRTL } = useLanguage();
  const content = t.contactPage;
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const response = await contactAPI.submit(formData);
      if (response.success) {
        setSubmitStatus({
          type: 'success',
          message: isRTL 
            ? 'تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.'
            : 'Your message has been sent successfully. We will get back to you soon.'
        });
        // Reset form
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: isRTL 
          ? 'حدث خطأ. يرجى المحاولة مرة أخرى.'
          : 'An error occurred. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!content) return null;

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero" style={{ background: 'url(https://images.sonurai.com/TassiliNAjjer.jpg) center/cover no-repeat' }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>{content.heroTitle}</h1>
        </div>
      </section>

      {/* Intro & Info Section */}
      <section className="contact-info-section">
        <div className="container">
          <div className="info-header">
            <span className="badge">{content.heroSub}</span>
            <h2>{content.headline}</h2>
            <p className="intro-text">{content.intro}</p>
          </div>

          <div className="info-grid">
            <div className="info-card">
              <div className="icon">🏛️</div>
              <h3>{content.sections.office.title}</h3>
              {content.sections.office.lines.map((line, i) => <p key={i}>{line}</p>)}
            </div>
            <div className="info-card">
              <div className="icon">✉️</div>
              <h3>{content.sections.message.title}</h3>
              {content.sections.message.lines.map((line, i) => <p key={i}>{line}</p>)}
            </div>
            <div className="info-card">
              <div className="icon">📞</div>
              <h3>{content.sections.call.title}</h3>
              {content.sections.call.lines.map((line, i) => <p key={i}>{line}</p>)}
            </div>
            <div className="info-card">
              <div className="icon">💼</div>
              <h3>{content.sections.join.title}</h3>
              {content.sections.join.lines.map((line, i) => <p key={i}>{line}</p>)}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Ribbon */}
      <section className="cta-ribbon">
        <div className="ribbon-content">
          <p>{content.ctaRibbon} <a href="#form">{isRTL ? 'هل لديك مشروع في ذهنك؟' : 'GOT A PROJECT IN MIND?'}</a></p>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="map-container">
          <div className="map-background-text">contact</div>
          <div className="map-widget">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1598.831093148118!2d3.0612971!3d36.7815918!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fb3ef83c194f9%3A0x60a5265dc2c94f30!2sOffice%20National%20du%20Tourisme!5e0!3m2!1sen!2sdz!4v1704930000000!5m2!1sen!2sdz" 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className="map-overlay-card">
              <h4>{isRTL ? 'الديوان الوطني للسياحة' : 'Office National du Tourisme'}</h4>
              <p>{isRTL ? '16000 شارع إسماعيل كرار، القصبة' : '16000 Rue Smail KERRAR, Casbah'}</p>
              <button className="view-map-btn">{isRTL ? 'عرض الخريطة' : 'VIEW LARGER MAP'}</button>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="form" className="form-section">
        <div className="container">
          <div className="form-header">
            <span className="badge">{content.form.badge}</span>
            <h2>{content.form.headline}</h2>
          </div>

          {submitStatus.message && (
            <div className={`submit-status ${submitStatus.type}`}>
              {submitStatus.message}
            </div>
          )}

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>{content.form.name}</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={content.form.namePlaceholder} 
                  required
                />
              </div>
              <div className="form-group">
                <label>{content.form.email}</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={content.form.emailPlaceholder} 
                  required
                />
              </div>
              <div className="form-group">
                <label>{content.form.phone}</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={content.form.phonePlaceholder} 
                />
              </div>
              <div className="form-group">
                <label>{content.form.subject}</label>
                <input 
                  type="text" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder={content.form.subjectPlaceholder} 
                />
              </div>
              <div className="form-group full-width">
                <label>{content.form.message}</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={content.form.messagePlaceholder} 
                  rows="5"
                  required
                ></textarea>
              </div>
            </div>
            <div className="form-footer">
              <p className="privacy-note">{content.form.privacy}</p>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={submitting}
              >
                {submitting 
                  ? (isRTL ? 'جاري الإرسال...' : 'Sending...') 
                  : content.form.submit
                }
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
