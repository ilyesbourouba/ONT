import { useState, useRef, useEffect } from 'react';
import './ImageUpload.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper to get full image URL
const getFullImageUrl = (url) => {
  if (!url) return '';
  // If it's already a full URL or base64, return as-is
  if (url.startsWith('http') || url.startsWith('data:')) {
    return url;
  }
  // If it's a relative path like /uploads/..., prepend API base URL
  if (url.startsWith('/')) {
    return `${API_BASE_URL}${url}`;
  }
  return url;
};

const ImageUpload = ({ value, onChange, label = 'Image' }) => {
  const [preview, setPreview] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  // Update preview when value changes (for edit mode)
  useEffect(() => {
    setPreview(getFullImageUrl(value || ''));
  }, [value]);

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setPreview(url);
    onChange(url);
  };

  const handleRemove = () => {
    setPreview('');
    onChange('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  // Get display URL for the input field (show relative path, not full URL)
  const getDisplayUrl = () => {
    if (!preview) return '';
    if (preview.startsWith('data:')) return '';
    if (preview.startsWith(API_BASE_URL)) {
      return preview.replace(API_BASE_URL, '');
    }
    return preview;
  };

  return (
    <div className="image-upload">
      <label className="image-upload-label">{label}</label>
      
      <div 
        className={`upload-zone ${dragActive ? 'drag-active' : ''} ${preview ? 'has-preview' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !preview && inputRef.current?.click()}
      >
        {preview ? (
          <div className="preview-container">
            <img src={preview} alt="Preview" className="image-preview" />
            <button type="button" className="remove-btn" onClick={handleRemove}>
              ✕
            </button>
          </div>
        ) : (
          <div className="upload-placeholder">
            <span className="upload-icon">📷</span>
            <p>Drag & drop an image here or click to browse</p>
            <span className="upload-hint">Supports: JPG, PNG, GIF, WebP</span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          style={{ display: 'none' }}
        />
      </div>

      <div className="url-input-wrapper">
        <span className="url-label">Or paste image URL:</span>
        <input
          type="url"
          placeholder="https://example.com/image.jpg"
          value={getDisplayUrl()}
          onChange={handleUrlChange}
          className="url-input"
        />
      </div>
    </div>
  );
};

export default ImageUpload;
