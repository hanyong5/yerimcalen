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
      .get("https://hanyong5.github.io/yerimcal2/notion_data.json")
      .then((response) => {
        const data = response.data.map((item) => ({
          title: item.title,
          start: item.start.start,

          end: item.end && (item.end.end || item.end.start), // Prioritize end.end, fallback to end.start, or undefined if both null
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
          dayCellContent={(arg) => arg.dayNumberText.replace("일", "")}
          height="auto"
        />
      </div>
    </div>
  );
}

export default App;
