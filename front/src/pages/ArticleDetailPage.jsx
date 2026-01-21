import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './ArticleDetailPage.css';

const ArticleDetailPage = () => {
  const { id } = useParams();
  const { t, isRTL } = useLanguage();
  const content = t.newsPage;
  
  const article = content?.articles.find(a => a.id === parseInt(id));
  const relatedArticles = content?.articles.filter(a => a.id !== parseInt(id)).slice(0, 4);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!article) return <div className="loading">Article not found</div>;

  return (
    <div className="article-detail-page">
      {/* Article Header */}
      <section className="article-header-section">
        <div className="container narrow">
          <div className="article-meta-top">
            <span className="category-badge">{article.category}</span>
            <span className="publish-date">{article.date}</span>
          </div>
          <h1>{article.title}</h1>
          <div className="author-info">
            <div className="author-avatar">
              <img src="/footer-logo.png" alt="ONT" />
            </div>
            <div className="author-details">
                <span className="author-name">{article.author}</span>
                <span className="source-label">{isRTL ? 'الناشر الرسمي' : 'Official Publisher'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="article-featured-image">
        <div className="container">
          <div className="image-frame">
            <img src={article.image} alt={article.title} />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="article-body-section">
        <div className="container narrow">
          <div className="article-text">
            <p className="lead-text">{article.excerpt}</p>
            <div className="main-content">
              {article.content}
              <br /><br />
              {/* Dummy extra content for visual length */}
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </div>
          </div>

          <div className="article-footer">
            <div className="share-links">
                <span>{isRTL ? 'مشاركة:' : 'SHARE:'}</span>
                <div className="social-icons">
                    <button className="social-btn">f</button>
                    <button className="social-btn">t</button>
                    <button className="social-btn">in</button>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      <section className="related-posts-section">
        <div className="container">
          <h2 className="related-title">{content.relatedTitle}</h2>
          <div className="related-grid">
            {relatedArticles.map((rel) => (
              <Link to={`/news/${rel.id}`} key={rel.id} className="related-card">
                <div className="rel-image">
                  <img src={rel.image} alt={rel.title} />
                </div>
                <div className="rel-body">
                  <span className="rel-date">{rel.date}</span>
                  <h3>{rel.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ArticleDetailPage;
