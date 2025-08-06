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
  Star,
  ThumbsUp,
  Users,
  Building,
  CheckCircle,
} from "lucide-react";

export default function MunicipalSurveyForm() {
  const [formData, setFormData] = useState({
    day: "31",
    month: "กรกฎาคม",
    year: "2568",
    // ข้อมูลผู้ประเมิน
    evaluatorName: "",
    evaluatorAge: "",
    evaluatorPhone: "",
    evaluatorOccupation: "",
    evaluatorAddress: "",
    // การประเมินบริการ
    serviceType: "",
    serviceQuality: "",
    staffBehavior: "",
    processingTime: "",
    facilityQuality: "",
    informationAccess: "",
    // การประเมินความพึงพอใจ
    overallSatisfaction: "",
    improvementSuggestions: "",
    publicParticipation: "",
    transparency: "",
    projectEffectiveness: "",
    // ข้อเสนอแนะ
    additionalComments: "",
    captcha: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [captchaValue, setCaptchaValue] = useState("459182");
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

  const serviceTypes = [
    "การออกใบอนุญาต/ใบอนุญาต",
    "การชำระภาษี",
    "การขอรับบริการขยะ",
    "การขอใบรับรองต่างๆ",
    "การร้องเรียน/แจ้งปัญหา",
    "การขอความช่วยเหลือ",
    "การเข้าร่วมประชุม/กิจกรรม",
    "การขอข้อมูลข่าวสาร",
    "บริการอื่นๆ",
  ];

  const satisfactionLevels = [
    { value: "5", label: "ดีมาก", color: "text-green-600" },
    { value: "4", label: "ดี", color: "text-blue-600" },
    { value: "3", label: "ปานกลาง", color: "text-yellow-600" },
    { value: "2", label: "พอใช้", color: "text-orange-600" },
    { value: "1", label: "ปรับปรุง", color: "text-red-600" },
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

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // ข้อมูลผู้ประเมิน
    if (!formData.evaluatorName)
      newErrors.evaluatorName = "กรุณากรอกชื่อ-นามสกุล";
    if (!formData.evaluatorAge) newErrors.evaluatorAge = "กรุณากรอกอายุ";
    if (!formData.evaluatorPhone)
      newErrors.evaluatorPhone = "กรุณากรอกเบอร์โทรศัพท์";
    if (!formData.evaluatorOccupation)
      newErrors.evaluatorOccupation = "กรุณากรอกอาชีพ";
    if (!formData.evaluatorAddress)
      newErrors.evaluatorAddress = "กรุณากรอกที่อยู่";

    // การประเมินบริการ
    if (!formData.serviceType) newErrors.serviceType = "กรุณาเลือกประเภทบริการ";
    if (!formData.serviceQuality)
      newErrors.serviceQuality = "กรุณาประเมินคุณภาพบริการ";
    if (!formData.staffBehavior)
      newErrors.staffBehavior = "กรุณาประเมินพฤติกรรมเจ้าหน้าที่";
    if (!formData.processingTime)
      newErrors.processingTime = "กรุณาประเมินความรวดเร็ว";
    if (!formData.overallSatisfaction)
      newErrors.overallSatisfaction = "กรุณาประเมินความพึงพอใจโดยรวม";

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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await fetch("/api/municipal-survey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success || true) {
        // Mock success
        setSubmitSuccess(true);
        setFormData({
          day: "31",
          month: "กรกฎาคม",
          year: "2568",
          evaluatorName: "",
          evaluatorAge: "",
          evaluatorPhone: "",
          evaluatorOccupation: "",
          evaluatorAddress: "",
          serviceType: "",
          serviceQuality: "",
          staffBehavior: "",
          processingTime: "",
          facilityQuality: "",
          informationAccess: "",
          overallSatisfaction: "",
          improvementSuggestions: "",
          publicParticipation: "",
          transparency: "",
          projectEffectiveness: "",
          additionalComments: "",
          captcha: "",
        });

        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      } else {
        throw new Error(result.error || "เกิดข้อผิดพลาดในการส่งแบบประเมิน");
      }
    } catch (error) {
      console.error("Error submitting survey:", error);
      alert("เกิดข้อผิดพลาด: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarRating = (fieldName, label, isRequired = true) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {isRequired && <span className="text-red-500">*</span>}
      </label>
      <div className="flex gap-2 flex-wrap">
        {satisfactionLevels.map((level) => (
          <label
            key={level.value}
            className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-colors ${
              formData[fieldName] === level.value
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input
              type="radio"
              name={fieldName}
              value={level.value}
              checked={formData[fieldName] === level.value}
              onChange={(e) => handleInputChange(fieldName, e.target.value)}
              className="sr-only"
            />
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < parseInt(level.value)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <span className={`text-sm font-medium ${level.color}`}>
              {level.label}
            </span>
          </label>
        ))}
      </div>
      {errors[fieldName] && (
        <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
      )}
    </div>
  );

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
              ส่งแบบประเมินสำเร็จ!
            </h2>
            <p className="text-gray-600 mb-4">
              ขขอบคุณสำหรับการประเมินความพึงพอใจของท่าน
            </p>
            <p className="text-sm text-gray-500">
              ข้อมูลของท่านจะเป็นประโยชน์ต่อการพัฒนาการบริการของเทศบาลตำบลบ้านโพธิ์
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
        <div className="bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] rounded-[36px] shadow-lg w-full flex flex-col md:flex-row items-center px-6 py-6 relative backdrop-blur-sm">
          <div className="bg-white rounded-full shadow-md w-32 h-16 flex items-center justify-center mb-4 md:mb-0 md:absolute md:left-6 md:top-1/2 md:-translate-y-1/2 border-2 border-[#0284C7]">
            <Star className="text-[#0284C7]" size={32} />
          </div>
          <div className="flex-1 flex flex-wrap flex-row items-center justify-center gap-6 md:gap-12 md:ml-40">
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              แบบประเมินความพึงพอใจ
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              เทศบาลตำบลบ้านโพธิ์
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
              แบบประเมินความพึงพอใจการให้บริการ
            </h1>
            <p className="text-blue-100">
              กรุณากรอกข้อมูลให้ครบถ้วนและประเมินอย่างตรงไปตรงมา
            </p>
          </div>

          {/* Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6 text-gray-700">
              {/* Date Section */}
              <div className="bg-gray-50 rounded-lg p-4 text-right">
                <div className="flex items-center justify-end gap-2 text-sm flex-wrap">
                  <span className="font-medium">วันที่</span>
                  <select
                    value={formData.day}
                    onChange={(e) => handleInputChange("day", e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Evaluator Information */}
              <div className="bg-white border-2 border-gray-100 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-600 mb-4 flex items-center gap-2 text-center w-full justify-center">
                  <User className="text-blue-600" size={20} /> ข้อมูลผู้ประเมิน
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ชื่อ-นามสกุล <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.evaluatorName}
                      onChange={(e) =>
                        handleInputChange("evaluatorName", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.evaluatorName
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="กรอกชื่อ-นามสกุล"
                    />
                    {errors.evaluatorName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.evaluatorName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      อายุ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.evaluatorAge}
                      onChange={(e) =>
                        handleInputChange("evaluatorAge", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.evaluatorAge
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="อายุ (ปี)"
                      min="1"
                      max="120"
                    />
                    {errors.evaluatorAge && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.evaluatorAge}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.evaluatorPhone}
                      onChange={(e) =>
                        handleInputChange("evaluatorPhone", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.evaluatorPhone
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="เบอร์โทรศัพท์"
                    />
                    {errors.evaluatorPhone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.evaluatorPhone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      อาชีพ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.evaluatorOccupation}
                      onChange={(e) =>
                        handleInputChange("evaluatorOccupation", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.evaluatorOccupation
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="อาชีพ"
                    />
                    {errors.evaluatorOccupation && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.evaluatorOccupation}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ที่อยู่ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.evaluatorAddress}
                    onChange={(e) =>
                      handleInputChange("evaluatorAddress", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.evaluatorAddress
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="บ้านเลขที่ ตำบล อำเภอ จังหวัด"
                  />
                  {errors.evaluatorAddress && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.evaluatorAddress}
                    </p>
                  )}
                </div>
              </div>

              {/* Service Evaluation */}
              <div className="bg-white border-2 border-gray-100 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-600 mb-4 flex items-center gap-2 text-center w-full justify-center">
                  <Building className="text-blue-600" size={20} />{" "}
                  การประเมินบริการ
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ประเภทบริการที่ใช้ <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.serviceType}
                      onChange={(e) =>
                        handleInputChange("serviceType", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.serviceType
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">---เลือกประเภทบริการ---</option>
                      {serviceTypes.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                    {errors.serviceType && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.serviceType}
                      </p>
                    )}
                  </div>

                  {renderStarRating("serviceQuality", "คุณภาพการให้บริการ")}
                  {renderStarRating(
                    "staffBehavior",
                    "พฤติกรรมและความสุภาพของเจ้าหน้าที่"
                  )}
                  {renderStarRating(
                    "processingTime",
                    "ความรวดเร็วในการให้บริการ"
                  )}
                  {renderStarRating(
                    "facilityQuality",
                    "สภาพแวดล้อมและสิ่งอำนวยความสะดวก",
                    false
                  )}
                  {renderStarRating(
                    "informationAccess",
                    "การเข้าถึงข้อมูลข่าวสาร",
                    false
                  )}
                </div>
              </div>

              {/* Overall Satisfaction */}
              <div className="bg-white border-2 border-gray-100 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-600 mb-4 flex items-center gap-2 text-center w-full justify-center">
                  <ThumbsUp className="text-blue-600" size={20} />{" "}
                  การประเมินโดยรวม
                </h3>

                <div className="space-y-6">
                  {renderStarRating("overallSatisfaction", "ความพึงพอใจโดยรวม")}
                  {renderStarRating(
                    "transparency",
                    "ความโปร่งใสในการทำงาน",
                    false
                  )}
                  {renderStarRating(
                    "publicParticipation",
                    "การส่งเสริมการมีส่วนร่วมของประชาชน",
                    false
                  )}
                  {renderStarRating(
                    "projectEffectiveness",
                    "ประสิทธิผลของโครงการพัฒนาท้องถิ่น",
                    false
                  )}
                </div>
              </div>

              {/* Suggestions */}
              <div className="bg-white border-2 border-gray-100 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-600 mb-4 flex items-center gap-2 text-center w-full justify-center">
                  <FileText className="text-blue-600" size={20} /> ข้อเสนอแนะ
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ข้อเสนอแนะเพื่อการปรับปรุงบริการ
                    </label>
                    <textarea
                      value={formData.improvementSuggestions}
                      onChange={(e) =>
                        handleInputChange(
                          "improvementSuggestions",
                          e.target.value
                        )
                      }
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="กรุณาให้ข้อเสนอแนะเพื่อการปรับปรุงการให้บริการ"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ความคิดเห็นเพิ่มเติม
                    </label>
                    <textarea
                      value={formData.additionalComments}
                      onChange={(e) =>
                        handleInputChange("additionalComments", e.target.value)
                      }
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="ความคิดเห็นหรือข้อเสนอแนะอื่นๆ"
                    />
                  </div>
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="text-blue-400" size={20} />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm text-blue-700">
                      <p className="font-medium mb-2">หมายเหตุ:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>
                          กรุณาให้ข้อมูลที่ตรงไปตรงมาเพื่อประโยชน์ในการพัฒนาการบริการ
                        </li>
                        <li>
                          ข้อมูลของท่านจะถูกเก็บเป็นความลับและใช้เพื่อการพัฒนาเท่านั้น
                        </li>
                        <li>
                          ผลการประเมินจะนำไปสู่การปรับปรุงคุณภาพการให้บริการของเทศบาล
                        </li>
                      </ul>
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
                    className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-24 ${
                      errors.captcha ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="รหัส"
                  />
                  <div className="bg-white border-2 border-gray-300 px-4 py-2 rounded-lg font-mono text-blue-600 font-bold text-lg">
                    {captchaValue}
                  </div>
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="bg-blue-100 hover:bg-blue-200 px-3 py-2 rounded-lg text-blue-600 font-medium transition-colors flex items-center gap-1"
                  >
                    <RefreshCcw className="text-blue-600" size={16} />
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
                      : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      กำลังส่งแบบประเมิน...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Send className="text-white" size={18} /> ส่งแบบประเมิน
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
            <h4 className="text-lg font-semibold text-[#0284C7] mb-2">
              แบบประเมินความพึงพอใจการให้บริการ
            </h4>
            <p className="text-gray-600 text-sm mb-2">
              เทศบาลตำบลบ้านโพธิ์ มุ่งมั่นพัฒนาการให้บริการเพื่อประชาชน
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mt-3">
              <div className="flex items-center gap-1">
                <Home size={16} />
                <span>เทศบาลตำบลบ้านโพธิ์</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rating Legend */}
        <div className="mt-4">
          <div className="bg-white bg-opacity-90 rounded-xl shadow-md p-4 backdrop-blur-sm">
            <h5 className="text-sm font-semibold text-gray-700 mb-2 text-center">
              เกณฑ์การประเมิน
            </h5>
            <div className="flex justify-center">
              <div className="grid grid-cols-5 gap-2 text-xs">
                {satisfactionLevels.map((level) => (
                  <div key={level.value} className="text-center">
                    <div className="flex justify-center mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={
                            i < parseInt(level.value)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <span className={`font-medium ${level.color}`}>
                      {level.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
