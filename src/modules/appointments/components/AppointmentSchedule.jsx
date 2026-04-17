import React, { useState } from "react";
import "../styles/AppointmentSchedule.css";

export default function AppointmentSchedule({ pets = [] }) {
  const [formData, setFormData] = useState({
    petId: "",
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

    const selectedPet = pets.find(p => p.id.toString() === formData.petId);

    const appointment = {
      ...formData,
      pet: selectedPet
    };

    console.log("Cita agendada:", appointment);
    setSubmitted(true);
  };

  return (
    <div className="vet-container">
      <div className="vet-card">
        <h2 className="vet-title">Nueva Cita</h2>

        {submitted ? (
          <div className="vet-success">
            <h3>✅ Cita agendada correctamente</h3>
            <p>La cita fue registrada para la mascota seleccionada</p>
            <button
              className="vet-button"
              onClick={() => setSubmitted(false)}
            >
              Agendar otra cita
            </button>
          </div>
        ) : (
          <form className="vet-form" onSubmit={handleSubmit}>

            {/* seleccionar mascota existente */}
            <div className="vet-group vet-full">
              <label>Mascota</label>
              <select
                name="petId"
                value={formData.petId}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar mascota</option>
                {pets.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name} - {pet.type} ({pet.owner})
                  </option>
                ))}
              </select>
            </div>

<div className="vet-group vet-full">
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
              <label>Notas</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Motivo de la cita..."
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
