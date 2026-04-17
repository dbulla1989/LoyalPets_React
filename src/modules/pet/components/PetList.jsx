import React, { useEffect, useState } from "react";
import Menu from "../../layout/components/Menu";
import Titulo from "../../layout/components/Titulo";
import {
  FaBars,
  FaCalendarPlus,
  FaUsers,
  FaClock,
  FaClipboardList,
} from "react-icons/fa";
import petService from "../../core/services/PetService";
import PetCard from "./PetCard";
import "../styles/PetList.css";

const PetList = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen((open) => !open);
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      const data = await petService.getPets();
      setPets(data || []);
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
        </main>
      </div>
    </div>
  );
};

export default PetList;
