"use client";
import { useState } from "react";
import {
  User,
  Home,
  Phone,
  FileText,
  AlertCircle,
  RefreshCcw,
  Send,
  Shield,
} from "lucide-react";

export default function CorruptionComplaintForm() {
  const [formData, setFormData] = useState({
    day: "31",
    month: "กรกฎาคม",
    year: "2568",
    // ข้อมูลผู้ร้องเรียน
    complainantName: "",
    complainantIdCard: "",
    complainantAddress: "",
    complainantAge: "",
    complainantPhone: "",
    // ข้อมูลผู้ถูกร้องเรียน
    accusedName: "",
    accusedPosition: "",
    accusedAgency: "",
    accusedProvince: "",
    complaintDetails: "",
    attachments: [],
    captcha: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [captchaValue, setCaptchaValue] = useState("257991");
  const [errors, setErrors] = useState({});

  const thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  const provinces = [
    "กรุงเทพมหานคร",
    "กระบี่",
    "กาญจนบุรี",
    "กาฬสินธุ์",
    "กำแพงเพชร",
    "ขอนแก่น",
    "จันทบุรี",
    "ฉะเชิงเทรา",
    "ชลบุรี",
    "ชัยนาท",
    "ชัยภูมิ",
    "ชุมพร",
    "เชียงราย",
    "เชียงใหม่",
    "ตรัง",
    "ตราด",
    "ตาก",
    "นครนายก",
    "นครปฐม",
    "นครพนม",
    "นครราชสีมา",
    "นครศรีธรรมราช",
    "นครสวรรค์",
    "นนทบุรี",
    "นราธิวาส",
    "น่าน",
    "บึงกาฬ",
    "บุรีรัมย์",
    "ปทุมธานี",
    "ประจวบคีรีขันธ์",
    "ปราจีนบุรี",
    "ปัตตานี",
    "พระนครศรีอยุธยา",
    "พังงา",
    "พัทลุง",
    "พิจิตร",
    "พิษณุโลก",
    "เพชรบุรี",
    "เพชรบูรณ์",
    "แพร่",
    "ภูเก็ต",
    "มหาสารคาม",
    "มุกดาหาร",
    "แม่ฮ่องสอน",
    "ยะลา",
    "ยโสธร",
    "ร้อยเอ็ด",
    "ระนอง",
    "ระยอง",
    "ราชบุรี",
    "ลพบุรี",
    "ลำปาง",
    "ลำพูน",
    "เลย",
    "ศรีสะเกษ",
    "สกลนคร",
    "สงขลา",
    "สตูล",
    "สมุทรปราการ",
    "สมุทรสงคราม",
    "สมุทรสาคร",
    "สระแก้ว",
    "สระบุรี",
    "สิงห์บุรี",
    "สุโขทัย",
    "สุพรรณบุรี",
    "สุราษฎร์ธานี",
    "สุรินทร์",
    "หนองคาย",
    "หนองบัวลำภู",
    "อ่างทอง",
    "อำนาจเจริญ",
    "อุดรธานี",
    "อุตรดิตถ์",
    "อุทัยธานี",
    "อุบลราชธานี",
  ];

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 10 }, (_, i) => 2568 + i);

  const refreshCaptcha = () => {
    const newCaptcha = Math.floor(100000 + Math.random() * 900000).toString();
    setCaptchaValue(newCaptcha);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // ข้อมูลผู้ร้องเรียน
    if (!formData.complainantName)
      newErrors.complainantName = "กรุณากรอกชื่อ-นามสกุล";
    if (!formData.complainantIdCard)
      newErrors.complainantIdCard = "กรุณากรอกเลขบัตรประชาชน";
    if (!formData.complainantAddress)
      newErrors.complainantAddress = "กรุณากรอกที่อยู่";
    if (!formData.complainantAge) newErrors.complainantAge = "กรุณากรอกอายุ";
    if (!formData.complainantPhone)
      newErrors.complainantPhone = "กรุณากรอกเบอร์โทรศัพท์";

    // ข้อมูลผู้ถูกร้องเรียน
    if (!formData.accusedName)
      newErrors.accusedName = "กรุณากรอกชื่อ-นามสกุลผู้ถูกร้องเรียน";
    if (!formData.accusedPosition)
      newErrors.accusedPosition = "กรุณากรอกตำแหน่ง";
    if (!formData.accusedAgency)
      newErrors.accusedAgency = "กรุณากรอกสังกัดหน่วยงาน";
    if (!formData.accusedProvince)
      newErrors.accusedProvince = "กรุณาเลือกจังหวัด";

    if (!formData.complaintDetails)
      newErrors.complaintDetails = "กรุณากรอกรายละเอียดการร้องเรียน";
    if (!formData.captcha) newErrors.captcha = "กรุณาป้อนรหัสตัวเลข";
    else if (formData.captcha !== captchaValue)
      newErrors.captcha = "รหัสตัวเลขไม่ถูกต้อง";

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
      let uploadedFiles = [];
      
      // Upload files if any
      if (formData.attachments && formData.attachments.length > 0) {
        try {
          // Validate files
          for (const file of formData.attachments) {
            if (file.size > 5 * 1024 * 1024) {
              throw new Error(`ไฟล์ ${file.name} มีขนาดใหญ่เกินไป (ขนาดสูงสุด 5MB)`);
            }
          }

          // Upload each file
          for (const file of formData.attachments) {
            const fileFormData = new FormData();
            fileFormData.append('file', file);

            const uploadResponse = await fetch('https://banpho.sosmartsolution.com/api/upload-file', {
              method: 'POST',
              body: fileFormData
            });

            const uploadResult = await uploadResponse.json();

            if (uploadResponse.ok && uploadResult.success) {
              const fullUrl = uploadResult.file_url || uploadResult.url;
              const path = fullUrl.replace('https://banpho.sosmartsolution.com/storage/', '');
              
              uploadedFiles.push({
                name: file.name,
                path: path,
                type: file.name.split('.').pop().toLowerCase(),
                size: file.size
              });
            }
          }
        } catch (uploadError) {
          throw new Error('เกิดข้อผิดพลาดในการอัปโหลดไฟล์: ' + uploadError.message);
        }
      }

      // Submit complaint with file paths
      const complaintData = {
        ...formData,
        attachments: uploadedFiles
      };

      const response = await fetch("/api/corruption-complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(complaintData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitSuccess(true);
        setFormData({
          day: "31",
          month: "กรกฎาคม",
          year: "2568",
          complainantName: "",
          complainantIdCard: "",
          complainantAddress: "",
          complainantAge: "",
          complainantPhone: "",
          accusedName: "",
          accusedPosition: "",
          accusedAgency: "",
          accusedProvince: "",
          complaintDetails: "",
          attachments: [],
          captcha: "",
        });

        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      } else {
        throw new Error(result.error || "เกิดข้อผิดพลาดในการส่งคำร้องเรียน");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("เกิดข้อผิดพลาด: " + error.message);
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
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="w-full max-w-[800px] mt-20">
          <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm text-center">
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              ส่งคำร้องเรียนสำเร็จ!
            </h2>
            <p className="text-gray-600 mb-4">
              คำร้องเรียนการทุจริตและประพฤติมิชอบของคุณได้รับการบันทึกเรียบร้อยแล้ว
            </p>
            <p className="text-sm text-gray-500">
              เจ้าหน้าที่จะดำเนินการตรวจสอบและติดต่อกลับภายใน 7-15 วันทำการ
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
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Header Section */}
      <div className="w-full max-w-[1268px] flex flex-col gap-4 mb-8">
        <div className="bg-gradient-to-r from-[#dc2626] to-[#b91c1c] rounded-[36px] shadow-lg w-full flex flex-col md:flex-row items-center px-6 py-6 relative backdrop-blur-sm">
          <div className="bg-white rounded-full shadow-md w-32 h-16 flex items-center justify-center mb-4 md:mb-0 md:absolute md:left-6 md:top-1/2 md:-translate-y-1/2 border-2 border-[#dc2626]">
            <Shield className="text-[#dc2626]" size={32} />
          </div>
          <div className="flex-1 flex flex-wrap flex-row items-center justify-center gap-6 md:gap-12 md:ml-40">
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              ช่องทางแจ้งเรื่องร้องเรียน
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              การทุจริตและประพฤติมิชอบ
            </span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[800px]">
        {/* Form Container */}
        <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg backdrop-blur-sm overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white text-center">
            <h1 className="text-2xl font-bold mb-2">
              ช่องทางแจ้งเรื่องร้องเรียนการทุจริตและประพฤติมิชอบ
            </h1>
            <p className="text-red-100">กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง</p>
          </div>

          {/* Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date Section */}
              <div className="bg-gray-50 rounded-lg p-4 text-right">
                <div className="flex items-center justify-end gap-2 text-sm flex-wrap">
                  <span className="font-medium">วันที่</span>
                  <select
                    value={formData.day}
                    onChange={(e) => handleInputChange("day", e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                  <select
                    value={formData.month}
                    onChange={(e) => handleInputChange("month", e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    {thaiMonths.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <select
                    value={formData.year}
                    onChange={(e) => handleInputChange("year", e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Complainant Information */}
              <div className="bg-white border-2 border-gray-100 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2 text-center w-full justify-center">
                  <User className="text-red-600" size={20} /> ข้อมูลผู้ร้องเรียน
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ชื่อ-นามสกุล <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.complainantName}
                      onChange={(e) =>
                        handleInputChange("complainantName", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.complainantName
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="กรอกชื่อ-นามสกุล"
                    />
                    {errors.complainantName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.complainantName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      เลขบัตรประชาชน <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.complainantIdCard}
                      onChange={(e) =>
                        handleInputChange("complainantIdCard", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.complainantIdCard
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="เช่น 1234567890123"
                      maxLength="13"
                    />
                    {errors.complainantIdCard && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.complainantIdCard}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ที่อยู่ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.complainantAddress}
                      onChange={(e) =>
                        handleInputChange("complainantAddress", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.complainantAddress
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="บ้านเลขที่ ตำบล อำเภอ จังหวัด รหัสไปรษณีย์"
                    />
                    {errors.complainantAddress && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.complainantAddress}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      อายุ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.complainantAge}
                      onChange={(e) =>
                        handleInputChange("complainantAge", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.complainantAge
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="อายุ (ปี)"
                      min="1"
                      max="120"
                    />
                    {errors.complainantAge && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.complainantAge}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.complainantPhone}
                      onChange={(e) =>
                        handleInputChange("complainantPhone", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.complainantPhone
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="เบอร์โทรศัพท์"
                    />
                    {errors.complainantPhone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.complainantPhone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Accused Information */}
              <div className="bg-white border-2 border-gray-100 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2 text-center w-full justify-center">
                  <Shield className="text-red-600" size={20} />{" "}
                  ข้อมูลผู้ถูกร้องเรียน
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ชื่อ-นามสกุล <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.accusedName}
                      onChange={(e) =>
                        handleInputChange("accusedName", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.accusedName
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="ชื่อ-นามสกุลผู้ถูกร้องเรียน"
                    />
                    {errors.accusedName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.accusedName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ตำแหน่ง <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.accusedPosition}
                      onChange={(e) =>
                        handleInputChange("accusedPosition", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.accusedPosition
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="ตำแหน่งงาน"
                    />
                    {errors.accusedPosition && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.accusedPosition}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      สังกัดหน่วยงาน <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.accusedAgency}
                      onChange={(e) =>
                        handleInputChange("accusedAgency", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.accusedAgency
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="หน่วยงานที่สังกัด"
                    />
                    {errors.accusedAgency && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.accusedAgency}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      จังหวัด <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.accusedProvince}
                      onChange={(e) =>
                        handleInputChange("accusedProvince", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.accusedProvince
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">
                        ---เลือกจังหวัด/สถานที่ตั้งหน่วยงาน---
                      </option>
                      {provinces.map((province) => (
                        <option key={province} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>
                    {errors.accusedProvince && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.accusedProvince}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Complaint Details */}
              <div className="bg-white border-2 border-gray-100 rounded-lg p-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    รายละเอียด <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.complaintDetails}
                    onChange={(e) =>
                      handleInputChange("complaintDetails", e.target.value)
                    }
                    rows={8}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                      errors.complaintDetails
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="กรุณาระบุรายละเอียดการทุจริตหรือประพฤติมิชอบที่พบ ให้ชัดเจนและครบถ้วน"
                  />
                  {errors.complaintDetails && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.complaintDetails}
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ไฟล์หลักฐาน (ถ้ามี)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) => handleInputChange('attachments', Array.from(e.target.files))}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      รองรับไฟล์: PDF, JPG, PNG, DOC, DOCX (ขนาดไม่เกิน 5MB ต่อไฟล์)
                    </p>
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
                    <div className="text-sm text-yellow-700">
                      <ol className="list-decimal list-inside space-y-1">
                        <li>กรุณาป้อนข้อมูล * ให้ครบถ้วนก่อน</li>
                        <li>
                          กรุณาใช้คำที่สุภาพและไม่เป็นการหมิ่นประมาท
                          ใส่รายละเอียดให้ชัดเจน
                        </li>
                        <li>
                          ทางทีมงานขอสงวนสิทธิ์ในการลบข้อความไม่เหมาะสมโดยไม่แจ้งให้ทราบล่วงหน้า
                        </li>
                      </ol>
                      <p className="mt-2 font-medium">
                        **รายละเอียดและข้อมูลจะถูกเก็บเป็นความลับและยอมรับเงื่อนไขข้อ
                        (กรุณาอ่านให้เพื่อนอ่าน)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Captcha */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <label className="text-sm font-medium text-gray-700">
                    ป้อนรหัสยืนยัน: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.captcha}
                    onChange={(e) =>
                      handleInputChange("captcha", e.target.value)
                    }
                    className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent w-24 ${
                      errors.captcha ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="รหัส"
                  />
                  <div className="bg-white border-2 border-gray-300 px-4 py-2 rounded-lg font-mono text-red-600 font-bold text-lg">
                    {captchaValue}
                  </div>
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="bg-red-100 hover:bg-red-200 px-3 py-2 rounded-lg text-red-600 font-medium transition-colors flex items-center gap-1"
                  >
                    <RefreshCcw className="text-red-600" size={16} />
                  </button>
                </div>
                {errors.captcha && (
                  <p className="text-red-500 text-sm mt-1">{errors.captcha}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      กำลังส่งคำร้องเรียน...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Send className="text-white" size={18} /> ยื่นคำ
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
            <h4 className="text-lg font-semibold text-[#dc2626] mb-2">
              ช่องทางแจ้งเรื่องร้องเรียนการทุจริตและประพฤติมิชอบ
            </h4>
            <p className="text-gray-600 text-sm">
              เทศบาลตำบลบ้านโพธิ์
              มุ่งมั่นสร้างความโปร่งใสและป้องกันการทุจริตในองค์กร
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
