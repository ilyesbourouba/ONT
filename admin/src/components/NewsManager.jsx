import { useState, useEffect } from 'react';
import { newsAPI } from '../services/api';
import DataTable from './DataTable';
import Modal from './Modal';
import './Manager.css';

const NewsManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
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
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        await newsAPI.update(editItem.id, formData);
      } else {
        await newsAPI.create(formData);
      }
      fetchItems();
      closeModal();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await newsAPI.delete(id);
        fetchItems();
      } catch (error) {
        alert(error.message);
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
    { key: 'likes', label: 'Likes' },
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
        <Modal title={editItem ? 'Edit News' : 'Add News'} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="manager-form">
            <div className="form-row">
              <div className="form-group">
                <label>Title (English)</label>
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
                <textarea value={formData.excerpt_en} onChange={(e) => setFormData({...formData, excerpt_en: e.target.value})} rows="2" />
              </div>
              <div className="form-group">
                <label>Excerpt (Arabic)</label>
                <textarea value={formData.excerpt_ar} onChange={(e) => setFormData({...formData, excerpt_ar: e.target.value})} rows="2" dir="rtl" />
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
                <input value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} />
              </div>
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} />
            </div>
            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
              <button type="submit" className="submit-btn">{editItem ? 'Update' : 'Create'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default NewsManager;
