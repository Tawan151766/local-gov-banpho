import React from "react";

export default function Weather() {
  return (
    <div className="absolute top-[525px] left-[12vw] sm:left-[231.56px] w-[30vw] max-w-[209.08px] h-[40vw] max-h-[256px]">
      <div
        className="absolute top-0 left-0 w-full h-full bg-[#E2E2E2] rounded-[14px] shadow-lg"
        style={{ boxShadow: "0px 0px 13.7px 0px rgba(0, 0, 0, 0.3)" }}
      ></div>
      <img
        className="absolute top-[80.86px] left-1/2 -translate-x-1/2 w-[8vw] max-w-[39.28px] h-[8vw] max-h-[39.28px] object-cover aspect-square"
        src="cloudy-10.png"
        alt="Cloudy icon"
      />
      <div
        className="absolute top-[16px] left-1/2 -translate-x-1/2 text-[#1E1E1E] text-left font-semibold text-xs sm:text-xl w-[10vw] max-w-[46.6px]"
        style={{ left: "calc(50% - 23.3px)" }}
      >
        วันนี้
      </div>
      <div
        className="absolute top-[181px] left-1/2 -translate-x-1/2 text-[#1E1E1E] text-left font-normal text-xs sm:text-sm w-[20vw] max-w-[89.43px]"
        style={{ left: "calc(50% - 44.715px)" }}
      >
        ฝนฟ้าคะนอง
      </div>
      <div
        className="absolute top-[201px] left-1/2 -translate-x-1/2 text-[#1E1E1E] text-left font-normal text-xs sm:text-sm w-[30vw] max-w-[132.25px]"
        style={{ left: "calc(50% - 66.125px)" }}
      >
        ฝน 60% ของพื้นที่
      </div>
      <div
        className="absolute top-[229px] left-1/2 -translate-x-1/2 text-[#1E1E1E] text-left font-normal text-[10px] sm:text-xs w-[15vw] max-w-[73.05px]"
        style={{ left: "calc(50% - 36.525px)" }}
      >
        37 กม./ชม.
      </div>
      <div
        className="absolute top-[47px] left-1/2 -translate-x-1/2 text-[#1E1E1E] text-left font-medium text-[10px] sm:text-sm w-[10vw] max-w-[57.94px]"
        style={{ left: "calc(50% - 28.97px)" }}
      >
        25 ก.ค.
      </div>
      <div className="flex items-center justify-between w-full max-w-[160px] mx-auto h-[54px] gap-2 relative">
        <div className="flex flex-col items-center justify-center">
          <span className="text-[#1E1E1E] font-semibold text-base sm:text-xl">34</span>
          <span className="text-[10px] sm:text-xs text-[#1E1E1E]">o</span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-[#1E1E1E] font-semibold text-base sm:text-xl">29</span>
          <span className="text-[10px] sm:text-xs text-[#1E1E1E]">o</span>
        </div>
        <div className="w-0.5 h-6 bg-[rgba(1,56,95,0.4)] rotate-90 mx-2"></div>
        <div className="flex items-center">
          <div className="w-[54px] h-[54px] overflow-hidden aspect-square relative">
            <img
              className="absolute w-[14%] h-[33%] right-[43%] left-[43%] bottom-[30%] top-[37%]"
              src="meteocons-thermometer-mercury-cold-02.svg"
              alt="Thermometer cold icon"
            />
          </div>
          <div className="w-[54px] h-[54px] overflow-hidden aspect-square relative ml-2">
            <img
              className="absolute w-[14%] h-[33%] right-[43%] left-[43%] bottom-[30%] top-[37%]"
              src="meteocons-thermometer-mercury-cold-03.svg"
              alt="Thermometer cold icon"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
