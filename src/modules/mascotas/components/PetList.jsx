import React, { useEffect, useState } from "react";
import petService from "../../core/services/PetService";
import PetCard from "./PetCard";
import "../styles/PetList.css"; 

const PetList = () => {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      const data = await petService.getPets();
      setPets(data || []);
    };
    fetchPets();
  }, []);

  return (
    <div>
      {!pets || pets.length === 0 ? (
        <h2>No hay mascotas creadas</h2>
      ) : (
        <div className="pet-list-container">
          {pets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={{
                photo: pet.encodedImage,
                name: pet.name,
                breed: pet.race,
                age: pet.age,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PetList;

