import { useState, useEffect } from 'react';
import { aboutAPI, uploadAPI } from '../services/api';
import DataTable from './DataTable';
import Modal from './Modal';
import ImageUpload from './ImageUpload';
import { showSuccess, showError, confirmDelete } from '../utils/toast';
import './Manager.css';
import './AboutManager.css';

/**
 * AboutSectionManager - Manages the landing page About section
 * - Main content (tagline, headline, description, CTA)
 * - Missions list
 * - Stats (landing type only)
 * - Images
 */
const AboutSectionManager = () => {
  const [activeTab, setActiveTab] = useState('content');
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [content, setContent] = useState({});
  const [missions, setMissions] = useState([]);
  const [stats, setStats] = useState([]);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({});

  const tabs = [
    { id: 'content', label: 'Main Content', icon: '📝' },
    { id: 'missions', label: 'Missions', icon: '🎯' },
    { id: 'stats', label: 'Statistics', icon: '📊' },
  ];

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [contentRes, missionsRes, statsRes] = await Promise.all([
        aboutAPI.getContent(),
        aboutAPI.getMissions(),
        aboutAPI.getStats('landing')
      ]);
      setContent(contentRes.data || {});
      setMissions(missionsRes.data || []);
      setStats(statsRes.data || []);
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
      let dataToSave = { ...content };
      
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

  // CRUD Handlers
  const handleCreate = async (type) => {
    setSubmitting(true);
    try {
      if (type === 'missions') {
        await aboutAPI.createMission(formData);
      } else if (type === 'stats') {
        await aboutAPI.createStat({ ...formData, stat_type: 'landing' });
      }
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
      if (type === 'missions') {
        await aboutAPI.updateMission(id, formData);
      } else if (type === 'stats') {
        await aboutAPI.updateStat(id, formData);
      }
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
        if (type === 'missions') {
          await aboutAPI.deleteMission(id);
        } else if (type === 'stats') {
          await aboutAPI.deleteStat(id);
        }
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
        missions: { mission_en: '', mission_ar: '', display_order: 0 },
        stats: { value_en: '', value_ar: '', label_en: '', label_ar: '', stat_type: 'landing', display_order: 0 },
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
        <h3>🏠 Landing Page About Section</h3>
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
        <h3>🖼️ Section Images</h3>
        <div className="form-row">
          <ImageUpload label="Image 1" value={content.image1 || ''} onChange={(v) => setContent({...content, image1: v})} />
          <ImageUpload label="Image 2" value={content.image2 || ''} onChange={(v) => setContent({...content, image2: v})} />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-btn" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Content'}
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
          { key: 'mission_ar', label: 'Mission (AR)' },
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
                <input value={formData.value_ar || ''} onChange={(e) => setFormData({...formData, value_ar: e.target.value})} dir="rtl" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Label (EN)</label>
                <input value={formData.label_en || ''} onChange={(e) => setFormData({...formData, label_en: e.target.value})} placeholder="Annual Visitors" />
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
        {activeTab === 'missions' && renderMissionsTab()}
        {activeTab === 'stats' && renderStatsTab()}
      </div>

      {renderModal()}
    </div>
  );
};

export default AboutSectionManager;
