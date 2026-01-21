import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './AboutPage.css';

const AboutPage = () => {
  const { t, isRTL } = useLanguage();
  const content = t.aboutPage;
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!content) return null;

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero" style={{ background: 'url(/images/destinations/great-mosque.jpg) center/cover no-repeat' }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>{content.heroTitle}</h1>
        </div>
      </section>

      {/* Main Info Section */}
      <section className="about-main-section">
        <div className="container">
          <div className="about-grid">
            <div className="about-image-wrapper">
              <img 
                src="/images/destinations/constantine.jpg" 
                alt="ONT Institutional" 
                className="main-about-img"
              />
              <div className="play-button-overlay">
                <div className="play-icon">▶</div>
              </div>
            </div>
            
            <div className="about-text-content">
              <span className="badge">{content.heroSub}</span>
              <h2>{content.headline}</h2>
              <p className="intro-paragraph">{content.description1}</p>
              <p className="sub-paragraph">{content.description2}</p>
              <button className="our-services-btn">{isRTL ? 'خدماتنا' : 'OUR SERVICES'} →</button>
            </div>
          </div>

          <div className="about-stats-row">
            <div className="stat-item">
              <span className="stat-value">{content.stats.established.value}</span>
              <span className="stat-label">{content.stats.established.label}</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">{content.stats.missions.value}</span>
              <span className="stat-label">{content.stats.missions.label}</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">{content.stats.partners.value}</span>
              <span className="stat-label">{content.stats.partners.label}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars / Timeline Section */}
      <section className="pillars-section">
        <div className="container">
          <div className="section-header">
            <span className="badge">{isRTL ? 'دورة العمل' : 'PROCESS CYCLE'}</span>
            <h2>{content.pillarsTitle}</h2>
          </div>

          <div className="pillars-grid">
            {content.pillars.map((pillar, index) => (
              <div key={index} className="pillar-card">
                <div className="pillar-header">
                    <span className="pillar-label">{pillar.year}</span>
                    <h3>{pillar.title}</h3>
                </div>
                <div className="pillar-content">
                  <p>{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <div className="faq-container">
            <div className="faq-header">
                <span className="badge">{content.faqSub}</span>
                <h2>{content.faqTitle}</h2>
                <div className="faq-decoration">
                    <span className="decoration-icon">❓</span>
                </div>
            </div>

            <div className="faq-list">
              {content.faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className={`faq-item ${activeFaq === index ? 'active' : ''}`}
                >
                  <div className="faq-question" onClick={() => toggleFaq(index)}>
                    <h3>{faq.q}</h3>
                    <span className="faq-toggle">{activeFaq === index ? '−' : '+'}</span>
                  </div>
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};


export default AboutPage;
