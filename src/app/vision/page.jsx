"use client";
import { useState } from "react";

export default function VisionPage() {
  const [activeSection, setActiveSection] = useState("vision");

  const sections = [
    {
      id: "vision",
      title: "วิสัยทัศน์",
      icon: "🔮"
    },
    {
      id: "details",
      title: "รายละเอียดวิสัยทัศน์",
      icon: "📋"
    }
  ];

  const visionStatement = "บ้านเมืองน่าอยู่คู่เมืองหลวง ปวงประชามีคุณภาพ สภาพเศรษฐกิจยืนยง มั่นคงรวมใจพัฒนา";

  const visionDetails = [
    {
      id: "livable",
      title: "บ้านเมืองน่าอยู่คู่เมืองหลวง",
      content: "เทศบาลตำบลบ้านโพธิ์ มีภูมิทัศน์สวยงามริมฝั่งแม่น้ำบางปะกง เป็นสถานที่ท่องเที่ยว มีสาธารณูปโภคครบครัน มีความปลอดภัยในชีวิตและทรัพย์สิน เป็นศูนย์ราชการ ตั้งอยู่ใกล้กรุงเทพมหานคร และสนามบินสุวรรณภูมิ",
      color: "#28a745",
      highlights: [
        "ภูมิทัศน์สวยงามริมฝั่งแม่น้ำบางปะกง",
        "สถานที่ท่องเที่ยว",
        "สาธารณูปโภคครบครัน",
        "ความปลอดภัยในชีวิตและทรัพย์สิน",
        "ศูนย์ราชการ",
        "ใกล้กรุงเทพมหานคร และสนามบินสุวรรณภูมิ"
      ]
    },
    {
      id: "quality",
      title: "ปวงประชามีคุณภาพ",
      content: "ประชาชนมีการศึกษาดี มีความรู้ความสามารถสูง มีสุขภาพพลานามัยแข็งแรง สมบูรณ์และมีคุณธรรมประจำใจ",
      color: "#007bff",
      highlights: [
        "การศึกษาดี",
        "ความรู้ความสามารถสูง",
        "สุขภาพพลานามัยแข็งแรง",
        "สมบูรณ์และมีคุณธรรมประจำใจ"
      ]
    },
    {
      id: "economy",
      title: "สภาพเศรษฐกิจยืนยง",
      content: "ประชาชนมีอาชีพหลักและอาชีพเสริม รู้จักใช้เทคโนโลยี มีฐานะของครัวเรือนมั่นคง",
      color: "#ffc107",
      highlights: [
        "อาชีพหลักและอาชีพเสริม",
        "รู้จักใช้เทคโนโลยี",
        "ฐานะของครัวเรือนมั่นคง"
      ]
    },
    {
      id: "development",
      title: "มั่นคงรวมใจพัฒนา",
      content: "เทศบาลตำบลบ้านโพธิ์ เป็นชุมชนเมืองที่เข้มแข็ง ประชาชนร่วมคิด ร่วมทำ ร่วมปรับปรุง แก้ไขปัญหา ทำให้ท้องถิ่นเจริญก้าวหน้าอย่างยั่งยืนตลอดไป",
      color: "#dc3545",
      highlights: [
        "ชุมชนเมืองที่เข้มแข็ง",
        "ประชาชนร่วมคิด ร่วมทำ ร่วมปรับปรุง",
        "แก้ไขปัญหา",
        "ท้องถิ่นเจริญก้าวหน้าอย่างยั่งยืน"
      ]
    }
  ];

  const visionPillars = [
    {
      title: "ด้านสังคม",
      description: "บ้านเมืองน่าอยู่ ปลอดภัย มีคุณภาพชีวิตที่ดี",
      icon: "🏘️",
      color: "#28a745"
    },
    {
      title: "ด้านการศึกษา",
      description: "ประชาชนมีการศึกษาดี มีความรู้ความสามารถสูง",
      icon: "📚",
      color: "#007bff"
    },
    {
      title: "ด้านเศรษฐกิจ",
      description: "เศรษฐกิจยั่งยืน มีอาชีพมั่นคง ใช้เทคโนโลยี",
      icon: "💰",
      color: "#ffc107"
    },
    {
      title: "ด้านการพัฒนา",
      description: "ชุมชนเข้มแข็ง ประชาชนมีส่วนร่วม พัฒนาอย่างยั่งยืน",
      icon: "🤝",
      color: "#dc3545"
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
              วิสัย
            </span>
          </div>
          <div className="flex-1 flex flex-wrap flex-row items-center justify-center gap-6 md:gap-12 md:ml-40">
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              วิสัยทัศน์
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              เทศบาลตำบลบ้านโพธิ์
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              แนวทางการพัฒนา
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
        {activeSection === "vision" && (
          <div className="space-y-8">
            {/* Main Vision Statement */}
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm text-center">
              <h2 className="text-xl md:text-2xl font-bold text-[#01385f] mb-6">
                วิสัยทัศน์เทศบาลตำบลบ้านโพธิ์
              </h2>
              
              <div className="bg-gradient-to-r from-[#03bdca] to-[#01bdcc] rounded-xl p-8 text-white shadow-lg">
                <div className="text-2xl md:text-3xl font-bold leading-relaxed">
                  "{visionStatement}"
                </div>
              </div>
            </div>

            {/* Vision Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {visionPillars.map((pillar, index) => (
                <div key={index} className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-6 backdrop-blur-sm text-center transform hover:scale-105 transition-transform duration-300">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl"
                    style={{ backgroundColor: `${pillar.color}20`, border: `2px solid ${pillar.color}` }}
                  >
                    <span>{pillar.icon}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{pillar.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{pillar.description}</p>
                </div>
              ))}
            </div>

            {/* Vision Framework */}
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-[#01385f] mb-6 text-center">
                กรอบแนวคิดวิสัยทัศน์
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">เป้าหมายหลัก</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-[#01bdcc] font-bold">•</span>
                      <span>สร้างเมืองน่าอยู่ที่มีคุณภาพชีวิตดี</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#01bdcc] font-bold">•</span>
                      <span>พัฒนาประชาชนให้มีความรู้และคุณธรรม</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#01bdcc] font-bold">•</span>
                      <span>สร้างเศรษฐกิจที่เข้มแข็งและยั่งยืน</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#01bdcc] font-bold">•</span>
                      <span>ส่งเสริมการมีส่วนร่วมของประชาชน</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">จุดเด่นของเทศบาล</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>ที่ตั้งใกล้กรุงเทพฯ และสนามบินสุวรรณภูมิ</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>ภูมิทัศน์สวยงามริมแม่น้ำบางปะกง</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>เป็นศูนย์ราชการของอำเภอ</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>มีศักยภาพด้านการท่องเที่ยว</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "details" && (
          <div className="space-y-6">
            {/* Detailed Vision Explanation */}
            {visionDetails.map((detail, index) => (
              <div key={detail.id} className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: detail.color }}
                  >
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{detail.title}</h3>
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-6 text-justify">
                  {detail.content}
                </p>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">จุดเน้นสำคัญ</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {detail.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: detail.color }}
                        ></div>
                        <span className="text-gray-700 text-sm">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Implementation Strategy */}
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-[#01385f] mb-6 text-center">
                กลยุทธ์การขับเคลื่อนวิสัยทัศน์
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">การวางแผน</h4>
                  <p className="text-gray-600 text-sm">จัดทำแผนพัฒนาท้องถิ่นที่สอดคล้องกับวิสัยทัศน์</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">การปฏิบัติ</h4>
                  <p className="text-gray-600 text-sm">ดำเนินโครงการและกิจกรรมตามแผนที่กำหนด</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">การติดตาม</h4>
                  <p className="text-gray-600 text-sm">ประเมินผลและปรับปรุงการดำเนินงานอย่างต่อเนื่อง</p>
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
            วิสัยทัศน์เทศบาลตำบลบ้านโพธิ์
          </h4>
          <p className="text-gray-600 text-sm">
            มุ่งสู่การเป็นเมืองน่าอยู่ที่มีคุณภาพ เศรษฐกิจยั่งยืน และประชาชนมีส่วนร่วมในการพัฒนา
          </p>
        </div>
      </div>
    </div>
  );
}