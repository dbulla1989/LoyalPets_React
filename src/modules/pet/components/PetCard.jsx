import React from "react";
import "../styles/PetCard.css";

const PetCard = ({ pet }) => {
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
    </div>
  );
};

export default PetCard;
