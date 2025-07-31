"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  Image,
  Card,
  Space,
  Popconfirm,
  Tag,
  Tabs,
  Row,
  Col,
  Typography,
  Descriptions,
  Divider,
  App,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  FileImageOutlined,
  VideoCameraOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import { postTypesAPI, postDetailsAPI } from "@/lib/api";
import { uploadFileToServer } from "@/lib/fileUploadUtils";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Title } = Typography;

export default function PostManagement() {
  const { message } = App.useApp();
  const [postTypes, setPostTypes] = useState([]);
  const [postDetails, setPostDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [activeTab, setActiveTab] = useState("types");
  const [form] = Form.useForm();
  const [detailForm] = Form.useForm();

  // Pagination states
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [detailPagination, setDetailPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Search states
  const [searchText, setSearchText] = useState("");
  const [selectedPostType, setSelectedPostType] = useState(null);

  // File upload states
  const [photoFileList, setPhotoFileList] = useState([]);
  const [videoFileList, setVideoFileList] = useState([]);
  const [pdfFileList, setPdfFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const fetchPostTypes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await postTypesAPI.getPostTypes({
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchText,
      });

      if (response.success) {
        setPostTypes(response.data);
        setPagination((prev) => ({
          ...prev,
          total: response.pagination.total,
        }));
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการโหลดข้อมูลประเภทโพสต์");
    } finally {
      setLoading(false);
    }
  }, [message]);

  const fetchPostDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await postDetailsAPI.getPostDetails({
        page: detailPagination.current,
        limit: detailPagination.pageSize,
        search: searchText,
        postTypeId: selectedPostType,
        withMedia: true,
      });

      if (response.success) {
        setPostDetails(response.data);
        setDetailPagination((prev) => ({
          ...prev,
          total: response.pagination.total,
        }));
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการโหลดข้อมูลโพสต์");
    } finally {
      setLoading(false);
    }
  }, [message]);

  // Initial load
  useEffect(() => {
    fetchPostTypes();
  }, []);

  // Search and filter changes for post types
  useEffect(() => {
    if (activeTab === "types") {
      fetchPostTypes();
    }
  }, [activeTab, fetchPostTypes, searchText]);

  // Pagination changes for post types
  useEffect(() => {
    if (activeTab === "types") {
      fetchPostTypes();
    }
  }, [activeTab, fetchPostTypes, pagination.pageSize]);

  // Tab change and search/filter changes for post details
  useEffect(() => {
    if (activeTab === "details") {
      fetchPostDetails();
    }
  }, [activeTab, fetchPostDetails, searchText, selectedPostType]);

  // Pagination changes for post details
  useEffect(() => {
    if (activeTab === "details") {
      fetchPostDetails();
    }
  }, [activeTab, detailPagination.pageSize, fetchPostDetails]);

  // Post Types Management
  const handleCreatePostType = () => {
    setEditingRecord(null);
    setModalVisible(true);
    form.resetFields();
  };

  const handleEditPostType = (record) => {
    setEditingRecord(record);
    setModalVisible(true);
    form.setFieldsValue(record);
  };

  const handleDeletePostType = async (id) => {
    try {
      const response = await postTypesAPI.deletePostType(id);
      if (response.success) {
        message.success("ลบประเภทโพสต์สำเร็จ");
        fetchPostTypes();
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการลบประเภทโพสต์");
    }
  };

  const handleSubmitPostType = async (values) => {
    try {
      setLoading(true);
      let response;

      if (editingRecord) {
        response = await postTypesAPI.updatePostType(editingRecord.id, values);
      } else {
        response = await postTypesAPI.createPostType(values);
      }

      if (response.success) {
        message.success(
          editingRecord ? "แก้ไขประเภทโพสต์สำเร็จ" : "เพิ่มประเภทโพสต์สำเร็จ"
        );
        setModalVisible(false);
        fetchPostTypes();
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  // Post Details Management
  const handleCreatePostDetail = () => {
    setEditingRecord(null);
    setDetailModalVisible(true);
    detailForm.resetFields();
    setPhotoFileList([]);
    setVideoFileList([]);
    setPdfFileList([]);
  };

  const handleEditPostDetail = (record) => {
    setEditingRecord(record);
    setDetailModalVisible(true);
    detailForm.setFieldsValue({
      ...record,
      date: record.date ? dayjs(record.date) : null,
    });

    // Set existing files
    setPhotoFileList(
      record.photos?.map((photo) => ({
        uid: photo.id,
        name: photo.post_photo_file,
        status: "done",
        url: `https://banpho.sosmartsolution.com/storage/${photo.post_photo_file}`,
      })) || []
    );

    setVideoFileList(
      record.videos?.map((video) => ({
        uid: video.id,
        name: video.post_video_file,
        status: "done",
        url: `https://banpho.sosmartsolution.com/storage/${video.post_video_file}`,
      })) || []
    );

    setPdfFileList(
      record.pdfs?.map((pdf) => ({
        uid: pdf.id,
        name: pdf.post_pdf_file,
        status: "done",
        url: `https://banpho.sosmartsolution.com/storage/${pdf.post_pdf_file}`,
      })) || []
    );
  };

  const handleViewPostDetail = (record) => {
    setSelectedRecord(record);
    setViewModalVisible(true);
  };

  const handleDeletePostDetail = async (id) => {
    try {
      const response = await postDetailsAPI.deletePostDetail(id);
      if (response.success) {
        message.success("ลบโพสต์สำเร็จ");
        fetchPostDetails();
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการลบโพสต์");
    }
  };

  // File upload handlers
  const handleFileUpload = async (file) => {
    try {
      setUploading(true);
      const result = await uploadFileToServer(file);

      console.log("Upload result:", result);

      if (result.success) {
        // API returns 'url' not 'file_url'
        let fileUrl = result.url || result.file_url;
        
        // Clean up escaped slashes from JSON response
        fileUrl = fileUrl.replace(/\\\//g, '/');
        
        // Extract path from URL - handle both /storage/ and /storage/uploads/ patterns
        let filePath = fileUrl.replace(
          "https://banpho.sosmartsolution.com/storage/",
          ""
        );

        // If the path doesn't start with uploads/, it might be the filename only
        if (!filePath.startsWith("uploads/") && result.filename) {
          filePath = `uploads/${result.filename}`;
        }

        console.log("Original URL:", result.url);
        console.log("Cleaned File URL:", fileUrl);
        console.log("Extracted File Path:", filePath);

        const uploadedFile = {
          uid: file.uid,
          name: file.name,
          status: "done",
          url: fileUrl,
          path: filePath,
        };

        console.log("Uploaded file object:", uploadedFile);
        return uploadedFile;
      }
    } catch (error) {
      console.error("File upload error:", error);
      message.error(`เกิดข้อผิดพลาดในการอัปโหลดไฟล์: ${file.name}`);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitPostDetail = async (values) => {
    try {
      setLoading(true);

      // Prepare media data
      const photos = photoFileList
        .filter((file) => file.status === "done")
        .map((file) => ({
          post_photo_file: file.path || file.name,
          post_photo_status: "active",
        }));

      const videos = videoFileList
        .filter((file) => file.status === "done")
        .map((file) => ({
          post_video_file: file.path || file.name,
        }));

      const pdfs = pdfFileList
        .filter((file) => file.status === "done")
        .map((file) => ({
          post_pdf_file: file.path || file.name,
        }));

      const postData = {
        ...values,
        date: values.date ? values.date.format("YYYY-MM-DD") : null,
        photos,
        videos,
        pdfs,
      };

      // Debug logging
      console.log("Submitting post data:", postData);
      console.log("Photo file list:", photoFileList);
      console.log("Video file list:", videoFileList);
      console.log("PDF file list:", pdfFileList);

      let response;
      if (editingRecord) {
        response = await postDetailsAPI.updatePostDetail(
          editingRecord.id,
          postData
        );
      } else {
        response = await postDetailsAPI.createPostDetail(postData);
      }

      if (response.success) {
        message.success(
          editingRecord ? "แก้ไขโพสต์สำเร็จ" : "เพิ่มโพสต์สำเร็จ"
        );
        setDetailModalVisible(false);
        fetchPostDetails();
      }
    } catch (error) {
      console.error("Error submitting post detail:", error);
      message.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  // Table columns for post types
  const postTypeColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "ชื่อประเภท",
      dataIndex: "type_name",
      key: "type_name",
    },
    {
      title: "วันที่สร้าง",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "การจัดการ",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditPostType(record)}
          >
            แก้ไข
          </Button>
          <Popconfirm
            title="คุณแน่ใจหรือไม่ที่จะลบประเภทโพสต์นี้?"
            onConfirm={() => handleDeletePostType(record.id)}
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

  // Table columns for post details
  const postDetailColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "ประเภท",
      dataIndex: "type_name",
      key: "type_name",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "หัวข้อ",
      dataIndex: "title_name",
      key: "title_name",
      ellipsis: true,
    },
    {
      title: "วันที่",
      dataIndex: "date",
      key: "date",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "สื่อ",
      key: "media",
      render: (_, record) => (
        <Space>
          {record.photos?.length > 0 && (
            <Tag icon={<FileImageOutlined />} color="green">
              รูป {record.photos.length}
            </Tag>
          )}
          {record.videos?.length > 0 && (
            <Tag icon={<VideoCameraOutlined />} color="red">
              วิดีโอ {record.videos.length}
            </Tag>
          )}
          {record.pdfs?.length > 0 && (
            <Tag icon={<FilePdfOutlined />} color="orange">
              PDF {record.pdfs.length}
            </Tag>
          )}
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
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewPostDetail(record)}
          >
            ดู
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditPostDetail(record)}
          >
            แก้ไข
          </Button>
          <Popconfirm
            title="คุณแน่ใจหรือไม่ที่จะลบโพสต์นี้?"
            onConfirm={() => handleDeletePostDetail(record.id)}
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

  const tabItems = [
    {
      key: "types",
      label: "ประเภทโพสต์",
      children: (
        <Card>
          <div className="mb-4 flex justify-between items-center">
            <Space>
              <Input.Search
                placeholder="ค้นหาประเภทโพสต์..."
                allowClear
                onSearch={setSearchText}
                style={{ width: 300 }}
              />
            </Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreatePostType}
            >
              เพิ่มประเภทโพสต์
            </Button>
          </div>

          <Table
            columns={postTypeColumns}
            dataSource={postTypes}
            rowKey="id"
            loading={loading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              onChange: (page, pageSize) => {
                setPagination((prev) => ({
                  ...prev,
                  current: page,
                  pageSize,
                }));
              },
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} จาก ${total} รายการ`,
            }}
          />
        </Card>
      ),
    },
    {
      key: "details",
      label: "โพสต์และเนื้อหา",
      children: (
        <Card>
          <div className="mb-4 flex justify-between items-center">
            <Space>
              <Input.Search
                placeholder="ค้นหาโพสต์..."
                allowClear
                onSearch={setSearchText}
                style={{ width: 300 }}
              />
              <Select
                placeholder="เลือกประเภทโพสต์"
                allowClear
                style={{ width: 200 }}
                onChange={setSelectedPostType}
              >
                {postTypes.map((type) => (
                  <Select.Option key={type.id} value={type.id}>
                    {type.type_name}
                  </Select.Option>
                ))}
              </Select>
            </Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreatePostDetail}
            >
              เพิ่มโพสต์
            </Button>
          </div>

          <Table
            columns={postDetailColumns}
            dataSource={postDetails}
            rowKey="id"
            loading={loading}
            pagination={{
              current: detailPagination.current,
              pageSize: detailPagination.pageSize,
              total: detailPagination.total,
              onChange: (page, pageSize) => {
                setDetailPagination((prev) => ({
                  ...prev,
                  current: page,
                  pageSize,
                }));
              },
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} จาก ${total} รายการ`,
            }}
          />
        </Card>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Title level={2}>จัดการโพสต์และเนื้อหา</Title>
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      {/* Post Type Modal */}
      <Modal
        title={editingRecord ? "แก้ไขประเภทโพสต์" : "เพิ่มประเภทโพสต์"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmitPostType}>
          <Form.Item
            name="type_name"
            label="ชื่อประเภทโพสต์"
            rules={[{ required: true, message: "กรุณากรอกชื่อประเภทโพสต์" }]}
          >
            <Input placeholder="กรอกชื่อประเภทโพสต์" />
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={() => setModalVisible(false)}>ยกเลิก</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingRecord ? "บันทึกการแก้ไข" : "เพิ่มประเภทโพสต์"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>{" "}
      {/* Post Detail Modal */}
      <Modal
        title={editingRecord ? "แก้ไขโพสต์" : "เพิ่มโพสต์"}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={detailForm}
          layout="vertical"
          onFinish={handleSubmitPostDetail}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="post_type_id"
                label="ประเภทโพสต์"
                rules={[{ required: true, message: "กรุณาเลือกประเภทโพสต์" }]}
              >
                <Select placeholder="เลือกประเภทโพสต์">
                  {postTypes.map((type) => (
                    <Select.Option key={type.id} value={type.id}>
                      {type.type_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="date" label="วันที่">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="title_name"
            label="หัวข้อ"
            rules={[{ required: true, message: "กรุณากรอกหัวข้อ" }]}
          >
            <Input placeholder="กรอกหัวข้อโพสต์" />
          </Form.Item>

          <Form.Item name="topic_name" label="หัวข้อย่อย">
            <Input placeholder="กรอกหัวข้อย่อย (ถ้ามี)" />
          </Form.Item>

          <Form.Item name="details" label="รายละเอียด">
            <TextArea rows={4} placeholder="กรอกรายละเอียดโพสต์" />
          </Form.Item>

          <Divider>ไฟล์สื่อ</Divider>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="รูปภาพ">
                <Upload
                  listType="picture-card"
                  fileList={photoFileList}
                  onChange={({ fileList }) => setPhotoFileList(fileList)}
                  beforeUpload={async (file) => {
                    const uploadedFile = await handleFileUpload(file);
                    if (uploadedFile) {
                      setPhotoFileList((prev) => {
                        // Remove the uploading file and add the uploaded file
                        const filteredList = prev.filter(
                          (f) => f.uid !== file.uid
                        );
                        return [...filteredList, uploadedFile];
                      });
                    }
                    return false;
                  }}
                  accept="image/*"
                  multiple
                >
                  {photoFileList.length >= 8 ? null : (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>อัปโหลด</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="วิดีโอ">
                <Upload
                  fileList={videoFileList}
                  onChange={({ fileList }) => setVideoFileList(fileList)}
                  beforeUpload={async (file) => {
                    const uploadedFile = await handleFileUpload(file);
                    if (uploadedFile) {
                      setVideoFileList((prev) => {
                        // Remove the uploading file and add the uploaded file
                        const filteredList = prev.filter(
                          (f) => f.uid !== file.uid
                        );
                        return [...filteredList, uploadedFile];
                      });
                    }
                    return false;
                  }}
                  accept="video/*"
                  multiple
                >
                  <Button icon={<UploadOutlined />}>อัปโหลดวิดีโอ</Button>
                </Upload>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="ไฟล์ PDF">
                <Upload
                  fileList={pdfFileList}
                  onChange={({ fileList }) => setPdfFileList(fileList)}
                  beforeUpload={async (file) => {
                    const uploadedFile = await handleFileUpload(file);
                    if (uploadedFile) {
                      setPdfFileList((prev) => {
                        // Remove the uploading file and add the uploaded file
                        const filteredList = prev.filter(
                          (f) => f.uid !== file.uid
                        );
                        return [...filteredList, uploadedFile];
                      });
                    }
                    return false;
                  }}
                  accept=".pdf"
                  multiple
                >
                  <Button icon={<UploadOutlined />}>อัปโหลด PDF</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={() => setDetailModalVisible(false)}>
                ยกเลิก
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading || uploading}
              >
                {editingRecord ? "บันทึกการแก้ไข" : "เพิ่มโพสต์"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      {/* View Post Detail Modal */}
      <Modal
        title="รายละเอียดโพสต์"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            ปิด
          </Button>,
        ]}
        width={900}
      >
        {selectedRecord && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="ประเภท" span={1}>
                <Tag color="blue">{selectedRecord.type_name}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="วันที่" span={1}>
                {selectedRecord.date
                  ? dayjs(selectedRecord.date).format("DD/MM/YYYY")
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="หัวข้อ" span={2}>
                {selectedRecord.title_name}
              </Descriptions.Item>
              {selectedRecord.topic_name && (
                <Descriptions.Item label="หัวข้อย่อย" span={2}>
                  {selectedRecord.topic_name}
                </Descriptions.Item>
              )}
              {selectedRecord.details && (
                <Descriptions.Item label="รายละเอียด" span={2}>
                  <div style={{ whiteSpace: "pre-wrap" }}>
                    {selectedRecord.details}
                  </div>
                </Descriptions.Item>
              )}
            </Descriptions>

            {/* Media Display */}
            {(selectedRecord.photos?.length > 0 ||
              selectedRecord.videos?.length > 0 ||
              selectedRecord.pdfs?.length > 0) && (
              <>
                <Divider>ไฟล์สื่อ</Divider>

                {selectedRecord.photos?.length > 0 && (
                  <div className="mb-4">
                    <Title level={5}>
                      รูปภาพ ({selectedRecord.photos.length})
                    </Title>
                    <div className="grid grid-cols-4 gap-2">
                      {selectedRecord.photos.map((photo, index) => (
                        <Image
                          key={photo.id}
                          width={150}
                          height={150}
                          src={`https://banpho.sosmartsolution.com/storage/${photo.post_photo_file}`}
                          alt={`Photo ${index + 1}`}
                          style={{ objectFit: "cover" }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {selectedRecord.videos?.length > 0 && (
                  <div className="mb-4">
                    <Title level={5}>
                      วิดีโอ ({selectedRecord.videos.length})
                    </Title>
                    <div className="space-y-2">
                      {selectedRecord.videos.map((video, index) => (
                        <div
                          key={video.id}
                          className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                        >
                          <VideoCameraOutlined className="text-red-500" />
                          <a
                            href={`https://banpho.sosmartsolution.com/storage/${video.post_video_file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            วิดีโอ {index + 1}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedRecord.pdfs?.length > 0 && (
                  <div className="mb-4">
                    <Title level={5}>
                      ไฟล์ PDF ({selectedRecord.pdfs.length})
                    </Title>
                    <div className="space-y-2">
                      {selectedRecord.pdfs.map((pdf, index) => (
                        <div
                          key={pdf.id}
                          className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                        >
                          <FilePdfOutlined className="text-orange-500" />
                          <a
                            href={`https://banpho.sosmartsolution.com/storage/${pdf.post_pdf_file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            PDF {index + 1}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
