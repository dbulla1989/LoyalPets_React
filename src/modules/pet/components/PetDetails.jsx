import React, { useEffect, useState } from "react";
import Menu from "../../layout/components/Menu";
import Titulo from "../../layout/components/Titulo";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaEdit,
  FaCalendarPlus,
  FaSyncAlt,
  FaTimes,
  FaBars,
  FaUsers,
  FaClock,
  FaClipboardList,
} from "react-icons/fa";
import "../styles/PetDetails.css";

const PetDetails = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen((open) => !open);
  const location = useLocation();
  const navigate = useNavigate();
  const pet = location.state?.pet;

  if (!pet) return <div>No se encontraron datos de la mascota</div>;

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
          <Titulo pageTitle="Detalle Mascota" />
        </header>
        <div className="pet-details-container">
          {/* Columna 1: Info */}
          <div className="column-info">
            <div className="pet-header">
              <img src={pet.photo} alt={pet.name} className="pet-photo" />
            </div>
            <div className="pet-data">
              <h3>{pet.name}</h3>
              <p>
                <strong>Tipo:</strong> {pet.animalType}
              </p>
              <p>
                <strong>Raza:</strong> {pet.breed}
              </p>
              <button className="btn-modify">Modificar</button>
            </div>
          </div>

          {/* Columna 2: Tabla de Citas */}
          <div className="column-appointments">
            <div className="filters"> {/* Filtros aquí */} </div>
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Servicio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {/* Map de citas */}
                <tr>
                  <td>2026-05-10</td>
                  <td>Consulta</td>
                  <td>
                    <button>
                      <FaSyncAlt />
                    </button>
                    <button>
                      <FaTimes />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Botón Flotante */}
            <button
              className="fab"
              data-tooltip="Agendar Cita"
              onClick={() => navigate('/Person/Appointment/Register', { state: { pet } })}
            >
              <FaCalendarPlus />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetails;
