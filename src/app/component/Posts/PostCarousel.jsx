'use client';

import React, { useState, useEffect } from 'react';
import { Carousel, Card, Typography, Tag, Button, Image, Space } from 'antd';
import { 
  CalendarOutlined, 
  EyeOutlined, 
  FileImageOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons';
import { postDetailsAPI } from '@/lib/api';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import Link from 'next/link';

dayjs.locale('th');

const { Title, Text, Paragraph } = Typography;

// Custom Arrow Components
const CustomPrevArrow = ({ onClick }) => (
  <Button
    type="primary"
    shape="circle"
    icon={<LeftOutlined />}
    onClick={onClick}
    style={{
      position: 'absolute',
      left: 16,
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 2,
      width: 48,
      height: 48,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  />
);

const CustomNextArrow = ({ onClick }) => (
  <Button
    type="primary"
    shape="circle"
    icon={<RightOutlined />}
    onClick={onClick}
    style={{
      position: 'absolute',
      right: 16,
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 2,
      width: 48,
      height: 48,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  />
);

export default function PostCarousel({ limit = 5, height = 400 }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCarouselPosts();
  }, [limit]);

  const fetchCarouselPosts = async () => {
    try {
      setLoading(true);
      const response = await postDetailsAPI.getPostDetails({
        page: 1,
        limit: limit,
        withMedia: true
      });

      if (response.success) {
        // Filter posts that have images for better carousel display
        const postsWithImages = response.data.filter(post => 
          post.photos && post.photos.length > 0
        );
        setPosts(postsWithImages.length > 0 ? postsWithImages : response.data);
      }
    } catch (error) {
      console.error('Error fetching carousel posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const truncateText = (text, maxLength = 120) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading || posts.length === 0) {
    return (
      <div style={{ height, background: '#f5f5f5', borderRadius: 12 }}>
        <Card loading={loading} style={{ height: '100%' }} />
      </div>
    );
  }

  return (
    <div className="post-carousel" style={{ position: 'relative' }}>
      <Carousel
        autoplay
        autoplaySpeed={5000}
        dots={true}
        arrows={true}
        prevArrow={<CustomPrevArrow />}
        nextArrow={<CustomNextArrow />}
        style={{ borderRadius: 12, overflow: 'hidden' }}
      >
        {posts.map((post) => (
          <div key={post.id}>
            <div 
              style={{ 
                height, 
                position: 'relative',
                borderRadius: 12,
                overflow: 'hidden'
              }}
            >
              {/* Background Image */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: post.photos && post.photos.length > 0 
                    ? `url(https://banpho.sosmartsolution.com/storage/${post.photos[0].post_photo_file})`
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'brightness(0.4)'
                }}
              />

              {/* Content Overlay */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                  color: 'white',
                  padding: '40px 32px 32px',
                  zIndex: 1
                }}
              >
                {/* Post Type and Date */}
                <Space size="middle" className="mb-3" wrap>
                  <Tag color="blue" style={{ fontSize: 12 }}>
                    {post.type_name}
                  </Tag>
                  {post.date && (
                    <Tag 
                      icon={<CalendarOutlined />} 
                      color="green" 
                      style={{ fontSize: 12 }}
                    >
                      {dayjs(post.date).format('DD MMM YYYY')}
                    </Tag>
                  )}
                </Space>

                {/* Title */}
                <Title 
                  level={2} 
                  style={{ 
                    color: 'white', 
                    marginBottom: 12,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                  }}
                >
                  {post.title_name}
                </Title>

                {/* Topic Name */}
                {post.topic_name && (
                  <Title 
                    level={4} 
                    style={{ 
                      color: '#e0e0e0', 
                      marginBottom: 16,
                      fontWeight: 400,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                    }}
                  >
                    {post.topic_name}
                  </Title>
                )}

                {/* Details */}
                <Paragraph 
                  style={{ 
                    color: '#f0f0f0', 
                    marginBottom: 20,
                    fontSize: 16,
                    lineHeight: 1.6,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                  }}
                >
                  {truncateText(post.details)}
                </Paragraph>

                {/* Action Button */}
                <Link href="/posts">
                  <Button 
                    type="primary" 
                    size="large"
                    icon={<EyeOutlined />}
                    style={{
                      borderRadius: 8,
                      height: 44,
                      paddingLeft: 20,
                      paddingRight: 20,
                      fontSize: 14,
                      fontWeight: 500
                    }}
                  >
                    อ่านเพิ่มเติม
                  </Button>
                </Link>
              </div>

              {/* Gradient Overlay for better text readability */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.7) 100%)',
                  zIndex: 0
                }}
              />
            </div>
          </div>
        ))}
      </Carousel>

      <style jsx global>{`
        .post-carousel .ant-carousel .ant-carousel-dots {
          bottom: 20px;
        }
        
        .post-carousel .ant-carousel .ant-carousel-dots li button {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
        }
        
        .post-carousel .ant-carousel .ant-carousel-dots li.ant-carousel-dots-active button {
          background: white;
        }
        
        .post-carousel .ant-carousel .ant-carousel-dots li:hover button {
          background: rgba(255, 255, 255, 0.8);
        }
      `}</style>
    </div>
  );
}