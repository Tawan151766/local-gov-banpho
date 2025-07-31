import React from "react";

// Management Card Component
const ManagementCard = ({
  position,
  name = "ตำแหน่ง",
  title = "ชื่อ........................",
  phone = "เบอร์โทร...............",
  imageSrc = "/image/manager.png",
  textColor = "text-white",
}) => {
  const textSizeClasses = {
    1: "text-xs sm:text-sm",
    2: "text-sm sm:text-base",
    3: "text-base sm:text-lg lg:text-xl",
    4: "text-sm sm:text-base",
    5: "text-xs sm:text-sm",
  };

  return (
    <div className="flex flex-col items-center space-y-2 sm:space-y-4">
      {/* ภาพ */}
      <div className="relative w-full max-w-[120px] sm:max-w-[150px] md:max-w-[180px] lg:max-w-[215px] h-[200px] sm:h-[250px] md:h-[300px] lg:h-[360px] overflow-hidden rounded-lg">
        <img
          src={imageSrc}
          alt={`${name} ${position}`}
          className="w-full h-full object-cover"
          style={{ transform: "scaleX(-1)" }}
        />
        <div
          className="absolute left-0 right-0 bottom-0 pointer-events-none"
          style={{
            height: "40%",
            background:
              "linear-gradient(180deg, rgba(137, 215, 220, 0) 0%, #89D7DC 90.34%)",
          }}
        />
      </div>

      {/* ข้อมูل */}
      <div className="w-full max-w-[120px] sm:max-w-[150px] md:max-w-[180px] lg:max-w-[215px] rounded-[10px] sm:rounded-[17px] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] overflow-hidden bg-white">
        {/* ส่วนชื่อและตำแหน่ง */}
        <div className="h-[50px] sm:h-[55px] md:h-[60px] lg:h-[66px] flex flex-col justify-center items-center px-2 sm:px-3 text-center">
          <div
            className={`font-bold ${textColor} ${textSizeClasses[position]} leading-tight`}
          >
            {name}
          </div>
          <div
            className={`opacity-90 leading-relaxed ${textColor} text-[10px] sm:text-xs mt-1`}
          >
            {title}
          </div>
        </div>

        {/* แถบฟ้า ใส่เบอร์โทรตรงนี้ */}
        <div className="h-[28px] sm:h-[32px] md:h-[36px] bg-[#01BDCC] rounded-b-[10px] sm:rounded-b-[17px] flex items-center justify-center px-2 sm:px-3">
          <span className="text-white text-[10px] sm:text-xs md:text-sm font-medium">
            {phone}
          </span>
        </div>
      </div>
    </div>
  );
};

const ManagementCard2 = ({
  position,
  name = "ตำแหน่ง",
  title = "ชื่อ........................",
  phone = "เบอร์โทร...............",
  imageSrc = "/image/manager.png",
  textColor = "text-white",
}) => {
  const textSizeClasses = {
    1: "text-xs sm:text-sm",
    2: "text-sm sm:text-base",
    3: "text-base sm:text-lg lg:text-xl",
    4: "text-sm sm:text-base",
    5: "text-xs sm:text-sm",
  };

  return (
    <div className="flex flex-col items-center space-y-2 sm:space-y-4">
      {/* ภาพ */}
      <div className="relative w-full max-w-[120px] sm:max-w-[150px] md:max-w-[180px] lg:max-w-[215px] h-[200px] sm:h-[250px] md:h-[300px] lg:h-[360px] overflow-hidden rounded-lg">
        <img
          src={imageSrc}
          alt={`${name} ${position}`}
          className="w-full h-full object-cover"
          style={{ transform: "scaleX(-1)" }}
        />
        <div
          className="absolute left-0 right-0 bottom-0 pointer-events-none"
          style={{
            height: "40%",
            background:
              "linear-gradient(180deg, rgba(222, 230, 226, 0) 0%, #DEE6E2 90.34%)",
          }}
        />
      </div>

      {/* ข้อมูล */}
      <div className="w-full max-w-[120px] sm:max-w-[150px] md:max-w-[180px] lg:max-w-[215px] rounded-[10px] sm:rounded-[17px] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] overflow-hidden bg-white">
        {/* ส่วนชื่อและตำแหน่ง */}
        <div className="h-[50px] sm:h-[55px] md:h-[60px] lg:h-[66px] flex flex-col justify-center items-center px-2 sm:px-3 text-center">
          <div
            className={`font-bold ${textColor} ${textSizeClasses[position]} leading-tight`}
          >
            {name}
          </div>
          <div
            className={`opacity-90 leading-relaxed ${textColor} text-[10px] sm:text-xs mt-1`}
          >
            {title}
          </div>
        </div>

        {/* แถบฟ้า ใส่เบอร์โทรตรงนี้ */}
        <div className="h-[28px] sm:h-[32px] md:h-[36px] bg-[#01BDCC] rounded-b-[10px] sm:rounded-b-[17px] flex items-center justify-center px-2 sm:px-3">
          <span className="text-white text-[10px] sm:text-xs md:text-sm font-medium">
            {phone}
          </span>
        </div>
      </div>
    </div>
  );
};

