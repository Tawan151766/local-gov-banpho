'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  List,
  Typography,
  Space,
  Tag,
  Input,
  Row,
  Col,
  Spin,
  Empty,
  Badge,
  Button,
  Divider,
  Collapse,
  Alert
} from 'antd';
import {
  BookOutlined,
  SearchOutlined,
  FileTextOutlined,
  DownloadOutlined,
  EyeOutlined,
  StarOutlined,
  FolderOutlined
} from '@ant-design/icons';
import { manualAPI } from '@/lib/api';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Panel } = Collapse;

export default function ManualPage() {
  const [categories, setCategories] = useState([]);
  const [manuals, setManuals] = useState([]);
  const [featuredManuals, setFeaturedManuals] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // โหลดข้อมูลเริ่มต้น
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      // โหลดหมวดหมู่
      const categoriesResponse = await manualAPI.getCategories({
        withItems: true,
        activeOnly: true,
      });

      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data);
      }

      // โหลดคู่มือแนะนำ
      const featuredResponse = await manualAPI.getItems({
        featuredOnly: true,
        limit: 5,
      });

      if (featuredResponse.success) {
        setFeaturedManuals(featuredResponse.data);
      }

      // โหลดคู่มือทั้งหมด
      const itemsResponse = await manualAPI.getItems({
        limit: 20,
      });

      if (itemsResponse.success) {
        setManuals(itemsResponse.data);
      }
    } catch (error) {
      console.error('Failed to load manual data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ค้นหาคู่มือ
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchQuery('');
      return;
    }

    try {
      setSearching(true);
      setSearchQuery(query);

      const response = await manualAPI.search(query, { limit: 20 });

      if (response.success) {
        setSearchResults(response.data);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearching(false);
    }
  };

  // เลือกหมวดหมู่
  const handleCategorySelect = async (categoryId) => {
    try {
      setLoading(true);
      setSelectedCategory(categoryId);
      setSearchQuery('');
      setSearchResults([]);

      const response = await manualAPI.getItems({
        categoryId,
        limit: 50,
      });

      if (response.success) {
        setManuals(response.data);
      }
    } catch (error) {
      console.error('Failed to load category items:', error);
    } finally {
      setLoading(false);
    }
  };

  // รีเซ็ตการกรอง
  const resetFilter = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setSearchResults([]);
    loadInitialData();
  };

  // ดาวน์โหลดไฟล์
  const handleDownload = (filePath, fileName) => {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const displayItems = searchQuery ? searchResults : manuals;

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={2}>
          <BookOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
          คู่มือและเอกสาร
        </Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>
          คู่มือการใช้บริการและเอกสารต่างๆ ของเทศบาลตำบลบ้านโพธิ์
        </Text>
      </div>

      {/* Search */}
      <Card style={{ marginBottom: '24px' }}>
        <Search
          placeholder="ค้นหาคู่มือ เช่น การขอใบรับรอง, การชำระภาษี..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={handleSearch}
          loading={searching}
          style={{ marginBottom: '16px' }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {(selectedCategory || searchQuery) && (
            <Button type="link" onClick={resetFilter}>
              แสดงทั้งหมด
            </Button>
          )}
        </div>
      </Card>

      <Row gutter={[24, 24]}>
        {/* Categories Sidebar */}
        <Col xs={24} md={8}>
          <Card
            title={
              <Space>
                <FolderOutlined style={{ color: '#1890ff' }} />
                หมวดหมู่คู่มือ
              </Space>
            }
            size="small"
          >
            <List
              dataSource={categories}
              renderItem={(category) => (
                <List.Item
                  style={{
                    cursor: 'pointer',
                    backgroundColor:
                      selectedCategory === category.id ? '#f0f8ff' : 'transparent',
                    borderRadius: '4px',
                    padding: '8px',
                  }}
                  onClick={() => handleCategorySelect(category.id)}
                >
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Text strong={selectedCategory === category.id}>
                      {category.category_name}
                    </Text>
                    <Badge count={category.items_count} showZero />
                  </Space>
                </List.Item>
              )}
            />
          </Card>

          {/* Featured Manuals */}
          {featuredManuals.length > 0 && (
            <Card
              title={
                <Space>
                  <StarOutlined style={{ color: '#faad14' }} />
                  คู่มือแนะนำ
                </Space>
              }
              size="small"
              style={{ marginTop: '16px' }}
            >
              <List
                dataSource={featuredManuals}
                renderItem={(item) => (
                  <List.Item style={{ padding: '8px 0' }}>
                    <div>
                      <Text
                        strong
                        style={{
                          fontSize: '13px',
                          cursor: 'pointer',
                          color: '#1890ff',
                        }}
                      >
                        {item.title}
                      </Text>
                      <div style={{ marginTop: '4px' }}>
                        <Space size="small">
                          <EyeOutlined />
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {item.view_count || 0}
                          </Text>
                          {item.files_count > 0 && (
                            <>
                              <FileTextOutlined />
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                {item.files_count} ไฟล์
                              </Text>
                            </>
                          )}
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
              <div style={{ marginBottom: '16px' }}>
                <Text type="secondary">
                  ผลการค้นหาสำหรับ: <Text strong>"{searchQuery}"</Text>
                </Text>
                <Text type="secondary" style={{ marginLeft: '16px' }}>
                  ({displayItems.length} รายการ)
                </Text>
              </div>
            )}

            {selectedCategory && (
              <div style={{ marginBottom: '16px' }}>
                <Text type="secondary">
                  หมวดหมู่:{' '}
                  <Text strong>
                    {categories.find((c) => c.id === selectedCategory)?.category_name}
                  </Text>
                </Text>
                <Text type="secondary" style={{ marginLeft: '16px' }}>
                  ({displayItems.length} รายการ)
                </Text>
              </div>
            )}

            <Spin spinning={loading}>
              {displayItems.length === 0 ? (
                <Empty
                  description={
                    searchQuery
                      ? 'ไม่พบคู่มือที่ตรงกับคำค้นหา'
                      : 'ไม่มีคู่มือในหมวดหมู่นี้'
                  }
                />
              ) : (
                <List
                  dataSource={displayItems}
                  renderItem={(item) => (
                    <List.Item>
                      <Card
                        style={{ width: '100%' }}
                        bodyStyle={{ padding: '16px' }}
                      >
                        <div>
                          <Title level={4} style={{ marginBottom: '8px' }}>
                            <FileTextOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                            {searchQuery && item.title_highlighted ? (
                              <span dangerouslySetInnerHTML={{ __html: item.title_highlighted }} />
                            ) : (
                              item.title
                            )}
                          </Title>

                          <div style={{ marginBottom: '12px' }}>
                            <Space size="small">
                              {item.category_name && (
                                <Tag color="blue" size="small">
                                  {item.category_name}
                                </Tag>
                              )}
                              {item.is_featured && (
                                <Tag color="gold" size="small">
                                  <StarOutlined /> แนะนำ
                                </Tag>
                              )}
                              <Space size="small">
                                <EyeOutlined style={{ fontSize: '12px' }} />
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                  {item.view_count || 0}
                                </Text>
                              </Space>
                              {item.files_count > 0 && (
                                <Space size="small">
                                  <FileTextOutlined style={{ fontSize: '12px' }} />
                                  <Text type="secondary" style={{ fontSize: '12px' }}>
                                    {item.files_count} ไฟล์
                                  </Text>
                                </Space>
                              )}
                            </Space>
                          </div>

                          {item.description && (
                            <Paragraph
                              style={{ marginBottom: '12px' }}
                              ellipsis={{ rows: 2, expandable: true, symbol: 'อ่านเพิ่มเติม' }}
                            >
                              {searchQuery && item.description_highlighted ? (
                                <span dangerouslySetInnerHTML={{ __html: item.description_highlighted }} />
                              ) : (
                                item.description
                              )}
                            </Paragraph>
                          )}

                          {item.content && (
                            <Collapse ghost>
                              <Panel header="ดูเนื้อหาคู่มือ" key="content">
                                <div
                                  style={{
                                    backgroundColor: '#f9f9f9',
                                    padding: '16px',
                                    borderRadius: '6px',
                                    whiteSpace: 'pre-line',
                                    lineHeight: '1.6'
                                  }}
                                >
                                  {item.content}
                                </div>
                              </Panel>
                            </Collapse>
                          )}

                          {item.tags && (
                            <div style={{ marginTop: '12px' }}>
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                แท็ก: {item.tags}
                              </Text>
                            </div>
                          )}
                        </div>
                      </Card>
                    </List.Item>
                  )}
                />
              )}
            </Spin>
          </Card>
        </Col>
      </Row>
    </div>
  );
}