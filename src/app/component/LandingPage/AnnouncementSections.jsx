import React from "react";

const images = ["/image/annu.jpg", "/image/annu.jpg", "/image/annu.jpg"];

export default function AnnouncementSections() {
  const [current, setCurrent] = React.useState(0);
  const handlePrev = () =>
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const handleNext = () =>
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  return (
    <div
      className="relative w-screen h-screen shadow-[0_18.4px_18.4px_rgba(0,0,0,0.49)] overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(239, 228, 212, 0.6) 0%, rgba(1, 189, 204, 0.6) 100%),
        url("image/vision_bg.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Fallback Background - เผื่อภาพไม่โหลด */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#A8F9FF] to-[#E8DDC4] -z-10" />

      {/* Decorative Header */}
      <div className="relative w-full flex flex-col items-center">
        <img
          src="/image/headerAnnouncement.png"
          alt="header announcement"
          className="w-full  object-cover"
          style={{ minHeight: "60px" }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl flex flex-col items-center pt-2">
          <div className="text-[#01385F] text-lg sm:text-2xl font-bold text-center">
            ป้ายประกาศ
          </div>
          <div className="text-[#01385F] text-xs sm:text-base text-center">
            เทศบาลตำบลบ้านโพธิ์
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center px-2 sm:px-4 md:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex w-full max-w-2xl justify-between items-center mb-6 mt-8">
          <div className="text-[#01385F] text-xl sm:text-2xl lg:text-3xl font-bold w-full text-left"></div>
          <button className="bg-[#01385f] text-white rounded-[12.5px] px-4 py-2 text-sm shadow-md hover:bg-[#01385f]/90 transition-colors duration-200 whitespace-nowrap ml-4">
            เพิ่มเติม
          </button>
        </div>

        {/* Image Slider with prev/next buttons outside */}
        <div className="flex w-full max-w-5xl items-center justify-center gap-2 sm:gap-4">
          {/* Prev Button - left side outside image, responsive size */}
          <button
            onClick={handlePrev}
            className="text-[#01385F] hover:text-[#01385f] focus:outline-none transition-colors duration-200 p-1 sm:p-2 rounded-full shadow"
            aria-label="Previous image"
          >
            <svg width="28" height="28" className="sm:w-8 sm:h-8" fill="none">
              <path
                d="M21 8l-8 8 8 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="relative flex-1 aspect-[2.2/1] sm:aspect-[2.5/1] border-2 sm:border-4 md:border-6 border-solid border-white rounded-[12px] sm:rounded-[20px] md:rounded-[29px] shadow-[0_2px_4px_rgba(0,0,0,0.18)] sm:shadow-[0_4px_4px_rgba(0,0,0,0.25)] bg-white flex items-center justify-center overflow-hidden min-h-[120px] sm:min-h-[180px] md:min-h-[240px]">
            <img
              src={images[current]}
              alt={`ประกาศ ${current + 1}`}
              className="w-full h-full object-cover rounded-[10px] sm:rounded-[16px] md:rounded-[25px]"
              style={{ minHeight: "100px", maxHeight: "400px" }}
            />
          </div>
          {/* Next Button - right side outside image, responsive size */}
          <button
            onClick={handleNext}
            className="text-[#01385F] hover:text-[#01385f] focus:outline-none transition-colors duration-200 p-1 sm:p-2 rounded-full shadow"
            aria-label="Next image"
          >
            <svg width="28" height="28" className="sm:w-8 sm:h-8" fill="none">
              <path
                d="M11 8l8 8-8 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* ...removed navigation controls and dots, now handled inside image slider above... */}
      </div>
    </div>
  );
}
