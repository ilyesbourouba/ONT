import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { newsAPI } from '../services/api';
import { getImageUrl } from '../utils/imageUtils';
import './ArticleDetailPage.css';

const ArticleDetailPage = () => {
  const { id } = useParams();
  const { t, isRTL, language } = useLanguage();
  const content = t.newsPage;
  
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch the specific article
      const response = await newsAPI.getById(id);
      if (response.success && response.data) {
        setArticle(response.data);
      } else {
        setError('Article not found');
      }
      
      // Fetch related articles (all news, then filter)
      const allNews = await newsAPI.getAll(1, 5);
      if (allNews.success && allNews.data) {
        const related = allNews.data.filter(a => a.id !== parseInt(id)).slice(0, 4);
        setRelatedArticles(related);
      }
    } catch (err) {
      console.error('Error fetching article:', err);
      setError('Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  // Map article data based on language
  const getLocalizedText = (enField, arField) => {
    return language === 'ar' ? (arField || enField) : enField;
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (error || !article) {
    return (
      <div className="error-screen">
        <h2>{error || 'Article not found'}</h2>
        <Link to="/news" className="back-link">← Back to News</Link>
      </div>
    );
  }

  const displayArticle = {
    id: article.id,
    title: getLocalizedText(article.title_en, article.title_ar),
    excerpt: getLocalizedText(article.excerpt_en, article.excerpt_ar),
    content: getLocalizedText(article.content_en, article.content_ar),
    category: article.category,
    date: article.date || new Date(article.created_at).toLocaleDateString(),
    image: getImageUrl(article.image),
    author: article.author || 'ONT',
    likes: article.likes
  };

  const displayRelated = relatedArticles.map(a => ({
    id: a.id,
    title: getLocalizedText(a.title_en, a.title_ar),
    date: a.date || new Date(a.created_at).toLocaleDateString(),
    image: getImageUrl(a.image)
  }));

  return (
    <div className="article-detail-page">
      {/* Article Header */}
      <section className="article-header-section">
        <div className="container narrow">
          <div className="article-meta-top">
            <span className="category-badge">{displayArticle.category}</span>
            <span className="publish-date">{displayArticle.date}</span>
          </div>
          <h1>{displayArticle.title}</h1>
          <div className="author-info">
            <div className="author-avatar">
              <img src="/footer-logo.png" alt="ONT" />
            </div>
            <div className="author-details">
                <span className="author-name">{displayArticle.author}</span>
                <span className="source-label">{isRTL ? 'الناشر الرسمي' : 'Official Publisher'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="article-featured-image">
        <div className="container">
          <div className="image-frame">
            <img src={displayArticle.image} alt={displayArticle.title} />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="article-body-section">
        <div className="container narrow">
          <div className="article-text">
            <p className="lead-text">{displayArticle.excerpt}</p>
            <div 
              className="main-content"
              dangerouslySetInnerHTML={{ __html: displayArticle.content }}
            />
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
      {displayRelated.length > 0 && (
        <section className="related-posts-section">
          <div className="container">
            <h2 className="related-title">{content?.relatedTitle || (isRTL ? 'مقالات ذات صلة' : 'Related Articles')}</h2>
            <div className="related-grid">
              {displayRelated.map((rel) => (
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
      )}
    </div>
  );
};

export default ArticleDetailPage;
