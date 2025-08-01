// ✅ HERO SECTION แบบ Tailwind CSS พร้อม React

import { useState } from "react";

export default function HeroSection({ ui }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [showBanner, setShowBanner] = useState(true);
  const slides = ["/image/yak.jpg", "/image/yak.jpg", "/image/yak.jpg"];

  const handleDotClick = (index) => {
    setActiveSlide(index);
    if (ui?.setSlide) ui.setSlide(index);
  };

  return (
    <>
      <section className="relative w-full pb-[682px] flex items-end justify-center">
        {/* Background Image Slides */}
        <div className="absolute inset-0 z-0 overflow-hidden cursor-grab active:cursor-grabbing">
    {slides.map((slide, idx) => (
      <div
        key={idx}
        className={`absolute transition-opacity duration-700 ${
          activeSlide === idx ? "opacity-100" : "opacity-0"
        }`}
        style={{
          width: "100vw",
          height: "100vh", // หรือจะใช้ h-[100vh] ก็ได้ถ้าครอบด้วย Tailwind
          backgroundImage: `url('${slide}')`,
          backgroundSize: "100% 125%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center top", // หรือ center center ถ้าต้องการกลางแนวดิ่งด้วย
        }}
      />
    ))}
  </div>


        {/* Overlay */}
        <div className="absolute inset-0 z-10 "></div>

        {/* Dots */}
        <div className="absolute bottom-[90px] left-1/2 -translate-x-1/2 flex gap-[10px] z-20">
          {slides.map((_, idx) => (
            <span
              key={idx}
              className={`w-[12px] h-[12px] rounded-full transition-colors cursor-pointer ${
                activeSlide === idx
                  ? "bg-[#01BDCC]"
                  : "bg-[#FFFFFF78] hover:bg-[#FFFFFF99]"
              }`}
              onClick={() => handleDotClick(idx)}
            ></span>
          ))}
        </div>

        {/* ✅ Banner แสดงตาม state */}
        {showBanner && (
          <div className="fixed top-[360px] left-0 w-[275px] h-[349px] bg-white/95 rounded-[33px] shadow-[0_4px_20px_rgba(0,0,0,0.2)] z-[9999] flex flex-col overflow-hidden cursor-default transition-all duration-300 translate-y-[210px] ml-[25px] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:scale-[1.01]">
            {/* ปุ่มปิด */}
            <button
              onClick={() => setShowBanner(false)} // ✅ ปิด banner เมื่อคลิก
              className="absolute top-[15px] right-[15px] w-[30px] h-[30px] rounded-full bg-[rgba(206,222,240,0.8)] text-[18px] font-bold flex items-center justify-center z-20 cursor-pointer transition-all duration-300 hover:bg-[#4A90E2] hover:scale-110"
            >
              ×
            </button>

            {/* ภาพโปรโมชัน */}
            <div className="flex-1 flex items-center justify-center bg-[rgba(74,144,226,0.1)] transition-all duration-300 overflow-hidden">
              <img
                src="image/EIT.jpg"
                alt="EIT"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Hero Text Box */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full text-center px-4 py-5 bg-[#0000006B] shadow-[0_4px_15px_rgba(0,0,0,0.1)] z-10">
          <p className="text-[18px] text-[#ffffff] leading-[1.6] m-0">
            เทศบาลตำบลบ้านโพธิ์ จัดให้มีบริการรับเเจ้งเรื่องราวร้องเรียน
            ร้องทุกข์ รับความคิดเห็นของประชาชน ผ่านทางตู้ไปรษณีย์ ปณ.9
          </p>
        </div>
      </section>

      {/* Video Section */}

      <div className="relative w-screen h-[65vh] overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="/image/mp_4_bg.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
    </>
  );
}
