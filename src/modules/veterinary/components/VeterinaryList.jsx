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
  FaStore,
} from "react-icons/fa";
import apiService from "../../core/resources/GlobalResource";
import VeterinaryCard from "./VeterinaryCard";
import "../styles/VeterinaryList.css";

function VeterinaryList() {
  const user = JSON.parse(localStorage.getItem("User"));
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen((open) => !open);
  const [veterinaries, setVeterinaries] = useState([]);

  useEffect(() => {
    const fetchVeterinaries = async () => {
      const response = await apiService.get(
        `api/company/${user.companyId}/veterinaries`,
      );
      console.log(response);
      setVeterinaries(response.data || []);
    };
    fetchVeterinaries();
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
            {!veterinaries || veterinaries.length === 0 ? (
              <h2>No hay sedes registradas</h2>
            ) : (
              <div className="veterinaries-list-container">
                {veterinaries.map((veterinary) => (
                  <VeterinaryCard
                    key={veterinary.id}
                    veterinary={{
                      id: veterinary.id,
                      name: veterinary.name,
                      address: veterinary.address,
                      neighborhood: veterinary.neighborhood,
                      officePhone: veterinary.officePhone,
                      cellPhone: veterinary.cellPhone,
                      rating: veterinary.rating,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          <button
            className="fab"
            data-tooltip="Registrar Sede"
            onClick={() => navigate("/company/veterinary/register")}
          >
            <FaStore />
          </button>
        </main>
      </div>
    </div>
  );
}

export default VeterinaryList;
