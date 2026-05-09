import React from "react";
import { useNavigate } from "react-router-dom";
import storeImg from "../../../assets/store.jpg";
import "../styles/VeterinaryCard.css";

function VeterinaryCard({ veterinary }) {
  const navigate = useNavigate();

  return (
    <div className="veterinary-card">
      <div className="veterinary-image">
        <img src={storeImg} alt={`Foto de ${veterinary.name}`} />
      </div>
      <div className="veterinary-info">
        <h3>{veterinary.name}</h3>
        <p>
          <strong>Direccion:</strong> {veterinary.address}
        </p>
        <p>
          <strong>Barrio:</strong> {veterinary.neighborhood}
        </p>
        <p>
          <strong>Teléfono Oficina:</strong> {veterinary.officePhone}
        </p>
        <p>
          <strong>Teléfono Celular:</strong> {veterinary.cellPhone}
        </p>
        <p>
          <strong>Calificación:</strong> {veterinary.rating}
        </p>
      </div>
      {/* <div className="veterinary-footer">
        <button
          className="details-btn"
          onClick={() =>
            navigate("/company/veterinary/Details", { state: { veterinary } })
          }
        >
          Detalles
        </button>
      </div> */}
    </div>
  );
}

export default VeterinaryCard;
