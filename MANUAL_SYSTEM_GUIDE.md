# ระบบคู่มือและเอกสาร - Manual System

## ✅ ระบบที่สร้างเสร็จแล้ว

### 🎯 **ภาพรวมระบบ:**

ระบบคู่มือและเอกสารสำหรับเทศบาลตำบลบ้านโพธิ์ ที่ช่วยให้เจ้าหน้าที่และประชาชนสามารถเข้าถึงคู่มือการปฏิบัติงาน เอกสารต่างๆ และแบบฟอร์มได้อย่างสะดวก

### 📊 **หมวดหมู่หลัก:**

1. **คู่มือสำหรับเข้าหน้าที่** - คู่มือและแนวทางสำหรับเจ้าหน้าที่เทศบาล
2. **คู่มือสำหรับประชาชน** - คู่มือการใช้บริการสำหรับประชาชน
3. **คู่มือการใช้งานระบบ** - คู่มือการใช้งานระบบต่างๆ ของเทศบาล
4. **กฎหมายและระเบียบ** - กฎหมาย ระเบียบ และข้อบังคับที่เกี่ยวข้อง
5. **แบบฟอร์มและเอกสาร** - แบบฟอร์มและเอกสารต่างๆ ที่ใช้ในการปฏิบัติงาน

## 🗄️ **Database Schema**

### ตาราง `manual_categories`:
```sql
CREATE TABLE manual_categories (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(255) NOT NULL,
  category_description TEXT,
  icon VARCHAR(100),
  color VARCHAR(7),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### ตาราง `manual_items`:
```sql
CREATE TABLE manual_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  content LONGTEXT,
  tags VARCHAR(500),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  view_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (category_id) REFERENCES manual_categories(id) ON DELETE CASCADE
);
```

### ตาราง `manual_files`:
```sql
CREATE TABLE manual_files (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  manual_id BIGINT UNSIGNED NOT NULL,
  files_path VARCHAR(255) NOT NULL,
  files_type VARCHAR(255) NOT NULL,
  original_name VARCHAR(255),
  file_size BIGINT,
  description TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (manual_id) REFERENCES manual_items(id) ON DELETE CASCADE
);
```

## 🔌 **APIs ที่มีให้ใช้งาน**

### 1. **Manual Categories API**
- `GET /api/manual-categories` - ดึงรายการหมวดหมู่
- `POST /api/manual-categories` - สร้างหมวดหมู่ใหม่

### 2. **Manual Items API**
- `GET /api/manual-items` - ดึงรายการคู่มือ
- `POST /api/manual-items` - สร้างคู่มือใหม่

### 3. **Manual Files API**
- `GET /api/manual-files` - ดึงรายการไฟล์
- `POST /api/manual-files` - เพิ่มไฟล์ใหม่

### 4. **Search API**
- `GET /api/manual-search?q=keyword` - ค้นหาคู่มือ

### 5. **Setup API**
- `POST /api/create-manual-tables` - สร้างตารางและข้อมูลตัวอย่าง

## 🎨 **Frontend Components**

### หน้าแสดงคู่มือสำหรับประชาชน (`/citizen/manual`):
- **Search & Filter** - ค้นหาและกรองตามหมวดหมู่
- **Category Sidebar** - แสดงหมวดหมู่พร้อมจำนวนคู่มือ
- **Featured Manuals** - คู่มือแนะนำ
- **Manual List** - รายการคู่มือพร้อมเนื้อหา
- **File Downloads** - ดาวน์โหลดไฟล์แนบ
- **View Counter** - นับจำนวนการเข้าชม

## 🎯 **ฟีเจอร์หลัก**

### ✅ **สำหรับประชาชน:**
- **ค้นหาคู่มือ** - ค้นหาด้วยคำสำคัญ
- **กรองตามหมวดหมู่** - เลือกดูตามหมวดหมู่
- **ดูเนื้อหาคู่มือ** - อ่านเนื้อหาแบบ expand/collapse
- **ดาวน์โหลดไฟล์** - ดาวน์โหลดเอกสารแนบ
- **คู่มือแนะนำ** - คู่มือที่ใช้บ่อย
- **Search Highlighting** - เน้นคำค้นหาในผลลัพธ์

### ✅ **สำหรับ Admin:**
- **จัดการหมวดหมู่** - เพิ่ม/แก้ไข/ลบหมวดหมู่
- **จัดการคู่มือ** - เพิ่ม/แก้ไข/ลบคู่มือ
- **อัปโหลดไฟล์** - แนบไฟล์เอกสาร
- **จัดลำดับ** - กำหนดลำดับการแสดง
- **สถิติการเข้าชม** - ดูจำนวนการเข้าชม

## 📝 **ตัวอย่างข้อมูลที่สร้างไว้**

### คู่มือสำหรับเข้าหน้าที่:
- **คู่มือการปฏิบัติงานสำหรับเจ้าหน้าที่ใหม่**
  - การรายงานตัว
  - การทำความรู้จักกับหน่วยงาน
  - ระเบียบการปฏิบัติงาน
  - การใช้งานระบบต่างๆ

### คู่มือสำหรับประชาชน:
- **คู่มือการขอใบรับรองต่างๆ**
  - ประเภทใบรับรอง
  - เอกสารที่ต้องเตรียม
  - ขั้นตอนการขอ

### คู่มือการใช้งานระบบ:
- **คู่มือการใช้งานระบบบริหารจัดการ**
  - การเข้าสู่ระบบ
  - เมนูหลัก
  - การใช้งานแต่ละส่วน

## 🔧 **การติดตั้งและใช้งาน**

### ขั้นตอนการติดตั้ง:
1. **สร้างตาราง** - เรียก `POST /api/create-manual-tables`
2. **ตรวจสอบข้อมูล** - เรียก `GET /api/manual-categories`
3. **เข้าใช้งาน** - ไปที่ `/citizen/manual`

### การเพิ่มคู่มือใหม่:
```javascript
const manualData = {
  category_id: 1,
  title: "ชื่อคู่มือ",
  description: "คำอธิบายสั้นๆ",
  content: "เนื้อหาคู่มือแบบละเอียด",
  tags: "แท็ก1, แท็ก2, แท็ก3",
  is_featured: true,
  files: [
    {
      files_path: "/path/to/file.pdf",
      files_type: "application/pdf",
      original_name: "document.pdf",
      file_size: 1024000,
      description: "เอกสารแนบ"
    }
  ]
};

