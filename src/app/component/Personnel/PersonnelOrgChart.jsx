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
          // Fallback to static data if API fails
          setPersonnelData(staticPersonnelData);
        }
      } catch (error) {
        console.error("Error fetching personnel data:", error);
        // Fallback to static data if API fails
        setPersonnelData(staticPersonnelData);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonnelData();
  }, []);

  // Static fallback data (keeping the original structure)
  const staticPersonnelData = {
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
          // Fallback to static data if API fails
          setPersonnelData(staticPersonnelData);
        }
      } catch (error) {
        console.error("Error fetching personnel data:", error);
        // Fallback to static data if API fails
        setPersonnelData(staticPersonnelData);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonnelData();
  }, []);

  // Static fallback data (keeping the original structure)
  const staticPersonnelData = {
    executives: [
      {
        name: "นายรุ่งโรจน์ กิติพิศาลกุล",
        position: "นายกเทศมนตรีตำบลบ้านโพธิ์",
        phone: "063-795-2282",
        image: "/image/placeholder-person.jpg",
        department: "executive",
      },
      {
        name: "นายจำเนียร จันทร์สร้อย",
        position: "รองนายกเทศมนตรีตำบลบ้านโพธิ์",
        phone: "086-733-5064",
        image: "/image/placeholder-person.jpg",
        department: "executive",
      },
      {
        name: "นายไชยวัฒน์ ศรีวิไลสกุลวงศ์",
        position: "รองนายกเทศมนตรีตำบลบ้านโพธิ์",
        phone: "081-910-0491",
        image: "/image/placeholder-person.jpg",
        department: "executive",
      },
      {
        name: "ว่าง",
        position: "เลขานุการนายกเทศมนตรี",
        phone: "",
        image: "/image/placeholder-person.jpg",
        department: "executive",
        isEmpty: true,
      },
      {
        name: "นายประดิษฐ โรจนพร",
        position: "ที่ปรึกษานายกเทศมนตรี",
        phone: "081-686-8366",
        image: "/image/placeholder-person.jpg",
        department: "executive",
      },
    ],
    council: {
      leadership: [
        {
          name: "นายทนง อุดมเดช",
          position: "ประธานสภาเทศบาลตำบลบ้านโพธิ์",
          image: "/image/placeholder-person.jpg",
          department: "council",
        },
        {
          name: "นายประยูร เมธีกุล",
          position: "รองประธานสภาเทศบาลตำบลบ้านโพธิ์",
          image: "/image/placeholder-person.jpg",
          department: "council",
        },
      ],
      district1: [
        {
          name: "นายนิมิตร พานิชย์วัฒนานนท์",
          position: "สมาชิกสภาเทศบาลตำบลบ้านโพธิ์",
          district: "เขต 1",
          image: "/image/placeholder-person.jpg",
          department: "council",
        },
        {
          name: "นายอนันต์ วัฒนพานิช",
          position: "สมาชิกสภาเทศบาลตำบลบ้านโพธิ์",
          district: "เขต 1",
          image: "/image/placeholder-person.jpg",
          department: "council",
        },
        {
          name: "นายวรวิทย์ รุ่งเรืองกิจพัฒนา",
          position: "สมาชิกสภาเทศบาลตำบลบ้านโพธิ์",
          district: "เขต 1",
          image: "/image/placeholder-person.jpg",
          department: "council",
        },
        {
          name: "นายอัฏธพล กิจไพบูลย์วัฒนา",
          position: "สมาชิกสภาเทศบาลตำบลบ้านโพธิ์",
          district: "เขต 1",
          image: "/image/placeholder-person.jpg",
          department: "council",
        },
        {
          name: "นางมาลี สนรักษา",
          position: "สมาชิกสภาเทศบาลตำบลบ้านโพธิ์",
          district: "เขต 1",
          image: "/image/placeholder-person.jpg",
          department: "council",
        },
      ],
      district2: [
        {
          name: "นายนพพร วัฒนกุล",
          position: "สมาชิกสภาเทศบาลตำบลบ้านโพธิ์",
          district: "เขต 2",
          image: "/image/placeholder-person.jpg",
          department: "council",
        },
        {
          name: "นายชัชชาย แจ้งประจักษ์",
          position: "สมาชิกสภาเทศบาลตำบลบ้านโพธิ์",
          district: "เขต 2",
          image: "/image/placeholder-person.jpg",
          department: "council",
        },
        {
          name: "นายชาญวิทย์ พ่วงศรีนวล",
          position: "สมาชิกสภาเทศบาลตำบลบ้านโพธิ์",
          district: "เขต 2",
          image: "/image/placeholder-person.jpg",
          department: "council",
        },
        {
          name: "นายบรรพต พัดทอง",
          position: "สมาชิกสภาเทศบาลตำบลบ้านโพธิ์",
          district: "เขต 2",
          image: "/image/placeholder-person.jpg",
          department: "council",
        },
        {
          name: "รอการเลือกตั้ง",
          position: "สมาชิกสภาเทศบาล",
          district: "เขต 2",
          image: "/image/placeholder-person.jpg",
          department: "council",
          isEmpty: true,
        },
      ],
    },
    departments: {
      clerk: {
        title: "สำนักปลัดเทศบาล",
        color: "from-blue-500 to-blue-600",

        head: {
          name: "นางสาววิไลรัตน์ ขาวมรดก",
          position: "หัวหน้าสำนักปลัดเทศบาล",
          phone: "092-459-0549",
          image: "/image/placeholder-person.jpg",
        },
        staff: [
          {
            name: "นางสาวบุษบา เชิดชู",
            position: "หัวหน้าฝ่ายอำนวยการ",
            image: "/image/placeholder-person.jpg",
          },
          {
            name: "นางอัจฉรา หร่ายเจริญ",
            position: "หัวหน้าฝ่ายปกครอง",
            image: "/image/placeholder-person.jpg",
          },
          {
            name: "นางสาวรุจิยา ลิ้มเจริญผล",
            position: "เจ้าพนักงานธุรการปฏิบัติงาน",
            image: "/image/placeholder-person.jpg",
          },
          {
            name: "นางสาวโชติมาส ไทยเจริญ",
            position: "นักวิชาการสุขาภิบาลปฏิบัติการ",
            image: "/image/placeholder-person.jpg",
          },
          {
            name: "ว่าง",
            position: "นักพัฒนาชุมชนชำนาญการ",
            image: "/image/placeholder-person.jpg",
            isEmpty: true,
          },
          {
            name: "นายโมไนย นาควงศ์วาลย์",
            position: "นักจัดการงานทะเบียนและบัตรปฏิบัติการ",
            image: "/image/placeholder-person.jpg",
          },
          {
            name: "นางสาวนพวรรณ โภคทรัพย์",
            position: "เจ้าพนักงานธุรการ",
            image: "/image/placeholder-person.jpg",
          },
          {
            name: "นางขนิษฐา ศรีแก้ว",
            position: "ผู้ช่วยนักวิเคราะห์นโยบายและแผน",
            image: "/image/placeholder-person.jpg",
          },
          {
            name: "นางสาวปิยะพัชร์ ช่อผกา",
            position: "ผู้ช่วยเจ้าพนักงานพัฒนาชุมชน",
            image: "/image/placeholder-person.jpg",
          },
          {
            name: "นายปฐม เซ็ทเจริญ",
            position: "พนักงานขับรถยนต์",
            image: "/image/placeholder-person.jpg",
          },
          {
            name: "นางสาวณัฏฐนันท์ น่วมรัสมี",
            position: "ผู้ช่วยเจ้าพนักงานธุรการ",
            image: "/image/placeholder-person.jpg",
          },
          {
            name: "นางสาวธัญญสรัณ อำสันเทียะ",
            position: "ผู้ช่วยเจ้าพนักงานธุรการ",
            image: "/image/placeholder-person.jpg",
          },
          {
            name: "นายประยูร วิญญูวิญ",
            position: "พนักงานขับเครื่องจักรกลขนาดเบา",
            image: "/image/placeholder-person.jpg",
          },
          {
            name: "นายประเสริฐ เคลือบสำราญ",
            position: "พนักงานขับเครื่องจักรกลขนาดเบา",
            image: "/image/placeholder-person.jpg",
          },
          {
            name: "นายวิโรจน์ สินกังวาน",
            position: "ผู้ช่วยเจ้าหน้าที่ป้องกัน",
            image: "/image/placeholder-person.jpg",
          },
          {
            name: "นายประชา ประเสริฐศิลป์",
            position: "คนงาน (รถดับเพลิง)",
            image: "/image/placeholder-person.jpg",
          },
          {
            name: "นายเกียรติ หลายทอง",
            position: "คนงานประจำรถขยะ",
            image: "/image/placeholder-person.jpg",
          },
          {
            name: "นายพิษณุ สุขประเสริฐ",
            position: "พนักงานขับเคลื่อนจักรกลขนาดเบา (รถขยะ)",
            image: "/image/placeholder-person.jpg",
          },
          {
            name: "นายภานุวัฒน์ คงยิ้ม",
            position: "คนงาน",
            image: "/image/placeholder-person.jpg",
          },
          {
            name: "นายพรพิรุณ นุชน้อย",
            position: "คนงาน",
            image: "/image/placeholder-person.jpg",
          },
          {
            name: "นายอนันต์ กลัดสุขใส",
            position: "คนงานประจำรถขยะ",
            image: "/image/placeholder-person.jpg",
          },
        ],
      },
      finance: {
        title: "กองคลัง",
        color: "from-green-500 to-green-600",

        head: {
          name: "นางสาวจุฬาลัย มงคลชัยฤกษ์",
          position: "ผู้อำนวยการกองคลัง",
          phone: "063-874-4595",
          image: "/image/placeholder-person.jpg",
        },
        staff: [
          {
            name: "ว่าง",
            position: "หัวหน้าฝ่ายบริหารงานคลัง",
            image: "/image/placeholder-person.jpg",
            isEmpty: true,
          },
          {
            name: "ว่าง",
            position: "หัวหน้าฝ่ายพัฒนารายได้",
            image: "/image/placeholder-person.jpg",
            isEmpty: true,
          },
          {
            name: "ว่าง",
            position: "นักวิชาการพัสดุชำนาญการ",
            image: "/image/placeholder-person.jpg",
            isEmpty: true,
          },
          {
            name: "นางสาวลักขณาณัฐ์ อรัณยะกานนท์",
            position: "เจ้าพนักงานจัดเก็บรายได้ชำนาญงาน",
            image: "/image/placeholder-person.jpg",
          },
          {
            name: "ว่าง",
            position: "นักวิชาการเงินและบัญชี",
            image: "/image/placeholder-person.jpg",
            isEmpty: true,
          },
          {
            name: "นางสาวนันทพร ชัยยะ",
            position: "เจ้าพนักงานธุรการ",
            image: "/image/placeholder-person.jpg",
          },
          {
            name: "นางสาววรณัน บุษบงก์",
            position: "เจ้าพนักงานธุรการ",
            image: "/image/placeholder-person.jpg",
          },
          {
            name: "นางสาวเบญจวรรณ วงษ์สำเริงชัย",
            position: "ผู้ช่วยเจ้าพนักงานการเงินและบัญชี",
            image: "/image/placeholder-person.jpg",
          },
        ],
      },
      engineering: {
        title: "กองช่าง",
        color: "from-orange-500 to-orange-600",

        head: {
          name: "นายพิเชฐ สระอุบล",
          position: "ผู้อำนวยการกองช่าง",
          phone: "089-833-3244",
          image: "/image/placeholder-person.jpg",
        },
        staff: [
          {
            name: "ว่าง",
            position: "หัวหน้าฝ่ายการโยธา",
            image: "/image/placeholder-person.jpg",
            isEmpty: true,
          },
          {
            name: "ว่าง",
            position: "วิศวกรโยธา",
            image: "/image/placeholder-person.jpg",
            isEmpty: true,
          },
          {
            name: "นางสาวลภัสรดา อินทร์ศรี",
            position: "ผู้ช่วยเจ้าพนักงานจัดเก็บรายได้",
            image: "/image/placeholder-person.jpg",
          },
          {
            name: "นางสาวรุ่งนภา พุ่มประเสริฐ",
            position: "คนงาน",
            image: "/image/placeholder-person.jpg",
          },
          {
            name: "ว่าง",
            position: "พนักงานผลิตน้ำประปา",
            image: "/image/placeholder-person.jpg",
            isEmpty: true,
          },
          {
            name: "นายกรศุทธิ์ มั่นคง",
            position: "คนงาน",
            image: "/image/placeholder-person.jpg",
          },
          {
            name: "ว่าง",
            position: "คนงาน",
            image: "/image/placeholder-person.jpg",
            isEmpty: true,
          },
          {
            name: "นายบุญธรรม พรบุญ",
            position: "คนงาน",
            image: "/image/placeholder-person.jpg",
          },
          {
            name: "นายกิติศักดิ์ มูลสิติ",
            position: "คนงาน",
            image: "/image/placeholder-person.jpg",
          },
          {
            name: "นายไพโรจน์ กำแพงทอง",
            position: "คนงาน",
            image: "/image/placeholder-person.jpg",
          },
          {
            name: "นายอนณ เตียวหยิน",
            position: "พนักงานขับเครื่องจักรกลขนาดเบา",
            image: "/image/placeholder-person.jpg",
          },
          {
            name: "นายพิมล แช่มเจริญ",
            position: "พนักงานจ้างเหมา",
            image: "/image/placeholder-person.jpg",
          },
        ],
      },
      education: {
        title: "กองการศึกษาฯ",
        color: "from-purple-500 to-purple-600",

        head: {
          name: "ว่าง",
          position: "ผู้อำนวยการกองการศึกษา",
          image: "/image/placeholder-person.jpg",
          isEmpty: true,
        },
        staff: [
          {
            name: "ว่าง",
            position: "หัวหน้าฝ่ายบริหารการศึกษา",
            image: "/image/placeholder-person.jpg",
            isEmpty: true,
          },
          {
            name: "นางสาวปิยภาณี ตาอุดม",
            position: "นักวิชาการศึกษาปฏิบัติการ",
            image: "/image/placeholder-person.jpg",
          },
          {
            name: "นางสาววิลาวัลย์ กิตติรัตนโรจน์",
            position: "ผู้ช่วยเจ้าพนักงานธุรการ",
            image: "/image/placeholder-person.jpg",
          },
          {
            name: "นางจรินทร์พร วิไลพันธุ์",
            position: "ครู คศ.๑",
            image: "/image/placeholder-person.jpg",
          },
          {
            name: "นางสาวสาลักษณ์ เพียรอริยพร",
            position: "พนักงานจ้างเหมา",
            image: "/image/placeholder-person.jpg",
          },
          {
            name: "นางสาวนางสาวกนิษฐา อุทัยสา",
            position: "พนักงานจ้างเหมา",
            image: "/image/placeholder-person.jpg",
          },
        ],
      },
    },
    audit: [
      {
        name: "ว่าง",
        position: "นักวิชาการตรวจสอบภายใน",
        image: "/image/placeholder-person.jpg",
        isEmpty: true,
      },
    ],
  };

  const PersonCard = ({ person, isHead = false, isExecutive = false }) => {
    // Add null check for person
    if (!person) {
      return null;
    }

    // Add null check for person
    if (!person) {
      return null;
    }

    const getCardStyle = () => {
      if (person.is_empty) {
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
              src={person.img}
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
      // Scroll to section after component mounts
      setTimeout(() => {
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
      }, 100);
    }

    if (department) {
      setHighlightedDepartment(department);
      setTimeout(() => {
        const element = document.getElementById(department);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          // Highlight the department
          element.classList.add("ring-4", "ring-yellow-400", "ring-opacity-75");
          setTimeout(() => {
            element.classList.remove(
              "ring-4",
              "ring-yellow-400",
              "ring-opacity-75"
            );
          }, 4000);
        }
      }, 100);
    }
  }, [searchParams]);

  // Filter function to show specific sections
  const shouldShowSection = (sectionName) => {
    if (activeSection === "all") return true;
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
      education: { name: "กองการศึกษาฯ" },
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
                setActiveSection("audit");
                setHighlightedDepartment(null);
                document
                  .getElementById("audit")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeSection === "audit"
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
                ?.filter(
                  (p) =>
                    p.position.includes("เลขานุการ") ||
                    p.position.includes("ที่ปรึกษา")
                )
                ?.map((person, index) => (
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
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-300 shadow-xl rounded-xl p-6 text-center transition-all duration-300 hover:scale-105 hover:-translate-y-1 group">
                  <div className="relative mb-4">
                    <div className="w-28 h-28 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 ring-4 ring-white shadow-lg">
                      <img
                        src="/image/placeholder-person.jpg"
                        alt="นายวรยศ กิจพานิช"
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
                    นายวรยศ กิจพานิช
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-1">
                    ปลัดเทศบาลตำบลบ้านโพธิ์
                  </p>
                  <p className="text-xs text-blue-600 font-medium">
                    โทร: 099-261-2498
                  </p>
                </div>
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
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 shadow-lg rounded-xl p-6 text-center transition-all duration-300 hover:scale-105 hover:-translate-y-1 group">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 ring-4 ring-white shadow-lg">
                      <img
                        src="/image/placeholder-person.jpg"
                        alt="นายภูธัชป์ โพธิ์สวัสดิ์"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDgiIGN5PSI0OCIgcj0iNDgiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB4PSIyNCIgeT0iMjAiIHdpZHRoPSI0OCIgaGVpZ2h0PSI1NiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOUI5QkEwIj4KPHBhdGggZD0iTTEyIDEyYzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00LTQgMS43OS00IDQgMS43OSA0IDQgNHptMCAyYy0yLjY3IDAtOCAxLjM0LTggNHYyaDE2di0yYzAtMi42Ni01LjMzLTQtOC00eiIvPgo8L3N2Zz4KPC9zdmc+";
                        }}
                      />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-blue-800">
                    นายภูธัชป์ โพธิ์สวัสดิ์
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    รองปลัดเทศบาล
                  </p>
                </div>
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
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 shadow-lg rounded-xl p-6 text-center transition-all duration-300 hover:scale-105 hover:-translate-y-1 group">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 ring-4 ring-white shadow-lg">
                      <img
                        src="/image/placeholder-person.jpg"
                        alt="นางสาววิไลรัตน์ ขาวมรดก"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDgiIGN5PSI0OCIgcj0iNDgiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB4PSIyNCIgeT0iMjAiIHdpZHRoPSI0OCIgaGVpZ2h0PSI1NiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOUI5QkEwIj4KPHBhdGggZD0iTTEyIDEyYzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00LTQgMS43OS00IDQgMS43OSA0IDQgNHptMCAyYy0yLjY3IDAtOCAxLjM0LTggNHYyaDE2di0yYzAtMi42Ni01LjMzLTQtOC00eiIvPgo8L3N2Zz4KPC9zdmc+";
                        }}
                      />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-blue-800">
                    นางสาววิไลรัตน์ ขาวมรดก
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-1">
                    หัวหน้าสำนักปลัดเทศบาล
                  </p>
                  <p className="text-xs text-blue-600 font-medium">
                    โทร: 092-459-0549
                  </p>
                </div>

                {/* ผู้อำนวยการกองคลัง */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 shadow-lg rounded-xl p-6 text-center transition-all duration-300 hover:scale-105 hover:-translate-y-1 group">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 ring-4 ring-white shadow-lg">
                      <img
                        src="/image/placeholder-person.jpg"
                        alt="นางสาวจุฬาลัย มงคลชัยฤกษ์"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDgiIGN5PSI0OCIgcj0iNDgiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB4PSIyNCIgeT0iMjAiIHdpZHRoPSI0OCIgaGVpZ2h0PSI1NiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOUI5QkEwIj4KPHBhdGggZD0iTTEyIDEyYzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00LTQgMS43OS00IDQgMS43OSA0IDQgNHptMCAyYy0yLjY3IDAtOCAxLjM0LTggNHYyaDE2di0yYzAtMi42Ni01LjMzLTQtOC00eiIvPgo8L3N2Zz4KPC9zdmc+";
                        }}
                      />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-green-800">
                    นางสาวจุฬาลัย มงคลชัยฤกษ์
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-1">
                    ผู้อำนวยการกองคลัง
                  </p>
                  <p className="text-xs text-blue-600 font-medium">
                    โทร: 063-874-4595
                  </p>
                </div>

                {/* ผู้อำนวยการกองช่าง */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-300 shadow-lg rounded-xl p-6 text-center transition-all duration-300 hover:scale-105 hover:-translate-y-1 group">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 ring-4 ring-white shadow-lg">
                      <img
                        src="/image/placeholder-person.jpg"
                        alt="นายพิเชฐ สระอุบล"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDgiIGN5PSI0OCIgcj0iNDgiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB4PSIyNCIgeT0iMjAiIHdpZHRoPSI0OCIgaGVpZ2h0PSI1NiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOUI5QkEwIj4KPHBhdGggZD0iTTEyIDEyYzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00LTQgMS43OS00IDQgMS43OSA0IDQgNHptMCAyYy0yLjY3IDAtOCAxLjM0LTggNHYyaDE2di0yYzAtMi42Ni01LjMzLTQtOC00eiIvPgo8L3N2Zz4KPC9zdmc+";
                        }}
                      />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-orange-800">
                    นายพิเชฐ สระอุบล
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-1">
                    ผู้อำนวยการกองช่าง
                  </p>
                  <p className="text-xs text-blue-600 font-medium">
                    โทร: 089-833-3244
                  </p>
                </div>
              </div>
            </div>

            {/* สำนักปลัดเทศบาล - Special Layout */}
            <div className="mb-12">
              <div
                id="clerk"
                className={`bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-500 ${
                  highlightedDepartment === "clerk"
                    ? "ring-4 ring-yellow-400 ring-opacity-75"
                    : ""
                }`}
              >
                {/* Department Header */}
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

                {/* Department Content */}
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
                    <h4 className="text-lg font-semibold text-center mb-6 text-blue-700">
                      เจ้าหน้าที่และนักวิชาการ
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {personnelData.departments.clerk.staff
                        ?.slice(2, 8)
                        ?.map((person, index) => (
                        ?.slice(2, 8)
                        ?.map((person, index) => (
                          <PersonCard key={index} person={person} />
                        ))}
                    </div>
                  </div>

                  {/* ผู้ช่วยเจ้าหน้าที่ */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-center mb-6 text-blue-700">
                      ผู้ช่วยเจ้าหน้าที่
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {personnelData.departments.clerk.staff
                        ?.slice(8, 12)
                        ?.map((person, index) => (
                        ?.slice(8, 12)
                        ?.map((person, index) => (
                          <PersonCard key={index} person={person} />
                        ))}
                    </div>
                  </div>

                  {/* พนักงานขับรถและเครื่องจักร */}
                  <div className="mb-8">
                    {/* <h4 className="text-lg font-semibold text-center mb-6 text-blue-700">
                      พนักงานขับรถและเครื่องจักร
                    </h4> */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {personnelData.departments.clerk.staff
                        ?.slice(12, 16)
                        ?.map((person, index) => (
                        ?.slice(12, 16)
                        ?.map((person, index) => (
                          <PersonCard key={index} person={person} />
                        ))}
                    </div>
                  </div>

                  {/* คนงานและพนักงานทั่วไป */}
                  <div>
                    {/* <h4 className="text-lg font-semibold text-center mb-6 text-blue-700">
                      คนงานและพนักงานทั่วไป
                    </h4> */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      {personnelData.departments.clerk.staff
                        ?.slice(16)
                        ?.map((person, index) => (
                        ?.slice(16)
                        ?.map((person, index) => (
                          <PersonCard key={index} person={person} />
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* กองคลัง - Special Layout */}
            <div className="mb-12">
              <div
                id="finance"
                className={`bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-500 ${
                  highlightedDepartment === "finance"
                    ? "ring-4 ring-yellow-400 ring-opacity-75"
                    : ""
                }`}
              >
                {/* Department Header */}
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

                {/* Department Content */}
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
                    <h4 className="text-lg font-semibold text-center mb-6 text-green-700">
                      นักวิชาการและเจ้าหน้าที่ชำนาญการ
                    </h4>
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
                    <h4 className="text-lg font-semibold text-center mb-6 text-green-700">
                      นักวิชาการและเจ้าพนักงาน
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <PersonCard
                        person={personnelData.departments.finance.staff[4]}
                      />
                      <PersonCard
                        person={personnelData.departments.finance.staff[5]}
                      />
                      <PersonCard
                        person={personnelData.departments.finance.staff[6]}
                      />
                    </div>
                  </div>

                  {/* ผู้ช่วยเจ้าพนักงาน */}
                  <div>
                    {/* <h4 className="text-lg font-semibold text-center mb-6 text-green-700">
                      ผู้ช่วยเจ้าพนักงาน
                    </h4> */}
                    <div className="flex justify-center">
                      <PersonCard
                        person={personnelData.departments.finance.staff[7]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* กองช่าง - Special Layout */}
            <div className="mb-12">
              <div
                id="engineering"
                className={`bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-500 ${
                  highlightedDepartment === "engineering"
                    ? "ring-4 ring-yellow-400 ring-opacity-75"
                    : ""
                }`}
              >
                {/* Department Header */}
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

                {/* Department Content */}
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
                    <h4 className="text-lg font-semibold text-center mb-6 text-orange-700">
                      หัวหน้าฝ่ายและวิศวกร
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                      <PersonCard
                        person={personnelData.departments.engineering.staff[0]}
                        isHead={true}
                      />
                      <PersonCard
                        person={personnelData.departments.engineering.staff[1]}
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
                    <h4 className="text-lg font-semibold text-center mb-6 text-orange-700">
                      ผู้ช่วยเจ้าพนักงานและพนักงานพิเศษ
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <PersonCard
                        person={personnelData.departments.engineering.staff[2]}
                      />
                      <PersonCard
                        person={personnelData.departments.engineering.staff[4]}
                      />
                      <PersonCard
                        person={personnelData.departments.engineering.staff[10]}
                      />
                    </div>
                  </div>

                  {/* คนงานทั่วไป */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-center mb-6 text-orange-700">
                      คนงานทั่วไป
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <PersonCard
                        person={personnelData.departments.engineering.staff[3]}
                      />
                      <PersonCard
                        person={personnelData.departments.engineering.staff[5]}
                      />
                      <PersonCard
                        person={personnelData.departments.engineering.staff[6]}
                      />
                      <PersonCard
                        person={personnelData.departments.engineering.staff[7]}
                      />
                    </div>
                  </div>

                  {/* คนงานและพนักงานจ้างเหมา */}
                  <div>
                    <h4 className="text-lg font-semibold text-center mb-6 text-orange-700">
                      คนงานและพนักงานจ้างเหมา
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <PersonCard
                        person={personnelData.departments.engineering.staff[8]}
                      />
                      <PersonCard
                        person={personnelData.departments.engineering.staff[9]}
                      />
                      <PersonCard
                        person={personnelData.departments.engineering.staff[11]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* กองการศึกษา - Special Layout */}
            <div className="mb-12">
              <div
                id="education"
                className={`bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-500 ${
                  highlightedDepartment === "education"
                    ? "ring-4 ring-yellow-400 ring-opacity-75"
                    : ""
                }`}
              >
                {/* Department Header */}
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 rounded-lg w-16 h-16 flex items-center justify-center">
                      <div className="w-8 h-8 bg-white/30 rounded"></div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">กองการศึกษาฯ</h3>
                      <p className="text-white/80">
                        หน่วยงานการศึกษา ศาสนา และวัฒนธรรม
                      </p>
                    </div>
                  </div>
                </div>

                {/* Department Content */}
                <div className="p-8">
                  {/* ผู้อำนวยการกองการศึกษา */}
                  <div className="mb-8">
                    <div className="flex justify-center">
                      <PersonCard
                        person={personnelData.departments.education.head}
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
                    <h4 className="text-lg font-semibold text-center mb-6 text-purple-700">
                      หัวหน้าฝ่าย
                    </h4>
                    <div className="flex justify-center">
                      <PersonCard
                        person={personnelData.departments.education.staff[0]}
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

                  {/* นักวิชาการและเจ้าหน้าที่ */}
                  <div>
                    {/* <h4 className="text-lg font-semibold text-center mb-6 text-purple-700">
                      นักวิชาการและเจ้าหน้าที่
                    </h4> */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                      <PersonCard
                        person={personnelData.departments.education.staff[1]}
                      />
                      <PersonCard
                        person={personnelData.departments.education.staff[2]}
                      />
                      <PersonCard
                        person={personnelData.departments.education.staff[3]}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-6 max-w-4xl mx-auto">
                      <PersonCard
                        person={personnelData.departments.education.staff[4]}
                      />
                      <PersonCard
                        person={personnelData.departments.education.staff[5]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Departments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {Object.entries(personnelData.departments)
                .filter(
                  ([key]) =>
                    key !== "clerk" &&
                    key !== "finance" &&
                    key !== "engineering" &&
                    key !== "education"
                )
                .map(([key, dept]) => (
                  <div
                    key={key}
                    id={key}
                    className={`bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-500 ${
                      highlightedDepartment === key
                        ? "ring-4 ring-yellow-400 ring-opacity-75 scale-105"
                        : ""
                    }`}
                  >
                    {/* Department Header */}
                    <div
                      className={`bg-gradient-to-r ${dept.color} p-6 text-white`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-white/20 rounded-lg w-16 h-16 flex items-center justify-center">
                          <div className="w-8 h-8 bg-white/30 rounded"></div>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">{dept.title}</h3>
                          <p className="text-white/80">หน่วยงานบริการประชาชน</p>
                        </div>
                      </div>
                    </div>

                    {/* Department Content */}
                    <div className="p-8">
                      {/* หัวหน้าส่วน */}
                      <div className="mb-8">
                        <div className="flex justify-center">
                          {dept.head && (
                            <PersonCard person={dept.head} isHead={true} />
                          )}
                          {dept.head && (
                            <PersonCard person={dept.head} isHead={true} />
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

                      {/* พนักงาน */}
                      <div className="grid grid-cols-1 gap-6">
                        {dept.staff?.map((person, index) => (
                        {dept.staff?.map((person, index) => (
                          <PersonCard key={index} person={person} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* หน่วยตรวจสอบภายใน - Special Layout */}
            <div className="mb-12">
              <div
                id="audit"
                className={`bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-500 ${
                  highlightedDepartment === "audit"
                    ? "ring-4 ring-yellow-400 ring-opacity-75"
                    : ""
                }`}
              >
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

                {/* Department Content */}
                <div className="p-8">
                  {/* นักวิชาการตรวจสอบภายใน */}
                  <div>
                    <h4 className="text-lg font-semibold text-center mb-6 text-red-700">
                      นักวิชาการตรวจสอบภายใน
                    </h4>
                    <div className="flex justify-center">
                      {personnelData.audit[0] && (
                        <PersonCard person={personnelData.audit[0]} />
                      )}
                      {personnelData.audit[0] && (
                        <PersonCard person={personnelData.audit[0]} />
                      )}
                    </div>
                  </div>
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
