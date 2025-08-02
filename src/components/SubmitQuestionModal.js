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
  Divider,
  Checkbox,
  Card
} from 'antd';
import { 
  QuestionCircleOutlined, 
  SendOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  ExclamationCircleOutlined,
  ShieldOutlined
} from '@ant-design/icons';
import { qaAPI } from '@/lib/api';

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

export default function SubmitQuestionModal({ 
  visible, 
  onCancel, 
  categories = [] 
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState(null);
  const [agreed, setAgreed] = useState(false);

  const handleFormSubmit = (values) => {
    setFormData(values);
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    if (!agreed) {
      return;
    }

    try {
      setLoading(true);
      
      const response = await qaAPI.submitQuestion(formData);
      
      if (response.success) {
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
      }
    } catch (error) {
      console.error('Failed to submit question:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToForm = () => {
    setShowConfirmation(false);
    setAgreed(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setSubmitted(false);
    setShowConfirmation(false);
    setAgreed(false);
    setFormData(null);
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
            description="เจ้าหน้าที่จะตรวจสอบและตอบกลับโดยเร็วที่สุด ขอบคุณที่ใช้บริการ"
            type="success"
            showIcon
            style={{ marginBottom: '20px' }}
          />
        </div>
      ) : showConfirmation ? (
        // Confirmation Step
        <div>
          <Alert
            message="ยืนยันการส่งคำถาม"
            description="กรุณาอ่านและยอมรับเงื่อนไขก่อนส่งคำถาม"
            type="warning"
            showIcon
            style={{ marginBottom: '20px' }}
          />

          <Card style={{ marginBottom: '20px' }}>
            <Typography.Title level={5}>
              <QuestionCircleOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
              คำถามของท่าน:
            </Typography.Title>
            <Typography.Paragraph style={{ 
              backgroundColor: '#f5f5f5', 
              padding: '12px', 
              borderRadius: '6px',
              marginBottom: '16px'
            }}>
              {formData?.question}
            </Typography.Paragraph>
            
            {formData?.category_id && (
              <Typography.Text type="secondary">
                หมวดหมู่: {categories.find(c => c.id === formData.category_id)?.category_name}
              </Typography.Text>
            )}
          </Card>

          <Card 
            title={
              <Space>
                <ShieldOutlined style={{ color: '#ff4d4f' }} />
                <span>ข้อกำหนดและเงื่อนไขการใช้งาน</span>
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
                    <p><strong>ความรับผิดชอบของผู้ใช้:</strong></p>
                    <p>• ผู้ใช้ต้องรับผิดชอบต่อเนื้อหาที่ส่งมาเองทั้งหมด</p>
                    <p>• ต้องใช้ภาษาที่สุภาพ เหมาะสม และไม่ขัดต่อกฎหมาย</p>
                    <p>• ห้ามส่งข้อมูลที่เป็นเท็จ หรือมีเจตนาทำลาย</p>
                    <p><strong>ความรับผิดชอบของเทศบาล:</strong></p>
                    <p>• เทศบาลตำบลบ้านโพธิ์ไม่รับผิดชอบต่อเนื้อหาที่ผู้ใช้ส่งมา</p>
                    <p>• เทศบาลขอสงวนสิทธิ์ในการตรวจสอบ แก้ไข หรือลบเนื้อหาที่ไม่เหมาะสม</p>
                    <p>• คำถามจะถูกเผยแพร่หลังจากได้รับการตรวจสอบและอนุมัติจากเจ้าหน้าที่</p>
                    <p>• เทศบาลไม่รับประกันความถูกต้องหรือความครบถ้วนของคำตอบ</p>
                  </div>
                }
                type="error"
                showIcon
              />

              <Alert
                message="📋 ขั้นตอนการดำเนินการ"
                description={
                  <div style={{ lineHeight: '1.6' }}>
                    <p>1. คำถามจะถูกส่งเข้าสู่ระบบพร้อมบันทึก IP Address</p>
                    <p>2. เจ้าหน้าที่จะตรวจสอบเนื้อหาและความเหมาะสม</p>
                    <p>3. คำถามที่ผ่านการตรวจสอบจะถูกเผยแพร่พร้อมคำตอบ</p>
                    <p>4. คำถามที่ไม่เหมาะสมจะถูกปฏิเสธโดยไม่แจ้งเหตุผล</p>
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
              <Typography.Text style={{ lineHeight: '1.6' }}>
                <strong>ข้าพเจ้าขอยืนยันว่า:</strong><br/>
                ✓ ได้อ่านและเข้าใจข้อกำหนดและเงื่อนไขข้างต้นแล้ว<br/>
                ✓ ยินยอมให้เก็บข้อมูล IP Address เพื่อวัตถุประสงค์ด้านความปลอดภัย<br/>
                ✓ รับทราบว่าเทศบาลไม่รับผิดชอบต่อเนื้อหาที่ข้าพเจ้าส่งมา<br/>
                ✓ รับผิดชอบต่อเนื้อหาที่ส่งมาเองทั้งหมด<br/>
                ✓ จะใช้ภาษาที่สุภาพและเหมาะสมเท่านั้น
              </Typography.Text>
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
                ยืนยันส่งคำถาม
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
            description={
              <div>
                <p><strong>การเก็บข้อมูล:</strong></p>
                <p>• ระบบจะเก็บ IP Address ของท่านเพื่อป้องกันการใช้งานในทางที่ผิด</p>
                <p>• คำถามจะถูกตรวจสอบโดยเจ้าหน้าที่ก่อนเผยแพร่</p>
                <p><strong>ความรับผิดชอบ:</strong></p>
                <p>• เทศบาลไม่รับผิดชอบต่อเนื้อหาที่ผู้ใช้ส่งมา</p>
                <p>• ผู้ใช้ต้องรับผิดชอบต่อข้อมูลที่ส่งมาเองทั้งหมด</p>
                <p>• กรุณาใช้ภาษาที่สุภาพและเหมาะสม</p>
              </div>
            }
            type="warning"
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

          <Divider orientation="left">
            <Text type="secondary">ข้อมูลติดต่อ (ไม่บังคับ)</Text>
          </Divider>

          <Form.Item
            name="submitter_name"
            label="ชื่อ-นามสกุล"
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="ชื่อของท่าน (ไม่บังคับ)"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="submitter_email"
            label="อีเมล"
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
            label="เบอร์โทรศัพท์"
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