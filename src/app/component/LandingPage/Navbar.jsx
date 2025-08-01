"use client";
import React, { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const [showBasicInfoDropdown, setShowBasicInfoDropdown] = useState(false);
  const [showPersonnelDropdown, setShowPersonnelDropdown] = useState(false);
  const [showCitizenDropdown, setShowCitizenDropdown] = useState(false);
  const navRef = useRef(null);

  // ปิด dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setShowBasicInfoDropdown(false);
        setShowPersonnelDropdown(false);
        setShowCitizenDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header
      ref={navRef}
      className="w-full bg-[linear-gradient(180deg,_#0383AA_0%,_#05C5FF_100%)] relative z-10"
    >
      {/* Background image ซ้อนทับ */}
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
        <div className="flex flex-col md:flex-row items-center justify-between py-4">
          {/* Logo and Title */}
          <a
            href="/"
            className="pointer flex items-center gap-4 w-full md:w-auto"
          >
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
          </a>

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
              <select
                className="bg-white px-3 text-[#1E1E1E] text-sm font-medium shadow w-full md:w-auto
               h-[30px] rounded-[15px] focus:outline-none"
              >
                <option value="th">🇹🇭ไทย</option>
                <option value="en">🇬🇧English</option>
                <option value="kh">🇰🇭ខ្មែរ</option>
                <option value="vn">🇻🇳Tiếng Việt</option>
                <option value="cn">🇨🇳中文</option>
                <option value="la">🇱🇦ລາວ</option>
              </select>
            </div>

            <div className="bg-white rounded-sm p-1 cursor-pointer">
              <img
                src="/image/blind.png"
                alt="blind"
                className="w-5 h-5 cursor-pointer"
              />
            </div>

            {/* Search Box */}
            <div
              className="flex items-center bg-white px-2 shadow w-full md:w-auto mb-2 md:mb-0
             h-[30px] rounded-[15px]"
            >
              <input
                type="text"
                className="bg-transparent outline-none text-sm px-2 w-full md:w-32
               placeholder:text-[#00000080]"
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
              className=" text-[white] text-[15px] px-4 py-1 rounded-md hover:bg-white hover:text-[#1cb5e0] transition text-sm w-full md:w-auto mb-2 md:mb-0 text-center"
            >
              เข้าสู่ระบบ
            </a>
            <a
              href="#"
              className="bg-[white] text-[15px] text-[#1cb5e0] px-4 py-1 rounded-md shadow hover:scale-105 transition text-sm w-full md:w-auto text-center"
            >
              สมัครสมาชิก
            </a>

            {/* Main Menu - Mobile */}
            <nav className="flex flex-col gap-2 mt-4 w-full md:hidden ">
              {/* ข้อมูลพื้นฐาน - Mobile */}
              <div className="relative">
                <div
                  className="text-white text-base font-medium hover:underline hover:text-[#01385F] hover:text-bold hover:text-[20px] transition-all duration-300 flex items-center gap-1 cursor-pointer"
                  onClick={() =>
                    setShowBasicInfoDropdown(!showBasicInfoDropdown)
                  }
                >
                  ข้อมูลพื้นฐาน
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      showBasicInfoDropdown ? "rotate-180" : ""
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
                <div
                  className={`${
                    showBasicInfoDropdown
                      ? "opacity-100 visible"
                      : "opacity-0 invisible"
                  } transition-all duration-200 mt-2 bg-white rounded-md shadow-lg p-2 flex flex-col gap-1 relative z-50`}
                >
                  <a
                    href="/"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowBasicInfoDropdown(false)}
                  >
                    หน้าหลัก
                  </a>
                  <a
                    href="/history"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowBasicInfoDropdown(false)}
                  >
                    ประวัติความเป็นมา
                  </a>
                  <a
                    href="/vision"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowBasicInfoDropdown(false)}
                  >
                    วิสัยทัศน์/พันธกิจ
                  </a>
                  <div className="px-4 py-2 text-sm text-gray-700 font-bold">
                    สภาพและข้อมูลพื้นฐาน
                  </div>
                  <a
                    href="/simple-infomation/general-overview"
                    className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowBasicInfoDropdown(false)}
                  >
                    สภาพทั่วไป
                  </a>
                  <a
                    href="/simple-infomation/economic-status"
                    className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowBasicInfoDropdown(false)}
                  >
                    สภาพทางเศรษฐกิจ
                  </a>
                  <a
                    href="/simple-infomation/demographics"
                    className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowBasicInfoDropdown(false)}
                  >
                    สภาพทางสังคม
                  </a>
                  <a
                    href="/simple-infomation/infrastructure"
                    className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowBasicInfoDropdown(false)}
                  >
                    การบริการพื้นฐาน
                  </a>
                  <a
                    href="/authority"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowBasicInfoDropdown(false)}
                  >
                    อำนาจหน้าที่
                  </a>
                  <a
                    href="/policy"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowBasicInfoDropdown(false)}
                  >
                    นโยบายการบริหาร
                  </a>
                  <a
                    href="/integrity"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowBasicInfoDropdown(false)}
                  >
                    เจตจำนงสุจริตของผู้บริหาร
                  </a>
                </div>
              </div>

              {/* บุคลากร - Mobile */}
              <div className="relative">
                <div
                  className="text-white text-base font-medium hover:underline hover:text-[#01385F] hover:text-bold hover:text-[20px] transition-all duration-300 flex items-center gap-1 cursor-pointer"
                  onClick={() =>
                    setShowPersonnelDropdown(!showPersonnelDropdown)
                  }
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
                </div>
                <div
                  className={`${
                    showPersonnelDropdown
                      ? "opacity-100 visible"
                      : "opacity-0 invisible"
                  } transition-all duration-200 mt-2 bg-white rounded-md shadow-lg p-2 flex flex-col gap-1 relative z-50`}
                >
                  <a
                    href="/personnel"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowPersonnelDropdown(false)}
                  >
                    โครงสร้างบุคลากร
                  </a>
                  <a
                    href="/personnel?section=executives"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowPersonnelDropdown(false)}
                  >
                    คณะผู้บริหาร
                  </a>
                  <a
                    href="/personnel?section=council"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowPersonnelDropdown(false)}
                  >
                    สภาเทศบาล
                  </a>
                  <a
                    href="/personnel?section=departments"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowPersonnelDropdown(false)}
                  >
                    พนักงานเทศบาล
                  </a>
                  <a
                    href="/personnel?dept=clerk"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowPersonnelDropdown(false)}
                  >
                    สำนักปลัดเทศบาล
                  </a>
                  <a
                    href="/personnel?dept=finance"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowPersonnelDropdown(false)}
                  >
                    กองคลัง
                  </a>
                  <a
                    href="/personnel?dept=engineering"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowPersonnelDropdown(false)}
                  >
                    กองช่าง
                  </a>
                  <a
                    href="/personnel?dept=education"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowPersonnelDropdown(false)}
                  >
                    กองการศึกษาฯ
                  </a>
                  <a
                    href="/personnel?section=audit"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowPersonnelDropdown(false)}
                  >
                    หน่วยตรวจสอบภายใน
                  </a>
                </div>
              </div>

              <a
                href="/perf-result"
                className="text-white text-base font-medium hover:underline hover:text-[#01385F] hover:text-bold hover:text-[20px] transition-all duration-300"
              >
                ผลการดำเนินงาน
              </a>
              <a
                href="/local-development-plan"
                className="text-white text-base font-medium hover:underline hover:text-[#01385F] hover:text-bold hover:text-[20px] transition-all duration-300"
              >
                แผนพัฒนาท้องถิ่น
              </a>
              <a
                href="#"
                className="text-white text-base font-medium hover:underline hover:text-[#01385F] hover:text-bold hover:text-[20px] transition-all duration-300"
              >
                กฎหมายและระเบียบ
              </a>
              {/* เมนูสำหรับประชาชน - Mobile */}
              <div className="relative">
                <div
                  className="text-white text-base font-medium hover:underline hover:text-[#01385F] hover:text-bold hover:text-[20px] transition-all duration-300 flex items-center gap-1 cursor-pointer"
                  onClick={() => setShowCitizenDropdown(!showCitizenDropdown)}
                >
                  เมนูสำหรับประชาชน
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      showCitizenDropdown ? "rotate-180" : ""
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
                <div
                  className={`${
                    showCitizenDropdown
                      ? "opacity-100 visible"
                      : "opacity-0 invisible"
                  } transition-all duration-200 mt-2 bg-white rounded-md shadow-lg p-2 flex flex-col gap-1 relative z-50`}
                >
                  <a
                    href="/citizen/complaints"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowCitizenDropdown(false)}
                  >
                    รับเรื่องราวร้องทุกข์
                  </a>
                  <a
                    href="/citizen/complaints-quality"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowCitizenDropdown(false)}
                  >
                    รับแจ้งร้องเรียนกวรคุณภาพดีมีชอบ
                  </a>
                  <a
                    href="/citizen/manual"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowCitizenDropdown(false)}
                  >
                    คู่มือปฏิบัติงาน
                  </a>
                  <a
                    href="/citizen/service-standards"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowCitizenDropdown(false)}
                  >
                    คู่มือหรือมาตรฐานการให้บริการประชาชน
                  </a>
                  <a
                    href="/citizen/citizen-manual"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowCitizenDropdown(false)}
                  >
                    คู่มือประชาชน
                  </a>
                  <a
                    href="/citizen/documents"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowCitizenDropdown(false)}
                  >
                    เอกสารดาวน์โหลด/แบบฟอร์มต่างๆ
                  </a>
                  <a
                    href="/citizen/work-process"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowCitizenDropdown(false)}
                  >
                    ลิดขั้นตอนการปฏิบัติงาน
                  </a>
                </div>
              </div>

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

        {/* Main Menu - Desktop */}
        <nav className="hidden md:flex flex-wrap items-center justify-center gap-6 mt-2">
          {/* ข้อมูลพื้นฐาน - Desktop */}
          <div className="group relative">
            <div
              className="text-white text-base font-medium hover:underline hover:text-[#01385F] hover:text-bold hover:text-[20px] transition-all duration-300 flex items-center gap-1 cursor-pointer"
              onClick={() => setShowBasicInfoDropdown(!showBasicInfoDropdown)}
            >
              ข้อมูลพื้นฐาน
              <svg
                className={`w-4 h-4 transition-transform group-hover:rotate-180 ${
                  showBasicInfoDropdown ? "rotate-180" : ""
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
            <div
              className={`absolute top-full left-0 mt-2 w-80 ${
                showBasicInfoDropdown
                  ? "opacity-100 visible"
                  : "opacity-0 invisible group-hover:opacity-100 group-hover:visible"
              } transition-all duration-200 bg-white rounded-md shadow-lg z-50`}
            >
              <div className="py-2">
                <a
                  href="/"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setShowBasicInfoDropdown(false)}
                >
                  หน้าหลัก
                </a>
                <a
                  href="/history"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setShowBasicInfoDropdown(false)}
                >
                  ประวัติความเป็นมา
                </a>
                <a
                  href="/vision"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setShowBasicInfoDropdown(false)}
                >
                  วิสัยทัศน์/พันธกิจ
                </a>
                <div className="px-4 py-2 text-sm text-gray-700 font-bold">
                  สภาพและข้อมูลพื้นฐาน
                </div>
                <a
                  href="/simple-infomation/general-overview"
                  className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setShowBasicInfoDropdown(false)}
                >
                  สภาพทั่วไป
                </a>
                <a
                  href="/simple-infomation/economic-status"
                  className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setShowBasicInfoDropdown(false)}
                >
                  สภาพทางเศรษฐกิจ
                </a>
                <a
                  href="/simple-infomation/demographics"
                  className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setShowBasicInfoDropdown(false)}
                >
                  สภาพทางสังคม
                </a>
                <a
                  href="/simple-infomation/infrastructure"
                  className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setShowBasicInfoDropdown(false)}
                >
                  การบริการพื้นฐาน
                </a>
                <a
                  href="/authority"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setShowBasicInfoDropdown(false)}
                >
                  อำนาจหน้าที่
                </a>
                <a
                  href="/policy"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setShowBasicInfoDropdown(false)}
                >
                  นโยบายการบริหาร
                </a>
                <a
                  href="/integrity"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setShowBasicInfoDropdown(false)}
                >
                  เจตจำนงสุจริตของผู้บริหาร
                </a>
              </div>
            </div>
          </div>

          {/* บุคลากร - Desktop */}
          <div className="group relative">
            <div
              className="text-white text-base font-medium hover:underline hover:text-[#01385F] hover:text-bold hover:text-[20px] transition-all duration-300 flex items-center gap-1 cursor-pointer"
              onClick={() => setShowPersonnelDropdown(!showPersonnelDropdown)}
            >
              บุคลากร
              <svg
                className={`w-4 h-4 transition-transform group-hover:rotate-180 ${
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
            </div>
            <div
              className={`absolute top-full left-0 mt-2 w-64 ${
                showPersonnelDropdown
                  ? "opacity-100 visible"
                  : "opacity-0 invisible group-hover:opacity-100 group-hover:visible"
              } transition-all duration-200 bg-white rounded-md shadow-lg z-50`}
            >
              <div className="py-2">
                <a
                  href="/personnel"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setShowPersonnelDropdown(false)}
                >
                  โครงสร้างบุคลากร
                </a>
                <a
                  href="/personnel?section=executives"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setShowPersonnelDropdown(false)}
                >
                  คณะผู้บริหาร
                </a>
                <a
                  href="/personnel?section=council"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setShowPersonnelDropdown(false)}
                >
                  สภาเทศบาล
                </a>
                <a
                  href="/personnel?section=departments"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setShowPersonnelDropdown(false)}
                >
                  พนักงานเทศบาล
                </a>
                <a
                  href="/personnel?section=departments"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setShowPersonnelDropdown(false)}
                >
                  หัวหน้าส่วนราชการ
                </a>
                <a
                  href="/personnel?dept=clerk"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setShowPersonnelDropdown(false)}
                >
                  สำนักปลัดเทศบาล
                </a>
                <a
                  href="/personnel?dept=finance"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setShowPersonnelDropdown(false)}
                >
                  กองคลัง
                </a>
                <a
                  href="/personnel?dept=engineering"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setShowPersonnelDropdown(false)}
                >
                  กองช่าง
                </a>
                <a
                  href="/personnel?dept=education"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setShowPersonnelDropdown(false)}
                >
                  กองการศึกษาฯ
                </a>
                <a
                  href="/personnel?section=audit"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setShowPersonnelDropdown(false)}
                >
                  หน่วยตรวจสอบภายใน
                </a>
              </div>
            </div>
          </div>

          <a
            href="/perf-result"
            className="text-white text-base font-medium hover:underline hover:text-[#01385F] hover:text-[20px] hover:text-bold transition-all duration-300"
          >
            ผลการดำเนินงาน
          </a>
          <a
            href="/local-development-plan"
            className="text-white text-base font-medium hover:underline hover:text-[#01385F] hover:text-[20px] hover:text-bold transition-all duration-300"
          >
            แผนพัฒนาท้องถิ่น
          </a>
          <a
            href="#"
            className="text-white text-base font-medium hover:underline hover:text-[#01385F] hover:text-[20px] hover:text-bold transition-all duration-300"
          >
            กฎหมายและระเบียบ
          </a>
          {/* เมนูสำหรับประชาชน - Desktop */}
          <div className="group relative">
            <div
              className="text-white text-base font-medium hover:underline hover:text-[#01385F] hover:text-bold hover:text-[20px] transition-all duration-300 flex items-center gap-1 cursor-pointer"
              onClick={() => setShowCitizenDropdown(!showCitizenDropdown)}
            >
              เมนูสำหรับประชาชน
              <svg
                className={`w-4 h-4 transition-transform group-hover:rotate-180 ${
                  showCitizenDropdown ? "rotate-180" : ""
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
            <div
              className={`absolute top-full left-0 mt-2 w-80 ${
                showCitizenDropdown
                  ? "opacity-100 visible"
                  : "opacity-0 invisible group-hover:opacity-100 group-hover:visible"
              } transition-all duration-200 bg-white rounded-md shadow-lg z-50`}
            >
              <div className="py-2">
                <a
                  href="/citizen/complaints"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setShowCitizenDropdown(false)}
                >
                  รับเรื่องราวร้องทุกข์
                </a>
                <a
                  href="/citizen/complaints-quality"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setShowCitizenDropdown(false)}
                >
                  รับแจ้งร้องเรียนกวรคุณภาพดีมีชอบ
                </a>
                <a
                  href="/citizen/manual"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setShowCitizenDropdown(false)}
                >
                  คู่มือปฏิบัติงาน
                </a>
                <a
                  href="/citizen/service-standards"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setShowCitizenDropdown(false)}
                >
                  คู่มือหรือมาตรฐานการให้บริการประชาชน
                </a>
                <a
                  href="/citizen/citizen-manual"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setShowCitizenDropdown(false)}
                >
                  คู่มือประชาชน
                </a>
                <a
                  href="/citizen/documents"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setShowCitizenDropdown(false)}
                >
                  เอกสารดาวน์โหลด/แบบฟอร์มต่างๆ
                </a>
                <a
                  href="/citizen/work-process"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setShowCitizenDropdown(false)}
                >
                  ลิดขั้นตอนการปฏิบัติงาน
                </a>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
