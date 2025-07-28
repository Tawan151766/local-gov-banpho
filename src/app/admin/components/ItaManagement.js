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
  Drawer,
  List,
  Row,
  Col,
  DatePicker,
  Breadcrumb
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  FileProtectOutlined,
  LinkOutlined,
  EyeOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { itaEvaluationsAPI, itaContentsAPI, createItaTablesAPI } from '@/lib/api';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Search } = Input;
const { TextArea } = Input;

export default function ItaManagement() {
  // Data states
  const [evaluations, setEvaluations] = useState([]);
  const [contents, setContents] = useState([]);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [contentsLoading, setContentsLoading] = useState(false);
  const [tablesLoading, setTablesLoading] = useState(false);
  
  // Modal states
  const [evaluationModalVisible, setEvaluationModalVisible] = useState(false);
  const [contentModalVisible, setContentModalVisible] = useState(false);
  const [contentsDrawerVisible, setContentsDrawerVisible] = useState(false);
  
  // Editing states
  const [editingEvaluation, setEditingEvaluation] = useState(null);
  const [editingContent, setEditingContent] = useState(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  
  // Navigation state
  const [currentLevel, setCurrentLevel] = useState('evaluations'); // evaluations, contents
  
  // Table states
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchText, setSearchText] = useState('');
  const [tablesExist, setTablesExist] = useState(false);
  
  // Forms
  const [evaluationForm] = Form.useForm();
  const [contentForm] = Form.useForm();
  
  const { message } = App.useApp();

  // Check if tables exist
  const checkTables = async () => {
    setTablesLoading(true);
    try {
      const response = await createItaTablesAPI.checkTables();
      if (response.success) {
        setTablesExist(response.tablesExist.ita_evaluations && response.tablesExist.ita_contents);
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
      const response = await createItaTablesAPI.createTables();
      if (response.success) {
        message.success('สร้างตาราง ITA สำเร็จ');
        setTablesExist(true);
        loadEvaluations();
      }
    } catch (error) {
      message.error('ไม่สามารถสร้างตาราง ITA ได้');
      console.error('Error creating tables:', error);
    } finally {
      setTablesLoading(false);
    }
  };

  // Load evaluations
  const loadEvaluations = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const response = await itaEvaluationsAPI.getEvaluations({
        page,
        limit: pagination.pageSize,
        search,
        withContents: false
      });

      if (response.success) {
        setEvaluations(response.data);
        setPagination(prev => ({
          ...prev,
          current: response.pagination.page,
          total: response.pagination.total
        }));
      }
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลการประเมิน ITA ได้');
      console.error('Error loading evaluations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load contents for a specific evaluation
  const loadContents = async (evaluationId) => {
    setContentsLoading(true);
    try {
      const response = await itaContentsAPI.getContents({
        evaluationId,
        limit: 100 // Load all contents for the evaluation
      });

      if (response.success) {
        setContents(response.data);
      }
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลเนื้อหาได้');
      console.error('Error loading contents:', error);
    } finally {
      setContentsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    checkTables();
  }, []);

  useEffect(() => {
    if (tablesExist) {
      loadEvaluations();
    }
  }, [tablesExist]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle search
  const handleSearch = (value) => {
    setSearchText(value);
    if (currentLevel === 'evaluations') {
      loadEvaluations(1, value);
    }
  };

  // Handle pagination change
  const handleTableChange = (paginationInfo) => {
    if (currentLevel === 'evaluations') {
      loadEvaluations(paginationInfo.current, searchText);
    }
  };

  // Navigation functions
  const navigateToContents = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setCurrentLevel('contents');
    loadContents(evaluation.id);
  };

  const navigateBack = () => {
    setCurrentLevel('evaluations');
    setSelectedEvaluation(null);
    setContents([]);
  };

  // Modal management functions
  const openEvaluationModal = (evaluation = null) => {
    setEditingEvaluation(evaluation);
    setEvaluationModalVisible(true);
    
    if (evaluation) {
      evaluationForm.setFieldsValue({
        name: evaluation.name,
        description: evaluation.description,
        ita_date: evaluation.ita_date ? dayjs(evaluation.ita_date) : null
      });
    } else {
      evaluationForm.resetFields();
    }
  };

  const closeEvaluationModal = () => {
    setEvaluationModalVisible(false);
    setEditingEvaluation(null);
    evaluationForm.resetFields();
  };

  const openContentModal = (content = null) => {
    setEditingContent(content);
    setContentModalVisible(true);
    
    if (content) {
      contentForm.setFieldsValue({
        url: content.url,
        description: content.description
      });
    } else {
      contentForm.resetFields();
    }
  };

  const closeContentModal = () => {
    setContentModalVisible(false);
    setEditingContent(null);
    contentForm.resetFields();
  };

  // Handle evaluation form submit
  const handleEvaluationSubmit = async (values) => {
    try {
      const evaluationData = {
        ...values,
        ita_date: values.ita_date ? values.ita_date.format('YYYY-MM-DD') : null
      };

      if (editingEvaluation) {
        const response = await itaEvaluationsAPI.updateEvaluation(editingEvaluation.id, evaluationData);
        if (response.success) {
          message.success('อัปเดตการประเมิน ITA สำเร็จ');
          loadEvaluations(pagination.current, searchText);
          closeEvaluationModal();
        }
      } else {
        const response = await itaEvaluationsAPI.createEvaluation(evaluationData);
        if (response.success) {
          message.success('เพิ่มการประเมิน ITA ใหม่สำเร็จ');
          loadEvaluations(pagination.current, searchText);
          closeEvaluationModal();
        }
      }
    } catch (error) {
      message.error(error.message || 'เกิดข้อผิดพลาด');
    }
  };

  // Handle evaluation delete
  const handleEvaluationDelete = async (id) => {
    try {
      const response = await itaEvaluationsAPI.deleteEvaluation(id);
      if (response.success) {
        message.success('ลบการประเมิน ITA สำเร็จ');
        loadEvaluations(pagination.current, searchText);
      }
    } catch (error) {
      message.error(error.message || 'ไม่สามารถลบการประเมิน ITA ได้');
    }
  };

  // Handle content form submit
  const handleContentSubmit = async (values) => {
    try {
      const contentData = {
        ...values,
        evaluation_id: selectedEvaluation.id
      };

      if (editingContent) {
        const response = await itaContentsAPI.updateContent(editingContent.id, contentData);
        if (response.success) {
          message.success('อัปเดตเนื้อหาสำเร็จ');
          loadContents(selectedEvaluation.id);
          closeContentModal();
        }
      } else {
        const response = await itaContentsAPI.createContent(contentData);
        if (response.success) {
          message.success('เพิ่มเนื้อหาใหม่สำเร็จ');
          loadContents(selectedEvaluation.id);
          closeContentModal();
        }
      }
    } catch (error) {
      message.error(error.message || 'เกิดข้อผิดพลาดในการจัดการเนื้อหา');
    }
  };

  // Handle content delete
  const handleContentDelete = async (id) => {
    try {
      const response = await itaContentsAPI.deleteContent(id);
      if (response.success) {
        message.success('ลบเนื้อหาสำเร็จ');
        loadContents(selectedEvaluation.id);
      }
    } catch (error) {
      message.error(error.message || 'ไม่สามารถลบเนื้อหาได้');
    }
  };

  // Get breadcrumb items
  const getBreadcrumbItems = () => {
    const items = [
      {
        title: 'การประเมิน ITA',
        onClick: () => setCurrentLevel('evaluations')
      }
    ];

    if (selectedEvaluation) {
      items.push({
        title: selectedEvaluation.name,
        onClick: () => setCurrentLevel('contents')
      });
    }

    return items;
  };

  // Dynamic columns based on current level
  const getColumns = () => {
    if (currentLevel === 'evaluations') {
      return [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
          width: 80,
        },
        {
          title: 'ชื่อการประเมิน',
          dataIndex: 'name',
          key: 'name',
          render: (name) => <Text strong>{name}</Text>
        },
        {
          title: 'รายละเอียด',
          dataIndex: 'description',
          key: 'description',
          render: (description) => description || '-'
        },
        {
          title: 'วันที่ประเมิน',
          dataIndex: 'ita_date',
          key: 'ita_date',
          render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '-',
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
                onClick={() => navigateToContents(record)}
              >
                ดูเนื้อหา
              </Button>
              <Button
                type="default"
                size="small"
                icon={<EditOutlined />}
                onClick={() => openEvaluationModal(record)}
              >
                แก้ไข
              </Button>
              <Popconfirm
                title="ยืนยันการลบ"
                description="คุณแน่ใจหรือไม่ที่จะลบการประเมินนี้? เนื้อหาทั้งหมดจะถูกลบด้วย"
                onConfirm={() => handleEvaluationDelete(record.id)}
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
    } else if (currentLevel === 'contents') {
      return [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
          width: 80,
        },
        {
          title: 'URL/ลิงก์',
          dataIndex: 'url',
          key: 'url',
          render: (url) => (
            <Space>
              <LinkOutlined />
              <a href={url} target="_blank" rel="noopener noreferrer">
                {url.length > 50 ? `${url.substring(0, 50)}...` : url}
              </a>
            </Space>
          )
        },
        {
          title: 'รายละเอียด',
          dataIndex: 'description',
          key: 'description',
          render: (description) => description || '-'
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
                onClick={() => openContentModal(record)}
              >
                แก้ไข
              </Button>
              <Popconfirm
                title="ยืนยันการลบ"
                description="คุณแน่ใจหรือไม่ที่จะลบเนื้อหานี้?"
                onConfirm={() => handleContentDelete(record.id)}
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
      case 'evaluations':
        return evaluations;
      case 'contents':
        return contents;
      default:
        return [];
    }
  };

  // Get current loading state
  const getCurrentLoading = () => {
    switch (currentLevel) {
      case 'evaluations':
        return loading;
      case 'contents':
        return contentsLoading;
      default:
        return false;
    }
  };

  // If tables don't exist, show setup screen
  if (!tablesExist && !tablesLoading) {
    return (
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
          <FileProtectOutlined style={{ fontSize: '64px', color: '#1890ff' }} />
          <Title level={3}>ระบบจัดการ ITA</Title>
          <Text type="secondary">
            ยังไม่มีตารางข้อมูล ITA ในระบบ กรุณาสร้างตารางก่อนใช้งาน
          </Text>
          <Button
            type="primary"
            size="large"
            loading={tablesLoading}
            onClick={createTables}
          >
            สร้างตาราง ITA
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
            <FileProtectOutlined style={{ marginRight: 8 }} />
            จัดการข้อมูล ITA (Information Technology Assessment)
          </Title>
          <Text type="secondary">จัดการการประเมินความโปร่งใสในการดำเนินงานของหน่วยงานภาครัฐ</Text>
        </div>

        {/* Breadcrumb Navigation */}
        {currentLevel !== 'evaluations' && (
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
                currentLevel === 'evaluations' ? 'ค้นหาชื่อการประเมิน' : 'ค้นหาเนื้อหา'
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
                if (currentLevel === 'evaluations') openEvaluationModal();
                else if (currentLevel === 'contents') openContentModal();
              }}
            >
              {currentLevel === 'evaluations' ? 'เพิ่มการประเมินใหม่' : 'เพิ่มเนื้อหาใหม่'}
            </Button>
          </Col>
        </Row>

        <Table
          columns={getColumns()}
          dataSource={getCurrentData()}
          rowKey="id"
          loading={getCurrentLoading()}
          pagination={currentLevel === 'evaluations' ? {
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} จาก ${total} รายการ`,
          } : false}
          onChange={handleTableChange}
        />

        {/* Evaluation Modal */}
        <Modal
          title={editingEvaluation ? 'แก้ไขการประเมิน ITA' : 'เพิ่มการประเมิน ITA ใหม่'}
          open={evaluationModalVisible}
          onCancel={closeEvaluationModal}
          footer={null}
          width={600}
        >
          <Form
            form={evaluationForm}
            layout="vertical"
            onFinish={handleEvaluationSubmit}
          >
            <Form.Item
              name="name"
              label="ชื่อการประเมิน"
              rules={[{ required: true, message: 'กรุณากรอกชื่อการประเมิน' }]}
            >
              <Input placeholder="กรอกชื่อการประเมิน ITA" />
            </Form.Item>

            <Form.Item
              name="description"
              label="รายละเอียด"
            >
              <TextArea 
                rows={4} 
                placeholder="กรอกรายละเอียดการประเมิน (ไม่บังคับ)" 
              />
            </Form.Item>

            <Form.Item
              name="ita_date"
              label="วันที่ประเมิน"
            >
              <DatePicker 
                style={{ width: '100%' }}
                placeholder="เลือกวันที่ประเมิน"
                format="DD/MM/YYYY"
              />
            </Form.Item>

            <div style={{ textAlign: 'right', marginTop: 24 }}>
              <Space>
                <Button onClick={closeEvaluationModal}>
                  ยกเลิก
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingEvaluation ? 'อัปเดต' : 'เพิ่ม'}
                </Button>
              </Space>
            </div>
          </Form>
        </Modal>

        {/* Content Modal */}
        <Modal
          title={editingContent ? 'แก้ไขเนื้อหา' : 'เพิ่มเนื้อหาใหม่'}
          open={contentModalVisible}
          onCancel={closeContentModal}
          footer={null}
          width={600}
        >
          <Form
            form={contentForm}
            layout="vertical"
            onFinish={handleContentSubmit}
          >
            <Form.Item
              name="url"
              label="URL/ลิงก์"
              rules={[
                { required: true, message: 'กรุณากรอก URL หรือลิงก์' },
                { type: 'url', message: 'กรุณากรอก URL ที่ถูกต้อง' }
              ]}
            >
              <Input placeholder="https://example.com/document.pdf" />
            </Form.Item>

            <Form.Item
              name="description"
              label="รายละเอียด"
            >
              <TextArea 
                rows={3} 
                placeholder="กรอกรายละเอียดเนื้อหา (ไม่บังคับ)" 
              />
            </Form.Item>

            <div style={{ textAlign: 'right', marginTop: 24 }}>
              <Space>
                <Button onClick={closeContentModal}>
                  ยกเลิก
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingContent ? 'อัปเดต' : 'เพิ่ม'}
                </Button>
              </Space>
            </div>
          </Form>
        </Modal>
      </Space>
    </Card>
  );
}