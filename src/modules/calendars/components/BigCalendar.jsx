import React, { useMemo, useState } from "react";
import { Calendar, momentLocalizer, Navigate } from "react-big-calendar";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import moment from "moment";
import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/BigCalendar.css";

moment.locale("es");
dayjs.extend(utc);
dayjs.extend(timezone);

const localizer = momentLocalizer(moment);

const toBogotaIso = (date) => dayjs(date).tz("America/Bogota").format();

const dayMap = {
  Domingo: 0,
  Lunes: 1,
  Martes: 2,
  Miércoles: 3,
  Miercoles: 3,
  Jueves: 4,
  Viernes: 5,
  Sábado: 6,
  Sabado: 6,
};

const parseTimeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (minutes) => {
  const hh = String(Math.floor(minutes / 60)).padStart(2, "0");
  const mm = String(minutes % 60).padStart(2, "0");
  return `${hh}:${mm}`;
};

const generateTimeSlots = (startTime, endTime, interval) => {
  const start = parseTimeToMinutes(startTime);
  const end = parseTimeToMinutes(endTime);
  const slots = [];

  for (let current = start; current + interval <= end; current += interval) {
    slots.push(minutesToTime(current));
  }

  return slots;
};

function CustomToolbar({ label, onNavigate }) {
  return (
    <div className="rbc-toolbar custom-toolbar">
      <span className="rbc-toolbar-label">{label}</span>
      <div className="toolbar-actions">
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

function DateCellWrapper({ children, value, availabilities }) {
  const isPast = moment(value).startOf("day").isBefore(moment().startOf("day"));
  const dayIndex = moment(value).day();

  const isAllowedDay = availabilities.some((item) => {
    if (item.status !== "active") return false;
    return dayMap[item.startDay] === dayIndex;
  });

  const disabled = isPast || !isAllowedDay;

  return React.cloneElement(React.Children.only(children), {
    className: `${children.props.className || ""} ${disabled ? "past-day" : ""}`,
  });
}

export default function BigCalendarModal({
  open,
  onClose,
  availabilities = [],
  offerings = [],
  appointments = [],
  selectedOfferingId = "",
  onSelectDateTime,
}) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const events = useMemo(() => [], []);

  const handleHourClick = (hour) => {
    if (!selectedDate) return;

    const [hh, mm] = hour.split(":").map(Number);

    const startDate = moment(selectedDate)
      .hour(hh)
      .minute(mm)
      .second(0)
      .millisecond(0);

    const endDate = moment(startDate).add(serviceDuration, "minutes");

    const formatter = new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const dateText = formatter.format(startDate.toDate());

    const timeText = startDate.format("h:mm a");
    const endTimeText = endDate.format("h:mm a");

    const label = `${dateText} de ${timeText} a ${endTimeText}`;

    setSelectedHour(hour);

    onSelectDateTime?.({
      iso: toBogotaIso(startDate),
      label,
      start: toBogotaIso(startDate),
      end: toBogotaIso(endDate),
    });

    onClose();
  };

  const selectedOffering = useMemo(() => {
    console.log(offerings);
    console.log(selectedOfferingId);
    return offerings.find(
      (item) =>
        item.offeringId === selectedOfferingId && item.status === "active",
    );
  }, [offerings, selectedOfferingId]);

  const serviceDuration = selectedOffering?.duration || 30;

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const candidate = new Date(date);
    candidate.setHours(0, 0, 0, 0);

    return candidate <= today;
  };

  const formatSlotKey = (date) =>
    dayjs(date).tz("America/Bogota").format("YYYY-MM-DD HH:mm");

  const isSlotBooked = (hour) => {
    if (!selectedDate || !selectedOfferingId) return false;

    const [hh, mm] = hour.split(":").map(Number);

    const slotStart = moment(selectedDate)
      .hour(hh)
      .minute(mm)
      .second(0)
      .millisecond(0);

    const slotKey = dayjs(slotStart.toDate())
      .tz("America/Bogota")
      .format("YYYY-MM-DD HH:mm");

    return appointments.some((appointment) => {
      const sameOffering = appointment.offeringId === selectedOfferingId;
      const appointmentKey = dayjs(appointment.startDate)
        .tz("America/Bogota")
        .format("YYYY-MM-DD HH:mm");
      return sameOffering && appointmentKey === slotKey;
    });
  };

  const getAvailabilityForDate = (date) => {
    const dayIndex = moment(date).day();
    return availabilities.find((item) => {
      if (item.status !== "active") return false;
      return dayMap[item.startDay] === dayIndex;
    });
  };

  const parseTimeToMinutes = (time) => {
    const [h, m] = time.split(":");
    return Number(h) * 60 + Number(m);
  };

  const minutesToLabel = (minutes) => {
    const hh = String(Math.floor(minutes / 60)).padStart(2, "0");
    const mm = String(minutes % 60).padStart(2, "0");
    return `${hh}:${mm}`;
  };

  const generateHours = (availability) => {
    if (!availability) return [];
    const start = parseTimeToMinutes(availability.startTime);
    const end = parseTimeToMinutes(availability.endTime);
    const result = [];

    for (let min = start; min < end; min += 60) {
      result.push(minutesToLabel(min));
    }

    return result;
  };

  const hours = useMemo(() => {
    if (!selectedDate || !selectedOffering) return [];

    const availability = getAvailabilityForDate(selectedDate);
    if (!availability) return [];

    return generateTimeSlots(
      availability.startTime,
      availability.endTime,
      serviceDuration,
    );
  }, [selectedDate, selectedOffering, availabilities]);

  const handleNavigate = (newDate) => {
    const today = new Date();
    const currentMonthStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      1,
    );
    const newMonthStart = new Date(
      newDate.getFullYear(),
      newDate.getMonth(),
      1,
    );

    if (newMonthStart < currentMonthStart) return;
    setCurrentDate(newDate);
  };

  const handleSelectSlot = ({ start }) => {
    console.log(appointments);
    const availability = getAvailabilityForDate(start);
    if (!availability) return;
    if (isPastDate(start)) return;
    setSelectedDate(start);
    onSelectDateTime?.(start, availability);
  };

  const handleDrillDown = (date) => {
    const availability = getAvailabilityForDate(date);
    if (!availability) return;
    if (isPastDate(date)) return;
    setSelectedDate(date);
    onSelectDateTime?.(date, availability);
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h2>Selecciona un día y una hora</h2>
          <button type="button" onClick={onClose}>
            Cerrar
          </button>
        </div>

        <div className="modal-body">
          <div className="calendar-section">
            <Calendar
              localizer={localizer}
              events={events}
              date={currentDate}
              onNavigate={handleNavigate}
              selectable
              onSelectSlot={handleSelectSlot}
              onDrillDown={handleDrillDown}
              views={["month"]}
              defaultView="month"
              style={{ height: 500 }}
              components={{
                toolbar: CustomToolbar,
                dateCellWrapper: (props) => (
                  <DateCellWrapper {...props} availabilities={availabilities} />
                ),
              }}
            />
          </div>

          <div className="hours-section">
            <h3 style={{ textAlign: "center" }}>
              Horas del día{" "}
              {selectedDate ? moment(selectedDate).format("DD/MM/YYYY") : ""}
            </h3>

            {!selectedDate ? (
              <p>Haz clic en un día habilitado para ver las horas.</p>
            ) : hours.length === 0 ? (
              <p>No hay disponibilidad para este día.</p>
            ) : (
              <div className="hours-grid">
                {hours.map((hour) => {
                  const booked = isSlotBooked(hour);

                  return (
                    <button
                      key={hour}
                      className={`hour-item ${booked ? "booked" : "available"} ${selectedHour === hour ? "selected" : ""}`}
                      type="button"
                      disabled={booked}
                      onClick={() => !booked && handleHourClick(hour)}
                    >
                      {hour}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
