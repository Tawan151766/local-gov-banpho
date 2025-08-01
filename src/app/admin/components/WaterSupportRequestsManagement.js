'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Card,
  Space,
  Tag,
  Descriptions,
  Popconfirm,
  App
} from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

export default function WaterSupportRequestsManagement() {
  const { message: antMessage } = App.useApp();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [form] = Form.useForm();

  // Pagination
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.current.toString(),
        limit: pagination.pageSize.toString(),
      });

      if (searchText) params.append('search', searchText);
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/water-support-requests?${params}`);
      const result = await response.json();

      if (result.success) {
        setRequests(result.data);
        setPagination(prev => ({
          ...prev,
          total: result.pagination.total
        }));
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      antMessage.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests, pagination.pageSize, searchText, statusFilter]);

  const handleView = (record) => {
    setSelectedRequest(record);
    setViewModalVisible(true);
  };

  const handleEdit = (record) => {
    setSelectedRequest(record);
    form.setFieldsValue({
      status: record.status,
      status_note: record.status_note
    });
    setEditModalVisible(true);
  };

  const handleUpdateStatus = async (values) => {
    try {
      const response = await fetch(`/api/water-support-requests/${selectedRequest.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (result.success) {
        antMessage.success('อัปเดตสถานะเรียบร้อยแล้ว');
        setEditModalVisible(false);
        fetchRequests();
      } else {
        antMessage.error('เกิดข้อผิดพลาดในการอัปเดต');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      antMessage.error('เกิดข้อผิดพลาดในการอัปเดต');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/water-support-requests/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        antMessage.success('ลบข้อมูลเรียบร้อยแล้ว');
        fetchRequests();
      } else {
        antMessage.error('เกิดข้อผิดพลาดในการลบข้อมูล');
      }
    } catch (error) {
      console.error('Error deleting request:', error);
      antMessage.error('เกิดข้อผิดพลาดในการลบข้อมูล');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'orange',
      processing: 'blue',
      completed: 'green',
      rejected: 'red'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'รอดำเนินการ',
      processing: 'กำลังดำเนินการ',
      completed: 'เสร็จสิ้น',
      rejected: 'ปฏิเสธ'
    };
    return texts[status] || status;
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'วันที่ยื่น',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
      width: 150,
    },
    {
      title: 'ชื่อผู้ยื่น',
      dataIndex: 'requester_name',
      key: 'requester_name',
      render: (name, record) => `${record.requester_title}${name}`,
    },
    {
      title: 'ที่อยู่',
      key: 'address',
      render: (_, record) => `${record.requester_house_number} หมู่${record.requester_village}`,
    },
    {
      title: 'เบอร์โทร',
      dataIndex: 'requester_phone',
      key: 'requester_phone',
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'การจัดการ',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            ดู
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            แก้ไข
          </Button>
          <Popconfirm
            title="คุณแน่ใจหรือไม่ที่จะลบข้อมูลนี้?"
            onConfirm={() => handleDelete(record.id)}
            okText="ใช่"
            cancelText="ไม่"
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
    <div className="p-6">
      <Card>
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">จัดการคำร้องขอสนับสนุนน้ำอุปโภค-บริโภค</h2>
        </div>

        <div className="mb-4 flex gap-4">
          <Input.Search
            placeholder="ค้นหาชื่อผู้ยื่นหรือความต้องการ..."
            allowClear
            onSearch={setSearchText}
            style={{ width: 300 }}
          />
          <Select
            placeholder="กรองตามสถานะ"
            allowClear
            style={{ width: 200 }}
            onChange={setStatusFilter}
          >
            <Option value="pending">รอดำเนินการ</Option>
            <Option value="processing">กำลังดำเนินการ</Option>
            <Option value="completed">เสร็จสิ้น</Option>
            <Option value="rejected">ปฏิเสธ</Option>
          </Select>
        </div>

        <Table
          columns={columns}
          dataSource={requests}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page, pageSize) => {
              setPagination(prev => ({
                ...prev,
                current: page,
                pageSize
              }));
            },
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} จาก ${total} รายการ`,
          }}
        />
      </Card>

      {/* View Modal */}
      <Modal
        title="รายละเอียดคำร้องขอสนับสนุนน้ำ"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            ปิด
          </Button>
        ]}
        width={800}
      >
        {selectedRequest && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="วันที่ยื่น" span={1}>
                {dayjs(selectedRequest.created_at).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="สถานะ" span={1}>
                <Tag color={getStatusColor(selectedRequest.status)}>
                  {getStatusText(selectedRequest.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="ชื่อผู้ยื่น" span={2}>
                {selectedRequest.requester_title}{selectedRequest.requester_name}
              </Descriptions.Item>
              <Descriptions.Item label="อายุ" span={1}>
                {selectedRequest.requester_age} ปี
              </Descriptions.Item>
              <Descriptions.Item label="จำนวนสมาชิกครัวเรือน" span={1}>
                {selectedRequest.family_members} คน
              </Descriptions.Item>
              <Descriptions.Item label="ที่อยู่" span={2}>
                {selectedRequest.requester_house_number} 
                {selectedRequest.requester_village && ` หมู่ ${selectedRequest.requester_village}`}
                {` ${selectedRequest.requester_subdistrict}`}
                {` ${selectedRequest.requester_district}`}
                {` ${selectedRequest.requester_province}`}
              </Descriptions.Item>
              <Descriptions.Item label="เบอร์โทร" span={1}>
                {selectedRequest.requester_phone}
              </Descriptions.Item>
              <Descriptions.Item label="ความต้องการใช้น้ำ" span={2}>
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {selectedRequest.water_needs}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="อาการและประเภท" span={2}>
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {selectedRequest.symptoms_description}
                </div>
              </Descriptions.Item>
              {selectedRequest.status_note && (
                <Descriptions.Item label="หมายเหตุ" span={2}>
                  {selectedRequest.status_note}
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* Edit Status Modal */}
      <Modal
        title="แก้ไขสถานะคำร้อง"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateStatus}
        >
          <Form.Item
            name="status"
            label="สถานะ"
            rules={[{ required: true, message: 'กรุณาเลือกสถานะ' }]}
          >
            <Select>
              <Option value="pending">รอดำเนินการ</Option>
              <Option value="processing">กำลังดำเนินการ</Option>
              <Option value="completed">เสร็จสิ้น</Option>
              <Option value="rejected">ปฏิเสธ</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status_note"
            label="หมายเหตุ"
          >
            <TextArea 
              rows={4} 
              placeholder="ระบุหมายเหตุ (ถ้ามี)"
            />
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={() => setEditModalVisible(false)}>
                ยกเลิก
              </Button>
              <Button type="primary" htmlType="submit">
                บันทึก
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}