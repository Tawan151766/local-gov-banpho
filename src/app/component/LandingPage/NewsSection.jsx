import React from "react";

export default function NewsSection() {
  // ข้อมูลตัวอย่าง
  const contentItems = [
    {
      id: 1,
      image: "image/Boat.jpg",
      text: "ข้อความตัวอย่างที่หนึ่ง นี่คือเนื้อหาที่แสดงในส่วนของข้อความ สามารถเป็นข้อความยาวๆ ได้ตามต้องการ",
      date: "29 กรกฎาคม 2025",
    },
    {
      id: 2,
      image: "image/Boat.jpg",
      text: "ข้อความตัวอย่างที่สอง เนื้อหาแต่ละรายการจะมีรูปแบบเดียวกัน แต่สามารถมีเนื้อหาที่แตกต่างกันได้",
      date: "28 กรกฎาคม 2025",
    },
    {
      id: 3,
      image: "image/Boat.jpg",
      text: "ข้อความตัวอย่างที่สาม การจัด layout แบบนี้ช่วยให้เนื้อหามีความเป็นระเบียบและดูง่าย",
      date: "27 กรกฎาคม 2025",
    },
    {
      id: 4,
      image: "image/Boat.jpg",
      text: "ข้อความตัวอย่างที่สี่ สามารถเพิ่มรายการได้ตามต้องการ และแต่ละรายการจะมีเส้นกั้นแยกจากกัน",
      date: "26 กรกฎาคม 2025",
    },
    {
      id: 5,
      image: "image/Boat.jpg",
      text: "ข้อความตัวอย่างที่ห้า ระบบจะแสดงรายการต่างๆ ในรูปแบบที่สวยงามและเป็นระเบียบ",
      date: "25 กรกฎาคม 2025",
    },
    {
      id: 6,
      image:
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=150&h=150&fit=crop&crop=center",
      text: "ข้อความตัวอย่างที่สอง เนื้อหาแต่ละรายการจะมีรูปแบบเดียวกัน แต่สามารถมีเนื้อหาที่แตกต่างกันได้",
      date: "28 กรกฎาคม 2025",
    },
    {
      id: 7,
      image:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=150&h=150&fit=crop&crop=center",
      text: "ข้อความตัวอย่างที่สาม การจัด layout แบบนี้ช่วยให้เนื้อหามีความเป็นระเบียบและดูง่าย",
      date: "27 กรกฎาคม 2025",
    },
    {
      id: 8,
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=150&fit=crop&crop=center",
      text: "ข้อความตัวอย่างที่สี่ สามารถเพิ่มรายการได้ตามต้องการ และแต่ละรายการจะมีเส้นกั้นแยกจากกัน",
      date: "26 กรกฎาคม 2025",
    },
    {
      id: 9,
      image:
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=150&h=150&fit=crop&crop=center",
      text: "ข้อความตัวอย่างที่ห้า ระบบจะแสดงรายการต่างๆ ในรูปแบบที่สวยงามและเป็นระเบียบ",
      date: "25 กรกฎาคม 2025",
    },
  ];

  return (
    <section
      className="news-section"
      style={{
        background:
          "linear-gradient(360deg, rgba(239, 228, 212, 0.6) 0%, rgba(1, 189, 204, 0.6) 100%)",
        height: "100%",
        width: "100%",
        padding: "70px",
      }}
    >
      <div className="section-container-news flex gap-8 justify-center">
        {/* ฝั่งซ้าย */}
        <div className="left-container rounded-[32px] w-[869px] h-[1123px] bg-white/38 backdrop-blur-[200px] shadow-[0_0_20.5px_0_rgba(0,0,0,0.2)] opacity-100">
          <div className="title relative text-center mb-12">
            <div className="text-[32px] font-semibold text-[#394D1C] inline-block mt-12">
              ข่าวประชาสัมพันธ์
            </div>
            <img
              src="image/leaf.png"
              alt="Leaf"
              className="absolute w-[240px] h-auto left-[40%] -translate-x-1/2 top-[-15px] pointer-events-none"
            />
          </div>

          <div className="left-content h-[calc(100%-200px)] overflow-y-auto px-8">
            {contentItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 pl-0 border-b border-[#01BDCC] last:border-b"
              >
                {/* ภาพ */}
                <div className="flex-shrink-0">
                  <img
                    src={item.image}
                    alt={`รูปภาพ ${item.id}`}
                    className="w-[216px] h-[150px] rounded-lg object-cover shadow-md"
                  />
                </div>

                {/* เนื้อหา */}
                <div className="flex-1 flex flex-col">
                  <p className="text-gray-800 text-sm leading-relaxed mt-2 font-medium">
                    {item.text}
                  </p>
                  <p className="text-gray-500 text-xs mt-auto">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ฝั่งขวา */}
        <div className="right-container flex flex-col gap-6 w-full max-w-[388px]">
          {/* ปุ่มราคาทอง */}
          <div className="bg-gradient-to-b from-[#fdf3ae] to-[#c4932c] rounded-[20px] text-[#5c3b0c] shadow-lg overflow-hidden text-center grid grid-rows-[auto_1fr] w-full">
            <div className="bg-[#fdf3ae] py-4 text-[38px] font-bold border-b border-white/33">
              ราคาทอง
            </div>
            <div className="bg-gradient-to-r from-[#d6ac4f] via-[#fceba6] to-[#d6ac4f] p-5 rounded-b-[20px]">
              {/* รับซื้อ */}
              <div className="flex items-center justify-between mb-4 relative">
                <div className="text-left font-bold text-[#5c3b0c] text-[20px] leading-tight">
                  รับซื้อ
                  <br />
                  <span className="font-normal text-[14px]">(บาท)</span>
                </div>
                <div className="text-[34px] font-extrabold text-[#5c3b0c] tracking-wide -translate-x-12 mr-12">
                  42,000
                </div>
              </div>
              <div className="border-t border-dashed border-[#5c3b0c] my-2"></div>
              {/* ขายออก */}
              <div className="flex items-center justify-between mt-4 relative">
                <div className="text-left font-bold text-[#5c3b0c] text-[20px] leading-tight">
                  ขายออก
                  <br />
                  <span className="font-normal text-[14px]">(บาท)</span>
                </div>
                <div className="text-[34px] font-extrabold text-[#5c3b0c] tracking-wide -translate-x-12 mr-12">
                  43,000
                </div>
              </div>
            </div>
          </div>

          {/* ส่วนศูนย์พัฒนาเด็กเล็ก */}
          <div className="flex items-center gap-4 h-[120px] rounded-[35px] bg-gradient-to-b from-[#B7D3FF] to-[#5A89D0] shadow-[0_4px_4px_rgba(0,0,0,0.25)] text-white px-5 w-full cursor-pointer transition-all duration-300 hover:scale-105">
            <img
              src="image/mom.png"
              alt="Mom"
              className="w-[94px] h-[94px] object-cover rounded"
            />
            <div className="flex flex-col justify-center items-start text-left">
              <span className="text-[24px] font-semibold text-[#1E1E1E] whitespace-nowrap">
                ศูนย์พัฒนาเด็กเล็ก
              </span>
              <span className="text-[16px] font-normal text-white">
                เทศบาลตำบลบ้านโพธิ์
              </span>
            </div>
          </div>

          {/* ปุ่มน้ำมัน */}
          <div className="service-button oil-price flex items-center gap-4 cursor-pointer bg-gradient-to-b from-[#B7D3FF] to-[#5A89D0] shadow-[0_4px_4px_rgba(0,0,0,0.25)] rounded-[35px] p-2.5 md:p-5 box-border text-[#1E1E1E] w-full transition-all duration-300 hover:scale-105">
            <img
              src="image/gas.png"
              alt="Gas"
              className="w-[101px] h-[101px] object-cover"
            />
            <div className="flex flex-col justify-center items-start gap-1.5">
              <span className="oil-title font-semibold text-[32px] leading-none">
                ราคาน้ำมัน
              </span>
            </div>
          </div>

          {/* ปุ่มไลน์เพื่อน */}
          <div className="service-button line-friend relative h-[260px] rounded-[35px] bg-gradient-to-b from-[#ACFFA4] to-[#73CC6B] shadow-[0_4px_4px_rgba(0,0,0,0.25)] flex flex-col justify-center p-5 font-prompt text-[#1E1E1E] w-full cursor-pointer transition-all duration-300 hover:scale-105">
            {/* Text area */}
            <div className="text-area flex flex-col items-start gap-1.5 w-full pr-[200px] box-border text-left">
              <div className="main-text text-[32px] font-semibold whitespace-nowrap leading-[1.2] mb-5">
                มาเป็นเพื่อน
                <br />
                กับเราที่นี่
              </div>
              <div className="sub-text text-[20px] font-medium mb-[75px]">
                Line@
              </div>
            </div>

            {/* กล่อง QR */}
            <div className="qr-box absolute bottom-5 right-5 w-[180px] h-[173px] rounded-[23px] bg-white shadow-[0_4px_4px_rgba(0,0,0,0.25)]"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
