import { useState, useEffect } from 'react';
import { aboutAPI, uploadAPI } from '../services/api';
import DataTable from './DataTable';
import Modal from './Modal';
import ImageUpload from './ImageUpload';
import { showSuccess, showError, confirmDelete } from '../utils/toast';
import './Manager.css';
import './AboutManager.css';

const AboutManager = () => {
  const [activeTab, setActiveTab] = useState('content');
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [content, setContent] = useState({});
  const [missions, setMissions] = useState([]);
  const [stats, setStats] = useState([]);
  const [pillars, setPillars] = useState([]);
  const [faqs, setFaqs] = useState([]);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({});

  const tabs = [
    { id: 'content', label: 'Main Content', icon: '📝' },
    { id: 'missions', label: 'Missions', icon: '🎯' },
    { id: 'stats', label: 'Statistics', icon: '📊' },
    { id: 'pillars', label: 'Pillars', icon: '🏛️' },
    { id: 'faqs', label: 'FAQs', icon: '❓' },
  ];

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [contentRes, missionsRes, statsRes, pillarsRes, faqsRes] = await Promise.all([
        aboutAPI.getContent(),
        aboutAPI.getMissions(),
        aboutAPI.getStats(),
        aboutAPI.getPillars(),
        aboutAPI.getFaqs()
      ]);
      setContent(contentRes.data || {});
      setMissions(missionsRes.data || []);
      setStats(statsRes.data || []);
      setPillars(pillarsRes.data || []);
      setFaqs(faqsRes.data || []);
    } catch (error) {
      showError('Failed to fetch data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ========== CONTENT TAB ==========
  const handleContentSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let dataToSave = { ...content };
      
      // Handle image uploads
      if (content.image1 && content.image1.startsWith('data:image/')) {
        const result = await uploadAPI.uploadBase64(content.image1);
        if (result.success) dataToSave.image1 = result.data.url;
      }
      if (content.image2 && content.image2.startsWith('data:image/')) {
        const result = await uploadAPI.uploadBase64(content.image2);
        if (result.success) dataToSave.image2 = result.data.url;
      }
      
      await aboutAPI.updateContent(dataToSave);
      showSuccess('Content updated successfully!');
      fetchAllData();
    } catch (error) {
      showError(error.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  // ========== CRUD HANDLERS ==========
  const handleCreate = async (type) => {
    setSubmitting(true);
    try {
      const apiMap = {
        missions: aboutAPI.createMission,
        stats: aboutAPI.createStat,
        pillars: aboutAPI.createPillar,
        faqs: aboutAPI.createFaq,
      };
      await apiMap[type](formData);
      showSuccess(`${type.slice(0, -1)} created successfully!`);
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
        missions: aboutAPI.updateMission,
        stats: aboutAPI.updateStat,
        pillars: aboutAPI.updatePillar,
        faqs: aboutAPI.updateFaq,
      };
      await apiMap[type](id, formData);
      showSuccess(`Updated successfully!`);
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
          missions: aboutAPI.deleteMission,
          stats: aboutAPI.deleteStat,
          pillars: aboutAPI.deletePillar,
          faqs: aboutAPI.deleteFaq,
        };
        await apiMap[type](id);
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
      // Default form data based on type
      const defaults = {
        missions: { mission_en: '', mission_ar: '', display_order: 0 },
        stats: { value_en: '', value_ar: '', label_en: '', label_ar: '', stat_type: 'landing', display_order: 0 },
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

  // ========== RENDER FUNCTIONS ==========
  const renderContentTab = () => (
    <form onSubmit={handleContentSubmit} className="manager-form about-content-form">
      <div className="form-section">
        <h3>🏠 Landing Page Section</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Tagline (EN)</label>
            <input value={content.tagline_en || ''} onChange={(e) => setContent({...content, tagline_en: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Tagline (AR)</label>
            <input value={content.tagline_ar || ''} onChange={(e) => setContent({...content, tagline_ar: e.target.value})} dir="rtl" />
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
            <label>CTA Button (EN)</label>
            <input value={content.cta_en || ''} onChange={(e) => setContent({...content, cta_en: e.target.value})} />
          </div>
          <div className="form-group">
            <label>CTA Button (AR)</label>
            <input value={content.cta_ar || ''} onChange={(e) => setContent({...content, cta_ar: e.target.value})} dir="rtl" />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>📄 About Page</h3>
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
        <h3>🖼️ Images</h3>
        <div className="form-row">
          <ImageUpload label="Image 1" value={content.image1 || ''} onChange={(v) => setContent({...content, image1: v})} />
          <ImageUpload label="Image 2" value={content.image2 || ''} onChange={(v) => setContent({...content, image2: v})} />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-btn" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save All Content'}
        </button>
      </div>
    </form>
  );

  const renderMissionsTab = () => (
    <div>
      <div className="manager-header">
        <button className="add-btn" onClick={() => openModal('missions')}>+ Add Mission</button>
      </div>
      <DataTable
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'mission_en', label: 'Mission (EN)' },
          { key: 'display_order', label: 'Order' },
        ]}
        data={missions}
        loading={loading}
        onEdit={(item) => openModal('missions', item)}
        onDelete={(id) => handleDelete('missions', id)}
      />
    </div>
  );

  const renderStatsTab = () => (
    <div>
      <div className="manager-header">
        <button className="add-btn" onClick={() => openModal('stats')}>+ Add Stat</button>
      </div>
      <DataTable
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'value_en', label: 'Value' },
          { key: 'label_en', label: 'Label' },
          { key: 'stat_type', label: 'Type', render: (v) => <span className={`status-badge ${v}`}>{v === 'landing' ? 'Landing Page' : 'About Page'}</span> },
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
          { key: 'title_en', label: 'Title' },
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
      missions: {
        title: editItem ? 'Edit Mission' : 'Add Mission',
        fields: (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Mission (EN) *</label>
                <input value={formData.mission_en || ''} onChange={(e) => setFormData({...formData, mission_en: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Mission (AR)</label>
                <input value={formData.mission_ar || ''} onChange={(e) => setFormData({...formData, mission_ar: e.target.value})} dir="rtl" />
              </div>
            </div>
            <div className="form-group">
              <label>Display Order</label>
              <input type="number" value={formData.display_order || 0} onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value) || 0})} />
            </div>
          </>
        ),
      },
      stats: {
        title: editItem ? 'Edit Statistic' : 'Add Statistic',
        fields: (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Value (EN) *</label>
                <input value={formData.value_en || ''} onChange={(e) => setFormData({...formData, value_en: e.target.value})} required placeholder="e.g. 250K+" />
              </div>
              <div className="form-group">
                <label>Value (AR)</label>
                <input value={formData.value_ar || ''} onChange={(e) => setFormData({...formData, value_ar: e.target.value})} dir="rtl" placeholder="مثال: +250 ألف" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Label (EN)</label>
                <input value={formData.label_en || ''} onChange={(e) => setFormData({...formData, label_en: e.target.value})} placeholder="Annual Visitors" />
              </div>
              <div className="form-group">
                <label>Label (AR)</label>
                <input value={formData.label_ar || ''} onChange={(e) => setFormData({...formData, label_ar: e.target.value})} dir="rtl" placeholder="زائر سنوياً" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Type</label>
                <select value={formData.stat_type || 'landing'} onChange={(e) => setFormData({...formData, stat_type: e.target.value})}>
                  <option value="landing">Landing Page (About Section)</option>
                  <option value="page">About Page</option>
                </select>
              </div>
              <div className="form-group">
                <label>Display Order</label>
                <input type="number" value={formData.display_order || 0} onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value) || 0})} />
              </div>
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
                <input value={formData.label_ar || ''} onChange={(e) => setFormData({...formData, label_ar: e.target.value})} dir="rtl" placeholder="الترويج" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Title (EN) *</label>
                <input value={formData.title_en || ''} onChange={(e) => setFormData({...formData, title_en: e.target.value})} required placeholder="Tourism Promotion" />
              </div>
              <div className="form-group">
                <label>Title (AR)</label>
                <input value={formData.title_ar || ''} onChange={(e) => setFormData({...formData, title_ar: e.target.value})} dir="rtl" placeholder="الترويج السياحي" />
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
      {/* Tab Navigation */}
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

      {/* Tab Content */}
      <div className="about-tab-content">
        {activeTab === 'content' && renderContentTab()}
        {activeTab === 'missions' && renderMissionsTab()}
        {activeTab === 'stats' && renderStatsTab()}
        {activeTab === 'pillars' && renderPillarsTab()}
        {activeTab === 'faqs' && renderFaqsTab()}
      </div>

      {renderModal()}
    </div>
  );
};

export default AboutManager;
