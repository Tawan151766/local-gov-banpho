"use client";
import { useState, useEffect } from "react";

export default function ITAPage() {
  const [itaData, setItaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchITAData();
  }, [currentPage, searchTerm]);

  const fetchITAData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ita-table?page=${currentPage}&limit=10&search=${searchTerm}`);
      const result = await response.json();
      
      if (result.success) {
        setItaData(result.data);
        setTotalPages(result.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching ITA data:", error);
    } finally {
      setLoading(false);
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

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchITAData();
  };

  const renderLinks = (contentData) => {
    if (!contentData) return "-";
    
    try {
      // Try to parse as JSON first (if it's stored as JSON)
      const data = typeof contentData === 'string' ? JSON.parse(contentData) : contentData;
      
      if (data.links && Array.isArray(data.links)) {
        return (
          <div className="space-y-1">
            {data.links.map((link, index) => (
              <div key={index}>
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline text-sm break-all"
                >
                  {link.title || link.url}
                </a>
              </div>
            ))}
          </div>
        );
      }
      
      // If it's a single URL
      if (data.url) {
        return (
          <a 
            href={data.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline text-sm break-all"
          >
            {data.title || data.url}
          </a>
        );
      }
    } catch (error) {
      // If parsing fails, treat as plain text/URL
      if (contentData.startsWith('http')) {
        return (
          <a 
            href={contentData} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline text-sm break-all"
          >
            {contentData}
          </a>
        );
      }
    }
    
    return contentData;
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
              ITA
            </span>
          </div>
          <div className="flex-1 flex flex-wrap flex-row items-center justify-center gap-6 md:gap-12 md:ml-40">
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              การประเมินคุณธรรม
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              ความโปร่งใส
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              Integrity & Transparency Assessment
            </span>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white bg-opacity-90 rounded-2xl shadow-md p-4 backdrop-blur-sm">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="ค้นหาข้อมูล ITA..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-[#01bdcc] text-white px-6 py-2 rounded-lg hover:bg-[#019aa5] transition-colors"
            >
              ค้นหา
            </button>
          </form>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full max-w-[1268px]">
        {loading ? (
          // Loading State
          <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
              <div className="space-y-2">
                {[...Array(5)].map((_, idx) => (
                  <div key={idx} className="h-16 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        ) : itaData.length === 0 ? (
          // No Data State
          <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 text-center backdrop-blur-sm">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">ไม่มีข้อมูลการประเมิน ITA</h2>
            <p className="text-gray-600 mb-6">ขณะนี้ยังไม่มีข้อมูลการประเมินคุณธรรมและความโปร่งใส</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Main Table */}
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg backdrop-blur-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-[#01385f] text-center">
                  การประเมินคุณธรรมและความโปร่งใส (ITA)
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b">
                        หัวข้อ
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b">
                        รายละเอียด
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b">
                        ลิงก์ / เอกสาร
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b">
                        วันที่
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {itaData.map((evaluation) => {
                      // If evaluation has no contents, show the evaluation itself
                      if (evaluation.contents.length === 0) {
                        return (
                          <tr key={`eval-${evaluation.evaluation_id}`} className="hover:bg-blue-50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                              {evaluation.evaluation_name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              {evaluation.evaluation_description || "-"}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              -
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {formatDate(evaluation.evaluation_date)}
                            </td>
                          </tr>
                        );
                      }
                      
                      // Show each content as a separate row
                      return evaluation.contents.map((content, index) => (
                        <tr key={`content-${content.content_id}`} className="hover:bg-blue-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {index === 0 ? evaluation.evaluation_name : ""}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            <div>
                              {content.content_title && (
                                <div className="font-medium mb-1">{content.content_title}</div>
                              )}
                              {content.content_description && (
                                <div className="text-gray-600">{content.content_description}</div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {renderLinks(content.content_data)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {index === 0 ? formatDate(evaluation.evaluation_date) : ""}
                          </td>
                        </tr>
                      ));
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-6 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    หน้า {currentPage} จาก {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      ก่อนหน้า
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      ถัดไป
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Information Section */}
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-[#01385f] mb-6 text-center">
                เกี่ยวกับการประเมิน ITA
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">การประเมินคุณธรรม (Integrity Assessment)</h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>การประเมินพฤติกรรมและการปฏิบัติงานของเจ้าหน้าที่</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>การยึดมั่นในความถูกต้อง ความเป็นธรรม</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>การปฏิบัติตามจรรยาบรรณวิชาชีพ</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">การประเมินความโปร่งใส (Transparency Assessment)</h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <span>การเปิดเผยข้อมูลข่าวสารของหน่วยงาน</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <span>การมีส่วนร่วมของประชาชนในการตัดสินใจ</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <span>ความสามารถในการเข้าถึงข้อมูลสาธารณะ</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 bg-blue-50 rounded-lg p-6">
                <h4 className="font-semibold text-blue-800 mb-3 text-center">เกณฑ์การประเมิน</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                    <div className="text-sm font-medium">85-100</div>
                    <div className="text-xs text-gray-600">ดีเยี่ยม</div>
                  </div>
                  <div className="text-center">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full mx-auto mb-2"></div>
                    <div className="text-sm font-medium">75-84</div>
                    <div className="text-xs text-gray-600">ดีมาก</div>
                  </div>
                  <div className="text-center">
                    <div className="w-4 h-4 bg-orange-500 rounded-full mx-auto mb-2"></div>
                    <div className="text-sm font-medium">65-74</div>
                    <div className="text-xs text-gray-600">ดี</div>
                  </div>
                  <div className="text-center">
                    <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-2"></div>
                    <div className="text-sm font-medium">ต่ำกว่า 65</div>
                    <div className="text-xs text-gray-600">ปานกลาง</div>
                  </div>
                </div>
              </div>
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