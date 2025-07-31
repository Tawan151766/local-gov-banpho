"use client";
import { useState } from "react";

export default function LocalDevelopmentPlanPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");

  // Sample data - replace with actual API call
  const developmentPlans = [
    {
      id: 1,
      plan_name: "ประมาณการใช้จ่ายเหมายจ่ายจริง (พ.ศ. 2566 - 2570) แผ่นที่ครั้งที่ 1/2566 ของเทศบาลตำบลบ้านโพธิ์",
      description: "เอกสารแผนประมาณการใช้จ่ายเหมายจ่ายจริง ปี 2566-2570",
      plan_year: 2566,
      file_name: "แผนประมาณการ_2566-2570_1.pdf",
      file_url: "/documents/plans/plan_2566_1.pdf",
      file_size: "52 หน่วย",
      file_type: "PDF",
      created_at: "2566-01-15",
      status: "active"
    },
    {
      id: 2,
      plan_name: "ประมาณการใช้จ่ายเหมายจ่ายจริง (พ.ศ.2561-2565) เพิ่มเติม ครั้งที่ 9 พ.ศ.2565",
      description: "เอกสารแผนประมาณการใช้จ่ายเหมายจ่ายจริง ปี 2561-2565 เพิ่มเติม",
      plan_year: 2565,
      file_name: "แผนประมาณการ_2561-2565_เพิ่มเติม.pdf",
      file_url: "/documents/plans/plan_2565_add.pdf",
      file_size: "28 หน่วย",
      file_type: "PDF",
      created_at: "2565-03-20",
      status: "active"
    },
    {
      id: 3,
      plan_name: "แผนพัฒนาท้องถิ่น (พ.ศ.2566 - 2570)",
      description: "แผนพัฒนาท้องถิ่น 5 ปี พ.ศ. 2566-2570",
      plan_year: 2566,
      file_name: "แผนพัฒนาท้องถิ่น_2566-2570.pdf",
      file_url: "/documents/plans/local_development_2566.pdf",
      file_size: "19 หน่วย",
      file_type: "PDF",
      created_at: "2566-02-10",
      status: "active"
    },
    {
      id: 4,
      plan_name: "ประมาณการใช้จ่ายเหมายจ่ายจริง (พ.ศ.2561-2565) เพิ่มเติม ครั้งที่ 8 พ.ศ.2565",
      description: "เอกสารแผนประมาณการใช้จ่ายเหมายจ่ายจริง เพิ่มเติมครั้งที่ 8",
      plan_year: 2565,
      file_name: "แผนประมาณการ_2565_8.pdf",
      file_url: "/documents/plans/plan_2565_8.pdf",
      file_size: "29 หน่วย",
      file_type: "PDF",
      created_at: "2565-08-15",
      status: "active"
    },
    {
      id: 5,
      plan_name: "ประมาณการใช้จ่ายเหมายจ่ายจริง (พ.ศ.2561-2565) เพิ่มเติม ครั้งที่ 7 พ.ศ.2565",
      description: "เอกสารแผนประมาณการใช้จ่ายเหมายจ่ายจริง เพิ่มเติมครั้งที่ 7",
      plan_year: 2565,
      file_name: "แผนประมาณการ_2565_7.pdf",
      file_url: "/documents/plans/plan_2565_7.pdf",
      file_size: "18 หน่วย",
      file_type: "PDF",
      created_at: "2565-07-20",
      status: "active"
    },
    {
      id: 6,
      plan_name: "แผนพัฒนาท้องถิ่น (พ.ศ.2561-2565) เพิ่มเติม ครั้งที่ 4 พ.ศ.2562",
      description: "แผนพัฒนาท้องถิ่น 5 ปี เพิ่มเติมครั้งที่ 4",
      plan_year: 2562,
      file_name: "แผนพัฒนาท้องถิ่น_2562_4.pdf",
      file_url: "/documents/plans/local_development_2562_4.pdf",
      file_size: "39 หน่วย",
      file_type: "PDF",
      created_at: "2562-05-10",
      status: "active"
    },
    {
      id: 7,
      plan_name: "ประมาณการใช้จ่ายเหมายจ่ายจริง (พ.ศ.2561-2565) เพิ่มเติม ครั้งที่ 4 พ.ศ.2562",
      description: "เอกสารแผนประมาณการใช้จ่ายเหมายจ่ายจริง เพิ่มเติมครั้งที่ 4",
      plan_year: 2562,
      file_name: "แผนประมาณการ_2562_4.pdf",
      file_url: "/documents/plans/plan_2562_4.pdf",
      file_size: "29 หน่วย",
      file_type: "PDF",
      created_at: "2562-04-15",
      status: "active"
    }
  ];

  const availableYears = [...new Set(developmentPlans.map(plan => plan.plan_year))].sort((a, b) => b - a);

  const filteredPlans = developmentPlans.filter(plan => {
    const matchesSearch = plan.plan_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = selectedYear === "all" || plan.plan_year.toString() === selectedYear;
    return matchesSearch && matchesYear;
  });

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

  const getFileIcon = (fileType) => {
    switch (fileType?.toLowerCase()) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      default:
        return '📋';
    }
  };

  const handleDownload = (plan) => {
    if (plan.file_url) {
      window.open(plan.file_url, '_blank');
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
        <div className="bg-gradient-to-r from-[#03bdca] to-[#01bdcc] rounded-[36px] shadow-lg w-full flex flex-col md:flex-row items-center px-6 py-6 relative backdrop-blur-sm">
          <div className="bg-white rounded-full shadow-md w-32 h-16 flex items-center justify-center mb-4 md:mb-0 md:absolute md:left-6 md:top-1/2 md:-translate-y-1/2 border-2 border-[#01bdcc]">
            <span className="text-[#01385f] font-bold text-xl tracking-wide">
              แผนพัฒนา
            </span>
          </div>
          <div className="flex-1 flex flex-wrap flex-row items-center justify-center gap-6 md:gap-12 md:ml-40">
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              แผนพัฒนาท้องถิ่น
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              Local Development Plan
            </span>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white bg-opacity-90 rounded-2xl shadow-md p-4 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="ค้นหาแผนพัฒนา..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:w-48">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">ทุกปี</option>
                {availableYears.map(year => (
                  <option key={year} value={year}>พ.ศ. {year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full max-w-[1268px]">
        {filteredPlans.length === 0 ? (
          // No Data State
          <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 text-center backdrop-blur-sm">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">ไม่มีข้อมูลแผนพัฒนา</h2>
            <p className="text-gray-600 mb-6">ไม่พบแผนพัฒนาท้องถิ่นที่ตรงกับเงื่อนไขการค้นหา</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Plans List */}
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg backdrop-blur-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-[#01385f] text-center">
                  แผนพัฒนาท้องถิ่น
                </h3>
                <p className="text-gray-600 text-center mt-2">
                  พบ {filteredPlans.length} รายการ
                </p>
              </div>

              <div className="p-4">
                <div className="space-y-3">
                  {filteredPlans.map((plan, index) => (
                    <div 
                      key={plan.id} 
                      className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer border border-gray-200"
                      onClick={() => handleDownload(plan)}
                    >
                      {/* File Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xl">{getFileIcon(plan.file_type)}</span>
                        </div>
                      </div>

                      {/* Plan Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm leading-5 mb-1">
                          {plan.plan_name}
                        </h4>
                        {plan.description && (
                          <p className="text-gray-600 text-xs mb-2">
                            {plan.description}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                          <span>พ.ศ. {plan.plan_year}</span>
                          {plan.file_size && (
                            <span>[{plan.file_size}]</span>
                          )}
                          <span>{formatDate(plan.created_at)}</span>
                        </div>
                      </div>

                      {/* Download Button */}
                      <div className="flex-shrink-0">
                        <div className="bg-[#01bdcc] text-white px-3 py-1 rounded-lg text-xs hover:bg-[#019aa5] transition-colors">
                          ดาวน์โหลด
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Information Section */}
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-[#01385f] mb-6 text-center">
                เกี่ยวกับแผนพัฒนาท้องถิ่น
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">วัตถุประสงค์</h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>เพื่อกำหนดทิศทางการพัฒนาท้องถิ่น</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>เพื่อเป็นกรอบในการจัดทำงบประมาณรายจ่าย</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>เพื่อเป็นเครื่องมือในการบริหารงาน</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">ประเภทแผน</h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <span>แผนพัฒนาท้องถิ่น 5 ปี</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <span>แผนการดำเนินงานประจำปี</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <span>แผนเพิ่มเติม/แก้ไข</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 bg-blue-50 rounded-lg p-6">
                <h4 className="font-semibold text-blue-800 mb-3 text-center">ยุทธศาสตร์การพัฒนา</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <span className="text-white text-xl">🏛️</span>
                    </div>
                    <div className="text-sm font-medium">การบริหารจัดการ</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <span className="text-white text-xl">🌱</span>
                    </div>
                    <div className="text-sm font-medium">การพัฒนาเศรษฐกิจ</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <span className="text-white text-xl">👥</span>
                    </div>
                    <div className="text-sm font-medium">การพัฒนาสังคม</div>
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
            แผนพัฒนาท้องถิ่น
          </h4>
          <p className="text-gray-600 text-sm">
            เทศบาลตำบลบ้านโพธิ์ มุ่งมั่นในการพัฒนาท้องถิ่นอย่างยั่งยืน เพื่อความเป็นอยู่ที่ดีของประชาชน
          </p>
        </div>
      </div>
    </div>
  );
}