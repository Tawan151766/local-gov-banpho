"use client";

import { Layout, Menu, Card, Typography, Space, Avatar, Dropdown } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  BarChartOutlined,
  FileProtectOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
  BookOutlined,
  SafetyOutlined,
  CustomerServiceOutlined,
  ReadOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SnippetsOutlined,
  AccountBookOutlined,
} from "@ant-design/icons";

import StaffManagement from "./components/StaffManagement";
import PerformanceResultsManagement from "./components/PerformanceResultsManagement";
import ItaManagement from "./components/ItaManagement";
import PostTypeManagement from "./components/PostTypeManagement";
import LawsRegsManagement from "./components/LawsRegsManagement";
import dynamic from "next/dynamic";

const CorruptionComplaintsManagement = dynamic(
  () => import("./components/CorruptionComplaintsManagement"),
  { ssr: false }
);

const GeneralRequestsManagement = dynamic(
  () => import("./components/GeneralRequestsManagement"),
  { ssr: false }
);

const WaterSupportRequestsManagement = dynamic(
  () => import("./components/WaterSupportRequestsManagement"),
  { ssr: false }
);

const WastebinRequestsManagement = dynamic(
  () => import("./components/WastebinRequestsManagement"),
  { ssr: false }
);

const WasteCollectionRequestsManagement = dynamic(
  () => import("./components/WasteCollectionRequestsManagement"),
  { ssr: false }
);

const ManualManagement = dynamic(
  () => import("./components/ManualManagement"),
  { ssr: false }
);
import styles from "./admin.module.css";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import LocalDevPlanManagement from "./components/LocalDevPlanManagement";
import PublishDocManagement from "./components/PublishDocManagement";
import ChildDevelopmentCenterManagement from "./components/ChildDevelopmentCenterManagement";
import ExternalWorkManagement from "./components/ExternalWorkManagement";

const { Title, Text } = Typography;
const { Sider, Content } = Layout;

