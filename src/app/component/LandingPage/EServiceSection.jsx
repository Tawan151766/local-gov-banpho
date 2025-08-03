import React from "react";

export function EServiceTop() {
  return (
    <div className="relative w-full flex flex-col md:flex-row items-center justify-center px-2 md:px-8 py-4 gap-4">
      {/* Left Card with image background */}
      <a href="/e-service">
        <div className="relative w-full md:w-[734px] h-[332px] max-w-[734px] rounded-[35px] shadow-lg overflow-hidden flex flex-col justify-between p-8">
          <img
            src="/image/Eservice.png"
            alt="E-Service Background"
            className="absolute inset-0 w-full h-full object-cover rounded-[35px] z-0"
          />
        </div>
      </a>
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
        <button
          onClick={() =>
            window.open(
              "https://www.facebook.com/thesbal.tabl.banphothi.chacheingthera/",
              "_blank"
            )
          }
          className="bg-white text-[#0383AA] font-semibold rounded-lg px-6 py-2 shadow hover:bg-gray-100 transition"
        >
          กดติดตาม
        </button>
        <button
          className="bg-white text-[#0383AA] font-semibold rounded-lg px-6 py-2 shadow hover:bg-gray-100 transition"
          onClick={() =>
            window.open(
              "https://www.facebook.com/thesbal.tabl.banphothi.chacheingthera/",
              "_blank",
              "noopener,noreferrer"
            )
          }
        >
          ส่งข้อความ
        </button>
      </div>
    </div>
  );
};
const WeatherSection = () => {
  return (
    <div
      className="relative rounded-[35px] shadow-lg overflow-hidden"
      style={{
        width: "100%",
        maxWidth: "559px",
        height: "371px",
        background:
          "linear-gradient(to top, rgb(89, 179, 221) 0%,rgb(220, 236, 245) 50%,rgb(255, 255, 255) 100%)",
        boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25)",
      }}
    >
      {/* TMD Weather Widget */}
      <iframe
        src="https://www.tmd.go.th/weatherForecast7DaysWidget?province=ฉะเชิงเทรา"
        width="100%"
        height="100%"
        scrolling="no"
        frameBorder="0"
        style={{
          border: "none",
          borderRadius: "35px",
        }}
        title="พยากรณ์อากาศ 7 วัน - ฉะเชิงเทรา"
      />
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
