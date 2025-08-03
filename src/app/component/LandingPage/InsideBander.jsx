import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

const services = [
  {
    title: "ศูนย์ข้อมูลข่าวสารอิเล็กทรอนิกส์ ของราชการ (OIC)",
    image: "image/Logo1_OIC.png",
    alt: "OIC Logo",
    url: "https://www.oic.go.th/",
  },
  {
    title: "สำนักงานคณะกรรมการป้องกัน และปราบปรามการทุจริตแห่งชาติ",
    image: "image/Logo2_ppp.jpg",
    alt: "PPP Logo",
    url: "https://www.nacc.go.th/",
  },
  {
    title: "ศูนย์ดำรงธรรม",
    image: "image/Logo3_tam.png",
    alt: "TAM Logo",
    url: "http://www.damrongdhama.moi.go.th/",
  },
  {
    title: "งานบริการของศูนย์บริการร่วม One Stop Service",
    image: "image/Logo5_onestop.png",
    alt: "One Stop Logo",
    url: "/e-service",
  },
  {
    title: "สาระดีๆจากศาลปกครอง",
    image: "image/Logo6_law.jpg",
    alt: "Law Logo",
    url: "https://www.admincourt.go.th/admincourt/site/",
  },
];

export default function InsideBander() {
  return (
    <div className="w-full min-h-screen  p-4 md:p-6 lg:p-8">
      <div className="w-full mx-auto  overflow-hidden">
        {/* Main Grid Layout */}
        <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-6 lg:p-8">
          {/* Left Column: Service Cards */}
          <div className="w-96 flex flex-col justify-center">
            /* ปุ่มลูกศรขึ้น */
            <button className="mb-4 p-2 rounded-full  hover:bg-gray-100 transition mx-auto">
              <ChevronUp className="w-10 h-10 text-gray-700" />
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {/* Card 1 */}
              <div
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center gap-4 p-4 cursor-pointer"
                onClick={() => (window.location.href = "/citizen/km")}
              >
                <img
                  src="image/InsiderBander_1.png"
                  alt="เผยแพร่"
                  className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl flex-shrink-0"
                />
                <div className="text-gray-800 font-medium text-base md:text-lg">
                  การจัดการ องค์ความรู้ (KM)
                </div>
              </div>

              {/* Card 2 */}
              <div
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center gap-4 p-4 cursor-pointer"
                onClick={() => (window.location.href = "/publish")}
              >
                <img
                  src="image/InsiderBander_2.png"
                  alt="สารสนเทศ"
                  className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl flex-shrink-0"
                />
                <div className="text-gray-800 font-medium text-base md:text-lg">
                  เอกสารเผยแพร่
                </div>
              </div>

              {/* Card 3 */}
              <div
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center gap-4 p-4 cursor-pointer"
                onClick={() => (window.location.href = "/citizen/technology")}
              >
                <img
                  src="image/InsiderBander_3.png"
                  alt="จริยธรรม"
                  className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl flex-shrink-0"
                />
                <div className="text-gray-800 font-medium text-base md:text-lg">
                  ระบบสารสนเทศ
                </div>
              </div>

              {/* Card 4 */}
              <div
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center gap-4 p-4 cursor-pointer"
                onClick={() => (window.location.href = "/ethics-code")}
              >
                <img
                  src="image/InsiderBander_4.png"
                  alt="ห้องสมุด"
                  className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl flex-shrink-0"
                />
                <div className="text-gray-800 font-medium text-base md:text-lg">
                  ประมวลจริยธรรม
                </div>
              </div>

              {/* Card 5 */}
              <div
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center gap-4 p-4 cursor-pointer"
                onClick={() =>
                  (window.location.href = "/citizen/qa")
                }
              >
                <img
                  src="image/InsiderBander_5.png"
                  alt="ผู้สูงอายุ"
                  className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl flex-shrink-0"
                />
                <div className="text-gray-800 font-medium text-base md:text-lg">
                  คำถามที่พบบ่อย
                </div>
              </div>

              {/* Card 6 */}
              <div
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center gap-4 p-4 cursor-pointer"
                onClick={() =>
                  (window.location.href = "/citizen/elderly-allowance")
                }
              >
                <img
                  src="image/InsiderBander_6.png"
                  alt="คนพิการ"
                  className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl flex-shrink-0"
                />
                <div className="text-gray-800 font-medium text-base md:text-lg">
                  เบี้ยยังชีพผู้สูงอายุ
                </div>
              </div>

              {/* Card 7 */}
              <div
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center gap-4 p-4 cursor-pointer"
                onClick={() =>
                  (window.location.href = "https://govwelfare.dep.go.th/")
                }
              >
                <img
                  src="image/InsiderBander_7.png"
                  alt="คนพิการ"
                  className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl flex-shrink-0"
                />
                <div className="text-gray-800 font-medium text-base md:text-lg">
                  เบี้ยยังชีพคนพิการ
                </div>
              </div>
            </div>
            <button className="mt-4 p-2 rounded-full hover:bg-gray-100 transition mx-auto">
              <ChevronDown className="w-10 h-10 text-gray-700" />
            </button>
          </div>

          {/* Right Column: Combined Book Section and Opinion Poll */}
          <div className="w-full space-y-6">
            {/* Book Section */}
            <div className="bg-none rounded-2xl p-4 md:p-6">
              <div className="relative text-center mb-12">
                <div className="text-[32px] font-semibold text-[#01385F] inline-block">
                  หนังสือราชการ
                </div>
                <img
                  src="image/leaf_blue.png"
                  alt="Leaf"
                  className="absolute w-[240px] h-auto left-[43%] -translate-x-1/2 top-[-61px] pointer-events-none"
                />
              </div>

              <div className="bg-white rounded-xl border-3 border-[#01BDCC] shadow p-3 md:p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0">
                  {/* Left Side */}
                  <div className="pr-3 md:pr-4 md:border-r md:border-gray-300">
                    <div className="font-semibold text-base md:text-lg text-gray-800">
                      จากกรมส่งเสริมการปกครองท้องถิ่น
                    </div>
                    <div className="w-67 h-[3px] bg-[#01BDCC] my-2"></div>

                    <div className="space-y-2 cursor-pointer">
                      {[
                        "หนังสือราชการของ สถ.",
                        "กฎหมาย ระเบียบ และมติ ก.กลาง",
                        "บทความที่น่าสนใจ",
                        "พรบ. และประกาศเกี่ยวกับเทคโนโลยีสารสนเทศ",
                      ].map((doc, idx) => (
                        <div
                          key={idx}
                          className={`text-gray-700 text-sm md:text-base py-[2px] transition-all duration-200
                            hover:bg-[#01BDCC] 
                            hover:rounded-[18.5px] hover:text-white px-3 flex items-center`}
                        >
                          {doc}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className="pl-3 md:pl-4">
                    <div className="font-semibold text-base md:text-lg text-gray-800">
                      จากราชการจากท้องถิ่นจังหวัด
                    </div>
                    <div className="w-56 h-[3px] bg-[#01BDCC] my-2"></div>

                    <div className="space-y-2 cursor-pointer">
                      {[
                        "หนังสือราชการของ สถ.",
                        "บทความที่น่าสนใจ",
                        "พรบ. และประกาศเกี่ยวกับเทคโนโลยีสารสนเทศ",
                        "กฎหมาย ระเบียบ และมติ ก.กลาง",
                      ].map((doc, idx) => (
                        <div
                          key={idx}
                          className={`text-gray-700 text-sm md:text-base py-[2px] transition-all duration-200
                            hover:bg-[#01BDCC] 
                            hover:rounded-[18.5px] hover:text-white px-3 flex items-center`}
                        >
                          {doc}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Opinion Poll Section */}
            <div className="bg-none  p-4 md:p-6">
              {/* ส่วนหัวข้อ จัดกลาง */}
              <div className="text-center">
                <div className="text-[#394D1C] font-semibold text-[32px] mb-2">
                  แสดงความคิดเห็น
                </div>
                <div className="text-[#394D1C] text-[20px] mb-6">
                  อยากให้อบต.บ้านโพธิ์เร่งแก้ปัญหาเรื่องใด
                </div>
              </div>

              <div className="w-full bg-white rounded-xl border-3 border-[#01BDCC] shadow pt-5 ">
                {/* Grid 2 คอลัมน์ */}
                <div className="flex justify-center">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-60 gap-y-3 mb-6">
                    {[
                      "จัดการเรื่องการป้องกันน้ำท่วม",
                      "จัดมาตรการป้องกันน้ำท่วม",
                      "แก้ไขปัญหาสิ่งแวดล้อม",
                      "แก้ไขปัญหาไฟฟ้าดับบ่อย",
                      "แก้ไขปัญหาลักขโมย",
                      "แก้ไขปัญหายาเสพติด",
                    ].map((choice, idx) => (
                      <label
                        key={idx}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                      >
                        {/* Checkbox input ซ่อน */}
                        <input
                          type="checkbox"
                          className="hidden peer"
                          name="opinion"
                          value={choice}
                        />

                        {/* วงกลมแสดงสถานะ checkbox */}
                        <div className="w-5 h-5 rounded-full border-2 border-green-400 peer-checked:bg-green-500 transition-colors flex-shrink-0"></div>

                        {/* ข้อความตัวเลือก */}
                        <span className="text-sm md:text-base text-gray-700">
                          {choice}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* ปุ่มอยู่กึ่งกลางแนวนอน */}
                <div className="flex justify-center mb-3">
                  <button className=" border-[2px] border-[#FFA82D] hover:bg-[#FFA82D] hover:text-white text-[#394D1C] text-[24px] rounded-3xl  px-6 pb-2 pt-1 font-semibold shadow-md transition-colors duration-300">
                    กดโหวต
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Section: KM Icons */}
            <div className="flex flex-wrap justify-center gap-5 max-w-[1240px] mx-auto">
              {services.map((service, idx) => (
                <div
                  onClick={() => (window.location.href = service.url)}
                  key={idx}
                  className="w-[310px] h-[72px] flex justify-center cursor-pointer"
                >
                  <div className="relative flex items-center justify-center pr-6 py-4 rounded-full text-white w-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all bg-gradient-to-b from-[#FFFF00] to-[#E5B878]">
                    {/* รูปภาพอยู่ชิดซ้ายแบบ absolute */}
                    <img
                      src={service.image}
                      alt={service.alt}
                      className="absolute left-0 w-[71px] h-[71px] rounded-full object-cover border-2 border-white shadow"
                    />

                    {/* ข้อความอยู่กลางป้าย โดยมี padding ซ้ายให้ไม่ชนรูป */}
                    <div className="text-[16px] text-[#1E1E1E] font-normal leading-tight text-center pl-[80px] w-full">
                      {service.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