export default function AdminPage() {
  const [selectedKey, setSelectedKey] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "loading") return; // Still loading
    if (!session) {
      router.push("/admin/login");
      return;
    }
    // Block access if not user.level === "1"
    if (!session.user?.level || session.user.level !== "1") {
      // Logout and redirect to tracking
      signOut({ callbackUrl: "/e-service/tracking" });
    }
  }, [session, status, router]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/admin/login" });
  };

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
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
      key: "profile",
      icon: <UserOutlined />,
      label: "ข้อมูลส่วนตัว",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "ออกจากระบบ",
      onClick: handleLogout,
    },
  ];

  const menuItems = [
    {
      key: "basic-management",
      label: "การจัดการพื้นฐาน",
      type: "group",
      children: [],
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
          key: "laws-regulations",
          icon: <BookOutlined />,
          label: "กฎหมายและระเบียบ",
        },
        {
          key: "local-dev-plan",
          icon: <FileTextOutlined />,
          label: "แผนพัฒนาท้องถิ่น",
        },
      ],
    },
    {
      key: "link-management",
      label: "เนื้อหาและลิงก์",
      type: "group",
      children: [
        {
          key: "publish-docs",
          icon: <FileTextOutlined />,
          label: "เอกสารเผยแพร่",
        },
        {
          key: "child-development-center",
          icon: <UserOutlined />,
          label: "ศูนย์พัฒนาเด็กเล็ก",
          link: "/admin/child-development-center",
        },
        {
          key: "external-works",
          icon: <FileTextOutlined />,
          label: "งานภายนอก",
          link: "/admin/external-works",
        },
      ],
    },
    {
      key: "content-management",
      label: "เนื้อหา",
      type: "group",
      children: [
        {
          key: "manual-management",
          icon: <ReadOutlined />,
          label: "คู่มือ",
        },
        {
          key: "general-news",
          icon: <FileTextOutlined />,
          label: "ข่าวสารทั่วไป",
        },
        {
          key: "community-activities",
          icon: <UserOutlined />,
          label: "กิจกรรมชุมชน",
        },
        {
          key: "development-projects",
          icon: <BarChartOutlined />,
          label: "โครงการพัฒนา",
        },
        {
          key: "important-announcements",
          icon: <SafetyOutlined />,
          label: "ประกาศสำคัญ",
        },
        {
          key: "procurement-announcements",
          icon: <ShoppingCartOutlined />,
          label: "ประกาศจัดซื้อจัดจ้าง",
        },
        {
          key: "procurement-announcements-results",
          icon: <FileTextOutlined />,
          label: "ผลประกาศจัดซื้อจัดจ้าง",
        },
        {
          key: "procurement-announcements-reports",
          icon: <AccountBookOutlined />,
          label: "รายงานผลการจัดซื้อจัดจ้าง",
        },
        {
          key: "announcement",
          icon: <SnippetsOutlined />,
          label: "ป้ายประกาศ",
        },
        {
          key: "public-relations",
          icon: <CustomerServiceOutlined />,
          label: "ข่าวประชาสัมพันธ์",
        },
        {
          key: "activities",
          icon: <BookOutlined />,
          label: "กิจกรรม",
        },
      ],
    },
    {
      key: "e-service",
      label: "E-Service",
      type: "group",
      children: [
        {
          key: "corruption-complaints",
          icon: <SafetyOutlined />,
          label: "คำร้องเรียนการทุจริต",
        },
        {
          key: "general-requests",
          icon: <CustomerServiceOutlined />,
          label: "คำร้องทั่วไป",
        },
        {
          key: "water-support-requests",
          icon: <FileTextOutlined />,
          label: "คำร้องขอสนับสนุนน้ำ",
        },
        {
          key: "wastebin-requests",
          icon: <FileTextOutlined />,
          label: "คำร้องขอรับถังขยะ",
        },
        {
          key: "waste-collection-requests",
          icon: <FileTextOutlined />,
          label: "คำร้องขอจัดเก็บขยะ",
        },
      ],
    },
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case "staff-management":
        return <StaffManagement />;
      case "performance-results":
        return <PerformanceResultsManagement />;
      case "ita-management":
        return <ItaManagement />;
      case "manual-management":
        return <ManualManagement />;
      case "general-news":
        return <PostTypeManagement postType="general-news" />;
      case "community-activities":
        return <PostTypeManagement postType="community-activities" />;
      case "development-projects":
        return <PostTypeManagement postType="development-projects" />;
      case "important-announcements":
        return <PostTypeManagement postType="important-announcements" />;
      case "procurement-announcements":
        return <PostTypeManagement postType="procurement-announcements" />;
      case "procurement-announcements-results":
        return (
          <PostTypeManagement postType="procurement-announcements-results" />
        );
      case "procurement-announcements-reports":
        return (
          <PostTypeManagement postType="procurement-announcements-reports" />
        );
      case "child-development-center":
        return <ChildDevelopmentCenterManagement />;
      case "external-works":
        return <ExternalWorkManagement />;
      case "announcement":
        return <PostTypeManagement postType="announcement" />;
      case "public-relations":
        return <PostTypeManagement postType="public-relations" />;
      case "activities":
        return <PostTypeManagement postType="activities" />;
      case "publish-docs":
        return <PublishDocManagement />;
      case "laws-regulations":
        return <LawsRegsManagement />;
      case "local-dev-plan":
        return <LocalDevPlanManagement />;
      case "corruption-complaints":
        return <CorruptionComplaintsManagement />;
      case "general-requests":
        return <GeneralRequestsManagement />;
      case "water-support-requests":
        return <WaterSupportRequestsManagement />;
      case "wastebin-requests":
        return <WastebinRequestsManagement />;
      case "waste-collection-requests":
        return <WasteCollectionRequestsManagement />;
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
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        style={{
          background: "#fff",
          height: "100vh",
          overflow: "auto",
        }}
      >
        <div style={{ padding: "16px", borderBottom: "1px solid #f0f0f0" }}>
          {!collapsed ? (
            <>
              <Title level={4} style={{ margin: 0, textAlign: "center" }}>
                Admin Panel
              </Title>
              <Text
                type="secondary"
                style={{
                  display: "block",
                  textAlign: "center",
                  fontSize: "12px",
                }}
              >
                อบต.บ้านโพธิ์
              </Text>
            </>
          ) : (
            <div style={{ textAlign: "center" }}>
              <Title level={4} style={{ margin: 0, fontSize: "16px" }}>
                AP
              </Title>
            </div>
          )}
        </div>

        <div style={{ padding: "16px", borderBottom: "1px solid #f0f0f0" }}>
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="topRight"
            trigger={["click"]}
          >
            <div className={styles.userDropdown}>
              <Avatar
                size="small"
                icon={<UserOutlined />}
                style={{ marginRight: collapsed ? "0" : "8px" }}
              />
              {!collapsed && (
                <div className={styles.userInfo}>
                  <div className={styles.userName}>{session?.user?.name}</div>
                  <div className={styles.userEmail}>{session?.user?.email}</div>
                </div>
              )}
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
            height: "calc(100vh - 160px)",
          }}
        />
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? 80 : 250,
          transition: "margin-left 0.2s",
        }}
      >
        <div
          style={{
            padding: "0 24px",
            backgroundColor: "#fff",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            height: "64px",
          }}
        >
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: "16px",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "4px",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "transparent")
            }
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
        </div>
        <Content style={{ padding: "24px", backgroundColor: "#f5f5f5" }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
}
