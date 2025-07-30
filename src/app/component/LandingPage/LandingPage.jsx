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
import PeopleSupport from "./PeopleSuport";
import EService from "./EService";

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
      <PeopleSupport />

      <EService />
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
