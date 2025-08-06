# ระบบ Q&A (คำถาม-คำตอบ) สำหรับเว็บไซต์เทศบาล

## ภาพรวมระบบ

ระบบ Q&A ที่สร้างขึ้นเพื่อให้ประชาชนสามารถค้นหาคำตอบสำหรับคำถามที่พบบ่อยเกี่ยวกับบริการของเทศบาลตำบลบ้านโพธิ์

## ไฟล์ที่สร้างใหม่ ✅

### 1. API Routes
- ✅ `src/app/api/create-qa-tables/route.js` - สร้างตารางและข้อมูลตัวอย่าง
- ✅ `src/app/api/qa-categories/route.js` - จัดการหมวดหมู่คำถาม
- ✅ `src/app/api/qa-items/route.js` - จัดการคำถาม-คำตอบ
- ✅ `src/app/api/qa-items/[id]/view/route.js` - เพิ่มจำนวนการดู
- ✅ `src/app/api/qa-search/route.js` - ค้นหาคำถาม-คำตอบ

### 2. Frontend Pages
- ✅ `src/app/citizen/qa/page.js` - หน้า Q&A สำหรับประชาชน

### 3. API Library
- ✅ อัปเดต `src/lib/api.js` - เพิ่ม qaAPI functions

## Database Schema

### ตาราง qa_categories (หมวดหมู่คำถาม)
```sql
CREATE TABLE qa_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(255) NOT NULL,
  category_description TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### ตาราง qa_items (คำถาม-คำตอบ)
```sql
CREATE TABLE qa_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT,
  question TEXT NOT NULL,
  answer LONGTEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  view_count INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  tags VARCHAR(500),
  submitter_ip VARCHAR(45),
  submitter_user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES qa_categories(id) ON DELETE SET NULL
);
```

### ตาราง qa_submitters (ข้อมูลผู้ส่งคำถาม)
```sql
CREATE TABLE qa_submitters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  qa_item_id INT,
  submitter_name VARCHAR(255),
  submitter_email VARCHAR(255),
  submitter_phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (qa_item_id) REFERENCES qa_items(id) ON DELETE CASCADE
);
```

## การตั้งค่าเริ่มต้น

### 1. สร้างตารางและข้อมูลตัวอย่าง 🗃️
```bash
# เรียก API เพื่อสร้างตารางและข้อมูลตัวอย่าง
curl -X POST http://localhost:3000/api/create-qa-tables
```

หรือเปิดในเบราว์เซอร์:
```
http://localhost:3000/api/create-qa-tables
```

### 2. ตรวจสอบการทำงาน 🔍
เปิดหน้า Q&A:
```
http://localhost:3000/citizen/qa
```

## คุณสมบัติ

### 📋 หมวดหมู่คำถาม (8 หมวด)
1. **บริการทั่วไป** - เวลาทำการ, การติดต่อ
2. **เอกสารราชการ** - ใบรับรอง, หนังสือรับรอง
3. **ภาษีและค่าธรรมเนียม** - การชำระภาษี, ค่าธรรมเนียม
4. **สาธารณูปโภค** - น้ำประปา, ไฟฟ้า, ถนน
5. **สวัสดิการสังคม** - เบี้ยยังชีพ, การช่วยเหลือ
6. **การศึกษา** - โรงเรียน, การศึกษา
7. **สาธารณสุข** - โรงพยาบาล, สุขภาพ
8. **สิ่งแวดล้อม** - ขยะ, มลพิษ

### 🔍 ระบบค้นหา
- **FULLTEXT Search** - ค้นหาแบบ natural language
- **LIKE Search** - ค้นหาแบบ fallback
- **Tag Search** - ค้นหาจาก tags
- **Relevance Scoring** - จัดเรียงตามความเกี่ยวข้อง

### 📊 ระบบสถิติ
- **View Count** - นับจำนวนการดู
- **Featured Items** - คำถามยอดนิยม
- **Category Count** - จำนวนคำถามในแต่ละหมวด

### 🎨 UI Features
- **Responsive Design** - รองรับทุกขนาดหน้าจอ
- **Search Highlighting** - เน้นคำค้นหา
- **Category Filter** - กรองตามหมวดหมู่
- **Collapsible Answers** - คำตอบแบบพับได้
- **Loading States** - แสดงสถานะการโหลด
- **Submit New Question** - ประชาชนส่งคำถามใหม่ได้
- **IP Tracking** - เก็บ IP ของผู้ส่งคำถาม

## API Endpoints

### Categories API

#### GET `/api/qa-categories`
ดึงรายการหมวดหมู่

**Query Parameters:**
- `page` (number): หน้าที่ต้องการ
- `limit` (number): จำนวนรายการต่อหน้า
- `search` (string): ค้นหาชื่อหมวดหมู่
- `withItems` (boolean): รวมจำนวนคำถามในหมวด
- `activeOnly` (boolean): เฉพาะหมวดที่เปิดใช้งาน

#### POST `/api/qa-categories`
สร้างหมวดหมู่ใหม่

**Request Body:**
```json
{
  "category_name": "หมวดใหม่",
  "category_description": "คำอธิบาย",
  "display_order": 1,
  "is_active": true
}
```

### Q&A Items API

#### GET `/api/qa-items`
ดึงรายการคำถาม-คำตอบ

**Query Parameters:**
- `page` (number): หน้าที่ต้องการ
- `limit` (number): จำนวนรายการต่อหน้า
- `search` (string): ค้นหาในคำถามและคำตอบ
- `categoryId` (number): กรองตามหมวดหมู่
- `featuredOnly` (boolean): เฉพาะคำถามยอดนิยม
- `activeOnly` (boolean): เฉพาะคำถามที่เปิดใช้งาน

#### POST `/api/qa-items`
สร้างคำถาม-คำตอบใหม่

**Request Body:**
```json
{
  "category_id": 1,
  "question": "คำถาม",
  "answer": "คำตอบ",
  "display_order": 1,
  "is_active": true,
  "is_featured": false,
  "tags": "tag1, tag2"
}
```

#### POST `/api/qa-items/[id]/view`
เพิ่มจำนวนการดู

### Search API

#### GET `/api/qa-search`
ค้นหาคำถาม-คำตอบ

**Query Parameters:**
- `q` (string): คำค้นหา
- `limit` (number): จำนวนผลลัพธ์สูงสุด

## การใช้งาน API Library

```javascript
import { qaAPI } from '@/lib/api';

