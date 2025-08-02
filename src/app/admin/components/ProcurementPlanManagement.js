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
  Breadcrumb,
  List,
  Drawer,
  Upload,
  Progress,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FileWordOutlined,
  FileOutlined,
  LinkOutlined,
  UploadOutlined,
  FileImageOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import {
  procurementPlanTypesAPI,
  procurementPlanFilesAPI,
  createProcurementTablesAPI,
} from "@/lib/api";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

// File Upload Component for Procurement Plans
const ProcurementFileUpload = ({
  value,
  onChange,
  typeId,
  accept = ".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif,.webp",
  maxSize = 10,
  placeholder = "เลือกไฟล์เอกสารแผนจัดซื้อจัดจ้าง",
  description,
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "webp":
        return <FileImageOutlined style={{ color: "#fa8c16", fontSize: 16 }} />;
      default:
        return <FileOutlined style={{ color: "#8c8c8c", fontSize: 16 }} />;
    }
  };

  const customUpload = async ({ file, onProgress, onSuccess, onError }) => {
    if (!typeId) {
      console.error("กรุณาเลือกประเภทแผนก่อน");
      onError(new Error("Type ID is required"));
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type_id", typeId);
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

      const response = await fetch("/api/procurement-plan/upload-laravel", {
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
        if (onChange) {
          onChange(result.data.file_path, result.data);
        }
        onSuccess(result.data, file);
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      onError(error);
    } finally {
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
              <Upload {...uploadProps}>
                <Button size="small" type="link">
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
            รองรับไฟล์: PDF, Word, Excel, Text, และรูปภาพ | ขนาดไฟล์สูงสุด:{" "}
            {maxSize}MB
          </Text>
        </div>
      </Space>
    </div>
  );
};

export default function ProcurementPlanManagement() {
  // Data states
  const [types, setTypes] = useState([]);
  const [files, setFiles] = useState([]);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [filesLoading, setFilesLoading] = useState(false);
  const [tablesLoading, setTablesLoading] = useState(false);

  // Modal states
  const [typeModalVisible, setTypeModalVisible] = useState(false);
  const [fileModalVisible, setFileModalVisible] = useState(false);
  const [filesDrawerVisible, setFilesDrawerVisible] = useState(false);

  // Editing states
  const [editingType, setEditingType] = useState(null);
  const [editingFile, setEditingFile] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  // Navigation state
  const [currentLevel, setCurrentLevel] = useState("types"); // types, files

  // Table states
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchText, setSearchText] = useState("");
  const [tablesExist, setTablesExist] = useState(false);

  // Forms
  const [typeForm] = Form.useForm();
  const [fileForm] = Form.useForm();

  const { message } = App.useApp();

  // Check if tables exist
  const checkTables = async () => {
    setTablesLoading(true);
    try {
      const response = await createProcurementTablesAPI.checkTables();
      if (response.success) {
        const allTablesExist = Object.values(response.tablesExist).every(
          (exists) => exists
        );
        setTablesExist(allTablesExist);
      }
    } catch (error) {
      console.error("Error checking tables:", error);
    } finally {
      setTablesLoading(false);
    }
  };

  // Create tables
  const createTables = async () => {
    setTablesLoading(true);
    try {
      const response = await createProcurementTablesAPI.createTables();
      if (response.success) {
        message.success("สร้างตารางแผนจัดซื้อจัดจ้างสำเร็จ");
        setTablesExist(true);
        loadTypes();
      }
    } catch (error) {
      message.error("ไม่สามารถสร้างตารางแผนจัดซื้อจัดจ้างได้");
      console.error("Error creating tables:", error);
    } finally {
      setTablesLoading(false);
    }
  };

  // Load types
  const loadTypes = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const response = await procurementPlanTypesAPI.getTypes({
        page,
        limit: pagination.pageSize,
        search,
        withFiles: false,
      });

      if (response.success) {
        setTypes(response.data);
        setPagination((prev) => ({
          ...prev,
          current: response.pagination.page,
          total: response.pagination.total,
        }));
      }
    } catch (error) {
      message.error("ไม่สามารถโหลดข้อมูลประเภทแผนจัดซื้อจัดจ้างได้");
      console.error("Error loading types:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load files for a specific type
  const loadFiles = async (typeId) => {
    setFilesLoading(true);
    try {
      const response = await procurementPlanFilesAPI.getFiles({
        typeId,
        limit: 100, // Load all files for the type
      });

      if (response.success) {
        setFiles(response.data);
      }
    } catch (error) {
      message.error("ไม่สามารถโหลดข้อมูลไฟล์ได้");
      console.error("Error loading files:", error);
    } finally {
      setFilesLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    checkTables();
  }, []);

  useEffect(() => {
    if (tablesExist) {
      loadTypes();
    }
  }, [tablesExist]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle search
  const handleSearch = (value) => {
    setSearchText(value);
    if (currentLevel === "types") {
      loadTypes(1, value);
    }
  };

  // Handle pagination change
  const handleTableChange = (paginationInfo) => {
    if (currentLevel === "types") {
      loadTypes(paginationInfo.current, searchText);
    }
  };

  // Navigation functions
  const navigateToFiles = (type) => {
    setSelectedType(type);
    setCurrentLevel("files");
    loadFiles(type.id);
    setFilesDrawerVisible(true);
  };

  const navigateBack = () => {
    setCurrentLevel("types");
    setSelectedType(null);
    setFiles([]);
    setFilesDrawerVisible(false);
  };

  // Modal management functions
  const openTypeModal = (type = null) => {
    setEditingType(type);
    setTypeModalVisible(true);

    if (type) {
      typeForm.setFieldsValue({
        type_name: type.type_name,
      });
    } else {
      typeForm.resetFields();
    }
  };

  const closeTypeModal = () => {
    setTypeModalVisible(false);
    setEditingType(null);
    typeForm.resetFields();
  };

  const openFileModal = (file = null) => {
    setEditingFile(file);
    setFileModalVisible(true);

    if (file) {
      fileForm.setFieldsValue({
        files_path: file.files_path,
        files_type: file.files_type,
      });
    } else {
      fileForm.resetFields();
    }
  };

  const closeFileModal = () => {
    setFileModalVisible(false);
    setEditingFile(null);
    fileForm.resetFields();
  };

  // Handle type form submit
  const handleTypeSubmit = async (values) => {
    try {
      if (editingType) {
        const response = await procurementPlanTypesAPI.updateType(
          editingType.id,
          values
        );
        if (response.success) {
          message.success("อัปเดตประเภทแผนจัดซื้อจัดจ้างสำเร็จ");
          loadTypes(pagination.current, searchText);
          closeTypeModal();
        }
      } else {
        const response = await procurementPlanTypesAPI.createType(values);
        if (response.success) {
          message.success("เพิ่มประเภทแผนจัดซื้อจัดจ้างใหม่สำเร็จ");
          loadTypes(pagination.current, searchText);
          closeTypeModal();
        }
      }
    } catch (error) {
      message.error(error.message || "เกิดข้อผิดพลาด");
    }
  };

  // Handle type delete
  const handleTypeDelete = async (id) => {
    try {
      const response = await procurementPlanTypesAPI.deleteType(id);
      if (response.success) {
        message.success("ลบประเภทแผนจัดซื้อจัดจ้างสำเร็จ");
        loadTypes(pagination.current, searchText);
      }
    } catch (error) {
      message.error(error.message || "ไม่สามารถลบประเภทแผนจัดซื้อจัดจ้างได้");
    }
  };

  // Handle file form submit
  const handleFileSubmit = async (values) => {
    try {
      // ตรวจสอบนาสกุลไฟล์อัตโนมัติจาก files_path
      let autoDetectedFileType = "other";
      if (values.files_path) {
        const extension = values.files_path.split(".").pop().toLowerCase();
        switch (extension) {
          case "pdf":
            autoDetectedFileType = "pdf";
            break;
          case "doc":
            autoDetectedFileType = "doc";
            break;
          case "docx":
            autoDetectedFileType = "docx";
            break;
          case "xls":
            autoDetectedFileType = "xls";
            break;
          case "xlsx":
            autoDetectedFileType = "xlsx";
            break;
          case "txt":
            autoDetectedFileType = "txt";
            break;
          case "jpg":
          case "jpeg":
            autoDetectedFileType = "jpg";
            break;
          case "png":
            autoDetectedFileType = "png";
            break;
          case "gif":
            autoDetectedFileType = "gif";
            break;
          case "webp":
            autoDetectedFileType = "webp";
            break;
          case "mp4":
            autoDetectedFileType = "mp4";
            break;
        }
      }

      const fileData = {
        ...values,
        files_type: autoDetectedFileType, // ใช้ประเภทไฟล์ที่ตรวจสอบอัตโนมัติ
        type_id: selectedType.id,
      };

      if (editingFile) {
        const response = await procurementPlanFilesAPI.updateFile(
          editingFile.id,
          fileData
        );
        if (response.success) {
          message.success("อัปเดตไฟล์สำเร็จ");
          loadFiles(selectedType.id);
          closeFileModal();
        }
      } else {
        const response = await procurementPlanFilesAPI.createFile(fileData);
        if (response.success) {
          message.success("เพิ่มไฟล์ใหม่สำเร็จ");
          loadFiles(selectedType.id);
          closeFileModal();
        }
      }
    } catch (error) {
      message.error(error.message || "เกิดข้อผิดพลาดในการจัดการไฟล์");
    }
  };

  // Handle file delete
  const handleFileDelete = async (id) => {
    try {
      const response = await procurementPlanFilesAPI.deleteFile(id);
      if (response.success) {
        message.success("ลบไฟล์สำเร็จ");
        loadFiles(selectedType.id);
      }
    } catch (error) {
      message.error(error.message || "ไม่สามารถลบไฟล์ได้");
    }
  };

  // Handle download file
  const handleDownloadFile = (file) => {
    // file.files_path เก็บเป็น /storage/uploads/filename
    let fullUrl = "";
    if (file.files_path.startsWith("/storage/")) {
      // Laravel storage URL format
      fullUrl = file.files_path.replace(
        "/storage/",
        "https://banpho.sosmartsolution.com/storage/"
      );
    } else if (file.files_path.startsWith("http")) {
      // Already full URL
      fullUrl = file.files_path;
    } else {
      // Fallback
      fullUrl = `https://banpho.sosmartsolution.com${file.files_path}`;
    }

    window.open(fullUrl, "_blank");
  };

  // Get file icon based on file type
  const getFileIcon = (fileType) => {
    switch (fileType?.toLowerCase()) {
      case "pdf":
        return <FilePdfOutlined style={{ color: "#ff4d4f" }} />;
      case "xlsx":
      case "xls":
        return <FileExcelOutlined style={{ color: "#52c41a" }} />;
      case "docx":
      case "doc":
        return <FileWordOutlined style={{ color: "#1890ff" }} />;
      default:
        return <FileOutlined style={{ color: "#8c8c8c" }} />;
    }
  };

  // Get breadcrumb items
  const getBreadcrumbItems = () => {
    const items = [
      {
        title: "ประเภทแผนจัดซื้อจัดจ้าง",
        onClick: () => setCurrentLevel("types"),
      },
    ];

    if (selectedType) {
      items.push({
        title: selectedType.type_name,
        onClick: () => setCurrentLevel("files"),
      });
    }

    return items;
  };

  // Dynamic columns
  const getColumns = () => {
    return [
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
        render: (name) => <Text strong>{name}</Text>,
      },
      {
        title: "วันที่สร้าง",
        dataIndex: "created_at",
        key: "created_at",
        render: (date) => new Date(date).toLocaleDateString("th-TH"),
      },
      {
        title: "การจัดการ",
        key: "actions",
        width: 250,
        render: (_, record) => (
          <Space>
            <Button
              type="primary"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => navigateToFiles(record)}
            >
              ดูไฟล์
            </Button>
            <Button
              type="default"
              size="small"
              icon={<EditOutlined />}
              onClick={() => openTypeModal(record)}
            >
              แก้ไข
            </Button>
            <Popconfirm
              title="ยืนยันการลบ"
              description="คุณแน่ใจหรือไม่ที่จะลบประเภทนี้? ไฟล์ทั้งหมดจะถูกลบด้วย"
              onConfirm={() => handleTypeDelete(record.id)}
              okText="ลบ"
              cancelText="ยกเลิก"
            >
              <Button danger size="small" icon={<DeleteOutlined />}>
                ลบ
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ];
  };

  // If tables don't exist, show setup screen
  if (!tablesExist && !tablesLoading) {
    return (
      <Card>
        <Space
          direction="vertical"
          size="large"
          style={{ width: "100%", textAlign: "center" }}
        >
          <ShoppingCartOutlined
            style={{ fontSize: "64px", color: "#1890ff" }}
          />
          <Title level={3}>ระบบจัดการแผนจัดซื้อจัดจ้าง</Title>
          <Text type="secondary">
            ยังไม่มีตารางข้อมูลแผนจัดซื้อจัดจ้างในระบบ กรุณาสร้างตารางก่อนใช้งาน
          </Text>
          <Button
            type="primary"
            size="large"
            loading={tablesLoading}
            onClick={createTables}
          >
            สร้างตารางแผนจัดซื้อจัดจ้าง
          </Button>
        </Space>
      </Card>
    );
  }

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={3}>
            <ShoppingCartOutlined style={{ marginRight: 8 }} />
            จัดการแผนจัดซื้อจัดจ้าง
          </Title>
          <Text type="secondary">
            จัดการประเภทแผนจัดซื้อจัดจ้างและไฟล์เอกสารที่เกี่ยวข้อง
          </Text>
        </div>

        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Search
              placeholder="ค้นหาชื่อประเภทแผน"
              allowClear
              enterButton={<SearchOutlined />}
              size="middle"
              onSearch={handleSearch}
              style={{ width: 300 }}
            />
          </Col>

          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => openTypeModal()}
            >
              เพิ่มประเภทใหม่
            </Button>
          </Col>
        </Row>

        <Table
          columns={getColumns()}
          dataSource={types}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} จาก ${total} รายการ`,
          }}
          onChange={handleTableChange}
        />

        {/* Type Modal */}
        <Modal
          title={
            editingType
              ? "แก้ไขประเภทแผนจัดซื้อจัดจ้าง"
              : "เพิ่มประเภทแผนจัดซื้อจัดจ้างใหม่"
          }
          open={typeModalVisible}
          onCancel={closeTypeModal}
          footer={null}
          width={600}
        >
          <Form form={typeForm} layout="vertical" onFinish={handleTypeSubmit}>
            <Form.Item
              name="type_name"
              label="ชื่อประเภทแผน"
              rules={[{ required: true, message: "กรุณากรอกชื่อประเภทแผน" }]}
            >
              <Input placeholder="กรอกชื่อประเภทแผนจัดซื้อจัดจ้าง" />
            </Form.Item>

            <div style={{ textAlign: "right", marginTop: 24 }}>
              <Space>
                <Button onClick={closeTypeModal}>ยกเลิก</Button>
                <Button type="primary" htmlType="submit">
                  {editingType ? "อัปเดต" : "เพิ่ม"}
                </Button>
              </Space>
            </div>
          </Form>
        </Modal>

        {/* Files Drawer */}
        <Drawer
          title={
            <Space>
              <ShoppingCartOutlined />
              ไฟล์แผน: {selectedType?.type_name}
            </Space>
          }
          placement="right"
          onClose={navigateBack}
          open={filesDrawerVisible}
          width={700}
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => openFileModal()}
            >
              เพิ่มไฟล์
            </Button>
          }
        >
          <List
            loading={filesLoading}
            dataSource={files}
            renderItem={(file) => (
              <List.Item
                actions={[
                  <Button
                    key="download"
                    type="link"
                    icon={<DownloadOutlined />}
                    onClick={() => handleDownloadFile(file)}
                  >
                    ดาวน์โหลด
                  </Button>,
                  <Button
                    key="edit"
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => openFileModal(file)}
                  >
                    แก้ไข
                  </Button>,
                  <Popconfirm
                    key="delete"
                    title="ยืนยันการลบ"
                    description="คุณแน่ใจหรือไม่ที่จะลบไฟล์นี้?"
                    onConfirm={() => handleFileDelete(file.id)}
                    okText="ลบ"
                    cancelText="ยกเลิก"
                  >
                    <Button type="link" danger icon={<DeleteOutlined />}>
                      ลบ
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  avatar={getFileIcon(file.files_type)}
                  title={file.original_name || file.files_path.split("/").pop()}
                  description={
                    <Space direction="vertical" size="small">
                      <Tag color="blue">{file.files_type?.toUpperCase()}</Tag>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        Path: {file.files_path}
                      </Text>
                      {file.description && (
                        <Text type="secondary">{file.description}</Text>
                      )}
                      <Text type="secondary">
                        สร้างเมื่อ:{" "}
                        {new Date(file.created_at).toLocaleDateString("th-TH")}
                      </Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
            locale={{
              emptyText: "ยังไม่มีไฟล์เอกสาร",
            }}
          />
        </Drawer>

        {/* File Modal */}
        <Modal
          title={editingFile ? "แก้ไขไฟล์" : "เพิ่มไฟล์ใหม่"}
          open={fileModalVisible}
          onCancel={closeFileModal}
          footer={null}
          width={500}
        >
          <Form form={fileForm} layout="vertical" onFinish={handleFileSubmit}>
            <Form.Item
              name="files_path"
              label="ไฟล์เอกสาร"
              rules={[{ required: true, message: "กรุณาอัปโหลดไฟล์" }]}
            >
              <ProcurementFileUpload
                typeId={selectedType?.id}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif,.webp"
                placeholder="เลือกไฟล์เอกสารแผนจัดซื้อจัดจ้าง"
                maxSize={10}
              />
            </Form.Item>

            <Form.Item name="description" label="คำอธิบาย (ไม่บังคับ)">
              <TextArea
                rows={3}
                placeholder="กรอกคำอธิบายไฟล์..."
                maxLength={500}
                showCount
              />
            </Form.Item>

            {/* แสดงประเภทไฟล์ที่ตรวจสอบได้ (แบบ read-only) */}
            {fileForm.getFieldValue("files_path") && (
              <Form.Item label="ประเภทไฟล์ที่ตรวจสอบได้">
                <div
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "6px",
                    border: "1px solid #d9d9d9",
                  }}
                >
                  <Space>
                    {getFileIcon(
                      (() => {
                        const path = fileForm.getFieldValue("files_path");
                        return path ? path.split(".").pop().toLowerCase() : "";
                      })()
                    )}
                    <Text>
                      {(() => {
                        const path = fileForm.getFieldValue("files_path");
                        if (!path) return "ยังไม่ได้เลือกไฟล์";
                        const extension = path.split(".").pop().toLowerCase();
                        switch (extension) {
                          case "pdf":
                            return "PDF Document";
                          case "doc":
                            return "Word Document";
                          case "docx":
                            return "Word Document (DOCX)";
                          case "xls":
                            return "Excel Spreadsheet";
                          case "xlsx":
                            return "Excel Spreadsheet (XLSX)";
                          case "txt":
                            return "Text File";
                          case "jpg":
                          case "jpeg":
                            return "JPEG Image";
                          case "png":
                            return "PNG Image";
                          case "gif":
                            return "GIF Image";
                          case "webp":
                            return "WebP Image";
                          case "mp4":
                            return "MP4 Video";
                          default:
                            return "ไฟล์อื่นๆ";
                        }
                      })()}
                    </Text>
                  </Space>
                </div>
              </Form.Item>
            )}

            <div style={{ textAlign: "right", marginTop: 24 }}>
              <Space>
                <Button onClick={closeFileModal}>ยกเลิก</Button>
                <Button type="primary" htmlType="submit">
                  {editingFile ? "อัปเดต" : "เพิ่ม"}
                </Button>
              </Space>
            </div>
          </Form>
        </Modal>
      </Space>
    </Card>
  );
}
