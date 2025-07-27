import React from "react";
import "../../styles.css";

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-column-left">
            <div className="footer-logo">
              <img
                src="image/Logo.png"
                alt="เทศบาลตำบลบ้านโพธิ์"
                className="footer-logo-img"
              />
            </div>
            <div className="footer-contact">
              <div className="contact-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="white"
                  viewBox="0 0 24 24"
                >
                  <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.05-.24 11.36 11.36 0 0 0 3.58.57 1 1 0 0 1 1 1v3.6a1 1 0 0 1-1 1A17 17 0 0 1 3 5a1 1 0 0 1 1-1h3.6a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.58 1 1 0 0 1-.24 1.05l-2.3 2.16Z" />
                </svg>
                <span>โทรศัพท์ : 038-587308</span>
              </div>
              <div className="contact-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 91.249 91.25"
                >
                  <path
                    fill="white"
                    d="M19.667 14.833H1a1 1 0 0 0-1 1v67.5a1 1 0 0 0 1 1h18.667a1 1 0 0 0 1-1v-67.5a1 1 0 0 0-1-1m70.583 7.54h-2.167V17.21l-9.59-11.001h-49.91c-1.654 0-3 1.346-3 3v13.164h-2.167a1 1 0 0 0-1 1v60.668a1 1 0 0 0 1 1h66.833a1 1 0 0 0 1-1V23.373a1 1 0 0 0-.999-1M40.875 73.375h-9.75v-9.75h9.75zm0-15h-9.75v-9.75h9.75zm0-15h-9.75v-9.75h9.75zm15 30h-9.75v-9.75h9.75zm0-15h-9.75v-9.75h9.75zm0-15h-9.75v-9.75h9.75zm15 30h-9.75v-9.75h9.75zm0-15h-9.75v-9.75h9.75zm0-15h-9.75v-9.75h9.75zm13.208-21.002h-54.5V10.208h45.935v8.449h8.522l.043.05z"
                  />
                </svg>
                <span>โทรสาร : 038-587308 ต่อ 103</span>
              </div>
              <div className="contact-item">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 36 36"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="white"
                >
                  <path
                    className="clr-i-solid clr-i-solid-path-1"
                    d="M32.33 6a2 2 0 0 0-.41 0h-28a2 2 0 0 0-.53.08l14.45 14.39Z"
                  />
                  <path
                    className="clr-i-solid clr-i-solid-path-2"
                    d="m33.81 7.39-14.56 14.5a2 2 0 0 1-2.82 0L2 7.5a2 2 0 0 0-.07.5v20a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2V8a2 2 0 0 0-.12-.61M5.3 28H3.91v-1.43l7.27-7.21 1.41 1.41Zm26.61 0h-1.4l-7.29-7.23 1.41-1.41 7.27 7.21Z"
                  />
                  <path fill="none" d="M0 0h36v36H0z" />
                </svg>
                <span>Email : office@banphocity.go.th</span>
              </div>
            </div>
          </div>
          <div className="footer-column">
            <h4 className="footer-title">ข้อมูลเว็บไซต์</h4>
            <ul className="footer-menu">
              <li>
                <a href="#" className="footer-link">
                  หน้าแรก
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  กระดานกระทู้
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  ติดต่อ
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  แผนผังเว็บไซต์
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <ul className="footer-menu">
              <li>
                <a href="#" className="footer-link">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="white"
                    viewBox="0 0 36 36"
                  >
                    <path d="M32.33 6a2 2 0 0 0-.41 0h-28a2 2 0 0 0-.53.08l14.45 14.39Z" />
                    <path d="m33.81 7.39-14.56 14.5a2 2 0 0 1-2.82 0L2 7.5a2 2 0 0 0-.07.5v20a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2V8a2 2 0 0 0-.12-.61M5.3 28H3.91v-1.43l7.27-7.21 1.41 1.41Zm26.61 0h-1.4l-7.29-7.23 1.41-1.41 7.27 7.21Z" />
                    <path fill="none" d="M0 0h36v36H0z" />
                  </svg>
                  ตรวจสอบ Email
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="white"
                    viewBox="0 0 24 24"
                  >
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                  </svg>
                  เว็บเพื่อนบ้าน
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="white"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.7 0 8 1.34 8 4v2H4v-2c0-2.66 5.3-4 8-4Zm0-2a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" />
                  </svg>
                  เว็บมาสเตอร์
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="footer-link"
                  style={{ whiteSpace: "nowrap" }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 2h11a3 3 0 0 1 3 3v14a1 1 0 0 1-1 1h-3"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="m5 2 7.588 1.518A3 3 0 0 1 15 6.459V20.78a1 1 0 0 1-1.196.98l-7.196-1.438A2 2 0 0 1 5 18.36zm7 10v2"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  เข้าสู่ระบบ Admin
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div
        className="footer-social"
        style={{ display: "flex", gap: "15px", marginTop: "20px", justifyContent: "flex-end" }}
      >
        <a href="#" className="social-link" aria-label="Upload Box">
          <svg
            width="20"
            height="20"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fill="#fff" d="M11 10v2H5v-2H0v6h16v-6zm-7 4H2v-2h2z" />
            <path fill="#fff" d="M13 5 8 0 3 5h3v6h4V5z" />
          </svg>
        </a>
        <a href="#" className="social-link" aria-label="Share Link">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#fff"
              d="M15 12c-.807 0-1.537.324-2.077.844l-4.96-2.481c.015-.12.037-.238.037-.363s-.022-.243-.037-.363l4.96-2.481c.54.52 1.27.844 2.077.844 1.654 0 3-1.346 3-3s-1.346-3-3-3-3 1.346-3 3c0 .125.022.243.037.363l-4.96 2.481A3 3 0 0 0 5 7c-1.654 0-3 1.346-3 3s1.346 3 3 3c.807 0 1.537-.324 2.077-.844l4.96 2.481c-.015.12-.037.238-.037.363 0 1.654 1.346 3 3 3s3-1.346 3-3-1.346-3-3-3"
            />
          </svg>
        </a>
        <a href="#" className="social-link" aria-label="Facebook Messenger">
          <svg
            width="20"
            height="20"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#fff"
              d="m11.409 12.816-4.393 6.988a.703.703 0 0 0 1.025.934l4.728-3.581c.148-.117.337-.187.543-.187s.395.07.545.189l-.002-.001 3.494 2.621a2.25 2.25 0 0 0 3.239-.59l.005-.009 4.393-6.988a.704.704 0 0 0-1.025-.935l.002-.001-4.73 3.582c-.146.117-.333.187-.537.187s-.391-.071-.538-.189l.002.001-3.494-2.621a2.245 2.245 0 0 0-3.252.59l-.005.009zM1.026 15.55v-.084c0-7.981 6.47-14.45 14.45-14.45q.277 0 .552.01l-.026-.001c.156-.006.34-.01.524-.01 7.98 0 14.45 6.469 14.45 14.45v.089-.005.083c0 7.98-6.469 14.45-14.45 14.45q-.277 0-.552-.01l.026.001h-.037c-1.527 0-3.006-.21-4.408-.601l.115.027a1.2 1.2 0 0 0-.806.066l.008-.003-2.983 1.31a1.197 1.197 0 0 1-1.684-1.059v-.002l-.087-2.671a1.2 1.2 0 0 0-.398-.848l-.001-.001A14.18 14.18 0 0 1 1.028 15.74l.001-.2v.01z"
            />
          </svg>
        </a>
      </div>
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="footer-bottom-content">
            <h3 className="municipality-name">เทศบาลตำบลบ้านโพธิ์</h3>
            <p className="municipality-address">
              Ban Pho Subdistrict, Chachoengsao
            </p>
            <p className="municipality-details">
              222  หมู่ 1  ตำบลบ้านโพธิ์  อำเภอบ้านโพธิ์  จังหวัดฉะเชิงเทรา 
              24140
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
