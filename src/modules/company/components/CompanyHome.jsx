import React, { useState } from "react";
import Menu from "../../layout/components/Menu";
import Titulo from "../../layout/components/Titulo";
import {
  FaBars,
  FaCalendarPlus,
  FaUsers,
  FaClock,
  FaClipboardList,
} from "react-icons/fa";
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
import "../styles/CompanyHome.css";

const kpis = [
  { label: "Citas hoy", value: 48, change: "+12%", positive: true },
  { label: "Pendientes", value: 14, change: "+3", positive: false },
  { label: "No show", value: "8%", change: "-1.2%", positive: true },
  { label: "Sedes activas", value: 5, change: "estable", positive: true },
];

const trendData = [
  { name: "Lun", citas: 32 },
  { name: "Mar", citas: 41 },
  { name: "Mié", citas: 38 },
  { name: "Jue", citas: 52 },
  { name: "Vie", citas: 48 },
  { name: "Sáb", citas: 61 },
  { name: "Dom", citas: 29 },
];

const branchData = [
  { name: "Norte", citas: 24 },
  { name: "Centro", citas: 18 },
  { name: "Sur", citas: 31 },
  { name: "Occidente", citas: 12 },
];

const statusData = [
  { name: "Confirmadas", value: 62 },
  { name: "Pendientes", value: 21 },
  { name: "Canceladas", value: 9 },
  { name: "Reprogramadas", value: 8 },
];

const COLORS = ["#2563eb", "#f59e0b", "#ef4444", "#10b981"];

const alerts = [
  "La sede Norte tiene baja ocupación para hoy.",
  "Hay 4 citas pendientes por confirmar.",
  "Se detectaron 2 cancelaciones en la última hora.",
];

const nextAppointments = [
  { hora: "08:30", paciente: "Luna", dueño: "Ana Pérez", sede: "Centro" },
  { hora: "09:15", paciente: "Toby", dueño: "Carlos Ruiz", sede: "Norte" },
  { hora: "10:00", paciente: "Mia", dueño: "Laura Gómez", sede: "Sur" },
  { hora: "11:20", paciente: "Rocky", dueño: "Pedro Díaz", sede: "Centro" },
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

export default function CompanyHome() {
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
              <SectionCard title="Citas por semana">
                <div className="chart-box">
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={trendData}>
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

              <SectionCard title="Citas por sede">
                <div className="chart-box">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={branchData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="citas" fill="#7c3aed" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </SectionCard>

              <SectionCard title="Estado de agenda">
                <div className="chart-box">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        label
                      >
                        {statusData.map((entry, index) => (
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

              <SectionCard title="Próximas citas">
                <div className="table-wrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Hora</th>
                        <th>Paciente</th>
                        <th>Dueño</th>
                        <th>Sede</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nextAppointments.map((row) => (
                        <tr key={`${row.hora}-${row.paciente}`}>
                          <td>{row.hora}</td>
                          <td>{row.paciente}</td>
                          <td>{row.dueño}</td>
                          <td>{row.sede}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SectionCard>

              <SectionCard title="Acciones rápidas">
                <div className="actions">
                  <button className="button">Registrar sede</button>
                  <button className="button">Ver agenda</button>
                  <button className="button">Crear bloqueo</button>
                  <button className="button">Buscar cita</button>
                </div>
              </SectionCard>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
