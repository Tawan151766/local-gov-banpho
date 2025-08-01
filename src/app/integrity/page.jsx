"use client";
import React from "react";
import Navbar from "../component/LandingPage/Navbar";

export default function IntegrityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-[#0383AA] mb-4 text-center">
            เจตจำนงสุจริตในการบริหารงาน
          </h1>
          <h2 className="text-xl text-gray-700 text-center mb-2">
            ของเทศบาลตำบลบ้านโพธิ์
          </h2>
          <div className="text-center text-sm text-gray-500 mb-4">
            ประกาศเมื่อ 25 พฤษภาคม 2564
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold text-[#0383AA] mb-4">
              เจตจำนงสุจริตในการบริหารงาน
            </h3>
            
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                เทศบาลตำบลบ้านโพธิ์ มีเจตจำนงที่จะบริหารงานด้วยความสุจริต โปร่งใส และเป็นธรรม 
                เพื่อประโยชน์สุขของประชาชนในพื้นที่ โดยยึดหลักการบริหารจัดการที่ดี (Good Governance) 
                และหลักปรัชญาเศรษฐกิจพอเพียง
              </p>

              <h4 className="text-lg font-semibold text-[#0383AA] mt-6 mb-3">
                หลักการบริหารงาน
              </h4>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>บริหารงานด้วยความโปร่งใส ตรวจสอบได้</li>
                <li>ให้บริการประชาชนด้วยความเป็นธรรม ไม่เลือกปฏิบัติ</li>
                <li>ใช้ง예산อย่างคุ้มค่า เกิดประโยชน์สูงสุดแก่ประชาชน</li>
                <li>ส่งเสริมการมีส่วนร่วมของประชาชนในการพัฒนาท้องถิ่น</li>
                <li>พัฒนาบุคลากรให้มีความรู้ ความสามารถ และจริยธรรม</li>
                <li>ป้องกันและปราบปรามการทุจริตทุกรูปแบบ</li>
              </ul>

              <h4 className="text-lg font-semibold text-[#0383AA] mt-6 mb-3">
                มาตรการป้องกันการทุจริต
              </h4>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>จัดทำแผนป้องกันและปราบปรามการทุจริต</li>
                <li>เปิดเผยข้อมูลข่าวสารของทางราชการ</li>
                <li>จัดให้มีช่องทางรับเรื่องร้องเรียน</li>
                <li>ตรวจสอบการปฏิบัติงานของเจ้าหน้าที่</li>
                <li>ส่งเสริมค่านิยมและจริยธรรมในการทำงาน</li>
                <li>พัฒนาระบบการควบคุมภายใน</li>
              </ul>

              <h4 className="text-lg font-semibold text-[#0383AA] mt-6 mb-3">
                การให้บริการประชาชน
              </h4>
              
              <p>
                เทศบาลตำบลบ้านโพธิ์ มุ่งมั่นที่จะให้บริการประชาชนด้วยความรวดเร็ว ถูกต้อง 
                และเป็นธรรม โดยปรับปรุงกระบวนการทำงานให้มีประสิทธิภาพ ลดขั้นตอนที่ไม่จำเป็น 
                และใช้เทคโนโลยีสารสนเทศเพื่อเพิ่มความสะดวกแก่ประชาชน
              </p>

              <h4 className="text-lg font-semibold text-[#0383AA] mt-6 mb-3">
                การพัฒนาท้องถิ่น
              </h4>
              
              <p>
                การพัฒนาท้องถิ่นจะดำเนินการตามแผนพัฒนาท้องถิ่น โดยให้ประชาชนมีส่วนร่วม
                ในการกำหนดทิศทาง การดำเนินงาน และการติดตามประเมินผล เพื่อให้การพัฒนา
                ตอบสนองความต้องการที่แท้จริงของประชาชน
              </p>
            </div>
          </div>
        </div>

        {/* Download Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-[#0383AA] mb-4">
            ดาวน์โหลดเอกสารเพิ่มเติม
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
                  <h4 className="font-medium text-gray-900">เจตจำนงสุจริตในการบริหารงาน</h4>
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
                  <h4 className="font-medium text-gray-900">แผนป้องกันและปราบปรามการทุจริต</h4>
                  <p className="text-sm text-gray-500">ประจำปี 2564-2567 (PDF)</p>
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
                  <h4 className="font-medium text-gray-900">คู่มือจริยธรรมสำหรับเจ้าหน้าที่</h4>
                  <p className="text-sm text-gray-500">เทศบาลตำบลบ้านโพธิ์ (PDF)</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-[#0383AA] text-white rounded-lg hover:bg-[#0383AA]/90 transition-colors">
                ดาวน์โหลด
              </button>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-xl font-semibold text-[#0383AA] mb-4">
            ติดต่อสอบถาม
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">สำนักปลัดเทศบาล</h4>
              <p className="text-gray-600 text-sm">โทร: 038-123-456</p>
              <p className="text-gray-600 text-sm">อีเมล: info@banpho.go.th</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">หน่วยตรวจสอบภายใน</h4>
              <p className="text-gray-600 text-sm">โทร: 038-123-457</p>
              <p className="text-gray-600 text-sm">อีเมล: audit@banpho.go.th</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}