'use client';

import { useState } from 'react';

export default function ComplaintsPage() {
  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    phone: '',
    subject: '',
    message: '',
    captcha: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.senderName.trim()) {
      newErrors.senderName = 'กรุณากรอกชื่อผู้ส่ง';
    }
    
    if (!formData.senderEmail.trim()) {
      newErrors.senderEmail = 'กรุณากรอกอีเมล์';
    } else if (!/\S+@\S+\.\S+/.test(formData.senderEmail)) {
      newErrors.senderEmail = 'รูปแบบอีเมล์ไม่ถูกต้อง';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // ส่งข้อมูลไปยัง API complaints
    fetch('/api/complaints', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(async (res) => {
        const result = await res.json();
        if (result.success) {
          alert('ส่งเรื่องร้องทุกข์เรียบร้อยแล้ว');
          setFormData({
            senderName: '',
            senderEmail: '',
            phone: '',
            subject: '',
            message: '',
            captcha: '',
          });
        } else {
          alert('เกิดข้อผิดพลาด: ' + (result.error || 'ไม่สามารถส่งข้อมูลได้'));
        }
      })
      .catch((err) => {
        alert('เกิดข้อผิดพลาด: ' + err.message);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ศูนย์รับเรื่องราวร้องทุกข์
          </h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6 text-gray-500">
            {/* ชื่อผู้ส่ง */}
            <div>
              <label htmlFor="senderName" className="block text-sm font-medium text-gray-700 mb-2 ">
                ชื่อผู้ส่ง <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="senderName"
                name="senderName"
                value={formData.senderName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.senderName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="กรุณากรอกชื่อผู้ส่ง"
              />
              {errors.senderName && (
                <p className="mt-1 text-sm text-red-600">{errors.senderName}</p>
              )}
            </div>

            {/* อีเมล์ผู้ส่ง */}
            <div>
              <label htmlFor="senderEmail" className="block text-sm font-medium text-gray-700 mb-2">
                อีเมล์ผู้ส่ง <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="senderEmail"
                name="senderEmail"
                value={formData.senderEmail}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.senderEmail ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="กรุณากรอกอีเมล์"
              />
              {errors.senderEmail && (
                <p className="mt-1 text-sm text-red-600">{errors.senderEmail}</p>
              )}
            </div>

            {/* โทรศัพท์ */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                โทรศัพท์
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="กรุณากรอกหมายเลขโทรศัพท์"
              />
            </div>

            {/* เรื่อง */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                เรื่อง
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="กรุณากรอกหัวข้อเรื่อง"
              />
            </div>

            {/* ข้อความ */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                ข้อความ
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="กรุณากรอกรายละเอียดเรื่องร้องทุกข์"
              />
            </div>

            {/* รหัสยืนยัน */}
            <div>
              <label htmlFor="captcha" className="block text-sm font-medium text-gray-700 mb-2">
                รหัสยืนยัน
              </label>
              <div className="flex items-center space-x-4">
                <div className="bg-gray-100 px-4 py-2 rounded border text-lg font-mono tracking-wider">
                  ABCD123
                </div>
                <input
                  type="text"
                  id="captcha"
                  name="captcha"
                  value={formData.captcha}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="กรุณากรอกรหัสยืนยัน"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                ส่งเรื่องร้องทุกข์
              </button>
            </div>
          </form>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            ข้อมูลการติดต่อ
          </h3>
          <div className="text-blue-800 space-y-2">
            <p>📞 โทรศัพท์: 0-3858-7308</p>
            <p>📧 อีเมล์: admin@example.com</p>
            <p>🕒 เวลาทำการ: จันทร์-ศุกร์ 08:30-16:30 น.</p>
          </div>
        </div>
      </div>
    </div>
  );
}