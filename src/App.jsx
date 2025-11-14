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
    // 일반 이벤트와 휴일 데이터를 병렬로 로드
    Promise.all([
      axios.get("./data/data.json"),
      axios.get("./data/holiday.json"),
    ])
      .then(([dataResponse, holidayResponse]) => {
        // 일반 이벤트 데이터 변환
        const data = dataResponse.data.map((item) => ({
          title: item.title,
          start: item.start.start,
          // INSERT_YOUR_CODE
          // end을 item.start.start (YYYY-MM-DD)에서 3일 뒤 날짜로 설정
          // dayjs 또는 date-fns등은 import 불가하므로 순수 JS로 처리
          end: (() => {
            if (!item.start || !item.start.start) return undefined;
            const date = new Date(item.start.start);
            date.setDate(date.getDate() + 3);
            // 날짜를 YYYY-MM-DD 포맷으로 변환
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, "0");
            const dd = String(date.getDate()).padStart(2, "0");
            return `${yyyy}-${mm}-${dd}`;
          })(),

          url: item.url, // Assuming the API provides a URL field
        }));

        // 휴일 데이터는 이미 올바른 형식이므로 그대로 사용
        const holidays = holidayResponse.data;

        // 일반 이벤트와 휴일을 합쳐서 설정
        setEvents([...data, ...holidays]);
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
