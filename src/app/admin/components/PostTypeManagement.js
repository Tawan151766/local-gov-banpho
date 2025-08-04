"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  Tag,
  Upload,
  Progress,
  Typography,
  App,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  FileTextOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;
const { Title, Text } = Typography;

// Post type configurations
const POST_TYPES = {
  "manual-management": {
    title: "คู่มือ",
    type: "คู่มือ",
    icon: <FileTextOutlined />,
    color: "blue",
  },
  "general-news": {
    title: "ข่าวสารทั่วไป",
    type: "ข่าวสารทั่วไป",
    icon: <FileTextOutlined />,
    color: "green",
  },
  "community-activities": {
    title: "กิจกรรมชุมชน",
    type: "กิจกรรมชุมชน",
    icon: <FileTextOutlined />,
    color: "orange",
  },
  "development-projects": {
    title: "โครงการพัฒนา",
    type: "โครงการพัฒนา",
    icon: <FileTextOutlined />,
    color: "purple",
  },
  "important-announcements": {
    title: "ประกาศสำคัญ",
    type: "ประกาศสำคัญ",
    icon: <FileTextOutlined />,
    color: "red",
  },
  "procurement-announcements": {
    title: "ประกาศจัดซื้อจัดจ้าง",
    type: "ประกาศจัดซื้อจัดจ้าง",
    icon: <FileTextOutlined />,
    color: "cyan",
  },
  "procurement-announcements-results": {
    title: "ผลประกาศจัดซื้อจัดจ้าง",
    type: "ผลประกาศจัดซื้อจัดจ้าง",
    icon: <FileTextOutlined />,
    color: "volcano",
  },
  "public-relations": {
    title: "ข่าวประชาสัมพันธ์",
    type: "ข่าวประชาสัมพันธ์",
    icon: <FileTextOutlined />,
    color: "magenta",
  },
  announcement: {
    title: "ป้ายประกาศ",
    type: "ป้ายประกาศ",
    icon: <SnippetsOutlined />,
    color: "geekblue",
  },
  activities: {
    title: "กิจกรรม",
    type: "กิจกรรม",
    icon: <FileTextOutlined />,
    color: "gold",
  },
};

