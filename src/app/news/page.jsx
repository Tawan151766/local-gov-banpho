"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewsPage() {
  const router = useRouter();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNews, setTotalNews] = useState(0);
  const newsPerPage = 6;

  useEffect(() => {
    fetchNews();
  }, [currentPage]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/posts?type=ข่าวประชาสัมพันธ์&page=${currentPage}&limit=${newsPerPage}`);
      const result = await response.json();
      if (result.success) {
        setNews(result.data || []);
        setTotalNews(result.pagination?.total || result.data?.length || 0);
        setTotalPages(Math.ceil((result.pagination?.total || result.data?.length || 0) / newsPerPage));
      } else {
        setNews([]);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "ไม่ระบุวันที่";
    const date = new Date(dateString);
    const thaiMonths = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543;
    return `${day} ${month} ${year}`;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleShowDetail = (item) => {
    router.push(`/news/${item.id}`);
  };

  const getFileIcon = (fileType) => {
    const type = fileType?.toLowerCase();
    if (type?.includes('pdf')) return '📄';
    if (type?.includes('image') || type?.includes('jpg') || type?.includes('png')) return '🖼️';
    if (type?.includes('video') || type?.includes('mp4')) return '🎥';
    if (type?.includes('doc') || type?.includes('word')) return '📝';
    if (type?.includes('excel') || type?.includes('xls')) return '📊';
    return '📎';
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
      <button key="prev" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
        className={`px-3 py-2 mx-1 rounded-lg text-sm font-medium transition-colors ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-[#01385f] border border-[#01bdcc] hover:bg-[#01bdcc] hover:text-white'}`}
        title="หน้าก่อนหน้า">&laquo;</button>
    );
    if (startPage > 1) {
      pages.push(<button key={1} onClick={() => handlePageChange(1)} className="bg-white text-[#01385f] border border-[#01bdcc] hover:bg-[#01bdcc] hover:text-white px-3 py-2 mx-1 rounded-lg text-sm font-medium transition-colors">1</button>);
      if (startPage > 2) {
        pages.push(<span key="ellipsis1" className="px-2 py-2 text-gray-500">...</span>);
      }
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button key={i} onClick={() => handlePageChange(i)}
          className={`px-3 py-2 mx-1 rounded-lg text-sm font-medium transition-colors ${currentPage === i ? 'bg-[#01bdcc] text-white shadow-md' : 'bg-white text-[#01385f] border border-[#01bdcc] hover:bg-[#01bdcc] hover:text-white'}`}
          title={`หน้าที่ ${i}`}>{i}</button>
      );
    }
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="ellipsis2" className="px-2 py-2 text-gray-500">...</span>);
      }
      pages.push(<button key={totalPages} onClick={() => handlePageChange(totalPages)} className="bg-white text-[#01385f] border border-[#01bdcc] hover:bg-[#01bdcc] hover:text-white px-3 py-2 mx-1 rounded-lg text-sm font-medium transition-colors">{totalPages}</button>);
    }
    pages.push(
      <button key="next" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}
        className={`px-3 py-2 mx-1 rounded-lg text-sm font-medium transition-colors ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-[#01385f] border border-[#01bdcc] hover:bg-[#01bdcc] hover:text-white'}`}
        title="หน้าถัดไป">&raquo;</button>
    );
    return (
      <div className="flex flex-col items-center mt-8 gap-4 pb-8">
        <div className="flex items-center justify-center flex-wrap">{pages}</div>
        <div className="text-sm text-white bg-black bg-opacity-20 px-4 py-2 rounded-full backdrop-blur-sm">
          แสดงหน้า {currentPage} จาก {totalPages} หน้า | ทั้งหมด {totalNews} ข่าว
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen py-8 px-2 md:px-8 flex flex-col items-center bg-transparent"
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
            <span className="text-[#01385f] font-bold text-2xl tracking-wide">📰</span>
          </div>
          <div className="flex-1 flex flex-wrap flex-row items-center justify-center gap-6 md:gap-12 md:ml-40">
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">ข่าวสารทั่วไป</span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">General News</span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">ข่าวประชาสัมพันธ์</span>
          </div>
        </div>
      </div>
      {/* Content Section */}
      <div className="w-full max-w-[1268px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
        {loading ? (
          [...Array(6)].map((_, idx) => (
            <div key={idx} className="bg-white bg-opacity-95 rounded-[29px] border-4 border-[#01bdcc] shadow-lg p-6 flex flex-col gap-2 relative animate-pulse backdrop-blur-sm">
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
              <div className="flex gap-2 mb-4">
                <div className="h-6 bg-gray-300 rounded w-16"></div>
                <div className="h-6 bg-gray-300 rounded w-20"></div>
              </div>
              <div className="h-4 bg-gray-300 rounded w-24"></div>
            </div>
          ))
        ) : news.length > 0 ? (
          news.map((item) => (
            <div key={item.id} className="bg-white bg-opacity-95 rounded-[29px] border-4 border-[#01bdcc] shadow-lg p-6 flex flex-col gap-3 relative cursor-pointer hover:shadow-xl hover:bg-opacity-100 transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm"
              onClick={() => handleShowDetail(item)}>
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-xl font-bold text-[#01385f] line-clamp-2 flex-1">{item.title_name}</h2>
                <div className="ml-2 bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">ID: {item.id}</div>
              </div>
              {/* Type Badge */}
              <div className="mb-3">
                <span className="inline-block px-3 py-1 rounded-full text-white text-sm font-medium bg-[#01bdcc]">ข่าวสารทั่วไป</span>
              </div>
              {/* Stats */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">📄 {item.pdfs_count || 0} ไฟล์</span>
                <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-medium">🖼️ {item.photos_count || 0} รูป</span>
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">🎥 {item.videos_count || 0} วิดีโอ</span>
              </div>
              {/* Dates */}
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">สร้างเมื่อ:</span>
                  <span className="font-medium">{formatDate(item.created_at)}</span>
                </div>
                {item.updated_at && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">อัพเดท:</span>
                    <span className="font-medium">{formatDate(item.updated_at)}</span>
                  </div>
                )}
              </div>
              {/* Preview of recent files */}
              {/* สามารถเพิ่ม preview รูป/ไฟล์/วิดีโอได้ถ้าต้องการ */}
              {/* Action hint */}
              <div className="mt-3 pt-2 border-t border-gray-100 text-center">
                <span className="text-sm text-[#01385f] font-medium hover:underline">คลิกเพื่อดูรายละเอียด →</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <div className="bg-white bg-opacity-90 rounded-xl p-8 text-center shadow-lg backdrop-blur-sm">
              <div className="text-gray-400 text-6xl mb-4">📰</div>
              <div className="text-gray-500 text-xl mb-2">ไม่มีข้อมูลข่าวสาร</div>
              <div className="text-gray-400 text-sm mb-4">กรุณาเพิ่มข้อมูลข่าวในระบบจัดการ</div>
            </div>
          </div>
        )}
      </div>
      {/* Pagination */}
      {renderPagination()}
    </div>
  );
}
