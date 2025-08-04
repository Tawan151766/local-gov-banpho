// Clone from PublishDocManagement for external works
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
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Search } = Input;
const { TextArea } = Input;

const externalWorksAPI = {
  getWorks: async ({ page, limit, search }) => {
    const params = new URLSearchParams({ page, limit, search });
    const res = await fetch(`/api/external-works?${params}`);
    return await res.json();
  },
  createWork: async (data) => {
    const res = await fetch('/api/external-works', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },
  updateWork: async (id, data) => {
    const res = await fetch(`/api/external-works/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },
  deleteWork: async (id) => {
    const res = await fetch(`/api/external-works/${id}`, { method: 'DELETE' });
    return await res.json();
  }
};

const externalWorksContentsAPI = {
  getContents: async ({ externalWorkId, limit }) => {
    const params = new URLSearchParams({ externalWorkId, limit });
    const res = await fetch(`/api/external-works-contents?${params}`);
    return await res.json();
  },
  createContent: async (data) => {
    const res = await fetch('/api/external-works-contents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },
  updateContent: async (id, data) => {
    const res = await fetch(`/api/external-works-contents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },
  deleteContent: async (id) => {
    const res = await fetch(`/api/external-works-contents/${id}`, { method: 'DELETE' });
    return await res.json();
  }
};

export default function ExternalWorkManagement() {
  // Data states
  const [works, setWorks] = useState([]);
  const [contents, setContents] = useState([]);
  // Loading states
  const [loading, setLoading] = useState(false);
  const [contentsLoading, setContentsLoading] = useState(false);
  // Modal states
  const [workModalVisible, setWorkModalVisible] = useState(false);
  const [contentModalVisible, setContentModalVisible] = useState(false);
  // Editing states
  const [editingWork, setEditingWork] = useState(null);
  const [editingContent, setEditingContent] = useState(null);
  const [selectedWork, setSelectedWork] = useState(null);
  // Navigation state
  const [currentLevel, setCurrentLevel] = useState('works'); // works, contents
  // Table states
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchText, setSearchText] = useState('');
  // Forms
  const [workForm] = Form.useForm();
  const [contentForm] = Form.useForm();
  const { message } = App.useApp();

  // Load works
  const loadWorks = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const response = await externalWorksAPI.getWorks({ page, limit: pagination.pageSize, search });
      if (response.success) {
        setWorks(response.data);
        setPagination(prev => ({ ...prev, current: response.pagination.page, total: response.pagination.total }));
      }
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลงานภายนอกได้');
    } finally {
      setLoading(false);
    }
  };

  // Load contents for a specific work
  const loadContents = async (externalWorkId) => {
    setContentsLoading(true);
    try {
      const response = await externalWorksContentsAPI.getContents({ externalWorkId, limit: 100 });
      if (response.success) {
        setContents(response.data);
      }
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลเนื้อหาได้');
    } finally {
      setContentsLoading(false);
    }
  };

  useEffect(() => { loadWorks(); }, []);

  // Handle search
  const handleSearch = (value) => {
    setSearchText(value);
    loadWorks(1, value);
  };

  // Handle pagination change
  const handleTableChange = (paginationInfo) => {
    setPagination((prev) => ({ ...prev, current: paginationInfo.current, pageSize: paginationInfo.pageSize }));
    loadWorks(paginationInfo.current, searchText);
  };

  // Navigation functions
  const navigateToContents = (work) => {
    setSelectedWork(work);
    setCurrentLevel('contents');
    loadContents(work.id);
  };

  const navigateBack = () => {
    setCurrentLevel('works');
    setSelectedWork(null);
    setContents([]);
  };

  // Modal management
  const openWorkModal = (work = null) => {
    setEditingWork(work);
    setWorkModalVisible(true);
    if (work) {
      workForm.setFieldsValue({
        name: work.name,
        description: work.description,
        work_date: work.work_date ? dayjs(work.work_date) : null
      });
    } else {
      workForm.resetFields();
    }
  };
  const closeWorkModal = () => {
    setWorkModalVisible(false);
    setEditingWork(null);
    workForm.resetFields();
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

  // Handle work form submit
  const handleWorkSubmit = async (values) => {
    try {
      const workData = {
        ...values,
        work_date: values.work_date ? values.work_date.format('YYYY-MM-DD') : null
      };
      let response;
      if (editingWork) {
        response = await externalWorksAPI.updateWork(editingWork.id, workData);
      } else {
        response = await externalWorksAPI.createWork(workData);
      }
      if (response.success) {
        message.success(editingWork ? 'อัปเดตงานภายนอกสำเร็จ' : 'เพิ่มงานภายนอกใหม่สำเร็จ');
        loadWorks(pagination.current, searchText);
        closeWorkModal();
      }
    } catch (error) {
      message.error('เกิดข้อผิดพลาด');
    }
  };

  // Handle work delete
  const handleWorkDelete = async (id) => {
    try {
      const response = await externalWorksAPI.deleteWork(id);
      if (response.success) {
        message.success('ลบงานภายนอกสำเร็จ');
        loadWorks(pagination.current, searchText);
      }
    } catch (error) {
      message.error('ไม่สามารถลบงานภายนอกได้');
    }
  };

  // Handle content form submit
  const handleContentSubmit = async (values) => {
    try {
      const contentData = {
        ...values,
        external_work_id: selectedWork.id
      };
      let response;
      if (editingContent) {
        response = await externalWorksContentsAPI.updateContent(editingContent.id, contentData);
      } else {
        response = await externalWorksContentsAPI.createContent(contentData);
      }
      if (response.success) {
        message.success(editingContent ? 'อัปเดตเนื้อหาสำเร็จ' : 'เพิ่มเนื้อหาใหม่สำเร็จ');
        loadContents(selectedWork.id);
        closeContentModal();
      }
    } catch (error) {
      message.error('เกิดข้อผิดพลาดในการจัดการเนื้อหา');
    }
  };

  // Handle content delete
  const handleContentDelete = async (id) => {
    try {
      const response = await externalWorksContentsAPI.deleteContent(id);
      if (response.success) {
        message.success('ลบเนื้อหาสำเร็จ');
        loadContents(selectedWork.id);
      }
    } catch (error) {
      message.error('ไม่สามารถลบเนื้อหาได้');
    }
  };

  // Breadcrumb items
  const getBreadcrumbItems = () => {
    const items = [
      {
        title: 'งานภายนอก',
        onClick: () => setCurrentLevel('works')
      }
    ];
    if (selectedWork) {
      items.push({
        title: selectedWork.name,
        onClick: () => setCurrentLevel('contents')
      });
    }
    return items;
  };

  // Dynamic columns
  const getColumns = () => {
    if (currentLevel === 'works') {
      return [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
        { title: 'ชื่องาน', dataIndex: 'name', key: 'name', render: (name) => <Text strong>{name}</Text> },
        { title: 'รายละเอียด', dataIndex: 'description', key: 'description', render: (description) => description || '-' },
        { title: 'วันที่งาน', dataIndex: 'work_date', key: 'work_date', render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '-' },
        { title: 'วันที่สร้าง', dataIndex: 'created_at', key: 'created_at', render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm') },
        { title: 'การจัดการ', key: 'actions', width: 250, render: (_, record) => (
          <Space>
            <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => navigateToContents(record)}>ดูเนื้อหา</Button>
            <Button type="default" size="small" icon={<EditOutlined />} onClick={() => openWorkModal(record)}>แก้ไข</Button>
            <Popconfirm title="ยืนยันการลบ" description="คุณแน่ใจหรือไม่ที่จะลบงานนี้? เนื้อหาทั้งหมดจะถูกลบด้วย" onConfirm={() => handleWorkDelete(record.id)} okText="ลบ" cancelText="ยกเลิก">
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
      case 'works': return works;
      case 'contents': return contents;
      default: return [];
    }
  };
  // Get current loading
  const getCurrentLoading = () => {
    switch (currentLevel) {
      case 'works': return loading;
      case 'contents': return contentsLoading;
      default: return false;
    }
  };

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={3}>
            <FileProtectOutlined style={{ marginRight: 8 }} />
            ระบบตรวจสอบงานภายนอก
          </Title>
          <Text type="secondary">จัดการข้อมูลงานภายนอกและเนื้อหาประกอบ</Text>
        </div>

        {/* Breadcrumb Navigation */}
        {currentLevel !== 'works' && (
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
              placeholder={currentLevel === 'works' ? 'ค้นหาชื่องาน' : 'ค้นหาเนื้อหา'}
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
                if (currentLevel === 'works') openWorkModal();
                else if (currentLevel === 'contents') openContentModal();
              }}
            >
              {currentLevel === 'works' ? 'เพิ่มงานใหม่' : 'เพิ่มเนื้อหาใหม่'}
            </Button>
          </Col>
        </Row>

        <Table
          columns={getColumns()}
          dataSource={getCurrentData()}
          rowKey="id"
          loading={getCurrentLoading()}
          pagination={currentLevel === 'works' ? {
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} จาก ${total} รายการ`,
          } : false}
          onChange={handleTableChange}
        />

        {/* Work Modal */}
        <Modal
          title={editingWork ? 'แก้ไขงานภายนอก' : 'เพิ่มงานภายนอกใหม่'}
          open={workModalVisible}
          onCancel={closeWorkModal}
          footer={null}
          width={600}
        >
          <Form
            form={workForm}
            layout="vertical"
            onFinish={handleWorkSubmit}
          >
            <Form.Item
              name="name"
              label="ชื่องาน"
              rules={[{ required: true, message: 'กรุณากรอกชื่องาน' }]}
            >
              <Input placeholder="กรอกชื่องานภายนอก" />
            </Form.Item>
            <Form.Item
              name="description"
              label="รายละเอียด"
            >
              <TextArea rows={4} placeholder="กรอกรายละเอียดงาน (ไม่บังคับ)" />
            </Form.Item>
            <Form.Item
              name="work_date"
              label="วันที่งาน"
            >
              <DatePicker style={{ width: '100%' }} placeholder="เลือกวันที่งาน" format="DD/MM/YYYY" />
            </Form.Item>
            <div style={{ textAlign: 'right', marginTop: 24 }}>
              <Space>
                <Button onClick={closeWorkModal}>ยกเลิก</Button>
                <Button type="primary" htmlType="submit">{editingWork ? 'อัปเดต' : 'เพิ่ม'}</Button>
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
