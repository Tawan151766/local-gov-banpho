'use client';

import { useState } from 'react';

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const documents = [
    {
      id: 1,
      title: 'คำขอต่ออายุใบอนุญาติจัดตั้งสถานที่จำหน่ายอาหารหรือสะสมอาหาร',
      views: 67,
      date: '25 ก.ค. 2561',
      category: 'สาธารณสุข',
      department: 'กองสาธารณสุข',
      icon: '🍽️',
      size: '2.1 MB',
      type: 'PDF',
      description: 'แบบฟอร์มสำหรับการขอต่ออายุใบอนุญาติจัดตั้งสถานที่จำหน่ายอาหาร'
    },
    {
      id: 2,
      title: 'คำขอต่ออายุใบอนุญาติให้ดำเนินกิจการที่เป็นอันตรายต่อสุขภาพ',
      views: 73,
      date: '25 ก.ค. 2561',
      category: 'สาธารณสุข',
      department: 'กองสาธารณสุข',
      icon: '⚠️',
      size: '2.3 MB',
      type: 'PDF',
      description: 'แบบฟอร์มสำหรับการขอต่ออายุใบอนุญาติกิจการอันตรายต่อสุขภาพ'
    },
    {
      id: 3,
      title: 'แบบคำร้องกองคลัง',
      views: 88,
      date: '25 ก.ค. 2561',
      category: 'การเงิน',
      department: 'กองคลัง',
      icon: '💰',
      size: '1.8 MB',
      type: 'PDF',
      description: 'แบบฟอร์มคำร้องทั่วไปสำหรับงานกองคลังและการเงิน'
    },
    {
      id: 4,
      title: 'แบบคำร้องกองประปา',
      views: 84,
      date: '25 ก.ค. 2561',
      category: 'สาธารณูปโภค',
      department: 'กองช่าง',
      icon: '💧',
      size: '1.9 MB',
      type: 'PDF',
      description: 'แบบฟอร์มคำร้องเกี่ยวกับการขอรับบริการประปา'
    },
    {
      id: 5,
      title: 'แบบคำร้องขอดูข้อมูลข่าวสาร',
      views: 70,
      date: '25 ก.ค. 2561',
      category: 'ข้อมูลข่าวสาร',
      department: 'สำนักปลัด',
      icon: '📋',
      size: '1.5 MB',
      type: 'PDF',
      description: 'แบบฟอร์มสำหรับการขอดูข้อมูลข่าวสารของราชการ'
    },
    {
      id: 6,
      title: 'แบบคำร้องทั่วไป(กองช่าง)',
      views: 114,
      date: '25 ก.ค. 2561',
      category: 'โครงสร้างพื้นฐาน',
      department: 'กองช่าง',
      icon: '🔧',
      size: '2.0 MB',
      type: 'PDF',
      description: 'แบบฟอร์มคำร้องทั่วไปสำหรับงานกองช่าง'
    },
    {
      id: 7,
      title: 'แบบคำร้องทั่วไป(กองสาธารณสุข)',
      views: 74,
      date: '25 ก.ค. 2561',
      category: 'สาธารณสุข',
      department: 'กองสาธารณสุข',
      icon: '🏥',
      size: '1.7 MB',
      type: 'PDF',
      description: 'แบบฟอร์มคำร้องทั่วไปสำหรับงานกองสาธารณสุข'
    },
    {
      id: 8,
      title: 'แบบคำร้องทั่วไป',
      views: 87,
      date: '25 ก.ค. 2561',
      category: 'ทั่วไป',
      department: 'สำนักปลัด',
      icon: '📄',
      size: '1.6 MB',
      type: 'PDF',
      description: 'แบบฟอร์มคำร้องทั่วไปสำหรับเรื่องต่างๆ'
    }
  ];

  const categories = ['ทั้งหมด', 'สาธารณสุข', 'การเงิน', 'สาธารณูปโภค', 'ข้อมูลข่าวสาร', 'โครงสร้างพื้นฐาน', 'ทั่วไป'];
  const departments = ['ทั้งหมด', 'กองสาธารณสุข', 'กองคลัง', 'กองช่าง', 'สำนักปลัด'];
  
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [selectedDepartment, setSelectedDepartment] = useState('ทั้งหมด');

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ทั้งหมด' || doc.category === selectedCategory;
    const matchesDepartment = selectedDepartment === 'ทั้งหมด' || doc.department === selectedDepartment;
    return matchesSearch && matchesCategory && matchesDepartment;
  });

  const totalViews = documents.reduce((sum, doc) => sum + doc.views, 0);
  const totalDocuments = documents.length;

  const handleDownload = (document) => {
    console.log(`Downloading: ${document.title}`);
    alert(`กำลังดาวน์โหลด: ${document.title}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            แบบฟอร์มคำร้อง
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            รวบรวมแบบฟอร์มคำร้องต่างๆ สำหรับการติดต่อราชการกับเทศบาลตำบลบ้านโพธิ์
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mt-6"></div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border-l-4 border-indigo-500">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{totalDocuments}</h3>
            <p className="text-gray-600">รายการทั้งหมด</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border-l-4 border-green-500">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{totalViews}</h3>
            <p className="text-gray-600">จำนวนการอ่าน</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border-l-4 border-purple-500">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{departments.length - 1}</h3>
            <p className="text-gray-600">หน่วยงาน</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border-l-4 border-yellow-500">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{currentPage}</h3>
            <p className="text-gray-600">กำลังแสดงหน้า</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                ค้นหาแบบฟอร์ม
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="ค้นหาแบบฟอร์มที่ต้องการ..."
                />
                <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                หมวดหมู่
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Department Filter */}
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                หน่วยงาน
              </label>
              <select
                id="department"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {departments.map((department, index) => (
                  <option key={index} value={department}>{department}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {filteredDocuments.map((document) => (
            <div
              key={document.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1 overflow-hidden"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{document.icon}</div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      document.category === 'สาธารณสุข' ? 'bg-red-100 text-red-800' :
                      document.category === 'การเงิน' ? 'bg-green-100 text-green-800' :
                      document.category === 'สาธารณูปโภค' ? 'bg-blue-100 text-blue-800' :
                      document.category === 'ข้อมูลข่าวสาร' ? 'bg-yellow-100 text-yellow-800' :
                      document.category === 'โครงสร้างพื้นฐาน' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {document.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      document.department === 'กองสาธารณสุข' ? 'bg-pink-100 text-pink-800' :
                      document.department === 'กองคลัง' ? 'bg-emerald-100 text-emerald-800' :
                      document.department === 'กองช่าง' ? 'bg-amber-100 text-amber-800' :
                      'bg-indigo-100 text-indigo-800'
                    }`}>
                      {document.department}
                    </span>
                  </div>
                </div>
                
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 leading-tight">
                  {document.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {document.description}
                </p>
                
                {/* File Info */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      อ่าน {document.views} คน
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {document.type} • {document.size}
                    </div>
                  </div>
                </div>
                
                {/* Date */}
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  เมื่อ {document.date}
                </div>
                
                {/* Download Button */}
                <button
                  onClick={() => handleDownload(document)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center group"
                >
                  <svg className="w-5 h-5 mr-2 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  ดาวน์โหลดแบบฟอร์ม
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Page Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              กำลังแสดงหน้า: <span className="font-semibold text-indigo-600">{currentPage}</span>
            </div>
            <div className="text-sm text-gray-600">
              ข้อมูลทั้งหมด <span className="font-semibold text-indigo-600">{filteredDocuments.length}</span> รายการ
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl text-white p-8">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-2xl font-semibold mb-4">ต้องการความช่วยเหลือในการกรอกแบบฟอร์ม?</h3>
            <p className="text-indigo-100 max-w-2xl mx-auto mb-6">
              หากมีปัญหาในการดาวน์โหลดหรือกรอกแบบฟอร์ม สามารถติดต่อเจ้าหน้าที่เพื่อขอคำแนะนำ
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl mb-2">📞</div>
                <p className="text-sm">โทรศัพท์: 02-XXX-XXXX</p>
                <p className="text-xs text-indigo-200">สายด่วนแบบฟอร์ม</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">📧</div>
                <p className="text-sm">อีเมล์: forms@banpho.go.th</p>
                <p className="text-xs text-indigo-200">สำหรับสอบถามแบบฟอร์ม</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🕒</div>
                <p className="text-sm">เวลาทำการ: จันทร์-ศุกร์</p>
                <p className="text-xs text-indigo-200">08:30-16:30 น.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}