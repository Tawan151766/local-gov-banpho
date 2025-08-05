"use client";
import { useState, useEffect } from "react";

export default function FinanceSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    fetchEGPPosts();
  }, []);

  useEffect(() => {
    filterPostsByCategory();
  }, [posts, activeCategory]);

  const fetchEGPPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://egp.sosmartsolution.com/api.php?deptsub=1509900857"
      );
      const result = await response.json();
      console.log("result :>> ", result);
      if (result.success) {
        setPosts(result.data);
      }
    } catch (error) {
      console.error("Error fetching EGP posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterPostsByCategory = () => {
    if (activeCategory === "all") {
      setFilteredPosts(posts.slice(0, 4)); // แสดงเฉพาะ 4 รายการแรก
    } else {
      const filtered = posts.filter((post) => {
        switch (activeCategory) {
          case "egp":
            return post.announce_type === "15"; // ประกาศ EGP
          case "procurement":
            return post.announce_type.startsWith("P0"); // ประกาศจัดซื้อจัดจ้าง
          case "result":
            return post.announce_type.startsWith("D"); // ผลประกาศจัดซื้อจัดจ้าง
          case "price":
            return post.announce_type.startsWith("M"); // ประกาศราคากลาง
          case "report":
            return post.announce_type.startsWith("W"); // รายงานผลจัดซื้อจัดจ้าง
          default:
            return true;
        }
      });
      setFilteredPosts(filtered.slice(0, 4));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "ไม่ระบุวันที่";

    const date = new Date(dateString);
    const thaiMonths = [
      "ม.ค.",
      "ก.พ.",
      "มี.ค.",
      "เม.ย.",
      "พ.ค.",
      "มิ.ย.",
      "ก.ค.",
      "ส.ค.",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค.",
    ];

    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543;

    return `${day} ${month} ${year}`;
  };

  const getPostTypeColor = (announceType) => {
    if (!announceType) return "#73cc6b";

    // ประกาศ EGP
    if (announceType === "15") return "#e74c3c";
    // ประกาศจัดซื้อจัดจ้าง
    if (announceType.startsWith("P")) return "#73cc6b";
    // ผลประกาศจัดซื้อจัดจ้าง
    if (announceType.startsWith("D")) return "#f39c12";
    // ประกาศราคากลาง
    if (announceType.startsWith("M")) return "#9b59b6";
    // รายงานผลจัดซื้อจัดจ้าง
    if (announceType.startsWith("W")) return "#3498db";

    return "#73cc6b";
  };

  const getPostTypeName = (announceType) => {
    if (!announceType) return "ประกาศ";

    // ประกาศ EGP
    if (announceType === "15") return "ประกาศ EGP";
    // ประกาศจัดซื้อจัดจ้าง
    if (announceType.startsWith("P")) return "ประกาศจัดซื้อจัดจ้าง";
    // ผลประกาศจัดซื้อจัดจ้าง
    if (announceType.startsWith("D")) return "ผลประกาศจัดซื้อจัดจ้าง";
    // ประกาศราคากลาง
    if (announceType.startsWith("M")) return "ประกาศราคากลาง";
    // รายงานผลจัดซื้อจัดจ้าง
    if (announceType.startsWith("W")) return "รายงานผลจัดซื้อจัดจ้าง";

    return "ประกาศ";
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return "ไม่มีรายละเอียด";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const handlePostClick = (post) => {
    if (post.link) {
      window.open(post.link, "_blank");
    }
  };

  return (
    <div
      className="w-full min-h-[900px] py-8 px-2 md:px-8 flex flex-col items-center"
      style={{
        backgroundImage:
          'linear-gradient(180deg, rgba(239, 228, 212, 0.6) 0%, rgba(1, 189, 204, 0.6) 100%), url("/image/Boat.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-[1268px] flex flex-col gap-4 mb-8">
        <div className="bg-gradient-to-r from-[#03bdca] to-[#01bdcc] rounded-[36px] shadow-lg w-full flex flex-col md:flex-row items-center px-3 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6 relative">
          <div className="flex-1 flex flex-wrap flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
            {activeCategory === "egp" ? (
              <div className="bg-white rounded-full shadow-md  h-10  flex items-center justify-center border-2 border-[#01bdcc]">
                <span className="text-[#01385f] font-bold text-xs sm:text-sm md:text-sm text-center leading-tight px-1 sm:px-2">
                  ประกาศ EGP
                </span>
              </div>
            ) : (
              <button
                onClick={() => handleCategoryClick("egp")}
                className="text-white font-semibold text-xs sm:text-sm md:text-base lg:text-lg drop-shadow transition-all duration-200 hover:scale-105 cursor-pointer hover:bg-white/10 px-2 sm:px-3 py-1 sm:py-2 rounded-xl"
              >
                ประกาศ EGP
              </button>
            )}

            {activeCategory === "procurement" ? (
              <div className="bg-white rounded-full shadow-md  h-10  flex items-center justify-center border-2 border-[#01bdcc]">
                <span className="text-[#01385f] font-bold text-xs sm:text-sm md:text-sm text-center leading-tight px-1 sm:px-2">
                  ประกาศจัดซื้อจัดจ้าง
                </span>
              </div>
            ) : (
              <button
                onClick={() => handleCategoryClick("procurement")}
                className="text-white font-semibold text-xs sm:text-sm md:text-base lg:text-lg drop-shadow transition-all duration-200 hover:scale-105 cursor-pointer hover:bg-white/10 px-2 sm:px-3 py-1 sm:py-2 rounded-xl"
              >
                ประกาศจัดซื้อจัดจ้าง
              </button>
            )}

            {activeCategory === "result" ? (
              <div className="bg-white rounded-full shadow-md  h-10  flex items-center justify-center border-2 border-[#01bdcc]">
                <span className="text-[#01385f] font-bold text-xs sm:text-sm md:text-sm text-center leading-tight px-1 sm:px-2">
                  ผลประกาศจัดซื้อจัดจ้าง
                </span>
              </div>
            ) : (
              <button
                onClick={() => handleCategoryClick("result")}
                className="text-white font-semibold text-xs sm:text-sm md:text-base lg:text-lg drop-shadow transition-all duration-200 hover:scale-105 cursor-pointer hover:bg-white/10 px-2 sm:px-3 py-1 sm:py-2 rounded-xl"
              >
                ผลประกาศจัดซื้อจัดจ้าง
              </button>
            )}

            {activeCategory === "price" ? (
              <div className="bg-white rounded-full shadow-md  h-10  flex items-center justify-center border-2 border-[#01bdcc]">
                <span className="text-[#01385f] font-bold text-xs sm:text-sm md:text-sm text-center leading-tight px-1 sm:px-2">
                  ประกาศราคากลาง
                </span>
              </div>
            ) : (
              <button
                onClick={() => handleCategoryClick("price")}
                className="text-white font-semibold text-xs sm:text-sm md:text-base lg:text-lg drop-shadow transition-all duration-200 hover:scale-105 cursor-pointer hover:bg-white/10 px-2 sm:px-3 py-1 sm:py-2 rounded-xl"
              >
                ประกาศราคากลาง
              </button>
            )}

            {activeCategory === "report" ? (
              <div className="bg-white rounded-full shadow-md  h-10  flex items-center justify-center border-2 border-[#01bdcc]">
                <span className="text-[#01385f] font-bold text-xs sm:text-sm md:text-sm text-center leading-tight px-1 sm:px-2">
                  รายงานผลจัดซื้อจัดจ้าง
                </span>
              </div>
            ) : (
              <button
                onClick={() => handleCategoryClick("report")}
                className="text-white font-semibold text-xs sm:text-sm md:text-base lg:text-lg drop-shadow transition-all duration-200 hover:scale-105 cursor-pointer hover:bg-white/10 px-2 sm:px-3 py-1 sm:py-2 rounded-xl"
              >
                รายงานผลจัดซื้อจัดจ้าง
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1268px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {loading ? (
          // Loading skeleton
          [...Array(4)].map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-[29px] border-4 border-[#01bdcc] shadow-md p-6 flex flex-col gap-2 relative animate-pulse"
            >
              <div className="flex flex-row items-center justify-between mb-2">
                <div className="h-6 bg-gray-300 rounded w-24"></div>
                <div className="h-8 bg-gray-300 rounded w-20"></div>
              </div>
              <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="flex flex-row items-center justify-between mt-4">
                <div className="h-4 bg-gray-300 rounded w-16"></div>
              </div>
            </div>
          ))
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map((post, idx) => (
            <div
              key={`${post.deptsub_id}-${post.announce_type}-${idx}`}
              className="bg-white rounded-[29px] border-4 border-[#01bdcc] shadow-md p-6 flex flex-col gap-2 relative cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
              onClick={() => handlePostClick(post)}
            >
              <div className="flex flex-row items-center justify-between mb-2">
                <span className="text-[#01385f] font-semibold text-lg">
                  {formatDate(post.pub_date)}
                </span>
                <span
                  className="rounded px-4 py-1 text-white text-base font-medium shadow-sm"
                  style={{
                    backgroundColor: getPostTypeColor(post.announce_type),
                  }}
                >
                  {getPostTypeName(post.announce_type)}
                </span>
              </div>

              <div className="text-[#1e1e1e] text-base mb-2 font-semibold leading-relaxed">
                {truncateText(post.title, 120)}
              </div>

              <div className="flex flex-row items-center justify-between mt-4">
                <span className="text-[#01385f] font-semibold text-base hover:underline">
                  ดูรายละเอียด
                </span>
                <div className="flex gap-2 text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded-full font-medium">
                    {post.announce_type}
                  </span>
                </div>
              </div>

              {/* Click indicator */}
              <div className="absolute top-3 right-3 opacity-50 group-hover:opacity-100 transition-opacity">
                <svg
                  className="w-5 h-5 text-[#01385f]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </div>
            </div>
          ))
        ) : (
          // No data message
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <div className="text-gray-500 text-lg mb-2">
              {activeCategory === "all"
                ? "ไม่มีข้อมูลประกาศจัดซื้อจัดจ้าง"
                : `ไม่มีข้อมูล${
                    activeCategory === "egp"
                      ? "ประกาศ EGP"
                      : activeCategory === "procurement"
                      ? "ประกาศจัดซื้อจัดจ้าง"
                      : activeCategory === "result"
                      ? "ผลประกาศจัดซื้อจัดจ้าง"
                      : activeCategory === "price"
                      ? "ประกาศราคากลาง"
                      : "รายงานผลจัดซื้อจัดจ้าง"
                  }`}
            </div>
            <div className="text-gray-400 text-sm">
              กรุณาเพิ่มข้อมูลในระบบ EGP
            </div>
          </div>
        )}
      </div>

      {/* View All Button */}
      {filteredPosts.length > 0 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => (window.location.href = "/egp")}
            className="bg-[#01385f] text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-[#01385f]/90 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            ดูข้อมูลทั้งหมด ({posts.length} รายการ)
          </button>
        </div>
      )}
    </div>
  );
}
