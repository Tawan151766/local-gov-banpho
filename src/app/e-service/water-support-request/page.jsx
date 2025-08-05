"use client";
import { useState } from "react";
import {  User, Home, Phone, Users, FileText, AlertCircle, RefreshCcw, Send, Waves } from "lucide-react";
import { waterSupportRequestsAPI } from "@/lib/api";

export default function WaterSupportRequestForm() {
  const [formData, setFormData] = useState({
    day: '31',
    month: 'กรกฎาคม',
    year: '2568',
    gender: '',
    requesterName: '',
    requesterAge: '',
    houseNumber: '',
    village: '',
    subDistrict: 'ตำบลบ้านโพธิ์',
    district: 'อำเภอบ้านโพธิ์',
    province: 'จังหวัดฉะเชิงเทรา',
    phone: '',
    familyMembers: '',
    needsWater: '',
    symptoms: '',
    requester_id_card: '',
    captcha: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [captchaValue, setCaptchaValue] = useState("681673");
  const [errors, setErrors] = useState({});

  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 10 }, (_, i) => 2568 + i);

  const refreshCaptcha = () => {
    const newCaptcha = Math.floor(100000 + Math.random() * 900000).toString();
    setCaptchaValue(newCaptcha);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Clear submit error when user makes changes
    if (errors.submit) {
      setErrors(prev => ({
        ...prev,
        submit: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.gender) newErrors.gender = 'กรุณาเลือกคำนำหน้า';
    if (!formData.requesterName) newErrors.requesterName = 'กรุณากรอกชื่อ-นามสกุล';
    if (!formData.houseNumber) newErrors.houseNumber = 'กรุณากรอกเลขที่บ้าน';
    if (!formData.village) newErrors.village = 'กรุณากรอกหมู่ที่';
    if (!formData.needsWater) newErrors.needsWater = 'กรุณาระบุความต้องการใช้น้ำ';
    if (!formData.symptoms) newErrors.symptoms = 'กรุณาระบุอาการและประเภท';
    if (!formData.requester_id_card) newErrors.requester_id_card = 'กรุณากรอกเลขบัตรประชาชน';
    else if (formData.requester_id_card.length !== 13) newErrors.requester_id_card = 'เลขบัตรประชาชนต้องมี 13 หลัก';
    if (!formData.captcha) newErrors.captcha = 'กรุณาป้อนรหัสตัวเลข';
    else if (formData.captcha !== captchaValue) newErrors.captcha = 'รหัสตัวเลขไม่ถูกต้อง';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare form data for API
      const requestData = {
        request_date: `${formData.year}-${String(
          thaiMonths.indexOf(formData.month) + 1
        ).padStart(2, "0")}-${String(formData.day).padStart(2, "0")}`,
        requester_title: formData.gender || null,
        requester_name: formData.requesterName || null,
        requester_age: formData.requesterAge ? parseInt(formData.requesterAge) : null,
        requester_house_number: formData.houseNumber || null,
        requester_village: formData.village || null,
        requester_subdistrict: formData.subDistrict || "ตำบลบ้านโพธิ์",
        requester_district: formData.district || "อำเภอบ้านโพธิ์",
        requester_province: formData.province || "จังหวัดฉะเชิงเทรา",
        requester_phone: formData.phone || null,
        family_members: formData.familyMembers ? parseInt(formData.familyMembers) : null,
        water_needs: formData.needsWater || null,
        symptoms_description: formData.symptoms || null,
        requester_id_card: formData.requester_id_card || null,
        captcha_answer: formData.captcha || null,
        ip_address: null, // Will be set by server
        user_agent: navigator.userAgent || null,
      };

      console.log("Submitting water support request:", requestData);

      const result = await waterSupportRequestsAPI.createRequest(requestData);

      if (!result.success) {
        throw new Error(result.error || "Failed to submit request");
      }

      console.log("Water support request submitted successfully:", result);
      
      setSubmitSuccess(true);
      
      // Reset form
      setFormData({
        day: '31',
        month: 'กรกฎาคม',
        year: '2568',
        gender: '',
        requesterName: '',
        requesterAge: '',
        houseNumber: '',
        village: '',
        subDistrict: 'ตำบลบ้านโพธิ์',
        district: 'อำเภอบ้านโพธิ์',
        province: 'จังหวัดฉะเชิงเทรา',
        phone: '',
        familyMembers: '',
        needsWater: '',
        symptoms: '',
        requester_id_card: '',
        captcha: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error submitting water support request:", error);
      setErrors((prev) => ({
        ...prev,
        submit:
          error.message || "เกิดข้อผิดพลาดในการส่งคำร้อง กรุณาลองใหม่อีกครั้ง",
      }));
    } finally {
      setIsSubmitting(false);
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
              คำร้องขอสนับสนุนน้ำอุปโภค-บริโภคของคุณได้รับการบันทึกเรียบร้อยแล้ว
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-green-800 mb-2">
                ขั้นตอนต่อไป:
              </h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• เจ้าหน้าที่จะตรวจสอบข้อมูลและสำรวจพื้นที่</li>
                <li>• ติดต่อกลับภายใน 3-5 วันทำการ</li>
                <li>• ดำเนินการจัดหาน้ำตามความเหมาะสม</li>
              </ul>
            </div>
            <p className="text-sm text-gray-500">
              หากมีข้อสงสัยเพิ่มเติม กรุณาติดต่อเทศบาลตำบลบ้านโพธิ์
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
            <Waves className="text-[#01bdcc]" size={32} />
            <span className="text-[#01385f] font-bold text-lg tracking-wide ml-2">
              น้ำ
            </span>
          </div>
          <div className="flex-1 flex flex-wrap flex-row items-center justify-center gap-6 md:gap-12 md:ml-40">
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              คำร้องขอสนับสนุน
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              น้ำอุปโภค-บริโภค
            </span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[800px]">
        {/* Form Container */}
        <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg backdrop-blur-sm overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white text-center">
            <h1 className="text-2xl font-bold mb-2">
              แบบคำร้องขอสนับสนุนน้ำอุปโภค-บริโภค
            </h1>
            <p className="text-blue-100">
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
                    value={formData.day}
                    onChange={(e) => handleInputChange('day', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {days.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  <select
                    value={formData.month}
                    onChange={(e) => handleInputChange('month', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {thaiMonths.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                  <select
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                <p className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                  <FileText className="text-blue-600" size={18} /> เรื่อง: ขอความอนุเคราะห์สนับสนุนน้ำอุปโภค-บริโภค
                </p>
                <p className="text-gray-700 flex items-center gap-2">
                  <User className="text-blue-600" size={18} /> เรียน: นายกเทศมนตรีตำบลบ้านโพธิ์
                </p>
              </div>

              {/* Personal Information */}
              <div className="bg-white border-2 border-gray-100 rounded-lg p-4 text-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <User className="text-blue-600" size={20} /> ข้อมูลผู้ยื่นคำร้อง
                </h3>

                {/* Gender Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ข้าพเจ้า <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4 flex-wrap">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="นาย"
                        checked={formData.gender === 'นาย'}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>นาย</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="นาง"
                        checked={formData.gender === 'นาง'}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>นาง</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="นางสาว"
                        checked={formData.gender === 'นางสาว'}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>นางสาว</span>
                    </label>
                  </div>
                  {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                </div>

                {/* Name and Age */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ชื่อ-นามสกุล <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.requesterName}
                      onChange={(e) => handleInputChange('requesterName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.requesterName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="ชื่อ-นามสกุล"
                    />
                    {errors.requesterName && <p className="text-red-500 text-sm mt-1">{errors.requesterName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      อายุ
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={formData.requesterAge}
                        onChange={(e) => handleInputChange('requesterAge', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="อายุ"
                        min="1"
                        max="120"
                      />
                      <span className="text-sm text-gray-600">ปี</span>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <Home className="text-blue-600" size={16} /> อยู่บ้านเลขที่ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.houseNumber}
                      onChange={(e) => handleInputChange('houseNumber', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.houseNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="เลขที่บ้าน"
                    />
                    {errors.houseNumber && <p className="text-red-500 text-sm mt-1">{errors.houseNumber}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      หมู่ที่ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.village}
                      onChange={(e) => handleInputChange('village', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.village ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="หมู่ที่"
                    />
                    {errors.village && <p className="text-red-500 text-sm mt-1">{errors.village}</p>}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">📍 ที่อยู่:</span> ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา
                  </p>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <Phone className="text-blue-600" size={16} /> หมายเลขโทรศัพท์
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="เบอร์โทรศัพท์"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <Users className="text-blue-600" size={16} /> จำนวนสมาชิกในครัวเรือน
                    </label>
                    <input
                      type="number"
                      value={formData.familyMembers}
                      onChange={(e) => handleInputChange('familyMembers', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="จำนวนคน"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      เลขบัตรประชาชน <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.requester_id_card}
                      onChange={(e) => handleInputChange('requester_id_card', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.requester_id_card ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="เลขบัตรประชาชน 13 หลัก"
                      maxLength={13}
                    />
                    {errors.requester_id_card && <p className="text-red-500 text-sm mt-1">{errors.requester_id_card}</p>}
                  </div>
                </div>
              </div>

              {/* Request Details */}
              <div className="bg-white border-2 border-gray-100 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Waves className="text-blue-600" size={20} /> รายละเอียดคำร้อง
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    มีความประสงค์ขอใช้น้ำที่ <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.needsWater}
                    onChange={(e) => handleInputChange('needsWater', e.target.value)}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.needsWater ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="กรุณาระบุความต้องการใช้น้ำ เช่น น้ำอุปโภค น้ำบริโภค หรือทั้งสองอย่าง และจุดที่ต้องการติดตั้ง"
                  />
                  {errors.needsWater && <p className="text-red-500 text-sm mt-1">{errors.needsWater}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex flex-col gap-1">
                      <span>หมายเหตุ/อาการที่ทราบ <span className="text-red-500">*</span></span>
                      <span className="text-xs text-gray-500 font-normal">
                        (ระบุประเภท เช่น ดิน, โดน, แกง และอาการต่างๆ)
                      </span>
                    </div>
                  </label>
                  <textarea
                    value={formData.symptoms}
                    onChange={(e) => handleInputChange('symptoms', e.target.value)}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.symptoms ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="กรุณาระบุอาการและประเภทของดิน หรือสภาพปัญหาที่พบ"
                  />
                  {errors.symptoms && <p className="text-red-500 text-sm mt-1">{errors.symptoms}</p>}
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
                        <li>โดยชอบจริงรองท่านพิจารณาความเชื่อถือได้ของการจัดหาน้ำอุปโภค-บริโภค</li>
                        <li>ข้าพเจ้าได้อ่านและเข้าใจเงื่อนไขการให้บริการแล้ว</li>
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
                    value={formData.captcha}
                    onChange={(e) => handleInputChange('captcha', e.target.value)}
                    className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-24 ${
                      errors.captcha ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="รหัส"
                  />
                  <div className="bg-white border-2 border-gray-300 px-4 py-2 rounded-lg font-mono text-red-600 font-bold text-lg">
                    {captchaValue}
                  </div>
                  <button 
                    type="button" 
                    onClick={refreshCaptcha}
                    className="bg-blue-100 hover:bg-blue-200 px-3 py-2 rounded-lg text-blue-600 font-medium transition-colors flex items-center gap-1"
                  >
                    <RefreshCcw className="text-blue-600" size={16} /> รีเฟรช
                  </button>
                </div>
                {errors.captcha && <p className="text-red-500 text-sm mt-1">{errors.captcha}</p>}
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="text-red-400" size={20} />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{errors.submit}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed text-white' 
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      กำลังส่งคำร้อง...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Send className="text-white" size={18} /> ส่งคำร้องขอสนับสนุนน้ำ
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
              คำร้องขอสนับสนุนน้ำอุปโภค-บริโภค
            </h4>
            <p className="text-gray-600 text-sm">
              เทศบาลตำบลบ้านโพธิ์ มุ่งมั่นให้บริการน้ำสะอาดแก่ประชาชนอย่างทั่วถึงและยั่งยืน
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}