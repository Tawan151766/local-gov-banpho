"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import {
  FileText,
  Calendar,
  User,
  Trash2,
  Waves,
  Edit,
  Settings,
} from "lucide-react";
import { apiCall } from "@/lib/api";

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const requestTypes = [
    { value: "all", label: "ทั้งหมด" },
    { value: "wastebin-request", label: "ขอรับถังขยะ" },
    { value: "waste-collection", label: "จัดเก็บขยะ" },
    { value: "water-support", label: "สนับสนุนน้ำ" },
    { value: "general-request", label: "คำร้องทั่วไป" },
  ];

  const statusTypes = [
    { value: "all", label: "ทั้งหมด" },
    { value: "pending", label: "รอพิจารณา", color: "text-yellow-600", bgColor: "bg-yellow-50" },
    { value: "processing", label: "กำลังดำเนินการ", color: "text-blue-600", bgColor: "bg-blue-50" },
    { value: "completed", label: "เสร็จสิ้น", color: "text-green-600", bgColor: "bg-green-50" },
    { value: "rejected", label: "ไม่อนุมัติ", color: "text-red-600", bgColor: "bg-red-50" },
  ];

  useEffect(() => {
    fetchRequests();
  }, [selectedType, selectedStatus, searchTerm, currentPage]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const endpoints = [];
      
      if (selectedType === "all" || selectedType === "wastebin-request") {
        endpoints.push("wastebin-requests");
      }
      if (selectedType === "all" || selectedType === "waste-collection") {
        endpoints.push("waste-collection-requests");
      }
      if (selectedType === "all" || selectedType === "water-support") {
        endpoints.push("water-support-requests");
      }
      if (selectedType === "all" || selectedType === "general-request") {
        endpoints.push("general-requests");
      }

      const promises = endpoints.map(endpoint => {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: "10",
        });
        
        if (searchTerm) params.append("search", searchTerm);
        if (selectedStatus !== "all") params.append("status", selectedStatus);
        
        return apiCall(`/${endpoint}?${params}`).catch(() => ({ success: false, data: [] }));
      });

      const results = await Promise.all(promises);
      let allRequests = [];

      // Process results and add type information
      results.forEach((result, index) => {
        if (result.success && result.data) {
          const typeMap = {
            0: "wastebin-request",
            1: "waste-collection", 
            2: "water-support",
            3: "general-request"
          };
          
          const requestsWithType = result.data.map(item => ({
            ...item,
            serviceType: selectedType === "all" ? typeMap[index] : selectedType,
            displayId: `${typeMap[index] === "wastebin-request" ? "WB" : 
                        typeMap[index] === "waste-collection" ? "WC" :
                        typeMap[index] === "water-support" ? "WS" : "GR"}-${item.id}`,
            title: typeMap[index] === "wastebin-request" ? "แบบขอรับถังขยะมูลฝอย และสิ่งปฏิกูล" :
                   typeMap[index] === "waste-collection" ? "คำร้องขอรับบริการจัดเก็บขยะ" :
                   typeMap[index] === "water-support" ? "แบบคำร้องขอสนับสนุนน้ำอุปโภค-บริโภค" :
                   "คำร้องทั่วไป"
          }));
          
          allRequests = [...allRequests, ...requestsWithType];
        }
      });

      // Sort by created_at
      allRequests.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      setRequests(allRequests);
      setTotalPages(Math.ceil(allRequests.length / 10));
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <ClockCircleOutlined />;
      case "processing": return <ExclamationCircleOutlined />;
      case "completed": return <CheckCircleOutlined />;
      case "rejected": return <CloseCircleOutlined />;
      default: return <ClockCircleOutlined />;
    }
  };

  const getStatusColor = (status) => {
    const statusType = statusTypes.find(s => s.value === status);
    return statusType?.color || "text-gray-600";
  };

  const getStatusBgColor = (status) => {
    const statusType = statusTypes.find(s => s.value === status);
    return statusType?.bgColor || "bg-gray-50";
  };

  const getServiceIcon = (serviceType) => {
    switch (serviceType) {
      case "water-support": return <Waves size={16} />;
      case "wastebin-request": return <Trash2 size={16} />;
      case "general-request": return <Edit size={16} />;
      case "waste-collection": return <FileText size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const handleStatusUpdate = (request) => {
    setSelectedRequest(request);
    setNewStatus(request.status || "pending");
    setShowStatusModal(true);
  };

  const updateRequestStatus = async () => {
    if (!selectedRequest || !newStatus) return;

    try {
      const endpoint = selectedRequest.serviceType === "wastebin-request" ? "wastebin-requests" :
                      selectedRequest.serviceType === "waste-collection" ? "waste-collection-requests" :
                      selectedRequest.serviceType === "water-support" ? "water-support-requests" :
                      "general-requests";

      const response = await apiCall(`/${endpoint}`, {
        method: "PATCH",
        body: JSON.stringify({
          id: selectedRequest.id,
          status: newStatus
        })
      });

      if (response.success) {
        // Update local state
        setRequests(prev => prev.map(req => 
          req.id === selectedRequest.id && req.serviceType === selectedRequest.serviceType
            ? { ...req, status: newStatus }
            : req
        ));
        
        setShowStatusModal(false);
        setSelectedRequest(null);
      } else {
        console.error("Failed to update status:", response.error);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">แดชบอร์ดผู้ดูแลระบบ</h1>
              <p className="text-gray-600 mt-1">จัดการคำร้องขอรับบริการทั้งหมด</p>
            </div>
            <Link
              href="/e-service"
              className="bg-[#01bdcc] text-white px-4 py-2 rounded-lg hover:bg-[#01a5b0] transition-colors duration-200"
            >
              ← กลับไปยังหน้าบริการ
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ประเภทบริการ
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01bdcc] focus:border-transparent"
              >
                {requestTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                สถานะ
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01bdcc] focus:border-transparent"
              >
                {statusTypes.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ค้นหา
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="ชื่อผู้ยื่น, เลขบัตรประชาชน..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01bdcc] focus:border-transparent"
                />
                <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setCurrentPage(1);
                  fetchRequests();
                }}
                className="w-full bg-[#01bdcc] text-white px-4 py-2 rounded-lg hover:bg-[#01a5b0] transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <FilterOutlined />
                กรองข้อมูล
              </button>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              รายการคำร้อง ({requests.length} รายการ)
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#01bdcc] mx-auto"></div>
              <p className="text-gray-600 mt-4">กำลังโหลดข้อมูล...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="p-12 text-center">
              <FileText size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">ไม่พบคำร้องที่ตรงกับเงื่อนไข</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {requests.map((request) => (
                <div key={`${request.serviceType}-${request.id}`} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-[#01bdcc]">
                          {getServiceIcon(request.serviceType)}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {request.title}
                        </h3>
                        <span className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-600">
                          #{request.displayId}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <User size={14} />
                          <span>ผู้ยื่น: {request.requester_title}{request.requester_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          <span>
                            วันที่ยื่น: {new Date(request.created_at).toLocaleDateString("th-TH")}
                          </span>
                        </div>
                        {request.requester_id_card && (
                          <div className="flex items-center gap-2">
                            <FileText size={14} />
                            <span>บัตรประชาชน: {request.requester_id_card}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${getStatusColor(request.status)} ${getStatusBgColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        <span>{statusTypes.find(s => s.value === request.status)?.label || "รอพิจารณา"}</span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusUpdate(request)}
                          className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                        >
                          <EditOutlined />
                          <span>อัปเดตสถานะ</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Update Modal */}
        {showStatusModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">
                  อัปเดตสถานะคำร้อง #{selectedRequest.displayId}
                </h3>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    สถานะใหม่
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01bdcc] focus:border-transparent"
                  >
                    {statusTypes.filter(s => s.value !== "all").map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={updateRequestStatus}
                    className="px-4 py-2 bg-[#01bdcc] text-white rounded-lg hover:bg-[#01a5b0] transition-colors duration-200"
                  >
                    อัปเดตสถานะ
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}