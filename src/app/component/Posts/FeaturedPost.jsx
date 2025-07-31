'use client';

import React, { useState, useEffect } from 'react';
import { Card, Typography, Tag, Button, Image, Space, Row, Col } from 'antd';
import { 
  CalendarOutlined, 
  EyeOutlined, 
  FileImageOutlined,
  VideoCameraOutlined,
  FilePdfOutlined 
} from '@ant-design/icons';
import { postDetailsAPI } from '@/lib/api';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import Link from 'next/link';

dayjs.locale('th');

const { Title, Text, Paragraph } = Typography;

export default function FeaturedPost() {
  const [featuredPost, setFeaturedPost] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFeaturedPost();
  }, []);

  const fetchFeaturedPost = async () => {
    try {
      setLoading(true);
      const response = await postDetailsAPI.getPostDetails({
        page: 1,
        limit: 1,
        withMedia: true
      });

      if (response.success && response.data.length > 0) {
        setFeaturedPost(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching featured post:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMediaCount = (post) => {
    const photoCount = post.photos?.length || 0;
    const videoCount = post.videos?.length || 0;
    const pdfCount = post.pdfs?.length || 0;
    return { photoCount, videoCount, pdfCount };
  };

  if (!featuredPost) {
    return null;
  }

  const { photoCount, videoCount, pdfCount } = getMediaCount(featuredPost);
  const hasMedia = photoCount > 0 || videoCount > 0 || pdfCount > 0;

  return (
    <Card 
      loading={loading}
      className="featured-post mb-8"
      style={{ 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        border: 'none',
        borderRadius: 16
      }}
    >
      <Row gutter={[32, 24]} align="middle">
        {/* Image Section */}
        <Col xs={24} lg={10}>
          <div style={{ borderRadius: 12, overflow: 'hidden', height: 300 }}>
            {featuredPost.photos && featuredPost.photos.length > 0 ? (
              <Image
                alt={featuredPost.title_name}
                src={`https://banpho.sosmartsolution.com/storage/${featuredPost.photos[0].post_photo_file}`}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover' 
                }}
                preview={false}
              />
            ) : (
              <div 
                style={{ 
                  height: '100%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}
              >
                <FileImageOutlined style={{ fontSize: 64, opacity: 0.5 }} />
              </div>
            )}
          </div>
        </Col>

        {/* Content Section */}
        <Col xs={24} lg={14}>
          <div className="featured-content">
            {/* Badge */}
            <div className="mb-4">
              <Tag 
                color="gold" 
                style={{ 
                  fontSize: 14, 
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontWeight: 'bold'
                }}
              >
                ข่าวเด่น
              </Tag>
            </div>

            {/* Post Type and Date */}
            <Space size="middle" className="mb-4" wrap>
              <Tag color="blue" style={{ fontSize: 12 }}>
                {featuredPost.type_name}
              </Tag>
              {featuredPost.date && (
                <Tag icon={<CalendarOutlined />} color="green" style={{ fontSize: 12 }}>
                  {dayjs(featuredPost.date).format('DD MMMM YYYY')}
                </Tag>
              )}
            </Space>

            {/* Title */}
            <Title level={2} className="mb-3" style={{ color: '#1a1a1a' }}>
              {featuredPost.title_name}
            </Title>

            {/* Topic Name */}
            {featuredPost.topic_name && (
              <Title level={4} className="mb-3" style={{ color: '#666', fontWeight: 400 }}>
                {featuredPost.topic_name}
              </Title>
            )}

            {/* Details */}
            <Paragraph 
              className="mb-4 text-base"
              ellipsis={{ rows: 4 }}
              style={{ color: '#555', lineHeight: 1.6 }}
            >
              {featuredPost.details || 'ไม่มีรายละเอียด'}
            </Paragraph>

            {/* Media Tags */}
            {hasMedia && (
              <Space size="small" className="mb-4">
                {photoCount > 0 && (
                  <Tag icon={<FileImageOutlined />} color="green">
                    รูปภาพ {photoCount}
                  </Tag>
                )}
                {videoCount > 0 && (
                  <Tag icon={<VideoCameraOutlined />} color="red">
                    วิดีโอ {videoCount}
                  </Tag>
                )}
                {pdfCount > 0 && (
                  <Tag icon={<FilePdfOutlined />} color="orange">
                    เอกสาร {pdfCount}
                  </Tag>
                )}
              </Space>
            )}

            {/* Action Button */}
            <Link href="/posts">
              <Button 
                type="primary" 
                size="large"
                icon={<EyeOutlined />}
                style={{
                  borderRadius: 8,
                  height: 48,
                  paddingLeft: 24,
                  paddingRight: 24,
                  fontSize: 16
                }}
              >
                อ่านเพิ่มเติม
              </Button>
            </Link>
          </div>
        </Col>
      </Row>
    </Card>
  );
}