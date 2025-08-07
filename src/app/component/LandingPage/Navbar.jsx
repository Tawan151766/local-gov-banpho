"use client";
import React, { useState, useEffect, useRef } from "react";
import Translator from "./Translator.jsx";

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const closeDropdown = () => setActiveDropdown(null);

  const basicInfoMenu = [
    { href: "/", label: "หน้าหลัก" },
    { href: "/history", label: "ประวัติความเป็นมา" },
    { href: "/vision", label: "วิสัยทัศน์/พันธกิจ" },
    {
      label: "สภาพและข้อมูลพื้นฐาน",
      isHeader: true,
      submenu: [
        { href: "/simple-infomation/general-overview", label: "สภาพทั่วไป" },
        {
          href: "/simple-infomation/economic-status",
          label: "สภาพทางเศรษฐกิจ",
        },
        { href: "/simple-infomation/demographics", label: "สภาพทางสังคม" },
        {
          href: "/simple-infomation/infrastructure",
          label: "การบริการพื้นฐาน",
        },
      ],
    },
    { href: "/authority", label: "อำนาจหน้าที่" },
    { href: "/policy", label: "นโยบายการบริหาร" },
    { href: "/integrity", label: "เจตจำนงสุจริตของผู้บริหาร" },
  ];

  const personnelMenu = [
    { href: "/personnel", label: "โครงสร้างบุคลากร" },
    { href: "/personnel?section=executives", label: "คณะผู้บริหาร" },
    { href: "/personnel?section=council", label: "สภาเทศบาล" },
    { href: "/personnel?section=departments", label: "พนักงานเทศบาล" },
    { href: "/personnel?section=departments", label: "หัวหน้าส่วนราชการ" },
    { href: "/personnel?dept=clerk", label: "สำนักปลัดเทศบาล" },
    { href: "/personnel?dept=finance", label: "กองคลัง" },
    { href: "/personnel?dept=engineering", label: "กองช่าง" },
    { href: "/personnel?dept=education", label: "กองการศึกษาฯ" },
    { href: "/personnel?section=audit", label: "หน่วยตรวจสอบภายใน" },
  ];

  const performanceMenu = [
    {
      href: "/perf-result?tab=operation-report",
      label: "รายงานผลการดำเนินงาน",
    },
    {
      href: "/perf-result?tab=procurement",
      label: "การจัดซื้อจัดจ้าง/การจัดหาพัสดุ",
    },
    { href: "/perf-result?tab=financial-report", label: "รายงานการคลัง" },
    {
      href: "/perf-result?tab=transparency-measures",
      label: "มาตรการส่งเสริมความโปร่งใส",
    },
    {
      href: "/perf-result?tab=hr-management",
      label: "การบริหารและทรัพยากรบุคคล",
    },
    { href: "/perf-result?tab=statistics", label: "ข้อมูลเชิงสถิติ" },
    {
      href: "/perf-result?tab=participation",
      label: "การเปิดโอกาสให้เกิดการมีส่วนร่วม",
    },
  ];

  const localDevPlanMenu = [
    {
      href: "/local-development-plan?tab=four-year-plan",
      label: "แผนพัฒนาสี่ปี",
    },
    { href: "/local-development-plan?tab=action-plan", label: "แผนปฏิบัติการ" },
    { href: "/local-development-plan?tab=community-plan", label: "แผนชุมชน" },
    {
      href: "/local-development-plan?tab=strategic-plan",
      label: "แผนยุทธศาสตร์",
    },
    {
      href: "/local-development-plan?tab=manpower-plan",
      label: "แผนอัตรากำลัง",
    },
    {
      href: "/local-development-plan?tab=procurement-plan",
      label: "แผนการจัดหาพัสดุ",
    },
  ];

  const citizenMenu = [
    { href: "/citizen/complaints", label: "รับเรื่องราวร้องทุกข์" },
    {
      href: "/e-service/corruption-complaint",
      label: "รับแจ้งเรื่องราวร้องเรียนการทุจริตและประพฤติมิชอบ",
    },
    { href: "/citizen/work-manual", label: "คู่มือปฏิบัติงาน" },
    {
      href: "/citizen/service-standards",
      label: "คู่มือหรือมาตรฐานการให้บริการประชาชน",
    },
    { href: "/citizen/citizen-manual", label: "คู่มือประชาชน" },
    { href: "/citizen/documents", label: "เอกสารดาวน์โหลด/แบบฟอร์มต่างๆ" },
    { href: "/citizen/work-process", label: "ลดขั้นตอนการปฏิบัติงาน" },
  ];

  const languages = [
    { value: "th", label: "🇹🇭 ไทย" },
    { value: "en", label: "🇬🇧 English" },
    { value: "kh", label: "🇰🇭 ខ្មែរ" },
    { value: "vn", label: "🇻🇳 Tiếng Việt" },
    { value: "cn", label: "🇨🇳 中文" },
    { value: "la", label: "🇱🇦 ລາວ" },
  ];

  // Component สำหรับ Dropdown
  const DropdownMenu = ({ items, isActive, width = "w-80" }) => (
    <div
      className={`absolute top-full left-0 mt-2 ${width} ${
        isActive
          ? "opacity-100 visible"
          : "opacity-0 invisible group-hover:opacity-100 group-hover:visible"
      } transition-all duration-200 bg-white rounded-md shadow-lg z-50`}
    >
      <div className="py-2">
        {items.map((item, index) => (
          <div key={index}>
            {item.isHeader ? (
              <>
                <div className="px-4 py-2 text-sm text-gray-700 font-bold">
                  {item.label}
                </div>
                {item.submenu?.map((subitem, subindex) => (
                  <a
                    key={subindex}
                    href={subitem.href}
                    className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={closeDropdown}
                  >
                    {subitem.label}
                  </a>
                ))}
              </>
            ) : (
              <a
                href={item.href}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={closeDropdown}
              >
                {item.label}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Component  Desktop Menu Item
  const MenuItem = ({ title, items, dropdownKey, width = "w-80" }) => (
    <div className="group relative">
      <div
        className="text-white text-base font-medium hover:underline hover:text-[#01385F] hover:text-bold hover:text-[20px] transition-all duration-300 flex items-center gap-1 cursor-pointer"
        onClick={() => toggleDropdown(dropdownKey)}
      >
        {title}
        <svg
          className={`w-4 h-4 transition-transform group-hover:rotate-180 ${
            activeDropdown === dropdownKey ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
      <DropdownMenu
        items={items}
        isActive={activeDropdown === dropdownKey}
        width={width}
      />
    </div>
  );

  // Component  Mobile Menu Item
  const MobileMenuItem = ({ title, items, dropdownKey }) => {
    const isActive = activeDropdown === dropdownKey;

    return (
      <div className="border-b border-white/30 last:border-b-0">
        <button
          className="w-full flex items-center justify-between text-white text-base font-medium py-4 px-4 rounded-lg hover:bg-white/20 transition-colors active:bg-white/30"
          onClick={() => toggleDropdown(dropdownKey)}
        >
          <span className="text-left">{title}</span>
          <svg
            className={`w-6 h-6 transition-transform duration-300 flex-shrink-0 ml-2 ${
              isActive ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isActive ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pl-4 pr-2 pb-3 space-y-1 bg-white/5 rounded-b-lg">
            {items.map((item, index) => (
              <div key={index}>
                {item.isHeader ? (
                  <>
                    <div className="text-white/90 text-sm font-semibold py-3 px-3 border-b border-white/20">
                      {item.label}
                    </div>
                    {item.submenu?.map((subitem, subindex) => (
                      <a
                        key={subindex}
                        href={subitem.href}
                        className="block text-white/85 text-sm py-3 px-6 rounded-md hover:bg-white/15 transition-colors active:bg-white/25"
                        onClick={() => {
                          setShowMenu(false);
                          setActiveDropdown(null);
                        }}
                      >
                        • {subitem.label}
                      </a>
                    ))}
                  </>
                ) : (
                  <a
                    href={item.href}
                    className="block text-white/90 text-sm py-3 px-3 rounded-md hover:bg-white/15 transition-colors active:bg-white/25"
                    onClick={() => {
                      setShowMenu(false);
                      setActiveDropdown(null);
                    }}
                  >
                    {item.label}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <header
      ref={navRef}
      className="w-full bg-[linear-gradient(180deg,_#0383AA_0%,_#05C5FF_100%)] relative z-[100]"
    >
      {/* Background images */}
      <img
        src="/image/white_tree.png"
        alt="white tree"
        className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none z-[-1]"
      />
      <img
        src="/image/white_tree.png"
        alt="white tree"
        className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none z-[-1] scale-x-[-1]"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex flex-row md:flex-row items-center justify-between py-4">
          {/* Logo and Title */}
          <a
            href="/"
            className="pointer flex items-center gap-4 w-full md:w-auto"
          >
            <img
              src="/image/logobanpho.png"
              alt="โลโก้เทศบาล"
              className="h-16 w-16 rounded-full border-4 border-white shadow-md bg-white"
            />
            <div className="flex flex-col">
              <span className="text-white text-lg md:text-2xl font-bold leading-tight drop-shadow">
                เทศบาลตำบลบ้านโพธิ์
              </span>
              <span className="text-white text-xs md:text-sm opacity-80">
                Ban Pho Subdistrict Chachoengsao
              </span>
            </div>
          </a>

          {/* Top Menu Items - Desktop Only */}
          <div className="hidden md:flex flex-row items-center gap-4 mt-0">
            {/* Language Selector */}

            <select className="bg-white px-3 text-[#1E1E1E] text-sm font-medium shadow w-auto h-[30px] rounded-[15px] focus:outline-none">
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>

            {/* <Translator /> */}

            {/* Blind Icon */}
            <div className="bg-white rounded-sm p-2 cursor-pointer shadow hover:shadow-md transition-shadow">
              <img
                src="/image/blind.png"
                alt="blind"
                className="w-5 h-5 cursor-pointer"
              />
            </div>

            {/* Search Box */}
            <div className="flex items-center bg-white px-3 shadow w-auto h-[30px] rounded-[15px]">
              <input
                type="text"
                className="bg-transparent outline-none text-sm px-2 w-32 placeholder:text-[#00000080]"
                placeholder="ค้นหา"
              />
              <button className="text-[#1cb5e0] text-lg px-2 hover:scale-110 transition-transform">
                🔍
              </button>
            </div>

            {/* Auth Buttons */}
            <a
              href="/admin"
              className="text-white text-[15px] px-4 py-1 rounded-md hover:bg-white hover:text-[#1cb5e0] transition text-center"
            >
              เข้าสู่ระบบ
            </a>
            <a
              href="#"
              className="bg-white text-[15px] text-[#1cb5e0] px-4 py-1 rounded-md shadow hover:scale-105 transition text-center font-medium"
            >
              สมัครสมาชิก
            </a>
            <a
              href="#"
              className="bg-white text-[15px] text-[#1cb5e0] px-4 py-1 rounded-md shadow hover:scale-105 transition text-center font-medium"
            >
              ติดต่อเรา
            </a>
          </div>

          {/* Hamburger Menu - Mobile Only */}
          <div className="md:hidden flex items-center ml-auto">
            <button
              className="text-white text-2xl p-2 focus:outline-none z-[10000] relative"
              onClick={() => setShowMenu(!showMenu)}
            >
              {showMenu ? (
                <svg
                  width="28"
                  height="28"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  width="28"
                  height="28"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {showMenu && (
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-[9998]"
            onClick={() => setShowMenu(false)}
          />
        )}

        {/* Mobile Menu */}
        <div
          className={`md:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-gradient-to-b from-[#1cb5e0]/95 to-[#000046]/95 backdrop-blur-sm transform transition-transform duration-300 ease-in-out z-[9999] ${
            showMenu ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6 h-full overflow-y-auto ">
            {/* Mobile Top Section */}
            <div className="mb-6 space-y-4">
              {/* Language Selector - แก้ไขให้มีขนาดที่เหมาะสม */}
              <select className="bg-white px-3 text-[#1E1E1E] text-sm font-medium shadow w-40 h-[40px] rounded-[15px] focus:outline-none">
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>

              {/* Utility Row - จัดเรียงใหม่ให้เหมาะสม */}
              <div className="flex items-center gap-3">
                <div className="bg-white rounded-sm p-2 cursor-pointer shadow hover:shadow-md transition-shadow flex-shrink-0">
                  <img
                    src="/image/blind.png"
                    alt="blind"
                    className="w-5 h-5 cursor-pointer"
                  />
                </div>

                <div className="flex items-center bg-white px-3 shadow h-[40px] rounded-[15px] flex-1 min-w-0">
                  <input
                    type="text"
                    className="bg-transparent outline-none text-sm px-2 flex-1 min-w-0 placeholder:text-[#00000080]"
                    placeholder="ค้นหา"
                  />
                  <button className="text-[#1cb5e0] text-lg px-2 hover:scale-110 transition-transform flex-shrink-0">
                    🔍
                  </button>
                </div>
              </div>

              {/* Auth Buttons */}
              <div className="space-y-2">
                <a
                  href="/admin"
                  className="block text-white text-center text-base px-4 py-3 rounded-md border border-white/30 hover:bg-white hover:text-[#1cb5e0] transition"
                  onClick={() => setShowMenu(false)}
                >
                  เข้าสู่ระบบ
                </a>
                <a
                  href="#"
                  className="block bg-white text-[#1cb5e0] text-center text-base px-4 py-3 rounded-md shadow hover:scale-105 transition font-medium"
                  onClick={() => setShowMenu(false)}
                >
                  สมัครสมาชิก
                </a>
                <a
                  href="#"
                  className="block bg-white text-[#1cb5e0] text-center text-base px-4 py-3 rounded-md shadow hover:scale-105 transition font-medium"
                  onClick={() => setShowMenu(false)}
                >
                  ติดต่อเรา
                </a>
              </div>
            </div>

            {/* Mobile Navigation Menu */}
            <div className="border-t-2 border-white/40 pt-4">
              <h3 className="text-white font-bold text-lg mb-4 text-center">
                เมนูหลัก
              </h3>
              <div className="space-y-1">
                <MobileMenuItem
                  title="ข้อมูลพื้นฐาน"
                  items={basicInfoMenu}
                  dropdownKey="basic-mobile"
                />
                <MobileMenuItem
                  title="บุคลากร"
                  items={personnelMenu}
                  dropdownKey="personnel-mobile"
                />
                <MobileMenuItem
                  title="ผลการดำเนินงาน"
                  items={performanceMenu}
                  dropdownKey="performance-mobile"
                />
                <MobileMenuItem
                  title="แผนพัฒนาท้องถิ่น"
                  items={localDevPlanMenu}
                  dropdownKey="local-dev-plan-mobile"
                />
                <a
                  href="/laws-regulations"
                  className="block text-white text-base font-medium py-4 px-4 rounded-lg hover:bg-white/20 transition-colors border-b border-white/30"
                  onClick={() => setShowMenu(false)}
                >
                  กฎหมายและระเบียบ
                </a>

                <MobileMenuItem
                  title="เมนูสำหรับประชาชน"
                  items={citizenMenu}
                  dropdownKey="citizen-mobile"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation Menu - Desktop */}
        <nav className="hidden md:flex flex-wrap items-center justify-center gap-6 mt-2">
          <MenuItem
            title="ข้อมูลพื้นฐาน"
            items={basicInfoMenu}
            dropdownKey="basic"
          />
          <MenuItem
            title="บุคลากร"
            items={personnelMenu}
            dropdownKey="personnel"
            width="w-64"
          />
          <MenuItem
            title="ผลการดำเนินงาน"
            items={performanceMenu}
            dropdownKey="performance"
            width="w-80"
          />
          <MenuItem
            title="แผนพัฒนาท้องถิ่น"
            items={localDevPlanMenu}
            dropdownKey="local-dev-plan"
            width="w-64"
          />
          <a
            href="/laws-regulations"
            className="text-white text-base font-medium hover:underline hover:text-[#01385F] hover:text-[20px] hover:text-bold transition-all duration-300"
          >
            กฎหมายและระเบียบ
          </a>

          <MenuItem
            title="เมนูสำหรับประชาชน"
            items={citizenMenu}
            dropdownKey="citizen"
          />
        </nav>
      </div>
    </header>
  );
}
