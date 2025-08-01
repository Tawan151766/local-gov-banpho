"use client";
import React from "react";

export default function LocalDevelopmentPlanPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-[#0383AA] mb-4 text-center">
            แผนพัฒนาท้องถิ่น
          </h1>
          <h2 className="text-xl text-gray-700 text-center mb-2">
            Local Development Plan
          </h2>
        </div>

        {/* Coming Soon Content */}
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#0383AA] to-[#01bdcc] rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h2 className="text-4xl font-bold text-[#0383AA] mb-4">
              Coming Soon
            </h2>
            
            <h3 className="text-2xl font-semibold text-gray-700 mb-6">
              กำลังเตรียมข้อมูล
            </h3>
            
            <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              เรากำลังจัดเตรียมข้อมูลแผนพัฒนาท้องถิ่นของเทศบาลตำบลบ้านโพธิ์ 
              เพื่อให้ประชาชนสามารถเข้าถึงและติดตามการพัฒนาท้องถิ่นได้อย่างสะดวก
            </p>
          </div>

          {/* Features Preview */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-[#0383AA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">แผนพัฒนา 5 ปี</h4>
              <p className="text-sm text-gray-600">แผนยุทธศาสตร์การพัฒนาท้องถิ่นระยะยาว</p>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-9 0v10a2 2 0 002 2h8a2 2 0 002-2V7H7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">แผนดำเนินงาน</h4>
              <p className="text-sm text-gray-600">แผนการดำเนินงานประจำปี</p>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">รายงานผล</h4>
              <p className="text-sm text-gray-600">รายงานการติดตามและประเมินผล</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h4 className="font-semibold text-[#0383AA] mb-3">
              ติดต่อสอบถามข้อมูลเพิ่มเติม
            </h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <p className="font-medium">กองวิชาการและแผนงาน</p>
                <p>โทร: 038-123-456 ต่อ 15</p>
              </div>
              <div>
                <p className="font-medium">อีเมล</p>
                <p>planning@banpho.go.th</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}