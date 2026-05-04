import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "../../layout/components/Menu";
import Titulo from "../../layout/components/Titulo";
import { FaBars, FaPlus, FaMinus } from "react-icons/fa";
import ScheduleModal from "./ScheduleModal";
import OfferingModal from "./OfferingModal";
import apiService from "../../core/resources/GlobalResource";
import AlertNotification from "../../alertNotification/components/AlertNotification";
import GoogleMapsModal from "../../maps/components/GoogleMapsModal";
import "../styles/VeterinaryRegister.css";

function VeterinaryRegister() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("User"));
  const [formData, setFormData] = useState({
    companyId: user.companyId,
    name: "",
    address: "",
    neighborhood: "",
    latitude: 0.0,
    longitude: 0.0,
    officePhone: "",
    cellPhone: "",
    availabilities: [],
    offerings: [],
  });

  const [showMapModal, setShowMapModal] = useState(false);

  const handleConfirmLocation = useCallback((location) => {
    if (location) {
      setFormData((prev) => ({
        ...prev,
        address: location.address,
        latitude: location.lat,
        longitude: location.lng,
      }));
    }
    setShowMapModal(false);
  }, []); // Se ejecuta solo una vez al montar

  const [mapLocation, setMapLocation] = useState({
    lat: 0,
    lng: 0,
    address: "",
  });

  const initialOffering = {
    offeringId: "",
    name: "",
    description: "",
    duration: "",
    status: "active",
  };

  const [offering, setOffering] = useState(initialOffering);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");
  const toggleSidebar = () => setSidebarOpen((open) => !open);
  const isOfficePhoneValid = formData.officePhone.length === 10;
  const isCellPhoneValid = formData.cellPhone.length === 10;

  const weekDays = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  const [step, setStep] = useState(1);
  const [schedules, setSchedules] = useState([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [scheduleError, setScheduleError] = useState("");

  const openScheduleModal = () => {
    setSelectedDays([]);
    setStartTime("");
    setEndTime("");
    setScheduleError("");
    setShowScheduleModal(true);
  };

  const closeScheduleModal = () => {
    setShowScheduleModal(false);
    setSelectedDays([]);
    setStartTime("");
    setEndTime("");
    setScheduleError("");
  };

  const openServiceModal = () => {
    setShowServiceModal(true);
  };

  const closeServiceModal = () => {
    setShowServiceModal(false);
    setOffering(initialOffering);
    console.log(formData);
  };

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const formatDays = (days) => {
    console.log(days);
    const order = weekDays;
    const indexes = days.map((day) => order.indexOf(day)).sort((a, b) => a - b);

    const groups = [];
    let group = [indexes[0]];

    for (let i = 1; i < indexes.length; i++) {
      if (indexes[i] === indexes[i - 1] + 1) {
        group.push(indexes[i]);
      } else {
        groups.push(group);
        group = [indexes[i]];
      }
    }
    groups.push(group);

    return groups
      .map((group) => {
        if (group.length === 1) return order[group[0]];
        return `${order[group[0]]} a ${order[group[group.length - 1]]}`;
      })
      .join(", ");
  };

  const validateStep = () => {
    console.log(step);
    console.log(formData);
    if (step === 1) {
      return (
        formData.name &&
        formData.address &&
        formData.neighborhood &&
        formData.latitude &&
        formData.longitude &&
        formData.officePhone &&
        formData.cellPhone
      );
    }

    if (step === 2) {
      return formData.availabilities;
    }

    if (step === 3) {
      return formData.offerings;
    }

    return false;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleConfirmService = () => {
    const serviceToAdd = offering;

    setFormData((prev) => {
      const exists = prev.offerings.some(
        (item) => item.offeringId === serviceToAdd.offeringId,
      );

      if (exists) return prev;

      return {
        ...prev,
        offerings: [...prev.offerings, serviceToAdd],
      };
    });

    setOffering(initialOffering);
    closeServiceModal();
  };

  const handleDeleteService = (id) => {
    setFormData((prev) => ({
      ...prev,
      offerings: prev.offerings.filter((item) => item.offeringId !== id),
    }));
  };

  const handleConfirmSchedule = () => {
    if (selectedDays.length === 0 || !startTime || !endTime) {
      setScheduleError("Debes seleccionar al menos un día y ambas horas.");
      return;
    }

    if (startTime >= endTime) {
      setScheduleError("La hora de inicio debe ser menor que la hora final.");
      return;
    }

    const newSchedule = {
      id: Date.now(),
      days: selectedDays,
      formatDays: formatDays(selectedDays),
      startTime,
      endTime,
    };

    console.log(newSchedule);

    setSchedules((prev) => [...prev, newSchedule]);
    setFormData((prev) => ({
      ...prev,
      availabilities: [...prev.availabilities, newSchedule],
    }));
    closeScheduleModal();
  };

  const handleDeleteSchedule = (id) => {
    setSchedules((prev) => prev.filter((item) => item.id !== id));
  };

  const formatOfficePhone = (value) => {
    if (!value) return "";
    return `(${value.slice(0, 3)}) ${value.slice(3, 6)} ${value.slice(6)}`;
  };

  const formatCellPhone = (value) => {
    if (!value) return "";
    return `${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6)}`;
  };

  const handleModalClose = () => {
    setModalOpen(false);

    if (modalType === "success") {
      navigate("/Company/Home");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOfficePhoneChange = (e) => {
    const onlyNums = e.target.value.replace(/\D/g, "");
    if (onlyNums.length <= 10) {
      setFormData({
        ...formData,
        officePhone: onlyNums,
      });
    }
  };

  const handleCellPhoneChange = (e) => {
    const onlyNums = e.target.value.replace(/\D/g, "");
    if (onlyNums.length <= 10) {
      setFormData({
        ...formData,
        cellPhone: onlyNums,
      });
    }
  };

  const toHourMinuteObject = (time) => {
    const [hour, minute] = time.split(":");
    return {
      hour: Number(hour),
      minute: Number(minute),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (schedules.length === 0) {
      setModalMessage("Debe haber al menos un horario disponible configurado.");
      setModalType("error");
      setModalOpen(true);
      return;
    }

    console.log(schedules);

    const payload = {
      ...formData,
      availabilities: schedules.flatMap((item) =>
        item.days.map((day) => ({
          startDay: day,
          startTime: item.startTime + ":00",
          endTime: item.endTime + ":00",
          status: "active",
        })),
      ),
    };

    console.log(payload);

    try {
      const response = await apiService.post("api/veterinary", payload);
      console.log(response);
      if (response.status === 200) {
        setModalMessage("Clínica registrada exitosamente!");
        setModalType("success");
      }

      if (response.status === 500) {
        setModalMessage(
          "¡Se ha generado un error al momento de registrar la clínica!",
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
          <Titulo pageTitle="Registrar Clinica Veterinaria" />
        </header>
        <main className="main-content">
          <form className="vet-form" onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <h3>Datos Básicos</h3>
                <div className="form-group">
                  <label>Nombre</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Dirección</label>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      readOnly // Solo lectura para que el usuario use el mapa
                      placeholder="Selecciona en el mapa..."
                    />
                    <button
                      type="button"
                      onClick={() => setShowMapModal(true)} // Abre el modal
                      style={{ padding: "8px 12px", cursor: "pointer" }}
                    >
                      📍
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label>Barrio</label>
                  <input
                    type="text"
                    name="neighborhood"
                    value={formData.neighborhood}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Teléfono Oficina</label>
                  <input
                    type="text"
                    name="officePhone"
                    value={formatOfficePhone(formData.officePhone)}
                    onChange={handleOfficePhoneChange}
                  />

                  {formData.officePhone && !isOfficePhoneValid && (
                    <div
                      style={{
                        color: "red",
                        marginBottom: "1rem",
                        fontWeight: "bold",
                      }}
                    >
                      El teléfono celular debe tener exactamente 10 dígitos
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label>Teléfono Celular</label>
                  <input
                    type="text"
                    name="cellPhone"
                    value={formatCellPhone(formData.cellPhone)}
                    onChange={handleCellPhoneChange}
                  />

                  {formData.cellPhone && !isCellPhoneValid && (
                    <div
                      style={{
                        color: "red",
                        marginBottom: "1rem",
                        fontWeight: "bold",
                      }}
                    >
                      El teléfono celular debe tener exactamente 10 dígitos
                    </div>
                  )}
                </div>
                <div className="step-buttons">
                  <button
                    type="button"
                    className="btn-back"
                    onClick={() => navigate("/Company/Home")}
                  >
                    Cancelar
                  </button>
                  <button type="button" className="btn-next" onClick={nextStep}>
                    Continuar
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="form-group">
                  <h3>Horarios habilitados</h3>

                  <div className="table-content">
                    <table className="schedule-table">
                      <thead>
                        <tr>
                          <th className="table-header">Días</th>
                          <th className="table-header">Hora inicio</th>
                          <th className="table-header">Hora final</th>
                          <th className="table-header">Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schedules.length > 0 ? (
                          schedules.map((item) => (
                            <tr key={item.id}>
                              <td className="table-data">{item.formatDays}</td>
                              <td className="table-data">{item.startTime}</td>
                              <td className="table-data">{item.endTime}</td>
                              <td className="table-data">
                                <button
                                  type="button"
                                  className="icon-btn remove-btn"
                                  onClick={() => handleDeleteSchedule(item.id)}
                                  title="Eliminar horario"
                                >
                                  <FaMinus />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td className="table-data empty-row" colSpan={4}>
                              No hay horarios agregados
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    <div className="schedule-actions">
                      <button
                        type="button"
                        className="icon-btn add-btn"
                        onClick={openScheduleModal}
                        title="Agregar horario"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                  <div className="step-buttons">
                    <button
                      type="button"
                      className="btn-back"
                      onClick={prevStep}
                    >
                      Retroceder
                    </button>
                    <button
                      type="button"
                      className="btn-next"
                      onClick={nextStep}
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="form-group">
                  <label>Servicios habilitados</label>

                  <div className="table-content">
                    <table className="schedule-table">
                      <thead>
                        <tr>
                          <th className="table-header">Servicio</th>
                          <th className="table-header">
                            Tiempo de consulta (minutos)
                          </th>
                          <th className="table-header">Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.offerings.length > 0 ? (
                          formData.offerings.map((item) => (
                            <tr key={item.offeringId}>
                              <td className="table-data">{item.name}</td>
                              <td className="table-data">{item.duration}</td>
                              <td className="table-data">
                                <button
                                  type="button"
                                  className="icon-btn remove-btn"
                                  onClick={() =>
                                    handleDeleteService(item.offeringId)
                                  }
                                  title="Eliminar servicio"
                                >
                                  <FaMinus />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td className="table-data empty-row" colSpan={4}>
                              No hay servicios agregados
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    <div className="schedule-actions">
                      <button
                        type="button"
                        className="icon-btn add-btn"
                        onClick={openServiceModal}
                        title="Agregar horario"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                </div>

                {/* <button className="submit-btn" type="submit">
                  Registrar Clínica
                </button> */}
                <div className="step-buttons">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={prevStep}
                  >
                    Retroceder
                  </button>
                  <button type="submit" className="btn-submit">
                    Registrar
                  </button>
                </div>
              </>
            )}
          </form>
        </main>
      </div>

      <ScheduleModal
        open={showScheduleModal}
        weekDays={weekDays}
        selectedDays={selectedDays}
        toggleDay={toggleDay}
        startTime={startTime}
        setStartTime={setStartTime}
        endTime={endTime}
        setEndTime={setEndTime}
        scheduleError={scheduleError}
        onConfirm={handleConfirmSchedule}
        onCancel={closeScheduleModal}
      />

      <GoogleMapsModal
        open={showMapModal}
        apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        onClose={() => setShowMapModal(false)}
        onConfirm={handleConfirmLocation}
      />

      <OfferingModal
        open={showServiceModal}
        offering={offering}
        setOffering={setOffering}
        // weekDays={weekDays}
        // selectedDays={selectedDays}
        // toggleDay={toggleDay}
        // startTime={startTime}
        // setStartTime={setStartTime}
        // endTime={endTime}
        // setEndTime={setEndTime}
        // scheduleError={scheduleError}
        onConfirm={handleConfirmService}
        onCancel={closeServiceModal}
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

export default VeterinaryRegister;
