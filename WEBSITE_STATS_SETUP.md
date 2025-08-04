# การตั้งค่าระบบสถิติการเข้าชมเว็บไซต์

## ไฟล์ที่สร้างใหม่ ✅

### 1. API Routes
- ✅ `src/app/api/website-stats/route.js` - API หลักสำหรับดึงและบันทึกสถิติ
- ✅ `src/app/api/website-stats/seed/route.js` - API สำหรับสร้างข้อมูลทดสอบ

### 2. Hooks & Components  
- ✅ `src/hooks/useVisitTracker.js` - Hook สำหรับติดตามการเข้าชม
- ✅ `src/components/VisitTracker.js` - Component สำหรับติดตามการเข้าชม

### 3. Updated Components
- ✅ `src/app/component/LandingPage/StateSection.jsx` - แสดงสถิติจริงแทน mock data

## การตั้งค่าเริ่มต้น

### 1. สร้างข้อมูลทดสอบ 🗃️
```bash
# เรียก API เพื่อสร้างข้อมูลทดสอบ
curl -X POST http://localhost:3000/api/website-stats/seed
```

หรือเปิดในเบราว์เซอร์:
```
http://localhost:3000/api/website-stats/seed
```

### 2. เพิ่ม VisitTracker ในหน้าหลัก 📊
เพิ่มใน `src/app/page.js` หรือ `src/app/layout.js`:

```javascript
import VisitTracker from '@/components/VisitTracker';

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>
        <VisitTracker />
        {children}
      </body>
    </html>
  );
}
```

### 3. ตรวจสอบการทำงาน 🔍
1. เปิดเว็บไซต์ในเบราว์เซอร์
2. ดูที่ StateSection ควรแสดงสถิติจริง
3. รีเฟรชหน้าหลายครั้งเพื่อทดสอบ

## คุณสมบัติ

### 📈 สถิติที่แสดง
- **ขณะนี้** - ผู้ใช้ที่ active ใน 5 นาทีที่ผ่านมา
- **วันนี้** - ผู้เข้าชมวันนี้ (unique IP)
- **สัปดาห์นี้** - ผู้เข้าชมสัปดาห์นี้ (unique IP)
- **เดือนนี้** - ผู้เข้าชมเดือนนี้ (unique IP)
- **ปีนี้** - ผู้เข้าชมปีนี้ (unique IP)
- **ทั้งหมด** - ผู้เข้าชมทั้งหมด (unique IP)

### 🔄 การอัปเดต
- **Real-time:** อัปเดตทุก 30 วินาที
- **Visit Tracking:** บันทึกการเข้าชมทุก 5 นาทีเพื่ออัปเดต "ขณะนี้"
- **Session Tracking:** ใช้ sessionStorage เพื่อติดตาม session

### 💾 Database Schema
```sql
CREATE TABLE website_visits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ip_address VARCHAR(45),
  user_agent TEXT,
  page_url VARCHAR(500),
  visit_date DATE,
  visit_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  session_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_visit_date (visit_date),
  INDEX idx_visit_time (visit_time),
  INDEX idx_ip_address (ip_address)
);
```

## API Endpoints

### GET /api/website-stats
ดึงสถิติการเข้าชมทั้งหมด

**Response:**
```json
{
  "success": true,
  "data": {
    "current": 25,
    "today": 150,
    "thisWeek": 1200,
    "thisMonth": 4500,
    "thisYear": 45000,
    "total": 125000,
    "lastUpdated": "2025-01-03T10:30:00.000Z"
  }
}
```

### POST /api/website-stats
บันทึกการเข้าชม

**Request Body:**
```json
{
  "pageUrl": "/",
  "sessionId": "session_123456789"
}
```

### POST /api/website-stats/seed
สร้างข้อมูลทดสอบ (สำหรับ development เท่านั้น)

## การปรับแต่ง

### 1. เปลี่ยนช่วงเวลา "ขณะนี้" ⏰
แก้ไขใน `src/app/api/website-stats/route.js`:
```javascript
// เปลี่ยนจาก 5 นาที เป็น 10 นาที
WHERE visit_time >= DATE_SUB(NOW(), INTERVAL 10 MINUTE)
```

### 2. เปลี่ยนความถี่การอัปเดต 🔄
แก้ไขใน `src/app/component/LandingPage/StateSection.jsx`:
```javascript
// เปลี่ยนจาก 30 วินาที เป็น 60 วินาที
const interval = setInterval(fetchStats, 60000);
```

### 3. เพิ่มการกรองข้อมูล 🔍
สามารถเพิ่มการกรอง bot traffic, internal IPs, หรือ specific user agents ได้

## การ Deploy

### Production Considerations:
1. **Database Indexing** - ตารางมี indexes สำหรับ performance
2. **Rate Limiting** - ควรเพิ่ม rate limiting สำหรับ API
3. **Caching** - ควรใช้ Redis หรือ memory cache สำหรับสถิติ
4. **Privacy** - IP addresses ถูกเก็บ ควรมี privacy policy

## สรุป ✅

ระบบสถิติการเข้าชมเว็บไซต์พร้อมใช้งานแล้ว:
- ✅ แสดงข้อมูลจริงแทน mock data
- ✅ อัปเดต real-time
- ✅ ติดตามการเข้าชมอัตโนมัติ
- ✅ มี API สำหรับจัดการข้อมูล
- ✅ รองรับการ scale ได้

**ขั้นตอนถัดไป:** เรียก API seed เพื่อสร้างข้อมูลทดสอบและเพิ่ม VisitTracker ในหน้าหลัก