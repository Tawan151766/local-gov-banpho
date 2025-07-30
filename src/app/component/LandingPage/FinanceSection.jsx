"use client";
import { useState, useEffect } from "react";

export default function FinanceSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProcurementPosts();
  }, []);

  const fetchProcurementPosts = async () => {
    try {
      // ใช้ API ที่มีอยู่แล้ว - postTypeId=3 สำหรับประกาศจัดซื้อจัดจ้าง
      const response = await fetch("/api/post-details?page=1&limit=4&postTypeId=3&withMedia=true");
      const result = await response.json();

      if (result.success) {
        setPosts(result.data);
      }
    } catch (error) {
      console.error("Error fetching procurement posts:", error);
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
    const year = date.getFullYear() + 543; // Convert to Buddhist year

    return `${day} ${month} ${year}`;
  };

  const getPostTypeColor = (typeName) => {
    if (!typeName) return "#73cc6b";

    if (typeName.includes("ประกาศ")) return "#73cc6b";
    if (typeName.includes("ผล")) return "#f39c12";
    if (typeName.includes("รายงาน")) return "#3498db";
    return "#73cc6b";
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return "ไม่มีรายละเอียด";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <div
      className="w-full min-h-[900px] py-8 px-2 md:px-8 flex flex-col items-center"
      style={{
        backgroundImage:
          'linear-gradient(180deg, rgba(239, 228, 212, 0.6) 0%, rgba(1, 189, 204, 0.6) 100%), url("/image/Boat.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Header Section */}
      <div className="w-full max-w-[1268px] flex flex-col gap-4 mb-8">
        <div className="bg-gradient-to-r from-[#03bdca] to-[#01bdcc] rounded-[36px] shadow-lg w-full flex flex-col md:flex-row items-center px-6 py-6 relative">
          <div className="bg-white rounded-full shadow-md w-32 h-16 flex items-center justify-center mb-4 md:mb-0 md:absolute md:left-6 md:top-1/2 md:-translate-y-1/2 border-2 border-[#01bdcc]">
            <span className="text-[#01385f] font-bold text-2xl tracking-wide">
              EGP
            </span>
          </div>
          <div className="flex-1 flex flex-wrap flex-row items-center justify-center gap-6 md:gap-12 md:ml-40">
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow">
              ประกาศจัดซื้อจัดจ้าง
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow">
              ผลประกาศจัดซื้อจัดจ้าง
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow">
              รายงานผลจัดซื้อจัดจ้าง
            </span>
          </div>
        </div>
      </div>
      <div className="w-full max-w-[1268px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {loading ? (
          // Loading skeleton
          [...Array(4)].map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-[29px] border-4 border-[#01bdcc] shadow-md p-6 flex flex-col gap-2 relative animate-pulse"
            >
              <div className="flex flex-row items-center justify-between mb-2">
                <div className="h-6 bg-gray-300 rounded w-24"></div>
                <div className="h-8 bg-gray-300 rounded w-20"></div>
              </div>
              <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="flex flex-row items-center justify-between mt-4">
                <div className="h-4 bg-gray-300 rounded w-16"></div>
              </div>
            </div>
          ))
        ) : posts.length > 0 ? (
          posts.map((post, idx) => (
            <div
              key={post.id || idx}
              className="bg-white rounded-[29px] border-4 border-[#01bdcc] shadow-md p-6 flex flex-col gap-2 relative cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-row items-center justify-between mb-2">
                <span className="text-[#01385f] font-semibold text-lg">
                  {formatDate(post.date)}
                </span>
                <span
                  className="rounded px-4 py-1 text-white text-base"
                  style={{
                    backgroundColor: getPostTypeColor(post.type_name),
                  }}
                >
                  {post.type_name || "ประกาศ"}
                </span>
              </div>

              <div className="text-[#1e1e1e] text-base mb-2 font-semibold">
                {post.title_name || "ไม่มีหัวข้อ"}
              </div>

              {post.topic_name && (
                <div className="text-[#01385f] text-sm mb-2 font-medium">
                  {post.topic_name}
                </div>
              )}

              <div className="text-[#666] text-sm mb-2">
                {truncateText(post.details)}
              </div>

              <div className="flex flex-row items-center justify-between mt-4">
                <span
                  className="text-[#01385f] font-semibold text-base hover:underline cursor-pointer"
                  onClick={() => window.location.href = '/finance/all'}
                >
                  ดูทั้งหมด
                </span>
                <div className="flex gap-2 text-xs text-gray-500">
                  {post.pdfs && post.pdfs.length > 0 && (
                    <span>📄 {post.pdfs.length} PDF</span>
                  )}
                  {post.photos && post.photos.length > 0 && (
                    <span>🖼️ {post.photos.length} รูป</span>
                  )}
                  {post.videos && post.videos.length > 0 && (
                    <span>🎥 {post.videos.length} วิดีโอ</span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          // No data message
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <div className="text-gray-500 text-lg mb-2">
              ไม่มีข้อมูลประกาศจัดซื้อจัดจ้าง
            </div>
            <div className="text-gray-400 text-sm">
              กรุณาเพิ่มข้อมูลในระบบจัดการ
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
