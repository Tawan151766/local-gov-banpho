'use client';

import React, { useState } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  Button, 
  Space, 
  Typography,
  Alert,
  Checkbox,
  Card
} from 'antd';
import { 
  QuestionCircleOutlined, 
  SendOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import { qaAPI } from '@/lib/api';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

export default function SubmitQuestionModal({ 
  visible, 
  onCancel, 
  categories = [],
  onQuestionAdded
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await qaAPI.submitQuestion(values);
      
      if (response.success) {
        setSubmitted(true);
        form.resetFields();
        // รีเฟรช Q&A list
        if (onQuestionAdded) {
          onQuestionAdded();
        }
        setTimeout(() => {
          setSubmitted(false);
          onCancel();
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to submit question:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setSubmitted(false);
    onCancel();
  };

  return (
    <Modal
      title={
        <Space>
          <QuestionCircleOutlined style={{ color: '#1890ff' }} />
          ส่งคำถามใหม่
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnHidden
    >
      {submitted ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Alert
            message="ส่งคำถามเรียบร้อยแล้ว!"
            description="คำถามได้ถูกเผยแพร่แล้ว เจ้าหน้าที่จะเพิ่มคำตอบโดยเร็วที่สุด ขอบคุณที่ใช้บริการ"
            type="success"
            showIcon
            style={{ marginBottom: '20px' }}
          />
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Alert
            message="ข้อมูลสำคัญที่ควรทราบ"
            description="คำถามจะถูกเผยแพร่ทันทีและเจ้าหน้าที่จะเพิ่มคำตอบโดยเร็วที่สุด ระบบจะเก็บ IP Address เพื่อความปลอดภัย"
            type="info"
            showIcon
            style={{ marginBottom: '20px' }}
          />

          <Form.Item
            name="category_id"
            label="หมวดหมู่คำถาม"
            rules={[{ required: true, message: 'กรุณาเลือกหมวดหมู่' }]}
          >
            <Select 
              placeholder="เลือกหมวดหมู่ที่เหมาะสม"
              size="large"
            >
              {categories.map(category => (
                <Option key={category.id} value={category.id}>
                  {category.category_name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="question"
            label="คำถาม"
            rules={[
              { required: true, message: 'กรุณากรอกคำถาม' },
              { min: 10, message: 'คำถามต้องมีอย่างน้อย 10 ตัวอักษร' }
            ]}
          >
            <TextArea
              rows={4}
              placeholder="กรอกคำถามของท่านให้ชัดเจน เช่น ขั้นตอนการขอใบรับรองการไม่มีหนี้สิน..."
              maxLength={1000}
              showCount
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="submitter_name"
            label="ชื่อ-นามสกุล (ไม่บังคับ)"
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="ชื่อของท่าน (ไม่บังคับ)"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="submitter_email"
            label="อีเมล (ไม่บังคับ)"
            rules={[
              { type: 'email', message: 'รูปแบบอีเมลไม่ถูกต้อง' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="อีเมลของท่าน (ไม่บังคับ)"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="submitter_phone"
            label="เบอร์โทรศัพท์ (ไม่บังคับ)"
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="เบอร์โทรศัพท์ของท่าน (ไม่บังคับ)"
              size="large"
            />
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: '24px' }}>
            <Space>
              <Button onClick={handleCancel} size="large">
                ยกเลิก
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                icon={<SendOutlined />}
                size="large"
              >
                ส่งคำถาม
              </Button>
            </Space>
          </div>
        </Form>
      )}
    </Modal>
  );
}