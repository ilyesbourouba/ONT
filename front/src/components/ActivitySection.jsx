import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import { activitiesAPI } from '../services/api';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ActivitySection.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const ActivitySection = () => {
  const { language } = useLanguage();
  const staticContent = translations[language].activities;
  const [activitiesData, setActivitiesData] = useState([]);
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  // Fetch activities from API
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await activitiesAPI.getAll(1, 10);
        if (response.success && response.data.length > 0) {
          setActivitiesData(response.data);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };
    fetchActivities();
  }, []);

  // Use API data if available, otherwise use static translations
  const content = {
    ...staticContent,
    items: activitiesData.length > 0 
      ? activitiesData.map(item => ({
          name: language === 'ar' ? (item.name_ar || item.name_en) : item.name_en,
          description: language === 'ar' ? (item.description_ar || item.description_en) : item.description_en,
          date: item.date,
          tags: item.tags || [],
          image: item.image
        }))
      : staticContent.items
  };

  useEffect(() => {
    const sections = gsap.utils.toArray('.activity-slide');
    
    if (sections.length === 0) return;

    // Create the pinning effect for each section
    sections.forEach((section, i) => {
      const isLast = i === sections.length - 1;
      
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        pin: true,
        pinSpacing: isLast, // Allow the last section to push down following content
        scrub: true,
      });

      // Animate the image
      gsap.fromTo(
        section.querySelector('.activity-image img'),
        { scale: 0.85, opacity: 0, y: 60 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top top',
            scrub: 1,
          },
        }
      );

      // Animate the content
      gsap.fromTo(
        section.querySelector('.activity-content'),
        { x: language === 'ar' ? -100 : 100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            end: 'top 20%',
            scrub: 1,
          },
        }
      );

      // Animate the big number
      gsap.fromTo(
        section.querySelector('.activity-number'),
        { y: -50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'top 30%',
            scrub: 1,
          },
        }
      );
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [language]);

  if (!content) return null;

  return (
    <section className="activity-section" ref={sectionRef}>
      {/* Section Header */}
      <div className="activity-header">
        <span className="activity-badge">{content.badge}</span>
        <h2 className="activity-headline">{content.headline}</h2>
      </div>

      {/* Activity Slides Container */}
      <div className="activity-slides-container" ref={containerRef}>
        {content.items.map((activity, index) => (
          <div key={index} className="activity-slide" id={`activity-${index + 1}`}>
            {/* Left: Image */}
            <div className="activity-visual">
              <span className="activity-number">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="activity-image">
                <img src={activity.image} alt={activity.name} />
              </div>
            </div>

            {/* Right: Content */}
            <div className="activity-content">
              <div className="activity-tags">
                {activity.tags.map((tag, i) => (
                  <span key={i} className="activity-tag">{tag}</span>
                ))}
              </div>
              <h3 className="activity-name">{activity.name}</h3>
              <p className="activity-description">{activity.description}</p>
              <div className="activity-date">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>{activity.date}</span>
              </div>
              <a href="#" className="activity-explore-btn">
                {content.exploreBtn} <span>→</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="activity-footer">
        <a href="#" className="view-all-btn">
          {content.viewAllBtn} <span>→</span>
        </a>
      </div>
    </section>
  );
};

export default ActivitySection;
