"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  App,
  Space,
  Divider,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  LoginOutlined,
  GoogleCircleFilled,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      if (result?.error) {
        message.error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      } else {
        message.success("เข้าสู่ระบบสำเร็จ");
        const session = await getSession();
        console.log("session :>> ", session);
        console.log(
          "session.user.level :>> ",
          session?.user?.level,
          typeof session?.user?.level
        );
        const userLevel = session?.user?.level;
        console.log("userLevel (raw): ", userLevel, typeof userLevel);

        // Handle both string and number levels
        const levelStr = userLevel?.toString();

        if (levelStr === "1") {
          router.push("/admin");
        } else if (levelStr === "0") {
          router.push("/e-service/tracking");
        } else {
          // fallback: ไม่อนุญาต
          message.error("บัญชีนี้ไม่มีสิทธิ์เข้าถึง");
          router.push("/e-service/tracking");
        }
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <Title level={2} style={{ color: "#1890ff", marginBottom: "8px" }}>
              <LoginOutlined style={{ marginRight: "8px" }} />
              เข้าสู่ระบบ
            </Title>
            <Text type="secondary">องค์การบริหารเทศบาลตำบลบ้านโพธิ์</Text>
          </div>

          <Divider />

          <Form
            form={form}
            name="login"
            onFinish={handleSubmit}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              label="อีเมล"
              rules={[
                { required: true, message: "กรุณากรอกอีเมล" },
                { type: "email", message: "รูปแบบอีเมลไม่ถูกต้อง" },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="กรอกอีเมล"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="รหัสผ่าน"
              rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="กรอกรหัสผ่าน"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                icon={<LoginOutlined />}
              >
                เข้าสู่ระบบ
              </Button>
            </Form.Item>
          </Form>

          <Divider plain>หรือ</Divider>
          <Button
            type="default"
            block
            size="large"
            icon={<GoogleCircleFilled />}
            onClick={async () => {
              const result = await signIn("google", { redirect: false });
              if (result?.ok) {
                const session = await getSession();
                const userLevel = session?.user?.level?.toString();

                if (userLevel === "1") {
                  router.push("/admin");
                } else if (userLevel === "0") {
                  router.push("/e-service/tracking");
                } else {
                  message.error("บัญชีนี้ไม่มีสิทธิ์เข้าถึง");
                  router.push("/e-service/tracking");
                }
              }
            }}
            style={{ fontWeight: 500 }}
          >
            Sign in with Google
          </Button>

          <div style={{ textAlign: "center" }}>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              * หากคุณยังไม่มีบัญชีผู้ใช้ กรุณา เข้าสู่ระบบด้วย Google
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
  // ...existing code...
}
