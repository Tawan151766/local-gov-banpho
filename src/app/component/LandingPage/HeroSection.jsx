// ✅ HERO SECTION แบบ Tailwind CSS พร้อม React

import { useState } from "react";

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-images">
        <div
          className="hero-image active"
          style={{ backgroundImage: "url('image/ktc_nakhon3.png')" }}
        ></div>
        <div
          className="hero-image"
          style={{ backgroundImage: "url('image/ktc_nakhon3.png')" }}
        ></div>
        <div
          className="hero-image"
          style={{ backgroundImage: "url('image/ktc_nakhon3.png')" }}
        ></div>
      </div>
      <div className="hero-dots">
        <span
          className="dot active"
          onClick={() => ui.setSlide && ui.setSlide(0)}
        ></span>
        <span
          className="dot"
          onClick={() => ui.setSlide && ui.setSlide(1)}
        ></span>
        <span
          className="dot"
          onClick={() => ui.setSlide && ui.setSlide(2)}
        ></span>
      </div>
      <div className="promo-banner" id="promoBanner">
        <button className="close-promo-btn" onClick={ui.closePromoBanner}>
          ×
        </button>
        <div className="promo-image-placeholder">
          <img src="image/EIT.jpg" alt="EIT" />
        </div>
      </div>
      <div className="hero-text-box">
        <div className="hero-title">
          เทศบาลตำบลบ้านโพธิ์ จัดให้มีบริการรับแจ้งเรื่องราวร้องเรียน
          ร้องทุกข์ รับความคิดเห็นของประชาชน ผ่านทางตู้ไปรษณี ปณ.9
        </div>
      </section>

      {/* Video Section */}

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
    </>
  );
}
