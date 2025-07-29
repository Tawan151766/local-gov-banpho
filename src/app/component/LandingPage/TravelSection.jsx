import React from "react";

const places = [
  {
    name: "วัดสนามจันทร์",
    img: "/image/yak.jpg",
  },
//   {
//     name: "วัดสนามจันทร์",
//     img: "/image/yak.jpg",
//   },
  {
    name: "วัดสนามจันทร์",
    img: "/image/market.jpg",
  },
  {
    name: "วัดสนามจันทร์",
    img: "/image/whitecastle.jpg",
  },
];

export default function TravelSection() {
  const [current, setCurrent] = React.useState(0);
  const handlePrev = () =>
    setCurrent((prev) => (prev === 0 ? places.length - 1 : prev - 1));
  const handleNext = () =>
    setCurrent((prev) => (prev === places.length - 1 ? 0 : prev + 1));

  return (
    <div className="relative w-full min-h-[700px] flex flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      <img
        src="rectangle-780.png"
        alt="bg"
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[rgba(240,226,213,0.51)] to-[rgba(5,197,255,0.51)] -z-10" />

      {/* Top Bar Decoration */}
      <img
        src="union0.svg"
        alt="top-bar"
        className="absolute top-0 left-0 w-full h-[119px] object-cover"
      />

      {/* Title */}
      <div className="absolute top-[24px] left-1/2 -translate-x-1/2 text-yellow-400 text-[32px] font-semibold z-10">
        ที่นี่เทศบาลบ้านโพธิ์
      </div>

      {/* Card Container */}
      <div className="relative w-full max-w-4xl mx-auto mt-32 mb-8 flex flex-col items-center justify-center">
        <div className="relative w-full flex items-center justify-center h-[420px]">
          {/* Left Card */}
          <div className="hidden md:block absolute left-1/4 top-1/2 -translate-y-1/2 scale-90 opacity-70 z-0 transition-all duration-500">
            <img
              src={places[(current - 1 + places.length) % places.length].img}
              alt="left"
              className="w-[260px] h-[340px] rounded-[30px] border-[4px] border-white shadow-lg object-cover transition-all duration-500"
            />
          </div>
          {/* Right Card */}
          <div className="hidden md:block absolute right-1/4 top-1/2 -translate-y-1/2 scale-90 opacity-70 z-0 transition-all duration-500">
            <img
              src={places[(current + 1) % places.length].img}
              alt="right"
              className="w-[260px] h-[340px] rounded-[30px] border-[4px] border-white shadow-lg object-cover transition-all duration-500"
            />
          </div>
          {/* Center Card */}
          <div className="relative z-10 flex items-center justify-center transition-all duration-500">
            <img
              src={places[current].img}
              alt="main"
              className="w-[320px] h-[400px] rounded-[30px] border-[5px] border-white shadow-xl object-cover transition-all duration-500 opacity-100"
              style={{transition: 'opacity 0.5s, transform 0.5s'}}
            />
          </div>
          {/* Prev/Next Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 shadow hover:bg-opacity-100 z-20"
            aria-label="prev"
          >
            <svg width="32" height="32" fill="none">
              <path
                d="M20 8l-8 8 8 8"
                stroke="#01385F"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 shadow hover:bg-opacity-100 z-20"
            aria-label="next"
          >
            <svg width="32" height="32" fill="none">
              <path
                d="M12 8l8 8-8 8"
                stroke="#01385F"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        {/* Subtitle */}
        <div className="mt-6 text-[#01385f] text-[24px] font-semibold text-center">
          {places[current].name}
        </div>
        {/* Slider Dots */}
        <div className="flex gap-2 mt-4 justify-center">
          {places.map((_, idx) => (
            <span
              key={idx}
              className={`w-3 h-3 rounded-full ${
                current === idx ? "bg-[#01385f]" : "bg-[#d9d9d9]"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
