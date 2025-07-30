"use client";
import { useState } from "react";

export default function EconomicStatusPage() {
  const [activeSection, setActiveSection] = useState("economy");

  const sections = [
    {
      id: "economy",
      title: "ฐานะทางเศรษฐกิจ",
      icon: "💰"
    },
    {
      id: "agriculture",
      title: "การเกษตรกรรม",
      icon: "🌾"
    },
    {
      id: "industry",
      title: "การอุตสาหกรรม",
      icon: "🏭"
    },
    {
      id: "commerce",
      title: "พาณิชยกรรมและบริการ",
      icon: "🏪"
    },
    {
      id: "tourism",
      title: "การท่องเที่ยว",
      icon: "🏛️"
    },
    {
      id: "livestock",
      title: "การปศุสัตว์",
      icon: "🐄"
    }
  ];

  const economicFactors = [
    {
      title: "ราคาที่ดินสูงขึ้น",
      description: "การเพิ่มขึ้นของมูลค่าที่ดินในพื้นที่",
      icon: "📈"
    },
    {
      title: "การปรับเปลี่ยนอาชีพ",
      description: "จากการทำนามาทำการเพาะเลี้ยงกุ้งและปลา",
      icon: "🔄"
    },
    {
      title: "แรงงานอุตสาหกรรม",
      description: "โรงงานขนาดใหญ่ประมาณ 35 โรง ในเขตอำเภอ",
      icon: "🏭"
    }
  ];

  const commerceData = [
    {
      category: "ร้านค้าทั่วไป",
      count: 43,
      type: "ร้านค้า"
    },
    {
      category: "ร้านอาหาร", 
      count: 11,
      type: "ร้านค้า"
    }
  ];

  const financialServices = [
    {
      name: "ธนาคารกรุงเทพ จำกัด (สาขา)",
      count: 1,
      type: "ธนาคาร"
    },
    {
      name: "ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร (สาขา)",
      count: 1,
      type: "ธนาคาร"
    },
    {
      name: "สหกรณ์การเกษตรบ้านโพธิ์ จำกัด",
      count: 1,
      type: "สหกรณ์"
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
              ECO
            </span>
          </div>
          <div className="flex-1 flex flex-wrap flex-row items-center justify-center gap-6 md:gap-12 md:ml-40">
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              สภาพเศรษฐกิจ
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              การประกอบอาชีพ
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              การพัฒนาเศรษฐกิจ
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white bg-opacity-90 rounded-2xl shadow-md p-4 backdrop-blur-sm">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
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
        {activeSection === "economy" && (
          <div className="space-y-6">
            {/* Economic Overview */}
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-[#01385f] mb-6 text-center">
                ปัจจุบันฐานะทางเศรษฐกิจ
              </h2>
              
              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <div className="text-gray-700 leading-relaxed text-justify">
                  <p>
                    ปัจจุบันฐานะทางเศรษฐกิจของคนในเขตเทศบาลส่วนใหญ่มีฐานะค่อนข้างดี เนื่องจากราคาที่ดินสูงขึ้น และการปรับเปลี่ยนอาชีพ
                    จากการทำนามาทำการเพาะเลี้ยงกุ้งและปลา ซึ่งทำให้มีรายได้ดีกว่าเดิมประกอบกับการใช้แรงงานในภาคอุตสาหกรรม ซึ่งมีโรง
                    งานขนาดใหญ่เกิดขึ้นในเขตอำเภอบ้านโพธิ์ประมาณ 35 โรง ทำให้มีรายได้สูงขึ้น ลดปัญหาการว่างงานที่มีอยู่เดิม
                  </p>
                </div>
              </div>
            </div>

            {/* Economic Factors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {economicFactors.map((factor, index) => (
                <div key={index} className="bg-white bg-opacity-95 rounded-xl shadow-lg p-6 backdrop-blur-sm">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">{factor.icon}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">{factor.title}</h3>
                  </div>
                  <p className="text-gray-700 text-sm text-center leading-relaxed">
                    {factor.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Industrial Impact */}
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-[#01385f] mb-6 text-center">
                ผลกระทบทางเศรษฐกิจ
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h4 className="font-semibold text-blue-800 mb-4">ผลดี</h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>รายได้เพิ่มขึ้นจากการเปลี่ยนอาชีพ</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>ลดปัญหาการว่างงาน</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>มูลค่าที่ดินเพิ่มขึ้น</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>โอกาสทางธุรกิจเพิ่มขึ้น</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-6">
                  <h4 className="font-semibold text-yellow-800 mb-4">สถิติ</h4>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-600 mb-1">35</div>
                      <div className="text-gray-700 text-sm">โรงงานในอำเภอ</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-1">↑</div>
                      <div className="text-gray-700 text-sm">รายได้เพิ่มขึ้น</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "agriculture" && (
          <div className="space-y-6">
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-[#01385f] mb-6 text-center">
                การเกษตรกรรม
              </h2>
              
              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <div className="text-gray-700 leading-relaxed text-justify">
                  <p>
                    การเกษตรกรรม ประชากรส่วนใหญ่ประกอบอาชีพค้าขายและอาชีพเกษตรกรรมเป็นหลักโดยทำการ เพาะปลูกพืชสวน เพาะเลี้ยงสัตว์น้ำ เช่น ปลา มี
                    ร้านค้าขาย 43 ร้านค้า และมีร้านอาหาร จำนวน 11 ร้านค้าโดยขายสินค้าอุปโภคบริโภค วัสดุก่อสร้างและผลิตภัณฑ์เกี่ยวกับอาหาร
                    และยาเพื่อการเลี้ยงสัตว์ เป็นต้น
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🌳</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">เพาะปลูกพืชสวน</h3>
                  <p className="text-gray-600 text-sm">การปลูกผลไม้และพืชสวน</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🐟</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">เพาะเลี้ยงสัตว์น้ำ</h3>
                  <p className="text-gray-600 text-sm">การเลี้ยงปลาและสัตว์น้ำอื่นๆ</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🏪</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">ค้าขาย</h3>
                  <p className="text-gray-600 text-sm">การประกอบธุרกิจค้าขาย</p>
                </div>
              </div>
            </div>

            {/* Commercial Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {commerceData.map((item, index) => (
                <div key={index} className="bg-white bg-opacity-95 rounded-xl shadow-lg p-6 backdrop-blur-sm text-center">
                  <div className="text-4xl font-bold text-[#01bdcc] mb-2">{item.count}</div>
                  <div className="text-lg font-semibold text-gray-800 mb-1">{item.category}</div>
                  <div className="text-sm text-gray-600">{item.type}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "industry" && (
          <div className="space-y-6">
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-[#01385f] mb-6 text-center">
                การอุตสาหกรรม
              </h2>
              
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="text-gray-700 leading-relaxed">
                  <p>
                    การอุตสาหกรรม การประกอบอุตสาหกรรมในเขตเทศบาลตำบลบ้านโพธิ์ไม่มี ส่วนใหญ่การประกอบอุตสาหกรรมเช่นโรงงานจะอยู่นอกเขตเทศบาล
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🚫</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">ในเขตเทศบาล</h3>
                  <p className="text-gray-600">ไม่มีโรงงานอุตสาหกรรม</p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🏭</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">นอกเขตเทศบาล</h3>
                  <p className="text-gray-600">มีโรงงานประมาณ 35 โรง ในอำเภอ</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "commerce" && (
          <div className="space-y-6">
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-[#01385f] mb-6 text-center">
                การพาณิชยกรรมและการบริการ
              </h2>
              
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <div className="text-gray-700 leading-relaxed text-justify">
                  <p>
                    การพาณิชยกรรมและการบริการ - ประเภทและจำนวนสถานประกอบการด้านพาณิชยกรรมและบริการ เช่น 1) สถานประกอบการด้านพาณิชยกรรม ร้านค้าทั่วไป 2) สถานประกอบการเทศพาณิชย์ - สถานประกอบการเทศพาณิชย์ในเขตเทศบาลตำบลบ้านโพธิ์ไม่มี 3) สถานประกอบการด้านบริการ - ธนาคาร จำนวน 2 แห่ง และสหกรณ์ 1 แห่ง
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-[#01385f] mb-6 text-center">
                หน่วยงานการเงิน
              </h3>

              <div className="space-y-4">
                {financialServices.map((service, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-xl">{service.type === 'ธนาคาร' ? '🏦' : '🤝'}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{service.name}</h4>
                          <p className="text-sm text-gray-600">{service.type}</p>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-[#01bdcc]">
                        {service.count} แห่ง
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-green-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">2</div>
                  <div className="text-gray-700 font-medium">ธนาคาร</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">1</div>
                  <div className="text-gray-700 font-medium">สหกรณ์</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">54</div>
                  <div className="text-gray-700 font-medium">ร้านค้ารวม</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "tourism" && (
          <div className="space-y-6">
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-[#01385f] mb-6 text-center">
                การท่องเที่ยว
              </h2>
              
              <div className="bg-orange-50 rounded-lg p-6 mb-6">
                <div className="text-gray-700 leading-relaxed text-justify">
                  <p>
                    การท่องเที่ยว เทศบาลตำบลบ้านโพธิ์ มีวัดสนามจันทร์ ซึ่งมีโบราณสถาน และสิ่งศักดิ์สิทธิ์ ซึ่งถือว่าเป็นที่ดึงดูดประชาชนให้มาเที่ยวชม เยี่ยมชม
                    และสักการบูชา ทำให้มีรายได้จากการท่องเที่ยว ประชาชนก็จะมีรายได้จากการขายของให้กับผู้มาเยี่ยมชมสักการบูชา และใน
                    อนาคตอันใกล้นี้ จะมีการท่องเที่ยวเชิงนิเวศน์ภายในเขตเทศบาลตำบลบ้านโพธิ์
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🏛️</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">วัดสนามจันทร์</h3>
                  <p className="text-gray-600 text-sm">โบราณสถานและสิ่งศักดิ์สิทธิ์</p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🌿</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">ท่องเที่ยวเชิงนิเวศน์</h3>
                  <p className="text-gray-600 text-sm">แผนการพัฒนาในอนาคต</p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 mt-8">
                <h4 className="font-semibold text-blue-800 mb-4 text-center">ประโยชน์จากการท่องเที่ยว</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700 text-sm">รายได้จากการท่องเที่ยว</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700 text-sm">รายได้จากการขายของที่ระลึก</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700 text-sm">การสร้างงานในชุมชน</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700 text-sm">การอนุรักษ์วัฒนธรรม</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "livestock" && (
          <div className="space-y-6">
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-[#01385f] mb-6 text-center">
                การปศุสัตว์
              </h2>
              
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <div className="text-gray-700 leading-relaxed text-justify">
                  <p>
                    การปศุสัตว์ การประกอบปศุสัตว์ในเขตเทศบาลตำบลบ้านโพธิ์ จะเป็นการเลี้ยงกุ้งและเลี้ยงสัตว์
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🦐</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">การเลี้ยงกุ้ง</h3>
                  <p className="text-gray-600 text-sm">การเพาะเลี้ยงกุ้งในพื้นที่</p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🐄</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">การเลี้ยงสัตว์</h3>
                  <p className="text-gray-600 text-sm">การเลี้ยงสัตว์ประเภทต่างๆ</p>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-6 mt-8">
                <h4 className="font-semibold text-green-800 mb-4 text-center">ความสำคัญของการปศุสัตว์</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700 text-sm">เป็นแหล่งรายได้หลักของครัวเรือน</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700 text-sm">ใช้ประโยชน์จากพื้นที่ริมน้ำ</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700 text-sm">สร้างอาชีพให้กับชุมชน</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700 text-sm">เป็นแหล่งอาหารโปรตีน</span>
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
            สภาพเศรษฐกิจและสังคมเทศบาลตำบลบ้านโพธิ์
          </h4>
          <p className="text-gray-600 text-sm">
            ข้อมูลการประกอบอาชีพ การพัฒนาเศรษฐกิจ และคุณภาพชีวิตของประชาชน
          </p>
        </div>
      </div>
    </div>
  );
}