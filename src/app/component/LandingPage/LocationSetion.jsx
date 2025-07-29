export default function LocationSetion() {
  return (
    <div className="relative min-h-[700px] bg-[#f5f5e9] rounded-[48px] shadow-xl mx-auto max-w-[1275px] p-8 flex flex-col justify-center items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* E-Service Card (Image) */}
        <img
          src="/image/OneStopService.jpg"
          alt="One Stop Service"
          className="rounded-[28px] shadow-lg w-full h-full object-cover min-h-[180px]"
        />

        {/* External Link Card */}
        <img
          src="/image/externalOrgLink.png"
          alt="icon"
          className=" rounded-[16px] mr-4 object-cover min-h-[180px]"
        />
        <div className="bg-white rounded-[28px] shadow-lg p-6 flex flex-col min-h-[180px]">
          <div className="text-cyan-700 text-xl font-bold mb-2">
            พยากรณ์อากาศ 7 วัน
          </div>
          <div className="flex gap-4">
            {/* วันนี้ */}
            <div className="bg-cyan-100 rounded-[14px] p-4 flex-1 flex flex-col items-center">
              <div className="text-gray-800 font-bold">วันนี้</div>
              <div className="text-xs text-gray-500 mb-1">25 ก.ค.</div>
              <img src="cloudy-10.png" className="w-8 h-8 mb-2 object-cover" />
              <div className="text-xs text-gray-700">ฝนฟ้าคะนอง</div>
              <div className="text-xs text-gray-700">ฝน 60% ของพื้นที่</div>
              <div className="text-xs text-gray-500">ลม 37 กม./ชม.</div>
              <div className="flex justify-between items-center w-full mt-2">
                <span className="text-lg font-bold">34°</span>
                <span className="text-lg font-bold">29°</span>
              </div>
            </div>
            {/* พรุ่งนี้ */}
            <div className="bg-cyan-100 rounded-[14px] p-4 flex-1 flex flex-col items-center">
              <div className="text-gray-800 font-bold">พรุ่งนี้</div>
              <div className="text-xs text-gray-500 mb-1">26 ก.ค.</div>
              <img src="cloudy-20.png" className="w-8 h-8 mb-2 object-cover" />
              <div className="text-xs text-gray-700">ฝนฟ้าคะนอง</div>
              <div className="text-xs text-gray-700">ฝน 60% ของพื้นที่</div>
              <div className="text-xs text-gray-500">ลม 37 กม./ชม.</div>
              <div className="flex justify-between items-center w-full mt-2">
                <span className="text-lg font-bold">34°</span>
                <span className="text-lg font-bold">29°</span>
              </div>
            </div>
          </div>
        </div>

        {/* Facebook Card */}
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-[28px] shadow-lg p-6 flex flex-col justify-between min-h-[180px]">
          <div className="flex flex-col items-center justify-center h-full">
            <img src="facebook.png" alt="facebook" className="w-12 h-12 mb-2" />
            <div className="text-white text-xl font-bold mb-1">FACEBOOK</div>
            <div className="text-white text-base mb-2">
              เทศบาลตำบลบ้านโพธิ์ ฉะเชิงเทรา
            </div>
            <div className="flex gap-2 mt-2">
              <button className="bg-white text-blue-600 font-bold rounded-full px-4 py-1 shadow">
                กดติดตาม
              </button>
              <button className="bg-white text-blue-600 font-bold rounded-full px-4 py-1 shadow">
                ส่งข้อความ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
