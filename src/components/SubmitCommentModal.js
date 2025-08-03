'use client';

import React, { useState } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Button, 
  Space, 
  Typography,
  Alert,
  Checkbox,
  Card,
  Rate
} from 'antd';
import { 
  CommentOutlined, 
  SendOutlined,
  UserOutlined,
  MailOutlined,
  ShieldOutlined,
  StarOutlined
} from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

export default function SubmitCommentModal({ 
  visible, 
  onCancel, 
  qaItem = null 
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState(null);
  const [agreed, setAgreed] = useState(false);

  const handleFormSubmit = (values) => {
    console.log('Form values:', values);
    setFormData(values);
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    if (!agreed) {
      return;
    }

    try {
      setLoading(true);
      
      // TODO: Implement comment submission API
      // const response = await qaAPI.submitComment(qaItem.id, formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitted(true);
      form.resetFields();
      setShowConfirmation(false);
      setAgreed(false);
      setFormData(null);
      
      // ปิด modal หลังจาก 3 วินาที
      setTimeout(() => {
        setSubmitted(false);
        onCancel();
      }, 3000);
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToForm = () => {
    setShowConfirmation(false);
    setAgreed(false);
  };

  const handleCancel = () => {
    if (form?.resetFields) {
      form.resetFields();
    }
    setSubmitted(false);
    setShowConfirmation(false);
    setFormData(null);
    setAgreed(false);
    onCancel();
  };

  return (
    <Modal
      title={
        <Space>
          <CommentOutlined style={{ color: '#1890ff' }} />
          แสดงความคิดเห็น
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
            message="ส่งความคิดเห็นเรียบร้อยแล้ว!"
            description="เจ้าหน้าที่จะตรวจสอบและเผยแพร่ความคิดเห็นโดยเร็วที่สุด ขอบคุณที่ให้ข้อเสนอแนะ"
            type="success"
            showIcon
            style={{ marginBottom: '20px' }}
          />
        </div>
      ) : showConfirmation ? (
        // Confirmation Step
        <div>
          <Alert
            message="ยืนยันการส่งความคิดเห็น"
            description="กรุณาอ่านและยอมรับเงื่อนไขก่อนส่งความคิดเห็น"
            type="warning"
            showIcon
            style={{ marginBottom: '20px' }}
          />

          {qaItem && (
            <Card style={{ marginBottom: '20px' }}>
              <Title level={5}>
                <CommentOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                ความคิดเห็นสำหรับ:
              </Title>
              <Paragraph style={{ 
                backgroundColor: '#f5f5f5', 
                padding: '12px', 
                borderRadius: '6px',
                marginBottom: '16px'
              }}>
                {qaItem.question}
              </Paragraph>
              
              <Title level={5}>ความคิดเห็นของท่าน:</Title>
              <Paragraph style={{ 
                backgroundColor: '#f0f8ff', 
                padding: '12px', 
                borderRadius: '6px',
                marginBottom: '16px'
              }}>
                {formData?.comment}
              </Paragraph>

              {formData?.rating && (
                <div>
                  <Text type="secondary">
                    คะแนนความพึงพอใจ: 
                  </Text>
                  <Rate disabled value={formData.rating} style={{ marginLeft: '8px' }} />
                </div>
              )}
            </Card>
          )}

          <Card 
            title={
              <Space>
                <ShieldOutlined style={{ color: '#ff4d4f' }} />
                <span>ข้อกำหนดและเงื่อนไขการแสดงความคิดเห็น</span>
              </Space>
            }
            style={{ marginBottom: '20px', border: '2px solid #ff4d4f' }}
          >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Alert
                message="🔒 การเก็บข้อมูล IP Address"
                description={
                  <div style={{ lineHeight: '1.6' }}>
                    <p><strong>วัตถุประสงค์:</strong></p>
                    <p>• ป้องกันการใช้งานในทางที่ผิด (Spam, การโจมตี)</p>
                    <p>• ตรวจสอบและรักษาความปลอดภัยของระบบ</p>
                    <p>• ติดตามการใช้งานเพื่อปรับปรุงบริการ</p>
                    <p><strong>การใช้ข้อมูล:</strong></p>
                    <p>• ข้อมูล IP จะถูกเก็บไว้เป็นความลับและใช้เพื่อวัตถุประสงค์ด้านความปลอดภัยเท่านั้น</p>
                    <p>• จะไม่มีการเปิดเผยข้อมูลส่วนบุคคลต่อบุคคลที่สาม</p>
                  </div>
                }
                type="info"
                showIcon
              />
              
              <Alert
                message="⚠️ ข้อจำกัดความรับผิดชอบ"
                description={
                  <div style={{ lineHeight: '1.6' }}>
                    <p><strong>ความรับผิดชอบของผู้แสดงความคิดเห็น:</strong></p>
                    <p>• ผู้ใช้ต้องรับผิดชอบต่อความคิดเห็นที่ส่งมาเองทั้งหมด</p>
                    <p>• ต้องใช้ภาษาที่สุภาพ เหมาะสม และไม่ขัดต่อกฎหมาย</p>
                    <p>• ห้ามแสดงความคิดเห็นที่เป็นเท็จ หรือมีเจตนาทำลาย</p>
                    <p>• ห้ามใช้คำพูดที่หยาบคาย หรือไม่เหมาะสม</p>
                    <p><strong>ความรับผิดชอบของเทศบาล:</strong></p>
                    <p>• เทศบาลตำบลบ้านโพธิ์ไม่รับผิดชอบต่อความคิดเห็นที่ผู้ใช้ส่งมา</p>
                    <p>• เทศบาลขอสงวนสิทธิ์ในการตรวจสอบ แก้ไข หรือลบความคิดเห็นที่ไม่เหมาะสม</p>
                    <p>• ความคิดเห็นจะถูกเผยแพร่หลังจากได้รับการตรวจสอบและอนุมัติจากเจ้าหน้าที่</p>
                    <p>• เทศบาลไม่รับประกันการตอบกลับความคิดเห็นทุกรายการ</p>
                  </div>
                }
                type="error"
                showIcon
              />

              <Alert
                message="📋 ขั้นตอนการดำเนินการ"
                description={
                  <div style={{ lineHeight: '1.6' }}>
                    <p>1. ความคิดเห็นจะถูกส่งเข้าสู่ระบบพร้อมบันทึก IP Address</p>
                    <p>2. เจ้าหน้าที่จะตรวจสอบเนื้อหาและความเหมาะสม</p>
                    <p>3. ความคิดเห็นที่ผ่านการตรวจสอบจะถูกเผยแพร่</p>
                    <p>4. ความคิดเห็นที่ไม่เหมาะสมจะถูกปฏิเสธโดยไม่แจ้งเหตุผล</p>
                  </div>
                }
                type="info"
                showIcon
              />
            </Space>
          </Card>

          <div style={{ 
            marginBottom: '20px', 
            padding: '16px', 
            backgroundColor: '#fff2e8', 
            border: '2px solid #fa8c16',
            borderRadius: '8px'
          }}>
            <Checkbox 
              checked={agreed} 
              onChange={(e) => setAgreed(e.target.checked)}
              style={{ alignItems: 'flex-start' }}
            >
              <Text style={{ lineHeight: '1.6' }}>
                <strong>ข้าพเจ้าขอยืนยันว่า:</strong><br/>
                ✓ ได้อ่านและเข้าใจข้อกำหนดและเงื่อนไขข้างต้นแล้ว<br/>
                ✓ ยินยอมให้เก็บข้อมูล IP Address เพื่อวัตถุประสงค์ด้านความปลอดภัย<br/>
                ✓ รับทราบว่าเทศบาลไม่รับผิดชอบต่อความคิดเห็นที่ข้าพเจ้าส่งมา<br/>
                ✓ รับผิดชอบต่อความคิดเห็นที่ส่งมาเองทั้งหมด<br/>
                ✓ จะใช้ภาษาที่สุภาพและเหมาะสมเท่านั้น
              </Text>
            </Checkbox>
          </div>

          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={handleBackToForm} size="large">
                กลับไปแก้ไข
              </Button>
              <Button 
                type="primary" 
                onClick={handleConfirmSubmit}
                loading={loading}
                disabled={!agreed}
                icon={<SendOutlined />}
                size="large"
              >
                ยืนยันส่งความคิดเห็น
              </Button>
            </Space>
          </div>
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          requiredMark={false}
        >
          <Alert
            message="ข้อมูลสำคัญที่ควรทราบ"
            description="ระบบจะเก็บ IP Address ของท่านเพื่อป้องกันการใช้งานในทางที่ผิด และความคิดเห็นจะถูกตรวจสอบโดยเจ้าหน้าที่ก่อนเผยแพร่"
            type="warning"
            showIcon
            style={{ marginBottom: '20px' }}
          />

          {qaItem && (
            <Card style={{ marginBottom: '20px', backgroundColor: '#f9f9f9' }}>
              <Title level={5}>
                แสดงความคิดเห็นสำหรับ:
              </Title>
              <Paragraph>
                {qaItem.question}
              </Paragraph>
            </Card>
          )}

          <Form.Item
            name="rating"
            label="คะแนนความพึงพอใจ (ไม่บังคับ)"
          >
            <Rate 
              allowHalf 
              style={{ fontSize: '24px' }}
              character={<StarOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="comment"
            label="ความคิดเห็น"
            rules={[
              { required: true, message: 'กรุณากรอกความคิดเห็น' },
              { min: 5, message: 'ความคิดเห็นต้องมีอย่างน้อย 5 ตัวอักษร' }
            ]}
          >
            <TextArea
              rows={4}
              placeholder="แสดงความคิดเห็นของท่านเกี่ยวกับคำตอบนี้..."
              maxLength={500}
              showCount
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="commenter_name"
            label="ชื่อ-นามสกุล (ไม่บังคับ)"
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="ชื่อของท่าน (ไม่บังคับ)"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="commenter_email"
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
                ส่งความคิดเห็น
              </Button>
            </Space>
          </div>
        </Form>
      )}
    </Modal>
  );
}