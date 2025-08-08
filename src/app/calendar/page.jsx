'use client'
import { useState } from "react";
import { useNextCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
  createViewMonthAgenda,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'
import { Plus, X, Calendar, Clock } from 'lucide-react'
import '@schedule-x/theme-default/dist/index.css'

function CalendarApp() {
  const eventsService = useState(() => createEventsServicePlugin())[0]
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showAddEventModal, setShowAddEventModal] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: '',
    end: '',
    description: ''
  })

  // ข้อมูลเริ่มต้น
  const [events, setEvents] = useState([
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
  ])

  const calendar = useNextCalendarApp({
    views: [
      createViewMonthAgenda()
    ],
    events: events,
    selectedDate: '2025-08-12',
    plugins: [
      createDragAndDropPlugin(),
      eventsService,
    ],
    callbacks: {
      onEventClick: (event) => {
        setSelectedEvent(event)
      }
    }
  })

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.start && newEvent.end) {
      const eventToAdd = {
        id: Date.now().toString(),
        title: newEvent.title,
        start: newEvent.start,
        end: newEvent.end,
        description: newEvent.description
      }
      
      const updatedEvents = [...events, eventToAdd]
      setEvents(updatedEvents)
      
      // อัปเดต events ใน calendar
      calendar.events.set(updatedEvents)
      
      setNewEvent({ title: '', start: '', end: '', description: '' })
      setShowAddEventModal(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  return (
    <>
      <div className="flex justify-center px-2 sm:px-4 py-4 sm:py-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div className="bg-white shadow-2xl rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-6 w-full max-w-7xl relative" style={{ height: 'fit-content' }}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-center sm:text-left text-[#0383AA]"> 
              ปฏิทินกิจกรรมเทศบาลตำบลบ้านโพธิ์
            </h2>
            <button
              onClick={() => setShowAddEventModal(true)}
              className="bg-[#0383AA] hover:bg-[#026d8a] text-white px-3 sm:px-4 py-2 rounded-full flex items-center gap-1 sm:gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start"
            >
              <Plus size={16} className="sm:w-5 sm:h-5" />
              เพิ่มกิจกรรม
            </button>
          </div>
          
          <div className="sx-react-calendar-wrapper" style={{ height: 'auto' }}>
            <ScheduleXCalendar calendarApp={calendar} />
          </div>
        </div>
      </div>

      {/* Modal แสดงข้อมูล event */}
      {selectedEvent && (
        <div
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-[9999]"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 sm:p-6 max-w-xs sm:max-w-md w-full mx-2 shadow-2xl transform transition-all duration-300 scale-100 border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 pr-2 sm:pr-4 leading-tight">{selectedEvent.title}</h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100 flex-shrink-0"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 sm:gap-3 text-gray-700">
                <div className="bg-green-100 p-1.5 sm:p-2 rounded-full flex-shrink-0">
                  <Calendar size={16} className="sm:w-5 sm:h-5 text-green-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500">วันเริ่มต้น</p>
                  <p className="font-semibold text-sm sm:text-base leading-tight">{formatDate(selectedEvent.start)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3 text-gray-700">
                <div className="bg-red-100 p-1.5 sm:p-2 rounded-full flex-shrink-0">
                  <Clock size={16} className="sm:w-5 sm:h-5 text-red-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500">วันสิ้นสุด</p>
                  <p className="font-semibold text-sm sm:text-base leading-tight">{formatDate(selectedEvent.end)}</p>
                </div>
              </div>
              
              {selectedEvent.description && (
                <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-50/80 rounded-xl">
                  <p className="text-xs sm:text-sm text-gray-500 mb-1">รายละเอียด</p>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{selectedEvent.description}</p>
                </div>
              )}
            </div>
            
            <button
              className="mt-4 sm:mt-6 w-full px-4 py-2.5 sm:py-3 bg-gradient-to-r from-[#0383AA] to-[#026d8a] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-sm sm:text-base"
              onClick={() => setSelectedEvent(null)}
            >
              ปิด
            </button>
          </div>
        </div>
      )}

      {/* Modal เพิ่มกิจกรรมใหม่ */}
      {showAddEventModal && (
        <div
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-[9999]"
          onClick={() => setShowAddEventModal(false)}
        >
          <div
            className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 sm:p-6 max-w-xs sm:max-w-md w-full mx-2 shadow-2xl transform transition-all duration-300 scale-100 border border-white/20 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 leading-tight">เพิ่มกิจกรรมใหม่</h3>
              <button
                onClick={() => setShowAddEventModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100 flex-shrink-0"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ชื่อกิจกรรม *
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-[#0383AA] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0383AA] focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  placeholder="ระบุชื่อกิจกรรม..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  วันเริ่มต้น *
                </label>
                <input
                  type="date"
                  value={newEvent.start}
                  onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-[#0383AA] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0383AA] focus:border-transparent outline-none transition-all text-sm sm:text-base"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  วันสิ้นสุด *
                </label>
                <input
                  type="date"
                  value={newEvent.end}
                  onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-[#0383AA] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0383AA] focus:border-transparent outline-none transition-all text-sm sm:text-base"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  รายละเอียด
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-[#0383AA] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0383AA] focus:border-transparent outline-none transition-all resize-none text-sm sm:text-base"
                  rows="3"
                  placeholder="รายละเอียดเพิ่มเติม (ไม่บังคับ)..."
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
              <button
                onClick={() => setShowAddEventModal(false)}
                className="flex-1 px-4 py-2.5 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 text-sm sm:text-base"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleAddEvent}
                disabled={!newEvent.title || !newEvent.start || !newEvent.end}
                className="flex-1 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-[#0383AA] to-[#026d8a] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none text-sm sm:text-base"
              >
                เพิ่มกิจกรรม
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .sx-react-calendar-wrapper {
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .sx-react-calendar-wrapper .sx__calendar {
          height: 100% !important;
          overflow: hidden !important;
        }
        
        .sx-react-calendar-wrapper .sx__month-grid-wrapper {
          height: 100% !important;
          overflow: hidden !important;
        }
        
        .sx-react-calendar-wrapper .sx__month-grid {
          height: 100% !important;
        }
        
        .sx-react-calendar-wrapper .sx__calendar-wrapper {
          height: 100% !important;
        }
      `}</style>
    </>
  )
}

export default CalendarApp