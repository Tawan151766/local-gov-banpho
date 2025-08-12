"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  SearchOutlined,
  DeleteOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { FileText, Calendar, User, Trash2, Waves, Edit } from "lucide-react";
import { apiCall } from "@/lib/api";

export default function TrackingPage() {
  const [idCardSearch, setIdCardSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/admin/login");
    }
  }, [session, status, router]);

  if (status === "loading" || !session) {
    return null;
  }

  // Function to search requests by ID card
  const searchByIdCard = async () => {
    if (!idCardSearch.trim()) {
      setErrors({ idCard: "กรุณากรอกเลขบัตรประชาชน" });
      return;
    }

    if (idCardSearch.length !== 13) {
      setErrors({ idCard: "เลขบัตรประชาชนต้องมี 13 หลัก" });
      return;
    }

    setIsSearching(true);
    setErrors({});
    setSearchResults([]);

    try {
      // Search in all request tables
      const searchPromises = [
        // Wastebin requests
        apiCall(`/wastebin-requests?search=${idCardSearch}`).catch(() => ({
          success: false,
          data: [],
        })),
        // Waste collection requests
        apiCall(`/waste-collection-requests?search=${idCardSearch}`).catch(
          () => ({ success: false, data: [] })
        ),
        // Water support requests
        apiCall(`/water-support-requests?search=${idCardSearch}`).catch(() => ({
          success: false,
          data: [],
        })),
        // General requests
        apiCall(`/general-requests?search=${idCardSearch}`).catch(() => ({
          success: false,
          data: [],
        })),
      ];

      const results = await Promise.all(searchPromises);

      let allResults = [];

      // Process wastebin requests
      if (results[0].success && results[0].data) {
        const wastebinResults = results[0].data
          .filter((item) => item.requester_id_card === idCardSearch)
          .map((item) => ({
            id: `WB-${item.id}`,
            serviceType: "wastebin-request",
            title: "แบบขอรับถังขยะมูลฝอย และสิ่งปฏิกูล",
            applicantName: `${item.requester_title}${item.requester_name}`,
            submitDate: item.request_date,
            status: item.status,
            statusText: getStatusText(item.status),
            lastUpdate: item.updated_at,
            description: `ขอรับถังขยะ จำนวน ${item.bin_quantity} ใบ`,
            details: item,
          }));
        allResults = [...allResults, ...wastebinResults];
      }

      // Process waste collection requests
      if (results[1].success && results[1].data) {
        const wasteCollectionResults = results[1].data
          .filter((item) => item.requester_id_card === idCardSearch)
          .map((item) => ({
            id: `WC-${item.id}`,
            serviceType: "waste-collection",
            title: "คำร้องขอรับบริการจัดเก็บขยะ",
            applicantName: `${item.requester_title}${item.requester_name}`,
            submitDate: item.request_date,
            status: item.status,
            statusText: getStatusText(item.status),
            lastUpdate: item.updated_at,
            description: item.reason_for_request || "ขอรับบริการจัดเก็บขยะ",
            details: item,
          }));
        allResults = [...allResults, ...wasteCollectionResults];
      }

      // Process water support requests
      if (results[2].success && results[2].data) {
        const waterSupportResults = results[2].data
          .filter((item) => item.requester_id_card === idCardSearch)
          .map((item) => ({
            id: `WS-${item.id}`,
            serviceType: "water-support",
            title: "แบบคำร้องขอสนับสนุนน้ำอุปโภค-บริโภค",
            applicantName: `${item.requester_title}${item.requester_name}`,
            submitDate: item.request_date,
            status: item.status,
            statusText: getStatusText(item.status),
            lastUpdate: item.updated_at,
            description: item.water_needs || "ขอสนับสนุนน้ำอุปโภค-บริโภค",
            details: item,
          }));
        allResults = [...allResults, ...waterSupportResults];
      }

      // Process general requests
      if (results[3].success && results[3].data) {
        const generalResults = results[3].data
          .filter((item) => item.requester_id_card === idCardSearch)
          .map((item) => ({
            id: `GR-${item.id}`,
            serviceType: "general-request",
            title: "คำร้องทั่วไป",
            applicantName: `${item.requester_title}${item.requester_name}`,
            submitDate: item.request_date,
            status: item.status,
            statusText: getStatusText(item.status),
            lastUpdate: item.updated_at,
            description: item.request_subject || "คำร้องทั่วไป",
            details: item,
          }));
        allResults = [...allResults, ...generalResults];
      }

      // Sort by submit date (newest first)
      allResults.sort(
        (a, b) => new Date(b.submitDate) - new Date(a.submitDate)
      );

      setSearchResults(allResults);
      setHasSearched(true);
    } catch (error) {
      console.error("Search error:", error);
      setErrors({ submit: "เกิดข้อผิดพลาดในการค้นหา กรุณาลองใหม่อีกครั้ง" });
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "รอพิจารณา";
      case "processing":
        return "กำลังดำเนินการ";
      case "completed":
        return "เสร็จสิ้น";
      case "rejected":
        return "ไม่อนุมัติ";
      default:
        return "รอพิจารณา";
    }
  };

  const statusTypes = [
    {
      value: "pending",
      label: "รอพิจารณา",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      icon: <ClockCircleOutlined />,
    },
    {
      value: "processing",
      label: "กำลังดำเนินการ",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      icon: <ExclamationCircleOutlined />,
    },
    {
      value: "completed",
      label: "เสร็จสิ้น",
      color: "text-green-600",
      bgColor: "bg-green-50",
      icon: <CheckCircleOutlined />,
    },
    {
      value: "rejected",
      label: "ไม่อนุมัติ",
      color: "text-red-600",
      bgColor: "bg-red-50",
      icon: <CloseCircleOutlined />,
    },
  ];

  const getStatusIcon = (status) => {
    const statusType = statusTypes.find((s) => s.value === status);
    return statusType?.icon || <ClockCircleOutlined />;
  };

  const getStatusColor = (status) => {
    const statusType = statusTypes.find((s) => s.value === status);
    return statusType?.color || "text-gray-600";
  };

  const getStatusBgColor = (status) => {
    const statusType = statusTypes.find((s) => s.value === status);
    return statusType?.bgColor || "bg-gray-50";
  };

  const getServiceIcon = (serviceType) => {
    switch (serviceType) {
      case "water-support":
        return <Waves size={16} />;
      case "wastebin-request":
        return <Trash2 size={16} />;
      case "general-request":
        return <Edit size={16} />;
      case "waste-collection":
        return <DeleteOutlined />;
      default:
        return <FileText size={16} />;
    }
  };

  const handleSearch = () => {
    searchByIdCard();
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedRequest(null);
  };

  return (
    <div
      className="w-full min-h-screen py-8 px-2 md:px-8 flex flex-col items-center bg-transparent"
      style={{
        backgroundImage:
          'linear-gradient(180deg, rgba(239, 228, 212, 0.6) 0%, rgba(1, 189, 204, 0.6) 100%), url("/image/Boat.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Header Section */}
      <div className="w-full max-w-[1268px] flex flex-col gap-4 mb-8">
        <div className="bg-gradient-to-r from-[#03bdca] to-[#01bdcc] rounded-[36px] shadow-lg w-full flex flex-col md:flex-row items-center px-6 py-6 relative backdrop-blur-sm">
          <div className="bg-white rounded-full shadow-md w-32 h-16 flex items-center justify-center mb-4 md:mb-0 md:absolute md:left-6 md:top-1/2 md:-translate-y-1/2 border-2 border-[#01bdcc]">
            <span className="text-[#01385f] font-bold text-lg tracking-wide">
              Tracking
            </span>
          </div>
          <div className="flex-1 flex flex-wrap flex-row items-center justify-center gap-6 md:gap-12 md:ml-40">
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              ติดตามสถานะคำร้อง
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              Request Tracking
            </span>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="w-full max-w-[1268px] mb-6">
        <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-[#01385f] mb-4 text-center">
            ค้นหาคำร้องด้วยเลขบัตรประชาชน
          </h3>

          <div className="max-w-md mx-auto">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                เลขบัตรประชาชน <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="กรอกเลขบัตรประชาชน 13 หลัก"
                  className={`text-gray-700 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#01bdcc] focus:border-transparent outline-none ${
                    errors.idCard ? "border-red-500" : "border-gray-300"
                  }`}
                  value={idCardSearch}
                  onChange={(e) => {
                    setIdCardSearch(e.target.value);
                    if (errors.idCard) {
                      setErrors((prev) => ({ ...prev, idCard: "" }));
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      searchByIdCard();
                    }
                  }}
                  maxLength={13}
                />
              </div>
              {errors.idCard && (
                <p className="text-red-500 text-sm mt-1">{errors.idCard}</p>
              )}
            </div>

            <button
              onClick={handleSearch}
              disabled={isSearching}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                isSearching
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-[#01bdcc] text-white hover:bg-[#01a5b0] shadow-lg hover:shadow-xl"
              }`}
            >
              {isSearching ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  กำลังค้นหา...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <SearchOutlined />
                  ค้นหาคำร้อง
                </span>
              )}
            </button>

            {errors.submit && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm text-center">
                  {errors.submit}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      {hasSearched && (
        <div className="w-full max-w-[1268px]">
          <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-6 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#01385f]">
                ผลการค้นหา ({searchResults.length} รายการ)
              </h2>
              <Link
                href="/e-service"
                className="bg-[#01bdcc] text-white px-4 py-2 rounded-lg hover:bg-[#01a5b0] transition-colors duration-200"
              >
                ← กลับไปยังหน้าบริการ
              </Link>
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <SearchOutlined style={{ fontSize: 48 }} />
                </div>
                <p className="text-gray-600 text-lg">ไม่พบคำร้องที่ค้นหา</p>
                <p className="text-gray-500 text-sm mt-2">
                  ไม่พบคำร้องที่ใช้เลขบัตรประชาชนนี้ในระบบ
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="text-[#01bdcc]">
                            {getServiceIcon(item.serviceType)}
                          </div>
                          <h3 className="text-lg font-semibold text-[#01385f]">
                            {item.title}
                          </h3>
                          <span className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-600">
                            #{item.id}
                          </span>
                        </div>

                        <p className="text-gray-700 mb-2">{item.description}</p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <User size={14} />
                            <span>ผู้ยื่น: {item.applicantName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>
                              วันที่ยื่น:{" "}
                              {new Date(item.submitDate).toLocaleDateString(
                                "th-TH"
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ClockCircleOutlined />
                            <span>
                              อัปเดตล่าสุด:{" "}
                              {new Date(item.lastUpdate).toLocaleDateString(
                                "th-TH"
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                        <div
                          className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${getStatusColor(
                            item.status
                          )} ${getStatusBgColor(item.status)}`}
                        >
                          {getStatusIcon(item.status)}
                          <span>{item.statusText}</span>
                        </div>

                        <button
                          onClick={() => handleViewDetails(item)}
                          className="flex items-center gap-2 px-4 py-2 bg-[#01bdcc] text-white rounded-lg hover:bg-[#01a5b0] transition-colors duration-200"
                        >
                          <EyeOutlined />
                          <span>ดูรายละเอียด</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      {!hasSearched && (
        <div className="w-full max-w-[1268px] mt-8">
          <div className="bg-white bg-opacity-90 rounded-2xl shadow-md p-6 backdrop-blur-sm">
            <h4 className="text-lg font-semibold text-[#01385f] mb-4 text-center">
              วิธีการใช้งาน
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#01bdcc] text-white rounded-full flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      กรอกเลขบัตรประชาชน
                    </p>
                    <p>กรอกเลขบัตรประชาชน 13 หลักที่ใช้ยื่นคำร้อง</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#01bdcc] text-white rounded-full flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">กดปุ่มค้นหา</p>
                    <p>ระบบจะค้นหาคำร้องทั้งหมดที่เกี่ยวข้อง</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#01bdcc] text-white rounded-full flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">ดูผลการค้นหา</p>
                    <p>ตรวจสอบสถานะและรายละเอียดคำร้องของคุณ</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#01bdcc] text-white rounded-full flex items-center justify-center text-xs font-bold">
                    4
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">ดูรายละเอียด</p>
                    <p>กดปุ่ม "ดูรายละเอียด" เพื่อดูข้อมูลเพิ่มเติม</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Results Stats */}
      {hasSearched && searchResults.length > 0 && (
        <div className="w-full max-w-[1268px] mt-8">
          <div className="bg-white bg-opacity-90 rounded-2xl shadow-md p-6 backdrop-blur-sm">
            <h4 className="text-lg font-semibold text-[#01385f] mb-4 text-center">
              สถิติคำร้องที่พบ
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-yellow-600 text-2xl font-bold">
                  {
                    searchResults.filter((item) => item.status === "pending")
                      .length
                  }
                </div>
                <div className="text-sm text-gray-600">รอพิจารณา</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-blue-600 text-2xl font-bold">
                  {
                    searchResults.filter((item) => item.status === "processing")
                      .length
                  }
                </div>
                <div className="text-sm text-gray-600">กำลังดำเนินการ</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-green-600 text-2xl font-bold">
                  {
                    searchResults.filter((item) => item.status === "completed")
                      .length
                  }
                </div>
                <div className="text-sm text-gray-600">เสร็จสิ้น</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-red-600 text-2xl font-bold">
                  {
                    searchResults.filter((item) => item.status === "rejected")
                      .length
                  }
                </div>
                <div className="text-sm text-gray-600">ไม่อนุมัติ</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#01385f]">
                  รายละเอียดคำร้อง #{selectedRequest.id}
                </h2>
                <button
                  onClick={closeDetailModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#01385f] border-b pb-2">
                    ข้อมูลทั่วไป
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        ประเภทบริการ
                      </label>
                      <p className="text-gray-800">{selectedRequest.title}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        ผู้ยื่นคำร้อง
                      </label>
                      <p className="text-gray-800">
                        {selectedRequest.applicantName}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        วันที่ยื่นคำร้อง
                      </label>
                      <p className="text-gray-800">
                        {new Date(
                          selectedRequest.submitDate
                        ).toLocaleDateString("th-TH", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        สถานะ
                      </label>
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          selectedRequest.status
                        )} ${getStatusBgColor(selectedRequest.status)}`}
                      >
                        {getStatusIcon(selectedRequest.status)}
                        <span>{selectedRequest.statusText}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        อัปเดตล่าสุด
                      </label>
                      <p className="text-gray-800">
                        {new Date(
                          selectedRequest.lastUpdate
                        ).toLocaleDateString("th-TH", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Detailed Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#01385f] border-b pb-2">
                    รายละเอียดเพิ่มเติม
                  </h3>
                  <div className="space-y-3">
                    {selectedRequest.details.requester_id_card && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          เลขบัตรประชาชน
                        </label>
                        <p className="text-gray-800">
                          {selectedRequest.details.requester_id_card}
                        </p>
                      </div>
                    )}
                    {selectedRequest.details.requester_age && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          อายุ
                        </label>
                        <p className="text-gray-800">
                          {selectedRequest.details.requester_age} ปี
                        </p>
                      </div>
                    )}
                    {selectedRequest.details.requester_phone && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          เบอร์โทรศัพท์
                        </label>
                        <p className="text-gray-800">
                          {selectedRequest.details.requester_phone}
                        </p>
                      </div>
                    )}
                    {selectedRequest.details.requester_house_number && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          ที่อยู่
                        </label>
                        <p className="text-gray-800">
                          {selectedRequest.details.requester_house_number} หมู่{" "}
                          {selectedRequest.details.requester_village}
                          {selectedRequest.details.requester_subdistrict &&
                            ` ${selectedRequest.details.requester_subdistrict}`}
                          {selectedRequest.details.requester_district &&
                            ` ${selectedRequest.details.requester_district}`}
                          {selectedRequest.details.requester_province &&
                            ` ${selectedRequest.details.requester_province}`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Service Specific Details */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-[#01385f] mb-4">
                  รายละเอียดการขอรับบริการ
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {selectedRequest.serviceType === "wastebin-request" && (
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">จำนวนถังขยะ:</span>{" "}
                        {selectedRequest.details.bin_quantity} ใบ
                      </p>
                      <p>
                        <span className="font-medium">สถานที่จัดส่ง:</span>{" "}
                        {selectedRequest.details.delivery_house_number} หมู่{" "}
                        {selectedRequest.details.delivery_village}
                      </p>
                    </div>
                  )}
                  {selectedRequest.serviceType === "waste-collection" && (
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">
                          รายละเอียดการจัดเก็บ:
                        </span>{" "}
                        {selectedRequest.details.collection_details}
                      </p>
                      <p>
                        <span className="font-medium">
                          เหตุผลในการขอรับบริการ:
                        </span>{" "}
                        {selectedRequest.details.reason_for_request}
                      </p>
                      <div className="mt-3">
                        <span className="font-medium">ประเภทขยะ:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedRequest.details.waste_type_household && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                              ขยะครัวเรือน
                            </span>
                          )}
                          {selectedRequest.details.waste_type_rental && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                              ขยะหอพัก
                            </span>
                          )}
                          {selectedRequest.details.waste_type_shop && (
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                              ขยะร้านค้า
                            </span>
                          )}
                          {selectedRequest.details.waste_type_factory && (
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                              ขยะโรงงาน
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedRequest.serviceType === "water-support" && (
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">ความต้องการน้ำ:</span>{" "}
                        {selectedRequest.details.water_needs}
                      </p>
                      <p>
                        <span className="font-medium">อาการที่พบ:</span>{" "}
                        {selectedRequest.details.symptoms_description}
                      </p>
                      {selectedRequest.details.family_members && (
                        <p>
                          <span className="font-medium">
                            จำนวนสมาชิกในครอบครัว:
                          </span>{" "}
                          {selectedRequest.details.family_members} คน
                        </p>
                      )}
                    </div>
                  )}
                  {selectedRequest.serviceType === "general-request" && (
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">เรื่อง:</span>{" "}
                        {selectedRequest.details.request_subject}
                      </p>
                      <p>
                        <span className="font-medium">รายละเอียด:</span>{" "}
                        {selectedRequest.details.request_details}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={closeDetailModal}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
