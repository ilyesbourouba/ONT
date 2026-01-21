import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import ontLogo from '../assets/ont-logo.png';
import './Header.css';

const Header = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      // Trigger white background when leaving Hero (approx 90% of viewport height)
      if (window.scrollY > window.innerHeight * 0.9 || !isHomePage) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    handleScroll(); // Check initial state
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const navLinks = [
    { key: 'home', to: '/' },
    { key: 'aboutUs', to: '/about' },
    { key: 'news', to: '/news' },
    { key: 'tourGuide', to: '/virtual-tour' },
    { key: 'planTrip', to: '/#planTrip' },
    { key: 'contact', to: '/contact' },
  ];

  return (
    <header className={`header ${isScrolled || !isHomePage ? 'scrolled' : ''}`}>
      <Link to="/" className="logo">
        <img 
          src={ontLogo} 
          alt="ONT Logo" 
          className="logo-img"
        />
        <span className="logo-text">
          {t.logoText} <span className="logo-highlight">{t.logoHighlight}</span>
        </span>
      </Link>
      
      <nav>
        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link.key}>
              {link.to.startsWith('/#') ? (
                <a href={link.to.substring(1)}>{t.nav[link.key]}</a>
              ) : (
                <Link to={link.to}>{t.nav[link.key]}</Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
      
      <button 
        className="language-switcher" 
        onClick={toggleLanguage}
        aria-label={`Switch to ${language === 'en' ? 'Arabic' : 'English'}`}
      >
        <span className="globe-icon">🌐</span>
        <span className="lang-text">{language === 'en' ? 'EN' : 'عربي'}</span>
      </button>
    </header>
  );
};

export default Header;

