import React, { useEffect, useState } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Calendar } from "@fullcalendar/core";
import koLocale from "@fullcalendar/core/locales/ko";
import "./App.css"; // Import the CSS file

function App() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://notion-api.splitbee.io/v1/table/40ddd1dd95834d54b92a6d08ed27a277"
      )
      .then((response) => {
        const data = response.data.map((item) => ({
          title: item.title,
          start: item.start,
          end: item.end || item.start, // Use start date if end date is not available
          url: item.url, // Assuming the API provides a URL field
        }));
        setEvents(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleEventClick = (clickInfo) => {
    if (clickInfo.event.url) {
      window.open(clickInfo.event.url, "_blank");
      clickInfo.jsEvent.preventDefault(); // Prevent the default browser behavior of navigating to the link
    }
  };

  return (
    <div className="App">
      <div className="fullcalendar-container">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          locale={koLocale}
          events={events}
          eventClick={handleEventClick}
          dayCellContent={(arg) => arg.dayNumberText.replace('일', '')}
          height="auto" />
      </div>
    </div>
  );
}

export default App;
