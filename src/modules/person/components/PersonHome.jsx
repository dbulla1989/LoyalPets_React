import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Menu from "../../layout/components/Menu";
import Titulo from "../../layout/components/Titulo";
import { FaBars, FaCalendarPlus, FaUsers, FaClock, FaClipboardList } from "react-icons/fa";
import "../styles/PersonHome.css";

function HomePerson() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen((open) => !open);

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
          <Titulo pageTitle="Menú Principal" />
        </header>

        <main className="main-content">
          
          <div className="dashboard-cards">
            <div className="card">
              <FaClock className="card-icon" />
              <div>
                <h4>Citas hoy</h4>
                <p></p>
              </div>
            </div>

            <div className="card">
              <FaClipboardList className="card-icon" />
              <div>
                <h4>Pendientes</h4>
                <p></p>
              </div>
            </div>


          </div>

          <div className="quick-actions">
            <h3>Acciones rápidas</h3>
            <div className="actions-buttons">
              <button className="action-btn">
                <FaCalendarPlus /> Nueva cita
              </button>



              <button className="action-btn">
                <FaClipboardList /> Ver citas
              </button>
            </div>
          </div>

          {/* CITAS DEL DIA */}
          <div className="today-appointments">
            <h3>Citas de hoy</h3>
            <table>
              <thead>
                <tr>
                  <th>Hora</th>
                  <th>Cliente</th>
                  <th>Servicio</th>
                  <th>Estado</th>
                </tr>
              </thead>
            </table>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default HomePerson;
