import React from "react";

const places = [
  {
    name: "วัดสนามจันทร์",
    img: "/image/yak.jpg",
  },
  {
    name: "วัดสนามจันทร์",
    img: "/image/whitecastle.jpg",
  },
  {
    name: "วัดสนามจันทร์",
    img: "/image/market.jpg",
  },
  {
    name: "วัดสนามจันทร์",
    img: "/image/yak.jpg",
  },
  {
    name: "วัดสนามจันทร์",
    img: "/image/whitecastle.jpg",
  },
  {
    name: "วัดสนามจันทร์",
    img: "/image/market.jpg",
  },
];

export default function TravelSection() {
  const [current, setCurrent] = React.useState(0);
  const handlePrev = () =>
    setCurrent((prev) => (prev === 0 ? places.length - 1 : prev - 1));
  const handleNext = () =>
    setCurrent((prev) => (prev === places.length - 1 ? 0 : prev + 1));

  return (
    <div className="relative w-full min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] flex flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      <img
        src="/image/travel_bg.png"
        alt="bg"
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      />
      <div
        className="absolute top-0 left-0 w-full h-full -z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(240,226,213,0.51) 0%, rgba(5,197,255,0.51) 100%)",
        }}
      />

      {/* Top Bar Decoration */}
      <img
        src="/image/travel_header.png"
        alt="top-bar"
        className="absolute top-0 left-0 w-full h-[60px] sm:h-[80px] lg:h-[119px] object-cover"
      />

      {/* Title */}
      <div className="absolute top-3 sm:top-4 lg:top-6 left-1/2 -translate-x-1/2 text-yellow-400 text-base sm:text-2xl lg:text-4xl font-semibold z-10 px-2 sm:px-4 text-center whitespace-nowrap">
        ที่นี่เทศบาลบ้านโพธิ์
      </div>

      {/* Card Container */}
      <div className="relative w-full max-w-[95%] sm:max-w-4xl lg:max-w-6xl mx-auto mt-16 sm:mt-24 lg:mt-32 mb-4 sm:mb-6 lg:mb-8 flex flex-col items-center justify-center px-2 sm:px-4">
        <div className="absolute inset-0 w-full box-border bg-white/15 rounded-[20px] sm:rounded-[40px] lg:rounded-[58px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] sm:shadow-[0px_0px_15px_rgba(0,0,0,0.2)] lg:shadow-[0px_0px_20.5px_rgba(0,0,0,0.2)] backdrop-blur-[24px] sm:backdrop-blur-[36px] lg:backdrop-blur-[48.45px] z-0" />

        <div className="relative w-full flex items-center justify-center h-[280px] sm:h-[350px] lg:h-[420px] z-10">
          {/* Side Cards - Hidden on mobile, visible on tablet+ */}
          <div className="hidden sm:block absolute left-[5%] lg:left-[10%] top-1/2 -translate-y-1/2 scale-[0.6] sm:scale-75 opacity-40 z-0 transition-all duration-500">
            <img
              src={places[(current - 2 + places.length) % places.length].img}
              alt="left-2"
              className="w-[140px] h-[180px] sm:w-[180px] sm:h-[240px] lg:w-[220px] lg:h-[290px] rounded-[15px] sm:rounded-[20px] lg:rounded-[30px] border-2 lg:border-[3px] border-white shadow object-cover transition-all duration-500"
            />
          </div>

          <div className="hidden md:block absolute left-[15%] lg:left-1/4 top-1/2 -translate-y-1/2 scale-75 sm:scale-90 opacity-70 z-0 transition-all duration-500">
            <img
              src={places[(current - 1 + places.length) % places.length].img}
              alt="left"
              className="w-[160px] h-[210px] sm:w-[200px] sm:h-[260px] lg:w-[260px] lg:h-[340px] rounded-[15px] sm:rounded-[20px] lg:rounded-[30px] border-2 sm:border-[3px] lg:border-[4px] border-white shadow-lg object-cover transition-all duration-500"
            />
          </div>

          {/* Right Cards */}
          <div className="hidden md:block absolute right-[15%] lg:right-1/4 top-1/2 -translate-y-1/2 scale-75 sm:scale-90 opacity-70 z-0 transition-all duration-500">
            <img
              src={places[(current + 1) % places.length].img}
              alt="right"
              className="w-[160px] h-[210px] sm:w-[200px] sm:h-[260px] lg:w-[260px] lg:h-[340px] rounded-[15px] sm:rounded-[20px] lg:rounded-[30px] border-2 sm:border-[3px] lg:border-[4px] border-white shadow-lg object-cover transition-all duration-500"
            />
          </div>

          <div className="hidden sm:block absolute right-[5%] lg:right-[10%] top-1/2 -translate-y-1/2 scale-[0.6] sm:scale-75 opacity-40 z-0 transition-all duration-500">
            <img
              src={places[(current + 2) % places.length].img}
              alt="right-2"
              className="w-[140px] h-[180px] sm:w-[180px] sm:h-[240px] lg:w-[220px] lg:h-[290px] rounded-[15px] sm:rounded-[20px] lg:rounded-[30px] border-2 lg:border-[3px] border-white shadow object-cover transition-all duration-500"
            />
          </div>

          {/* Center Card */}
          <div className="relative z-10 flex items-center justify-center transition-all duration-500">
            <img
              src={places[current].img}
              alt="main"
              className="w-[200px] h-[260px] sm:w-[240px] sm:h-[320px] lg:w-[320px] lg:h-[400px] rounded-[20px] sm:rounded-[25px] lg:rounded-[30px] border-[3px] sm:border-[4px] lg:border-[5px] border-white shadow-xl object-cover transition-all duration-500 opacity-100"
              style={{ transition: "opacity 0.5s, transform 0.5s" }}
            />
          </div>

          {/* Prev/Next Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 lg:left-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1.5 sm:p-2 shadow hover:bg-opacity-100 z-20 transition-all duration-200"
            aria-label="prev"
          >
            <svg className="w-6 h-6 " fill="none">
              <path
                d="M12 4l-6 6 6 6"
                stroke="#01385F"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-4 lg:right-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1.5 sm:p-2 shadow hover:bg-opacity-100 z-20 transition-all duration-200"
            aria-label="next"
          >
            <svg className="w-6 h-6 " fill="none">
              <path
                d="M8 4l6 6-6 6"
                stroke="#01385F"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Subtitle */}
        <div className="mt-3 sm:mt-4 lg:mt-6 text-[#01385f] text-base sm:text-xl lg:text-[24px] font-semibold text-center px-4">
          {places[current].name}
        </div>

        {/* Slider Dots */}
        <div className="flex gap-1.5 sm:gap-2 mt-2 sm:mt-3 lg:mt-4 justify-center">
          {places.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 rounded-full transition-colors duration-200 ${
                current === idx ? "bg-[#01385f]" : "bg-[#d9d9d9]"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
