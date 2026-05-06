import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Menu from "../../layout/components/Menu";
import Titulo from "../../layout/components/Titulo";
import {
  FaBars,
  FaCalendarPlus,
  FaUsers,
  FaClock,
  FaClipboardList,
  FaPaw,
} from "react-icons/fa";
import petService from "../../core/services/PetService";
import PetCard from "./PetCard";
import "../styles/PetList.css";

const PetList = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen((open) => !open);
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      const response = await petService.getPetByPerson();
      console.log(response);
      setPets(response.data || []);
    };
    fetchPets();
  }, []);

  return (
    <div className="layout">
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="top-section">
          <button className="toggle-button" onClick={toggleSidebar}>
            <FaBars />
          </button>
        </div>
        <Menu isOpen={sidebarOpen} />
      </aside>
      <div className="content-area">
        <header className="header">
          <Titulo pageTitle="Menú Principal" />
        </header>
        <main className="main-content">
          <div>
            {!pets || pets.length === 0 ? (
              <h2>No hay mascotas creadas</h2>
            ) : (
              <div className="pet-list-container">
                {pets.map((pet) => (
                  <PetCard
                    key={pet.id}
                    pet={{
                      id: pet.id,
                      photo: pet.encodedImage,
                      name: pet.name,
                      animalType: pet.animalType.name,
                      breed: pet.breedType.name,
                      age: pet.age,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          <button
            className="fab"
            data-tooltip="Registrar Mascota"
            onClick={() => navigate("/Person/Pet/Register")}
          >
            <FaPaw />
          </button>
        </main>
      </div>
    </div>
  );
};

export default PetList;
