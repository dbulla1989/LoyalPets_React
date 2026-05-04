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
            value={offering.offeringId}
            onChange={(e) => {
              const currentValue = offerings.find(
                (item) => String(item.offeringId) === e.target.value,
              );
              setOffering({
                ...offering,
                offeringId: currentValue.offeringId,
                name: currentValue.name,
                description: currentValue.description,
              });
            }}
          >
            <option>Seleccione un servicio veterinario</option>
            {offerings.map((item) => (
              <option key={item.offeringId} value={item.offeringId}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="offering-field">
          <label className="offering-label">Tiempo de consulta (minutos)</label>
          <input
            type="number"
            value={offering.duration}
            onChange={(e) =>
              setOffering({
                ...offering,
                duration: e.target.value,
              })
            }
          />
        </div>

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
