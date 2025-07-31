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
import MapsSection from "./MapSection";
import StateSection from "./StateSection";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <div className="relative w-full h-[814px] overflow-hidden">
        <video
          className="absolute inset-0 w-full h-auto object-cover object-bottom"
          src="/image/mp_4_bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{
            transform: "translateY(-20%)", // ปรับค่านี้เพื่อแสดงส่วนล่างมากขึ้น
            height: "120%", // ขยายความสูงเพื่อให้มีพื้นที่ในการครอบตัด
          }}
        />
      </div>
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
      <Footer />
    </>
  );
}
