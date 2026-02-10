import { useState, useEffect } from 'react';
import { aboutAPI } from '../services/api';
import DataTable from './DataTable';
import Modal from './Modal';
import { showSuccess, showError, confirmDelete } from '../utils/toast';
import './Manager.css';
import './AboutManager.css';

/**
 * AboutPageManager - Manages the About Us page content
 * - Page content (hero title, descriptions)
 * - Stats (page type only)
 * - Pillars
 * - FAQs
 */
const AboutPageManager = () => {
  const [activeTab, setActiveTab] = useState('content');
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [content, setContent] = useState({});
  const [stats, setStats] = useState([]);
  const [pillars, setPillars] = useState([]);
  const [faqs, setFaqs] = useState([]);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({});

  const tabs = [
    { id: 'content', label: 'Page Content', icon: '📄' },
    { id: 'stats', label: 'Stats', icon: '📊' },
    { id: 'pillars', label: 'Pillars', icon: '🏛️' },
    { id: 'faqs', label: 'FAQs', icon: '❓' },
  ];

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [contentRes, statsRes, pillarsRes, faqsRes] = await Promise.all([
        aboutAPI.getContent(),
        aboutAPI.getStats('page'),
        aboutAPI.getPillars(),
        aboutAPI.getFaqs()
      ]);
      setContent(contentRes.data || {});
      setStats(statsRes.data || []);
      setPillars(pillarsRes.data || []);
      setFaqs(faqsRes.data || []);
    } catch (error) {
      showError('Failed to fetch data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Content Submit
  const handleContentSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await aboutAPI.updateContent(content);
      showSuccess('Content updated successfully!');
      fetchAllData();
    } catch (error) {
      showError(error.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  // CRUD Handlers
  const handleCreate = async (type) => {
    setSubmitting(true);
    try {
      const apiMap = {
        stats: () => aboutAPI.createStat({ ...formData, stat_type: 'page' }),
        pillars: () => aboutAPI.createPillar(formData),
        faqs: () => aboutAPI.createFaq(formData),
      };
      await apiMap[type]();
      showSuccess('Created successfully!');
      fetchAllData();
      closeModal();
    } catch (error) {
      showError(error.message || 'Create failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (type, id) => {
    setSubmitting(true);
    try {
      const apiMap = {
        stats: () => aboutAPI.updateStat(id, formData),
        pillars: () => aboutAPI.updatePillar(id, formData),
        faqs: () => aboutAPI.updateFaq(id, formData),
      };
      await apiMap[type]();
      showSuccess('Updated successfully!');
      fetchAllData();
      closeModal();
    } catch (error) {
      showError(error.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (type, id) => {
    const confirmed = await confirmDelete(`this ${type.slice(0, -1)}`);
    if (confirmed) {
      try {
        const apiMap = {
          stats: () => aboutAPI.deleteStat(id),
          pillars: () => aboutAPI.deletePillar(id),
          faqs: () => aboutAPI.deleteFaq(id),
        };
        await apiMap[type]();
        showSuccess('Deleted successfully!');
        fetchAllData();
      } catch (error) {
        showError(error.message || 'Delete failed');
      }
    }
  };

  const openModal = (type, item = null) => {
    setEditItem(item);
    if (item) {
      setFormData({ ...item });
    } else {
      const defaults = {
        stats: { value_en: '', value_ar: '', label_en: '', label_ar: '', stat_type: 'page', display_order: 0 },
        pillars: { label_en: '', label_ar: '', title_en: '', title_ar: '', description_en: '', description_ar: '', display_order: 0 },
        faqs: { question_en: '', question_ar: '', answer_en: '', answer_ar: '', display_order: 0 },
      };
      setFormData(defaults[type] || {});
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditItem(null);
    setFormData({});
  };

  // Render Content Tab
  const renderContentTab = () => (
    <form onSubmit={handleContentSubmit} className="manager-form about-content-form">
      <div className="form-section">
        <h3>📄 About Page Hero</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Hero Title (EN)</label>
            <input value={content.hero_title_en || ''} onChange={(e) => setContent({...content, hero_title_en: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Hero Title (AR)</label>
            <input value={content.hero_title_ar || ''} onChange={(e) => setContent({...content, hero_title_ar: e.target.value})} dir="rtl" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Hero Subtitle (EN)</label>
            <input value={content.hero_sub_en || ''} onChange={(e) => setContent({...content, hero_sub_en: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Hero Subtitle (AR)</label>
            <input value={content.hero_sub_ar || ''} onChange={(e) => setContent({...content, hero_sub_ar: e.target.value})} dir="rtl" />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>📃 Main Content</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Page Headline (EN)</label>
            <input value={content.page_headline_en || ''} onChange={(e) => setContent({...content, page_headline_en: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Page Headline (AR)</label>
            <input value={content.page_headline_ar || ''} onChange={(e) => setContent({...content, page_headline_ar: e.target.value})} dir="rtl" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Description 1 (EN)</label>
            <textarea value={content.page_description1_en || ''} onChange={(e) => setContent({...content, page_description1_en: e.target.value})} rows="3" />
          </div>
          <div className="form-group">
            <label>Description 1 (AR)</label>
            <textarea value={content.page_description1_ar || ''} onChange={(e) => setContent({...content, page_description1_ar: e.target.value})} rows="3" dir="rtl" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Description 2 (EN)</label>
            <textarea value={content.page_description2_en || ''} onChange={(e) => setContent({...content, page_description2_en: e.target.value})} rows="3" />
          </div>
          <div className="form-group">
            <label>Description 2 (AR)</label>
            <textarea value={content.page_description2_ar || ''} onChange={(e) => setContent({...content, page_description2_ar: e.target.value})} rows="3" dir="rtl" />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>🏛️ Section Titles</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Pillars Title (EN)</label>
            <input value={content.pillars_title_en || ''} onChange={(e) => setContent({...content, pillars_title_en: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Pillars Title (AR)</label>
            <input value={content.pillars_title_ar || ''} onChange={(e) => setContent({...content, pillars_title_ar: e.target.value})} dir="rtl" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>FAQ Title (EN)</label>
            <input value={content.faq_title_en || ''} onChange={(e) => setContent({...content, faq_title_en: e.target.value})} />
          </div>
          <div className="form-group">
            <label>FAQ Title (AR)</label>
            <input value={content.faq_title_ar || ''} onChange={(e) => setContent({...content, faq_title_ar: e.target.value})} dir="rtl" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>FAQ Subtitle (EN)</label>
            <input value={content.faq_sub_en || ''} onChange={(e) => setContent({...content, faq_sub_en: e.target.value})} />
          </div>
          <div className="form-group">
            <label>FAQ Subtitle (AR)</label>
            <input value={content.faq_sub_ar || ''} onChange={(e) => setContent({...content, faq_sub_ar: e.target.value})} dir="rtl" />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-btn" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Content'}
        </button>
      </div>
    </form>
  );

  const renderStatsTab = () => (
    <div>
      <div className="manager-header">
        <button className="add-btn" onClick={() => openModal('stats')}>+ Add Stat</button>
      </div>
      <DataTable
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'value_en', label: 'Value (EN)' },
          { key: 'value_ar', label: 'Value (AR)' },
          { key: 'label_en', label: 'Label (EN)' },
          { key: 'display_order', label: 'Order' },
        ]}
        data={stats}
        loading={loading}
        onEdit={(item) => openModal('stats', item)}
        onDelete={(id) => handleDelete('stats', id)}
      />
    </div>
  );

  const renderPillarsTab = () => (
    <div>
      <div className="manager-header">
        <button className="add-btn" onClick={() => openModal('pillars')}>+ Add Pillar</button>
      </div>
      <DataTable
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'label_en', label: 'Label' },
          { key: 'title_en', label: 'Title (EN)' },
          { key: 'title_ar', label: 'Title (AR)' },
          { key: 'display_order', label: 'Order' },
        ]}
        data={pillars}
        loading={loading}
        onEdit={(item) => openModal('pillars', item)}
        onDelete={(id) => handleDelete('pillars', id)}
      />
    </div>
  );

  const renderFaqsTab = () => (
    <div>
      <div className="manager-header">
        <button className="add-btn" onClick={() => openModal('faqs')}>+ Add FAQ</button>
      </div>
      <DataTable
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'question_en', label: 'Question (EN)' },
          { key: 'question_ar', label: 'Question (AR)' },
          { key: 'display_order', label: 'Order' },
        ]}
        data={faqs}
        loading={loading}
        onEdit={(item) => openModal('faqs', item)}
        onDelete={(id) => handleDelete('faqs', id)}
      />
    </div>
  );

  const renderModal = () => {
    if (!showModal) return null;
    
    const modalConfig = {
      stats: {
        title: editItem ? 'Edit Statistic' : 'Add Statistic',
        fields: (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Value (EN) *</label>
                <input value={formData.value_en || ''} onChange={(e) => setFormData({...formData, value_en: e.target.value})} required placeholder="e.g. 1992" />
              </div>
              <div className="form-group">
                <label>Value (AR)</label>
                <input value={formData.value_ar || ''} onChange={(e) => setFormData({...formData, value_ar: e.target.value})} dir="rtl" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Label (EN)</label>
                <input value={formData.label_en || ''} onChange={(e) => setFormData({...formData, label_en: e.target.value})} placeholder="Founded" />
              </div>
              <div className="form-group">
                <label>Label (AR)</label>
                <input value={formData.label_ar || ''} onChange={(e) => setFormData({...formData, label_ar: e.target.value})} dir="rtl" />
              </div>
            </div>
            <div className="form-group">
              <label>Display Order</label>
              <input type="number" value={formData.display_order || 0} onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value) || 0})} />
            </div>
          </>
        ),
      },
      pillars: {
        title: editItem ? 'Edit Pillar' : 'Add Pillar',
        fields: (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Label (EN)</label>
                <input value={formData.label_en || ''} onChange={(e) => setFormData({...formData, label_en: e.target.value})} placeholder="Promotion" />
              </div>
              <div className="form-group">
                <label>Label (AR)</label>
                <input value={formData.label_ar || ''} onChange={(e) => setFormData({...formData, label_ar: e.target.value})} dir="rtl" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Title (EN) *</label>
                <input value={formData.title_en || ''} onChange={(e) => setFormData({...formData, title_en: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Title (AR)</label>
                <input value={formData.title_ar || ''} onChange={(e) => setFormData({...formData, title_ar: e.target.value})} dir="rtl" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Description (EN)</label>
                <textarea value={formData.description_en || ''} onChange={(e) => setFormData({...formData, description_en: e.target.value})} rows="3" />
              </div>
              <div className="form-group">
                <label>Description (AR)</label>
                <textarea value={formData.description_ar || ''} onChange={(e) => setFormData({...formData, description_ar: e.target.value})} rows="3" dir="rtl" />
              </div>
            </div>
            <div className="form-group">
              <label>Display Order</label>
              <input type="number" value={formData.display_order || 0} onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value) || 0})} />
            </div>
          </>
        ),
      },
      faqs: {
        title: editItem ? 'Edit FAQ' : 'Add FAQ',
        fields: (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Question (EN) *</label>
                <textarea value={formData.question_en || ''} onChange={(e) => setFormData({...formData, question_en: e.target.value})} rows="2" required />
              </div>
              <div className="form-group">
                <label>Question (AR)</label>
                <textarea value={formData.question_ar || ''} onChange={(e) => setFormData({...formData, question_ar: e.target.value})} rows="2" dir="rtl" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Answer (EN)</label>
                <textarea value={formData.answer_en || ''} onChange={(e) => setFormData({...formData, answer_en: e.target.value})} rows="4" />
              </div>
              <div className="form-group">
                <label>Answer (AR)</label>
                <textarea value={formData.answer_ar || ''} onChange={(e) => setFormData({...formData, answer_ar: e.target.value})} rows="4" dir="rtl" />
              </div>
            </div>
            <div className="form-group">
              <label>Display Order</label>
              <input type="number" value={formData.display_order || 0} onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value) || 0})} />
            </div>
          </>
        ),
      },
    };

    const config = modalConfig[activeTab];
    if (!config) return null;

    return (
      <Modal title={config.title} onClose={closeModal} size="large">
        <form onSubmit={(e) => {
          e.preventDefault();
          if (editItem) {
            handleUpdate(activeTab, editItem.id);
          } else {
            handleCreate(activeTab);
          }
        }} className="manager-form">
          {config.fields}
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={closeModal} disabled={submitting}>Cancel</button>
            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? 'Saving...' : (editItem ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </Modal>
    );
  };

  return (
    <div className="manager about-manager">
      <div className="about-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="about-tab-content">
        {activeTab === 'content' && renderContentTab()}
        {activeTab === 'stats' && renderStatsTab()}
        {activeTab === 'pillars' && renderPillarsTab()}
        {activeTab === 'faqs' && renderFaqsTab()}
      </div>

      {renderModal()}
    </div>
  );
};

export default AboutPageManager;
