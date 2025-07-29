"use client";

// import "../../styles.css";
import * as ui from "../../ui-logic";
import Footer from "./Footer";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import ManagementSection from "./ManagementSection";
import ContentSections from "./ContentSections";
import AnnouncementSections from "./AnnouncementSections";
import ActivitySection from "./ActivitySection";
import NewsSection from "./NewsSection";
import TravelSection from "./TravelSection";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <ManagementSection />
      <ContentSections />
      <AnnouncementSections />
      <ActivitySection />
      <NewsSection />

      <section className="poll-section">
        <div className="section-container">
          <div className="poll-card">
            <h3 className="poll-title">แสดงความคิดเห็น</h3>
            <p className="poll-subtitle">
              ความคิดเห็นต่อบ้านเมืองที่ท่านอยู่อาศัย
            </p>

            <div className="poll-options">
              <div className="poll-row">
                <label className="poll-option">
                  <input type="checkbox" name="opinion" value="1" />
                  <span className="checkmark"></span>
                  จัดการเรื่องการป้องกันน้ำท่วม
                </label>
                <label className="poll-option">
                  <input type="checkbox" name="opinion" value="2" />
                  <span className="checkmark"></span>
                  แก้ไขปัญหาสิ่งแวดล้อม
                </label>
                <label className="poll-option">
                  <input type="checkbox" name="opinion" value="3" />
                  <span className="checkmark"></span>
                  แก้ไขปัญหาไฟฟ้าดับบ่อย
                </label>
              </div>
              <div className="poll-row">
                <label className="poll-option">
                  <input type="checkbox" name="opinion" value="4" />
                  <span className="checkmark"></span>
                  จัดมาตรการป้องกันน้ำท่วม
                </label>
                <label className="poll-option">
                  <input type="checkbox" name="opinion" value="5" />
                  <span className="checkmark"></span>
                  แก้ไขปัญหายาเสพติด
                </label>
                <label className="poll-option">
                  <input type="checkbox" name="opinion" value="6" />
                  <span className="checkmark"></span>
                  แก้ไขปัญหาลักขโมย
                </label>
              </div>

              <button className="vote-btn" onClick={ui.submitVote}>
                กดโหวต
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="ecp-section">
        <div className="section-container-ecp">
          <div className="ecp-tabs">
            <button
              className="ecp-tab active"
              onClick={(e) => ui.switchECPTab("ecp", e)}
            >
              ประกาศ ECP
            </button>
            <button
              className="ecp-tab"
              onClick={(e) => ui.switchECPTab("procurement", e)}
            >
              ประกาศจัดซื้อจัดจ้าง
            </button>
            <button
              className="ecp-tab"
              onClick={(e) => ui.switchECPTab("results", e)}
            >
              ผลประกาศจัดซื้อจัดจ้าง
            </button>
            <button
              className="ecp-tab"
              onClick={(e) => ui.switchECPTab("pricing", e)}
            >
              ประกาศราคากลาง
            </button>
            <button
              className="ecp-tab"
              onClick={(e) => ui.switchECPTab("reports", e)}
            >
              รายงานผลจัดซื้อจัดจ้าง
            </button>
          </div>

          <div className="ecp-main-content">
            <div className="ecp-tab-content" id="ecpContent">
              <div className="announcement-item">
                <div className="announcement-date">9 ก.ค. 2568</div>
                <div className="announcement-content">
                  <div className="announcement-title">ข้อความ</div>
                  <div className="announcement-badge">ประกาศเชิญชวน</div>
                </div>
              </div>
              <div className="announcement-item">
                <div className="announcement-date">9 ก.ค. 2568</div>
                <div className="announcement-content">
                  <div className="announcement-title">ข้อความ</div>
                  <div className="announcement-badge">ประกาศเชิญชวน</div>
                </div>
              </div>
              <div className="announcement-item">
                <div className="announcement-date">9 ก.ค. 2568</div>
                <div className="announcement-content">
                  <div className="announcement-title">ข้อความ</div>
                  <div className="announcement-badge">ประกาศเชิญชวน</div>
                </div>
              </div>
              <div className="announcement-item">
                <div className="announcement-date">9 ก.ค. 2568</div>
                <div className="announcement-content">
                  <div className="announcement-title">ข้อความ</div>
                  <div className="announcement-badge">ประกาศเชิญชวน</div>
                </div>
              </div>
            </div>
          </div>

          <div className="ecp-bottom-grid">
            <div className="ecp-sidebar-container">
              <button
                className="sidebar-nav-btn up"
                onClick={() => ui.scrollSidebar("up")}
              >
                <img
                  src="image/down.png"
                  style={{ transform: "rotate(180deg)" }}
                  alt="up"
                />
              </button>
              <div className="ecp-sidebar" id="sidebarContent">
                <div className="sidebar-item">
                  <img src="image/book.png" alt="book" />
                  <a>การจัดการองค์การ (KM)</a>
                </div>
                <div className="sidebar-item">
                  <img src="image/paper.png" alt="paper" />
                  <a>เอกสารเผยแพร่</a>
                </div>
                <div className="sidebar-item">
                  <img src="image/info.png" alt="info" />
                  <a>ระบบสารสนเทศ</a>
                </div>
                <div className="sidebar-item">
                  <img src="image/hand.png" alt="hand" />
                  <a>ประมวลจริยธรรม</a>
                </div>
                <div className="sidebar-item">
                  <img src="image/library.png" alt="library" />
                  <a>E-Library</a>
                </div>
                <div className="sidebar-item">
                  <img src="image/couple.png" alt="couple" />
                  <a>เเบี้ยยังชีพผู้สูงอายุ</a>
                </div>
                <div className="sidebar-item">
                  <img src="image/disable_person.png" alt="disable_person" />
                  <a>เบี้ยยังชีพคนพิการ</a>
                </div>
              </div>
              <button
                className="sidebar-nav-btn down"
                onClick={() => ui.scrollSidebar("down")}
              >
                <img src="image/down.png" alt="down" />
              </button>
              <div className="more-section">
                <button className="more-btn-white">ดูเพิ่มเติม</button>
              </div>
            </div>

            <div className="ecp-right-content">
              <div className="right-content-tabs">
                <button
                  className="right-tab active"
                  onClick={() => ui.switchRightTab("local")}
                >
                  หนังสือราชการจากกรมส่งเสริมการปกครองท้องถิ่น
                </button>
                <button
                  className="right-tab"
                  onClick={() => ui.switchRightTab("promotion")}
                >
                  หนังสือราชการจากกรมส่งเสริม
                </button>
              </div>

              <div className="right-tab-content" id="localContent">
                <div className="price-list-items">
                  <div className="price-item">
                    <div className="price-date">5 ก.ค. 2568</div>
                    <div className="price-content">ข้อความ</div>
                  </div>
                  <div className="price-item">
                    <div className="price-date">6 ก.ค. 2568</div>
                    <div className="price-content">ข้อความ</div>
                  </div>
                  <div className="price-item">
                    <div className="price-date">7 ก.ค. 2568</div>
                    <div className="price-content">ข้อความ</div>
                  </div>
                  <div className="price-item">
                    <div className="price-date">8 ก.ค. 2568</div>
                    <div className="price-content">ข้อความ</div>
                  </div>
                  <div className="price-item">
                    <div className="price-date">9 ก.ค. 2568</div>
                    <div className="price-content">ข้อความ</div>
                  </div>
                </div>
              </div>

              <div className="right-tab-content hidden" id="promotionContent">
                <div className="price-list-items">
                  <div className="price-item">
                    <div className="price-date">10 ก.ค. 2568</div>
                    <div className="price-content">ข้อความ</div>
                  </div>
                  <div className="price-item">
                    <div className="price-date">11 ก.ค. 2568</div>
                    <div className="price-content">ข้อความ</div>
                  </div>
                  <div className="price-item">
                    <div className="price-date">12 ก.ค. 2568</div>
                    <div className="price-content">ข้อความ</div>
                  </div>
                  <div className="price-item">
                    <div className="price-date">13 ก.ค. 2568</div>
                    <div className="price-content">ข้อความ</div>
                  </div>
                  <div className="price-item">
                    <div className="price-date">14 ก.ค. 2568</div>
                    <div className="price-content">ข้อความ</div>
                  </div>
                </div>
              </div>

              <div className="more-section">
                <button className="more-btn-white2">ดูเพิ่มเติม</button>
              </div>
            </div>
          </div>

          <div className="gov-services">
            <div className="gov-service-item">
              <div className="gov-badge blue">
                <img src="image/Logo1_OIC.png" alt="OIC Logo" />
                <div className="badge-text">
                  <div className="badge-title">
                    ศูนย์ข้อมูลข่าวสารอิเล็กทรอนิกส์ ของราชการ (OIC)
                  </div>
                </div>
              </div>
            </div>
            <div className="gov-service-item">
              <div className="gov-badge blue">
                <img src="image/Logo2_ppp.jpg" alt="PPP Logo" />
                <div className="badge-text">
                  <div className="badge-title">
                    สำนักงานคณะกรรมการป้องกันและปราบปราม การทุจริตแห่งชาติ
                  </div>
                </div>
              </div>
            </div>
            <div className="gov-service-item">
              <div className="gov-badge blue">
                <img src="image/Logo3_tam.png" alt="TAM Logo" />
                <div className="badge-text">
                  <div className="badge-title">ศูนย์ดำรงธรรม</div>
                </div>
              </div>
            </div>
            <div className="gov-service-item">
              <div className="gov-badge blue">
                <img src="image/Logo4_LPA.jpg" alt="LPA Logo" />
                <div className="badge-text">
                  <div className="badge-title">
                    การประเมินประสิทธิภาพของ อปท. (LPA)
                  </div>
                </div>
              </div>
            </div>
            <div className="gov-service-item">
              <div className="gov-badge blue">
                <img src="image/Logo5_onestop.png" alt="One Stop Logo" />
                <div className="badge-text">
                  <div className="badge-title">
                    งานบริการของศูนย์บริการร่วม One Stop Service
                  </div>
                </div>
              </div>
            </div>
            <div className="gov-service-item">
              <div className="gov-badge blue">
                <img src="image/Logo6_law.jpg" alt="Law Logo" />
                <div className="badge-text">
                  <div className="badge-title">สาระดีๆจากศาลปกครอง</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <TravelSection />
      <section className="local-places-inline">
        <div className="section-container-map">
          <img
            src="image/map.jpg"
            alt="แผนที่สถานที่สำคัญ"
            className="map-image"
          />
          <h2 className="section-title">สถานที่สำคัญอำเภอบ้านโพธิ์</h2>
        </div>
      </section>
      <div className="map-buttons">
        <button className="map-btn" onClick={(e) => ui.filterPlaces("gas", e)}>
          <img src="image/location.png" alt="ปั๊มน้ำมัน" />
          <span>ปั๊มน้ำมัน</span>
        </button>
        <button
          className="map-btn"
          onClick={(e) => ui.filterPlaces("restaurant", e)}
        >
          <img src="image/location.png" alt="ร้านอาหาร" />
          <span>ร้านอาหาร</span>
        </button>
        <button
          className="map-btn"
          onClick={(e) => ui.filterPlaces("landmark", e)}
        >
          <img src="image/location.png" alt="สถานที่สำคัญ" />
          <span>สถานที่สำคัญในพื้นที่</span>
        </button>
      </div>
      <section className="statistics-footer-section">
        <div className="statistics-content">
          <div className="statistics-footer-grid">
            <div className="stat-grid">
              <div className="stat-header stat-left">
                จำนวนผู้เข้าชมเว็บไซต์
              </div>
              <div className="stat-header"> </div>
              <div className="stat-header"> </div>
              <div className="stat-header"> </div>
              <div className="stat-header"> </div>
              <div className="stat-header"> </div>
              <div className="stat-header"> </div>

              <div className="stat-footer-item-header stat-left">
                number of website visitors
              </div>
              <div className="stat-footer-item">ขณะนี้</div>
              <div className="stat-footer-item">วันนี้</div>
              <div className="stat-footer-item">สัปดาห์นี้</div>
              <div className="stat-footer-item">เดือนนี้</div>
              <div className="stat-footer-item">ปีนี้</div>
              <div className="stat-footer-item">ทั้งหมด</div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
