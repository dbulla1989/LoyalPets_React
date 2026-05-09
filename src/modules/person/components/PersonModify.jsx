import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Menu from "../../layout/components/Menu";
import Titulo from "../../layout/components/Titulo";
import {
  FaBars,
  FaCalendarPlus,
  FaUsers,
  FaClock,
  FaClipboardList,
  FaPaw,
} from "react-icons/fa";
import apiService from "../../core/resources/GlobalResource";
import AlertNotification from "../../alertNotification/components/AlertNotification";
import "../styles/PersonModify.css";

export default function PersonModify({ initialData }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("User"));
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");
  const toggleSidebar = () => setSidebarOpen((open) => !open);
  const [formData, setFormData] = useState({
    documentType: user?.documentType || "",
    documentNumber: user?.documentNumber || "",
    names: user?.names || "",
    surnames: user?.surnames || "",
    cellPhone: user?.cellPhone || "",
    email: user?.email || "",
    userRequest: {
      username: user?.email || "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeEmail = (e) => {
    const { value } = e.target;

    setFormData((prev) => ({
      ...prev,
      email: value,
      userRequest: {
        ...prev.userRequest,
        username: value,
      },
    }));
  };

  const handleModalClose = () => {
    setModalOpen(false);

    if (modalType === "success") {
      navigate("/Person/Home");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
      const response = await apiService.put("api/person", formData);
      console.log(response);
      if (response.status === 200) {
        const updatedUser = {
          ...user,
          ...formData,
        };

        localStorage.setItem("User", JSON.stringify(updatedUser));

        setModalMessage("¡Datos de usuario actualizados exitosamente!");
        setModalType("success");
      }

      if (response.status === 500) {
        setModalMessage(
          "¡Se ha generado un error al momento de actualizar los datos de usuario!",
        );
        setModalType("error");
      }
      setModalOpen(true);
    } catch (err) {
      setError(err.message || "Error al momento de registrar el usuario");
    }
  };

  return (
    <div className="layout">
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="top-section">
          <button className="toggle-button" onClick={toggleSidebar}>
            <FaBars />
          </button>
        </div>
        <Menu isOpen={sidebarOpen} />
      </aside>
      <div className="content-area">
        <header className="header">
          <Titulo pageTitle="Actualizar Datos" />
        </header>
        <main className="main-content">
          <form className="user-profile-form" onSubmit={handleSubmit}>
            <div className="row-two-columns">
              <div className="form-group">
                <label>Tipo de documento</label>
                <input
                  type="text"
                  name="documentType"
                  value={formData.documentType}
                  readOnly
                  className="input-readonly"
                />
              </div>

              <div className="form-group">
                <label>Número de documento</label>
                <input
                  type="text"
                  name="documentNumber"
                  value={formData.documentNumber}
                  readOnly
                  className="input-readonly"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Nombres</label>
              <input
                type="text"
                name="names"
                value={formData.names}
                onChange={handleChange}
                placeholder="Ingresa tus nombres"
                required
              />
            </div>

            <div className="form-group">
              <label>Apellidos</label>
              <input
                type="text"
                name="surnames"
                value={formData.surnames}
                onChange={handleChange}
                placeholder="Ingresa tus apellidos"
                required
              />
            </div>

            <div className="form-group">
              <label>Celular</label>
              <input
                type="tel"
                name="cellPhone"
                value={formData.cellPhone}
                onChange={handleChange}
                placeholder="Ingresa tu celular"
              />
            </div>

            <div className="form-group">
              <label>Correo electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChangeEmail}
                placeholder="Ingresa tu correo"
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              Guardar cambios
            </button>
          </form>
        </main>
      </div>

      <AlertNotification
        isOpen={modalOpen}
        message={modalMessage}
        type={modalType}
        onClose={handleModalClose}
      />
    </div>
  );
}
