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

import { useState } from "react";
import { Modal } from "antd";

export default function LandingPage() {
  const [open, setOpen] = useState(true);
  return (
    <>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        centered
        width={794}
        height={400}
      >
        <span className="h-[1000px]">No data</span>
      </Modal>
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
