'use client';

import { Card, Statistic, Row, Col, Progress, Typography, Space, Spin } from 'antd';
import { 
  ProjectOutlined, 
  CheckCircleOutlined, 
  DollarOutlined, 
  TeamOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  CustomerServiceOutlined,
  SafetyOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { useState, useEffect } from 'react';

const { Title } = Typography;

export default function DashboardStats({ performanceData }) {
  const [eServiceStats, setEServiceStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    corruptionComplaints: 0,
    generalRequests: 0,
    waterRequests: 0,
    wastebinRequests: 0,
    wasteCollectionRequests: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEServiceStats();
  }, [fetchEServiceStats]);

  // Helper functions
  const fetchWithFallback = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn(`Failed to fetch ${url}:`, error);
      return { data: [], pagination: { total: 0 } };
    }
  };

  // Helper function to get data array from different API structures
  const getDataArray = (apiData) => {
    if (Array.isArray(apiData.data)) return apiData.data;
    if (Array.isArray(apiData.data?.complaints)) return apiData.data.complaints;
    return [];
  };

  // Helper function to get total count
  const getTotalCount = (apiData) => {
    return apiData.pagination?.total || apiData.data?.complaints?.length || apiData.data?.length || 0;
  };

  const fetchEServiceStats = async () => {
    setLoading(true);
    try {
      // Fetch all E-Service statistics with error handling

      const [
        corruptionData,
        generalData,
        waterData,
        wastebinData,
        wasteCollectionData
      ] = await Promise.all([
        fetchWithFallback('/api/corruption-complaints'),
        fetchWithFallback('/api/general-requests'),
        fetchWithFallback('/api/water-support-requests'),
        fetchWithFallback('/api/wastebin-requests'),
        fetchWithFallback('/api/waste-collection-requests')
      ]);



      const corruptionArray = getDataArray(corruptionData);
      const generalArray = getDataArray(generalData);
      const waterArray = getDataArray(waterData);
      const wastebinArray = getDataArray(wastebinData);
      const wasteCollectionArray = getDataArray(wasteCollectionData);

      const totalRequests = 
        getTotalCount(corruptionData) +
        getTotalCount(generalData) +
        getTotalCount(waterData) +
        getTotalCount(wastebinData) +
        getTotalCount(wasteCollectionData);

      const pendingRequests = 
        corruptionArray.filter(item => item.status === 'pending').length +
        generalArray.filter(item => item.status === 'pending').length +
        waterArray.filter(item => item.status === 'pending').length +
        wastebinArray.filter(item => item.status === 'pending').length +
        wasteCollectionArray.filter(item => item.status === 'pending').length;

      const completedRequests = 
        corruptionArray.filter(item => item.status === 'completed').length +
        generalArray.filter(item => item.status === 'completed').length +
        waterArray.filter(item => item.status === 'completed').length +
        wastebinArray.filter(item => item.status === 'completed').length +
        wasteCollectionArray.filter(item => item.status === 'completed').length;

      setEServiceStats({
        totalRequests,
        pendingRequests,
        completedRequests,
        corruptionComplaints: getTotalCount(corruptionData),
        generalRequests: getTotalCount(generalData),
        waterRequests: getTotalCount(waterData),
        wastebinRequests: getTotalCount(wastebinData),
        wasteCollectionRequests: getTotalCount(wasteCollectionData)
      });
    } catch (error) {
      console.error('Error fetching E-Service stats:', error);
      // Set default values on error
      setEServiceStats({
        totalRequests: 0,
        pendingRequests: 0,
        completedRequests: 0,
        corruptionComplaints: 0,
        generalRequests: 0,
        waterRequests: 0,
        wastebinRequests: 0,
        wasteCollectionRequests: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const totalProjects = performanceData?.length || 0;
  const completedProjects = performanceData?.filter(item => item.status === 'เสร็จสิ้น').length || 0;
  const inProgressProjects = performanceData?.filter(item => item.status === 'กำลังดำเนินการ').length || 0;
  const delayedProjects = performanceData?.filter(item => item.status === 'ล่าช้า').length || 0;
  
  const totalBudget = performanceData?.reduce((sum, item) => sum + parseInt(item.budget.replace(/,/g, '')), 0) || 0;
  const avgProgress = totalProjects > 0 ? Math.round(performanceData.reduce((sum, item) => sum + item.progress, 0) / totalProjects) : 0;
  
  const completionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

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

      {/* E-Service Statistics */}
      <Title level={4}>สถิติ E-Service</Title>
      
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <Card>
              <Statistic
                title="คำร้องทั้งหมด"
                value={eServiceStats.totalRequests}
                prefix={<CustomerServiceOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="รอดำเนินการ"
              value={eServiceStats.pendingRequests}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="เสร็จสิ้นแล้ว"
              value={eServiceStats.completedRequests}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="คำร้องเรียนการทุจริต"
              value={eServiceStats.corruptionComplaints}
              prefix={<SafetyOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="คำร้องทั่วไป"
              value={eServiceStats.generalRequests}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="คำร้องขอสนับสนุนน้ำ"
              value={eServiceStats.waterRequests}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="คำร้องขอถังขยะ"
              value={eServiceStats.wastebinRequests + eServiceStats.wasteCollectionRequests}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>
      </Spin>

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