"use client";
import React from "react";
import Link from "next/link";
import RelatedActivities from "./RelatedActivities";

export default function ActivityDetail({ activity, loading, error, onRetry }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'ไม่ระบุวันที่';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      });
    } catch (error) {
      return 'ไม่ระบุวันที่';
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/image/Boat.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  };

  if (loading) {
    return (
      <div
        className="min-h-screen py-16 px-4"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(239, 228, 212, 0.6) 0%, rgba(1, 189, 204, 0.6) 100%),
          url("/image/Boat.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb Skeleton */}
          <div className="mb-8">
            <div className="h-4 bg-white/50 rounded w-64 animate-pulse"></div>
          </div>

          {/* Content Skeleton */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-pulse">
            <div className="w-full h-96 bg-gray-300"></div>
            <div className="p-8">
              <div className="h-8 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 rounded mb-6 w-48"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen py-16 px-4"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(239, 228, 212, 0.6) 0%, rgba(1, 189, 204, 0.6) 100%),
          url("/image/Boat.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">เกิดข้อผิดพลาด</h2>
            <p className="text-gray-600 mb-6">ไม่สามารถโหลดข้อมูลกิจกรรมได้</p>
            <div className="space-x-4">
              <button 
                onClick={onRetry}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                ลองใหม่
              </button>
              <Link 
                href="/"
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors inline-block"
              >
                กลับหน้าหลัก
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div
        className="min-h-screen py-16 px-4"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(239, 228, 212, 0.6) 0%, rgba(1, 189, 204, 0.6) 100%),
          url("/image/Boat.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📄</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">ไม่พบข้อมูล</h2>
            <p className="text-gray-600 mb-6">ไม่พบกิจกรรมที่คุณต้องการ</p>
            <Link 
              href="/"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              กลับหน้าหลัก
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-16 px-4"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(239, 228, 212, 0.6) 0%, rgba(1, 189, 204, 0.6) 100%),
        url("/image/Boat.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-white">
            <Link href="/" className="hover:text-yellow-300 transition-colors">
              หน้าหลัก
            </Link>
            <span>›</span>
            <Link href="/#activities" className="hover:text-yellow-300 transition-colors">
              กิจกรรม
            </Link>
            <span>›</span>
            <span className="text-yellow-300 font-medium">
              {activity.title || 'รายละเอียดกิจกรรม'}
            </span>
          </div>
        </nav>

        {/* Main Content */}
        <article className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          {/* Featured Image */}
          <div className="w-full h-96 relative overflow-hidden">
            <img
              src={getImageUrl(activity.image || activity.featured_image)}
              alt={activity.title || 'กิจกรรม'}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.src = '/image/Boat.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>

          {/* Content */}
          <div className="p-8 lg:p-12">
            {/* Header */}
            <header className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-[#394D1C] mb-4 leading-tight">
                {activity.title || 'ไม่มีหัวข้อ'}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-lg">
                    {formatDate(activity.created_at || activity.date)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {activity.type || 'กิจกรรม'}
                  </span>
                </div>
              </div>
            </header>

            {/* Decorative Element */}
            <div className="relative mb-8">
              <img
                src="/image/leaf.png"
                alt="Leaf"
                className="w-32 h-auto mx-auto opacity-20"
              />
            </div>

            {/* Content Body */}
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed text-lg space-y-6">
                {activity.content ? (
                  activity.content.split('\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    )
                  ))
                ) : (
                  <p>ไม่มีรายละเอียดเพิ่มเติม</p>
                )}
              </div>
            </div>

            {/* Additional Info */}
            {(activity.location || activity.organizer) && (
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl">
                <h3 className="text-xl font-semibold text-[#394D1C] mb-4">ข้อมูลเพิ่มเติม</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activity.location && (
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <span className="text-sm text-gray-600">สถานที่:</span>
                        <p className="font-medium">{activity.location}</p>
                      </div>
                    </div>
                  )}
                  
                  {activity.organizer && (
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <div>
                        <span className="text-sm text-gray-600">ผู้จัด:</span>
                        <p className="font-medium">{activity.organizer}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-12 flex flex-wrap gap-4 justify-center">
              <Link 
                href="/#activities"
                className="px-8 py-3 bg-gradient-to-r from-[#0383AA] to-[#05C5FF] text-white rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium"
              >
                ดูกิจกรรมอื่นๆ
              </Link>
              
              <button 
                onClick={() => window.history.back()}
                className="px-8 py-3 bg-white border-2 border-[#0383AA] text-[#0383AA] rounded-full hover:bg-[#0383AA] hover:text-white transition-all duration-300 font-medium"
              >
                ย้อนกลับ
              </button>
            </div>
          </div>
        </article>

        {/* Related Activities Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">กิจกรรมที่เกี่ยวข้อง</h2>
            <p className="text-white/80">กิจกรรมอื่นๆ ที่น่าสนใจ</p>
          </div>
          
          <RelatedActivities currentActivityId={activity.id} limit={3} />
        </div>
      </div>
    </div>
  );
}