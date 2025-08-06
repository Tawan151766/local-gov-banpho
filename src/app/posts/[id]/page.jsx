"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = params.id;
  const egpId = searchParams.get("egp_id");
  const postType = searchParams.get("type");

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (postId) {
      fetchPostDetail();
    }
  }, [postId]);

  const fetchPostDetail = async (retry = false) => {
    try {
      setLoading(true);
      setError(null);

      let apiUrl = "";
      let postData = null;

      // Check if this is an EGP post
      if (postType === "egp" && egpId) {
        // Fetch from EGP API
        const response = await fetch(`/api/egp-proxy/${egpId}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          cache: "no-cache",
        });

        if (!response.ok) {
          throw new Error(`EGP API error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data && Array.isArray(result.data)) {
          // Find the specific post by ID
          postData = result.data.find(item => 
            item.id?.toString() === postId || 
            item.deptsub_id?.toString() === postId
          );

          if (!postData) {
            throw new Error("EGP post not found");
          }
        } else {
          throw new Error("Invalid EGP API response");
        }
      } else {
        // Try to fetch from the regular posts API
        const response = await fetch(`/api/posts/${postId}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          cache: "no-cache",
        });

        if (!response.ok) {
          throw new Error(`Posts API error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data) {
          postData = result.data;
        } else {
          throw new Error("Post not found");
        }
      }

      if (postData) {
        // Transform the data to match expected format
        const transformedPost = {
          deptsub_id: (postData.id || postData.deptsub_id || postId).toString(),
          announce_type: getAnnounceType(postData.type_name),
          title: postData.title_name || postData.title,
          pub_date: formatApiDate(postData.date || postData.pub_date),
          details: postData.details || postData.description,
          link: postData.link,
          original_type: postData.type_name,
          topic_name: postData.topic_name,
          photos: postData.photos || [],
          videos: postData.videos || [],
          pdfs: postData.pdfs || [],
          isEgpPost: postType === "egp" // Flag to identify EGP posts
        };

        setPost(transformedPost);
        setRetryCount(0);
      } else {
        throw new Error("Post data not found");
      }
    } catch (error) {
      console.error("Error fetching post detail:", error);
      setError(error.message);

      // Retry logic - try up to 2 times
      if (!retry && retryCount < 2) {
        setRetryCount((prev) => prev + 1);
        setTimeout(() => fetchPostDetail(true), 2000);
        return;
      }

      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  const getAnnounceType = (typeName) => {
    if (!typeName) return "W0";

    if (typeName.includes("ประกาศจัดซื้อจัดจ้าง")) return "P0";
    if (typeName.includes("ผลประกาศจัดซื้อจัดจ้าง")) return "D0";
    if (typeName.includes("รายงานผลการจัดซื้อจัดจ้าง")) return "W0";
    if (typeName.includes("ประกาศราคากลาง")) return "M0";
    if (typeName.includes("EGP")) return "15";

    return "P0";
  };

  const formatApiDate = (dateString) => {
    if (!dateString) return new Date().toISOString().split("T")[0];
    return new Date(dateString).toISOString().split("T")[0];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "ไม่ระบุวันที่";

    const date = new Date(dateString);
    const thaiMonths = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
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

  const handleGoBack = () => {
    // If this is an EGP post, go back to EGP posts page
    if (postType === "egp") {
      router.push("/posts?type=ประกาศ EGP");
    } else {
      router.back();
    }
  };

  const handleExternalLink = () => {
    if (post?.link) {
      window.open(post.link, "_blank");
    }
  };

  if (loading) {
    return (
      <div
        className="w-full min-h-screen py-8 px-2 md:px-8"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(239, 228, 212, 0.6) 0%, rgba(1, 189, 204, 0.6) 100%), url("/image/Boat.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="w-full max-w-[1000px] mx-auto">
          {/* Loading Skeleton */}
          <div className="bg-white rounded-[29px] border-4 border-[#01bdcc] shadow-lg p-8 animate-pulse">
            <div className="flex items-center justify-between mb-6">
              <div className="h-8 bg-gray-300 rounded w-32"></div>
              <div className="h-10 bg-gray-300 rounded w-40"></div>
            </div>
            <div className="h-12 bg-gray-300 rounded w-full mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-gray-300 rounded w-1/2 mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div
        className="w-full min-h-screen py-8 px-2 md:px-8"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(239, 228, 212, 0.6) 0%, rgba(1, 189, 204, 0.6) 100%), url("/image/Boat.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="w-full max-w-[1000px] mx-auto">
          <div className="bg-white rounded-[29px] border-4 border-[#01bdcc] shadow-lg p-8 text-center">
            <div className="text-red-500 text-xl mb-4">
              ไม่พบข้อมูลประกาศ
            </div>
            <div className="text-gray-500 text-base mb-6">
              {error || "ประกาศที่คุณค้นหาไม่พบในระบบ"}
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleGoBack}
                className="bg-[#01385f] text-white px-6 py-3 rounded-lg hover:bg-[#01385f]/90 transition-colors duration-200"
              >
                กลับหน้าก่อนหน้า
              </button>
              <button
                onClick={() => fetchPostDetail()}
                className="bg-[#01bdcc] text-white px-6 py-3 rounded-lg hover:bg-[#01a5b0] transition-colors duration-200"
              >
                ลองใหม่อีกครั้ง
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-screen py-8 px-2 md:px-8"
      style={{
        backgroundImage:
          'linear-gradient(180deg, rgba(239, 228, 212, 0.6) 0%, rgba(1, 189, 204, 0.6) 100%), url("/image/Boat.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-[1000px] mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={handleGoBack}
            className="bg-white text-[#01385f] px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            กลับ
          </button>
        </div>

        {/* Post Detail Card */}
        <div className="bg-white rounded-[29px] border-4 border-[#01bdcc] shadow-lg p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-[#01385f] font-semibold text-lg">
                {formatDate(post.pub_date)}
              </span>
             
            </div>
            <span
              className="rounded-full px-6 py-2 text-white text-base font-medium shadow-sm self-start md:self-center"
              style={{
                backgroundColor: getPostTypeColor(post.announce_type),
              }}
            >
              {getPostTypeName(post.announce_type)}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-[#01385f] mb-4 leading-relaxed">
            {post.title}
          </h1>

          {/* Topic Name */}
          {post.topic_name && (
            <h2 className="text-xl font-semibold text-[#1e1e1e] mb-6">
              {post.topic_name}
            </h2>
          )}

          {/* Content */}
          {post.details && (
            <div className="mb-8">
              <div className="text-[#1e1e1e] text-base leading-relaxed whitespace-pre-wrap">
                {post.details}
              </div>
            </div>
          )}

          {/* Media Sections */}
          {post.photos && post.photos.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-[#01385f] mb-4">
                รูปภาพ ({post.photos.length} รูป)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {post.photos.map((photo, index) => (
                  <div
                    key={photo.id || index}
                    className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200"
                  >
                    <img
                      src={`https://banpho.sosmartsolution.com/storage/${photo.post_photo_file}`}
                      alt={`รูปภาพ ${index + 1}`}
                      className="w-full h-48 object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                      onClick={() => window.open(`https://banpho.sosmartsolution.com/storage/${photo.post_photo_file}`, '_blank')}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {post.videos && post.videos.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-[#01385f] mb-4">
                วิดีโอ ({post.videos.length} ไฟล์)
              </h3>
              <div className="space-y-3">
                {post.videos.map((video, index) => (
                  <div
                    key={video.id || index}
                    className="bg-gray-50 rounded-lg p-4 flex items-center gap-3 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <svg
                      className="w-8 h-8 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <div className="flex-1">
                      <p className="font-medium text-[#01385f]">วิดีโอ {index + 1}</p>
                    </div>
                    <a
                      href={`https://banpho.sosmartsolution.com/storage/${video.post_video_file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#01bdcc] text-white px-4 py-2 rounded-lg hover:bg-[#01a5b0] transition-colors duration-200"
                    >
                      ดูวิดีโอ
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {post.pdfs && post.pdfs.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-[#01385f] mb-4">
                เอกสาร PDF ({post.pdfs.length} ไฟล์)
              </h3>
              <div className="space-y-3">
                {post.pdfs.map((pdf, index) => (
                  <div
                    key={pdf.id || index}
                    className="bg-gray-50 rounded-lg p-4 flex items-center gap-3 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <svg
                      className="w-8 h-8 text-orange-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    </svg>
                    <div className="flex-1">
                      <p className="font-medium text-[#01385f]">เอกสาร PDF {index + 1}</p>
                    </div>
                    <a
                      href={`https://banpho.sosmartsolution.com/storage/${pdf.post_pdf_file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#01bdcc] text-white px-4 py-2 rounded-lg hover:bg-[#01a5b0] transition-colors duration-200"
                    >
                      ดาวน์โหลด
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            {post.link && (
              <button
                onClick={handleExternalLink}
                className="bg-[#01bdcc] text-white px-6 py-3 rounded-lg hover:bg-[#01a5b0] transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                ดูข้อมูลเพิ่มเติม
              </button>
            )}
            
            <button
              onClick={() => window.print()}
              className="bg-white text-[#01385f] border-2 border-[#01385f] px-6 py-3 rounded-lg hover:bg-[#01385f] hover:text-white transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              พิมพ์เอกสาร
            </button>
          </div>

          {/* Post Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-2 text-sm text-gray-500">
              <span className="bg-gray-100 px-3 py-1 rounded-full">
                รหัส: {post.announce_type}
              </span>
              {post.original_type && (
                <span className="bg-gray-100 px-3 py-1 rounded-full">
                  ประเภท: {post.original_type}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}