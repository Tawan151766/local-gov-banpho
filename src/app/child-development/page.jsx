"use client";

import React, { useState, useEffect } from "react";
import { postDetailsAPI, postTypesAPI } from "@/lib/api";
import Link from "next/link";

export default function ChildDevelopmentPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [typeId, setTypeId] = useState(null);
  const postsPerPage = 6;

  useEffect(() => {
    fetchTypeId();
  }, []);

  useEffect(() => {
    if (typeId) {
      fetchPosts();
    }
  }, [typeId, currentPage]);

  const fetchTypeId = async () => {
    try {
      const res = await postTypesAPI.getPostTypes({
        limit: 100,
        search: "ศูนย์พัฒนาเด็กเล็ก",
      });
      if (res.success && res.data.length > 0) {
        const found = res.data.find(
          (type) => type.type_name === "ศูนย์พัฒนาเด็กเล็ก"
        );
        setTypeId(found?.id);
      }
    } catch (error) {
      console.error("Error fetching type id:", error);
    }
  };

  const fetchPosts = async () => {
    if (!typeId) return;
    try {
      setLoading(true);
      const params = {
        postTypeId: typeId,
        withMedia: true,
        limit: postsPerPage,
        offset: (currentPage - 1) * postsPerPage,
        sortBy: "date",
        sortOrder: "desc",
      };
      const res = await postDetailsAPI.getPostDetails(params);
      if (res.success) {
        setPosts(res.data);
        setTotalPosts(res.total || res.data.length);
        setTotalPages(
          Math.ceil((res.total || res.data.length) / postsPerPage)
        );
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
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
    const year = date.getFullYear() + 543;
    return `${day} ${month} ${year}`;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const showDetail = (post) => {
    window.location.href = `/child-development/detail/${post.id}`;
  };

  const getContentTypeIcon = (post) => {
    if (post.photos && post.photos.length > 0) return "📸";
    if (post.videos && post.videos.length > 0) return "🎥";
    if (post.pdfs && post.pdfs.length > 0) return "📄";
    return "👶";
  };

  const getContentTypeText = (post) => {
    if (post.photos && post.photos.length > 0) return "รูปภาพ";
    if (post.videos && post.videos.length > 0) return "วิดีโอ";
    if (post.pdfs && post.pdfs.length > 0) return "เอกสาร PDF";
    return "ศูนย์พัฒนาเด็กเล็ก";
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages = [];
    const showPages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages, startPage + showPages - 1);
    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1);
    }
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 mx-1 rounded-lg text-sm font-medium transition-colors ${
          currentPage === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white text-[#01385f] border border-[#01bdcc] hover:bg-[#01bdcc] hover:text-white"
        }`}
        title="หน้าก่อนหน้า"
      >
        &laquo;
      </button>
    );
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
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 mx-1 rounded-lg text-sm font-medium transition-colors ${
            currentPage === i
              ? "bg-[#01bdcc] text-white shadow-md"
              : "bg-white text-[#01385f] border border-[#01bdcc] hover:bg-[#01bdcc] hover:text-white"
          }`}
          title={`หน้าที่ ${i}`}
        >
          {i}
        </button>
      );
    }
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
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 mx-1 rounded-lg text-sm font-medium transition-colors ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white text-[#01385f] border border-[#01bdcc] hover:bg-[#01bdcc] hover:text-white"
        }`}
        title="หน้าถัดไป"
      >
        &raquo;
      </button>
    );
    return (
      <div className="flex flex-col items-center mt-8 gap-4 pb-8">
        <div className="flex items-center justify-center flex-wrap">{pages}</div>
        <div className="text-sm text-white bg-black bg-opacity-20 px-4 py-2 rounded-full backdrop-blur-sm">
          แสดงหน้า {currentPage} จาก {totalPages} หน้า | ทั้งหมด {totalPosts} รายการ
        </div>
      </div>
    );
  };

  return (
    <div
      className="w-full min-h-screen py-8 px-2 md:px-8 flex flex-col items-center bg-transparent"
      style={{
        backgroundImage:
          'linear-gradient(180deg, rgba(239, 228, 212, 0.6) 0%, rgba(1, 189, 204, 0.6) 100%), url("/image/vision_bg.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Header Section */}
      <div className="w-full max-w-[1268px] flex flex-col gap-4 mb-8">
        <div className="bg-gradient-to-r from-[#03bdca] to-[#01bdcc] rounded-[36px] shadow-lg w-full flex flex-col md:flex-row items-center px-6 py-6 relative backdrop-blur-sm">
          <div className="bg-white rounded-full shadow-md w-32 h-16 flex items-center justify-center mb-4 md:mb-0 md:absolute md:left-6 md:top-1/2 md:-translate-y-1/2 border-2 border-[#01bdcc]">
            <span className="text-[#01385f] font-bold text-2xl tracking-wide">
              👶
            </span>
          </div>
          <div className="flex-1 flex flex-wrap flex-row items-center justify-center gap-6 md:gap-12 md:ml-40">
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              ศูนย์พัฒนาเด็กเล็ก
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              ข้อมูลกิจกรรม/ข่าวสาร
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              เทศบาลตำบลบ้านโพธิ์
            </span>
          </div>
        </div>
        {/* Breadcrumb */}
        <div className="bg-white bg-opacity-90 rounded-2xl shadow-md p-4 backdrop-blur-sm mb-4">
          <div className="flex items-center gap-2 text-[#01385F]">
            <Link href="/" className="hover:underline">
              หน้าแรก
            </Link>
            <span>/</span>
            <span>ศูนย์พัฒนาเด็กเล็ก</span>
          </div>
        </div>
      </div>
      {/* Content Section */}
      <div className="w-full max-w-[1268px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
        {loading ? (
          [...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className="bg-white bg-opacity-95 rounded-[29px] border-4 border-[#01bdcc] shadow-lg p-6 flex flex-col gap-2 relative animate-pulse backdrop-blur-sm"
            >
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
              <div className="flex gap-2 mb-4">
                <div className="h-6 bg-gray-300 rounded w-16"></div>
                <div className="h-6 bg-gray-300 rounded w-20"></div>
              </div>
              <div className="h-32 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-24"></div>
            </div>
          ))
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white bg-opacity-95 rounded-[29px] border-4 border-[#01bdcc] shadow-lg p-6 flex flex-col gap-3 relative cursor-pointer hover:shadow-xl hover:bg-opacity-100 transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm"
              onClick={() => showDetail(post)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-xl font-bold text-[#01385f] line-clamp-2 flex-1">
                  {post.title_name}
                </h2>
                <div className="ml-2 bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                  ID: {post.id}
                </div>
              </div>
              {/* Type Badge */}
              <div className="mb-3">
                <span className="inline-block px-3 py-1 rounded-full text-white text-sm font-medium bg-[#01bdcc]">
                  {post.type_name || "ศูนย์พัฒนาเด็กเล็ก"}
                </span>
              </div>
              {/* Topic Name */}
              {post.topic_name && (
                <div className="mb-3">
                  <p className="text-gray-700 text-sm line-clamp-2">
                    {post.topic_name}
                  </p>
                </div>
              )}
              {/* Image Preview */}
              {post.photos && post.photos.length > 0 ? (
                <div className="mb-4">
                  <img
                    src={`https://banpho.sosmartsolution.com/storage/${post.photos[0].post_photo_file}`}
                    alt={post.title_name}
                    className="w-full h-32 object-cover rounded-lg shadow-md"
                  />
                </div>
              ) : (
                <div className="mb-4 h-32 bg-gradient-to-br from-[#01385F] to-[#01BDCC] rounded-lg flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-3xl mb-2">{getContentTypeIcon(post)}</div>
                    <div className="text-sm">{getContentTypeText(post)}</div>
                  </div>
                </div>
              )}
              {/* Stats */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
                  📸 {post.photos?.length || 0} รูปภาพ
                </span>
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium">
                  🎥 {post.videos?.length || 0} วิดีโอ
                </span>
                <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-medium">
                  📄 {post.pdfs?.length || 0} ไฟล์
                </span>
              </div>
              {/* Date */}
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">วันที่ประกาศ:</span>
                  <span className="font-medium">{formatDate(post.date)}</span>
                </div>
              </div>
              {/* Details Preview */}
              {post.details && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">รายละเอียด:</p>
                  <div 
                    className="text-sm text-gray-700 line-clamp-2"
                    dangerouslySetInnerHTML={{ 
                      __html: post.details.replace(/<[^>]*>/g, '') 
                    }}
                  />
                </div>
              )}
              {/* Action hint */}
              <div className="mt-3 pt-2 border-t border-gray-100 text-center">
                <span className="text-sm text-[#01385f] font-medium hover:underline">
                  คลิกเพื่อดูรายละเอียด →
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <div className="bg-white bg-opacity-90 rounded-xl p-8 text-center shadow-lg backdrop-blur-sm">
              <div className="text-gray-400 text-6xl mb-4">👶</div>
              <div className="text-gray-500 text-xl mb-2">ไม่มีข้อมูลศูนย์พัฒนาเด็กเล็ก</div>
              <div className="text-gray-400 text-sm mb-4">ยังไม่มีข้อมูลในระบบ</div>
            </div>
          </div>
        )}
      </div>
      {/* Pagination */}
      {renderPagination()}
      <style jsx>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
