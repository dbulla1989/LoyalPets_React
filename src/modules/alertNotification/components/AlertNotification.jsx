import React from "react";
import "../styles/AlertNotification.css"; 

export default function AlertNotification({ isOpen, message, type, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${type}`}>
        <p>{message}</p>
        <button onClick={onClose} className="modal-button">
          Cerrar
        </button>
      </div>
    </div>
  );
}
