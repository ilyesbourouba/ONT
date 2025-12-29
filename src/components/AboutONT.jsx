import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import aboutCard1 from '../assets/about-card-1.png';
import aboutCard2 from '../assets/about-card-2.jpg';
import './AboutONT.css';

const AboutONT = () => {
  const { language } = useLanguage();
  const t = translations[language].about;

  return (
    <section className="about-ont-modern">
      <div className="about-ont-left">
        <h4>{t.tagline}</h4>
        <h1>
          {t.headline.split(t.headlineHighlight)[0]}
          <span style={{ color: 'var(--primary-red)' }}>
            {t.headlineHighlight}
          </span>
          {t.headline.split(t.headlineHighlight)[1]}
        </h1>
        <p>{t.description}</p>

        <div className="features">
          {t.features.map((feature, index) => (
            <div key={index} className="feature-item">
              <div className="feature-icon">
                {index === 0 ? (
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                      <circle cx="12" cy="10" r="3" />
                   </svg>
                ) : (
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                   </svg>
                )}
              </div>
              <h3>{feature.title}</h3>
            </div>
          ))}
        </div>
        
        <button className="read-more-btn">
          {t.cta}
        </button>
      </div>

      <div className="about-ont-right"> {/* Hero Images */}
        <div className="hero-images">
           {/* We use 2 big images as requested, stacked one on top of the other */}
            <div className="img-card card-top">
                <img src={aboutCard1} alt="Algeria Tourism 1" />
            </div>
            <div className="img-card card-bottom">
                <img src={aboutCard2} alt="Algeria Tourism 2" />
            </div>
        </div>
      </div>
    </section>
  );
};

export default AboutONT;
