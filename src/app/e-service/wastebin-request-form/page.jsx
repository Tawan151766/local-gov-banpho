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
  Upload,
  X,
} from "lucide-react";
import {
  uploadFileToServer,
  validateFileSize,
  validateFileType,
} from "@/lib/fileUploadUtils";
import { wastebinRequestsAPI } from "@/lib/api";

export default function WasteBinRequestForm() {
  const [formData, setFormData] = useState({
    day: "1",
    month: "มกราคม",
    year: "2566",
    prefix: "",
    name: "",
    age: "",
    houseNumber: "",
    street: "",
    village: "",
    binQuantity: "",
    deliveryHouseNumber: "",
    deliveryVillage: "",
    houseRegistrationCopies: "",
    idCardCopies: "",
    requester_id_card: "",
    captcha: "",
  });

  const [files, setFiles] = useState({
    houseRegistration: null,
    idCard: null,
    document1: null,
    document2: null,
    document3: null,
  });

  const [uploadedFiles, setUploadedFiles] = useState({
    houseRegistration: null,
    idCard: null,
    document1: null,
    document2: null,
    document3: null,
  });

  const [uploadingFiles, setUploadingFiles] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [captchaValue, setCaptchaValue] = useState("218791");
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
  const years = Array.from({ length: 23 }, (_, i) => 2566 + i);

  const refreshCaptcha = () => {
    const newCaptcha = Math.floor(100000 + Math.random() * 900000).toString();
    setCaptchaValue(newCaptcha);
  };

  // File Upload Component
  const FileUploadField = ({
    field,
    label,
    required = false,
    accept = "image/*,.pdf,.doc,.docx",
  }) => {
    const isUploading = uploadingFiles[field];
    const uploadedFile = uploadedFiles[field];
    const hasError = errors[field];

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        {!uploadedFile ? (
          <div className="relative">
            <input
              type="file"
              accept={accept}
              onChange={(e) => handleFileChange(field, e.target.files[0])}
              disabled={isUploading}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                hasError ? "border-red-500" : "border-gray-300"
              } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
            />
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
                <div className="flex items-center gap-2 text-green-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                  <span className="text-sm">กำลังอัปโหลด...</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <FileText className="text-green-600" size={16} />
            <span className="text-sm text-green-700 flex-1">
              {uploadedFile.name}
            </span>
            <button
              type="button"
              onClick={() => handleFileRemove(field)}
              className="text-red-500 hover:text-red-700 p-1"
              title="ลบไฟล์"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <p className="text-xs text-gray-500 mt-1">
          รองรับไฟล์: JPG, PNG, PDF, DOC, DOCX (ขนาดสูงสุด 10MB)
        </p>
        {hasError && <p className="text-red-500 text-sm mt-1">{hasError}</p>}
      </div>
    );
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

  const handleFileChange = async (field, file) => {
    if (!file) return;

    try {
      // Validate file
      validateFileSize(file, 10 * 1024 * 1024); // 10MB max
      validateFileType(file, [
        ".pdf",
        ".jpg",
        ".jpeg",
        ".png",
        ".doc",
        ".docx",
      ]);

      setFiles((prev) => ({
        ...prev,
        [field]: file,
      }));

      setUploadingFiles((prev) => ({
        ...prev,
        [field]: true,
      }));

      // Upload file
      const result = await uploadFileToServer(file);

      if (result.success) {
        setUploadedFiles((prev) => ({
          ...prev,
          [field]: result,
        }));

        // Clear error if exists
        if (errors[field]) {
          setErrors((prev) => ({
            ...prev,
            [field]: "",
          }));
        }
      }
    } catch (error) {
      console.error("File upload error:", error);
      setErrors((prev) => ({
        ...prev,
        [field]: error.message,
      }));

      // Clear file on error
      setFiles((prev) => ({
        ...prev,
        [field]: null,
      }));
    } finally {
      setUploadingFiles((prev) => ({
        ...prev,
        [field]: false,
      }));
    }
  };

  const handleFileRemove = (field) => {
    setFiles((prev) => ({
      ...prev,
      [field]: null,
    }));
    setUploadedFiles((prev) => ({
      ...prev,
      [field]: null,
    }));

    // Clear error if exists
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.prefix) newErrors.prefix = "กรุณาเลือกคำนำหน้า";
    if (!formData.name) newErrors.name = "กรุณากรอกชื่อ-นามสกุล";
    if (!formData.age) newErrors.age = "กรุณากรอกอายุ";
    if (!formData.houseNumber) newErrors.houseNumber = "กรุณากรอกเลขที่บ้าน";
    if (!formData.village) newErrors.village = "กรุณากรอกหมู่ที่";
    if (!formData.binQuantity) newErrors.binQuantity = "กรุณาระบุจำนวนถังขยะ";
    if (!formData.deliveryHouseNumber)
      newErrors.deliveryHouseNumber = "กรุณากรอกเลขที่บ้านสำหรับจัดส่ง";
    if (!formData.deliveryVillage)
      newErrors.deliveryVillage = "กรุณากรอกหมู่ที่สำหรับจัดส่ง";
    if (!formData.requester_id_card)
      newErrors.requester_id_card = "กรุณากรอกเลขบัตรประชาชน";
    else if (formData.requester_id_card.length !== 13)
      newErrors.requester_id_card = "เลขบัตรประชาชนต้องมี 13 หลัก";
    if (!uploadedFiles.houseRegistration)
      newErrors.houseRegistration = "กรุณาอัปโหลดสำเนาทะเบียนบ้าน";
    if (!uploadedFiles.idCard)
      newErrors.idCard = "กรุณาอัปโหลดสำเนาบัตรประชาชน";
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
      // Prepare form data for API
      const requestData = {
        request_date: `${formData.year}-${String(
          thaiMonths.indexOf(formData.month) + 1
        ).padStart(2, "0")}-${String(formData.day).padStart(2, "0")}`,
        requester_title: formData.prefix || null,
        requester_name: formData.name || null,
        requester_id_card: formData.requester_id_card || null,
        requester_age: formData.age ? parseInt(formData.age) : null,
        requester_house_number: formData.houseNumber || null,
        requester_street: formData.street || null,
        requester_village: formData.village || null,
        bin_quantity: formData.binQuantity ? parseInt(formData.binQuantity) : null,
        delivery_house_number: formData.deliveryHouseNumber || null,
        delivery_village: formData.deliveryVillage || null,
        house_registration: uploadedFiles.houseRegistration?.path || null,
        id_card: uploadedFiles.idCard?.path || null,
        document1: uploadedFiles.document1?.path || null,
        document2: uploadedFiles.document2?.path || null,
        document3: uploadedFiles.document3?.path || null,
        captcha_answer: formData.captcha || null,
        ip_address: null, // Will be set by server
        user_agent: navigator.userAgent || null,
      };

      console.log("Submitting wastebin request:", requestData);

      const result = await wastebinRequestsAPI.createRequest(requestData);

      if (!result.success) {
        throw new Error(result.error || "Failed to submit request");
      }

      console.log("Wastebin request submitted successfully:", result);

      setSubmitSuccess(true);

      // Reset form
      setFormData({
        day: "1",
        month: "มกราคม",
        year: "2566",
        prefix: "",
        name: "",
        age: "",
        houseNumber: "",
        street: "",
        village: "",
        binQuantity: "",
        deliveryHouseNumber: "",
        deliveryVillage: "",
        houseRegistrationCopies: "",
        idCardCopies: "",
        requester_id_card: "",
        captcha: "",
      });

      setFiles({
        houseRegistration: null,
        idCard: null,
        document1: null,
        document2: null,
        document3: null,
      });

      setUploadedFiles({
        houseRegistration: null,
        idCard: null,
        document1: null,
        document2: null,
        document3: null,
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error submitting wastebin request:", error);
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
              คำร้องขอรับถังขยะมูลฝอยและสิ่งปฏิกูลของคุณได้รับการบันทึกเรียบร้อยแล้ว
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-green-800 mb-2">
                ขั้นตอนต่อไป:
              </h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• เจ้าหน้าที่จะตรวจสอบเอกสารและข้อมูลของคุณ</li>
                <li>• ติดต่อกลับภายใน 3-5 วันทำการ</li>
                <li>• จัดส่งถังขยะตามที่อยู่ที่ระบุไว้</li>
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
              ถัง
            </span>
          </div>
          <div className="flex-1 flex flex-wrap flex-row items-center justify-center gap-6 md:gap-12 md:ml-40">
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              คำร้องขอรับถังขยะ
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              มูลฝอยและสิ่งปฏิกูล
            </span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[800px]">
        {/* Form Container */}
        <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg backdrop-blur-sm overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white text-center">
            <h1 className="text-2xl font-bold mb-2">
              แบบขอรับถังขยะมูลฝอย และสิ่งปฏิกูล
            </h1>
            <p className="text-green-100">
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
                    onChange={(e) => handleInputChange("day", e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
              <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                <p className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                  <FileText className="text-green-600" size={18} /> เรื่อง:
                  ขอรับถังขยะมูลฝอยและสิ่งปฏิกูล
                </p>
                <p className="text-gray-700 flex items-center gap-2">
                  <User className="text-green-600" size={18} /> เรียน:
                  นายกเทศมนตรีตำบลบ้านโพธิ์
                </p>
              </div>

              {/* Personal Information */}
              <div className="bg-white border-2 border-gray-100 rounded-lg p-4 text-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <User className="text-green-600" size={20} />{" "}
                  ข้อมูลผู้ยื่นคำร้อง
                </h3>

                {/* Prefix Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ด้วยข้าพเจ้า <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4 flex-wrap">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="prefix"
                        value="นาย"
                        checked={formData.prefix === "นาย"}
                        onChange={(e) =>
                          handleInputChange("prefix", e.target.value)
                        }
                        className="text-green-600 focus:ring-green-500"
                      />
                      <span>นาย</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="prefix"
                        value="นาง"
                        checked={formData.prefix === "นาง"}
                        onChange={(e) =>
                          handleInputChange("prefix", e.target.value)
                        }
                        className="text-green-600 focus:ring-green-500"
                      />
                      <span>นาง</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="prefix"
                        value="นางสาว"
                        checked={formData.prefix === "นางสาว"}
                        onChange={(e) =>
                          handleInputChange("prefix", e.target.value)
                        }
                        className="text-green-600 focus:ring-green-500"
                      />
                      <span>นางสาว</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="prefix"
                        value="หน่วยงาน"
                        checked={formData.prefix === "หน่วยงาน"}
                        onChange={(e) =>
                          handleInputChange("prefix", e.target.value)
                        }
                        className="text-green-600 focus:ring-green-500"
                      />
                      <span>หน่วยงาน</span>
                    </label>
                  </div>
                  {errors.prefix && (
                    <p className="text-red-500 text-sm mt-1">{errors.prefix}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ชื่อ-นามสกุล <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="ชื่อ-นามสกุล"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      เลขบัตรประชาชน <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.requester_id_card}
                      onChange={(e) =>
                        handleInputChange("requester_id_card", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.requester_id_card
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="เลขบัตรประชาชน 13 หลัก"
                      maxLength={13}
                    />
                    {errors.requester_id_card && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.requester_id_card}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      อายุ <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) =>
                          handleInputChange("age", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          errors.age ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="อายุ"
                        min="1"
                        max="120"
                      />
                      <span className="text-sm text-gray-600">ปี</span>
                    </div>
                    {errors.age && (
                      <p className="text-red-500 text-sm mt-1">{errors.age}</p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <Home className="text-green-600" size={16} />{" "}
                      อยู่บ้านเลขที่ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.houseNumber}
                      onChange={(e) =>
                        handleInputChange("houseNumber", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.houseNumber
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="เลขที่บ้าน"
                    />
                    {errors.houseNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.houseNumber}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ถนน
                    </label>
                    <input
                      type="text"
                      value={formData.street}
                      onChange={(e) =>
                        handleInputChange("street", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="ชื่อถนน"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      หมู่ที่ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.village}
                      onChange={(e) =>
                        handleInputChange("village", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.village ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="หมู่ที่"
                    />
                    {errors.village && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.village}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">📍 ที่อยู่:</span>{" "}
                    ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา
                  </p>
                </div>
              </div>

              {/* Request Details */}
              <div className="bg-white border-2 border-gray-100 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Trash2 className="text-green-600" size={20} />{" "}
                  รายละเอียดคำร้อง
                </h3>

                <div className="mb-4">
                  <p className="text-sm text-gray-700 mb-4">
                    มีความประสงค์ที่จะขอรับถังขยะมูลฝอยและสิ่งปฏิกูล
                    จากเทศบาลตำบลบ้านโพธิ์
                    โดยกำหนดให้นำไปใช้ในการรองรับขยะมูลฝอยและสิ่งปฏิกูลในครัวเรือน
                    และจะปฏิบัติตามระเบียบ ข้อบังคับ
                    และแนวปฏิบัติของเทศบาลตำบลบ้านโพธิ์
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        จำนวนถังขยะที่ต้องการ{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={formData.binQuantity}
                          onChange={(e) =>
                            handleInputChange("binQuantity", e.target.value)
                          }
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                            errors.binQuantity
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="จำนวน"
                          min="1"
                        />
                        <span className="text-sm text-gray-600">ใบ</span>
                      </div>
                      {errors.binQuantity && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.binQuantity}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-800">
                    ที่อยู่สำหรับจัดส่ง:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        บ้านเลขที่ <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.deliveryHouseNumber}
                        onChange={(e) =>
                          handleInputChange(
                            "deliveryHouseNumber",
                            e.target.value
                          )
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          errors.deliveryHouseNumber
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="เลขที่บ้าน"
                      />
                      {errors.deliveryHouseNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.deliveryHouseNumber}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        หมู่ที่ <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.deliveryVillage}
                        onChange={(e) =>
                          handleInputChange("deliveryVillage", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          errors.deliveryVillage
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="หมู่ที่"
                      />
                      {errors.deliveryVillage && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.deliveryVillage}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* File Uploads */}
              <div className="bg-white border-2 border-gray-100 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FileText className="text-green-600" size={20} /> เอกสารประกอบ
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FileUploadField
                      field="houseRegistration"
                      label="สำเนาทะเบียนบ้าน"
                      required={true}
                      accept="image/*,.pdf"
                    />
                    <FileUploadField
                      field="idCard"
                      label="สำเนาบัตรประชาชน"
                      required={true}
                      accept="image/*,.pdf"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FileUploadField
                      field="document1"
                      label="เอกสารประกอบ 1"
                      required={false}
                    />
                    <FileUploadField
                      field="document2"
                      label="เอกสารประกอบ 2"
                      required={false}
                    />
                    <FileUploadField
                      field="document3"
                      label="เอกสารประกอบ 3"
                      required={false}
                    />
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
                    <h4 className="text-sm font-medium text-yellow-800">
                      หมายเหตุสำคัญ
                    </h4>
                    <div className="mt-2 text-sm text-yellow-700">
                      <ul className="list-disc list-inside space-y-1">
                        <li>
                          ข้อที่มีเครื่องหมาย * จะต้องกรอกให้ครบ
                          หากไม่กรอกจะไม่สามารถส่งข้อมูลได้
                        </li>
                        <li>
                          กรุณาอัปโหลดสำเนาทะเบียนบ้านและบัตรประชาชนให้ครบถ้วน
                        </li>
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
                    value={formData.captcha}
                    onChange={(e) =>
                      handleInputChange("captcha", e.target.value)
                    }
                    className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-24 ${
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
                    className="bg-green-100 hover:bg-green-200 px-3 py-2 rounded-lg text-green-600 font-medium transition-colors flex items-center gap-1"
                  >
                    <RefreshCcw className="text-green-600" size={16} /> รีเฟรช
                  </button>
                </div>
                {errors.captcha && (
                  <p className="text-red-500 text-sm mt-1">{errors.captcha}</p>
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
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    Object.values(uploadingFiles).some((uploading) => uploading)
                  }
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                    isSubmitting ||
                    Object.values(uploadingFiles).some((uploading) => uploading)
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      กำลังส่งคำร้อง...
                    </span>
                  ) : Object.values(uploadingFiles).some(
                      (uploading) => uploading
                    ) ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      กำลังอัปโหลดไฟล์...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Send className="text-white" size={18} />{" "}
                      ส่งคำร้องขอรับถังขยะ
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
              คำร้องขอรับถังขยะมูลฝอยและสิ่งปฏิกูล
            </h4>
            <p className="text-gray-600 text-sm">
              เทศบาลตำบลบ้านโพธิ์
              มุ่งมั่นในการจัดการขยะอย่างยั่งยืนเพื่อสิ่งแวดล้อมที่ดี
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
