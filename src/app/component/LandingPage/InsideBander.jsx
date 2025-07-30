import React from "react";

export default function InsideBander() {
  return (
    <div className="w-full min-h-screen  p-4 md:p-6 lg:p-8">
      <div className="w-full mx-auto  overflow-hidden">
        {/* Main Grid Layout */}
         <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-6 lg:p-8">
          
          {/* Left Column: Service Cards */}
          <div className="w-96">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {/* Card 1 */}
              <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center gap-4 p-4">
                <img
                  src="publishing-10.png"
                  alt="เผยแพร่"
                  className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl flex-shrink-0"
                />
                <div className="text-gray-800 font-medium text-base md:text-lg">
                  เอกสารเผยแพร่
                </div>
              </div>
              
              {/* Card 2 */}
              <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center gap-4 p-4">
                <img
                  src="information-management-10.png"
                  alt="สารสนเทศ"
                  className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl flex-shrink-0"
                />
                <div className="text-gray-800 font-medium text-base md:text-lg">
                  ระบบสารสนเทศ
                </div>
              </div>
              
              {/* Card 3 */}
              <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center gap-4 p-4">
                <img
                  src="business-ethics-10.png"
                  alt="จริยธรรม"
                  className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl flex-shrink-0"
                />
                <div className="text-gray-800 font-medium text-base md:text-lg">
                  ประมวลจริยธรรม
                </div>
              </div>
              
              {/* Card 4 */}
              <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center gap-4 p-4">
                <img
                  src="library-10.png"
                  alt="ห้องสมุด"
                  className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl flex-shrink-0"
                />
                <div className="text-gray-800 font-medium text-base md:text-lg">
                  คำถามที่พบบ่อย
                </div>
              </div>
              
              {/* Card 5 */}
              <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center gap-4 p-4">
                <img
                  src="couple-10.png"
                  alt="ผู้สูงอายุ"
                  className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl flex-shrink-0"
                />
                <div className="text-gray-800 font-medium text-base md:text-lg">
                  เบี้ยยังชีพผู้สูงอายุ
                </div>
              </div>
              
              {/* Card 6 */}
              <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center gap-4 p-4">
                <img
                  src="disabled-person-10.png"
                  alt="คนพิการ"
                  className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl flex-shrink-0"
                />
                <div className="text-gray-800 font-medium text-base md:text-lg">
                  เบี้ยยังชีพคนพิการ
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Combined Book Section and Opinion Poll */}
          <div className="w-full space-y-6">
            {/* Book Section */}
            <div className="bg-white rounded-2xl shadow-md p-4 md:p-6">
              <div className="text-blue-900 font-semibold text-xl md:text-2xl text-center mb-4">
                หนังสือราชการ
              </div>
              
              <div className="bg-white rounded-xl border-2 border-blue-400 shadow p-4">
                <div className="grid grid-cols-1 gap-6">
                  {/* Local Government Section */}
                  <div>
                    <div className="font-semibold text-base md:text-lg mb-3 text-gray-800">
                      จากราชการจากท้องถิ่นจังหวัด
                    </div>
                    <div className="space-y-2">
                      {["ข่าวประชาสัมพันธ์ สถ.", "หนังสือสั่งการจังหวัด", "ติดต่อหน่วยงาน สถ.จังหวัด"].map((doc, idx) => (
                        <div key={idx} className="text-gray-700 text-sm md:text-base py-1">
                          {doc}
                        </div>
                      ))}
                      <div className="text-white bg-blue-400 rounded px-3 py-2 text-sm md:text-base">
                        สถานที่สำคัญ/แหล่งท่องเที่ยว
                      </div>
                    </div>
                  </div>
                  
                  {/* Central Government Section */}
                  <div>
                    <div className="font-semibold text-base md:text-lg mb-3 text-gray-800">
                      จากกรมส่งเสริมการปกครองท้องถิ่น
                    </div>
                    <div className="space-y-2">
                      {["หนังสือราชการของ สถ.", "บทความที่น่าสนใจ", "พรบ. และประกาศเกี่ยวกับเทคโนโลยีสารสนเทศ"].map((doc, idx) => (
                        <div key={idx} className="text-gray-700 text-sm md:text-base py-1">
                          {doc}
                        </div>
                      ))}
                      <div className="text-white bg-blue-400 rounded px-3 py-2 text-sm md:text-base">
                        กฎหมาย ระเบียบ และมติ ก.กลาง
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center mt-6">
                  <img
                    src="unnamed-1-10.png"
                    alt="book"
                    className="w-32 h-24 md:w-40 md:h-28 object-cover rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Opinion Poll Section */}
            <div className="bg-white rounded-2xl shadow-md p-4 md:p-6">
              <div className="text-green-800 font-semibold text-xl md:text-2xl mb-4">
                แสดงความคิดเห็น
              </div>
              
              <div className="text-gray-800 text-base md:text-lg mb-6">
                อยากให้อบต.บ้านโพธิ์เร่งแก้ปัญหาเรื่องใด
              </div>
              
              <div className="space-y-3 mb-6">
                {[
                  "จัดการเรื่องการป้องกันน้ำท่วม",
                  "จัดมาตรการป้องกันน้ำท่วม",
                  "แก้ไขปัญหาสิ่งแวดล้อม",
                  "แก้ไขปัญหาไฟฟ้าดับบ่อย",
                  "แก้ไขปัญหาลักขโมย",
                  "แก้ไขปัญหายาเสพติด",
                ].map((choice, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-green-300 flex-shrink-0"></div>
                    <span className="text-sm md:text-base text-gray-700">{choice}</span>
                  </div>
                ))}
              </div>
              
              <button className="w-full md:w-auto bg-orange-400 hover:bg-orange-500 text-white rounded-xl py-3 px-6 font-semibold shadow-md transition-colors duration-300">
                กดโหวต
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section: KM Icons */}
        <div className="p-4 md:p-6 lg:p-8 pt-0">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              "ศูนย์ข้อมูลข่าวสารอิเล็กทรอนิกส์\nของราชการ (OIC)",
              "สาระดีๆจากศาลปกครอง",
              "สำนักงานคณะกรรมการป้องกัน\nและปราบปรามการทุจริตแห่งชาติ",
              "งานบริการของศูนย์บริการ\nร่วม One Stop Service",
              "ศูนย์ดำรงธรรม",
            ].map((title, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-yellow-400 to-yellow-300 hover:from-yellow-500 hover:to-yellow-400 rounded-2xl p-4 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 min-h-[100px] md:min-h-[120px]"
              >
                <div className="text-gray-800 font-medium text-xs md:text-sm text-center whitespace-pre-line leading-tight">
                  {title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}