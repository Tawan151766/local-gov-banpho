"use client";
import { useState, useEffect } from "react";

export default function FinanceSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const postsPerPage = 4;

  useEffect(() => {
    fetchProcurementPosts();
  }, [currentPage]);

  const fetchProcurementPosts = async () => {
    setLoading(true);
    try {
      // ใช้ API ที่มีอยู่แล้ว - postTypeId=3 สำหรับประกาศจัดซื้อจัดจ้าง
      const response = await fetch(`/api/post-details?page=${currentPage}&limit=${postsPerPage}&postTypeId=3&withMedia=true`);
      const result = await response.json();

      if (result.success) {
        setPosts(result.data);
        setTotalPosts(result.total || 0);
        setTotalPages(Math.ceil((result.total || 0) / postsPerPage));
      }
    } catch (error) {
      console.error("Error fetching procurement posts:", error);
    } finally {
      setLoading(false);
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
    const year = date.getFullYear() + 543; // Convert to Buddhist year

    return `${day} ${month} ${year}`;
  };

  const getPostTypeColor = (typeName) => {
    if (!typeName) return "#73cc6b";

    if (typeName.includes("ประกาศ")) return "#73cc6b";
    if (typeName.includes("ผล")) return "#f39c12";
    if (typeName.includes("รายงาน")) return "#3498db";
    return "#73cc6b";
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return "ไม่มีรายละเอียด";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const showPages = 5; // จำนวนหน้าที่แสดงใน pagination
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages, startPage + showPages - 1);

    // ปรับ startPage ถ้า endPage ถึงขีดจำกัด
    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1);
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 mx-1 rounded-lg text-sm font-medium transition-colors ${
          currentPage === 1
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-white text-[#01385f] border border-[#01bdcc] hover:bg-[#01bdcc] hover:text-white'
        }`}
        title="หน้าก่อนหน้า"
      >
        &laquo;
      </button>
    );

    // First page if not in range
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="bg-white text-[#01385f] border border-[#01bdcc] hover:bg-[#01bdcc] hover:text-white px-3 py-2 mx-1 rounded-lg text-sm font-medium transition-colors"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className="px-2 py-2 text-gray-500">
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 mx-1 rounded-lg text-sm font-medium transition-colors ${
            currentPage === i
              ? 'bg-[#01bdcc] text-white shadow-md'
              : 'bg-white text-[#01385f] border border-[#01bdcc] hover:bg-[#01bdcc] hover:text-white'
          }`}
          title={`หน้าที่ ${i}`}
        >
          {i}
        </button>
      );
    }

    // Last page if not in range
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className="px-2 py-2 text-gray-500">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="bg-white text-[#01385f] border border-[#01bdcc] hover:bg-[#01bdcc] hover:text-white px-3 py-2 mx-1 rounded-lg text-sm font-medium transition-colors"
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 mx-1 rounded-lg text-sm font-medium transition-colors ${
          currentPage === totalPages
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-white text-[#01385f] border border-[#01bdcc] hover:bg-[#01bdcc] hover:text-white'
        }`}
        title="หน้าถัดไป"
      >
        &raquo;
      </button>
    );

    return (
      <div className="flex flex-col items-center mt-8 gap-4 pb-8">
        <div className="flex items-center justify-center flex-wrap">
          {pages}
        </div>
        <div className="text-sm text-white bg-black bg-opacity-20 px-4 py-2 rounded-full backdrop-blur-sm">
          แสดงหน้า {currentPage} จาก {totalPages} หน้า | ทั้งหมด {totalPosts} รายการ
        </div>
      </div>
    );
  };

  const handlePostClick = (postId) => {
    // Navigate to post detail page
    window.location.href = `/finance/detail/${postId}`;
  };

  const handleViewAll = () => {
    window.location.href = '/finance/all';
  };

  return (
    <div
      className="w-full min-h-screen py-8 px-2 md:px-8 flex flex-col items-center bg-transparent"
      style={{
        backgroundImage:
          'linear-gradient(180deg, rgba(239, 228, 212, 0.6) 0%, rgba(1, 189, 204, 0.6) 100%), url("/image/Boat.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Header Section */}
      <div className="w-full max-w-[1268px] flex flex-col gap-4 mb-8">
        <div className="bg-gradient-to-r from-[#03bdca] to-[#01bdcc] rounded-[36px] shadow-lg w-full flex flex-col md:flex-row items-center px-6 py-6 relative backdrop-blur-sm">
          <div className="bg-white rounded-full shadow-md w-32 h-16 flex items-center justify-center mb-4 md:mb-0 md:absolute md:left-6 md:top-1/2 md:-translate-y-1/2 border-2 border-[#01bdcc]">
            <span className="text-[#01385f] font-bold text-2xl tracking-wide">
              EGP
            </span>
          </div>
          <div className="flex-1 flex flex-wrap flex-row items-center justify-center gap-6 md:gap-12 md:ml-40">
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              ประกาศจัดซื้อจัดจ้าง
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              ผลประกาศจัดซื้อจัดจ้าง
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              รายงานผลจัดซื้อจัดจ้าง
            </span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full max-w-[1268px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-4">
        {loading ? (
          // Loading skeleton
          [...Array(4)].map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-[29px] border-4 border-[#01bdcc] shadow-lg p-6 flex flex-col gap-2 relative animate-pulse backdrop-blur-sm"
            >
              <div className="flex flex-row items-center justify-between mb-2">
                <div className="h-6 bg-gray-300 rounded w-24"></div>
                <div className="h-8 bg-gray-300 rounded w-20"></div>
              </div>
              <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="flex flex-row items-center justify-between mt-4">
                <div className="h-4 bg-gray-300 rounded w-16"></div>
                <div className="h-4 bg-gray-300 rounded w-20"></div>
              </div>
            </div>
          ))
        ) : posts.length > 0 ? (
          posts.map((post, idx) => (
            <div
              key={post.id || idx}
              className="bg-white bg-opacity-95 rounded-[29px] border-4 border-[#01bdcc] shadow-lg p-6 flex flex-col gap-2 relative cursor-pointer hover:shadow-xl hover:bg-opacity-100 transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm"
              onClick={() => handlePostClick(post.id)}
            >
              <div className="flex flex-row items-center justify-between mb-2">
                <span className="text-[#01385f] font-semibold text-lg">
                  {formatDate(post.date)}
                </span>
                <span
                  className="rounded-full px-4 py-1 text-white text-sm font-medium shadow-sm"
                  style={{
                    backgroundColor: getPostTypeColor(post.type_name),
                  }}
                >
                  {post.type_name || "ประกาศ"}
                </span>
              </div>

              <div className="text-[#1e1e1e] text-base mb-2 font-semibold line-clamp-2">
                {post.title_name || "ไม่มีหัวข้อ"}
              </div>

              {post.topic_name && (
                <div className="text-[#01385f] text-sm mb-2 font-medium bg-blue-50 px-2 py-1 rounded">
                  {post.topic_name}
                </div>
              )}

              <div className="text-[#666] text-sm mb-2 line-clamp-3">
                {truncateText(post.details)}
              </div>

              <div className="flex flex-row items-center justify-between mt-4 pt-2 border-t border-gray-100">
                <button
                  className="text-[#01385f] font-semibold text-base hover:underline cursor-pointer hover:text-[#01bdcc] transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewAll();
                  }}
                >
                  ดูทั้งหมด
                </button>
                <div className="flex gap-3 text-xs text-gray-500">
                  {post.pdfs && post.pdfs.length > 0 && (
                    <span className="flex items-center gap-1 bg-red-50 px-2 py-1 rounded">
                      📄 {post.pdfs.length}
                    </span>
                  )}
                  {post.photos && post.photos.length > 0 && (
                    <span className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
                      🖼️ {post.photos.length}
                    </span>
                  )}
                  {post.videos && post.videos.length > 0 && (
                    <span className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                      🎥 {post.videos.length}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          // No data message
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <div className="bg-white bg-opacity-90 rounded-xl p-8 text-center shadow-lg backdrop-blur-sm">
              <div className="text-gray-500 text-xl mb-2">
                📋 ไม่มีข้อมูลประกาศจัดซื้อจัดจ้าง
              </div>
              <div className="text-gray-400 text-sm">
                กรุณาเพิ่มข้อมูลในระบบจัดการ หรือลองใหม่อีกครั้ง
              </div>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-[#01bdcc] text-white rounded-lg hover:bg-[#01a5b3] transition-colors"
              >
                รีเฟรช
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
          {renderPagination()}
      
      {renderPagination()}
    </div>
  );
}