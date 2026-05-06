import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "../../layout/components/Menu";
import Titulo from "../../layout/components/Titulo";
import { Calendar, momentLocalizer, Navigate } from "react-big-calendar";
import moment from "moment";
import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import apiService from "../../core/resources/GlobalResource";
import AlertNotification from "../../alertNotification/components/AlertNotification";
import "../styles/MyCalendar.css";
import {
  FaBars,
  FaCalendarPlus,
  FaUsers,
  FaClock,
  FaClipboardList,
} from "react-icons/fa";

moment.locale("es");
const localizer = momentLocalizer(moment);

function CustomToolbar({ label, onNavigate, onView }) {
  return (
    <div className="rbc-toolbar custom-toolbar">
      <div className="toolbar-left">
        <button type="button" onClick={() => onView("month")}>
          Month
        </button>
        <button type="button" onClick={() => onView("week")}>
          Week
        </button>
        <button type="button" onClick={() => onView("day")}>
          Day
        </button>
      </div>
      <span className="rbc-toolbar-label">{label}</span>
      <div className="toolbar-right">
        <button type="button" onClick={() => onNavigate(Navigate.TODAY)}>
          Today
        </button>
        <button type="button" onClick={() => onNavigate(Navigate.PREV)}>
          Back
        </button>
        <button type="button" onClick={() => onNavigate(Navigate.NEXT)}>
          Next
        </button>
      </div>
    </div>
  );
}

export default function MyCalendar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("User"));
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");
  const [view, setView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());

  const toggleSidebar = () => setSidebarOpen((open) => !open);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        if (!user?.personId) return;

        const appointmentData = await fetchAppointments();

        const enrichedAppointments = await Promise.all(
          appointmentData.map(async (element) => {
            const [veterinary, offering, pet] = await Promise.all([
              fetchVeterinary(element.veterinaryId),
              fetchOffering(element.offeringId),
              fetchPet(element.petId),
            ]);

            return {
              ...element,
              veterinary,
              offering,
              pet,
            };
          }),
        );

        setAppointments(enrichedAppointments);

        const mapped = enrichedAppointments.map((item) => ({
          id: item.id,
          title: item.offering.name + " para " + item.pet.name,
          start: new Date(item.startDate),
          end: new Date(item.endDate),
          status: item.status,
        }));

        setEvents(mapped);
      } catch (error) {
        setModalMessage(error.message || "No se pudieron cargar las citas");
        setModalType("error");
        setModalOpen(true);
      }
    };

    loadAppointments();
  }, [user?.personId]);

  const fetchAppointments = async () => {
    const response = await apiService.get(
      `api/person/${user.personId}/appointments`,
    );
    setAppointments(response.data);
    return response.data || [];
  };

  const fetchVeterinary = async (id) => {
    const response = await apiService.get(`api/veterinary/${id}`);
    return response.data[0] || null;
  };

  const fetchOffering = async (id) => {
    const response = await apiService.get(`api/offering/${id}`);
    return response.data[0] || null;
  };

  const fetchPet = async (id) => {
    const response = await apiService.get(`api/pet/${id}`);
    return response.data[0] || null;
  };

  const eventPropGetter = (event) => {
    const backgroundColor = event.status === "active" ? "#16a34a" : "#dc2626";
    return {
      style: {
        backgroundColor,
        borderRadius: "6px",
        color: "#fff",
        border: "none",
      },
    };
  };

  const handleDrillDown = (date, view) => {
    setCurrentDate(date);
    setView("day");
  };

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
          <Titulo pageTitle="Mi Agenda" />
        </header>

        <main className="main-content">
          <div className="calendar-wrapper">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              date={currentDate}
              view={view}
              onView={setView}
              onNavigate={setCurrentDate}
              onDrillDown={(date) => {
                setCurrentDate(date);
                setView("day");
              }}
              views={["month", "week", "day", "agenda"]}
              defaultView="month"
              style={{ height: 650 }}
              components={{
                toolbar: CustomToolbar,
              }}
            />
          </div>
        </main>
      </div>

      <AlertNotification
        isOpen={modalOpen}
        message={modalMessage}
        type={modalType}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
