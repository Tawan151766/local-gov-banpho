"use client";
import React, { useState, useEffect } from "react";

export default function ActivitySection() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        "/api/post-details?page=1&limit=6&postTypeId=2&withMedia=true",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setActivities(data.data || []);
      } else {
        throw new Error(data.error || "Failed to fetch activities");
      }
    } catch (err) {
      console.error("Error fetching activities:", err);
      setError(err.message);
      // Set empty array as fallback
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "ไม่ระบุวันที่";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "ไม่ระบุวันที่";
    }
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return "ไม่มีรายละเอียด";
    // Remove HTML tags before truncating
    const plainText = text.replace(/<[^>]+>/g, "");
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + "...";
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/image/Boat.jpg"; // Default image
    if (imagePath.startsWith("http")) return imagePath;
    return imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  };

  if (loading) {
    return (
      <section
        className="py-16 px-4"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(239, 228, 212, 0.6) 0%, rgba(1, 189, 204, 0.6) 100%),
          url("image/Boat.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="relative text-center mb-12">
          <div className="text-[32px] font-semibold text-[#394D1C] inline-block">
            กิจกรรม
          </div>
          <img
            src="image/leaf.png"
            alt="Leaf"
            className="absolute w-[240px] h-auto left-[48%] -translate-x-1/2 top-[-61px] pointer-events-none"
          />
        </div>

        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="w-full sm:w-[340px] md:w-[360px] lg:w-[383px] h-[340px] sm:h-[380px] md:h-[410px] lg:h-[426px] bg-white rounded-2xl sm:rounded-3xl shadow-md overflow-hidden animate-pulse"
              >
                <div className="w-full h-[180px] sm:h-[220px] md:h-[240px] lg:h-[260px] bg-gray-300"></div>
                <div className="p-2 sm:p-4 h-[120px] sm:h-[140px] md:h-[160px] lg:h-[166px]">
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className="py-16 px-4"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(239, 228, 212, 0.6) 0%, rgba(1, 189, 204, 0.6) 100%),
          url("image/Boat.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="relative text-center mb-12">
          <div className="text-[32px] font-semibold text-[#394D1C] inline-block">
            กิจกรรม
          </div>
          <img
            src="image/leaf.png"
            alt="Leaf"
            className="absolute w-[240px] h-auto left-[48%] -translate-x-1/2 top-[-61px] pointer-events-none"
          />
        </div>

        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6">
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">
              เกิดข้อผิดพลาดในการโหลดข้อมูลกิจกรรม
            </p>
            <button
              onClick={fetchActivities}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ลองใหม่
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-16 px-4"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(239, 228, 212, 0.6) 0%, rgba(1, 189, 204, 0.6) 100%),
        url("image/Boat.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="relative text-center mb-12">
        <div className="text-[32px] font-semibold text-[#394D1C] inline-block">
          กิจกรรม
        </div>
        <img
          src="image/leaf.png"
          alt="Leaf"
          className="absolute w-[240px] h-auto left-[48%] -translate-x-1/2 -top-[61px] pointer-events-none"
        />
      </div>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6">
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">ไม่มีข้อมูลกิจกรรมในขณะนี้</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {activities.map((activity) => (
              <a
                href={`/activities/${activity.id || activity._id}`}
                key={activity.id || activity._id}
                className="group block w-full sm:w-[340px] md:w-[360px] lg:w-[383px] h-[340px] sm:h-[380px] md:h-[410px] lg:h-[426px] bg-white rounded-2xl sm:rounded-3xl shadow-md overflow-hidden hover:shadow-lg hover:bg-[#FFFF92] transition-shadow duration-300"
              >
                <div className="w-full h-[180px] sm:h-[220px] md:h-[240px] lg:h-[260px]">
                  <img
                    src={getImageUrl(activity.image || activity.featured_image)}
                    alt={activity.title || "กิจกรรม"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "/image/Boat.jpg";
                    }}
                  />
                </div>
                <div className="p-2 sm:p-4 h-[120px] sm:h-[140px] md:h-[160px] lg:h-[166px] flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1 sm:mb-2">
                      <h4 className="text-base sm:text-lg md:text-xl lg:text-[20px] font-semibold text-[#1E1E1E] line-clamp-1">
                        {activity.topic_name || "ไม่มีหัวข้อ"}
                      </h4>
                      <p className="text-sm sm:text-base md:text-lg lg:text-[16px] text-gray-500 ml-2 sm:ml-4 whitespace-nowrap">
                        {formatDate(activity.created_at || "ไม่ระบุวันที่")}
                      </p>
                    </div>
                    <p className="text-sm sm:text-base md:text-lg lg:text-[18px] text-gray-600 mb-2 sm:mb-3 line-clamp-2">
                      {truncateText(
                        activity.details || "ไม่มีรายละเอียดเพิ่มเติม"
                      )}
                    </p>
                  </div>
                  <span className="text-base sm:text-lg md:text-xl lg:text-[20px] text-[#1E1E1E] hover:text-blue-800 transition-colors duration-200">
                    อ่านต่อ
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
        <button
          onClick={() => (window.location.href = "/activities")}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          ดูทั้งหมด
        </button>
      </div>
    </section>
  );
}
