'use client';

import { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select,
  App,
  Space, 
  Popconfirm,
  Card,
  Typography,
  Avatar,
  Tag,
  Row,
  Col
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  TeamOutlined,
  PhoneOutlined,
  UserOutlined
} from '@ant-design/icons';
import { staffAPI } from '@/lib/api';
import ImageUpload from './ImageUpload';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchText, setSearchText] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const roles = staffAPI.getRoles();

  // Load staff
  const loadStaff = async (page = 1, search = '', role = '') => {
    setLoading(true);
    try {
      const response = await staffAPI.getStaff({
        page,
        limit: pagination.pageSize,
        search,
        role
      });

      if (response.success) {
        setStaff(response.data);
        setPagination(prev => ({
          ...prev,
          current: response.pagination.page,
          total: response.pagination.total
        }));
      }
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลบุคลากรได้');
      console.error('Error loading staff:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadStaff();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle search
  const handleSearch = (value) => {
    setSearchText(value);
    loadStaff(1, value, selectedRole);
  };

  // Handle role filter
  const handleRoleFilter = (value) => {
    setSelectedRole(value);
    loadStaff(1, searchText, value);
  };

  // Handle pagination change
  const handleTableChange = (paginationInfo) => {
    setPagination((prev) => ({
      ...prev,
      current: paginationInfo.current,
      pageSize: paginationInfo.pageSize,
    }));
    loadStaff(paginationInfo.current, searchText, selectedRole);
  };

  // Open modal for create/edit
  const openModal = (staffMember = null) => {
    setEditingStaff(staffMember);
    setModalVisible(true);
    
    if (staffMember) {
      form.setFieldsValue({
        full_name: staffMember.full_name,
        phone: staffMember.phone,
        role: staffMember.role,
        department: staffMember.department,
        img: staffMember.img
      });
    } else {
      form.resetFields();
    }
  };

  // Close modal
  const closeModal = () => {
    setModalVisible(false);
    setEditingStaff(null);
    form.resetFields();
  };

  // Handle form submit
  const handleSubmit = async (values) => {
    try {
      if (editingStaff) {
        // Update staff
        const response = await staffAPI.updateStaff(editingStaff.id, values);
        if (response.success) {
          message.success('อัปเดตข้อมูลบุคลากรสำเร็จ');
          loadStaff(pagination.current, searchText, selectedRole);
          closeModal();
        }
      } else {
        // Create staff
        const response = await staffAPI.createStaff(values);
        if (response.success) {
          message.success('เพิ่มบุคลากรใหม่สำเร็จ');
          loadStaff(pagination.current, searchText, selectedRole);
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
      const response = await staffAPI.deleteStaff(id);
      if (response.success) {
        message.success('ลบบุคลากรสำเร็จ');
        loadStaff(pagination.current, searchText, selectedRole);
      }
    } catch (error) {
      message.error(error.message || 'ไม่สามารถลบบุคลากรได้');
    }
  };

  // Get role color
  const getRoleColor = (role) => {
    if (role === 'leader') return 'red';
    if (role === 'coleader') return 'orange';
    if (role.startsWith('employee_c')) return 'blue';
    return 'default';
  };

  const columns = [
    {
      title: 'รูปภาพ',
      dataIndex: 'img',
      key: 'img',
      width: 80,
      render: (img, record) => (
        <Avatar 
          size={50} 
          src={img} 
          icon={<UserOutlined />}
          style={{ backgroundColor: '#1890ff' }}
        >
          {!img && record.full_name?.charAt(0)}
        </Avatar>
      ),
    },
    {
      title: 'ชื่อ-นามสกุล',
      dataIndex: 'full_name',
      key: 'full_name',
      render: (name) => <Text strong>{name}</Text>
    },
    {
      title: 'เบอร์โทร',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => phone ? (
        <Space>
          <PhoneOutlined />
          {phone}
        </Space>
      ) : '-'
    },
    {
      title: 'ตำแหน่ง',
      dataIndex: 'role_name',
      key: 'role_name',
      render: (roleName, record) => (
        <Tag color={getRoleColor(record.role)}>
          {roleName}
        </Tag>
      )
    },
    {
      title: 'หน่วยงาน',
      dataIndex: 'department',
      key: 'department',
      render: (department) => department || '-'
    },
    {
      title: 'วันที่เพิ่ม',
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
            description="คุณแน่ใจหรือไม่ที่จะลบบุคลากรคนนี้?"
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
            <TeamOutlined style={{ marginRight: 8 }} />
            จัดการบุคลากร
          </Title>
          <Text type="secondary">จัดการข้อมูลบุคลากรและเจ้าหน้าที่</Text>
        </div>

        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Space>
              <Search
                placeholder="ค้นหาชื่อ, เบอร์โทร, หน่วยงาน"
                allowClear
                enterButton={<SearchOutlined />}
                size="middle"
                onSearch={handleSearch}
                style={{ width: 300 }}
              />
              
              <Select
                placeholder="กรองตามตำแหน่ง"
                allowClear
                style={{ width: 200 }}
                onChange={handleRoleFilter}
                value={selectedRole || undefined}
              >
                {Object.entries(roles).map(([key, label]) => (
                  <Option key={key} value={key}>{label}</Option>
                ))}
              </Select>
            </Space>
          </Col>
          
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => openModal()}
            >
              เพิ่มบุคลากรใหม่
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={staff}
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
          title={editingStaff ? 'แก้ไขข้อมูลบุคลากร' : 'เพิ่มบุคลากรใหม่'}
          open={modalVisible}
          onCancel={closeModal}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="full_name"
                  label="ชื่อ-นามสกุล"
                  rules={[{ required: true, message: 'กรุณากรอกชื่อ-นามสกุล' }]}
                >
                  <Input placeholder="กรอกชื่อ-นามสกุล" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="เบอร์โทรศัพท์"
                >
                  <Input placeholder="กรอกเบอร์โทรศัพท์" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="role"
                  label="ตำแหน่ง"
                  rules={[{ required: true, message: 'กรุณาเลือกตำแหน่ง' }]}
                >
                  <Select placeholder="เลือกตำแหน่ง">
                    {Object.entries(roles).map(([key, label]) => (
                      <Option key={key} value={key}>{label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="department"
                  label="หน่วยงาน/แผนก"
                >
                  <Input placeholder="กรอกหน่วยงานหรือแผนก" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="img"
                  label="รูปภาพ"
                >
                  <ImageUpload />
                </Form.Item>
              </Col>
            </Row>

            <div style={{ textAlign: 'right', marginTop: 24 }}>
              <Space>
                <Button onClick={closeModal}>
                  ยกเลิก
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingStaff ? 'อัปเดต' : 'เพิ่ม'}
                </Button>
              </Space>
            </div>
          </Form>
        </Modal>
      </Space>
    </Card>
  );
}