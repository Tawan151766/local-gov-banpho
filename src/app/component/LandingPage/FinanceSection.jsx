export default function FinanceSection() {
  return (
    <div className="w-full min-h-[900px] py-8 px-2 md:px-8 flex flex-col items-center bg-transparent">
      {/* Header Section */}
      <div className="w-full max-w-[1268px] flex flex-col gap-4 mb-8">
        <div className="bg-[#03bdca] rounded-[36px] shadow-md w-full h-auto flex flex-col md:flex-row md:items-center px-4 md:px-8 py-4 md:py-0 relative">
          <div className="bg-white rounded-[36px] shadow-md w-full md:w-[247px] h-[56px] md:h-[71px] flex items-center justify-center mb-4 md:mb-0 md:absolute md:left-0 md:top-0">
            <span className="text-[#01385f] font-semibold text-xl md:text-2xl">
              EGP
            </span>
          </div>
          <div className="flex-1 flex flex-wrap flex-col md:flex-row items-center justify-center gap-4 md:gap-8 md:ml-[260px]">
            <span className="text-[#01385f] font-semibold text-base md:text-2xl">
              ประกาศจัดซื้อจัดจ้าง
            </span>
            <span className="text-[#01385f] font-semibold text-base md:text-2xl">
              ผลประกาศจัดซื้อจัดจ้าง
            </span>
            <span className="text-[#01385f] font-semibold text-base md:text-2xl">
              รายงานผลจัดซื้อจัดจ้าง
            </span>
          </div>
        </div>
      </div>
      {/* Announcement Cards */}
      <div className="w-full max-w-[1268px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {[1, 2, 3, 4].map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-[29px] border-4 border-[#01bdcc] shadow-md p-6 flex flex-col gap-2 relative"
          >
            <div className="flex flex-row items-center justify-between mb-2">
              <span className="text-[#01385f] font-semibold text-lg">
                9 ก.ค. 2568
              </span>
              <span className="bg-[#73cc6b] rounded px-4 py-1 text-white text-base">
                ประกาศเชิญชวน
              </span>
            </div>
            <div className="text-[#1e1e1e] text-base mb-2">ข้อความ</div>
            <div className="flex flex-row items-center justify-between mt-4">
              <span className="text-[#01385f] font-semibold text-base">
                ดูทั้งหมด
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
