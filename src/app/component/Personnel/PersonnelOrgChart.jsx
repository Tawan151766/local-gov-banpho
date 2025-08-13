"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const PersonnelOrgChart = () => {
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState("all");
  const [highlightedDepartment, setHighlightedDepartment] = useState(null);
  const [personnelData, setPersonnelData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load personnel data from API
  useEffect(() => {
    const fetchPersonnelData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "/api/people-management?includeEmpty=true"
        );
        const result = await response.json();

        if (result.success) {
          setPersonnelData(result.data);
        } else {
          console.error("Failed to fetch personnel data:", result.error);
          // Fallback to empty data if API fails
          setPersonnelData(emptyPersonnelData);
        }
      } catch (error) {
        console.error("Error fetching personnel data:", error);
        // Fallback to empty data if API fails
        setPersonnelData(emptyPersonnelData);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonnelData();
  }, []);

  // Empty fallback data structure
  const emptyPersonnelData = {
    departments: {
      executive: { head: null, staff: [] },
      council: { head: null, staff: [] },
      councilOfficer: { head: null, staff: [] },
      clerk: { head: null, staff: [] },
      finance: { head: null, staff: [] },
      engineering: { head: null, staff: [] },
      education: { head: null, staff: [] },
      audit: { head: null, staff: [] },
    },
  };

  const PersonCard = ({ person, isHead = false, isExecutive = false }) => {
    // Add null check for person
    if (!person) {
      return null;
    }

    const getCardStyle = () => {
      if (person.is_empty) {
        return "bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 border-dashed shadow-md";
      }
      if (isExecutive) {
        return "bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 shadow-xl";
      }
      if (isHead) {
        return "bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 shadow-lg";
      }
      return "bg-white border border-gray-200 shadow-md hover:shadow-lg";
    };

    const getTextStyle = () => {
      if (isExecutive) return "text-amber-800";
      if (isHead) return "text-blue-800";
      return "text-gray-800";
    };

    return (
      <div
        className={`${getCardStyle()} rounded-xl p-6 text-center transition-all duration-300 hover:scale-105 hover:-translate-y-1 group`}
      >
        <div className="relative mb-4">
          <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 ring-4 ring-white shadow-lg">
            <img
              src={`https://banpho.sosmartsolution.com/storage${person.img}`}
              alt={person.full_name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                e.target.src =
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDgiIGN5PSI0OCIgcj0iNDgiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB4PSIyNCIgeT0iMjAiIHdpZHRoPSI0OCIgaGVpZ2h0PSI1NiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOUI5QkEwIj4KPHBhdGggZD0iTTEyIDEyYzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00LTQgMS43OS00IDQgMS43OSA0IDQgNHptMCAyYy0yLjY3IDAtOCAxLjM0LTggNHYyaDE2di0yYzAtMi42Ni01LjMzLTQtOC00eiIvPgo8L3N2Zz4KPC9zdmc+";
              }}
            />
          </div>
          {isExecutive && (
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          )}
        </div>
        <h3
          className={`font-bold text-lg mb-2 ${getTextStyle()} ${
            person.isEmpty ? "text-gray-400" : ""
          }`}
        >
          {person.full_name}
        </h3>
        <p
          className={`text-sm leading-relaxed mb-1 ${
            person.isEmpty ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {person.position}
        </p>
        {person.district && (
          <p className="text-xs text-purple-600 font-medium mb-1">
            {person.district}
          </p>
        )}
        {person.phone && !person.is_empty && (
          <p className="text-xs text-blue-600 font-medium">
            โทร: {person.phone}
          </p>
        )}
      </div>
    );
  };

  const ConnectionLine = ({ vertical = false, className = "" }) => (
    <div
      className={`${
        vertical ? "w-0.5 h-12" : "h-0.5 w-12"
      } bg-gradient-to-r from-[#0383AA] to-[#05C5FF] ${className}`}
    />
  );

  // Handle URL parameters and scroll to section
  useEffect(() => {
    const section = searchParams.get("section");
    const department = searchParams.get("dept");

    if (section) {
      setActiveSection(section);
      setHighlightedDepartment(null);

      // Scroll to section after component mounts
      setTimeout(() => {
        // For individual department sections, scroll to top
        if (
          ["clerk", "finance", "engineering", "education", "audit"].includes(
            section
          )
        ) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          // For main sections, scroll to the section element
          const element = document.getElementById(section);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
            // Highlight the section temporarily
            element.classList.add("ring-4", "ring-blue-400", "ring-opacity-50");
            setTimeout(() => {
              element.classList.remove(
                "ring-4",
                "ring-blue-400",
                "ring-opacity-50"
              );
            }, 3000);
          }
        }
      }, 100);
    }

    // Legacy support for dept parameter (convert to section)
    if (department && !section) {
      setActiveSection(department);
      setHighlightedDepartment(null);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    }
  }, [searchParams]);

  // Filter function to show specific sections
  const shouldShowSection = (sectionName) => {
    if (activeSection === "all") return true;

    // When departments is selected, only show departments section (not individual department sections)
    if (activeSection === "departments") {
      return sectionName === "departments";
    }

    // For individual department sections, don't show when "all" or "departments" is selected
    if (
      ["clerk", "finance", "engineering", "education"].includes(sectionName)
    ) {
      return activeSection === sectionName;
    }

    return activeSection === sectionName;
  };

  // Get department info for breadcrumb
  const getDepartmentInfo = (deptKey) => {
    const deptMap = {
      executives: { name: "คณะผู้บริหาร" },
      council: { name: "สภาเทศบาล" },
      departments: { name: "พนักงานเทศบาล" },
      clerk: { name: "สำนักปลัดเทศบาล" },
      finance: { name: "กองคลัง" },
      engineering: { name: "กองช่าง" },
      education: { name: "กองการศึกษา" },
      audit: { name: "หน่วยตรวจสอบภายใน" },
    };
    return deptMap[deptKey] || { name: "ไม่ระบุ" };
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูลบุคลากร...</p>
        </div>
      </div>
    );
  }

  // No data state
  if (!personnelData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">ไม่สามารถโหลดข้อมูลบุคลากรได้</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Header */}
      <div className="relative bg-[linear-gradient(180deg,_#0383AA_0%,_#05C5FF_100%)] py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
            <span className="text-white font-medium">Organization Chart</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            โครงสร้าง<span className="text-yellow-300">บุคลากร</span>
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            เทศบาลตำบลบ้านโพธิ์ • องค์กรปกครองส่วนท้องถิ่นที่ใส่ใจประชาชน
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      {(activeSection !== "all" || highlightedDepartment) && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 text-sm">
              <a
                href="/personnel"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                โครงสร้างบุคลากร
              </a>
              <span className="text-gray-400">›</span>
              {highlightedDepartment && (
                <>
                  <span className="text-gray-700">
                    {getDepartmentInfo(highlightedDepartment).name}
                  </span>
                </>
              )}
              {activeSection !== "all" && !highlightedDepartment && (
                <span className="text-gray-700">
                  {getDepartmentInfo(activeSection).name}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Navigation */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              เลือกดูข้อมูลตามหน่วยงาน
            </h3>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                setActiveSection("all");
                setHighlightedDepartment(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeSection === "all"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-blue-100 border border-gray-200"
              }`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => {
                setActiveSection("executives");
                setHighlightedDepartment(null);
                document
                  .getElementById("executives")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeSection === "executives"
                  ? "bg-amber-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-amber-100 border border-gray-200"
              }`}
            >
              คณะผู้บริหาร
            </button>
            <button
              onClick={() => {
                setActiveSection("council");
                setHighlightedDepartment(null);
                document
                  .getElementById("council")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeSection === "council"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-blue-100 border border-gray-200"
              }`}
            >
              สภาเทศบาล
            </button>
            <button
              onClick={() => {
                setActiveSection("departments");
                setHighlightedDepartment(null);
                document
                  .getElementById("departments")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeSection === "departments"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-indigo-100 border border-gray-200"
              }`}
            >
              พนักงานเทศบาล
            </button>
            <button
              onClick={() => {
                setActiveSection("clerk");
                setHighlightedDepartment(null);
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }, 100);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeSection === "clerk"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-blue-100 border border-gray-200"
              }`}
            >
              สำนักปลัดเทศบาล
            </button>
            <button
              onClick={() => {
                setActiveSection("finance");
                setHighlightedDepartment(null);
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }, 100);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeSection === "finance"
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-green-100 border border-gray-200"
              }`}
            >
              กองคลัง
            </button>
            <button
              onClick={() => {
                setActiveSection("engineering");
                setHighlightedDepartment(null);
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }, 100);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeSection === "engineering"
                  ? "bg-orange-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-orange-100 border border-gray-200"
              }`}
            >
              กองช่าง
            </button>
            <button
              onClick={() => {
                setActiveSection("education");
                setHighlightedDepartment(null);
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }, 100);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeSection === "education"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-purple-100 border border-gray-200"
              }`}
            >
              กองการศึกษาฯ
            </button>
            <button
              onClick={() => {
                setActiveSection("audit");
                setHighlightedDepartment("audit");
                document
                  .getElementById("audit")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeSection === "audit" || highlightedDepartment === "audit"
                  ? "bg-red-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-red-100 border border-gray-200"
              }`}
            >
              หน่วยตรวจสอบภายใน
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* คณะผู้บริหาร */}
        {shouldShowSection("executives") && (
          <section
            id="executives"
            className={`mb-20 transition-all duration-500 ${
              highlightedDepartment === "executives"
                ? "ring-4 ring-yellow-400 ring-opacity-50 rounded-2xl p-6"
                : ""
            }`}
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-full px-6 py-3 mb-4">
                <h2 className="text-3xl font-bold text-amber-800">
                  คณะผู้บริหาร
                </h2>
              </div>
              <p className="text-gray-600">
                ผู้นำองค์กรที่มีวิสัยทัศน์และความมุ่งมั่นในการพัฒนาท้องถิ่น
              </p>
            </div>
            {/* นายกเทศมนตรี */}
            <div className="flex justify-center mb-8">
              {personnelData.executives?.find(
                (p) =>
                  p.position.includes("นายกเทศมนตรี") &&
                  !p.position.includes("รอง")
              ) && (
                <PersonCard
                  person={personnelData.executives.find(
                    (p) =>
                      p.position.includes("นายกเทศมนตรี") &&
                      !p.position.includes("รอง")
                  )}
                  isExecutive={true}
                />
              )}
            </div>

            {/* เส้นเชื่อม */}
            <div className="flex justify-center mb-8">
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-8 bg-gradient-to-b from-[#0383AA] to-[#05C5FF]"></div>
                <div className="w-4 h-4 bg-gradient-to-r from-[#0383AA] to-[#05C5FF] rounded-full"></div>
                <div className="w-0.5 h-8 bg-gradient-to-b from-[#0383AA] to-[#05C5FF]"></div>
              </div>
            </div>

            {/* รองนายกเทศมนตรี */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
              {personnelData.executives
                ?.filter((p) => p.position.includes("รองนายกเทศมนตรี"))
                ?.map((person, index) => (
                  <PersonCard key={index} person={person} isExecutive={true} />
                ))}
            </div>

            {/* เส้นเชื่อม ชั้นที่ 2 */}
            <div className="flex justify-center mb-8">
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-8 bg-gradient-to-b from-[#0383AA] to-[#05C5FF]"></div>
                <div className="w-4 h-4 bg-gradient-to-r from-[#0383AA] to-[#05C5FF] rounded-full"></div>
                <div className="w-0.5 h-8 bg-gradient-to-b from-[#0383AA] to-[#05C5FF]"></div>
              </div>
            </div>

            {/* เลขานุการ และ ที่ปรึกษา */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {personnelData.executives
                ?.filter(
                  (p) =>
                    p.position.includes("เลขานุการ") ||
                    p.position.includes("ที่ปรึกษา")
                )
                ?.map((person, index) => (
                  <PersonCard key={index} person={person} isExecutive={true} />
                ))}
            </div>
          </section>
        )}

        {/* สภาเทศบาล */}
        {shouldShowSection("council") && (
          <section
            id="council"
            className={`mb-20 transition-all duration-500 ${
              highlightedDepartment === "council"
                ? "ring-4 ring-yellow-400 ring-opacity-50 rounded-2xl p-6"
                : ""
            }`}
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full px-6 py-3 mb-4">
                <h2 className="text-3xl font-bold text-blue-800">สภาเทศบาล</h2>
              </div>
              <p className="text-gray-600">
                องค์กรนิติบัญญัติท้องถิ่นที่ทำหน้าที่ตรวจสอบและถ่วงดุลอำนาจ
              </p>
            </div>
            {/* ประธาน และ รองประธานสภาเทศบาล */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-center mb-6 text-blue-700">
                ผู้นำสภาเทศบาล
              </h3>
              <div className="flex justify-center mb-6">
                {personnelData.council.leadership[0] && (
                  <PersonCard
                    person={personnelData.council.leadership[0]}
                    isHead={true}
                  />
                )}
              </div>

              {/* เส้นเชื่อม */}
              <div className="flex justify-center mb-6">
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-6 bg-gradient-to-b from-[#0383AA] to-[#05C5FF]"></div>
                  <div className="w-3 h-3 bg-gradient-to-r from-[#0383AA] to-[#05C5FF] rounded-full"></div>
                  <div className="w-0.5 h-6 bg-gradient-to-b from-[#0383AA] to-[#05C5FF]"></div>
                </div>
              </div>

              <div className="flex justify-center">
                {personnelData.council.leadership[1] && (
                  <PersonCard person={personnelData.council.leadership[1]} />
                )}
              </div>
            </div>

            {/* สมาชิกสภาเทศบาล */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* เขต 1 */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 bg-blue-100 rounded-full px-4 py-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <h3 className="text-lg font-bold text-blue-800">
                      สมาชิกสภาเทศบาล เขต 1
                    </h3>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {personnelData.council.district1?.map((person, index) => (
                    <PersonCard key={index} person={person} />
                  ))}
                </div>
              </div>

              {/* เขต 2 */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 bg-green-100 rounded-full px-4 py-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <h3 className="text-lg font-bold text-green-800">
                      สมาชิกสภาเทศบาล เขต 2
                    </h3>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {personnelData.council.district2?.map((person, index) => (
                    <PersonCard key={index} person={person} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* พนักงานเทศบาล */}
        {shouldShowSection("departments") && (
          <section
            id="departments"
            className={`mb-20 transition-all duration-500 ${
              highlightedDepartment === "departments"
                ? "ring-4 ring-yellow-400 ring-opacity-50 rounded-2xl p-6"
                : ""
            }`}
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full px-6 py-3 mb-4">
                <h2 className="text-3xl font-bold text-indigo-800">
                  พนักงานเทศบาล
                </h2>
              </div>
              <p className="text-gray-600">
                หัวหน้าส่วนราชการและหน่วยงานปฏิบัติการที่ให้บริการประชาชนในด้านต่างๆ
              </p>
            </div>

            {/* หัวหน้าส่วนราชการระดับสูง */}
            <div className="mb-16">
              <h3 className="text-2xl font-semibold text-center mb-8 text-indigo-700">
                หัวหน้าส่วนราชการ
              </h3>

              {/* ปลัดเทศบาล */}
              <div className="flex justify-center mb-8">
                {/* Find ปลัดเทศบาล from councilOfficer department */}
                {personnelData.departments.councilOfficer?.head && (
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-300 shadow-xl rounded-xl p-6 text-center transition-all duration-300 hover:scale-105 hover:-translate-y-1 group">
                    <div className="relative mb-4">
                      <div className="w-28 h-28 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 ring-4 ring-white shadow-lg">
                        <img
                          src={`https://banpho.sosmartsolution.com/storage${personnelData.departments.councilOfficer.head.img}`}
                          alt={
                            personnelData.departments.councilOfficer.head
                              .full_name
                          }
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          onError={(e) => {
                            e.target.src =
                              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTEyIiBoZWlnaHQ9IjExMiIgdmlld0JveD0iMCAwIDExMiAxMTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjU2IiBjeT0iNTYiIHI9IjU2IiBmaWxsPSIjRjNGNEY2Ii8+CjxzdmcgeD0iMjgiIHk9IjI0IiB3aWR0aD0iNTYiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzlCOUJBMCI+CjxwYXRoIGQ9Ik0xMiAxMmMyLjIxIDAgNC0xLjc5IDQtNHMtMS43OS00LTQtNC00IDEuNzktNCA0IDEuNzkgNCA0IDR6bTAgMmMtMi42NyAwLTggMS4zNC04IDR2MmgxNnYtMmMwLTIuNjYtNS4zMy00LTgtNHoiLz4KPHN2Zz4KPC9zdmc+";
                          }}
                        />
                      </div>
                      <div className="absolute -top-2 -right-2 w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <h3 className="font-bold text-xl mb-2 text-indigo-800">
                      {personnelData.departments.councilOfficer.head.full_name}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-1">
                      {personnelData.departments.councilOfficer.head.position}
                    </p>
                    {personnelData.departments.councilOfficer.head.phone && (
                      <p className="text-xs text-blue-600 font-medium">
                        โทร:{" "}
                        {personnelData.departments.councilOfficer.head.phone}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* เส้นเชื่อม ชั้นที่ 1 */}
              <div className="flex justify-center mb-8">
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-[#0383AA] to-[#05C5FF]"></div>
                  <div className="w-4 h-4 bg-gradient-to-r from-[#0383AA] to-[#05C5FF] rounded-full"></div>
                  <div className="w-0.5 h-8 bg-gradient-to-b from-[#0383AA] to-[#05C5FF]"></div>
                </div>
              </div>

              {/* รองปลัดเทศบาล */}
              <div className="flex justify-center mb-8">
                {/* Find รองปลัดเทศบาล from councilOfficer department staff */}
                {personnelData.departments.councilOfficer?.staff?.find(
                  (person) => person.position.includes("รองปลัด")
                ) && (
                  <PersonCard
                    person={personnelData.departments.councilOfficer.staff.find(
                      (person) => person.position.includes("รองปลัด")
                    )}
                    isHead={true}
                  />
                )}
              </div>

              {/* เส้นเชื่อม ชั้นที่ 2 */}
              <div className="flex justify-center mb-8">
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-[#0383AA] to-[#05C5FF]"></div>
                  <div className="w-4 h-4 bg-gradient-to-r from-[#0383AA] to-[#05C5FF] rounded-full"></div>
                  <div className="w-0.5 h-8 bg-gradient-to-b from-[#0383AA] to-[#05C5FF]"></div>
                </div>
              </div>

              {/* หัวหน้าส่วนราชการระดับกอง */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {/* หัวหน้าสำนักปลัดเทศบาล */}
                {personnelData.departments.clerk?.head && (
                  <PersonCard
                    person={personnelData.departments.clerk.head}
                    isHead={true}
                  />
                )}

                {/* ผู้อำนวยการกองคลัง */}
                {personnelData.departments.finance?.head && (
                  <PersonCard
                    person={personnelData.departments.finance.head}
                    isHead={true}
                  />
                )}

                {/* ผู้อำนวยการกองช่าง */}
                {personnelData.departments.engineering?.head && (
                  <PersonCard
                    person={personnelData.departments.engineering.head}
                    isHead={true}
                  />
                )}
              </div>
            </div>

            {/* สรุปข้อมูลพนักงานเทศบาล */}
            <div className="text-center">
              <p className="text-gray-600 text-lg">
                กดปุ่มแผนกเฉพาะเพื่อดูรายละเอียดบุคลากรในแต่ละหน่วยงาน
              </p>
            </div>
          </section>
        )}

        {/* หน่วยตรวจสอบภายใน */}
        {shouldShowSection("audit") && (
          <section
            id="audit"
            className={`mb-20 transition-all duration-500 ${
              highlightedDepartment === "audit"
                ? "ring-4 ring-yellow-400 ring-opacity-50 rounded-2xl p-6"
                : ""
            }`}
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-100 to-pink-100 rounded-full px-6 py-3 mb-4">
                <h2 className="text-3xl font-bold text-red-800">
                  หน่วยตรวจสอบภายใน
                </h2>
              </div>
              <p className="text-gray-600">หน่วยงานตรวจสอบและควบคุมภายใน</p>
            </div>

            {/* หน่วยตรวจสอบภายใน - Special Layout */}
            <div className="mb-12">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                {/* Department Header */}
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 rounded-lg w-16 h-16 flex items-center justify-center">
                      <div className="w-8 h-8 bg-white/30 rounded"></div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">หน่วยตรวจสอบภายใน</h3>
                      <p className="text-white/80">
                        หน่วยงานตรวจสอบและควบคุมภายใน
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  {/* ผู้อำนวยการกองช่าง */}
                  <div className="mb-8">
                    <div className="flex justify-center">
                      <div>
                        <div className="flex justify-center">
                          {personnelData.audit[0] && (
                            <PersonCard person={personnelData.audit[0]} />
                          )}
                        </div>
                      </div>{" "}
                    </div>
                  </div>

                  {/* Connection Lines */}
                  <div className="flex justify-center mb-8">
                    <div className="flex flex-col items-center">
                      <ConnectionLine vertical />
                      <div className="w-4 h-4 bg-gradient-to-r from-[#0383AA] to-[#05C5FF] rounded-full"></div>
                      <ConnectionLine vertical />
                    </div>
                  </div>
                  {/* Department Content */}
                  <div className="p-8">
                    {/* นักวิชาการตรวจสอบภายใน */}
                    <div>
                      <div className="flex justify-center">
                        {personnelData.audit[1] && (
                          <PersonCard person={personnelData.audit[1]} />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {personnelData.audit.slice(2) &&
                      personnelData.audit
                        .slice(2) // เอาข้อมูลตั้งแต่ index 7 เป็นต้นไป
                        .map((person, index) => (
                          <PersonCard
                            key={person.id || index + 2} // ใช้ person.id หรือ index + 7 เป็น key
                            person={person}
                          />
                        ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* สำนักปลัดเทศบาล - Individual Section */}
        {shouldShowSection("clerk") && (
          <section id="clerk-section" className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full px-6 py-3 mb-4">
                <h2 className="text-3xl font-bold text-blue-800">
                  สำนักปลัดเทศบาล
                </h2>
              </div>
              <p className="text-gray-600">
                หน่วยงานบริหารงานทั่วไปและสนับสนุน
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 rounded-lg w-16 h-16 flex items-center justify-center">
                    <div className="w-8 h-8 bg-white/30 rounded"></div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">สำนักปลัดเทศบาล</h3>
                    <p className="text-white/80">
                      หน่วยงานบริหารงานทั่วไปและสนับสนุน
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {/* หัวหน้าสำนักปลัดเทศบาล */}
                <div className="mb-8">
                  <div className="flex justify-center">
                    <PersonCard
                      person={personnelData.departments.clerk.head}
                      isHead={true}
                    />
                  </div>
                </div>

                {/* Connection Lines */}
                <div className="flex justify-center mb-8">
                  <div className="flex flex-col items-center">
                    <ConnectionLine vertical />
                    <div className="w-4 h-4 bg-gradient-to-r from-[#0383AA] to-[#05C5FF] rounded-full"></div>
                    <ConnectionLine vertical />
                  </div>
                </div>

                {/* หัวหน้าฝ่าย */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-center mb-6 text-blue-700">
                    หัวหน้าฝ่าย
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    <PersonCard
                      person={personnelData.departments.clerk.staff[0]}
                      isHead={true}
                    />
                    <PersonCard
                      person={personnelData.departments.clerk.staff[1]}
                      isHead={true}
                    />
                  </div>
                </div>

                {/* Connection Lines */}
                <div className="flex justify-center mb-8">
                  <div className="flex flex-col items-center">
                    <ConnectionLine vertical />
                    <div className="w-4 h-4 bg-gradient-to-r from-[#0383AA] to-[#05C5FF] rounded-full"></div>
                    <ConnectionLine vertical />
                  </div>
                </div>

                {/* เจ้าหน้าที่และนักวิชาการ */}
                <div className="mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {personnelData.departments.clerk.staff
                      ?.slice(2, 8)
                      ?.map((person, index) => (
                        <PersonCard key={index} person={person} />
                      ))}
                  </div>
                </div>

                {/* ผู้ช่วยเจ้าหน้าที่ */}
                <div className="mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {personnelData.departments.clerk.staff
                      ?.slice(8, 12)
                      ?.map((person, index) => (
                        <PersonCard key={index} person={person} />
                      ))}
                  </div>
                </div>

                {/* พนักงานขับรถและเครื่องจักร */}
                <div className="mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {personnelData.departments.clerk.staff
                      ?.slice(12, 16)
                      ?.map((person, index) => (
                        <PersonCard key={index} person={person} />
                      ))}
                  </div>
                </div>

                {/* คนงานและพนักงานทั่วไป */}
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {personnelData.departments.clerk.staff
                      ?.slice(16)
                      ?.map((person, index) => (
                        <PersonCard key={index} person={person} />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* กองคลัง - Individual Section */}
        {shouldShowSection("finance") && (
          <section id="finance-section" className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full px-6 py-3 mb-4">
                <h2 className="text-3xl font-bold text-green-800">กองคลัง</h2>
              </div>
              <p className="text-gray-600">หน่วยงานการเงิน การคลัง และพัสดุ</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 rounded-lg w-16 h-16 flex items-center justify-center">
                    <div className="w-8 h-8 bg-white/30 rounded"></div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">กองคลัง</h3>
                    <p className="text-white/80">
                      หน่วยงานการเงิน การคลัง และพัสดุ
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {/* ผู้อำนวยการกองคลัง */}
                <div className="mb-8">
                  <div className="flex justify-center">
                    <PersonCard
                      person={personnelData.departments.finance.head}
                      isHead={true}
                    />
                  </div>
                </div>

                {/* Connection Lines */}
                <div className="flex justify-center mb-8">
                  <div className="flex flex-col items-center">
                    <ConnectionLine vertical />
                    <div className="w-4 h-4 bg-gradient-to-r from-[#0383AA] to-[#05C5FF] rounded-full"></div>
                    <ConnectionLine vertical />
                  </div>
                </div>

                {/* หัวหน้าฝ่าย */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-center mb-6 text-green-700">
                    หัวหน้าฝ่าย
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    <PersonCard
                      person={personnelData.departments.finance.staff[0]}
                      isHead={true}
                    />
                    <PersonCard
                      person={personnelData.departments.finance.staff[1]}
                      isHead={true}
                    />
                  </div>
                </div>

                {/* Connection Lines */}
                <div className="flex justify-center mb-8">
                  <div className="flex flex-col items-center">
                    <ConnectionLine vertical />
                    <div className="w-4 h-4 bg-gradient-to-r from-[#0383AA] to-[#05C5FF] rounded-full"></div>
                    <ConnectionLine vertical />
                  </div>
                </div>

                {/* นักวิชาการและเจ้าหน้าที่ชำนาญการ */}
                <div className="mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PersonCard
                      person={personnelData.departments.finance.staff[2]}
                    />
                    <PersonCard
                      person={personnelData.departments.finance.staff[3]}
                    />
                  </div>
                </div>

                {/* นักวิชาการและเจ้าพนักงาน */}

                <div className="mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {personnelData.departments.finance.staff
                      .slice(4) // เอาข้อมูลตั้งแต่ index 7 เป็นต้นไป
                      .map((person, index) => (
                        <PersonCard
                          key={person.id || index + 4} // ใช้ person.id หรือ index + 7 เป็น key
                          person={person}
                        />
                      ))}
                  </div>
                </div>

                {/* ผู้ช่วยเจ้าพนักงาน */}
                {/* <div>
                  <div className="flex justify-center">
                    <PersonCard
                      person={personnelData.departments.finance.staff[7]}
                    />
                  </div>
                </div> */}
              </div>
            </div>
          </section>
        )}

        {/* กองช่าง - Individual Section */}
        {shouldShowSection("engineering") && (
          <section id="engineering-section" className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full px-6 py-3 mb-4">
                <h2 className="text-3xl font-bold text-orange-800">กองช่าง</h2>
              </div>
              <p className="text-gray-600">
                หน่วยงานโครงสร้างพื้นฐานและสาธารณูปโภค
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 rounded-lg w-16 h-16 flex items-center justify-center">
                    <div className="w-8 h-8 bg-white/30 rounded"></div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">กองช่าง</h3>
                    <p className="text-white/80">
                      หน่วยงานโครงสร้างพื้นฐานและสาธารณูปโภค
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {/* ผู้อำนวยการกองช่าง */}
                <div className="mb-8">
                  <div className="flex justify-center">
                    <PersonCard
                      person={personnelData.departments.engineering.head}
                      isHead={true}
                    />
                  </div>
                </div>

                {/* Connection Lines */}
                <div className="flex justify-center mb-8">
                  <div className="flex flex-col items-center">
                    <ConnectionLine vertical />
                    <div className="w-4 h-4 bg-gradient-to-r from-[#0383AA] to-[#05C5FF] rounded-full"></div>
                    <ConnectionLine vertical />
                  </div>
                </div>

                {/* หัวหน้าฝ่ายและวิศวกร */}
                <div className="mb-8">
                  <div className="flex justify-center mb-8 max-w-4xl mx-auto">
                    <PersonCard
                      person={personnelData.departments.engineering.staff[0]}
                      isHead={true}
                    />
                  </div>
                </div>

                {/* Connection Lines */}
                <div className="flex justify-center mb-8">
                  <div className="flex flex-col items-center">
                    <ConnectionLine vertical />
                    <div className="w-4 h-4 bg-gradient-to-r from-[#0383AA] to-[#05C5FF] rounded-full"></div>
                    <ConnectionLine vertical />
                  </div>
                </div>

                {/* ผู้ช่วยเจ้าพนักงานและพนักงานพิเศษ */}
                <div className="mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {personnelData.departments.engineering.staff
                      .slice(1)
                      .map((person, index) => (
                        <PersonCard
                          key={person.id || index + 1}
                          person={person}
                        />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* กองการศึกษาฯ - Individual Section */}
        {shouldShowSection("education") && (
          <section id="education-section" className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-100 to-violet-100 rounded-full px-6 py-3 mb-4">
                <h2 className="text-3xl font-bold text-purple-800">
                  กองการศึกษา
                </h2>
              </div>
              <p className="text-gray-600">หน่วยงานการศึกษา</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 rounded-lg w-16 h-16 flex items-center justify-center">
                    <div className="w-8 h-8 bg-white/30 rounded"></div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">
                      กองการศึกษา ศาสนาและวัฒนธรรม
                    </h3>
                    <p className="text-white/80">
                      หน่วยงานการศึกษา ศาสนา และวัฒนธรรม
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {/* ผู้อำนวยการกองการศึกษา */}
                <div className="mb-8">
                  <div className="flex justify-center">
                    {personnelData.departments.education?.head && (
                      <PersonCard
                        person={personnelData.departments.education.head}
                        isHead={true}
                      />
                    )}
                  </div>
                </div>

                {/* Connection Lines */}
                <div className="flex justify-center mb-8">
                  <div className="flex flex-col items-center">
                    <ConnectionLine vertical />
                    <div className="w-4 h-4 bg-gradient-to-r from-[#0383AA] to-[#05C5FF] rounded-full"></div>
                    <ConnectionLine vertical />
                  </div>
                </div>
                <div className="mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
                    {personnelData.departments.education.staff[0] && (
                      <PersonCard
                        person={personnelData.departments.education.staff[0]}
                      />
                    )}
                    {personnelData.departments.education.staff[1] && (
                      <PersonCard
                        person={personnelData.departments.education.staff[1]}
                      />
                    )}
                  </div>
                </div>
                {/* พนักงาน */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {personnelData.departments.education.staff
                    .slice(2) // เอาข้อมูลตั้งแต่ index 7 เป็นต้นไป
                    .map((person, index) => (
                      <PersonCard
                        key={person.id || index + 2} // ใช้ person.id หรือ index + 7 เป็น key
                        person={person}
                      />
                    ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default PersonnelOrgChart;
