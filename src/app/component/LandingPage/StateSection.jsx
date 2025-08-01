import React from "react";

export default function StateSection() {
  const stats = [
    { label: "ขณะนี้ 15,600 คน", value: 12 },
    { label: "วันนี้ 3,100 คน", value: 56 },
    { label: "สัปดาห์นี้ 46,300 คน", value: 320 },
    { label: "เดือนนี้ 70,200 คน", value: 1200 },
    { label: "ปีนี้ 126,800 คน", value: 5400 },
    { label: "ทั้งหมด 250,600 คน", value: 12345 },
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
          <div className="absolute inset-0 w-full h-full bg-cyan-400/40" />
        </div>

        {/* Stats Box (on top of background) */}
        <div
          className="relative z-10 w-full mx-auto bg-[#eaf3d6]/30 backdrop-blur-sm px-2 md:px-6 py-4 "
        >
          <div className="w-full overflow-x-auto">
            <div className="min-w-[400px] grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 text-center mt-2 ">
              <div className="col-span-2 sm:col-span-2 md:col-span-1 flex flex-col items-start justify-center py-2 pr-2">
                <span className="text-[#394d1c] font-bold text-lg md:text-xl">
                  จำนวนผู้เข้าชมเว็บไซค์
                </span>
                <span className="text-[#394d1c] text-xs md:text-sm">
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
                  {/* Vertical divider except last */}
                  {idx < stats.length - 1 && (
                    <span className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-8 w-px bg-[#01bdcc]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
