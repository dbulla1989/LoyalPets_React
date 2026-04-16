import React, { useState } from "react";
import "../styles/ModifyAppointment.css";

/**
 * SOLO MODIFICAR Y ELIMINAR CITAS
 * props:
 * appointments: lista de citas
 * setAppointments: función para actualizar citas (estado global o padre)
 */
export default function ModificarCita({ appointments = [], setAppointments, pets = [] }) {
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    petId: "",
    service: "",
    date: "",
    time: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = (appointment) => {
    setEditingId(appointment.id);
    setFormData({
      petId: appointment.pet?.id || "",
      service: appointment.service,
      date: appointment.date,
      time: appointment.time,
      notes: appointment.notes,
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const selectedPet = pets.find(p => p.id.toString() === formData.petId);

    const updated = appointments.map(app =>
      app.id === editingId
        ? { ...app, ...formData, pet: selectedPet }
        : app
    );

    setAppointments(updated);
    setEditingId(null);
    setFormData({ petId: "", service: "", date: "", time: "", notes: "" });
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("¿Eliminar esta cita?");
    if (confirmDelete) {
      setAppointments(appointments.filter(app => app.id !== id));
    }
  };

  return (
    <div className="vet-container">
      <div className="vet-card">
        <h2 className="vet-title">Modificar / Eliminar Citas</h2>

        {/* FORM SOLO PARA EDICIÓN */}
        {editingId && (
          <form className="vet-form" onSubmit={handleUpdate}>

            <div className="vet-group vet-full">
              <label>Mascota</label>
              <select name="petId" value={formData.petId} onChange={handleChange} required>
                <option value="">Seleccionar mascota</option>
                {pets.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name} - {pet.type}
                  </option>
                ))}
              </select>
            </div>
            <div className="vet-group vet-full">
              <label>Servicio</label>
              <select name="service" value={formData.service} onChange={handleChange} required>
                <option value="">Seleccionar servicio</option>
                <option value="Consulta">Consulta</option>
                <option value="Vacunacion">Vacunación</option>
                <option value="Estetica">Estética</option>
                <option value="Urgencia">Urgencia</option>
              </select>
            </div>

            <div className="vet-group">
              <label>Fecha</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required />
            </div>

            <div className="vet-group">
              <label>Hora</label>
              <input type="time" name="time" value={formData.time} onChange={handleChange} required />
            </div>

            <div className="vet-group vet-full">
              <label>Notas</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} />
            </div>

            <button className="vet-button vet-full" type="submit">
              Actualizar Cita
            </button>
          </form>
        )}

        {/* TABLA */}
        <div style={{ marginTop: "20px" }}>
          {appointments.length === 0 ? (
            <p>No hay citas registradas</p>
          ) : (
            <table className="vet-table">
              <thead>
                <tr>
                  <th>Mascota</th>
                  <th>Servicio</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((app) => (
                  <tr key={app.id}>
                    <td>{app.pet?.name}</td>
                    <td>{app.service}</td>
                    <td>{app.date}</td>
                    <td>{app.time}</td>
                    <td>
                      <button className="vet-button" onClick={() => handleEdit(app)}>
                        Editar
                      </button>
                      <button className="vet-button delete" onClick={() => handleDelete(app.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}