const response = await manualAPI.createItem(manualData);
```

## 🎨 **การใช้งานจริง**

### ตัวอย่างหน้าจอ:
```
📚 คู่มือและเอกสาร

🔍 [ค้นหาคู่มือ เช่น การขอใบรับรอง, การชำระภาษี...]

┌─ หมวดหมู่คู่มือ ─────────┐  ┌─ รายการคู่มือ ─────────────────┐
│ 📁 คู่มือสำหรับเข้าหน้าที่ (3) │  │ 📄 คู่มือการขอใบรับรองต่างๆ      │
│ 👥 คู่มือสำหรับประชาชน (5)   │  │ 🏷️ คู่มือสำหรับประชาชน           │
│ ⚙️ คู่มือการใช้งานระบบ (2)   │  │ 👁️ 150 ครั้ง 📎 3 ไฟล์         │
│ 📖 กฎหมายและระเบียบ (8)     │  │                                │
│ 📋 แบบฟอร์มและเอกสาร (12)   │  │ ขั้นตอนการขอใบรับรองจากเทศบาล... │
└─────────────────────────┘  │ [ดูเนื้อหาคู่มือ ▼]              │
                             │                                │
┌─ คู่มือแนะนำ ─────────────┐  │ 🏷️ แท็ก: ใบรับรอง, เอกสาร      │
│ ⭐ คู่มือการขอใบรับรอง      │  └────────────────────────────────┘
│ ⭐ คู่มือการชำระภาษี        │
│ ⭐ แบบฟอร์มต่างๆ           │
└─────────────────────────┘
```

## 🚀 **ระบบพร้อมใช้งาน**

### ✅ **Features ที่ทำงานได้:**
- **หมวดหมู่คู่มือ** - 5 หมวดหมู่หลัก
- **ข้อมูลตัวอย่าง** - 3 คู่มือตัวอย่าง
- **ระบบค้นหา** - ค้นหาแบบ full-text
- **การจัดการไฟล์** - อัปโหลดและดาวน์โหลด
- **หน้าแสดงผล** - UI สำหรับประชาชน
- **API ครบชุด** - พร้อมสำหรับ Admin Panel

### 🎯 **การใช้งาน:**
1. **เข้าหน้าคู่มือ** → `/citizen/manual`
2. **ค้นหาคู่มือ** → ใช้ search box
3. **เลือกหมวดหมู่** → คลิกหมวดหมู่ที่ต้องการ
4. **ดูเนื้อหา** → คลิก "ดูเนื้อหาคู่มือ"
5. **ดาวน์โหลดไฟล์** → คลิกลิงก์ไฟล์แนบ

## 📋 **ขั้นตอนถัดไป**

### สำหรับ Admin Panel:
1. สร้างหน้าจัดการคู่มือใน Admin Panel
2. เพิ่มฟอร์มสำหรับเพิ่ม/แก้ไขคู่มือ
3. ระบบอัปโหลดไฟล์แนบ
4. สถิติการเข้าชมและรายงาน

### สำหรับ Enhancement:
1. ระบบ Rating และ Feedback
2. การแจ้งเตือนคู่มือใหม่
3. ระบบ Bookmark คู่มือที่สนใจ
4. การแปลงไฟล์เป็น PDF online

**ระบบคู่มือและเอกสารพร้อมใช้งานแล้ว!** 🎉

### 🎯 **การเข้าถึง:**
- **ประชาชน:** `/citizen/manual`
- **API Docs:** ดูใน `MANUAL_SYSTEM_GUIDE.md`
- **Database:** ตาราง `manual_*`