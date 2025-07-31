# Post Management System Guide

## Overview

ระบบจัดการโพสต์และเนื้อหาสำหรับเว็บไซต์องค์การบริหารส่วนตำบลบ้านโพธิ์ รองรับการจัดการข่าวสาร กิจกรรม และเนื้อหาต่างๆ พร้อมระบบอัปโหลดสื่อ

## Database Schema

### 1. Post Types (`post_types`)

```sql
CREATE TABLE post_types (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  type_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL
);
```

### 2. Post Details (`post_details`)

```sql
CREATE TABLE post_details (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  post_type_id BIGINT UNSIGNED,
  date DATE,
  title_name TEXT,
  topic_name TEXT,
  details MEDIUMTEXT,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  FOREIGN KEY (post_type_id) REFERENCES post_types(id)
);
```

### 3. Post Media Tables

```sql
-- รูปภาพ
CREATE TABLE post_photos (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  post_detail_id BIGINT UNSIGNED NOT NULL,
  post_photo_file VARCHAR(255) NOT NULL,
  post_photo_status VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  FOREIGN KEY (post_detail_id) REFERENCES post_details(id) ON DELETE CASCADE
);

-- วิดีโอ
CREATE TABLE post_videos (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  post_detail_id BIGINT UNSIGNED NOT NULL,
  post_video_file VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  FOREIGN KEY (post_detail_id) REFERENCES post_details(id) ON DELETE CASCADE
);

-- PDF
CREATE TABLE post_pdfs (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  post_detail_id BIGINT UNSIGNED NOT NULL,
  post_pdf_file VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  FOREIGN KEY (post_detail_id) REFERENCES post_details(id) ON DELETE CASCADE
);
```

## API Endpoints

### Post Types API

#### GET `/api/post-types`

ดึงรายการประเภทโพสต์

**Query Parameters:**

- `page` (number): หน้าที่ต้องการ (default: 1)
- `limit` (number): จำนวนรายการต่อหน้า (default: 10)
- `search` (string): ค้นหาตามชื่อประเภท
- `withDetails` (boolean): รวมรายละเอียดโพสต์ด้วย

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type_name": "ข่าวประชาสัมพันธ์",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

#### POST `/api/post-types`

สร้างประเภทโพสต์ใหม่

**Request Body:**

```json
{
  "type_name": "ข่าวประชาสัมพันธ์"
}
```

#### GET `/api/post-types/[id]`

ดึงข้อมูลประเภทโพสต์เดียว

#### PUT `/api/post-types/[id]`

อัปเดตประเภทโพสต์

#### DELETE `/api/post-types/[id]`

ลบประเภทโพสต์

### Post Details API

#### GET `/api/post-details`

ดึงรายการโพสต์

**Query Parameters:**

- `page` (number): หน้าที่ต้องการ
- `limit` (number): จำนวนรายการต่อหน้า
- `search` (string): ค้นหาในหัวข้อ หัวข้อย่อย และรายละเอียด
- `postTypeId` (number): กรองตามประเภทโพสต์
- `withMedia` (boolean): รวมไฟล์สื่อด้วย

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "post_type_id": 1,
      "type_name": "ข่าวประชาสัมพันธ์",
      "date": "2024-01-15",
      "title_name": "ประกาศรับสมัครงานประจำ",
      "topic_name": "รับสมัครเจ้าหน้าที่",
      "details": "รายละเอียด...",
      "photos": [...],
      "videos": [...],
      "pdfs": [...]
    }
  ]
}
```

#### POST `/api/post-details`

สร้างโพสต์ใหม่

**Request Body:**

```json
{
  "post_type_id": 1,
  "date": "2024-01-15",
  "title_name": "หัวข้อโพสต์",
  "topic_name": "หัวข้อย่อย",
  "details": "รายละเอียดโพสต์",
  "photos": [
    {
      "post_photo_file": "images/photo1.jpg",
      "post_photo_status": "active"
    }
  ],
  "videos": [
    {
      "post_video_file": "videos/video1.mp4"
    }
  ],
  "pdfs": [
    {
      "post_pdf_file": "documents/doc1.pdf"
    }
  ]
}
```

#### GET `/api/post-details/[id]`

ดึงข้อมูลโพสต์เดียว

#### PUT `/api/post-details/[id]`

อัปเดตโพสต์

#### DELETE `/api/post-details/[id]`

ลบโพสต์ (รวมไฟล์สื่อทั้งหมด)

## Components

### 1. Admin Component (`PostManagement.js`)

**Features:**

- จัดการประเภทโพสต์และโพสต์
- อัปโหลดไฟล์สื่อ (รูปภาพ, วิดีโอ, PDF)
- ค้นหาและกรองข้อมูล
- แสดงตัวอย่างโพสต์
- Pagination

**Usage:**

```jsx
import PostManagement from './components/PostManagement';

