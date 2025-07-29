import React from "react";

const stats = [
  { label: "ขณะนี้", value: 12 },
  { label: "วันนี้", value: 34 },
  { label: "สัปดาห์นี้", value: 56 },
  { label: "เดือนนี้", value: 78 },
  { label: "ปีนี้", value: 90 },
  { label: "ทั้งหมด", value: 123 },
];

export default function StatSection() {
  return (
    <div className="relative w-full min-h-[500px] flex flex-col items-center justify-end overflow-hidden">
      {/* Background Image */}
      <img src="/image/bg-stat.jpg" alt="bg" className="absolute top-0 left-0 w-full h-full object-cover -z-10" />
      {/* Overlay for effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-[#e8f7e0] opacity-80 -z-10" />

      {/* Main Stat Bar */}
      <div className="w-full max-w-5xl mx-auto bg-[#f7fbe7] rounded-t-[32px] shadow-lg flex flex-col items-center pb-8 pt-4 relative z-10">
        <div className="text-lg font-bold text-gray-800 mt-2">จำนวนผู้เข้าชมเว็บไซต์</div>
        <div className="text-xs text-gray-500 mb-4">number of website visitors</div>
        <div className="grid grid-cols-6 gap-0 w-full border-t border-b border-[#b2e3b2]">
          {stats.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center py-4 border-r last:border-r-0 border-[#b2e3b2]">
              <span className="text-lg font-bold text-[#01385f] mb-1">{item.value}</span>
              <span className="text-base text-gray-700">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Foreground Image (bicycles) */}
      <img src="/image/bike-group.png" alt="bike group" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[180px] object-contain z-10" />
    </div>
  );
}
