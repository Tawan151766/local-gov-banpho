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
      <div className="w-full max-w-[1652px]  flex items-center justify-center bg-cover bg-center mx-auto mb-6">
        <img
          src="/image/banpho_map.png"
          alt="Banpho Map"
          className="w-full md:w-5/6 h-auto object-contain drop-shadow-xl"
        />
      </div>
      {/* Button Section */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full max-w-3xl mx-auto">
  {[
    { label: "ปั๊มน้ำมัน", imgAlt: "ปั๊มน้ำมัน"},
    { label: "ร้านอาหาร", imgAlt: "ร้านอาหาร" },
    { label: "สถานที่สำคัญในพื้นที่", imgAlt: "สถานที่สำคัญ" },
  ].map((btn, index) => (
    <button
      key={index}
      className="flex items-center justify-center gap-2 w-[244px] h-[71px] flex-shrink-0 rounded-[15px] bg-white shadow transition duration-200 hover:bg-blue-50 hover:shadow-lg hover:scale-[1.02] px-4"
    >
      {/* กลุ่ม icon และข้อความ */}
      <div className="flex items-center gap-2">
        <img
          src="/image/location.png"
          alt={btn.imgAlt}
          className="w-6 h-6 object-contain"
        />
        <span className="text-[#01385f] font-semibold text-base md:text-lg">
          {btn.label}
        </span>
      </div>
    </button>
  ))}
</div>

    </div>
  );
}
