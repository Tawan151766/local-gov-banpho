const cards = [
  { date: "9 ก.ค. 2568", message: "ข้อความ", type: "ประกาศเชิญชวน" },
  { date: "9 ก.ค. 2568", message: "ข้อความ", type: "ประกาศเชิญชวน" },
  { date: "9 ก.ค. 2568", message: "ข้อความ", type: "ประกาศเชิญชวน" },
  { date: "9 ก.ค. 2568", message: "ข้อความ", type: "ประกาศเชิญชวน" },
];

export default function NotifySection() {
  return (
    <div className="relative min-h-[900px] bg-gradient-to-br from-[#c6f5c6] to-[#e0f7fa] rounded-[32px] shadow-xl mx-auto max-w-[1400px] p-8 flex flex-col justify-center items-center">
      {/* Header Tabs */}
      <div className="flex w-full max-w-5xl mx-auto mb-8">
        <button className="bg-white text-[#01385f] font-bold rounded-l-[32px] px-8 py-4 text-lg shadow">ประกาศ EGP</button>
        <button className="bg-[#03bdca] text-[#01385f] font-bold px-8 py-4 text-lg shadow">ประกาศจัดซื้อจัดจ้าง</button>
        <button className="bg-[#03bdca] text-[#01385f] font-bold px-8 py-4 text-lg shadow">ผลประกาศจัดซื้อจัดจ้าง</button>
        <button className="bg-[#03bdca] text-[#01385f] font-bold rounded-r-[32px] px-8 py-4 text-lg shadow">รายงานผลจัดซื้อจัดจ้าง</button>
      </div>

      {/* Card List */}
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white border-2 border-[#01bdcc] rounded-[24px] shadow flex flex-col md:flex-row items-start p-6 min-h-[120px]">
            <div className="flex flex-col items-start min-w-[160px] mr-6">
              <span className="text-[#01385f] text-lg font-semibold mb-2">{card.date}</span>
              <span className="bg-[#73cc6b] text-white text-sm font-bold rounded px-3 py-1 mb-2">{card.type}</span>
            </div>
            <div className="flex-1 text-[#1e1e1e] text-base font-normal">{card.message}</div>
          </div>
        ))}
      </div>

      {/* ดูทั้งหมด Button */}
      <div className="w-full flex justify-end mt-8">
        <button className="bg-[#01385f] text-white rounded-[16px] px-6 py-2 text-[14px] font-medium shadow">ดูทั้งหมด</button>
      </div>
    </div>
  );
}
