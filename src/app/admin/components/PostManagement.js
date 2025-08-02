"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  Image,
  Card,
  Space,
  Popconfirm,
  Tag,
  Tabs,
  Row,
  Col,
  Typography,
  Descriptions,
  Divider,
  App,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  FileImageOutlined,
  VideoCameraOutlined,
  FilePdfOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { postTypesAPI, postDetailsAPI } from "@/lib/api";
import { uploadFileToServer } from "@/lib/fileUploadUtils";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Title } = Typography;

// Enhanced File Upload Component for Posts
const PostFileUpload = ({ 
  value = [],
  onChange,
  fileType = 'image', // 'image', 'video', 'pdf'
  maxCount = 8,
  accept,
  placeholder = "อัปโหลดไฟล์",
  disabled = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState(value || []);
  const [uploadProgress, setUploadProgress] = useState({});
  const { message } = App.useApp();

  useEffect(() => {
    setFileList(value || []);
  }, [value]);

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf': return <FilePdfOutlined style={{ color: '#ff4d4f', fontSize: 16 }} />;
      case 'mp4':
      case 'avi':
      case 'mov': return <VideoCameraOutlined style={{ color: '#722ed1', fontSize: 16 }} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp': return <FileImageOutlined style={{ color: '#52c41a', fontSize: 16 }} />;
      default: return <UploadOutlined style={{ color: '#8c8c8c', fontSize: 16 }} />;
    }
  };

  const handleUpload = async (file) => {
    try {
      setUploading(true);
      setUploadProgress(prev => ({ ...prev, [file.uid]: 0 }));

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[file.uid] || 0;
          if (currentProgress >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return { ...prev, [file.uid]: currentProgress + 10 };
        });
      }, 200);

      const result = await uploadFileToServer(file);

      clearInterval(progressInterval);
      setUploadProgress(prev => ({ ...prev, [file.uid]: 100 }));

      if (result.success) {
        const uploadedFile = {
          uid: file.uid,
          name: file.name,
          status: "done",
          url: result.url,
          path: result.path,
          type: result.type,
          size: result.size
        };

        const newFileList = [...fileList.filter(f => f.uid !== file.uid), uploadedFile];
        setFileList(newFileList);
        
        if (onChange) {
          onChange(newFileList);
        }

        message.success(`อัปโหลด ${file.name} สำเร็จ`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      message.error(`เกิดข้อผิดพลาดในการอัปโหลด ${file.name}: ${error.message}`);
      
      // Remove failed file from list
      const newFileList = fileList.filter(f => f.uid !== file.uid);
      setFileList(newFileList);
      if (onChange) {
        onChange(newFileList);
      }
    } finally {
      setUploading(false);
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[file.uid];
        return newProgress;
      });
    }
    return false; // Prevent default upload
  };

  const handleRemove = (file) => {
    const newFileList = fileList.filter(item => item.uid !== file.uid);
    setFileList(newFileList);
    
    if (onChange) {
      onChange(newFileList);
    }
  };

  const handleChange = ({ fileList: newFileList }) => {
    // Update file list but don't trigger onChange for uploading files
    const processedList = newFileList.map(file => {
      if (file.status === 'uploading' && uploadProgress[file.uid] !== undefined) {
        return {
          ...file,
          percent: uploadProgress[file.uid]
        };
      }
      return file;
    });
    setFileList(processedList);
  };

  const uploadButton = (
    <div>
      {uploading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>
        {uploading ? 'กำลังอัปโหลด...' : 'อัปโหลด'}
      </div>
    </div>
  );

  if (fileType === 'image') {
    return (
      <div>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onChange={handleChange}
          onRemove={handleRemove}
          beforeUpload={() => false}
          customRequest={({ file }) => handleUpload(file)}
          accept={accept || "image/*"}
          multiple
          disabled={disabled || uploading}
          showUploadList={{
            showPreviewIcon: true,
            showRemoveIcon: true,
            showDownloadIcon: false,
          }}
        >
          {fileList.length >= maxCount ? null : uploadButton}
        </Upload>
        <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
          รองรับไฟล์: JPG, PNG, GIF, WebP | ขนาดสูงสุด: 5MB | สูงสุด {maxCount} ไฟล์
        </div>
      </div>
    );
  }

  return (
    <div>
      <Upload
        fileList={fileList}
        onChange={handleChange}
        onRemove={handleRemove}
        beforeUpload={() => false}
        customRequest={({ file }) => handleUpload(file)}
        accept={accept}
        multiple
        disabled={disabled || uploading}
        showUploadList={{
          showPreviewIcon: false,
          showRemoveIcon: true,
          showDownloadIcon: true,
        }}
      >
        <Button 
          icon={uploading ? <LoadingOutlined /> : getFileIcon(fileType)} 
          loading={uploading}
          disabled={disabled}
          style={{ width: '100%' }}
        >
          {uploading ? 'กำลังอัปโหลด...' : placeholder}
        </Button>
      </Upload>
      <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
        {fileType === 'video' && 'รองรับไฟล์: MP4, AVI, MOV | ขนาดสูงสุด: 50MB'}
        {fileType === 'pdf' && 'รองรับไฟล์: PDF | ขนาดสูงสุด: 10MB'}
      </div>
    </div>
  );
};

