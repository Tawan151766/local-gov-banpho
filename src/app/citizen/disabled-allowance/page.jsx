"use client";
import React from "react";

export default function DisabledAllowancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 flex flex-col items-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-green-600 rounded-full mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-3-3h-4a3 3 0 00-3 3v2h5zm-6 0h5v-2a3 3 0 00-3-3h-4a3 3 0 00-3 3v2h5zm-6 0h5v-2a3 3 0 00-3-3H4a3 3 0 00-3 3v2h5z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">ข้อมูลเบี้ยยังชีพผู้พิการ</h1>
          <p className="text-lg text-gray-600 mb-6 text-center">รายละเอียดและขั้นตอนการขอรับเบี้ยยังชีพสำหรับขอรับเงินเบี้ยความพิการ ในเทศบาลตำบลบ้านโพธิ์</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-green-600 mx-auto mb-8 rounded"></div>
          <div className="w-full bg-gray-100 rounded-xl shadow p-4">
            <iframe
              src="/pdf/5045336242.pdf"
              title="PDF Viewer"
              width="100%"
              height="600px"
              style={{ border: "none", borderRadius: "8px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
