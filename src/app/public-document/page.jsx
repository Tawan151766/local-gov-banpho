"use client";
import React, { useState, useEffect } from "react";
import { Search, FileText, Download, Calendar, Eye } from "lucide-react";
import Link from "next/link";

function PublicDocumentPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const itemsPerPage = 6;

  // Fetch documents from API
  const fetchDocuments = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/public-documents?page=${page}&limit=${itemsPerPage}&search=${encodeURIComponent(
          search
        )}`
      );
      const result = await response.json();

      if (result.success) {
        setDocuments(result.data);
        setTotalPages(result.pagination.totalPages);
        setTotalDocuments(result.pagination.total);
      } else {
        console.error("Failed to fetch documents:", result.error);
        setDocuments([]);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchDocuments(1, searchTerm);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const showDetail = (document) => {
    window.location.href = `/public-document/${document.id}`;
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

  const getContentTypeIcon = (document) => {
    if (document.photos_count > 0) return "📸";
    if (document.videos_count > 0) return "🎥";
    if (document.pdfs_count > 0) return "📄";
    return "📁";
  };

  const getContentTypeText = (document) => {
    if (document.photos_count > 0) return "รูปภาพ";
    if (document.videos_count > 0) return "วิดีโอ";
    if (document.pdfs_count > 0) return "เอกสาร PDF";
    return "เอกสารเผยแพร่";
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
        <div className="flex items-center justify-center flex-wrap">
          {pages}
        </div>
        <div className="text-sm text-white bg-black bg-opacity-20 px-4 py-2 rounded-full backdrop-blur-sm">
          แสดงหน้า {currentPage} จาก {totalPages} หน้า | ทั้งหมด{" "}
          {totalDocuments} รายการ
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
              📄
            </span>
          </div>
          <div className="flex-1 flex flex-wrap flex-row items-center justify-center gap-6 md:gap-12 md:ml-40">
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              เอกสารเผยแพร่
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              ข้อมูลเอกสาร/ข่าวสาร
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
            <span>เอกสารเผยแพร่</span>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="w-full max-w-[1268px] mb-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ค้นหาเอกสาร..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01bdcc] focus:border-transparent outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#01bdcc] text-white rounded-lg hover:bg-[#01a5b0] transition-colors duration-200 flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              ค้นหา
            </button>
          </form>
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
        ) : documents.length > 0 ? (
          documents.map((document) => (
            <div
              key={document.id}
              className="bg-white bg-opacity-95 rounded-[29px] border-4 border-[#01bdcc] shadow-lg p-6 flex flex-col gap-3 relative cursor-pointer hover:shadow-xl hover:bg-opacity-100 transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm"
              onClick={() => showDetail(document)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-xl font-bold text-[#01385f] line-clamp-2 flex-1">
                  {document.title_name}
                </h2>
                <div className="ml-2 bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                  ID: {document.id}
                </div>
              </div>
              {/* Type Badge */}
              <div className="mb-3">
                <span className="inline-block px-3 py-1 rounded-full text-white text-sm font-medium bg-[#01bdcc]">
                  {document.type_name || "เอกสารเผยแพร่"}
                </span>
              </div>
              {/* Topic Name */}
              {document.topic_name && (
                <div className="mb-3">
                  <p className="text-gray-700 text-sm line-clamp-2">
                    {document.topic_name}
                  </p>
                </div>
              )}
              {/* Content Preview */}
              <div className="mb-4 h-32 bg-gradient-to-br from-[#01385F] to-[#01BDCC] rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-3xl mb-2">
                    {getContentTypeIcon(document)}
                  </div>
                  <div className="text-sm">{getContentTypeText(document)}</div>
                </div>
              </div>
              {/* Stats */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
                  📸 {document.photos_count || 0} รูปภาพ
                </span>
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium">
                  🎥 {document.videos_count || 0} วิดีโอ
                </span>
                <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-medium">
                  📄 {document.pdfs_count || 0} ไฟล์
                </span>
              </div>
              {/* Date */}
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">วันที่ประกาศ:</span>
                  <span className="font-medium">
                    {formatDate(document.date)}
                  </span>
                </div>
              </div>
              {/* Details Preview */}
              {document.details && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">รายละเอียด:</p>
                  <div className="text-sm text-gray-700 line-clamp-2">
                    {document.details}
                  </div>
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
              <div className="text-gray-400 text-6xl mb-4">📄</div>
              <div className="text-gray-500 text-xl mb-2">
                ไม่มีข้อมูลเอกสารเผยแพร่
              </div>
              <div className="text-gray-400 text-sm mb-4">
                {searchTerm
                  ? `ไม่พบเอกสารที่ตรงกับคำค้นหา "${searchTerm}"`
                  : "ยังไม่มีข้อมูลในระบบ"}
              </div>
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

export default PublicDocumentPage;
