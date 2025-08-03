"use client";

import React, { useState } from "react";
import { Modal, Form, Input, Button, Space, Alert, Checkbox, Rate } from "antd";
import { CommentOutlined, SendOutlined, StarOutlined } from "@ant-design/icons";
import { qaAPI } from "@/lib/api";

const { TextArea } = Input;

export default function SimpleCommentModal({
  visible,
  onCancel,
  qaItem,
  onCommentAdded,
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async (values) => {
    if (!agreed) {
      alert("กรุณายอมรับเงื่อนไขก่อนส่งความคิดเห็น");
      return;
    }

    try {
      setLoading(true);
      const commentData = {
        qa_item_id: qaItem.id,
        comment_text: values.comment,
        commenter_name: values.name || null,
        commenter_email: values.email || null,
        rating: values.rating || null,
      };

      const response = await qaAPI.submitComment(commentData);

      if (response.success) {
        alert("ส่งความคิดเห็นเรียบร้อยแล้ว!");
        form.resetFields();
        setAgreed(false);
        onCancel();
        // รีเฟรชความคิดเห็นในหน้าหลัก
        if (onCommentAdded) {
          onCommentAdded();
        }
      } else {
        alert("เกิดข้อผิดพลาด: " + response.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setAgreed(false);
    onCancel();
  };

  return (
    <Modal
      title={
        <Space>
          <CommentOutlined style={{ color: "#1890ff" }} />
          แสดงความคิดเห็น
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Alert
          message="ข้อมูลสำคัญ"
          description="ระบบจะเก็บ IP Address เพื่อความปลอดภัย และความคิดเห็นจะถูกเผยแพร่ทันที"
          type="warning"
          showIcon
          style={{ marginBottom: "20px" }}
        />

        {qaItem && (
          <div
            style={{
              marginBottom: "20px",
              padding: "12px",
              backgroundColor: "#f9f9f9",
              borderRadius: "6px",
            }}
          >
            <strong>คำถาม:</strong> {qaItem.question}
          </div>
        )}

        <Form.Item
          name="comment"
          label="ความคิดเห็น"
          rules={[
            { required: true, message: "กรุณากรอกความคิดเห็น" },
            { min: 5, message: "ความคิดเห็นต้องมีอย่างน้อย 5 ตัวอักษร" },
          ]}
        >
          <TextArea
            rows={4}
            placeholder="แสดงความคิดเห็นของท่าน..."
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item name="rating" label="คะแนนความพึงพอใจ (ไม่บังคับ)">
          <Rate
            allowHalf
            style={{ fontSize: "20px" }}
            character={<StarOutlined />}
          />
        </Form.Item>

        <Form.Item name="name" label="ชื่อ (ไม่บังคับ)">
          <Input placeholder="ชื่อของท่าน" />
        </Form.Item>

        <Form.Item
          name="email"
          label="อีเมล (ไม่บังคับ)"
          rules={[{ type: "email", message: "รูปแบบอีเมลไม่ถูกต้อง" }]}
        >
          <Input placeholder="อีเมลของท่าน" />
        </Form.Item>

        <div style={{ marginBottom: "20px" }}>
          <Checkbox
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          >
            ข้าพเจ้ายอมรับเงื่อนไขการใช้งาน ยินยอมให้เก็บ IP Address
            และรับทราบว่าความคิดเห็นจะถูกเผยแพร่ทันที
          </Checkbox>
        </div>

        <div style={{ textAlign: "right" }}>
          <Space>
            <Button onClick={handleCancel}>ยกเลิก</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={!agreed}
              icon={<SendOutlined />}
            >
              ส่งความคิดเห็น
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
}
