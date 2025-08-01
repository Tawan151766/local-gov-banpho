'use client';

import React, { useState } from 'react';
import { uploadFileToServer } from '@/lib/fileUploadUtils';
import { User, Home, Phone, FileText, AlertCircle, RefreshCcw, Send, Edit } from "lucide-react";

export default function GeneralRequestPage() {
  const [formData, setFormData] = useState({
    request_date: new Date().toISOString().split('T')[0],
    request_day: new Date().getDate().toString(),
    request_month: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'][new Date().getMonth()],
    request_year: (new Date().getFullYear() + 543).toString(),
    requester_title: 'นาย',
    requester_name: '',
    requester_age: '',
    requester_nationality: 'ไทย',
    requester_house_number: '',
    requester_village: '',
    requester_subdistrict: '',
    requester_district: '',
    requester_province: '',
    requester_postal_code: '',
    requester_phone: '',
    request_subject: '',
    request_details: '',
    document_1: null,
    document_2: null,
    document_3: null,
    other_document_1: null,
    other_document_2: null,
    captcha_answer: ''
  });

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [captcha, setCaptcha] = useState(generateCaptcha());

  function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 900000) + 100000;
    return num1.toString();
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = async (field, file) => {
    if (!file) {
      handleInputChange(field, null);
      return;
    }

    try {
      setUploading(true);
      const result = await uploadFileToServer(file);
      
      if (result.success) {
        const filePath = result.url.replace('https://banpho.sosmartsolution.com/storage/', '');
        handleInputChange(field, filePath);
      }
    } catch (error) {
      console.error('File upload error:', error);
      alert('เกิดข้อผิดพลาดในการอัปโหลดไฟล์');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.requester_name || !formData.requester_age || !formData.request_subject || !formData.request_details) {
      alert('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }

    if (!formData.captcha_answer) {
      alert('กรุณากรอกรหัสยืนยัน');
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch('/api/general-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ip_address: window.location.hostname,
          user_agent: navigator.userAgent
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitSuccess(true);
        // Reset form
        setFormData({
          request_date: new Date().toISOString().split('T')[0],
          request_day: new Date().getDate().toString(),
          request_month: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'][new Date().getMonth()],
          request_year: (new Date().getFullYear() + 543).toString(),
          requester_title: 'นาย',
          requester_name: '',
          requester_age: '',
          requester_nationality: 'ไทย',
          requester_house_number: '',
          requester_village: '',
          requester_subdistrict: '',
          requester_district: '',
          requester_province: '',
          requester_postal_code: '',
          requester_phone: '',
          request_subject: '',
          request_details: '',
          document_1: null,
          document_2: null,
          document_3: null,
          other_document_1: null,
          other_document_2: null,
          captcha_answer: ''
        });
        setCaptcha(generateCaptcha());
        
        // Reset success message after 3 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 3000);
      } else {
        alert('เกิดข้อผิดพลาด: ' + result.error);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('เกิดข้อผิดพลาดในการส่งข้อมูล');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div
        className="w-full min-h-screen py-8 px-2 md:px-8 flex flex-col items-center bg-transparent"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(239, 228, 212, 0.6) 0%, rgba(1, 189, 204, 0.6) 100%), url("/image/Boat.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="w-full max-w-[800px] mt-20">
          <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm text-center">
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-600 mb-4">ส่งคำร้องสำเร็จ!</h2>
            <p className="text-gray-600 mb-4">
              คำร้องทั่วไปของคุณได้รับการบันทึกเรียบร้อยแล้ว
            </p>
            <p className="text-sm text-gray-500">
              เจ้าหน้าที่จะติดต่อกลับภายใน 3-5 วันทำการ
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-screen py-8 px-2 md:px-8 flex flex-col items-center bg-transparent"
      style={{
        backgroundImage:
          'linear-gradient(180deg, rgba(239, 228, 212, 0.6) 0%, rgba(1, 189, 204, 0.6) 100%), url("/image/Boat.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Header Section */}
      <div className="w-full max-w-[1268px] flex flex-col gap-4 mb-8">
        <div className="bg-gradient-to-r from-[#03bdca] to-[#01bdcc] rounded-[36px] shadow-lg w-full flex flex-col md:flex-row items-center px-6 py-6 relative backdrop-blur-sm">
          <div className="bg-white rounded-full shadow-md w-32 h-16 flex items-center justify-center mb-4 md:mb-0 md:absolute md:left-6 md:top-1/2 md:-translate-y-1/2 border-2 border-[#01bdcc]">
            <Edit className="text-[#01bdcc]" size={32} />
            <span className="text-[#01385f] font-bold text-lg tracking-wide ml-2">
              คำร้อง
            </span>
          </div>
          <div className="flex-1 flex flex-wrap flex-row items-center justify-center gap-6 md:gap-12 md:ml-40">
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              คำร้องทั่วไป
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              General Request
            </span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[800px]">
        {/* Form Container */}
        <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg backdrop-blur-sm overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white text-center">
            <h1 className="text-2xl font-bold mb-2">
              แบบคำร้องทั่วไป
            </h1>
            <p className="text-purple-100">
              กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง
            </p>
          </div>

          {/* Form */}
          <div className="p-6">

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm flex-wrap">
                  <span className="font-medium">วันที่ :</span>
                  <select
                    value={formData.request_day}
                    onChange={(e) => handleInputChange('request_day', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {Array.from({length: 31}, (_, i) => (
                      <option key={i+1} value={i+1}>{i+1}</option>
                    ))}
                  </select>
                  <select
                    value={formData.request_month}
                    onChange={(e) => handleInputChange('request_month', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="มกราคม">มกราคม</option>
                    <option value="กุมภาพันธ์">กุมภาพันธ์</option>
                    <option value="มีนาคม">มีนาคม</option>
                    <option value="เมษายน">เมษายน</option>
                    <option value="พฤษภาคม">พฤษภาคม</option>
                    <option value="มิถุนายน">มิถุนายน</option>
                    <option value="กรกฎาคม">กรกฎาคม</option>
                    <option value="สิงหาคม">สิงหาคม</option>
                    <option value="กันยายน">กันยายน</option>
                    <option value="ตุลาคม">ตุลาคม</option>
                    <option value="พฤศจิกายน">พฤศจิกายน</option>
                    <option value="ธันวาคม">ธันวาคม</option>
                  </select>
                  <select
                    value={formData.request_year}
                    onChange={(e) => handleInputChange('request_year', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value={(new Date().getFullYear() + 542).toString()}>{(new Date().getFullYear() + 542).toString()}</option>
                    <option value={(new Date().getFullYear() + 543).toString()}>{(new Date().getFullYear() + 543).toString()}</option>
                    <option value={(new Date().getFullYear() + 544).toString()}>{(new Date().getFullYear() + 544).toString()}</option>
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FileText className="text-purple-600" size={18} /> เรื่อง <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.request_subject}
                    onChange={(e) => handleInputChange('request_subject', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="ระบุเรื่องที่ต้องการยื่นคำร้อง"
                    required
                  />
                </div>
                <p className="text-gray-700 flex items-center gap-2">
                  <User className="text-purple-600" size={18} /> เรียน: นายกเทศมนตรีตำบลบ้านโพธิ์
                </p>
              </div>

              {/* Personal Information */}
              <div className="bg-white border-2 border-gray-100 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <User className="text-purple-600" size={20} /> ข้อมูลผู้ยื่นคำร้อง
                </h3>

                {/* Gender Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ด้วยข้าพเจ้า <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4 flex-wrap">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="title"
                        value="นาย"
                        checked={formData.requester_title === 'นาย'}
                        onChange={(e) => handleInputChange('requester_title', e.target.value)}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <span>นาย</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="title"
                        value="นาง"
                        checked={formData.requester_title === 'นาง'}
                        onChange={(e) => handleInputChange('requester_title', e.target.value)}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <span>นาง</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="title"
                        value="นางสาว"
                        checked={formData.requester_title === 'นางสาว'}
                        onChange={(e) => handleInputChange('requester_title', e.target.value)}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <span>นางสาว</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ชื่อ-นามสกุล <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.requester_name}
                      onChange={(e) => handleInputChange('requester_name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="ชื่อ-นามสกุล"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      อายุ <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={formData.requester_age}
                        onChange={(e) => handleInputChange('requester_age', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="อายุ"
                        required
                      />
                      <span className="text-sm text-gray-600">ปี</span>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <Home className="text-purple-600" size={16} /> อยู่บ้านเลขที่ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.requester_house_number}
                      onChange={(e) => handleInputChange('requester_house_number', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="เลขที่บ้าน"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      หมู่ที่
                    </label>
                    <input
                      type="text"
                      value={formData.requester_village}
                      onChange={(e) => handleInputChange('requester_village', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="หมู่ที่"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ตำบล <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.requester_subdistrict}
                      onChange={(e) => handleInputChange('requester_subdistrict', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="บ้านโพธิ์"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      อำเภอ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.requester_district}
                      onChange={(e) => handleInputChange('requester_district', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="บ้านโพธิ์"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      จังหวัด <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.requester_province}
                      onChange={(e) => handleInputChange('requester_province', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="ฉะเชิงเทรา"
                      required
                    />
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <Phone className="text-purple-600" size={16} /> เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.requester_phone}
                      onChange={(e) => handleInputChange('requester_phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="เบอร์โทรศัพท์"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      รหัสไปรษณีย์
                    </label>
                    <input
                      type="text"
                      value={formData.requester_postal_code}
                      onChange={(e) => handleInputChange('requester_postal_code', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="รหัสไปรษณีย์"
                    />
                  </div>
                </div>
              </div>

              {/* Request Details */}
              <div className="bg-white border-2 border-gray-100 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FileText className="text-purple-600" size={20} /> รายละเอียดคำร้อง
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    รายละเอียดคำร้อง <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.request_details}
                    onChange={(e) => handleInputChange('request_details', e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="กรุณาระบุรายละเอียดคำร้องของท่าน เช่น ปัญหาที่พบ สิ่งที่ต้องการให้ช่วยเหลือ หรือข้อเสนอแนะต่างๆ"
                    required
                  />
                </div>
              </div>

              {/* File Attachments */}
              <div className="bg-white border-2 border-gray-100 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FileText className="text-purple-600" size={20} /> เอกสารประกอบ
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">เอกสารประกอบ 1</label>
                      <input
                        type="file"
                        onChange={(e) => handleFileUpload('document_1', e.target.files[0])}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        disabled={uploading}
                      />
                      <p className="text-xs text-gray-500 mt-1">รองรับไฟล์: PDF, JPG, PNG, DOC, DOCX</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">เอกสารประกอบ 2</label>
                      <input
                        type="file"
                        onChange={(e) => handleFileUpload('document_2', e.target.files[0])}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        disabled={uploading}
                      />
                      <p className="text-xs text-gray-500 mt-1">รองรับไฟล์: PDF, JPG, PNG, DOC, DOCX</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">เอกสารประกอบ 3</label>
                      <input
                        type="file"
                        onChange={(e) => handleFileUpload('document_3', e.target.files[0])}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        disabled={uploading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">เอกสารอื่นๆ 1</label>
                      <input
                        type="file"
                        onChange={(e) => handleFileUpload('other_document_1', e.target.files[0])}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        disabled={uploading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">เอกสารอื่นๆ 2</label>
                      <input
                        type="file"
                        onChange={(e) => handleFileUpload('other_document_2', e.target.files[0])}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        disabled={uploading}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="text-yellow-400" size={20} />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-yellow-800">หมายเหตุสำคัญ</h4>
                    <div className="mt-2 text-sm text-yellow-700">
                      <ul className="list-disc list-inside space-y-1">
                        <li>ข้อที่มีเครื่องหมาย * จะต้องกรอกให้ครบ หากไม่กรอกจะไม่สามารถส่งข้อมูลได้</li>
                        <li>กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนส่งคำร้อง</li>
                        <li>เจ้าหน้าที่จะติดต่อกลับภายใน 3-5 วันทำการ</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Captcha */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <label className="text-sm font-medium text-gray-700">
                    ป้อนรหัสตัวเลข: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.captcha_answer}
                    onChange={(e) => handleInputChange('captcha_answer', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-24"
                    placeholder="รหัส"
                    required
                  />
                  <div className="bg-white border-2 border-gray-300 px-4 py-2 rounded-lg font-mono text-red-600 font-bold text-lg">
                    {captcha}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setCaptcha(generateCaptcha())}
                    className="bg-purple-100 hover:bg-purple-200 px-3 py-2 rounded-lg text-purple-600 font-medium transition-colors flex items-center gap-1"
                  >
                    <RefreshCcw className="text-purple-600" size={16} /> รีเฟรช
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                    submitting || uploading
                      ? 'bg-gray-400 cursor-not-allowed text-white' 
                      : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  }`}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      กำลังส่งคำร้อง...
                    </span>
                  ) : uploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      กำลังอัปโหลดไฟล์...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Send className="text-white" size={18} /> ส่งคำร้องทั่วไป
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Information */}
        <div className="mt-8">
          <div className="bg-white bg-opacity-90 rounded-2xl shadow-md p-6 backdrop-blur-sm text-center">
            <h4 className="text-lg font-semibold text-[#01385f] mb-2">
              คำร้องทั่วไป
            </h4>
            <p className="text-gray-600 text-sm">
              เทศบาลตำบลบ้านโพธิ์ พร้อมให้บริการและรับฟังความคิดเห็นจากประชาชนทุกเรื่อง
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}