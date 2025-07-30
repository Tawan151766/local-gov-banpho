"use client";
import { useState } from "react";

export default function GeneralOverviewPage() {
  const [activeSection, setActiveSection] = useState("administration");

  const sections = [
    {
      id: "administration",
      title: "เขตการปกครองและการบริหาร",
      icon: "🏛️"
    },
    {
      id: "geography",
      title: "ลักษณะภูมิประเทศ",
      icon: "🗺️"
    },
    {
      id: "climate",
      title: "ลักษณะภูมิอากาศ",
      icon: "🌤️"
    },
    {
      id: "population",
      title: "การตั้งถิ่นฐานและการประกอบอาชีพ",
      icon: "👥"
    }
  ];

  const communities = [
    { id: 1, name: "ชุมชน 1 หัวทด", description: "ชุมชนหัวทด" },
    { id: 2, name: "ชุมชน 2 หัวสวน", description: "ชุมชนหัวสวน" },
    { id: 3, name: "ชุมชน 3 ชลประทาน", description: "ชุมชนชลประทาน" },
    { id: 4, name: "ชุมชน 4 บ้านคลองชวดแค", description: "ชุมชนบ้านคลองชวดแค" },
    { id: 5, name: "ชุมชน 5 บ้านตลาดทด", description: "ชุมชนบ้านตลาดทด" },
    { id: 6, name: "ชุมชน 6 หนองสามพระยา", description: "ชุมชนหนองสามพระยา" }
  ];

  const canals = [
    "คลองหลอดตาอู๋",
    "คลองชวดแค", 
    "คลองตาโต",
    "คลองหลอดยอ",
    "คลองตาแดง",
    "คลองบ้านโพธิ์",
    "คลองนาล่าง",
    "คลองสนามจันทร์"
  ];

  const occupations = [
    {
      type: "ค้าขาย",
      description: "ประชากรส่วนใหญ่ประกอบอาชีพค้าขาย",
      icon: "🏪"
    },
    {
      type: "เกษตรกรรม",
      description: "ทำนา ทำสวน และเพาะเลี้ยงสัตว์น้ำ",
      icon: "🌾"
    }
  ];

  const challenges = [
    "น้ำในแม่น้ำบางปะกงมีความเค็มนานถึงปีละ 6-8 เดือน",
    "ดินมีสภาพเค็มและเป็นกรด",  
    "ขาดความสมบูรณ์ในการทำนา ทำสวนและปลูกพืชไร่",
    "น้ำในดินมีความเค็มสูง"
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
              INFO
            </span>
          </div>
          <div className="flex-1 flex flex-wrap flex-row items-center justify-center gap-6 md:gap-12 md:ml-40">
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              สภาพทั่วไป
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              เทศบาลตำบลบ้านโพธิ์
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              ข้อมูลพื้นฐาน
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white bg-opacity-90 rounded-2xl shadow-md p-4 backdrop-blur-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors flex flex-col items-center gap-1 ${
                  activeSection === section.id
                    ? 'bg-[#01bdcc] text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{section.icon}</span>
                <span className="text-center leading-tight">{section.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full max-w-[1268px]">
        {activeSection === "administration" && (
          <div className="space-y-6">
            {/* Overview */}
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-[#01385f] mb-6 text-center">
                เขตการปกครองและการบริหาร
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">4</div>
                  <div className="text-gray-700 font-medium">หมู่บ้าน</div>
                </div>
                <div className="bg-green-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">6</div>
                  <div className="text-gray-700 font-medium">ชุมชน</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">7.17</div>
                  <div className="text-gray-700 font-medium">ตารางกิโลเมตร</div>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed text-center mb-6">
                เทศบาลตำบลบ้านโพธิ์มีเขตพื้นที่ครอบคลุม 4 หมู่บ้าน 6 ชุมชน
              </p>
            </div>

            {/* Communities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {communities.map((community) => (
                <div key={community.id} className="bg-white bg-opacity-95 rounded-xl shadow-lg p-6 backdrop-blur-sm hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-[#01bdcc] rounded-full flex items-center justify-center text-white font-bold">
                      {community.id}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm leading-tight">
                        {community.name}
                      </h3>
                    </div>
                  </div>
                  <div className="text-gray-600 text-sm">
                    พื้นที่ชุมชนในเขตเทศบาลตำบลบ้านโพธิ์
                  </div>
                </div>
              ))}
            </div>

            {/* Administrative Structure */}
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-[#01385f] mb-6 text-center">
                โครงสร้างการบริหาร
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">👨‍💼</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">นายกเทศมนตรี</h4>
                  <p className="text-gray-600 text-sm">ผู้บริหารสูงสุดของเทศบาล</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🏛️</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">สภาเทศบาล</h4>
                  <p className="text-gray-600 text-sm">อำนาจนิติบัญญัติและควบคุม</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⚙️</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">ส่วนราชการ</h4>
                  <p className="text-gray-600 text-sm">หน่วยงานปฏิบัติการ</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "geography" && (
          <div className="space-y-6">
            {/* Geography Overview */}
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-[#01385f] mb-6 text-center">
                ลักษณะภูมิประเทศ
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">ลักษณะพื้นที่</h3>
                  <div className="space-y-3 text-gray-700">
                    <p className="flex items-start gap-2">
                      <span className="text-[#01bdcc] font-bold">•</span>
                      <span>เป็นที่ราบลุ่มแม่น้ำ</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-[#01bdcc] font-bold">•</span>
                      <span>มีแม่น้ำบางปะกงไหลผ่านด้านทิศตะวันตก</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-[#01bdcc] font-bold">•</span>
                      <span>อยู่ในพื้นที่โครงการชลประทานจังหวัดฉะเชิงเทรา</span>
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">ลำคลอง</h3>
                  <p className="text-gray-700 mb-3">มีลำคลอง 8 แห่ง ไหลผ่านพื้นที่ลงสู่แม่น้ำบางปะกง</p>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-center text-2xl font-bold text-blue-600 mb-2">8</div>
                    <div className="text-center text-gray-700 font-medium">ลำคลอง</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Canals List */}
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-[#01385f] mb-6 text-center">
                ลำคลองที่ไหลผ่านพื้นที่
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {canals.map((canal, index) => (
                  <div key={index} className="bg-blue-50 rounded-lg p-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="text-gray-700 text-sm font-medium">{canal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Water System */}
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-[#01385f] mb-6 text-center">
                ระบบน้ำ
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🏞️</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">แม่น้ำบางปะกง</h4>
                  <p className="text-gray-600 text-sm">แหล่งน้ำหลักด้านทิศตะวันตก</p>
                </div>
                
                <div>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🌊</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">ลำคลอง</h4>
                  <p className="text-gray-600 text-sm">ระบบชลประทานและระบายน้ำ</p>
                </div>
                
                <div>
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🚰</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">โครงการชลประทาน</h4>
                  <p className="text-gray-600 text-sm">จังหวัดฉะเชิงเทรา</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "climate" && (
          <div className="space-y-6">
            {/* Climate Overview */}
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-[#01385f] mb-6 text-center">
                ลักษณะภูมิอากาศ
              </h2>
              
              <div className="text-center mb-8">
                <p className="text-gray-700 leading-relaxed">
                  เทศบาลตำบลบ้านโพธิ์อยู่ในเขตมรสุม ได้รับอิทธิพลจากลมทะเลประจำถิ่นภาคตะวันออกของประเทศ
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-orange-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🌡️</span>
                    อุณหภูมิ
                  </h3>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">26.9-32°C</div>
                    <div className="text-gray-700">อุณหภูมิเฉลี่ยตลอดปี</div>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🌧️</span>
                    ปริมาณน้ำฝน
                  </h3>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">1,156.2</div>
                    <div className="text-gray-700">มิลลิเมตร/ปี</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Seasons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white bg-opacity-95 rounded-xl shadow-lg p-6 backdrop-blur-sm">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">☀️</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">ฤดูร้อน</h3>
                </div>
                <p className="text-gray-700 text-sm text-center">
                  อากาศร้อนจัด
                </p>
              </div>
              
              <div className="bg-white bg-opacity-95 rounded-xl shadow-lg p-6 backdrop-blur-sm">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🌧️</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">ฤดูฝน</h3>
                </div>
                <p className="text-gray-700 text-sm text-center">
                  มีฝนตกชุก ปริมาณน้ำฝนเฉลี่ย 1,156.2 มม./ปี
                </p>
              </div>
              
              <div className="bg-white bg-opacity-95 rounded-xl shadow-lg p-6 backdrop-blur-sm">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🌤️</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">ฤดูหนาว</h3>
                </div>
                <p className="text-gray-700 text-sm text-center">
                  อากาศไม่หนาวจัด
                </p>
              </div>
            </div>

            {/* Climate Influence */}
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-[#01385f] mb-6 text-center">
                ปัจจัยที่มีอิทธิพลต่อภูมิอากาศ
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
                    <span className="text-xl">🌊</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">ลมมรสุม</h4>
                    <p className="text-gray-600 text-sm">อยู่ในเขตมรสุมที่ได้รับอิทธิพลจากลมทะเล</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
                    <span className="text-xl">🗺️</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">ภาคตะวันออก</h4>
                    <p className="text-gray-600 text-sm">ตั้งอยู่ในภาคตะวันออกของประเทศไทย</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "population" && (
          <div className="space-y-6">
            {/* Population Overview */}
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-[#01385f] mb-6 text-center">
                การตั้งถิ่นฐานและการประกอบอาชีพของประชากร
              </h2>
              
              <p className="text-gray-700 leading-relaxed text-center mb-8">
                ประชากรส่วนใหญ่ของเทศบาลตำบลบ้านโพธิ์ ประกอบอาชีพค้าขายและเกษตรกรรม 
                เช่น ทำนา ทำสวน และเพาะเลี้ยงสัตว์น้ำ
              </p>
            </div>

            {/* Main Occupations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {occupations.map((occupation, index) => (
                <div key={index} className="bg-white bg-opacity-95 rounded-xl shadow-lg p-8 backdrop-blur-sm">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">{occupation.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{occupation.type}</h3>
                  </div>
                  <p className="text-gray-700 text-center leading-relaxed">
                    {occupation.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Agricultural Details */}
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-[#01385f] mb-6 text-center">
                กิจกรรมทางการเกษตร
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🌾</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">ทำนา</h4>
                  <p className="text-gray-600 text-sm">การปลูกข้าวในพื้นที่</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🌳</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">ทำสวน</h4>
                  <p className="text-gray-600 text-sm">การปลูกพืชสวนและผลไม้</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🐟</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">เพาะเลี้ยงสัตว์น้ำ</h4>
                  <p className="text-gray-600 text-sm">การเลี้ยงปลาและสัตว์น้ำ</p>
                </div>
              </div>
            </div>

            {/* Challenges */}
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-[#01385f] mb-6 text-center">
                ปัญหาและอุปสรรคทางการเกษตร
              </h3>
              
              <div className="bg-red-50 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-red-800 mb-4 flex items-center gap-2">
                  <span className="text-xl">⚠️</span>
                  ปัญหาน้ำเค็ม
                </h4>
                <div className="space-y-3">
                  {challenges.map((challenge, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="text-red-600 font-bold mt-1">•</span>
                      <span className="text-gray-700 text-sm">{challenge}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-red-50 rounded-lg p-6">
                <h4 className="font-semibold text-red-800 mb-4 flex items-center gap-2">
                  <span className="text-xl">⚠️</span>
                  ปัญหาน้ำเค็ม
                </h4>
                <div className="text-gray-700 leading-relaxed text-justify">
                  <p>
                    แต่เนื่องจากน้ำในแม่น้ำบางปะกง มีความเค็มนานถึง ปีละ 6 - 8 เดือน ทำให้ดินมีสภาพเค็มและเป็นกรด 
                    ขาดความสมบูรณ์ในการทำนา ทำสวนและปลูกพืชไร่อย่างอื่น รวมทั้งน้ำในดินมีความเค็มสูง
                  </p>
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
            สภาพทั่วไปเทศบาลตำบลบ้านโพธิ์
          </h4>
          <p className="text-gray-600 text-sm">
            ข้อมูลพื้นฐานเกี่ยวกับการปกครอง ภูมิศาสตร์ ภูมิอากาศ และการประกอบอาชีพของประชาชน
          </p>
        </div>
      </div>
    </div>
  );
}