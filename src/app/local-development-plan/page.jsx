"use client";
import React, { useEffect, useState } from "react";

export default function LocalDevelopmentPlanPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/local-dev-plan");
        const json = await res.json();
        setPlans(json.data || []);
      } catch (err) {
        setPlans([]);
      }
      setLoading(false);
    };
    fetchPlans();
  }, []);

  const handleShowDetail = (plan) => {
    setSelectedPlan(plan);
    setModalOpen(true);
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
        <div className="bg-gradient-to-r from-[#03bdca] to-[#01bdcc] rounded-[36px] shadow-lg w-full flex flex-col md:flex-row items-center px-6 py-6 relative backdrop-blur-sm">
          <div className="bg-white rounded-full shadow-md w-32 h-16 flex items-center justify-center mb-4 md:mb-0 md:absolute md:left-6 md:top-1/2 md:-translate-y-1/2 border-2 border-[#01bdcc]">
            <span className="text-[#01385f] font-bold text-2xl tracking-wide">
              📋
            </span>
          </div>
          <div className="flex-1 flex flex-wrap flex-row items-center justify-center gap-6 md:gap-12 md:ml-40">
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              แผนพัฒนาท้องถิ่น
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              Local Development Plan
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              แผนงานหลัก
            </span>
          </div>
        </div>
      </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold text-[#0383AA] mb-4">
            รายการแผนพัฒนาท้องถิ่น
          </h3>
          {loading ? (
            <div className="text-center py-8">กำลังโหลดข้อมูล...</div>
          ) : plans.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              ไม่มีข้อมูลแผนพัฒนาท้องถิ่น
            </div>
          ) : (
            <table className="w-full border rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-blue-50 text-[#01385f]">
                  <th className="py-2 px-4 text-left">ชื่อประเภทแผน</th>
                  <th className="py-2 px-4 text-left">จำนวนไฟล์</th>
                  <th className="py-2 px-4 text-left">ดูรายละเอียด</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan) => (
                  <tr key={plan.id} className="border-b">
                    <td className="py-2 px-4 text-[#01385f]">{plan.type_name}</td>
                    <td className="py-2 px-4 text-[#01385f]">{plan.files_count}</td>
                    <td className="py-2 px-4">
                      <button
                        className="bg-[#0383AA] text-white px-3 py-1 rounded hover:bg-[#026b8a]"
                        onClick={() => handleShowDetail(plan)}
                      >
                        ดูรายละเอียด
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal for detail */}
        {modalOpen && selectedPlan && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                onClick={() => setModalOpen(false)}
              >
                &times;
              </button>
              <h3 className="text-2xl font-bold text-[#0383AA] mb-4">
                รายละเอียดแผน
              </h3>
              <div className="mb-2">
                <span className="font-semibold">ชื่อประเภทแผน:</span>{" "}
                {selectedPlan.type_name}
              </div>
              <div className="mb-2">
                <span className="font-semibold">จำนวนไฟล์:</span>{" "}
                {selectedPlan.files_count}
              </div>
              {/* สามารถเพิ่มรายละเอียดอื่น ๆ ได้ เช่น วันที่สร้าง, อัปเดต */}
              <div className="mt-4">
                <span className="font-semibold">ไฟล์ล่าสุด:</span>
                <ul className="list-disc ml-6 mt-2">
                  {selectedPlan.files && selectedPlan.files.length > 0 ? (
                    selectedPlan.files.map((file) => (
                      <li key={file.id}>
                        <a
                          href={file.files_path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          {file.files_path.split("/").pop()}
                        </a>
                        <span className="ml-2 text-xs text-gray-500">
                          ({file.files_type})
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-400">ไม่มีไฟล์ล่าสุด</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
        )}
      </div>

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
}