// ใน admin page
case "post-management":
  return <PostManagement />;
```

### 2. Public Components

#### Posts Page (`posts/page.jsx`)

**Features:**

- แสดงรายการโพสต์แบบ Grid
- กรองตามประเภทโพสต์
- ค้นหาโพสต์
- แสดงรายละเอียดโพสต์ใน Modal
- แสดงไฟล์สื่อ
- Responsive design

**URL:** `/posts`

#### Latest Posts Component (`LatestPosts.jsx`)

**Features:**

- แสดงโพสต์ล่าสุดแบบ Grid
- กำหนดจำนวนโพสต์ที่แสดง
- แสดง/ซ่อนหัวข้อ
- ลิงก์ไปยังหน้าโพสต์ทั้งหมด

**Usage:**

```jsx
import { LatestPosts } from "@/app/component/Posts";

<LatestPosts limit={6} showTitle={true} />;
```

#### Featured Post Component (`FeaturedPost.jsx`)

**Features:**

- แสดงโพสต์เด่น (โพสต์ล่าสุด)
- Layout แบบ Hero Section
- แสดงรูปภาพขนาดใหญ่
- เหมาะสำหรับหน้าแรก

**Usage:**

```jsx
import { FeaturedPost } from "@/app/component/Posts";

<FeaturedPost />;
```

#### Post Carousel Component (`PostCarousel.jsx`)

**Features:**

- แสดงโพสต์แบบ Carousel/Slider
- Auto-play และ Navigation arrows
- Background image overlay
- กำหนดความสูงได้

**Usage:**

```jsx
import { PostCarousel } from "@/app/component/Posts";

<PostCarousel limit={5} height={400} />;
```

## File Upload Integration

### Admin Upload

ใช้ระบบ FileUpload ที่มีอยู่แล้ว:

```jsx
const handleFileUpload = async (file, fileType) => {
  const result = await uploadFileToServer(file);
  if (result.success) {
    const filePath = result.file_url.replace(
      "https://banpho.sosmartsolution.com/storage/",
      ""
    );
    return {
      uid: file.uid,
      name: file.name,
      status: "done",
      url: result.file_url,
      path: filePath,
    };
  }
};
```

### File Storage

- **API Endpoint:** `https://banpho.sosmartsolution.com/api/upload-file`
- **Storage Path:** `https://banpho.sosmartsolution.com/storage/[file_path]`
- **Database Storage:** เก็บเฉพาะ path (เช่น `images/photo1.jpg`)

## Sample Data

### Post Types

1. ข่าวประชาสัมพันธ์
2. กิจกรรมชุมชน
3. โครงการพัฒนา
4. ประกาศสำคัญ
5. ข่าวสารทั่วไป

### Seed Data API

**Endpoint:** `POST /api/seed-posts`

สร้างข้อมูลตัวอย่างสำหรับทดสอบระบบ

## File Structure

