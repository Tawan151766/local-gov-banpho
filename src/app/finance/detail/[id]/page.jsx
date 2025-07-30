"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

export default function FinanceDetailPage({ params }) {
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Unwrap params using React.use() for Next.js 15+
  const resolvedParams = use(params);
  const postId = resolvedParams?.id;

  useEffect(() => {
    if (postId) {
      fetchPostDetail();
    }
  }, [postId]);

  const fetchPostDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/post-details/${postId}?withMedia=true`);
      const result = await response.json();

      if (result.success) {
        setPost(result.data);
      } else {
        setError(result.message || "ไม่พบข้อมูลประกาศ");
      }
    } catch (error) {
      console.error("Error fetching post detail:", error);
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

  const getPostTypeColor = (typeName) => {
    if (!typeName) return "#73cc6b";
    if (typeName.includes("ประกาศ")) return "#73cc6b";
    if (typeName.includes("ผล")) return "#f39c12";
    if (typeName.includes("รายงาน")) return "#3498db";
    return "#73cc6b";
  };

  // Helper function to create full URL with base URL
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

  const ImageModal = ({ image, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-4xl max-h-full">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white rounded-full w-8 h-8 flex items-center justify-center text-gray-800 hover:bg-gray-200 z-10"
        >
          ✕
        </button>
        <img
          src={image.url}
          alt={image.name}
          className="max-w-full max-h-[90vh] object-contain rounded-lg"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 rounded-b-lg">
          <p className="text-center">{image.name}</p>
        </div>
      </div>
    </div>
  );

  const VideoModal = ({ video, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-4xl max-h-full">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white rounded-full w-8 h-8 flex items-center justify-center text-gray-800 hover:bg-gray-200 z-10"
        >
          ✕
        </button>
        <video
          src={video.url}
          controls
          className="max-w-full max-h-[90vh] rounded-lg"
        >
          เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอ
        </video>
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 rounded-b-lg">
          <p className="text-center">{video.name}</p>
        </div>
      </div>
    </div>
  );

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
        <div className="w-full max-w-4xl">
          {/* Loading Skeleton */}
          <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm animate-pulse">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-8 bg-gray-300 rounded w-32"></div>
              <div className="h-6 bg-gray-300 rounded w-24"></div>
            </div>
            <div className="h-8 bg-gray-300 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-6"></div>
            <div className="h-32 bg-gray-300 rounded w-full"></div>
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
        <div className="w-full max-w-4xl">
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
      <div className="w-full max-w-4xl mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-90 rounded-lg shadow-md hover:bg-opacity-100 transition-all backdrop-blur-sm"
        >
          <span className="text-[#01385f]">← ย้อนกลับ</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-4xl">
        <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg backdrop-blur-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#03bdca] to-[#01bdcc] p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center">
                  <span className="text-[#01385f] font-bold text-xl">EGP</span>
                </div>
                <div>
                  <h1 className="text-white text-xl md:text-2xl font-bold drop-shadow">
                    รายละเอียดประกาศจัดซื้อจัดจ้าง
                  </h1>
                  <p className="text-white opacity-90">{formatDate(post?.date)}</p>
                </div>
              </div>
              <span
                className="rounded-full px-4 py-2 text-white font-medium shadow-md self-start md:self-center"
                style={{
                  backgroundColor: getPostTypeColor(post?.type_name),
                }}
              >
                {post?.type_name || "ประกาศ"}
              </span>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 md:p-8">
            {/* Title */}
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-[#01385f] mb-2">
                {post?.title_name || "ไม่มีหัวข้อ"}
              </h2>
              {post?.topic_name && (
                <div className="inline-block bg-blue-50 text-[#01385f] px-3 py-1 rounded-full text-sm font-medium">
                  {post.topic_name}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">รายละเอียด</h3>
              <div className="prose max-w-none">
                {post?.details ? (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {post.details}
                  </p>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                    <div className="text-gray-400 text-4xl mb-2">📋</div>
                    <p className="text-gray-500">ไม่มีรายละเอียดเพิ่มเติม</p>
                    <p className="text-sm text-gray-400 mt-1">หัวข้อประกาศแสดงข้อมูลหลักแล้ว</p>
                  </div>
                )}
              </div>
            </div>

            {/* Media Sections */}
            <div className="space-y-8">
              {/* PDFs */}
              {post?.pdfs && post.pdfs.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    📄 เอกสาร PDF ({post.pdfs.length} ไฟล์)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {post.pdfs.map((pdf, idx) => {
                      const fileName = pdf.post_pdf_file?.split('/').pop() || `เอกสาร ${idx + 1}.pdf`;
                      return (
                        <div key={pdf.id || idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-800 truncate" title={fileName}>
                                {fileName}
                              </p>
                              <p className="text-sm text-gray-500">PDF Document</p>
                              <p className="text-xs text-gray-400">
                                อัพโหลด: {formatDate(pdf.created_at)}
                              </p>
                            </div>
                            <div className="ml-4 flex flex-col gap-2">
                              <button
                                onClick={() => handleDownload(pdf.post_pdf_file, fileName)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm whitespace-nowrap"
                              >
                                ดาวน์โหลด
                              </button>
                              <button
                                onClick={() => window.open(createFileUrl(pdf.post_pdf_file), '_blank')}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm whitespace-nowrap"
                              >
                                ดูไฟล์
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Images */}
              {post?.photos && post.photos.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    🖼️ รูปภาพ ({post.photos.length} รูป)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {post.photos.map((photo, idx) => (
                      <div
                        key={photo.id || idx}
                        className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => setSelectedImage({
                          url: createFileUrl(photo.post_photo_file),
                          name: photo.post_photo_file?.split('/').pop() || `รูปภาพ ${idx + 1}`
                        })}
                      >
                        <img
                          src={createFileUrl(photo.post_photo_file)}
                          alt={`รูปภาพ ${idx + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Videos */}
              {post?.videos && post.videos.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    🎥 วิดีโอ ({post.videos.length} คลิป)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {post.videos.map((video, idx) => (
                      <div
                        key={video.id || idx}
                        className="aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow relative group"
                        onClick={() => setSelectedVideo({
                          url: video.post_video_file?.startsWith('http') ? video.post_video_file : `/${video.post_video_file}`,
                          name: video.post_video_file?.split('/').pop() || `วิดีโอ ${idx + 1}`
                        })}
                      >
                        <video
                          src={video.post_video_file?.startsWith('http') ? video.post_video_file : `/${video.post_video_file}`}
                          className="w-full h-full object-cover"
                          muted
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-20 transition-all">
                          <div className="bg-white bg-opacity-90 rounded-full p-3">
                            <span className="text-2xl">▶️</span>
                          </div>
                        </div>
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                          {video.post_video_file?.split('/').pop() || `วิดีโอ ${idx + 1}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-500">
                อัพเดทล่าสุด: {formatDate(post?.updated_at || post?.date)}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  🖨️ พิมพ์
                </button>
                <button
                  onClick={() => router.push('/finance')}
                  className="px-4 py-2 bg-[#01bdcc] text-white rounded-lg hover:bg-[#01a5b3] transition-colors"
                >
                  กลับหน้าหลัก
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedImage && (
        <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
      {selectedVideo && (
        <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </div>
  );
}