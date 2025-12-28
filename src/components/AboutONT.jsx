import { useLanguage } from '../context/LanguageContext';
import './AboutONT.css';

const AboutONT = () => {
  const { isRTL } = useLanguage();

  const missions = [
    {
      number: '01',
      title: 'Promotion du tourisme',
      description: 'Promotion du tourisme national et international à travers des campagnes innovantes.',
    },
    {
      number: '02',
      title: 'Développement durable',
      description: 'Développement durable des zones touristiques et préservation du patrimoine.',
    },
    {
      number: '03',
      title: 'Statistiques & données',
      description: 'Analyse approfondie des statistiques et données du secteur touristique.',
    },
    {
      number: '04',
      title: 'Partenariats internationaux',
      description: 'Gestion stratégique des partenariats diplomatiques et touristiques.',
    },
    {
      number: '05',
      title: 'Formation professionnelle',
      description: 'Soutien actif à la formation et certification des professionnels.',
    },
  ];

  return (
    <section className="about-ont-modern">
      <div className="about-ont-wrapper">
        {/* Left Content */}
        <div className="about-ont-left">
          <span className="section-badge">Institutionnel</span>
          <h2 className="main-heading">
            Découvrez l'Office<br />
            National du Tourisme.
          </h2>

          <div className="timeline-container">
            {missions.map((mission, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker">
                  <span className="timeline-number">{mission.number}</span>
                  {index < missions.length - 1 && <div className="timeline-line"></div>}
                </div>
                <div className="timeline-content">
                  <h3 className="timeline-title">{mission.title}</h3>
                  <p className="timeline-description">{mission.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Illustration */}
        <div className="about-ont-right">
          <div className="illustration-container">
            <div className="glow-bg"></div>
            <div className="monument-illustration">
              <img 
                src="/pyramid-illustration.png" 
                alt="Pyramid illustration representing growth and success" 
                className="pyramid-image"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="cta-banner">
        <span className="cta-badge">ONT</span>
        <span className="cta-text">
          L'organe officiel du gouvernement algérien pour le tourisme.
          <a href="#" className="cta-link">En savoir plus sur l'ONT?</a>
        </span>
      </div>
    </section>
  );
};

export default AboutONT;
