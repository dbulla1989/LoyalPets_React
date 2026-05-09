import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Menu from "../../layout/components/Menu";
import Titulo from "../../layout/components/Titulo";
import {
  FaBars,
  FaCalendarPlus,
  FaUsers,
  FaClock,
  FaClipboardList,
} from "react-icons/fa";
import "../styles/PersonHome.css";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const kpis = [
  { label: "Mascotas", value: 3, change: "+1 este año", positive: true },
  { label: "Citas próximas", value: 2, change: "esta semana", positive: true },
  { label: "Recordatorios", value: 5, change: "2 urgentes", positive: false },
  { label: "Citas completadas", value: 18, change: "+20%", positive: true },
];

const upcomingData = [
  { name: "Lun", citas: 0 },
  { name: "Mar", citas: 1 },
  { name: "Mié", citas: 0 },
  { name: "Jue", citas: 2 },
  { name: "Vie", citas: 1 },
  { name: "Sáb", citas: 0 },
  { name: "Dom", citas: 0 },
];

const servicesData = [
  { name: "Vacunación", value: 40 },
  { name: "Consulta General", value: 25 },
  { name: "Peluqueria", value: 20 },
  { name: "Laboratorio", value: 15 },
];

const reminderData = [
  { name: "Pendientes", value: 5 },
  { name: "Completados", value: 12 },
  { name: "Vencidos", value: 2 },
];

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444"];

const alerts = [
  "Luna tiene una vacuna pendiente por aplicar.",
  "Toby tiene cita programada mañana a las 9:15 a. m.",
  "Mia requiere control de seguimiento en 7 días.",
];

const pets = [
  {
    name: "Luna",
    species: "Perro",
    breed: "Labrador",
    status: "Vacuna pendiente",
  },
  { name: "Toby", species: "Gato", breed: "Criollo", status: "Cita mañana" },
  {
    name: "Mia",
    species: "Perro",
    breed: "Poodle",
    status: "Control en 7 días",
  },
];

const nextAppointments = [
  {
    fecha: "07 May",
    hora: "09:15",
    mascota: "Toby",
    servicio: "Consulta",
    sede: "Centro",
  },
  {
    fecha: "09 May",
    hora: "11:30",
    mascota: "Mia",
    servicio: "Control",
    sede: "Norte",
  },
];

function KpiCard({ label, value, change, positive }) {
  return (
    <div className="kpi-card">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      <div className={`kpi-change ${positive ? "positive" : "negative"}`}>
        {change}
      </div>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="section-card">
      <h3 className="section-title">{title}</h3>
      {children}
    </div>
  );
}

function HomePerson() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen((open) => !open);

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
          <div className="dashboard-page">
            <div className="kpi-grid">
              {kpis.map((item) => (
                <KpiCard key={item.label} {...item} />
              ))}
            </div>

            <div className="main-grid">
              <SectionCard title="Próximas atenciones">
                <div className="chart-box">
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={upcomingData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="citas"
                        stroke="#2563eb"
                        strokeWidth={3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </SectionCard>

              <SectionCard title="Servicios programados">
                <div className="chart-box">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={servicesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#7c3aed" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </SectionCard>

              <SectionCard title="Estado de recordatorios">
                <div className="chart-box">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={reminderData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        label
                      >
                        {reminderData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </SectionCard>

              <SectionCard title="Alertas">
                <ul className="list">
                  {alerts.map((item) => (
                    <li key={item} className="list-item">
                      {item}
                    </li>
                  ))}
                </ul>
              </SectionCard>

              <SectionCard title="Mis mascotas">
                <div className="pet-list">
                  {pets.map((pet) => (
                    <div key={pet.name} className="pet-item">
                      <div className="pet-name">{pet.name}</div>
                      <div className="pet-meta">
                        {pet.species} · {pet.breed}
                      </div>
                      <div className="pet-status">{pet.status}</div>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Próximas citas">
                <div className="table-wrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Mascota</th>
                        <th>Servicio</th>
                        <th>Sede</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nextAppointments.map((row) => (
                        <tr key={`${row.fecha}-${row.hora}-${row.mascota}`}>
                          <td>{row.fecha}</td>
                          <td>{row.hora}</td>
                          <td>{row.mascota}</td>
                          <td>{row.servicio}</td>
                          <td>{row.sede}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SectionCard>

              <SectionCard title="Acciones rápidas">
                <div className="actions">
                  <button className="button">Agregar mascota</button>
                  <button className="button">Solicitar cita</button>
                  <button className="button">Ver agenda</button>
                  <button className="button">Actualizar datos</button>
                </div>
              </SectionCard>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default HomePerson;
