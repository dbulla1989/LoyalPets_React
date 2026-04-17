import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "../styles/Titulo.css";

function Titulo({ pageTitle }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("User"));
  const username = pathname.toLowerCase().includes("company")
    ? user.legalRepresentative
    : user.names.split(" ")[0] + " " + user.surnames.split(" ")[0];

  const handleAvatarClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleChangePassword = () => {
    alert("Redirigiendo a cambiar contraseña...");
    setIsModalOpen(false);
  };

  const handleChangeUpdateData = () => {
    alert("Redirigiendo a la pagina para actualizar los datos...");
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    const sesionPath = pathname.toLowerCase().includes("company")
      ? "/Company/Login"
      : "/Person/Login";

    alert("Sesión cerrada.");
    setIsModalOpen(false);
    navigate(sesionPath);
  };

  return (
    <header className="header">
      <div className="logo">
        <img src="../../../../src/assets/icon.png" />
      </div>

      <div className="page-title">{pageTitle}</div>

      <div className="user-info">
        <FaUserCircle className="avatar-icon" onClick={handleAvatarClick} />
        <span className="username">{username}</span>

        {isModalOpen && (
          <div className="modal">
            <button onClick={handleChangeUpdateData}>Actualizar Datos</button>
            <button onClick={handleChangePassword}>Cambiar Contraseña</button>
            <button onClick={handleLogout}>Cerrar Sesión</button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Titulo;