```
src/
├── app/
│   ├── admin/
│   │   └── components/
│   │       └── PostManagement.js      # Admin component
│   ├── component/
│   │   └── Posts/
│   │       ├── index.js               # Export all components
│   │       ├── LatestPosts.jsx        # Latest posts grid
│   │       ├── FeaturedPost.jsx       # Featured post hero
│   │       └── PostCarousel.jsx       # Posts carousel
│   ├── posts/
│   │   └── page.jsx                   # Public posts page
│   └── api/
│       ├── post-types/
│       │   ├── route.js               # GET, POST
│       │   └── [id]/
│       │       └── route.js           # GET, PUT, DELETE
│       ├── post-details/
│       │   ├── route.js               # GET, POST
│       │   └── [id]/
│       │       └── route.js           # GET, PUT, DELETE
│       └── seed-posts/
│           └── route.js               # POST (seed data)
├── lib/
│   ├── api.js                         # API functions
│   └── fileUploadUtils.js             # File upload utilities
└── docs/
    └── POST_MANAGEMENT_GUIDE.md       # This guide
```

## Usage Examples

### Admin - Create Post Type

```javascript
import { postTypesAPI } from "@/lib/api";

const createPostType = async () => {
  const response = await postTypesAPI.createPostType({
    type_name: "ข่าวประชาสัมพันธ์",
  });

  if (response.success) {
    console.log("Post type created:", response.data);
  }
};
```

### Admin - Create Post with Media

```javascript
import { postDetailsAPI } from "@/lib/api";

const createPost = async () => {
  const response = await postDetailsAPI.createPostDetail({
    post_type_id: 1,
    date: "2024-01-15",
    title_name: "หัวข้อข่าว",
    topic_name: "หัวข้อย่อย",
    details: "รายละเอียดข่าว",
    photos: [
      {
        post_photo_file: "images/news1.jpg",
        post_photo_status: "active",
      },
    ],
  });

  if (response.success) {
    console.log("Post created:", response.data);
  }
};
```

### Public - Fetch Posts

```javascript
import { postDetailsAPI } from "@/lib/api";

const fetchPosts = async () => {
  const response = await postDetailsAPI.getPostDetails({
    page: 1,
    limit: 12,
    withMedia: true,
  });

  if (response.success) {
    console.log("Posts:", response.data);
  }
};
```

### Using Post Components in Homepage

```jsx
import { LatestPosts, FeaturedPost, PostCarousel } from "@/app/component/Posts";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section with Carousel */}
      <section className="mb-12">
        <PostCarousel limit={5} height={500} />
      </section>

      {/* Featured Post */}
      <section className="mb-12">
        <FeaturedPost />
      </section>

      {/* Latest Posts */}
      <section className="mb-12">
        <LatestPosts limit={6} showTitle={true} />
      </section>
    </div>
  );
}
```

## Security Considerations

1. **File Upload Validation**

   - ตรวจสอบประเภทไฟล์
   - จำกัดขนาดไฟล์
   - Virus scanning

2. **Input Validation**

   - Sanitize HTML content
   - Validate required fields
   - SQL injection prevention

3. **Access Control**
   - Admin authentication required
   - Role-based permissions

## Performance Optimization

1. **Database Indexing**

   - Index on `post_type_id`
   - Index on `date`
   - Index on `created_at`

2. **File Optimization**

   - Image compression
   - CDN integration
   - Lazy loading

3. **Caching**
   - API response caching
   - Static file caching

## Future Enhancements

1. **Rich Text Editor** - WYSIWYG editor สำหรับรายละเอียดโพสต์
2. **SEO Optimization** - Meta tags และ structured data
3. **Social Media Integration** - แชร์โพสต์ไปยัง social media
4. **Comment System** - ระบบความคิดเห็น
5. **Newsletter** - ส่งข่าวสารทาง email
6. **Analytics** - สถิติการเข้าชมโพสต์
7. **Multi-language Support** - รองรับหลายภาษา
8. **Push Notifications** - แจ้งเตือนข่าวสารใหม่
