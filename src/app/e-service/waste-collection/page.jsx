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
  Trash2,
} from "lucide-react";
import { wasteCollectionRequestsAPI } from "@/lib/api";

export default function WasteCollectionForm() {
  const [formData, setFormData] = useState({
    day: "1",
    month: "สิงหาคม",
    year: "2568",
    // ข้อมูลผู้ยื่นคำร้อง
    requesterTitle: "นาย",
    requesterName: "",
    requesterIdCard: "",
    requesterAge: "",
    requesterHouseNumber: "",
    requesterVillage: "",
    requesterSubdistrict: "ตำบลบ้านโพธิ์",
    requesterDistrict: "อำเภอบ้านโพธิ์", 
    requesterProvince: "จังหวัดฉะเชิงเทรา",
    requesterPhone: "",
    // ประเภทขยะที่ต้องการให้จัดเก็บ
    wasteTypes: {
      household: false,
      rental: false,
      shop: false,
      factory: false,
    },
    otherWasteType: "",
    // ข้อมูลสถานที่จัดเก็บ
    collectionDetails: "",
    // เหตุผลความจำเป็น
    reasonForRequest: "",
    captcha: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [captchaValue, setCaptchaValue] = useState("114356");
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

    // Clear submit error when user makes changes
    if (errors.submit) {
      setErrors((prev) => ({
        ...prev,
        submit: "",
      }));
    }
  };

  const handleWasteTypeChange = (type, checked) => {
    setFormData((prev) => ({
      ...prev,
      wasteTypes: {
        ...prev.wasteTypes,
        [type]: checked,
      },
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // ข้อมูลผู้ยื่นคำร้อง
    if (!formData.requesterName)
      newErrors.requesterName = "กรุณากรอกชื่อ-นามสกุล";
    if (!formData.requesterIdCard)
      newErrors.requesterIdCard = "กรุณากรอกเลขบัตรประชาชน";
    else if (formData.requesterIdCard.length !== 13)
      newErrors.requesterIdCard = "เลขบัตรประชาชนต้องมี 13 หลัก";
    if (!formData.requesterAge) 
      newErrors.requesterAge = "กรุณากรอกอายุ";
    if (!formData.requesterHouseNumber)
      newErrors.requesterHouseNumber = "กรุณากรอกเลขที่บ้าน";
    if (!formData.requesterVillage)
      newErrors.requesterVillage = "กรุณากรอกหมู่ที่";

    // ตรวจสอบว่าเลือกประเภทขยะอย่างน้อย 1 ประเภท
    const hasSelectedWasteType = Object.values(formData.wasteTypes).some(Boolean);
    if (!hasSelectedWasteType) {
      newErrors.wasteTypes = "กรุณาเลือกประเภทขยะที่ต้องการให้จัดเก็บ";
    }

    if (!formData.collectionDetails)
      newErrors.collectionDetails = "กรุณาระบุรายละเอียดสถานที่จัดเก็บ";
    if (!formData.reasonForRequest)
      newErrors.reasonForRequest = "กรุณาระบุเหตุผลความจำเป็น";
    if (!formData.captcha) 
      newErrors.captcha = "กรุณาป้อนรหัสตัวเลข";
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
      // Prepare form data for API
      const requestData = {
        request_date: `${formData.year}-${String(
          thaiMonths.indexOf(formData.month) + 1
        ).padStart(2, "0")}-${String(formData.day).padStart(2, "0")}`,
        requester_title: formData.requesterTitle || null,
        requester_name: formData.requesterName || null,
        requester_id_card: formData.requesterIdCard || null,
        requester_age: formData.requesterAge ? parseInt(formData.requesterAge) : null,
        requester_house_number: formData.requesterHouseNumber || null,
        requester_village: formData.requesterVillage || null,
        requester_subdistrict: formData.requesterSubdistrict || "ตำบลบ้านโพธิ์",
        requester_district: formData.requesterDistrict || "อำเภอบ้านโพธิ์",
        requester_province: formData.requesterProvince || "จังหวัดฉะเชิงเทรา",
        requester_phone: formData.requesterPhone || null,
        waste_type_household: formData.wasteTypes.household ? 1 : 0,
        waste_type_rental: formData.wasteTypes.rental ? 1 : 0,
        waste_type_shop: formData.wasteTypes.shop ? 1 : 0,
        waste_type_factory: formData.wasteTypes.factory ? 1 : 0,
        other_waste_type: formData.otherWasteType || null,
        collection_details: formData.collectionDetails || null,
        reason_for_request: formData.reasonForRequest || null,
        captcha_answer: formData.captcha || null,
        ip_address: null, // Will be set by server
        user_agent: navigator.userAgent || null,
      };

      console.log("Submitting waste collection request:", requestData);

      const result = await wasteCollectionRequestsAPI.createRequest(requestData);

      if (!result.success) {
        throw new Error(result.error || "Failed to submit request");
      }

      console.log("Waste collection request submitted successfully:", result);
      
      setSubmitSuccess(true);
      
      // Reset form
      setFormData({
        day: "1",
        month: "สิงหาคม",
        year: "2568",
        requesterTitle: "นาย",
        requesterName: "",
        requesterIdCard: "",
        requesterAge: "",
        requesterHouseNumber: "",
        requesterVillage: "",
        requesterSubdistrict: "ตำบลบ้านโพธิ์",
        requesterDistrict: "อำเภอบ้านโพธิ์", 
        requesterProvince: "จังหวัดฉะเชิงเทรา",
        requesterPhone: "",
        wasteTypes: {
          household: false,
          rental: false,
          shop: false,
          factory: false,
        },
        otherWasteType: "",
        collectionDetails: "",
        reasonForRequest: "",
        captcha: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error submitting waste collection request:", error);
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
              ส่งคำร้องสำเร็จ!
            </h2>
            <p className="text-gray-600 mb-4">
              คำร้องขอรับบริการจัดเก็บขยะของคุณได้รับการบันทึกเรียบร้อยแล้ว
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-green-800 mb-2">
                ขั้นตอนต่อไป:
              </h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• เจ้าหน้าที่จะตรวจสอบข้อมูลและสถานที่</li>
                <li>• ติดต่อกลับภายใน 3-5 วันทำการ</li>
                <li>• จัดเก็บขยะตามรายละเอียดที่ระบุไว้</li>
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
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Header Section */}
      <div className="w-full max-w-[1268px] flex flex-col gap-4 mb-8">
        <div className="bg-gradient-to-r from-[#03bdca] to-[#01bdcc] rounded-[36px] shadow-lg w-full flex flex-col md:flex-row items-center px-6 py-6 relative backdrop-blur-sm">
          <div className="bg-white rounded-full shadow-md w-32 h-16 flex items-center justify-center mb-4 md:mb-0 md:absolute md:left-6 md:top-1/2 md:-translate-y-1/2 border-2 border-[#01bdcc]">
            <Trash2 className="text-[#01bdcc]" size={32} />
            <span className="text-[#01385f] font-bold text-lg tracking-wide ml-2">
              จัดเก็บ
            </span>
          </div>
          <div className="flex-1 flex flex-wrap flex-row items-center justify-center gap-6 md:gap-12 md:ml-40">
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              คำร้องขอรับบริการ
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              จัดเก็บขยะ
            </span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[800px]">
        {/* Form Container */}
        <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg backdrop-blur-sm overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white text-center">
            <h1 className="text-2xl font-bold mb-2">
              แบบฟอร์ม ขอรับบริการจัดเก็บขยะ
            </h1>
            <p className="text-orange-100">กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง</p>
          </div>

          {/* Form */}
          <div className="p-6 text-gray-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date Section */}
              <div className="bg-gray-50 rounded-lg p-4 text-right">
                <div className="flex items-center justify-end gap-2 text-sm flex-wrap">
                  <span className="font-medium">วันที่</span>
                  <select
                    value={formData.day}
                    onChange={(e) => handleInputChange("day", e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
                <p className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                  <FileText className="text-orange-600" size={18} /> เรียน นายกเทศมนตรีตำบลบ้านโพธิ์
                </p>
              </div>

              {/* Requester Information */}
              <div className="bg-white border-2 border-gray-100 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-orange-600 mb-4 flex items-center gap-2">
                  <User className="text-orange-600" size={20} /> ข้อมูลผู้ยื่นคำร้อง
                </h3>

                <div className="space-y-4">
                  {/* Title and Name */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm">ด้วยข้าพเจ้า</span>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="title"
                          value="นาย"
                          checked={formData.requesterTitle === 'นาย'}
                          onChange={(e) => handleInputChange('requesterTitle', e.target.value)}
                          className="text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-sm">นาย</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="title"
                          value="นาง"
                          checked={formData.requesterTitle === 'นาง'}
                          onChange={(e) => handleInputChange('requesterTitle', e.target.value)}
                          className="text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-sm">นาง</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="title"
                          value="นางสาว"
                          checked={formData.requesterTitle === 'นางสาว'}
                          onChange={(e) => handleInputChange('requesterTitle', e.target.value)}
                          className="text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-sm">นางสาว</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="title"
                          value="หน่วยงาน"
                          checked={formData.requesterTitle === 'หน่วยงาน'}
                          onChange={(e) => handleInputChange('requesterTitle', e.target.value)}
                          className="text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-sm">หน่วยงาน</span>
                      </label>
                    </div>
                    <span className="text-red-500">*</span>
                    <input
                      type="text"
                      value={formData.requesterName}
                      onChange={(e) => handleInputChange("requesterName", e.target.value)}
                      className={`flex-1 min-w-[200px] px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.requesterName ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="ชื่อ-นามสกุล"
                    />
                  </div>
                  {errors.requesterName && (
                    <p className="text-red-500 text-sm">{errors.requesterName}</p>
                  )}

                  {/* ID Card */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm">เลขบัตรประชาชน</span>
                    <span className="text-red-500">*</span>
                    <input
                      type="text"
                      value={formData.requesterIdCard}
                      onChange={(e) => handleInputChange("requesterIdCard", e.target.value)}
                      className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.requesterIdCard ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="เลขบัตรประชาชน 13 หลัก"
                      maxLength={13}
                    />
                  </div>
                  {errors.requesterIdCard && (
                    <p className="text-red-500 text-sm">{errors.requesterIdCard}</p>
                  )}

                  {/* Age */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm">อายุ</span>
                    <span className="text-red-500">*</span>
                    <input
                      type="number"
                      value={formData.requesterAge}
                      onChange={(e) => handleInputChange("requesterAge", e.target.value)}
                      className={`w-20 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.requesterAge ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="อายุ"
                      min="1"
                      max="120"
                    />
                    <span className="text-sm">ปี</span>
                  </div>
                  {errors.requesterAge && (
                    <p className="text-red-500 text-sm">{errors.requesterAge}</p>
                  )}

                  {/* Address */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm">อยู่บ้านเลขที่</span>
                    <span className="text-red-500">*</span>
                    <input
                      type="text"
                      value={formData.requesterHouseNumber}
                      onChange={(e) => handleInputChange("requesterHouseNumber", e.target.value)}
                      className={`w-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.requesterHouseNumber ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="เลขที่"
                    />
                    <span className="text-sm">หมู่ที่</span>
                    <span className="text-red-500">*</span>
                    <input
                      type="text"
                      value={formData.requesterVillage}
                      onChange={(e) => handleInputChange("requesterVillage", e.target.value)}
                      className={`w-20 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.requesterVillage ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="หมู่"
                    />
                    <span className="text-sm">{formData.requesterSubdistrict} {formData.requesterDistrict} {formData.requesterProvince}</span>
                  </div>
                  {(errors.requesterHouseNumber || errors.requesterVillage) && (
                    <p className="text-red-500 text-sm">
                      {errors.requesterHouseNumber || errors.requesterVillage}
                    </p>
                  )}

                  {/* Phone */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm">เบอร์โทรศัพท์</span>
                    <input
                      type="tel"
                      value={formData.requesterPhone}
                      onChange={(e) => handleInputChange("requesterPhone", e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="เบอร์โทรศัพท์"
                    />
                  </div>
                </div>
              </div>

              {/* Waste Type Selection */}
              <div className="bg-white border-2 border-gray-100 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-orange-600 mb-4 flex items-center gap-2">
                  <Trash2 className="text-orange-600" size={20} /> ประเภทขยะที่ต้องการให้จัดเก็บ
                </h3>

                <div className="space-y-3">
                  <p className="text-sm text-gray-700 mb-3">
                    โปรดติดหน้าช่องว่าง / สถิน <span className="text-red-500">*</span> หน้าข้อความที่ตรงกับประเภทของสถานที่จัดเก็บขยะของท่าน
                  </p>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.wasteTypes.household}
                        onChange={(e) => handleWasteTypeChange('household', e.target.checked)}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm">1. บ้านที่อยู่อาศัย</span>
                    </label>
                    
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.wasteTypes.rental}
                        onChange={(e) => handleWasteTypeChange('rental', e.target.checked)}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm">2. บ้านเจ้า / อาคารให้เช่า</span>
                    </label>
                    
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.wasteTypes.shop}
                        onChange={(e) => handleWasteTypeChange('shop', e.target.checked)}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm">3. ร้านค้า</span>
                    </label>
                    
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.wasteTypes.factory}
                        onChange={(e) => handleWasteTypeChange('factory', e.target.checked)}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm">4. โรงงาน / ประกอบธุรกิจ</span>
                    </label>
                  </div>

                  <div className="mt-3">
                    <label className="block text-sm text-gray-700 mb-2">
                      อธิบายสถานที่ที่ต้องการสถานที่ที่อยู่รับบริการจัดเก็บขยะ / อื่นๆ (ถ้ามี)
                    </label>
                    <input
                      type="text"
                      value={formData.otherWasteType}
                      onChange={(e) => handleInputChange("otherWasteType", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="ระบุรายละเอียดเพิ่มเติม"
                    />
                  </div>
                </div>
                {errors.wasteTypes && (
                  <p className="text-red-500 text-sm mt-2">{errors.wasteTypes}</p>
                )}
              </div>

              {/* Collection Details */}
              <div className="bg-white border-2 border-gray-100 rounded-lg p-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      มีความประสงค์ขอรับบริการจัดเก็บขยะ และขอให้ท่านดำเนินการ <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.collectionDetails}
                      onChange={(e) => handleInputChange("collectionDetails", e.target.value)}
                      rows={4}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.collectionDetails ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="กรุณาระบุรายละเอียดสถานที่จัดเก็บ เช่น ที่อยู่ เวลาที่สะดวก วิธีการจัดเก็บ"
                    />
                    {errors.collectionDetails && (
                      <p className="text-red-500 text-sm mt-1">{errors.collectionDetails}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      กับ เหตุผลด้านสาธารณไฟ ข้าพเจ้าขอรับบริการจัดเก็บขยะยิ่งได้ เหตุผลด้านสาธารณไฟ เล็ก 
                      การจัดเก็บขยะได้โดยไม่ต้องแจ้งให้ทราบล่วงหน้า <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.reasonForRequest}
                      onChange={(e) => handleInputChange("reasonForRequest", e.target.value)}
                      rows={4}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.reasonForRequest ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="กรุณาระบุเหตุผลความจำเป็นในการขอรับบริการจัดเก็บขยะ"
                    />
                    {errors.reasonForRequest && (
                      <p className="text-red-500 text-sm mt-1">{errors.reasonForRequest}</p>
                    )}
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
                      <p className="font-medium mb-2">หมายเหตุ :</p>
                      <p>* ช่องที่มีเครื่องหมายดอกจันต้องใส่ข้อมูลให้ครบ หากใส่ไม่ครบจะไม่สามารถส่งข้อมูลได้</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Captcha */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-4 flex-wrap justify-center">
                  <label className="text-sm font-medium text-gray-700">
                    ป้อนรหัสยืนยัน :
                  </label>
                  <input
                    type="text"
                    value={formData.captcha}
                    onChange={(e) => handleInputChange("captcha", e.target.value)}
                    className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent w-32 ${
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
                    className="bg-orange-100 hover:bg-orange-200 px-3 py-2 rounded-lg text-orange-600 font-medium transition-colors flex items-center gap-1"
                  >
                    <RefreshCcw className="text-orange-600" size={16} />
                  </button>
                </div>
                {errors.captcha && (
                  <p className="text-red-500 text-sm mt-2 text-center">{errors.captcha}</p>
                )}
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
              <div className="pt-4 text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      กำลังส่งคำร้อง...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Send className="text-white" size={18} /> ยื่นคำร้อง
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
              คำร้องขอรับบริการจัดเก็บขยะ
            </h4>
            <p className="text-gray-600 text-sm">
              เทศบาลตำบลบ้านโพธิ์ มุ่งมั่นในการจัดการขยะอย่างมีประสิทธิภาพเพื่อสิ่งแวดล้อมที่ดี
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}