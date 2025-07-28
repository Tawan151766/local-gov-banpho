'use client';

import { useState, useEffect } from 'react';
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
  DatePicker,
  Select,
  Breadcrumb,
  Tabs,
  Upload,
  Image
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  FileTextOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
  UploadOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  FilePdfOutlined
} from '@ant-design/icons';
import { 
  postTypesAPI, 
  postDetailsAPI, 
  createPostTablesAPI 
} from '@/lib/api';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Search } = Input;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

export default function PostManagement() {
  // Data states
  const [postTypes, setPostTypes] = useState([]);
  const [postDetails, setPostDetails] = useState([]);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [tablesLoading, setTablesLoading] = useState(false);
  
  // Modal states
  const [typeModalVisible, setTypeModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  
  // Editing states
  const [editingType, setEditingType] = useState(null);
  const [editingDetail, setEditingDetail] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  
  // Navigation state
  const [currentLevel, setCurrentLevel] = useState('types'); // types, details
  
  // Table states
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchText, setSearchText] = useState('');
  const [tablesExist, setTablesExist] = useState(false);
  
  // Forms
  const [typeForm] = Form.useForm();
  const [detailForm] = Form.useForm();
  
  const { message } = App.useApp();

  // Check if tables exist
  const checkTables = async () => {
    setTablesLoading(true);
    try {
      const response = await createPostTablesAPI.checkTables();
      if (response.success) {
        const allTablesExist = Object.values(response.tablesExist).every(exists => exists);
        setTablesExist(allTablesExist);
      }
    } catch (error) {
      console.error('Error checking tables:', error);
    } finally {
      setTablesLoading(false);
    }
  };

  // Create tables
  const createTables = async () => {
    setTablesLoading(true);
    try {
      const response = await createPostTablesAPI.createTables();
      if (response.success) {
        message.success('สร้างตาราง Post Management สำเร็จ');
        setTablesExist(true);
        loadPostTypes();
      }
    } catch (error) {
      message.error('ไม่สามารถสร้างตาราง Post Management ได้');
      console.error('Error creating tables:', error);
    } finally {
      setTablesLoading(false);
    }
  };

  // Load post types
  const loadPostTypes = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const response = await postTypesAPI.getPostTypes({
        page,
        limit: pagination.pageSize,
        search,
        withDetails: false
      });

      if (response.success) {
        setPostTypes(response.data);
        setPagination(prev => ({
          ...prev,
          current: response.pagination.page,
          total: response.pagination.total
        }));
      }
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลประเภทโพสต์ได้');
      console.error('Error loading post types:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load post details for a specific type
  const loadPostDetails = async (typeId, page = 1, search = '') => {
    setDetailsLoading(true);
    try {
      const response = await postDetailsAPI.getPostDetails({
        postTypeId: typeId,
        page,
        limit: pagination.pageSize,
        search,
        withMedia: true
      });

      if (response.success) {
        setPostDetails(response.data);
        setPagination(prev => ({
          ...prev,
          current: response.pagination.page,
          total: response.pagination.total
        }));
      }
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลโพสต์ได้');
      console.error('Error loading post details:', error);
    } finally {
      setDetailsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    checkTables();
  }, []);

  useEffect(() => {
    if (tablesExist) {
      loadPostTypes();
    }
  }, [tablesExist]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle search
  const handleSearch = (value) => {
    setSearchText(value);
    if (currentLevel === 'types') {
      loadPostTypes(1, value);
    } else if (currentLevel === 'details' && selectedType) {
      loadPostDetails(selectedType.id, 1, value);
    }
  };

  // Handle pagination change
  const handleTableChange = (paginationInfo) => {
    if (currentLevel === 'types') {
      loadPostTypes(paginationInfo.current, searchText);
    } else if (currentLevel === 'details' && selectedType) {
      loadPostDetails(selectedType.id, paginationInfo.current, searchText);
    }
  };

  // Navigation functions
  const navigateToDetails = (type) => {
    setSelectedType(type);
    setCurrentLevel('details');
    loadPostDetails(type.id);
  };

  const navigateBack = () => {
    setCurrentLevel('types');
    setSelectedType(null);
    setPostDetails([]);
    setSearchText('');
  };

  // Modal management functions
  const openTypeModal = (type = null) => {
    setEditingType(type);
    setTypeModalVisible(true);
    
    if (type) {
      typeForm.setFieldsValue({
        type_name: type.type_name
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

  const openDetailModal = (detail = null) => {
    setEditingDetail(detail);
    setDetailModalVisible(true);
    
    if (detail) {
      detailForm.setFieldsValue({
        title_name: detail.title_name,
        topic_name: detail.topic_name,
        details: detail.details,
        date: detail.date ? dayjs(detail.date) : null
      });
    } else {
      detailForm.resetFields();
    }
  };

  const closeDetailModal = () => {
    setDetailModalVisible(false);
    setEditingDetail(null);
    detailForm.resetFields();
  };

  // Handle type form submit
  const handleTypeSubmit = async (values) => {
    try {
      if (editingType) {
        const response = await postTypesAPI.updatePostType(editingType.id, values);
        if (response.success) {
          message.success('อัปเดตประเภทโพสต์สำเร็จ');
          loadPostTypes(pagination.current, searchText);
          closeTypeModal();
        }
      } else {
        const response = await postTypesAPI.createPostType(values);
        if (response.success) {
          message.success('เพิ่มประเภทโพสต์ใหม่สำเร็จ');
          loadPostTypes(pagination.current, searchText);
          closeTypeModal();
        }
      }
    } catch (error) {
      message.error(error.message || 'เกิดข้อผิดพลาด');
    }
  };

  // Handle type delete
  const handleTypeDelete = async (id) => {
    try {
      const response = await postTypesAPI.deletePostType(id);
      if (response.success) {
        message.success('ลบประเภทโพสต์สำเร็จ');
        loadPostTypes(pagination.current, searchText);
      }
    } catch (error) {
      message.error(error.message || 'ไม่สามารถลบประเภทโพสต์ได้');
    }
  };

  // Handle detail form submit
  const handleDetailSubmit = async (values) => {
    try {
      const detailData = {
        ...values,
        post_type_id: selectedType.id,
        date: values.date ? values.date.format('YYYY-MM-DD') : null
      };

      if (editingDetail) {
        const response = await postDetailsAPI.updatePostDetail(editingDetail.id, detailData);
        if (response.success) {
          message.success('อัปเดตโพสต์สำเร็จ');
          loadPostDetails(selectedType.id, pagination.current, searchText);
          closeDetailModal();
        }
      } else {
        const response = await postDetailsAPI.createPostDetail(detailData);
        if (response.success) {
          message.success('เพิ่มโพสต์ใหม่สำเร็จ');
          loadPostDetails(selectedType.id, pagination.current, searchText);
          closeDetailModal();
        }
      }
    } catch (error) {
      message.error(error.message || 'เกิดข้อผิดพลาดในการจัดการโพสต์');
    }
  };

  // Handle detail delete
  const handleDetailDelete = async (id) => {
    try {
      const response = await postDetailsAPI.deletePostDetail(id);
      if (response.success) {
        message.success('ลบโพสต์สำเร็จ');
        loadPostDetails(selectedType.id, pagination.current, searchText);
      }
    } catch (error) {
      message.error(error.message || 'ไม่สามารถลบโพสต์ได้');
    }
  };

  // Get breadcrumb items
  const getBreadcrumbItems = () => {
    const items = [
      {
        title: 'ประเภทโพสต์',
        onClick: () => setCurrentLevel('types')
      }
    ];

    if (selectedType) {
      items.push({
        title: selectedType.type_name,
        onClick: () => setCurrentLevel('details')
      });
    }

    return items;
  };

  // Dynamic columns based on current level
  const getColumns = () => {
    if (currentLevel === 'types') {
      return [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
          width: 80,
        },
        {
          title: 'ชื่อประเภท',
          dataIndex: 'type_name',
          key: 'type_name',
          render: (name) => <Text strong>{name}</Text>
        },
        {
          title: 'วันที่สร้าง',
          dataIndex: 'created_at',
          key: 'created_at',
          render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
        },
        {
          title: 'การจัดการ',
          key: 'actions',
          width: 250,
          render: (_, record) => (
            <Space>
              <Button
                type="primary"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => navigateToDetails(record)}
              >
                ดูโพสต์
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
                description="คุณแน่ใจหรือไม่ที่จะลบประเภทนี้? โพสต์ทั้งหมดจะถูกลบด้วย"
                onConfirm={() => handleTypeDelete(record.id)}
                okText="ลบ"
                cancelText="ยกเลิก"
              >
                <Button
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                >
                  ลบ
                </Button>
              </Popconfirm>
            </Space>
          ),
        },
      ];
    } else if (currentLevel === 'details') {
      return [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
          width: 80,
        },
        {
          title: 'หัวข้อ',
          dataIndex: 'title_name',
          key: 'title_name',
          render: (title) => <Text strong>{title}</Text>
        },
        {
          title: 'หัวข้อย่อย',
          dataIndex: 'topic_name',
          key: 'topic_name',
          render: (topic) => topic || '-'
        },
        {
          title: 'วันที่',
          dataIndex: 'date',
          key: 'date',
          render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '-',
        },
        {
          title: 'สื่อ',
          key: 'media',
          render: (_, record) => (
            <Space>
              {record.photos && record.photos.length > 0 && (
                <Tag color="blue" icon={<PictureOutlined />}>
                  รูป {record.photos.length}
                </Tag>
              )}
              {record.videos && record.videos.length > 0 && (
                <Tag color="red" icon={<VideoCameraOutlined />}>
                  วิดีโอ {record.videos.length}
                </Tag>
              )}
              {record.pdfs && record.pdfs.length > 0 && (
                <Tag color="orange" icon={<FilePdfOutlined />}>
                  PDF {record.pdfs.length}
                </Tag>
              )}
            </Space>
          )
        },
        {
          title: 'วันที่สร้าง',
          dataIndex: 'created_at',
          key: 'created_at',
          render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
        },
        {
          title: 'การจัดการ',
          key: 'actions',
          width: 200,
          render: (_, record) => (
            <Space>
              <Button
                type="default"
                size="small"
                icon={<EditOutlined />}
                onClick={() => openDetailModal(record)}
              >
                แก้ไข
              </Button>
              <Popconfirm
                title="ยืนยันการลบ"
                description="คุณแน่ใจหรือไม่ที่จะลบโพสต์นี้? ไฟล์สื่อทั้งหมดจะถูกลบด้วย"
                onConfirm={() => handleDetailDelete(record.id)}
                okText="ลบ"
                cancelText="ยกเลิก"
              >
                <Button
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                >
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
      case 'types':
        return postTypes;
      case 'details':
        return postDetails;
      default:
        return [];
    }
  };

  // Get current loading state
  const getCurrentLoading = () => {
    switch (currentLevel) {
      case 'types':
        return loading;
      case 'details':
        return detailsLoading;
      default:
        return false;
    }
  };

  // If tables don't exist, show setup screen
  if (!tablesExist && !tablesLoading) {
    return (
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
          <FileTextOutlined style={{ fontSize: '64px', color: '#1890ff' }} />
          <Title level={3}>ระบบจัดการโพสต์</Title>
          <Text type="secondary">
            ยังไม่มีตารางข้อมูลโพสต์ในระบบ กรุณาสร้างตารางก่อนใช้งาน
          </Text>
          <Button
            type="primary"
            size="large"
            loading={tablesLoading}
            onClick={createTables}
          >
            สร้างตารางโพสต์
          </Button>
        </Space>
      </Card>
    );
  }

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={3}>
            <FileTextOutlined style={{ marginRight: 8 }} />
            จัดการโพสต์และเนื้อหา
          </Title>
          <Text type="secondary">จัดการประเภทโพสต์ เนื้อหา และไฟล์สื่อต่างๆ</Text>
        </div>

        {/* Breadcrumb Navigation */}
        {currentLevel !== 'types' && (
          <Row gutter={16} align="middle">
            <Col>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={navigateBack}
              >
                ย้อนกลับ
              </Button>
            </Col>
            <Col flex="auto">
              <Breadcrumb
                items={getBreadcrumbItems()}
                style={{ fontSize: '14px' }}
              />
            </Col>
          </Row>
        )}

        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Search
              placeholder={
                currentLevel === 'types' ? 'ค้นหาชื่อประเภท' : 'ค้นหาหัวข้อโพสต์'
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
                if (currentLevel === 'types') openTypeModal();
                else if (currentLevel === 'details') openDetailModal();
              }}
            >
              {currentLevel === 'types' ? 'เพิ่มประเภทใหม่' : 'เพิ่มโพสต์ใหม่'}
            </Button>
          </Col>
        </Row>

        <Table
          columns={getColumns()}
          dataSource={getCurrentData()}
          rowKey="id"
          loading={getCurrentLoading()}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} จาก ${total} รายการ`,
          }}
          onChange={handleTableChange}
        />

        {/* Post Type Modal */}
        <Modal
          title={editingType ? 'แก้ไขประเภทโพสต์' : 'เพิ่มประเภทโพสต์ใหม่'}
          open={typeModalVisible}
          onCancel={closeTypeModal}
          footer={null}
          width={500}
        >
          <Form
            form={typeForm}
            layout="vertical"
            onFinish={handleTypeSubmit}
          >
            <Form.Item
              name="type_name"
              label="ชื่อประเภท"
              rules={[{ required: true, message: 'กรุณากรอกชื่อประเภท' }]}
            >
              <Input placeholder="กรอกชื่อประเภทโพสต์" />
            </Form.Item>

            <div style={{ textAlign: 'right', marginTop: 24 }}>
              <Space>
                <Button onClick={closeTypeModal}>
                  ยกเลิก
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingType ? 'อัปเดต' : 'เพิ่ม'}
                </Button>
              </Space>
            </div>
          </Form>
        </Modal>

        {/* Post Detail Modal */}
        <Modal
          title={editingDetail ? 'แก้ไขโพสต์' : 'เพิ่มโพสต์ใหม่'}
          open={detailModalVisible}
          onCancel={closeDetailModal}
          footer={null}
          width={800}
        >
          <Form
            form={detailForm}
            layout="vertical"
            onFinish={handleDetailSubmit}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="title_name"
                  label="หัวข้อหลัก"
                  rules={[{ required: true, message: 'กรุณากรอกหัวข้อหลัก' }]}
                >
                  <Input placeholder="กรอกหัวข้อหลัก" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="topic_name"
                  label="หัวข้อย่อย"
                >
                  <Input placeholder="กรอกหัวข้อย่อย (ไม่บังคับ)" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="date"
              label="วันที่"
            >
              <DatePicker 
                style={{ width: '100%' }}
                placeholder="เลือกวันที่"
                format="DD/MM/YYYY"
              />
            </Form.Item>

            <Form.Item
              name="details"
              label="รายละเอียด"
            >
              <TextArea 
                rows={6} 
                placeholder="กรอกรายละเอียดเนื้อหา (ไม่บังคับ)" 
              />
            </Form.Item>

            <div style={{ textAlign: 'right', marginTop: 24 }}>
              <Space>
                <Button onClick={closeDetailModal}>
                  ยกเลิก
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingDetail ? 'อัปเดต' : 'เพิ่ม'}
                </Button>
              </Space>
            </div>
          </Form>
        </Modal>
      </Space>
    </Card>
  );
}