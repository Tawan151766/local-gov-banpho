"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MenuOutlined,
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  SettingOutlined,
  TeamOutlined,
  BankOutlined,
  ToolOutlined,
  BookOutlined,
  AuditOutlined,
  LogoutOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Button, Drawer, Menu } from "antd";

const menuItems = [
  {
    key: "/admin/dashboard",
    icon: <DashboardOutlined />,
    label: "แดชบอร์ด",
    href: "/admin/dashboard",
  },
  {
    key: "people",
    icon: <UserOutlined />,
    label: "จัดการบุคลากร",
    children: [
      {
        key: "/admin/people-management",
        icon: <TeamOutlined />,
        label: "ข้อมูลบุคลากร",
        href: "/admin/people-management",
      },
    ],
  },
  {
    key: "services",
    icon: <FileTextOutlined />,
    label: "จัดการบริการ",
    children: [
      {
        key: "/admin/wastebin-requests",
        icon: <FileTextOutlined />,
        label: "คำร้องขอถังขยะ",
        href: "/admin/wastebin-requests",
      },
      {
        key: "/admin/waste-collection-requests",
        icon: <FileTextOutlined />,
        label: "คำร้องจัดเก็บขยะ",
        href: "/admin/waste-collection-requests",
      },
      {
        key: "/admin/water-support-requests",
        icon: <FileTextOutlined />,
        label: "คำร้องสนับสนุนน้ำ",
        href: "/admin/water-support-requests",
      },
      {
        key: "/admin/corruption-complaints",
        icon: <FileTextOutlined />,
        label: "ร้องเรียนการทุจริต",
        href: "/admin/corruption-complaints",
      },
    ],
  },
  {
    key: "content",
    icon: <FileTextOutlined />,
    label: "จัดการเนื้อหา",
    children: [
      {
        key: "/admin/local-dev-plan",
        icon: <FileTextOutlined />,
        label: "แผนพัฒนาท้องถิ่น",
        href: "/admin/local-dev-plan",
      },
    ],
  },
  {
    key: "system",
    icon: <SettingOutlined />,
    label: "ระบบ",
    children: [
      {
        key: "/admin/system",
        icon: <SettingOutlined />,
        label: "ตั้งค่าระบบ",
        href: "/admin/system",
      },
      {
        key: "/admin/test-users",
        icon: <UserOutlined />,
        label: "ผู้ใช้ทดสอบ",
        href: "/admin/test-users",
      },
    ],
  },
];

export default function AdminNavigation({ children }) {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const pathname = usePathname();

  const renderMenuItems = (items) => {
    return items.map((item) => {
      if (item.children) {
        return {
          key: item.key,
          icon: item.icon,
          label: item.label,
          children: item.children.map((child) => ({
            key: child.key,
            icon: child.icon,
            label: (
              <Link href={child.href} onClick={() => setDrawerVisible(false)}>
                {child.label}
              </Link>
            ),
          })),
        };
      }

      return {
        key: item.key,
        icon: item.icon,
        label: (
          <Link href={item.href} onClick={() => setDrawerVisible(false)}>
            {item.label}
          </Link>
        ),
      };
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setDrawerVisible(true)}
                className="lg:hidden"
              />
              <Link href="/admin/dashboard" className="flex items-center gap-2">
                <BankOutlined className="text-2xl text-blue-600" />
                <span className="text-xl font-bold text-gray-900">
                  Admin Panel
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <HomeOutlined />
                <span className="hidden sm:inline">กลับหน้าหลัก</span>
              </Link>
              <Link
                href="/admin/login"
                className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
              >
                <LogoutOutlined />
                <span className="hidden sm:inline">ออกจากระบบ</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="flex">
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:top-16">
          <div className="flex-1 flex flex-col min-h-0 bg-white border-r">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <Menu
                mode="inline"
                selectedKeys={[pathname]}
                defaultOpenKeys={menuItems
                  .filter((item) => item.children)
                  .map((item) => item.key)}
                items={renderMenuItems(menuItems)}
                className="border-none"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:pl-64 flex flex-col flex-1">
          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <BankOutlined className="text-xl text-blue-600" />
            <span className="font-bold">Admin Panel</span>
          </div>
        }
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={280}
      >
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          defaultOpenKeys={menuItems
            .filter((item) => item.children)
            .map((item) => item.key)}
          items={renderMenuItems(menuItems)}
          className="border-none"
        />
      </Drawer>
    </div>
  );
}