export default function PostTypeManagement({ postType }) {
  const { notification } = App.useApp();

  // Data states
  const [posts, setPosts] = useState([]);

  // Add pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} จาก ${total} รายการ`,
  });

  // Loading states
  const [loading, setLoading] = useState(false);

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);

  // Form and editing states
  const [form] = Form.useForm();
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // File upload states
  const [uploadedFilePath, setUploadedFilePath] = useState(null);
  const [uploadedFileData, setUploadedFileData] = useState(null);

  const config = POST_TYPES[postType] || POST_TYPES["general-news"];

  const loadPosts = useCallback(
    async (page = 1, pageSize = 10) => {
      try {
        setLoading(true);
        console.log(
          "Loading posts for type:",
          config.type,
          "Page:",
          page,
          "PageSize:",
          pageSize
        );

        // Use pagination parameters from API
        const encodedType = encodeURIComponent(config.type);
        const response = await fetch(
          `/api/posts?type=${encodedType}&page=${page}&limit=${pageSize}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API response:", data);

        if (data.success) {
          setPosts(data.data || []);

          // Update pagination state with data from API
          setPagination((prev) => ({
            ...prev,
            current: data.pagination?.page || page,
            pageSize: data.pagination?.limit || pageSize,
            total: data.pagination?.total || 0,
          }));

          console.log(
            "Posts loaded:",
            data.data?.length || 0,
            "Total:",
            data.pagination?.total || 0
          );
        } else {
          console.error("API error:", data.error);
          notification.error({
            message: "เกิดข้อผิดพลาด",
            description: data.error || "เกิดข้อผิดพลาดในการโหลดข้อมูล",
          });
        }
      } catch (error) {
        console.error("Load posts error:", error);
        notification.error({
          message: "เกิดข้อผิดพลาด",
          description: "เกิดข้อผิดพลาดในการโหลดข้อมูลร",
        });
      } finally {
        setLoading(false);
      }
    },
    [config.type, notification]
  );

  useEffect(() => {
    loadPosts(1, 10);

    // Cleanup function to prevent memory leaks
    return () => {
      // Reset form when component unmounts
      if (form) {
        form.resetFields();
      }
    };
  }, [loadPosts, form]);

  // Handle table pagination change
  const handleTableChange = (paginationConfig) => {
    const { current, pageSize } = paginationConfig;
    loadPosts(current, pageSize);
  };

  const handleCreate = () => {
    setEditingRecord(null);
    setModalVisible(true);

    // Safely reset form
    try {
      if (form) {
        form.resetFields();
      }
    } catch (error) {
      console.warn("Error resetting form:", error);
    }

    setUploadedFilePath(null);
    setUploadedFileData(null);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setModalVisible(true);

    // Safely set form values
    try {
      if (form) {
        form.setFieldsValue(record);
      }
    } catch (error) {
      console.warn("Error setting form values:", error);
    }

    // Load existing file if any
    if (record.file_path) {
      setUploadedFilePath(record.file_path);
      setUploadedFileData({
        file_path: record.file_path,
        original_name: record.file_path.split("/").pop(),
      });
    } else {
      setUploadedFilePath(null);
      setUploadedFileData(null);
    }
  };

  const handleView = (record) => {
    setSelectedRecord(record);
    setViewModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        notification.success({
          message: "สำเร็จ",
          description: "ลบโพสต์สำเร็จ",
        });

        // Reload current page data
        loadPosts(pagination.current, pagination.pageSize);
      } else {
        notification.error({
          message: "เกิดข้อผิดพลาด",
          description: data.error || "เกิดข้อผิดพลาด",
        });
      }
    } catch (error) {
      notification.error({
        message: "เกิดข้อผิดพลาด",
        description: "เกิดข้อผิดพลาดในการลบข้อมูล",
      });
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      if (!values.title_name?.trim()) {
        notification.error({
          message: "ข้อมูลไม่ครบถ้วน",
          description: "กรุณากรอกชื่อโพสต์",
        });
        return;
      }

      // Add post type and file_path to values
      const submitData = {
        title_name: values.title_name,
        topic_name: values.topic_name,
        details: values.details,
        date: values.date,
        post_type: config.type,
        file_path: uploadedFileData?.file_path || null,
      };

      const url = editingRecord
        ? `/api/posts/${editingRecord.id}`
        : "/api/posts";
      const method = editingRecord ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        notification.success({
          message: "สำเร็จ",
          description: editingRecord ? "แก้ไขโพสต์สำเร็จ" : "เพิ่มโพสต์สำเร็จ",
        });
        setModalVisible(false);

        // Safely reset form
        try {
          if (form) {
            form.resetFields();
          }
        } catch (error) {
          console.warn("Error resetting form after submit:", error);
        }

        setUploadedFilePath(null);
        setUploadedFileData(null);

        // Reload current page data
        loadPosts(pagination.current, pagination.pageSize);
      } else {
        notification.error({
          message: "เกิดข้อผิดพลาด",
          description: data.error || "เกิดข้อผิดพลาด",
        });
      }
    } catch (error) {
      notification.error({
        message: "เกิดข้อผิดพลาด",
        description: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
      });
    } finally {
      setLoading(false);
    }
  };

  // File upload component
  const FileUpload = ({
    value,
    onChange,
    placeholder,
    accept,
    maxSize = 10,
  }) => {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleUpload = async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      try {
        setUploading(true);
        setUploadProgress(0);

        const response = await fetch("/api/manual/upload-laravel", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          setUploadProgress(100);
          onChange(result.data.file_path, result.data);
          notification.success({
            message: "สำเร็จ",
            description: "อัพโหลดไฟล์สำเร็จ",
          });
        } else {
          notification.error({
            message: "เกิดข้อผิดพลาด",
            description: result.error || "เกิดข้อผิดพลาดในการอัพโหลด",
          });
        }
      } catch (error) {
        notification.error({
          message: "เกิดข้อผิดพลาด",
          description: "เกิดข้อผิดพลาดในการอัพโหลด",
        });
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }

      return false; // Prevent default upload
    };

    const handleRemove = () => {
      onChange(null, null);
    };

    return (
      <div>
        <Space direction="vertical" style={{ width: "100%" }}>
          {!value && (
            <Upload
              beforeUpload={handleUpload}
              showUploadList={false}
              accept={accept}
              disabled={uploading}
            >
              <Button
                icon={<UploadOutlined />}
                loading={uploading}
                disabled={uploading}
              >
                {placeholder || "เลือกไฟล์"}
              </Button>
            </Upload>
          )}

          {value && (
            <div
              style={{
                padding: "8px 12px",
                border: "1px solid #d9d9d9",
                borderRadius: "6px",
                backgroundColor: "#fafafa",
              }}
            >
              <Space>
                <FileTextOutlined style={{ color: "#1890ff" }} />
                <Text>{value.split("/").pop()}</Text>
                <Button size="small" type="link" danger onClick={handleRemove}>
                  ลบ
                </Button>
              </Space>
            </div>
          )}

          {uploading && uploadProgress > 0 && (
            <Progress
              percent={uploadProgress}
              size="small"
              status={uploadProgress === 100 ? "success" : "active"}
            />
          )}

          <div>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              รองรับไฟล์: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX | ขนาดไฟล์สูงสุด:{" "}
              {maxSize}MB
            </Text>
          </div>
        </Space>
      </div>
    );
  };

  const columns = [
    {
      title: "ลำดับ",
      key: "index",
      width: 80,
      render: (_, record, index) => {
        // Calculate correct index based on pagination
        return (pagination.current - 1) * pagination.pageSize + index + 1;
      },
    },
    {
      title: "ชื่อโพสต์",
      dataIndex: "title_name",
      key: "title_name",
      ellipsis: true,
    },
    {
      title: "หัวข้อ",
      dataIndex: "topic_name",
      key: "topic_name",
      ellipsis: true,
    },
    {
      title: "วันที่",
      dataIndex: "date",
      key: "date",
      width: 120,
    },
    {
      title: "ไฟล์แนบ",
      key: "files",
      render: (_, record) => {
        return (
          <Space>
            {record.pdfs_count > 0 ? (
              <Tag icon={<FileTextOutlined />} color="green">
                {record.pdfs_count} ไฟล์
              </Tag>
            ) : (
              <Tag color="default">ไม่มีไฟล์</Tag>
            )}
          </Space>
        );
      },
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
            onClick={() => handleView(record)}
          >
            ดู
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            แก้ไข
          </Button>
          <Popconfirm
            title="คุณแน่ใจหรือไม่ที่จะลบโพสต์นี้?"
            onConfirm={() => handleDelete(record.id)}
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

  return (
    <div>
      <Card>
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <Title level={4} style={{ margin: 0 }}>
              {config.icon} {config.title}
            </Title>
            <Text type="secondary" style={{ fontSize: "14px" }}>
              ทั้งหมด {pagination.total} รายการ
            </Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            เพิ่ม{config.title}
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={posts}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={editingRecord ? `แก้ไข${config.title}` : `เพิ่ม${config.title}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="ชื่อโพสต์"
            name="title_name"
            rules={[{ required: true, message: "กรุณากรอกชื่อโพสต์" }]}
          >
            <Input placeholder="กรอกชื่อโพสต์" />
          </Form.Item>

          <Form.Item label="หัวข้อ" name="topic_name">
            <Input placeholder="กรอกหัวข้อ" />
          </Form.Item>

          <Form.Item label="วันที่" name="date">
            <Input type="date" />
          </Form.Item>

          <Form.Item label="รายละเอียด" name="details">
            <TextArea rows={6} placeholder="กรอกรายละเอียด" />
          </Form.Item>

          <Form.Item label="ไฟล์แนบ">
            <FileUpload
              value={uploadedFilePath}
              onChange={(filePath, fileData) => {
                setUploadedFilePath(filePath);
                setUploadedFileData(fileData);
              }}
              placeholder={`เลือกไฟล์${config.title}`}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.gif"
              maxSize={10}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingRecord ? "บันทึกการแก้ไข" : `เพิ่ม${config.title}`}
              </Button>
              <Button onClick={() => setModalVisible(false)}>ยกเลิก</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        title={`ดู${config.title}`}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            ปิด
          </Button>,
        ]}
        width={800}
      >
        {selectedRecord && (
          <div>
            <Title level={5}>{selectedRecord.title_name}</Title>
            <p>
              <strong>หัวข้อ:</strong>{" "}
              {selectedRecord.topic_name || "ไม่มีหัวข้อ"}
            </p>
            <p>
              <strong>วันที่:</strong> {selectedRecord.date}
            </p>
            <p>
              <strong>รายละเอียด:</strong>
            </p>
            <div
              style={{
                whiteSpace: "pre-wrap",
                backgroundColor: "#f5f5f5",
                padding: "12px",
                borderRadius: "4px",
              }}
            >
              {selectedRecord.details}
            </div>
            {selectedRecord.pdfs_count > 0 && (
              <p>
                <strong>ไฟล์แนบ:</strong> {selectedRecord.pdfs_count} ไฟล์
              </p>
            )}
            <p>
              <strong>แท็ก:</strong> {selectedRecord.tags}
            </p>
            <p>
              <strong>สถานะ:</strong>{" "}
              {selectedRecord.is_active ? "เปิดใช้งาน" : "ปิดใช้งาน"}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
