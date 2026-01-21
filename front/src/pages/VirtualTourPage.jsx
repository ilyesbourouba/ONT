import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './VirtualTourPage.css';

const VirtualTourPage = () => {
    const { t, isRTL } = useLanguage();
    const content = t.virtualTour;
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const imageRefs = useRef([]);
    const textRefs = useRef([]);

    useEffect(() => {
        window.scrollTo(0, 0);

        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        imageRefs.current.forEach(img => img && observer.observe(img));
        textRefs.current.forEach(txt => txt && observer.observe(txt));

        return () => observer.disconnect();
    }, []);

    if (!content) return null;

    return (
        <div className="virtual-tour-page">
            <section className="vt-hero">
                <div className="vt-hero-bg"></div>
                <div className="vt-hero-content">
                    <p className="vt-hero-sub">{content.heroSub}</p>
                    <h1>
                        {content.heroTitle.split(' ').map((word, i) => (
                            <span key={i} className={word.toLowerCase() === 'virtual' || word.toLowerCase() === 'الافتراضي' ? 'gold-text' : ''}>
                                {word}{' '}
                            </span>
                        ))}
                    </h1>
                    <p className="vt-hero-desc">{content.heroDesc}</p>
                    <button className="btn-gold" onClick={() => setIsModalOpen(true)}>
                        {content.heroCta}
                    </button>
                </div>
                <div className="vt-scroll-indicator">
                    <div className="vt-mouse">
                        <div className="vt-wheel"></div>
                    </div>
                </div>
            </section>

            <div className="vt-locations-container">
                {content.locations.map((loc, index) => (
                    <article key={loc.id} className="vt-location-article">
                        <div 
                            className="vt-loc-text fade-text" 
                            ref={el => textRefs.current[index] = el}
                        >
                            <span className="vt-loc-number">{loc.id}</span>
                            <h2>{loc.title}</h2>
                            <div className="vt-tags">
                                {loc.tags.map((tag, i) => (
                                    <span key={i} className="vt-tag">{tag}</span>
                                ))}
                            </div>
                            <p>{loc.desc}</p>
                            <button className="vt-explore-link" onClick={() => setIsModalOpen(true)}>
                                {loc.cta} {isRTL ? '←' : '→'}
                            </button>
                        </div>
                        <div className="vt-loc-image-wrapper">
                            <img
                                src={loc.image}
                                alt={loc.title}
                                className="vt-loc-image scroll-reveal"
                                ref={el => imageRefs.current[index] = el}
                            />
                        </div>
                    </article>
                ))}
            </div>

            {/* Matterport VR Modal */}
            {isModalOpen && (
                <div className="vt-modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="vt-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="vt-modal-close" onClick={() => setIsModalOpen(false)}>×</button>
                        <iframe 
                            width="100%" 
                            height="100%" 
                            src="https://my.matterport.com/show/?m=M6gCqdgrcmQ" 
                            frameBorder="0" 
                            allowFullScreen 
                            allow="xr-spatial-tracking"
                            title="Virtual Tour"
                        ></iframe>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VirtualTourPage;
