# คู่มือการอัพโหลดรูปภาพบุคลากร

## การทำงานของระบบ

### 1. การอัพโหลดรูปภาพ
- **API Endpoint**: `POST /api/manual/upload-laravel`
- **ไฟล์ที่รองรับ**: PNG, JPG, JPEG, GIF, WebP, SVG
- **ขนาดสูงสุด**: 5MB
- **การเก็บไฟล์**: Laravel storage system

### 2. การแสดงรูปภาพ

#### ในตาราง (Table)
```javascript
// Logic การสร้าง URL รูปภาพ
const imageUrl = img && img !== "/image/placeholder-person.svg" && img.startsWith("/")
  ? `https://banpho.sosmartsolution.com/storage${img}`
  : img || "/image/placeholder-person.svg";
```

#### ในฟอร์ม (Form Preview)
```javascript
// Logic การแสดงตัวอย่าง
const previewUrl = uploadedImagePath && 
  uploadedImagePath !== "/image/placeholder-person.svg" && 
  uploadedImagePath.startsWith("/")
    ? `https://banpho.sosmartsolution.com/storage${uploadedImagePath}`
    : uploadedImagePath || "/image/placeholder-person.svg";
```

### 3. รูปแบบ URL ที่ใช้งาน

#### รูปภาพที่อัพโหลดแล้ว
- **Database Path**: `/uploads/1754630299_filename.png`
- **Display URL**: `https://banpho.sosmartsolution.com/storage/uploads/1754630299_filename.png`

#### รูปภาพ Placeholder
- **Database Path**: `/image/placeholder-person.svg`
- **Display URL**: `/image/placeholder-person.svg` (ไม่เพิ่ม storage prefix)

### 4. การจัดการ Error
- หากรูปภาพโหลดไม่ได้ จะ fallback ไปใช้ `/image/placeholder-person.svg`
- มี console.log เพื่อ debug การโหลดรูปภาพที่ผิดพลาด

### 5. การแสดงผลในหน้าต่างๆ

#### Admin Panel
- **ตาราง**: รูปภาพวงกลม 40x40px
- **ฟอร์ม**: รูปภาพวงกลม 80x80px พร้อมข้อความ "ตัวอย่างรูปภาพ"

#### Personnel Organization Chart
- รูปภาพจะถูกดึงจาก API `/api/people-management` (โหมดปกติ)
- ใช้ URL เดียวกันกับ admin panel

### 6. ตัวอย่างข้อมูลในฐานข้อมูล

```json
{
  "id": "21",
  "full_name": "นายรุ่งโรจน์ กิติพิศาลกุล",
  "img": "/uploads/1754630299_นายรุ่งโรจน์ กิติพิศาลกุล.png",
  // ... other fields
}
```

### 7. การ Debug
- เปิด Developer Tools Console เพื่อดู error log การโหลดรูปภาพ
- ตรวจสอบ Network tab เพื่อดู HTTP requests ไปยัง storage server
- ตรวจสอบว่า Laravel storage server ทำงานปกติ

## หมายเหตุสำคัญ
- ระบบจะไม่เพิ่ม storage prefix ให้กับ placeholder image
- รูปภาพที่อัพโหลดจะต้องเริ่มต้นด้วย `/` เพื่อให้ระบบรู้ว่าเป็น storage path
- การแสดงผลจะใช้ `object-fit: cover` เพื่อให้รูปภาพพอดีกับกรอบวงกลม