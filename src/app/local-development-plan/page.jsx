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
      </div>
    </div>
  );
}