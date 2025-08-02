'use client';

import React, { useState } from 'react';

// Try importing one by one to identify the problematic import
try {
  var { Modal } = require('antd');
  var { Form } = require('antd');
  var { Input } = require('antd');
  var { Button } = require('antd');
  var { Space } = require('antd');
  var { Typography } = require('antd');
  var { Alert } = require('antd');
  var { Checkbox } = require('antd');
  var { Card } = require('antd');
  var { Rate } = require('antd');
} catch (error) {
  console.error('Error importing Ant Design components:', error);
}

try {
  var { CommentOutlined } = require('@ant-design/icons');
  var { SendOutlined } = require('@ant-design/icons');
  var { UserOutlined } = require('@ant-design/icons');
  var { MailOutlined } = require('@ant-design/icons');
  var { ShieldOutlined } = require('@ant-design/icons');
  var { StarOutlined } = require('@ant-design/icons');
} catch (error) {
  console.error('Error importing Ant Design icons:', error);
}

const { TextArea } = Input || {};
const { Title, Text, Paragraph } = Typography || {};

const SubmitCommentModal = ({ 
  visible, 
  onCancel, 
  qaItem = null 
}) => {
  const [form] = Form?.useForm ? Form.useForm() : [{}];
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
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Submitting:', formData);
      setSubmitted(true);
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error submitting:', error);
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

  // Fallback if components are not available
  if (!Modal || !Form || !Input || !Button) {
    return (
      <div style={{ padding: '20px', border: '1px solid #ccc' }}>
        <h3>ข้อผิดพลาด: ไม่สามารถโหลด Ant Design components ได้</h3>
        <p>กรุณาตรวจสอบการติดตั้ง antd และ @ant-design/icons</p>
        <button onClick={onCancel}>ปิด</button>
      </div>
    );
  }

  return (
    <Modal
      title={
        <Space>
          {CommentOutlined && <CommentOutlined style={{ color: '#1890ff' }} />}
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
          {Alert && (
            <Alert
              message="ส่งความคิดเห็นเรียบร้อยแล้ว!"
              description="เจ้าหน้าที่จะตรวจสอบและเผยแพร่ความคิดเห็นโดยเร็วที่สุด ขอบคุณที่ให้ข้อเสนอแนะ"
              type="success"
              showIcon
              style={{ marginBottom: '20px' }}
            />
          )}
        </div>
      ) : showConfirmation ? (
        <div>
          {Alert && (
            <Alert
              message="ยืนยันการส่งความคิดเห็น"
              description="กรุณาอ่านและยอมรับเงื่อนไขก่อนส่งความคิดเห็น"
              type="warning"
              showIcon
              style={{ marginBottom: '20px' }}
            />
          )}

          {qaItem && Card && (
            <Card style={{ marginBottom: '20px' }}>
              {Title && (
                <Title level={5}>
                  {CommentOutlined && <CommentOutlined style={{ marginRight: '8px', color: '#1890ff' }} />}
                  ความคิดเห็นสำหรับ:
                </Title>
              )}
              {Paragraph && (
                <Paragraph style={{ 
                  backgroundColor: '#f5f5f5', 
                  padding: '12px', 
                  borderRadius: '6px',
                  marginBottom: '16px'
                }}>
                  {qaItem.question}
                </Paragraph>
              )}
              
              {Title && <Title level={5}>ความคิดเห็นของท่าน:</Title>}
              {Paragraph && (
                <Paragraph style={{ 
                  backgroundColor: '#f0f8ff', 
                  padding: '12px', 
                  borderRadius: '6px',
                  marginBottom: '16px'
                }}>
                  {formData?.comment}
                </Paragraph>
              )}

              {formData?.rating && Rate && (
                <div>
                  {Text && (
                    <Text type="secondary">
                      คะแนนความพึงพอใจ: 
                    </Text>
                  )}
                  <Rate disabled value={formData.rating} style={{ marginLeft: '8px' }} />
                </div>
              )}
            </Card>
          )}

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
                icon={SendOutlined && <SendOutlined />}
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
          {Alert && (
            <Alert
              message="ข้อมูลสำคัญที่ควรทราบ"
              description="ระบบจะเก็บ IP Address ของท่านเพื่อป้องกันการใช้งานในทางที่ผิด และความคิดเห็นจะถูกตรวจสอบโดยเจ้าหน้าที่ก่อนเผยแพร่"
              type="warning"
              showIcon
              style={{ marginBottom: '20px' }}
            />
          )}

          {qaItem && Card && (
            <Card style={{ marginBottom: '20px', backgroundColor: '#f9f9f9' }}>
              {Title && (
                <Title level={5}>
                  แสดงความคิดเห็นสำหรับ:
                </Title>
              )}
              {Paragraph && (
                <Paragraph>
                  {qaItem.question}
                </Paragraph>
              )}
            </Card>
          )}

          <Form.Item
            name="rating"
            label="คะแนนความพึงพอใจ (ไม่บังคับ)"
          >
            {Rate && (
              <Rate 
                allowHalf 
                style={{ fontSize: '24px' }}
                character={StarOutlined && <StarOutlined />}
              />
            )}
          </Form.Item>

          <Form.Item
            name="comment"
            label="ความคิดเห็น"
            rules={[
              { required: true, message: 'กรุณากรอกความคิดเห็น' },
              { min: 5, message: 'ความคิดเห็นต้องมีอย่างน้อย 5 ตัวอักษร' }
            ]}
          >
            {TextArea && (
              <TextArea
                rows={4}
                placeholder="แสดงความคิดเห็นของท่านเกี่ยวกับคำตอบนี้..."
                maxLength={500}
                showCount
                size="large"
              />
            )}
          </Form.Item>

          <Form.Item
            name="commenter_name"
            label="ชื่อ-นามสกุล (ไม่บังคับ)"
          >
            <Input
              prefix={UserOutlined && <UserOutlined />}
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
              prefix={MailOutlined && <MailOutlined />}
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
                icon={SendOutlined && <SendOutlined />}
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
};

export default SubmitCommentModal;