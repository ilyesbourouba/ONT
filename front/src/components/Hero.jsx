import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { heroAPI } from '../services/api';
import './Hero.css';

// Fallback images if no slides are available from the database
const fallbackImages = [
  'https://images.unsplash.com/photo-1542345812-d98d5ec4a6ac?q=80&w=2069&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1489493887464-892be6d1daae?q=80&w=2067&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?q=80&w=2070&auto=format&fit=crop',
];

const AUTO_ADVANCE_DELAY = 7000;
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Hero = () => {
  const { t, isRTL, language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [showContent, setShowContent] = useState(false);
  const [typingKey, setTypingKey] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch hero slides from API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await heroAPI.getActive();
        if (response.success && response.data && response.data.length > 0) {
          setSlides(response.data);
        } else {
          // Use fallback if no slides in database
          setSlides(fallbackImages.map((img, index) => ({
            id: index,
            image: img,
            headline_en: t.headline,
            headline_ar: t.headline,
            subtitle_en: t.slides?.[index]?.subtitle || '',
            subtitle_ar: t.slides?.[index]?.subtitle || '',
            button_text_en: t.slides?.[index]?.cta || 'Explore',
            button_text_ar: t.slides?.[index]?.cta || 'استكشف',
            button_link: '#',
          })));
        }
      } catch (error) {
        console.error('Failed to fetch hero slides:', error);
        // Use fallback on error
        setSlides(fallbackImages.map((img, index) => ({
          id: index,
          image: img,
          headline_en: t.headline,
          headline_ar: t.headline,
          subtitle_en: t.slides?.[index]?.subtitle || '',
          subtitle_ar: t.slides?.[index]?.subtitle || '',
          button_text_en: t.slides?.[index]?.cta || 'Explore',
          button_text_ar: t.slides?.[index]?.cta || 'استكشف',
          button_link: '#',
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, [t]);

  // Get current slide data
  const currentSlideData = slides[currentSlide] || {};
  
  // Get headline based on language
  const headline = language === 'ar' 
    ? (currentSlideData.headline_ar || currentSlideData.headline_en || t.headline)
    : (currentSlideData.headline_en || t.headline);
  
  // Get subtitle based on language
  const subtitle = language === 'ar'
    ? (currentSlideData.subtitle_ar || currentSlideData.subtitle_en || '')
    : (currentSlideData.subtitle_en || '');
  
  // Get button text based on language
  const buttonText = language === 'ar'
    ? (currentSlideData.button_text_ar || currentSlideData.button_text_en || 'استكشف')
    : (currentSlideData.button_text_en || 'Explore');
  
  // Get button link
  const buttonLink = currentSlideData.button_link || '#';

  // Get image URL (handle relative paths from backend)
  const getImageUrl = (imagePath) => {
    if (!imagePath) return fallbackImages[0];
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  // Typewriter effect
  useEffect(() => {
    if (loading || slides.length === 0) return;
    
    setDisplayedText('');
    setShowContent(false);
    let currentIndex = 0;
    
    const typeInterval = setInterval(() => {
      if (currentIndex <= headline.length) {
        setDisplayedText(headline.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => setShowContent(true), 200);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, [typingKey, headline, loading, slides.length]);

  // Reset animation when language or slide changes
  useEffect(() => {
    setTypingKey(prev => prev + 1);
  }, [language, currentSlide]);

  const goToSlide = useCallback((index) => {
    if (isAnimating || index === currentSlide || slides.length === 0) return;
    
    setIsAnimating(true);
    setCurrentSlide(index);
    setTypingKey(prev => prev + 1);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  }, [isAnimating, currentSlide, slides.length]);

  const nextSlide = useCallback(() => {
    if (slides.length === 0) return;
    const next = (currentSlide + 1) % slides.length;
    goToSlide(next);
  }, [currentSlide, goToSlide, slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length === 0) return;
    const prev = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(prev);
  }, [currentSlide, goToSlide, slides.length]);

  // Auto-advance
  useEffect(() => {
    if (slides.length === 0) return;
    
    const autoAdvance = setInterval(() => {
      if (!isAnimating) {
        nextSlide();
      }
    }, AUTO_ADVANCE_DELAY);

    return () => clearInterval(autoAdvance);
  }, [nextSlide, isAnimating, slides.length]);

  if (loading) {
    return (
      <section className="hero">
        <div className="hero-loading">Loading...</div>
      </section>
    );
  }

  return (
    <section className="hero">
      {/* Slides Container */}
      <div 
        className="slides-container"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id || index}
            className="slide"
            style={{ backgroundImage: `url(${getImageUrl(slide.image)})` }}
          >
            <div className="slide-overlay"></div>
          </div>
        ))}
      </div>

      {/* Glow Circle */}
       <div className="glow-circle"></div>

      {/* Floating Badge */}
      <div className="floating-badge">
        <span className="badge-number">{t.badgeNumber}</span>
        <span className="badge-text">{t.badgeText}</span>
        <span className="badge-year">{t.badgeYear}</span>
      </div>

      {/* Content */}
      <div className="hero-content">
        <div className={`tagline ${showContent ? 'visible' : ''}`}>
          <span className="star-icon">★</span>
          {t.tagline}
        </div>

        <h1 className="typewriter-heading">
          {displayedText}
          <span className="cursor">|</span>
        </h1>

        <p className={`subtitle ${showContent ? 'visible' : ''}`}>
          {subtitle || t.slides?.[currentSlide]?.subtitle || ''}
        </p>

        <a 
          href={buttonLink} 
          className={`btn-cta ${showContent ? 'visible' : ''}`}
          target={buttonLink.startsWith('http') ? '_blank' : '_self'}
          rel={buttonLink.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {buttonText}
          <div className="btn-arrow">{isRTL ? '←' : '➜'}</div>
        </a>
      </div>

      {/* Navigation Arrows */}
      <button 
        className="nav-arrow nav-arrow-left" 
        aria-label="Previous slide"
        onClick={isRTL ? nextSlide : prevSlide}
        disabled={isAnimating}
      >
        ❮
      </button>
      <button 
        className="nav-arrow nav-arrow-right" 
        aria-label="Next slide"
        onClick={isRTL ? prevSlide : nextSlide}
        disabled={isAnimating}
      >
        ❯
      </button>

      {/* Dots Navigation */}
      <div className="dots-container">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            disabled={isAnimating}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;

