"use client";
import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Modal,
  Form,
  message,
  Descriptions,
  Popconfirm,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;

export default function CorruptionComplaintsManagement() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [statusSummary, setStatusSummary] = useState({});
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();

  const statusConfig = {
    pending: {
      color: "orange",
      icon: <ClockCircleOutlined />,
      text: "รอดำเนินการ",
    },
    investigating: {
      color: "blue",
      icon: <ExclamationCircleOutlined />,
      text: "กำลังตรวจสอบ",
    },
    completed: {
      color: "green",
      icon: <CheckCircleOutlined />,
      text: "เสร็จสิ้น",
    },
    rejected: {
      color: "red",
      icon: <CloseCircleOutlined />,
      text: "ปฏิเสธ",
    },
  };

  useEffect(() => {
    fetchComplaints();
  }, [pagination.current, pagination.pageSize, statusFilter, searchText]);

  useEffect(() => {
    if (selectedComplaint && editModalVisible) {
      form.setFieldsValue({
        status: selectedComplaint.status,
        statusNote: selectedComplaint.status_note,
        assignedTo: selectedComplaint.assigned_to,
        investigationResult: selectedComplaint.investigation_result,
        actionTaken: selectedComplaint.action_taken
      });
    }
  }, [selectedComplaint, editModalVisible, form]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.current.toString(),
        limit: pagination.pageSize.toString(),
        status: statusFilter,
        search: searchText,
      });

      const response = await fetch(`/api/corruption-complaints?${params}`);
      const result = await response.json();

      if (result.success) {
        setComplaints(result.data.complaints);
        setPagination((prev) => ({
          ...prev,
          total: result.data.pagination.total,
        }));
        setStatusSummary(result.data.statusSummary);
      } else {
        message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
      message.error("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchComplaints();
  };

  const handleTableChange = (paginationInfo) => {
    setPagination((prev) => ({
      ...prev,
      current: paginationInfo.current,
      pageSize: paginationInfo.pageSize,
    }));
  };

  const viewComplaint = async (id) => {
    try {
      const response = await fetch(`/api/corruption-complaints/${id}`);
      const result = await response.json();

      if (result.success) {
        setSelectedComplaint(result.data);
        setViewModalVisible(true);
      } else {
        message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
      }
    } catch (error) {
      console.error("Error fetching complaint details:", error);
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
  };

  const editComplaint = async (id) => {
    try {
      const response = await fetch(`/api/corruption-complaints/${id}`);
      const result = await response.json();

      if (result.success) {
        setSelectedComplaint(result.data);
        setEditModalVisible(true);
      } else {
        message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
      }
    } catch (error) {
      console.error("Error fetching complaint details:", error);
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
  };

  const handleUpdate = async (values) => {
    try {
      const response = await fetch(
        `/api/corruption-complaints/${selectedComplaint.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...values,
            adminUser: "admin", // In real app, get from session
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        message.success("อัปเดตข้อมูลเรียบร้อยแล้ว");
        setEditModalVisible(false);
        fetchComplaints();
      } else {
        message.error("เกิดข้อผิดพลาด: " + result.error);
      }
    } catch (error) {
      console.error("Error updating complaint:", error);
      message.error("เกิดข้อผิดพลาดในการอัปเดต");
    }
  };

  const deleteComplaint = async (id) => {
    try {
      const response = await fetch(`/api/corruption-complaints/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        message.success("ลบคำร้องเรียนเรียบร้อยแล้ว");
        fetchComplaints();
      } else {
        message.error("เกิดข้อผิดพลาด: " + result.error);
      }
    } catch (error) {
      console.error("Error deleting complaint:", error);
      message.error("เกิดข้อผิดพลาดในการลบ");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const columns = [
    {
      title: "เลขที่อ้างอิง",
      dataIndex: "referenceNumber",
      key: "referenceNumber",
      width: 120,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "ผู้ร้องเรียน",
      dataIndex: "complainant_name",
      key: "complainant_name",
      width: 150,
      render: (text, record) => (
        <div>
          <div>
            <strong>{text}</strong>
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            {record.complainant_phone}
          </div>
        </div>
      ),
    },
    {
      title: "ผู้ถูกร้องเรียน",
      dataIndex: "accused_name",
      key: "accused_name",
      width: 150,
      render: (text, record) => (
        <div>
          <div>
            <strong>{text}</strong>
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            {record.accused_position}
          </div>
        </div>
      ),
    },
    {
      title: "หน่วยงาน",
      dataIndex: "accused_agency",
      key: "accused_agency",
      width: 150,
      ellipsis: true,
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        const config = statusConfig[status];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: "วันที่สร้าง",
      dataIndex: "created_at",
      key: "created_at",
      width: 150,
      render: (date) => formatDate(date),
    },
    {
      title: "การจัดการ",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => viewComplaint(record.id)}
            title="ดูรายละเอียด"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => editComplaint(record.id)}
            title="แก้ไข"
          />
          <Popconfirm
            title="คุณแน่ใจหรือไม่ที่จะลบคำร้องเรียนนี้?"
            onConfirm={() => deleteComplaint(record.id)}
            okText="ใช่"
            cancelText="ไม่"
          >
            <Button type="text" danger icon={<DeleteOutlined />} title="ลบ" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="รอดำเนินการ"
              value={statusSummary.pending || 0}
              valueStyle={{ color: "#fa8c16" }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="กำลังตรวจสอบ"
              value={statusSummary.investigating || 0}
              valueStyle={{ color: "#1890ff" }}
              prefix={<ExclamationCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="เสร็จสิ้น"
              value={statusSummary.completed || 0}
              valueStyle={{ color: "#52c41a" }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="ปฏิเสธ"
              value={statusSummary.rejected || 0}
              valueStyle={{ color: "#ff4d4f" }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="จัดการคำร้องเรียนการทุจริต">
        {/* Search and Filter */}
        <div style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Input
                placeholder="ค้นหาชื่อผู้ร้องเรียน, ผู้ถูกร้องเรียน, หรือหน่วยงาน..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onPressEnter={handleSearch}
                suffix={<SearchOutlined />}
              />
            </Col>
            <Col span={4}>
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: "100%" }}
              >
                <Option value="all">ทุกสถานะ</Option>
                <Option value="pending">รอดำเนินการ</Option>
                <Option value="investigating">กำลังตรวจสอบ</Option>
                <Option value="completed">เสร็จสิ้น</Option>
                <Option value="rejected">ปฏิเสธ</Option>
              </Select>
            </Col>
            <Col span={4}>
              <Button type="primary" onClick={handleSearch}>
                ค้นหา
              </Button>
            </Col>
            <Col span={4}>
              <Button icon={<ReloadOutlined />} onClick={fetchComplaints}>
                รีเฟรช
              </Button>
            </Col>
          </Row>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={complaints}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} จาก ${total} รายการ`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* View Modal */}
      <Modal
        title={`รายละเอียดคำร้องเรียน ${selectedComplaint?.referenceNumber}`}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedComplaint && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="วันที่ร้องเรียน" span={2}>
              {formatDate(selectedComplaint.complaint_date)}
            </Descriptions.Item>

            <Descriptions.Item label="ชื่อผู้ร้องเรียน">
              {selectedComplaint.complainant_name}
            </Descriptions.Item>
            <Descriptions.Item label="เบอร์โทร">
              {selectedComplaint.complainant_phone}
            </Descriptions.Item>
            <Descriptions.Item label="อายุ">
              {selectedComplaint.complainant_age} ปี
            </Descriptions.Item>
            <Descriptions.Item label="เลขบัตรประชาชน">
              {selectedComplaint.complainant_id_card}
            </Descriptions.Item>
            <Descriptions.Item label="ที่อยู่" span={2}>
              {selectedComplaint.complainant_address}
            </Descriptions.Item>

            <Descriptions.Item label="ชื่อผู้ถูกร้องเรียน">
              {selectedComplaint.accused_name}
            </Descriptions.Item>
            <Descriptions.Item label="ตำแหน่ง">
              {selectedComplaint.accused_position}
            </Descriptions.Item>
            <Descriptions.Item label="หน่วยงาน">
              {selectedComplaint.accused_agency}
            </Descriptions.Item>
            <Descriptions.Item label="จังหวัด">
              {selectedComplaint.accused_province}
            </Descriptions.Item>

            <Descriptions.Item label="รายละเอียดการร้องเรียน" span={2}>
              <div style={{ whiteSpace: "pre-wrap" }}>
                {selectedComplaint.complaint_details}
              </div>
            </Descriptions.Item>

            <Descriptions.Item label="สถานะ">
              <Tag
                color={statusConfig[selectedComplaint.status].color}
                icon={statusConfig[selectedComplaint.status].icon}
              >
                {statusConfig[selectedComplaint.status].text}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="ผู้รับผิดชอบ">
              {selectedComplaint.assigned_to || "-"}
            </Descriptions.Item>

            {selectedComplaint.status_note && (
              <Descriptions.Item label="หมายเหตุ" span={2}>
                {selectedComplaint.status_note}
              </Descriptions.Item>
            )}

            {selectedComplaint.investigation_result && (
              <Descriptions.Item label="ผลการตรวจสอบ" span={2}>
                <div style={{ whiteSpace: "pre-wrap" }}>
                  {selectedComplaint.investigation_result}
                </div>
              </Descriptions.Item>
            )}

            {selectedComplaint.action_taken && (
              <Descriptions.Item label="การดำเนินการ" span={2}>
                <div style={{ whiteSpace: "pre-wrap" }}>
                  {selectedComplaint.action_taken}
                </div>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        title={`แก้ไขคำร้องเรียน ${selectedComplaint?.referenceNumber}`}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            name="status"
            label="สถานะ"
            rules={[{ required: true, message: "กรุณาเลือกสถานะ" }]}
          >
            <Select>
              <Option value="pending">รอดำเนินการ</Option>
              <Option value="investigating">กำลังตรวจสอบ</Option>
              <Option value="completed">เสร็จสิ้น</Option>
              <Option value="rejected">ปฏิเสธ</Option>
            </Select>
          </Form.Item>

          <Form.Item name="statusNote" label="หมายเหตุ">
            <TextArea rows={3} placeholder="หมายเหตุเพิ่มเติม" />
          </Form.Item>

          <Form.Item name="assignedTo" label="ผู้รับผิดชอบ">
            <Input placeholder="ชื่อผู้รับผิดชอบ" />
          </Form.Item>

          <Form.Item name="investigationResult" label="ผลการตรวจสอบ">
            <TextArea rows={4} placeholder="ผลการตรวจสอบ" />
          </Form.Item>

          <Form.Item name="actionTaken" label="การดำเนินการ">
            <TextArea rows={4} placeholder="การดำเนินการที่ได้ทำ" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                บันทึก
              </Button>
              <Button onClick={() => setEditModalVisible(false)}>ยกเลิก</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
