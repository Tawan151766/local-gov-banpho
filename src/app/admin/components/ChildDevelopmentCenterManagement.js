
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
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
  LinkOutlined,
  EyeOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
const { Title, Text } = Typography;
const { Search } = Input;
const { TextArea } = Input;

const apiBase = '/api/child-development-centers';
const contentsApiBase = '/api/child-development-centers-contents';

const childCentersAPI = {
  getCenters: async ({ page, limit, search }) => {
    const params = new URLSearchParams({ page, limit, search });
    const res = await fetch(`${apiBase}?${params}`);
    return await res.json();
  },
  createCenter: async (data) => {
    const res = await fetch(apiBase, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },
  updateCenter: async (id, data) => {
    const res = await fetch(`${apiBase}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },
  deleteCenter: async (id) => {
    const res = await fetch(`${apiBase}/${id}`, { method: 'DELETE' });
    return await res.json();
  }
};

const childCentersContentsAPI = {
  getContents: async ({ childCenterId, limit }) => {
    const params = new URLSearchParams({ childCenterId, limit });
    const res = await fetch(`${contentsApiBase}?${params}`);
    return await res.json();
  },
  createContent: async (data) => {
    const res = await fetch(contentsApiBase, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },
  updateContent: async (id, data) => {
    const res = await fetch(`${contentsApiBase}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },
  deleteContent: async (id) => {
    const res = await fetch(`${contentsApiBase}/${id}`, { method: 'DELETE' });
    return await res.json();
  }
};

export default function ChildDevelopmentCenterManagement() {
  // Data states
  const [centers, setCenters] = useState([]);
  const [contents, setContents] = useState([]);
  // Loading states
  const [loading, setLoading] = useState(false);
  const [contentsLoading, setContentsLoading] = useState(false);
  // Modal states
  const [centerModalVisible, setCenterModalVisible] = useState(false);
  const [contentModalVisible, setContentModalVisible] = useState(false);
  // Editing states
  const [editingCenter, setEditingCenter] = useState(null);
  const [editingContent, setEditingContent] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState(null);
  // Navigation state
  const [currentLevel, setCurrentLevel] = useState('centers'); // centers, contents
  // Table states
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchText, setSearchText] = useState('');
  // Forms
  const [centerForm] = Form.useForm();
  const [contentForm] = Form.useForm();
  const { message } = App.useApp();

  // Load centers
  const loadCenters = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const response = await childCentersAPI.getCenters({ page, limit: pagination.pageSize, search });
      if (response.success) {
        setCenters(response.data);
        setPagination(prev => ({ ...prev, current: response.pagination.page, total: response.pagination.total }));
      }
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลศูนย์ได้');
    } finally {
      setLoading(false);
    }
  };

  // Load contents for a specific center
  const loadContents = async (childCenterId) => {
    setContentsLoading(true);
    try {
      const response = await childCentersContentsAPI.getContents({ childCenterId, limit: 100 });
      if (response.success) {
        setContents(response.data);
      }
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลเนื้อหาได้');
    } finally {
      setContentsLoading(false);
    }
  };

  useEffect(() => { loadCenters(); }, []);

  // Handle search
  const handleSearch = (value) => {
    setSearchText(value);
    loadCenters(1, value);
  };

  // Handle pagination change
  const handleTableChange = (paginationInfo) => {
    setPagination((prev) => ({ ...prev, current: paginationInfo.current, pageSize: paginationInfo.pageSize }));
    loadCenters(paginationInfo.current, searchText);
  };

  // Navigation functions
  const navigateToContents = (center) => {
    setSelectedCenter(center);
    setCurrentLevel('contents');
    loadContents(center.id);
  };

  const navigateBack = () => {
    setCurrentLevel('centers');
    setSelectedCenter(null);
    setContents([]);
  };

  // Modal management
  const openCenterModal = (center = null) => {
    setEditingCenter(center);
    setCenterModalVisible(true);
    if (center) {
      centerForm.setFieldsValue({
        name: center.name,
        description: center.description,
        center_date: center.center_date ? dayjs(center.center_date) : null
      });
    } else {
      centerForm.resetFields();
    }
  };
  const closeCenterModal = () => {
    setCenterModalVisible(false);
    setEditingCenter(null);
    centerForm.resetFields();
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

  // Handle center form submit
  const handleCenterSubmit = async (values) => {
    try {
      const centerData = {
        ...values,
        center_date: values.center_date ? values.center_date.format('YYYY-MM-DD') : null
      };
      let response;
      if (editingCenter) {
        response = await childCentersAPI.updateCenter(editingCenter.id, centerData);
      } else {
        response = await childCentersAPI.createCenter(centerData);
      }
      if (response.success) {
        message.success(editingCenter ? 'อัปเดตศูนย์สำเร็จ' : 'เพิ่มศูนย์ใหม่สำเร็จ');
        loadCenters(pagination.current, searchText);
        closeCenterModal();
      }
    } catch (error) {
      message.error('เกิดข้อผิดพลาด');
    }
  };

  // Handle center delete
  const handleCenterDelete = async (id) => {
    try {
      const response = await childCentersAPI.deleteCenter(id);
      if (response.success) {
        message.success('ลบศูนย์สำเร็จ');
        loadCenters(pagination.current, searchText);
      }
    } catch (error) {
      message.error('ไม่สามารถลบศูนย์ได้');
    }
  };

  // Handle content form submit
  const handleContentSubmit = async (values) => {
    try {
      const contentData = {
        ...values,
        child_center_id: selectedCenter.id
      };
      let response;
      if (editingContent) {
        response = await childCentersContentsAPI.updateContent(editingContent.id, contentData);
      } else {
        response = await childCentersContentsAPI.createContent(contentData);
      }
      if (response.success) {
        message.success(editingContent ? 'อัปเดตเนื้อหาสำเร็จ' : 'เพิ่มเนื้อหาใหม่สำเร็จ');
        loadContents(selectedCenter.id);
        closeContentModal();
      }
    } catch (error) {
      message.error('เกิดข้อผิดพลาดในการจัดการเนื้อหา');
    }
  };

  // Handle content delete
  const handleContentDelete = async (id) => {
    try {
      const response = await childCentersContentsAPI.deleteContent(id);
      if (response.success) {
        message.success('ลบเนื้อหาสำเร็จ');
        loadContents(selectedCenter.id);
      }
    } catch (error) {
      message.error('ไม่สามารถลบเนื้อหาได้');
    }
  };

  // Breadcrumb items
  const getBreadcrumbItems = () => {
    const items = [
      {
        title: 'ศูนย์พัฒนาเด็กเล็ก',
        onClick: () => setCurrentLevel('centers')
      }
    ];
    if (selectedCenter) {
      items.push({
        title: selectedCenter.name,
        onClick: () => setCurrentLevel('contents')
      });
    }
    return items;
  };

  // Dynamic columns
  const getColumns = () => {
    if (currentLevel === 'centers') {
      return [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
        { title: 'ชื่อศูนย์', dataIndex: 'name', key: 'name', render: (name) => <Text strong>{name}</Text> },
        { title: 'รายละเอียด', dataIndex: 'description', key: 'description', render: (description) => description || '-' },
        { title: 'วันที่', dataIndex: 'center_date', key: 'center_date', render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '-' },
        { title: 'วันที่สร้าง', dataIndex: 'created_at', key: 'created_at', render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm') },
        { title: 'การจัดการ', key: 'actions', width: 250, render: (_, record) => (
          <Space>
            <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => navigateToContents(record)}>ดูเนื้อหา</Button>
            <Button type="default" size="small" icon={<EditOutlined />} onClick={() => openCenterModal(record)}>แก้ไข</Button>
            <Popconfirm title="ยืนยันการลบ" description="คุณแน่ใจหรือไม่ที่จะลบศูนย์นี้? เนื้อหาทั้งหมดจะถูกลบด้วย" onConfirm={() => handleCenterDelete(record.id)} okText="ลบ" cancelText="ยกเลิก">
              <Button danger size="small" icon={<DeleteOutlined />}>ลบ</Button>
            </Popconfirm>
          </Space>
        ) }
      ];
    } else if (currentLevel === 'contents') {
      return [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
        { title: 'URL/ลิงก์', dataIndex: 'url', key: 'url', render: (url) => (
          <Space>
            <LinkOutlined />
            <a href={url} target="_blank" rel="noopener noreferrer">{url.length > 50 ? `${url.substring(0, 50)}...` : url}</a>
          </Space>
        ) },
        { title: 'รายละเอียด', dataIndex: 'description', key: 'description', render: (description) => description || '-' },
        { title: 'วันที่สร้าง', dataIndex: 'created_at', key: 'created_at', render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm') },
        { title: 'การจัดการ', key: 'actions', width: 200, render: (_, record) => (
          <Space>
            <Button type="default" size="small" icon={<EditOutlined />} onClick={() => openContentModal(record)}>แก้ไข</Button>
            <Popconfirm title="ยืนยันการลบ" description="คุณแน่ใจหรือไม่ที่จะลบเนื้อหานี้?" onConfirm={() => handleContentDelete(record.id)} okText="ลบ" cancelText="ยกเลิก">
              <Button danger size="small" icon={<DeleteOutlined />}>ลบ</Button>
            </Popconfirm>
          </Space>
        ) }
      ];
    }
    return [];
  };

  // Get current data
  const getCurrentData = () => {
    switch (currentLevel) {
      case 'centers': return centers;
      case 'contents': return contents;
      default: return [];
    }
  };
  // Get current loading
  const getCurrentLoading = () => {
    switch (currentLevel) {
      case 'centers': return loading;
      case 'contents': return contentsLoading;
      default: return false;
    }
  };

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={3}>
            ระบบจัดการศูนย์พัฒนาเด็กเล็ก
          </Title>
          <Text type="secondary">จัดการข้อมูลศูนย์และเนื้อหาประกอบ</Text>
        </div>

        {/* Breadcrumb Navigation */}
        {currentLevel !== 'centers' && (
          <Row gutter={16} align="middle">
            <Col>
              <Button icon={<ArrowLeftOutlined />} onClick={navigateBack}>ย้อนกลับ</Button>
            </Col>
            <Col flex="auto">
              <Breadcrumb items={getBreadcrumbItems()} style={{ fontSize: '14px' }} />
            </Col>
          </Row>
        )}

        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Search
              placeholder={currentLevel === 'centers' ? 'ค้นหาชื่อศูนย์' : 'ค้นหาเนื้อหา'}
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
                if (currentLevel === 'centers') openCenterModal();
                else if (currentLevel === 'contents') openContentModal();
              }}
            >
              {currentLevel === 'centers' ? 'เพิ่มศูนย์ใหม่' : 'เพิ่มเนื้อหาใหม่'}
            </Button>
          </Col>
        </Row>

        <Table
          columns={getColumns()}
          dataSource={getCurrentData()}
          rowKey="id"
          loading={getCurrentLoading()}
          pagination={currentLevel === 'centers' ? {
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} จาก ${total} รายการ`,
          } : false}
          onChange={handleTableChange}
        />

        {/* Center Modal */}
        <Modal
          title={editingCenter ? 'แก้ไขศูนย์' : 'เพิ่มศูนย์ใหม่'}
          open={centerModalVisible}
          onCancel={closeCenterModal}
          footer={null}
          width={600}
        >
          <Form
            form={centerForm}
            layout="vertical"
            onFinish={handleCenterSubmit}
          >
            <Form.Item
              name="name"
              label="ชื่อศูนย์"
              rules={[{ required: true, message: 'กรุณากรอกชื่อศูนย์' }]}
            >
              <Input placeholder="กรอกชื่อศูนย์" />
            </Form.Item>
            <Form.Item
              name="description"
              label="รายละเอียด"
            >
              <TextArea rows={4} placeholder="กรอกรายละเอียด (ไม่บังคับ)" />
            </Form.Item>
            <Form.Item
              name="center_date"
              label="วันที่"
            >
              <DatePicker style={{ width: '100%' }} placeholder="เลือกวันที่" format="DD/MM/YYYY" />
            </Form.Item>
            <div style={{ textAlign: 'right', marginTop: 24 }}>
              <Space>
                <Button onClick={closeCenterModal}>ยกเลิก</Button>
                <Button type="primary" htmlType="submit">{editingCenter ? 'อัปเดต' : 'เพิ่ม'}</Button>
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
              <TextArea rows={3} placeholder="กรอกรายละเอียดเนื้อหา (ไม่บังคับ)" />
            </Form.Item>
            <div style={{ textAlign: 'right', marginTop: 24 }}>
              <Space>
                <Button onClick={closeContentModal}>ยกเลิก</Button>
                <Button type="primary" htmlType="submit">{editingContent ? 'อัปเดต' : 'เพิ่ม'}</Button>
              </Space>
            </div>
          </Form>
        </Modal>
      </Space>
    </Card>
  );
}
