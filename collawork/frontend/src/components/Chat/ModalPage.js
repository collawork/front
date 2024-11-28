import React from 'react';
import '../assest/css/Modal.css';

const ModalPage = ({ onClose, children }) => {

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    <div className="chat-modal-overlay" onClick={handleOverlayClick}>
        <button className='close-button' onClick={onClose}>x</button>
        {children}
      </div>
  );
};

export default ModalPage;