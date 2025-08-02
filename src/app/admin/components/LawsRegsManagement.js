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
  BookOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FileWordOutlined,
  FileOutlined,
  LinkOutlined,
  FolderOutlined,
  UploadOutlined,
  FileImageOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import {
  lawsRegsTypesAPI,
  lawsRegsSectionsAPI,
  lawsRegsFilesAPI,
  createLawsRegsTablesAPI,
} from "@/lib/api";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

// File Upload Component for Laws & Regulations
const LawsRegsFileUpload = ({
  value,
  onChange,
  sectionId,
  accept = ".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif,.webp",
  maxSize = 10,
  placeholder = "เลือกไฟล์เอกสารกฎหมายและระเบียบ",
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
    if (!sectionId) {
      console.error("กรุณาเลือกหมวดหมู่ก่อน");
      onError(new Error("Section ID is required"));
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("section_id", sectionId);
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

      const response = await fetch("/api/laws-regs/upload-laravel", {
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

export default function LawsRegsManagement() {
  // Data states
  const [types, setTypes] = useState([]);
  const [sections, setSections] = useState([]);
  const [files, setFiles] = useState([]);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [sectionsLoading, setSectionsLoading] = useState(false);
  const [filesLoading, setFilesLoading] = useState(false);
  const [tablesLoading, setTablesLoading] = useState(false);

  // Modal states
  const [typeModalVisible, setTypeModalVisible] = useState(false);
  const [sectionModalVisible, setSectionModalVisible] = useState(false);
  const [fileModalVisible, setFileModalVisible] = useState(false);

  // Drawer states
  const [sectionsDrawerVisible, setSectionsDrawerVisible] = useState(false);
  const [filesDrawerVisible, setFilesDrawerVisible] = useState(false);

  // Editing states
  const [editingType, setEditingType] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [editingFile, setEditingFile] = useState(null);

  // Selected items for navigation
  const [selectedType, setSelectedType] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

  // Navigation state
  const [currentLevel, setCurrentLevel] = useState("types"); // types, sections, files

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
  const [sectionForm] = Form.useForm();
  const [fileForm] = Form.useForm();

  const { message } = App.useApp();

  // Check if tables exist
  const checkTables = async () => {
    setTablesLoading(true);
    try {
      const response = await createLawsRegsTablesAPI.checkTables();
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
      const response = await createLawsRegsTablesAPI.createTables();
      if (response.success) {
        message.success("สร้างตารางกฎหมายและระเบียบสำเร็จ");
        setTablesExist(true);
        loadTypes();
      }
    } catch (error) {
      message.error("ไม่สามารถสร้างตารางกฎหมายและระเบียบได้");
      console.error("Error creating tables:", error);
    } finally {
      setTablesLoading(false);
    }
  };

  // Load types
  const loadTypes = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const response = await lawsRegsTypesAPI.getTypes({
        page,
        limit: pagination.pageSize,
        search,
        withSections: false,
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
      message.error("ไม่สามารถโหลดข้อมูลประเภทกฎหมายได้");
      console.error("Error loading types:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load sections for a specific type
  const loadSections = async (typeId) => {
    setSectionsLoading(true);
    try {
      const response = await lawsRegsSectionsAPI.getSections({
        typeId,
        withFiles: false,
      });

      if (response.success) {
        setSections(response.data);
      }
    } catch (error) {
      message.error("ไม่สามารถโหลดข้อมูลหมวดหมู่ได้");
      console.error("Error loading sections:", error);
    } finally {
      setSectionsLoading(false);
    }
  };

  // Load files for a specific section
  const loadFiles = async (sectionId) => {
    setFilesLoading(true);
    try {
      const response = await lawsRegsFilesAPI.getFiles({
        sectionId,
        limit: 100, // Load all files for the section
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
  const navigateToSections = (type) => {
    setSelectedType(type);
    setCurrentLevel("sections");
    loadSections(type.id);
    setSectionsDrawerVisible(true);
  };

  const navigateToFiles = (section) => {
    setSelectedSection(section);
    setCurrentLevel("files");
    loadFiles(section.id);
    setFilesDrawerVisible(true);
  };

  const navigateBack = () => {
    if (currentLevel === "files") {
      setCurrentLevel("sections");
      setSelectedSection(null);
      setFiles([]);
      setFilesDrawerVisible(false);
    } else if (currentLevel === "sections") {
      setCurrentLevel("types");
      setSelectedType(null);
      setSections([]);
      setSectionsDrawerVisible(false);
    }
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

  const openSectionModal = (section = null) => {
    setEditingSection(section);
    setSectionModalVisible(true);

    if (section) {
      sectionForm.setFieldsValue({
        section_name: section.section_name,
      });
    } else {
      sectionForm.resetFields();
    }
  };

  const closeSectionModal = () => {
    setSectionModalVisible(false);
    setEditingSection(null);
    sectionForm.resetFields();
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
        const response = await lawsRegsTypesAPI.updateType(
          editingType.id,
          values
        );
        if (response.success) {
          message.success("อัปเดตประเภทกฎหมายสำเร็จ");
          loadTypes(pagination.current, searchText);
          closeTypeModal();
        }
      } else {
        const response = await lawsRegsTypesAPI.createType(values);
        if (response.success) {
          message.success("เพิ่มประเภทกฎหมายใหม่สำเร็จ");
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
      const response = await lawsRegsTypesAPI.deleteType(id);
      if (response.success) {
        message.success("ลบประเภทกฎหมายสำเร็จ");
        loadTypes(pagination.current, searchText);
      }
    } catch (error) {
      message.error(error.message || "ไม่สามารถลบประเภทกฎหมายได้");
    }
  };

  // Handle section form submit
  const handleSectionSubmit = async (values) => {
    try {
      const sectionData = {
        ...values,
        type_id: selectedType.id,
      };

      if (editingSection) {
        const response = await lawsRegsSectionsAPI.updateSection(
          editingSection.id,
          sectionData
        );
        if (response.success) {
          message.success("อัปเดตหมวดหมู่สำเร็จ");
          loadSections(selectedType.id);
          closeSectionModal();
        }
      } else {
        const response = await lawsRegsSectionsAPI.createSection(sectionData);
        if (response.success) {
          message.success("เพิ่มหมวดหมู่ใหม่สำเร็จ");
          loadSections(selectedType.id);
          closeSectionModal();
        }
      }
    } catch (error) {
      message.error(error.message || "เกิดข้อผิดพลาดในการจัดการหมวดหมู่");
    }
  };

  // Handle section delete
  const handleSectionDelete = async (id) => {
    try {
      const response = await lawsRegsSectionsAPI.deleteSection(id);
      if (response.success) {
        message.success("ลบหมวดหมู่สำเร็จ");
        loadSections(selectedType.id);
      }
    } catch (error) {
      message.error(error.message || "ไม่สามารถลบหมวดหมู่ได้");
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
        section_id: selectedSection.id,
      };

      if (editingFile) {
        const response = await lawsRegsFilesAPI.updateFile(
          editingFile.id,
          fileData
        );
        if (response.success) {
          message.success("อัปเดตไฟล์สำเร็จ");
          loadFiles(selectedSection.id);
          closeFileModal();
        }
      } else {
        const response = await lawsRegsFilesAPI.createFile(fileData);
        if (response.success) {
          message.success("เพิ่มไฟล์ใหม่สำเร็จ");
          loadFiles(selectedSection.id);
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
      const response = await lawsRegsFilesAPI.deleteFile(id);
      if (response.success) {
        message.success("ลบไฟล์สำเร็จ");
        loadFiles(selectedSection.id);
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
        title: "ประเภทกฎหมาย",
        onClick: () => setCurrentLevel("types"),
      },
    ];

    if (selectedType) {
      items.push({
        title: selectedType.type_name,
        onClick: () => setCurrentLevel("sections"),
      });
    }

    if (selectedSection) {
      items.push({
        title: selectedSection.section_name,
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
              onClick={() => navigateToSections(record)}
            >
              ดูหมวดหมู่
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
              description="คุณแน่ใจหรือไม่ที่จะลบประเภทนี้? หมวดหมู่และไฟล์ทั้งหมดจะถูกลบด้วย"
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
          <BookOutlined style={{ fontSize: "64px", color: "#1890ff" }} />
          <Title level={3}>ระบบจัดการกฎหมายและระเบียบ</Title>
          <Text type="secondary">
            ยังไม่มีตารางข้อมูลกฎหมายและระเบียบในระบบ กรุณาสร้างตารางก่อนใช้งาน
          </Text>
          <Button
            type="primary"
            size="large"
            loading={tablesLoading}
            onClick={createTables}
          >
            สร้างตารางกฎหมายและระเบียบ
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
            <BookOutlined style={{ marginRight: 8 }} />
            จัดการกฎหมายและระเบียบ
          </Title>
          <Text type="secondary">
            จัดการประเภทกฎหมาย หมวดหมู่ และไฟล์เอกสารที่เกี่ยวข้อง
          </Text>
        </div>

        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Search
              placeholder="ค้นหาชื่อประเภทกฎหมาย"
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
          title={editingType ? "แก้ไขประเภทกฎหมาย" : "เพิ่มประเภทกฎหมายใหม่"}
          open={typeModalVisible}
          onCancel={closeTypeModal}
          footer={null}
          width={600}
        >
          <Form form={typeForm} layout="vertical" onFinish={handleTypeSubmit}>
            <Form.Item
              name="type_name"
              label="ชื่อประเภท"
              rules={[{ required: true, message: "กรุณากรอกชื่อประเภท" }]}
            >
              <Input placeholder="กรอกชื่อประเภทกฎหมายและระเบียบ" />
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

        {/* Sections Drawer */}
        <Drawer
          title={
            <Space>
              <FolderOutlined />
              หมวดหมู่: {selectedType?.type_name}
            </Space>
          }
          placement="right"
          onClose={navigateBack}
          open={sectionsDrawerVisible}
          width={700}
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => openSectionModal()}
            >
              เพิ่มหมวดหมู่
            </Button>
          }
        >
          <List
            loading={sectionsLoading}
            dataSource={sections}
            renderItem={(section) => (
              <List.Item
                actions={[
                  <Button
                    key="view-files"
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => navigateToFiles(section)}
                  >
                    ดูไฟล์
                  </Button>,
                  <Button
                    key="edit"
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => openSectionModal(section)}
                  >
                    แก้ไข
                  </Button>,
                  <Popconfirm
                    key="delete"
                    title="ยืนยันการลบ"
                    description="คุณแน่ใจหรือไม่ที่จะลบหมวดหมู่นี้? ไฟล์ทั้งหมดจะถูกลบด้วย"
                    onConfirm={() => handleSectionDelete(section.id)}
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
                  avatar={
                    <FolderOutlined
                      style={{ fontSize: "20px", color: "#1890ff" }}
                    />
                  }
                  title={<Text strong>{section.section_name}</Text>}
                  description={
                    <Text type="secondary">
                      สร้างเมื่อ:{" "}
                      {new Date(section.created_at).toLocaleDateString("th-TH")}
                    </Text>
                  }
                />
              </List.Item>
            )}
            locale={{
              emptyText: "ยังไม่มีหมวดหมู่",
            }}
          />
        </Drawer>

        {/* Files Drawer */}
        <Drawer
          title={
            <Space>
              <BookOutlined />
              ไฟล์: {selectedSection?.section_name}
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

        {/* Section Modal */}
        <Modal
          title={editingSection ? "แก้ไขหมวดหมู่" : "เพิ่มหมวดหมู่ใหม่"}
          open={sectionModalVisible}
          onCancel={closeSectionModal}
          footer={null}
          width={600}
        >
          <Form
            form={sectionForm}
            layout="vertical"
            onFinish={handleSectionSubmit}
          >
            <Form.Item
              name="section_name"
              label="ชื่อหมวดหมู่"
              rules={[{ required: true, message: "กรุณากรอกชื่อหมวดหมู่" }]}
            >
              <Input placeholder="กรอกชื่อหมวดหมู่" />
            </Form.Item>

            <div style={{ textAlign: "right", marginTop: 24 }}>
              <Space>
                <Button onClick={closeSectionModal}>ยกเลิก</Button>
                <Button type="primary" htmlType="submit">
                  {editingSection ? "อัปเดต" : "เพิ่ม"}
                </Button>
              </Space>
            </div>
          </Form>
        </Modal>

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
              <LawsRegsFileUpload
                sectionId={selectedSection?.id}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif,.webp"
                placeholder="เลือกไฟล์เอกสารกฎหมายและระเบียบ"
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
