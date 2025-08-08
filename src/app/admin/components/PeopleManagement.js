"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  Tag,
  Select,
  Switch,
  Typography,
  App,
  InputNumber,
  Upload,
  Progress,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  TeamOutlined,
  BankOutlined,
  ToolOutlined,
  BookOutlined,
  AuditOutlined,
  CrownOutlined,
  UploadOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

// Department configurations
const DEPARTMENTS = {
  executive: {
    title: "คณะผู้บริหาร",
    icon: <CrownOutlined />,
    color: "gold",
  },
  council: {
    title: "สภาเทศบาล",
    icon: <TeamOutlined />,
    color: "blue",
  },
  clerk: {
    title: "สำนักปลัดเทศบาล",
    icon: <BankOutlined />,
    color: "green",
  },
  finance: {
    title: "กองคลัง",
    icon: <BankOutlined />,
    color: "cyan",
  },
  engineering: {
    title: "กองช่าง",
    icon: <ToolOutlined />,
    color: "orange",
  },
  education: {
    title: "กองการศึกษาฯ",
    icon: <BookOutlined />,
    color: "purple",
  },
  audit: {
    title: "หน่วยตรวจสอบภายใน",
    icon: <AuditOutlined />,
    color: "red",
  },
};

// Role type configurations
const ROLE_TYPES = {
  head: { title: "หัวหน้า", color: "red" },
  deputy: { title: "รอง/ผู้ช่วย", color: "orange" },
  staff: { title: "เจ้าหน้าที่", color: "blue" },
  worker: { title: "พนักงาน", color: "green" },
};

