"use client";
import { useEffect, useState } from "react";

export default function CitizenManualsPage() {
  const [categories, setCategories] = useState([]);
  const [manuals, setManuals] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // สำหรับ accordion: เก็บ id ของ manual ที่เปิดอยู่
  const [openManualId, setOpenManualId] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/manual-categories");
        const result = await res.json();
        if (result.success && Array.isArray(result.data)) {
          setCategories(result.data);
          setSelectedCategory(result.data[0]?.id || null);
        } else {
          setCategories([]);
        }
      } catch (e) {
        setError("เกิดข้อผิดพลาดในการโหลดหมวดหมู่");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!selectedCategory) return;
    const fetchManuals = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/manual-items?category_id=${selectedCategory}`);
        const result = await res.json();
        if (result.success && Array.isArray(result.data)) {
          setManuals(result.data);
        } else {
          setManuals([]);
        }
      } catch (e) {
        setError("เกิดข้อผิดพลาดในการโหลดคู่มือ");
        setManuals([]);
      } finally {
        setLoading(false);
      }
    };
    fetchManuals();
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-purple-800">คู่มือประชาชน/มาตรฐานการให้บริการ</h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8 text-center">{error}</div>
        )}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="mt-2 text-gray-600">กำลังโหลดข้อมูล...</p>
          </div>
        )}
        {!loading && categories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2 rounded-full font-medium shadow transition-all duration-200 text-sm ${selectedCategory === cat.id ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white scale-105' : 'bg-purple-100 text-purple-800 hover:bg-purple-200'}`}
              >
                {cat.name || cat.category_name}
              </button>
            ))}
          </div>
        )}
        {!loading && manuals.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg font-medium">ไม่พบหัวข้อในหมวดนี้</p>
            <p className="text-sm">ลองเลือกหมวดหมู่อื่น</p>
          </div>
        )}
        {!loading && manuals.length > 0 && (
          <div className="grid gap-8">
            {manuals.map((item) => {
              const isOpen = openManualId === item.id;
              return (
                <div key={item.id} className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
                    <div>
                      <div className="text-xl font-bold text-purple-800 mb-1">{item.title}</div>
                      {item.tags && <div className="text-xs text-gray-400 mb-1">แท็ก: {item.tags}</div>}
                      <div className="text-gray-600 text-sm max-w-2xl">{item.description || '-'}</div>
                    </div>
                    <div className="flex flex-col gap-2 mt-2 md:mt-0">
                      <button
                        onClick={() => setOpenManualId(isOpen ? null : item.id)}
                        className={`px-4 py-1 rounded-full text-xs font-medium shadow transition-all duration-200 ${isOpen ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'bg-purple-100 text-purple-800 hover:bg-purple-200'}`}
                      >
                        {isOpen ? 'ซ่อนไฟล์แนบ' : 'แสดงไฟล์แนบ'}
                      </button>
                    </div>
                  </div>
                  {isOpen && (
                    <div className="mt-4">
                      {/* กรณีมี files array (แบบใหม่) */}
                      {item.files && item.files.length > 0 ? (
                        item.files.map((file) => (
                          <div key={file.id} className="flex flex-wrap items-center gap-2 border border-purple-100 rounded px-3 py-2 bg-purple-50 mb-2">
                            <span className="font-medium text-purple-800">{file.original_name || file.files_path?.split("/").pop() || "ไฟล์แนบ"}</span>
                            {file.files_type && (
                              <span className="text-xs bg-purple-200 text-purple-800 rounded px-2 py-0.5">{file.files_type}</span>
                            )}
                            {file.file_size && (
                              <span className="text-xs text-blue-600">{(file.file_size / (1024 * 1024)).toFixed(2)} MB</span>
                            )}
                            <button
                              onClick={() => window.open(file.files_path?.startsWith("http") ? file.files_path : `https://banpho.sosmartsolution.com${file.files_path}`, "_blank")}
                              className="ml-2 px-3 py-1 rounded bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-medium shadow hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                            >
                              ดู/ดาวน์โหลด
                            </button>
                          </div>
                        ))
                      ) : item.file_path ? (
                        // กรณี API คืน file_path เดี่ยว (แบบเก่า)
                        <div className="flex flex-wrap items-center gap-2 border border-purple-100 rounded px-3 py-2 bg-purple-50 mb-2">
                          <span className="font-medium text-purple-800">{item.file_path.split("/").pop()}</span>
                          <button
                            onClick={() => window.open(item.file_path.startsWith("http") ? item.file_path : `https://banpho.sosmartsolution.com${item.file_path}`, "_blank")}
                            className="ml-2 px-3 py-1 rounded bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-medium shadow hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                          >
                            ดู/ดาวน์โหลด
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">ไม่มีไฟล์แนบ</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
