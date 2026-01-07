import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import unesco1 from '../assets/unesco-1.jpg';
import unesco2 from '../assets/unesco-2.jpg';
import unesco3 from '../assets/unesco-3.jpg';
import './UnescoHeritage.css';

const UnescoHeritage = () => {
  const { language, isRTL } = useLanguage();
  const content = translations[language].unesco;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Local images for the sites
  const localImages = [unesco1, unesco2, unesco3, unesco1, unesco2, unesco3, unesco1];

  const sites = content.sites.map((site, index) => ({
    ...site,
    image: localImages[index % localImages.length]
  }));

  const handlePrev = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? sites.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === sites.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(false), 800); // 800ms match
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isTransitioning]);

  // Carousel Logic with smooth transitions
  const getCardStyle = (index) => {
    const total = sites.length;
    // Calculate shortest distance in a circular array
    let dist = (index - currentIndex) % total;
    if (dist < 0) dist += total;
    if (dist > total / 2) dist -= total;
    
    // Determine visibility and styling based on distance
    // Active: 0, Next: 1, NextNext: 2
    // Previous: -1 (for smooth exit)
    const isActive = dist === 0;
    const isNext = dist === 1;
    const isNextNext = dist === 2;
    const isPrev = dist === -1;
    
    // We only show a window of cards
    // Visible: -1, 0, 1, 2
    const isVisible = dist >= -1 && dist <= 2;
    
    // Base spacing
    const xOffset = 240; // px
    const scaleStep = 0.85;
    
    let x = 0;
    let scale = 1;
    let zIndex = 0;
    let opacity = 0;
    
    if (isVisible) {
      opacity = 1;
      if (isActive) {
        x = 0;
        scale = 1;
        zIndex = 10;
      } else if (dist > 0) {
        // Cards to the right
        x = dist * xOffset;
        scale = Math.pow(scaleStep, dist);
        zIndex = 10 - dist;
        // Fade out distant cards
        if (dist > 2) opacity = 0;
      } else {
        // Card to the left (exiting)
        x = dist * xOffset;
        scale = Math.pow(scaleStep, Math.abs(dist));
        zIndex = 9;
        opacity = 0; // Fade out the exiting card
      }
    }

    // Adjust for RTL - Invert X
    if (isRTL) {
      x = -x;
    }

    return {
      transform: `translateX(${x}px) scale(${scale})`,
      zIndex,
      opacity,
      transition: isTransitioning ? 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
      cursor: isActive ? 'default' : 'pointer',
      visibility: isVisible ? 'visible' : 'hidden',
      position: 'absolute',
      top: 0,
      left: 0, // We anchor all cards to the same starting point and move with transform
      right: 'auto'
    };
  };

  const handleCardClick = (idx) => {
    let dist = (idx - currentIndex) % sites.length;
    if (dist < 0) dist += sites.length;
    if (dist > sites.length / 2) dist -= sites.length;

    if (dist !== 0) {
      setIsTransitioning(true);
      setCurrentIndex(idx);
    }
  };

  const currentSite = sites[currentIndex];

  return (
    <section 
      className="unesco-section"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${currentSite.image}')` 
      }}
    >
      <div className="unesco-container">
        <div className="unesco-text-box">
          <span className="unesco-badge">{content.badge}</span>
          <h1>{content.headline}</h1>
          <p>{content.description}</p>
          
          <div className="unesco-button-group">
            <a href="#" className="unesco-btn unesco-btn-fill">{content.ctaExplore}</a>
          </div>
        </div>

        <div className="unesco-carousel">
          <div className="unesco-cards-track">
            {sites.map((site, idx) => (
              <div 
                key={idx} // Stable key based on original index
                className={`unesco-card ${idx === currentIndex ? 'unesco-card-main' : ''}`}
                style={{ 
                  backgroundImage: `url('${site.image}')`,
                  ...getCardStyle(idx)
                }}
                onClick={() => handleCardClick(idx)}
              >
                <div className="unesco-card-info">
                  <h3>{site.name}</h3>
                  <p className="unesco-card-year">{site.year}</p>
                  <div className="unesco-stars">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="fas fa-star"></i>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="unesco-slider-nav">
            <button className="unesco-arrow" onClick={isRTL ? handleNext : handlePrev} aria-label="Previous site">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="unesco-counter">
              {String(currentIndex + 1).padStart(2, '0')} / {String(sites.length).padStart(2, '0')}
            </span>
            <button className="unesco-arrow" onClick={isRTL ? handlePrev : handleNext} aria-label="Next site">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UnescoHeritage;
