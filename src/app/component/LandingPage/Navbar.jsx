"use client";
import React, { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const [showPersonnelDropdown, setShowPersonnelDropdown] = useState(false);
  const [showBasicDropdown, setShowBasicDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const basicDropdownRef = useRef(null);
  const personnelDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowPersonnelDropdown(false);
      }
      if (basicDropdownRef.current && !basicDropdownRef.current.contains(event.target)) {
        setShowBasicDropdown(false);
      }
      if (personnelDropdownRef.current && !personnelDropdownRef.current.contains(event.target)) {
        setShowPersonnelDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <header className="w-full bg-[linear-gradient(180deg,_#0383AA_0%,_#05C5FF_100%)] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-4">
          {/* Logo and Title */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <img
              src="/image/Logo.png"
              alt="โลโก้เทศบาล"
              className="h-16 w-16 rounded-full border-4 border-white shadow-md bg-white"
            />
            <div className="flex flex-col">
              <span className="text-white text-lg md:text-2xl font-bold leading-tight drop-shadow">
                เทศบาลตำบลบ้านโพธิ์
              </span>
              <span className="text-white text-xs md:text-sm opacity-80">
                Ban Pho Subdistrict, Chachoengsao
              </span>
            </div>
          </div>

          {/* Hamburger for mobile */}
          <div className="md:hidden flex items-center ml-auto">
            <button
              className="text-white text-2xl p-2 focus:outline-none"
              onClick={() => setShowMenu(!showMenu)}
              aria-label="Toggle menu"
            >
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
            </button>
          </div>

          {/* Language, Search, Auth */}
          <div
            className={`flex-col md:flex-row flex items-center gap-2 md:gap-4 mt-4 md:mt-0 w-full md:w-auto justify-end ${
              showMenu ? "flex" : "hidden"
            } md:flex bg-gradient-to-b md:bg-none from-[#1cb5e0]/80 to-[#000046]/80 md:from-transparent md:to-transparent p-4 md:p-0 rounded-lg md:rounded-none absolute md:static top-20 left-0 right-0 z-20 md:z-auto`}
          >
            {/* Close Button for mobile menu */}
            <button
              className="md:hidden absolute top-2 right-2 text-white text-2xl p-2 focus:outline-none"
              onClick={() => setShowMenu(false)}
              aria-label="Close menu"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            {/* Language Selector */}
            <div className="relative w-full md:w-auto mb-2 md:mb-0">
              <select className="bg-white rounded-md px-3 py-1 text-sm font-medium shadow focus:outline-none w-full md:w-auto">
                <option value="th">ไทย</option>
                <option value="en">English</option>
                <option value="kh">ខ្មែរ</option>
                <option value="vn">Tiếng Việt</option>
                <option value="cn">中文</option>
                <option value="la">ລາວ</option>
              </select>
            </div>
            {/* Search Box */}
            <div className="flex items-center bg-white rounded-md px-2 py-1 shadow w-full md:w-auto mb-2 md:mb-0">
              <input
                type="text"
                className="bg-transparent outline-none text-sm px-2 w-full md:w-32"
                placeholder="ค้นหา"
              />
              <button className="text-[#1cb5e0] text-lg px-2">
                <span role="img" aria-label="search">
                  🔍
                </span>
              </button>
            </div>
            {/* Auth Buttons */}
            <a
              href="/admin"
              className="bg-white text-[#1cb5e0] font-semibold px-4 py-1 rounded-md shadow hover:bg-blue-50 transition text-sm w-full md:w-auto mb-2 md:mb-0 text-center"
            >
              เข้าสู่ระบบ
            </a>
            <a
              href="#"
              className="bg-[#1cb5e0] text-white font-semibold px-4 py-1 rounded-md shadow hover:bg-blue-600 transition text-sm w-full md:w-auto text-center"
            >
              สมัครสมาชิก
            </a>
            {/* Main Menu - Mobile */}
            <nav className="flex flex-col gap-2 mt-4 w-full md:hidden">
              <div className="relative">
                <button
                  className="text-white text-base font-medium hover:underline flex items-center gap-1"
                  onClick={() => setShowMenu(showMenu === 'basic' ? false : 'basic')}
                  aria-haspopup="true"
                  aria-expanded={showMenu === 'basic'}
                >
                  ข้อมูลพื้นฐาน
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showMenu === 'basic' && (
                  <div className="mt-2 bg-white rounded-md shadow-lg z-[9999] p-2 flex flex-col gap-1">
                    <a href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">หน้าหลัก</a>
                    <a href="/history" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">ประวัติความเป็นมา</a>
                    <a href="/vision" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">วิสัยทัศน์/พันธกิจ</a>
                    <div className="px-4 py-2 text-sm text-gray-700 font-bold">สภาพและข้อมูลพื้นฐาน</div>
                    <a href="/simple-infomation/general-overview" className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-100">สภาพทั่วไป</a>
                    <a href="/simple-infomation/economic-status" className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-100">สภาพทางเศรษฐกิจ</a>
                    <a href="/simple-infomation/demographics" className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-100">สภาพทางสังคม</a>
                    <a href="/simple-infomation/infrastructure" className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-100">การบริการพื้นฐาน</a>
                    <a href="/simple-infomationdemographics" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">ข้อมูลพื้นฐาน</a>
                    <a href="/structure" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">โครงสร้าง</a>
                    <a href="/executives" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">ข้อมูลผู้บริหาร</a>
                    <a href="/authority" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">อำนาจหน้าที่</a>
                    <a href="/plan" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">แผนการขับเคลื่อนหน่วยงาน</a>
                    <a href="/contact" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">ข้อมูลการติดต่อ</a>
                    <a href="/policy" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">นโยบายการบริหาร</a>
                    <a href="/integrity" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">เจตจำนงสุจริตของผู้บริหาร</a>
                    <a href="/laws" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">กฏหมายที่เกี่ยวข้อง</a>
                    <div className="px-4 py-2 text-sm text-gray-700 font-bold">กิจกรรมเด่นเทศบาลฯ</div>
                    <a href="/activities/2567" className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-100">กิจกรรมประจำปี 2567</a>
                    <a href="/activities/2566" className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-100">กิจกรรมประจำปี 2566</a>
                    <a href="/activities/2565" className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-100">กิจกรรมประจำปี 2565</a>
                    <a href="/activities/2564" className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-100">กิจกรรมประจำปี 2564</a>
                    <a href="/activities/2557-2563" className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-100">กิจกรรมประจำปี 2557-2563</a>
                  </div>
                )}
              </div>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() =>
                    setShowPersonnelDropdown(!showPersonnelDropdown)
                  }
                  className="text-white text-base font-medium hover:underline flex items-center gap-1"
                >
                  บุคลากร
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      showPersonnelDropdown ? "rotate-180" : ""
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
                </button>
                {showPersonnelDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-md shadow-lg z-[9999]">
                    <div className="py-2">
                      <a
                        href="/personnel"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        โครงสร้างบุคลากร
                      </a>
                      <a
                        href="/personnel?section=executives"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        คณะผู้บริหาร
                      </a>
                      <a
                        href="/personnel?section=council"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        สภาเทศบาล
                      </a>
                      <a
                        href="/personnel?section=departments"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        พนักงานเทศบาล
                      </a>
                      <a
                        href="/personnel?section=departments"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        หัวหน้าส่วนราชการ
                      </a>
                      <a
                        href="/personnel?dept=clerk"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        สำนักปลัดเทศบาล
                      </a>
                      <a
                        href="/personnel?dept=finance"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        กองคลัง
                      </a>
                      <a
                        href="/personnel?dept=engineering"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        กองช่าง
                      </a>
                      <a
                        href="/personnel?dept=education"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        กองการศึกษาฯ
                      </a>
                      <a
                        href="/personnel?section=audit"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        หน่วยตรวจสอบภายใน
                      </a>
                    </div>
                  </div>
                )}
              </div>
              <a
                href="/perf-result"
                className="text-white text-base font-medium hover:underline"
              >
                ผลการดำเนินงาน
              </a>
              <a
                href="#"
                className="text-white text-base font-medium hover:underline"
              >
                แผนพัฒนาท้องถิ่น
              </a>
              <a
                href="#"
                className="text-white text-base font-medium hover:underline"
              >
                กฎหมายและระเบียบ
              </a>
              <a
                href="#"
                className="text-white text-base font-medium hover:underline"
              >
                เมนูสำหรับประชาชน
              </a>
              {/* Close Button for mobile menu at bottom */}
              <button
                className="md:hidden mt-4 mx-auto text-white text-2xl p-2 focus:outline-none border border-white rounded-full w-12 h-12 flex items-center justify-center"
                onClick={() => setShowMenu(false)}
                aria-label="Close menu"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </nav>
          </div>
        </div>
        {/* Main Menu - Desktop (move below Logo/Title/Language/Search/Auth) */}
        <nav className="hidden md:flex flex-wrap items-center justify-center gap-6 mt-2">
          <div className="relative" ref={basicDropdownRef}>
            <button
              onClick={() => setShowBasicDropdown(!showBasicDropdown)}
              onMouseEnter={() => setShowBasicDropdown(true)}
              className="text-white text-base font-medium hover:underline flex items-center gap-1"
            >
              ข้อมูล พื้นฐาน
              <svg className={`w-4 h-4 transition-transform ${showBasicDropdown ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showBasicDropdown && (
              <div
                className="absolute top-full left-0 mt-2 w-80 bg-white rounded-md shadow-lg z-[9999] transition-all duration-200"
                onMouseEnter={() => setShowBasicDropdown(true)}
                onMouseLeave={() => setShowBasicDropdown(false)}
              >
                <a href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">หน้าหลัก</a>
                <a href="/history" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">ประวัติความเป็นมา</a>
                <a href="/vision" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">วิสัยทัศน์/พันธกิจ</a>
                <div className="px-4 py-2 text-sm text-gray-700 font-bold">สภาพและข้อมูลพื้นฐาน</div>
                <a href="/simple-infomation/general-overview" className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-100">สภาพทั่วไป</a>
                <a href="/simple-infomation/economic-status" className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-100">สภาพทางเศรษฐกิจ</a>
                <a href="/simple-infomation/demographics" className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-100">สภาพทางสังคม</a>
                <a href="/simple-infomation/infrastructure" className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-100">การบริการพื้นฐาน</a>
                <a href="/simple-infomationdemographics" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">ข้อมูลพื้นฐาน</a>
                <a href="/structure" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">โครงสร้าง</a>
                <a href="/executives" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">ข้อมูลผู้บริหาร</a>
                <a href="/authority" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">อำนาจหน้าที่</a>
                <a href="/plan" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">แผนการขับเคลื่อนหน่วยงาน</a>
                <a href="/contact" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">ข้อมูลการติดต่อ</a>
                <a href="/policy" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">นโยบายการบริหาร</a>
                <a href="/integrity" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">เจตจำนงสุจริตของผู้บริหาร</a>
                <a href="/laws" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">กฏหมายที่เกี่ยวข้อง</a>
                <div className="px-4 py-2 text-sm text-gray-700 font-bold">กิจกรรมเด่นเทศบาลฯ</div>
                <a href="/activities/2567" className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-100">กิจกรรมประจำปี 2567</a>
                <a href="/activities/2566" className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-100">กิจกรรมประจำปี 2566</a>
                <a href="/activities/2565" className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-100">กิจกรรมประจำปี 2565</a>
                <a href="/activities/2564" className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-100">กิจกรรมประจำปี 2564</a>
                <a href="/activities/2557-2563" className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-100">กิจกรรมประจำปี 2557-2563</a>
              </div>
            )}
          </div>
          <div className="relative" ref={personnelDropdownRef}>
            <button
              onClick={() => setShowPersonnelDropdown(!showPersonnelDropdown)}
              onMouseEnter={() => setShowPersonnelDropdown(true)}
              className="text-white text-base font-medium hover:underline flex items-center gap-1"
            >
              บุคลากร
              <svg
                className={`w-4 h-4 transition-transform ${
                  showPersonnelDropdown ? "rotate-180" : ""
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
            </button>
            {showPersonnelDropdown && (
              <div
                className="absolute top-full left-0 mt-2 w-64 bg-white rounded-md shadow-lg z-[9999] transition-all duration-200"
                onMouseEnter={() => setShowPersonnelDropdown(true)}
                onMouseLeave={() => setShowPersonnelDropdown(false)}
              >
                <div className="py-2">
                  <a
                    href="/personnel"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    โครงสร้างบุคลากร
                  </a>
                  <a
                    href="/personnel?section=executives"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    คณะผู้บริหาร
                  </a>
                  <a
                    href="/personnel?section=council"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    สภาเทศบาล
                  </a>
                  <a
                    href="/personnel?section=departments"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    พนักงานเทศบาล
                  </a>
                  <a
                    href="/personnel?section=departments"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    หัวหน้าส่วนราชการ
                  </a>
                  <a
                    href="/personnel?dept=clerk"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    สำนักปลัดเทศบาล
                  </a>
                  <a
                    href="/personnel?dept=finance"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    กองคลัง
                  </a>
                  <a
                    href="/personnel?dept=engineering"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    กองช่าง
                  </a>
                  <a
                    href="/personnel?dept=education"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    กองการศึกษาฯ
                  </a>
                  <a
                    href="/personnel?section=audit"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    หน่วยตรวจสอบภายใน
                  </a>
                </div>
              </div>
            )}
          </div>
          <a
            href="/perf-result"
            className="text-white text-base font-medium hover:underline"
          >
            ผลการดำเนินงาน
          </a>
          <a
            href="#"
            className="text-white text-base font-medium hover:underline"
          >
            แผนพัฒนาท้องถิ่น
          </a>
          <a
            href="#"
            className="text-white text-base font-medium hover:underline"
          >
            กฎหมายและระเบียบ
          </a>
          <a
            href="#"
            className="text-white text-base font-medium hover:underline"
          >
            เมนูสำหรับประชาชน
          </a>
        </nav>
      </div>
      {/* Decorative background branch (optional, can use absolute image or SVG) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* You can add a background SVG or image here for the branch effect */}
      </div>
    </header>
  );
}
