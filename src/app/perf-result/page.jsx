"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function PerfResultPage() {
  const [sections, setSections] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSections, setTotalSections] = useState(0);
  const [selectedType, setSelectedType] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const sectionsPerPage = 6;
  const searchParams = useSearchParams();

  // Define tab categories based on submenu
  const tabCategories = [
    { key: "all", label: "ทั้งหมด", keywords: [] },
    {
      key: "operation-report",
      label: "รายงานผลการดำเนินงาน",
      keywords: ["รายงานผลการดำเนินงาน"],
    },
    {
      key: "procurement",
      label: "การจัดซื้อจัดจ้าง",
      keywords: ["การจัดซื้อจัดจ้าง", "การจัดหาพัสดุ"],
    },
    {
      key: "financial-report",
      label: "รายงานการคลัง",
      keywords: ["รายงานการคลัง"],
    },
    {
      key: "transparency-measures",
      label: "มาตรการส่งเสริมความโปร่งใส",
      keywords: ["มาตรการส่งเสริมความโปร่งใส"],
    },
    {
      key: "hr-management",
      label: "การบริหารและทรัพยากรบุคคล",
      keywords: ["การบริหารและทรัพยากรบุคคล"],
    },
    {
      key: "statistics",
      label: "ข้อมูลเชิงสถิติ",
      keywords: ["ข้อมูลเชิงสถิติ"],
    },
    {
      key: "participation",
      label: "การเปิดโอกาสให้เกิดการมีส่วนร่วม",
      keywords: ["การเปิดโอกาสให้เกิดการมีส่วนร่วม"],
    },
  ];

  useEffect(() => {
    fetchTypes();

    // Check URL parameters for tab selection
    const tabParam = searchParams.get("tab");
    if (tabParam && tabCategories.find((tab) => tab.key === tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  useEffect(() => {
    fetchSections();
  }, [currentPage, selectedType, activeTab]);

  const fetchTypes = async () => {
    try {
      const response = await fetch("/api/perf-result-types");
      const result = await response.json();
      if (result.success) {
        setTypes(result.data);
      }
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };

  const fetchSections = async () => {
    setLoading(true);
    try {
      const typeFilter = selectedType ? `&type_id=${selectedType}` : "";
      const tabFilter = activeTab !== "all" ? `&tab=${activeTab}` : "";
      const response = await fetch(
        `/api/perf-result-sections?page=${currentPage}&limit=${sectionsPerPage}${typeFilter}${tabFilter}`
      );
      const result = await response.json();

      if (result.success) {
        setSections(result.data);
        setTotalSections(result.pagination?.total || 0);
        setTotalPages(
          Math.ceil((result.pagination?.total || 0) / sectionsPerPage)
        );
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
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

  const handleTypeFilter = (typeId) => {
    setSelectedType(typeId);
    setCurrentPage(1);
  };

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setCurrentPage(1);
    setSelectedType(""); // Reset type filter when changing tabs

    // Update URL without page reload
    const url = new URL(window.location);
    if (tabKey === "all") {
      url.searchParams.delete("tab");
    } else {
      url.searchParams.set("tab", tabKey);
    }
    window.history.pushState({}, "", url);
  };

  const getFilteredTypes = () => {
    if (activeTab === "all") return types;

    const currentTabCategory = tabCategories.find(
      (tab) => tab.key === activeTab
    );
    if (!currentTabCategory) return types;

    return types.filter((type) =>
      currentTabCategory.keywords.some((keyword) =>
        type.type_name.includes(keyword)
      )
    );
  };

  const handleSectionClick = (sectionId) => {
    window.location.href = `/perf-result/detail/${sectionId}`;
  };

  const getTypeColor = (typeName) => {
    if (!typeName) return "#01bdcc";

    if (typeName.includes("รายงานผลการดำเนินงาน")) return "#28a745";
    if (
      typeName.includes("การจัดซื้อจัดจ้าง") ||
      typeName.includes("การจัดหาพัสดุ")
    )
      return "#dc3545";
    if (typeName.includes("รายงานการคลัง")) return "#ffc107";
    if (typeName.includes("มาตรการส่งเสริมความโปร่งใส")) return "#6f42c1";
    if (typeName.includes("การบริหารและทรัพยากรบุคคล")) return "#fd7e14";
    if (typeName.includes("ข้อมูลเชิงสถิติ")) return "#20c997";
    if (typeName.includes("การเปิดโอกาสให้เกิดการมีส่วนร่วม")) return "#17a2b8";

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
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white text-[#01385f] border border-[#01bdcc] hover:bg-[#01bdcc] hover:text-white"
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
              ? "bg-[#01bdcc] text-white shadow-md"
              : "bg-white text-[#01385f] border border-[#01bdcc] hover:bg-[#01bdcc] hover:text-white"
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
          แสดงหน้า {currentPage} จาก {totalPages} หน้า | ทั้งหมด {totalSections}{" "}
          หมวด
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
              📊
            </span>
          </div>
          <div className="flex-1 flex flex-wrap flex-row items-center justify-center gap-6 md:gap-12 md:ml-40">
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              ผลการดำเนินงาน
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              รายงานหมวดหมู่
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              สถิติการปฏิบัติงาน
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white bg-opacity-90 rounded-2xl shadow-md p-4 backdrop-blur-sm mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">หมวดหมู่</h3>
          <div className="flex flex-wrap gap-2">
            {tabCategories.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
                style={{
                  backgroundColor:
                    activeTab === tab.key ? getTypeColor(tab.label) : undefined,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white bg-opacity-90 rounded-2xl shadow-md p-4 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            กรองตามประเภทย่อย
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleTypeFilter("")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === ""
                  ? "bg-[#01bdcc] text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              ทั้งหมด
            </button>
            {getFilteredTypes().map((type) => (
              <button
                key={type.id}
                onClick={() => handleTypeFilter(type.id.toString())}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === type.id.toString()
                    ? "text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
                style={{
                  backgroundColor:
                    selectedType === type.id.toString()
                      ? getTypeColor(type.type_name)
                      : undefined,
                }}
              >
                {type.type_name}
              </button>
            ))}
          </div>
          {getFilteredTypes().length === 0 && activeTab !== "all" && (
            <div className="text-gray-500 text-sm mt-2">
              ไม่มีประเภทย่อยในหมวดหมู่นี้
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
              <div className="h-4 bg-gray-300 rounded w-24"></div>
            </div>
          ))
        ) : sections.length > 0 ? (
          sections.map((section) => (
            <div
              key={section.id}
              className="bg-white bg-opacity-95 rounded-[29px] border-4 border-[#01bdcc] shadow-lg p-6 flex flex-col gap-3 relative cursor-pointer hover:shadow-xl hover:bg-opacity-100 transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm"
              onClick={() => handleSectionClick(section.id)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-xl font-bold text-[#01385f] line-clamp-2 flex-1">
                  {section.section_name}
                </h2>
                <div className="ml-2 bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                  ID: {section.id}
                </div>
              </div>

              {/* Type Badge */}
              <div className="mb-3">
                <span
                  className="inline-block px-3 py-1 rounded-full text-white text-sm font-medium"
                  style={{ backgroundColor: getTypeColor(section.type_name) }}
                >
                  {section.type_name}
                </span>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                  📝 {section.sub_topics_count || 0} หัวข้อ
                </span>
                <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-medium">
                  📄 {section.files_count || 0} ไฟล์
                </span>
              </div>

              {/* Dates */}
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">วันที่:</span>
                  <span className="font-medium">
                    {formatDate(section.date)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">สร้างเมื่อ:</span>
                  <span className="font-medium">
                    {formatDate(section.created_at)}
                  </span>
                </div>
              </div>

              {/* Preview of sub topics */}
              {section.recent_sub_topics &&
                section.recent_sub_topics.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-2">หัวข้อล่าสุด:</p>
                    <div className="space-y-1">
                      {section.recent_sub_topics
                        .slice(0, 2)
                        .map((subTopic, idx) => (
                          <div
                            key={idx}
                            className="text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded truncate"
                          >
                            📄 {subTopic.topic_name}
                          </div>
                        ))}
                      {section.sub_topics_count > 2 && (
                        <div className="text-xs text-gray-400">
                          และอีก {section.sub_topics_count - 2} หัวข้อ...
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
              <div className="text-gray-400 text-6xl mb-4">📊</div>
              <div className="text-gray-500 text-xl mb-2">
                {selectedType
                  ? "ไม่พบข้อมูลหมวดหมู่ในประเภทที่เลือก"
                  : "ไม่มีข้อมูลหมวดหมู่"}
              </div>
              <div className="text-gray-400 text-sm mb-4">
                {selectedType
                  ? "ลองเลือกประเภทอื่น หรือดูทั้งหมด"
                  : "กรุณาเพิ่มข้อมูลในระบบจัดการ"}
              </div>
              {selectedType && (
                <button
                  onClick={() => handleTypeFilter("")}
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
