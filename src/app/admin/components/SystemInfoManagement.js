"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Switch,
  Space,
  message,
  Popconfirm,
  Tag,
  Typography,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Title } = Typography;
const { TextArea } = Input;

export default function SystemInfoManagement() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/system-info");
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      } else {
        message.error("ไม่สามารถโหลดข้อมูลได้");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle create/update
  const handleSubmit = async (values) => {
    try {
      const url = editingRecord 
        ? `/api/system-info/${editingRecord.key}` 
        : "/api/system-info";
      const method = editingRecord ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          created_by: editingRecord ? undefined : "admin",
          updated_by: editingRecord ? "admin" : undefined,
        }),
      });

      const result = await response.json();
      if (result.success) {
        message.success(
          editingRecord ? "อัพเดทข้อมูลสำเร็จ" : "เพิ่มข้อมูลสำเร็จ"
        );
        setModalVisible(false);
        setEditingRecord(null);
        form.resetFields();
        fetchData();
      } else {
        message.error(result.error || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      message.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  // Handle delete
  const handleDelete = async (record) => {
    try {
      const response = await fetch(`/api/system-info/${record.key}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (result.success) {
        message.success("ลบข้อมูลสำเร็จ");
        fetchData();
      } else {
        message.error(result.error || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      message.error("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  // Handle edit
  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      key: record.key,
      value: record.value,
      name: record.name,
      description: record.description,
      is_active: record.is_active,
    });
    setModalVisible(true);
  };

  // Handle add new
  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    form.setFieldsValue({ is_active: true });
    setModalVisible(true);
  };

  // Seed default data
  const handleSeedData = async () => {
    try {
      const response = await fetch("/api/seed-system-info", {
        method: "POST",
      });
      const result = await response.json();
      if (result.success) {
        message.success("เพิ่มข้อมูลเริ่มต้นสำเร็จ");
        fetchData();
      } else {
        message.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูลเริ่มต้น");
      }
    } catch (error) {
      console.error("Error seeding data:", error);
      message.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูลเริ่มต้น");
    }
  };

  const columns = [
    {
      title: "Key",
      dataIndex: "key",
      key: "key",
      width: 150,
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "ชื่อแสดงผล",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "ค่าข้อมูล",
      dataIndex: "value",
      key: "value",
      ellipsis: true,
      render: (text) => (
        <div style={{ maxWidth: 200, wordBreak: "break-word" }}>
          {text}
        </div>
      ),
    },
    {
      title: "คำอธิบาย",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (text) => (
        <div style={{ maxWidth: 200, wordBreak: "break-word" }}>
          {text || "-"}
        </div>
      ),
    },
    {
      title: "สถานะ",
      dataIndex: "is_active",
      key: "is_active",
      width: 100,
      render: (active) => (
        <Tag color={active ? "green" : "red"}>
          {active ? "ใช้งาน" : "ไม่ใช้งาน"}
        </Tag>
      ),
    },
    {
      title: "ผู้สร้าง",
      dataIndex: "created_by",
      key: "created_by",
      width: 100,
      render: (text) => text || "-",
    },
    {
      title: "วันที่สร้าง",
      dataIndex: "created_at",
      key: "created_at",
      width: 150,
      render: (date) => new Date(date).toLocaleDateString("th-TH"),
    },
    {
      title: "การจัดการ",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="ยืนยันการลบ"
            description="คุณแน่ใจหรือไม่ที่จะลบข้อมูลนี้?"
            onConfirm={() => handleDelete(record)}
            okText="ใช่"
            cancelText="ไม่"
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Title level={3}>
            <SettingOutlined /> จัดการข้อมูลระบบ
          </Title>
        </Col>
        <Col span={12} style={{ textAlign: "right" }}>
          <Space>
            <Button
              type="default"
              icon={<ReloadOutlined />}
              onClick={fetchData}
              loading={loading}
            >
              รีเฟรช
            </Button>
            <Button
              type="default"
              onClick={handleSeedData}
            >
              เพิ่มข้อมูลเริ่มต้น
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              เพิ่มข้อมูลใหม่
            </Button>
          </Space>
        </Col>
      </Row>

      <Card>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `ทั้งหมด ${total} รายการ`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal
        title={editingRecord ? "แก้ไขข้อมูลระบบ" : "เพิ่มข้อมูลระบบใหม่"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingRecord(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ is_active: true }}
        >
          <Form.Item
            name="key"
            label="Key (ตัวระบุเฉพาะ)"
            rules={[
              { required: true, message: "กรุณากรอก Key" },
              { 
                pattern: /^[a-z0-9_]+$/, 
                message: "Key ต้องเป็นตัวอักษรภาษาอังกฤษพิมพ์เล็ก ตัวเลข และ _ เท่านั้น" 
              },
            ]}
          >
            <Input 
              placeholder="เช่น phone, email, address"
              disabled={!!editingRecord}
            />
          </Form.Item>

          <Form.Item
            name="name"
            label="ชื่อแสดงผล"
            rules={[{ required: true, message: "กรุณากรอกชื่อแสดงผล" }]}
          >
            <Input placeholder="เช่น เบอร์โทรศัพท์, อีเมล, ที่อยู่" />
          </Form.Item>

          <Form.Item
            name="value"
            label="ค่าข้อมูล"
            rules={[{ required: true, message: "กรุณากรอกค่าข้อมูล" }]}
          >
            <TextArea 
              rows={3}
              placeholder="ค่าข้อมูลที่ต้องการเก็บ"
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="คำอธิบาย"
          >
            <TextArea 
              rows={2}
              placeholder="คำอธิบายเพิ่มเติม (ไม่บังคับ)"
            />
          </Form.Item>

          <Form.Item
            name="is_active"
            label="สถานะการใช้งาน"
            valuePropName="checked"
          >
            <Switch 
              checkedChildren="ใช้งาน" 
              unCheckedChildren="ไม่ใช้งาน" 
            />
          </Form.Item>

          <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
            <Space>
              <Button
                onClick={() => {
                  setModalVisible(false);
                  setEditingRecord(null);
                  form.resetFields();
                }}
              >
                ยกเลิก
              </Button>
              <Button type="primary" htmlType="submit">
                {editingRecord ? "อัพเดท" : "เพิ่ม"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}