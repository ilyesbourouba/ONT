import { useLanguage } from '../context/LanguageContext';
import './Header.css';

const Header = () => {
  const { t, language, toggleLanguage, isRTL } = useLanguage();

  const navLinks = [
    { key: 'home', href: '#' },
    { key: 'destinations', href: '#' },
    { key: 'heritage', href: '#' },
    { key: 'events', href: '#' },
    { key: 'planTrip', href: '#' },
    { key: 'contact', href: '#' },
  ];

  return (
    <header className="header">
      <div className="logo">
        <img 
          src="/ont-logo.png" 
          alt="ONT Logo" 
          className="logo-img"
        />
        <span className="logo-text">
          {t.logoText} <span className="logo-highlight">{t.logoHighlight}</span>
        </span>
      </div>
      
      <nav>
        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link.key}>
              <a href={link.href}>{t.nav[link.key]}</a>
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
