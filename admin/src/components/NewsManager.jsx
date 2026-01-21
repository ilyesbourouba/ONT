import { useState, useEffect } from 'react';
import { newsAPI, uploadAPI } from '../services/api';
import DataTable from './DataTable';
import Modal from './Modal';
import ImageUpload from './ImageUpload';
import RichTextEditor from './RichTextEditor';
import { showSuccess, showError, confirmDelete } from '../utils/toast';
import './Manager.css';

const NewsManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title_en: '', title_ar: '', excerpt_en: '', excerpt_ar: '',
    content_en: '', content_ar: '', category: 'Tourism', image: '', author: ''
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await newsAPI.getAll(1, 50);
      setItems(response.data || []);
    } catch (error) {
      showError('Failed to fetch news: ' + error.message);
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
        await newsAPI.update(editItem.id, dataToSave);
        showSuccess('News updated successfully!');
      } else {
        await newsAPI.create(dataToSave);
        showSuccess('News created successfully!');
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
    const confirmed = await confirmDelete('this news article');
    if (confirmed) {
      try {
        await newsAPI.delete(id);
        showSuccess('News deleted successfully!');
        fetchItems();
      } catch (error) {
        showError(error.message || 'Failed to delete');
      }
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditItem(item);
      setFormData(item);
    } else {
      setEditItem(null);
      setFormData({
        title_en: '', title_ar: '', excerpt_en: '', excerpt_ar: '',
        content_en: '', content_ar: '', category: 'Tourism', image: '', author: ''
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
    { key: 'title_en', label: 'Title (EN)' },
    { key: 'category', label: 'Category' },
    { key: 'author', label: 'Author' },
  ];

  return (
    <div className="manager">
      <div className="manager-header">
        <button className="add-btn" onClick={() => openModal()}>+ Add News</button>
      </div>

      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        onEdit={openModal}
        onDelete={handleDelete}
      />

      {showModal && (
        <Modal title={editItem ? 'Edit News' : 'Add News'} onClose={closeModal} size="large">
          <form onSubmit={handleSubmit} className="manager-form">
            <div className="form-row">
              <div className="form-group">
                <label>Title (English) *</label>
                <input value={formData.title_en} onChange={(e) => setFormData({...formData, title_en: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Title (Arabic)</label>
                <input value={formData.title_ar} onChange={(e) => setFormData({...formData, title_ar: e.target.value})} dir="rtl" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Excerpt (English)</label>
                <textarea value={formData.excerpt_en} onChange={(e) => setFormData({...formData, excerpt_en: e.target.value})} rows="2" placeholder="Brief summary of the news..." />
              </div>
              <div className="form-group">
                <label>Excerpt (Arabic)</label>
                <textarea value={formData.excerpt_ar} onChange={(e) => setFormData({...formData, excerpt_ar: e.target.value})} rows="2" dir="rtl" placeholder="ملخص موجز للخبر..." />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Content (English)</label>
                <RichTextEditor 
                  value={formData.content_en} 
                  onChange={(value) => setFormData({...formData, content_en: value})} 
                  placeholder="Full news content..."
                />
              </div>
              <div className="form-group">
                <label>Content (Arabic)</label>
                <RichTextEditor 
                  value={formData.content_ar} 
                  onChange={(value) => setFormData({...formData, content_ar: value})} 
                  placeholder="المحتوى الكامل للخبر..."
                  dir="rtl"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  <option value="Institutional">Institutional</option>
                  <option value="Tourism">Tourism</option>
                  <option value="Events">Events</option>
                  <option value="Cultural">Cultural</option>
                </select>
              </div>
              <div className="form-group">
                <label>Author</label>
                <input value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} placeholder="Author name" />
              </div>
            </div>
            <ImageUpload 
              label="News Image"
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

export default NewsManager;
