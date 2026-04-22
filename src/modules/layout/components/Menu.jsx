import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaCog,
  FaQuestionCircle,
  FaBars,
  // FaWandMagicSparkles,
  FaPaw,
  FaChevronDown,
  FaChevronRight,
  FaLock,
  FaBell,
} from "react-icons/fa";
import "../styles/Menu.css";
import { ImAddressBook } from "react-icons/im";
import { MdAssignmentAdd } from "react-icons/md";
import { GrDocumentUpdate } from "react-icons/gr";
import { TbCalendarCancel } from "react-icons/tb";
import { MdOutlineHistory } from "react-icons/md";

function Menu() {
  const [isOpen, setIsOpen] = useState(true);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const location = useLocation();

  const companyMenu = [
    {
      path: "/Company/Home",
      name: "Inicio",
      icon: <FaHome />,
    },
    {
      name: "Sedes",
      icon: <FaPaw />,
      subItems: [
        {
          path: "/Company/Veterinary/Register",
          name: "Registrar Sede",
          icon: <FaUser />,
        },
        {
          path: "/Company/Veterinary/Modify",
          name: "Modificar Sede",
          icon: <FaBars />,
        },
        {
          path: "/Company/Veterinary/Remove",
          name: "Eliminar Sede",
          icon: <FaBars />,
        },
      ],
    },
    {
      name: "Agenda",
      icon: <ImAddressBook />,
      subItems: [
        {
          path: "/Company/Planner/Calendar",
          name: "Mi Agenda",
          icon: <MdAssignmentAdd />,
        },
      ],
    },
    {
      name: "Configuración",
      icon: <FaCog />,
      subItems: [
        {
          path: "/configuracion/notificaciones",
          name: "Notificaciones",
          icon: <FaBell />,
        },
        {
          path: "/configuracion/privacidad",
          name: "Privacidad",
          icon: <FaLock />,
        },
      ],
    },
    {
      path: "/ayuda",
      name: "Ayuda",
      icon: <FaQuestionCircle />,
    },
  ];

  const personMenu = [
    {
      path: "/Person/Home",
      name: "Inicio",
      icon: <FaHome />,
    },
    {
      name: "Mascotas",
      icon: <FaPaw />,
      subItems: [
        {
          path: "/Person/Pet/List",
          name: "Mis Mascotas",
          icon: <FaUser />,
        },
        {
          path: "/Person/Pet/Register",
          name: "Registrar Mascota",
          icon: <FaBars />,
        },
        {
          path: "/Person/Pet/Modify",
          name: "Modificar Mascota",
          icon: <FaBars />,
        },
        {
          path: "/Person/Pet/Remove",
          name: "Eliminar Mascota",
          icon: <FaBars />,
        },
      ],
    },
    {
      name: "Agendas",
      icon: <ImAddressBook />,
      subItems: [
        {
          path: "/Person/Appointment/Register",
          name: "Agendar Cita",
          icon: <MdAssignmentAdd />,
        },
        {
          path: "/Person/Appointment/Modify",
          name: "Modificar Citas",
          icon: <GrDocumentUpdate />,
        },
        {
          path: "/Person/Appointment/Cancel",
          name: "Cancelar Cita",
          icon: <MdOutlineHistory />,
        },
      ],
    },
    {
      name: "Configuración",
      icon: <FaCog />,
      subItems: [
        {
          path: "/configuracion/notificaciones",
          name: "Notificaciones",
          icon: <FaBell />,
        },
        {
          path: "/configuracion/privacidad",
          name: "Privacidad",
          icon: <FaLock />,
        },
      ],
    },
    {
      path: "/ayuda",
      name: "Ayuda",
      icon: <FaQuestionCircle />,
    },
  ];

  const menuItems = location.pathname.toLowerCase().includes("company")
    ? companyMenu
    : personMenu;

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const handleSubmenuToggle = (name) => {
    setOpenSubmenu((prev) => (prev === name ? null : name));
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <nav className="menu">
        {menuItems.map((item, idx) =>
          item.subItems ? (
            <div key={idx} className="menu-item submenu">
              <div
                className={`submenu-title ${
                  openSubmenu === item.name ? "open" : ""
                }`}
                onClick={() => handleSubmenuToggle(item.name)}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div className="icon">{item.icon}</div>
                {isOpen && <div className="link-text">{item.name}</div>}
                {isOpen && (
                  <span style={{ marginLeft: "auto" }}>
                    {openSubmenu === item.name ? (
                      <FaChevronDown />
                    ) : (
                      <FaChevronRight />
                    )}
                  </span>
                )}
              </div>
              {isOpen && openSubmenu === item.name && (
                <div className="submenu-items">
                  {item.subItems.map((sub, subIdx) => (
                    <Link
                      to={sub.path}
                      key={subIdx}
                      className={`menu-item sub-item ${
                        location.pathname === sub.path ? "active" : ""
                      }`}
                    >
                      <div className="icon">{sub.icon}</div>
                      <div className="link-text">{sub.name}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link
              to={item.path}
              key={idx}
              className={`menu-item ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <div className="icon">{item.icon}</div>
              {isOpen && <div className="link-text">{item.name}</div>}
            </Link>
          ),
        )}
      </nav>
    </div>
  );
}

export default Menu;
