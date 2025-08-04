"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Image,
  Tag,
  Button,
  Modal,
  Pagination,
  Select,
  Input,
  Space,
  Divider,
  Empty,
} from "antd";
import {
  EyeOutlined,
  CalendarOutlined,
  FileImageOutlined,
  VideoCameraOutlined,
  FilePdfOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { postTypesAPI, postDetailsAPI } from "@/lib/api";
import dayjs from "dayjs";
import "dayjs/locale/th";

dayjs.locale("th");

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [postTypes, setPostTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Filter states
  const [selectedType, setSelectedType] = useState(null);
  const [searchText, setSearchText] = useState("");

  // Pagination
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12,
    total: 0,
  });

  useEffect(() => {
    fetchPostTypes();
    fetchPosts();
  }, [pagination.current, selectedType, searchText]);

  const fetchPostTypes = async () => {
    try {
      const response = await postTypesAPI.getPostTypes({ limit: 100 });
      if (response.success) {
        setPostTypes(response.data);
      }
    } catch (error) {
      console.error("Error fetching post types:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postDetailsAPI.getPostDetails({
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchText,
        postTypeId: selectedType,
        withMedia: true,
      });

      if (response.success) {
        setPosts(response.data);
        setPagination((prev) => ({
          ...prev,
          total: response.pagination.total,
        }));
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPost = (post) => {
    setSelectedPost(post);
    setModalVisible(true);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleTypeFilter = (value) => {
    setSelectedType(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handlePageChange = (page, pageSize) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize,
    }));
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const getMediaCount = (post) => {
    const photoCount = post.photos?.length || 0;
    const videoCount = post.videos?.length || 0;
    const pdfCount = post.pdfs?.length || 0;
    return { photoCount, videoCount, pdfCount };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Title level={2} className="mb-0">
            ข่าวสารและกิจกรรม
          </Title>
          <Text type="secondary">
            ติดตามข่าวสารและกิจกรรมขององค์การบริหารส่วนตำบลบ้านโพธิ์
          </Text>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters */}
        <Card className="mb-6">
          <Row gutter={16} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="ค้นหาข่าวสาร..."
                allowClear
                onSearch={handleSearch}
                style={{ width: "100%" }}
                enterButton={<SearchOutlined />}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Select
                placeholder="เลือกประเภทข่าว"
                allowClear
                style={{ width: "100%" }}
                onChange={handleTypeFilter}
                value={selectedType}
              >
                {postTypes.map((type) => (
                  <Select.Option key={type.id} value={type.id}>
                    {type.type_name}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <Text type="secondary">พบ {pagination.total} รายการ</Text>
            </Col>
          </Row>
        </Card>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <Card>
            <Empty
              description="ไม่พบข่าวสารที่ค้นหา"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </Card>
        ) : (
          <>
            <Row gutter={[16, 16]}>
              {posts.map((post) => {
                const { photoCount, videoCount, pdfCount } =
                  getMediaCount(post);
                const hasMedia =
                  photoCount > 0 || videoCount > 0 || pdfCount > 0;

                return (
                  <Col xs={24} sm={12} lg={8} xl={6} key={post.id}>
                    <Card
                      hoverable
                      loading={loading}
                      cover={
                        post.photos && post.photos.length > 0 ? (
                          <div style={{ height: 200, overflow: "hidden" }}>
                            <Image
                              alt={post.title_name}
                              src={`https://banpho.sosmartsolution.com${post.photos[0].post_photo_file}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                              preview={false}
                            />
                          </div>
                        ) : (
                          <div
                            style={{
                              height: 200,
                              background:
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                            }}
                          >
                            <FileImageOutlined
                              style={{ fontSize: 48, opacity: 0.5 }}
                            />
                          </div>
                        )
                      }
                      actions={[
                        <Button
                          key="view"
                          type="text"
                          icon={<EyeOutlined />}
                          onClick={() => handleViewPost(post)}
                        >
                          อ่านเพิ่มเติม
                        </Button>,
                      ]}
                    >
                      <Card.Meta
                        title={
                          <div>
                            <Title
                              level={5}
                              ellipsis={{ rows: 2 }}
                              className="mb-2"
                            >
                              {post.title_name}
                            </Title>
                            <Space size="small" wrap>
                              <Tag color="blue">{post.type_name}</Tag>
                              {post.date && (
                                <Tag icon={<CalendarOutlined />} color="green">
                                  {dayjs(post.date).format("DD MMM YYYY")}
                                </Tag>
                              )}
                            </Space>
                          </div>
                        }
                        description={
                          <div>
                            {post.topic_name && (
                              <Text type="secondary" className="block mb-2">
                                {post.topic_name}
                              </Text>
                            )}
                            <Paragraph
                              ellipsis={{ rows: 3 }}
                              className="mb-2"
                              style={{ minHeight: 60 }}
                            >
                              {post.details || "ไม่มีรายละเอียด"}
                            </Paragraph>

                            {hasMedia && (
                              <Space size="small">
                                {photoCount > 0 && (
                                  <Tag
                                    icon={<FileImageOutlined />}
                                    color="green"
                                    size="small"
                                  >
                                    {photoCount}
                                  </Tag>
                                )}
                                {videoCount > 0 && (
                                  <Tag
                                    icon={<VideoCameraOutlined />}
                                    color="red"
                                    size="small"
                                  >
                                    {videoCount}
                                  </Tag>
                                )}
                                {pdfCount > 0 && (
                                  <Tag
                                    icon={<FilePdfOutlined />}
                                    color="orange"
                                    size="small"
                                  >
                                    {pdfCount}
                                  </Tag>
                                )}
                              </Space>
                            )}
                          </div>
                        }
                      />
                    </Card>
                  </Col>
                );
              })}
            </Row>

            {/* Pagination */}
            <div className="text-center mt-8">
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={handlePageChange}
                showSizeChanger
                showQuickJumper
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} จาก ${total} รายการ`
                }
                pageSizeOptions={["12", "24", "48"]}
              />
            </div>
          </>
        )}
      </div>

      {/* Post Detail Modal */}
      <Modal
        title={selectedPost?.title_name}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={900}
        style={{ top: 20 }}
      >
        {selectedPost && (
          <div>
            {/* Post Info */}
            <Space size="middle" className="mb-4">
              <Tag color="blue">{selectedPost.type_name}</Tag>
              {selectedPost.date && (
                <Tag icon={<CalendarOutlined />} color="green">
                  {dayjs(selectedPost.date).format("DD MMMM YYYY")}
                </Tag>
              )}
            </Space>

            {selectedPost.topic_name && (
              <Title level={4} className="mb-4">
                {selectedPost.topic_name}
              </Title>
            )}

            {selectedPost.details && (
              <div className="mb-6">
                <Paragraph
                  style={{
                    whiteSpace: "pre-wrap",
                    fontSize: 16,
                    lineHeight: 1.8,
                  }}
                >
                  {selectedPost.details}
                </Paragraph>
              </div>
            )}

            {/* Media Display */}
            {selectedPost.photos && selectedPost.photos.length > 0 && (
              <div className="mb-6">
                <Title level={5}>รูปภาพ ({selectedPost.photos.length})</Title>
                <Row gutter={[8, 8]}>
                  {selectedPost.photos.map((photo, index) => (
                    <Col xs={12} sm={8} md={6} key={photo.id}>
                      <Image
                        src={`https://banpho.sosmartsolution.com/storage/${photo.post_photo_file}`}
                        alt={`Photo ${index + 1}`}
                        style={{
                          width: "100%",
                          height: 150,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            {selectedPost.videos && selectedPost.videos.length > 0 && (
              <div className="mb-6">
                <Title level={5}>วิดีโอ ({selectedPost.videos.length})</Title>
                <div className="space-y-2">
                  {selectedPost.videos.map((video, index) => (
                    <Card key={video.id} size="small">
                      <Space>
                        <VideoCameraOutlined className="text-red-500" />
                        <a
                          href={`https://banpho.sosmartsolution.com/storage/${video.post_video_file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          วิดีโอ {index + 1}
                        </a>
                      </Space>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {selectedPost.pdfs && selectedPost.pdfs.length > 0 && (
              <div className="mb-6">
                <Title level={5}>เอกสาร PDF ({selectedPost.pdfs.length})</Title>
                <div className="space-y-2">
                  {selectedPost.pdfs.map((pdf, index) => (
                    <Card key={pdf.id} size="small">
                      <Space>
                        <FilePdfOutlined className="text-orange-500" />
                        <a
                          href={`https://banpho.sosmartsolution.com/storage/${pdf.post_pdf_file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          เอกสาร PDF {index + 1}
                        </a>
                      </Space>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