// Service Item Component
const ServiceItem = ({ icon, title, path }) => {
  return (
    <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 min-w-[160px] sm:min-w-[200px] md:min-w-[240px] max-w-[160px] sm:max-w-[200px] md:max-w-[240px] text-center hover:shadow-lg transition-shadow cursor-pointer flex flex-col items-center justify-center h-full">
      <img
        src={icon}
        alt={title}
        className="w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] md:w-[102px] md:h-[102px] object-contain mb-3 sm:mb-4 md:mb-5"
      />
      <a
        href={path}
        className="text-sm sm:text-base md:text-[20px] font-medium text-gray-700 whitespace-pre-line overflow-hidden text-ellipsis leading-tight"
      >
        {title}
      </a>
    </div>
  );
};

export default function ManagementSection() {
  const services = [
    {
      icon: "/image/manage_item1.png",
      title: "สารจากนายก",
      path: "/mayor-message",
    },
    {
      icon: "/image/manage_item2.png",
      title: "เจตจำนงสุจริต ของผู้บริหาร",
      path: "/executive-integrity",
    },
    {
      icon: "/image/manage_item3.png",
      title: "รับเเจ้งเรื่องราว ร้องทุกข์",
      path: "/complaint",
    },
    {
      icon: "/image/manage_item4.png",
      title: "รับเเจ้งเรื่องร้องเรียน ทุจริตประพฤติมิชอบ",
      path: "/e-service/corruption-complaint",
    },
    {
      icon: "/image/manage_item5.png",
      title: "การประเมินคุณธรม และความโปร่งใส",
      path: "/ITA",
    },
    {
      icon: "/image/manage_item6.png",
      title: "การประเมิน ประสิทธิภาพภายใน",
      path: "/internal-efficiency",
    },
  ];

  const managementTeam1 = [
    {
      position: 1,
      name: "ที่ปรึกษานายกเทศมนตรี",
      title: "นายประดิษฐ์ โรจนพร",
      phone: "081-686-8366",
    },
    {
      position: 2,
      name: "ที่ปรึกษานายกเทศมนตรี",
      title: "นายประดิษฐ์ โรจนพร",
      phone: "081-686-8366",
    },
    {
      position: 3,
      name: "นายกเทศมนตรี",
      title: "นายรุ่งโรจน์ กิติพิศาลกุล",
      phone: "063-795-2282",
    },
    {
      position: 4,
      name: "ที่ปรึกษานายกเทศมนตรี",
      title: "นายประดิษฐ โรจนพร",
      phone: "081-686-8366",
    },
    {
      position: 5,
      name: "ที่ปรึกษานายกเทศมนตรี",
      title: "นายประดิษฐ โรจนพร",
      phone: "081-686-8366",
    },
  ];

  const managementTeam2 = [
    {
      position: 1,
      name: "ที่ปรึกษานายกเทศมนตรี",
      title: "นายประดิษฐ์ โรจนพร",
      phone: "081-686-8366",
    },
    {
      position: 2,
      name: "ที่ปรึกษานายกเทศมนตรี",
      title: "นายประดิษฐ์ โรจนพร",
      phone: "081-686-8366",
    },
    {
      position: 3,
      name: "นายกเทศมนตรี",
      title: "นายรุ่งโรจน์ กิติพิศาลกุล",
      phone: "063-795-2282",
    },
    {
      position: 4,
      name: "ที่ปรึกษานายกเทศมนตรี",
      title: "นายประดิษฐ โรจนพร",
      phone: "081-686-8366",
    },
    {
      position: 5,
      name: "ที่ปรึกษานายกเทศมนตรี",
      title: "นายประดิษฐ โรจนพร",
      phone: "081-686-8366",
    },
  ];

  return (
    <section className="relative w-full overflow-hidden">
      {/* Gradient */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, rgba(3, 189, 202, 0.89) 0%, rgba(240, 226, 213, 0.89) 99.88%)`,
        }}
      />

      {/* ภาพ banpho_text */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `url('/image/banpho_text.png')`,
          backgroundSize: "60% auto",
          backgroundPosition: "50% 0%",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* ภาพ background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `url('/image/water.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.39,
        }}
      />

      {/* เนื้อหาอยู่ด้านบน */}
      <div className="relative z-10">
        <h2 className="text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold pt-8 sm:pt-12 md:pt-16 pb-4 sm:pb-6 md:pb-8 text-[#1E1E1E]">
          คณะผู้บริหาร
        </h2>

        {/* Management Team 1 - Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 md:gap-6 lg:gap-8 w-full mx-auto justify-center items-end px-2 sm:px-4">
          {managementTeam1.map((member, index) => (
            <ManagementCard
              key={index}
              {...member}
              textColor="text-[#01385F]"
            />
          ))}
        </div>

        {/* Services Section */}
        <div className="relative w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 my-8 sm:my-10 md:my-12">
          <div className="relative bg-white rounded-2xl sm:rounded-3xl md:rounded-4xl shadow-lg px-3 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6">
            <div
              id="servicesGrid"
              className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth justify-start sm:justify-center h-[160px] sm:h-[200px] md:h-[240px]"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {services.map((service, index) => (
                <ServiceItem key={index} {...service} />
              ))}
            </div>
          </div>
        </div>

        {/* Second Management Section */}
        <h2 className="text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold pt-8 sm:pt-12 md:pt-16 pb-4 sm:pb-6 md:pb-8 text-[#01385F]">
          ผู้บริหารส่วนราชการ
        </h2>

        {/* Management Team 2 - Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 md:gap-6 lg:gap-8 w-full mx-auto justify-center items-end px-2 sm:px-4 pb-8 sm:pb-12 md:pb-16">
          {managementTeam2.map((member, index) => (
            <ManagementCard2
              key={index}
              {...member}
              textColor="text-[#01385F]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
