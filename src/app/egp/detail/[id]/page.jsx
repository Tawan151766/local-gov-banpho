"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function EGPDetailPage() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    if (params.id) {
      fetchPostDetail(params.id);
    }
  }, [params.id]);

  const fetchPostDetail = async (postId) => {
    try {
      setLoading(true);
      setError(null);

      // แยก ID เพื่อเอาข้อมูลที่ต้องการ
      const [deptsub_id, announce_type] = postId.split('-');
      
      // ใน real application ควรมี API endpoint สำหรับดึงข้อมูลรายการเดียว
      // เช่น: /api/egp/${deptsub_id}/${announce_type}
      // แต่เนื่องจาก API ปัจจุบันส่งข้อมูลทั้งหมด เราจึงต้องกรองเอา
      
      const response = await fetch("https://egp.sosmartsolution.com/api.php?deptsub=1509900857");
      const result = await response.json();

      if (result.success) {
        // หา post ที่ตรงกับ ID ที่ส่งมา
        const foundPost = result.data.find(p => 
          p.deptsub_id === deptsub_id && p.announce_type === announce_type
        );

        if (foundPost) {
          setPost(foundPost);
        } else {
          setError("ไม่พบข้อมูลประกาศที่ต้องการ");
        }
      } else {
        setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
      }
    } catch (error) {
      console.error("Error fetching post detail:", error);
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
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

  const getPostTypeColor = (announceType) => {
    if (!announceType) return "#73cc6b";

    if (announceType === "15") return "#e74c3c";
    if (announceType.startsWith("P")) return "#73cc6b";
    if (announceType.startsWith("D")) return "#f39c12";
    if (announceType.startsWith("M")) return "#9b59b6";
    if (announceType.startsWith("W")) return "#3498db";
    
    return "#73cc6b";
  };

  const getPostTypeName = (announceType) => {
    if (!announceType) return "ประกาศ";

    if (announceType === "15") return "ประกาศ EGP";
    if (announceType.startsWith("P")) return "ประกาศจัดซื้อจัดจ้าง";
    if (announceType.startsWith("D")) return "ผลประกาศจัดซื้อจัดจ้าง";
    if (announceType.startsWith("M")) return "ประกาศราคากลาง";
    if (announceType.startsWith("W")) return "รายงานผลจัดซื้อจัดจ้าง";
    
    return "ประกาศ";
  };

  const handleOpenOriginal = () => {
    if (post && post.link) {
      window.open(post.link, '_blank');
    }
  };

  if (loading) {
    return (
      <div
        className="w-full min-h-screen py-8 px-2 md:px-8 flex flex-col items-center justify-center"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(239, 228, 212, 0.6) 0%, rgba(1, 189, 204, 0.6) 100%), url("/image/Boat.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-6"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div
        className="w-full min-h-screen py-8 px-2 md:px-8 flex flex-col items-center justify-center"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(239, 228, 212, 0.6) 0%, rgba(1, 189, 204, 0.6) 100%), url("/image/Boat.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {error || "ไม่พบข้อมูล"}
          </h1>
          <p className="text-gray-600 mb-6">
            ไม่สามารถแสดงรายละเอียดประกาศได้ในขณะนี้
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/egp" className="bg-[#01385f] text-white px-6 py-3 rounded-full hover:bg-[#01385f]/90 transition-colors">
              กลับหน้า EGP
            </Link>
            <Link href="/" className="bg-gray-500 text-white px-6 py-3 rounded-full hover:bg-gray-600 transition-colors">
              กลับหน้าหลัก
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-screen py-8 px-2 md:px-8 flex flex-col items-center"
      style={{
        backgroundImage:
          'linear-gradient(180deg, rgba(239, 228, 212, 0.6) 0%, rgba(1, 189, 204, 0.6) 100%), url("/image/Boat.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Navigation */}
      <div className="w-full max-w-4xl mb-6">
        <div className="flex items-center gap-4">
          <Link href="/egp" className="flex items-center gap-2 text-[#01385f] hover:text-[#01385f]/80 transition-colors bg-white/80 rounded-full px-4 py-2 shadow-md">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-semibold">กลับหน้า EGP</span>
          </Link>
          <Link href="/" className="text-[#01385f] hover:text-[#01385f]/80 transition-colors bg-white/60 rounded-full px-4 py-2">
            <span className="font-medium">หน้าหลัก</span>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#03bdca] to-[#01bdcc] px-6 py-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="px-4 py-2 rounded-full text-white font-medium shadow-md"
                    style={{
                      backgroundColor: getPostTypeColor(post.announce_type),
                    }}
                  >
                    {getPostTypeName(post.announce_type)}
                  </span>
                  <span className="text-white/80 text-sm">
                    {formatDate(post.pub_date)}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                  {post.title}
                </h1>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  รหัส: {post.announce_type}
                </span>
                <span className="text-white/80 text-sm">
                  เทศบาลตำบลบ้านโพธิ์
                </span>
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 md:p-8">
            {/* Main Content */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-[#01385f] mb-4">
                รายละเอียดประกาศ
              </h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-800 leading-relaxed text-lg">
                  {post.title}
                </p>
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-[#01385f] mb-2">ประเภทประกาศ</h3>
                <p className="text-gray-700">{getPostTypeName(post.announce_type)}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-[#01385f] mb-2">วันที่ประกาศ</h3>
                <p className="text-gray-700">{formatDate(post.pub_date)}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-[#01385f] mb-2">รหัสประกาศ</h3>
                <p className="text-gray-700">{post.announce_type}</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="font-semibold text-[#01385f] mb-2">หน่วยงาน</h3>
                <p className="text-gray-700">เทศบาลตำบลบ้านโพธิ์</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleOpenOriginal}
                className="bg-[#01385f] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#01385f]/90 hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                เปิดดูเอกสารต้นฉบับ
              </button>
              <Link
                href="/egp"
                className="bg-white text-[#01385f] border-2 border-[#01385f] px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#01385f] hover:text-white hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                ดูประกาศอื่นๆ
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-100 px-6 py-4 border-t">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>ข้อมูลจากระบบ e-GP</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>อัปเดตล่าสุด: {formatDate(post.pub_date)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Links */}
      <div className="w-full max-w-4xl mt-8">
        <div className="bg-white/90 rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-[#01385f] mb-4">ลิงก์ที่เกี่ยวข้อง</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/egp"
              className="text-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="text-blue-600 text-2xl mb-2">📋</div>
              <div className="font-semibold text-blue-800">ประกาศทั้งหมด</div>
            </Link>
            <Link
              href="/"
              className="text-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="text-green-600 text-2xl mb-2">🏠</div>
              <div className="font-semibold text-green-800">หน้าหลัก</div>
            </Link>
            <a
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <div className="text-purple-600 text-2xl mb-2">🔗</div>
              <div className="font-semibold text-purple-800">เอกสารต้นฉบับ</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}