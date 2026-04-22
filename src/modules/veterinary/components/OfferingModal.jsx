import React from "react";
import "../styles/OfferingModal.css";

function OfferingModal() {
  return (
    <div className="offering-modal-overlay">
      <div className="offering-modal">
        <h3 className="offering-modal-title">Agregar horario</h3>

        <div className="offering-days-section">
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
        </div>

        <div className="offering-field">
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

        {offeringError && <div className="offering-error">{offeringError}</div>}

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
