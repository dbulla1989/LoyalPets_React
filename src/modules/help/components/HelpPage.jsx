import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Menu from "../../layout/components/Menu";
import Titulo from "../../layout/components/Titulo";
import { FaChevronDown, FaChevronUp, FaBars } from "react-icons/fa";
import "../styles/HelpPage.css";

const helpCompanyItems = [
  {
    id: "register-branch",
    title: "Registrar una sede",
    videoUrl: "https://www.youtube.com/watch?v=tP0uY6Mg8tA",
    content: [
      "Ve al menú principal y selecciona la opción de sedes.",
      "Haz clic en 'Registrar sede'.",
      "Completa el formulario con los datos solicitados.",
      "Presiona 'Guardar' para finalizar el registro.",
    ],
  },
  {
    id: "review-schedule",
    title: "Revisar la agenda",
    videoUrl: "https://www.youtube.com/watch?v=V83p2SSdxL4",
    content: [
      "Ingresa al módulo de agenda.",
      "Selecciona la sede que deseas revisar.",
      "Consulta las citas programadas por día.",
      "Usa el calendario para navegar entre fechas.",
    ],
  },
];

const helpPersonItems = [
  {
    id: "register-pet",
    title: "Registrar una mascota",
    videoUrl: "https://www.youtube.com/watch?v=tP0uY6Mg8tA",
    content: [
      "Ve al menú principal y selecciona la opción de mascotas.",
      "Haz clic en 'Registrar mascota'.",
      "Completa el formulario con el nombre, edad, tipo de animal, raza y foto.",
      "Presiona 'Guardar' para finalizar el registro.",
    ],
  },
  {
    id: "register-appointment",
    title: "Registrar una cita",
    videoUrl: "https://www.youtube.com/watch?v=V83p2SSdxL4",
    content: [
      "Selecciona la mascota que deseas atender.",
      "Elige la veterinaria disponible.",
      "Selecciona el servicio que necesitas.",
      "Escoge la fecha y hora disponibles en el calendario.",
      "Presiona 'Agendar cita'.",
    ],
  },
  {
    id: "reschedule-appointment",
    title: "Reprogramar una cita",
    videoUrl: "https://www.youtube.com/watch?v=zf9PKY9LSz8",
    content: [
      "Entra a la lista de tus citas agendadas.",
      "Busca la cita que deseas cambiar.",
      "Selecciona la opción 'Reprogramar'.",
      "Escoge una nueva fecha y hora disponible.",
      "Confirma los cambios.",
    ],
  },
  {
    id: "cancel-appointment",
    title: "Cancelar una cita",
    videoUrl: "https://www.youtube.com/watch?v=6DQs3KivIEM",
    content: [
      "Ve a la sección de tus citas.",
      "Ubica la cita que deseas cancelar.",
      "Haz clic en 'Cancelar cita'.",
      "Confirma la cancelación en el mensaje emergente.",
    ],
  },
];

export default function HelpPage() {
  const location = useLocation();
  const rolePath = location.pathname.toLowerCase().includes("company")
    ? "Company"
    : "Person";

  const [openSection, setOpenSection] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSection = (id) => {
    setOpenSection((current) => (current === id ? null : id));
  };

  const toggleSidebar = () => setSidebarOpen((open) => !open);

  const getEmbedUrl = (url) => {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const items = rolePath === "Company" ? helpCompanyItems : helpPersonItems;

  return (
    <div className="layout">
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="top-section">
          <button className="toggle-button" onClick={toggleSidebar} type="button">
            <FaBars />
          </button>
        </div>
        <Menu isOpen={sidebarOpen} />
      </aside>

      <div className="content-area">
        <header className="header">
          <Titulo pageTitle="Portal de Ayuda" />
        </header>

        <main className="main-content">
          <div className="help-page">
            <h1 className="help-title">Centro de Ayuda</h1>
            <p className="help-subtitle">
              Encuentra instrucciones rápidas y videos de apoyo sobre las funciones principales.
            </p>

            <div className="help-container">
              {items.map((item) => {
                const isOpen = openSection === item.id;

                return (
                  <div key={item.id} className="help-card">
                    <button
                      type="button"
                      onClick={() => toggleSection(item.id)}
                      className="help-header"
                      aria-expanded={isOpen}
                      aria-controls={`${item.id}-content`}
                    >
                      <span>{item.title}</span>
                      <span className="help-icon">
                        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                      </span>
                    </button>

                    {isOpen && (
                      <div id={`${item.id}-content`} className="help-content">
                        <ul className="help-list">
                          {item.content.map((line, index) => (
                            <li key={index} className="help-list-item">
                              {line}
                            </li>
                          ))}
                        </ul>

                        <div className="help-video-wrapper">
                          <iframe
                            className="help-video"
                            src={getEmbedUrl(item.videoUrl)}
                            title={item.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}