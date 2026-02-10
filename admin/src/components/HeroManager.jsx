import { useState, useEffect } from 'react';
import { heroAPI, uploadAPI } from '../services/api';
import DataTable from './DataTable';
import Modal from './Modal';
import ImageUpload from './ImageUpload';
import { showSuccess, showError, confirmDelete } from '../utils/toast';
import './Manager.css';

const HeroManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    headline_en: '', headline_ar: '', subtitle_en: '', subtitle_ar: '',
    button_text_en: '', button_text_ar: '', button_link: '', image: '',
    display_order: 0, is_active: true
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await heroAPI.getAll();
      setItems(response.data || []);
    } catch (error) {
      showError('Failed to fetch hero slides: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let dataToSave = { ...formData };
      
      // If image is base64, upload it first and get the URL
      if (formData.image && formData.image.startsWith('data:image/')) {
        const uploadResult = await uploadAPI.uploadBase64(formData.image);
        if (uploadResult.success) {
          dataToSave.image = uploadResult.data.url;
        }
      }
      
      if (editItem) {
        await heroAPI.update(editItem.id, dataToSave);
        showSuccess('Hero slide updated successfully!');
      } else {
        await heroAPI.create(dataToSave);
        showSuccess('Hero slide created successfully!');
      }
      fetchItems();
      closeModal();
    } catch (error) {
      showError(error.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmDelete('this hero slide');
    if (confirmed) {
      try {
        await heroAPI.delete(id);
        showSuccess('Hero slide deleted successfully!');
        fetchItems();
      } catch (error) {
        showError(error.message || 'Failed to delete');
      }
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditItem(item);
      setFormData({
        headline_en: item.headline_en || '',
        headline_ar: item.headline_ar || '',
        subtitle_en: item.subtitle_en || '',
        subtitle_ar: item.subtitle_ar || '',
        button_text_en: item.button_text_en || '',
        button_text_ar: item.button_text_ar || '',
        button_link: item.button_link || '',
        image: item.image || '',
        display_order: item.display_order || 0,
        is_active: item.is_active !== undefined ? item.is_active : true
      });
    } else {
      setEditItem(null);
      setFormData({
        headline_en: '', headline_ar: '', subtitle_en: '', subtitle_ar: '',
        button_text_en: '', button_text_ar: '', button_link: '', image: '',
        display_order: 0, is_active: true
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditItem(null);
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'headline_en', label: 'Headline (EN)' },
    { key: 'display_order', label: 'Order' },
    { 
      key: 'is_active', 
      label: 'Status',
      render: (value) => (
        <span className={`status-badge ${value ? 'active' : 'inactive'}`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    },
  ];

  return (
    <div className="manager">
      <div className="manager-header">
        <button className="add-btn" onClick={() => openModal()}>+ Add Hero Slide</button>
      </div>

      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        onEdit={openModal}
        onDelete={handleDelete}
      />

      {showModal && (
        <Modal title={editItem ? 'Edit Hero Slide' : 'Add Hero Slide'} onClose={closeModal} size="large">
          <form onSubmit={handleSubmit} className="manager-form">
            <div className="form-row">
              <div className="form-group">
                <label>Headline (English) *</label>
                <input 
                  value={formData.headline_en} 
                  onChange={(e) => setFormData({...formData, headline_en: e.target.value})} 
                  required 
                  placeholder="Welcome to Algeria"
                />
              </div>
              <div className="form-group">
                <label>Headline (Arabic)</label>
                <input 
                  value={formData.headline_ar} 
                  onChange={(e) => setFormData({...formData, headline_ar: e.target.value})} 
                  dir="rtl" 
                  placeholder="مرحبا بكم في الجزائر"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Subtitle (English)</label>
                <textarea 
                  value={formData.subtitle_en} 
                  onChange={(e) => setFormData({...formData, subtitle_en: e.target.value})} 
                  rows="2" 
                  placeholder="Discover the beauty of Algeria..." 
                />
              </div>
              <div className="form-group">
                <label>Subtitle (Arabic)</label>
                <textarea 
                  value={formData.subtitle_ar} 
                  onChange={(e) => setFormData({...formData, subtitle_ar: e.target.value})} 
                  rows="2" 
                  dir="rtl" 
                  placeholder="اكتشف جمال الجزائر..." 
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Button Text (English)</label>
                <input 
                  value={formData.button_text_en} 
                  onChange={(e) => setFormData({...formData, button_text_en: e.target.value})} 
                  placeholder="Explore Now"
                />
              </div>
              <div className="form-group">
                <label>Button Text (Arabic)</label>
                <input 
                  value={formData.button_text_ar} 
                  onChange={(e) => setFormData({...formData, button_text_ar: e.target.value})} 
                  dir="rtl" 
                  placeholder="استكشف الآن"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Button Link (URL)</label>
                <input 
                  type="url"
                  value={formData.button_link} 
                  onChange={(e) => setFormData({...formData, button_link: e.target.value})} 
                  placeholder="https://example.com/page"
                />
              </div>
              <div className="form-group">
                <label>Display Order</label>
                <input 
                  type="number"
                  value={formData.display_order} 
                  onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value) || 0})} 
                  min="0"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  />
                  <span>Active (visible on website)</span>
                </label>
              </div>
            </div>
            <ImageUpload 
              label="Hero Image"
              value={formData.image}
              onChange={(value) => setFormData({...formData, image: value})}
            />
            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={closeModal} disabled={submitting}>Cancel</button>
              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? 'Saving...' : (editItem ? 'Update' : 'Create')}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default HeroManager;
