"use client";
import React, { useState } from "react";
import { useSystemInfoValues } from "@/hooks/useSystemInfo";

// Define keys outside component to prevent re-creation
const SYSTEM_INFO_KEYS = [
  "organization_name",
  "phone",
  "email",
  "address",
  "fax",
];

// ข้อมูลสถานที่สำคัญ
// Replace the landmarks array in your component with this updated version:

const landmarks = [
  {
    id: "schools",
    title: "สถานศึกษา",
    icon: "🏫",
    color: "bg-blue-500",
    places: [
      {
        name: "โรงเรียนบ้านโพธิ์พิทยาคม",
        address: "หมู่ 1 ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา 24140",
        phone: "038-587-201",
        type: "โรงเรียนมัธยมศึกษา"
      },
      {
        name: "โรงเรียนวัดบ้านโพธิ์",
        address: "หมู่ 1 ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา 24140",
        phone: "038-587-302",
        type: "โรงเรียนประถมศึกษา"
      },
      {
        name: "โรงเรียนบ้านโพธิ์วิทยาลัย",
        address: "หมู่ 2 ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา 24140",
        phone: "038-587-401",
        type: "โรงเรียนมัธยมศึกษา"
      },
      {
        name: "ศูนย์พัฒนาเด็กเล็กเทศบาลตำบลบ้านโพธิ์",
        address: "หมู่ 1 ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา 24140",
        phone: "038-587-308",
        type: "ศูนย์พัฒนาเด็กเล็ก"
      },
      {
        name: "โรงเรียนบ้านคลองขาม",
        address: "หมู่ 3 ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา 24140",
        phone: "038-587-501",
        type: "โรงเรียนประถมศึกษา"
      }
    ]
  },
  {
    id: "temples",
    title: "วัด",
    icon: "🏯",
    color: "bg-orange-500",
    places: [
      {
        name: "วัดบ้านโพธิ์",
        address: "หมู่ 1 ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา 24140",
        phone: "038-587-101",
        type: "วัดหลวง"
      },
      {
        name: "วัดไผ่ล้อม",
        address: "หมู่ 2 ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา 24140",
        phone: "038-587-102",
        type: "วัดสามัญ"
      },
      {
        name: "วัดคลองขาม",
        address: "หมู่ 3 ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา 24140",
        phone: "038-587-103",
        type: "วัดสามัญ"
      },
      {
        name: "วัดป่าดงมะค่า",
        address: "หมู่ 4 ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา 24140",
        phone: "038-587-104",
        type: "วัดป่า"
      },
      {
        name: "วัดบางปะกง",
        address: "หมู่ 5 ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา 24140",
        phone: "038-587-105",
        type: "วัดสามัญ"
      }
    ]
  },
  {
    id: "hospitals",
    title: "สถานพยาบาล",
    icon: "🏥",
    color: "bg-red-500",
    places: [
      {
        name: "โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านโพธิ์",
        address: "หมู่ 1 ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา 24140",
        phone: "038-587-601",
        type: "โรงพยาบาลส่งเสริมสุขภาพตำบล"
      },
      {
        name: "สถานีอนามัยบ้านโพธิ์",
        address: "หมู่ 2 ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา 24140",
        phone: "038-587-602",
        type: "สถานีอนามัย"
      },
      {
        name: "คลินิกแพทย์บ้านโพธิ์",
        address: "หมู่ 1 ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา 24140",
        phone: "038-587-701",
        type: "คลินิกเอกชน"
      },
      {
        name: "ร้านขายยาบ้านโพธิ์เภสัช",
        address: "หมู่ 1 ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา 24140",
        phone: "038-587-702",
        type: "ร้านขายยา"
      }
    ]
  },
  {
    id: "post",
    title: "ไปรษณีย์",
    icon: "📮",
    color: "bg-green-500",
    places: [
      {
        name: "ที่ทำการไปรษณีย์บ้านโพธิ์",
        address: "หมู่ 1 ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา 24140",
        phone: "038-587-801",
        type: "ที่ทำการไปรษณีย์"
      },
      {
        name: "ตัวแทนไปรษณีย์บ้านโพธิ์",
        address: "หมู่ 2 ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา 24140",
        phone: "038-587-802",
        type: "ตัวแทนไปรษณีย์"
      }
    ]
  },
  {
    id: "water",
    title: "ประปา",
    icon: "💧",
    color: "bg-cyan-500",
    places: [
      {
        name: "การประปาส่วนภูมิภาคสาขาบ้านโพธิ์",
        address: "หมู่ 2 ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา 24140",
        phone: "038-587-901",
        type: "การประปาส่วนภูมิภาค"
      },
      {
        name: "ประปาเทศบาลตำบลบ้านโพธิ์",
        address: "หมู่ 1 ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา 24140",
        phone: "038-587-308 ต่อ 201",
        type: "ประปาเทศบาล"
      }
    ]
  },
  {
    id: "banks",
    title: "ธนาคาร",
    icon: "🏦",
    color: "bg-purple-500",
    places: [
      {
        name: "ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร สาขาบ้านโพธิ์",
        address: "หมู่ 1 ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา 24140",
        phone: "038-587-011",
        type: "ธนาคารเพื่อการเกษตร"
      },
      {
        name: "ธนาคารกรุงไทย สาขาย่อยบ้านโพธิ์",
        address: "หมู่ 1 ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา 24140",
        phone: "038-587-012",
        type: "ธนาคารพาณิชย์"
      },
      {
        name: "ธนาคารออมสิน สาขาบ้านโพธิ์",
        address: "หมู่ 2 ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา 24140",
        phone: "038-587-013",
        type: "ธนาคารออมสิน"
      },
      {
        name: "ธนาคารกสิกรไทย ตู้ ATM บ้านโพธิ์",
        address: "หมู่ 1 ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา 24140",
        phone: "02-888-8888",
        type: "ตู้ ATM"
      }
    ]
  },
  {
    id: "cooperative",
    title: "สหกรณ์การเกษตร",
    icon: "🌾",
    color: "bg-yellow-500",
    places: [
      {
        name: "สหกรณ์การเกษตรอำเภอบ้านโพธิ์ จำกัด",
        address: "หมู่ 1 ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา 24140",
        phone: "038-587-051",
        type: "สหกรณ์การเกษตร"
      },
      {
        name: "สหกรณ์ออมทรัพย์บ้านโพธิ์ จำกัด",
        address: "หมู่ 2 ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา 24140",
        phone: "038-587-052",
        type: "สหกรณ์ออมทรัพย์"
      },
      {
        name: "กลุ่มเกษตรกรปลูกข้าวอินทรีย์บ้านโพธิ์",
        address: "หมู่ 3 ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา 24140",
        phone: "038-587-053",
        type: "กลุ่มเกษตรกร"
      },
      {
        name: "วิสาหกิจชุมชนผลิตภัณฑ์จากข้าวบ้านโพธิ์",
        address: "หมู่ 4 ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา 24140",
        phone: "038-587-054",
        type: "วิสาหกิจชุมชน"
      }
    ]
  },
  {
    id: "government",
    title: "หน่วยงานราชการ",
    icon: "🏛️",
    color: "bg-indigo-500",
    places: [
      {
        name: "ที่ว่าการอำเภอบ้านโพธิ์",
        address: "หมู่ 1 ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา 24140",
        phone: "038-587-001",
        type: "ที่ว่าการอำเภอ"
      },
      {
        name: "สถานีตำรวจภูธรบ้านโพธิ์",
        address: "หมู่ 1 ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา 24140",
        phone: "038-587-191",
        type: "สถานีตำรวจ"
      },
      {
        name: "สำนักงานขนส่งจังหวัดฉะเชิงเทรา สาขาบ้านโพธิ์",
        address: "หมู่ 2 ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา 24140",
        phone: "038-587-301",
        type: "สำนักงานขนส่ง"
      }
    ]
  }
];

