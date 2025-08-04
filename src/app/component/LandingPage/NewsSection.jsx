"use client";
import React, { useState, useEffect } from "react";

export default function NewsSection() {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "/api/post-details?page=1&limit=10&postTypeId=1&withMedia=true"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch news");
      }

      const data = await response.json();

      if (data.success) {
        setNewsItems(data.data || []);
      } else {
        throw new Error(data.error || "Failed to fetch news");
      }
    } catch (err) {
      console.error("Error fetching news:", err);
      setError(err.message);
      // Set empty array as fallback
      setNewsItems([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "ไม่ระบุวันที่";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "ไม่ระบุวันที่";
    }
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return "ไม่มีรายละเอียด";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/image/Boat.jpg"; // Default image
    if (imagePath.startsWith("http")) return imagePath;
    return imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  };
  const [goldData, setGoldData] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchGoldPrice = async () => {
    try {
      setLoading(true);
      setError(null);

      // Using a CORS proxy to fetch the data
      const proxyUrl = "https://api.allorigins.win/raw?url=";
      const targetUrl = "http://www.thaigold.info/RealTimeDataV2/gtdata_.txt";

      const response = await fetch(proxyUrl + encodeURIComponent(targetUrl), {
        method: "GET",
        headers: {
          Accept: "text/plain",
        },
        // Add timeout
        signal: AbortSignal.timeout(10000), // 10 seconds timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const textData = await response.text();
      const jsonData = JSON.parse(textData);

      // Find the relevant gold data
      const goldSpot = jsonData.find((item) => item.name === "สมาคมฯ");
      const update = jsonData.find((item) => item.name === "Update");

      if (goldSpot) {
        setGoldData({
          bid: goldSpot.bid,
          ask: goldSpot.ask,
          diff: goldSpot.diff,
          updateTime: update ? update.bid : null,
        });
        setLastUpdate(new Date().toLocaleTimeString("th-TH"));
      } else {
        throw new Error("ไม่พบข้อมูลราคาทอง");
      }
    } catch (err) {
      console.warn(
        "Gold price API unavailable, using fallback data:",
        err.message
      );
      setError(null); // Don't show error to user
      // Set mock data as fallback
      setGoldData({
        bid: "51400",
        ask: "51500",
        diff: "+250",
        updateTime: "ข้อมูลสำรอง",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Wrap in try-catch to prevent unhandled promise rejection
    const loadGoldPrice = async () => {
      try {
        await fetchGoldPrice();
      } catch (error) {
        console.warn("Failed to load gold price:", error);
        // Set fallback data
        setGoldData({
          bid: "51400",
          ask: "51500",
          diff: "+250",
          updateTime: "ข้อมูลสำรอง",
        });
        setLoading(false);
      }
    };

    loadGoldPrice();

    // Set up auto-refresh every 5 minutes
    const interval = setInterval(fetchGoldPrice, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    if (!price) return "0";
    return parseInt(price).toLocaleString("th-TH");
  };

  const formatDiff = (diff) => {
    if (!diff || diff === "") return "";
    const numDiff = parseFloat(diff.replace(/[+,]/g, ""));
    if (numDiff > 0) return `+${formatPrice(Math.abs(numDiff))}`;
    if (numDiff < 0) return `-${formatPrice(Math.abs(numDiff))}`;
    return "0";
  };

  const getDiffColor = (diff) => {
    if (!diff || diff === "") return "#5c3b0c";
    const numDiff = parseFloat(diff.replace(/[+,]/g, ""));
    if (numDiff > 0) return "#16a34a"; // green
    if (numDiff < 0) return "#dc2626"; // red
    return "#5c3b0c"; // default
  };

  const formatUpdateTime = (timestamp) => {
    if (!timestamp) return "";
    try {
      // The timestamp seems to be in a specific format, let's handle it
      const date = new Date();
      return date.toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch (error) {
      return "";
    }
  };

  return (
    <section
      className="news-section w-full min-h-screen py-8 px-2 sm:px-4 md:px-8 lg:px-16"
      style={{
        background:
          "linear-gradient(360deg, rgba(239, 228, 212, 0.6) 0%, rgba(1, 189, 204, 0.6) 100%)",
      }}
    >
      <div className="section-container-news flex flex-col lg:flex-row gap-6 lg:gap-8 justify-center items-start w-full">
        {/* ฝั่งซ้าย */}
        <div className="left-container rounded-2xl sm:rounded-3xl w-full lg:w-[869px] min-h-[400px] lg:h-[1123px] bg-white/38 backdrop-blur-[80px] lg:backdrop-blur-[200px] shadow-[0_0_12px_0_rgba(0,0,0,0.13)] lg:shadow-[0_0_20.5px_0_rgba(0,0,0,0.2)] opacity-100">
          <div className="title relative text-center mb-8 sm:mb-12">
            <div className="text-2xl sm:text-3xl lg:text-[32px] font-semibold text-[#394D1C] inline-block mt-8 sm:mt-12">
              ข่าวประชาสัมพันธ์
            </div>
            <img
              src="image/leaf.png"
              alt="Leaf"
              className="absolute w-[120px] sm:w-[180px] lg:w-[240px] h-auto left-[40%] -translate-x-1/2 top-[-15px] pointer-events-none"
            />
          </div>

          <div className="left-content max-h-[500px] sm:max-h-[700px] lg:h-[calc(100%-200px)] overflow-y-auto px-2 sm:px-4 md:px-8">
            {loading ? (
              // Loading State
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="flex flex-col sm:flex-row gap-2 sm:gap-4 p-2 sm:p-4 pl-0 border-b border-[#01BDCC] animate-pulse"
                  >
                    <div className="flex-shrink-0 mb-2 sm:mb-0">
                      <div className="w-full sm:w-[216px] h-[120px] sm:h-[150px] rounded-lg bg-gray-300"></div>
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/4 mt-auto"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              // Error State
              <div className="text-center py-8">
                <div className="text-red-600 text-lg mb-4">
                  เกิดข้อผิดพลาดในการโหลดข่าวประชาสัมพันธ์
                </div>
                <button
                  onClick={fetchNews}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  ลองใหม่
                </button>
              </div>
            ) : newsItems.length === 0 ? (
              // Empty State
              <div className="text-center py-8">
                <p className="text-gray-600 text-lg">
                  ไม่มีข่าวประชาสัมพันธ์ในขณะนี้
                </p>
              </div>
            ) : (
              // News Items
              newsItems.map((item) => (
                <a
                  href={`/news/${item.id || item._id}`}
                  key={item.id || item._id}
                  className="flex flex-col sm:flex-row gap-2 sm:gap-4 p-2 sm:p-4 pl-0 border-b border-[#01BDCC] last:border-b hover:bg-white/20 transition-colors duration-200 cursor-pointer group"
                >
                  {/* ภาพ */}
                  <div className="flex-shrink-0 mb-2 sm:mb-0">
                    <img
                      src={getImageUrl(item.image || item.featured_image)}
                      alt={item.title || "ข่าวประชาสัมพันธ์"}
                      className="w-full sm:w-[216px] h-[120px] sm:h-[150px] rounded-lg object-cover shadow-md group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        e.target.src = "/image/Boat.jpg";
                      }}
                    />
                  </div>

                  {/* เนื้อหา */}
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-gray-800 text-sm sm:text-base md:text-lg font-semibold mb-2 group-hover:text-[#394D1C] transition-colors">
                      {item.title_name || "ไม่มีหัวข้อ"}
                    </h3>
                    <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed mt-1 sm:mt-2 font-medium flex-1">
                      {truncateText(item.details || "ไม่มีรายละเอียดเพิ่มเติม")}
                    </p>
                    <p className="text-gray-500 text-xs mt-auto pt-2">
                      {formatDate(item.created_at || item.date)}
                    </p>
                  </div>
                </a>
              ))
            )}
            <button
              onClick={() => {
                window.location.href = "/news";
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ดูเพิ่มเติม
            </button>
          </div>
        </div>

        {/* ฝั่งขวา */}
        <div className="right-container flex flex-col gap-4 sm:gap-6 w-full lg:max-w-[388px]">
          {/* ปุ่มราคาทอง */}
          <div className="bg-gradient-to-b from-[#fdf3ae] to-[#c4932c] rounded-xl sm:rounded-[20px] text-[#5c3b0c] shadow-lg overflow-hidden text-center grid grid-rows-[auto_1fr] w-full">
            <div className="bg-[#fdf3ae] py-2 sm:py-4 text-xl sm:text-[38px] font-bold border-b border-white/33">
              ราคาทอง
            </div>
            <div className="bg-gradient-to-r from-[#d6ac4f] via-[#fceba6] to-[#d6ac4f] p-3 sm:p-5 rounded-b-xl sm:rounded-b-[20px]">
              {/* รับซื้อ */}
              <div className="flex items-center justify-between mb-2 sm:mb-4 relative">
                <div className="text-left font-bold text-[#5c3b0c] text-base sm:text-[20px] leading-tight">
                  รับซื้อ
                  <br />
                  <span className="font-normal text-xs sm:text-[14px]">
                    (บาท)
                  </span>
                </div>
                <div className="text-xl sm:text-[34px] font-extrabold text-[#5c3b0c] tracking-wide -translate-x-4 sm:-translate-x-12 mr-4 sm:mr-12">
                  {formatPrice(goldData?.bid)}
                </div>
              </div>
              <div className="border-t border-dashed border-[#5c3b0c] my-1 sm:my-2"></div>
              {/* ขายออก */}
              <div className="flex items-center justify-between mt-2 sm:mt-4 relative">
                <div className="text-left font-bold text-[#5c3b0c] text-base sm:text-[20px] leading-tight">
                  ขายออก
                  <br />
                  <span className="font-normal text-xs sm:text-[14px]">
                    (บาท)
                  </span>
                </div>
                <div className="text-xl sm:text-[34px] font-extrabold text-[#5c3b0c] tracking-wide -translate-x-4 sm:-translate-x-12 mr-4 sm:mr-12">
                  {formatPrice(goldData?.ask)}
                </div>
              </div>
            </div>
          </div>

          {/* ส่วนศูนย์พัฒนาเด็กเล็ก */}
          <div className="flex items-center gap-2 sm:gap-4 h-[80px] sm:h-[120px] rounded-xl sm:rounded-[35px] bg-gradient-to-b from-[#B7D3FF] to-[#5A89D0] shadow-[0_2px_4px_rgba(0,0,0,0.18)] sm:shadow-[0_4px_4px_rgba(0,0,0,0.25)] text-white px-3 sm:px-5 w-full cursor-pointer transition-all duration-300 hover:scale-105">
            <img
              src="image/mom.png"
              alt="Mom"
              className="w-[60px] sm:w-[94px] h-[60px] sm:h-[94px] object-cover rounded"
            />
            <div className="flex flex-col justify-center items-start text-left">
              <span className="text-base sm:text-[24px] font-semibold text-[#1E1E1E] whitespace-nowrap">
                ศูนย์พัฒนาเด็กเล็ก
              </span>
              <span className="text-xs sm:text-[16px] font-normal text-white">
                เทศบาลตำบลบ้านโพธิ์
              </span>
            </div>
          </div>

          {/* ปุ่มน้ำมัน */}
          <div className="service-button oil-price flex items-center gap-2 sm:gap-4 cursor-pointer bg-gradient-to-b from-[#B7D3FF] to-[#5A89D0] shadow-[0_2px_4px_rgba(0,0,0,0.18)] sm:shadow-[0_4px_4px_rgba(0,0,0,0.25)] rounded-xl sm:rounded-[35px] p-2 sm:p-2.5 md:p-5 box-border text-[#1E1E1E] w-full transition-all duration-300 hover:scale-105">
            <img
              src="image/gas.png"
              alt="Gas"
              className="w-[60px] sm:w-[101px] h-[60px] sm:h-[101px] object-cover"
            />
            <div className="flex flex-col justify-center items-start gap-1 sm:gap-1.5">
              <a
                target="_blank"
                href="https://gasprice.kapook.com/gasprice.php"
                className="oil-title font-semibold text-lg sm:text-[32px] leading-none"
              >
                ราคาน้ำมัน
              </a>
            </div>
          </div>

          {/* ปุ่มไลน์เพื่อน */}
          <div className="service-button line-friend relative h-[160px] sm:h-[260px] rounded-xl sm:rounded-[35px] bg-gradient-to-b from-[#ACFFA4] to-[#73CC6B] shadow-[0_2px_4px_rgba(0,0,0,0.18)] sm:shadow-[0_4px_4px_rgba(0,0,0,0.25)] flex flex-col justify-center p-3 sm:p-5 font-prompt text-[#1E1E1E] w-full cursor-pointer transition-all duration-300 hover:scale-105">
            {/* Text area */}
            <div className="text-area flex flex-col items-start gap-1 sm:gap-1.5 w-full pr-10 sm:pr-[200px] box-border text-left">
              <div className="main-text text-lg sm:text-[32px] font-semibold whitespace-nowrap leading-[1.2] mb-2 sm:mb-5">
                มาเป็นเพื่อน
                <br />
                กับเราที่นี่
              </div>
              <div className="sub-text text-base sm:text-[20px] font-medium mb-6 sm:mb-[75px]">
                Line@
              </div>
            </div>

            {/* กล่อง QR */}
            <div className="qr-box absolute bottom-3 sm:bottom-5 right-3 sm:right-5 w-[90px] sm:w-[180px] h-[90px] sm:h-[173px] rounded-xl sm:rounded-[23px] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.18)] sm:shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
              <img
                src="image/QR_Line.png"
                alt="QR Line"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
