"use client";

import { useState, useEffect } from "react";

export default function ServiceStandardsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
            <path
              d="M 8 0 L 0 0 0 8"
              fill="none"
              stroke="#059669"
              strokeWidth="0.5"
            />
          </pattern>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-16 text-4xl opacity-20 animate-pulse animation-delay-1000">
          ⭐
        </div>
        <div className="absolute top-24 right-20 text-3xl opacity-15 animate-pulse animation-delay-2000">
          🏆
        </div>
        <div className="absolute bottom-32 left-32 text-5xl opacity-10 animate-pulse animation-delay-3000">
          📊
        </div>
        <div className="absolute bottom-20 right-16 text-3xl opacity-20 animate-pulse animation-delay-4000">
          ✨
        </div>
        <div className="absolute top-1/2 left-10 text-2xl opacity-15 animate-pulse animation-delay-5000">
          🎯
        </div>
        <div className="absolute top-1/3 right-1/3 text-3xl opacity-10 animate-pulse animation-delay-6000">
          📈
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo Section */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-full shadow-2xl mb-6 animate-pulse">
              <svg
                className="w-14 h-14 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-cyan-600 mx-auto rounded-full"></div>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Coming Soon
            </span>
          </h1>

          {/* Subtitle */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
              มาตรฐานการให้บริการ
            </h2>
            <div className="inline-flex items-center bg-emerald-100 text-emerald-800 px-6 py-3 rounded-full text-lg font-medium">
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              เทศบาลตำบลบ้านโพธิ์
            </div>
          </div>

          {/* Description */}
          <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-2xl p-8 mb-10 shadow-xl border border-white border-opacity-50">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
              เรากำลังจัดทำมาตรฐานการให้บริการที่ชัดเจนและโปร่งใส
              เพื่อให้ประชาชนทราบถึงคุณภาพการบริการที่จะได้รับ
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    ระยะเวลาบริการ
                  </h3>
                  <p className="text-sm text-gray-600">
                    กำหนดเวลาให้บริการที่ชัดเจน
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-cyan-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">คุณภาพบริการ</h3>
                  <p className="text-sm text-gray-600">มาตรฐานที่ตรวจสอบได้</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">ความรวดเร็ว</h3>
                  <p className="text-sm text-gray-600">
                    ให้บริการอย่างมีประสิทธิภาพ
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Categories Preview */}
          <div className="mb-10">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              หมวดหมู่บริการ
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white border-opacity-50">
                <div className="text-3xl mb-2">🏗️</div>
                <h4 className="font-semibold text-gray-800 text-sm">
                  งานก่อสร้าง
                </h4>
              </div>
              <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white border-opacity-50">
                <div className="text-3xl mb-2">🏥</div>
                <h4 className="font-semibold text-gray-800 text-sm">
                  สาธารณสุข
                </h4>
              </div>
              <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white border-opacity-50">
                <div className="text-3xl mb-2">💰</div>
                <h4 className="font-semibold text-gray-800 text-sm">การเงิน</h4>
              </div>
              <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white border-opacity-50">
                <div className="text-3xl mb-2">👥</div>
                <h4 className="font-semibold text-gray-800 text-sm">ทั่วไป</h4>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white border-opacity-50">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              ข้อมูลการติดต่อ
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl">
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">โทรศัพท์</h4>
                <p className="text-gray-600">02-XXX-XXXX</p>
                <p className="text-xs text-gray-500">สำนักงานเทศบาล</p>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl">
                <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">อีเมล์</h4>
                <p className="text-gray-600">info@banpho.go.th</p>
                <p className="text-xs text-gray-500">ข้อมูลทั่วไป</p>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">เวลาทำการ</h4>
                <p className="text-gray-600">จันทร์ - ศุกร์</p>
                <p className="text-xs text-gray-500">08:30 - 16:30 น.</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-emerald-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm text-emerald-800">
                  <strong>ประกาศ:</strong> มาตรฐานการให้บริการจะเปิดใช้งานเร็วๆ
                  นี้ เพื่อยกระดับคุณภาพการบริการให้ดียิ่งขึ้น
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-10 text-center">
            <p className="text-gray-600">
              เทศบาลตำบลบ้านโพธิ์ มุ่งมั่นพัฒนาการให้บริการอย่างต่อเนื่อง
              เพื่อความพึงพอใจของประชาชน
            </p>
            <div className="flex justify-center items-center mt-4 space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce animation-delay-200"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce animation-delay-400"></div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-5000 {
          animation-delay: 5s;
        }
        .animation-delay-6000 {
          animation-delay: 6s;
        }
      `}</style>
    </div>
  );
}
