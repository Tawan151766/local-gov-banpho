"use client";
// import "../../styles.css";
import * as ui from "../../ui-logic";
import HeroSection from "./HeroSection";
import ManagementSection from "./ManagementSection";
import ContentSections from "./ContentSections";
import AnnouncementSections from "./AnnouncementSections";
import ActivitySection from "./ActivitySection";
import NewsSection from "./NewsSection";
import TravelSection from "./TravelSection";
import PeopleSupport from "./PeopleSuport";
import EService from "./EService";
import MapsSection from "./MapSection";
import StateSection from "./StateSection";

import { useState, useEffect } from "react";
import { Modal } from "antd";

export default function LandingPage() {
  const [open, setOpen] = useState(false);

  // Single announcement data - replace with actual API call
  const announcement = {
    id: 1,
    title: "เชิญชวนลงนามถวายพระพร พระบาทสมเด็จพระเจ้าอยู่หัว",
    image: "https://www.sut.ac.th/images/upload/news/1496/1496/news.jpg", // Replace with actual image path
    isActive: true,
  };

  // Check if user has seen announcement
  useEffect(() => {
    const hasSeenAnnouncement = localStorage.getItem("royalAnnouncementSeen");

    if (!hasSeenAnnouncement && announcement.isActive) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleAlwayClose = () => {
    setOpen(false);
    localStorage.setItem("royalAnnouncementSeen", "true");
  };
  const getAnnouncementIcon = (type) => {
    switch (type) {
      case "important":
        return "🚨";
      case "notice":
        return "📢";
      case "news":
        return "📰";
      default:
        return "📋";
    }
  };

  const getAnnouncementColor = (type) => {
    switch (type) {
      case "important":
        return "border-red-500 bg-red-50";
      case "notice":
        return "border-yellow-500 bg-yellow-50";
      case "news":
        return "border-blue-500 bg-blue-50";
      default:
        return "border-gray-500 bg-gray-50";
    }
  };

  return (
    <>
      <Modal
        open={open}
        onCancel={!open}
        footer={null}
        centered
        width={600}
        className="royal-announcement-modal"
        maskClosable={true}
        closable={true}
      >
        <div className="royal-announcement-content">
          {/* Royal Announcement Image */}
          <div className="text-center">
            <img
              src={announcement.image}
              alt={announcement.title}
              className="w-full h-auto rounded-lg shadow-lg"
              onError={(e) => {
                // Fallback if image doesn't load
                e.target.style.display = "none";
                document.querySelector(".fallback-content").style.display =
                  "block";
              }}
            />

            {/* Fallback content if image fails to load */}
            <div className="fallback-content" style={{ display: "none" }}>
              <div className="bg-gradient-to-b from-yellow-50 to-yellow-100 p-8 rounded-lg border-2 border-yellow-300">
                <div className="text-6xl mb-4">👑</div>
                <h2 className="text-2xl font-bold text-yellow-800 mb-4">
                  {announcement.title}
                </h2>
                <p className="text-yellow-700">
                  เทศบาลตำบลบ้านโพธิ์ ขอเชิญชวนประชาชนร่วมลงนามถวายพระพร
                </p>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="mt-4 text-center">
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors font-medium"
            >
              ปิด
            </button>
            <button
              onClick={handleAlwayClose}
              className="ml-4 px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors font-medium"
            >
              ไม่แสดงอีก สำหรับวันนี้
            </button>
          </div>
        </div>
      </Modal>

      {/* Main Content */}
      <HeroSection />
      <ManagementSection />
      <ContentSections />
      <AnnouncementSections />
      <ActivitySection />
      <NewsSection />
      <PeopleSupport />
      <EService />
      <TravelSection />
      <MapsSection />
      <StateSection />
    </>
  );
}
