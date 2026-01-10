import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import { useEffect, useRef, useState } from 'react';
import aboutCard1 from '../assets/about-card-1.png';
import aboutCard2 from '../assets/about-card-2.jpg';
import './AboutONT.css';

// Custom hook for counting animation
const useCountUp = (endValue, duration = 2000, startCounting = false) => {
  const [count, setCount] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  
  useEffect(() => {
    if (!startCounting) return;
    
    // Parse the numeric value from string (e.g., "48+" -> 48)
    const numericValue = parseInt(endValue.toString().replace(/[^0-9]/g, ''), 10);
    if (isNaN(numericValue)) {
      setCount(endValue);
      return;
    }
    
    const startTime = Date.now();
    setIsCounting(true);
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * numericValue);
      
      setCount(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(numericValue);
        setIsCounting(false);
      }
    };
    
    requestAnimationFrame(animate);
  }, [endValue, duration, startCounting]);
  
  // Preserve the suffix (like "+") from original value
  const suffix = endValue.toString().replace(/[0-9]/g, '');
  return { displayValue: `${count}${suffix}`, isCounting };
};

// Stat Card Component with animation
const AnimatedStatCard = ({ stat, index, isVisible }) => {
  const { displayValue, isCounting } = useCountUp(stat.value, 2000 + (index * 200), isVisible);
  
  return (
    <div className="stat-card">
      <span className={`stat-value ${isCounting ? 'counting' : ''}`}>
        {displayValue}
      </span>
      <span className="stat-label">{stat.label}</span>
    </div>
  );
};

const AboutONT = () => {
  const { language } = useLanguage();
  const content = translations[language].about;
  const statsRef = useRef(null);
  const [isStatsVisible, setIsStatsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isStatsVisible) {
          setIsStatsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [isStatsVisible]);

  return (
    <section className="about-ont-modern">
      <div className="about-container">
        {/* Header: Always first on mobile and desktop */}
        <div className="about-header">
          <div className="badge-modern">
            <h4>{content.tagline}</h4>
          </div>
          <h1>{content.headline}</h1>
        </div>

        {/* Feature/Right Column: Sandwiched on Mobile */}
        <div className="about-right-col">
          <div className="hero-images">
            <div className="img-card card-top">
              <img src={aboutCard1} alt="ONT Professional Office" />
            </div>
            <div className="img-card card-bottom">
              <img src={aboutCard2} alt="Tourism Development" />
            </div>
          </div>
        </div>

        {/* Content/Left Column Body: Below images on mobile */}
        <div className="about-left-col">
          <p className="about-desc">{content.description}</p>
          
          <ul className="mission-list">
            {content.missions.map((mission, index) => (
              <li key={index} className="mission-item">
                <span className="check-icon">✓</span>
                <span className="mission-text">{mission}</span>
              </li>
            ))}
          </ul>

          <div className="stats-row" ref={statsRef}>
            {content.stats.map((stat, index) => (
              <AnimatedStatCard 
                key={index}
                stat={stat}
                index={index}
                isVisible={isStatsVisible}
              />
            ))}
          </div>

          <button className="read-more-btn">
            {content.cta} →
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutONT;
