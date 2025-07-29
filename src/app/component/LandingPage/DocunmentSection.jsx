const sidebar = [
  { icon: "km-10.png", label: "การจัดการองค์ความรู้ (KM)" },
  { icon: "publishing-10.png", label: "เอกสารเผยแพร่" },
  { icon: "system-10.png", label: "ระบบสารบรรณ" },
  { icon: "law-10.png", label: "ระเบียบและกฎหมาย" },
  { icon: "complain-10.png", label: "รับเรื่องร้องเรียน" },
  { icon: "disabled-10.png", label: "เบี้ยยังชีพผู้สูงอายุ" },
  { icon: "blind-10.png", label: "เบี้ยยังชีพคนพิการ" },
];

const docCards = [
  {
    left: [
      { title: "จากกรมส่งเสริมการปกครองท้องถิ่น", items: ["หนังสือราชการส่วนกลาง", "กฎหมาย ระเบียบ สั่งการ ส่วนกลาง", "บทความ/วิชาการ", "หนังสือราชการจากศูนย์เทคโนโลยีสารสนเทศ"] },
    ],
    right: [
      { title: "จากราชการจากท้องถิ่นจังหวัด/อำเภอ", items: ["หนังสือราชการจังหวัด/อำเภอ", "หนังสือราชการจากท้องถิ่นจังหวัด/อำเภอ", "ข้อปฏิบัติ/คำสั่ง/หนังสืออื่นๆ"] },
    ],
  },
];

const feedbacks = [
  "จัดการเรื่องร้องเรียนต่างๆในพื้นที่", "แก้ไขปัญหาขยะมูลฝอย", "จัดการการบริหารงานทั่วไป", "แก้ไขปัญหาน้ำท่วม", "แก้ไขปัญหาน้ำเสีย", "แก้ไขปัญหายาเสพติด" ];

const bottomIcons = [
  { icon: "icon1.png", label: "ระบบ KM" },
  { icon: "icon2.png", label: "ระบบสารบรรณ" },
  { icon: "icon3.png", label: "ระบบกฎหมาย" },
  { icon: "icon4.png", label: "ระบบร้องเรียน" },
  { icon: "icon5.png", label: "One Stop Service" },
  { icon: "icon6.png", label: "เบี้ยยังชีพผู้สูงอายุ" },
  { icon: "icon7.png", label: "เบี้ยยังชีพคนพิการ" },
];

export default function DocunmentSection() {
  return (
    <div className="relative bg-gradient-to-b from-[#c6f5c6] to-[#e0f7fa] rounded-[32px] shadow-xl mx-auto max-w-[1200px] p-8 flex flex-col justify-center items-center">
      <div className="flex w-full">
        {/* Sidebar */}
        <div className="flex flex-col gap-4 items-center justify-start w-[180px]">
          {sidebar.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <img src={item.icon} alt={item.label} className="w-10 h-10 object-contain" />
              <span className="text-base font-semibold text-gray-700">{item.label}</span>
            </div>
          ))}
        </div>
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Document Cards */}
          <div className="flex gap-8 mb-8 mt-2">
            {/* Left Card */}
            <div className="bg-white rounded-[24px] shadow p-6 w-[320px]">
              <div className="text-lg font-bold text-cyan-700 mb-2">{docCards[0].left[0].title}</div>
              {docCards[0].left[0].items.map((txt, i) => (
                <div key={i} className={`mb-2 px-2 py-1 rounded-lg ${i === 1 ? 'bg-cyan-200 text-cyan-700 font-bold' : 'text-gray-700'}`}>{txt}</div>
              ))}
            </div>
            {/* Right Card */}
            <div className="bg-white rounded-[24px] shadow p-6 w-[320px]">
              <div className="text-lg font-bold text-cyan-700 mb-2">{docCards[0].right[0].title}</div>
              {docCards[0].right[0].items.map((txt, i) => (
                <div key={i} className={`mb-2 px-2 py-1 rounded-lg ${i === 1 ? 'bg-cyan-200 text-cyan-700 font-bold' : 'text-gray-700'}`}>{txt}</div>
              ))}
            </div>
          </div>
          {/* Feedback Section */}
          <div className="bg-white rounded-[24px] shadow p-6 w-full max-w-xl flex flex-col items-center mb-8">
            <div className="text-lg font-bold text-cyan-700 mb-2">แสดงความคิดเห็น</div>
            <div className="text-xs text-gray-500 mb-4">สามารถเลือกปัญหาที่ต้องการให้เทศบาลแก้ไข</div>
            <div className="grid grid-cols-2 gap-2 w-full mb-4">
              {feedbacks.map((txt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />
                  <span className="text-gray-700 text-sm">{txt}</span>
                </div>
              ))}
            </div>
            <button className="bg-cyan-500 text-white font-bold rounded-full px-6 py-2 shadow">กดโหวต</button>
          </div>
          {/* Bottom Icon List */}
          <div className="flex gap-4 flex-wrap justify-center items-center mt-2">
            {bottomIcons.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <img src={item.icon} alt={item.label} className="w-12 h-12 object-contain mb-1" />
                <span className="text-xs text-gray-700 font-semibold text-center">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
