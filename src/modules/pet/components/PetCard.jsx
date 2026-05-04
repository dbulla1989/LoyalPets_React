import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PetCard.css";

const PetCard = ({ pet }) => {
  const navigate = useNavigate();
  console.log("Este es la mascota:");
  console.log(pet);
  return (
    <div className="pet-card">
      <div className="pet-image">
        <img src={pet.photo} alt={`Foto de ${pet.name}`} />
      </div>
      <div className="pet-info">
        <h3>{pet.name}</h3>
        <p>
          <strong>Tipo de Animal:</strong> {pet.animalType}
        </p>
        <p>
          <strong>Raza:</strong> {pet.breed}
        </p>
        <p>
          <strong>Edad:</strong> {pet.age} meses
        </p>
      </div>
      <div className="pet-footer">
        <button
          className="details-btn"
          onClick={() => navigate("/Person/Pet/Details", { state: { pet } })}
        >
          Detalles
        </button>
      </div>
    </div>
  );
};

export default PetCard;
