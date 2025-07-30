import React from "react";

export function EServiceTop() {
  return (
    <div className="relative w-full flex flex-col md:flex-row items-center justify-center px-2 md:px-8 py-4 gap-4">
      {/* Left Card with image background */}
      <div className="relative w-full md:w-[734px] h-[332px] max-w-[734px] rounded-[35px] shadow-lg overflow-hidden flex flex-col justify-between p-8">
        <img
          src="/image/Eservice.png"
          alt="E-Service Background"
          className="absolute inset-0 w-full h-full object-cover rounded-[35px] z-0"
        />
      </div>
      {/* Right Card with image icon */}
      <img
          src="/image/externalOrgLink.png"
          alt="external org link"
          className=" rounded-[24px] shadow-lg w-full md:w-[386px] max-w-[386px] h-[156px"
        />
    </div>
  );
}
const FaceBookSection = () => {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center w-[90%] max-w-[400px] mx-auto py-8 px-4 bg-gradient-to-br from-[#3AF0FF] to-[#73CC6B] rounded-[24px] shadow-lg text-center">
      <div className="flex items-center justify-center mb-4">
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="48" height="48" rx="12" fill="#fff" fillOpacity="0.2" />
          <path
            d="M32 24h-5v12h-5V24h-3v-4h3v-2c0-2.8 1.2-5 5-5h4v4h-3c-1 0-1 .4-1 1v2h4l-1 4z"
            fill="#fff"
          />
        </svg>
      </div>
      <div className="text-white font-bold text-2xl mb-2">FACEBOOK</div>
      <div className="text-white text-base mb-6">
        เทศบาลตำบลบ้านโพธิ์ ฉะเชิงเทรา
      </div>
      <div className="flex flex-row gap-4 justify-center">
        <button className="bg-white text-[#0383AA] font-semibold rounded-lg px-6 py-2 shadow hover:bg-gray-100 transition">
          กดติดตาม
        </button>
        <button className="bg-white text-[#0383AA] font-semibold rounded-lg px-6 py-2 shadow hover:bg-gray-100 transition">
          ส่งข้อความ
        </button>
      </div>
    </div>
  );
};
const WeatherSection = () => {
  return (
    <div className="relative w-full md:w-[559px] h-[371px] max-w-[559px] rounded-[35px] shadow-md overflow-hidden flex flex-col md:flex-row md:gap-0 gap-4">
      {/* Left box */}
      <div className="relative w-full md:w-[209.08px] h-[256px] bg-[#E2E2E2] rounded-[14px] shadow-lg mt-4 md:mt-[95px] md:ml-[41.56px]">
        {/* <img
          className="absolute top-[80.86px] left-1/2 -translate-x-1/2 w-[39.28px] h-[39.28px] object-cover aspect-square"
          src="cloudy-10.png"
          alt="Cloudy icon"
        /> */}
        <div className="absolute top-[111px] left-1/2 -translate-x-1/2 text-[#1E1E1E] font-semibold text-xl w-[46.6px]">
          วันนี้
        </div>
        <div className="absolute top-[276px] left-1/2 -translate-x-1/2 text-[#1E1E1E] text-base w-[89.43px]">
          ฝนฟ้าคะนอง
        </div>
        <div className="absolute top-[296px] left-1/2 -translate-x-1/2 text-[#1E1E1E] text-base w-[132.25px]">
          ฝน 60% ของพื้นที่
        </div>
        <div className="absolute top-[324px] left-1/2 -translate-x-1/2 text-[#1E1E1E] text-xs w-[73.05px]">
          37 กม./ชม.
        </div>
        <div className="absolute top-[142px] left-1/2 -translate-x-1/2 text-[#1E1E1E] font-medium text-sm w-[57.94px]">
          25 ก.ค.
        </div>
        {/* Temp group */}
        <div className="absolute top-[237px] left-1/2 -translate-x-1/2 flex items-center w-[158.7px] h-[54px]">
          <div className="text-[#1E1E1E] font-semibold text-xl w-[34.01px]">
            34
          </div>
          <div className="text-[#1E1E1E] font-semibold text-xl w-[32.75px] ml-[40px]">
            29
          </div>
          <div className="text-[#1E1E1E] font-semibold text-xs w-[8.82px] ml-[34px]">
            o
          </div>
          <div className="text-[#1E1E1E] font-semibold text-xs w-[8.82px] ml-[74px]">
            o
          </div>
          <div className="w-[24px] h-0.5 bg-[rgba(1,56,95,0.4)] rotate-90 ml-[58.85px]"></div>
          <div className="w-[54px] h-[54px] overflow-hidden aspect-square ml-[44px] relative">
            <img
              className="absolute w-[14%] h-[33%] right-[43%] left-[43%] bottom-[30%] top-[37%]"
              src="meteocons-thermometer-mercury-cold-02.svg"
              alt="Thermometer cold icon"
            />
          </div>
          <div className="w-[54px] h-[54px] overflow-hidden aspect-square ml-[24px] relative">
            <img
              className="absolute w-[14%] h-[33%] right-[43%] left-[43%] bottom-[30%] top-[37%]"
              src="meteocons-thermometer-mercury-cold-03.svg"
              alt="Thermometer cold icon"
            />
          </div>
        </div>
      </div>
      {/* Center box */}
      <div className="relative w-full md:w-[209.08px] h-[256px] bg-[#E2E2E2] rounded-[14px] mt-4 md:mt-[95px] md:ml-[12px]">
        <img
          className="absolute top-[80.86px] left-1/2 -translate-x-1/2 w-[39.28px] h-[39.28px] object-cover aspect-square"
          src="cloudy-20.png"
          alt="Cloudy icon"
        />
        <div className="absolute top-[276px] left-1/2 -translate-x-1/2 text-[#1E1E1E] text-base w-[89.43px]">
          ฝนฟ้าคะนอง
        </div>
        <div className="absolute top-[296px] left-1/2 -translate-x-1/2 text-[#1E1E1E] text-base w-[132.25px]">
          ฝน 60% ของพื้นที่
        </div>
        <div className="absolute top-[324px] left-1/2 -translate-x-1/2 text-[#1E1E1E] text-xs w-[73.05px]">
          37 กม./ชม.
        </div>
        <div className="absolute top-[142px] left-1/2 -translate-x-1/2 text-[#1E1E1E] font-medium text-sm w-[59.2px]">
          26 ก.ค.
        </div>
        <div className="absolute top-[111px] left-1/2 -translate-x-1/2 text-[#1E1E1E] font-medium text-xl w-[59.2px]">
          พรุ่งนี้
        </div>
        {/* Temp group */}
        <div className="absolute top-[237px] left-1/2 -translate-x-1/2 flex items-center w-[158.7px] h-[54px]">
          <div className="text-[#1E1E1E] font-semibold text-xl w-[34.01px]">
            34
          </div>
          <div className="text-[#1E1E1E] font-semibold text-xl w-[32.75px] ml-[40px]">
            29
          </div>
          <div className="text-[#1E1E1E] font-semibold text-xs w-[8.82px] ml-[34px]">
            o
          </div>
          <div className="text-[#1E1E1E] font-semibold text-xs w-[8.82px] ml-[74px]">
            o
          </div>
          <div className="w-[24px] h-0.5 bg-[rgba(1,56,95,0.4)] rotate-90 ml-[58.85px]"></div>
          <div className="w-[54px] h-[54px] overflow-hidden aspect-square ml-[44px] relative">
            <img
              className="absolute w-[14%] h-[33%] right-[43%] left-[43%] bottom-[30%] top-[37%]"
              src="meteocons-thermometer-mercury-cold-00.svg"
              alt="Thermometer cold icon"
            />
          </div>
          <div className="w-[54px] h-[54px] overflow-hidden aspect-square ml-[24px] relative">
            <img
              className="absolute w-[14%] h-[33%] right-[43%] left-[43%] bottom-[30%] top-[37%]"
              src="meteocons-thermometer-mercury-cold-01.svg"
              alt="Thermometer cold icon"
            />
          </div>
        </div>
      </div>
      {/* Right box */}
      <div className="hidden md:block absolute top-[95px] left-[484.92px] w-[74.31px] h-[256px] bg-[#E2E2E2] rounded-l-[14px]"></div>
      {/* Title */}
      <div className="absolute top-[28px] left-1/2 -translate-x-1/2 text-[#0383AA] font-semibold text-2xl md:text-3xl w-full md:w-[358.97px] h-[38px] text-center">
        พยากรณ์อากาศ 7 วัน
      </div>
    </div>
  );
};

export function EServiceBottom() {
  return (
    <div className="relative w-full flex flex-col md:flex-row items-center justify-center px-2 md:px-8 py-4 gap-4">
      <WeatherSection />
      <FaceBookSection />
    </div>
  );
}
