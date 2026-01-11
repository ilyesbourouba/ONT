import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './VisitAlgeria.css';

gsap.registerPlugin(ScrollTrigger);

const VisitAlgeria = () => {
  const { language } = useLanguage();
  const content = translations[language].visitAlgeria;
  const sectionRef = useRef(null);
  const videoBannerRef = useRef(null);
  const destinationsRef = useRef(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header fade-in animation
      const headerElements = sectionRef.current?.querySelectorAll('.visit-header > *');
      if (headerElements) {
        gsap.fromTo(
          headerElements,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // Video banner scroll scale effect
      if (videoBannerRef.current) {
        ScrollTrigger.create({
          trigger: videoBannerRef.current,
          start: 'top 80%',
          onEnter: () => videoBannerRef.current.classList.add('scroll-active'),
          onLeaveBack: () => videoBannerRef.current.classList.remove('scroll-active')
        });
      }

      // Destinations header animation
      const destHeader = destinationsRef.current?.querySelector('.destinations-header')
      if (destHeader) {
        gsap.fromTo(
          destHeader.children,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: destHeader,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // Destination items staggered fade-in
      const items = gsap.utils.toArray('.destination-item');
      items.forEach((item, index) => {
        gsap.to(item, {
          scrollTrigger: {
            trigger: item,
            start: 'top 88%',
            onEnter: () => {
              setTimeout(() => item.classList.add('visible'), index * 100);
            },
            onLeaveBack: () => item.classList.remove('visible')
          }
        });
      });

      // CTA button animation
      const ctaBtn = sectionRef.current?.querySelector('.visit-cta-btn');
      if (ctaBtn) {
        gsap.fromTo(
          ctaBtn,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: ctaBtn,
              start: 'top 92%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [language]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsVideoOpen(false);
    };
    if (isVideoOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isVideoOpen]);

  if (!content) return null;

  return (
    <section className="visit-algeria-section" ref={sectionRef}>
      {/* Header Section */}
      <header className="visit-header">
        <span className="visit-badge">{content.badge}</span>
        <h1>{content.headline}</h1>
        <p>{content.description}</p>
        <a 
          href="https://ilyesbourouba.github.io/visitAlgeria/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-explore"
        >
          {content.exploreBtn}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </header>

      {/* Video Banner Section */}
      <div className="video-wrapper">
        <div 
          className="video-banner" 
          ref={videoBannerRef}
          style={{ backgroundImage: `url('${content.bannerImage}')` }}
        >
          <div className="video-text">
            <h2>{content.bannerText}</h2>
          </div>
          <button className="play-btn" onClick={() => setIsVideoOpen(true)} aria-label="Play video">
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Video Modal Popup */}
      {isVideoOpen && (
        <div className="video-modal-overlay" onClick={() => setIsVideoOpen(false)}>
          <div className="video-modal" onClick={(e) => e.stopPropagation()}>
            <button className="video-modal-close" onClick={() => setIsVideoOpen(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
            <div className="video-modal-content">
              <iframe
                src={`https://www.youtube.com/embed/${content.youtubeVideoId}?autoplay=1&rel=0`}
                title="Discover Algeria"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Destinations Grid Section */}
      <div className="destinations-section" ref={destinationsRef}>
        <div className="destinations-header">
          <h2>{content.destinationsTitle}</h2>
          <p>{content.destinationsSubtitle}</p>
        </div>

        <div className="destinations-grid">
          {content.destinations.map((dest, index) => (
            <div key={index} className="destination-item">
              <div className="destination-card">
                <img src={dest.image} alt={dest.name} loading="lazy" />
              </div>
              <h4>{dest.name}</h4>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="visit-cta-section">
        <a 
          href="https://ilyesbourouba.github.io/visitAlgeria/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="visit-cta-btn"
        >
          {content.cta}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
    </section>
  );
};

export default VisitAlgeria;

