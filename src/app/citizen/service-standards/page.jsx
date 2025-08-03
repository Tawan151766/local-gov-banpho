"use client";

import { useState, useEffect } from "react";

export default function ServiceStandardsPage() {
  const [categories, setCategories] = useState([]);
  const [manuals, setManuals] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("คู่มือหรือมาตรฐานการให้บริการประชาชน");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // โหลดข้อมูลเมื่อ component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const res = await fetch('/api/manual-search?limit=100');
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const result = await res.json();
        
        if (result.success && Array.isArray(result.data)) {
          // กรองเฉพาะหมวดหมู่ 'คู่มือหรือมาตรฐานการให้บริการประชาชน'
          const filteredManuals = result.data.filter(manual => 
            manual.category_name === 'คู่มือหรือมาตรฐานการให้บริการประชาชน'
          );
          
          // สร้างรายการหมวดหมู่จากข้อมูลที่กรองแล้ว
          const uniqueCategories = [...new Set(filteredManuals.map(manual => manual.category_name))];
          setCategories(['ทั้งหมด', ...uniqueCategories]);
          setManuals(filteredManuals);
        } else {
          setCategories(['ทั้งหมด']);
          setManuals([]);
        }
      } catch (error) {
        console.error('Error fetching manuals:', error);
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
        setCategories(['ทั้งหมด']);
        setManuals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredManuals = manuals.filter((manual) => {
    const matchesCategory =
      selectedCategory === "ทั้งหมด" ||
      manual.category_name === selectedCategory;
    
    return matchesCategory;
  });

  const handleDownload = (manual) => {
    if (!manual.file_path) {
      alert("ไม่พบไฟล์สำหรับดาวน์โหลด");
      return;
    }

    const fileUrl = manual.file_path.startsWith("http")
      ? manual.file_path
      : `https://banpho.sosmartsolution.com${manual.file_path}`;
    
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = manual.title || "manual";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-6 shadow-lg">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            คู่มือหรือมาตรฐานการให้บริการประชาชน
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            มาตรฐานการให้บริการ ขั้นตอนการดำเนินงาน และคู่มือปฏิบัติงานสำหรับการให้บริการประชาชนของเทศบาลตำบลบ้านโพธิ์
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-8"></div>

          {/* Publication Date */}
          <div className="inline-flex items-center bg-purple-100 text-purple-800 px-6 py-3 rounded-full text-sm font-medium">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            มาตรฐานการให้บริการที่ได้รับการรับรอง
          </div>
        </div>


        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="mt-2 text-gray-600">กำลังโหลดข้อมูล...</p>
          </div>
        )}

        {/* Manuals Table */}
        {!loading && (
          <div className="overflow-x-auto mb-8">
            <table className="min-w-full bg-white rounded-xl shadow-lg">
              <thead>
                <tr className="bg-purple-50 text-purple-900">
                  <th className="px-4 py-3 text-left font-semibold">ชื่อคู่มือ</th>
                  <th className="px-4 py-3 text-left font-semibold">หมวดหมู่</th>
                  <th className="px-4 py-3 text-left font-semibold">คำอธิบาย</th>
                  <th className="px-4 py-3 text-left font-semibold">ไฟล์</th>
                  <th className="px-4 py-3 text-center font-semibold">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredManuals.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12">
                      <div className="text-gray-400">
                        <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-lg font-medium">ไม่พบข้อมูลคู่มือ</p>
                        <p className="text-sm">ลองเปลี่ยนหมวดหมู่</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredManuals.map((manual) => (
                    <tr key={manual.id} className="border-b border-gray-100 hover:bg-purple-50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="font-semibold text-gray-900 mb-1">
                          {manual.title}
                        </div>
                        {manual.tags && (
                          <div className="text-xs text-gray-500">
                            แท็ก: {manual.tags}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {manual.category_name}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-gray-600 text-sm max-w-xs">
                          {manual.description ? (
                            manual.description.length > 100 
                              ? `${manual.description.substring(0, 100)}...`
                              : manual.description
                          ) : '-'}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {manual.file_path ? (
                          <div className="text-xs">
                            <span className="text-gray-700 bg-gray-100 px-2 py-1 rounded">
                              {manual.file_path.split("/").pop()}
                            </span>
                            <div className="text-gray-500 mt-1">
                              {manual.file_size && `ขนาด: ${manual.file_size}`}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">ไม่มีไฟล์</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => handleDownload(manual)}
                          disabled={!manual.file_path}
                          className={`inline-flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                            manual.file_path
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md hover:shadow-lg'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                          </svg>
                          ดาวน์โหลด
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}