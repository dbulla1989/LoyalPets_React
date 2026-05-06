import React, { useEffect } from "react";
import "../styles/EventCalendarModal.css";

export default function EventCalendarModal({
  open,
  event,
  onClose,
  onReschedule,
  onCancelEvent,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && open) onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || !event) return null;

  return (
    <div className="event-modal-backdrop" onClick={onClose}>
      <div className="event-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="event-modal-close"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>

        <h2 className="event-modal-title">Detalle de la cita</h2>

        <div className="event-modal-body">
          <div className="event-modal-row">
            <span className="event-modal-label">Título:</span>
            <span>{event.title}</span>
          </div>

          <div className="event-modal-row">
            <span className="event-modal-label">Inicio:</span>
            <span>{event.start?.toLocaleString()}</span>
          </div>

          <div className="event-modal-row">
            <span className="event-modal-label">Fin:</span>
            <span>{event.end?.toLocaleString()}</span>
          </div>

          <div className="event-modal-row">
            <span className="event-modal-label">Estado:</span>
            <span>{event.status}</span>
          </div>

          {event.pet?.name && (
            <div className="event-modal-row">
              <span className="event-modal-label">Mascota:</span>
              <span>{event.pet.name}</span>
            </div>
          )}

          {event.offering?.name && (
            <div className="event-modal-row">
              <span className="event-modal-label">Servicio:</span>
              <span>{event.offering.name}</span>
            </div>
          )}

          {event.veterinary?.name && (
            <div className="event-modal-row">
              <span className="event-modal-label">Veterinaria:</span>
              <span>{event.veterinary.name}</span>
            </div>
          )}
        </div>

        <div className="event-modal-actions">
          <button
            type="button"
            className="event-btn event-btn-reschedule"
            onClick={() => onReschedule(event)}
          >
            Reprogramar
          </button>

          <button
            type="button"
            className="event-btn event-btn-cancel"
            onClick={() => onCancelEvent(event)}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}