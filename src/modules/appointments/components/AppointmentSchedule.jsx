import React, { useEffect, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BigCalendar from "../../calendars/components/BigCalendar";
import Menu from "../../layout/components/Menu";
import Titulo from "../../layout/components/Titulo";
import apiService from "../../core/resources/GlobalResource";
import GoogleMapsModal from "../../maps/components/GoogleMapsModal";
import AlertNotification from "../../alertNotification/components/AlertNotification";
import {
  FaBars,
  FaCalendarPlus,
  FaUsers,
  FaClock,
  FaClipboardList,
} from "react-icons/fa";

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
  const [timestampIso, setTimestampIso] = useState("");
  const [date, setDate] = useState(new Date());
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormData((pre) => ({
      ...pre,
      offeringId: selectedOfferigId,
    }));

    console.log(formData);
    try {
      const response = await apiService.post("api/appointment", formData);
      console.log(response);
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
      setError(err.message || "Error al momento de registrar la cita");
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);

    if (modalType === "success") {
      navigate("/Person/Home");
    }
  };

  const handleSelectDateTime = ({ iso, label, start, end }) => {
    setSelectedTimestamp(label);
    setTimestampIso(iso);
    setFormData((pre) => ({
      ...pre,
      startDate: start,
      endDate: end,
    }));
  };

  const handleConfirmLocation = useCallback(async (location) => {
    if (location) {
      setVeterinary(location);

      const serviceData = await fetchServices(location.id);
      const availabilityData = await fetchAvailabilities(location.id);
      const appointmentData = await fetchAppointments(location.id);
      setFormData((pre) => ({
        ...pre,
        veterinaryId: location.id,
      }));
      setOfferings(serviceData);
      setAvailabilities(availabilityData);
      setAppointments(appointmentData);
    }
    setShowMapModal(false);
  }, []);

  const handleChange = (e) => {
    console.log(e.target.value);
    setSelectedOfferigId(e.target.value);
    setFormData((pre) => ({
      ...pre,
      offeringId: e.target.value,
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
            <h3>Mascota Seleccionada</h3>
            <div className="form-group">
              <input
                type="text"
                value={pet.name}
                readOnly
                className="input-readonly"
              />
            </div>

            <h3>Veterinaria Seleccionada</h3>
            <div className="form-group">
              <input
                type="text"
                value={veterinary.name}
                readOnly
                className="input-readonly"
                placeholder="Selecciona en el mapa..."
              />
              <button
                type="button"
                onClick={() => setShowMapModal(true)}
                style={{ padding: "8px 12px", cursor: "pointer" }}
              >
                📍
              </button>
            </div>

            <h3>Servicio Seleccionado</h3>
            <div className="form-group">
              <select
                name="breedTypeId"
                value={selectedOfferigId}
                onChange={handleChange}
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

            <h3>Fecha y Hora Seleccionada</h3>
            <div className="form-group">
              <input
                type="text"
                name="timestamp"
                value={selectedTimestamp}
                readOnly
                className="input-readonly"
                placeholder="Selecciona fecha y hora"
              />
              <button
                type="button"
                onClick={() => {
                  console.log(appointments);
                  setShowCalendarModal(true);
                }}
                style={{ padding: "8px 12px", cursor: "pointer" }}
              >
                📅
              </button>
            </div>

            <button className="submit-btn" type="submit">
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
