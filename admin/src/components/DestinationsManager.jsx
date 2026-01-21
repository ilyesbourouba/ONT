import { useState, useEffect } from 'react';
import { destinationsAPI } from '../services/api';
import DataTable from './DataTable';
import Modal from './Modal';
import './Manager.css';

const DestinationsManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    name_en: '', name_ar: '', image: '', description_en: '', description_ar: ''
  });

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try { const response = await destinationsAPI.getAll(); setItems(response.data || []); }
    catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) { await destinationsAPI.update(editItem.id, formData); }
      else { await destinationsAPI.create(formData); }
      fetchItems(); closeModal();
    } catch (error) { alert(error.message); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this destination?')) {
      try { await destinationsAPI.delete(id); fetchItems(); }
      catch (error) { alert(error.message); }
    }
  };

  const openModal = (item = null) => {
    if (item) { setEditItem(item); setFormData(item); }
    else { setEditItem(null); setFormData({ name_en: '', name_ar: '', image: '', description_en: '', description_ar: '' }); }
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditItem(null); };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name_en', label: 'Name (EN)' },
  ];

  return (
    <div className="manager">
      <div className="manager-header"><button className="add-btn" onClick={() => openModal()}>+ Add Destination</button></div>
      <DataTable columns={columns} data={items} loading={loading} onEdit={openModal} onDelete={handleDelete} />
      {showModal && (
        <Modal title={editItem ? 'Edit Destination' : 'Add Destination'} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="manager-form">
            <div className="form-row">
              <div className="form-group"><label>Name (EN)</label><input value={formData.name_en} onChange={(e) => setFormData({...formData, name_en: e.target.value})} required /></div>
              <div className="form-group"><label>Name (AR)</label><input value={formData.name_ar} onChange={(e) => setFormData({...formData, name_ar: e.target.value})} dir="rtl" /></div>
            </div>
            <div className="form-group"><label>Image URL</label><input value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} /></div>
            <div className="form-row">
              <div className="form-group"><label>Description (EN)</label><textarea value={formData.description_en} onChange={(e) => setFormData({...formData, description_en: e.target.value})} rows="3" /></div>
              <div className="form-group"><label>Description (AR)</label><textarea value={formData.description_ar} onChange={(e) => setFormData({...formData, description_ar: e.target.value})} rows="3" dir="rtl" /></div>
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

export default DestinationsManager;
