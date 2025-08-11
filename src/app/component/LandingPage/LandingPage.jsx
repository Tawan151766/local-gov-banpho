"use client";
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

  // Hide body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    };
  }, [open]);

  // Single announcement data - replace with actual API call
  const announcement = {
    id: 1,
    title: "เชิญชวนลงนามถวายพระพร พระบาทสมเด็จพระเจ้าอยู่หัว",
    image: "/image/Mom_Day.jpg", // Replace with actual image path
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

  return (
    <>
      <style jsx global>{`
        .royal-announcement-modal-fullscreen .ant-modal {
          max-width: 100vw !important;
          width: 100vw !important;
          height: 100vh !important;
          margin: 0 !important;
          padding: 0 !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
        }

        .royal-announcement-modal-fullscreen .ant-modal-content {
          width: 100vw !important;
          height: 100vh !important;
          border-radius: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
          box-shadow: none !important;
          border: none !important;
        }

        .royal-announcement-modal-fullscreen .ant-modal-body {
          padding: 0 !important;
          margin: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          overflow: hidden !important;
        }

        .royal-announcement-modal-fullscreen .ant-modal-mask {
          background-color: rgba(0, 0, 0, 1) !important;
        }

        .royal-announcement-modal-fullscreen img {
          width: 100vw !important;
          height: 100vh !important;
          object-fit: contain !important;
          object-position: center !important;
        }
      `}</style>

      <Modal
        open={open}
        onCancel={handleClose}
        footer={null}
        centered={false}
        width="100vw"
        className="royal-announcement-modal-fullscreen"
        maskClosable={true}
        closable={false}
        style={{
          top: 0,
          paddingBottom: 0,
          maxWidth: "100vw",
        }}
        styles={{
          body: {
            padding: 0,
            height: "100vh",
            overflow: "hidden",
          },
          content: {
            height: "100vh",
            borderRadius: 0,
            padding: 0,
          },
          mask: {
            backgroundColor: "rgba(0, 0, 0, 0.9)",
          },
        }}
        zIndex={9999}
      >
        <div className="royal-announcement-content relative w-screen h-screen overflow-hidden">
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex gap-8">
            <button
              onClick={handleClose}
              className="relative w-40 px-8 py-4 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 hover:from-yellow-700 hover:via-yellow-600 hover:to-yellow-700 text-white rounded-lg transition-all duration-300 font-medium shadow-xl border-2 border-yellow-400 hover:border-yellow-300 transform hover:scale-105 overflow-hidden group"
            >
              <div
                className="absolute inset-0 opacity-30 group-hover:opacity-40 transition-opacity duration-300"
                style={{
                  backgroundImage: "url('/image/thai.png')",
                  backgroundSize: "50px 50px",
                  backgroundPosition: "center",
                  backgroundRepeat: "repeat",
                }}
              />

              <div className="absolute inset-0 border-2 border-yellow-300 rounded-lg shadow-inner" />

              <span className="relative z-10 text-lg font-bold drop-shadow-md">
                ปิด
              </span>

              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 transition-all duration-500 group-hover:translate-x-full" />
            </button>

            <button
              onClick={handleAlwayClose}
              className="relative w-40 px-8 py-4 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 hover:from-gray-700 hover:via-gray-600 hover:to-gray-700 text-white rounded-lg transition-all duration-300 font-medium shadow-xl border-2 border-gray-400 hover:border-gray-300 transform hover:scale-105 overflow-hidden group"
            >
              <div
                className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                style={{
                  backgroundImage: "url('/image/thai.png')",
                  backgroundSize: "50px 50px",
                  backgroundPosition: "center",
                  backgroundRepeat: "repeat",
                }}
              />

              <div className="absolute inset-0 border-2 border-gray-300 rounded-lg shadow-inner" />

              <span className="relative z-10 text-lg font-bold drop-shadow-md">
                ไม่แสดงอีก
              </span>

              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 transition-all duration-500 group-hover:translate-x-full" />
            </button>
          </div>

          {/* Royal Announcement Image - Full Screen */}
          <div className="absolute inset-0 bg-black">
            <img
              src={announcement.image}
              alt={announcement.title}
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback if image doesn't load
                e.target.style.display = "none";
                document.querySelector(".fallback-content").style.display =
                  "flex";
              }}
            />

            {/* Fallback content if image fails to load */}
            <div
              className="fallback-content absolute inset-0 items-center justify-center bg-gradient-to-b from-yellow-50 to-yellow-100"
              style={{ display: "none" }}
            >
              <div className="text-center p-8">
                <div className="text-8xl mb-6">👑</div>
                <h2 className="text-4xl font-bold text-yellow-800 mb-6">
                  {announcement.title}
                </h2>
                <p className="text-xl text-yellow-700">
                  เทศบาลตำบลบ้านโพธิ์ ขอเชิญชวนประชาชนร่วมลงนามถวายพระพร
                </p>
              </div>
            </div>
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
