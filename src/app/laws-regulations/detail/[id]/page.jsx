"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function LawsRegulationsDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params.id) {
      fetchSectionDetail();
    }
  }, [params.id]);

  const fetchSectionDetail = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/laws-regs-sections/${params.id}`);
      const result = await response.json();
      
      if (result.success) {
        setSection(result.data);
      } else {
        setError(result.error || "ไม่พบข้อมูล");
      }
    } catch (error) {
      console.error("Error fetching section detail:", error);
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const handleFileDownload = (filePath, fileName) => {
    const baseUrl = "https://banpho.sosmartsolution.com/storage/";
    const fileUrl = filePath?.startsWith("http")
      ? filePath
      : `${baseUrl}${filePath}`;

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

  const getLawRegColor = (typeName) => {
    if (!typeName) return "#01bdcc";
    
    // กฎหมาย ระเบียบ และประกาศกระทรวง
    if (typeName.includes("กฎหมาย") || typeName.includes("ระเบียบ") || typeName.includes("ประกาศกระทรวง")) return "#dc3545";
    
    // พระราชบัญญัติ และพระราชกฤษฎีกา
    if (typeName.includes("พระราชบัญญัติ") || typeName.includes("พระราชกฤษฎีกา")) return "#28a745";
    
    // ข้อบัญญัติ
    if (typeName.includes("ข้อบัญญัติ")) return "#ffc107";
    
    return "#01bdcc";
  };

  if (loading) {
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
        <div className="w-full max-w-[1268px] bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-6"></div>
          <div className="space-y-4">
            <div className="h-16 bg-gray-300 rounded"></div>
            <div className="h-16 bg-gray-300 rounded"></div>
            <div className="h-16 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
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
        <div className="w-full max-w-[1268px] bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 text-center backdrop-blur-sm">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <div className="text-gray-700 text-xl mb-4">{error}</div>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-[#01bdcc] text-white rounded-lg hover:bg-[#01a5b3] transition-colors"
          >
            กลับ
          </button>
        </div>
      </div>
    );
  }

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
      {/* Header */}
      <div className="w-full max-w-[1268px] mb-8">
        <div className="bg-gradient-to-r from-[#03bdca] to-[#01bdcc] rounded-[36px] shadow-lg w-full flex flex-col md:flex-row items-center px-6 py-6 relative backdrop-blur-sm">
          <div className="bg-white rounded-full shadow-md w-32 h-16 flex items-center justify-center mb-4 md:mb-0 md:absolute md:left-6 md:top-1/2 md:-translate-y-1/2 border-2 border-[#01bdcc]">
            <span className="text-[#01385f] font-bold text-2xl tracking-wide">
              ⚖️
            </span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-2 md:ml-40">
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg text-center">
              {section?.section_name}
            </span>
            <span className="text-white/80 font-medium text-sm md:text-lg drop-shadow-lg">
              {section?.type_name}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-[1268px] bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 text-[#01385f] hover:bg-gray-100 rounded-lg transition-colors"
          >
            ← กลับ
          </button>
        </div>

        {/* Section Info */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span
              className="inline-block px-4 py-2 rounded-full text-white text-sm font-medium"
              style={{ backgroundColor: getLawRegColor(section?.type_name) }}
            >
              {section?.type_name}
            </span>
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
              📄 {section?.files?.length || 0} ไฟล์
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">สร้างเมื่อ:</span>
              <span className="font-medium">{formatDate(section?.created_at)}</span>
            </div>
            {section?.updated_at && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">อัพเดทล่าสุด:</span>
                <span className="font-medium">{formatDate(section?.updated_at)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Files Section */}
        {section?.files && section.files.length > 0 ? (
          <div>
            <h3 className="text-xl font-semibold text-[#01385f] mb-6 flex items-center gap-2">
              📁 ไฟล์เอกสาร ({section.files.length} ไฟล์)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.files.map((file, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200"
                  onClick={() => handleFileDownload(file.files_path, file.original_name)}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl flex-shrink-0">
                      {getFileIcon(file.files_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {file.original_name || file.files_path?.split("/").pop() || `ไฟล์ ${index + 1}`}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {file.files_type || "ไม่ระบุประเภท"}
                      </div>
                      {file.created_at && (
                        <div className="text-xs text-gray-400 mt-1">
                          {formatDate(file.created_at)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    <span className="text-sm text-[#01bdcc] hover:underline">
                      คลิกเพื่อดาวน์โหลด
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📄</div>
            <div className="text-gray-500 text-lg mb-2">ไม่มีไฟล์เอกสาร</div>
            <div className="text-gray-400 text-sm">
              ยังไม่มีการอัพโหลดไฟล์สำหรับมาตรานี้
            </div>
          </div>
        )}
      </div>
    </div>
  );
}