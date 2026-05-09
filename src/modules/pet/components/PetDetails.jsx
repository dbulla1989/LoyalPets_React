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
} from "react-icons/fa";

import apiService from "../../core/resources/GlobalResource";

import "../styles/PetDetails.css";

const PetDetails = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => setSidebarOpen((open) => !open);

  const location = useLocation();
  const navigate = useNavigate();

  const pet = location.state?.pet;

  useEffect(() => {
    if (!pet?.id) return;

    const loadAppointments = async () => {
      try {
        setLoading(true);

        const appointmentData = await fetchAppointments();

        const enrichedAppointments = await Promise.all(
          appointmentData.map(async (element) => {
            try {
              const [veterinary, offering] = await Promise.all([
                fetchVeterinary(element.veterinaryId),
                fetchOffering(element.offeringId),
              ]);

              return {
                ...element,
                veterinary,
                offering,
              };
            } catch (error) {
              console.error("Error enriqueciendo cita:", error);

              return {
                ...element,
                veterinary: null,
                offering: null,
              };
            }
          }),
        );

        setAppointments(enrichedAppointments);
      } catch (error) {
        console.error("Error cargando citas:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, [pet?.id]);

  const fetchAppointments = async () => {
    const response = await apiService.get(`api/pet/${pet.id}/appointments`);

    return response.data.sort(
      (a, b) => new Date(b.startDate) - new Date(a.startDate),
    );
  };

  const fetchVeterinary = async (id) => {
    const response = await apiService.get(`api/veterinary/${id}`);

    return response.data[0] || null;
  };

  const fetchOffering = async (id) => {
    const response = await apiService.get(`api/offering/${id}`);

    return response.data[0] || null;
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("es-CO", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  };

  if (!pet) {
    return <div>No se encontraron datos de la mascota</div>;
  }

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
          {/* INFORMACIÓN */}
          <div className="column-info">
            <div className="pet-header">
              <div className="pet-photo-container">
                <img src={pet.photo} alt={pet.name} className="pet-photo" />
              </div>
            </div>

            <div className="pet-data">
              <h3>{pet.name}</h3>

              <p>
                <strong>Tipo:</strong> {pet.animalType}
              </p>

              <p>
                <strong>Raza:</strong> {pet.breed}
              </p>

              <button
                className="btn-modify"
                onClick={() =>
                  navigate("/Person/Pet/Modify", {
                    state: { pet },
                  })
                }
              >
                <FaEdit />
                Modificar
              </button>
            </div>
          </div>

          {/* CITAS */}
          <div className="column-appointments">
            <div className="appointments-header">
              <h3>Historial de Citas</h3>
            </div>

            <table className="appointments-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Especialidad</th>
                  <th>Veterinaria</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="empty-row">
                      Cargando citas...
                    </td>
                  </tr>
                ) : appointments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="empty-row">
                      No hay citas registradas
                    </td>
                  </tr>
                ) : (
                  appointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>{formatDate(appointment.startDate)}</td>

                      <td>
                        {appointment.offering?.name || "Sin especialidad"}
                      </td>

                      <td>
                        {appointment.veterinary?.name || "Sin veterinaria"}
                      </td>

                      <td>
                        <span className={`status-badge ${appointment.status}`}>
                          {appointment.status}
                        </span>
                      </td>

                      <td className="actions-column">
                        <button
                          className="icon-btn reschedule-btn"
                          title="Reagendar"
                        >
                          <FaSyncAlt />
                        </button>

                        <button
                          className="icon-btn cancel-btn"
                          title="Cancelar"
                        >
                          <FaTimes />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* BOTÓN FLOTANTE */}
            <button
              className="fab"
              data-tooltip="Agendar Cita"
              onClick={() =>
                navigate("/Person/Appointment/Register", {
                  state: { pet },
                })
              }
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
