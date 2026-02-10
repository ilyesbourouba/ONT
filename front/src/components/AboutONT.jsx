import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import { useEffect, useRef, useState } from 'react';
import { aboutAPI } from '../services/api';
import aboutCard1 from '../assets/about-card-1.png';
import aboutCard2 from '../assets/about-card-2.jpg';
import './AboutONT.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
const AnimatedStatCard = ({ stat, index, isVisible, language }) => {
  const value = language === 'ar' ? (stat.value_ar || stat.value_en || stat.value) : (stat.value_en || stat.value);
  const label = language === 'ar' ? (stat.label_ar || stat.label_en || stat.label) : (stat.label_en || stat.label);
  const { displayValue, isCounting } = useCountUp(value, 2000 + (index * 200), isVisible);
  
  return (
    <div className="stat-card">
      <span className={`stat-value ${isCounting ? 'counting' : ''}`}>
        {displayValue}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  );
};

const AboutONT = () => {
  const { language } = useLanguage();
  const staticContent = translations[language].about;
  const statsRef = useRef(null);
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
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

  // Get content from API or fallback to static
  const content = apiData?.content || {};
  const tagline = language === 'ar' ? (content.tagline_ar || staticContent.tagline) : (content.tagline_en || staticContent.tagline);
  const headline = language === 'ar' ? (content.headline_ar || staticContent.headline) : (content.headline_en || staticContent.headline);
  const description = language === 'ar' ? (content.description_ar || staticContent.description) : (content.description_en || staticContent.description);
  const cta = language === 'ar' ? (content.cta_ar || staticContent.cta) : (content.cta_en || staticContent.cta);
  
  // Get missions from API or fallback
  const missions = apiData?.missions?.length > 0 
    ? apiData.missions.map(m => language === 'ar' ? (m.mission_ar || m.mission_en) : m.mission_en)
    : staticContent.missions;
  
  // Get stats from API or fallback
  const stats = apiData?.landingStats?.length > 0 ? apiData.landingStats : staticContent.stats;

  // Get image URL
  const getImageUrl = (path, fallback) => {
    if (!path) return fallback;
    if (path.startsWith('http') || path.startsWith('/assets')) return fallback;
    return `${API_BASE_URL}${path}`;
  };

  const image1 = apiData?.content?.image1 ? getImageUrl(apiData.content.image1, aboutCard1) : aboutCard1;
  const image2 = apiData?.content?.image2 ? getImageUrl(apiData.content.image2, aboutCard2) : aboutCard2;

  return (
    <section className="about-ont-modern">
      <div className="about-container">
        {/* Header: Always first on mobile and desktop */}
        <div className="about-header">
          <div className="badge-modern">
            <h4>{tagline}</h4>
          </div>
          <h1>{headline}</h1>
        </div>

        {/* Feature/Right Column: Sandwiched on Mobile */}
        <div className="about-right-col">
          <div className="hero-images">
            <div className="img-card card-top">
              <img src={image1} alt="ONT Professional Office" />
            </div>
            <div className="img-card card-bottom">
              <img src={image2} alt="Tourism Development" />
            </div>
          </div>
        </div>

        {/* Content/Left Column Body: Below images on mobile */}
        <div className="about-left-col">
          <p className="about-desc">{description}</p>
          
          <ul className="mission-list">
            {missions.map((mission, index) => (
              <li key={index} className="mission-item">
                <span className="check-icon">✓</span>
                <span className="mission-text">{mission}</span>
              </li>
            ))}
          </ul>

          <div className="stats-row" ref={statsRef}>
            {stats.map((stat, index) => (
              <AnimatedStatCard 
                key={index}
                stat={stat}
                index={index}
                isVisible={isStatsVisible}
                language={language}
              />
            ))}
          </div>

          <button className="read-more-btn">
            {cta} →
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutONT;

