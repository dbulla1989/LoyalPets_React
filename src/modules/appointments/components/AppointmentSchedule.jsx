import React, { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BigCalendar from "../../calendars/components/BigCalendar";
import Menu from "../../layout/components/Menu";
import Titulo from "../../layout/components/Titulo";
import apiService from "../../core/resources/GlobalResource";
import GoogleMapsModal from "../../maps/components/GoogleMapsModal";
import AlertNotification from "../../alertNotification/components/AlertNotification";
import { FaBars } from "react-icons/fa";
import "../styles/AppointmentSchedule.css";

export default function AppointmentSchedule() {
  const user = JSON.parse(localStorage.getItem("User"));

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");

  const [veterinary, setVeterinary] = useState({});
  const [offerings, setOfferings] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [selectedOfferigId, setSelectedOfferigId] = useState("");
  const [selectedTimestamp, setSelectedTimestamp] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const pet = location.state?.pet;

  const toggleSidebar = () => setSidebarOpen((open) => !open);

  const [formData, setFormData] = useState({
    personId: user.personId,
    veterinaryId: "",
    offeringId: "",
    petId: pet.id,
    startDate: "",
    endDate: "",
    status: "active",
  });

  const fetchServices = async (id) => {
    const response = await apiService.get(`api/veterinary/${id}/offerings`);
    return response.data;
  };

  const fetchAvailabilities = async (id) => {
    const response = await apiService.get(
      `api/veterinary/${id}/availabilities`,
    );
    return response.data;
  };

  const fetchAppointments = async (id) => {
    const response = await apiService.get(`api/veterinary/${id}/appointments`);
    return response.data;
  };

  const isFormValid =
    formData.veterinaryId &&
    formData.offeringId &&
    formData.startDate &&
    formData.endDate;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) return;

    try {
      const response = await apiService.post("api/appointment", formData);

      if (response.status === 200) {
        setModalMessage("¡Cita registrada exitosamente!");
        setModalType("success");
      }

      if (response.status === 500) {
        setModalMessage(
          "¡Se ha generado un error al momento de registrar la cita!",
        );
        setModalType("error");
      }

      setModalOpen(true);
    } catch (err) {
      setModalMessage("Error al momento de registrar la cita");
      setModalType("error");
      setModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);

    if (modalType === "success") {
      navigate("/Person/Home");
    }
  };

  const handleSelectDateTime = (data) => {
    // Cuando solo selecciona el día
    if (!data?.label) return;

    // Cuando selecciona una hora
    setSelectedTimestamp(data.label);

    setFormData((prev) => ({
      ...prev,
      startDate: data.start,
      endDate: data.end,
    }));

    setShowCalendarModal(false);
  };

  const handleConfirmLocation = useCallback(async (location) => {
    if (location) {
      setVeterinary(location);

      const serviceData = await fetchServices(location.id);
      const availabilityData = await fetchAvailabilities(location.id);
      const appointmentData = await fetchAppointments(location.id);

      setOfferings(serviceData);
      setAvailabilities(availabilityData);
      setAppointments(appointmentData);

      setSelectedOfferigId("");
      setSelectedTimestamp("");

      setFormData((prev) => ({
        ...prev,
        veterinaryId: location.id,
        offeringId: "",
        startDate: "",
        endDate: "",
      }));
    }

    setShowMapModal(false);
  }, []);

  const handleChangeService = (e) => {
    const offeringId = e.target.value;

    setSelectedOfferigId(offeringId);

    setSelectedTimestamp("");

    setFormData((prev) => ({
      ...prev,
      offeringId,
      startDate: "",
      endDate: "",
    }));
  };

  if (!pet) return <div>No se seleccionó una mascota.</div>;

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
          <Titulo pageTitle="Agendar Cita Veterinaria" />
        </header>

        <main className="main-content">
          <form className="appointment-form" onSubmit={handleSubmit}>
            {/* Mascota */}
            <h3>Mascota Seleccionada</h3>

            <div className="form-group">
              <input
                type="text"
                value={pet.name}
                readOnly
                className="input-readonly"
              />
            </div>

            {/* Veterinaria */}
            <h3>Veterinaria Seleccionada</h3>

            <div className="form-group">
              <div className="sub-container">
                <input
                  type="text"
                  value={veterinary.name || ""}
                  readOnly
                  className="input-readonly"
                  placeholder="Selecciona en el mapa..."
                />

                <button
                  type="button"
                  className="icon-action-button"
                  onClick={() => setShowMapModal(true)}
                >
                  📍
                </button>
              </div>
            </div>

            {/* Servicio */}
            {formData.veterinaryId && (
              <>
                <h3>Servicio Seleccionado</h3>

                <div className="form-group">
                  <select
                    value={selectedOfferigId}
                    onChange={handleChangeService}
                    required
                  >
                    <option value="">Selecciona un servicio</option>

                    {offerings.map((item) => (
                      <option key={item.offeringId} value={item.offeringId}>
                        {item.offering.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Fecha y Hora */}
            {formData.offeringId && (
              <>
                <h3>Fecha y Hora Seleccionada</h3>

                <div className="form-group">
                  <div className="sub-container">
                    <input
                      type="text"
                      value={selectedTimestamp}
                      readOnly
                      className="input-readonly"
                      placeholder="Selecciona fecha y hora"
                    />

                    <button
                      type="button"
                      className="icon-action-button"
                      onClick={() => setShowCalendarModal(true)}
                    >
                      📅
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Botón */}
            <button
              className="submit-btn"
              type="submit"
              disabled={!isFormValid}
            >
              Agendar Cita
            </button>
          </form>
        </main>
      </div>

      <BigCalendar
        open={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        availabilities={availabilities}
        offerings={offerings}
        appointments={appointments}
        selectedOfferingId={selectedOfferigId}
        onSelectDateTime={handleSelectDateTime}
      />

      <GoogleMapsModal
        open={showMapModal}
        mode="select-existing"
        apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        onClose={() => setShowMapModal(false)}
        onConfirm={handleConfirmLocation}
      />

      <AlertNotification
        isOpen={modalOpen}
        message={modalMessage}
        type={modalType}
        onClose={handleModalClose}
      />
    </div>
  );
}
