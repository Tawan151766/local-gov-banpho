"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function PostsPage() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(12);

  // Determine category from URL parameter
  const [activeCategory, setActiveCategory] = useState(() => {
    if (!typeParam) return "procurement";

    if (typeParam.includes("ประกาศจัดซื้อจัดจ้าง")) return "procurement";
    if (typeParam.includes("ผลประกาศจัดซื้อจัดจ้าง")) return "result";
    if (typeParam.includes("รายงานผลการจัดซื้อจัดจ้าง")) return "report";
    if (typeParam.includes("EGP")) return "egp";

    return "procurement";
  });

  useEffect(() => {
    fetchPosts();
  }, [activeCategory]);

  const fetchPosts = async (retry = false) => {
    try {
      setLoading(true);
      setError(null);

      let apiUrl = "";

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
          apiUrl = "/api/egp-proxy";
          break;
        default:
          apiUrl = "/api/posts?type=ประกาศจัดซื้อจัดจ้าง";
      }

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

      if (result.success && result.data && Array.isArray(result.data)) {
        const transformedPosts = result.data.map((post) => ({
          deptsub_id: (
            post.id ||
            post.deptsub_id ||
            Math.random().toString()
          ).toString(),
          announce_type: getAnnounceType(
            post.type_name || getCategoryTypeName(activeCategory)
          ),
          title: post.title_name || post.title,
          pub_date: formatApiDate(post.date || post.pub_date),
          link: post.link || `/posts/${post.id || post.deptsub_id}`,
          original_type: post.type_name,
      if (!response.ok) {
        throw new Error(`API error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data && Array.isArray(result.data)) {
        const transformedPosts = result.data.map((post) => ({
          deptsub_id: (
            post.id ||
            post.deptsub_id ||
            Math.random().toString()
          ).toString(),
          announce_type: getAnnounceType(
            post.type_name || getCategoryTypeName(activeCategory)
          ),
          title: post.title_name || post.title,
          pub_date: formatApiDate(post.date || post.pub_date),
          link: post.link || `/posts/${post.id || post.deptsub_id}`,
          original_type: post.type_name,
        }));

        setPosts(transformedPosts);
        setRetryCount(0);
      } else {
        setPosts([]);

        setPosts(transformedPosts);
        setRetryCount(0);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError(error.message);

      if (!retry && retryCount < 2) {
        setRetryCount((prev) => prev + 1);
        setTimeout(() => fetchPosts(true), 2000);
        return;
      }

      setPosts([]);
      setError(error.message);

      if (!retry && retryCount < 2) {
        setRetryCount((prev) => prev + 1);
        setTimeout(() => fetchPosts(true), 2000);
        return;
      }

      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

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

  const getAnnounceType = (typeName) => {
    if (!typeName) return "W0";

    if (typeName.includes("ประกาศจัดซื้อจัดจ้าง")) return "P0";
    if (typeName.includes("ผลประกาศจัดซื้อจัดจ้าง")) return "D0";
    if (typeName.includes("รายงานผลการจัดซื้อจัดจ้าง")) return "W0";
    if (typeName.includes("ประกาศราคากลาง")) return "M0";
    if (typeName.includes("EGP")) return "15";

    return "P0";
  const getAnnounceType = (typeName) => {
    if (!typeName) return "W0";

    if (typeName.includes("ประกาศจัดซื้อจัดจ้าง")) return "P0";
    if (typeName.includes("ผลประกาศจัดซื้อจัดจ้าง")) return "D0";
    if (typeName.includes("รายงานผลการจัดซื้อจัดจ้าง")) return "W0";
    if (typeName.includes("ประกาศราคากลาง")) return "M0";
    if (typeName.includes("EGP")) return "15";

    return "P0";
  };

  const formatApiDate = (dateString) => {
    if (!dateString) return new Date().toISOString().split("T")[0];
    return new Date(dateString).toISOString().split("T")[0];
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
  const formatApiDate = (dateString) => {
    if (!dateString) return new Date().toISOString().split("T")[0];
    return new Date(dateString).toISOString().split("T")[0];
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

  const truncateText = (text, maxLength = 150) => {
    if (!text) return "ไม่มีรายละเอียด";
    if (!text) return "ไม่มีรายละเอียด";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
    // Update URL without page reload
    const newUrl = `/posts?type=${encodeURIComponent(
      getCategoryTypeName(category)
    )}`;
    window.history.pushState({}, "", newUrl);
  };

  const handlePostClick = (post) => {
    if (post.link) {
      window.open(post.link, "_blank");
    }
  };

  // Filter posts based on search
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchText.toLowerCase())
  );

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className="w-full min-h-screen py-8 px-2 md:px-8"
      style={{
        backgroundImage:
          'linear-gradient(180deg, rgba(239, 228, 212, 0.6) 0%, rgba(1, 189, 204, 0.6) 100%), url("/image/Boat.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-[1268px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#01385f] mb-2 text-center">
            {getCategoryTypeName(activeCategory)}
          </h1>
          <p className="text-[#01385f] text-lg text-center">
            องค์การบริหารส่วนตำบลบ้านโพธิ์
          </p>
    <div
      className="w-full min-h-screen py-8 px-2 md:px-8"
      style={{
        backgroundImage:
          'linear-gradient(180deg, rgba(239, 228, 212, 0.6) 0%, rgba(1, 189, 204, 0.6) 100%), url("/image/Boat.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-[1268px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#01385f] mb-2 text-center">
            {getCategoryTypeName(activeCategory)}
          </h1>
          <p className="text-[#01385f] text-lg text-center">
            องค์การบริหารส่วนตำบลบ้านโพธิ์
          </p>
        </div>

        {/* Category Navigation */}
        <div className="bg-gradient-to-r from-[#03bdca] to-[#01bdcc] rounded-[36px] shadow-lg w-full flex flex-col md:flex-row items-center px-3 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6 relative mb-8">
          <div className="flex-1 flex flex-wrap flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
            {/* EGP Category */}
            {activeCategory === "egp" ? (
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
            {activeCategory === "procurement" ? (
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
            {activeCategory === "result" ? (
              <div className="bg-white rounded-full shadow-md h-10 flex items-center justify-center border-2 border-[#01bdcc]">
                <span className="text-[#01385f] font-bold text-xs sm:text-sm md:text-sm text-center leading-tight px-1 sm:px-2">
                  ผลประกาศจัดซื้อจัดจ้าง
                </span>

        {/* Category Navigation */}
        <div className="bg-gradient-to-r from-[#03bdca] to-[#01bdcc] rounded-[36px] shadow-lg w-full flex flex-col md:flex-row items-center px-3 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6 relative mb-8">
          <div className="flex-1 flex flex-wrap flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
            {/* EGP Category */}
            {activeCategory === "egp" ? (
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
            {activeCategory === "procurement" ? (
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
            {activeCategory === "result" ? (
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
            {activeCategory === "report" ? (
              <div className="bg-white rounded-full shadow-md h-10 flex items-center justify-center border-2 border-[#01bdcc]">
                <span className="text-[#01385f] font-bold text-xs sm:text-sm md:text-sm text-center leading-tight px-1 sm:px-2">
                  รายงานผลจัดซื้อจัดจ้าง
                </span>
            ) : (
              <button
                onClick={() => handleCategoryClick("result")}
                className="text-white font-semibold text-xs sm:text-sm md:text-base lg:text-lg drop-shadow transition-all duration-200 hover:scale-105 cursor-pointer hover:bg-white/10 px-2 sm:px-3 py-1 sm:py-2 rounded-xl"
              >
                ผลประกาศจัดซื้อจัดจ้าง
              </button>
            )}

            {/* Report Category */}
            {activeCategory === "report" ? (
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

        {/* Search Bar */}
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 max-w-md mx-auto">
            <input
              type="text"
              placeholder="ค้นหาประกาศ..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01bdcc] focus:border-transparent"
            />
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6 text-center">
          <p className="text-[#01385f] font-semibold text-lg">
            พบ {filteredPosts.length} รายการ
            {searchText && ` สำหรับ "${searchText}"`}
          </p>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, idx) => (
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

        {/* Search Bar */}
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 max-w-md mx-auto">
            <input
              type="text"
              placeholder="ค้นหาประกาศ..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01bdcc] focus:border-transparent"
            />
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6 text-center">
          <p className="text-[#01385f] font-semibold text-lg">
            พบ {filteredPosts.length} รายการ
            {searchText && ` สำหรับ "${searchText}"`}
          </p>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, idx) => (
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
            ))}
          </div>
        ) : error && currentPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
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
          </div>
        ) : currentPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentPosts.map((post, idx) => (
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
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      currentPage === 1
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-white text-[#01385f] hover:bg-[#01bdcc] hover:text-white shadow-md"
                    }`}
                  >
                    ก่อนหน้า
                  </button>

                  {/* Page Numbers */}
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    const isCurrentPage = pageNumber === currentPage;

                    // Show only a few pages around current page
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 2 &&
                        pageNumber <= currentPage + 2)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                            isCurrentPage
                              ? "bg-[#01385f] text-white shadow-lg"
                              : "bg-white text-[#01385f] hover:bg-[#01bdcc] hover:text-white shadow-md"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === currentPage - 3 ||
                      pageNumber === currentPage + 3
                    ) {
                      return (
                        <span key={pageNumber} className="px-2 text-gray-500">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      currentPage === totalPages
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-white text-[#01385f] hover:bg-[#01bdcc] hover:text-white shadow-md"
                    }`}
                  >
                    ถัดไป
                  </button>
            ))}
          </div>
        ) : error && currentPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
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
          </div>
        ) : currentPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentPosts.map((post, idx) => (
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
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      currentPage === 1
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-white text-[#01385f] hover:bg-[#01bdcc] hover:text-white shadow-md"
                    }`}
                  >
                    ก่อนหน้า
                  </button>

                  {/* Page Numbers */}
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    const isCurrentPage = pageNumber === currentPage;

                    // Show only a few pages around current page
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 2 &&
                        pageNumber <= currentPage + 2)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                            isCurrentPage
                              ? "bg-[#01385f] text-white shadow-lg"
                              : "bg-white text-[#01385f] hover:bg-[#01bdcc] hover:text-white shadow-md"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === currentPage - 3 ||
                      pageNumber === currentPage + 3
                    ) {
                      return (
                        <span key={pageNumber} className="px-2 text-gray-500">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      currentPage === totalPages
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-white text-[#01385f] hover:bg-[#01bdcc] hover:text-white shadow-md"
                    }`}
                  >
                    ถัดไป
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-gray-500 text-lg mb-2">
                ไม่มีข้อมูล{getCategoryTypeName(activeCategory)}
              </div>
              <div className="text-gray-400 text-sm">
                {searchText
                  ? `ไม่พบผลการค้นหาสำหรับ "${searchText}"`
                  : "ไม่พบข้อมูลในหมวดหมู่นี้"}
              </div>
              {searchText && (
                <button
                  onClick={() => setSearchText("")}
                  className="mt-4 bg-[#01bdcc] text-white px-6 py-2 rounded-lg hover:bg-[#01a5b0] transition-colors duration-200"
                >
                  ล้างการค้นหา
                </button>
              )}
            </div>
          </div>
        )}

        {/* Back to Home Button */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-[#01385f] text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-[#01385f]/90 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            กลับสู่หน้าหลัก
          </button>
        </div>
      </div>

        {/* Back to Home Button */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-[#01385f] text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-[#01385f]/90 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            กลับสู่หน้าหลัก
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PostsPage() {
  return (
    <Suspense
      fallback={
        <div
          className="w-full min-h-screen py-8 px-2 md:px-8"
          style={{
            backgroundImage:
              'linear-gradient(180deg, rgba(239, 228, 212, 0.6) 0%, rgba(1, 189, 204, 0.6) 100%), url("/image/Boat.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="w-full max-w-[1268px] mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-[#01385f] mb-2 text-center">
                กำลังโหลด...
              </h1>
              <p className="text-[#01385f] text-lg text-center">
                องค์การบริหารส่วนตำบลบ้านโพธิ์
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, idx) => (
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
              ))}
            </div>
          </div>
        </div>
      }
    >
      <PostsPageContent />
    </Suspense>
  );
}
