
import React from "react";
import "../../styles.css";

export default function ActivitySection() {
    return (
<section className="activities-news-section">
        <div className="section-container-activities-news">
          <div className="tab-header">
            <button
              className="tab-btn active"
              onClick={() => ui.switchTab("activities")}
            >
              กิจกรรม
            </button>
            <button className="tab-btn" onClick={() => ui.switchTab("news")}>
              ข่าวประชาสัมพันธ์
            </button>
          </div>

          <div className="tab-content" id="activitiesContent">
            <div className="content-layout">
              <div className="featured-item">
                <div className="featured-content">
                  <div className="image-wrapper">
                    <img
                      src="image/news.jpg"
                      alt="Featured Activity"
                      className="featured-image"
                    />
                  </div>
                  <div className="item-info">
                    <h3 className="item-title">กิจกรรม</h3>
                    <p className="item-date">วันที่</p>
                    <p className="item-excerpt">ข้อความ</p>
                    <a href="#" className="read-more">
                      อ่านต่อ
                    </a>
                  </div>
                </div>

                <div className="side-items">
                  <div className="side-item">
                    <div className="side-image-wrapper">
                      <img
                        src="image/news.jpg"
                        alt="Activity 1"
                        className="side-image"
                      />
                    </div>
                    <div className="side-info">
                      <h4 className="side-title">กิจกรรม</h4>
                      <p className="side-date">วันที่</p>
                      <p className="side-excerpt">ข้อความ</p>
                      <a href="#" className="read-more">
                        อ่านต่อ
                      </a>
                    </div>
                  </div>

                  <div className="side-item">
                    <div className="side-image-wrapper">
                      <img
                        src="image/news.jpg"
                        alt="Activity 2"
                        className="side-image"
                      />
                    </div>
                    <div className="side-info">
                      <h4 className="side-title">กิจกรรม</h4>
                      <p className="side-date">วันที่</p>
                      <p className="side-excerpt">ข้อความ</p>
                      <a href="#" className="read-more">
                        อ่านต่อ
                      </a>
                    </div>
                  </div>

                  <div className="side-item">
                    <div className="side-image-wrapper">
                      <img
                        src="image/news.jpg"
                        alt="Activity 3"
                        className="side-image"
                      />
                    </div>
                    <div className="side-info">
                      <h4 className="side-title">กิจกรรม</h4>
                      <p className="side-date">วันที่</p>
                      <p className="side-excerpt">ข้อความ</p>
                      <a href="#" className="read-more">
                        อ่านต่อ
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="tab-content hidden" id="newsContent">
            <div className="content-layout">
              <div className="featured-item">
                <div className="featured-content">
                  <div className="image-wrapper">
                    <img
                      src="image/news.jpg"
                      alt="Featured News"
                      className="featured-image"
                    />
                  </div>
                  <div className="item-info">
                    <h3 className="item-title">ข่าวประชาสัมพันธ์</h3>
                    <p className="item-date">วันที่</p>
                    <p className="item-excerpt">ข้อความ</p>
                    <a href="#" className="read-more">
                      อ่านต่อ
                    </a>
                  </div>
                </div>

                <div className="side-items">
                  <div className="side-item">
                    <div className="side-image-wrapper">
                      <img
                        src="image/news.jpg"
                        alt="News 1"
                        className="side-image"
                      />
                    </div>
                    <div className="side-info">
                      <h4 className="side-title">ข่าวประชาสัมพันธ์</h4>
                      <p className="side-date">วันที่</p>
                      <p className="side-excerpt">ข้อความ</p>
                      <a href="#" className="read-more">
                        อ่านต่อ
                      </a>
                    </div>
                  </div>

                  <div className="side-item">
                    <div className="side-image-wrapper">
                      <img
                        src="image/news.jpg"
                        alt="News 2"
                        className="side-image"
                      />
                    </div>
                    <div className="side-info">
                      <h4 className="side-title">ข่าวประชาสัมพันธ์</h4>
                      <p className="side-date">วันที่</p>
                      <p className="side-excerpt">ข้อความ</p>
                      <a href="#" className="read-more">
                        อ่านต่อ
                      </a>
                    </div>
                  </div>

                  <div className="side-item">
                    <div className="side-image-wrapper">
                      <img
                        src="image/news.jpg"
                        alt="News 3"
                        className="side-image"
                      />
                    </div>
                    <div className="side-info">
                      <h4 className="side-title">ข่าวประชาสัมพันธ์</h4>
                      <p className="side-date">วันที่</p>
                      <p className="side-excerpt">ข้อความ</p>
                      <a href="#" className="read-more">
                        อ่านต่อ
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="more-section">
            <button className="more-btn-center">เพิ่มเติม</button>
          </div>
        </div>
      </section>

    );
  }