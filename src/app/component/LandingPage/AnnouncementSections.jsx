import React from "react";

const images = [
  "/image/annu.jpg",
  "/image/annu.jpg",
  "/image/annu.jpg"
];

export default function AnnouncementSections() {
  const [current, setCurrent] = React.useState(0);
  const handlePrev = () => setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const handleNext = () => setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  return (
    <div className="relative w-screen min-h-screen shadow-[0_18.4px_18.4px_rgba(0,0,0,0.49)] overflow-hidden flex flex-col items-center justify-center">
      {/* Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#A8F9FF] to-[#E8DDC4] -z-10" />

      {/* Top Bar Image */}
      <img
        src="/image/union0.svg"
        alt="Top Bar"
        className="w-full h-[119px] object-cover"
      />

      {/* Slider Section */}
      <div className="w-full max-w-3xl mx-auto px-4 py-12 flex items-center justify-center gap-6">
        <button
          onClick={handlePrev}
          className="bg-white bg-opacity-70 rounded-full p-2 shadow hover:bg-opacity-100"
          aria-label="prev"
        >
          <svg width="32" height="32" fill="none"><path d="M20 8l-8 8 8 8" stroke="#01385F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <img
          src={images[current]}
          alt={`slide-${current}`}
          className="w-full h-[340px] md:h-[440px] object-cover rounded-[40px] shadow-lg"
        />
        <button
          onClick={handleNext}
          className="bg-white bg-opacity-70 rounded-full p-2 shadow hover:bg-opacity-100"
          aria-label="next"
        >
          <svg width="32" height="32" fill="none"><path d="M12 8l8 8-8 8" stroke="#01385F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
      {/* จุด slider */}
      <div className="flex gap-3 mt-4">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`w-3 h-3 rounded-full ${current === idx ? "bg-[#01385F]" : "bg-gray-400 opacity-50"}`}
          />
        ))}
      </div>
    </div>
  );
}
