# คู่มือการใช้งาน Q&A System APIs

## การติดตั้งระบบ

### 1. สร้างตารางฐานข้อมูล
```bash
POST /api/create-qa-tables
```

**Response:**
```json
{
  "success": true,
  "message": "All Q&A tables created successfully",
  "tables": ["qa_categories", "qa_items", "qa_submitters"]
}
```

### 2. Seed หมวดหมู่คำถาม
```bash
POST /api/seed-qa-categories
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully seeded 12 categories",
  "data": [...],
  "summary": {
    "total_inserted": 12,
    "categories": [...]
  }
}
```

**Force Re-seed:**
```bash
DELETE /api/seed-qa-categories?force=true
```

### 3. Seed ข้อมูลตัวอย่าง Q&A
```bash
POST /api/seed-qa-sample
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully seeded 8 Q&A items",
  "data": [...],
  "summary": {
    "total_inserted": 8,
    "featured_items": 4,
    "categories_used": 8
  }
}
```

## APIs สำหรับประชาชน

### ดึงรายการหมวดหมู่
```bash
GET /api/qa-categories?activeOnly=true&withItems=true
```

**Parameters:**
- `activeOnly` (boolean) - แสดงเฉพาะหมวดหมู่ที่เปิดใช้งาน
- `withItems` (boolean) - รวมจำนวนคำถามในแต่ละหมวดหมู่

### ดึงรายการ Q&A
```bash
GET /api/qa-items?categoryId=1&featuredOnly=false&limit=20
```

**Parameters:**
- `categoryId` (number) - กรองตามหมวดหมู่
- `featuredOnly` (boolean) - แสดงเฉพาะคำถามยอดนิยม
- `limit` (number) - จำนวนรายการที่ต้องการ

### ค้นหา Q&A
```bash
GET /api/qa-search?q=ใบรับรอง&limit=20
```

**Parameters:**
- `q` (string) - คำค้นหา
- `limit` (number) - จำนวนผลลัพธ์

### ส่งคำถามใหม่
```bash
POST /api/qa-submit
Content-Type: application/json

{
  "category_id": 1,
  "question": "ขอใบรับรองการไม่มีหนี้สินต้องทำอย่างไร?",
  "submitter_name": "นายสมชาย ใจดี",
  "submitter_email": "somchai@email.com",
  "submitter_phone": "081-234-5678"
}
```

### เพิ่มจำนวนการดู
```bash
POST /api/qa-items/1/view
```

## APIs สำหรับ Admin

### ดึงคำถามที่รอการตอบ
```bash
GET /api/qa-pending?page=1&limit=10&search=ใบรับรอง
```

**Parameters:**
- `page` (number) - หน้าที่ต้องการ
- `limit` (number) - จำนวนรายการต่อหน้า
- `search` (string) - ค้นหาในคำถาม

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "question": "ขอใบรับรองการไม่มีหนี้สิน...",
      "category_name": "เอกสารราชการ",
      "submitter_name": "นายสมชาย ใจดี",
      "submitter_email": "somchai@email.com",
      "submitter_phone": "081-234-5678",
      "submitter_ip": "192.168.1.100",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 10,
    "total": 25,
    "total_pages": 3,
    "has_next": true,
    "has_prev": false
  }
}
```

### ดึงข้อมูล Q&A รายการเดียว
```bash
GET /api/qa-items/1
```

### อัปเดตคำตอบ
```bash
PUT /api/qa-items/1
Content-Type: application/json

{
  "answer": "สำหรับการขอใบรับรองการไม่มีหนี้สิน...",
  "category_id": 2,
  "is_active": true,
  "is_featured": false,
  "tags": "ใบรับรอง, เอกสาร, หนี้สิน",
  "display_order": 1
}
```

### ลบคำถาม
```bash
DELETE /api/qa-items/1
```

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "details": "Detailed error information"
}
```

### Common HTTP Status Codes
- `200` - Success
- `400` - Bad Request (ข้อมูลไม่ถูกต้อง)
- `404` - Not Found (ไม่พบข้อมูล)
- `500` - Internal Server Error (ข้อผิดพลาดของเซิร์ฟเวอร์)

## Database Schema

### qa_categories
```sql
- id (BIGINT, PRIMARY KEY)
- category_name (VARCHAR(255))
- description (TEXT)
- icon (VARCHAR(100))
- color (VARCHAR(7))
- display_order (INT)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### qa_items
```sql
- id (BIGINT, PRIMARY KEY)
- category_id (BIGINT, FOREIGN KEY)
- question (TEXT)
- answer (TEXT)
- tags (VARCHAR(500))
- is_active (BOOLEAN)
- is_featured (BOOLEAN)
- display_order (INT)
- view_count (INT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### qa_submitters
```sql
- id (BIGINT, PRIMARY KEY)
- qa_item_id (BIGINT, FOREIGN KEY)
- submitter_name (VARCHAR(255))
- submitter_email (VARCHAR(255))
- submitter_phone (VARCHAR(20))
- submitter_ip (VARCHAR(45))
- created_at (TIMESTAMP)
```

## Security Features

### IP Address Logging
- ระบบจะบันทึก IP Address ของผู้ส่งคำถามทุกครั้ง
- ใช้เพื่อป้องกัน Spam และการใช้งานในทางที่ผิด
- ข้อมูล IP จะถูกเก็บเป็นความลับ

### Input Validation
- ตรวจสอบความถูกต้องของข้อมูลก่อนบันทึก
- ป้องกัน SQL Injection และ XSS
- จำกัดความยาวของข้อความ

### Content Moderation
- คำถามจะต้องผ่านการตรวจสอบก่อนเผยแพร่
- Admin สามารถแก้ไขหรือลบเนื้อหาที่ไม่เหมาะสม
- ระบบแจ้งเตือนเมื่อมีคำถามใหม่

## Performance Optimization

### Database Indexing
- Index บน `category_id`, `is_active`, `is_featured`
- Full-text search index บน `question` และ `answer`
- Composite index สำหรับการค้นหาที่ซับซ้อน

### Caching Strategy
- Cache รายการหมวดหมู่ที่ใช้บ่อย
- Cache คำถามยอดนิยม
- Invalidate cache เมื่อมีการอัปเดต

### Pagination
- ใช้ LIMIT และ OFFSET สำหรับการแบ่งหน้า
- จำกัดจำนวนผลลัพธ์เพื่อประสิทธิภาพ
- แสดงข้อมูล pagination ที่ครบถ้วน