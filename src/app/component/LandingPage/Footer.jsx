import React from "react";
import "../../styles.css";

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-b from-[#0383aa] to-[#05c5ff] relative overflow-hidden shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8 relative">
        {/* Center: Main Links (top) */}
        <div className="flex flex-wrap justify-center gap-6 text-white text-sm font-medium mb-8">
          <a href="#" className="hover:underline">
            ข้อมูลเว็บไซต์
          </a>
          <a href="#" className="hover:underline">
            หน้าแรก
          </a>
          <a href="#" className="hover:underline">
            กระดานกระทู้
          </a>
          <a href="#" className="hover:underline">
            ติดต่อ
          </a>
          <a href="#" className="hover:underline">
            แผนผังเว็บไซต์
          </a>
        </div>
        {/* Bottom: Contact (left) & Quick Links (right) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Contact + Quick Links (side by side on desktop, stacked on mobile) */}
          <div className="flex flex-col md:flex-row gap-8 w-full items-center md:items-start">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center justify-center md:justify-start w-full md:w-auto mb-4 md:mb-0">
              <img
                src="/image/Logo.png"
                alt="โลโก้เทศบาล"
                className="w-32 h-32 rounded-full shadow-lg"
                style={{ objectFit: "cover" }}
              />
            </div>
            {/* Contact + Quick Links */}
            <div className="flex flex-col md:flex-row gap-12 w-full items-center md:items-start">
              {/* Contact */}
              <div className="flex flex-col gap-3 items-center md:items-start">
                <div className="flex items-center gap-2 text-white">
                  <img src="/icons/phone.svg" alt="phone" className="w-5 h-5" />
                  <span>โทรศัพท์ : 038-587308</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <img src="/icons/fax.svg" alt="fax" className="w-5 h-5" />
                  <span>โทรสาร : 038-587308 ต่อ 103</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <img src="/icons/email.svg" alt="email" className="w-5 h-5" />
                  <span>Email : office@banphocity.go.th</span>
                </div>
              </div>
              {/* Quick Links - vertical */}
              <div className="flex flex-col gap-3 items-center md:items-start">
                <a
                  href="#"
                  className="flex items-center gap-2 text-white hover:underline"
                >
                  <img
                    src="/icons/check-email.svg"
                    alt="ตรวจสอบ Email"
                    className="w-5 h-5"
                  />{" "}
                  ตรวจสอบ Email
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 text-white hover:underline"
                >
                  <img
                    src="/icons/home.svg"
                    alt="เว็บเพื่อนบ้าน"
                    className="w-5 h-5"
                  />{" "}
                  เว็บเพื่อนบ้าน
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 text-white hover:underline"
                >
                  <img
                    src="/icons/person.svg"
                    alt="เว็บมาสเตอร์"
                    className="w-5 h-5"
                  />{" "}
                  เว็บมาสเตอร์
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 text-white hover:underline"
                >
                  <img
                    src="/icons/admin.svg"
                    alt="เข้าสู่ระบบ Admin"
                    className="w-5 h-5"
                  />{" "}
                  เข้าสู่ระบบ Admin
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 text-white hover:underline"
                >
                  <img
                    src="/icons/messenger.svg"
                    alt="Messenger"
                    className="w-5 h-5"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
