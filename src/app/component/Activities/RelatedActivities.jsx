"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function RelatedActivities({ currentActivityId, limit = 3 }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRelatedActivities();
  }, [currentActivityId]);

  const fetchRelatedActivities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts?type=กิจกรรม&limit=${limit + 1}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // ใช้ data.data และ fallback เป็น array
          const activitiesArr = Array.isArray(data.data) ? data.data : [];
          const filtered = activitiesArr
            .filter(activity => activity.id !== parseInt(currentActivityId))
            .slice(0, limit);
          setActivities(filtered);
        }
      }
    } catch (error) {
      console.error('Error fetching related activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'ไม่ระบุวันที่';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'ไม่ระบุวันที่';
    }
  };

  const truncateText = (text, maxLength = 80) => {
    if (!text) return 'ไม่มีรายละเอียด';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/image/Boat.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse"
          >
            <div className="w-full h-48 bg-gray-300"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center text-white/60 py-8">
        <p>ไม่มีกิจกรรมที่เกี่ยวข้อง</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {activities.map((activity) => (
        <Link
          href={`/activities/${activity.id}`}
          key={activity.id}
          className="group block bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg hover:bg-[#FFFF92] transition-all duration-300"
        >
          <div className="w-full h-48">
            <img
              src={getImageUrl(activity.image || activity.featured_image)}
              alt={activity.title || 'กิจกรรม'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.src = '/image/Boat.jpg';
              }}
            />
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-lg font-semibold text-[#1E1E1E] line-clamp-1 group-hover:text-[#394D1C] transition-colors">
                {activity.title || 'ไม่มีหัวข้อ'}
              </h4>
              <span className="text-sm text-gray-500 ml-2 whitespace-nowrap">
                {formatDate(activity.created_at || activity.date)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {truncateText(activity.content || activity.description || activity.excerpt)}
            </p>
            <span className="text-sm text-[#0383AA] group-hover:text-[#394D1C] transition-colors font-medium">
              อ่านต่อ →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}