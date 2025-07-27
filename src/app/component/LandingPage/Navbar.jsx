import React from "react";
import "../../styles.css";
import * as ui from "../../ui-logic";

export default function Navbar() {
  return (
    <header className="header">
      <div className="nav-section">
        <div className="nav-container">
          <div className="header-right">
            <div className="search-box">
              <input
                type="text"
                className="search-input"
                placeholder="ค้นหา..."
              />
              <button className="search-btn">🔍</button>
            </div>
            <div className="auth-buttons">
              <a href="#" className="auth-btn1">
                เข้าสู่ระบบ
              </a>
              <a href="#" className="auth-btn2">
                สมัครสมาชิก
              </a>
            </div>
          </div>
          <div className="nav-content">
            <div className="logo-section">
              <div className="logo">
                <img
                  src="image/Logo.png"
                  alt="โลโก้เทศบาล"
                  style={{ height: "80px" }}
                />
              </div>
              <div>
                <div className="site-title">เทศบาลตำบลบ้านโพธิ์</div>
                <div className="site-subtitle">
                  อำเภอเมืองลำปาง จังหวัดลำปาง
                </div>
              </div>
            </div>
            <nav className="nav-menu">
              <div className="nav-item-dropdown">
                <a href="#" className="nav-item">
                  ข้อมูลพื้นฐาน
                </a>
                <div className="nav-dropdown">
                  <a href="#" className="dropdown-item">
                    ประวัติความเป็นมา
                  </a>
                  <div className="nav-sub-dropdown">
                    <a href="#" className="dropdown-item">
                      ข้อมูลสภาพทั่วไป
                    </a>
                    <div className="sub-dropdown-content">
                      <a href="#" className="sub-dropdown-item">
                        ข้อมูลและรายละเอียดชุมชน
                      </a>
                      <a href="#" className="sub-dropdown-item">
                        ผู้นำชุมชน
                      </a>
                    </div>
                  </div>
                  <a href="#" className="dropdown-item">
                    ข้อมูลชุมชน
                  </a>
                  <a href="#" className="dropdown-item">
                    ผลิตภัณฑ์ชุมชน
                  </a>
                  <a href="#" className="dropdown-item">
                    สถานที่สำคัญ
                  </a>
                  <a href="#" className="dropdown-item">
                    แกลอรี่ภาพถ่ายภูมิทัศน์
                  </a>
                  <a href="#" className="dropdown-item">
                    บริการขั้นพื้นฐาน
                  </a>
                  <a href="#" className="dropdown-item">
                    ยุทธศาสตร์การพัฒนา
                  </a>
                  <a href="#" className="dropdown-item">
                    อำนาจหน้าที่
                  </a>
                </div>
              </div>
              <a href="#" className="nav-item">
                บุคลากร
              </a>
              <a href="#" className="nav-item">
                ผลการดำเนินงาน
              </a>
              <a href="#" className="nav-item">
                แผนพัฒนาท้องถิ่น
              </a>
              <a href="#" className="nav-item">
                กฎหมายและระเบียบ
              </a>
              <a href="#" className="nav-item">
                เมนูสำหรับประชาชน
              </a>
              <a href="#" className="nav-item">
                <img
                  style={{
                    width: "27px",
                    height: "27px",
                    backgroundColor: "aliceblue",
                    borderRadius: "6px",
                  }}
                  src="image/blind.png"
                  alt=""
                />
              </a>
              <div className="lang-selector">
                <button className="lang-btn" onClick={ui.toggleLangDropdown}>
                  <span className="flag flag-th"></span>
                  <span className="lang-text">ไทย</span>
                  <span className="lang-arrow">▼</span>
                </button>
                <div className="lang-dropdown" id="langDropdown">
                  <a href="#" className="lang-option">
                    <span className="flag flag-th"></span>
                    ไทย
                  </a>
                  <a href="#" className="lang-option">
                    <span className="flag flag-kh"></span>
                    ខ្មែរ
                  </a>
                  <a href="#" className="lang-option">
                    <span className="flag flag-vn"></span>
                    Tiếng Việt
                  </a>
                  <a href="#" className="lang-option">
                    <span className="flag flag-cn"></span>
                    中文
                  </a>
                  <a href="#" className="lang-option">
                    <span className="flag flag-la"></span>
                    ລາວ
                  </a>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
