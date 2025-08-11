"use client";
import React from "react";
import { useSystemInfoValues } from "@/hooks/useSystemInfo";

// Define keys outside component to prevent re-creation
const SYSTEM_INFO_KEYS = [
  "organization_name",
  "phone",
  "email",
  "address",
  "fax",
];

export default function ContactPage() {
  // ดึงข้อมูลจาก System Info
  const { values: systemInfo, loading } = useSystemInfoValues(SYSTEM_INFO_KEYS);
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
      {/* Information Section */}
      <div className="w-full max-w-[1268px] mt-8">
        <div className="bg-white bg-opacity-90 rounded-2xl shadow-md p-6 backdrop-blur-sm text-center flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4">
            {/* Logo Main */}
            <img
              src="/image/Logo_banpho3.png"
              alt="Logo"
              className="w-full h-full object-contain relative z-10"
            />

            {/* Reflection */}
            <div className="absolute top-full -translate-y-2 left-0 w-30 h-30 transform scale-y-[-1] opacity-30 z-0">
              <img
                src="/image/Logo_banpho3.png"
                alt="Logo Reflection"
                className="w-full h-full object-contain "
              />
              {/* Gradient Overlay */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/50 to-white/0"></div>
            </div>
          </div>

          {/* Titles */}
          <h1 className="text-xl font-semibold text-[#01385f] mb-1 relative z-10">
            เทศบาลตำบลบ้านโพธิ์
          </h1>
          <p className="text-gray-600 text-md font-bold mb-4 relative z-10">
            Ban Pho Subdistrict Municipality
          </p>

          {/* Address Information */}
          <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed relative z-10">
            {loading ? (
              "กำลังโหลดข้อมูล..."
            ) : (
              <>
                ที่อยู่{" "}
                {systemInfo.address ||
                  "เลขที่ 222 หมู่ 1 ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา 24140"}
                <br />
                เบอร์โทรสำนักงาน {systemInfo.phone || "038-587308"}
                <br />
                แฟกซ์ {systemInfo.fax || "038-587308 ต่อ 103"}
                <br />
                Email : {systemInfo.email || "admin@banphocity.go.th"}
              </>
            )}
          </p>
        </div>

        {/* Embedded Google Map */}
        <div className="mt-6 w-full h-[300px] sm:h-[400px] rounded-2xl overflow-hidden shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7755.92709681358!2d101.069895!3d13.5990386!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d3c224bfc9df9%3A0x84ee1fecdf7f2595!2z4Liq4Liz4LiZ4Lix4LiB4LiH4Liy4LiZ4LmA4LiX4Lio4Lia4Liy4Lil4LiV4Liz4Lia4Lil4Lia4LmJ4Liy4LiZ4LmC4Lie4LiY4Li04LmM!5e0!3m2!1sth!2sth!4v1754465544296!5m2!1sth!2sth"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ban Pho Location"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="https://www.google.com/maps/dir//สำนักงานเทศบาลตำบลบ้านโพธิ์/@13.5990386,101.069895"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            เส้นทาง
          </a>

          <a
            href="https://maps.app.goo.gl/2zMGQy4s7to689K96"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            ดูใน Google Maps
          </a>
        </div>
      </div>
    </div>
  );
}
