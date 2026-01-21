import './Manager.css';

const Modal = ({ title, children, onClose, size = 'default' }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal ${size === 'large' ? 'modal-large' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;

