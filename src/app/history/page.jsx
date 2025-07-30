"use client";
import { useState } from "react";

export default function HistoryPage() {
  const [activeSection, setActiveSection] = useState("history");

  const sections = [
    {
      id: "history",
      title: "ประวัติความเป็นมา",
      icon: "📖"
    },
    {
      id: "location",
      title: "ลักษณะที่ตั้งและอาณาเขต",
      icon: "🏛️"
    }
  ];

  const historyData = {
    establishment: {
      title: "การจัดตั้ง",
      content: [
        "เทศบาลตำบลบ้านโพธิ์ มีเขตพื้นที่เป็นที่ตั้งของที่ว่าการอำเภอบ้านโพธิ์ ซึ่งตั้งอยู่ทางทิศใต้ของจังหวัดฉะเชิงเทรา ระยะทางห่างจากจังหวัด 14 กิโลเมตร",
        "ได้มีประกาศจัดตั้งเป็นสุขาภิบาลตามประกาศกระทรวงมหาดไทย เมื่อวันที่ 10 ธันวาคม 2499 มีพื้นที่ 1.25 ตารางกิโลเมตร"
      ]
    },
    transformation: {
      title: "การเปลี่ยนแปลงฐานะ",
      content: [
        "ได้รับการเปลี่ยนแปลงฐานะจากสุขาภิบาลบ้านโพธิ์ เป็นเทศบาลตำบลบ้านโพธิ์ ตามพระราชบัญญัติเปลี่ยนแปลงฐานะของสุขาภิบาลเป็นเทศบาล พ.ศ. 2542",
        "ประกาศในราชกิจจานุเบกษา ฉบับฎีกา เล่มที่ 116 ตอนที่ 9 ก. วันที่ 24 กุมภาพันธ์ 2542",
        "มีผลบังคับใช้ตั้งแต่วันที่ 25 พฤษภาคม 2542"
      ]
    },
    merger: {
      title: "การยุบรวม",
      content: [
        "กระทรวงมหาดไทย ได้ประกาศให้องค์การบริหารส่วนตำบลบ้านโพธิ์ ยุบรวมกับเทศบาลตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา",
        "ตามประกาศราชกิจจานุเบกษาทั่วไป เล่มที่ 121 ตอนพิเศษ 102 ลงวันที่ 15 กันยายน 2547",
        "มีพื้นที่ทั้งหมด 7.17 ตารางกิโลเมตร"
      ]
    }
  };

  const locationData = {
    boundaries: [
      { direction: "ทิศเหนือ", border: "ติดกับตำบลท่าพลับ" },
      { direction: "ทิศใต้", border: "ติดกับตำบลคลองบ้านโพธิ์" },
      { direction: "ทิศตะวันออก", border: "ติดกับตำบลหนองตีนนก และตำบลหนองบัว" },
      { direction: "ทิศตะวันตก", border: "ติดกับแม่น้ำบางปะกง และตำบลสนามจันทร์" }
    ],
    area: "7.17 ตารางกิโลเมตร",
    location: "ทางทิศใต้ของจังหวัดฉะเชิงเทรา ห่างจากจังหวัด 14 กิโลเมตร"
  };

  const timelineEvents = [
    {
      year: "2499",
      date: "10 ธันวาคม",
      event: "จัดตั้งเป็นสุขาภิบาล",
      area: "1.25 ตารางกิโลเมตร"
    },
    {
      year: "2542",
      date: "24 กุมภาพันธ์",
      event: "ประกาศเปลี่ยนฐานะเป็นเทศบาล",
      area: "1.25 ตารางกิโลเมตร"
    },
    {
      year: "2542",
      date: "25 พฤษภาคม",
      event: "มีผลบังคับใช้เป็นเทศบาล",
      area: "1.25 ตารางกิโลเมตร"
    },
    {
      year: "2547",
      date: "15 กันยายน",
      event: "ยุบรวมกับ อบต.บ้านโพธิ์",
      area: "7.17 ตารางกิโลเมตร"
    }
  ];

  return (
    <div
      className="w-full min-h-screen py-8 px-2 md:px-8 flex flex-col items-center bg-transparent"
      style={{
        backgroundImage:
          'linear-gradient(180deg, rgba(239, 228, 212, 0.6) 0%, rgba(1, 189, 204, 0.6) 100%), url("/image/Boat.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Header Section */}
      <div className="w-full max-w-[1268px] flex flex-col gap-4 mb-8">
        <div className="bg-gradient-to-r from-[#03bdca] to-[#01bdcc] rounded-[36px] shadow-lg w-full flex flex-col md:flex-row items-center px-6 py-6 relative backdrop-blur-sm">
          <div className="bg-white rounded-full shadow-md w-32 h-16 flex items-center justify-center mb-4 md:mb-0 md:absolute md:left-6 md:top-1/2 md:-translate-y-1/2 border-2 border-[#01bdcc]">
            <span className="text-[#01385f] font-bold text-2xl tracking-wide">
              BP
            </span>
          </div>
          <div className="flex-1 flex flex-wrap flex-row items-center justify-center gap-6 md:gap-12 md:ml-40">
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              เทศบาลตำบลบ้านโพธิ์
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              ประวัติความเป็นมา
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              อำเภอบ้านโพธิ์
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white bg-opacity-90 rounded-2xl shadow-md p-4 backdrop-blur-sm">
          <div className="flex flex-wrap gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeSection === section.id
                    ? 'bg-[#01bdcc] text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{section.icon}</span>
                {section.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full max-w-[1268px]">
        {activeSection === "history" && (
          <div className="space-y-8">
            {/* Timeline Section */}
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-[#01385f] mb-6 text-center">
                เส้นทางประวัติศาสตร์เทศบาลตำบลบ้านโพธิ์
              </h2>
              
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[#01bdcc]"></div>
                
                {timelineEvents.map((event, index) => (
                  <div key={index} className="relative flex items-start mb-8 last:mb-0">
                    <div className="flex-shrink-0 w-16 h-16 bg-[#01bdcc] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg z-10">
                      {event.year}
                    </div>
                    <div className="ml-6 bg-blue-50 rounded-lg p-6 flex-1 shadow-sm">
                      <div className="text-sm text-gray-500 mb-1">{event.date}</div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{event.event}</h3>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">พื้นที่:</span> {event.area}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* History Details */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              {Object.entries(historyData).map(([key, section]) => (
                <div key={key} className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-[#01385f] mb-4 border-b border-gray-200 pb-2">
                    {section.title}
                  </h3>
                  <div className="space-y-4">
                    {section.content.map((paragraph, index) => (
                      <p key={index} className="text-gray-700 leading-relaxed text-justify">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "location" && (
          <div className="space-y-6">
            {/* Location Overview */}
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-[#01385f] mb-6 text-center">
                ลักษณะที่ตั้งและอาณาเขต
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">ที่ตั้ง</h3>
                  <p className="text-gray-700 leading-relaxed">{locationData.location}</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">พื้นที่</h3>
                  <p className="text-2xl font-bold text-[#01bdcc]">{locationData.area}</p>
                </div>
              </div>
            </div>

            {/* Boundaries */}
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-[#01385f] mb-6 text-center">
                อาณาเขตติดต่อ
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {locationData.boundaries.map((boundary, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#01bdcc] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">{boundary.direction}</h4>
                      <p className="text-gray-600 text-sm">{boundary.border}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-[#01385f] mb-6 text-center">
                แผนที่เขตพื้นที่
              </h3>
              
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">🗺️</div>
                  <p className="text-lg font-medium">แผนที่เขตพื้นที่เทศบาลตำบลบ้านโพธิ์</p>
                  <p className="text-sm">พื้นที่ 7.17 ตารางกิโลเมตร</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Information */}
      <div className="w-full max-w-[1268px] mt-8">
        <div className="bg-white bg-opacity-90 rounded-2xl shadow-md p-6 backdrop-blur-sm text-center">
          <h4 className="text-lg font-semibold text-[#01385f] mb-2">
            เทศบาลตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา
          </h4>
          <p className="text-gray-600 text-sm">
            ให้บริการประชาชนด้วยใจ เพื่อการพัฒนาท้องถิ่นอย่างยั่งยืน
          </p>
        </div>
      </div>
    </div>
  );
}