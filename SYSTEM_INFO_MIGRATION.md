# System Info Migration Guide

## สรุปไฟล์ที่มีข้อมูล Hard Code

### 1. ไฟล์ที่ได้ปรับปรุงแล้ว ✅

#### `src/app/component/LandingPage/Footer.jsx`
- **ข้อมูลที่ปรับ:** อีเมล
- **วิธีการ:** ใช้ `useSystemInfoValues` hook
- **Keys ที่ใช้:** `email`

#### `src/app/contact/page.jsx`
- **ข้อมูลที่ปรับ:** ที่อยู่, เบอร์โทร, แฟกซ์, อีเมล
- **วิธีการ:** ใช้ `useSystemInfoValues` hook
- **Keys ที่ใช้:** `address`, `phone`, `fax`, `email`

### 2. ไฟล์ที่ยังต้องปรับปรุง ⏳

#### `src/app/component/LandingPage/ManagementSection.jsx`
- **ข้อมูลที่ต้องปรับ:** เบอร์โทรของผู้บริหาร
- **ตำแหน่ง:** บรรทัด 288, 295, 302, 309, 326, 334, 342, 350, 358, 365
- **แนะนำ:** ย้ายข้อมูลผู้บริหารไปเก็บในตาราง `PeopleManagement` แทน

#### `src/app/citizen/complaints/page.jsx`
- **ข้อมูลที่ต้องปรับ:** เบอร์โทร, อีเมล, เวลาทำการ
- **ตำแหน่ง:** บรรทัด 230-232
- **Keys ที่แนะนำ:** `phone`, `email`, `working_hours`

#### `src/app/citizen/work-process/page.jsx`
- **ข้อมูลที่ต้องปรับ:** อีเมล, เวลาทำการ
- **ตำแหน่ง:** บรรทัด 527, 532-533
- **Keys ที่แนะนำ:** `email`, `working_hours`

#### `src/app/citizen/documents/page.jsx`
- **ข้อมูลที่ต้องปรับ:** เวลาทำการ
- **ตำแหน่ง:** บรรทัด 293
- **Keys ที่แนะนำ:** `working_hours`

#### `src/app/integrity/page.jsx`
- **ข้อมูลที่ต้องปรับ:** เบอร์โทร, อีเมล
- **ตำแหน่ง:** บรรทัด 200-201, 209-210
- **Keys ที่แนะนำ:** `phone`, `email`

#### `src/app/vision/page.jsx`
- **ข้อมูลที่ต้องปรับ:** ชื่อเทศบาล
- **ตำแหน่ง:** บรรทัด 126, 162, 319
- **Keys ที่แนะนำ:** `organization_name`

#### `src/app/simple-infomation/` (หลายไฟล์)
- **ข้อมูลที่ต้องปรับ:** ชื่อเทศบาล, ข้อมูลทั่วไป
- **ไฟล์:** `infrastructure/page.jsx`, `general-overview/page.jsx`, `economic-status/page.jsx`, `demographics/page.jsx`
- **Keys ที่แนะนำ:** `organization_name`

#### `src/components/SubmitCommentModal.js`
- **ข้อมูลที่ต้องปรับ:** ชื่อเทศบาล
- **ตำแหน่ง:** บรรทัด 202
- **Keys ที่แนะนำ:** `organization_name`

### 3. วิธีการปรับปรุงไฟล์

#### ขั้นตอนที่ 1: เพิ่ม Import
```javascript
import { useSystemInfoValues } from "@/hooks/useSystemInfo";
```

#### ขั้นตอนที่ 2: ใช้ Hook ในคอมโพเนนต์
```javascript
export default function YourComponent() {
  const { values: systemInfo, loading } = useSystemInfoValues([
    'organization_name',
    'phone', 
    'email',
    'address',
    'fax',
    'working_hours'
  ]);

  // ใช้ข้อมูล
  return (
    <div>
      {loading ? 'กำลังโหลด...' : systemInfo.phone}
    </div>
  );
}
```

#### ขั้นตอนที่ 3: แทนที่ Hard Code
```javascript
// เดิม
<span>038-123-456</span>

// ใหม่
<span>{loading ? 'กำลังโหลด...' : (systemInfo.phone || '038-123-456')}</span>
```

### 4. System Info Keys ที่มีอยู่

| Key | ชื่อแสดงผล | ค่าเริ่มต้น |
|-----|------------|-------------|
| `organization_name` | ชื่อหน่วยงาน | เทศบาลตำบลบ้านโพธิ์ |
| `phone` | เบอร์โทรศัพท์ | 038-123-456 |
| `email` | อีเมล | contact@banpho.go.th |
| `address` | ที่อยู่ | 123 หมู่ 1 ตำบลบ้านโพธิ์... |
| `fax` | โทรสาร | 038-123-457 |
| `website` | เว็บไซต์ | https://banpho.go.th |
| `facebook` | Facebook | https://facebook.com/banpho.official |
| `line_id` | Line ID | @banpho_official |
| `working_hours` | เวลาทำการ | จันทร์ - ศุกร์ 08:30 - 16:30 น. |
| `mayor_name` | ชื่อนายกเทศมนตรี | นายสมชาย ใจดี |

### 5. ประโยชน์ของการใช้ System Info

✅ **จัดการข้อมูลแบบรวมศูนย์** - แก้ไขที่เดียว ใช้ได้ทุกที่  
✅ **ลดข้อผิดพลาด** - ไม่ต้องแก้ไขหลายไฟล์  
✅ **ง่ายต่อการบำรุงรักษา** - อัพเดทผ่านหน้า Admin  
✅ **มีระบบ Cache** - โหลดเร็ว ลดการเรียก API  
✅ **มี Fallback** - แสดงค่าเริ่มต้นเมื่อโหลดไม่ได้  

### 6. การใช้งานในหน้า Admin

1. เข้าไปที่หน้า Admin
2. เลือกเมนู "ข้อมูลระบบ" ในกลุ่ม "การจัดการพื้นฐาน"
3. กดปุ่ม "เพิ่มข้อมูลเริ่มต้น" (ถ้ายังไม่มีข้อมูล)
4. แก้ไขข้อมูลตามต้องการ
5. ข้อมูลจะอัพเดทในทุกหน้าที่ใช้งานทันที

### 7. การทดสอบ

หลังจากปรับปรุงไฟล์แล้ว ให้ทดสอบ:
1. โหลดหน้าเว็บดูว่าข้อมูลแสดงถูกต้อง
2. แก้ไขข้อมูลในหน้า Admin
3. รีเฟรชหน้าเว็บดูว่าข้อมูลเปลี่ยนตาม
4. ทดสอบกรณีที่ API ล่ม (ควรแสดงค่า fallback)

---

**หมายเหตุ:** ไฟล์ที่มี ✅ คือได้ปรับปรุงแล้ว ส่วนที่มี ⏳ คือยังต้องปรับปรุง