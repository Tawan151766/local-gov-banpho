# People Management Admin Panel

หน้าจัดการข้อมูลบุคลากรสำหรับผู้ดูแลระบบ

## คุณสมบัติ

### การจัดการข้อมูลบุคลากร

- ✅ เพิ่มข้อมูลบุคลากรใหม่
- ✅ แก้ไขข้อมูลบุคลากร
- ✅ ลบข้อมูลบุคลากร
- ✅ ค้นหาและกรองข้อมูล
- ✅ Pagination สำหรับข้อมูลจำนวนมาก
- ✅ อัพโหลดรูปภาพบุคลากร
- ✅ แสดงตัวอย่างรูปภาพในฟอร์มและตาราง

### ข้อมูลที่จัดการได้

- ชื่อ-นามสกุล
- ตำแหน่ง
- หน่วยงาน (คณะผู้บริหาร, สภาเทศบาล, สำนักปลัดเทศบาล, กองคลัง, กองช่าง, กองการศึกษา, หน่วยตรวจสอบภายใน)
- หน่วยงานย่อย
- ประเภทตำแหน่ง (หัวหน้า, รอง/ผู้ช่วย, เจ้าหน้าที่, พนักงาน)
- เขต (สำหรับสภาเทศบาล)
- โทรศัพท์
- อีเมล
- ระดับตำแหน่ง
- ลำดับการแสดง
- รูปภาพ (รองรับการอัพโหลดไฟล์ PNG, JPG, JPEG, GIF, WebP, SVG)
- สถานะตำแหน่งว่าง
- สถานะการใช้งาน

### การกรองข้อมูล

- กรองตามหน่วยงาน
- กรองตามประเภทตำแหน่ง
- แสดงสถานะต่างๆ ด้วยสีและไอคอน

## การใช้งาน

### เข้าถึงหน้าจัดการ

```
/admin/people-management
```

### API Endpoints ที่ใช้

#### GET /api/people-management

- `admin=true` - เปิดใช้งาน admin mode
- `page=1` - หน้าที่ต้องการ
- `limit=10` - จำนวนรายการต่อหน้า
- `department=executive` - กรองตามหน่วยงาน
- `role_type=head` - กรองตามประเภทตำแหน่ง

#### POST /api/people-management

สร้างข้อมูลบุคลากรใหม่

#### PUT /api/people-management?id={id}

แก้ไขข้อมูลบุคลากร

#### DELETE /api/people-management?id={id}

ลบข้อมูลบุคลากร

## โครงสร้างข้อมูล

```javascript
{
  full_name: "ชื่อ-นามสกุล",
  position: "ตำแหน่ง",
  phone: "เบอร์โทรศัพท์",
  email: "อีเมล",
  department: "หน่วยงาน", // executive, council, clerk, finance, engineering, education, audit
  sub_department: "หน่วยงานย่อย",
  role_type: "ประเภทตำแหน่ง", // head, deputy, staff, worker
  level: 1, // ระดับตำแหน่ง
  sort_order: 1, // ลำดับการแสดง
  district: "เขต", // สำหรับสภาเทศบาล
  img: "/image/placeholder-person.svg", // รูปภาพ
  is_empty: false, // ตำแหน่งว่าง
  is_active: true // สถานะการใช้งาน
}
```

## การแสดงผลในหน้าเว็บ

ข้อมูลที่จัดการในหน้านี้จะถูกแสดงในหน้า Personnel Organization Chart ที่:

- `/personnel` - แสดงโครงสร้างองค์กร
- API endpoint: `/api/people-management` (โหมดปกติ)

## การอัพโหลดรูปภาพ

### คุณสมบัติการอัพโหลด

- รองรับไฟล์: PNG, JPG, JPEG, GIF, WebP, SVG
- ขนาดไฟล์สูงสุด: 5MB
- แสดงตัวอย่างรูปภาพแบบ real-time
- รูปภาพจะถูกแสดงในรูปแบบวงกลมทั้งในฟอร์มและตาราง

### API Endpoint สำหรับอัพโหลด

```
POST /api/manual/upload-laravel
```

### การแสดงรูปภาพ

- รูปภาพจะถูกเก็บใน Laravel storage
- URL รูปภาพ: `https://banpho.sosmartsolution.com/storage{image_path}`
- หากไม่มีรูปภาพจะใช้ placeholder: `/image/placeholder-person.svg`

## หมายเหตุ

- ข้อมูลจะถูกจัดเรียงตาม level, sort_order และ id
- สามารถจัดการข้อมูลทั้งที่เปิดใช้งานและปิดใช้งาน
- รองรับการแสดงตำแหน่งว่างด้วยการตั้งค่า is_empty = true
- ข้อมูลจะถูก sync กับหน้าแสดงโครงสร้างองค์กรโดยอัตโนมัติ
- รูปภาพที่อัพโหลดจะถูกแสดงในหน้า PersonnelOrgChart โดยอัตโนมัติ
