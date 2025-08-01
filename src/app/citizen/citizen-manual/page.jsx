'use client';

import { useState } from 'react';

export default function CitizenManualPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const manuals = [
    {
      id: 1,
      title: 'คู่มือการขอใบอนุญาตก่อสร้าง',
      description: 'ขั้นตอนและเอกสารที่จำเป็นสำหรับการขอใบอนุญาตก่อสร้างอาคาร',
      category: 'การก่อสร้าง',
      icon: '🏗️',
      size: '2.5 MB',
      type: 'PDF',
      downloadCount: 245
    },
    {
      id: 2,
      title: 'คู่มือการขอรับบริการจัดเก็บขยะ',
      description: 'วิธีการขอรับบริการจัดเก็บขยะมูลฝอยและของเสียจากบ้าน',
      category: 'สิ่งแวดล้อม',
      icon: '🗑️',
      size: '1.8 MB',
      type: 'PDF',
      downloadCount: 189
    },
    {
      id: 3,
      title: 'คู่มือการสมัครเรียนศูนย์พัฒนาเด็กเล็ก',
      description: 'ขั้นตอนการสมัครเรียนและเอกสารที่ต้องใช้สำหรับศูนย์พัฒนาเด็กเล็ก',
      category: 'การศึกษา',
      icon: '👶',
      size: '3.2 MB',
      type: 'PDF',
      downloadCount: 312
    },
    {
      id: 4,
      title: 'คู่มือการขอรับเบี้ยยังชีพผู้สูงอายุ',
      description: 'วิธีการสมัครและเอกสารประกอบการขอรับเบี้ยยังชีพผู้สูงอายุ',
      category: 'สวัสดิการ',
      icon: '👴',
      size: '2.1 MB',
      type: 'PDF',
      downloadCount: 456
    },
    {
      id: 5,
      title: 'คู่มือการขอใบอนุญาตประกอบกิจการค้าขาย',
      description: 'ขั้นตอนการขอใบอนุญาตสำหรับการประกอบกิจการค้าขายต่างๆ',
      category: 'ธุรกิจ',
      icon: '🏪',
      size: '2.8 MB',
      type: 'PDF',
      downloadCount: 167
    },
    {
      id: 6,
      title: 'คู่มือการชำระภาษีท้องถิ่น',
      description: 'วิธีการชำระภาษีท้องถิ่นและช่องทางการชำระต่างๆ',
      category: 'ภาษี',
      icon: '💰',
      size: '1.9 MB',
      type: 'PDF',
      downloadCount: 334
    },
    {
      id: 7,
      title: 'คู่มือการร้องเรียนปัญหาสาธารณะ',
      description: 'ขั้นตอนการแจ้งปัญหาและร้องเรียนเรื่องสาธารณะต่างๆ',
      category: 'การร้องเรียน',
      icon: '📢',
      size: '1.5 MB',
      type: 'PDF',
      downloadCount: 278
    },
    {
      id: 8,
      title: 'คู่มือการขอรับการสนับสนุนกิจกรรมชุมชน',
      description: 'วิธีการขอรับการสนับสนุนงบประมาณสำหรับกิจกรรมชุมชน',
      category: 'ชุมชน',
      icon: '🤝',
      size: '2.3 MB',
      type: 'PDF',
      downloadCount: 123
    }
  ];

  const categories = ['ทั้งหมด', 'การก่อสร้าง', 'สิ่งแวดล้อม', 'การศึกษา', 'สวัสดิการ', 'ธุรกิจ', 'ภาษี', 'การร้องเรียน', 'ชุมชน'];
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');

  const filteredManuals = manuals.filter(manual => {
    const matchesCategory = selectedCategory === 'ทั้งหมด' || manual.category === selectedCategory;
    const matchesSearch = manual.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         manual.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownload = (manual) => {
    // Simulate download
    console.log(`Downloading: ${manual.title}`);
    alert(`กำลังดาวน์โหลด: ${manual.title}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-full mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            คู่มือประชาชน
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            รวบรวมคู่มือและเอกสารต่างๆ ที่ประชาชนสามารถดาวน์โหลดและใช้งานได้
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-green-600 to-blue-600 mx-auto mb-8"></div>
          
          {/* Publication Date */}
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-6 py-3 rounded-full text-sm font-medium">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            ประกาศเมื่อ 30 มิถุนายน 2563
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Box */}
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                ค้นหาคู่มือ
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ค้นหาคู่มือที่ต้องการ..."
                />
                <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Category Filter */}
            <div className="lg:w-80">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                หมวดหมู่
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{filteredManuals.length}</h3>
            <p className="text-gray-600">คู่มือทั้งหมด</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{manuals.reduce((sum, manual) => sum + manual.downloadCount, 0)}</h3>
            <p className="text-gray-600">ครั้งดาวน์โหลด</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{categories.length - 1}</h3>
            <p className="text-gray-600">หมวดหมู่</p>
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
                  <div className="flex flex-col items-end space-y-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      manual.category === 'การก่อสร้าง' ? 'bg-orange-100 text-orange-800' :
                      manual.category === 'สิ่งแวดล้อม' ? 'bg-green-100 text-green-800' :
                      manual.category === 'การศึกษา' ? 'bg-blue-100 text-blue-800' :
                      manual.category === 'สวัสดิการ' ? 'bg-purple-100 text-purple-800' :
                      manual.category === 'ธุรกิจ' ? 'bg-yellow-100 text-yellow-800' :
                      manual.category === 'ภาษี' ? 'bg-red-100 text-red-800' :
                      manual.category === 'การร้องเรียน' ? 'bg-pink-100 text-pink-800' :
                      'bg-indigo-100 text-indigo-800'
                    }`}>
                      {manual.category}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {manual.type} • {manual.size}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 leading-tight">
                  {manual.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {manual.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    ดาวน์โหลด {manual.downloadCount} ครั้ง
                  </div>
                </div>
                
                <button
                  onClick={() => handleDownload(manual)}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center group"
                >
                  <svg className="w-5 h-5 mr-2 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  ดาวน์โหลดเอกสารเพิ่มเติมได้ที่นี่
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Downloads Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">เอกสารเพิ่มเติม</h2>
            <p className="text-gray-600">เอกสารและคู่มือที่มีการปรับปรุงล่าสุด</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="text-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">เอกสารเพิ่มเติม {item}</h3>
                <button className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">
                  ดาวน์โหลดเอกสารเพิ่มเติมได้ที่นี่
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl shadow-xl text-white p-8">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <h3 className="text-2xl font-semibold mb-4">ต้องการความช่วยเหลือ?</h3>
            <p className="text-green-100 max-w-2xl mx-auto mb-6">
              หากมีปัญหาในการดาวน์โหลดหรือต้องการคำแนะนำเพิ่มเติม กรุณาติดต่อเจ้าหน้าที่
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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