'use client'
import { useState } from "react";
import { useNextCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'

import '@schedule-x/theme-default/dist/index.css'
import './calendar-style.css'

function CalendarApp() {
  const eventsService = useState(() => createEventsServicePlugin())[0]

  // State สำหรับ modal
  const [selectedEvent, setSelectedEvent] = useState(null)

  const calendar = useNextCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda()
    ],
    events: [
        {
          id: '1',
          title: 'ประชุม',
          start: '2025-08-12',
          end: '2025-08-13',
        },
        {
          id: '2',
          title: 'ประชุมใหญ่',
          start: '2025-08-14',
          end: '2025-08-15',
        },
        {
          id: '3',
          title: 'โครงการอบรมผู้นำชุมชน',
          start: '2025-08-05',
          end: '2025-08-07',
        },
        {
          id: '4',
          title: 'สัปดาห์สุขภาพชุมชน',
          start: '2025-08-22',
          end: '2025-08-28',
        },
        {
          id: '5',
          title: 'วันแรงงานแห่งชาติ',
          start: '2025-05-01',
          end: '2025-05-02',
        },
        {
          id: '6',
          title: 'วันพ่อแห่งชาติ',
          start: '2025-12-05',
          end: '2025-12-06',
        },
        {
          id: '7',
          title: 'เทศกาลลอยกระทง',
          start: '2025-11-05',
          end: '2025-11-06',
        },
        {
          id: '8',
          title: 'สงกรานต์',
          start: '2025-04-13',
          end: '2025-04-16',
        },
        {
          id: '9',
          title: 'Big Cleaning Day',
          start: '2025-08-12',
          end: '2025-08-13',
        },
        {
          id: '10',
          title: 'ตรวจสุขภาพหมู่บ้าน',
          start: '2025-08-12',
          end: '2025-08-13',
        },
        {
          id: '11',
          title: 'ฝึกอบรมอาชีพชุมชน',
          start: '2025-08-11',
          end: '2025-08-14',
        },
        {
          id: '12',
          title: 'ประชุมประจำเดือน',
          start: '2025-08-01',
          end: '2025-08-02',
        }
      ],
    selectedDate: '2025-08-12',
    plugins: [
      createDragAndDropPlugin(),
      eventsService,
    ],
    callbacks: {
      onEventClick: (event) => {
        setSelectedEvent(event)
      },
      onRender: () => {
        eventsService.getAll()
      }
    }
  })

  return (
<>
  <div className="flex justify-center px-4 py-12 bg-white min-h-screen">
    <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-6 w-full max-w-[950px] overflow-auto" style={{ maxHeight: '80vh' }}>
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center text-[#0383AA]">
        ปฏิทินกิจกรรมเทศบาลตำบลบ้านโพธิ์
      </h2>
      <div className="sx-react-calendar-wrapper">
        <ScheduleXCalendar calendarApp={calendar} />
      </div>
    </div>
  </div>

  {/* Modal แสดงข้อมูล event */}
  {selectedEvent && (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={() => setSelectedEvent(null)}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-4">{selectedEvent.title}</h3>
        <p>เริ่ม: {selectedEvent.start}</p>
        <p>สิ้นสุด: {selectedEvent.end}</p>
        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => setSelectedEvent(null)}
        >
          ปิด
        </button>
      </div>
    </div>
  )}
</>

  )
}

export default CalendarApp