export default function PostManagement() {
  const { message } = App.useApp();
  const [postTypes, setPostTypes] = useState([]);
  const [postDetails, setPostDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [activeTab, setActiveTab] = useState("types");
  const [form] = Form.useForm();
  const [detailForm] = Form.useForm();

  // Pagination states
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [detailPagination, setDetailPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Search states
  const [searchText, setSearchText] = useState("");
  const [selectedPostType, setSelectedPostType] = useState(null);

  // File upload states
  const [photoFileList, setPhotoFileList] = useState([]);
  const [videoFileList, setVideoFileList] = useState([]);
  const [pdfFileList, setPdfFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  // ✅ แก้ไข: เพิ่ม dependency ที่ครบถ้วน
  const fetchPostTypes = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching post types with params:', {
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchText,
      });

      const response = await postTypesAPI.getPostTypes({
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchText,
      });

      console.log('Post types response:', response);

      if (response.success) {
        setPostTypes(response.data);
        setPagination((prev) => ({
          ...prev,
          total: response.pagination?.total || 0,
        }));
      } else {
        console.error('Post types API error:', response.error);
        message.error(response.error || "เกิดข้อผิดพลาดในการโหลดข้อมูลประเภทโพสต์");
      }
    } catch (error) {
      console.error('Fetch post types error:', error);
      message.error("เกิดข้อผิดพลาดในการโหลดข้อมูลประเภทโพสต์");
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, searchText, message]);

  // ✅ แก้ไข: เพิ่ม dependency ที่ครบถ้วน
  const fetchPostDetails = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching post details with params:', {
        page: detailPagination.current,
        limit: detailPagination.pageSize,
        search: searchText,
        postTypeId: selectedPostType,
        withMedia: true,
      });

      const response = await postDetailsAPI.getPostDetails({
        page: detailPagination.current,
        limit: detailPagination.pageSize,
        search: searchText,
        postTypeId: selectedPostType,
        withMedia: true,
      });

      console.log('Post details response:', response);

      if (response.success) {
        setPostDetails(response.data);
        setDetailPagination((prev) => ({
          ...prev,
          total: response.pagination?.total || 0,
        }));
      } else {
        console.error('Post details API error:', response.error);
        message.error(response.error || "เกิดข้อผิดพลาดในการโหลดข้อมูลโพสต์");
      }
    } catch (error) {
      console.error('Fetch post details error:', error);
      message.error("เกิดข้อผิดพลาดในการโหลดข้อมูลโพสต์");
    } finally {
      setLoading(false);
    }
  }, [detailPagination.current, detailPagination.pageSize, searchText, selectedPostType, message]);

  // ✅ Initial load - โหลดประเภทโพสต์ตั้งแต่แรก
  useEffect(() => {
    fetchPostTypes();
  }, [fetchPostTypes]);

  // ✅ แก้ไข: ใช้ timeout เพื่อป้องกัน frequent API calls
  useEffect(() => {
    if (activeTab === "types") {
      const timeoutId = setTimeout(() => {
        fetchPostTypes();
      }, 300); // รอ 300ms ก่อนเรียก API

      return () => clearTimeout(timeoutId);
    }
  }, [activeTab, searchText]);

  // ✅ แก้ไข: แยก pagination effect สำหรับ post types
  useEffect(() => {
    if (activeTab === "types") {
      fetchPostTypes();
    }
  }, [activeTab, fetchPostTypes, pagination.current, pagination.pageSize]);

  // ✅ แก้ไข: ใช้ timeout เพื่อป้องกัน frequent API calls
  useEffect(() => {
    if (activeTab === "details") {
      const timeoutId = setTimeout(() => {
        fetchPostDetails();
      }, 300); // รอ 300ms ก่อนเรียก API

      return () => clearTimeout(timeoutId);
    }
  }, [activeTab, searchText, selectedPostType]);

  // ✅ แก้ไข: แยก pagination effect สำหรับ post details
  useEffect(() => {
    if (activeTab === "details") {
      fetchPostDetails();
    }
  }, [activeTab, detailPagination.current, detailPagination.pageSize, fetchPostDetails]);

  // Post Types Management
  const handleCreatePostType = () => {
    setEditingRecord(null);
    setModalVisible(true);
    form.resetFields();
  };

  const handleEditPostType = (record) => {
    setEditingRecord(record);
    setModalVisible(true);
    form.setFieldsValue(record);
  };

  const handleDeletePostType = async (id) => {
    try {
      const response = await postTypesAPI.deletePostType(id);
      if (response.success) {
        message.success("ลบประเภทโพสต์สำเร็จ");
        fetchPostTypes();
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการลบประเภทโพสต์");
    }
  };

  const handleSubmitPostType = async (values) => {
    try {
      setLoading(true);
      let response;

      if (editingRecord) {
        response = await postTypesAPI.updatePostType(editingRecord.id, values);
      } else {
        response = await postTypesAPI.createPostType(values);
      }

      if (response.success) {
        message.success(
          editingRecord ? "แก้ไขประเภทโพสต์สำเร็จ" : "เพิ่มประเภทโพสต์สำเร็จ"
        );
        setModalVisible(false);
        fetchPostTypes();
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  // Post Details Management
  const handleCreatePostDetail = () => {
    setEditingRecord(null);
    setDetailModalVisible(true);
    detailForm.resetFields();
    setPhotoFileList([]);
    setVideoFileList([]);
    setPdfFileList([]);
  };

  const handleEditPostDetail = (record) => {
    setEditingRecord(record);
    setDetailModalVisible(true);
    detailForm.setFieldsValue({
      ...record,
      date: record.date ? dayjs(record.date) : null,
    });

    // Set existing files with enhanced metadata
    setPhotoFileList(
      record.photos?.map((photo) => ({
        uid: photo.id,
        name: photo.post_photo_file.split('/').pop(),
        name: photo.post_photo_file.split('/').pop(),
        status: "done",
        url: `https://banpho.sosmartsolution.com/storage/${photo.post_photo_file}`,
        path: photo.post_photo_file,
        type: 'image'
        path: photo.post_photo_file,
        type: 'image'
      })) || []
    );

    setVideoFileList(
      record.videos?.map((video) => ({
        uid: video.id,
        name: video.post_video_file.split('/').pop(),
        name: video.post_video_file.split('/').pop(),
        status: "done",
        url: `https://banpho.sosmartsolution.com/storage/${video.post_video_file}`,
        path: video.post_video_file,
        type: 'video'
        path: video.post_video_file,
        type: 'video'
      })) || []
    );

    setPdfFileList(
      record.pdfs?.map((pdf) => ({
        uid: pdf.id,
        name: pdf.post_pdf_file.split('/').pop(),
        name: pdf.post_pdf_file.split('/').pop(),
        status: "done",
        url: `https://banpho.sosmartsolution.com/storage/${pdf.post_pdf_file}`,
        path: pdf.post_pdf_file,
        type: 'pdf'
        path: pdf.post_pdf_file,
        type: 'pdf'
      })) || []
    );
  };

  const handleViewPostDetail = (record) => {
    setSelectedRecord(record);
    setViewModalVisible(true);
  };

  const handleDeletePostDetail = async (id) => {
    try {
      const response = await postDetailsAPI.deletePostDetail(id);
      if (response.success) {
        message.success("ลบโพสต์สำเร็จ");
        fetchPostDetails();
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการลบโพสต์");
    }
  };

  // File upload handlers
  const handlePhotoListChange = (newFileList) => {
    setPhotoFileList(newFileList);
  };

  const handleVideoListChange = (newFileList) => {
    setVideoFileList(newFileList);
  };

  const handlePdfListChange = (newFileList) => {
    setPdfFileList(newFileList);
  const handlePhotoListChange = (newFileList) => {
    setPhotoFileList(newFileList);
  };

  const handleVideoListChange = (newFileList) => {
    setVideoFileList(newFileList);
  };

  const handlePdfListChange = (newFileList) => {
    setPdfFileList(newFileList);
  };

  const handleSubmitPostDetail = async (values) => {
    try {
      setLoading(true);

      // Validate that at least one field is filled
      if (!values.title_name?.trim()) {
        message.error("กรุณากรอกหัวข้อโพสต์");
        return;
      }

      // Prepare media data with better path handling
      const photos = photoFileList
        .filter((file) => file.status === "done" && file.path)
        .filter((file) => file.status === "done" && file.path)
        .map((file) => ({
          post_photo_file: file.path,
          post_photo_file: file.path,
          post_photo_status: "active",
        }));

      const videos = videoFileList
        .filter((file) => file.status === "done" && file.path)
        .filter((file) => file.status === "done" && file.path)
        .map((file) => ({
          post_video_file: file.path,
          post_video_file: file.path,
        }));

      const pdfs = pdfFileList
        .filter((file) => file.status === "done" && file.path)
        .filter((file) => file.status === "done" && file.path)
        .map((file) => ({
          post_pdf_file: file.path,
          post_pdf_file: file.path,
        }));

      const postData = {
        ...values,
        date: values.date ? values.date.format("YYYY-MM-DD") : null,
        photos,
        videos,
        pdfs,
      };

      console.log("Submitting post data:", postData);

      let response;
      if (editingRecord) {
        response = await postDetailsAPI.updatePostDetail(
          editingRecord.id,
          postData
        );
      } else {
        response = await postDetailsAPI.createPostDetail(postData);
      }

      if (response.success) {
        message.success(
          editingRecord ? "แก้ไขโพสต์สำเร็จ" : "เพิ่มโพสต์สำเร็จ"
        );
        setDetailModalVisible(false);
        
        // Reset form and file lists
        detailForm.resetFields();
        setPhotoFileList([]);
        setVideoFileList([]);
        setPdfFileList([]);
        
        fetchPostDetails();
      } else {
        throw new Error(response.error || 'Failed to save post');
      } else {
        throw new Error(response.error || 'Failed to save post');
      }
    } catch (error) {
      console.error("Error submitting post detail:", error);
      message.error(`เกิดข้อผิดพลาดในการบันทึกข้อมูล: ${error.message}`);
      message.error(`เกิดข้อผิดพลาดในการบันทึกข้อมูล: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Table columns for post types
  const postTypeColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "ชื่อประเภท",
      dataIndex: "type_name",
      key: "type_name",
    },
    {
      title: "วันที่สร้าง",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "การจัดการ",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditPostType(record)}
          >
            แก้ไข
          </Button>
          <Popconfirm
            title="คุณแน่ใจหรือไม่ที่จะลบประเภทโพสต์นี้?"
            onConfirm={() => handleDeletePostType(record.id)}
            okText="ใช่"
            cancelText="ไม่"
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              ลบ
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Table columns for post details
  const postDetailColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "ประเภท",
      dataIndex: "type_name",
      key: "type_name",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "หัวข้อ",
      dataIndex: "title_name",
      key: "title_name",
      ellipsis: true,
    },
    {
      title: "วันที่",
      dataIndex: "date",
      key: "date",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "สื่อ",
      key: "media",
      render: (_, record) => (
        <Space>
          {record.photos?.length > 0 && (
            <Tag icon={<FileImageOutlined />} color="green">
              รูป {record.photos.length}
            </Tag>
          )}
          {record.videos?.length > 0 && (
            <Tag icon={<VideoCameraOutlined />} color="red">
              วิดีโอ {record.videos.length}
            </Tag>
          )}
          {record.pdfs?.length > 0 && (
            <Tag icon={<FilePdfOutlined />} color="orange">
              PDF {record.pdfs.length}
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: "การจัดการ",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewPostDetail(record)}
          >
            ดู
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditPostDetail(record)}
          >
            แก้ไข
          </Button>
          <Popconfirm
            title="คุณแน่ใจหรือไม่ที่จะลบโพสต์นี้?"
            onConfirm={() => handleDeletePostDetail(record.id)}
            okText="ใช่"
            cancelText="ไม่"
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              ลบ
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const tabItems = [
    {
      key: "types",
      label: "ประเภทโพสต์",
      children: (
        <Card>
          <div className="mb-4 flex justify-between items-center">
            <Space>
              <Input.Search
                placeholder="ค้นหาประเภทโพสต์..."
                allowClear
                onSearch={handleSearch}
                style={{ width: 300 }}
              />
            </Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreatePostType}
            >
              เพิ่มประเภทโพสต์
            </Button>
          </div>

          <Table
            columns={postTypeColumns}
            dataSource={postTypes}
            rowKey="id"
            loading={loading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              onChange: (page, pageSize) => {
                setPagination((prev) => ({
                  ...prev,
                  current: page,
                  pageSize,
                }));
              },
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} จาก ${total} รายการ`,
            }}
          />
        </Card>
      ),
    },
    {
      key: "details",
      label: "โพสต์และเนื้อหา",
      children: (
        <Card>
          <div className="mb-4 flex justify-between items-center">
            <Space>
              <Input.Search
                placeholder="ค้นหาโพสต์..."
                allowClear
                onSearch={handleSearch}
                style={{ width: 300 }}
              />
              <Select
                placeholder="เลือกประเภทโพสต์"
                allowClear
                style={{ width: 200 }}
                onChange={handlePostTypeFilter}
                value={selectedPostType}
              >
                {postTypes.map((type) => (
                  <Select.Option key={type.id} value={type.id}>
                    {type.type_name}
                  </Select.Option>
                ))}
              </Select>
            </Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreatePostDetail}
            >
              เพิ่มโพสต์
            </Button>
          </div>

          <Table
            columns={postDetailColumns}
            dataSource={postDetails}
            rowKey="id"
            loading={loading}
            pagination={{
              current: detailPagination.current,
              pageSize: detailPagination.pageSize,
              total: detailPagination.total,
              onChange: (page, pageSize) => {
                setDetailPagination((prev) => ({
                  ...prev,
                  current: page,
                  pageSize,
                }));
              },
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} จาก ${total} รายการ`,
            }}
          />
        </Card>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Title level={2}>จัดการโพสต์และเนื้อหา</Title>
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      
      {/* Post Type Modal */}
      <Modal
        title={editingRecord ? "แก้ไขประเภทโพสต์" : "เพิ่มประเภทโพสต์"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmitPostType}>
          <Form.Item
            name="type_name"
            label="ชื่อประเภทโพสต์"
            rules={[{ required: true, message: "กรุณากรอกชื่อประเภทโพสต์" }]}
          >
            <Input placeholder="กรอกชื่อประเภทโพสต์" />
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={() => setModalVisible(false)}>ยกเลิก</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingRecord ? "บันทึกการแก้ไข" : "เพิ่มประเภทโพสต์"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Post Detail Modal */}
      <Modal
        title={editingRecord ? "แก้ไขโพสต์" : "เพิ่มโพสต์"}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={detailForm}
          layout="vertical"
          onFinish={handleSubmitPostDetail}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="post_type_id"
                label="ประเภทโพสต์"
                rules={[{ required: true, message: "กรุณาเลือกประเภทโพสต์" }]}
              >
                <Select placeholder="เลือกประเภทโพสต์">
                  {postTypes.map((type) => (
                    <Select.Option key={type.id} value={type.id}>
                      {type.type_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="date" label="วันที่">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="title_name"
            label="หัวข้อ"
            rules={[{ required: true, message: "กรุณากรอกหัวข้อ" }]}
          >
            <Input placeholder="กรอกหัวข้อโพสต์" />
          </Form.Item>

          <Form.Item name="topic_name" label="หัวข้อย่อย">
            <Input placeholder="กรอกหัวข้อย่อย (ถ้ามี)" />
          </Form.Item>

          <Form.Item name="details" label="รายละเอียด">
            <TextArea rows={4} placeholder="กรอกรายละเอียดโพสต์" />
          </Form.Item>

          <Divider>ไฟล์สื่อ</Divider>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="รูปภาพ">
                <PostFileUpload
                  value={photoFileList}
                  onChange={handlePhotoListChange}
                  fileType="image"
                  maxCount={8}
                <PostFileUpload
                  value={photoFileList}
                  onChange={handlePhotoListChange}
                  fileType="image"
                  maxCount={8}
                  accept="image/*"
                  placeholder="อัปโหลดรูปภาพ"
                  disabled={uploading}
                />
                  placeholder="อัปโหลดรูปภาพ"
                  disabled={uploading}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="วิดีโอ">
                <PostFileUpload
                  value={videoFileList}
                  onChange={handleVideoListChange}
                  fileType="video"
                  maxCount={5}
                <PostFileUpload
                  value={videoFileList}
                  onChange={handleVideoListChange}
                  fileType="video"
                  maxCount={5}
                  accept="video/*"
                  placeholder="อัปโหลดวิดีโอ"
                  disabled={uploading}
                />
                  placeholder="อัปโหลดวิดีโอ"
                  disabled={uploading}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="ไฟล์ PDF">
                <PostFileUpload
                  value={pdfFileList}
                  onChange={handlePdfListChange}
                  fileType="pdf"
                  maxCount={10}
                <PostFileUpload
                  value={pdfFileList}
                  onChange={handlePdfListChange}
                  fileType="pdf"
                  maxCount={10}
                  accept=".pdf"
                  placeholder="อัปโหลด PDF"
                  disabled={uploading}
                />
                  placeholder="อัปโหลด PDF"
                  disabled={uploading}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={() => setDetailModalVisible(false)}>
                ยกเลิก
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading || uploading}
              >
                {editingRecord ? "บันทึกการแก้ไข" : "เพิ่มโพสต์"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Post Detail Modal */}
      <Modal
        title="รายละเอียดโพสต์"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            ปิด
          </Button>,
        ]}
        width={900}
      >
        {selectedRecord && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="ประเภท" span={1}>
                <Tag color="blue">{selectedRecord.type_name}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="วันที่" span={1}>
                {selectedRecord.date
                  ? dayjs(selectedRecord.date).format("DD/MM/YYYY")
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="หัวข้อ" span={2}>
                {selectedRecord.title_name}
              </Descriptions.Item>
              {selectedRecord.topic_name && (
                <Descriptions.Item label="หัวข้อย่อย" span={2}>
                  {selectedRecord.topic_name}
                </Descriptions.Item>
              )}
              {selectedRecord.details && (
                <Descriptions.Item label="รายละเอียด" span={2}>
                  <div style={{ whiteSpace: "pre-wrap" }}>
                    {selectedRecord.details}
                  </div>
                </Descriptions.Item>
              )}
            </Descriptions>

            {/* Media Display */}
            {(selectedRecord.photos?.length > 0 ||
              selectedRecord.videos?.length > 0 ||
              selectedRecord.pdfs?.length > 0) && (
              <>
                <Divider>ไฟล์สื่อ</Divider>

                {selectedRecord.photos?.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                  <div style={{ marginBottom: 16 }}>
                    <Title level={5}>
                      <FileImageOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                      <FileImageOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                      รูปภาพ ({selectedRecord.photos.length})
                    </Title>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8 }}>
                      {selectedRecord.photos.map((photo, index) => (
                        <Image
                          key={photo.id}
                          width={150}
                          height={150}
                          src={`https://banpho.sosmartsolution.com/storage/${photo.post_photo_file}`}
                          alt={`Photo ${index + 1}`}
                          style={{ objectFit: "cover", borderRadius: 6 }}
                          placeholder={
                            <div style={{ 
                              width: 150, 
                              height: 150, 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              backgroundColor: '#f5f5f5'
                            }}>
                              <LoadingOutlined />
                            </div>
                          }
                          style={{ objectFit: "cover", borderRadius: 6 }}
                          placeholder={
                            <div style={{ 
                              width: 150, 
                              height: 150, 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              backgroundColor: '#f5f5f5'
                            }}>
                              <LoadingOutlined />
                            </div>
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}

                {selectedRecord.videos?.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                  <div style={{ marginBottom: 16 }}>
                    <Title level={5}>
                      <VideoCameraOutlined style={{ marginRight: 8, color: '#722ed1' }} />
                      <VideoCameraOutlined style={{ marginRight: 8, color: '#722ed1' }} />
                      วิดีโอ ({selectedRecord.videos.length})
                    </Title>
                    <Space direction="vertical" style={{ width: '100%' }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      {selectedRecord.videos.map((video, index) => (
                        <Card 
                          key={video.id} 
                          size="small"
                          style={{ backgroundColor: '#fafafa' }}
                        >
                          <Space>
                            <VideoCameraOutlined style={{ color: '#722ed1', fontSize: 18 }} />
                            <div>
                              <div style={{ fontWeight: 500 }}>วิดีโอ {index + 1}</div>
                              <div style={{ fontSize: 12, color: '#666' }}>
                                {video.post_video_file.split('/').pop()}
                              </div>
                            </div>
                            <Button
                              type="link"
                              size="small"
                              onClick={() => window.open(`https://banpho.sosmartsolution.com/storage/${video.post_video_file}`, '_blank')}
                            >
                              ดูวิดีโอ
                            </Button>
                          </Space>
                        </Card>
                      ))}
                    </Space>
                        <Card 
                          key={video.id} 
                          size="small"
                          style={{ backgroundColor: '#fafafa' }}
                        >
                          <Space>
                            <VideoCameraOutlined style={{ color: '#722ed1', fontSize: 18 }} />
                            <div>
                              <div style={{ fontWeight: 500 }}>วิดีโอ {index + 1}</div>
                              <div style={{ fontSize: 12, color: '#666' }}>
                                {video.post_video_file.split('/').pop()}
                              </div>
                            </div>
                            <Button
                              type="link"
                              size="small"
                              onClick={() => window.open(`https://banpho.sosmartsolution.com/storage/${video.post_video_file}`, '_blank')}
                            >
                              ดูวิดีโอ
                            </Button>
                          </Space>
                        </Card>
                      ))}
                    </Space>
                  </div>
                )}

                {selectedRecord.pdfs?.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                  <div style={{ marginBottom: 16 }}>
                    <Title level={5}>
                      <FilePdfOutlined style={{ marginRight: 8, color: '#ff4d4f' }} />
                      <FilePdfOutlined style={{ marginRight: 8, color: '#ff4d4f' }} />
                      ไฟล์ PDF ({selectedRecord.pdfs.length})
                    </Title>
                    <Space direction="vertical" style={{ width: '100%' }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      {selectedRecord.pdfs.map((pdf, index) => (
                        <Card 
                          key={pdf.id} 
                          size="small"
                          style={{ backgroundColor: '#fafafa' }}
                        >
                          <Space>
                            <FilePdfOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />
                            <div>
                              <div style={{ fontWeight: 500 }}>PDF {index + 1}</div>
                              <div style={{ fontSize: 12, color: '#666' }}>
                                {pdf.post_pdf_file.split('/').pop()}
                              </div>
                            </div>
                            <Button
                              type="link"
                              size="small"
                              onClick={() => window.open(`https://banpho.sosmartsolution.com/storage/${pdf.post_pdf_file}`, '_blank')}
                            >
                              ดาวน์โหลด
                            </Button>
                          </Space>
                        </Card>
                      ))}
                    </Space>
                        <Card 
                          key={pdf.id} 
                          size="small"
                          style={{ backgroundColor: '#fafafa' }}
                        >
                          <Space>
                            <FilePdfOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />
                            <div>
                              <div style={{ fontWeight: 500 }}>PDF {index + 1}</div>
                              <div style={{ fontSize: 12, color: '#666' }}>
                                {pdf.post_pdf_file.split('/').pop()}
                              </div>
                            </div>
                            <Button
                              type="link"
                              size="small"
                              onClick={() => window.open(`https://banpho.sosmartsolution.com/storage/${pdf.post_pdf_file}`, '_blank')}
                            >
                              ดาวน์โหลด
                            </Button>
                          </Space>
                        </Card>
                      ))}
                    </Space>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}