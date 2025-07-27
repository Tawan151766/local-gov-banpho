'use client';

import { Card, Typography, Space, Button, Divider, Alert } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function ModuleTemplate({ 
  title, 
  description, 
  onAdd, 
  onEdit, 
  onDelete,
  children 
}) {
  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={3}>{title}</Title>
          <Text type="secondary">{description}</Text>
        </div>
        
        <Space wrap>
          {onAdd && (
            <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
              เพิ่มใหม่
            </Button>
          )}
          {onEdit && (
            <Button icon={<EditOutlined />} onClick={onEdit}>
              แก้ไข
            </Button>
          )}
          {onDelete && (
            <Button danger icon={<DeleteOutlined />} onClick={onDelete}>
              ลบ
            </Button>
          )}
        </Space>

        <Divider />

        {children || (
          <Alert
            message="Module Template"
            description="นี่คือ template สำหรับสร้าง module ใหม่ คุณสามารถปรับแต่งและเพิ่มฟีเจอร์ได้ตามต้องการ"
            type="info"
            showIcon
          />
        )}
      </Space>
    </Card>
  );
}