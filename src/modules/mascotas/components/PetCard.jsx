import React from 'react';
import '../styles/PetCard.css';

const PetCard = ({ pet }) => {
  return (
    <div className="pet-card">
      <div className="pet-image">
        <img src={pet.photo} alt={`Foto de ${pet.name}`} />
      </div>
      <div className="pet-info">
        <h3>{pet.name}</h3>
        <p><strong>Raza:</strong> {pet.breed}</p>
        <p><strong>Edad:</strong> {pet.age} años</p>
      </div>
    </div>
  );
};

export default PetCard;

