import React from "react";

export default function MapsSection() {
  return (
    <div
      style={{
        backgroundImage: 'url("/image/map_bg.png")',
        minHeight: "320px",
        height: "auto",
      }}
      className="w-full flex flex-col items-center justify-center py-8 px-2 md:px-8"
    >
      {/* Title */}
      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#01385f] mb-4 text-center">
        MAP บ้านโพธิ์
      </h2>
      {/* Map Image Section */}
      <div className="w-full max-w-3xl flex items-center justify-center bg-cover bg-center mx-auto mb-6">
        <img
          src="/image/banpho_map.png"
          alt="Banpho Map"
          className="w-full md:w-5/6 h-auto object-contain drop-shadow-xl"
        />
      </div>
      {/* Button Section */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full max-w-2xl mx-auto">
        <button className="flex items-center gap-2 bg-white rounded-xl shadow px-6 py-3 text-[#01385f] font-semibold text-base md:text-lg hover:bg-blue-50 transition">
          <span className="material-icons text-lg md:text-xl">location_on</span>
          บ้านน้ำ
        </button>
        <button className="flex items-center gap-2 bg-white rounded-xl shadow px-6 py-3 text-[#01385f] font-semibold text-base md:text-lg hover:bg-blue-50 transition">
          <span className="material-icons text-lg md:text-xl">restaurant</span>
          ร้านอาหาร
        </button>
        <button className="flex items-center gap-2 bg-white rounded-xl shadow px-6 py-3 text-[#01385f] font-semibold text-base md:text-lg hover:bg-blue-50 transition">
          <span className="material-icons text-lg md:text-xl">place</span>
          สถานที่สำคัญในพื้นที่
        </button>
      </div>
    </div>
  );
}
