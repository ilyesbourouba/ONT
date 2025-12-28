import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Hero.css';

const slideImages = [
  'https://images.unsplash.com/photo-1542345812-d98d5ec4a6ac?q=80&w=2069&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1489493887464-892be6d1daae?q=80&w=2067&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?q=80&w=2070&auto=format&fit=crop',
];

const AUTO_ADVANCE_DELAY = 7000;

const Hero = () => {
  const { t, isRTL, language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [showContent, setShowContent] = useState(false);
  const [typingKey, setTypingKey] = useState(0);

  const headline = t.headline;

  // Typewriter effect
  useEffect(() => {
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
  }, [typingKey, headline]);

  // Reset animation when language changes
  useEffect(() => {
    setTypingKey(prev => prev + 1);
  }, [language]);

  const goToSlide = useCallback((index) => {
    if (isAnimating || index === currentSlide) return;
    
    setIsAnimating(true);
    setCurrentSlide(index);
    setTypingKey(prev => prev + 1);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  }, [isAnimating, currentSlide]);

  const nextSlide = useCallback(() => {
    const next = (currentSlide + 1) % slideImages.length;
    goToSlide(next);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    const prev = (currentSlide - 1 + slideImages.length) % slideImages.length;
    goToSlide(prev);
  }, [currentSlide, goToSlide]);

  // Auto-advance
  useEffect(() => {
    const autoAdvance = setInterval(() => {
      if (!isAnimating) {
        nextSlide();
      }
    }, AUTO_ADVANCE_DELAY);

    return () => clearInterval(autoAdvance);
  }, [nextSlide, isAnimating]);

  return (
    <section className="hero">
      {/* Slides Container */}
      <div 
        className="slides-container"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slideImages.map((image, index) => (
          <div
            key={index}
            className="slide"
            style={{ backgroundImage: `url(${image})` }}
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
          {t.slides[currentSlide].subtitle}
        </p>

        <a href="#" className={`btn-cta ${showContent ? 'visible' : ''}`}>
          {t.slides[currentSlide].cta}
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
        {slideImages.map((_, index) => (
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
