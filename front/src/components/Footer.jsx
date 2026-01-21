import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import ontLogo from '../assets/ont-logo.png';
import './Footer.css';

const Footer = () => {
  const { language } = useLanguage();
  const content = translations[language].nav;
  const footerContent = translations[language].footer;

  if (!footerContent) return null;

  return (
    <footer className="main-footer">
      <div className="footer-container">
        {/* Logo Section */}
        <div className="footer-column footer-logo-section">
          <div className="footer-logo">
            <img src={ontLogo} alt="ONT Logo" className="footer-logo-img" />
          </div>
          <p className="footer-tagline">{footerContent.tagline}</p>
          <div className="footer-socials">
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="#" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="footer-column footer-links-section">
          <h3>{footerContent.quickLinks}</h3>
          <ul className="footer-links">
            <li><a href="#home">{content.home}</a></li>
            <li><a href="#destinations">{content.destinations}</a></li>
            <li><a href="#heritage">{content.heritage}</a></li>
            <li><a href="#events">{content.events}</a></li>
            <li><a href="#contact">{content.contact}</a></li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="footer-column footer-contact-section">
          <h3>{footerContent.contactUs}</h3>
          <div className="contact-info">
            <div className="contact-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{footerContent.address}</span>
            </div>
            <div className="contact-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.81 12.81 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
              <span>{footerContent.phone}</span>
            </div>
            <div className="contact-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>{footerContent.email}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>&copy; {new Date().getFullYear()} ONT ALGERIA. {footerContent.rights}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
