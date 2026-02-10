import { useState, useEffect } from 'react';
import { visitAlgeriaAPI } from '../services/api';
import { showSuccess, showError } from '../utils/toast';
import './Manager.css';
import './AboutManager.css';

/**
 * VisitAlgeriaManager - Manages the Visit Algeria landing page section
 * - Badge, headline, description, explore button
 * - Banner text, banner image, YouTube video ID
 * - Destinations title, subtitle, CTA
 */
const VisitAlgeriaManager = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState({});

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await visitAlgeriaAPI.getContent();
      setContent(response.data || {});
    } catch (error) {
      showError('Failed to fetch content: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await visitAlgeriaAPI.updateContent(content);
      showSuccess('Content updated successfully!');
      fetchContent();
    } catch (error) {
      showError(error.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="manager"><div className="loading">Loading...</div></div>;
  }

  return (
    <div className="manager about-manager">
      <div className="about-tab-content">
        <form onSubmit={handleSubmit} className="manager-form about-content-form">
          
          <div className="form-section">
            <h3>🏷️ Header Section</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Badge Text (EN)</label>
                <input value={content.badge_en || ''} onChange={(e) => setContent({...content, badge_en: e.target.value})} placeholder="VISIT Algeria" />
              </div>
              <div className="form-group">
                <label>Badge Text (AR)</label>
                <input value={content.badge_ar || ''} onChange={(e) => setContent({...content, badge_ar: e.target.value})} dir="rtl" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Headline (EN)</label>
                <input value={content.headline_en || ''} onChange={(e) => setContent({...content, headline_en: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Headline (AR)</label>
                <input value={content.headline_ar || ''} onChange={(e) => setContent({...content, headline_ar: e.target.value})} dir="rtl" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Description (EN)</label>
                <textarea value={content.description_en || ''} onChange={(e) => setContent({...content, description_en: e.target.value})} rows="3" />
              </div>
              <div className="form-group">
                <label>Description (AR)</label>
                <textarea value={content.description_ar || ''} onChange={(e) => setContent({...content, description_ar: e.target.value})} rows="3" dir="rtl" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Explore Button (EN)</label>
                <input value={content.explore_btn_en || ''} onChange={(e) => setContent({...content, explore_btn_en: e.target.value})} placeholder="Visit Algeria" />
              </div>
              <div className="form-group">
                <label>Explore Button (AR)</label>
                <input value={content.explore_btn_ar || ''} onChange={(e) => setContent({...content, explore_btn_ar: e.target.value})} dir="rtl" />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>🎬 Video Banner</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Banner Text (EN)</label>
                <input value={content.banner_text_en || ''} onChange={(e) => setContent({...content, banner_text_en: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Banner Text (AR)</label>
                <input value={content.banner_text_ar || ''} onChange={(e) => setContent({...content, banner_text_ar: e.target.value})} dir="rtl" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Banner Image URL</label>
                <input value={content.banner_image || ''} onChange={(e) => setContent({...content, banner_image: e.target.value})} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label>YouTube Video ID</label>
                <input value={content.youtube_video_id || ''} onChange={(e) => setContent({...content, youtube_video_id: e.target.value})} placeholder="e.g. fkIWNBiVTi8" />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>🗺️ Destinations Section</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Title (EN)</label>
                <input value={content.destinations_title_en || ''} onChange={(e) => setContent({...content, destinations_title_en: e.target.value})} placeholder="Amazing destinations" />
              </div>
              <div className="form-group">
                <label>Title (AR)</label>
                <input value={content.destinations_title_ar || ''} onChange={(e) => setContent({...content, destinations_title_ar: e.target.value})} dir="rtl" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Subtitle (EN)</label>
                <input value={content.destinations_subtitle_en || ''} onChange={(e) => setContent({...content, destinations_subtitle_en: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Subtitle (AR)</label>
                <input value={content.destinations_subtitle_ar || ''} onChange={(e) => setContent({...content, destinations_subtitle_ar: e.target.value})} dir="rtl" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>CTA Button (EN)</label>
                <input value={content.cta_en || ''} onChange={(e) => setContent({...content, cta_en: e.target.value})} placeholder="View All Destinations" />
              </div>
              <div className="form-group">
                <label>CTA Button (AR)</label>
                <input value={content.cta_ar || ''} onChange={(e) => setContent({...content, cta_ar: e.target.value})} dir="rtl" />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save All Content'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VisitAlgeriaManager;
