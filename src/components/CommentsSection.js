'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  List, 
  Avatar, 
  Rate, 
  Typography, 
  Space, 
  Button, 
  Divider,
  Empty,
  Spin,
  Pagination
} from 'antd';
import { 
  UserOutlined, 
  CommentOutlined, 
  StarOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { qaAPI } from '@/lib/api';

const { Text, Paragraph } = Typography;

export default function CommentsSection({ qaItem, onAddComment, refreshTrigger }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0
  });

  // โหลดความคิดเห็น
  useEffect(() => {
    if (qaItem?.id) {
      loadComments();
    }
  }, [qaItem?.id, pagination.current, refreshTrigger]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const response = await qaAPI.getComments(qaItem.id, {
        page: pagination.current,
        limit: pagination.pageSize
      });
      
      if (response.success) {
        setComments(response.data);
        setPagination(prev => ({
          ...prev,
          total: response.pagination.total
        }));
      }
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current: page }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card 
      title={
        <Space>
          <CommentOutlined style={{ color: '#1890ff' }} />
          <span>ความคิดเห็น ({pagination.total})</span>
        </Space>
      }
      extra={
        <Button 
          type="primary" 
          icon={<CommentOutlined />}
          onClick={onAddComment}
          size="small"
        >
          แสดงความคิดเห็น
        </Button>
      }
      style={{ marginTop: '16px' }}
    >
      <Spin spinning={loading}>
        {comments.length === 0 ? (
          <Empty 
            description="ยังไม่มีความคิดเห็น"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <>
            <List
              dataSource={comments}
              renderItem={(comment) => (
                <List.Item style={{ padding: '16px 0' }}>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        icon={<UserOutlined />} 
                        style={{ backgroundColor: '#87d068' }}
                      />
                    }
                    title={
                      <Space>
                        <Text strong>
                          {comment.commenter_name || 'ผู้ใช้ไม่ระบุชื่อ'}
                        </Text>
                        {comment.rating && (
                          <Rate 
                            disabled 
                            value={comment.rating} 
                            style={{ fontSize: '14px' }}
                            character={<StarOutlined />}
                          />
                        )}
                      </Space>
                    }
                    description={
                      <Space size="small">
                        <ClockCircleOutlined style={{ fontSize: '12px' }} />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {formatDate(comment.created_at)}
                        </Text>
                      </Space>
                    }
                  />
                  <div style={{ marginTop: '8px' }}>
                    <Paragraph style={{ marginBottom: 0, lineHeight: '1.6' }}>
                      {comment.comment_text}
                    </Paragraph>
                  </div>
                </List.Item>
              )}
            />
            
            {pagination.total > pagination.pageSize && (
              <>
                <Divider />
                <div style={{ textAlign: 'center' }}>
                  <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={pagination.total}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showQuickJumper={false}
                    showTotal={(total, range) =>
                      `${range[0]}-${range[1]} จาก ${total} ความคิดเห็น`
                    }
                  />
                </div>
              </>
            )}
          </>
        )}
      </Spin>
    </Card>
  );
}