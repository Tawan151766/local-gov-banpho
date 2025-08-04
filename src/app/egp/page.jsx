"use client";
import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EGPMainPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchEGPPosts();
  }, []);

  useEffect(() => {
    filterPostsByCategory();
  }, [posts, activeCategory]);

  const fetchEGPPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://egp.sosmartsolution.com/api.php?deptsub=1509900857");
      const result = await response.json();

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
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post => {
        switch (activeCategory) {
          case "egp":
            return post.announce_type === "15";
          case "procurement":
            return post.announce_type.startsWith("P");
          case "result":
            return post.announce_type.startsWith("D");
          case "price":
            return post.announce_type.startsWith("M");
          case "report":
            return post.announce_type.startsWith("W");
          default:
            return true;
        }
      });
      setFilteredPosts(filtered);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "ไม่ระบุวันที่";

    const date = new Date(dateString);
    const thaiMonths = [
      "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
      "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
    ];

    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543;

    return `${day} ${month} ${year}`;
  };

  const getPostTypeColor = (announceType) => {
    if (!announceType) return "#73cc6b";

    if (announceType === "15") return "#e74c3c";
    if (announceType.startsWith("P")) return "#73cc6b";
    if (announceType.startsWith("D")) return "#f39c12";
    if (announceType.startsWith("M")) return "#9b59b6";
    if (announceType.startsWith("W")) return "#3498db";
    
    return "#73cc6b";
  };

  const getPostTypeName = (announceType) => {
    if (!announceType) return "ประกาศ";

    if (announceType === "15") return "ประกาศ EGP";
    if (announceType.startsWith("P")) return "ประกาศจัดซื้อจัดจ้าง";
    if (announceType.startsWith("D")) return "ผลประกาศจัดซื้อจัดจ้าง";
    if (announceType.startsWith("M")) return "ประกาศราคากลาง";
    if (announceType.startsWith("W")) return "รายงานผลจัดซื้อจัดจ้าง";
    
    return "ประกาศ";
  };

  const getCategoryDisplayName = (category) => {
    switch (category) {
      case "egp": return "ประกาศ EGP";
      case "procurement": return "ประกาศจัดซื้อจัดจ้าง";
      case "result": return "ผลประกาศจัดซื้อจัดจ้าง";
      case "price": return "ประกาศราคากลาง";
      case "report": return "รายงานผลจัดซื้อจัดจ้าง";
      default: return "ประกาศจัดซื้อจัดจ้างทั้งหมด";
    }
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
    // สร้าง ID จาก deptsub_id และ announce_type
    const postId = `${post.deptsub_id}-${post.announce_type}-${encodeURIComponent(post.title.substring(0, 50))}`;
    router.push(`/egp/detail/${postId}`);
  };

  return (
    <div
      className="w-full min-h-screen py-8 px-2 md:px-8 flex flex-col items-center"
      style={{
        backgroundImage:
          'linear-gradient(180deg, rgba(239, 228, 212, 0.6) 0%, rgba(1, 189, 204, 0.6) 100%), url("/image/Boat.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Header Section */}
      <div className="w-full max-w-[1268px] flex flex-col gap-4 mb-8">
        {/* Navigation */}
        <div className="flex items-center gap-4 mb-4">
          <Link href="/" className="flex items-center gap-2 text-[#01385f] hover:text-[#01385f]/80 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-semibold">กลับหน้าหลัก</span>
          </Link>
        </div>

        <div className="bg-gradient-to-r from-[#03bdca] to-[#01bdcc] rounded-[36px] shadow-lg w-full flex flex-col md:flex-row items-center px-3 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6 relative">
          <div className="flex-1 flex flex-wrap flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
            {activeCategory === "egp" ? (
              <div className="bg-white rounded-full shadow-md w-20 h-10 sm:w-24 sm:h-12 md:w-28 md:h-14 lg:w-32 lg:h-16 flex items-center justify-center border-2 border-[#01bdcc]">
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
              <div className="bg-white rounded-full shadow-md w-20 h-10 sm:w-24 sm:h-12 md:w-28 md:h-14 lg:w-32 lg:h-16 flex items-center justify-center border-2 border-[#01bdcc]">
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
              <div className="bg-white rounded-full shadow-md w-20 h-10 sm:w-24 sm:h-12 md:w-28 md:h-14 lg:w-32 lg:h-16 flex items-center justify-center border-2 border-[#01bdcc]">
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
              <div className="bg-white rounded-full shadow-md w-20 h-10 sm:w-24 sm:h-12 md:w-28 md:h-14 lg:w-32 lg:h-16 flex items-center justify-center border-2 border-[#01bdcc]">
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
              <div className="bg-white rounded-full shadow-md w-20 h-10 sm:w-24 sm:h-12 md:w-28 md:h-14 lg:w-32 lg:h-16 flex items-center justify-center border-2 border-[#01bdcc]">
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

            {activeCategory === "all" ? (
              <div className="bg-white rounded-full shadow-md w-20 h-10 sm:w-24 sm:h-12 md:w-28 md:h-14 lg:w-32 lg:h-16 flex items-center justify-center border-2 border-[#01bdcc]">
                <span className="text-[#01385f] font-bold text-xs sm:text-sm md:text-sm text-center leading-tight px-1 sm:px-2">
                  ทั้งหมด
                </span>
              </div>
            ) : (
              <button
                onClick={() => handleCategoryClick("all")}
                className="text-white font-semibold text-xs sm:text-sm md:text-base lg:text-lg drop-shadow transition-all duration-200 hover:scale-105 cursor-pointer hover:bg-white/10 px-2 sm:px-3 py-1 sm:py-2 rounded-xl"
              >
                ทั้งหมด
              </button>
            )}
          </div>
        </div>

        {/* Category Info */}
        <div className="bg-white/90 rounded-2xl px-6 py-4 shadow-md">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-bold text-[#01385f]">
              {getCategoryDisplayName(activeCategory)}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-[#01385f] font-semibold">
                ทั้งหมด {filteredPosts.length} รายการ
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="w-full max-w-[1268px]">
        {loading ? (
          // Loading skeleton
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-[29px] border-4 border-[#01bdcc] shadow-md p-6 flex flex-col gap-2 animate-pulse"
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
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, idx) => (
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
            ))}
          </div>
        ) : (
          // No data message
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-gray-500 text-lg mb-2">
              ไม่มีข้อมูล{getCategoryDisplayName(activeCategory)}
            </div>
            <div className="text-gray-400 text-sm">
              กรุณาเพิ่มข้อมูลในระบบ EGP
            </div>
          </div>
        )}
      </div>
    </div>
  );
}