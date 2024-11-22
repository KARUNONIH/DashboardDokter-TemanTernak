import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import { FaVideo } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { useAtom } from "jotai";
import { allDataKonsultasiAtom, consultationDataCalendarAtom, dataModalKonsultasiAtom, modalKonsultasiAtom } from "../../atoms/Atom";
import { useLocation } from "react-router-dom";

const AppointmentsCalendar = () => {
  const [totalEvents, setTotalEvents] = useState(0);
  const [modalKonsultasi, setModalKonsultasi] = useAtom(modalKonsultasiAtom);
  const [dataCalendar, setDataCalendar] = useAtom(consultationDataCalendarAtom);
  const [dataModal, setDataModal] = useAtom(dataModalKonsultasiAtom);
  const [allDataModal, setAllDataModal] = useAtom(allDataKonsultasiAtom);


  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tanggal = queryParams.get("tanggal");

  const openModal = (id) => {
    setDataModal(allDataModal.filter(item => item.id === id));
    setModalKonsultasi(true);
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const events = [
    {
      start: "2024-11-06T09:00:00",
      end: "2024-11-06T10:30:00",
      backgroundColor: "rgba(192, 38, 211, 0.1)",
      borderColor: "rgba(192, 38, 211, 0.0)",
      extendedProps: {
        title: "Rafli Jainudin",
        status: "Finished",
        consultationName: "Video Call",
        bgIcon: "rgba(192, 38, 211, 1)",
        image: ""
      },
    },
  ];

  const handleEvents = (events) => {
    const filteredEvents = events.filter((event) => event.title !== "Break Time");
    setTotalEvents(filteredEvents.length);
  };

  const renderEventContent = (eventInfo) => {
    return (
      <div className="flex h-full cursor-pointer flex-col items-start rounded p-2 text-black" style={{ backgroundColor: eventInfo.event.backgroundColor }} onClick={() => openModal(eventInfo.event.extendedProps.id)}>
        <div className="w-max">
          <div className="flex justify-between gap-3">
            <img className={`aspect-square h-6 rounded`} style={{ backgroundColor: eventInfo.event.extendedProps.bgIcon }} src={ eventInfo.event.extendedProps.src} />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{eventInfo.event.extendedProps.title}</span>
              <span className="text-sm text-gray-600">{eventInfo.timeText}</span>
              <span
                className="mt-2 rounded-full bg-white px-0.5 py-0.5 text-center text-xs font-medium"
                style={{
                  borderColor: eventInfo.event.extendedProps.bgIcon,
                  borderWidth: "1px",
                  borderStyle: "solid",
                }}
              >
                {eventInfo.event.extendedProps.consultationName}
              </span>
            </div>
            <section className="flex h-max items-center rounded bg-white">
              <span className="text-green-600">
                <GoDotFill />
              </span>
              {eventInfo.event.extendedProps.status && <span className={`px-1 py-0.5 text-xs font-medium`}>{eventInfo.event.extendedProps.status}</span>}
            </section>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="timeGridDay"
        initialDate={tanggal || getTodayDate()}
        slotMinTime="00:00:00"
        slotMaxTime="24:00:00"
        events={dataCalendar}
        headerToolbar={{
          left: "totalEventsDisplay",
          center: "prev,next title today",
          right: "timeGridDay,timeGridWeek,listWeek",
        }}
        customButtons={{
          totalEventsDisplay: {
            text: `Total Konsultasi: ${totalEvents}`,
            click: () => {},
          },
        }}
        datesSet={(dateInfo) => {
          handleEvents(
            events.filter((event) => {
              const eventStart = new Date(event.start);
              return eventStart >= dateInfo.start && eventStart < dateInfo.end;
            }),
          );
        }}
        eventContent={renderEventContent}
        height="auto"
        className="rounded-lg bg-white shadow-lg"
      />
      <style>{`
        .fc .fc-timegrid-slot {
        height: 2rem;
        background-color: #fff;
        }
        .fc-toolbar-chunk:nth-child(2){
        display: flex;
        align-items: center;
        }
        table tbody tr:nth-child(1){
        background-color: #fff;
        }
      `}</style>
    </div>
  );
};

// Custom render function for event content

// Function to set status color with Tailwind CSS
function getStatusColor(status) {
  switch (status) {
    case "Finished":
      return "border-green-500";
    case "Registered":
      return "border-yellow-500";
    default:
      return "border-gray-500";
  }
}

export default AppointmentsCalendar;
