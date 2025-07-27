import React from "react";
import "../../styles.css";

export default function ContentSections() {
  return <section className="content-sections">
          <div className="content-grid">
            <div className="content-card">
              <div className="content-header">
                <h3 className="content-title">วิดีทัศน์แนะนำ</h3>
              </div>
              <div className="video-container">
                <iframe
                  className="video-player"
                  src="https://www.youtube.com/embed/J---aiyznGQ?rel=0"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="video-nav">
                <button
                  className="nav-arrow-video left"
                  onClick={() => ui.changeVideo("prev")}
                >
                  ‹
                </button>
                <div
                  className="video-dot active"
                  data-video="https://www.youtube.com/embed/J---aiyznGQ?rel=0"
                  onClick={() => ui.selectVideo(0)}
                ></div>
                <div
                  className="video-dot"
                  data-video="https://www.youtube.com/embed/9bZkp7q19f0?rel=0"
                  onClick={() => ui.selectVideo(1)}
                ></div>
                <div
                  className="video-dot"
                  data-video="https://www.youtube.com/embed/J---aiyznGQ?rel=0"
                  onClick={() => ui.selectVideo(2)}
                ></div>
                <div
                  className="video-dot"
                  data-video="https://www.youtube.com/embed/9bZkp7q19f0?rel=0"
                  onClick={() => ui.selectVideo(3)}
                ></div>
                <button
                  className="nav-arrow-video right"
                  onClick={() => ui.changeVideo("next")}
                >
                  ›
                </button>
              </div>
              <button className="more-btn-content-left">เพิ่มเติม</button>
            </div>
  
            <div className="content-card">
              <div className="content-header">
                <h3 className="content-title">E-LIBRARY</h3>
              </div>
              <div className="library-content">
                <img src="image/Online_Library.jpg" alt="EIT" />
              </div>
              <button className="more-btn-content-right">เพิ่มเติม</button>
            </div>
          </div>
        </section>;
}
