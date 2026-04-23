import React, { useEffect, useState } from "react";
import "../styles/OfferingModal.css";
import apiService from "../../core/resources/GlobalResource";

function OfferingModal({ open, offering, setOffering, onConfirm, onCancel }) {
  const [offerings, setOfferings] = useState([]);
  const [selectedOffering, setSelectedOffering] = useState("");

  useEffect(() => {
    const fetchOfferings = async () => {
      try {
        const response = await apiService.get("api/offering/all");

        if (response.status === 200) {
          const sortedOfferings = (response.data || [])
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name));

          setOfferings(sortedOfferings);
        }
      } catch (error) {}
    };

    fetchOfferings();
  }, []);

  const handleOfferingChange = (e) => {};

  if (!open) return null;

  return (
    <div className="offering-modal-overlay">
      <div className="offering-modal">
        <h3 className="offering-modal-title">Agregar servicio</h3>

        <div className="offering-field">
          <label className="offering-label">Servicio</label>
          <select
            name="offering"
            value={offering.name}
            onChange={(e) =>
              offerings.find((item) => item.name === e.target.value)
            }
          >
            <option>Seleccione un servicio veterinario</option>
            {offerings.map((offering) => (
              <option key={offering.id} value={offering.id}>
                {offering.name}
              </option>
            ))}
          </select>
        </div>

        {/* <div className="offering-days-section">
          <label className="offering-label">Días de la semana</label>

          <div className="days-grid">
            {weekDays.map((day) => (
              <label key={day} className="day-option">
                <input
                  type="checkbox"
                  checked={selectedDays.includes(day)}
                  onChange={() => toggleDay(day)}
                />
                <span>{day}</span>
              </label>
            ))}
          </div>
        </div> */}

        {/* <div className="offering-field">
          <label className="offering-label">Hora de inicio</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <div className="offering-field">
          <label className="offering-label">Hora final</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        {offeringError && <div className="offering-error">{offeringError}</div>} */}

        <div className="offering-modal-actions">
          <button type="button" className="confirm-btn" onClick={onConfirm}>
            Confirmar
          </button>
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default OfferingModal;
