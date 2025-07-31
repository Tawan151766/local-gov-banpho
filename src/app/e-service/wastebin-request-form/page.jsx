"use client";
import { useState } from "react";

export default function WasteBinRequestForm() {
  const [formData, setFormData] = useState({
    day: '1',
    month: 'มกราคม',
    year: '2566',
    prefix: '',
    name: '',
    age: '',
    houseNumber: '',
    street: '',
    village: '',
    binQuantity: '',
    deliveryHouseNumber: '',
    deliveryVillage: '',
    houseRegistrationCopies: '',
    idCardCopies: '',
    captcha: ''
  });

  const [files, setFiles] = useState({
    houseRegistration: null,
    idCard: null,
    document1: null,
    document2: null,
    document3: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [captchaValue, setCaptchaValue] = useState("218791");

  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 23 }, (_, i) => 2566 + i);

  const refreshCaptcha = () => {
    const newCaptcha = Math.floor(100000 + Math.random() * 900000).toString();
    setCaptchaValue(newCaptcha);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (field, file) => {
    setFiles(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div
        className="w-full min-h-screen py-8 px-2 md:px-8 flex flex-col items-center"
        style={{
          background: 'linear-gradient(180deg, #F5E6A3 0%, #E6D85C 100%)',
        }}
      >
        <div className="w-full max-w-[800px] mt-20">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-600 mb-4">ส่งคำร้องสำเร็จ!</h2>
            <p className="text-gray-600 mb-4">
              คำร้องขอรับถังขยะมูลฝอยและสิ่งปฏิกูลของคุณได้รับการบันทึกเรียบร้อยแล้ว
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
      className="w-full min-h-screen py-8 px-2 md:px-8 flex flex-col items-center"
      style={{
        background: 'linear-gradient(180deg, #F5E6A3 0%, #E6D85C 100%)',
      }}
    >
      <div className="w-full max-w-[800px]">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            แบบขอรับถังขยะมูลฝอย และสิ่งปฏิกูล
          </h1>
        </div>

        {/* Form */}
        <div className="bg-yellow-100 rounded-lg p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Date Section */}
            <div className="text-sm">
              <label className="inline-block w-20">วันที่ยื่นคำร้อง</label>
              <select
                value={formData.day}
                onChange={(e) => handleInputChange('day', e.target.value)}
                className="px-2 py-1 border border-gray-400 rounded text-sm mr-2"
              >
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              <select
                value={formData.month}
                onChange={(e) => handleInputChange('month', e.target.value)}
                className="px-2 py-1 border border-gray-400 rounded text-sm mr-2"
              >
                {thaiMonths.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              <select
                value={formData.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
                className="px-2 py-1 border border-gray-400 rounded text-sm"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div className="text-sm">
              <p><strong>เรื่อง</strong> ขอรับถังขยะมูลฝอยและสิ่งปฏิกูล</p>
              <p><strong>เรียน</strong> นายกเทศมนตรีตำบลบ้านโพธิ์</p>
            </div>

            {/* Personal Information */}
            <div className="space-y-3 text-sm">
              {/* Prefix and Name */}
              <div className="flex items-center gap-2 flex-wrap">
                <span>ด้วยข้าพเจ้า</span>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="prefix"
                    value="นาย"
                    checked={formData.prefix === 'นาย'}
                    onChange={(e) => handleInputChange('prefix', e.target.value)}
                  />
                  <span>นาย</span>
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="prefix"
                    value="นาง"
                    checked={formData.prefix === 'นาง'}
                    onChange={(e) => handleInputChange('prefix', e.target.value)}
                  />
                  <span>นาง</span>
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="prefix"
                    value="นางสาว"
                    checked={formData.prefix === 'นางสาว'}
                    onChange={(e) => handleInputChange('prefix', e.target.value)}
                  />
                  <span>นางสาว</span>
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="prefix"
                    value="หน่วยงาน"
                    checked={formData.prefix === 'หน่วยงาน'}
                    onChange={(e) => handleInputChange('prefix', e.target.value)}
                  />
                  <span>หน่วยงาน</span>
                </label>
                <span>*</span>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="px-2 py-1 border border-gray-400 rounded flex-1 min-w-[200px]"
                  placeholder="ชื่อ-นามสกุล"
                />
              </div>

              {/* Age */}
              <div className="flex items-center gap-2">
                <span>อายุ</span>
                <span>*</span>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="px-2 py-1 border border-gray-400 rounded w-16"
                  placeholder="อายุ"
                  min="1"
                  max="120"
                />
                <span>ปี</span>
              </div>

              {/* Address */}
              <div className="flex items-center gap-2 flex-wrap">
                <span>อยู่บ้านเลขที่</span>
                <span>*</span>
                <input
                  type="text"
                  value={formData.houseNumber}
                  onChange={(e) => handleInputChange('houseNumber', e.target.value)}
                  className="px-2 py-1 border border-gray-400 rounded w-24"
                  placeholder="เลขที่"
                />
                <span>ถนน</span>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                  className="px-2 py-1 border border-gray-400 rounded w-32"
                  placeholder="ชื่อถนน"
                />
                <span>หมู่ที่</span>
                <span>*</span>
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) => handleInputChange('village', e.target.value)}
                  className="px-2 py-1 border border-gray-400 rounded w-16"
                  placeholder="หมู่"
                />
              </div>

              <div className="text-sm">
                <span>ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา มีความประสงค์ที่จะขอรับถังขยะมูลฝอยและสิ่งปฏิกูล จากเทศบาลตำบลบ้านโพธิ์ โดยกำหนดให้นำไปใช้ในการรองรับขยะมูลฝอยและสิ่งปฏิกูลในครัวเรือน และจะปฏิบัติตามระเบียบ ข้อบังคับ และแนวปฏิบัติของเทศบาลตำบลบ้านโพธิ์</span>
              </div>

              {/* Bin Request Details */}
              <div className="flex items-center gap-2 flex-wrap">
                <span>โดยมีความประสงค์จะขอรับถังขยะจำนวน</span>
                <span>*</span>
                <input
                  type="number"
                  value={formData.binQuantity}
                  onChange={(e) => handleInputChange('binQuantity', e.target.value)}
                  className="px-2 py-1 border border-gray-400 rounded w-16"
                  placeholder="จำนวน"
                  min="1"
                />
                <span>ใบ</span>
              </div>

              <div className="text-sm">
                <span>จึงขอเรียนมาเพื่อโปรดทราบ</span>
              </div>

              {/* Delivery Address */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span>1.สำหรับบ้านเลขที่</span>
                  <span>*</span>
                  <input
                    type="text"
                    value={formData.deliveryHouseNumber}
                    onChange={(e) => handleInputChange('deliveryHouseNumber', e.target.value)}
                    className="px-2 py-1 border border-gray-400 rounded w-24"
                    placeholder="เลขที่"
                  />
                  <span>ฉบับ</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>2.สำหรับบ้านเลขที่หมู่ที่</span>
                  <span>*</span>
                  <input
                    type="text"
                    value={formData.deliveryVillage}
                    onChange={(e) => handleInputChange('deliveryVillage', e.target.value)}
                    className="px-2 py-1 border border-gray-400 rounded w-16"
                    placeholder="หมู่"
                  />
                  <span>ฉบับ</span>
                </div>
              </div>

              <div className="text-sm">
                <span>จึงขอเรียนมาเพื่อพิจารณา</span>
              </div>
            </div>

            {/* File Uploads */}
            <div className="space-y-3 text-sm">
              <div>
                <label className="block mb-1">สำเนาทะเบียนบ้าน *</label>
                <div className="flex items-center gap-2">
                  <button type="button" className="bg-gray-200 border border-gray-400 px-3 py-1 rounded text-sm">
                    Choose File
                  </button>
                  <span className="text-gray-600">No file chosen</span>
                </div>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange('houseRegistration', e.target.files[0])}
                  className="hidden"
                />
                <p className="text-xs text-gray-600 mt-1">
                  (อัพโหลดภาพถ่ายสำเนาทะเบียนบ้าน เป็นไฟล์ภาพ หรือ pdf ก็ได้)
                </p>
              </div>

              <div>
                <label className="block mb-1">สำเนาบัตรประชาชน *</label>
                <div className="flex items-center gap-2">
                  <button type="button" className="bg-gray-200 border border-gray-400 px-3 py-1 rounded text-sm">
                    Choose File
                  </button>
                  <span className="text-gray-600">No file chosen</span>
                </div>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange('idCard', e.target.files[0])}
                  className="hidden"
                />
                <p className="text-xs text-gray-600 mt-1">
                  (อัพโหลดภาพถ่ายบัตรประชาชน เป็นไฟล์ภาพ หรือ pdf ก็ได้)
                </p>
              </div>

              <div>
                <label className="block mb-1">เอกสารประกอบ 1</label>
                <div className="flex items-center gap-2">
                  <button type="button" className="bg-gray-200 border border-gray-400 px-3 py-1 rounded text-sm">
                    Choose File
                  </button>
                  <span className="text-gray-600">No file chosen</span>
                </div>
                <input
                  type="file"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={(e) => handleFileChange('document1', e.target.files[0])}
                  className="hidden"
                />
              </div>

              <div>
                <label className="block mb-1">เอกสารประกอบ 2</label>
                <div className="flex items-center gap-2">
                  <button type="button" className="bg-gray-200 border border-gray-400 px-3 py-1 rounded text-sm">
                    Choose File
                  </button>
                  <span className="text-gray-600">No file chosen</span>
                </div>
                <input
                  type="file"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={(e) => handleFileChange('document2', e.target.files[0])}
                  className="hidden"
                />
              </div>

              <div>
                <label className="block mb-1">เอกสารประกอบ 3</label>
                <div className="flex items-center gap-2">
                  <button type="button" className="bg-gray-200 border border-gray-400 px-3 py-1 rounded text-sm">
                    Choose File
                  </button>
                  <span className="text-gray-600">No file chosen</span>
                </div>
                <input
                  type="file"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={(e) => handleFileChange('document3', e.target.files[0])}
                  className="hidden"
                />
              </div>
            </div>

            {/* Note */}
            <div className="text-xs text-gray-600 bg-yellow-50 p-3 rounded border">
              <p>หมายเหตุ : * ช่องที่มีเครื่องหมายดอกจันต้องกรอกข้อมูลให้ครบถ้วน หากใส่ไม่ครบถ้วนจะไม่สามารถส่งคำขอได้</p>
            </div>

            {/* Captcha */}
            <div className="flex items-center gap-2">
              <span className="text-sm">ป้อนรหัสยืนยัน :</span>
              <input
                type="text"
                value={formData.captcha}
                onChange={(e) => handleInputChange('captcha', e.target.value)}
                className="px-2 py-1 border border-gray-400 rounded w-24 text-sm"
                placeholder="รหัส"
              />
              <div className="bg-white border border-gray-400 px-3 py-1 rounded font-mono text-red-600 text-sm">
                {captchaValue}
              </div>
              <button 
                type="button" 
                onClick={refreshCaptcha}
                className="bg-gray-200 border border-gray-400 px-2 py-1 rounded text-xs hover:bg-gray-300"
              >
                ⟲
              </button>
            </div>

            {/* Submit Button */}
            <div className="text-center mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-2 rounded font-medium text-sm ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-400'
                }`}
              >
                {isSubmitting ? 'กำลังส่ง...' : 'ยื่นคำร้อง'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}