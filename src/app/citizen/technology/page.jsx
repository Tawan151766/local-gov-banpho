"use client";
import React from "react";

export default function TechnologyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 flex flex-col items-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-green-600 rounded-full mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            ระบบสารสนเทศตำบลบ้านโพธิ์
          </h1>
          <p className="text-lg text-gray-600 mb-6 text-center">
            ระบบสารสนเทศตำบลบ้านโพธิ์ เป็นแพลตฟอร์มกลางสำหรับการรวบรวม จัดการ และเผยแพร่ข้อมูลสำคัญของเทศบาลตำบลบ้านโพธิ์<br />
            เพื่อให้ประชาชนและเจ้าหน้าที่สามารถเข้าถึงข้อมูลได้สะดวก รวดเร็ว และโปร่งใส เช่น ข้อมูลบริการภาครัฐ เอกสารดาวน์โหลด ข่าวสาร และคู่มือประชาชน
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-green-600 mx-auto mb-8 rounded"></div>
          <div className="w-full bg-gray-100 rounded-xl shadow p-4">
            {/* หากมีไฟล์ PDF ที่เกี่ยวข้อง สามารถแสดงได้ที่นี่ */}
            <iframe
              // src="/pdf/20210505151000File.pdf"
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
