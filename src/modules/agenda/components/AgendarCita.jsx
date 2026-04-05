import React, { useState } from "react";
import "../styles/AgendarCita.css";

export default function AgendarCita() {
  const [formData, setFormData] = useState({
    ownerName: "",
    petName: "",
    petType: "",
    service: "",
    date: "",
    time: "",
    notes: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Cita agendada:", formData);
    setSubmitted(true);
  };

  return (
    <div className="vet-container">
      <div className="vet-card">
        <h2 className="vet-title">Agendar Cita Veterinaria</h2>

        {submitted ? (
          <div className="vet-success">
            <h3>✅ Cita agendada correctamente</h3>
            <p>Te contactaremos para confirmar la cita</p>
            <button className="vet-button" onClick={() => setSubmitted(false)}>
              Agendar otra cita
            </button>
          </div>
        ) : (
          <form className="vet-form" onSubmit={handleSubmit}>
            <div className="vet-group">
              <label>Nombre del dueño</label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="vet-group">
              <label>Nombre de la mascota</label>
              <input
                type="text"
                name="petName"
                value={formData.petName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="vet-group">
              <label>Tipo de mascota</label>
              <select
                name="petType"
                value={formData.petType}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar</option>
                <option value="Perro">Perro</option>
                <option value="Gato">Gato</option>
                <option value="Ave">Ave</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="vet-group">
              <label>Servicio</label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar servicio</option>
                <option value="Consulta">Consulta General</option>
                <option value="Vacunacion">Vacunación</option>
                <option value="Estetica">Estética / Baño</option>
                <option value="Urgencia">Urgencia</option>
              </select>
            </div>

            <div className="vet-group">
              <label>Fecha</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="vet-group">
              <label>Hora</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>

            <div className="vet-group vet-full">
              <label>Notas adicionales</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Síntomas, observaciones..."
              />
            </div>

            <button className="vet-button vet-full" type="submit">
              Agendar Cita
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
