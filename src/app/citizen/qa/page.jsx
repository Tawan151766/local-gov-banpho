"use client";

import React, { useState, useEffect } from "react";
import {
  Input,
  Card,
  List,
  Typography,
  Space,
  Tag,
  Collapse,
  Row,
  Col,
  Spin,
  Empty,
  Badge,
  Button,
} from "antd";
import {
  SearchOutlined,
  QuestionCircleOutlined,
  EyeOutlined,
  StarOutlined,
  FireOutlined,
  PlusOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import { qaAPI } from "@/lib/api";
import SubmitQuestionModal from "@/components/SubmitQuestionModal";
import SubmitCommentModal from "@/components/SubmitCommentModal";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

export default function QAPage() {
  const [categories, setCategories] = useState([]);
  const [qaItems, setQaItems] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedQaItem, setSelectedQaItem] = useState(null);

  // โหลดข้อมูลเริ่มต้น
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      // โหลดหมวดหมู่
      const categoriesResponse = await qaAPI.getCategories({
        withItems: true,
        activeOnly: true,
      });

      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data);
      }

      // โหลด Q&A ที่เป็น featured
      const featuredResponse = await qaAPI.getItems({
        featuredOnly: true,
        limit: 5,
      });

      if (featuredResponse.success) {
        setFeaturedItems(featuredResponse.data);
      }

      // โหลด Q&A ทั้งหมด
      const itemsResponse = await qaAPI.getItems({
        limit: 20,
      });

      if (itemsResponse.success) {
        setQaItems(itemsResponse.data);
      }
    } catch (error) {
      console.error("Failed to load Q&A data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ค้นหา Q&A
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchQuery("");
      return;
    }

    try {
      setSearching(true);
      setSearchQuery(query);

      const response = await qaAPI.search(query, 20);

      if (response.success) {
        setSearchResults(response.data);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setSearching(false);
    }
  };

  // เลือกหมวดหมู่
  const handleCategorySelect = async (categoryId) => {
    try {
      setLoading(true);
      setSelectedCategory(categoryId);
      setSearchQuery("");
      setSearchResults([]);

      const response = await qaAPI.getItems({
        categoryId,
        limit: 50,
      });

      if (response.success) {
        setQaItems(response.data);
      }
    } catch (error) {
      console.error("Failed to load category items:", error);
    } finally {
      setLoading(false);
    }
  };

  // เพิ่มจำนวนการดู
  const handleItemView = async (itemId) => {
    try {
      await qaAPI.incrementView(itemId);
    } catch (error) {
      console.error("Failed to increment view:", error);
    }
  };

  // เปิด modal แสดงความคิดเห็น
  const handleShowComment = (item) => {
    setSelectedQaItem(item);
    setCommentModalVisible(true);
  };

  // รีเซ็ตการกรอง
  const resetFilter = () => {
    setSelectedCategory(null);
    setSearchQuery("");
    setSearchResults([]);
    loadInitialData();
  };

  const displayItems = searchQuery ? searchResults : qaItems;

  // สร้าง items สำหรับ Collapse component
  const collapseItems = displayItems.map((item, index) => ({
    key: index.toString(),
    label: (
      <div>
        <Text strong style={{ fontSize: "15px" }}>
          {item.question}
        </Text>
        <div style={{ marginTop: "4px" }}>
          <Space size="small">
            {item.category_name && (
              <Tag color="blue" size="small">
                {item.category_name}
              </Tag>
            )}
            {item.is_featured && (
              <Tag color="gold" size="small">
                <StarOutlined /> ยอดนิยม
              </Tag>
            )}
            <Space size="small">
              <EyeOutlined style={{ fontSize: "12px" }} />
              <Text
                type="secondary"
                style={{ fontSize: "12px" }}
              >
                {item.view_count || 0}
              </Text>
            </Space>
          </Space>
        </div>
      </div>
    ),
    children: (
      <div style={{ paddingLeft: "16px" }}>
        <Paragraph
          style={{ marginBottom: "16px", lineHeight: "1.6" }}
        >
          {item.answer}
        </Paragraph>

        {item.tags && (
          <div style={{ marginBottom: "12px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "12px" }}
            >
              แท็ก: {item.tags}
            </Text>
          </div>
        )}

        <div
          style={{ textAlign: "right", marginTop: "16px" }}
        >
          <Button
            type="default"
            size="small"
            icon={<CommentOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleShowComment(item);
            }}
          >
            แสดงความคิดเห็น
          </Button>
        </div>
      </div>
    ),
  }));

  return (
    <div className="w-full bg-white h-screen">
      <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Title level={2}>
            <QuestionCircleOutlined
              style={{ marginRight: "8px", color: "#1890ff" }}
            />
            คำถามที่พบบ่อย (FAQ)
          </Title>
          <Text type="secondary" style={{ fontSize: "16px" }}>
            ค้นหาคำตอบสำหรับคำถามที่พบบ่อยเกี่ยวกับบริการของเทศบาลตำบลบ้านโพธิ์
          </Text>
        </div>

        {/* Search */}
        <Card style={{ marginBottom: "24px" }}>
          <Search
            placeholder="ค้นหาคำถาม เช่น ใบรับรอง, ภาษี, น้ำประปา..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            loading={searching}
            style={{ marginBottom: "16px" }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {(selectedCategory || searchQuery) && (
              <Button type="link" onClick={resetFilter}>
                แสดงทั้งหมด
              </Button>
            )}

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setSubmitModalVisible(true)}
              style={{ marginLeft: "auto" }}
            >
              ส่งคำถามใหม่
            </Button>
          </div>
        </Card>

        <Row gutter={[24, 24]}>
          {/* Categories Sidebar */}
          <Col xs={24} md={8}>
            <Card
              title={
                <Space>
                  <FireOutlined style={{ color: "#ff4d4f" }} />
                  หมวดหมู่คำถาม
                </Space>
              }
              size="small"
            >
              <List
                dataSource={categories}
                renderItem={(category) => (
                  <List.Item
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        selectedCategory === category.id
                          ? "#f0f8ff"
                          : "transparent",
                      borderRadius: "4px",
                      padding: "8px",
                    }}
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    <Space
                      style={{ width: "100%", justifyContent: "space-between" }}
                    >
                      <Text strong={selectedCategory === category.id}>
                        {category.category_name}
                      </Text>
                      <Badge count={category.items_count} showZero />
                    </Space>
                  </List.Item>
                )}
              />
            </Card>

            {/* Featured Q&A */}
            {featuredItems.length > 0 && (
              <Card
                title={
                  <Space>
                    <StarOutlined style={{ color: "#faad14" }} />
                    คำถามยอดนิยม
                  </Space>
                }
                size="small"
                style={{ marginTop: "16px" }}
              >
                <List
                  dataSource={featuredItems}
                  renderItem={(item) => (
                    <List.Item style={{ padding: "8px 0" }}>
                      <div>
                        <Text
                          strong
                          style={{
                            fontSize: "13px",
                            cursor: "pointer",
                            color: "#1890ff",
                          }}
                          onClick={() => handleItemView(item.id)}
                        >
                          {item.question}
                        </Text>
                        <div style={{ marginTop: "4px" }}>
                          <Space size="small">
                            <EyeOutlined />
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                              {item.view_count || 0}
                            </Text>
                          </Space>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </Card>
            )}
          </Col>

          {/* Main Content */}
          <Col xs={24} md={16}>
            <Card>
              {searchQuery && (
                <div style={{ marginBottom: "16px" }}>
                  <Text type="secondary">
                    ผลการค้นหาสำหรับ: <Text strong>{searchQuery}"</Text>
                  </Text>
                  <Text type="secondary" style={{ marginLeft: "16px" }}>
                    ({displayItems.length} รายการ)
                  </Text>
                </div>
              )}

              {selectedCategory && (
                <div style={{ marginBottom: "16px" }}>
                  <Text type="secondary">
                    หมวดหมู่:{" "}
                    <Text strong>
                      {
                        categories.find((c) => c.id === selectedCategory)
                          ?.category_name
                      }
                    </Text>
                  </Text>
                  <Text type="secondary" style={{ marginLeft: "16px" }}>
                    ({displayItems.length} รายการ)
                  </Text>
                </div>
              )}

              <Spin spinning={loading}>
                {displayItems.length === 0 ? (
                  <Empty
                    description={
                      searchQuery
                        ? "ไม่พบคำตอบที่ตรงกับคำค้นหา"
                        : "ไม่มีคำถามในหมวดหมู่นี้"
                    }
                  />
                ) : (
                  <Collapse
                    ghost
                    expandIconPosition="end"
                    items={collapseItems}
                    onChange={(keys) => {
                      // เพิ่มจำนวนการดูเมื่อเปิดคำตอบ
                      keys.forEach((key) => {
                        const item = displayItems[parseInt(key)];
                        if (item) {
                          handleItemView(item.id);
                        }
                      });
                    }}
                  />
                )}
              </Spin>
            </Card>
          </Col>
        </Row>

        {/* Submit Question Modal */}
        <SubmitQuestionModal
          visible={submitModalVisible}
          onCancel={() => setSubmitModalVisible(false)}
          categories={categories}
        />

        {/* Submit Comment Modal */}
        <SubmitCommentModal
          visible={commentModalVisible}
          onCancel={() => {
            setCommentModalVisible(false);
            setSelectedQaItem(null);
          }}
          qaItem={selectedQaItem}
        />
      </div>
    </div>
  );
}