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
  Divider
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  UserOutlined 
} from '@ant-design/icons';
import { userAPI } from '@/lib/api';

const { Title } = Typography;
const { Search } = Input;

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();
  const { message } = App.useApp();

  // Load users
  const loadUsers = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const response = await userAPI.getUsers({
        page,
        limit: pagination.pageSize,
        search
      });

      if (response.success) {
        setUsers(response.data);
        setPagination(prev => ({
          ...prev,
          current: response.pagination.page,
          total: response.pagination.total
        }));
      }
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลผู้ใช้งานได้');
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadUsers();
  }, []);

  // Handle search
  const handleSearch = (value) => {
    setSearchText(value);
    loadUsers(1, value);
  };

  // Handle pagination change
  const handleTableChange = (paginationInfo) => {
    loadUsers(paginationInfo.current, searchText);
  };

  // Open modal for create/edit
  const openModal = (user = null) => {
    setEditingUser(user);
    setModalVisible(true);
    
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email
      });
    } else {
      form.resetFields();
    }
  };

  // Close modal
  const closeModal = () => {
    setModalVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  // Handle form submit
  const handleSubmit = async (values) => {
    try {
      if (editingUser) {
        // Update user
        const response = await userAPI.updateUser(editingUser.id, values);
        if (response.success) {
          message.success('อัปเดตข้อมูลผู้ใช้งานสำเร็จ');
          loadUsers(pagination.current, searchText);
          closeModal();
        }
      } else {
        // Create user
        const response = await userAPI.createUser(values);
        if (response.success) {
          message.success('เพิ่มผู้ใช้งานใหม่สำเร็จ');
          loadUsers(pagination.current, searchText);
          closeModal();
        }
      }
    } catch (error) {
      message.error(error.message || 'เกิดข้อผิดพลาด');
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      const response = await userAPI.deleteUser(id);
      if (response.success) {
        message.success('ลบผู้ใช้งานสำเร็จ');
        loadUsers(pagination.current, searchText);
      }
    } catch (error) {
      message.error(error.message || 'ไม่สามารถลบผู้ใช้งานได้');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'ชื่อ',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'อีเมล',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'วันที่สร้าง',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleDateString('th-TH'),
    },
    {
      title: 'การจัดการ',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
          >
            แก้ไข
          </Button>
          <Popconfirm
            title="ยืนยันการลบ"
            description="คุณแน่ใจหรือไม่ที่จะลบผู้ใช้งานนี้?"
            onConfirm={() => handleDelete(record.id)}
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

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={3}>
            <UserOutlined style={{ marginRight: 8 }} />
            จัดการผู้ใช้งาน
          </Title>
        </div>

        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Search
            placeholder="ค้นหาชื่อหรืออีเมล"
            allowClear
            enterButton={<SearchOutlined />}
            size="middle"
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
          
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal()}
          >
            เพิ่มผู้ใช้งานใหม่
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={users}
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

        <Modal
          title={editingUser ? 'แก้ไขผู้ใช้งาน' : 'เพิ่มผู้ใช้งานใหม่'}
          open={modalVisible}
          onCancel={closeModal}
          footer={null}
          width={500}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="name"
              label="ชื่อ"
              rules={[{ required: true, message: 'กรุณากรอกชื่อ' }]}
            >
              <Input placeholder="กรอกชื่อ" />
            </Form.Item>

            <Form.Item
              name="email"
              label="อีเมล"
              rules={[
                { required: true, message: 'กรุณากรอกอีเมล' },
                { type: 'email', message: 'รูปแบบอีเมลไม่ถูกต้อง' }
              ]}
            >
              <Input placeholder="กรอกอีเมล" />
            </Form.Item>

            {!editingUser && (
              <Form.Item
                name="password"
                label="รหัสผ่าน"
                rules={[
                  { required: true, message: 'กรุณากรอกรหัสผ่าน' },
                  { min: 6, message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' }
                ]}
              >
                <Input.Password placeholder="กรอกรหัสผ่าน" />
              </Form.Item>
            )}

            {editingUser && (
              <Form.Item
                name="password"
                label="รหัสผ่านใหม่ (ไม่บังคับ)"
                rules={[
                  { min: 6, message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' }
                ]}
              >
                <Input.Password placeholder="กรอกรหัสผ่านใหม่ (ถ้าต้องการเปลี่ยน)" />
              </Form.Item>
            )}

            <Divider />

            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={closeModal}>
                ยกเลิก
              </Button>
              <Button type="primary" htmlType="submit">
                {editingUser ? 'อัปเดต' : 'เพิ่ม'}
              </Button>
            </Space>
          </Form>
        </Modal>
      </Space>
    </Card>
  );
}