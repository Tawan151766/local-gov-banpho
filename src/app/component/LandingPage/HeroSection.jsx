import * as ui from "../../ui-logic";

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
      </div>
    </section>
  );
}
