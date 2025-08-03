"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  App,
  Space,
  Popconfirm,
  Card,
  Typography,
  Tag,
  Row,
  Col,
  Select,
  Upload,
  Progress,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FolderOutlined,
  FileTextOutlined,
  EyeOutlined,
  UploadOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  FileOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// File Upload Component for Manual Files
const ManualFileUpload = ({
  value,
  onChange,
  manualId,
  accept = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx",
  maxSize = 10,
  placeholder = "เลือกไฟล์คู่มือ",
  description,
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { message } = App.useApp();

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return <FilePdfOutlined style={{ color: "#ff4d4f", fontSize: 16 }} />;
      case "doc":
      case "docx":
        return <FileWordOutlined style={{ color: "#1890ff", fontSize: 16 }} />;
      case "xls":
      case "xlsx":
        return <FileExcelOutlined style={{ color: "#52c41a", fontSize: 16 }} />;
      case "ppt":
      case "pptx":
        return <FileExcelOutlined style={{ color: "#fa8c16", fontSize: 16 }} />;
      default:
        return <FileOutlined style={{ color: "#8c8c8c", fontSize: 16 }} />;
    }
  };
  const customUpload = async ({ file, onProgress, onSuccess, onError }) => {
    console.log(
      "🔥 customUpload called with file:",
      file.name,
      "uploading state:",
      uploading
    );

    // ป้องกันการ upload ซ้ำ - ถ้ากำลัง upload อยู่แล้วให้หยุด
    if (uploading) {
      console.log("❌ Upload already in progress, skipping...");
      onError(new Error("Upload already in progress"));
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    if (manualId) {
      formData.append("manual_id", manualId);
    }
    if (description) {
      formData.append("description", description);
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch("/api/manual/upload-laravel", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      if (result.success) {
        console.log(
          "✅ Upload successful, calling callbacks...",
          result.data.id
        );
        if (onChange) {
          console.log("📝 Calling onChange with:", result.data.file_path);
          onChange(result.data.file_path, result.data);
        }
        console.log("🎯 Calling onSuccess...");
        onSuccess(result.data, file);
        message.success(`อัปโหลด ${file.name} สำเร็จ`);
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      message.error(
        `เกิดข้อผิดพลาดในการอัปโหลด ${file.name}: ${error.message}`
      );
      onError(error);
    } finally {
      console.log("🏁 Upload process finished, setting uploading to false");
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemove = () => {
    if (onChange) {
      onChange(null, null);
    }
  };

  const uploadProps = {
    name: "file",
    customRequest: customUpload,
    showUploadList: false,
    accept: accept,
    disabled: disabled || uploading,
  };

  return (
    <div style={{ width: "100%" }}>
      <Space direction="vertical" style={{ width: "100%" }}>
        {!value ? (
          <Upload {...uploadProps}>
            <Button
              icon={<UploadOutlined />}
              loading={uploading}
              disabled={disabled}
              style={{ width: "100%" }}
            >
              {uploading ? "กำลังอัปโหลด..." : placeholder}
            </Button>
          </Upload>
        ) : (
          <div
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: "6px",
              padding: "8px 12px",
              backgroundColor: "#fafafa",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Space>
              {getFileIcon(value)}
              <div>
                <Text strong style={{ fontSize: "14px" }}>
                  {typeof value === "string" ? value.split("/").pop() : value}
                </Text>
                <div>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    Path: {value}
                  </Text>
                </div>
              </div>
            </Space>

            <Space>
              <Upload
                name="file"
                customRequest={customUpload}
                showUploadList={false}
                accept={accept}
                disabled={disabled || uploading}
              >
                <Button
                  size="small"
                  type="link"
                  disabled={disabled || uploading}
                >
                  เปลี่ยน
                </Button>
              </Upload>
              <Button
                size="small"
                type="link"
                danger
                onClick={handleRemove}
                disabled={disabled}
              >
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
export default function ManualManagement() {
  // Data states
  const [categories, setCategories] = useState([]);
  const [manualItems, setManualItems] = useState([]);
  const [manualFiles, setManualFiles] = useState([]);

  // Loading states
  const [loading, setLoading] = useState(false);

  // Modal states
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);

  // Editing states
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Search states
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Tab state
  const [activeTab, setActiveTab] = useState("categories");

  // File upload state
  const [uploadedFilePath, setUploadedFilePath] = useState(null);
  const [uploadedFileData, setUploadedFileData] = useState(null);

  // Pagination
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Forms
  const [categoryForm] = Form.useForm();
  const [itemForm] = Form.useForm();

  const { message } = App.useApp();

  // API functions
  const apiCall = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API call error:", error);
      throw error;
    }
  };

  // Load data functions
  const loadCategories = useCallback(async () => {
    try {
      const response = await apiCall("/api/manual-categories?activeOnly=false");
      if (response.success) {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  }, []);

  const loadManualItems = useCallback(async () => {
    try {
      const response = await apiCall("/api/manual-items?activeOnly=false");
      if (response.success) {
        setManualItems(response.data || []);
      }
    } catch (error) {
      console.error("Error loading manual items:", error);
    }
  }, []);

  const loadManualFiles = useCallback(async () => {
    try {
      const response = await apiCall("/api/manual-files");
      if (response.success) {
        setManualFiles(response.data || []);
      }
    } catch (error) {
      console.error("Error loading manual files:", error);
    }
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadCategories(),
        loadManualItems(),
        loadManualFiles(),
      ]);
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  }, [loadCategories, loadManualItems, loadManualFiles, message]);

  useEffect(() => {
    loadData();
  }, [loadData]);
  // Get files for a specific manual
  const getFilesForManual = (manualId) => {
    return manualFiles.filter((file) => file.manual_id === manualId);
  };

  // Category Management
  const handleCreateCategory = () => {
    setEditingRecord(null);
    setCategoryModalVisible(true);
    categoryForm.resetFields();
  };

  const handleEditCategory = (record) => {
    setEditingRecord(record);
    setCategoryModalVisible(true);
    categoryForm.setFieldsValue({
      name: record.category_name,
      description: record.category_description,
      is_active: record.is_active,
    });
  };

  const handleDeleteCategory = async (id) => {
    try {
      const response = await apiCall(`/api/manual-categories/${id}`, {
        method: "DELETE",
      });

      if (response.success) {
        message.success("ลบหมวดหมู่สำเร็จ");
        loadCategories();
      } else {
        message.error(response.error || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  const handleSubmitCategory = async (values) => {
    try {
      setLoading(true);
      const url = editingRecord
        ? `/api/manual-categories/${editingRecord.id}`
        : "/api/manual-categories";
      const method = editingRecord ? "PUT" : "POST";

      // Map form values to API format
      const payload = {
        category_name: values.name,
        category_description: values.description,
        is_active: values.is_active,
      };

      const response = await apiCall(url, {
        method,
        body: JSON.stringify(payload),
      });

      if (response.success) {
        message.success(
          editingRecord ? "แก้ไขหมวดหมู่สำเร็จ" : "เพิ่มหมวดหมู่สำเร็จ"
        );
        setCategoryModalVisible(false);
        loadCategories();
      } else {
        message.error(response.error || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  // Manual Item Management
  const handleCreateManual = () => {
    setEditingRecord(null);
    setItemModalVisible(true);
    itemForm.resetFields();
    setUploadedFilePath(null);
    setUploadedFileData(null);
  };

  const handleEditManual = (record) => {
    setEditingRecord(record);
    setItemModalVisible(true);
    itemForm.setFieldsValue(record);

    // Load existing file if any from manual item's file_path
    if (record.file_path) {
      setUploadedFilePath(record.file_path);
      setUploadedFileData({
        file_path: record.file_path,
        original_name: record.file_path.split("/").pop(), // Extract filename from path
      });
    } else {
      setUploadedFilePath(null);
      setUploadedFileData(null);
    }
  };

  const handleViewManual = (record) => {
    setSelectedRecord(record);
    setViewModalVisible(true);
  };

  const handleDeleteManual = async (id) => {
    try {
      const response = await apiCall(`/api/manual-items/${id}`, {
        method: "DELETE",
      });

      if (response.success) {
        message.success("ลบคู่มือสำเร็จ");
        loadManualItems();
        loadManualFiles(); // Reload files as they might be deleted
      } else {
        message.error(response.error || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  const handleSubmitManual = async (values) => {
    try {
      setLoading(true);

      // Validate that at least title is filled
      if (!values.title?.trim()) {
        message.error("กรุณากรอกชื่อคู่มือ");
        return;
      }

      const url = editingRecord
        ? `/api/manual-items/${editingRecord.id}`
        : "/api/manual-items";
      const method = editingRecord ? "PUT" : "POST";

      // Add file_path to values if there's an uploaded file
      const submitData = {
        ...values,
        file_path: uploadedFileData?.file_path || null,
      };

      // Save the manual item with file_path
      const response = await apiCall(url, {
        method,
        body: JSON.stringify(submitData),
      });

      if (response.success) {
        message.success(
          editingRecord ? "แก้ไขคู่มือสำเร็จ" : "เพิ่มคู่มือสำเร็จ"
        );
        setItemModalVisible(false);

        // Reset form and file state
        itemForm.resetFields();
        setUploadedFilePath(null);
        setUploadedFileData(null);

        loadManualItems();
        loadManualFiles(); // Reload files to update counts
      } else {
        message.error(response.error || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoading(false);
    }
  };
  // File Management
  const handleDeleteFile = async (id) => {
    try {
      const response = await apiCall(`/api/manual-files/${id}`, {
        method: "DELETE",
      });

      if (response.success) {
        message.success("ลบไฟล์สำเร็จ");
        loadManualFiles();
        loadManualItems(); // Reload to update file counts
      } else {
        message.error(response.error || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  // Table columns for categories
  const categoryColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "ชื่อหมวดหมู่",
      dataIndex: "category_name",
      key: "category_name",
    },
    {
      title: "คำอธิบาย",
      dataIndex: "category_description",
      key: "category_description",
      ellipsis: true,
    },
    {
      title: "สถานะ",
      dataIndex: "is_active",
      key: "is_active",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "เปิดใช้งาน" : "ปิดใช้งาน"}
        </Tag>
      ),
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
            onClick={() => handleEditCategory(record)}
          >
            แก้ไข
          </Button>
          <Popconfirm
            title="คุณแน่ใจหรือไม่ที่จะลบหมวดหมู่นี้?"
            onConfirm={() => handleDeleteCategory(record.id)}
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

  // Table columns for manual items
  const manualColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "หมวดหมู่",
      dataIndex: "category_name",
      key: "category_name",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "ชื่อคู่มือ",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
    },
    {
      title: "คำอธิบาย",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "ไฟล์แนบ",
      key: "files",
      render: (_, record) => {
        return (
          <Space>
            {record.file_path ? (
              <Tag icon={<FileTextOutlined />} color="green">
                {record.file_path.split("/").pop()}
              </Tag>
            ) : (
              <Tag color="default">ไม่มีไฟล์</Tag>
            )}
          </Space>
        );
      },
    },
    {
      title: "สถานะ",
      dataIndex: "is_active",
      key: "is_active",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "เปิดใช้งาน" : "ปิดใช้งาน"}
        </Tag>
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
            onClick={() => handleViewManual(record)}
          >
            ดู
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditManual(record)}
          >
            แก้ไข
          </Button>
          <Popconfirm
            title="คุณแน่ใจหรือไม่ที่จะลบคู่มือนี้?"
            onConfirm={() => handleDeleteManual(record.id)}
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
      key: "categories",
      label: "หมวดหมู่คู่มือ",
      children: (
        <Card>
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Space>
              <Input.Search
                placeholder="ค้นหาหมวดหมู่..."
                allowClear
                onSearch={setSearchText}
                style={{ width: 300 }}
              />
            </Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateCategory}
            >
              เพิ่มหมวดหมู่
            </Button>
          </div>

          <Table
            columns={categoryColumns}
            dataSource={categories}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      ),
    },
    {
      key: "manuals",
      label: "คู่มือและไฟล์",
      children: (
        <Card>
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Space>
              <Input.Search
                placeholder="ค้นหาคู่มือ..."
                allowClear
                onSearch={setSearchText}
                style={{ width: 300 }}
              />
              <Select
                placeholder="เลือกหมวดหมู่"
                allowClear
                style={{ width: 200 }}
                onChange={setSelectedCategory}
              >
                {categories.map((category) => (
                  <Option key={category.id} value={category.id}>
                    {category.category_name}
                  </Option>
                ))}
              </Select>
            </Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateManual}
            >
              เพิ่มคู่มือ
            </Button>
          </div>

          <Table
            columns={manualColumns}
            dataSource={manualItems}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>จัดการระบบคู่มือ</Title>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button
              type={activeTab === "categories" ? "primary" : "default"}
              icon={<FolderOutlined />}
              onClick={() => setActiveTab("categories")}
            >
              หมวดหมู่คู่มือ
            </Button>
            <Button
              type={activeTab === "manuals" ? "primary" : "default"}
              icon={<FileTextOutlined />}
              onClick={() => setActiveTab("manuals")}
            >
              คู่มือและไฟล์
            </Button>
          </Space>
        </div>

        {activeTab === "categories" && tabItems[0].children}
        {activeTab === "manuals" && tabItems[1].children}
      </Card>
      {/* Category Modal */}
      <Modal
        title={editingRecord ? "แก้ไขหมวดหมู่" : "เพิ่มหมวดหมู่"}
        open={categoryModalVisible}
        onCancel={() => setCategoryModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          form={categoryForm}
          layout="vertical"
          onFinish={handleSubmitCategory}
        >
          <Form.Item
            name="name"
            label="ชื่อหมวดหมู่"
            rules={[{ required: true, message: "กรุณากรอกชื่อหมวดหมู่" }]}
          >
            <Input placeholder="กรอกชื่อหมวดหมู่" />
          </Form.Item>

          <Form.Item name="description" label="คำอธิบาย">
            <TextArea rows={3} placeholder="คำอธิบายหมวดหมู่" />
          </Form.Item>

          <Form.Item name="is_active" label="สถานะ" initialValue={true}>
            <Select>
              <Option value={true}>เปิดใช้งาน</Option>
              <Option value={false}>ปิดใช้งาน</Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button onClick={() => setCategoryModalVisible(false)}>
                ยกเลิก
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingRecord ? "บันทึกการแก้ไข" : "เพิ่มหมวดหมู่"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Manual Item Modal */}
      <Modal
        title={editingRecord ? "แก้ไขคู่มือ" : "เพิ่มคู่มือ"}
        open={itemModalVisible}
        onCancel={() => {
          setItemModalVisible(false);
          setUploadedFilePath(null);
          setUploadedFileData(null);
        }}
        footer={null}
        width={800}
      >
        <Form form={itemForm} layout="vertical" onFinish={handleSubmitManual}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category_id"
                label="หมวดหมู่"
                rules={[{ required: true, message: "กรุณาเลือกหมวดหมู่" }]}
              >
                <Select placeholder="เลือกหมวดหมู่">
                  {categories
                    .filter((cat) => cat.is_active)
                    .map((category) => (
                      <Option key={category.id} value={category.id}>
                        {category.category_name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="is_active" label="สถานะ" initialValue={true}>
                <Select>
                  <Option value={true}>เปิดใช้งาน</Option>
                  <Option value={false}>ปิดใช้งาน</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="title"
            label="ชื่อคู่มือ"
            rules={[{ required: true, message: "กรุณากรอกชื่อคู่มือ" }]}
          >
            <Input placeholder="กรอกชื่อคู่มือ" />
          </Form.Item>

          <Form.Item name="description" label="คำอธิบาย">
            <TextArea rows={4} placeholder="คำอธิบายคู่มือ" />
          </Form.Item>

          <Form.Item name="content" label="เนื้อหา">
            <TextArea rows={6} placeholder="เนื้อหาคู่มือ" />
          </Form.Item>

          <Form.Item label="ไฟล์แนบ">
            <ManualFileUpload
              value={uploadedFilePath}
              onChange={(filePath, fileData) => {
                setUploadedFilePath(filePath);
                setUploadedFileData(fileData);
              }}
              manualId={editingRecord?.id}
              placeholder="เลือกไฟล์คู่มือ"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
              maxSize={10}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button
                onClick={() => {
                  setItemModalVisible(false);
                  setUploadedFilePath(null);
                  setUploadedFileData(null);
                }}
              >
                ยกเลิก
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingRecord ? "บันทึกการแก้ไข" : "เพิ่มคู่มือ"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      {/* View Manual Modal */}
      <Modal
        title="รายละเอียดคู่มือ"
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
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <Text strong>หมวดหมู่:</Text>
                  <div>
                    <Tag color="blue">{selectedRecord.category_name}</Tag>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <Text strong>สถานะ:</Text>
                  <div>
                    <Tag color={selectedRecord.is_active ? "green" : "red"}>
                      {selectedRecord.is_active ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                    </Tag>
                  </div>
                </div>
              </Col>
            </Row>

            <div style={{ marginBottom: 16 }}>
              <Text strong>ชื่อคู่มือ:</Text>
              <div>{selectedRecord.title}</div>
            </div>

            {selectedRecord.description && (
              <div style={{ marginBottom: 16 }}>
                <Text strong>คำอธิบาย:</Text>
                <div>{selectedRecord.description}</div>
              </div>
            )}

            {selectedRecord.content && (
              <div style={{ marginBottom: 16 }}>
                <Text strong>เนื้อหา:</Text>
                <div style={{ whiteSpace: "pre-wrap" }}>
                  {selectedRecord.content}
                </div>
              </div>
            )}

            {/* Files Display */}
            {getFilesForManual(selectedRecord.id).length > 0 && (
              <div style={{ marginTop: 24 }}>
                <Text strong>
                  ไฟล์แนบ ({getFilesForManual(selectedRecord.id).length}):
                </Text>
                <div style={{ marginTop: 8 }}>
                  {getFilesForManual(selectedRecord.id).map((file) => (
                    <div
                      key={file.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: 8,
                        border: "1px solid #f0f0f0",
                        borderRadius: 4,
                        marginBottom: 8,
                      }}
                    >
                      <Space>
                        <FileOutlined />
                        <span>
                          {file.original_name ||
                            file.files_path.split("/").pop()}
                        </span>
                        {file.files_type && <Tag>{file.files_type}</Tag>}
                        {file.file_size && (
                          <Tag color="blue">
                            {(file.file_size / (1024 * 1024)).toFixed(2)} MB
                          </Tag>
                        )}
                      </Space>
                      <Space>
                        <Button
                          size="small"
                          icon={<EyeOutlined />}
                          onClick={() =>
                            window.open(
                              `https://banpho.sosmartsolution.com${file.files_path}`,
                              "_blank"
                            )
                          }
                        >
                          ดู
                        </Button>
                        <Popconfirm
                          title="คุณแน่ใจหรือไม่ที่จะลบไฟล์นี้?"
                          onConfirm={() => handleDeleteFile(file.id)}
                          okText="ใช่"
                          cancelText="ไม่"
                        >
                          <Button danger size="small" icon={<DeleteOutlined />}>
                            ลบ
                          </Button>
                        </Popconfirm>
                      </Space>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
