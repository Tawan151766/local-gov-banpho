"use client";
import { useState } from 'react';

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const documents = [
    {
      id: 1,
      title: 'คำขอต่ออายุใบอนุญาติจัดตั้งสถานที่จำหน่ายอาหารหรือสะสมอาหาร',
      date: '25 ก.ค. 2561',
      category: 'สาธารณสุข',
      icon: '🍽️',
      hasFile: false
    },
    {
      id: 2,
      title: 'คำขอต่ออายุใบอนุญาติให้ดำเนินกิจการที่เป็นอันตรายต่อสุขภาพ',
      date: '25 ก.ค. 2561',
      category: 'สาธารณสุข',
      icon: '⚠️',
      hasFile: false
    },
    {
      id: 3,
      title: 'แบบคำร้องกองคลัง',
      date: '25 ก.ค. 2561',
      category: 'การเงิน',
      icon: '💰',
      fileUrl: 'https://www.banphocity.go.th/news/doc_download/a_250718_113905.pdf',
      hasFile: true
    },
    {
      id: 4,
      title: 'แบบคำร้องกองประปา',
      date: '25 ก.ค. 2561',
      category: 'สาธารณูปโภค',
      icon: '💧',
      fileUrl: 'https://www.banphocity.go.th/news/doc_download/a_250718_113917.pdf',
      hasFile: true
    },
    {
      id: 5,
      title: 'แบบคำร้องขอดูข้อมูลข่าวสาร',
      date: '25 ก.ค. 2561',
      category: 'ข้อมูลข่าวสาร',
      icon: '📋',
      hasFile: false
    },
    {
      id: 6,
      title: 'แบบคำร้องทั่วไป(กองช่าง)',
      date: '25 ก.ค. 2561',
      category: 'โครงสร้างพื้นฐาน',
      icon: '🔧',
      hasFile: false
    },
    {
      id: 7,
      title: 'แบบคำร้องทั่วไป(กองสาธารณสุข)',
      date: '25 ก.ค. 2561',
      category: 'สาธารณสุข',
      icon: '🏥',
      hasFile: false
    },
    {
      id: 8,
      title: 'แบบคำร้องทั่วไป',
      date: '25 ก.ค. 2561',
      category: 'ทั่วไป',
      icon: '📄',
      hasFile: false
    }
  ];

  const categories = ['ทั้งหมด', 'สาธารณสุข', 'การเงิน', 'สาธารณูปโภค', 'ข้อมูลข่าวสาร', 'โครงสร้างพื้นฐาน', 'ทั่วไป'];
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ทั้งหมด' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (document) => {
    if (document.hasFile && document.fileUrl) {
      window.open(document.fileUrl, '_blank');
    } else {
      alert(`แบบฟอร์ม: ${document.title}\nกรุณาติดต่อเจ้าหน้าที่เพื่อขอรับแบบฟอร์ม`);
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'สาธารณสุข': return 'bg-red-100 text-red-700 border-red-200';
      case 'การเงิน': return 'bg-green-100 text-green-700 border-green-200';
      case 'สาธารณูปโภค': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ข้อมูลข่าวสาร': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'โครงสร้างพื้นฐาน': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div
      className="w-full min-h-screen py-8 px-2 md:px-8 flex flex-col items-center bg-transparent"
      style={{
        backgroundImage:
          'linear-gradient(180deg, rgba(239, 228, 212, 0.6) 0%, rgba(1, 189, 204, 0.6) 100%), url("/image/Boat.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Header Section */}
      <div className="w-full max-w-[1268px] flex flex-col gap-4 mb-8">
        <div className="bg-gradient-to-r from-[#16a34a] to-[#15803d] rounded-[36px] shadow-lg w-full flex flex-col md:flex-row items-center px-6 py-6 relative backdrop-blur-sm">
          <div className="bg-white rounded-full shadow-md w-32 h-16 flex items-center justify-center mb-4 md:mb-0 md:absolute md:left-6 md:top-1/2 md:-translate-y-1/2 border-2 border-[#16a34a]">
            <span className="text-[#16a34a] font-bold text-2xl">📋</span>
          </div>
          <div className="flex-1 flex flex-wrap flex-row items-center justify-center gap-6 md:gap-12 md:ml-40">
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              แบบฟอร์มคำร้อง
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              เทศบาลตำบลบ้านโพธิ์
            </span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1200px]">
        {/* Search and Filter Section */}
        <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-6 mb-6 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="ค้นหาแบบฟอร์มที่ต้องการ..."
                />
                <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>พบแบบฟอร์ม <strong className="text-green-600">{filteredDocuments.length}</strong> รายการ</span>
              <span>จากทั้งหมด <strong className="text-green-600">{documents.length}</strong> แบบฟอร์ม</span>
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg backdrop-blur-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-2xl">📄</span>
              รายการแบบฟอร์ม
            </h2>

            {filteredDocuments.length > 0 ? (
              <div className="space-y-4">
                {filteredDocuments.map((document) => (
                  <div
                    key={document.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <span className="text-2xl">{document.icon}</span>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {document.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              เมื่อ {document.date}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(document.category)}`}>
                              {document.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        {document.hasFile && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full border border-green-200">
                            มีไฟล์
                          </span>
                        )}
                        <button
                          onClick={() => handleDownload(document)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                            document.hasFile
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          {document.hasFile ? (
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              ดาวน์โหลด
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              สอบถาม
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  ไม่พบแบบฟอร์มที่ค้นหา
                </h3>
                <p className="text-gray-500">
                  ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่น
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('ทั้งหมด');
                  }}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  ดูทั้งหมด
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer Information */}
        <div className="mt-6">
          <div className="bg-white bg-opacity-90 rounded-2xl shadow-md p-6 backdrop-blur-sm text-center">
            <h4 className="text-lg font-semibold text-[#16a34a] mb-2">
              ศูนย์บริการประชาชน
            </h4>
            <p className="text-gray-600 text-sm mb-2">
              เทศบาลตำบลบ้านโพธิ์ พร้อมให้บริการด้วยความสะดวก รวดเร็ว และโปร่งใส
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mt-3">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>โทร: 0XX-XXX-XXXX</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>เวลาทำการ: 08:30 - 16:30 น.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}