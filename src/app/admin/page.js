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
} from "@ant-design/icons";

import StaffManagement from "./components/StaffManagement";
import PerformanceResultsManagement from "./components/PerformanceResultsManagement";
import ItaManagement from "./components/ItaManagement";
import PostManagement from "./components/PostManagement";
import ProcurementPlanManagement from "./components/ProcurementPlanManagement";
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
import styles from "./admin.module.css";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import LocalDevPlanManagement from "./components/LocalDevPlanManagement";

const { Title, Text } = Typography;
const { Sider, Content } = Layout;

export default function AdminPage() {
  const [selectedKey, setSelectedKey] = useState("dashboard");
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "loading") return; // Still loading
    if (!session) {
      router.push("/admin/login");
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
      children: [

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
        {
          key: "local-dev-plan",
          icon: <FileTextOutlined />,
          label: "แผนพัฒนาท้องถิ่น",
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
      case "post-management":
        return <PostManagement />;
      case "procurement-plan":
        return <ProcurementPlanManagement />;
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
      <Sider width={250} className={styles.adminSidebar}>
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
            trigger={["click"]}
          >
            <div className={styles.userDropdown}>
              <Avatar
                size="small"
                icon={<UserOutlined />}
                style={{ marginRight: "8px" }}
              />
              <div className={styles.userInfo}>
                <div className={styles.userName}>{session?.user?.name}</div>
                <div className={styles.userEmail}>{session?.user?.email}</div>
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
            height: "calc(100vh - 160px)",
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
