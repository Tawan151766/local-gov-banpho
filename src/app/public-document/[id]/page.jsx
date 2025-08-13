"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

function PublicDocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/public-documents/${params.id}`);
        const result = await response.json();

        if (result.success) {
          setDocument(result.data);
          // Increment view count
          await fetch(`/api/public-documents/${params.id}/view`, {
            method: 'POST'
          });
        } else {
          setError(result.error || "ไม่พบเอกสารที่ต้องการ");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchDocument();
    }
  }, [params.id]);

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
    const link = window.document.createElement('a');
    link.href = fileUrl;
    link.download = fileName || filePath.split('/').pop();
    link.target = '_blank';
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  const getContentTypeIcon = (doc) => {
    if (doc?.photos_count > 0) return "📸";
    if (doc?.videos_count > 0) return "🎥";
    if (doc?.pdfs_count > 0) return "📄";
    return "📁";
  };

  const getTotalMediaCount = () => {
    const photos = document?.photos?.length || document?.photos_count || 0;
    const videos = document?.videos?.length || document?.videos_count || 0;
    const pdfs = document?.pdfs?.length || document?.pdfs_count || 0;
    return photos + videos + pdfs;
  };

  const getFileIcon = (filePath) => {
    if (!filePath) return '📁';
    const extension = filePath.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'ppt':
      case 'pptx':
        return '📋';
      default:
        return '📁';
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen py-8 px-2 md:px-8 flex flex-col items-center bg-transparent" style={{backgroundImage:'linear-gradient(180deg, rgba(239, 228, 212, 0.6) 0%, rgba(1, 189, 204, 0.6) 100%), url("/image/vision_bg.png")',backgroundSize:'cover',backgroundPosition:'center',backgroundRepeat:'no-repeat',backgroundAttachment:'fixed'}}>
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
              <div className="h-32 bg-gray-300 rounded"></div>
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
      <div className="w-full min-h-screen py-8 px-2 md:px-8 flex flex-col items-center bg-transparent" style={{backgroundImage:'linear-gradient(180deg, rgba(239, 228, 212, 0.6) 0%, rgba(1, 189, 204, 0.6) 100%), url("/image/vision_bg.png")',backgroundSize:'cover',backgroundPosition:'center',backgroundRepeat:'no-repeat',backgroundAttachment:'fixed'}}>
        <div className="w-full max-w-6xl">
          <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 text-center backdrop-blur-sm">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">เกิดข้อผิดพลาด</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <button onClick={() => router.back()} className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">ย้อนกลับ</button>
              <button onClick={() => window.location.reload()} className="px-6 py-2 bg-[#01bdcc] text-white rounded-lg hover:bg-[#01a5b3] transition-colors">ลองใหม่</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen py-8 px-2 md:px-8 flex flex-col items-center bg-transparent" style={{backgroundImage:'linear-gradient(180deg, rgba(239, 228, 212, 0.6) 0%, rgba(1, 189, 204, 0.6) 100%), url("/image/vision_bg.png")',backgroundSize:'cover',backgroundPosition:'center',backgroundRepeat:'no-repeat',backgroundAttachment:'fixed'}}>
      {/* Back Button */}
      <div className="w-full max-w-6xl mb-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-90 rounded-lg shadow-md hover:bg-opacity-100 transition-all backdrop-blur-sm">
          <span className="text-[#01385f]">← ย้อนกลับ</span>
        </button>
      </div>
      {/* Main Content */}
      <div className="w-full max-w-6xl">
        <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg backdrop-blur-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#03bdca] to-[#01bdcc] p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center">
                  <span className="text-[#01385f] font-bold text-xl">{getContentTypeIcon(document)}</span>
                </div>
                <div>
                  <h1 className="text-white text-xl md:text-2xl font-bold drop-shadow">{document?.title_name}</h1>
                  <p className="text-white opacity-90">ประเภท: {document?.type_name || "เอกสารเผยแพร่"}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-right">
                <div className="text-white text-sm opacity-90">วันที่ประกาศ: {formatDate(document?.date)}</div>
                <div className="text-white text-sm opacity-90">สร้างเมื่อ: {formatDate(document?.created_at)}</div>
              </div>
            </div>
          </div>
          {/* Content Body */}
          <div className="p-6 md:p-8">
            {/* Info */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h2 className="text-2xl font-bold text-[#01385f] mb-2">{document?.title_name}</h2>
              {document?.topic_name && <h3 className="text-lg text-gray-700 mb-3">{document.topic_name}</h3>}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                <span>📸 {document?.photos_count || 0} รูปภาพ</span>
                <span>🎥 {document?.videos_count || 0} วิดีโอ</span>
                <span>📄 {document?.pdfs_count || 0} เอกสาร</span>
                <span>📎 {getTotalMediaCount()} ไฟล์ทั้งหมด</span>
              </div>
              <div className="inline-block px-3 py-1 rounded-full text-white text-sm font-medium bg-[#01bdcc]">{document?.type_name || "เอกสารเผยแพร่"}</div>
            </div>
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
              <button onClick={() => setActiveTab("details")} className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${activeTab === "details" ? "bg-[#01bdcc] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>📄 รายละเอียด</button>
              {(document?.photos && document.photos.length > 0) && (
                <button onClick={() => setActiveTab("photos")} className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${activeTab === "photos" ? "bg-[#01bdcc] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>📸 รูปภาพ ({document.photos.length})</button>
              )}
              {(document?.videos && document.videos.length > 0) && (
                <button onClick={() => setActiveTab("videos")} className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${activeTab === "videos" ? "bg-[#01bdcc] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>🎥 วิดีโอ ({document.videos.length})</button>
              )}
              {(document?.pdfs && document.pdfs.length > 0) && (
                <button onClick={() => setActiveTab("pdfs")} className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${activeTab === "pdfs" ? "bg-[#01bdcc] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>📄 เอกสาร ({document.pdfs.length})</button>
              )}
            </div>
            {/* Tab Content */}
            <div className="min-h-[400px]">
              {/* Details Tab */}
              {activeTab === "details" && (
                <div className="space-y-6">
                  {document?.details ? (
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">รายละเอียด</h3>
                      <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {document.details}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <span className="text-6xl">📄</span>
                      <p className="text-xl mt-4">ไม่มีรายละเอียด</p>
                    </div>
                  )}
                  {/* Quick Media Preview */}
                  {getTotalMediaCount() > 0 && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">ไฟล์แนบ</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {document?.photos_count > 0 && (
                          <div className="bg-white rounded-lg p-4 text-center">
                            <span className="text-3xl">📸</span>
                            <p className="text-sm font-medium mt-2">รูปภาพ</p>
                            <p className="text-xs text-gray-500">{document.photos_count} ไฟล์</p>
                          </div>
                        )}
                        {document?.videos_count > 0 && (
                          <div className="bg-white rounded-lg p-4 text-center">
                            <span className="text-3xl">🎥</span>
                            <p className="text-sm font-medium mt-2">วิดีโอ</p>
                            <p className="text-xs text-gray-500">{document.videos_count} ไฟล์</p>
                          </div>
                        )}
                        {document?.pdfs_count > 0 && (
                          <div className="bg-white rounded-lg p-4 text-center">
                            <span className="text-3xl">📄</span>
                            <p className="text-sm font-medium mt-2">เอกสาร</p>
                            <p className="text-xs text-gray-500">{document.pdfs_count} ไฟล์</p>
                          </div>
                        )}
                      </div>
                      {getTotalMediaCount() === 0 && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            📞 กรุณาติดต่อเทศบาลตำบลบ้านโพธิ์เพื่อขอรับไฟล์เอกสาร
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              {/* Photos Tab */}
              {activeTab === "photos" && (
                <div>
                  {document?.photos && document.photos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {document.photos.map((photo, index) => (
                        <div key={photo.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                          <img src={createFileUrl(photo.post_photo_file)} alt={`รูปภาพ ${index + 1}`} className="w-full h-48 object-cover cursor-pointer" onClick={() => window.open(createFileUrl(photo.post_photo_file), '_blank')} />
                          <div className="p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">รูปภาพ {index + 1}</span>
                              <div className="flex gap-2">
                                <button onClick={() => window.open(createFileUrl(photo.post_photo_file), '_blank')} className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors">ดู</button>
                                <button onClick={() => handleDownload(photo.post_photo_file, `รูปภาพ-${index + 1}.jpg`)} className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors">ดาวน์โหลด</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <span className="text-6xl">📸</span>
                      <p className="text-xl mt-4">ไม่มีรูปภาพ</p>
                    </div>
                  )}
                </div>
              )}
              {/* Videos Tab */}
              {activeTab === "videos" && (
                <div>
                  {document?.videos && document.videos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {document.videos.map((video, index) => (
                        <div key={video.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">🎥</span>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-800">วิดีโอ {index + 1}</p>
                              <div className="text-xs text-gray-500">วันที่อัพโหลด: {formatDate(video.created_at)}</div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <button onClick={() => window.open(createFileUrl(video.post_video_file), '_blank')} className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors whitespace-nowrap">เล่น</button>
                              <button onClick={() => handleDownload(video.post_video_file, `วิดีโอ-${index + 1}`)} className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors whitespace-nowrap">ดาวน์โหลด</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <span className="text-6xl">🎥</span>
                      <p className="text-xl mt-4">ไม่มีวิดีโอ</p>
                    </div>
                  )}
                </div>
              )}
              {/* PDFs Tab */}
              {activeTab === "pdfs" && (
                <div>
                  {document?.pdfs && document.pdfs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {document.pdfs.map((pdf, index) => {
                        const fileName = pdf.post_pdf_file?.split('/').pop() || `เอกสาร-${index + 1}.pdf`;
                        return (
                          <div key={pdf.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3">
                              <span className="text-3xl">📄</span>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-800 truncate" title={fileName}>{fileName}</p>
                                <div className="text-xs text-gray-500">วันที่อัพโหลด: {formatDate(pdf.created_at)}</div>
                              </div>
                              <div className="flex flex-col gap-2">
                                <button onClick={() => window.open(createFileUrl(pdf.post_pdf_file), '_blank')} className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors whitespace-nowrap">ดูไฟล์</button>
                                <button onClick={() => handleDownload(pdf.post_pdf_file, fileName)} className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors whitespace-nowrap">ดาวน์โหลด</button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <span className="text-6xl">📄</span>
                      <p className="text-xl mt-4">ไม่มีเอกสาร</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* Summary Statistics */}
            {getTotalMediaCount() > 0 && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">สรุปสถิติไฟล์แนบ</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{document?.photos?.length || document?.photos_count || 0}</div>
                    <div className="text-sm text-gray-600">รูปภาพ</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{document?.videos?.length || document?.videos_count || 0}</div>
                    <div className="text-sm text-gray-600">วิดีโอ</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{document?.pdfs?.length || document?.pdfs_count || 0}</div>
                    <div className="text-sm text-gray-600">เอกสาร PDF</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{getTotalMediaCount()}</div>
                    <div className="text-sm text-gray-600">รวมทั้งหมด</div>
                  </div>
                </div>
              </div>
            )}
            {/* Footer Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-500">อัพเดทล่าสุด: {formatDate(document?.updated_at)}</div>
              <div className="flex gap-3">
                <button onClick={() => window.print()} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">🖨️ พิมพ์</button>
                <Link href="/public-document"><button className="px-4 py-2 bg-[#01bdcc] text-white rounded-lg hover:bg-[#01a5b3] transition-colors">กลับหน้ารายการ</button></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicDocumentDetailPage;