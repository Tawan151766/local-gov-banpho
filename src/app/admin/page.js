"use client";

import {
  Layout,
  Menu,
  Card,
  Typography,
  Space,
  Divider,
  message,
  Table,
  Progress,
  Statistic,
  Row,
  Col,
  Button,
  Avatar,
  Dropdown,
} from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  FileTextOutlined,
  AppstoreAddOutlined,
  BarChartOutlined,
  TrophyOutlined,
  ProjectOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import ModuleTemplate from "./components/ModuleTemplate";
import PerformanceChart from "./components/PerformanceChart";
import DashboardStats from "./components/DashboardStats";
import UserManagement from "./components/UserManagement";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;
const { Sider, Content } = Layout;

export default function AdminPage() {
  const [selectedKey, setSelectedKey] = useState("1");
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'loading') return; // Still loading
    if (!session) {
      router.push('/admin/login');
    }
  }, [session, status, router]);

  const handleAddContent = () => {
    message.success("เปิดฟอร์มเพิ่มเนื้อหาใหม่");
  };

  const handleAddModule = () => {
    message.info("สร้าง module ใหม่ - ฟีเจอร์นี้จะพัฒนาต่อไป");
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>กำลังโหลด...</div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!session) {
    return null;
  }

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'ข้อมูลส่วนตัว',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'ออกจากระบบ',
      onClick: handleLogout,
    },
  ];

  // ข้อมูลตัวอย่างสำหรับผลการดำเนินงาน
  const performanceData = [
    {
      key: "1",
      project: "โครงการพัฒนาถนนในหมู่บ้าน",
      budget: "2,500,000",
      progress: 85,
      status: "กำลังดำเนินการ",
      responsible: "กองช่าง",
    },
    {
      key: "2",
      project: "โครงการจัดการขยะชุมชน",
      budget: "800,000",
      progress: 100,
      status: "เสร็จสิ้น",
      responsible: "กองสาธารณสุข",
    },
    {
      key: "3",
      project: "โครงการส่งเสริมการเกษตรอินทรีย์",
      budget: "1,200,000",
      progress: 60,
      status: "กำลังดำเนินการ",
      responsible: "กองส่งเสริมการเกษตร",
    },
    {
      key: "4",
      project: "โครงการปรับปรุงระบบประปาหมู่บ้าน",
      budget: "3,200,000",
      progress: 45,
      status: "กำลังดำเนินการ",
      responsible: "กองช่าง",
    },
    {
      key: "5",
      project: "โครงการส่งเสริมการท่องเที่ยวชุมชน",
      budget: "950,000",
      progress: 100,
      status: "เสร็จสิ้น",
      responsible: "กองวิชาการและแผนงาน",
    },
    {
      key: "6",
      project: "โครงการพัฒนาศูนย์เด็กเล็ก",
      budget: "1,800,000",
      progress: 25,
      status: "ล่าช้า",
      responsible: "กองการศึกษา",
    },
  ];

  const performanceColumns = [
    {
      title: "โครงการ/กิจกรรม",
      dataIndex: "project",
      key: "project",
    },
    {
      title: "งบประมาณ (บาท)",
      dataIndex: "budget",
      key: "budget",
    },
    {
      title: "ความคืบหน้า",
      dataIndex: "progress",
      key: "progress",
      render: (progress) => <Progress percent={progress} size="small" />,
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "หน่วยงานรับผิดชอบ",
      dataIndex: "responsible",
      key: "responsible",
    },
  ];

  const menuItems = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "2",
      icon: <UserOutlined />,
      label: "จัดการผู้ใช้งาน",
    },
    {
      key: "3",
      icon: <FileTextOutlined />,
      label: "จัดการเนื้อหา",
    },
    {
      key: "4",
      icon: <BarChartOutlined />,
      label: "ผลการดำเนินงาน",
    },
    {
      key: "5",
      icon: <ProjectOutlined />,
      label: "โครงการ/กิจกรรม",
    },
    {
      key: "6",
      icon: <SettingOutlined />,
      label: "ตั้งค่าระบบ",
    },
    {
      key: "7",
      icon: <AppstoreAddOutlined />,
      label: "เพิ่ม Module",
    },
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case "1":
        return (
          <Card>
            <DashboardStats performanceData={performanceData} />
          </Card>
        );
      case "2":
        return <UserManagement />;
      case "3":
        return (
          <ModuleTemplate
            title="จัดการเนื้อหา"
            description="Module สำหรับจัดการเนื้อหาและข่าวสาร"
            onAdd={handleAddContent}
          >
            <Text>รายการเนื้อหาและข่าวสารจะแสดงที่นี่</Text>
          </ModuleTemplate>
        );
      case "4":
        return (
          <Card>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <div>
                <Title level={3}>
                  <TrophyOutlined style={{ marginRight: 8 }} />
                  ผลการดำเนินงาน
                </Title>
                <Text type="secondary">
                  รายงานผลการดำเนินงานโครงการและกิจกรรมต่างๆ
                </Text>
              </div>

              <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={8}>
                  <Card size="small">
                    <Statistic
                      title="โครงการทั้งหมด"
                      value={performanceData.length}
                      valueStyle={{ color: "#1890ff" }}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small">
                    <Statistic
                      title="โครงการเสร็จสิ้น"
                      value={
                        performanceData.filter(
                          (item) => item.status === "เสร็จสิ้น"
                        ).length
                      }
                      valueStyle={{ color: "#52c41a" }}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small">
                    <Statistic
                      title="ความคืบหน้าเฉลี่ย"
                      value={Math.round(
                        performanceData.reduce(
                          (sum, item) => sum + item.progress,
                          0
                        ) / performanceData.length
                      )}
                      suffix="%"
                      valueStyle={{ color: "#faad14" }}
                    />
                  </Card>
                </Col>
              </Row>

              <Divider orientation="left">รายละเอียดโครงการ</Divider>
              <PerformanceChart data={performanceData} />

              <Divider orientation="left" style={{ marginTop: "32px" }}>
                ตารางสรุป
              </Divider>
              <Table
                columns={performanceColumns}
                dataSource={performanceData}
                pagination={false}
                size="middle"
              />
            </Space>
          </Card>
        );
      case "5":
        return (
          <ModuleTemplate
            title="โครงการ/กิจกรรม"
            description="จัดการโครงการและกิจกรรมของ อบต."
            onAdd={() => message.success("เพิ่มโครงการใหม่")}
          >
            <Text>รายการโครงการและกิจกรรมจะแสดงที่นี่</Text>
          </ModuleTemplate>
        );
      case "6":
        return (
          <Card>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <Title level={3}>ตั้งค่าระบบ</Title>
              <Text>การตั้งค่าทั่วไปของระบบ</Text>
              <Divider />
              <Text type="secondary">Module สำหรับตั้งค่าและกำหนดค่าระบบ</Text>
            </Space>
          </Card>
        );
      case "7":
        return (
          <ModuleTemplate
            title="เพิ่ม Module ใหม่"
            description="พื้นที่สำหรับสร้างและทดสอบ module ใหม่"
            onAdd={handleAddModule}
          >
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Text strong>ตัวอย่าง Module ที่สามารถเพิ่มได้:</Text>
              <ul style={{ paddingLeft: "20px" }}>
                <li>จัดการข่าวประชาสัมพันธ์</li>
                <li>จัดการบริการออนไลน์</li>
                <li>จัดการข้อมูลบุคลากร</li>
                <li>จัดการงบประมาณ</li>
                <li>จัดการแผนงาน/โครงการ</li>
                <li>จัดการเอกสารดาวน์โหลด</li>
              </ul>
            </Space>
          </ModuleTemplate>
        );
      default:
        return <div>เลือกเมนูจากด้านซ้าย</div>;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={250}
        style={{
          background: "#fff",
          boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ padding: "16px", borderBottom: "1px solid #f0f0f0" }}>
          <Title level={4} style={{ margin: 0, textAlign: "center" }}>
            Admin Panel
          </Title>
          <Text
            type="secondary"
            style={{ display: "block", textAlign: "center", fontSize: "12px" }}
          >
            อบต.บ้านโพธิ์
          </Text>
        </div>
        
        <div style={{ padding: "16px", borderBottom: "1px solid #f0f0f0" }}>
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="topRight"
            trigger={['click']}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '6px',
              transition: 'background-color 0.2s'
            }}>
              <Avatar 
                size="small" 
                icon={<UserOutlined />} 
                style={{ marginRight: '8px' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {session?.user?.name}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#666',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {session?.user?.email}
                </div>
              </div>
            </div>
          </Dropdown>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => setSelectedKey(key)}
          style={{ border: "none", height: "calc(100vh - 160px)" }}
        />
      </Sider>

      <Layout>
        <Content style={{ padding: "24px", backgroundColor: "#f5f5f5" }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
}
