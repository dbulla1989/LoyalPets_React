import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginModal.css";

function LoginPageModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handlePersonLogin = () => {
    navigate("/Person/Login");
    onClose();
  };

  const handleCompanyLogin = () => {
    navigate("/Company/Login");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <h2>¿Qué tipo de usuario eres?</h2>
        <div className="login-options">
          <button onClick={handlePersonLogin} className="login-option-btn person">
            Iniciar sesión como persona
          </button>
          <button onClick={handleCompanyLogin} className="login-option-btn company">
            Iniciar sesión como veterinaria
          </button>
        </div>
        <button onClick={onClose} className="login-modal-close">
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default LoginPageModal;
