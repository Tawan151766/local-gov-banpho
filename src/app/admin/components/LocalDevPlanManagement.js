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
  Drawer,
  List,
  Row,
  Col,
  Breadcrumb,
  Select,
  Upload,
  Progress,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  FolderOutlined,
  FileTextOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
  UploadOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  FileOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

// File Upload Component
const LocalDevPlanFileUpload = ({ 
  value,
  onChange,
  typeId,
  accept = ".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif,.webp",
  maxSize = 10,
  placeholder = "เลือกไฟล์เอกสารแผนพัฒนาท้องถิ่น",
  description,
  disabled = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf': return <FilePdfOutlined style={{ color: '#ff4d4f', fontSize: 16 }} />;
      case 'doc':
      case 'docx': return <FileWordOutlined style={{ color: '#1890ff', fontSize: 16 }} />;
      case 'xls':
      case 'xlsx': return <FileExcelOutlined style={{ color: '#52c41a', fontSize: 16 }} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp': return <FileImageOutlined style={{ color: '#fa8c16', fontSize: 16 }} />;
      default: return <FileOutlined style={{ color: '#8c8c8c', fontSize: 16 }} />;
    }
  };

  const customUpload = async ({ file, onProgress, onSuccess, onError }) => {
    if (!typeId) {
      message.error('กรุณาเลือกประเภทแผนพัฒนาท้องถิ่นก่อน');
      onError(new Error('Type ID is required'));
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type_id', typeId);
    if (description) {
      formData.append('description', description);
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch('/api/local-dev-plan/upload-laravel', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      if (result.success) {
        if (onChange) {
          onChange(result.data.file_path, result.data);
        }
        onSuccess(result.data, file);
      } else {
        throw new Error(result.error || 'Upload failed');
      }

    } catch (error) {
      console.error('Upload error:', error);
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
    name: 'file',
    customRequest: customUpload,
    showUploadList: false,
    accept: accept,
    disabled: disabled || uploading,
  };

  return (
    <div style={{ width: '100%' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        {!value ? (
          <Upload {...uploadProps}>
            <Button 
              icon={<UploadOutlined />} 
              loading={uploading}
              disabled={disabled}
              style={{ width: '100%' }}
            >
              {uploading ? 'กำลังอัปโหลด...' : placeholder}
            </Button>
          </Upload>
        ) : (
          <div 
            style={{ 
              border: '1px solid #d9d9d9',
              borderRadius: '6px',
              padding: '8px 12px',
              backgroundColor: '#fafafa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Space>
              {getFileIcon(value)}
              <div>
                <Text strong style={{ fontSize: '14px' }}>
                  {typeof value === 'string' ? value.split('/').pop() : value}
                </Text>
                <div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Path: {value}
                  </Text>
                </div>
              </div>
            </Space>
            
            <Space>
              <Upload {...uploadProps}>
                <Button size="small" type="link">เปลี่ยน</Button>
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
            status={uploadProgress === 100 ? 'success' : 'active'}
          />
        )}

        <div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            รองรับไฟล์: PDF, Word, Excel, Text, และรูปภาพ | ขนาดไฟล์สูงสุด: {maxSize}MB
          </Text>
        </div>
      </Space>
    </div>
  );
};

export default function LocalDevelopmentPlanManagement() {
  // Data states
  const [types, setTypes] = useState([]);
  const [files, setFiles] = useState([]);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [filesLoading, setFilesLoading] = useState(false);

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [fileModalVisible, setFileModalVisible] = useState(false);

  // Drawer states
  const [filesDrawerVisible, setFilesDrawerVisible] = useState(false);

  // Editing states
  const [editingType, setEditingType] = useState(null);
  const [editingFile, setEditingFile] = useState(null);

  // Selected items for navigation
  const [selectedType, setSelectedType] = useState(null);

  // Navigation state
  const [currentLevel, setCurrentLevel] = useState("types"); // types, files

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchText, setSearchText] = useState("");

  // Forms
  const [form] = Form.useForm();
  const [fileForm] = Form.useForm();

  const { message } = App.useApp();

  // API functions
  const apiCall = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  };

  // Load types
  const loadTypes = useCallback(async (page = 1, search = "") => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pagination.pageSize.toString(),
        search: search,
        withFiles: 'true'
      });

      const response = await apiCall(`/api/local-dev-plan/types?${queryParams}`);

      if (response.success) {
        setTypes(response.data);
        setPagination((prev) => ({
          ...prev,
          current: response.pagination.page,
          total: response.pagination.total,
        }));
      }
    } catch (error) {
      message.error("ไม่สามารถโหลดข้อมูลประเภทแผนพัฒนาท้องถิ่นได้");
      console.error("Error loading types:", error);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageSize, message]);

  // Load files
  const loadFiles = useCallback(async (typeId) => {
    setFilesLoading(true);
    try {
      const queryParams = new URLSearchParams({
        typeId: typeId.toString(),
        limit: '50'
      });

      const response = await apiCall(`/api/local-dev-plan/files?${queryParams}`);

      if (response.success) {
        setFiles(response.data);
      }
    } catch (error) {
      message.error("ไม่สามารถโหลดข้อมูลไฟล์ได้");
      console.error("Error loading files:", error);
    } finally {
      setFilesLoading(false);
    }
  }, [message]);

  // Initial load
  useEffect(() => {
    if (currentLevel === "types") {
      loadTypes(1, "");
    }
  }, []);

  // Handle search
  const handleSearch = useCallback((value) => {
    setSearchText(value);
    if (currentLevel === "types") {
      setPagination(prev => ({ ...prev, current: 1 }));
      loadTypes(1, value);
    }
  }, [currentLevel, loadTypes]);

  // Handle pagination change
  const handleTableChange = useCallback((paginationInfo) => {
    if (currentLevel === "types") {
      if (paginationInfo.current !== pagination.current || 
          paginationInfo.pageSize !== pagination.pageSize) {
        loadTypes(paginationInfo.current, searchText);
      }
    }
  }, [currentLevel, pagination.current, pagination.pageSize, searchText, loadTypes]);

  // Type management functions
  const openTypeModal = (type = null) => {
    setEditingType(type);
    setModalVisible(true);

    if (type) {
      form.setFieldsValue({
        type_name: type.type_name,
      });
    } else {
      form.resetFields();
    }
  };

  const closeTypeModal = () => {
    setModalVisible(false);
    setEditingType(null);
    form.resetFields();
  };

  const handleTypeSubmit = async (values) => {
    try {
      if (editingType) {
        const response = await apiCall(`/api/local-dev-plan/types?id=${editingType.id}`, {
          method: 'PUT',
          body: JSON.stringify(values),
        });
        if (response.success) {
          message.success("อัปเดตประเภทแผนพัฒนาท้องถิ่นสำเร็จ");
          loadTypes(pagination.current, searchText);
          closeTypeModal();
        }
      } else {
        const response = await apiCall('/api/local-dev-plan/types', {
          method: 'POST',
          body: JSON.stringify(values),
        });
        if (response.success) {
          message.success("เพิ่มประเภทแผนพัฒนาท้องถิ่นใหม่สำเร็จ");
          loadTypes(pagination.current, searchText);
          closeTypeModal();
        }
      }
    } catch (error) {
      message.error(error.message || "เกิดข้อผิดพลาด");
    }
  };

  const handleTypeDelete = async (id) => {
    try {
      const response = await apiCall(`/api/local-dev-plan/types?id=${id}`, {
        method: 'DELETE',
      });
      if (response.success) {
        message.success("ลบประเภทแผนพัฒนาท้องถิ่นสำเร็จ");
        loadTypes(pagination.current, searchText);
      }
    } catch (error) {
      message.error(error.message || "ไม่สามารถลบประเภทแผนพัฒนาท้องถิ่นได้");
    }
  };

  // File management functions
  const openFileModal = (file = null) => {
    setEditingFile(file);
    setFileModalVisible(true);

    if (file) {
      fileForm.setFieldsValue({
        files_path: file.files_path,
        description: file.description,
        // ไม่ต้องตั้งค่า files_type เพราะจะตรวจสอบอัตโนมัติ
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

  const handleFileSubmit = async (values) => {
    try {
      // ตรวจสอบนาสกุลไฟล์อัตโนมัติจาก files_path
      let autoDetectedFileType = 'other';
      if (values.files_path) {
        const extension = values.files_path.split('.').pop().toLowerCase();
        switch (extension) {
          case 'pdf': autoDetectedFileType = 'pdf'; break;
          case 'doc': autoDetectedFileType = 'doc'; break;
          case 'docx': autoDetectedFileType = 'docx'; break;
          case 'xls': autoDetectedFileType = 'xls'; break;
          case 'xlsx': autoDetectedFileType = 'xlsx'; break;
          case 'txt': autoDetectedFileType = 'txt'; break;
          case 'jpg':
          case 'jpeg': autoDetectedFileType = 'jpg'; break;
          case 'png': autoDetectedFileType = 'png'; break;
          case 'gif': autoDetectedFileType = 'gif'; break;
          case 'webp': autoDetectedFileType = 'webp'; break;
          case 'mp4': autoDetectedFileType = 'mp4'; break;
        }
      }

      const fileData = {
        ...values,
        files_type: autoDetectedFileType, // ใช้ประเภทไฟล์ที่ตรวจสอบอัตโนมัติ
        type_id: selectedType.id,
      };

      if (editingFile) {
        const response = await apiCall(`/api/local-dev-plan/files?id=${editingFile.id}`, {
          method: 'PUT',
          body: JSON.stringify(fileData),
        });
        if (response.success) {
          message.success("อัปเดตไฟล์สำเร็จ");
          loadFiles(selectedType.id);
          closeFileModal();
        }
      } else {
        const response = await apiCall('/api/local-dev-plan/files', {
          method: 'POST',
          body: JSON.stringify(fileData),
        });
        if (response.success) {
          message.success("เพิ่มไฟล์สำเร็จ");
          loadFiles(selectedType.id);
          closeFileModal();
        }
      }
    } catch (error) {
      message.error(error.message || "เกิดข้อผิดพลาดในการจัดการไฟล์");
    }
  };

  const handleFileDelete = async (id) => {
    try {
      const response = await apiCall(`/api/local-dev-plan/files?id=${id}`, {
        method: 'DELETE',
      });
      if (response.success) {
        message.success("ลบไฟล์สำเร็จ");
        loadFiles(selectedType.id);
      }
    } catch (error) {
      message.error(error.message || "ไม่สามารถลบไฟล์ได้");
    }
  };

  // Navigation functions
  const navigateToFiles = (type) => {
    setSelectedType(type);
    setCurrentLevel("files");
    loadFiles(type.id);
  };

  const navigateBack = () => {
    if (currentLevel === "files") {
      setCurrentLevel("types");
      setSelectedType(null);
      setFiles([]);
    }
  };

  const openFilesDrawer = (type) => {
    setSelectedType(type);
    setFilesDrawerVisible(true);
    loadFiles(type.id);
  };

  const closeFilesDrawer = () => {
    setFilesDrawerVisible(false);
    setSelectedType(null);
    setFiles([]);
  };

  // Utility functions
  const getFileIcon = (fileType) => {
    switch (fileType?.toLowerCase()) {
      case "pdf":
        return <FilePdfOutlined style={{ color: "#ff4d4f" }} />;
      case "doc":
      case "docx":
        return <FileWordOutlined style={{ color: "#1890ff" }} />;
      case "xls":
      case "xlsx":
        return <FileExcelOutlined style={{ color: "#52c41a" }} />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "webp":
        return <FileImageOutlined style={{ color: "#722ed1" }} />;
      default:
        return <FileOutlined style={{ color: "#8c8c8c" }} />;
    }
  };

  const getBreadcrumbItems = () => {
    const items = [
      {
        title: "ประเภทแผนพัฒนาท้องถิ่น",
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

  const handleDownloadFile = (file) => {
    // file.files_path เก็บเป็น /storage/uploads/filename
    let fullUrl = '';
    if (file.files_path.startsWith('/storage/')) {
      // Laravel storage URL format
      fullUrl = file.files_path.replace('/storage/', 'https://banpho.sosmartsolution.com/storage/');
    } else if (file.files_path.startsWith('http')) {
      // Already full URL
      fullUrl = file.files_path;
    } else {
      // Fallback
      fullUrl = `https://banpho.sosmartsolution.com${file.files_path}`;
    }
    
    window.open(fullUrl, '_blank');
  };

  // Dynamic columns based on current level
  const getColumns = () => {
    if (currentLevel === "types") {
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
          title: "จำนวนไฟล์",
          dataIndex: "files_count",
          key: "files_count",
          width: 120,
          render: (count) => <Tag color="blue">{count || 0} ไฟล์</Tag>,
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
          width: 300,
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
                icon={<FileTextOutlined />}
                onClick={() => openFilesDrawer(record)}
              >
                รายการไฟล์
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
    } else if (currentLevel === "files") {
      return [
        {
          title: "ID",
          dataIndex: "id",
          key: "id",
          width: 80,
        },
        {
          title: "ไฟล์",
          dataIndex: "files_path",
          key: "files_path",
          render: (path, record) => (
            <Space>
              {getFileIcon(record.files_type)}
              <div>
                <Text strong>{record.original_name || path.split('/').pop()}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Path: {path}
                </Text>
              </div>
            </Space>
          ),
        },
        {
          title: "ประเภทไฟล์",
          dataIndex: "files_type",
          key: "files_type",
          render: (type) => <Tag color="blue">{type?.toUpperCase()}</Tag>,
        },
        {
          title: "ขนาด",
          dataIndex: "file_size",
          key: "file_size",
          render: (size) => {
            if (!size) return '-';
            const kb = Math.round(size / 1024);
            return `${kb} KB`;
          },
        },
        {
          title: "คำอธิบาย",
          dataIndex: "description",
          key: "description",
          render: (desc) => desc || '-',
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
          width: 200,
          render: (_, record) => (
            <Space>
              <Button
                type="primary"
                size="small"
                icon={<DownloadOutlined />}
                onClick={() => handleDownloadFile(record)}
              >
                ดาวน์โหลด
              </Button>
              <Button
                type="default"
                size="small"
                icon={<EditOutlined />}
                onClick={() => openFileModal(record)}
              >
                แก้ไข
              </Button>
              <Popconfirm
                title="ยืนยันการลบ"
                description="คุณแน่ใจหรือไม่ที่จะลบไฟล์นี้?"
                onConfirm={() => handleFileDelete(record.id)}
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
    }
    return [];
  };

  // Get current data based on level
  const getCurrentData = () => {
    switch (currentLevel) {
      case "types":
        return types;
      case "files":
        return files;
      default:
        return [];
    }
  };

  // Get current loading state
  const getCurrentLoading = () => {
    switch (currentLevel) {
      case "types":
        return loading;
      case "files":
        return filesLoading;
      default:
        return false;
    }
  };

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={3}>
            <FolderOutlined style={{ marginRight: 8 }} />
            จัดการแผนพัฒนาท้องถิ่น
          </Title>
          <Text type="secondary">
            จัดการประเภทแผนพัฒนาท้องถิ่น และไฟล์เอกสารที่เกี่ยวข้อง
          </Text>
        </div>

        {/* Breadcrumb Navigation */}
        {currentLevel !== "types" && (
          <Row gutter={16} align="middle">
            <Col>
              <Button icon={<ArrowLeftOutlined />} onClick={navigateBack}>
                ย้อนกลับ
              </Button>
            </Col>
            <Col flex="auto">
              <Breadcrumb
                items={getBreadcrumbItems()}
                style={{ fontSize: "14px" }}
              />
            </Col>
          </Row>
        )}

        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Search
              placeholder={
                currentLevel === "types"
                  ? "ค้นหาชื่อประเภทแผนพัฒนา"
                  : "ค้นหาไฟล์"
              }
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
              onClick={() => {
                if (currentLevel === "types") openTypeModal();
                else if (currentLevel === "files") openFileModal();
              }}
            >
              {currentLevel === "types"
                ? "เพิ่มประเภทใหม่"
                : "เพิ่มไฟล์ใหม่"}
            </Button>
          </Col>
        </Row>

        <Table
          columns={getColumns()}
          dataSource={getCurrentData()}
          rowKey="id"
          loading={getCurrentLoading()}
          pagination={currentLevel === "types" ? {
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} จาก ${total} รายการ`,
          } : false}
          onChange={currentLevel === "types" ? handleTableChange : undefined}
        />

        {/* Type Modal */}
        <Modal
          title={
            editingType
              ? "แก้ไขประเภทแผนพัฒนาท้องถิ่น"
              : "เพิ่มประเภทแผนพัฒนาท้องถิ่นใหม่"
          }
          open={modalVisible}
          onCancel={closeTypeModal}
          footer={null}
          width={500}
        >
          <Form form={form} layout="vertical" onFinish={handleTypeSubmit}>
            <Form.Item
              name="type_name"
              label="ชื่อประเภท"
              rules={[{ required: true, message: "กรุณากรอกชื่อประเภท" }]}
            >
              <Input placeholder="กรอกชื่อประเภทแผนพัฒนาท้องถิ่น" />
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
              <FileTextOutlined />
              ไฟล์เอกสาร: {selectedType?.type_name}
            </Space>
          }
          placement="right"
          onClose={closeFilesDrawer}
          open={filesDrawerVisible}
          width={600}
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
                  title={file.original_name || file.files_path.split('/').pop()}
                  description={
                    <Space direction="vertical" size="small">
                      <Tag color="blue">{file.files_type?.toUpperCase()}</Tag>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
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
              <LocalDevPlanFileUpload 
                typeId={selectedType?.id}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif,.webp"
                placeholder="เลือกไฟล์เอกสารแผนพัฒนาท้องถิ่น"
                maxSize={10}
              />
            </Form.Item>

            <Form.Item
              name="description"
              label="คำอธิบาย (ไม่บังคับ)"
            >
              <TextArea 
                rows={3} 
                placeholder="กรอกคำอธิบายไฟล์..."
                maxLength={500}
                showCount
              />
            </Form.Item>

            {/* แสดงประเภทไฟล์ที่ตรวจสอบได้ (แบบ read-only) */}
            {fileForm.getFieldValue('files_path') && (
              <Form.Item label="ประเภทไฟล์ที่ตรวจสอบได้">
                <div style={{ 
                  padding: '8px 12px', 
                  backgroundColor: '#f5f5f5', 
                  borderRadius: '6px',
                  border: '1px solid #d9d9d9'
                }}>
                  <Space>
                    {getFileIcon((() => {
                      const path = fileForm.getFieldValue('files_path');
                      return path ? path.split('.').pop().toLowerCase() : '';
                    })())}
                    <Text>
                      {(() => {
                        const path = fileForm.getFieldValue('files_path');
                        if (!path) return 'ยังไม่ได้เลือกไฟล์';
                        const extension = path.split('.').pop().toLowerCase();
                        switch (extension) {
                          case 'pdf': return 'PDF Document';
                          case 'doc': return 'Word Document';
                          case 'docx': return 'Word Document (DOCX)';
                          case 'xls': return 'Excel Spreadsheet';
                          case 'xlsx': return 'Excel Spreadsheet (XLSX)';
                          case 'txt': return 'Text File';
                          case 'jpg':
                          case 'jpeg': return 'JPEG Image';
                          case 'png': return 'PNG Image';
                          case 'gif': return 'GIF Image';
                          case 'webp': return 'WebP Image';
                          case 'mp4': return 'MP4 Video';
                          default: return 'ไฟล์อื่นๆ';
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