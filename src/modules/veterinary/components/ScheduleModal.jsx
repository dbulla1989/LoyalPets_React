import React from "react";
import "../styles/ScheduleModal.css";

function ScheduleModal({
  open,
  weekDays,
  selectedDays,
  toggleDay,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  scheduleError,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="schedule-modal-overlay">
      <div className="schedule-modal">
        <h3 className="schedule-modal-title">Agregar horario</h3>

        <div className="schedule-days-section">
          <label className="schedule-label">Días de la semana</label>

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

        <div className="schedule-field">
          <label className="schedule-label">Hora de inicio</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <div className="schedule-field">
          <label className="schedule-label">Hora final</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        {scheduleError && <div className="schedule-error">{scheduleError}</div>}

        <div className="schedule-modal-actions">
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

export default ScheduleModal;