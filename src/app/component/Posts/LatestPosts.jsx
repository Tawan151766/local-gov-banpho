'use client';

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Tag, Button, Image, Space } from 'antd';
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

export default function LatestPosts({ limit = 6, showTitle = true }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLatestPosts();
  }, [limit]);

  const fetchLatestPosts = async () => {
    try {
      setLoading(true);
      const response = await postDetailsAPI.getPostDetails({
        page: 1,
        limit: limit,
        withMedia: true
      });

      if (response.success) {
        setPosts(response.data);
      }
    } catch (error) {
      console.error('Error fetching latest posts:', error);
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

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="latest-posts">
      {showTitle && (
        <div className="text-center mb-8">
          <Title level={2} className="mb-2">
            ข่าวสารและกิจกรรม
          </Title>
          <Text type="secondary" className="text-lg">
            ติดตามข่าวสารและกิจกรรมล่าสุดขององค์การบริหารส่วนตำบลบ้านโพธิ์
          </Text>
        </div>
      )}

      <Row gutter={[24, 24]}>
        {posts.map((post, index) => {
          const { photoCount, videoCount, pdfCount } = getMediaCount(post);
          const hasMedia = photoCount > 0 || videoCount > 0 || pdfCount > 0;
          
          return (
            <Col xs={24} sm={12} lg={8} key={post.id}>
              <Card
                hoverable
                loading={loading}
                className="h-full"
                cover={
                  post.photos && post.photos.length > 0 ? (
                    <div style={{ height: 200, overflow: 'hidden' }}>
                      <Image
                        alt={post.title_name}
                        src={`https://banpho.sosmartsolution.com/storage/${post.photos[0].post_photo_file}`}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover' 
                        }}
                        preview={false}
                      />
                    </div>
                  ) : (
                    <div 
                      style={{ 
                        height: 200, 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}
                    >
                      <FileImageOutlined style={{ fontSize: 48, opacity: 0.5 }} />
                    </div>
                  )
                }
                actions={[
                  <Link href="/posts" key="view">
                    <Button 
                      type="text" 
                      icon={<EyeOutlined />}
                      className="w-full"
                    >
                      อ่านเพิ่มเติม
                    </Button>
                  </Link>
                ]}
              >
                <div className="flex flex-col h-full">
                  {/* Post Type and Date */}
                  <Space size="small" className="mb-3" wrap>
                    <Tag color="blue">{post.type_name}</Tag>
                    {post.date && (
                      <Tag icon={<CalendarOutlined />} color="green">
                        {dayjs(post.date).format('DD MMM YYYY')}
                      </Tag>
                    )}
                  </Space>

                  {/* Title */}
                  <Title level={5} className="mb-2 line-clamp-2" style={{ minHeight: 48 }}>
                    {post.title_name}
                  </Title>

                  {/* Topic Name */}
                  {post.topic_name && (
                    <Text type="secondary" className="block mb-2 text-sm">
                      {truncateText(post.topic_name, 80)}
                    </Text>
                  )}

                  {/* Details */}
                  <Paragraph 
                    className="flex-1 mb-3 text-sm"
                    ellipsis={{ rows: 3 }}
                    style={{ minHeight: 60 }}
                  >
                    {post.details || 'ไม่มีรายละเอียด'}
                  </Paragraph>

                  {/* Media Tags */}
                  {hasMedia && (
                    <Space size="small" className="mt-auto">
                      {photoCount > 0 && (
                        <Tag icon={<FileImageOutlined />} color="green" size="small">
                          {photoCount}
                        </Tag>
                      )}
                      {videoCount > 0 && (
                        <Tag icon={<VideoCameraOutlined />} color="red" size="small">
                          {videoCount}
                        </Tag>
                      )}
                      {pdfCount > 0 && (
                        <Tag icon={<FilePdfOutlined />} color="orange" size="small">
                          {pdfCount}
                        </Tag>
                      )}
                    </Space>
                  )}
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* View All Button */}
      <div className="text-center mt-8">
        <Link href="/posts">
          <Button type="primary" size="large">
            ดูข่าวสารทั้งหมด
          </Button>
        </Link>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}