export default function LandmarkPage() {
  const { values: systemInfo, loading } = useSystemInfoValues(SYSTEM_INFO_KEYS);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  return (
    <div
      className="w-full min-h-screen py-8 px-2 md:px-8 flex flex-col items-center bg-transparent"
      style={{
        backgroundImage:
          'linear-gradient(180deg, rgba(239, 228, 212, 0.6) 0%, rgba(1, 189, 204, 0.6) 100%), url("/image/Boat.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Header */}
      <div className="w-full max-w-[1268px] mb-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
            สถานที่สำคัญในพื้นที่
          </h1>
          <p className="text-lg text-white/90 drop-shadow-md">
            ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา
          </p>
        </div>
      </div>

      {/* Main Municipality Card */}
      <div className="w-full max-w-[1268px] mb-8">
        <div className="bg-white bg-opacity-95 rounded-2xl shadow-xl p-8 backdrop-blur-sm border border-white/20">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Logo */}
            <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
              <img
                src="/image/Logo_banpho3.png"
                alt="Logo เทศบาลตำบลบ้านโพธิ์"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <div className="mb-4">
                <h2 className="text-2xl md:text-3xl font-bold text-[#01385f] mb-2">
                  เทศบาลตำบลบ้านโพธิ์
                </h2>
                <p className="text-gray-600 text-lg font-medium">
                  Ban Pho Subdistrict Municipality
                </p>
              </div>

              {loading ? (
                <div className="text-gray-500">กำลังโหลดข้อมูล...</div>
              ) : (
                <div className="space-y-2 text-gray-700">
                  <p className="flex items-center justify-center md:justify-start gap-2">
                    <span className="text-lg">📍</span>
                    <span>{systemInfo.address || "เลขที่ 222 หมู่ 1 ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา 24140"}</span>
                  </p>
                  <p className="flex items-center justify-center md:justify-start gap-2">
                    <span className="text-lg">📞</span>
                    <span>{systemInfo.phone || "038-587308"}</span>
                  </p>
                  <p className="flex items-center justify-center md:justify-start gap-2">
                    <span className="text-lg">📠</span>
                    <span>{systemInfo.fax || "038-587308 ต่อ 103"}</span>
                  </p>
                  <p className="flex items-center justify-center md:justify-start gap-2">
                    <span className="text-lg">✉️</span>
                    <span>{systemInfo.email || "admin@banphocity.go.th"}</span>
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                <a
                  href="https://www.google.com/maps/dir//สำนักงานเทศบาลตำบลบ้านโพธิ์/@13.5990386,101.069895"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  เส้นทาง
                </a>
                <a
                  href="https://maps.app.goo.gl/2zMGQy4s7to689K96"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  ดูใน Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Landmarks Grid */}
      <div className="w-full max-w-[1268px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {landmarks.map((category) => (
            <div
              key={category.id}
              className="bg-white bg-opacity-90 rounded-xl shadow-lg p-6 backdrop-blur-sm border border-white/20 hover:shadow-xl hover:bg-opacity-95 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              onClick={() => setSelectedCategory(category)}
            >
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 ${category.color} rounded-full text-white text-2xl mb-4 shadow-lg`}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {category.places.length} แห่ง
                </p>
                <div className="mt-4">
                  <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    คลิกเพื่อดูรายละเอียด
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Category Details */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setSelectedCategory(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`inline-flex items-center justify-center w-12 h-12 ${selectedCategory.color} rounded-full text-white text-xl`}>
                    {selectedCategory.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedCategory.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {selectedCategory.places.map((place, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedPlace(place)}
                  >
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                      {place.name}
                    </h3>
                    <div className="space-y-1 text-gray-600">
                      <p className="flex items-center gap-2">
                        <span>📍</span>
                        <span>{place.address}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span>📞</span>
                        <span>{place.phone}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span>🏷️</span>
                        <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {place.type}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Place Details */}
      {selectedPlace && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-60" onClick={() => setSelectedPlace(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  รายละเอียด
                </h2>
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg text-gray-800">
                  {selectedPlace.name}
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p className="flex items-start gap-2">
                    <span className="mt-1">📍</span>
                    <span>{selectedPlace.address}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span>📞</span>
                    <span>{selectedPlace.phone}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span>🏷️</span>
                    <span className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {selectedPlace.type}
                    </span>
                  </p>
                </div>

                <div className="mt-6 flex gap-2">
                  <button
                    onClick={() => setSelectedPlace(null)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    ปิด
                  </button>
                  <button
                    onClick={() => {
                      // สามารถเพิ่มฟังก์ชันเปิดแผนที่ได้ที่นี่
                      alert('ฟีเจอร์แผนที่จะเพิ่มในอนาคต');
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    ดูแผนที่
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

