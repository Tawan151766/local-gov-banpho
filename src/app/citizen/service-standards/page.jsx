'use client';

import { useState } from 'react';

export default function WorkProcessPage() {
  const [selectedProcess, setSelectedProcess] = useState('building-permit');
  const [activeStep, setActiveStep] = useState(null);

  const processes = {
    'building-permit': {
      title: 'ขั้นตอนการขอใบอนุญาตก่อสร้าง',
      description: 'ขั้นตอนการดำเนินการขอใบอนุญาตก่อสร้างอาคาร',
      department: 'กองช่าง',
      timeframe: '30-45 วันทำการ',
      icon: '🏗️',
      color: 'orange',
      steps: [
        {
          id: 1,
          title: 'ยื่นคำขอและเอกสาร',
          description: 'ยื่นคำขอพร้อมเอกสารประกอบที่กองช่าง',
          duration: '1 วัน',
          documents: ['คำขอใบอนุญาต', 'แบบแปลนก่อสร้าง', 'หนังสือรับรองกรรมสิทธิ์', 'สำเนาบัตรประชาชน'],
          responsible: 'ผู้ขอใบอนุญาต',
          location: 'กองช่าง ชั้น 1'
        },
        {
          id: 2,
          title: 'ตรวจสอบความถูกต้องเบื้องต้น',
          description: 'เจ้าหน้าที่ตรวจสอบความครบถ้วนของเอกสาร',
          duration: '3-5 วัน',
          documents: [],
          responsible: 'เจ้าหน้าที่กองช่าง',
          location: 'กองช่าง'
        },
        {
          id: 3,
          title: 'การสำรวจพื้นที่',
          description: 'เจ้าหน้าที่ออกสำรวจพื้นที่ก่อสร้างจริง',
          duration: '5-7 วัน',
          documents: [],
          responsible: 'นักวิชาการโยธา',
          location: 'พื้นที่ก่อสร้าง'
        },
        {
          id: 4,
          title: 'พิจารณาอนุมัติ',
          description: 'คณะกรรมการพิจารณาอนุมัติใบอนุญาต',
          duration: '15-20 วัน',
          documents: [],
          responsible: 'คณะกรรมการ',
          location: 'ห้องประชุม'
        },
        {
          id: 5,
          title: 'ชำระค่าธรรมเนียม',
          description: 'ชำระค่าธรรมเนียมใบอนุญาตก่อสร้าง',
          duration: '1 วัน',
          documents: ['ใบแจ้งหนี้', 'หลักฐานการชำระเงิน'],
          responsible: 'ผู้ขอใบอนุญาต',
          location: 'กองคลัง'
        },
        {
          id: 6,
          title: 'รับใบอนุญาต',
          description: 'รับใบอนุญาตก่อสร้างที่ได้รับการอนุมัติ',
          duration: '1 วัน',
          documents: ['ใบอนุญาตก่อสร้าง'],
          responsible: 'ผู้ขอใบอนุญาต',
          location: 'กองช่าง'
        }
      ]
    },
    'business-license': {
      title: 'ขั้นตอนการขอใบอนุญาตประกอบกิจการ',
      description: 'ขั้นตอนการดำเนินการขอใบอนุญาตประกอบกิจการค้าขาย',
      department: 'กองสาธารณสุข',
      timeframe: '15-30 วันทำการ',
      icon: '🏪',
      color: 'blue',
      steps: [
        {
          id: 1,
          title: 'ยื่นคำขอ',
          description: 'ยื่นคำขอใบอนุญาตประกอบกิจการ',
          duration: '1 วัน',
          documents: ['คำขอใบอนุญาต', 'สำเนาบัตรประชาชน', 'สำเนาทะเบียนบ้าน'],
          responsible: 'ผู้ประกอบการ',
          location: 'กองสาธารณสุข'
        },
        {
          id: 2,
          title: 'ตรวจสอบเอกสาร',
          description: 'ตรวจสอบความถูกต้องและครบถ้วนของเอกสาร',
          duration: '2-3 วัน',
          documents: [],
          responsible: 'เจ้าหน้าที่สาธารณสุข',
          location: 'กองสาธารณสุข'
        },
        {
          id: 3,
          title: 'ตรวจสอบสถานที่',
          description: 'ตรวจสอบสถานที่ประกอบกิจการ',
          duration: '3-5 วัน',
          documents: [],
          responsible: 'เจ้าพนักงานสาธารณสุข',
          location: 'สถานที่ประกอบการ'
        },
        {
          id: 4,
          title: 'อนุมัติใบอนุญาต',
          description: 'พิจารณาอนุมัติใบอนุญาตประกอบกิจการ',
          duration: '7-15 วัน',
          documents: [],
          responsible: 'หัวหน้ากองสาธารณสุข',
          location: 'กองสาธารณสุข'
        },
        {
          id: 5,
          title: 'ชำระค่าธรรมเนียม',
          description: 'ชำระค่าธรรมเนียมใบอนุญาต',
          duration: '1 วัน',
          documents: ['ใบแจ้งหนี้'],
          responsible: 'ผู้ประกอบการ',
          location: 'กองคลัง'
        },
        {
          id: 6,
          title: 'รับใบอนุญาต',
          description: 'รับใบอนุญาตประกอบกิจการ',
          duration: '1 วัน',
          documents: ['ใบอนุญาตประกอบกิจการ'],
          responsible: 'ผู้ประกอบการ',
          location: 'กองสาธารณสุข'
        }
      ]
    },
    'elderly-allowance': {
      title: 'ขั้นตอนการขอเบี้ยยังชีพผู้สูงอายุ',
      description: 'ขั้นตอนการสมัครขอรับเบี้ยยังชีพผู้สูงอายุ',
      department: 'สำนักปลัดเทศบาล',
      timeframe: '7-15 วันทำการ',
      icon: '👴',
      color: 'green',
      steps: [
        {
          id: 1,
          title: 'ยื่นคำขอ',
          description: 'ยื่นคำขอขึ้นทะเบียนรับเบี้ยยังชีพ',
          duration: '1 วัน',
          documents: ['คำขอลงทะเบียน', 'สำเนาบัตรประชาชน', 'สำเนาทะเบียนบ้าน', 'สำเนาสมุดบัญชีเงินฝาก'],
          responsible: 'ผู้สูงอายุ/ญาติ',
          location: 'สำนักปลัด'
        },
        {
          id: 2,
          title: 'ตรวจสอบคุณสมบัติ',
          description: 'ตรวจสอบคุณสมบัติและเอกสารประกอบ',
          duration: '2-3 วัน',
          documents: [],
          responsible: 'เจ้าหน้าที่สวัสดิการ',
          location: 'สำนักปลัด'
        },
        {
          id: 3,
          title: 'สำรวจข้อมูล',
          description: 'สำรวจข้อมูลครัวเรือนและความเป็นอยู่',
          duration: '3-5 วัน',
          documents: [],
          responsible: 'เจ้าหน้าที่สำรวจ',
          location: 'ที่พักอาศัย'
        },
        {
          id: 4,
          title: 'พิจารณาอนุมัติ',
          description: 'พิจารณาอนุมัติการขึ้นทะเบียน',
          duration: '5-7 วัน',
          documents: [],
          responsible: 'คณะกรรมการ',
          location: 'สำนักปลัด'
        },
        {
          id: 5,
          title: 'แจ้งผลการพิจารณา',
          description: 'แจ้งผลการอนุมัติให้ผู้สมัครทราบ',
          duration: '1-2 วัน',
          documents: ['หนังสือแจ้งผล'],
          responsible: 'เจ้าหน้าที่',
          location: 'สำนักปลัด'
        }
      ]
    },
    'water-connection': {
      title: 'ขั้นตอนการขอติดตั้งมิเตอร์น้ำ',
      description: 'ขั้นตอนการขอติดตั้งมิเตอร์น้ำประปา',
      department: 'กองช่าง (งานประปา)',
      timeframe: '10-20 วันทำการ',
      icon: '💧',
      color: 'cyan',
      steps: [
        {
          id: 1,
          title: 'ยื่นคำขอ',
          description: 'ยื่นคำขอขอติดตั้งมิเตอร์น้ำ',
          duration: '1 วัน',
          documents: ['คำขอติดตั้งมิเตอร์', 'สำเนาบัตรประชาชน', 'สำเนาทะเบียนบ้าน', 'หนังสือยินยอมเจ้าของที่ดิน'],
          responsible: 'ผู้ขอใช้น้ำ',
          location: 'งานประปา กองช่าง'
        },
        {
          id: 2,
          title: 'สำรวจพื้นที่',
          description: 'สำรวจพื้นที่และเส้นทางท่อประปา',
          duration: '3-5 วัน',
          documents: [],
          responsible: 'ช่างประปา',
          location: 'พื้นที่ติดตั้ง'
        },
        {
          id: 3,
          title: 'ประเมินค่าใช้จ่าย',
          description: 'ประเมินค่าใช้จ่ายในการติดตั้ง',
          duration: '2-3 วัน',
          documents: ['ใบประเมินราคา'],
          responsible: 'เจ้าหน้าที่ประปา',
          location: 'งานประปา'
        },
        {
          id: 4,
          title: 'ชำระค่าติดตั้ง',
          description: 'ชำระค่าติดตั้งมิเตอร์และค่าเชื่อมต่อ',
          duration: '1 วัน',
          documents: ['ใบเสร็จรับเงิน'],
          responsible: 'ผู้ขอใช้น้ำ',
          location: 'กองคลัง'
        },
        {
          id: 5,
          title: 'ติดตั้งมิเตอร์',
          description: 'ดำเนินการติดตั้งมิเตอร์น้ำ',
          duration: '3-7 วัน',
          documents: [],
          responsible: 'ทีมช่างประปา',
          location: 'พื้นที่ติดตั้ง'
        },
        {
          id: 6,
          title: 'ทดสอบระบบ',
          description: 'ทดสอบการทำงานและส่งมอบ',
          duration: '1-2 วัน',
          documents: ['ใบรับรองการติดตั้ง'],
          responsible: 'ช่างประปา',
          location: 'พื้นที่ติดตั้ง'
        }
      ]
    }
  };

  const processOptions = [
    { key: 'building-permit', label: 'ใบอนุญาตก่อสร้าง', icon: '🏗️' },
    { key: 'business-license', label: 'ใบอนุญาตประกอบกิจการ', icon: '🏪' },
    { key: 'elderly-allowance', label: 'เบี้ยยังชีพผู้สูงอายุ', icon: '👴' },
    { key: 'water-connection', label: 'ติดตั้งมิเตอร์น้ำ', icon: '💧' }
  ];

  const currentProcess = processes[selectedProcess];

  const getColorClasses = (color, variant = 'primary') => {
    const colors = {
      orange: {
        primary: 'bg-orange-600 text-white',
        light: 'bg-orange-100 text-orange-800',
        border: 'border-orange-500',
        hover: 'hover:bg-orange-700'
      },
      blue: {
        primary: 'bg-blue-600 text-white',
        light: 'bg-blue-100 text-blue-800',
        border: 'border-blue-500',
        hover: 'hover:bg-blue-700'
      },
      green: {
        primary: 'bg-green-600 text-white',
        light: 'bg-green-100 text-green-800',
        border: 'border-green-500',
        hover: 'hover:bg-green-700'
      },
      cyan: {
        primary: 'bg-cyan-600 text-white',
        light: 'bg-cyan-100 text-cyan-800',
        border: 'border-cyan-500',
        hover: 'hover:bg-cyan-700'
      }
    };
    return colors[color]?.[variant] || colors.blue[variant];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ขั้นตอนการปฏิบัติงาน
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            รายละเอียดขั้นตอนการดำเนินงานต่างๆ ของเทศบาลตำบลบ้านโพธิ์
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-6"></div>
        </div>

        {/* Process Selector */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">เลือกประเภทงานที่ต้องการดู</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {processOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => setSelectedProcess(option.key)}
                className={`p-6 rounded-xl border-2 transition-all duration-200 text-center ${
                  selectedProcess === option.key
                    ? `${getColorClasses(processes[option.key].color, 'primary')} border-transparent shadow-lg transform scale-105`
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className="text-4xl mb-3">{option.icon}</div>
                <h3 className={`font-semibold ${
                  selectedProcess === option.key ? 'text-white' : 'text-gray-900'
                }`}>
                  {option.label}
                </h3>
              </button>
            ))}
          </div>
        </div>

        {/* Process Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center">
              <div className="text-6xl mr-6">{currentProcess.icon}</div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{currentProcess.title}</h2>
                <p className="text-gray-600 mb-4">{currentProcess.description}</p>
                <div className="flex flex-wrap gap-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getColorClasses(currentProcess.color, 'light')}`}>
                    {currentProcess.department}
                  </span>
                  <span className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    ⏱️ {currentProcess.timeframe}
                  </span>
                  <span className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    📋 {currentProcess.steps.length} ขั้นตอน
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Process Steps */}
        <div className="space-y-6">
          {currentProcess.steps.map((step, index) => (
            <div
              key={step.id}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
                activeStep === step.id ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {/* Step Header */}
              <div
                className={`${getColorClasses(currentProcess.color, 'primary')} p-6 cursor-pointer`}
                onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-full mr-4">
                      <span className="text-xl font-bold text-white">{step.id}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">{step.title}</h3>
                      <p className="text-white text-opacity-90">{step.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-white">
                    <span className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
                      {step.duration}
                    </span>
                    <svg
                      className={`w-6 h-6 transition-transform ${
                        activeStep === step.id ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Step Details */}
              {activeStep === step.id && (
                <div className="p-6 bg-gray-50">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Documents */}
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        เอกสารที่ต้องการ
                      </h4>
                      {step.documents.length > 0 ? (
                        <ul className="space-y-2">
                          {step.documents.map((doc, docIndex) => (
                            <li key={docIndex} className="flex items-start">
                              <svg className="w-4 h-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-sm text-gray-700">{doc}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">ไม่ต้องใช้เอกสารเพิ่มเติม</p>
                      )}
                    </div>

                    {/* Responsible */}
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        ผู้รับผิดชอบ
                      </h4>
                      <p className="text-gray-700 font-medium">{step.responsible}</p>
                    </div>

                    {/* Location */}
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        สถานที่
                      </h4>
                      <p className="text-gray-700 font-medium">{step.location}</p>
                    </div>
                  </div>

                  {/* Progress indicator */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>ขั้นตอนที่ {step.id} จาก {currentProcess.steps.length}</span>
                      <span>{Math.round((step.id / currentProcess.steps.length) * 100)}% เสร็จสิ้น</span>
                    </div>
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                      <div
                        className={`${getColorClasses(currentProcess.color, 'primary')} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${(step.id / currentProcess.steps.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Connector line */}
              {index < currentProcess.steps.length - 1 && (
                <div className="flex justify-center">
                  <div className="w-1 h-8 bg-gray-200"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Information */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl text-white p-8">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <h3 className="text-2xl font-semibold mb-4">ต้องการคำปรึกษาเพิ่มเติม?</h3>
            <p className="text-blue-100 max-w-2xl mx-auto mb-6">
              หากมีข้อสงสัยเกี่ยวกับขั้นตอนการดำเนินงาน สามารถติดต่อสอบถามได้ที่หน่วยงานที่เกี่ยวข้อง
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl mb-2">🏗️</div>
                <p className="text-sm font-medium">กองช่าง</p>
                <p className="text-xs text-blue-200">02-XXX-1234</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🏥</div>
                <p className="text-sm font-medium">กองสาธารณสุข</p>
                <p className="text-xs text-blue-200">02-XXX-1235</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">👥</div>
                <p className="text-sm font-medium">สำนักปลัด</p>
                <p className="text-xs text-blue-200">02-XXX-1236</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">💰</div>
                <p className="text-sm font-medium">กองคลัง</p>
                <p className="text-xs text-blue-200">02-XXX-1237</p>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-blue-400 border-opacity-30">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl mb-2">📞</div>
                  <p className="text-sm">โทรศัพท์: 02-XXX-XXXX</p>
                  <p className="text-xs text-blue-200">สำนักงานเทศบาล</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">📧</div>
                  <p className="text-sm">อีเมล์: info@banpho.go.th</p>
                  <p className="text-xs text-blue-200">สอบถามทั่วไป</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🕒</div>
                  <p className="text-sm">เวลาทำการ: จันทร์-ศุกร์</p>
                  <p className="text-xs text-blue-200">08:30-16:30 น.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            เคล็ดลับในการติดต่อราชการ
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-green-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900">เตรียมเอกสาร</h4>
              </div>
              <p className="text-gray-600 text-sm">
                เตรียมเอกสารให้ครบถ้วนก่อนมาติดต่อ เพื่อประหยัดเวลาและลดขั้นตอน
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900">มาในเวลาที่เหมาะสม</h4>
              </div>
              <p className="text-gray-600 text-sm">
                หลีกเลี่ยงช่วงเวลาเร่งด่วน (เช้ามาก หรือ ใกล้เลิกงาน) เพื่อได้รับบริการที่ดี
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900">สอบถามล่วงหน้า</h4>
              </div>
              <p className="text-gray-600 text-sm">
                โทรสอบถามรายละเอียดก่อนมาติดต่อ เพื่อให้แน่ใจว่านำเอกสารมาครบถ้วน
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}