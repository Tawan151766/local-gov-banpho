"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EthicsCodePage() {
  const router = useRouter();
  const [ethicsCodes, setEthicsCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCodes, setTotalCodes] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const codesPerPage = 6;

  // Mock data สำหรับทดสอบ
  const mockData = {
    ethics_codes: [
      {
        id: 1,
        title: "ประมวลจริยธรรมพนักงานส่วนท้องถิ่น ประจำปี 2568",
        files: [
          {
            id: 1,
            name: "ประมวลจริยธรรมพนักงานส่วนท้องถิ่น_2568.pdf",
            type: "application/pdf",
            size: "2.5 MB",
            path: "https://www.banphocity.go.th/news/doc_download/a_240425_143212.pdf"
          }
        ],
        create_date: "2024-01-15T00:00:00.000Z"
      },
      {
        id: 2,
        title: "ประมวลจริยธรรมสมาชิกสภาท้องถิ่น ประจำปี 2568",
        files: [
          {
            id: 1,
            name: "ประมวลจริยธรรมพนักงานส่วนท้องถิ่น_2568.pdf",
            type: "application/pdf",
            size: "2.5 MB",
            path: "https://www.banphocity.go.th/news/doc_download/a_240425_143236.pdf"
          }
        ],
        create_date: "2024-02-10T00:00:00.000Z"
      },
      {
        id: 3,
        title: "ประมวลจริยธรรมผู้บริหารท้องถิ่น ประจำปี 2568",
        files: [
          {
            id: 1,
            name: "ประมวลจริยธรรมพนักงานส่วนท้องถิ่น_2568.pdf",
            type: "application/pdf",
            size: "2.5 MB",
            path: "https://www.banphocity.go.th/news/doc_download/a_240425_143255.pdf"
          }
        ],
        create_date: "2024-03-05T00:00:00.000Z"
      },
      {
        id: 4,
        title: "ประมวลจริยธรรมสมาชิกสภาท้องถิ่น",
        files: [
          {
            id: 1,
            name: "ประมวลจริยธรรมพนักงานส่วนท้องถิ่น_2568.pdf",
            type: "application/pdf",
            size: "2.5 MB",
            path: "https://www.banphocity.go.th/news/doc_download/a_210223_161349.pdf"
          }
        ],
        create_date: "2024-04-12T00:00:00.000Z"
      },
      {
        id: 5,
        title: "ประมวลจริยธรรมผู้บริหารท้องถิ่น",
        files: [
          {
            id: 1,
            name: "ประมวลจริยธรรมพนักงานส่วนท้องถิ่น_2568.pdf",
            type: "application/pdf",
            size: "2.5 MB",
            path: "https://www.banphocity.go.th/news/doc_download/a_210223_161425.pdf"
          }
        ],
        create_date: "2024-05-20T00:00:00.000Z"
      },
      {
        id: 6,
        title: "ประกาศคณะกรรมการมาตรฐานการบริหารงานบุคคลส่วนท้องถิ่น เรื่อง ประมวลจริยธรรมพนักงานส่วนท้องถิ่น",
        files: [
          {
            id: 1,
            name: "ประมวลจริยธรรมพนักงานส่วนท้องถิ่น_2568.pdf",
            type: "application/pdf",
            size: "2.5 MB",
            path: "https://www.banphocity.go.th/news/doc_download/a_210223_161306.pdf"
          }
        ],
        create_date: "2024-06-18T00:00:00.000Z"
      }
    ]
  };

  // Categories for filtering - เอาออกเพราะไม่ใช้แล้ว
  const categories = [
    { value: "", label: "ทั้งหมด" },
    { value: "ประจำปี 2568", label: "ประจำปี 2568" },
    { value: "พนักงาน", label: "พนักงาน" },
    { value: "สมาชิกสภา", label: "สมาชิกสภา" },
    { value: "ผู้บริหาร", label: "ผู้บริหาร" }
  ];

  useEffect(() => {
    fetchEthicsCodes();
  }, [currentPage, searchText, selectedCategory]);

  const fetchEthicsCodes = async () => {
    setLoading(true);
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 800)); // Loading simulation
      
      let filteredData = [...mockData.ethics_codes];
      
      // Apply search filter
      if (searchText.trim()) {
        filteredData = filteredData.filter(code => 
          code.title.toLowerCase().includes(searchText.toLowerCase())
        );
      }
      
      // Apply category filter
      if (selectedCategory) {
        filteredData = filteredData.filter(code => 
          code.title.toLowerCase().includes(selectedCategory.toLowerCase())
        );
      }
      
      // Apply pagination
      const startIndex = (currentPage - 1) * codesPerPage;
      const endIndex = startIndex + codesPerPage;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      
      setEthicsCodes(paginatedData);
      setTotalCodes(filteredData.length);
      setTotalPages(Math.ceil(filteredData.length / codesPerPage));
    } catch (error) {
      console.error("Error fetching ethics codes:", error);
      setEthicsCodes([]);
    } finally {
      setLoading(false);
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

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleShowDetail = (ethicsCode) => {
    router.push(`/ethics-code/detail/${ethicsCode.id}`);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchText("");
    setSelectedCategory("");
    setCurrentPage(1);
  };

  const getEthicsColor = (title) => {
    if (title.includes("ประจำปี 2568")) return "#28a745";
    if (title.includes("พนักงาน")) return "#01bdcc";
    if (title.includes("สมาชิกสภา")) return "#6f42c1";
    if (title.includes("ผู้บริหาร")) return "#dc3545";
    if (title.includes("ประกาศคณะกรรมการ")) return "#fd7e14";
    return "#20c997";
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
          แสดงหน้า {currentPage} จาก {totalPages} หน้า | ทั้งหมด {totalCodes} ประมวล
          {(searchText || selectedCategory) && (
            <span className="ml-2">
              ({searchText && `ค้นหา: "${searchText}"`}
              {searchText && selectedCategory && ", "}
              {selectedCategory && `หมวด: ${categories.find(c => c.value === selectedCategory)?.label}`})
            </span>
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
              🏛️
            </span>
          </div>
          <div className="flex-1 flex flex-wrap flex-row items-center justify-center gap-6 md:gap-12 md:ml-40">
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              ประมวลจริยธรรม
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              พนักงานส่วนท้องถิ่น
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              Code of Ethics
            </span>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white bg-opacity-90 rounded-2xl shadow-md p-4 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">ค้นหาและกรอง</h3>
          
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="ค้นหาประมวลจริยธรรม หัวข้อ..."
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
            <label className="block text-sm font-medium text-gray-700 mb-2">กรองตามหมวดหมู่</label>
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
                      ? getEthicsColor(category.value) 
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
                    หมวด: {categories.find(c => c.value === selectedCategory)?.label}
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
              <div className="h-16 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-24"></div>
            </div>
          ))
        ) : ethicsCodes.length > 0 ? (
          ethicsCodes.map((ethicsCode) => (
            <div
              key={ethicsCode.id}
              className="bg-white bg-opacity-95 rounded-[29px] border-4 border-[#01bdcc] shadow-lg p-6 flex flex-col gap-3 relative cursor-pointer hover:shadow-xl hover:bg-opacity-100 transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm"
              onClick={() => handleShowDetail(ethicsCode)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-xl font-bold text-[#01385f] line-clamp-2 flex-1">
                  {ethicsCode.title}
                </h2>
                <div className="ml-2 bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                  ID: {ethicsCode.id}
                </div>
              </div>

              {/* Type Badge */}
              <div className="mb-3">
                <span 
                  className="inline-block px-3 py-1 rounded-full text-white text-sm font-medium"
                  style={{ backgroundColor: getEthicsColor(ethicsCode.title) }}
                >
                  ประมวลจริยธรรม
                </span>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
                  📄 {ethicsCode.files?.length || 0} ไฟล์
                </span>
                <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-medium">
                  🏛️ จริยธรรม
                </span>
              </div>

              {/* Dates */}
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">สร้างเมื่อ:</span>
                  <span className="font-medium">{formatDate(ethicsCode.create_date)}</span>
                </div>
              </div>

              {/* Preview of files */}
              {ethicsCode.files && ethicsCode.files.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">ไฟล์เอกสาร:</p>
                  <div className="space-y-1">
                    {ethicsCode.files.slice(0, 2).map((file, idx) => (
                      <div key={idx} className="text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded truncate flex items-center gap-1">
                        <span>📄</span>
                        <span>{file.name}</span>
                      </div>
                    ))}
                    {ethicsCode.files.length > 2 && (
                      <div className="text-xs text-gray-400">
                        และอีก {ethicsCode.files.length - 2} ไฟล์...
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
              <div className="text-gray-400 text-6xl mb-4">🏛️</div>
              <div className="text-gray-500 text-xl mb-2">
                {searchText || selectedCategory 
                  ? "ไม่พบประมวลจริยธรรมที่ตรงกับการค้นหา" 
                  : "ไม่มีข้อมูลประมวลจริยธรรม"
                }
              </div>
              <div className="text-gray-400 text-sm mb-4">
                {searchText || selectedCategory 
                  ? "ลองเปลี่ยนคำค้นหาหรือตัวกรองใหม่" 
                  : "กรุณาเพิ่มข้อมูลประมวลจริยธรรมในระบบจัดการ"
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