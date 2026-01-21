import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { newsAPI } from '../services/api';
import './NewsPage.css';

const NewsPage = () => {
  const { t, isRTL, language } = useLanguage();
  const content = t.newsPage;
  const [activeCategory, setActiveCategory] = useState(content?.categories[0] || 'All');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch articles from API
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await newsAPI.getAll(pagination.page, 10, activeCategory);
        if (response.success) {
          setArticles(response.data);
          setPagination(prev => ({
            ...prev,
            totalPages: response.pagination.totalPages
          }));
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load articles');
        // Fallback to static translations if API fails
        if (content?.articles) {
          setArticles(content.articles);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [activeCategory, pagination.page]);

  if (!content) return null;

  // Map API data to display format based on language
  const displayArticles = articles.map(article => ({
    id: article.id,
    title: language === 'ar' ? (article.title_ar || article.title_en) : article.title_en,
    excerpt: language === 'ar' ? (article.excerpt_ar || article.excerpt_en) : article.excerpt_en,
    category: article.category,
    date: article.date || new Date(article.created_at).toLocaleDateString(),
    image: article.image,
    likes: article.likes
  }));

  const filteredArticles = activeCategory === 'All' || activeCategory === 'الكل'
    ? displayArticles
    : displayArticles.filter(article => article.category === activeCategory);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

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
                onClick={() => {
                  setActiveCategory(cat);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
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
          {loading ? (
            <div className="loading-state">Loading...</div>
          ) : error ? (
            <div className="error-state">{error}</div>
          ) : (
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
          )}

          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <div className="pagination">
              <button 
                className="page-nav prev" 
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                ←
              </button>
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`page-num ${pagination.page === i + 1 ? 'active' : ''}`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {String(i + 1).padStart(2, '0')}
                </button>
              ))}
              <button 
                className="page-nav next"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                →
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default NewsPage;
