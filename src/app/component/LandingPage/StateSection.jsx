import React from "react";

export default function StateSection() {
  // Mockup data for visitor stats
  const stats = [
    { label: "ขณะนี้", value: 12 },
    { label: "วันนี้", value: 56 },
    { label: "สัปดาห์นี้", value: 320 },
    { label: "เดือนนี้", value: 1200 },
    { label: "ปีนี้", value: 5400 },
    { label: "ทั้งหมด", value: 12345 },
  ];
  return (
    <>
    
      <div
        className="relative w-full h-screen flex flex-col items-center justify-end"
        style={{ minHeight: "480px" }}
      >
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src="/image/bg-stat.jpg"
            alt="bg-stat"
            className="w-full h-full object-cover"
          />
          {/* Blue overlay */}
          <div className="absolute inset-0 w-full h-full" style={{ background: "rgba(5,197,255,0.4)", opacity: 0.8 }} />
        </div>
      </div>
      <div
        className="relative z-10 w-full mx-auto bg-[#eaf3d6] opacity-70 px-2 md:px-6 py-4 flex flex-col items-center justify-center border-t border-[#b2d8a6]"
        style={{ marginTop: "auto" }}
      >
        <div className="w-full overflow-x-auto">
          <div className="min-w-[400px] grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 text-center mt-2 border-t border-[#b2d8a6]">
            <div className="col-span-2 sm:col-span-2 md:col-span-1 flex flex-col items-center justify-center py-2">
              <span className="text-[#394d1c] font-bold text-lg md:text-xl text-left w-full">
                จำนวนผู้เข้าชมเว็บไซค์
              </span>
              <span className="text-[#394d1c] text-xs md:text-sm text-left w-full">
                number of website visitors
              </span>
            </div>
            {stats.map((stat, idx) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center py-2 relative"
              >
                <span className="text-[#394d1c] font-semibold text-base md:text-lg">
                  {stat.label}
                </span>
                {/* Vertical divider except last, only show on md+ */}
                {idx < stats.length - 1 && (
                  <span className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-8 w-px bg-[#01bdcc]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
