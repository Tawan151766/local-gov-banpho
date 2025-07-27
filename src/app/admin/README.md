# Admin Panel - องค์การบริหารส่วนตำบลบ้านโพธิ์

## การเข้าถึง Admin Panel

1. **จากหน้าหลัก**: คลิกที่ปุ่ม floating admin (ไอคอนเฟือง) ที่มุมขวาล่าง
2. **URL โดยตรง**: เข้าไปที่ `/admin`

## โครงสร้าง Tabs

### 1. Dashboard
- ภาพรวมของระบบ
- สถิติและข้อมูลสำคัญ

### 2. User Management
- จัดการผู้ใช้งานในระบบ
- เพิ่ม/แก้ไข/ลบผู้ใช้งาน

### 3. Content Management
- จัดการเนื้อหาและข่าวสาร
- เพิ่ม/แก้ไข/ลบเนื้อหา

### 4. Settings
- ตั้งค่าระบบทั่วไป
- การกำหนดค่าต่างๆ

### 5. New Module
- พื้นที่สำหรับทดสอบและเพิ่ม module ใหม่
- Template สำหรับการพัฒนา module

## การเพิ่ม Module ใหม่

### วิธีการเพิ่ม Tab ใหม่:

1. เปิดไฟล์ `src/app/admin/page.js`
2. เพิ่ม item ใหม่ใน `tabItems` array:

```javascript
{
  key: 'unique-key',
  label: (
    <span>
      <IconComponent />
      ชื่อ Tab
    </span>
  ),
  children: (
    <ModuleTemplate
      title="ชื่อ Module"
      description="คำอธิบาย Module"
      onAdd={handleFunction}
    >
      {/* เนื้อหา Module */}
    </ModuleTemplate>
  ),
}
```

### การใช้ ModuleTemplate:

```javascript
import ModuleTemplate from './components/ModuleTemplate';

<ModuleTemplate
  title="ชื่อ Module"
  description="คำอธิบาย"
  onAdd={() => console.log('เพิ่มข้อมูล')}
  onEdit={() => console.log('แก้ไขข้อมูล')}
  onDelete={() => console.log('ลบข้อมูล')}
>
  {/* เนื้อหาของ Module */}
</ModuleTemplate>
```

## Dependencies

- **antd**: UI Component Library
- **@ant-design/icons**: Icon Library
- **Next.js**: React Framework

## การพัฒนาต่อ

1. เพิ่ม authentication/authorization
2. เชื่อมต่อกับ database
3. สร้าง API endpoints
4. เพิ่ม form validation
5. เพิ่ม data tables และ pagination