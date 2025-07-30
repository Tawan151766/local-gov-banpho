"use client";
import { useState } from "react";

export default function DemographicsPage() {
  const [activeSection, setActiveSection] = useState("demographics");

  const sections = [
    {
      id: "demographics",
      title: "สถิติประชากรและบ้าน",
      icon: "👥"
    },
    {
      id: "education",
      title: "การศึกษา",
      icon: "📚"
    },
    {
      id: "religion",
      title: "ศาสนา",
      icon: "🙏"
    },
    {
      id: "culture",
      title: "ศิลปวัฒนธรรมประเพณี",
      icon: "🎭"
    },
    {
      id: "sports",
      title: "กีฬานันทนาการ",
      icon: "⚽"
    },
    {
      id: "health",
      title: "สาธารณสุข",
      icon: "🏥"
    },
    {
      id: "disaster",
      title: "ป้องกันสาธารณภัย",
      icon: "🚒"
    },
    {
      id: "environment",
      title: "สิ่งแวดล้อม",
      icon: "🌱"
    },
    {
      id: "politics",
      title: "การเมืองการบริหาร",
      icon: "🏛️"
    }
  ];

  const populationData = [
    {
      village: "หมู่ที่ 1 สนามจันทร์",
      male: 825,
      female: 842,
      total: 1667,
      houses: 983
    },
    {
      village: "หมู่ที่ 2 คลองหลอดยอ",
      male: 317,
      female: 311,
      total: 628,
      houses: 266
    },
    {
      village: "หมู่ที่ 3 คลองชวดแค",
      male: 152,
      female: 185,
      total: 337,
      houses: 107
    },
    {
      village: "หมู่ที่ 4 ตลาดทด",
      male: 97,
      female: 89,
      total: 186,
      houses: 69
    }
  ];

  const totalPopulation = {
    male: 1391,
    female: 1427,
    total: 2818,
    houses: 1425
  };

  const educationInstitutions = [
    {
      category: "สังกัดสำนักงานเขตพื้นที่การศึกษา",
      institutions: [
        "โรงเรียนวัดสนามจันทร์",
        "โรงเรียนวิทยาราษฎร์รังสรรค์"
      ]
    },
    {
      category: "สังกัดสำนักงานเทศบาลตำบลบ้านโพธิ์",
      institutions: [
        "ศูนย์พัฒนาเด็กเล็ก"
      ]
    },
    {
      category: "สังกัดศูนย์การศึกษานอกระบบและการศึกษาตามอัธยาศัยอำเภอบ้านโพธิ์",
      institutions: []
    }
  ];

  const traditions = [
    {
      name: "ประเพณีวันสงกรานต์",
      month: "เมษายน",
      activities: "จัดพิธีสรงน้ำพระรดน้ำดำหัวผู้สูงอายุและการเล่นพื้นบ้าน"
    },
    {
      name: "ประเพณีวันลอยกระทง",
      month: "พฤศจิกายน",
      activities: "จัดงานประกวดกระทง ประกวดนางนพมาศ"
    },
    {
      name: "ประเพณีวันขึ้นปีใหม่",
      month: "มกราคม",
      activities: "จัดทำพิธีการทำบุญตักบาตรข้าวสารอาหารแห้ง และถวายจตุปัจจัยไทยธรรมแด่พระสงฆ์"
    },
    {
      name: "ประเพณีการจัดงานวันเทศบาล",
      month: "เมษายน",
      activities: "จัดพิธีการทำบุญตักบาตร และจัดกิจกรรมอื่น ๆ"
    },
    {
      name: "ประเพณีวันวิสาขบูชา",
      month: "พฤษภาคม",
      activities: "จัดพิธีการทำบุญตักบาตร และมีการเวียนเทียนที่วัดในตอนกลางคืน"
    },
    {
      name: "ประเพณีวันเข้าพรรษา",
      month: "กรกฎาคม",
      activities: "จัดพิธีแห่เทียนเข้าพรรษาและจัดพิธีการทำบุญตักบาตร"
    },
    {
      name: "ประเพณีวันออกพรรษา",
      month: "ตุลาคม",
      activities: "จัดพิธีการทำบุญตักบาตรเทโว"
    },
    {
      name: "งานต้อนรับขบวนแห่หลวงพ่อพุทธโสธรกลางน้ำ",
      month: "-",
      activities: "จัดขบวนต้อนรับ และปิดทองหลวงพ่อพุทธโสธรในเรือ"
    },
    {
      name: "การจัดงานประจำปีเจ้าพ่อโหรา",
      month: "-",
      activities: "จัดพิธีไหว้เจ้าพ่อ และมีมหกรรมสมโภช 2 คืน"
    },
    {
      name: "งานประจำปีวัดสนามจันทร์",
      month: "-",
      activities: "จัดแสดงการละเล่นและแสดงมหรสพ"
    }
  ];

  const sportsVenues = [
    {
      type: "สนามฟุตบอล",
      count: 2,
      locations: ["โรงเรียนวัดสนามจันทร์", "โรงเรียนวิทยาราษฎร์รังสรรค์"]
    },
    {
      type: "สนามบาสเก็ตบอล",
      count: 4,
      locations: ["โรงเรียนวัดสนามจันทร์", "โรงเรียนวิทยาราษฎร์รังสรรค์", "ที่ว่าการอำเภอบ้านโพธิ์", "โรงพยาบาลบ้านโพธิ์"]
    },
    {
      type: "สนามตระกร้อ",
      count: 4,
      locations: ["โรงเรียนวัดสนามจันทร์", "โรงเรียนวิทยาราษฎร์รังสรรค์", "ที่ว่าการอำเภอบ้านโพธิ์", "โรงพยาบาลบ้านโพธิ์"]
    },
    {
      type: "ห้องสมุดประชาชน",
      count: 1,
      locations: ["ห้องสมุดประชาชนอำเภอบ้านโพธิ์"]
    },
    {
      type: "สวนสาธารณะ/สุขภาพ",
      count: 2,
      locations: ["ที่ว่าการอำเภอบ้านโพธิ์", "โรงพยาบาลบ้านโพธิ์"]
    },
    {
      type: "สนามเด็กเล่น",
      count: 2,
      locations: ["โรงเรียนวัดสนามจันทร์", "ที่ว่าการอำเภอบ้านโพธิ์"]
    }
  ];

  const healthFacilities = [
    {
      name: "โรงพยาบาลบ้านโพธิ์",
      type: "สังกัดกระทรวงสาธารณสุข",
      beds: 50
    },
    {
      name: "ศูนย์สาธารณสุขมูลฐานชุมชน (ศสมช.)",
      type: "ศูนย์สาธารณสุข",
      count: 3
    },
    {
      name: "คลินิกเอกชน",
      type: "เอกชน",
      count: 1
    }
  ];

  const disasterData = {
    fireIncidents: 20,
    year: "2552",
    fireEngineCapacity: "8,000 ลิตร",
    fireEngineYear: "2534",
    fireEnginePrice: "1,297,770 บาท",
    waterTruckCapacity: "12,000 ลบ.ม.",
    waterTruckYear: "2545",
    waterTruckPrice: "1,995,000 บาท",
    portableExtinguishers: 3,
    firePersonnel: 5,
    volunteers: 20,
    drills: 6
  };

  const waterSources = [
    "คลองหลอดตาอู๋",
    "คลองชวดแค",
    "คลองตาโต",
    "คลองหลอดยอ",
    "คลองตาแดง",
    "คลองบ้านโพธิ์",
    "คลองนาล่าง",
    "คลองสนามจันทร์"
  ];

  const wasteData = {
    truck1Capacity: "4 ลบ.หลา",
    truck1Year: "2534",
    truck2Capacity: "15 ลบ.หลา", 
    truck2Year: "2542",
    privateCost: "35,000 บาทต่อเดือน"
  };

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
              DATA
            </span>
          </div>
          <div className="flex-1 flex flex-wrap flex-row items-center justify-center gap-6 md:gap-12 md:ml-40">
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              สถิติข้อมูล
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              ประชากรและสังคม
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              เมษายน 2565
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white bg-opacity-90 rounded-2xl shadow-md p-4 backdrop-blur-sm">
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-2 py-2 rounded-lg text-xs font-medium transition-colors flex flex-col items-center gap-1 ${
                  activeSection === section.id
                    ? 'bg-[#01bdcc] text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="text-sm">{section.icon}</span>
                <span className="text-center leading-tight text-xs">{section.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full max-w-[1268px]">
        {activeSection === "demographics" && (
          <div className="space-y-6">
            {/* Population Overview */}
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-[#01385f] mb-6 text-center">
                สถิติประชากรและบ้าน
              </h2>
              
              <div className="text-center mb-6">
                <p className="text-gray-600">พื้นที่ ตำบลบ้านโพธิ์ ท้องถิ่นเทศบาลตำบลบ้านโพธิ์ จังหวัดฉะเชิงเทรา</p>
                <p className="text-gray-600 font-semibold">เดือน เมษายน 2565</p>
              </div>

              {/* Total Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-100 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{totalPopulation.male}</div>
                  <div className="text-sm text-gray-600">ชาย</div>
                </div>
                <div className="bg-pink-100 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-pink-600 mb-1">{totalPopulation.female}</div>
                  <div className="text-sm text-gray-600">หญิง</div>
                </div>
                <div className="bg-green-100 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">{totalPopulation.total}</div>
                  <div className="text-sm text-gray-600">รวมประชากร</div>
                </div>
                <div className="bg-orange-100 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-1">{totalPopulation.houses}</div>
                  <div className="text-sm text-gray-600">บ้านรวม</div>
                </div>
              </div>

              {/* Population by Village */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#01385f] text-center mb-4">รายละเอียดตามหมู่บ้าน</h3>
                
                {populationData.map((village, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">{village.village}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">{village.male}</div>
                        <div className="text-xs text-gray-600">ชาย</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-pink-600">{village.female}</div>
                        <div className="text-xs text-gray-600">หญิง</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600">{village.total}</div>
                        <div className="text-xs text-gray-600">รวม</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-orange-600">{village.houses}</div>
                        <div className="text-xs text-gray-600">บ้าน</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === "education" && (
          <div className="space-y-6">
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-[#01385f] mb-6 text-center">
                การศึกษา
              </h2>
              
              <p className="text-gray-700 text-center mb-6">
                ในพื้นที่เขตเทศบาลตำบลบ้านโพธิ์ มีสถานศึกษาในสังกัดต่างๆ ดังนี้
              </p>

              <div className="space-y-6">
                {educationInstitutions.map((category, index) => (
                  <div key={index} className="bg-blue-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">{category.category}</h3>
                    {category.institutions.length > 0 ? (
                      <div className="space-y-2">
                        {category.institutions.map((institution, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <span className="text-blue-600 font-bold">-</span>
                            <span className="text-gray-700">{institution}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 italic">ไม่ระบุสถานศึกษา</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === "religion" && (
          <div className="space-y-6">
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-[#01385f] mb-6 text-center">
                ศาสนา
              </h2>
              
              <div className="bg-yellow-50 rounded-lg p-6 text-center">
                <div className="text-gray-700 leading-relaxed mb-4">
                  <p>ประชากรทั้งหมดในเขตเทศบาลตำบลบ้านโพธิ์ ร้อยละ 100 นับถือศาสนาพุทธ และมีวัด จำนวน 1 วัด คือวัดสนามจันทร์</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">🙏</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">ศาสนาพุทธ</h3>
                    <p className="text-gray-600">100% ของประชากร</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">🏛️</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">วัดสนามจันทร์</h3>
                    <p className="text-gray-600">วัดเดียวในเขตเทศบาล</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "culture" && (
          <div className="space-y-6">
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-[#01385f] mb-6 text-center">
                ศิลปวัฒนธรรมประเพณี
              </h2>
              
              <p className="text-gray-700 text-center mb-6">
                ประเพณีท้องถิ่นที่สำคัญของเทศบาลตำบลบ้านโพธิ์ (เรียงตามลำดับความสำคัญ จากมากที่สุดไปหาน้อยที่สุด)
              </p>

              <div className="space-y-4">
                {traditions.map((tradition, index) => (
                  <div key={index} className="bg-purple-50 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-800 flex-1">{tradition.name}</h3>
                      {tradition.month !== "-" && (
                        <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-medium ml-4">
                          {tradition.month}
                        </span>
                      )}
                    </div>
                    <div className="text-gray-700 text-sm">
                      <span className="font-medium">กิจกรรมสังเขป:</span> {tradition.activities}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === "sports" && (
          <div className="space-y-6">
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-[#01385f] mb-6 text-center">
                กีฬา นันทนาการ / พักผ่อน
              </h2>
              
              <p className="text-gray-700 text-center mb-6">
                ในพื้นที่เขตเทศบาลตำบลบ้านโพธิ์ มีสถานที่พักผ่อนหย่อนใจ และนันทนาการต่างๆ ดังนี้
              </p>

              <div className="space-y-6">
                {sportsVenues.map((venue, index) => (
                  <div key={index} className="bg-green-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-800">{venue.type}</h3>
                      <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                        {venue.count} แห่ง
                      </span>
                    </div>
                    <div className="space-y-2">
                      {venue.locations.map((location, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <span className="text-green-600 font-bold">-</span>
                          <span className="text-gray-700 text-sm">{location}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === "health" && (
          <div className="space-y-6">
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-[#01385f] mb-6 text-center">
                สาธารณสุข
              </h2>
              
              <p className="text-gray-700 text-center mb-6">
                โรงพยาบาล / สถานพยาบาลในเขตพื้นที่เทศบาลตำบลบ้านโพธิ์
              </p>

              <div className="space-y-4">
                <div className="bg-red-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">สังกัดกระทรวงสาธารณสุข จำนวน 1 แห่ง ได้แก่</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">โรงพยาบาลบ้านโพธิ์</h4>
                      <p className="text-sm text-gray-600">เตียงคนไข้ จำนวน 50 เตียง</p>
                    </div>
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                      50 เตียง
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-2">ศูนย์สาธารณสุขมูลฐานชุมชน (ศสมช.)</h3>
                  <p className="text-gray-700">จำนวน 3 แห่ง</p>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-2">คลินิกเอกชน</h3>
                  <p className="text-gray-700">จำนวน 1 แห่ง</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "disaster" && (
          <div className="space-y-6">
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-[#01385f] mb-6 text-center">
                การป้องกันและบรรเทาสาธารณภัย
              </h2>

              {/* Fire Statistics */}
              <div className="bg-red-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-red-800 mb-4">สถิติเพลิงไหม้ในรอบปี พ.ศ. {disasterData.year}</h3>
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">{disasterData.fireIncidents}</div>
                  <div className="text-gray-700">ครั้งที่ออกปฏิบัติงานดับเพลิง</div>
                </div>
              </div>

              {/* Equipment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-orange-50 rounded-lg p-6">
                  <h4 className="font-semibold text-orange-800 mb-3">รถยนต์ดับเพลิง จำนวน 1 คัน</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>จุน้ำได้ {disasterData.fireEngineCapacity}</p>
                    <p>ซื้อเมื่อ พ.ศ. {disasterData.fireEngineYear}</p>
                    <p>ราคา {disasterData.fireEnginePrice}</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6">
                  <h4 className="font-semibold text-blue-800 mb-3">รถบรรทุกน้ำ จำนวน 1 คัน</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>จุน้ำได้ {disasterData.waterTruckCapacity}</p>
                    <p>ซื้อเมื่อ พ.ศ. {disasterData.waterTruckYear}</p>
                    <p>ราคา {disasterData.waterTruckPrice}</p>
                  </div>
                </div>
              </div>

              {/* Personnel and Equipment */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-yellow-100 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600 mb-1">{disasterData.portableExtinguishers}</div>
                  <div className="text-xs text-gray-600">เครื่องดับเพลิงหาบหาม</div>
                </div>
                <div className="bg-green-100 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">{disasterData.firePersonnel}</div>
                  <div className="text-xs text-gray-600">พนักงานดับเพลิง</div>
                </div>
                <div className="bg-purple-100 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">{disasterData.volunteers}</div>
                  <div className="text-xs text-gray-600">อาสาสมัครป้องกันภัย</div>
                </div>
                <div className="bg-indigo-100 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-indigo-600 mb-1">{disasterData.drills}</div>
                  <div className="text-xs text-gray-600">การฝึกซ้อมปี {disasterData.year}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "environment" && (
          <div className="space-y-6">
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-[#01385f] mb-6 text-center">
                สิ่งแวดล้อมและทรัพยากรธรรมชาติ
              </h2>

              {/* Climate */}
              <div className="bg-orange-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-orange-800 mb-4">ภูมิอากาศ</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-1">34°C</div>
                    <div className="text-gray-700">อุณหภูมิสูงสุดเฉลี่ย</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">26°C</div>
                    <div className="text-gray-700">อุณหภูมิต่ำสุดเฉลี่ย</div>
                  </div>
                </div>
              </div>

              {/* Water Sources */}
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-blue-800 mb-4">แหล่งน้ำ - คลอง ลำธาร ห้วย จำนวน 8 แห่ง ดังนี้</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {waterSources.map((source, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 text-center">
                      <span className="text-sm text-gray-700">{index + 1}. {source}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Waste Management */}
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="font-semibold text-green-800 mb-4">การจัดการขยะ</h3>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-800 mb-3">รถยนต์ที่ใช้จัดเก็บขยะ รวม 2 คัน</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white rounded-lg p-4">
                      <h5 className="font-medium text-gray-800 mb-2">รถเก็บขนขยะ คันที่ 1</h5>
                      <div className="text-sm text-gray-700 space-y-1">
                        <p>ขนาดความจุ {wasteData.truck1Capacity}</p>
                        <p>ซื้อเมื่อ พ.ศ. {wasteData.truck1Year}</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <h5 className="font-medium text-gray-800 mb-2">รถเก็บขนขยะ คันที่ 2</h5>
                      <div className="text-sm text-gray-700 space-y-1">
                        <p>ขนาดความจุ {wasteData.truck2Capacity}</p>
                        <p>ซื้อเมื่อ พ.ศ. {wasteData.truck2Year}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">การจัดการฝังกลบขยะมูลฝอย</h4>
                  <p className="text-gray-700 text-sm">
                    เทศบาลตำบลบ้านโพธิ์ ได้จ้างเหมาเอกชนจัดการฝังกลบขยะมูลฝอย โดยเทศบาลตำบลบ้านโพธิ์ จ่ายค่าจ้างเหมาเอกชนในการจัดการฝังกลบ ขยะมูลฝอยเป็นเงิน {wasteData.privateCost}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "politics" && (
          <div className="space-y-6">
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-[#01385f] mb-6 text-center">
                การเมืองการบริหาร
              </h2>

              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="font-semibold text-purple-800 mb-6 text-center">การบริหาร</h3>
                <p className="text-gray-700 text-center mb-6">
                  องค์ประกอบในการบริหารงานของเทศบาล มีดังนี้
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">👨‍💼</span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-800 mb-2">คณะผู้บริหารเทศบาล</h4>
                    <div className="text-3xl font-bold text-purple-600 mb-1">5</div>
                    <div className="text-sm text-gray-600">คน</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">🏛️</span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-800 mb-2">สมาชิกสภาเทศบาล</h4>
                    <div className="text-3xl font-bold text-blue-600 mb-1">12</div>
                    <div className="text-sm text-gray-600">คน</div>
                  </div>
                </div>

                <div className="mt-8 bg-white rounded-lg p-6">
                  <h4 className="font-semibold text-gray-800 mb-4 text-center">โครงสร้างการบริหาร</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <span className="text-purple-600 font-bold">•</span>
                      <span className="text-gray-700 text-sm">ฝ่ายบริหาร: คณะผู้บริหารเทศบาล</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold">•</span>
                      <span className="text-gray-700 text-sm">ฝ่ายนิติบัญญัติ: สภาเทศบาล</span>
                    </div>
                  </div>
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
            สถิติประชากรและข้อมูลสังคมเทศบาลตำบลบ้านโพธิ์
          </h4>
          <p className="text-gray-600 text-sm">
            ข้อมูลประชากร การศึกษา วัฒนธรรม และการบริหารจัดการท้องถิ่น ณ เมษายน 2565
          </p>
        </div>
      </div>
    </div>
  );
}