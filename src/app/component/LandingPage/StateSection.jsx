import React, { useState, useEffect } from "react";

export default function StateSection() {
  const [stats, setStats] = useState({
    current: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    thisYear: 0,
    total: 0,
    lastUpdated: null
  });
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูลสถิติ
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/website-stats');
        const result = await response.json();
        
        if (result.success) {
          setStats(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch website stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // อัปเดตข้อมูลทุก 30 วินาที
    const interval = setInterval(fetchStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // ฟอร์แมตตัวเลข
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  const statsDisplay = [
    { label: `ขณะนี้ ${formatNumber(stats.current)} คน`, value: stats.current },
    { label: `วันนี้ ${formatNumber(stats.today)} คน`, value: stats.today },
    { label: `สัปดาห์นี้ ${formatNumber(stats.thisWeek)} คน`, value: stats.thisWeek },
    { label: `เดือนนี้ ${formatNumber(stats.thisMonth)} คน`, value: stats.thisMonth },
    { label: `ปีนี้ ${formatNumber(stats.thisYear)} คน`, value: stats.thisYear },
    { label: `ทั้งหมด ${formatNumber(stats.total)} คน`, value: stats.total },
  ];

  return (
    <>
      <div
        className="relative w-full h-screen flex flex-col items-center justify-end"
        style={{ minHeight: "480px" }}
      >
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src="/image/bg-stat.jpg"
            alt="bg-stat"
            className="w-full h-full object-cover"
          />
          {/* Blue overlay */}
          <div className="absolute inset-0 w-full h-full bg-cyan-400/40" />
        </div>

        {/* Stats Box (on top of background) */}
        <div
          className="relative z-10 w-full mx-auto bg-[#eaf3d6]/30 backdrop-blur-sm px-2 md:px-6 py-4 "
        >
          <div className="w-full overflow-x-auto">
            <div className="min-w-[400px] grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 text-center mt-2 ">
              <div className="col-span-2 sm:col-span-2 md:col-span-1 flex flex-col items-start justify-center py-2 pr-2">
                <span className="text-[#394d1c] font-bold text-lg md:text-xl">
                  จำนวนผู้เข้าชมเว็บไซค์
                </span>
                <span className="text-[#394d1c] text-xs md:text-sm">
                  number of website visitors 
                </span>
              </div>
              {loading ? (
                // Loading state
                Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center py-2 relative"
                  >
                    <div className="animate-pulse bg-[#394d1c]/20 rounded h-6 w-24 mb-1"></div>
                    {idx < 5 && (
                      <span className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-8 w-px bg-[#01bdcc]" />
                    )}
                  </div>
                ))
              ) : (
                statsDisplay.map((stat, idx) => (
                  <div
                    key={stat.label}
                    className="flex flex-col items-center justify-center py-2 relative"
                  >
                    <span className="text-[#394d1c] font-semibold text-base md:text-lg transition-all duration-300">
                      {stat.label}
                    </span>
                    {/* Vertical divider except last */}
                    {idx < statsDisplay.length - 1 && (
                      <span className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-8 w-px bg-[#01bdcc]" />
                    )}
                  </div>
                ))
              )}
              
              {/* Last updated indicator */}
              {!loading && stats.lastUpdated && (
                <div className="col-span-full text-center mt-2">
                  <span className="text-[#394d1c]/60 text-xs">
                    อัปเดตล่าสุด: {new Date(stats.lastUpdated).toLocaleTimeString('th-TH')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
