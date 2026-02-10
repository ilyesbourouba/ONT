import { useState, useEffect } from 'react';
import { unescoAPI, uploadAPI } from '../services/api';
import DataTable from './DataTable';
import Modal from './Modal';
import ImageUpload from './ImageUpload';
import { showSuccess, showError, confirmDelete } from '../utils/toast';
import './Manager.css';
import './AboutManager.css';

const UnescoManager = () => {
  const [activeTab, setActiveTab] = useState('content');
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [content, setContent] = useState({});
  const [sites, setSites] = useState([]);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({});

  const tabs = [
    { id: 'content', label: 'Section Content', icon: '📝' },
    { id: 'sites', label: 'Heritage Sites', icon: '🏛️' },
  ];

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [contentRes, sitesRes] = await Promise.all([
        unescoAPI.getContent(),
        unescoAPI.getSites()
      ]);
      setContent(contentRes.data || {});
      setSites(sitesRes.data || []);
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
      await unescoAPI.updateContent(content);
      showSuccess('Content updated successfully!');
      fetchAllData();
    } catch (error) {
      showError(error.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Site CRUD
  const handleSiteSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let dataToSave = { ...formData };
      
      if (formData.image && formData.image.startsWith('data:image/')) {
        const uploadResult = await uploadAPI.uploadBase64(formData.image);
        if (uploadResult.success) {
          dataToSave.image = uploadResult.data.url;
        }
      }
      
      if (editItem) {
        await unescoAPI.updateSite(editItem.id, dataToSave);
        showSuccess('Site updated successfully!');
      } else {
        await unescoAPI.createSite(dataToSave);
        showSuccess('Site created successfully!');
      }
      fetchAllData();
      closeModal();
    } catch (error) {
      showError(error.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmDelete('this UNESCO site');
    if (confirmed) {
      try {
        await unescoAPI.deleteSite(id);
        showSuccess('Site deleted successfully!');
        fetchAllData();
      } catch (error) {
        showError(error.message || 'Delete failed');
      }
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditItem(item);
      setFormData(item);
    } else {
      setEditItem(null);
      setFormData({ name_en: '', name_ar: '', year_inscribed: '', image: '', description_en: '', description_ar: '' });
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
        <h3>🏛️ UNESCO Section Content</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Badge Text (EN)</label>
            <input value={content.badge_en || ''} onChange={(e) => setContent({...content, badge_en: e.target.value})} placeholder="UNESCO World Heritage" />
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
            <textarea value={content.description_en || ''} onChange={(e) => setContent({...content, description_en: e.target.value})} rows="4" />
          </div>
          <div className="form-group">
            <label>Description (AR)</label>
            <textarea value={content.description_ar || ''} onChange={(e) => setContent({...content, description_ar: e.target.value})} rows="4" dir="rtl" />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>🔘 CTA Buttons</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Explore Button (EN)</label>
            <input value={content.cta_explore_en || ''} onChange={(e) => setContent({...content, cta_explore_en: e.target.value})} placeholder="Explore Heritage Sites" />
          </div>
          <div className="form-group">
            <label>Explore Button (AR)</label>
            <input value={content.cta_explore_ar || ''} onChange={(e) => setContent({...content, cta_explore_ar: e.target.value})} dir="rtl" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>View All Button (EN)</label>
            <input value={content.cta_learn_en || ''} onChange={(e) => setContent({...content, cta_learn_en: e.target.value})} placeholder="View All Sites" />
          </div>
          <div className="form-group">
            <label>View All Button (AR)</label>
            <input value={content.cta_learn_ar || ''} onChange={(e) => setContent({...content, cta_learn_ar: e.target.value})} dir="rtl" />
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

  // Render Sites Tab
  const renderSitesTab = () => (
    <div>
      <div className="manager-header">
        <button className="add-btn" onClick={() => openModal()}>+ Add UNESCO Site</button>
      </div>
      <DataTable
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'name_en', label: 'Name (EN)' },
          { key: 'name_ar', label: 'Name (AR)' },
          { key: 'year_inscribed', label: 'Year' },
        ]}
        data={sites}
        loading={loading}
        onEdit={openModal}
        onDelete={handleDelete}
      />
    </div>
  );

  // Render Site Modal
  const renderModal = () => {
    if (!showModal) return null;

    return (
      <Modal title={editItem ? 'Edit UNESCO Site' : 'Add UNESCO Site'} onClose={closeModal} size="large">
        <form onSubmit={handleSiteSubmit} className="manager-form">
          <div className="form-row">
            <div className="form-group">
              <label>Name (EN) *</label>
              <input value={formData.name_en || ''} onChange={(e) => setFormData({...formData, name_en: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Name (AR)</label>
              <input value={formData.name_ar || ''} onChange={(e) => setFormData({...formData, name_ar: e.target.value})} dir="rtl" />
            </div>
          </div>
          <div className="form-group">
            <label>Year Inscribed</label>
            <input value={formData.year_inscribed || ''} onChange={(e) => setFormData({...formData, year_inscribed: e.target.value})} placeholder="Inscribed 1982" />
          </div>
          <ImageUpload 
            label="Site Image"
            value={formData.image}
            onChange={(value) => setFormData({...formData, image: value})}
          />
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
        {activeTab === 'sites' && renderSitesTab()}
      </div>

      {renderModal()}
    </div>
  );
};

export default UnescoManager;
