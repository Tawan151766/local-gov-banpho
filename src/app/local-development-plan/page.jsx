"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Component that uses useSearchParams wrapped in Suspense
function LocalDevelopmentPlanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [plans, setPlans] = useState([]); // ใช้สำหรับ all
  const [files, setFiles] = useState([]); // ใช้สำหรับแสดงไฟล์ของ type
  const [types, setTypes] = useState([]); // [{id, type_name}]
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPlans, setTotalPlans] = useState(0);
  const [activeTab, setActiveTab] = useState("all"); // id หรือ "all"
  const plansPerPage = 6;

  useEffect(() => {
    fetchTypes();
  }, []);

  useEffect(() => {
    // sync tab param from url
    const tabParam = searchParams.get("tab");
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
      setCurrentPage(1);
    }
  }, [searchParams]);

  useEffect(() => {
    if (activeTab === "all") {
      setFiles([]);
      fetchPlans();
    } else {
      setPlans([]);
      fetchFilesByType(activeTab);
    }
  }, [currentPage, activeTab]);

  const fetchTypes = async () => {
    try {
      const response = await fetch("/api/local-dev-plan-types");
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setTypes(result.data);
      }
    } catch (error) {
      setTypes([]);
    }
  };


  const fetchPlans = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/local-dev-plan?page=${currentPage}&limit=${plansPerPage}`);
      const result = await response.json();
      if (result.success) {
        setPlans(result.data || []);
        setTotalPlans(result.pagination?.total || result.data?.length || 0);
        setTotalPages(
          Math.ceil(
            (result.pagination?.total || result.data?.length || 0) /
              plansPerPage
          )
        );
      } else {
        setPlans([]);
      }
    } catch (error) {
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilesByType = async (typeId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/local-dev-plan-files-by-type?typeId=${typeId}`);
      const result = await response.json();
      if (result.success) {
        setFiles(result.data || []);
        setTotalPlans(result.data?.length || 0);
        setTotalPages(Math.ceil((result.data?.length || 0) / plansPerPage));
      } else {
        setFiles([]);
        setTotalPlans(0);
        setTotalPages(1);
      }
    } catch (error) {
      setFiles([]);
      setTotalPlans(0);
      setTotalPages(1);
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

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
    // Update URL without reload
    const url = new URL(window.location);
    if (tabId === "all") {
      url.searchParams.delete("tab");
    } else {
      url.searchParams.set("tab", tabId);
    }
    window.history.pushState({}, "", url);
  };

  // ไม่ต้องใช้ getFilteredTypes อีกต่อไป

  const handleShowDetail = (plan) => {
    router.push(`/local-development-plan/detail/${plan.id}`);
  };

  const handleFileDownload = (filePath, fileName) => {
    // Normalize filePath to always have full URL
    let fileUrl = filePath;
    if (!filePath) return;

    // If filePath starts with http(s), use as is
    if (/^https?:\/\//.test(filePath)) {
      fileUrl = filePath;
    } else if (filePath.startsWith("/storage/")) {
      // If filePath starts with /storage/, add domain
      fileUrl = `https://banpho.sosmartsolution.com${filePath}`;
    } else {
      // Otherwise, assume it's a relative path under storage
      fileUrl = `https://banpho.sosmartsolution.com/storage/${filePath.replace(/^\/?/, "")}`;
    }

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName || filePath.split("/").pop();
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileIcon = (fileType) => {
    const type = fileType?.toLowerCase();
    if (type?.includes("pdf")) return "📄";
    if (
      type?.includes("image") ||
      type?.includes("jpg") ||
      type?.includes("png")
    )
      return "🖼️";
    if (type?.includes("video") || type?.includes("mp4")) return "🎥";
    if (type?.includes("doc") || type?.includes("word")) return "📝";
    if (type?.includes("excel") || type?.includes("xls")) return "📊";
    return "📎";
  };

  const getPlanColor = (typeName) => {
    if (!typeName) return "#01bdcc";

    if (typeName.includes("แผนพัฒนาสี่ปี")) return "#28a745";
    if (typeName.includes("แผนปฏิบัติการ")) return "#dc3545";
    if (typeName.includes("แผนชุมชน")) return "#ffc107";
    if (typeName.includes("แผนยุทธศาสตร์")) return "#6f42c1";
    if (typeName.includes("แผนอัตรากำลัง")) return "#fd7e14";
    if (typeName.includes("แผนการจัดหาพัสดุ")) return "#20c997";

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
          แสดงหน้า {currentPage} จาก {totalPages} หน้า | ทั้งหมด {totalPlans}{" "}
          แผน
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
              📋
            </span>
          </div>
          <div className="flex-1 flex flex-wrap flex-row items-center justify-center gap-6 md:gap-12 md:ml-40">
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              แผนพัฒนาท้องถิ่น
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              Local Development Plan
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              แผนงานหลัก
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white bg-opacity-90 rounded-2xl shadow-md p-4 backdrop-blur-sm mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            หมวดหมู่แผน
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              key="all"
              onClick={() => handleTabChange("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "all"
                  ? "text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
              style={{
                backgroundColor:
                  activeTab === "all" ? "#01bdcc" : undefined,
              }}
            >
              ทั้งหมด
            </button>
            {types.map((type) => (
              <button
                key={type.id}
                onClick={() => handleTabChange(type.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab == type.id
                    ? "text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
                style={{
                  backgroundColor:
                    activeTab == type.id ? getPlanColor(type.type_name) : undefined,
                }}
              >
                {type.type_name}
              </button>
            ))}
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
        ) : activeTab === "all" ? (
          plans.length > 0 ? (
            plans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white bg-opacity-95 rounded-[29px] border-4 border-[#01bdcc] shadow-lg p-6 flex flex-col gap-3 relative cursor-pointer hover:shadow-xl hover:bg-opacity-100 transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm"
                onClick={() => handleShowDetail(plan)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <h2 className="text-xl font-bold text-[#01385f] line-clamp-2 flex-1">
                    {plan.type_name}
                  </h2>
                  <div className="ml-2 bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                    ID: {plan.id}
                  </div>
                </div>
                {/* Type Badge */}
                <div className="mb-3">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-white text-sm font-medium"
                    style={{ backgroundColor: getPlanColor(plan.type_name) }}
                  >
                    แผนพัฒนาท้องถิ่น
                  </span>
                </div>
                {/* Stats */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                    📄 {plan.files_count || 0} ไฟล์
                  </span>
                  <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-medium">
                    📊 แผนงาน
                  </span>
                </div>
                {/* Dates */}
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">สร้างเมื่อ:</span>
                    <span className="font-medium">
                      {formatDate(plan.created_at)}
                    </span>
                  </div>
                  {plan.updated_at && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">อัพเดท:</span>
                      <span className="font-medium">
                        {formatDate(plan.updated_at)}
                      </span>
                    </div>
                  )}
                </div>
                {/* Preview of recent files */}
                {plan.recent_files && plan.recent_files.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-2">ไฟล์ล่าสุด:</p>
                    <div className="space-y-1">
                      {plan.recent_files.slice(0, 2).map((file, idx) => (
                        <div
                          key={idx}
                          className="text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded truncate flex items-center gap-1"
                        >
                          <span>{getFileIcon(file.files_type)}</span>
                          <span>
                            {file.original_name ||
                              file.files_path?.split("/").pop() ||
                              `ไฟล์ ${idx + 1}`}
                          </span>
                        </div>
                      ))}
                      {plan.files_count > 2 && (
                        <div className="text-xs text-gray-400">
                          และอีก {plan.files_count - 2} ไฟล์...
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
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <div className="text-gray-500 text-xl mb-2">
                  ไม่มีข้อมูลแผนพัฒนาท้องถิ่น
                </div>
                <div className="text-gray-400 text-sm mb-4">
                  กรุณาเพิ่มข้อมูลแผนพัฒนาในระบบจัดการ
                </div>
              </div>
            </div>
          )
        ) : (
          files.length > 0 ? (
            files.slice((currentPage-1)*plansPerPage, currentPage*plansPerPage).map((file) => (
              <div
                key={file.id}
                className="bg-white bg-opacity-95 rounded-2xl border-2 border-[#01bdcc] shadow-lg p-5 flex flex-col gap-2 relative hover:shadow-xl hover:bg-opacity-100 transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {getFileIcon(file.files_type)}
                    </span>
                    <span className="text-lg font-semibold text-[#01385f] line-clamp-1">
                      {file.original_name || file.files_path?.split("/").pop() || `ไฟล์`}
                    </span>
                  </div>
                  <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                    ID: {file.id}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="bg-[#01bdcc] text-white px-3 py-1 rounded-full text-xs font-medium">
                    {file.files_type || 'ไฟล์'}
                  </span>
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                    {file.file_size ? `${(file.file_size/1024).toFixed(1)} KB` : 'ขนาดไม่ระบุ'}
                  </span>
                </div>
                <div className="text-xs text-gray-600 flex flex-wrap gap-3 mb-2">
                  <span>สร้างเมื่อ: <span className="font-medium">{formatDate(file.created_at)}</span></span>
                  {file.updated_at && (
                    <span>อัพเดท: <span className="font-medium">{formatDate(file.updated_at)}</span></span>
                  )}
                </div>
                {file.description && (
                  <div className="text-xs text-gray-500 mb-2">
                    {file.description}
                  </div>
                )}
                <button
                  onClick={() => handleFileDownload(file.files_path, file.original_name)}
                  className="mt-2 px-4 py-2 bg-[#01bdcc] text-white rounded-lg hover:bg-[#01a5b3] transition-colors text-sm font-medium w-fit self-end"
                >
                  ดาวน์โหลด/ดูไฟล์
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <div className="bg-white bg-opacity-90 rounded-xl p-8 text-center shadow-lg backdrop-blur-sm">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <div className="text-gray-500 text-xl mb-2">
                  ไม่มีไฟล์ในหมวดหมู่นี้
                </div>
                <div className="text-gray-400 text-sm mb-4">
                  กรุณาเพิ่มไฟล์ในระบบจัดการ
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* Pagination */}
      {renderPagination()}
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
            <div className="h-6 bg-gray-300 rounded w-24"></div>
          </div>
          <div className="h-8 bg-gray-300 rounded w-full mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-6"></div>
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
export default function LocalDevelopmentPlanPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LocalDevelopmentPlanContent />
    </Suspense>
  );
}
