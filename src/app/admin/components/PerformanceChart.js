'use client';

import { Card, Progress, Typography, Space, Tag, Divider } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function PerformanceChart({ data }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'เสร็จสิ้น':
        return 'success';
      case 'กำลังดำเนินการ':
        return 'processing';
      case 'ล่าช้า':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'เสร็จสิ้น':
        return <CheckCircleOutlined />;
      case 'กำลังดำเนินการ':
        return <ClockCircleOutlined />;
      case 'ล่าช้า':
        return <ExclamationCircleOutlined />;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
      {data.map((item) => (
        <Card key={item.key} size="small" hoverable>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Title level={5} style={{ margin: 0, marginBottom: '8px' }}>
                {item.project}
              </Title>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {item.responsible}
              </Text>
            </div>
            
            <div>
              <Text strong>งบประมาณ: </Text>
              <Text>{item.budget} บาท</Text>
            </div>
            
            <div>
              <Text strong>ความคืบหน้า:</Text>
              <Progress 
                percent={item.progress} 
                size="small" 
                style={{ marginTop: '4px' }}
                status={item.progress === 100 ? 'success' : 'active'}
              />
            </div>
            
            <div>
              <Tag 
                color={getStatusColor(item.status)} 
                icon={getStatusIcon(item.status)}
              >
                {item.status}
              </Tag>
            </div>
          </Space>
        </Card>
      ))}
    </div>
  );
}