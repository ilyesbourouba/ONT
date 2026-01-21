import { useState, useEffect } from 'react';
import { contactAPI } from '../services/api';
import DataTable from './DataTable';
import Modal from './Modal';
import './Manager.css';

const ContactManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try { const response = await contactAPI.getAll(1, 100); setItems(response.data || []); }
    catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this contact submission?')) {
      try { await contactAPI.delete(id); fetchItems(); }
      catch (error) { alert(error.message); }
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'subject', label: 'Subject' },
    { key: 'created_at', label: 'Date', render: (val) => new Date(val).toLocaleDateString() },
  ];

  return (
    <div className="manager">
      <DataTable 
        columns={columns} 
        data={items} 
        loading={loading} 
        onEdit={(item) => setSelectedItem(item)} 
        onDelete={handleDelete} 
      />
      {selectedItem && (
        <Modal title="Contact Details" onClose={() => setSelectedItem(null)}>
          <div className="contact-details">
            <p><strong>Name:</strong> {selectedItem.name}</p>
            <p><strong>Email:</strong> {selectedItem.email}</p>
            <p><strong>Phone:</strong> {selectedItem.phone || 'N/A'}</p>
            <p><strong>Subject:</strong> {selectedItem.subject || 'N/A'}</p>
            <p><strong>Message:</strong></p>
            <div className="message-box">{selectedItem.message}</div>
            <p><strong>Received:</strong> {new Date(selectedItem.created_at).toLocaleString()}</p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ContactManager;
