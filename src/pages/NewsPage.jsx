import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './NewsPage.css';

const NewsPage = () => {
  const { t, isRTL } = useLanguage();
  const content = t.newsPage;
  const [activeCategory, setActiveCategory] = useState(content?.categories[0] || 'All');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!content) return null;

  const filteredArticles = activeCategory === 'All' || activeCategory === 'الكل'
    ? content.articles
    : content.articles.filter(article => article.category === activeCategory);

  return (
    <div className="news-page">
      {/* Hero Section */}
      <section className="news-hero">
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <span className="hero-badge">{content.heroSub}</span>
            <h1>{content.heroTitle}</h1>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="news-filters">
        <div className="container">
          <div className="filters-list">
            {content.categories.map((cat, index) => (
              <button
                key={index}
                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="news-grid-section">
        <div className="container">
          <div className="news-grid">
            {filteredArticles.map((article) => (
              <Link to={`/news/${article.id}`} key={article.id} className="news-card">
                <div className="card-image">
                  <img src={article.image} alt={article.title} />
                  <span className="card-category">{article.category}</span>
                </div>
                <div className="card-body">
                  <div className="card-meta">
                    <span className="card-date">{article.date}</span>
                    <span className="card-likes">
                      <i className="heart-icon">♥</i> {article.likes}
                    </span>
                  </div>
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination Placeholder */}
          <div className="pagination">
            <button className="page-nav prev">←</button>
            <button className="page-num active">01</button>
            <button className="page-num">02</button>
            <button className="page-num">03</button>
            <button className="page-nav next">→</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsPage;
