import React, { useState, useEffect } from "react";
import { postDetailsAPI, postTypesAPI } from "@/lib/api";
import Link from "next/link";

export default function AnnouncementSections() {
  const [current, setCurrent] = useState(0);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Auto-slide functionality with pause support
  useEffect(() => {
    if (announcements.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev === announcements.length - 1 ? 0 : prev + 1));
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [announcements.length, isPaused]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      // If modal is open, handle modal-specific keys
      if (showDetailModal) {
        if (event.key === "Escape") {
          event.preventDefault();
          handleCloseDetail();
        }
        return;
      }

      // Regular slider navigation
      if (announcements.length <= 1) return;

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          handlePrev();
          break;
        case "ArrowRight":
          event.preventDefault();
          handleNext();
          break;
        case " ": // Spacebar to pause/resume
          event.preventDefault();
          setIsPaused((prev) => !prev);
          break;
        case "Enter": // Enter to show detail
          event.preventDefault();
          handleShowDetail();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [announcements.length, showDetailModal]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);

      // First, get the post type ID for "ข่าวประชาสัมพันธ์"
      const postTypesResponse = await postTypesAPI.getPostTypes({
        limit: 100,
        search: "ข่าวประชาสัมพันธ์",
      });

      if (postTypesResponse.success && postTypesResponse.data.length > 0) {
        const announcementTypeId = postTypesResponse.data.find(
          (type) => type.type_name === "ข่าวประชาสัมพันธ์"
        )?.id;

        if (announcementTypeId) {
          // Get posts with this type
          const postsResponse = await postDetailsAPI.getPostDetails({
            postTypeId: announcementTypeId,
            withMedia: true,
            limit: 10,
          });

          if (postsResponse.success) {
            // Use all posts, not just those with photos
            setAnnouncements(postsResponse.data);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent((prev) => (prev === 0 ? announcements.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent((prev) => (prev === announcements.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleDotClick = (index) => {
    if (isTransitioning || index === current) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleShowDetail = () => {
    setSelectedPost(announcements[current]);
    setShowDetailModal(true);
    setIsPaused(true); // Pause auto-slide when modal is open
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedPost(null);
    setIsPaused(false); // Resume auto-slide when modal is closed
  };

  // Show loading or fallback if no announcements
  if (loading) {
    return (
      <div className="relative w-screen h-screen flex items-center justify-center bg-gradient-to-b from-[#A8F9FF] to-[#E8DDC4]">
        <div className="text-[#01385F] text-xl">
          กำลังโหลดข่าวประชาสัมพันธ์...
        </div>
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="relative w-screen h-screen flex items-center justify-center bg-gradient-to-b from-[#A8F9FF] to-[#E8DDC4]">
        <div className="text-[#01385F] text-xl">ไม่มีข่าวประชาสัมพันธ์</div>
      </div>
    );
  }
  return (
    <div
      className="relative w-screen h-screen shadow-[0_18.4px_18.4px_rgba(0,0,0,0.49)] overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(239, 228, 212, 0.6) 0%, rgba(1, 189, 204, 0.6) 100%),
        url("image/vision_bg.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Fallback Background - เผื่อภาพไม่โหลด */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#A8F9FF] to-[#E8DDC4] -z-10" />

      {/* Decorative Header */}
      <div className="relative w-full flex flex-col items-center">
        <img
          src="/image/headerAnnouncement.png"
          alt="header announcement"
          className="w-full  object-cover"
          style={{ minHeight: "60px" }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl flex flex-col items-center pt-2">
          <div className="text-[#01385F] text-lg sm:text-2xl font-bold text-center">
            ป้ายประกาศ
          </div>
          <div className="text-[#01385F] text-xs sm:text-base text-center">
            เทศบาลตำบลบ้านโพธิ์
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center px-2 sm:px-4 md:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex w-full max-w-2xl justify-between items-center mb-6 mt-8">
          <div className="text-[#01385F] text-xl sm:text-2xl lg:text-3xl font-bold w-full text-left">
            ข่าวประชาสัมพันธ์
          </div>
          <Link href="/posts">
            <button className="bg-[#01385f] text-white rounded-[12.5px] px-4 py-2 text-sm shadow-md hover:bg-[#01385f]/90 transition-colors duration-200 whitespace-nowrap ml-4">
              เพิ่มเติม
            </button>
          </Link>
        </div>

        {/* Image Slider with prev/next buttons outside */}
        <div
          className="flex w-full max-w-5xl items-center justify-center gap-2 sm:gap-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Prev Button - left side outside image, responsive size */}
          <button
            onClick={handlePrev}
            disabled={isTransitioning || announcements.length <= 1}
            className={`text-[#01385F] hover:text-[#01385f] focus:outline-none transition-all duration-200 p-1 sm:p-2 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 ${
              isTransitioning || announcements.length <= 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-white/20"
            }`}
            aria-label="Previous image"
          >
            <svg width="28" height="28" className="sm:w-8 sm:h-8" fill="none">
              <path
                d="M21 8l-8 8 8 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div
            className={`relative flex-1 aspect-[2.2/1] sm:aspect-[2.5/1] border-2 sm:border-4 md:border-6 border-solid border-white rounded-[12px] sm:rounded-[20px] md:rounded-[29px] shadow-[0_2px_4px_rgba(0,0,0,0.18)] sm:shadow-[0_4px_4px_rgba(0,0,0,0.25)] bg-white flex items-center justify-center overflow-hidden min-h-[120px] sm:min-h-[180px] md:min-h-[240px] transition-all duration-300 cursor-pointer hover:shadow-lg ${
              isTransitioning ? "scale-[0.98]" : "scale-100"
            }`}
            onClick={handleShowDetail}
          >
            {announcements[current]?.photos?.[0] ? (
              <img
                src={`https://banpho.sosmartsolution.com/storage/${announcements[current].photos[0].post_photo_file}`}
                alt={
                  announcements[current].title_name || `ประกาศ ${current + 1}`
                }
                className={`w-full h-full object-cover rounded-[10px] sm:rounded-[16px] md:rounded-[25px] transition-all duration-500 ${
                  isTransitioning
                    ? "opacity-80 scale-105"
                    : "opacity-100 scale-100"
                }`}
                style={{ minHeight: "100px", maxHeight: "400px" }}
              />
            ) : (
              <div
                className={`w-full h-full bg-gradient-to-br from-[#01385F] to-[#01BDCC] flex flex-col items-center justify-center rounded-[10px] sm:rounded-[16px] md:rounded-[25px] p-4 transition-all duration-500 ${
                  isTransitioning
                    ? "opacity-80 scale-105"
                    : "opacity-100 scale-100"
                }`}
              >
                {/* Icon based on content type */}
                <div className="text-white/80 mb-2">
                  {announcements[current]?.pdfs?.length > 0 ? (
                    <svg
                      className="w-12 h-12 sm:w-16 sm:h-16"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : announcements[current]?.videos?.length > 0 ? (
                    <svg
                      className="w-12 h-12 sm:w-16 sm:h-16"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-12 h-12 sm:w-16 sm:h-16"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="text-white text-center">
                  <div className="text-sm sm:text-base font-semibold mb-1">
                    {announcements[current]?.pdfs?.length > 0
                      ? "เอกสาร PDF"
                      : announcements[current]?.videos?.length > 0
                      ? "วิดีโอ"
                      : "ประกาศ"}
                  </div>
                  <div className="text-xs sm:text-sm text-white/80">
                    คลิกเพื่อดูรายละเอียด
                  </div>
                </div>
              </div>
            )}

            {/* Overlay with post info */}
            <div
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 sm:p-4 rounded-b-[10px] sm:rounded-b-[16px] md:rounded-b-[25px] transition-all duration-500 ${
                isTransitioning
                  ? "opacity-80 translate-y-1"
                  : "opacity-100 translate-y-0"
              }`}
            >
              <h3 className="text-white text-sm sm:text-base font-bold mb-1 line-clamp-2">
                {announcements[current]?.title_name}
              </h3>
              {announcements[current]?.topic_name && (
                <p className="text-white/90 text-xs sm:text-sm line-clamp-1">
                  {announcements[current].topic_name}
                </p>
              )}
              {announcements[current]?.date && (
                <p className="text-white/80 text-xs mt-1">
                  {new Date(announcements[current].date).toLocaleDateString(
                    "th-TH"
                  )}
                </p>
              )}
            </div>

            {/* Auto-slide indicator */}
            {!isPaused && announcements.length > 1 && (
              <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            )}

            {/* Pause indicator */}
            {isPaused && announcements.length > 1 && (
              <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              </div>
            )}
          </div>
          {/* Next Button - right side outside image, responsive size */}
          <button
            onClick={handleNext}
            disabled={isTransitioning || announcements.length <= 1}
            className={`text-[#01385F] hover:text-[#01385f] focus:outline-none transition-all duration-200 p-1 sm:p-2 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 ${
              isTransitioning || announcements.length <= 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-white/20"
            }`}
            aria-label="Next image"
          >
            <svg width="28" height="28" className="sm:w-8 sm:h-8" fill="none">
              <path
                d="M11 8l8 8-8 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Dots */}
        {announcements.length > 1 && (
          <div className="flex flex-col items-center gap-2 mt-4">
            <div className="flex justify-center gap-2">
              {announcements.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  disabled={isTransitioning}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 transform hover:scale-125 ${
                    index === current
                      ? "bg-[#01385F] shadow-lg"
                      : isTransitioning
                      ? "bg-[#01385F]/20 cursor-not-allowed"
                      : "bg-[#01385F]/30 hover:bg-[#01385F]/50 shadow-md"
                  }`}
                  aria-label={`ไปยังข่าว ${index + 1}`}
                />
              ))}
            </div>
            <div className="text-[#01385F]/60 text-xs">
              {current + 1} / {announcements.length}
            </div>
          </div>
        )}

        {/* Post Details for non-image posts */}
        {announcements[current] && !announcements[current]?.photos?.[0] && (
          <div className="w-full max-w-2xl mt-4 p-4 bg-white/90 rounded-lg shadow-md">
            <h3 className="text-[#01385F] text-sm sm:text-base font-bold mb-2 line-clamp-2">
              {announcements[current].title_name}
            </h3>
            {announcements[current].topic_name && (
              <p className="text-[#01385F]/80 text-xs sm:text-sm mb-2 line-clamp-1">
                {announcements[current].topic_name}
              </p>
            )}
            {announcements[current].details && (
              <div
                className="text-[#01385F]/70 text-xs sm:text-sm line-clamp-3"
                dangerouslySetInnerHTML={{
                  __html: announcements[current].details.replace(
                    /<[^>]*>/g,
                    ""
                  ),
                }}
              />
            )}
            <div className="flex justify-between items-center mt-3">
              <div className="text-[#01385F]/60 text-xs">
                {announcements[current].date &&
                  new Date(announcements[current].date).toLocaleDateString(
                    "th-TH"
                  )}
              </div>
              <div className="flex gap-2">
                {announcements[current].pdfs?.length > 0 && (
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">
                    PDF {announcements[current].pdfs.length}
                  </span>
                )}
                {announcements[current].videos?.length > 0 && (
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                    วิดีโอ {announcements[current].videos.length}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Controls Info */}
        {announcements.length > 1 && (
          <div className="text-center mt-2 text-[#01385F]/60 text-xs">
            <p>ใช้ลูกศรซ้าย/ขวา, spacebar, หรือ Enter เพื่อควบคุม</p>
            <p>วางเมาส์เพื่อหยุดชั่วคราว • คลิกหรือ Enter เพื่อดูรายละเอียด</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm">
                  {selectedPost.type_name}
                </span>
                {selectedPost.date && (
                  <span className="text-gray-500 text-sm">
                    {new Date(selectedPost.date).toLocaleDateString("th-TH")}
                  </span>
                )}
              </div>
              <button
                onClick={handleCloseDetail}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {selectedPost.title_name}
              </h1>

              {/* Topic Name */}
              {selectedPost.topic_name && (
                <h2 className="text-lg text-gray-700 mb-4">
                  {selectedPost.topic_name}
                </h2>
              )}

              {/* Images */}
              {selectedPost.photos && selectedPost.photos.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">รูปภาพ</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedPost.photos.map((photo, index) => (
                      <img
                        key={photo.id}
                        src={`https://banpho.sosmartsolution.com/storage/${photo.post_photo_file}`}
                        alt={`รูปภาพ ${index + 1}`}
                        className="w-full h-64 object-cover rounded-lg shadow-md"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Details */}
              {selectedPost.details && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">รายละเอียด</h3>
                  <div
                    className="prose max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: selectedPost.details }}
                  />
                </div>
              )}

              {/* Videos */}
              {selectedPost.videos && selectedPost.videos.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">
                    วิดีโอ ({selectedPost.videos.length})
                  </h3>
                  <div className="space-y-2">
                    {selectedPost.videos.map((video, index) => (
                      <div
                        key={video.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <svg
                          className="w-6 h-6 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <a
                          href={`https://banpho.sosmartsolution.com/storage/${video.post_video_file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex-1"
                        >
                          วิดีโอ {index + 1}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PDFs */}
              {selectedPost.pdfs && selectedPost.pdfs.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">
                    เอกสาร PDF ({selectedPost.pdfs.length})
                  </h3>
                  <div className="space-y-2">
                    {selectedPost.pdfs.map((pdf, index) => (
                      <div
                        key={pdf.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <svg
                          className="w-6 h-6 text-orange-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <a
                          href={`https://banpho.sosmartsolution.com/storage/${pdf.post_pdf_file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex-1"
                        >
                          เอกสาร PDF {index + 1}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-between items-center">
              <Link href="/posts">
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  ดูข่าวสารทั้งหมด →
                </button>
              </Link>
              <button
                onClick={handleCloseDetail}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

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
