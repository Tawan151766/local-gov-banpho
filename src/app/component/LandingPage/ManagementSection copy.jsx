import "../../styles.css";
import * as ui from "../../ui-logic";
export default function ManagementSection() {
  return (
    <section className="management-section">
      <h2 className="section-title" id="management-title">
        คณะผู้บริหาร
      </h2>
      <div className="management-grid" id="managementGrid">
        <div className="management-card position-1">
          <div className="management-avatar">
            <img src="image/avatar.png" alt="ชื่อบุคคล 1" />
          </div>
          <div className="management-name">ตำแหน่ง</div>
          <div className="management-position">
            ชื่อ........................
            <br />
            เบอร์โทร...............
          </div>
        </div>
        <div className="management-card position-2">
          <div className="management-avatar">
            <img src="image/avatar.png" alt="ชื่อบุคคล 2" />
          </div>
          <div className="management-name">ตำแหน่ง</div>
          <div className="management-position">
            ชื่อ........................
            <br />
            เบอร์โทร...............
          </div>
        </div>
        <div className="management-card position-3">
          <div className="management-avatar">
            <img src="image/avatar.png" alt="ชื่อบุคคล 3" />
          </div>
          <div className="management-name">ตำแหน่ง</div>
          <div className="management-position">
            ชื่อ........................
            <br />
            เบอร์โทร...............
          </div>
        </div>
        <div className="management-card position-4">
          <div className="management-avatar">
            <img src="image/avatar.png" alt="ชื่อบุคคล 4" />
          </div>
          <div className="management-name">ตำแหน่ง</div>
          <div className="management-position">
            ชื่อ........................
            <br />
            เบอร์โทร...............
          </div>
        </div>
        <div className="management-card position-5">
          <div className="management-avatar">
            <img src="image/avatar.png" alt="ชื่อบุคคล 5" />
          </div>
          <div className="management-name">ตำแหน่ง</div>
          <div className="management-position">
            ชื่อ........................
            <br />
            เบอร์โทร...............
          </div>
        </div>
      </div>

      <div className="services-container">
        <button
          className="nav-arrow2 left"
          onClick={() => ui.scrollServices("left")}
        >
          ‹
        </button>
        <button
          className="nav-arrow2 right"
          onClick={() => ui.scrollServices("right")}
        >
          ›
        </button>

        <div className="services-grid" id="servicesGrid">
          <div className="service-item">
            <div className="service-icon">📋</div>
            <div className="service-title">
              แจ้งเหตุ
              <br />
              ร้องเรียน-ร้องทุกข์
            </div>
          </div>
          <div className="service-item">
            <div className="service-icon">🗺️</div>
            <div className="service-title">
              แผนที่การเดินทาง
              <br />
              ทต.บ้านโพธิ์
            </div>
          </div>
          <div className="service-item">
            <div className="service-icon">📖</div>
            <div className="service-title">
              คู่มือประชาชน
              <br />
              ทต.บ้านโพธิ์
            </div>
          </div>
          <div className="service-item">
            <div className="service-icon">💰</div>
            <div className="service-title">
              กองทุนสุขภาพ
              <br />
              ทต.บ้านโพธิ์
            </div>
          </div>
          <div className="service-item">
            <div className="service-icon">👥</div>
            <div className="service-title">
              สถานที่สำคัญ
              <br />
              ทำเนียบบุคคล
            </div>
          </div>
          <div className="service-item">
            <div className="service-icon">🤝</div>
            <div className="service-title">
              สิ่งช่วยเหลือ
              <br />
              ทต.บ้านโพธิ์
            </div>
          </div>
        </div>
      </div>

      <h2 className="section-title" id="management-title2">
        ผู้บริหารส่วนราชการ
      </h2>
      <div className="management-grid" id="managementGrid2">
        <div className="management-card position-1">
          <div className="management-avatar">
            <img src="image/avatar.png" alt="ชื่อบุคคล 1" />
          </div>
          <div className="management-name">ตำแหน่ง</div>
          <div className="management-position">
            ชื่อ........................
            <br />
            เบอร์โทร...............
          </div>
        </div>
        <div className="management-card position-2">
          <div className="management-avatar">
            <img src="image/avatar.png" alt="ชื่อบุคคล 2" />
          </div>
          <div className="management-name">ตำแหน่ง</div>
          <div className="management-position">
            ชื่อ........................
            <br />
            เบอร์โทร...............
          </div>
        </div>
        <div className="management-card position-3">
          <div className="management-avatar">
            <img src="image/avatar.png" alt="ชื่อบุคคล 3" />
          </div>
          <div className="management-name">ตำแหน่ง</div>
          <div className="management-position">
            ชื่อ........................
            <br />
            เบอร์โทร...............
          </div>
        </div>
        <div className="management-card position-4">
          <div className="management-avatar">
            <img src="image/avatar.png" alt="ชื่อบุคคล 4" />
          </div>
          <div className="management-name">ตำแหน่ง</div>
          <div className="management-position">
            ชื่อ........................
            <br />
            เบอร์โทร...............
          </div>
        </div>
        <div className="management-card position-5">
          <div className="management-avatar">
            <img src="image/avatar.png" alt="ชื่อบุคคล 5" />
          </div>
          <div className="management-name">ตำแหน่ง</div>
          <div className="management-position">
            ชื่อ........................
            <br />
            เบอร์โทร...............
          </div>
        </div>
      </div>
    </section>
  );
}
