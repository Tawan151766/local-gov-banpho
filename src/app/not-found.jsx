"use client";
import React from "react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 py-10">
      <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-400 to-yellow-400 rounded-full mb-6 shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">ไม่พบหน้าที่คุณต้องการ</h1>
        <p className="text-lg text-gray-600 mb-6 text-center">ขออภัย ไม่พบหน้าหรือเนื้อหาที่คุณร้องขอ กรุณาตรวจสอบ URL หรือกลับไปยังหน้าหลัก</p>
        <a href="/" className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-lg font-medium shadow hover:from-blue-700 hover:to-green-700 transition-all">กลับหน้าหลัก</a>
      </div>
    </div>
  );
}
