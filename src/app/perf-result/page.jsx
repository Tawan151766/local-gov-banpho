"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function PerfResultContent() {
  const [types, setTypes] = useState([]);
  const [sections, setSections] = useState([]);
  const [subTopics, setSubTopics] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sectionsLoading, setSectionsLoading] = useState(false);
  const [subTopicsLoading, setSubTopicsLoading] = useState(false);
  const [filesLoading, setFilesLoading] = useState(false);

  // Navigation states
  const [currentLevel, setCurrentLevel] = useState("types"); // types, sections, subTopics, files
  const [selectedType, setSelectedType] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedSubTopic, setSelectedSubTopic] = useState(null);
  // Load files for a specific sub topic
  const loadFiles = async (subTopicId) => {
    setFilesLoading(true);
    try {
      const response = await fetch(`/api/perf-results-files?subTopicId=${subTopicId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.success) {
        setFiles(result.data || []);
        setTotalItems(result.data?.length || 0);
        setTotalPages(Math.ceil((result.data?.length || 0) / itemsPerPage));
      } else {
        setFiles([]);
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (error) {
      setFiles([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setFilesLoading(false);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 6;
  const searchParams = useSearchParams();

  // Load functions
  const loadTypes = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/perf-results-types");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setTypes(result.data || []);
        setTotalItems(result.data?.length || 0);
        setTotalPages(Math.ceil((result.data?.length || 0) / itemsPerPage));
      } else {
        console.error("API returned error:", result.error);
        setTypes([]);
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching types:", error);
      setTypes([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const loadSections = async (typeId) => {
    setSectionsLoading(true);
    try {
      const response = await fetch(`/api/perf-results-sections-by-type?typeId=${typeId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.success) {
        setSections(result.data || []);
        setTotalItems(result.data?.length || 0);
        setTotalPages(Math.ceil((result.data?.length || 0) / itemsPerPage));
      } else {
        setSections([]);
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (error) {
      setSections([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setSectionsLoading(false);
    }
  };

  const loadSubTopics = async (sectionId) => {
    setSubTopicsLoading(true);
    try {
      const response = await fetch(`/api/perf-results-sub-topics-by-section?sectionId=${sectionId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.success) {
        setSubTopics(result.data || []);
        setTotalItems(result.data?.length || 0);
        setTotalPages(Math.ceil((result.data?.length || 0) / itemsPerPage));
      } else {
        setSubTopics([]);
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (error) {
      setSubTopics([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setSubTopicsLoading(false);
    }
  };

  // Navigation functions
  const navigateToSections = (type) => {
    setSelectedType(type);
    setCurrentLevel("sections");
    setCurrentPage(1);
    loadSections(type.id);
  };


  const navigateToSubTopics = (section) => {
    setSelectedSection(section);
    setCurrentLevel("subTopics");
    setCurrentPage(1);
    loadSubTopics(section.id);
  };

  const navigateToFiles = (subTopic) => {
    setSelectedSubTopic(subTopic);
    setCurrentLevel("files");
    setCurrentPage(1);
    loadFiles(subTopic.id);
  };

  const navigateBack = () => {
    if (currentLevel === "files") {
      setCurrentLevel("subTopics");
      setSelectedSubTopic(null);
      setFiles([]);
      setCurrentPage(1);
      if (selectedSection) {
        loadSubTopics(selectedSection.id);
      }
    } else if (currentLevel === "subTopics") {
      setCurrentLevel("sections");
      setSelectedSection(null);
      setSubTopics([]);
      setCurrentPage(1);
      if (selectedType) {
        loadSections(selectedType.id);
      }
    } else if (currentLevel === "sections") {
      setCurrentLevel("types");
      setSelectedType(null);
      setSections([]);
      setCurrentPage(1);
      loadTypes();
    }
  };

  const navigateToTypes = () => {
    setCurrentLevel("types");
    setSelectedType(null);
    setSelectedSection(null);
    setSections([]);
    setSubTopics([]);
    setCurrentPage(1);
    loadTypes();
  };

  useEffect(() => {
    loadTypes();
  }, []);

  // Get breadcrumb items
  const getBreadcrumbItems = () => {
    const items = [
      {
        title: "ประเภทผลการดำเนินงาน",
        onClick: navigateToTypes,
      },
    ];
    if (selectedType) {
      items.push({
        title: selectedType.type_name,
        onClick: () => {
          setCurrentLevel("sections");
          loadSections(selectedType.id);
        },
      });
    }
    if (selectedSection) {
      items.push({
        title: selectedSection.section_name,
        onClick: () => {
          setCurrentLevel("subTopics");
          loadSubTopics(selectedSection.id);
        },
      });
    }
    if (selectedSubTopic) {
      items.push({
        title: selectedSubTopic.topic_name,
        onClick: () => {
          setCurrentLevel("files");
          loadFiles(selectedSubTopic.id);
        },
      });
    }
    return items;
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
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleItemClick = (item) => {
    if (currentLevel === "types") {
      navigateToSections(item);
    } else if (currentLevel === "sections") {
      navigateToSubTopics(item);
    } else if (currentLevel === "subTopics") {
      // ไปหน้าไฟล์ของ subTopic
      navigateToFiles(item);
    } else if (currentLevel === "files") {
      // เปิดไฟล์ (ดาวน์โหลด/ดู)
      if (item.files_path) {
        let fullUrl = '';
        if (item.files_path.startsWith('/storage/')) {
          fullUrl = item.files_path.replace('/storage/', 'https://banpho.sosmartsolution.com/storage/');
        } else if (item.files_path.startsWith('http')) {
          fullUrl = item.files_path;
        } else {
          fullUrl = `https://banpho.sosmartsolution.com/storage/${item.files_path}`;
        }
        window.open(fullUrl, '_blank');
      }
    }
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

  // Get current data based on level
  const getCurrentData = () => {
    if (currentLevel === "types") return types;
    if (currentLevel === "sections") return sections;
    if (currentLevel === "subTopics") return subTopics;
    if (currentLevel === "files") return files;
    return [];
  };

  const getCurrentLoading = () => {
    if (currentLevel === "types") return loading;
    if (currentLevel === "sections") return sectionsLoading;
    if (currentLevel === "subTopics") return subTopicsLoading;
    if (currentLevel === "files") return filesLoading;
    return false;
  };

  const getCurrentTitle = () => {
    if (currentLevel === "types") return "ประเภทผลการดำเนินงาน";
    if (currentLevel === "sections") return "หมวดหมู่หัวข้อ";
    if (currentLevel === "subTopics") return "หัวข้อย่อย";
    if (currentLevel === "files") return "ไฟล์ผลการดำเนินงาน";
    return "";
  };

  const getCurrentIcon = () => {
    if (currentLevel === "types") return "📊";
    if (currentLevel === "sections") return "📁";
    if (currentLevel === "subTopics") return "📄";
    if (currentLevel === "files") return "�";
    return "�📊";
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
          แสดงหน้า {currentPage} จาก {totalPages} หน้า | ทั้งหมด {totalItems}{" "}
          รายการ
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
              {getCurrentIcon()}
            </span>
          </div>
          <div className="flex-1 flex flex-wrap flex-row items-center justify-center gap-6 md:gap-12 md:ml-40">
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              {getCurrentTitle()}
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              ผลการดำเนินงาน
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              เทศบาลตำบลบ้านโพธิ์
            </span>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        {currentLevel !== "types" && (
          <div className="bg-white bg-opacity-90 rounded-2xl shadow-md p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm">
              {getBreadcrumbItems().map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  {index > 0 && <span className="text-gray-400">›</span>}
                  <button
                    onClick={item.onClick}
                    className="text-blue-600 hover:text-blue-800 transition-colors hover:underline"
                  >
                    {item.title}
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-2">
              <button
                onClick={navigateBack}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                ← ย้อนกลับ
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="w-full max-w-[1268px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
        {getCurrentLoading() ? (
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
        ) : getCurrentData().length > 0 ? (
          getCurrentData()
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((item) => (
              <div
                key={item.id}
                className="bg-white bg-opacity-95 rounded-[29px] border-4 border-[#01bdcc] shadow-lg p-6 flex flex-col gap-3 relative cursor-pointer hover:shadow-xl hover:bg-opacity-100 transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm"
                onClick={() => handleItemClick(item)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <h2 className="text-xl font-bold text-[#01385f] line-clamp-2 flex-1">
                    {currentLevel === "types"
                      ? item.type_name
                      : currentLevel === "sections"
                      ? item.section_name
                      : currentLevel === "subTopics"
                      ? item.topic_name
                      : item.files_name || item.files_path}
                  </h2>
                  <div className="ml-2 bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                    ID: {item.id}
                  </div>
                </div>

                {/* Type Badge */}
                {currentLevel !== "types" && currentLevel !== "files" && (
                  <div className="mb-3">
                    <span
                      className="inline-block px-3 py-1 rounded-full text-white text-sm font-medium"
                      style={{
                        backgroundColor: getTypeColor(
                          item.type_name || selectedType?.type_name
                        ),
                      }}
                    >
                      {item.type_name || selectedType?.type_name}
                    </span>
                  </div>
                )}

                {/* Stats */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentLevel === "types" && (
                    <>
                      <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
                        📁 {item.sections_count || 0} หมวดหมู่
                      </span>
                      <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                        📝 {item.sub_topics_count || 0} หัวข้อ
                      </span>
                      <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-medium">
                        📄 {item.files_count || 0} ไฟล์
                      </span>
                    </>
                  )}
                  {currentLevel === "sections" && (
                    <>
                      <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                        📝 {item.sub_topics_count || 0} หัวข้อ
                      </span>
                      <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-medium">
                        📄 {item.files_count || 0} ไฟล์
                      </span>
                    </>
                  )}
                  {currentLevel === "subTopics" && (
                    <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-medium">
                      📄 {item.files_count || 0} ไฟล์
                    </span>
                  )}
                  {currentLevel === "files" && (
                    <>
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                        {item.files_type ? `ประเภท: ${item.files_type}` : ''}
                      </span>
                      {item.description && (
                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                          {item.description}
                        </span>
                      )}
                    </>
                  )}
                </div>

                {/* Dates */}
                <div className="text-sm text-gray-600 space-y-1">
                  {item.date && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">วันที่:</span>
                      <span className="font-medium">
                        {formatDate(item.date)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">สร้างเมื่อ:</span>
                    <span className="font-medium">
                      {formatDate(item.created_at)}
                    </span>
                  </div>
                </div>

                {/* Preview of sub items */}
                {currentLevel === "sections" &&
                  item.recent_sub_topics &&
                  item.recent_sub_topics.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-2">
                        หัวข้อล่าสุด:
                      </p>
                      <div className="space-y-1">
                        {item.recent_sub_topics
                          .slice(0, 2)
                          .map((subTopic, idx) => (
                            <div
                              key={idx}
                              className="text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded truncate"
                            >
                              📄 {subTopic.topic_name}
                            </div>
                          ))}
                        {item.sub_topics_count > 2 && (
                          <div className="text-xs text-gray-400">
                            และอีก {item.sub_topics_count - 2} หัวข้อ...
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                {/* Action hint */}
                <div className="mt-3 pt-2 border-t border-gray-100 text-center">
                  <span className="text-sm text-[#01385f] font-medium hover:underline">
                    {currentLevel === "subTopics"
                      ? "คลิกเพื่อดูไฟล์ →"
                      : currentLevel === "files"
                      ? "คลิกเพื่อดาวน์โหลด/ดูไฟล์ →"
                      : "คลิกเพื่อดูเพิ่มเติม →"}
                  </span>
                </div>
              </div>
            ))
        ) : (
          // No data message
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <div className="bg-white bg-opacity-90 rounded-xl p-8 text-center shadow-lg backdrop-blur-sm">
              <div className="text-gray-400 text-6xl mb-4">
                {getCurrentIcon()}
              </div>
              <div className="text-gray-500 text-xl mb-2">
                ไม่มีข้อมูล{getCurrentTitle()}
              </div>
              <div className="text-gray-400 text-sm mb-4">
                กรุณาเพิ่มข้อมูลในระบบจัดการ
              </div>
              {currentLevel !== "types" && (
                <button
                  onClick={navigateBack}
                  className="px-4 py-2 bg-[#01bdcc] text-white rounded-lg hover:bg-[#01a5b3] transition-colors"
                >
                  ย้อนกลับ
                </button>
              )}
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

// Loading component for Suspense fallback
function LoadingFallback() {
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
      <div className="w-full max-w-[1268px] flex flex-col gap-4 mb-8">
        <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm animate-pulse">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-8 bg-gray-300 rounded w-32"></div>
          </div>
          <div className="h-8 bg-gray-300 rounded w-full mb-4"></div>
          <div className="space-y-4">
            <div className="h-16 bg-gray-300 rounded"></div>
            <div className="h-16 bg-gray-300 rounded"></div>
            <div className="h-16 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense wrapper
export default function PerfResultPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PerfResultContent />
    </Suspense>
  );
}
