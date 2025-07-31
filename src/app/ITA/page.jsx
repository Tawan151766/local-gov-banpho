"use client";
import { useState, useEffect } from "react";

export default function ITAPage() {
  const [evaluations, setEvaluations] = useState([]);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingContents, setLoadingContents] = useState(false);

  useEffect(() => {
    fetchEvaluations();
  }, []);

  useEffect(() => {
    if (selectedEvaluation) {
      fetchContents(selectedEvaluation.id);
    }
  }, [selectedEvaluation]);

  const fetchEvaluations = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/ita-evaluations");
      const result = await response.json();
      
      if (result.success) {
        setEvaluations(result.data);
        // Auto select the latest evaluation
        if (result.data.length > 0) {
          setSelectedEvaluation(result.data[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching evaluations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContents = async (evaluationId) => {
    try {
      setLoadingContents(true);
      const response = await fetch(`/api/ita-contents?evaluation_id=${evaluationId}`);
      const result = await response.json();
      
      if (result.success) {
        setContents(result.data);
      }
    } catch (error) {
      console.error("Error fetching contents:", error);
    } finally {
      setLoadingContents(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "ไม่ระบุวันที่";

    const date = new Date(dateString);
    const thaiMonths = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];

    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543;

    return `${day} ${month} ${year}`;
  };

  const getContentTypeIcon = (url) => {
    const fileExtension = url.split('.').pop().toLowerCase();
    
    if (['pdf'].includes(fileExtension)) return '📄';
    if (['doc', 'docx'].includes(fileExtension)) return '📝';
    if (['xls', 'xlsx'].includes(fileExtension)) return '📊';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) return '🖼️';
    if (url.includes('http')) return '🔗';
    
    return '📋';
  };

  const handleContentClick = (content) => {
    if (content.url) {
      window.open(content.url, '_blank');
    }
  };

  const getScoreColor = (evaluationName) => {
    // Extract score from evaluation name if present
    const scoreMatch = evaluationName.match(/(\d+\.?\d*)/);
    if (scoreMatch) {
      const score = parseFloat(scoreMatch[1]);
      if (score >= 85) return "#28a745"; // green
      if (score >= 75) return "#ffc107"; // yellow
      if (score >= 65) return "#fd7e14"; // orange
      return "#dc3545"; // red
    }
    return "#01bdcc"; // default blue
  };

  const getScoreLevel = (evaluationName) => {
    const scoreMatch = evaluationName.match(/(\d+\.?\d*)/);
    if (scoreMatch) {
      const score = parseFloat(scoreMatch[1]);
      if (score >= 85) return "ดีเยี่ยม";
      if (score >= 75) return "ดีมาก";
      if (score >= 65) return "ดี";
      return "ปานกลาง";
    }
    return "ไม่ระบุ";
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

      {/* Content Section */}
      <div className="w-full max-w-[1268px]">
        {loading ? (
          // Loading State
          <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, idx) => (
                  <div key={idx} className="h-32 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        ) : evaluations.length === 0 ? (
          // No Data State
          <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 text-center backdrop-blur-sm">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">ไม่มีข้อมูลการประเมิน ITA</h2>
            <p className="text-gray-600 mb-6">ขณะนี้ยังไม่มีข้อมูลการประเมินคุณธรรมและความโปร่งใส</p>
          </div>
        ) : (
          <div className="space-y-6">

            {/* Contents Section as Table */}
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-[#01385f] mb-6 text-center">
                เอกสารและข้อมูลประกอบการประเมิน
              </h3>
              {loadingContents ? (
                <div className="text-center py-8 text-gray-500">กำลังโหลดข้อมูล...</div>
              ) : contents.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-4">📋</div>
                  <p className="text-gray-500 text-lg">ไม่มีเอกสารประกอบการประเมิน</p>
                  <p className="text-gray-400 text-sm mt-2">กรุณาเลือกปีการประเมินอื่น หรือติดต่อเจ้าหน้าที่</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 rounded-lg">
                    <thead>
                      <tr className="bg-blue-50">
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">ชื่อการประเมิน</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">รายละเอียด</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">URL/ลิงก์</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contents.map((content) => (
                        <tr key={content.id} className="hover:bg-blue-100">
                          <td className="px-4 py-2 border-b text-sm text-gray-800">{selectedEvaluation?.name}</td>
                          <td className="px-4 py-2 border-b text-sm text-gray-700">{content.description || "-"}</td>
                          <td className="px-4 py-2 border-b text-sm text-blue-600">
                            {content.url ? (
                              <a href={content.url} target="_blank" rel="noopener noreferrer" className="underline break-all">{content.url}</a>
                            ) : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Information */}
      <div className="w-full max-w-[1268px] mt-8">
        <div className="bg-white bg-opacity-90 rounded-2xl shadow-md p-6 backdrop-blur-sm text-center">
          <h4 className="text-lg font-semibold text-[#01385f] mb-2">
            การประเมินคุณธรรมและความโปร่งใส (ITA)
          </h4>
          <p className="text-gray-600 text-sm">
            เทศบาลตำบลบ้านโพธิ์ มุ่งมั่นในการพัฒนาองค์กรให้มีคุณธรรม ความโปร่งใส และความรับผิดชอบต่อสังคม
          </p>
        </div>
      </div>
    </div>
  );
}