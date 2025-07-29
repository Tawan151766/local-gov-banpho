import React from "react";

export default function ActivitySection() {
  return (
    <section
      className="py-16 px-4"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(239, 228, 212, 0.6) 0%, rgba(1, 189, 204, 0.6) 100%),
        url("image/Boat.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="relative text-center mb-12">
        <div className="text-[32px] font-semibold text-[#394D1C] inline-block">
          กิจกรรม
        </div>
        <img
          src="image/leaf.png"
          alt="Leaf"
          className="absolute w-[240px] h-auto left-[48%] -translate-x-1/2 top-[-61px] pointer-events-none"
        />
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <a
              href="#"
              key={item}
              className="group block w-full sm:w-[340px] md:w-[360px] lg:w-[383px] h-[340px] sm:h-[380px] md:h-[410px] lg:h-[426px] bg-white rounded-2xl sm:rounded-3xl shadow-md overflow-hidden hover:shadow-lg hover:bg-[#FFFF92] transition-shadow duration-300"
            >
              <div className="w-full h-[180px] sm:h-[220px] md:h-[240px] lg:h-[260px]">
                <img
                  src="/image/Boat.jpg"
                  alt={`Activity ${item}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-2 sm:p-4 h-[120px] sm:h-[140px] md:h-[160px] lg:h-[166px] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-1 sm:mb-2">
                    <h4 className="text-base sm:text-lg md:text-xl lg:text-[20px] font-semibold text-[#1E1E1E] transition-colors duration-200">
                      ข่าวประชาสัมพันธ์
                    </h4>
                    <p className="text-base sm:text-lg md:text-xl lg:text-[20px] font-Regular text-gray-500 ml-2 sm:ml-4">
                      วันที่
                    </p>
                  </div>
                  <p className="text-sm sm:text-base md:text-lg lg:text-[20px] font-Regular text-gray-600 mb-2 sm:mb-3 line-clamp-2">
                    ข้อความ
                  </p>
                </div>
                <span className="text-base sm:text-lg md:text-xl lg:text-[20px] text-[#1E1E1E] hover:text-blue-800 transition-colors duration-200">
                  อ่านต่อ
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
