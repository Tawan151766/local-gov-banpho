import React from "react";

export default function ContentSections() {
  // ตัวอย่างข้อมูลวิดีโอ สามารถเพิ่ม url ได้
  const youtubeVideos = [
    {
      thumbnail: "/image/ktc_nakhon3.png", // เปลี่ยนเป็นภาพจริง
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
    {
      thumbnail: "/image/ktc_nakhon33.png",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
    {
      thumbnail: "/image/ktc_nakhon3.png",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
  ];
  const [current, setCurrent] = React.useState(0);
  const handlePrev = () =>
    setCurrent((prev) => (prev === 0 ? youtubeVideos.length - 1 : prev - 1));
  const handleNext = () =>
    setCurrent((prev) => (prev === youtubeVideos.length - 1 ? 0 : prev + 1));
  return (
    <div className="relative w-screen h-screen shadow-[0_18.4px_18.4px_rgba(0,0,0,0.49)] overflow-hidden flex items-center justify-center">
      {/* Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#A8F9FF] to-[#E8DDC4] z-0" />

      {/* ส่วนเนื้อหา */}
      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center">
        <div className="flex max-w-2xl w-full justify-between items-center mb-6 mt-8">
          <div className="text-[#0B2347] text-2xl font-bold mb-6 mt-8 w-full text-left">
            วิดีทัศน์แนะนำ
          </div>
          <button className="bg-[#01385f] text-white rounded-[12.5px] w-[72px] h-[25px] text-sm shadow-md relative">
            เพิ่มเติม
          </button>
        </div>
        <div
          className="rectangle-15 relative w-full max-w-2xl sm:max-w-xl xs:max-w-full aspect-video border-[6px] border-solid border-white rounded-[29px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] bg-white flex items-center justify-center overflow-hidden"
          style={{ boxSizing: 'border-box' }}
        >
          <iframe
            className="w-full h-full rounded-[29px] sm:p-2 xs:p-0"
            src={`https://www.youtube.com/embed/${youtubeVideos[current].url.split('v=')[1]}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* จุด slider และลูกศร */}
        <div className="flex items-center justify-center mt-6 space-x-6">
          <button
            onClick={handlePrev}
            className="text-gray-500 hover:text-[#0B2347] focus:outline-none"
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
          <div className="flex gap-2 mt-2">
            {youtubeVideos.map((_, idx) => (
              <span
                key={idx}
                className={`w-3 h-3 rounded-full ${
                  current === idx ? "bg-[#0B2347]" : "bg-gray-400 opacity-50"
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            className="text-gray-500 hover:text-[#0B2347] focus:outline-none"
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
