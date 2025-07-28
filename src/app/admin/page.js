"use client";

import {
  Layout,
  Menu,
  Card,
  Typography,
  Space,
  Avatar,
  Dropdown,
} from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
  TeamOutlined,
  BarChartOutlined,
  FileProtectOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
  BookOutlined,
} from "@ant-design/icons";
import DashboardStats from "./components/DashboardStats";
import UserManagement from "./components/UserManagement";
import StaffManagement from "./components/StaffManagement";
import PerformanceResultsManagement from "./components/PerformanceResultsManagement";
import ItaManagement from "./components/ItaManagement";
import PostManagement from "./components/PostManagement";
import ProcurementPlanManagement from "./components/ProcurementPlanManagement";
import LawsRegsManagement from "./components/LawsRegsManagement";
import styles from "./admin.module.css";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;
const { Sider, Content } = Layout;

export default function AdminPage() {
  const [selectedKey, setSelectedKey] = useState("dashboard");
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'loading') return; // Still loading
    if (!session) {
      router.push('/admin/login');
    }
  }, [session, status, router]);



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

  // ข้อมูลตัวอย่างสำหรับ Dashboard
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
  ];

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "basic-management",
      label: "การจัดการพื้นฐาน",
      type: "group",
      children: [
        {
          key: "user-management",
          icon: <UserOutlined />,
          label: "จัดการผู้ใช้งาน",
        },
        {
          key: "staff-management",
          icon: <TeamOutlined />,
          label: "จัดการบุคลากร",
        },
      ],
    },
    {
      key: "performance-management",
      label: "การจัดการผลการดำเนินงาน",
      type: "group",
      children: [
        {
          key: "performance-results",
          icon: <BarChartOutlined />,
          label: "ผลการดำเนินงาน",
        },
        {
          key: "ita-management",
          icon: <FileProtectOutlined />,
          label: "ข้อมูล ITA",
        },
        {
          key: "procurement-plan",
          icon: <ShoppingCartOutlined />,
          label: "แผนจัดซื้อจัดจ้าง",
        },
        {
          key: "laws-regulations",
          icon: <BookOutlined />,
          label: "กฎหมายและระเบียบ",
        },
      ],
    },
    {
      key: "content-management",
      label: "เนื้อหา",
      type: "group",
      children: [
        {
          key: "post-management",
          icon: <FileTextOutlined />,
          label: "จัดการโพสต์",
        },
      ],
    },
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case "dashboard":
        return (
          <Card>
            <DashboardStats performanceData={performanceData} />
          </Card>
        );
      case "user-management":
        return <UserManagement />;
      case "staff-management":
        return <StaffManagement />;
      case "performance-results":
        return <PerformanceResultsManagement />;
      case "ita-management":
        return <ItaManagement />;
      case "post-management":
        return <PostManagement />;
      case "procurement-plan":
        return <ProcurementPlanManagement />;
      case "laws-regulations":
        return <LawsRegsManagement />;
      default:
        return (
          <Card>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <Title level={3}>ยินดีต้อนรับสู่ Admin Panel</Title>
              <Text>เลือกเมนูจากด้านซ้ายเพื่อเริ่มใช้งาน</Text>
            </Space>
          </Card>
        );
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={250}
        className={styles.adminSidebar}
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
            <div className={styles.userDropdown}>
              <Avatar 
                size="small" 
                icon={<UserOutlined />} 
                style={{ marginRight: '8px' }}
              />
              <div className={styles.userInfo}>
                <div className={styles.userName}>
                  {session?.user?.name}
                </div>
                <div className={styles.userEmail}>
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
          style={{ 
            border: "none", 
            height: "calc(100vh - 160px)"
          }}
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
