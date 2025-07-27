import React from "react";
import "../../styles.css";

export default function AnnouncementSections() {
  return (
    <section className="announcement-section">
      <div className="section-container-announcement">
        <div className="announcement-card">
          <div className="announcement-header">
            <div className="announcement-info">
              <h3 className="announcement-title-section">ป้ายประกาศ</h3>
              <div className="announcement-subtitle-section">
                องค์การบริหารส่วนตำบล
              </div>
            </div>
            <button className="more-btn-announcement">เพิ่มเติม</button>
          </div>
          <div style={{ color: "white", padding: "20px", textAlign: "center" }}>
            <button
              className="nav-arrow-contact left"
              onClick={() => ui.changeContact("prev")}
            >
              ‹
            </button>
            <button
              className="nav-arrow-contact right"
              onClick={() => ui.changeContact("next")}
            >
              ›
            </button>

            <div className="contact-card">
              <img src="image/annu.jpg" alt="announcement-pic" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
