'use client';

import { Card, Statistic, Row, Col, Progress, Typography, Space } from 'antd';
import { 
  ProjectOutlined, 
  CheckCircleOutlined, 
  DollarOutlined, 
  TeamOutlined,
  TrophyOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

const { Title } = Typography;

export default function DashboardStats({ performanceData }) {
  const totalProjects = performanceData.length;
  const completedProjects = performanceData.filter(item => item.status === 'เสร็จสิ้น').length;
  const inProgressProjects = performanceData.filter(item => item.status === 'กำลังดำเนินการ').length;
  const delayedProjects = performanceData.filter(item => item.status === 'ล่าช้า').length;
  
  const totalBudget = performanceData.reduce((sum, item) => sum + parseInt(item.budget.replace(/,/g, '')), 0);
  const avgProgress = Math.round(performanceData.reduce((sum, item) => sum + item.progress, 0) / performanceData.length);
  
  const completionRate = Math.round((completedProjects / totalProjects) * 100);

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={3}>ภาพรวมการดำเนินงาน</Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="โครงการทั้งหมด"
              value={totalProjects}
              prefix={<ProjectOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="โครงการเสร็จสิ้น"
              value={completedProjects}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="กำลังดำเนินการ"
              value={inProgressProjects}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="โครงการล่าช้า"
              value={delayedProjects}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card>
            <Statistic
              title="งบประมาณรวม"
              value={totalBudget}
              suffix="บาท"
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card>
            <div>
              <div style={{ marginBottom: 8 }}>
                <TeamOutlined style={{ marginRight: 8 }} />
                อัตราความสำเร็จ
              </div>
              <Progress 
                percent={completionRate} 
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                format={percent => `${percent}%`}
              />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Card>
            <div>
              <div style={{ marginBottom: 8 }}>
                <TrophyOutlined style={{ marginRight: 8 }} />
                ความคืบหน้าเฉลี่ย
              </div>
              <Progress 
                percent={avgProgress} 
                strokeColor="#faad14"
                format={percent => `${percent}%`}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </Space>
  );
}