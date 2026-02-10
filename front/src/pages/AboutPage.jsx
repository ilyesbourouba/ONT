import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { aboutAPI } from '../services/api';
import './AboutPage.css';

const AboutPage = () => {
  const { t, isRTL, language } = useLanguage();
  const staticContent = t.aboutPage;
  const [activeFaq, setActiveFaq] = useState(null);
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Fetch data from API
    const fetchData = async () => {
      try {
        const response = await aboutAPI.getAll();
        if (response.success && response.data) {
          setApiData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch about data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (!staticContent) return null;

  // Get content from API or fallback
  const content = apiData?.content || {};
  const getText = (enField, arField, fallback) => {
    if (language === 'ar') {
      return content[arField] || fallback;
    }
    return content[enField] || fallback;
  };

  const heroTitle = getText('hero_title_en', 'hero_title_ar', staticContent.heroTitle);
  const heroSub = getText('hero_sub_en', 'hero_sub_ar', staticContent.heroSub);
  const headline = getText('page_headline_en', 'page_headline_ar', staticContent.headline);
  const description1 = getText('page_description1_en', 'page_description1_ar', staticContent.description1);
  const description2 = getText('page_description2_en', 'page_description2_ar', staticContent.description2);
  const pillarsTitle = getText('pillars_title_en', 'pillars_title_ar', staticContent.pillarsTitle);
  const faqTitle = getText('faq_title_en', 'faq_title_ar', staticContent.faqTitle);
  const faqSub = getText('faq_sub_en', 'faq_sub_ar', staticContent.faqSub);

  // Get pillars from API or fallback
  const pillars = apiData?.pillars?.length > 0 
    ? apiData.pillars.map(p => ({
        year: language === 'ar' ? (p.label_ar || p.label_en) : p.label_en,
        title: language === 'ar' ? (p.title_ar || p.title_en) : p.title_en,
        desc: language === 'ar' ? (p.description_ar || p.description_en) : p.description_en,
      }))
    : staticContent.pillars;

  // Get FAQs from API or fallback
  const faqs = apiData?.faqs?.length > 0 
    ? apiData.faqs.map(f => ({
        q: language === 'ar' ? (f.question_ar || f.question_en) : f.question_en,
        a: language === 'ar' ? (f.answer_ar || f.answer_en) : f.answer_en,
      }))
    : staticContent.faqs;

  // Get page stats from API or fallback
  const pageStats = apiData?.pageStats?.length > 0 ? apiData.pageStats : null;
  const stats = pageStats 
    ? {
        established: { 
          value: language === 'ar' ? (pageStats[0]?.value_ar || pageStats[0]?.value_en) : pageStats[0]?.value_en,
          label: language === 'ar' ? (pageStats[0]?.label_ar || pageStats[0]?.label_en) : pageStats[0]?.label_en
        },
        missions: { 
          value: language === 'ar' ? (pageStats[1]?.value_ar || pageStats[1]?.value_en) : pageStats[1]?.value_en,
          label: language === 'ar' ? (pageStats[1]?.label_ar || pageStats[1]?.label_en) : pageStats[1]?.label_en
        },
        partners: { 
          value: language === 'ar' ? (pageStats[2]?.value_ar || pageStats[2]?.value_en) : pageStats[2]?.value_en,
          label: language === 'ar' ? (pageStats[2]?.label_ar || pageStats[2]?.label_en) : pageStats[2]?.label_en
        }
      }
    : staticContent.stats;

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero" style={{ background: 'url(/images/destinations/great-mosque.jpg) center/cover no-repeat' }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>{heroTitle}</h1>
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
              <span className="badge">{heroSub}</span>
              <h2>{headline}</h2>
              <p className="intro-paragraph">{description1}</p>
              <p className="sub-paragraph">{description2}</p>
              <button className="our-services-btn">{isRTL ? 'خدماتنا' : 'OUR SERVICES'} →</button>
            </div>
          </div>

          <div className="about-stats-row">
            <div className="stat-item">
              <span className="stat-value">{stats.established.value}</span>
              <span className="stat-label">{stats.established.label}</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">{stats.missions.value}</span>
              <span className="stat-label">{stats.missions.label}</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">{stats.partners.value}</span>
              <span className="stat-label">{stats.partners.label}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars / Timeline Section */}
      <section className="pillars-section">
        <div className="container">
          <div className="section-header">
            <span className="badge">{isRTL ? 'دورة العمل' : 'PROCESS CYCLE'}</span>
            <h2>{pillarsTitle}</h2>
          </div>

          <div className="pillars-grid">
            {pillars.map((pillar, index) => (
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
                <span className="badge">{faqSub}</span>
                <h2>{faqTitle}</h2>
                <div className="faq-decoration">
                    <span className="decoration-icon">❓</span>
                </div>
            </div>

            <div className="faq-list">
              {faqs.map((faq, index) => (
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