// ดึงหมวดหมู่พร้อมจำนวนคำถาม
const categories = await qaAPI.getCategories({ 
  withItems: true, 
  activeOnly: true 
});

// ดึงคำถามยอดนิยม
const featured = await qaAPI.getItems({ 
  featuredOnly: true, 
  limit: 5 
});

// ค้นหาคำถาม
const results = await qaAPI.search('ใบรับรอง', 10);

// เพิ่มจำนวนการดู
await qaAPI.incrementView(123);

// ส่งคำถามใหม่
await qaAPI.submitQuestion({
  category_id: 1,
  question: "คำถามจากประชาชน",
  submitter_name: "ชื่อผู้ส่ง",
  submitter_email: "email@example.com"
});
```

## ข้อมูลตัวอย่าง

ระบบมาพร้อมข้อมูลตัวอย่าง 8 คำถาม:

1. **เวลาทำการ** - เทศบาลเปิดให้บริการวันไหนบ้าง
2. **ใบรับรองหนี้สิน** - เอกสารที่ต้องเตรียม
3. **ชำระภาษี** - ช่องทางการชำระภาษีโรงเรือน
4. **น้ำประปา** - การแจ้งปัญหาน้ำประปา
5. **เบี้ยยังชีพ** - สิทธิ์ผู้สูงอายุ
6. **โรงเรียน** - โรงเรียนในเขตเทศบาล
7. **สถานีอนามัย** - บริการสาธารณสุข
8. **เก็บขยะ** - ตารางเก็บขยะแต่ละหมู่บ้าน

## การปรับแต่ง

### 1. เพิ่มหมวดหมู่ใหม่
```javascript
await qaAPI.createCategory({
  category_name: "หมวดใหม่",
  category_description: "คำอธิบาย",
  display_order: 10
});
```

### 2. เพิ่มคำถาม-คำตอบ
```javascript
await qaAPI.createItem({
  category_id: 1,
  question: "คำถามใหม่?",
  answer: "คำตอบสำหรับคำถามใหม่",
  is_featured: true,
  tags: "tag1, tag2, tag3"
});
```

### 3. ปรับแต่ง UI
แก้ไขไฟล์ `src/app/citizen/qa/page.js` เพื่อปรับแต่ง:
- สี theme
- จำนวนรายการต่อหน้า
- รูปแบบการแสดงผล

## การ Deploy

### Production Considerations:
1. **Database Indexing** - ตารางมี indexes สำหรับ performance
2. **FULLTEXT Search** - ตั้งค่า MySQL FULLTEXT search
3. **Caching** - ควรใช้ cache สำหรับข้อมูลที่ไม่เปลี่ยนแปลงบ่อย
4. **SEO** - เพิ่ม meta tags และ structured data

## สรุป ✅

ระบบ Q&A พร้อมใช้งานแล้ว:
- ✅ Database tables พร้อมข้อมูลตัวอย่าง
- ✅ API endpoints ครบถ้วน
- ✅ หน้าเว็บสำหรับประชาชน
- ✅ ระบบค้นหาและกรองข้อมูล
- ✅ ระบบสถิติการดู
- ✅ Responsive design

## การติดตั้งและ Setup ระบบ 🚀

### ขั้นตอนการติดตั้ง:

1. **สร้างตารางฐานข้อมูล**
   ```
   POST /api/create-qa-tables
   ```

2. **Seed หมวดหมู่คำถาม**
   ```
   POST /api/seed-qa-categories
   ```

3. **Seed ข้อมูลตัวอย่าง Q&A**
   ```
   POST /api/seed-qa-sample
   ```

### API Endpoints ที่มีให้ใช้งาน:

#### 📊 การจัดการข้อมูล
- `GET /api/qa-categories` - ดึงรายการหมวดหมู่
- `GET /api/qa-items` - ดึงรายการ Q&A
- `GET /api/qa-search?q=keyword` - ค้นหา Q&A
- `GET /api/qa-pending` - ดึงคำถามที่รอการตอบ (Admin)

#### 🔧 การจัดการ Admin
- `GET /api/qa-items/[id]` - ดึงข้อมูล Q&A รายการเดียว
- `PUT /api/qa-items/[id]` - อัปเดตคำตอบ
- `DELETE /api/qa-items/[id]` - ลบคำถาม

#### 📝 การส่งข้อมูล
- `POST /api/qa-submit` - ส่งคำถามใหม่จากประชาชน
- `POST /api/qa-items/[id]/view` - เพิ่มจำนวนการดู

#### 🌱 Seed Data
- `POST /api/seed-qa-categories` - สร้างหมวดหมู่เริ่มต้น
- `DELETE /api/seed-qa-categories?force=true` - ลบและสร้างหมวดหมู่ใหม่
- `POST /api/seed-qa-sample` - สร้างข้อมูลตัวอย่าง Q&A
- `DELETE /api/seed-qa-sample?force=true` - ลบและสร้างข้อมูลตัวอย่างใหม่

### หมวดหมู่ที่มีให้ใช้งาน:

1. **บริการทั่วไป** - เวลาทำการ, การติดต่อ
2. **เอกสารราชการ** - ใบรับรอง, หนังสือรับรอง
3. **ภาษีและค่าธรรมเนียม** - การชำระภาษี
4. **สาธารณูปโภค** - น้ำประปา, ไฟฟ้า, ถนน
5. **สวัสดิการสังคม** - เบี้ยยังชีพ, สวัสดิการ
6. **การศึกษา** - ทุนการศึกษา, โรงเรียน
7. **สาธารณสุข** - โรงพยาบาล, สุขภาพ
8. **สิ่งแวดล้อม** - การจัดการขยะ, มลพิษ
9. **การขออนุญาต** - ใบอนุญาตต่างๆ
10. **การจราจร** - ป้ายจราจร, ที่จอดรถ
11. **การร้องเรียน** - การแจ้งเหตุเดือดร้อน
12. **กิจกรรมและงานประเพณี** - เทศกาล, กิจกรรม

**ขั้นตอนถัดไป:** เรียก API ตามลำดับข้างต้นเพื่อติดตั้งระบบ