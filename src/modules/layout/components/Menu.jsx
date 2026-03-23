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

const menuItems = [
  {
    path: "/home",
    name: "Inicio",
    icon: <FaHome />,
  },
  {
    name: "Mascotas",
    icon: <FaPaw />,
    subItems: [
      {
        path: "/Home/Mascotas/Lista",
        name: "Mis Mascotas",
        icon: <FaUser />,
      },
      {
        path: "/Home/Mascotas/Registrar",
        name: "Registrar Mascota",
        icon: <FaBars  />,
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

function Menu() {
  const [isOpen, setIsOpen] = useState(true);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const handleSubmenuToggle = (name) => {
    setOpenSubmenu((prev) => (prev === name ? null : name));
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      {/* <div className="top-section">
        <button className="toggle-button" onClick={toggleSidebar}>
          <FaBars />
        </button>
      </div> */}
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
          )
        )}
      </nav>
    </div>
  );
}

export default Menu;
