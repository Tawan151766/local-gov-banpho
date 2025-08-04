"use client";
import { useState } from "react";
import Link from "next/link";
import {
  SearchOutlined,
  RestOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { GlassWater, FileText, Calendar, User } from "lucide-react";

export default function TrackingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Mock data สำหรับการติดตาม
  const trackingData = [
    {
      id: "WS-2024-001",
      serviceType: "water-support",
      title: "แบบคำร้องขอสนับสนุนน้ำอุปโภค-บริโภค",
      applicantName: "นายสมชาย ใจดี",
      submitDate: "2024-01-15",
      status: "approved",
      statusText: "อนุมัติแล้ว",
      lastUpdate: "2024-01-20",
      description: "คำร้องขอน้ำสะอาดสำหรับครัวเรือน",
    },
    {
      id: "WB-2024-002",
      serviceType: "wastebin-request",
      title: "แบบขอรับถังขยะมูลฝอย และสิ่งปฏิกูล",
      applicantName: "นางสาวมาลี สวยงาม",
      submitDate: "2024-01-18",
      status: "pending",
      statusText: "รอพิจารณา",
      lastUpdate: "2024-01-18",
      description: "ขอรับถังขยะสำหรับบ้านเลขที่ 123",
    },
    {
      id: "GR-2024-003",
      serviceType: "general-request",
      title: "คำร้องทั่วไป",
      applicantName: "นายประเสริฐ มั่งมี",
      submitDate: "2024-01-10",
      status: "in-progress",
      statusText: "กำลังดำเนินการ",
      lastUpdate: "2024-01-22",
      description: "แจ้งปัญหาไฟฟ้าสาธารณะ",
    },
    {
      id: "WC-2024-004",
      serviceType: "waste-collection",
      title: "คำร้องขอรับบริการจัดเก็บขยะ",
      applicantName: "นางวิไล รักสะอาด",
      submitDate: "2024-01-12",
      status: "rejected",
      statusText: "ไม่อนุมัติ",
      lastUpdate: "2024-01-25",
      description: "ขอบริการจัดเก็บขยะพิเศษ",
    },
    {
      id: "WS-2024-005",
      serviceType: "water-support",
      title: "แบบคำร้องขอสนับสนุนน้ำอุปโภค-บริโภค",
      applicantName: "นายสุชาติ น้ำใส",
      submitDate: "2024-01-25",
      status: "pending",
      statusText: "รอพิจารณา",
      lastUpdate: "2024-01-25",
      description: "คำร้องขอน้ำสำหรับการเกษตร",
    },
  ];

  const serviceTypes = [
    { value: "all", label: "ทุกบริการ" },
    {
      value: "water-support",
      label: "ขอสนับสนุนน้ำ",
      icon: <GlassWater size={16} />,
    },
    {
      value: "wastebin-request",
      label: "ขอรับถังขยะ",
      icon: <DeleteOutlined />,
    },
    { value: "general-request", label: "คำร้องทั่วไป", icon: <EditOutlined /> },
    { value: "waste-collection", label: "จัดเก็บขยะ", icon: <RestOutlined /> },
  ];

  const statusTypes = [
    { value: "all", label: "ทุกสถานะ" },
    {
      value: "pending",
      label: "รอพิจารณา",
      color: "text-yellow-600",
      icon: <ClockCircleOutlined />,
    },
    {
      value: "in-progress",
      label: "กำลังดำเนินการ",
      color: "text-blue-600",
      icon: <ExclamationCircleOutlined />,
    },
    {
      value: "approved",
      label: "อนุมัติแล้ว",
      color: "text-green-600",
      icon: <CheckCircleOutlined />,
    },
    {
      value: "rejected",
      label: "ไม่อนุมัติ",
      color: "text-red-600",
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

  const getServiceIcon = (serviceType) => {
    const service = serviceTypes.find((s) => s.value === serviceType);
    return service?.icon || <FileText size={16} />;
  };

  // Filter data based on search query, service type, and status
  const filteredData = trackingData.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesService =
      selectedService === "all" || item.serviceType === selectedService;
    const matchesStatus =
      selectedStatus === "all" || item.status === selectedStatus;

    return matchesSearch && matchesService && matchesStatus;
  });

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

      {/* Search and Filter Section */}
      <div className="w-full max-w-[1268px] mb-6">
        <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-6 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Box */}
            <div className="relative">
              <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหาด้วยเลขที่คำร้อง, ชื่อผู้ยื่น หรือชื่อบริการ"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01bdcc] focus:border-transparent outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Service Type Filter */}
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01bdcc] focus:border-transparent outline-none"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
            >
              {serviceTypes.map((service) => (
                <option key={service.value} value={service.value}>
                  {service.label}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01bdcc] focus:border-transparent outline-none"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {statusTypes.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="w-full max-w-[1268px]">
        <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-6 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#01385f]">
              ผลการค้นหา ({filteredData.length} รายการ)
            </h2>
            <Link
              href="/e-service"
              className="bg-[#01bdcc] text-white px-4 py-2 rounded-lg hover:bg-[#01a5b0] transition-colors duration-200"
            >
              ← กลับไปยังหน้าบริการ
            </Link>
          </div>

          {filteredData.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <SearchOutlined style={{ fontSize: 48 }} />
              </div>
              <p className="text-gray-600 text-lg">ไม่พบข้อมูลที่ค้นหา</p>
              <p className="text-gray-500 text-sm mt-2">
                กรุณาลองเปลี่ยนคำค้นหาหรือเงื่อนไขการกรอง
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredData.map((item) => (
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
                        )} bg-gray-50`}
                      >
                        {getStatusIcon(item.status)}
                        <span>{item.statusText}</span>
                      </div>

                      <button className="flex items-center gap-2 px-4 py-2 bg-[#01bdcc] text-white rounded-lg hover:bg-[#01a5b0] transition-colors duration-200">
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

      {/* Quick Stats */}
      <div className="w-full max-w-[1268px] mt-8">
        <div className="bg-white bg-opacity-90 rounded-2xl shadow-md p-6 backdrop-blur-sm">
          <h4 className="text-lg font-semibold text-[#01385f] mb-4 text-center">
            สถิติคำร้องในระบบ
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-yellow-600 text-2xl font-bold">
                {
                  trackingData.filter((item) => item.status === "pending")
                    .length
                }
              </div>
              <div className="text-sm text-gray-600">รอพิจารณา</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-600 text-2xl font-bold">
                {
                  trackingData.filter((item) => item.status === "in-progress")
                    .length
                }
              </div>
              <div className="text-sm text-gray-600">กำลังดำเนินการ</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-green-600 text-2xl font-bold">
                {
                  trackingData.filter((item) => item.status === "approved")
                    .length
                }
              </div>
              <div className="text-sm text-gray-600">อนุมัติแล้ว</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-red-600 text-2xl font-bold">
                {
                  trackingData.filter((item) => item.status === "rejected")
                    .length
                }
              </div>
              <div className="text-sm text-gray-600">ไม่อนุมัติ</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
