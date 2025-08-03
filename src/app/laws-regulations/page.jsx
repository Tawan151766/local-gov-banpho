"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LawsRegulationsPage() {
  const router = useRouter();
  const [lawsRegs, setLawsRegs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLawsRegs, setTotalLawsRegs] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const lawsRegsPerPage = 6;

  // Categories for filtering
  const categories = [
    { value: "", label: "ทั้งหมด" },
    { value: "กฎหมาย", label: "กฎหมาย" },
    { value: "ระเบียบ", label: "ระเบียบ" },
    { value: "ข้อบังคับ", label: "ข้อบังคับ" },
    { value: "คำสั่ง", label: "คำสั่ง" },
    { value: "ประกาศ", label: "ประกาศ" },
    { value: "มติ", label: "มติ" },
    { value: "นโยบาย", label: "นโยบาย" }
  ];

  useEffect(() => {
    fetchLawsRegs();
  }, [currentPage, searchText, selectedCategory]);

  const fetchLawsRegs = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: lawsRegsPerPage.toString(),
        withSections: 'true'
      });

      if (searchText.trim()) {
        params.append('search', searchText.trim());
      }

      if (selectedCategory) {
        params.append('category', selectedCategory);
      }

      const response = await fetch(`/api/laws-regs-types?${params.toString()}`);
      const result = await response.json();
      
      if (result.success) {
        setLawsRegs(result.data || []);
        setTotalLawsRegs(result.pagination?.total || result.data?.length || 0);
        setTotalPages(Math.ceil((result.pagination?.total || result.data?.length || 0) / lawsRegsPerPage));
      } else {
        setLawsRegs([]);
      }
    } catch (error) {
      console.error("Error fetching laws and regulations:", error);
      setLawsRegs([]);
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleShowDetail = (lawReg) => {
    router.push(`/laws-regulations/detail/${lawReg.id}`);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const clearFilters = () => {
    setSearchText("");
    setSelectedCategory("");
    setCurrentPage(1);
  };

  const getLawRegColor = (typeName) => {
    if (!typeName) return "#01bdcc";
    
    if (typeName.includes("กฎหมาย") || typeName.includes("พระราชบัญญัติ")) return "#dc3545";
    if (typeName.includes("ระเบียบ") || typeName.includes("ข้อบังคับ")) return "#28a745";
    if (typeName.includes("คำสั่ง") || typeName.includes("ประกาศ")) return "#ffc107";
    if (typeName.includes("มติ") || typeName.includes("นโยบาย")) return "#6f42c1";
    if (typeName.includes("แนวทาง") || typeName.includes("หลักเกณฑ์")) return "#fd7e14";
    if (typeName.includes("มาตรฐาน") || typeName.includes("เกณฑ์")) return "#20c997";
    
    return "#01bdcc";
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
          แสดงหน้า {currentPage} จาก {totalPages} หน้า | ทั้งหมด {totalLawsRegs} กฎหมาย
          {(searchText || selectedCategory) && (
            <span className="ml-2">
              ({searchText && `ค้นหา: "${searchText}"`}
              {searchText && selectedCategory && ", "}
              {selectedCategory && `ประเภท: ${categories.find(c => c.value === selectedCategory)?.label}`})
            </span>
          )}
        </div>

        {/* Filter Section */}
        <div className="bg-white bg-opacity-90 rounded-2xl shadow-md p-4 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">ค้นหาและกรอง</h3>
          
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="ค้นหากฎหมาย ระเบียบ ข้อบังคับ..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(e.target.value);
                  }
                }}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01bdcc] focus:border-transparent"
              />
              <button
                onClick={() => handleSearch(searchText)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#01bdcc]"
              >
                🔍
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">กรองตามประเภท</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => handleCategoryFilter(category.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.value
                      ? 'text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                  style={{
                    backgroundColor: selectedCategory === category.value 
                      ? getLawRegColor(category.value || 'default') 
                      : undefined
                  }}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filters & Clear */}
          {(searchText || selectedCategory) && (
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {searchText && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    ค้นหา: "{searchText}"
                    <button
                      onClick={() => handleSearch("")}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    ประเภท: {categories.find(c => c.value === selectedCategory)?.label}
                    <button
                      onClick={() => handleCategoryFilter("")}
                      className="ml-1 text-purple-600 hover:text-purple-800"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
              <button
                onClick={clearFilters}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                ล้างตัวกรอง
              </button>
            </div>
          )}
        </div>
      </div>
    );
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
              ⚖️
            </span>
          </div>
          <div className="flex-1 flex flex-wrap flex-row items-center justify-center gap-6 md:gap-12 md:ml-40">
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              กฎหมายและระเบียบ
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              Laws & Regulations
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              ข้อบังคับท้องถิ่น
            </span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full max-w-[1268px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
        {loading ? (
          // Loading skeleton
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
              <div className="h-4 bg-gray-300 rounded w-24"></div>
            </div>
          ))
        ) : lawsRegs.length > 0 ? (
          lawsRegs.map((lawReg) => (
            <div
              key={lawReg.id}
              className="bg-white bg-opacity-95 rounded-[29px] border-4 border-[#01bdcc] shadow-lg p-6 flex flex-col gap-3 relative cursor-pointer hover:shadow-xl hover:bg-opacity-100 transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm"
              onClick={() => handleShowDetail(lawReg)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-xl font-bold text-[#01385f] line-clamp-2 flex-1">
                  {lawReg.type_name}
                </h2>
                <div className="ml-2 bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                  ID: {lawReg.id}
                </div>
              </div>

              {/* Type Badge */}
              <div className="mb-3">
                <span 
                  className="inline-block px-3 py-1 rounded-full text-white text-sm font-medium"
                  style={{ backgroundColor: getLawRegColor(lawReg.type_name) }}
                >
                  กฎหมายและระเบียบ
                </span>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
                  📄 {lawReg.sections?.length || 0} มาตรา
                </span>
                <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-medium">
                  ⚖️ กฎหมาย
                </span>
              </div>

              {/* Dates */}
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">สร้างเมื่อ:</span>
                  <span className="font-medium">{formatDate(lawReg.created_at)}</span>
                </div>
                {lawReg.updated_at && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">อัพเดท:</span>
                    <span className="font-medium">{formatDate(lawReg.updated_at)}</span>
                  </div>
                )}
              </div>

              {/* Preview of recent sections */}
              {lawReg.sections && lawReg.sections.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">มาตราล่าสุด:</p>
                  <div className="space-y-1">
                    {lawReg.sections.slice(0, 2).map((section, idx) => (
                      <div key={idx} className="text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded truncate flex items-center gap-1">
                        <span>⚖️</span>
                        <span>{section.section_name}</span>
                      </div>
                    ))}
                    {lawReg.sections.length > 2 && (
                      <div className="text-xs text-gray-400">
                        และอีก {lawReg.sections.length - 2} มาตรา...
                      </div>
                    )}
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
          // No data message
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <div className="bg-white bg-opacity-90 rounded-xl p-8 text-center shadow-lg backdrop-blur-sm">
              <div className="text-gray-400 text-6xl mb-4">⚖️</div>
              <div className="text-gray-500 text-xl mb-2">
                {searchText || selectedCategory 
                  ? "ไม่พบกฎหมายและระเบียบที่ตรงกับการค้นหา" 
                  : "ไม่มีข้อมูลกฎหมายและระเบียบ"
                }
              </div>
              <div className="text-gray-400 text-sm mb-4">
                {searchText || selectedCategory 
                  ? "ลองเปลี่ยนคำค้นหาหรือตัวกรองใหม่" 
                  : "กรุณาเพิ่มข้อมูลกฎหมายในระบบจัดการ"
                }
              </div>
              {(searchText || selectedCategory) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-[#01bdcc] text-white rounded-lg hover:bg-[#01a5b3] transition-colors"
                >
                  ดูทั้งหมด
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
}