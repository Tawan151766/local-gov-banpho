// Clone from ItaManagement for publish_docs
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

// API endpoints for publish_docs
const publishDocsAPI = {
  getDocs: async ({ page, limit, search }) => {
    const params = new URLSearchParams({ page, limit, search });
    const res = await fetch(`/api/publish-docs?${params}`);
    return await res.json();
  },
  createDoc: async (data) => {
    const res = await fetch('/api/publish-docs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },
  updateDoc: async (id, data) => {
    const res = await fetch(`/api/publish-docs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },
  deleteDoc: async (id) => {
    const res = await fetch(`/api/publish-docs/${id}`, { method: 'DELETE' });
    return await res.json();
  }
};

const publishDocsContentsAPI = {
  getContents: async ({ publishDocId, limit }) => {
    const params = new URLSearchParams({ publishDocId, limit });
    const res = await fetch(`/api/publish-docs-contents?${params}`);
    return await res.json();
  },
  createContent: async (data) => {
    const res = await fetch('/api/publish-docs-contents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },
  updateContent: async (id, data) => {
    const res = await fetch(`/api/publish-docs-contents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },
  deleteContent: async (id) => {
    const res = await fetch(`/api/publish-docs-contents/${id}`, { method: 'DELETE' });
    return await res.json();
  }
};

export default function PublishDocManagement() {
  // Data states
  const [docs, setDocs] = useState([]);
  const [contents, setContents] = useState([]);
  // Loading states
  const [loading, setLoading] = useState(false);
  const [contentsLoading, setContentsLoading] = useState(false);
  // Modal states
  const [docModalVisible, setDocModalVisible] = useState(false);
  const [contentModalVisible, setContentModalVisible] = useState(false);
  // Editing states
  const [editingDoc, setEditingDoc] = useState(null);
  const [editingContent, setEditingContent] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  // Navigation state
  const [currentLevel, setCurrentLevel] = useState('docs'); // docs, contents
  // Table states
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchText, setSearchText] = useState('');
  // Forms
  const [docForm] = Form.useForm();
  const [contentForm] = Form.useForm();
  const { message } = App.useApp();

  // Load docs
  const loadDocs = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const response = await publishDocsAPI.getDocs({ page, limit: pagination.pageSize, search });
      if (response.success) {
        setDocs(response.data);
        setPagination(prev => ({ ...prev, current: response.pagination.page, total: response.pagination.total }));
      }
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลเอกสารเผยแพร่ได้');
    } finally {
      setLoading(false);
    }
  };

  // Load contents for a specific doc
  const loadContents = async (publishDocId) => {
    setContentsLoading(true);
    try {
      const response = await publishDocsContentsAPI.getContents({ publishDocId, limit: 100 });
      if (response.success) {
        setContents(response.data);
      }
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลเนื้อหาได้');
    } finally {
      setContentsLoading(false);
    }
  };

  useEffect(() => { loadDocs(); }, []);

  // Handle search
  const handleSearch = (value) => {
    setSearchText(value);
    loadDocs(1, value);
  };

  // Handle pagination change
  const handleTableChange = (paginationInfo) => {
    setPagination((prev) => ({ ...prev, current: paginationInfo.current, pageSize: paginationInfo.pageSize }));
    loadDocs(paginationInfo.current, searchText);
  };

  // Navigation functions
  const navigateToContents = (doc) => {
    setSelectedDoc(doc);
    setCurrentLevel('contents');
    loadContents(doc.id);
  };

  const navigateBack = () => {
    setCurrentLevel('docs');
    setSelectedDoc(null);
    setContents([]);
  };

  // Modal management
  const openDocModal = (doc = null) => {
    setEditingDoc(doc);
    setDocModalVisible(true);
    if (doc) {
      docForm.setFieldsValue({
        name: doc.name,
        description: doc.description,
        publish_date: doc.publish_date ? dayjs(doc.publish_date) : null
      });
    } else {
      docForm.resetFields();
    }
  };
  const closeDocModal = () => {
    setDocModalVisible(false);
    setEditingDoc(null);
    docForm.resetFields();
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

  // Handle doc form submit
  const handleDocSubmit = async (values) => {
    try {
      const docData = {
        ...values,
        publish_date: values.publish_date ? values.publish_date.format('YYYY-MM-DD') : null
      };
      let response;
      if (editingDoc) {
        response = await publishDocsAPI.updateDoc(editingDoc.id, docData);
      } else {
        response = await publishDocsAPI.createDoc(docData);
      }
      if (response.success) {
        message.success(editingDoc ? 'อัปเดตเอกสารเผยแพร่สำเร็จ' : 'เพิ่มเอกสารเผยแพร่ใหม่สำเร็จ');
        loadDocs(pagination.current, searchText);
        closeDocModal();
      }
    } catch (error) {
      message.error('เกิดข้อผิดพลาด');
    }
  };

  // Handle doc delete
  const handleDocDelete = async (id) => {
    try {
      const response = await publishDocsAPI.deleteDoc(id);
      if (response.success) {
        message.success('ลบเอกสารเผยแพร่สำเร็จ');
        loadDocs(pagination.current, searchText);
      }
    } catch (error) {
      message.error('ไม่สามารถลบเอกสารเผยแพร่ได้');
    }
  };

  // Handle content form submit
  const handleContentSubmit = async (values) => {
    try {
      const contentData = {
        ...values,
        publish_doc_id: selectedDoc.id
      };
      let response;
      if (editingContent) {
        response = await publishDocsContentsAPI.updateContent(editingContent.id, contentData);
      } else {
        response = await publishDocsContentsAPI.createContent(contentData);
      }
      if (response.success) {
        message.success(editingContent ? 'อัปเดตเนื้อหาสำเร็จ' : 'เพิ่มเนื้อหาใหม่สำเร็จ');
        loadContents(selectedDoc.id);
        closeContentModal();
      }
    } catch (error) {
      message.error('เกิดข้อผิดพลาดในการจัดการเนื้อหา');
    }
  };

  // Handle content delete
  const handleContentDelete = async (id) => {
    try {
      const response = await publishDocsContentsAPI.deleteContent(id);
      if (response.success) {
        message.success('ลบเนื้อหาสำเร็จ');
        loadContents(selectedDoc.id);
      }
    } catch (error) {
      message.error('ไม่สามารถลบเนื้อหาได้');
    }
  };

  // Breadcrumb items
  const getBreadcrumbItems = () => {
    const items = [
      {
        title: 'เอกสารเผยแพร่',
        onClick: () => setCurrentLevel('docs')
      }
    ];
    if (selectedDoc) {
      items.push({
        title: selectedDoc.name,
        onClick: () => setCurrentLevel('contents')
      });
    }
    return items;
  };

  // Dynamic columns
  const getColumns = () => {
    if (currentLevel === 'docs') {
      return [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
        { title: 'ชื่อเอกสาร', dataIndex: 'name', key: 'name', render: (name) => <Text strong>{name}</Text> },
        { title: 'รายละเอียด', dataIndex: 'description', key: 'description', render: (description) => description || '-' },
        { title: 'วันที่เผยแพร่', dataIndex: 'publish_date', key: 'publish_date', render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '-' },
        { title: 'วันที่สร้าง', dataIndex: 'created_at', key: 'created_at', render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm') },
        { title: 'การจัดการ', key: 'actions', width: 250, render: (_, record) => (
          <Space>
            <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => navigateToContents(record)}>ดูเนื้อหา</Button>
            <Button type="default" size="small" icon={<EditOutlined />} onClick={() => openDocModal(record)}>แก้ไข</Button>
            <Popconfirm title="ยืนยันการลบ" description="คุณแน่ใจหรือไม่ที่จะลบเอกสารนี้? เนื้อหาทั้งหมดจะถูกลบด้วย" onConfirm={() => handleDocDelete(record.id)} okText="ลบ" cancelText="ยกเลิก">
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
      case 'docs': return docs;
      case 'contents': return contents;
      default: return [];
    }
  };
  // Get current loading
  const getCurrentLoading = () => {
    switch (currentLevel) {
      case 'docs': return loading;
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
            ระบบจัดการเอกสารเผยแพร่
          </Title>
          <Text type="secondary">จัดการข้อมูลเอกสารเผยแพร่และเนื้อหาประกอบ</Text>
        </div>

        {/* Breadcrumb Navigation */}
        {currentLevel !== 'docs' && (
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
              placeholder={currentLevel === 'docs' ? 'ค้นหาชื่อเอกสาร' : 'ค้นหาเนื้อหา'}
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
                if (currentLevel === 'docs') openDocModal();
                else if (currentLevel === 'contents') openContentModal();
              }}
            >
              {currentLevel === 'docs' ? 'เพิ่มเอกสารใหม่' : 'เพิ่มเนื้อหาใหม่'}
            </Button>
          </Col>
        </Row>

        <Table
          columns={getColumns()}
          dataSource={getCurrentData()}
          rowKey="id"
          loading={getCurrentLoading()}
          pagination={currentLevel === 'docs' ? {
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} จาก ${total} รายการ`,
          } : false}
          onChange={handleTableChange}
        />

        {/* Doc Modal */}
        <Modal
          title={editingDoc ? 'แก้ไขเอกสารเผยแพร่' : 'เพิ่มเอกสารเผยแพร่ใหม่'}
          open={docModalVisible}
          onCancel={closeDocModal}
          footer={null}
          width={600}
        >
          <Form
            form={docForm}
            layout="vertical"
            onFinish={handleDocSubmit}
          >
            <Form.Item
              name="name"
              label="ชื่อเอกสาร"
              rules={[{ required: true, message: 'กรุณากรอกชื่อเอกสาร' }]}
            >
              <Input placeholder="กรอกชื่อเอกสารเผยแพร่" />
            </Form.Item>
            <Form.Item
              name="description"
              label="รายละเอียด"
            >
              <TextArea rows={4} placeholder="กรอกรายละเอียดเอกสาร (ไม่บังคับ)" />
            </Form.Item>
            <Form.Item
              name="publish_date"
              label="วันที่เผยแพร่"
            >
              <DatePicker style={{ width: '100%' }} placeholder="เลือกวันที่เผยแพร่" format="DD/MM/YYYY" />
            </Form.Item>
            <div style={{ textAlign: 'right', marginTop: 24 }}>
              <Space>
                <Button onClick={closeDocModal}>ยกเลิก</Button>
                <Button type="primary" htmlType="submit">{editingDoc ? 'อัปเดต' : 'เพิ่ม'}</Button>
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
