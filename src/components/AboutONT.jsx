import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import aboutCard1 from '../assets/about-card-1.png';
import aboutCard2 from '../assets/about-card-2.jpg';
import './AboutONT.css';

const AboutONT = () => {
  const { language } = useLanguage();
  const content = translations[language].about;

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

          <div className="stats-row">
            {content.stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
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
