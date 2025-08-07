import React from "react";

export default function MapsSection() {
  return (
    <div className="relative w-full h-full">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      >
        <source src="/image/map_video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay Text */}
      <div className="absolute inset-0 flex  justify-center md:top-20 top-5">
        <h2 className="text-md md:text-2xl font-bold text-[#01385f] text-center drop-shadow-lg ">
          MAP บ้านโพธิ์
        </h2>
      </div>

{/* Button Section */}
<div className="absolute md:bottom-20 bottom-2 left-1/2 transform -translate-x-1/2 w-full max-w-3xl px-4 md:px-0">
  <div className="grid grid-cols-2 md:flex gap-2 md:gap-1 justify-center items-center w-full">
    {[
      {
        label: "ปั๊มน้ำมัน",
        imgAlt: "ปั๊มน้ำมัน",
        url: "https://www.google.com/...",
      },
      {
        label: "ร้านอาหาร",
        imgAlt: "ร้านอาหาร",
        url: "https://www.google.com/...",
      },
      {
        label: "สถานที่สำคัญในพื้นที่",
        imgAlt: "สถานที่สำคัญ",
        url: "https://www.google.com/...",
      },
    ].map((btn, index) => (
      <button
        onClick={() => window.open(btn.url, "_blank")}
        key={index}
        className={`flex items-center justify-center gap-1 md:gap-2 w-full md:w-[244px] h-[36px] md:h-[71px] flex-shrink-0 rounded-[10px] md:rounded-[15px] bg-white shadow transition duration-200 hover:bg-blue-50 hover:shadow-lg hover:scale-[1.02] px-2 md:px-4 col-span-1 ${
          index === 2 ? "col-span-2 mx-auto" : ""
        }`}
      >
        <div className="flex items-center gap-1 md:gap-2">
          <img
            src="/image/location.png"
            alt={btn.imgAlt}
            className="w-4 h-4 md:w-6 md:h-6 object-contain"
          />
          <span className="text-[#01385f] font-medium text-[11px] md:text-lg whitespace-nowrap">
            {btn.label}
          </span>
        </div>
      </button>
    ))}
  </div>
</div>

    </div>
  );
}
