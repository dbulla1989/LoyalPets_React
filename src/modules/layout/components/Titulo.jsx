import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "../styles/Titulo.css";

function Titulo({ pageTitle }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const person = JSON.parse(localStorage.getItem("Person"));
  const username =
    person.names.split(" ")[0] + " " + person.surnames.split(" ")[0];

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
    alert("Sesión cerrada.");
    setIsModalOpen(false);
    navigate("/Login");
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
