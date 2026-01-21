import { useState, useEffect } from 'react';
import { destinationsAPI, uploadAPI } from '../services/api';
import DataTable from './DataTable';
import Modal from './Modal';
import ImageUpload from './ImageUpload';
import { showSuccess, showError, confirmDelete } from '../utils/toast';
import './Manager.css';

const DestinationsManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name_en: '', name_ar: '', image: '', description_en: '', description_ar: ''
  });

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try { 
      const response = await destinationsAPI.getAll(); 
      setItems(response.data || []); 
    }
    catch (error) { 
      showError('Failed to fetch destinations: ' + error.message);
    }
    finally { setLoading(false); }
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
        await destinationsAPI.update(editItem.id, dataToSave);
        showSuccess('Destination updated successfully!');
      }
      else { 
        await destinationsAPI.create(dataToSave);
        showSuccess('Destination created successfully!');
      }
      fetchItems(); closeModal();
    } catch (error) { 
      showError(error.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmDelete('this destination');
    if (confirmed) {
      try { 
        await destinationsAPI.delete(id); 
        showSuccess('Destination deleted successfully!');
        fetchItems(); 
      }
      catch (error) { showError(error.message || 'Failed to delete'); }
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
        <Modal title={editItem ? 'Edit Destination' : 'Add Destination'} onClose={closeModal} size="large">
          <form onSubmit={handleSubmit} className="manager-form">
            <div className="form-row">
              <div className="form-group"><label>Name (EN) *</label><input value={formData.name_en} onChange={(e) => setFormData({...formData, name_en: e.target.value})} required /></div>
              <div className="form-group"><label>Name (AR)</label><input value={formData.name_ar} onChange={(e) => setFormData({...formData, name_ar: e.target.value})} dir="rtl" /></div>
            </div>
            <ImageUpload 
              label="Destination Image"
              value={formData.image}
              onChange={(value) => setFormData({...formData, image: value})}
            />
            <div className="form-row">
              <div className="form-group"><label>Description (EN)</label><textarea value={formData.description_en} onChange={(e) => setFormData({...formData, description_en: e.target.value})} rows="3" /></div>
              <div className="form-group"><label>Description (AR)</label><textarea value={formData.description_ar} onChange={(e) => setFormData({...formData, description_ar: e.target.value})} rows="3" dir="rtl" /></div>
            </div>
            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={closeModal} disabled={submitting}>Cancel</button>
              <button type="submit" className="submit-btn" disabled={submitting}>{submitting ? 'Saving...' : (editItem ? 'Update' : 'Create')}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default DestinationsManager;
