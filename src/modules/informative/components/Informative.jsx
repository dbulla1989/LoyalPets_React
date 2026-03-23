import React, { useState } from "react";
import LoginModal from "./LoginModal";
import "../styles/informative.css";

function HomePage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <div className="worldpets-page">
      {/* Sidebar horizontal / navbar */}
      <nav className="slide-bar">
        <div className="slide-bar-links">
          <a href="#inicio" className="slide-link">
            Inicio
          </a>
          <a href="#como-funciona" className="slide-link">
            Cómo funciona
          </a>
          <a href="#beneficios" className="slide-link">
            Beneficios
          </a>
          <a href="#registro" className="slide-link">
            Registro
          </a>
        </div>
        <button
          className="btn-login slide-bar-login"
          onClick={() => setIsLoginModalOpen(true)}
        >
          Iniciar sesión
        </button>
      </nav>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Hero / Sección inicial */}
      <section id="inicio" className="hero">
        <div className="hero-content">
          <h1>World Pets</h1>
          <p>
            La plataforma que centraliza servicios veterinarios y conecta
            clínicas con dueños de mascotas.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary">Registrarse como clínica</button>
            <button className="btn-secondary">
              Registrar mascota / agendar cita
            </button>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="main-features">
        <div className="container">
          <h2>Cómo funciona World Pets</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Para clínicas veterinarias</h3>
              <p>
                Ofrece tus servicios (vacunación, esterilización, baños,
                consultas, urgencias) y gestiona tus citas en línea desde una
                sola plataforma.
              </p>
            </div>
            <div className="feature-card">
              <h3>Para dueños de mascotas</h3>
              <p>
                Encuentra la clínica más cercana y agenda servicios rápidamente
                para tus mascotas desde tu celular o computador.
              </p>
            </div>
            <div className="feature-card">
              <h3>Centralización de servicios</h3>
              <p>
                Todas las clínicas registradas se organizan en un mapa
                interactivo. Filtra por ubicación, tipo de servicio y horario
                disponible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section id="beneficios" className="benefits">
        <div className="container">
          <h2>Beneficios de usar World Pets</h2>
          <ul className="benefits-list">
            <li>
              <strong>Agenda en tiempo real:</strong> tus citas se sincronizan
              de forma automática.
            </li>
            <li>
              <strong>Notificaciones automáticas:</strong> recuerdos de citas y
              recordatorios de vacunas.
            </li>
            <li>
              <strong>Perfil de mascota:</strong> historial médico, vacunaciones
              y servicios contratados.
            </li>
            <li>
              <strong>Soporte para clínicas:</strong> dashboard de rendimiento y
              reportes de servicios.
            </li>
          </ul>
        </div>
      </section>

      {/* Registro / CTA */}
      <section id="registro" className="cta">
        <div className="container">
          <h2>¿Listo para unirte a World Pets?</h2>
          <p>
            Registra tu clínica o crea tu cuenta de dueño de mascota y comienza
            a gestionar servicios veterinarios de forma organizada y sencilla.
          </p>
          <div className="cta-buttons">
            <button className="btn-primary">Registrarse gratis</button>
            <button className="btn-outline">Saber más</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <h3>World Pets</h3>
              <p>
                Centralizamos servicios veterinarios para que siempre cuides a
                tus mascotas.
              </p>
            </div>
            <div className="footer-links">
              <p>
                <strong>Contacto</strong>
              </p>
              <p>soporte@worldpets.com</p>
              <p>+57 123 456 7890</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
