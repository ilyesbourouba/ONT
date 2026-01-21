import { useState, useEffect } from 'react';
import { virtualToursAPI } from '../services/api';
import DataTable from './DataTable';
import Modal from './Modal';
import './Manager.css';

const VirtualToursManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    tour_id: '', title_en: '', title_ar: '', description_en: '', description_ar: '', tags: '', image: '', cta_en: '', cta_ar: ''
  });

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try { const response = await virtualToursAPI.getAll(); setItems(response.data || []); }
    catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...formData, tags: formData.tags.split(',').map(t => t.trim()).filter(t => t) };
    try {
      if (editItem) { await virtualToursAPI.update(editItem.id, data); }
      else { await virtualToursAPI.create(data); }
      fetchItems(); closeModal();
    } catch (error) { alert(error.message); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this virtual tour?')) {
      try { await virtualToursAPI.delete(id); fetchItems(); }
      catch (error) { alert(error.message); }
    }
  };

  const openModal = (item = null) => {
    if (item) { setEditItem(item); setFormData({ ...item, tags: (item.tags || []).join(', ') }); }
    else { setEditItem(null); setFormData({ tour_id: '', title_en: '', title_ar: '', description_en: '', description_ar: '', tags: '', image: '', cta_en: '', cta_ar: '' }); }
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditItem(null); };

  const columns = [
    { key: 'tour_id', label: 'Tour ID' },
    { key: 'title_en', label: 'Title (EN)' },
  ];

  return (
    <div className="manager">
      <div className="manager-header"><button className="add-btn" onClick={() => openModal()}>+ Add Virtual Tour</button></div>
      <DataTable columns={columns} data={items} loading={loading} onEdit={openModal} onDelete={handleDelete} />
      {showModal && (
        <Modal title={editItem ? 'Edit Virtual Tour' : 'Add Virtual Tour'} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="manager-form">
            <div className="form-row">
              <div className="form-group"><label>Tour ID</label><input value={formData.tour_id} onChange={(e) => setFormData({...formData, tour_id: e.target.value})} placeholder="01" required /></div>
              <div className="form-group"><label>Tags (comma separated)</label><input value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Title (EN)</label><input value={formData.title_en} onChange={(e) => setFormData({...formData, title_en: e.target.value})} required /></div>
              <div className="form-group"><label>Title (AR)</label><input value={formData.title_ar} onChange={(e) => setFormData({...formData, title_ar: e.target.value})} dir="rtl" /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Description (EN)</label><textarea value={formData.description_en} onChange={(e) => setFormData({...formData, description_en: e.target.value})} rows="2" /></div>
              <div className="form-group"><label>Description (AR)</label><textarea value={formData.description_ar} onChange={(e) => setFormData({...formData, description_ar: e.target.value})} rows="2" dir="rtl" /></div>
            </div>
            <div className="form-group"><label>Image URL</label><input value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} /></div>
            <div className="form-row">
              <div className="form-group"><label>CTA (EN)</label><input value={formData.cta_en} onChange={(e) => setFormData({...formData, cta_en: e.target.value})} placeholder="Enter Virtual Tour" /></div>
              <div className="form-group"><label>CTA (AR)</label><input value={formData.cta_ar} onChange={(e) => setFormData({...formData, cta_ar: e.target.value})} dir="rtl" /></div>
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

export default VirtualToursManager;
