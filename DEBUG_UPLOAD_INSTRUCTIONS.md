# คำแนะนำการ Debug ปัญหา Upload ซ้ำ

## การเพิ่ม Logging เพื่อ Debug

ผมได้เพิ่ม logging ในจุดสำคัญเพื่อติดตามปัญหา:

### 1. Frontend Logging (LocalDevPlanManagement.js)
```javascript
console.log('🔥 customUpload called with file:', file.name, 'uploading state:', uploading);
console.log('❌ Upload already in progress, skipping...');
```

### 2. Backend API Logging (upload-laravel/route.js)
```javascript
console.log('🚀 API /local-dev-plan/upload-laravel called at:', new Date().toISOString());
console.log('📁 File details:', { name, size, type, typeId, description });
console.log('💾 Saving to database:', { typeId, filePath, fileType, ... });
console.log('✅ Database insert successful, ID:', result.insertId);
```

## วิธีการทดสอบ

1. **เปิด Developer Tools** (F12)
2. **ไปที่ Console tab**
3. **ทดสอบ upload ไฟล์** ในหน้า LocalDevPlanManagement
4. **สังเกต logs** ที่ปรากฏ

## สิ่งที่ต้องสังเกต

### ✅ พฤติกรรมที่ถูกต้อง (upload 1 ครั้ง):
```
🔥 customUpload called with file: test.pdf uploading state: false
🚀 API /local-dev-plan/upload-laravel called at: 2025-01-03T...
📁 File details: { name: "test.pdf", size: 12345, ... }
💾 Saving to database: { typeId: 1, filePath: "/storage/uploads/...", ... }
✅ Database insert successful, ID: 123
```

### ❌ พฤติกรรมที่ผิด (upload ซ้ำ):
```
🔥 customUpload called with file: test.pdf uploading state: false
🔥 customUpload called with file: test.pdf uploading state: true  ← เรียกซ้ำ!
❌ Upload already in progress, skipping...
🚀 API /local-dev-plan/upload-laravel called at: 2025-01-03T...
🚀 API /local-dev-plan/upload-laravel called at: 2025-01-03T...  ← API เรียกซ้ำ!
```

## การวิเคราะห์ปัญหา

### ถ้าเห็น customUpload เรียก 2 ครั้ง:
- ปัญหาอยู่ที่ Frontend (Ant Design Upload component)
- อาจมี event listener หลายตัว
- หรือ Form.Item เรียก onChange หลายครั้ง

### ถ้าเห็น API เรียก 2 ครั้ง:
- ปัญหาอยู่ที่การส่ง request ซ้ำ
- อาจมี network retry หรือ double click

### ถ้าเห็น Database insert 2 ครั้ง:
- ปัญหาอยู่ที่ Backend logic
- อาจมี transaction ที่ไม่ถูกต้อง

## ขั้นตอนถัดไป

หลังจากทดสอบแล้ว กรุณาแจ้งผลลัพธ์:
1. **จำนวนครั้งที่เห็น logs แต่ละประเภท**
2. **ลำดับของ logs ที่ปรากฏ**
3. **จำนวน records ที่เกิดขึ้นใน database**

ข้อมูลนี้จะช่วยให้ผมระบุจุดที่เกิดปัญหาได้แม่นยำขึ้น