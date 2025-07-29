import React from "react";

export default function NewsSection() {
  return (

      <section className="services-facebook-section">
        <div className="services-facebook-grid">
          <div className="services-left">
            <div className="service-buttons-grid">
              <div className="service-button child-center">
                <img
                  src="image/mom.png"
                  alt="Mom"
                  className="service-icon-large"
                />
                <div className="text-content">
                  <span className="main-title">ศูนย์พัฒนาเด็กเล็ก</span>
                  <span className="sub-title">
                    องค์การบริหารส่วนตำบลบ้านโพธิ์
                  </span>
                </div>
              </div>

              <div className="service-button oil-price">
                <img src="image/gas.png" alt="Gas" className="oil-icon" />
                <div className="text-content">
                  <span className="oil-title">ราคาน้ำมัน</span>
                </div>
              </div>

              <div className="gold-card">
                <div className="header-gold">ราคาทอง</div>

                <div className="gold-lower">
                  <div className="price-section">
                    <div className="label">
                      รับซื้อ
                      <br />
                      <span>(บาท)</span>
                    </div>
                    <div className="price">42,000</div>
                  </div>
                  <div className="divider"></div>
                  <div className="price-section">
                    <div className="label">
                      ขายออก
                      <br />
                      <span>(บาท)</span>
                    </div>
                    <div className="price">43,000</div>
                  </div>
                </div>
              </div>

              <div className="service-button line-friend">
                <div className="text-area">
                  <div className="main-text">
                    มาเป็นเพื่อน
                    <br />
                    กับเราที่นี่
                  </div>
                  <div className="sub-text">Line@</div>
                </div>
                <div className="qr-box"></div>
              </div>

              <div className="service-button e-service">
                <div className="e-service-content">
                  <img
                    src="image/E-service.jpg"
                    alt="E-service"
                    className="e-service-icon"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="facebook-right">
            <div className="facebook-widget">
              <div className="facebook-header">
                <img
                  src="image/facebook.png"
                  alt="Facebook Cover"
                  className="facebook-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>



);
}
  