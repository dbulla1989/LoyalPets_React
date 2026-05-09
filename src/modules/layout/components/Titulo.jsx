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

  const rolePath = pathname.toLowerCase().includes("company")
    ? "Company"
    : "Person";

  const handleChangePassword = () => {
    setIsModalOpen(false);
    navigate(`/${rolePath}/ResetPassword`);
  };

  const handleChangeUpdateData = () => {
    setIsModalOpen(false);
    navigate(`/${rolePath}/Modify`);
  };

  const handleLogout = () => {
    // const sesionPath = pathname.toLowerCase().includes("company")
    //   ? "/Company/Login"
    //   : "/Person/Login";

    alert("Sesión cerrada.");
    setIsModalOpen(false);
    navigate(`/${rolePath}/Login`);
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
