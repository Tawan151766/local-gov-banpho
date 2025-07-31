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
  Divider,
  Row,
  Col,
  Breadcrumb,
  Select,
  Upload,
  message as antMessage,
} from "antd";
import FileUpload from './FileUpload';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  BarChartOutlined,
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
} from "@ant-design/icons";
import {
  perfResultsTypesAPI,
  perfResultsSectionsAPI,
  perfResultsSubTopicsAPI,
  perfResultsFilesAPI,
} from "@/lib/api";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

export default function PerformanceResultsManagement() {
  // Data states
  const [types, setTypes] = useState([]);
  const [sections, setSections] = useState([]);
  const [subTopics, setSubTopics] = useState([]);
  const [files, setFiles] = useState([]);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [sectionsLoading, setSectionsLoading] = useState(false);
  const [subTopicsLoading, setSubTopicsLoading] = useState(false);
  const [filesLoading, setFilesLoading] = useState(false);

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [sectionModalVisible, setSectionModalVisible] = useState(false);
  const [subTopicModalVisible, setSubTopicModalVisible] = useState(false);
  const [fileModalVisible, setFileModalVisible] = useState(false);

  // Drawer states
  const [sectionsDrawerVisible, setSectionsDrawerVisible] = useState(false);
  const [subTopicsDrawerVisible, setSubTopicsDrawerVisible] = useState(false);
  const [filesDrawerVisible, setFilesDrawerVisible] = useState(false);

  // Editing states
  const [editingType, setEditingType] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [editingSubTopic, setEditingSubTopic] = useState(null);
  const [editingFile, setEditingFile] = useState(null);

  // Selected items for navigation
  const [selectedType, setSelectedType] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedSubTopic, setSelectedSubTopic] = useState(null);

  // Navigation state
  const [currentLevel, setCurrentLevel] = useState("types"); // types, sections, subTopics, files

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchText, setSearchText] = useState("");

  // Forms
  const [form] = Form.useForm();
  const [sectionForm] = Form.useForm();
  const [subTopicForm] = Form.useForm();
  const [fileForm] = Form.useForm();

  const { message } = App.useApp();

  // Load types with useCallback to prevent infinite re-renders
  const loadTypes = useCallback(async (page = 1, search = "") => {
    setLoading(true);
    try {
      const response = await perfResultsTypesAPI.getTypes({
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
      message.error("ไม่สามารถโหลดข้อมูลประเภทผลการดำเนินงานได้");
      console.error("Error loading types:", error);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageSize, message]);

  // Load sections for a specific type
  const loadSections = useCallback(async (typeId) => {
    setSectionsLoading(true);
    try {
      const response = await perfResultsSectionsAPI.getSections({
        typeId,
        withSubTopics: false,
      });

      if (response.success) {
        setSections(response.data);
      }
    } catch (error) {
      message.error("ไม่สามารถโหลดข้อมูลหมวดหัวข้อได้");
      console.error("Error loading sections:", error);
    } finally {
      setSectionsLoading(false);
    }
  }, [message]);

  // Load sub topics for a specific section
  const loadSubTopics = useCallback(async (sectionId) => {
    setSubTopicsLoading(true);
    try {
      const response = await perfResultsSubTopicsAPI.getSubTopics({
        sectionId,
        withFiles: false,
      });

      if (response.success) {
        setSubTopics(response.data);
      }
    } catch (error) {
      message.error("ไม่สามารถโหลดข้อมูลหัวข้อย่อยได้");
      console.error("Error loading sub topics:", error);
    } finally {
      setSubTopicsLoading(false);
    }
  }, [message]);

  // Load files for a specific sub topic
  const loadFiles = useCallback(async (subTopicId) => {
    setFilesLoading(true);
    try {
      const response = await perfResultsFilesAPI.getFiles({
        subTopicId,
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
  }, [message]);

  // Initial load - ใช้ useEffect แค่ครั้งเดียว
  useEffect(() => {
    if (currentLevel === "types") {
      loadTypes(1, "");
    }
  }, []); // Empty dependency array

  // Handle search
  const handleSearch = useCallback((value) => {
    setSearchText(value);
    if (currentLevel === "types") {
      setPagination(prev => ({ ...prev, current: 1 })); // Reset to page 1
      loadTypes(1, value);
    }
  }, [currentLevel, loadTypes]);

  // Handle pagination change - แก้ไขเพื่อป้องกัน infinite loop
  const handleTableChange = useCallback((paginationInfo) => {
    if (currentLevel === "types") {
      // ตรวจสอบว่าเป็นการเปลี่ยนหน้าจริงๆ
      if (paginationInfo.current !== pagination.current || 
          paginationInfo.pageSize !== pagination.pageSize) {
        loadTypes(paginationInfo.current, searchText);
      }
    }
  }, [currentLevel, pagination.current, pagination.pageSize, searchText, loadTypes]);

  // Open type modal for create/edit
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

  // Close type modal
  const closeTypeModal = () => {
    setModalVisible(false);
    setEditingType(null);
    form.resetFields();
  };

  // Handle type form submit
  const handleTypeSubmit = async (values) => {
    try {
      if (editingType) {
        // Update type
        const response = await perfResultsTypesAPI.updateType(
          editingType.id,
          values
        );
        if (response.success) {
          message.success("อัปเดตประเภทผลการดำเนินงานสำเร็จ");
          loadTypes(pagination.current, searchText);
          closeTypeModal();
        }
      } else {
        // Create type
        const response = await perfResultsTypesAPI.createType(values);
        if (response.success) {
          message.success("เพิ่มประเภทผลการดำเนินงานใหม่สำเร็จ");
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
      const response = await perfResultsTypesAPI.deleteType(id);
      if (response.success) {
        message.success("ลบประเภทผลการดำเนินงานสำเร็จ");
        loadTypes(pagination.current, searchText);
      }
    } catch (error) {
      message.error(error.message || "ไม่สามารถลบประเภทผลการดำเนินงานได้");
    }
  };

  // Open sections drawer
  const openSectionsDrawer = (type) => {
    setSelectedType(type);
    setSectionsDrawerVisible(true);
    loadSections(type.id);
  };

  // Close sections drawer
  const closeSectionsDrawer = () => {
    setSectionsDrawerVisible(false);
    setSelectedType(null);
    setSections([]);
  };

  // Navigation functions
  const navigateToSections = (type) => {
    setSelectedType(type);
    setCurrentLevel("sections");
    loadSections(type.id);
  };

  const navigateToSubTopics = (section) => {
    setSelectedSection(section);
    setCurrentLevel("subTopics");
    loadSubTopics(section.id);
  };

  const navigateToFiles = (subTopic) => {
    setSelectedSubTopic(subTopic);
    setCurrentLevel("files");
    loadFiles(subTopic.id);
  };

  const navigateBack = () => {
    if (currentLevel === "files") {
      setCurrentLevel("subTopics");
      setSelectedSubTopic(null);
      setFiles([]);
    } else if (currentLevel === "subTopics") {
      setCurrentLevel("sections");
      setSelectedSection(null);
      setSubTopics([]);
    } else if (currentLevel === "sections") {
      setCurrentLevel("types");
      setSelectedType(null);
      setSections([]);
    }
  };

  // Modal management functions
  const openSectionModal = (section = null) => {
    setEditingSection(section);
    setSectionModalVisible(true);

    if (section) {
      sectionForm.setFieldsValue({
        section_name: section.section_name,
        date: section.date,
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

  const openSubTopicModal = (subTopic = null) => {
    setEditingSubTopic(subTopic);
    setSubTopicModalVisible(true);

    if (subTopic) {
      subTopicForm.setFieldsValue({
        topic_name: subTopic.topic_name,
        date: subTopic.date,
      });
    } else {
      subTopicForm.resetFields();
    }
  };

  const closeSubTopicModal = () => {
    setSubTopicModalVisible(false);
    setEditingSubTopic(null);
    subTopicForm.resetFields();
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
        return <FileImageOutlined style={{ color: "#722ed1" }} />;
      default:
        return <FileOutlined style={{ color: "#8c8c8c" }} />;
    }
  };

  const getBreadcrumbItems = () => {
    const items = [
      {
        title: "ประเภทผลการดำเนินงาน",
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
        onClick: () => setCurrentLevel("subTopics"),
      });
    }

    if (selectedSubTopic) {
      items.push({
        title: selectedSubTopic.topic_name,
        onClick: () => setCurrentLevel("files"),
      });
    }

    return items;
  };

  // Handle section form submit
  const handleSectionSubmit = async (values) => {
    try {
      const sectionData = {
        ...values,
        type_id: selectedType.id,
      };

      if (editingSection) {
        const response = await perfResultsSectionsAPI.updateSection(
          editingSection.id,
          sectionData
        );
        if (response.success) {
          message.success("อัปเดตหมวดหัวข้อหลักสำเร็จ");
          loadSections(selectedType.id);
          closeSectionModal();
        }
      } else {
        const response = await perfResultsSectionsAPI.createSection(
          sectionData
        );
        if (response.success) {
          message.success("เพิ่มหมวดหัวข้อหลักสำเร็จ");
          loadSections(selectedType.id);
          closeSectionModal();
        }
      }
    } catch (error) {
      message.error(error.message || "เกิดข้อผิดพลาดในการจัดการหมวดหัวข้อ");
    }
  };

  // Handle section delete
  const handleSectionDelete = async (id) => {
    try {
      const response = await perfResultsSectionsAPI.deleteSection(id);
      if (response.success) {
        message.success("ลบหมวดหัวข้อหลักสำเร็จ");
        loadSections(selectedType.id);
      }
    } catch (error) {
      message.error(error.message || "ไม่สามารถลบหมวดหัวข้อหลักได้");
    }
  };

  // Handle sub topic form submit
  const handleSubTopicSubmit = async (values) => {
    try {
      const subTopicData = {
        ...values,
        section_id: selectedSection.id,
      };

      if (editingSubTopic) {
        const response = await perfResultsSubTopicsAPI.updateSubTopic(
          editingSubTopic.id,
          subTopicData
        );
        if (response.success) {
          message.success("อัปเดตหัวข้อย่อยสำเร็จ");
          loadSubTopics(selectedSection.id);
          closeSubTopicModal();
        }
      } else {
        const response = await perfResultsSubTopicsAPI.createSubTopic(
          subTopicData
        );
        if (response.success) {
          message.success("เพิ่มหัวข้อย่อยสำเร็จ");
          loadSubTopics(selectedSection.id);
          closeSubTopicModal();
        }
      }
    } catch (error) {
      message.error(error.message || "เกิดข้อผิดพลาดในการจัดการหัวข้อย่อย");
    }
  };

  // Handle sub topic delete
  const handleSubTopicDelete = async (id) => {
    try {
      const response = await perfResultsSubTopicsAPI.deleteSubTopic(id);
      if (response.success) {
        message.success("ลบหัวข้อย่อยสำเร็จ");
        loadSubTopics(selectedSection.id);
      }
    } catch (error) {
      message.error(error.message || "ไม่สามารถลบหัวข้อย่อยได้");
    }
  };

  // Handle file form submit
  const handleFileSubmit = async (values) => {
    try {
      const fileData = {
        ...values,
        sub_topic_id: selectedSubTopic.id,
      };

      if (editingFile) {
        const response = await perfResultsFilesAPI.updateFile(
          editingFile.id,
          fileData
        );
        if (response.success) {
          message.success("อัปเดตไฟล์สำเร็จ");
          loadFiles(selectedSubTopic.id);
          closeFileModal();
        }
      } else {
        const response = await perfResultsFilesAPI.createFile(fileData);
        if (response.success) {
          message.success("เพิ่มไฟล์สำเร็จ");
          loadFiles(selectedSubTopic.id);
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
      const response = await perfResultsFilesAPI.deleteFile(id);
      if (response.success) {
        message.success("ลบไฟล์สำเร็จ");
        loadFiles(selectedSubTopic.id);
      }
    } catch (error) {
      message.error(error.message || "ไม่สามารถลบไฟล์ได้");
    }
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
                ดูหมวดหัวข้อ
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
                description="คุณแน่ใจหรือไม่ที่จะลบประเภทนี้? หมวดหัวข้อทั้งหมดจะถูกลบด้วย"
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
    } else if (currentLevel === "sections") {
      return [
        {
          title: "ID",
          dataIndex: "id",
          key: "id",
          width: 80,
        },
        {
          title: "ชื่อหมวดหัวข้อหลัก",
          dataIndex: "section_name",
          key: "section_name",
          render: (name) => <Text strong>{name}</Text>,
        },
        {
          title: "วันที่",
          dataIndex: "date",
          key: "date",
          render: (date) =>
            date ? new Date(date).toLocaleDateString("th-TH") : "-",
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
          width: 280,
          render: (_, record) => (
            <Space>
              <Button
                type="primary"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => navigateToSubTopics(record)}
              >
                ดูหัวข้อย่อย
              </Button>
              <Button
                type="default"
                size="small"
                icon={<EditOutlined />}
                onClick={() => openSectionModal(record)}
              >
                แก้ไข
              </Button>
              <Popconfirm
                title="ยืนยันการลบ"
                description="คุณแน่ใจหรือไม่ที่จะลบหมวดหัวข้อนี้? หัวข้อย่อยทั้งหมดจะถูกลบด้วย"
                onConfirm={() => handleSectionDelete(record.id)}
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
    } else if (currentLevel === "subTopics") {
      return [
        {
          title: "ID",
          dataIndex: "id",
          key: "id",
          width: 80,
        },
        {
          title: "ชื่อหัวข้อย่อย",
          dataIndex: "topic_name",
          key: "topic_name",
          render: (name) => <Text strong>{name}</Text>,
        },
        {
          title: "วันที่",
          dataIndex: "date",
          key: "date",
          render: (date) =>
            date ? new Date(date).toLocaleDateString("th-TH") : "-",
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
                onClick={() => openSubTopicModal(record)}
              >
                แก้ไข
              </Button>
              <Popconfirm
                title="ยืนยันการลบ"
                description="คุณแน่ใจหรือไม่ที่จะลบหัวข้อย่อยนี้? ไฟล์ทั้งหมดจะถูกลบด้วย"
                onConfirm={() => handleSubTopicDelete(record.id)}
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
              <Text strong>{path}</Text>
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
      case "sections":
        return sections;
      case "subTopics":
        return subTopics;
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
      case "sections":
        return sectionsLoading;
      case "subTopics":
        return subTopicsLoading;
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
            <BarChartOutlined style={{ marginRight: 8 }} />
            จัดการผลการดำเนินงาน
          </Title>
          <Text type="secondary">
            จัดการประเภทผลการดำเนินงาน หมวดหัวข้อหลัก หัวข้อย่อย และไฟล์แนบ
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
                  ? "ค้นหาชื่อประเภท"
                  : currentLevel === "sections"
                  ? "ค้นหาชื่อหมวดหัวข้อ"
                  : currentLevel === "subTopics"
                  ? "ค้นหาชื่อหัวข้อย่อย"
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
                else if (currentLevel === "sections") openSectionModal();
                else if (currentLevel === "subTopics") openSubTopicModal();
                else if (currentLevel === "files") openFileModal();
              }}
            >
              {currentLevel === "types"
                ? "เพิ่มประเภทใหม่"
                : currentLevel === "sections"
                ? "เพิ่มหมวดหัวข้อใหม่"
                : currentLevel === "subTopics"
                ? "เพิ่มหัวข้อย่อยใหม่"
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
              ? "แก้ไขประเภทผลการดำเนินงาน"
              : "เพิ่มประเภทผลการดำเนินงานใหม่"
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
              <Input placeholder="กรอกชื่อประเภทผลการดำเนินงาน" />
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
              หมวดหัวข้อหลัก: {selectedType?.type_name}
            </Space>
          }
          placement="right"
          onClose={closeSectionsDrawer}
          open={sectionsDrawerVisible}
          width={600}
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openSectionModal}
            >
              เพิ่มหมวดหัวข้อ
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
                    key="view-subtopics"
                    type="link"
                    icon={<FileTextOutlined />}
                  >
                    ดูหัวข้อย่อย
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <FolderOutlined
                      style={{ fontSize: "20px", color: "#1890ff" }}
                    />
                  }
                  title={section.section_name}
                  description={
                    <Space direction="vertical" size="small">
                      {section.date && (
                        <Text type="secondary">
                          วันที่:{" "}
                          {new Date(section.date).toLocaleDateString("th-TH")}
                        </Text>
                      )}
                      <Text type="secondary">
                        สร้างเมื่อ:{" "}
                        {new Date(section.created_at).toLocaleDateString(
                          "th-TH"
                        )}
                      </Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
            locale={{
              emptyText: "ยังไม่มีหมวดหัวข้อหลัก",
            }}
          />
        </Drawer>

        {/* Section Modal */}
        <Modal
          title={
            editingSection ? "แก้ไขหมวดหัวข้อหลัก" : "เพิ่มหมวดหัวข้อหลักใหม่"
          }
          open={sectionModalVisible}
          onCancel={closeSectionModal}
          footer={null}
          width={500}
        >
          <Form
            form={sectionForm}
            layout="vertical"
            onFinish={handleSectionSubmit}
          >
            <Form.Item
              name="section_name"
              label="ชื่อหมวดหัวข้อหลัก"
              rules={[
                { required: true, message: "กรุณากรอกชื่อหมวดหัวข้อหลัก" },
              ]}
            >
              <Input placeholder="กรอกชื่อหมวดหัวข้อหลัก" />
            </Form.Item>

            <Form.Item name="date" label="วันที่ (ไม่บังคับ)">
              <Input type="date" />
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

        {/* Sub Topic Modal */}
        <Modal
          title={editingSubTopic ? "แก้ไขหัวข้อย่อย" : "เพิ่มหัวข้อย่อยใหม่"}
          open={subTopicModalVisible}
          onCancel={closeSubTopicModal}
          footer={null}
          width={500}
        >
          <Form
            form={subTopicForm}
            layout="vertical"
            onFinish={handleSubTopicSubmit}
          >
            <Form.Item
              name="topic_name"
              label="ชื่อหัวข้อย่อย"
              rules={[{ required: true, message: "กรุณากรอกชื่อหัวข้อย่อย" }]}
            >
              <Input placeholder="กรอกชื่อหัวข้อย่อย" />
            </Form.Item>

            <Form.Item name="date" label="วันที่ (ไม่บังคับ)">
              <Input type="date" />
            </Form.Item>

            <div style={{ textAlign: "right", marginTop: 24 }}>
              <Space>
                <Button onClick={closeSubTopicModal}>ยกเลิก</Button>
                <Button type="primary" htmlType="submit">
                  {editingSubTopic ? "อัปเดต" : "เพิ่ม"}
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
              <FileUpload 
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                placeholder="เลือกไฟล์เอกสารผลการดำเนินงาน"
              />
            </Form.Item>

            <Form.Item
              name="files_type"
              label="ประเภทไฟล์"
              rules={[{ required: true, message: "กรุณาเลือกประเภทไฟล์" }]}
            >
              <Select placeholder="เลือกประเภทไฟล์">
                <Option value="pdf">PDF</Option>
                <Option value="doc">Word Document</Option>
                <Option value="docx">Word Document (DOCX)</Option>
                <Option value="xls">Excel</Option>
                <Option value="xlsx">Excel (XLSX)</Option>
                <Option value="jpg">JPEG Image</Option>
                <Option value="jpeg">JPEG Image</Option>
                <Option value="png">PNG Image</Option>
                <Option value="gif">GIF Image</Option>
                <Option value="txt">Text File</Option>
                <Option value="other">อื่นๆ</Option>
              </Select>
            </Form.Item>

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