import React, { useState } from "react";
import LoginModal from "./LoginModal";
import "../styles/informative.css";
import logo from "../../../../src/assets/Icon.png";
import I1 from "../../../../src/assets/Icon1.png";
import I2 from "../../../../src/assets/Icon2.png";
import I3 from "../../../../src/assets/Icon3.png";

function HomePage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  return (
    <div className="redpets-page">
      {/* Sidebar horizontal / navbar */}
      <nav className="slide-bar">
        {/* 2. Contenedor del Logo */}
        <a href="#inicio" className="logo-container">
    <img src={logo} alt="Logo Red Pets" className="icon" /> 
  </a>
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
          <h1>Red Pets</h1>
          <h2>La Plataforma que Centraliza Servicios Veterinarios para tus Mascotas</h2>
          <p>
            Garantiza el cuidado de tu animalito con acceso total a servicios veterinarios. 
          </p>
          <div className="hero-buttons">
            <button className="btn-primary">Registrarse como clínica</button>
            <button className="btn-secondary">
              Registrar mascota / Agendar cita
            </button>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="main-features">
        <div className="container">
          <h2>¿Cómo funciona Red Pets?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="icon-wrapper">
                <img src={I1} alt="icono" className="card-icon1" />
              </div>
              <h3>Para clínicas veterinarias</h3>
              <p>
                Ofrece tus servicios (vacunación, esterilización, baños,
                consultas, urgencias) y gestiona tus citas en línea desde una
                sola plataforma.
              </p>
            </div>
            <div className="feature-card">
              <div className="icon-wrapper">
                <img src={I2} alt="icono" className="card-icon2" />
              </div>
              <h3>Para dueños de mascotas</h3>
              <p>
                Encuentra la clínica más cercana y agenda servicios rápidamente
                para tus mascotas desde tu celular o computador.
              </p>
            </div>
            <div className="feature-card">
              <div className="icon-wrapper">
                <img src={I3} alt="icono" className="card-icon3" />
              </div>
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
          <h2>Beneficios de usar Red Pets</h2>
          <div className="faq-wrapper">
          
            <details className="faq-item" open>
              <summary>
                <div className="faq-icon">🐾</div>
                <strong>Agendamiento de Citas en Tiempo Real</strong>
                <span className="arrow">∨</span>
              </summary>
              <div className="faq-content">
                <p>Tus citas se agendan y se asignan de manera inmediata en la veterinaria que elijas, lo que permite una sincronización automática y eficiente.
                   De esta forma, podrás tener registro de tus citas, evitando errores, cruces de horarios o pérdidas de información, permitiendo una atención más
                   organizada y oportuna para tu mascota.</p>
              </div>
            </details>
            
            <details className="faq-item">
              <summary>
                <div className="faq-icon">🐾</div>
                <strong>Notificaciones Automáticas</strong>
                <span className="arrow">∨</span>
              </summary>
              <div className="faq-content">
                <p>Recordatorios de citas veterinarias para tus mascotas que permiten al usuario anticiparse a tiempos, reprogramacion y fechas importantes,
                  evitando olvidos y asegurando una atención oportuna. Además, facilitan una mejor organización y seguimiento del cuidado veterinario.</p>
              </div>
            </details>
            
            <details className="faq-item">
              <summary>
                <div className="faq-icon">🐾</div>
                <strong>Administración de Mascotas</strong>
                <span className="arrow">∨</span>
              </summary>
              <div className="faq-content">
                <p>Al momento de registrar a tu mascota, podrás gestionar su información médica de forma independiente, ya que puedes tener múltiples mascotas
                  registradas en tu cuenta de usuario. Además, podrás contar con un detalle completo de la información del animal, donde se incluyen todas las
                  características importantes para su cuidado.</p>
              </div>
            </details>
           
            <details className="faq-item">
              <summary>
                <div className="faq-icon">🐾</div>
                <strong>Perfil para Clínicas Veterinarias</strong>
                <span className="arrow">∨</span>
              </summary>
              <div className="faq-content">
                <p>Las clínicas veterinarias pueden crear perfiles con información sobre sus servicios, horarios y ubicación, facilitando la búsqueda y selección
                  por parte de los usuarios de la plataforma. Desde allí también podrán reajustar citas y gestionar todo lo que requieran.</p>
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Registro / CTA */}
      <section id="registro" className="cta">
        <div className="container">
          <h2>¿Listo para unirte a Red Pets?</h2>
          <p>
            Registra tu clínica o crea tu cuenta de dueño de mascota y comienza
            a gestionar servicios veterinarios de forma organizada y sencilla.
          </p>
          <div className="cta-buttons">
            <button className="btn-primary">Registrate Ya!</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="main-footer">
          <div className="container footer-content">
            
            <div className="footer-brand">
              <h3>Red Pets</h3>
              <p>Centralizamos servicios veterinarios para que siempre cuides a tus mascotas.</p>
            </div>

            <div className="footer-contact">
              <h3>Contacto</h3>
              <p>soporte@redpets.com</p>
              <p>+57 123 456 7890</p>
            </div>

          </div>

          {/* Esto debe ir separado para que baje al final */}
          <div className="footer-bottom">
            <hr />
            <p>© 2026 Red Pets. Todos los derechos reservados. Desarrollado por Equipo de Red Pets.</p>
          </div>
      </footer>
    </div>
  );
}

export default HomePage;
