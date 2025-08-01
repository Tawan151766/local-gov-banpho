'use client';

import { useState } from 'react';

export default function ComplaintsQualityPage() {
  const [currentPage, setCurrentPage] = useState(1);
  
  const manuals = [
    {
      id: 1,
      title: 'คู่มือการปฏิบัติงานขององค์กรปกครองส่วนท้องถิ่น',
      views: 28,
      date: '04 ก.ย. 2566',
      description: 'แนวทางการปฏิบัติงานสำหรับเจ้าหน้าที่องค์กรปกครองส่วนท้องถิ่น',
      category: 'ทั่วไป',
      icon: '📋'
    },
    {
      id: 2,
      title: 'คู่มือการปฏิบัติงาน กองช่าง',
      views: 32,
      date: '26 เม.ย. 2566',
      description: 'แนวทางการปฏิบัติงานสำหรับเจ้าหน้าที่กองช่าง',
      category: 'กองช่าง',
      icon: '🔧'
    },
    {
      id: 3,
      title: 'คู่มือการปฏิบัติงานด้านการจัดการขยะมูลฝอย',
      views: 24,
      date: '26 เม.ย. 2566',
      description: 'แนวทางการจัดการขยะมูลฝอยและสิ่งแวดล้อม',
      category: 'สิ่งแวดล้อม',
      icon: '♻️'
    },
    {
      id: 4,
      title: 'คู่มือการปฏิบัติงานเรื่อง การร้องทุกข์/ร้องเรียน',
      views: 20,
      date: '22 ธ.ค. 2565',
      description: 'แนวทางการรับเรื่องและดำเนินการร้องทุกข์ร้องเรียน',
      category: 'การร้องเรียน',
      icon: '📢'
    },
    {
      id: 5,
      title: 'คู่มือการปฏิบัติงาน กองการศึกษา',
      views: 38,
      date: '13 ม.ค. 2565',
      description: 'แนวทางการปฏิบัติงานสำหรับเจ้าหน้าที่กองการศึกษา',
      category: 'การศึกษา',
      icon: '🎓'
    },
    {
      id: 6,
      title: 'คู่มือการปฏิบัติงาน งานบริหารงานบุคคล',
      views: 37,
      date: '13 ม.ค. 2565',
      description: 'แนวทางการบริหารงานบุคคลและการพัฒนาบุคลากร',
      category: 'บุคลากร',
      icon: '👥'
    },
    {
      id: 7,
      title: 'คู่มือการปฏิบัติงาน งานเบี้ยยังชีพ',
      views: 40,
      date: '13 ม.ค. 2565',
      description: 'แนวทางการจ่ายเบี้ยยังชีพและสวัสดิการสังคม',
      category: 'สวัสดิการ',
      icon: '💰'
    },
    {
      id: 8,
      title: 'คู่มือประชาชน',
      views: 38,
      date: '30 มิ.ย. 2563',
      description: 'คู่มือสำหรับประชาชนในการติดต่อราชการ',
      category: 'ประชาชน',
      icon: '👨‍👩‍👧‍👦'
    }
  ];

  const categories = ['ทั้งหมด', 'ทั่วไป', 'กองช่าง', 'สิ่งแวดล้อม', 'การร้องเรียน', 'การศึกษา', 'บุคลากร', 'สวัสดิการ', 'ประชาชน'];
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');

  const filteredManuals = selectedCategory === 'ทั้งหมด' 
    ? manuals 
    : manuals.filter(manual => manual.category === selectedCategory);

  const totalItems = filteredManuals.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            คู่มือหรือแนวทางการปฏิบัติงานของเจ้าหน้าที่
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            รวบรวมคู่มือและแนวทางการปฏิบัติงานสำหรับเจ้าหน้าที่เทศบาลตำบลบ้านโพธิ์
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-6"></div>
        </div>

        {/* Stats Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-gray-900">{totalItems}</h3>
              <p className="text-gray-600">รายการทั้งหมด</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-gray-900">{manuals.reduce((sum, manual) => sum + manual.views, 0)}</h3>
              <p className="text-gray-600">จำนวนการอ่าน</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-gray-900">1</h3>
              <p className="text-gray-600">กำลังแสดงหน้า</p>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
            </svg>
            หมวดหมู่คู่มือ
          </h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Manuals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {filteredManuals.map((manual) => (
            <div
              key={manual.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{manual.icon}</div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    manual.category === 'ทั่วไป' ? 'bg-blue-100 text-blue-800' :
                    manual.category === 'กองช่าง' ? 'bg-orange-100 text-orange-800' :
                    manual.category === 'สิ่งแวดล้อม' ? 'bg-green-100 text-green-800' :
                    manual.category === 'การร้องเรียน' ? 'bg-red-100 text-red-800' :
                    manual.category === 'การศึกษา' ? 'bg-purple-100 text-purple-800' :
                    manual.category === 'บุคลากร' ? 'bg-indigo-100 text-indigo-800' :
                    manual.category === 'สวัสดิการ' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-pink-100 text-pink-800'
                  }`}>
                    {manual.category}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 leading-tight">
                  {manual.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {manual.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    อ่าน {manual.views} คน
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    เมื่อ {manual.date}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    ดาวน์โหลด
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              กำลังแสดงหน้า: <span className="font-semibold text-blue-600">{currentPage}</span>
            </div>
            <div className="text-sm text-gray-600">
              ข้อมูลทั้งหมด <span className="font-semibold text-blue-600">{totalItems}</span> รายการ
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl text-white p-8">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-2xl font-semibold mb-4">ข้อมูลเพิ่มเติม</h3>
            <p className="text-blue-100 max-w-2xl mx-auto">
              คู่มือการปฏิบัติงานเหล่านี้จัดทำขึ้นเพื่อให้เจ้าหน้าที่สามารถปฏิบัติงานได้อย่างมีประสิทธิภาพ 
              และให้บริการประชาชนได้อย่างรวดเร็วและถูกต้อง
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-2xl mb-2">📞</div>
                <p className="text-sm">โทรศัพท์: 02-XXX-XXXX</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">📧</div>
                <p className="text-sm">อีเมล์: info@banpho.go.th</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🕒</div>
                <p className="text-sm">เวลาทำการ: จันทร์-ศุกร์ 08:30-16:30 น.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}