export default function PeopleManagement() {
  const { notification } = App.useApp();

  // Data states
  const [people, setPeople] = useState([]);

  // Add pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} จาก ${total} รายการ`,
  });

  // Loading states
  const [loading, setLoading] = useState(false);

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);

  // Form and editing states
  const [form] = Form.useForm();
  const [editingRecord, setEditingRecord] = useState(null);

  // Filter states
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedRoleType, setSelectedRoleType] = useState(null);

  // Image upload states
  const [uploadedImagePath, setUploadedImagePath] = useState(null);
  const [uploadedImageData, setUploadedImageData] = useState(null);

  const loadPeople = useCallback(
    async (page = 1, pageSize = 10, department = null, roleType = null) => {
      try {
        setLoading(true);
        console.log("Loading people - Page:", page, "PageSize:", pageSize);

        // Build query parameters
        const params = new URLSearchParams({
          page: page.toString(),
          limit: pageSize.toString(),
          admin: "true", // Enable admin mode
        });

        if (department) {
          params.append("department", department);
        }

        if (roleType) {
          params.append("role_type", roleType);
        }

        const response = await fetch(`/api/people-management?${params}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API response:", data);

        if (data.success) {
          // In admin mode, data is already a flat array
          setPeople(data.data || []);

          // Update pagination state with data from API
          setPagination((prev) => ({
            ...prev,
            current: data.pagination?.page || page,
            pageSize: data.pagination?.limit || pageSize,
            total: data.pagination?.total || 0,
          }));

          console.log(
            "People loaded:",
            data.data?.length || 0,
            "Total:",
            data.pagination?.total || 0
          );
        } else {
          console.error("API error:", data.error);
          notification.error({
            message: "เกิดข้อผิดพลาด",
            description: data.error || "เกิดข้อผิดพลาดในการโหลดข้อมูล",
          });
        }
      } catch (error) {
        console.error("Load people error:", error);
        notification.error({
          message: "เกิดข้อผิดพลาด",
          description: "เกิดข้อผิดพลาดในการโหลดข้อมูล",
        });
      } finally {
        setLoading(false);
      }
    },
    [notification]
  );

  useEffect(() => {
    loadPeople(1, 10);

    // Cleanup function to prevent memory leaks
    return () => {
      if (form) {
        form.resetFields();
      }
    };
  }, [loadPeople, form]);

  // Handle table pagination change
  const handleTableChange = (paginationConfig) => {
    const { current, pageSize } = paginationConfig;
    loadPeople(current, pageSize, selectedDepartment, selectedRoleType);
  };

  // Handle filter changes
  const handleDepartmentFilter = (department) => {
    setSelectedDepartment(department);
    loadPeople(1, pagination.pageSize, department, selectedRoleType);
  };

  const handleRoleTypeFilter = (roleType) => {
    setSelectedRoleType(roleType);
    loadPeople(1, pagination.pageSize, selectedDepartment, roleType);
  };

  const handleCreate = () => {
    setEditingRecord(null);
    setModalVisible(true);
    setUploadedImagePath(null);
    setUploadedImageData(null);

    try {
      if (form) {
        form.resetFields();
        // Set default values
        form.setFieldsValue({
          is_empty: false,
          is_active: true,
          level: 1,
          sort_order: 1,
          img: "/image/placeholder-person.jpg",
        });
      }
    } catch (error) {
      console.warn("Error resetting form:", error);
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setModalVisible(true);
    setUploadedImagePath(record.img || null);
    setUploadedImageData(
      record.img && record.img !== "/image/placeholder-person.jpg"
        ? {
            file_path: record.img,
            original_name: record.img.split("/").pop(),
          }
        : null
    );

    try {
      if (form) {
        form.setFieldsValue({
          ...record,
          is_empty: record.is_empty || false,
          is_active: record.is_active !== false, // Default to true if undefined
        });
      }
    } catch (error) {
      console.warn("Error setting form values:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/people-management?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        notification.success({
          message: "สำเร็จ",
          description: "ลบข้อมูลบุคลากรสำเร็จ",
        });

        // Reload current page data
        loadPeople(
          pagination.current,
          pagination.pageSize,
          selectedDepartment,
          selectedRoleType
        );
      } else {
        notification.error({
          message: "เกิดข้อผิดพลาด",
          description: data.error || "เกิดข้อผิดพลาด",
        });
      }
    } catch (error) {
      notification.error({
        message: "เกิดข้อผิดพลาด",
        description: "เกิดข้อผิดพลาดในการลบข้อมูล",
      });
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      if (!values.full_name?.trim()) {
        notification.error({
          message: "ข้อมูลไม่ครบถ้วน",
          description: "กรุณากรอกชื่อ-นามสกุล",
        });
        return;
      }

      if (!values.position?.trim()) {
        notification.error({
          message: "ข้อมูลไม่ครบถ้วน",
          description: "กรุณากรอกตำแหน่ง",
        });
        return;
      }

      if (!values.department) {
        notification.error({
          message: "ข้อมูลไม่ครบถ้วน",
          description: "กรุณาเลือกหน่วยงาน",
        });
        return;
      }

      // Use uploaded image if available, otherwise use form value or default
      let imageUrl = "/image/placeholder-person.jpg";
      if (uploadedImageData && uploadedImageData.file_path) {
        // Remove /storage prefix if present
        imageUrl = uploadedImageData.file_path.replace("/storage", "");
      } else if (values.img?.trim()) {
        imageUrl = values.img.trim();
      }

      const submitData = {
        full_name: values.full_name.trim(),
        position: values.position.trim(),
        phone: values.phone?.trim() || null,
        email: values.email?.trim() || null,
        department: values.department,
        sub_department: values.sub_department?.trim() || null,
        role_type: values.role_type || "staff",
        level: values.level || 1,
        sort_order: values.sort_order || 1,
        district: values.district?.trim() || null,
        img: imageUrl,
        is_empty: values.is_empty || false,
        is_active: values.is_active !== false, // Default to true
      };

      const url = editingRecord
        ? `/api/people-management?id=${editingRecord.id}`
        : "/api/people-management";
      const method = editingRecord ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        notification.success({
          message: "สำเร็จ",
          description: editingRecord
            ? "แก้ไขข้อมูลบุคลากรสำเร็จ"
            : "เพิ่มข้อมูลบุคลากรสำเร็จ",
        });
        setModalVisible(false);
        setUploadedImagePath(null);
        setUploadedImageData(null);

        try {
          if (form) {
            form.resetFields();
          }
        } catch (error) {
          console.warn("Error resetting form after submit:", error);
        }

        // Reload current page data
        loadPeople(
          pagination.current,
          pagination.pageSize,
          selectedDepartment,
          selectedRoleType
        );
      } else {
        notification.error({
          message: "เกิดข้อผิดพลาด",
          description: data.error || "เกิดข้อผิดพลาด",
        });
      }
    } catch (error) {
      notification.error({
        message: "เกิดข้อผิดพลาด",
        description: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
      });
    } finally {
      setLoading(false);
    }
  };

  // File upload component
  const FileUpload = ({
    value,
    onChange,
    placeholder,
    accept,
    maxSize = 10,
  }) => {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleUpload = async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      try {
        setUploading(true);
        setUploadProgress(0);

        const response = await fetch("/api/manual/upload-laravel", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          setUploadProgress(100);
          onChange(result.data.file_path, result.data);
          notification.success({
            message: "สำเร็จ",
            description: "อัพโหลดรูปภาพสำเร็จ",
          });
        } else {
          notification.error({
            message: "เกิดข้อผิดพลาด",
            description: result.error || "เกิดข้อผิดพลาดในการอัพโหลด",
          });
        }
      } catch (error) {
        notification.error({
          message: "เกิดข้อผิดพลาด",
          description: "เกิดข้อผิดพลาดในการอัพโหลด",
        });
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }

      return false; // Prevent default upload
    };

    const handleRemove = () => {
      onChange(null, null);
    };

    return (
      <div>
        <Space direction="vertical" style={{ width: "100%" }}>
          {!value && (
            <Upload
              beforeUpload={handleUpload}
              showUploadList={false}
              accept={accept}
              disabled={uploading}
            >
              <Button
                icon={<UploadOutlined />}
                loading={uploading}
                disabled={uploading}
              >
                {placeholder || "เลือกรูปภาพ"}
              </Button>
            </Upload>
          )}

          {value && (
            <div
              style={{
                padding: "8px 12px",
                border: "1px solid #d9d9d9",
                borderRadius: "6px",
                backgroundColor: "#fafafa",
              }}
            >
              <Space>
                <FileTextOutlined style={{ color: "#1890ff" }} />
                <Text>{value.split("/").pop()}</Text>
                <Button size="small" type="link" danger onClick={handleRemove}>
                  ลบ
                </Button>
              </Space>
            </div>
          )}

          {uploading && uploadProgress > 0 && (
            <Progress
              percent={uploadProgress}
              size="small"
              status={uploadProgress === 100 ? "success" : "active"}
            />
          )}

          <div>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              รองรับไฟล์: PNG, JPG, JPEG, GIF, WebP, SVG | ขนาดไฟล์สูงสุด:{" "}
              {maxSize}MB
            </Text>
          </div>
        </Space>
      </div>
    );
  };

  const columns = [
    {
      title: "ลำดับ",
      key: "index",
      width: 80,
      render: (_, record, index) => {
        return (pagination.current - 1) * pagination.pageSize + index + 1;
      },
    },
    {
      title: "รูปภาพ",
      dataIndex: "img",
      key: "img",
      width: 80,
      render: (img) => {
        const imageUrl =
          img && img !== "/image/placeholder-person.jpg" && img.startsWith("/")
            ? `https://banpho.sosmartsolution.com/storage${img}`
            : img || "/image/placeholder-person.jpg";

        return (
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              overflow: "hidden",
              backgroundColor: "#f0f0f0",
            }}
          >
            <img
              src={imageUrl}
              alt="Profile"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onError={(e) => {
                console.log("Image load error for:", imageUrl);
                e.target.src = "/image/placeholder-person.jpg";
              }}
            />
          </div>
        );
      },
    },
    {
      title: "ชื่อ-นามสกุล",
      dataIndex: "full_name",
      key: "full_name",
      ellipsis: true,
      render: (text, record) => (
        <Space>
          {record.is_empty && <Tag color="orange">ว่าง</Tag>}
          <Text strong={!record.is_empty}>{text}</Text>
        </Space>
      ),
    },
    {
      title: "ตำแหน่ง",
      dataIndex: "position",
      key: "position",
      ellipsis: true,
    },
    {
      title: "หน่วยงาน",
      dataIndex: "department",
      key: "department",
      width: 150,
      render: (department) => {
        const config = DEPARTMENTS[department] || {};
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.title || department}
          </Tag>
        );
      },
      filters: Object.entries(DEPARTMENTS).map(([key, config]) => ({
        text: config.title,
        value: key,
      })),
      filteredValue: selectedDepartment ? [selectedDepartment] : null,
      onFilter: (value, record) => record.department === value,
    },
    {
      title: "ประเภท",
      dataIndex: "role_type",
      key: "role_type",
      width: 120,
      render: (roleType) => {
        const config = ROLE_TYPES[roleType] || {};
        return <Tag color={config.color}>{config.title || roleType}</Tag>;
      },
      filters: Object.entries(ROLE_TYPES).map(([key, config]) => ({
        text: config.title,
        value: key,
      })),
      filteredValue: selectedRoleType ? [selectedRoleType] : null,
      onFilter: (value, record) => record.role_type === value,
    },
    {
      title: "เขต",
      dataIndex: "district",
      key: "district",
      width: 100,
      render: (district) =>
        district ? <Tag color="geekblue">{district}</Tag> : "-",
    },
    {
      title: "โทรศัพท์",
      dataIndex: "phone",
      key: "phone",
      width: 120,
      render: (phone) => phone || "-",
    },
    {
      title: "สถานะ",
      key: "status",
      width: 100,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Tag color={record.is_active ? "green" : "red"}>
            {record.is_active ? "เปิดใช้งาน" : "ปิดใช้งาน"}
          </Tag>
        </Space>
      ),
    },
    {
      title: "การจัดการ",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            แก้ไข
          </Button>
          <Popconfirm
            title="คุณแน่ใจหรือไม่ที่จะลบข้อมูลบุคลากรนี้?"
            onConfirm={() => handleDelete(record.id)}
            okText="ใช่"
            cancelText="ไม่"
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              ลบ
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <Title level={4} style={{ margin: 0 }}>
              <UserOutlined /> จัดการข้อมูลบุคลากร
            </Title>
            <Text type="secondary" style={{ fontSize: "14px" }}>
              ทั้งหมด {pagination.total} รายการ
            </Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            เพิ่มบุคลากร
          </Button>
        </div>

        {/* Filters */}
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Select
              placeholder="เลือกหน่วยงาน"
              style={{ width: 200 }}
              allowClear
              value={selectedDepartment}
              onChange={handleDepartmentFilter}
            >
              {Object.entries(DEPARTMENTS).map(([key, config]) => (
                <Option key={key} value={key}>
                  {config.icon} {config.title}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="เลือกประเภทตำแหน่ง"
              style={{ width: 150 }}
              allowClear
              value={selectedRoleType}
              onChange={handleRoleTypeFilter}
            >
              {Object.entries(ROLE_TYPES).map(([key, config]) => (
                <Option key={key} value={key}>
                  {config.title}
                </Option>
              ))}
            </Select>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={people}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={editingRecord ? "แก้ไขข้อมูลบุคลากร" : "เพิ่มข้อมูลบุคลากร"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setUploadedImagePath(null);
          setUploadedImageData(null);
        }}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <Form.Item
              label="ชื่อ-นามสกุล"
              name="full_name"
              rules={[{ required: true, message: "กรุณากรอกชื่อ-นามสกุล" }]}
            >
              <Input placeholder="กรอกชื่อ-นามสกุล" />
            </Form.Item>

            <Form.Item
              label="ตำแหน่ง"
              name="position"
              rules={[{ required: true, message: "กรุณากรอกตำแหน่ง" }]}
            >
              <Input placeholder="กรอกตำแหน่ง" />
            </Form.Item>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <Form.Item
              label="หน่วยงาน"
              name="department"
              rules={[{ required: true, message: "กรุณาเลือกหน่วยงาน" }]}
            >
              <Select placeholder="เลือกหน่วยงาน">
                {Object.entries(DEPARTMENTS).map(([key, config]) => (
                  <Option key={key} value={key}>
                    {config.icon} {config.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="หน่วยงานย่อย" name="sub_department">
              <Input placeholder="กรอกหน่วยงานย่อย (ถ้ามี)" />
            </Form.Item>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <Form.Item label="ประเภทตำแหน่ง" name="role_type">
              <Select placeholder="เลือกประเภทตำแหน่ง">
                {Object.entries(ROLE_TYPES).map(([key, config]) => (
                  <Option key={key} value={key}>
                    {config.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="เขต" name="district">
              <Input placeholder="กรอกเขต (สำหรับสภาเทศบาล)" />
            </Form.Item>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <Form.Item label="โทรศัพท์" name="phone">
              <Input placeholder="กรอกเบอร์โทรศัพท์" />
            </Form.Item>

            <Form.Item label="อีเมล" name="email">
              <Input placeholder="กรอกอีเมล" />
            </Form.Item>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <Form.Item label="ระดับ" name="level">
              <InputNumber
                min={1}
                max={10}
                placeholder="ระดับตำแหน่ง"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item label="ลำดับการแสดง" name="sort_order">
              <InputNumber
                min={1}
                placeholder="ลำดับการแสดง"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </div>

          <Form.Item label="รูปภาพ">
            <Space direction="vertical" style={{ width: "100%" }}>
              <FileUpload
                value={uploadedImagePath}
                onChange={(filePath, fileData) => {
                  setUploadedImagePath(filePath);
                  setUploadedImageData(fileData);
                }}
                placeholder="เลือกรูปภาพบุคลากร"
                accept=".png,.jpg,.jpeg,.gif,.webp,.svg"
                maxSize={5}
              />
              {uploadedImagePath && (
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      backgroundColor: "#f0f0f0",
                      margin: "0 auto",
                      border: "2px solid #d9d9d9",
                    }}
                  >
                    <img
                      src={
                        uploadedImagePath &&
                        uploadedImagePath !== "/image/placeholder-person.jpg" &&
                        uploadedImagePath.startsWith("/")
                          ? `https://banpho.sosmartsolution.com/storage${uploadedImagePath}`
                          : uploadedImagePath || "/image/placeholder-person.jpg"
                      }
                      alt="Preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.src = "/image/placeholder-person.jpg";
                      }}
                    />
                  </div>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    ตัวอย่างรูปภาพ
                  </Text>
                </div>
              )}
            </Space>
          </Form.Item>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <Form.Item
              label="ตำแหน่งว่าง"
              name="is_empty"
              valuePropName="checked"
            >
              <Switch checkedChildren="ว่าง" unCheckedChildren="มีคน" />
            </Form.Item>

            <Form.Item
              label="สถานะการใช้งาน"
              name="is_active"
              valuePropName="checked"
            >
              <Switch
                checkedChildren="เปิดใช้งาน"
                unCheckedChildren="ปิดใช้งาน"
              />
            </Form.Item>
          </div>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingRecord ? "บันทึกการแก้ไข" : "เพิ่มบุคลากร"}
              </Button>
              <Button onClick={() => setModalVisible(false)}>ยกเลิก</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
