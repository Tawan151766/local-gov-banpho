"use client";
import { useState, useEffect } from "react";

export default function FinanceSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("procurement");
  const [activeCategory, setActiveCategory] = useState("procurement");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    fetchPosts();
  }, [activeCategory]); // เปลี่ยนให้ fetch ใหม่เมื่อ category เปลี่ยน

  useEffect(() => {
    filterPostsByCategory();
  }, [posts, activeCategory]);

  const fetchPosts = async (retry = false) => {
  const fetchPosts = async (retry = false) => {
    try {
      setLoading(true);
      setError(null);

      let apiUrl = "";
      
      // กำหนด API endpoint ตาม category
      switch (activeCategory) {
        case "procurement":
          apiUrl = "/api/posts?type=ประกาศจัดซื้อจัดจ้าง";
          break;
        case "result":
          apiUrl = "/api/posts?type=ผลประกาศจัดซื้อจัดจ้าง";
          break;
        case "report":
          apiUrl = "/api/posts?type=รายงานผลการจัดซื้อจัดจ้าง";
          break;
        case "egp":
          // ถ้ามี EGP API แยก หรือใช้ข้อมูลจาก external API
          apiUrl = "/api/egp-proxy"; // หรือ API ที่เหมาะสม
          break;
        default:
          apiUrl = "/api/posts?type=ประกาศจัดซื้อจัดจ้าง";
      }

      console.log(`Fetching from: ${apiUrl} for category: ${activeCategory}`);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      });

      if (!response.ok) {
        throw new Error(`API error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(`Posts API result for ${activeCategory}:`, result);

      if (result.success && result.data && Array.isArray(result.data)) {
        // Transform the data to match expected format
        const transformedPosts = result.data.map((post) => ({
          deptsub_id: (post.id || post.deptsub_id || Math.random().toString()).toString(),
          announce_type: getAnnounceType(post.type_name || getCategoryTypeName(activeCategory)),
          title: post.title_name || post.title,
          pub_date: formatApiDate(post.date || post.pub_date),
          link: post.link || `/post/${post.id || post.deptsub_id}`,
          original_type: post.type_name
        }));

        setPosts(transformedPosts);
        setRetryCount(0);
        console.log(`Successfully loaded ${transformedPosts.length} posts for ${activeCategory}`);
      } else {
        console.warn("API returned unexpected format:", result);
        setPosts([]);
      console.log(`Posts API result for ${activeCategory}:`, result);

      if (result.success && result.data && Array.isArray(result.data)) {
        // Transform the data to match expected format
        const transformedPosts = result.data.map((post) => ({
          deptsub_id: (post.id || post.deptsub_id || Math.random().toString()).toString(),
          announce_type: getAnnounceType(post.type_name || getCategoryTypeName(activeCategory)),
          title: post.title_name || post.title,
          pub_date: formatApiDate(post.date || post.pub_date),
          link: post.link || `/post/${post.id || post.deptsub_id}`,
          original_type: post.type_name
        }));

        setPosts(transformedPosts);
        setRetryCount(0);
        console.log(`Successfully loaded ${transformedPosts.length} posts for ${activeCategory}`);
      } else {
        console.warn("API returned unexpected format:", result);
        setPosts([]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError(error.message);

      // Retry logic - try up to 2 times
      if (!retry && retryCount < 2) {
        console.log(`Retrying... (attempt ${retryCount + 1})`);
        setRetryCount((prev) => prev + 1);
        setTimeout(() => fetchPosts(true), 2000);
        return;
      }

      setPosts([]);
      console.error("Error fetching posts:", error);
      setError(error.message);

      // Retry logic - try up to 2 times
      if (!retry && retryCount < 2) {
        console.log(`Retrying... (attempt ${retryCount + 1})`);
        setRetryCount((prev) => prev + 1);
        setTimeout(() => fetchPosts(true), 2000);
        return;
      }

      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // ได้ type name จาก category
  const getCategoryTypeName = (category) => {
    switch (category) {
      case "procurement":
        return "ประกาศจัดซื้อจัดจ้าง";
      case "result":
        return "ผลประกาศจัดซื้อจัดจ้าง";
      case "report":
        return "รายงานผลการจัดซื้อจัดจ้าง";
      case "egp":
        return "ประกาศ EGP";
      default:
        return "ประกาศจัดซื้อจัดจ้าง";
    }
  };

  // Transform type_name to announce_type for compatibility
  const getAnnounceType = (typeName) => {
    if (!typeName) return "W0";

    if (typeName.includes("ประกาศจัดซื้อจัดจ้าง")) return "P0";
    if (typeName.includes("ผลประกาศจัดซื้อจัดจ้าง")) return "D0";
    if (typeName.includes("รายงานผลการจัดซื้อจัดจ้าง")) return "W0";
    if (typeName.includes("ประกาศราคากลาง")) return "M0";
    if (typeName.includes("EGP")) return "15";

    return "P0"; // Default เป็น procurement
  };

  // Format date from API
  const formatApiDate = (dateString) => {
    if (!dateString) return new Date().toISOString().split("T")[0];
    return new Date(dateString).toISOString().split("T")[0];
  };

  const filterPostsByCategory = () => {
    // เนื่องจากเราดึงข้อมูลแยกตาม category แล้ว 
    // เราจึงแสดงข้อมูลทั้งหมดที่ได้มา (แต่จำกัดที่ 4 รายการ)
    setFilteredPosts(posts.slice(0, 4));
  // ได้ type name จาก category
  const getCategoryTypeName = (category) => {
    switch (category) {
      case "procurement":
        return "ประกาศจัดซื้อจัดจ้าง";
      case "result":
        return "ผลประกาศจัดซื้อจัดจ้าง";
      case "report":
        return "รายงานผลการจัดซื้อจัดจ้าง";
      case "egp":
        return "ประกาศ EGP";
      default:
        return "ประกาศจัดซื้อจัดจ้าง";
    }
  };

  // Transform type_name to announce_type for compatibility
  const getAnnounceType = (typeName) => {
    if (!typeName) return "W0";

    if (typeName.includes("ประกาศจัดซื้อจัดจ้าง")) return "P0";
    if (typeName.includes("ผลประกาศจัดซื้อจัดจ้าง")) return "D0";
    if (typeName.includes("รายงานผลการจัดซื้อจัดจ้าง")) return "W0";
    if (typeName.includes("ประกาศราคากลาง")) return "M0";
    if (typeName.includes("EGP")) return "15";

    return "P0"; // Default เป็น procurement
  };

  // Format date from API
  const formatApiDate = (dateString) => {
    if (!dateString) return new Date().toISOString().split("T")[0];
    return new Date(dateString).toISOString().split("T")[0];
  };

  const filterPostsByCategory = () => {
    // เนื่องจากเราดึงข้อมูลแยกตาม category แล้ว 
    // เราจึงแสดงข้อมูลทั้งหมดที่ได้มา (แต่จำกัดที่ 4 รายการ)
    setFilteredPosts(posts.slice(0, 4));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "ไม่ระบุวันที่";

    const date = new Date(dateString);
    const thaiMonths = [
      "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
      "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
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

  const truncateText = (text, maxLength = 100) => {
    if (!text) return "ไม่มีรายละเอียด";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    // fetchPosts จะถูกเรียกอัตโนมัติผ่าน useEffect
  };

  const handlePostClick = (post) => {
    // Navigate to the post detail page
    window.location.href = `/posts/${post.deptsub_id}`;
  };

  // สร้าง URL สำหรับ "ดูข้อมูลทั้งหมด"
  const getViewAllUrl = () => {
    const typeParam = encodeURIComponent(getCategoryTypeName(activeCategory));
    return `/posts?type=${typeParam}`;
    // Navigate to the post detail page
    window.location.href = `/posts/${post.deptsub_id}`;
  };

  // สร้าง URL สำหรับ "ดูข้อมูลทั้งหมด"
  const getViewAllUrl = () => {
    const typeParam = encodeURIComponent(getCategoryTypeName(activeCategory));
    return `/posts?type=${typeParam}`;
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

            {/* EGP Category */}

            {/* EGP Category */}
            {activeCategory === "egp" ? (
              <div className="bg-white rounded-full shadow-md h-10 flex items-center justify-center border-2 border-[#01bdcc]">
              <div className="bg-white rounded-full shadow-md h-10 flex items-center justify-center border-2 border-[#01bdcc]">
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

            {/* Procurement Category */}
            {/* Procurement Category */}
            {activeCategory === "procurement" ? (
              <div className="bg-white rounded-full shadow-md h-10 flex items-center justify-center border-2 border-[#01bdcc]">
              <div className="bg-white rounded-full shadow-md h-10 flex items-center justify-center border-2 border-[#01bdcc]">
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

            {/* Result Category */}
            {/* Result Category */}
            {activeCategory === "result" ? (
              <div className="bg-white rounded-full shadow-md h-10 flex items-center justify-center border-2 border-[#01bdcc]">
              <div className="bg-white rounded-full shadow-md h-10 flex items-center justify-center border-2 border-[#01bdcc]">
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

            {/* Report Category */}
            {/* Report Category */}
            {activeCategory === "report" ? (
              <div className="bg-white rounded-full shadow-md h-10 flex items-center justify-center border-2 border-[#01bdcc]">
              <div className="bg-white rounded-full shadow-md h-10 flex items-center justify-center border-2 border-[#01bdcc]">
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

        {/* EGP ID Input - แสดงเฉพาะเมื่ออยู่ในหมวด EGP */}
        {activeCategory === "egp" && (
          <div className="bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row items-center gap-4">
            <label className="text-[#01385f] font-semibold text-sm sm:text-base whitespace-nowrap">
              EGP ID:
            </label>
            <div className="flex-1 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={egpId}
                onChange={(e) => handleEgpIdChange(e.target.value)}
                className="flex-1 px-3 py-2 border-2 border-[#01bdcc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01bdcc]/50 text-sm"
                placeholder="ใส่ EGP ID (เช่น 1509900857)"
              />
              <button
                onClick={() => fetchPosts()}
                className="bg-[#01bdcc] text-white px-4 py-2 rounded-lg hover:bg-[#01a5b0] transition-colors duration-200 text-sm font-semibold"
              >
                ค้นหา
              </button>
            </div>
            <div className="text-xs text-gray-500">
              Current ID: {egpId}
            </div>
          </div>
        )}
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
        ) : error && filteredPosts.length === 0 ? (
          // Error state
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <div className="text-red-500 text-lg mb-2">
              เกิดข้อผิดพลาดในการโหลดข้อมูล
            </div>
            <div className="text-gray-500 text-sm mb-4">{error}</div>
            <button
              onClick={() => fetchPosts()}
              className="bg-[#01bdcc] text-white px-6 py-2 rounded-lg hover:bg-[#01a5b0] transition-colors duration-200"
            >
              ลองใหม่อีกครั้ง
            </button>
          </div>
        ) : error && filteredPosts.length === 0 ? (
          // Error state
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <div className="text-red-500 text-lg mb-2">
              เกิดข้อผิดพลาดในการโหลดข้อมูล
            </div>
            <div className="text-gray-500 text-sm mb-4">{error}</div>
            <button
              onClick={() => fetchPosts()}
              className="bg-[#01bdcc] text-white px-6 py-2 rounded-lg hover:bg-[#01a5b0] transition-colors duration-200"
            >
              ลองใหม่อีกครั้ง
            </button>
          </div>
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
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </div>
            </div>
          ))
        ) : (
          // No data message
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <div className="text-gray-500 text-lg mb-2">
              ไม่มีข้อมูล{getCategoryTypeName(activeCategory)}
            </div>
            <div className="text-gray-400 text-sm">
              ไม่พบข้อมูลในหมวดหมู่นี้
              ไม่พบข้อมูลในหมวดหมู่นี้
            </div>
          </div>
        )}
      </div>

      {/* View All Button */}
      {filteredPosts.length > 0 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => (window.location.href = getViewAllUrl())}
            onClick={() => (window.location.href = getViewAllUrl())}
            className="bg-[#01385f] text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-[#01385f]/90 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            ดูข้อมูลทั้งหมด ({posts.length} รายการ)
          </button>
        </div>
      )}
    </div>
  );
}