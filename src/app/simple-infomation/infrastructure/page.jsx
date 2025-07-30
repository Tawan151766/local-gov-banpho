"use client";
import { useState } from "react";

export default function InfrastructurePage() {
  const [activeSection, setActiveSection] = useState("transportation");

  const sections = [
    {
      id: "transportation",
      title: "การคมนาคมขนส่ง",
      icon: "🚗"
    },
    {
      id: "electricity",
      title: "การไฟฟ้า",
      icon: "⚡"
    },
    {
      id: "water",
      title: "การประปา",
      icon: "🚰"
    },
    {
      id: "communication",
      title: "การโทรคมนาคม",
      icon: "📡"
    },
    {
      id: "landuse",
      title: "การใช้ที่ดิน",
      icon: "🏘️"
    }
  ];

  const roadData = [
    {
      name: "ถนนหลวงสาย 3122",
      description: "สายบ้านโพธิ์ – ดอนสีนนท์ (ถนนสายหลักของชุมชน)",
      type: "ถนนหลวง"
    },
    {
      name: "ถนนลาดยางสายอำเภอบ้านโพธิ์-คลองยายคำ", 
      description: "เส้นทางไปอำเภอพานทอง จังหวัดชลบุรี",
      type: "ถนนจังหวัด"
    }
  ];

  const waterSystemData = {
    source: "แม่น้ำบางปะกง",
    reservoirArea: "12 ไร่",
    productionCapacity: "35 ลบ.ม./ชั่วโมง",
    users: "613 ครัวเรือน",
    dataYear: "กรกฎาคม 2554"
  };

  const communicationData = {
    currentSpeakers: 39,
    plannedSpeakers: 49,
    targetYear: "2554",
    coverage: "ชุมชน 1 และ 2"
  };

  const landUseTypes = [
    {
      type: "บริเวณที่ดินเพื่อการขยายตัวของเมืองในด้านที่อยู่อาศัย",
      description: "พื้นที่สำหรับการพัฒนาที่อยู่อาศัย",
      icon: "🏠"
    },
    {
      type: "บริเวณที่ดินเพื่อการเกษตรกรรม",
      description: "พื้นที่สำหรับกิจกรรมทางการเกษตร",
      icon: "🌾"
    },
    {
      type: "บริเวณที่ดินเพื่อการพักผ่อนหย่อนใจและส่งเสริมสภาพแวดล้อมที่ดินของเมือง",
      description: "พื้นที่สีเขียวและพักผ่อน",
      icon: "🌳"
    }
  ];

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
            <span className="text-[#01385f] font-bold text-2xl tracking-wide">
              INFRA
            </span>
          </div>
          <div className="flex-1 flex flex-wrap flex-row items-center justify-center gap-6 md:gap-12 md:ml-40">
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              สาธารณูปโภค
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              สาธารณูปการ
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              โครงสร้างพื้นฐาน
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white bg-opacity-90 rounded-2xl shadow-md p-4 backdrop-blur-sm">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors flex flex-col items-center gap-1 ${
                  activeSection === section.id
                    ? 'bg-[#01bdcc] text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="text-base">{section.icon}</span>
                <span className="text-center leading-tight">{section.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full max-w-[1268px]">
        {activeSection === "transportation" && (
          <div className="space-y-6">
            {/* Transportation Overview */}
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-[#01385f] mb-6 text-center">
                การคมนาคมขนส่ง
              </h2>
              
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <div className="text-gray-700 leading-relaxed text-justify">
                  <p className="mb-4">
                    เทศบาลตำบลบ้านโพธิ์ มีถนนหลวงสาย 3122 สายบ้านโพธิ์ – ดอนสีนนท์ เป็นถนนสายหลักของชุมชน โดยมีสะพานข้ามแม่น้ำบางปะกงของ
                    ทางหลวงชนบท ข้างที่ว่าการอำเภอ เชื่อมต่อถนนสาย บ้านโพธิ์ – วัดหัวเนิน ของกรมทางหลวงชนบทไปยังถนนทางหลวงฉะเชิงเทรา – บางปะกงซึ่งอยู่นอกเขตเทศบาล
                    ทำให้สะดวกในการคมนาคมสัญจรไปมา
                  </p>
                  <p className="mb-4">
                    นอกจากนี้ ยังมีถนนสายย่อยในความรับผิดชอบขององค์การบริหารส่วนจังหวัดฉะเชิงเทรา ในเขตเทศบาล 1 สาย
                    ถนนลาดยางสายอำเภอบ้านโพธิ์-คลองยายคำ ใช้เป็นเส้นทางคมนาคมจากอำเภอบ้านโพธิ์ ผ่านพื้นที่หมู่ 1,2 ไปถึงอำเภอพานทอง จังหวัดชลบุรี
                    และถนน ค.ส.ล.ของเทศบาลอีกหลายสายนับว่าให้ความสะดวกทั่วถึง ในการสัญจรไปมาทั้งในเขตและติดต่อตำบลหมู่บ้านใกล้เคียง
                  </p>
                  <p>
                    การขนส่งทางบก มีบริษัทบ้านโพธิ์ขนส่ง จำกัด ให้บริการรถยนต์ โดยสารประจำทางวิ่งรับ-ส่งผู้โดยสารระหว่างอำเภอเมืองฉะเชิงเทรา – อำเภอพานทอง จังหวัดชลบุรี ผ่านเข้ามาในชุมชนเทศบาล
                  </p>
                </div>
              </div>
            </div>

            {/* Road Network */}
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-[#01385f] mb-6 text-center">
                เครือข่ายถนน
              </h3>
              
              <div className="space-y-4">
                {roadData.map((road, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-2">{road.name}</h4>
                        <p className="text-gray-600 text-sm">{road.description}</p>
                      </div>
                      <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium ml-4">
                        {road.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transportation Services */}
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-[#01385f] mb-6 text-center">
                บริการขนส่ง
              </h3>
              
              <div className="bg-green-50 rounded-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">🚌</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">บริษัทบ้านโพธิ์ขนส่ง จำกัด</h4>
                    <p className="text-gray-600 text-sm">รถยนต์โดยสารประจำทาง</p>
                  </div>
                </div>
                <div className="text-gray-700 text-sm">
                  <p>เส้นทาง: อำเภอเมืองฉะเชิงเทรา – อำเภอพานทอง จังหวัดชลบุรี</p>
                  <p>ผ่านเข้ามาในชุมชนเทศบาล</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "electricity" && (
          <div className="space-y-6">
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-[#01385f] mb-6 text-center">
                การไฟฟ้า
              </h2>
              
              <div className="bg-yellow-50 rounded-lg p-6 mb-6">
                <div className="text-gray-700 leading-relaxed text-justify">
                  <p>
                    การไฟฟ้าอยู่ในเขตรับผิดชอบของการไฟฟ้า จังหวัดฉะเชิงเทรา และอำเภอบางปะกง ปัจจุบันประชาชนในเขตเทศบาล มีไฟฟ้าและระบบผลิตกระแสไฟฟ้าด้วยพลังงานแสงอาทิตย์ใช้ครอบคลุมทั่วพื้นที่
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">⚡</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">การไฟฟ้าส่วนภูมิภาค</h3>
                  <p className="text-gray-600 text-sm">จังหวัดฉะเชิงเทรา และอำเภอบางปะกง</p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">☀️</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">พลังงานแสงอาทิตย์</h3>
                  <p className="text-gray-600 text-sm">ระบบผลิตกระแสไฟฟ้าเสริม</p>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-6 mt-8">
                <h4 className="font-semibold text-green-800 mb-4 text-center">สถานะการให้บริการ</h4>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
                  <div className="text-gray-700">ครอบคลุมทั่วพื้นที่</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "water" && (
          <div className="space-y-6">
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-[#01385f] mb-6 text-center">
                การประปา
              </h2>
              
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <div className="text-gray-700 leading-relaxed text-justify">
                  <p className="mb-4">
                    เทศบาลตำบลบ้านโพธิ์ มีกิจการประปาเป็นของตนเอง อาศัยแหล่งน้ำดิบจากแม่น้ำบางปะกง ผลิตน้ำประปาโดยมีสระกักเก็บน้ำดิบเนื้อที่ 12 ไร่ สามารถผลิตน้ำประปาผ่านระบบถังกรองและ
                    หอถังสูง ได้ประมาณ 35 ลบ.ม. / ต่อชั่วโมง ปัจจุบันมีผู้ใช้น้ำ 613 ครัวเรือน (ข้อมูล ณ กรกฎาคม 2554 )
                  </p>
                  <p>
                    แต่เทศบาลยังให้บริการน้ำประปาแก่ประชาชนในเขตไม่พอเพียงกับความต้องการของผู้บริโภคที่เพิ่มขึ้น เนื่องจากในฤดูแล้ง น้ำดิบในแม่น้ำจะเค็ม
                    น้ำที่กักเก็บไว้ไม่พอเพียง ทำให้ต้องเปิดปิดการจ่ายน้ำตามเวลาที่กำหนด
                  </p>
                </div>
              </div>

              {/* Water System Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-100 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{waterSystemData.reservoirArea}</div>
                  <div className="text-xs text-gray-600">สระกักเก็บน้ำ</div>
                </div>
                <div className="bg-green-100 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">{waterSystemData.productionCapacity}</div>
                  <div className="text-xs text-gray-600">กำลังผลิต</div>
                </div>
                <div className="bg-purple-100 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">{waterSystemData.users}</div>
                  <div className="text-xs text-gray-600">ผู้ใช้น้ำ</div>
                </div>
                <div className="bg-orange-100 rounded-lg p-4 text-center">
                  <div className="text-lg font-bold text-orange-600 mb-1">{waterSystemData.dataYear}</div>
                  <div className="text-xs text-gray-600">ข้อมูล ณ</div>
                </div>
              </div>

              {/* Water System Problems */}
              <div className="bg-red-50 rounded-lg p-6">
                <h4 className="font-semibold text-red-800 mb-4 flex items-center gap-2">
                  <span className="text-xl">⚠️</span>
                  ปัญหาระบบประปา
                </h4>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">•</span>
                    <span>ไม่พอเพียงกับความต้องการที่เพิ่มขึ้น</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">•</span>
                    <span>น้ำดิบในแม่น้ำเค็มในฤดูแล้ง</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">•</span>
                    <span>น้ำที่กักเก็บไว้ไม่เพียงพอ</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">•</span>
                    <span>ต้องเปิดปิดการจ่ายน้ำตามเวลาที่กำหนด</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "communication" && (
          <div className="space-y-6">
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-[#01385f] mb-6 text-center">
                การโทรคมนาคม
              </h2>
              
              <div className="bg-purple-50 rounded-lg p-6 mb-6">
                <div className="text-gray-700 leading-relaxed text-justify">
                  <p className="mb-4">
                    สื่อที่เทศบาลตำบลบ้านโพธิ์ดำเนินการเอง เสียงตามสาย (ชนิดไร้สาย) ส่งสัญญาณครอบคลุมภายในชุมชน 1 และ 2 และเทศบาลฯ ได้ดำเนินการขยายเขตติดตั้งระบบกระจายเสียงทางไกลอัตโนมัติชนิดไร้สาย
                    จำนวน 39 ชุดและจะเพิ่มเป็น 49 ชุดภายในปี 2554 เพื่อให้ครอบคลุมพิ้นที่ภายในเขตเทศบาลตำบล บ้นโพธิ์
                  </p>
                </div>
              </div>

              {/* Communication System Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-purple-100 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{communicationData.currentSpeakers}</div>
                  <div className="text-gray-700 font-medium">ชุดปัจจุบัน</div>
                  <div className="text-xs text-gray-600 mt-1">ระบบกระจายเสียง</div>
                </div>
                <div className="bg-green-100 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{communicationData.plannedSpeakers}</div>
                  <div className="text-gray-700 font-medium">เป้าหมาย</div>
                  <div className="text-xs text-gray-600 mt-1">ภายในปี {communicationData.targetYear}</div>
                </div>
                <div className="bg-blue-100 rounded-lg p-6 text-center">
                  <div className="text-lg font-bold text-blue-600 mb-2">100%</div>
                  <div className="text-gray-700 font-medium">ครอบคลุม</div>
                  <div className="text-xs text-gray-600 mt-1">พื้นที่เทศบาล</div>
                </div>
              </div>

              {/* Communication System Features */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-800 mb-4 text-center">ระบบเสียงตามสาย</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold">✓</span>
                    <span className="text-gray-700 text-sm">ระบบไร้สาย</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold">✓</span>
                    <span className="text-gray-700 text-sm">กระจายเสียงทางไกลอัตโนมัติ</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold">✓</span>
                    <span className="text-gray-700 text-sm">ครอบคลุม {communicationData.coverage}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold">✓</span>
                    <span className="text-gray-700 text-sm">เทศบาลดำเนินการเอง</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "landuse" && (
          <div className="space-y-6">
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-[#01385f] mb-6 text-center">
                การใช้ที่ดิน
              </h2>
              
              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <div className="text-gray-700 leading-relaxed text-justify">
                  <p className="mb-4">
                    ที่ดินเป็นทรัพยากรที่มีอยู่จำกัดและมีคุณค่าอย่างมาก ทั้งในเรื่องของปัจจัยการผลิต และในเรื่องการใช้ประโยชน์ที่ดินต่อการดำรงชีพของมนุษยชาติ ดังนั้นหากที่ดินมีการนำไปใช้ประโยชน์ให้
                    ถูกต้องและเหมาะสม ย่อมจะอำนวยผลต่อการพัฒนาในด้าน ต่าง ๆ ได้เป็นอย่างมาก โดยเฉพาะการใช้ที่ดินในเมืองย่อมแตกต่างไปจากชนบท ที่ดินส่วนใหญ่มักใช้เพื่อการอยู่อาศัย การสาธารณูปโภค สาธารณูปการ
                    และการพาณิชยกรรม
                  </p>
                  <p>
                    การใช้ที่ดินในเขตเมือง ส่วนใหญ่มักกำหนดประเภทการใช้ที่ดินไว้ 3 ประเภท คือ
                  </p>
                </div>
              </div>

              {/* Land Use Types */}
              <div className="space-y-4">
                {landUseTypes.map((landUse, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">{landUse.icon}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-2 leading-tight">{landUse.type}</h4>
                        <p className="text-gray-600 text-sm">{landUse.description}</p>
                      </div>
                      <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                        ประเภท {index + 1}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Land Use Principles */}
              <div className="bg-blue-50 rounded-lg p-6 mt-8">
                <h4 className="font-semibold text-blue-800 mb-4 text-center">หลักการใช้ที่ดิน</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-gray-800 mb-3">ความสำคัญของที่ดิน</h5>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>ทรัพยากรที่มีอยู่จำกัด</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>มีคุณค่าอย่างมาก</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>เป็นปัจจัยการผลิต</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>สำคัญต่อการดำรงชีพ</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-800 mb-3">การใช้ประโยชน์</h5>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>การอยู่อาศัย</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>สาธารณูปโภค</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>สาธารณูปการ</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>การพาณิชยกรรม</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Information */}
      <div className="w-full max-w-[1268px] mt-8">
        <div className="bg-white bg-opacity-90 rounded-2xl shadow-md p-6 backdrop-blur-sm text-center">
          <h4 className="text-lg font-semibold text-[#01385f] mb-2">
            สาธารณูปโภคและสาธารณูปการเทศบาลตำบลบ้านโพธิ์
          </h4>
          <p className="text-gray-600 text-sm">
            ข้อมูลโครงสร้างพื้นฐานและระบบสาธารณูปโภคที่สำคัญต่อการพัฒนาชุมชน
          </p>
        </div>
      </div>
    </div>
  );
}