"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

export default function LawsRegulationsDetailPage({ params }) {
  const router = useRouter();
  const [lawRegData, setLawRegData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [groupedSections, setGroupedSections] = useState({});

  // Unwrap params using React.use() for Next.js 15+
  const resolvedParams = use(params);
  const lawRegId = resolvedParams?.id;

  useEffect(() => {
    if (lawRegId) {
      fetchLawRegDetail();
    }
  }, [lawRegId]);

  const fetchLawRegDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/laws-regs-types/${lawRegId}?withSections=true`);
      const result = await response.json();

      if (result.success) {
        setLawRegData(result.data);
        
        // Group sections by type/category
        if (result.data.sections && result.data.sections.length > 0) {
          const grouped = groupSectionsByCategory(result.data.sections);
          setGroupedSections(grouped);
          // Auto expand first group for better UX
          const firstGroupKey = Object.keys(grouped)[0];
          if (firstGroupKey) {
            setExpandedSections(new Set([firstGroupKey]));
          }
        }
      } else {
        setError(result.error || "ไม่พบข้อมูลกฎหมายและระเบียบ");
      }
    } catch (error) {
      console.error("Error fetching law regulation detail:", error);
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const groupSectionsByCategory = (sections) => {
    const groups = {};
    
    sections.forEach(section => {
      const sectionName = section.section_name?.toLowerCase() || '';
      let category = 'มาตราอื่นๆ';
      
      if (sectionName.includes('บททั่วไป') || sectionName.includes('บทนิยาม')) {
        category = 'บททั่วไป';
      } else if (sectionName.includes('บทคำนำ') || sectionName.includes('หลักการ')) {
        category = 'หลักการและวัตถุประสงค์';
      } else if (sectionName.includes('สิทธิ') || sectionName.includes('หน้าที่')) {
        category = 'สิทธิและหน้าที่';
      } else if (sectionName.includes('การดำเนิน') || sectionName.includes('ขั้นตอน')) {
        category = 'การดำเนินการ';
      } else if (sectionName.includes('โทษ') || sectionName.includes('บทลงโทษ')) {
        category = 'บทลงโทษ';
      } else if (sectionName.includes('เบ็ดเสร็จ') || sectionName.includes('ภาคผนวก')) {
        category = 'เบ็ดเสร็จ';
      }
      
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(section);
    });
    
    return groups;
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
    const baseUrl = 'https://banpho.sosmartsolution.com';
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

  const getCategoryIcon = (category) => {
    if (category.includes('บททั่วไป')) return '📚';
    if (category.includes('หลักการ')) return '🎯';
    if (category.includes('สิทธิ')) return '👥';
    if (category.includes('การดำเนิน')) return '⚙️';
    if (category.includes('บทลงโทษ')) return '⚖️';
    if (category.includes('เบ็ดเสร็จ')) return '📋';
    return '📄';
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

  const toggleSectionGroup = (groupKey) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(groupKey)) {
      newExpanded.delete(groupKey);
    } else {
      newExpanded.add(groupKey);
    }
    setExpandedSections(newExpanded);
  };

  const expandAll = () => {
    const allGroups = new Set(Object.keys(groupedSections));
    setExpandedSections(allGroups);
  };

  const collapseAll = () => {
    setExpandedSections(new Set());
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
              background: `linear-gradient(135deg, ${getLawRegColor(lawRegData?.type_name)} 0%, ${getLawRegColor(lawRegData?.type_name)}dd 100%)`
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center">
                  <span className="text-[#01385f] font-bold text-xl">⚖️</span>
                </div>
                <div>
                  <h1 className="text-white text-xl md:text-2xl font-bold drop-shadow">
                    {lawRegData?.type_name}
                  </h1>
                  <p className="text-white opacity-90">กฎหมายและระเบียบ</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-right">
                <div className="text-white text-sm opacity-90">
                  รหัสกฎหมาย: LAW-{lawRegData?.id}
                </div>
                <div className="text-white text-sm opacity-90">
                  สร้างเมื่อ: {formatDate(lawRegData?.created_at)}
                </div>
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 md:p-8">
            {/* Law Regulation Info */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h2 className="text-2xl font-bold text-[#01385f] mb-2">
                {lawRegData?.type_name}
              </h2>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                <span>📄 {lawRegData?.sections?.length || 0} มาตรา</span>
                <span>📁 {Object.keys(groupedSections).length} หมวดหมู่</span>
                <span>🏛️ หน่วยงาน: องค์การบริหารส่วนตำบล</span>
              </div>
              <div 
                className="inline-block px-3 py-1 rounded-full text-white text-sm font-medium"
                style={{ backgroundColor: getLawRegColor(lawRegData?.type_name) }}
              >
                {lawRegData?.type_name}
              </div>
            </div>

            {/* Law Description */}
            {lawRegData?.description && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">รายละเอียดกฎหมาย</h3>
                <p className="text-gray-700 leading-relaxed">{lawRegData.description}</p>
              </div>
            )}

            {/* Control Buttons */}
            {Object.keys(groupedSections).length > 0 && (
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
            )}

            {/* Section Groups */}
            <div className="space-y-4">
              {Object.keys(groupedSections).length > 0 ? (
                Object.entries(groupedSections).map(([category, sections]) => (
                  <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Category Header */}
                    <div
                      className="bg-blue-50 p-4 cursor-pointer hover:bg-blue-100 transition-colors"
                      onClick={() => toggleSectionGroup(category)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-blue-600 text-lg">
                            {getCategoryIcon(category)}
                          </span>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              {category}
                            </h3>
                            <div className="text-sm text-gray-500">
                              {sections.length} มาตรา
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs font-medium">
                            {sections.length} มาตรา
                          </span>
                          <span className="text-gray-400">
                            {expandedSections.has(category) ? '−' : '+'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Category Sections */}
                    {expandedSections.has(category) && (
                      <div className="p-4 bg-white border-t border-gray-200">
                        <div className="space-y-4">
                          {sections.map((section) => (
                            <div key={section.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-start gap-3 flex-1">
                                  <span className="text-blue-600 text-lg mt-1">⚖️</span>
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-800 mb-2">
                                      {section.section_name}
                                    </h4>
                                    <div className="text-xs text-gray-500 mb-2">
                                      <span>สร้างเมื่อ: {formatDate(section.created_at)}</span>
                                      {section.updated_at && (
                                        <>
                                          <span className="mx-2">•</span>
                                          <span>อัพเดท: {formatDate(section.updated_at)}</span>
                                        </>
                                      )}
                                    </div>
                                    {section.description && (
                                      <p className="text-sm text-gray-600 leading-relaxed">
                                        {section.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="ml-3">
                                  <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                                    ID: {section.id}
                                  </span>
                                </div>
                              </div>
                              
                              {/* Section Files (if any) */}
                              {section.files && section.files.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                  <p className="text-xs text-gray-500 mb-2">ไฟล์แนบ ({section.files.length}):</p>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {section.files.map((file) => {
                                      const fileName = file.files_path?.split('/').pop() || `ไฟล์ ${file.id}`;
                                      return (
                                        <div key={file.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                          <span className="text-sm">
                                            {getFileIcon(file.files_type)}
                                          </span>
                                          <span className="text-xs text-gray-700 flex-1 truncate" title={fileName}>
                                            {fileName}
                                          </span>
                                          <div className="flex gap-1">
                                            <button
                                              onClick={() => handleDownload(file.files_path, fileName)}
                                              className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
                                            >
                                              ดาวน์โหลด
                                            </button>
                                            <button
                                              onClick={() => window.open(createFileUrl(file.files_path), '_blank')}
                                              className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors"
                                            >
                                              ดู
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <span className="text-6xl">📋</span>
                  <p className="text-xl mt-4">ไม่มีมาตราในกฎหมายนี้</p>
                  <p className="text-sm mt-1">กรุณาเพิ่มมาตราในระบบจัดการ</p>
                </div>
              )}
            </div>

            {/* Summary Statistics */}
            {lawRegData?.sections && lawRegData.sections.length > 0 && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">สรุปสถิติมาตรา</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {lawRegData.sections.length}
                    </div>
                    <div className="text-sm text-gray-600">มาตราทั้งหมด</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {Object.keys(groupedSections).length}
                    </div>
                    <div className="text-sm text-gray-600">หมวดหมู่</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {lawRegData.sections.filter(s => s.files && s.files.length > 0).length}
                    </div>
                    <div className="text-sm text-gray-600">มาตราที่มีไฟล์</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {Math.round((lawRegData.sections.length / Object.keys(groupedSections).length) * 10) / 10}
                    </div>
                    <div className="text-sm text-gray-600">มาตราเฉลี่ย/หมวด</div>
                  </div>
                </div>
              </div>
            )}

            {/* Law Status */}
            <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">สถานะกฎหมาย</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-green-600 text-xl">✅</span>
                  <div>
                    <div className="text-sm text-gray-600">สถานะ</div>
                    <div className="font-medium text-green-600">ใช้บังคับ</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-blue-600 text-xl">📅</span>
                  <div>
                    <div className="text-sm text-gray-600">วันที่ประกาศใช้</div>
                    <div className="font-medium text-gray-800">{formatDate(lawRegData?.created_at)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-500">
                อัพเดทล่าสุด: {formatDate(lawRegData?.updated_at)}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  🖨️ พิมพ์
                </button>
                <button
                  onClick={() => router.push('/laws-regs')}
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