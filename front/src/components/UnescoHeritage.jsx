import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import { unescoAPI } from '../services/api';
import unesco1 from '../assets/unesco-1.jpg';
import unesco2 from '../assets/unesco-2.jpg';
import unesco3 from '../assets/unesco-3.jpg';
import './UnescoHeritage.css';

const UnescoHeritage = () => {
  const { language, isRTL } = useLanguage();
  const staticContent = translations[language].unesco;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [sitesData, setSitesData] = useState([]);
  const [apiContent, setApiContent] = useState(null);
  
  // Drag/Swipe state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragCurrentX, setDragCurrentX] = useState(0);
  const carouselRef = useRef(null);

  // Local images for the sites
  const localImages = [unesco1, unesco2, unesco3, unesco1, unesco2, unesco3, unesco1];

  // Fetch sites and content from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await unescoAPI.getAll();
        if (response.success && response.data) {
          if (response.data.sites?.length > 0) {
            setSitesData(response.data.sites);
          }
          if (response.data.content) {
            setApiContent(response.data.content);
          }
        }
      } catch (error) {
        console.error('Error fetching UNESCO data:', error);
        // Will fall back to static content
      }
    };
    fetchData();
  }, []);

  // Get content from API or fallback to static
  const getText = (enField, arField, fallback) => {
    if (apiContent) {
      return language === 'ar' ? (apiContent[arField] || fallback) : (apiContent[enField] || fallback);
    }
    return fallback;
  };

  const badge = getText('badge_en', 'badge_ar', staticContent.badge);
  const headline = getText('headline_en', 'headline_ar', staticContent.headline);
  const description = getText('description_en', 'description_ar', staticContent.description);
  const ctaExplore = getText('cta_explore_en', 'cta_explore_ar', staticContent.ctaExplore);

  // Use API data if available, otherwise use static translations
  const sites = (sitesData.length > 0 ? sitesData : staticContent.sites).map((site, index) => ({
    name: language === 'ar' ? (site.name_ar || site.name) : (site.name_en || site.name),
    year: site.year_inscribed || site.year,
    image: localImages[index % localImages.length]
  }));

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? sites.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === sites.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(false), 800);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isTransitioning]);

  // Drag/Swipe handlers
  const handleDragStart = (e) => {
    if (isTransitioning) return;
    setIsDragging(true);
    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    setDragStartX(clientX);
    setDragCurrentX(clientX);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    setDragCurrentX(clientX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const dragDistance = dragCurrentX - dragStartX;
    const threshold = 50; // Minimum drag distance to trigger navigation
    
    if (Math.abs(dragDistance) > threshold) {
      // Adjust direction based on RTL
      const shouldGoNext = isRTL ? dragDistance > 0 : dragDistance < 0;
      if (shouldGoNext) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    
    setDragStartX(0);
    setDragCurrentX(0);
  };

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
    if (isTransitioning) return;
    let dist = (idx - currentIndex) % sites.length;
    if (dist < 0) dist += sites.length;
    if (dist > sites.length / 2) dist -= sites.length;

    if (dist !== 0) {
      setIsTransitioning(true);
      setCurrentIndex(idx);
    }
  };

  const currentSite = sites[currentIndex];

  // Calculate drag offset for visual feedback
  const dragOffset = isDragging ? dragCurrentX - dragStartX : 0;

  return (
    <section 
      className="unesco-section"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${currentSite.image}')` 
      }}
    >
      <div className="unesco-container">
        <div className="unesco-text-box">
          <span className="unesco-badge">{badge}</span>
          <h1>{headline}</h1>
          <p>{description}</p>
          
          <div className="unesco-button-group">
            <a href="#" className="unesco-btn unesco-btn-fill">{ctaExplore}</a>
          </div>
        </div>

        <div className="unesco-carousel">
          <div 
            ref={carouselRef}
            className={`unesco-cards-track ${isDragging ? 'is-dragging' : ''}`}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
            style={{
              transform: isDragging ? `translateX(${dragOffset * 0.3}px)` : 'none'
            }}
          >
            {sites.map((site, idx) => (
              <div 
                key={idx}
                className={`unesco-card ${idx === currentIndex ? 'unesco-card-main' : ''}`}
                style={{ 
                  backgroundImage: `url('${site.image}')`,
                  ...getCardStyle(idx)
                }}
                onClick={() => !isDragging && handleCardClick(idx)}
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
