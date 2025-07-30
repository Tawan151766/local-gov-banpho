"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

export default function PerfResultDetailPage({ params }) {
  const router = useRouter();
  const [sectionData, setSectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSubTopics, setExpandedSubTopics] = useState(new Set());

  // Unwrap params using React.use() for Next.js 15+
  const resolvedParams = use(params);
  const sectionId = resolvedParams?.id;

  useEffect(() => {
    if (sectionId) {
      fetchSectionDetail();
    }
  }, [sectionId]);

  const fetchSectionDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/perf-result-sections/${sectionId}`);
      const result = await response.json();

      if (result.success) {
        setSectionData(result.data);
        // Auto expand first sub topic for better UX
        if (result.data.sub_topics && result.data.sub_topics.length > 0) {
          setExpandedSubTopics(new Set([result.data.sub_topics[0].id]));
        }
      } else {
        setError(result.message || "ไม่พบข้อมูลหมวดหมู่");
      }
    } catch (error) {
      console.error("Error fetching section detail:", error);
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "ไม่ระบุวันที่";

    const date = new Date(dateString);
    const thaiMonths = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];

    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543;

    return `${day} ${month} ${year}`;
  };

  const createFileUrl = (filePath) => {
    const baseUrl = 'https://banpho.sosmartsolution.com/storage/';
    return filePath?.startsWith('http') ? filePath : `${baseUrl}${filePath}`;
  };

  const handleDownload = (filePath, fileName) => {
    const fileUrl = createFileUrl(filePath);
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName || filePath.split('/').pop();
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  const getTypeColor = (typeName) => {
    if (!typeName) return "#01bdcc";
    
    if (typeName.includes("รายงานผลการดำเนินงาน")) return "#28a745";
    if (typeName.includes("การจัดซื้อจัดจ้าง") || typeName.includes("การจัดหาพัสดุ")) return "#dc3545";
    if (typeName.includes("รายงานการคลัง")) return "#ffc107";
    if (typeName.includes("มาตรการส่งเสริมความโปร่งใส")) return "#6f42c1";
    if (typeName.includes("การบริหารและทรัพยากรบุคคล")) return "#fd7e14";
    if (typeName.includes("ข้อมูลเชิงสถิติ")) return "#20c997";
    if (typeName.includes("การเปิดโอกาสให้เกิดการมีส่วนร่วม")) return "#17a2b8";
    
    return "#01bdcc";
  };

  const toggleSubTopic = (subTopicId) => {
    const newExpanded = new Set(expandedSubTopics);
    if (newExpanded.has(subTopicId)) {
      newExpanded.delete(subTopicId);
    } else {
      newExpanded.add(subTopicId);
    }
    setExpandedSubTopics(newExpanded);
  };

  const expandAll = () => {
    const allSubTopics = new Set(sectionData?.sub_topics?.map(st => st.id) || []);
    setExpandedSubTopics(allSubTopics);
  };

  const collapseAll = () => {
    setExpandedSubTopics(new Set());
  };

  if (loading) {
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
        <div className="w-full max-w-6xl">
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

  if (error) {
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
        <div className="w-full max-w-6xl">
          <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 text-center backdrop-blur-sm">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">เกิดข้อผิดพลาด</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.back()}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                ย้อนกลับ
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-[#01bdcc] text-white rounded-lg hover:bg-[#01a5b3] transition-colors"
              >
                ลองใหม่
              </button>
            </div>
          </div>
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
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Back Button */}
      <div className="w-full max-w-6xl mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-90 rounded-lg shadow-md hover:bg-opacity-100 transition-all backdrop-blur-sm"
        >
          <span className="text-[#01385f]">← ย้อนกลับ</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-6xl">
        <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg backdrop-blur-sm overflow-hidden">
          {/* Header */}
          <div 
            className="p-6"
            style={{
              background: `linear-gradient(135deg, ${getTypeColor(sectionData?.type_name)} 0%, ${getTypeColor(sectionData?.type_name)}dd 100%)`
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center">
                  <span className="text-[#01385f] font-bold text-xl">📊</span>
                </div>
                <div>
                  <h1 className="text-white text-xl md:text-2xl font-bold drop-shadow">
                    {sectionData?.section_name}
                  </h1>
                  <p className="text-white opacity-90">หมวด: {sectionData?.type_name}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-right">
                <div className="text-white text-sm opacity-90">
                  วันที่: {formatDate(sectionData?.date)}
                </div>
                <div className="text-white text-sm opacity-90">
                  สร้างเมื่อ: {formatDate(sectionData?.created_at)}
                </div>
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 md:p-8">
            {/* Section Info */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h2 className="text-2xl font-bold text-[#01385f] mb-2">
                {sectionData?.section_name}
              </h2>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                <span>📝 {sectionData?.sub_topics?.length || 0} หัวข้อ</span>
                <span>📄 {sectionData?.sub_topics?.reduce((acc, st) => acc + (st.files?.length || 0), 0)} ไฟล์</span>
              </div>
              <div 
                className="inline-block px-3 py-1 rounded-full text-white text-sm font-medium"
                style={{ backgroundColor: getTypeColor(sectionData?.type_name) }}
              >
                {sectionData?.type_name}
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={expandAll}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
              >
                ▼ ขยายทั้งหมด
              </button>
              <button
                onClick={collapseAll}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                ▲ ย่อทั้งหมด
              </button>
            </div>

            {/* Sub Topics */}
            <div className="space-y-4">
              {sectionData?.sub_topics && sectionData.sub_topics.length > 0 ? (
                sectionData.sub_topics.map((subTopic) => (
                  <div key={subTopic.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Sub Topic Header */}
                    <div
                      className="bg-blue-50 p-4 cursor-pointer hover:bg-blue-100 transition-colors"
                      onClick={() => toggleSubTopic(subTopic.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-blue-600 text-lg">
                            {expandedSubTopics.has(subTopic.id) ? '📝' : '📄'}
                          </span>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              {subTopic.topic_name}
                            </h3>
                            <div className="text-sm text-gray-500">
                              {formatDate(subTopic.date)} | {subTopic.files?.length || 0} ไฟล์
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs font-medium">
                            ID: {subTopic.id}
                          </span>
                          <span className="text-gray-400">
                            {expandedSubTopics.has(subTopic.id) ? '−' : '+'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Sub Topic Files */}
                    {expandedSubTopics.has(subTopic.id) && (
                      <div className="p-4 bg-white border-t border-gray-200">
                        {subTopic.files && subTopic.files.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {subTopic.files.map((file) => {
                              const fileName = file.files_path?.split('/').pop() || `ไฟล์ ${file.id}`;
                              return (
                                <div key={file.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                      <span className="text-2xl">
                                        {getFileIcon(file.files_type)}
                                      </span>
                                      <div className="min-w-0 flex-1">
                                        <p className="font-medium text-gray-800 truncate" title={fileName}>
                                          {fileName}
                                        </p>
                                        <div className="text-xs text-gray-500">
                                          <span className="capitalize">{file.files_type || 'ไฟล์'}</span>
                                          <span className="mx-1">•</span>
                                          <span>{formatDate(file.created_at)}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="ml-3 flex flex-col gap-2">
                                      <button
                                        onClick={() => handleDownload(file.files_path, fileName)}
                                        className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors whitespace-nowrap"
                                      >
                                        ดาวน์โหลด
                                      </button>
                                      <button
                                        onClick={() => window.open(createFileUrl(file.files_path), '_blank')}
                                        className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors whitespace-nowrap"
                                      >
                                        ดูไฟล์
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <span className="text-4xl">📭</span>
                            <p className="text-lg mt-2">ไม่มีไฟล์ในหัวข้อนี้</p>
                            <p className="text-sm mt-1">กรุณาเพิ่มไฟล์ในระบบจัดการ</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <span className="text-6xl">📝</span>
                  <p className="text-xl mt-4">ไม่มีหัวข้อในหมวดนี้</p>
                  <p className="text-sm mt-1">กรุณาเพิ่มหัวข้อในระบบจัดการ</p>
                </div>
              )}
            </div>

            {/* Summary Statistics */}
            {sectionData?.sub_topics && sectionData.sub_topics.length > 0 && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">สรุปสถิติ</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {sectionData.sub_topics.length}
                    </div>
                    <div className="text-sm text-gray-600">หัวข้อทั้งหมด</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {sectionData.sub_topics.reduce((acc, st) => acc + (st.files?.length || 0), 0)}
                    </div>
                    <div className="text-sm text-gray-600">ไฟล์ทั้งหมด</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {sectionData.sub_topics.filter(st => st.files && st.files.length > 0).length}
                    </div>
                    <div className="text-sm text-gray-600">หัวข้อที่มีไฟล์</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {Math.round((sectionData.sub_topics.reduce((acc, st) => acc + (st.files?.length || 0), 0) / sectionData.sub_topics.length) * 10) / 10}
                    </div>
                    <div className="text-sm text-gray-600">ไฟล์เฉลี่ย/หัวข้อ</div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-500">
                อัพเดทล่าสุด: {formatDate(sectionData?.updated_at)}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  🖨️ พิมพ์
                </button>
                <button
                  onClick={() => router.push('/perf-result')}
                  className="px-4 py-2 bg-[#01bdcc] text-white rounded-lg hover:bg-[#01a5b3] transition-colors"
                >
                  กลับหน้าหลัก
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}