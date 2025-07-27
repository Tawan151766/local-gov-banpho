"use client";

import { FloatButton } from "antd";
import {
  SettingOutlined,
  LoginOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function AdminAccess() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleAdminClick = () => {
    if (session) {
      router.push("/admin");
    } else {
      router.push("/admin/login");
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  // Don't show if loading
  if (status === "loading") {
    return null;
  }

  return (
    <FloatButton.Group
      trigger="click"
      type="primary"
      style={{ right: 24, bottom: 24 }}
      icon={<SettingOutlined />}
      tooltip={session ? "จัดการระบบ" : "เข้าสู่ระบบจัดการ"}
    >
      <FloatButton
        icon={session ? <SettingOutlined /> : <LoginOutlined />}
        tooltip={session ? "Admin Panel" : "เข้าสู่ระบบ"}
        onClick={handleAdminClick}
      />
      {session && (
        <FloatButton
          icon={<LogoutOutlined />}
          tooltip="ออกจากระบบ"
          onClick={handleLogout}
        />
      )}
    </FloatButton.Group>
  );
}
