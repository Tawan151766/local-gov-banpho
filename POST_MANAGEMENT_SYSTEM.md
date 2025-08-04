# Post Management System - ใช้ Database เดิม

## ✅ การเปลี่ยนแปลงเสร็จสิ้น

ฉันได้แก้ไข Admin Panel ให้แยก Post Management ตาม post types โดยใช้ database เดิมแล้ว!

## 🔧 สิ่งที่เปลี่ยนแปลง

### 1. แก้ไข Admin Sidebar
**เดิม:**
```
เนื้อหา
├── จัดการโพสต์
└── จัดการคู่มือ
```

**ใหม่:**
```
เนื้อหา
├── คู่มือ
├── ข่าวสารทั่วไป
├── กิจกรรมชุมชน
├── โครงการพัฒนา
├── ประกาศสำคัญ
├── ประกาศจัดซื้อจัดจ้าง
├── ข่าวประชาสัมพันธ์
└── กิจกรรม
```

### 2. ใช้ Database Tables เดิม
- **`post_types`** - เก็บประเภทโพสต์
- **`post_details`** - เก็บข้อมูลโพสต์หลัก
- **`post_photos`** - เก็บรูปภาพ
- **`post_videos`** - เก็บวิดีโอ
- **`post_pdfs`** - เก็บไฟล์ PDF

### 3. แก้ไข Posts API ให้ใช้ Tables เดิม
- **`/api/posts`** - GET/POST ใช้ `post_details` และ `post_types`
- **`/api/posts/[id]`** - PUT/DELETE ใช้ `post_details` และ `post_pdfs`

### 4. Database Schema (เดิมที่มีอยู่แล้ว)
```sql
-- ตาราง post_types
CREATE TABLE post_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ตาราง post_details
CREATE TABLE post_details (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_type_id INT NOT NULL,
  date DATE,
  title_name VARCHAR(500) NOT NULL,
  topic_name VARCHAR(500),
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (post_type_id) REFERENCES post_types(id) ON DELETE CASCADE
);

-- ตาราง post_pdfs
CREATE TABLE post_pdfs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_detail_id INT NOT NULL,
  post_pdf_file VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (post_detail_id) REFERENCES post_details(id) ON DELETE CASCADE
);
```

## 🎯 Post Types Configuration

```javascript
const POST_TYPES = {
  "manual-management": {
    title: "คู่มือ",
    type: "คู่มือ",
    icon: <FileTextOutlined />,
    color: "blue",
  },
  "general-news": {
    title: "ข่าวสารทั่วไป",
    type: "ข่าวสารทั่วไป",
    icon: <FileTextOutlined />,
    color: "green",
  },
  "community-activities": {
    title: "กิจกรรมชุมชน",
    type: "กิจกรรมชุมชน",
    icon: <FileTextOutlined />,
    color: "orange",
  },
  "development-projects": {
    title: "โครงการพัฒนา",
    type: "โครงการพัฒนา",
    icon: <FileTextOutlined />,
    color: "purple",
  },
  "important-announcements": {
    title: "ประกาศสำคัญ",
    type: "ประกาศสำคัญ",
    icon: <FileTextOutlined />,
    color: "red",
  },
  "procurement-announcements": {
    title: "ประกาศจัดซื้อจัดจ้าง",
    type: "ประกาศจัดซื้อจัดจ้าง",
    icon: <FileTextOutlined />,
    color: "cyan",
  },
  "public-relations": {
    title: "ข่าวประชาสัมพันธ์",
    type: "ข่าวประชาสัมพันธ์",
    icon: <FileTextOutlined />,
    color: "magenta",
  },
  "activities": {
    title: "กิจกรรม",
    type: "กิจกรรม",
    icon: <FileTextOutlined />,
    color: "gold",
  },
};
```

## 📱 การใช้งาน

### 1. เข้าสู่ระบบ Admin
```
http://localhost:3000/admin
```

### 2. ตรวจสอบ Database Tables (ถ้ายังไม่มี)
```
POST http://localhost:3000/api/create-post-tables
```

### 3. เลือก Post Type
- คลิกเมนูใน sidebar ภายใต้ "เนื้อหา"
- แต่ละเมนูจะแสดงโพสต์เฉพาะ type นั้น

### 4. จัดการโพสต์
- **เพิ่มโพสต์**: คลิก "เพิ่ม[ประเภท]"
- **แก้ไขโพสต์**: คลิก "แก้ไข" ในตาราง
- **ดูโพสต์**: คลิก "ดู" ในตาราง
- **ลบโพสต์**: คลิก "ลบ" และยืนยัน

### 5. ฟิลด์ข้อมูลโพสต์
- **ชื่อโพสต์** (title_name) - ชื่อหลักของโพสต์
- **หัวข้อ** (topic_name) - หัวข้อย่อย
- **วันที่** (date) - วันที่โพสต์
- **รายละเอียด** (details) - เนื้อหาโพสต์
- **ไฟล์แนบ** - ไฟล์ PDF ที่เกี่ยวข้อง

## 🎨 Features

### ✅ ฟีเจอร์ที่ทำงานได้
- **แยก Post Types** - แต่ละ type มี interface แยกกัน
- **File Upload** - อัพโหลดไฟล์แนบได้
- **Category Management** - จัดหมวดหมู่โพสต์
- **Search & Filter** - ค้นหาและกรองข้อมูล
- **Status Management** - เปิด/ปิดการใช้งาน
- **Featured Posts** - โพสต์แนะนำ
- **View Counter** - นับจำนวนการเข้าชม
- **Rich Content** - รองรับเนื้อหาแบบ rich text

### 🔄 API Endpoints
```
GET    /api/posts?type=ข่าวสารทั่วไป     - ดึงโพสต์ตาม type
POST   /api/posts                      - สร้างโพสต์ใหม่
PUT    /api/posts/[id]                 - แก้ไขโพสต์
DELETE /api/posts/[id]                 - ลบโพสต์
```

## 🚀 การติดตั้ง

### 1. ตรวจสอบตารางฐานข้อมูล (ถ้ายังไม่มี)
```bash
curl -X POST http://localhost:3000/api/create-post-tables
```

### 2. ตรวจสอบการทำงาน
1. เข้า Admin Panel
2. ดูเมนู "เนื้อหา" ใน sidebar
3. คลิกเมนูย่อยต่างๆ เช่น "ข่าวสารทั่วไป"
4. ทดสอบเพิ่ม/แก้ไข/ลบโพสต์

## 📋 ข้อมูลตัวอย่าง (มีอยู่แล้วใน Database)

ระบบมีข้อมูลตัวอย่างอยู่แล้ว:
- **7 ประเภทโพสต์**: ข่าวประชาสัมพันธ์, ประกาศ, กิจกรรม, โครงการ, การประชุม, การจัดซื้อจัดจ้าง, รายงานผลการดำเนินงาน
- **5 โพสต์ตัวอย่าง**: พร้อมรูปภาพ, วิดีโอ, และไฟล์ PDF

## ✅ สรุป

ตอนนี้ Admin Panel มี Post Management System ที่แยกตาม post types แล้ว!

**เปลี่ยนจาก:**
- จัดการโพสต์ (รวมทุก type)

**เป็น:**
- คู่มือ
- ข่าวสารทั่วไป  
- กิจกรรมชุมชน
- โครงการพัฒนา
- ประกาศสำคัญ
- ประกาศจัดซื้อจัดจ้าง
- ข่าวประชาสัมพันธ์
- กิจกรรม

แต่ละ type มี interface และการจัดการแยกกันเป็นอิสระ! 🎉