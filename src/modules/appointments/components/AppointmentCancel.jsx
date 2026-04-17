import React, { useState } from "react";
import "../styles/AppointmentCancel.css";

export default function AppointmentCancel({ pets = [], histories = [] }) {
  const [selectedPetId, setSelectedPetId] = useState("");

  // Filtrar historial por mascota
  const filteredHistory = histories.filter(
    (h) => h.pet?.id.toString() === selectedPetId
  );

  return (
    <div className="vet-container">
      <div className="vet-card">
        <h2 className="vet-title">Historial Médico</h2>

        {/* SELECT MASCOTA */}
        <div className="vet-group vet-full">
          <label>Seleccionar Mascota</label>
          <select
            value={selectedPetId}
            onChange={(e) => setSelectedPetId(e.target.value)}
          >
            <option value="">Seleccionar</option>
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.name} - {pet.type}
              </option>
            ))}
          </select>
        </div>

        {/* TABLA HISTORIAL */}
        {selectedPetId && (
          <div style={{ marginTop: "20px" }}>
            {filteredHistory.length === 0 ? (
              <p>No hay historial médico para esta mascota</p>
            ) : (
              <table className="vet-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Veterinario</th>
                    <th>Diagnóstico</th>
                    <th>Tratamiento</th>
                    <th>Notas</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((h) => (
                    <tr key={h.id}>
                      <td>{h.date}</td>
                      <td>{h.vet}</td>
                      <td>{h.diagnosis}</td>
                      <td>{h.treatment}</td>
                      <td>{h.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}