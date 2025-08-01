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
  const weatherData = [
    {
      day: "วันนี้",
      date: "25 ก.ค.",
      icon: "cloudy",
      highTemp: 34,
      lowTemp: 29,
      description: "ฝนฟ้าคะนองฝน",
      windSpeed: 37,
      rainChance: 60,
    },
    {
      day: "พรุ่งนี้",
      date: "26 ก.ค.",
      icon: "sunny",
      highTemp: 36,
      lowTemp: 28,
      description: "แสงแดดจัด",
      windSpeed: 25,
      rainChance: 10,
    },
    {
      day: "วันอังคาร",
      date: "27 ก.ค.",
      icon: "partly-cloudy",
      highTemp: 33,
      lowTemp: 27,
      description: "เมฆบางส่วน",
      windSpeed: 30,
      rainChance: 20,
    },
    {
      day: "วันพุธ",
      date: "28 ก.ค.",
      icon: "rainy",
      highTemp: 31,
      lowTemp: 26,
      description: "ฝนตกหนัก",
      windSpeed: 45,
      rainChance: 90,
    },
    {
      day: "วันพฤหัส",
      date: "29 ก.ค.",
      icon: "stormy",
      highTemp: 30,
      lowTemp: 25,
      description: "พายุฝนฟ้าคะนอง",
      windSpeed: 55,
      rainChance: 85,
    },
    {
      day: "วันศุกร์",
      date: "30 ก.ค.",
      icon: "cloudy",
      highTemp: 32,
      lowTemp: 27,
      description: "เมฆมาก",
      windSpeed: 35,
      rainChance: 40,
    },
    {
      day: "วันเสาร์",
      date: "31 ก.ค.",
      icon: "sunny",
      highTemp: 35,
      lowTemp: 29,
      description: "ท้องฟ้าแจ่มใส",
      windSpeed: 20,
      rainChance: 5,
    },
  ]

  const getWeatherIcon = (iconType) => {
    const iconMap = {
      sunny: "☀️",
      cloudy: "☁️",
      "partly-cloudy": "⛅",
      rainy: "🌧️",
      stormy: "⛈️",
    }
    return iconMap[iconType] || "☁️"
  }

  return (
    <div
      className="relative rounded-[35px] shadow-lg"
      style={{
        width: "100%",
        maxWidth: "559px",
        height: "371px",
        background: "linear-gradient(to top, rgb(89, 179, 221) 0%,rgb(220, 236, 245) 50%,rgb(255, 255, 255) 100%)",
        boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25)",
      }}
    >
      {/* Header */}
      <div className="pt-6 px-6 pb-3">
        <h1
          className="font-semibold text-center"
          style={{
            color: "#0383AA",
            fontFamily: "Inter",
            fontSize: "28px",
            fontWeight: 600,
            lineHeight: "normal",
          }}
        >
          พยากรณ์อากาศ 7 วัน
        </h1>
      </div>

      {/* Weather Cards Container */}
      <div className="px-4 pb-4">
        <div
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {weatherData.map((weather, index) => (
            <div
              key={index}
              className="flex-shrink-0 rounded-2xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer group"
              style={{
                width: "160px",
                height: "240px",
                background:
                  index === 0
                    ? "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)"
                    : "linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)",
                boxShadow: index === 0 ? "0 6px 20px 0 rgba(3, 131, 170, 0.15)" : "0 3px 10px 0 rgba(0, 0, 0, 0.1)",
                border: index === 0 ? "2px solid rgba(3, 131, 170, 0.2)" : "1px solid rgba(0, 0, 0, 0.05)",
              }}
            >
              {/* Day */}
              <div
                className={`font-bold mb-1 ${index === 0 ? "text-blue-600" : "text-gray-700"}`}
                style={{
                  fontFamily: "Inter",
                  fontSize: "16px",
                  fontWeight: 700,
                  lineHeight: "normal",
                }}
              >
                {weather.day}
              </div>

              {/* Date */}
              <div
                className="mb-3 text-gray-600"
                style={{
                  fontFamily: "Inter",
                  fontSize: "12px",
                  fontWeight: 500,
                  lineHeight: "normal",
                }}
              >
                {weather.date}
              </div>

              {/* Weather Icon */}
              <div className="flex justify-center mb-3">
                <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                  {getWeatherIcon(weather.icon)}
                </div>
              </div>

              {/* Temperature */}
              <div className="flex justify-center items-center gap-2 mb-3">
                {/* High Temperature */}
                <div className="flex items-center gap-1">
                  <svg width="6" height="14" viewBox="0 0 8 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_360_333)">
                      <path
                        d="M3.95718 17.7031C5.61404 17.7031 6.95718 16.36 6.95718 14.7031C6.95718 13.0463 5.61404 11.7031 3.95718 11.7031C2.30033 11.7031 0.957184 13.0463 0.957184 14.7031C0.957184 16.36 2.30033 17.7031 3.95718 17.7031Z"
                        fill="#EF4444"
                      />
                      <path
                        d="M3.95718 1.48438V14.1406"
                        stroke="#EF4444"
                        strokeWidth="2"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_360_333">
                        <rect width="7.59375" height="17.7188" fill="white" transform="translate(0.160309)" />
                      </clipPath>
                    </defs>
                  </svg>
                  <span
                    className="font-bold text-red-500"
                    style={{
                      fontFamily: "Inter",
                      fontSize: "14px",
                      fontWeight: 700,
                    }}
                  >
                    {weather.highTemp}°
                  </span>
                </div>

                {/* Separator */}
                <div className="w-px h-3 bg-gray-300"></div>

                {/* Low Temperature */}
                <div className="flex items-center gap-1">
                  <svg width="6" height="14" viewBox="0 0 8 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_360_329)">
                      <path
                        d="M3.97589 17.7031C5.63275 17.7031 6.97589 16.36 6.97589 14.7031C6.97589 13.0463 5.63275 11.7031 3.97589 11.7031C2.31904 11.7031 0.975891 13.0463 0.975891 14.7031C0.975891 16.36 2.31904 17.7031 3.97589 17.7031Z"
                        fill="#3B82F6"
                      />
                      <path
                        d="M3.97589 1.48438V14.1406"
                        stroke="#3B82F6"
                        strokeWidth="2"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_360_329">
                        <rect width="7.59375" height="17.7188" fill="white" transform="translate(0.179016)" />
                      </clipPath>
                    </defs>
                  </svg>
                  <span
                    className="font-bold text-blue-500"
                    style={{
                      fontFamily: "Inter",
                      fontSize: "14px",
                      fontWeight: 700,
                    }}
                  >
                    {weather.lowTemp}°
                  </span>
                </div>
              </div>

              {/* Weather Description */}
              <div
                className="text-center mb-2 text-gray-700"
                style={{
                  fontFamily: "Inter",
                  fontSize: "11px",
                  fontWeight: 500,
                  lineHeight: "1.2",
                }}
              >
                {weather.description}
              </div>

              {/* Rain Chance */}
              <div
                className="text-center mb-1 text-blue-600"
                style={{
                  fontFamily: "Inter",
                  fontSize: "10px",
                  fontWeight: 600,
                }}
              >
                ฝน {weather.rainChance}%
              </div>

              {/* Wind Speed */}
              <div
                className="text-center text-gray-500"
                style={{
                  fontFamily: "Inter",
                  fontSize: "9px",
                  fontWeight: 500,
                }}
              >
                🌬️ {weather.windSpeed} กม./ชม.
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export function EServiceBottom() {
  return (
    <div className="relative w-full flex flex-col md:flex-row items-center justify-center px-2 md:px-8 py-4 gap-4">
      <WeatherSection />
      <FaceBookSection />
    </div>
  );
}
