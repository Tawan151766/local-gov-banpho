import React from "react";

export default function ContentSections() {
  // ตัวอย่างข้อมูลวิดีโอ สามารถเพิ่ม url ได้
  const youtubeVideos = [
    {
      thumbnail: "/image/ktc_nakhon3.png", // เปลี่ยนเป็นภาพจริง
      url: "https://www.youtube.com/watch?v=e76y6siOuVw",
    },
    {
      thumbnail: "/image/ktc_nakhon33.png",
      url: "https://www.youtube.com/watch?v=e76y6siOuVw",
    },
    {
      thumbnail: "/image/ktc_nakhon3.png",
      url: "https://www.youtube.com/watch?v=e76y6siOuVw",
    },
  ];

  const [current, setCurrent] = React.useState(0);

  const handlePrev = () =>
    setCurrent((prev) => (prev === 0 ? youtubeVideos.length - 1 : prev - 1));

  const handleNext = () =>
    setCurrent((prev) => (prev === youtubeVideos.length - 1 ? 0 : prev + 1));

  return (
    <div
      className="relative w-screen h-screen shadow-[0_18.4px_18.4px_rgba(0,0,0,0.49)] overflow-hidden flex items-center justify-center"
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

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex w-full max-w-2xl justify-between items-center mb-6 mt-8">
          <div className="text-[#01385F] text-xl sm:text-2xl lg:text-3xl font-bold w-full text-left">
            วิดีทัศน์แนะนำ
          </div>
          <button className="bg-[#01385f] text-white rounded-[12.5px] px-4 py-2 text-sm shadow-md hover:bg-[#01385f]/90 transition-colors duration-200 whitespace-nowrap ml-4">
            เพิ่มเติม
          </button>
        </div>

        {/* Video Container */}
        <div className="relative w-full max-w-[952px] h-[230px] md:h-[482px] rounded-[29px] border-[6px] border-white shadow-[0_4px_4px_rgba(0,0,0,0.25)] overflow-hidden bg-[url('/image/your_image.png')] bg-[length:100%_131.545%] bg-no-repeat bg-[position:1.644px_-90.28px]">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${
              youtubeVideos[current].url.split("v=")[1]
            }`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center mt-6 space-x-6">
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            className="text-[#01385F] hover:text-[#01385f] focus:outline-none transition-colors duration-200 p-2"
            aria-label="Previous video"
          >
            <svg width="24" height="24" fill="none">
              <path
                d="M15 6l-6 6 6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {youtubeVideos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-200 hover:scale-110 ${
                  current === idx
                    ? "bg-[#01385F]"
                    : "bg-gray-400 opacity-50 hover:opacity-80"
                }`}
                aria-label={`Go to video ${idx + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="text-[#01385F] hover:text-[#01385f] focus:outline-none transition-colors duration-200 p-2"
            aria-label="Next video"
          >
            <svg width="24" height="24" fill="none">
              <path
                d="M9 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
