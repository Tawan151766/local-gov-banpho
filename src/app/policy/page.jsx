"use client";
import React from "react";

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-[#0383AA] mb-4 text-center">
            คำแถลงนโยบายการบริหารงาน
          </h1>
          <h2 className="text-xl text-gray-700 text-center mb-2">
            นายกเทศมนตรีตำบลบ้านโพธิ์
          </h2>
        </div>

        {/* Policy 2564 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold text-[#0383AA] mb-4">
            คำแถลงนโยบายนายกเทศมนตรีตำบลบ้านโพธิ์ พ.ศ. ๒๕๖๔
          </h3>
          <div className="prose max-w-none">
            <p className="mb-4 text-gray-700 leading-relaxed">
              คำแถลงนโยบายการบริหารงานนายกเทศมนตรีตำบลบ้านโพธิ์ ประจำปี พ.ศ. ๒๕๖๔ 
              มุ่งเน้นการพัฒนาท้องถิ่นอย่างยั่งยืน การส่งเสริมคุณภาพชีวิตของประชาชน 
              และการบริหารจัดการที่มีประสิทธิภาพ โปร่งใส ตรวจสอบได้
            </p>
          </div>
        </div>

        {/* Policy 2556 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold text-[#0383AA] mb-4">
            คำแถลงนโยบายนายกเทศมนตรีตำบลบ้านโพธิ์ พ.ศ. ๒๕๕๖
          </h3>
          <div className="prose max-w-none">
            <p className="mb-4 text-gray-700 leading-relaxed">
              คำแถลงนโยบายการบริหารงานนายกเทศมนตรีตำบลบ้านโพธิ์ ประจำปี พ.ศ. ๒๕๕๖ 
              เน้นการพัฒนาโครงสร้างพื้นฐาน การส่งเสริมการศึกษา และการพัฒนาเศรษฐกิจชุมชน
            </p>
          </div>
        </div>

        {/* Policy 2551 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold text-[#0383AA] mb-4">
            คำแถลงนโยบายนายกเทศมนตรีตำบลบ้านโพธิ์ พ.ศ. ๒๕๕๑
          </h3>
          <div className="prose max-w-none">
            <p className="mb-4 text-gray-700 leading-relaxed">
              คำแถลงนโยบายการบริหารงานนายกเทศมนตรีตำบลบ้านโพธิ์ ประจำปี พ.ศ. ๒๕๕๑ 
              มุ่งเน้นการสร้างความเข้มแข็งให้กับชุมชน การพัฒนาทรัพยากรมนุษย์ 
              และการอนุรักษ์สิ่งแวดล้อม
            </p>
          </div>
        </div>

        {/* Download Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-[#0383AA] mb-4">
            ดาวน์โหลดเอกสาร
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">คำแถลงนโยบายการบริหารงาน พ.ศ. ๒๕๖๔</h4>
                  <p className="text-sm text-gray-500">ฉบับเต็ม (PDF)</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-[#0383AA] text-white rounded-lg hover:bg-[#0383AA]/90 transition-colors">
                ดาวน์โหลด
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">คำแถลงนโยบายการบริหารงาน พ.ศ. ๒๕๕๖</h4>
                  <p className="text-sm text-gray-500">ฉบับเต็ม (PDF)</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-[#0383AA] text-white rounded-lg hover:bg-[#0383AA]/90 transition-colors">
                ดาวน์โหลด
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">คำแถลงนโยบายการบริหารงาน พ.ศ. ๒๕๕๑</h4>
                  <p className="text-sm text-gray-500">ฉบับเต็ม (PDF)</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-[#0383AA] text-white rounded-lg hover:bg-[#0383AA]/90 transition-colors">
                ดาวน์โหลด
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}