import React from "react";
import Link from "next/link";

// Management Card Component
const ManagementCard = ({
  position,
  name = "ตำแหน่ง",
  title = "ชื่อ........................",
  phone = "เบอร์โทร...............",
  imageSrc = "/image/manager.png",
  textColor = "text-white",
}) => {
  const isLarge = position === 3;

  const textSizeClasses = {
    1: "text-xs sm:text-sm",
    2: "text-sm sm:text-base",
    3: "text-lg sm:text-xl md:text-2xl", // ใหญ่สุด
    4: "text-sm sm:text-base",
    5: "text-xs sm:text-sm",
  };

  return (
    <div className="flex flex-col items-center space-y-2 sm:space-y-4">
      {/* ภาพ */}
      <div
        className={`relative w-full overflow-hidden rounded-lg ${
          isLarge
            ? "max-w-[220px] h-[260px] sm:max-w-[260px] sm:h-[320px] md:max-w-[300px] md:h-[460px]"
            : "max-w-[120px] h-[180px] sm:max-w-[150px] sm:h-[250px] md:max-w-[180px] md:h-[300px] lg:max-w-[215px] lg:h-[360px]"
        }`}
      >
        <img
          src={imageSrc}
          alt={`${name} ${title}`}
          className="w-full h-full object-cover"
          style={{ transform: "scaleX(-1)" }}
        />
        <div
          className="absolute left-2 right-2 bottom-[-10px] pointer-events-none "
          style={{
            height: "40%",
            background:
              "linear-gradient(180deg, transparent 0%, rgba(222, 230, 226, 0.9) 100%)",
            borderRadius: "20px 20px 0 0",
            filter: "blur(10px)",
          }}
        />
      </div>

      {/* ข้อมูล */}
      <div
        className={`w-full overflow-hidden bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] ${
          isLarge
            ? "max-w-[300px] rounded-[14px] sm:rounded-[20px]"
            : "max-w-[180px] sm:max-w-[150px] md:max-w-[180px] lg:max-w-[215px] rounded-[10px] sm:rounded-[17px]"
        }`}
      >
        {/* ส่วนชื่อและตำแหน่ง */}
        <div
          className={`flex flex-col justify-center items-center text-center px-1 sm:px-3 ${
            isLarge
              ? "min-h-[80px] sm:min-h-[90px] md:min-h-[100px]"
              : "h-[55px] sm:h-[55px] md:h-[60px] lg:h-[66px]"
          }`}
        >
          <div
            className={`font-bold ${textColor} ${textSizeClasses[position]} leading-tight`}
          >
            {name}
          </div>
          <div
            className={`opacity-90 leading-tight ${textColor} text-[10px] sm:text-sm mt-0.5 sm:mt-1 px-1`}
          >
            {title}
          </div>
        </div>

        {/* แถบฟ้า */}
        <div
          className={`bg-[#01BDCC] flex items-center justify-center px-1 sm:px-3 ${
            isLarge
              ? "h-[36px] sm:h-[42px] md:h-[48px] rounded-b-[14px] sm:rounded-b-[20px]"
              : "h-[24px] sm:h-[32px] md:h-[36px] rounded-b-[10px] sm:rounded-b-[17px]"
          }`}
        >
          {phone && phone !== "-" ? (
            <a
              href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
              className={`cursor-pointer text-white font-medium  hover:decoration-solid focus:outline-none ${
                isLarge
                  ? "text-base sm:text-lg md:text-xl"
                  : "text-[8px] sm:text-xs md:text-sm"
              }`}
              tabIndex={0}
            >
              {phone}
            </a>
          ) : (
            <span
              className={`text-white font-medium ${
                isLarge
                  ? "text-base sm:text-lg md:text-xl"
                  : "text-[8px] sm:text-xs md:text-sm"
              }`}
            >
              {phone}
            </span>
          )}
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
    1: "text-lg sm:text-xl",
    2: "text-medium sm:text-medium",
    3: "text-sm sm:text-base",
    4: "text-sm sm:text-base",
    5: "text-sm sm:text-base",
    6: "text-sm sm:text-base",
  };

  const imageSizeClass =
    position === 1
      ? "max-w-[180px] md:max-w-[360px] h-[260px] md:h-[500px]"
      : position === 2
      ? "max-w-[180px] md:max-w-[280px] h-[260px] md:h-[400px]"
      : "max-w-[180px] md:max-w-[220px] h-[260px] md:h-[340px]";

  const boxSizeClass =
    position === 1
      ? "max-w-[360px] rounded-[12px] sm:rounded-[20px] shadow-[0_6px_6px_0_rgba(0,0,0,0.25)]"
      : position === 2
      ? "max-w-[280px] sm:max-w-[260px] md:max-w-[280px] rounded-[11px] sm:rounded-[18px] shadow-[0_5px_5px_0_rgba(0,0,0,0.22)]"
      : "max-w-[220px] sm:max-w-[210px] md:max-w-[220px] lg:max-w-[240px] rounded-[10px] sm:rounded-[17px] shadow-[0_5px_5px_0_rgba(0,0,0,0.2)]";

  const boxHeightClass =
    position === 1
      ? "h-[75px] sm:h-[75px] md:h-[85px] lg:h-[90px]"
      : position === 2
      ? "h-[75px] sm:h-[75px] md:h-[82px] lg:h-[87px]"
      : "h-[75px] sm:h-[75px] md:h-[80px] lg:h-[85px]";

  const phoneHeightClass =
    position === 1
      ? "h-[36px] sm:h-[44px] md:h-[48px] rounded-b-[12px] sm:rounded-b-[20px]"
      : position === 2
      ? "h-[36px] sm:h-[42px] md:h-[46px] rounded-b-[11px] sm:rounded-b-[18px]"
      : "h-[36px] sm:h-[40px] md:h-[44px] rounded-b-[10px] sm:rounded-b-[17px]";

  const phoneTextSizeClass =
    position === 1
      ? "text-sm sm:text-base md:text-lg"
      : position === 2
      ? "text-sm sm:text-base md:text-base"
      : "text-sm sm:text-base md:text-lg";

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* ภาพ */}
      <div
        className={`relative w-full overflow-hidden rounded-lg ${imageSizeClass}`}
      >
        <img
          src={imageSrc}
          alt={`${name} ${title}`}
          className="w-full h-full object-cover"
          style={{ transform: "scaleX(-1)" }}
        />
        <div
          className="absolute left-2 right-2 bottom-[-5px] pointer-events-none"
          style={{
            height: "40%",
            background:
              "linear-gradient(180deg, transparent 0%, rgba(222, 230, 226, 0.9) 100%)",
            borderRadius: "20px 20px 0 0",
            filter: "blur(3px)",
          }}
        />
      </div>

      {/* ข้อมูล */}
      <div className={`w-full ${boxSizeClass} overflow-hidden bg-white`}>
        {/* ส่วนชื่อและตำแหน่ง */}
        <div
          className={`flex flex-col justify-center items-center px-3 text-center ${boxHeightClass}`}
        >
          <div
            className={`font-bold ${textColor} ${textSizeClasses[position]} leading-tight`}
          >
            {name}
          </div>
          <div
            className={`opacity-90 leading-tight ${textColor} text-xs sm:text-sm mt-1 px-2`}
          >
            {title}
          </div>
        </div>

        <div
          className={`bg-[#01BDCC] flex items-center justify-center px-4 ${phoneHeightClass}`}
        >
          {phone && phone !== "-" ? (
            <a
              href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
              className={`text-white font-medium ${phoneTextSizeClass} cursor-pointer hover:underline focus:outline-none`}
              tabIndex={0}
            >
              {phone}
            </a>
          ) : (
            <span className={`text-white font-medium ${phoneTextSizeClass}`}>
              {phone}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const ServiceItem = ({ icon, title, path }) => {
  return (
    <Link href={path}>
      <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 min-w-[160px] sm:min-w-[200px] md:min-w-[240px] max-w-[160px] sm:max-w-[200px] md:max-w-[240px] text-center hover:shadow-lg transition-shadow cursor-pointer flex flex-col items-center justify-center h-full">
        <img
          src={icon}
          alt={title}
          className="w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] md:w-[102px] md:h-[102px] object-contain mb-3 sm:mb-4 md:mb-5"
        />
        <span className="text-sm sm:text-base md:text-[20px] font-medium text-gray-700 whitespace-pre-line overflow-hidden text-ellipsis leading-tight">
          {title}
        </span>
      </div>
    </Link>
  );
};

export default function ManagementSection() {
  const services = [
    {
      icon: "/image/manage_item1.png",
      title: "สารจากนายก",
      path: "/integrity",
    },
    {
      icon: "/image/manage_item2.png",
      title: "เจตจำนงสุจริต ของผู้บริหาร",
      path: "/integrity",
    },
    {
      icon: "/image/manage_item3.png",
      title: "รับเเจ้งเรื่องราว ร้องทุกข์",
      path: "/citizen/complaints",
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
      path: "/internal-performance-evaluation",
    },
  ];

  const managementTeam1 = [
    {
      position: 1,
      name: "ที่ปรึกษานายกเทศมนตรี",
      title: "นายประดิษฐ โรจนพร",
      phone: "081-686-8366",
      imageSrc: "/image/Avatar.png",
    },
    {
      position: 2,
      name: "รองนายกเทศมนตรี",
      title: "นายไชยวัฒน์ ศรีวิไลสกุลวงศ์",
      phone: "081-910-0491",
      imageSrc: "/image/Avatar.png",
    },
    {
      position: 3,
      name: "นายกเทศมนตรี",
      title: "นายรุ่งโรจน์ กิติพิศาลกุล",
      phone: "063-795-2282",
      imageSrc: "/image/Avatar.png",
    },
    {
      position: 4,
      name: "รองนายกเทศมนตรี",
      title: "นายจำเนียร  จันทร์สร้อย",
      phone: "086-733-5064",
      imageSrc: "/image/Avatar.png",
    },
    {
      position: 5,
      name: "เลขานุการนายกเทศมนตรี",
      title: "นายณัฐพล วงศ์วัฒน์",
      phone: "062-625-0766",
      imageSrc: "/image/Avatar.png",
    },
  ];

  const managementTeam2 = [
    {
      position: 5,
      name: "ผู้อำนวยการกองช่าง",
      title: "นายพิเชฐ สระอุบล",
      phone: "089-833-3244",
      imageSrc: "/image/Avatar.png",
    },

    {
      position: 3,
      name: "หัวหน้าสำนักปลัด",
      title: "นางสาววิไลรัตน์ ขาวมรดก",
      phone: "092-459-0549",
      imageSrc: "/image/Avatar.png",
    },

    {
      position: 1,
      name: "ปลัดเทศบาล",
      title: "นายวรยศ กิจพานิช",
      phone: "099-261-2498",
      imageSrc: "/image/Avatar.png",
    },

    {
      position: 2,
      name: "รองปลัดเทศบาล",
      title: "นายภูธัชป์   โพธ์สวัสดิ์",
      phone: "099-261-2498",
      imageSrc: "/image/Avatar.png",
    },

    {
      position: 6,
      name: "ผู้อำนวยการกองการศึกษา",
      title: "นายวรยศ กิจพานิช",
      phone: "099-261-2498",
      imageSrc: "/image/Avatar.png",
    },
    {
      position: 4,
      name: "ผู้อำนวยการกองคลัง",
      title: "นางสาวจุฬาลัย มงคลชัยฤกษ์",
      phone: "063-874-4595",
      imageSrc: "/image/Avatar.png",
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

        {/* Management Team 1 - Responsive Grid with better mobile layout */}
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-4 md:gap-6 lg:gap-8 w-full mx-auto justify-center items-end px-1 sm:px-4">
          {/* จัดเรียงใหม่สำหรับ mobile: แถวบน 2 คน แถวล่าง 3 คน */}
          <div className="lg:contents grid grid-cols-3 col-span-3 lg:col-span-5 gap-1 sm:gap-4 md:gap-6 lg:gap-8">
            {/* แถวบนสำหรับ mobile - นายกเทศมนตรีอยู่ตรงกลาง */}
            <div className="lg:hidden col-start-1 col-end-4 flex justify-center mb-2">
              <ManagementCard
                {...managementTeam1[2]}
                textColor="text-[#01385F]"
              />
            </div>

            {/* แถวล่างสำหรับ mobile - 4 คนที่เหลือ */}
            <div className="lg:hidden col-start-1 col-end-4 grid grid-cols-2 gap-1 justify-items-center">
              <ManagementCard
                {...managementTeam1[0]}
                textColor="text-[#01385F]"
              />
              <ManagementCard
                {...managementTeam1[1]}
                textColor="text-[#01385F]"
              />
              <ManagementCard
                {...managementTeam1[3]}
                textColor="text-[#01385F]"
              />
              <ManagementCard
                {...managementTeam1[4]}
                textColor="text-[#01385F]"
              />
            </div>

            {/* Layout สำหรับ desktop (lg ขึ้นไป) */}
            {managementTeam1.map((member, index) => (
              <div key={index} className="hidden lg:block ">
                <ManagementCard {...member} textColor="text-[#01385F]" />
              </div>
            ))}
          </div>
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

        {/* Management Team 2 - Fluid Responsive Layout */}
        <div className="hidden md:block px-4 py-20">
          <div className="grid grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6 xl:gap-8 2xl:gap-12 3xl:gap-16 justify-items-center items-end max-w-7xl 2xl:max-w-none mx-auto">
            <div className="w-full max-w-[200px] lg:max-w-[220px] xl:max-w-[240px] 2xl:max-w-[260px] 3xl:max-w-[280px] min-h-[300px] lg:min-h-[320px] xl:min-h-[340px] 2xl:min-h-[360px]">
              <ManagementCard2
                {...managementTeam2.find((m) => m.position === 1)}
                textColor="text-[#01385F]"
              />
            </div>
            <div className="w-full max-w-[220px] lg:max-w-[240px] xl:max-w-[260px] 2xl:max-w-[280px] 3xl:max-w-[300px] min-h-[320px] lg:min-h-[340px] xl:min-h-[360px] 2xl:min-h-[380px]">
              <ManagementCard2
                {...managementTeam2.find((m) => m.position === 2)}
                textColor="text-[#01385F]"
              />
            </div>
            <div className="w-full max-w-[200px] lg:max-w-[220px] xl:max-w-[240px] 2xl:max-w-[260px] 3xl:max-w-[280px] min-h-[300px] lg:min-h-[320px] xl:min-h-[340px] 2xl:min-h-[360px]">
              <ManagementCard2
                {...managementTeam2.find((m) => m.position === 3)}
                textColor="text-[#01385F]"
              />
            </div>
            <div className="w-full max-w-[200px] lg:max-w-[220px] xl:max-w-[240px] 2xl:max-w-[260px] 3xl:max-w-[280px] min-h-[300px] lg:min-h-[320px] xl:min-h-[340px] 2xl:min-h-[360px]">
              <ManagementCard2
                {...managementTeam2.find((m) => m.position === 4)}
                textColor="text-[#01385F]"
              />
            </div>
            <div className="w-full max-w-[220px] lg:max-w-[240px] xl:max-w-[260px] 2xl:max-w-[280px] 3xl:max-w-[300px] min-h-[320px] lg:min-h-[340px] xl:min-h-[360px] 2xl:min-h-[380px]">
              <ManagementCard2
                {...managementTeam2.find((m) => m.position === 5)}
                textColor="text-[#01385F]"
              />
            </div>
            <div className="w-full max-w-[200px] lg:max-w-[220px] xl:max-w-[240px] 2xl:max-w-[260px] 3xl:max-w-[280px] min-h-[300px] lg:min-h-[320px] xl:min-h-[340px] 2xl:min-h-[360px]">
              <ManagementCard2
                {...managementTeam2.find((m) => m.position === 6)}
                textColor="text-[#01385F]"
              />
            </div>
          </div>
        </div>
        {/* Mobile Layout */}
        <div className="grid grid-cols-2 gap-2 md:hidden justify-items-center">
          {/* กลางบน: ปลัดเทศบาล (position 1) */}
          <div className="col-span-2 flex justify-center max-w-[260px] min-h-[360px] mx-auto mb-1">
            <ManagementCard2
              {...managementTeam2.find((p) => p.position === 1)}
              textColor="text-[#01385F]"
            />
          </div>

          {/* แถว 2: ซ้าย (position 5), ขวา (position 3) */}
          <div className="max-w-[240px] min-h-[340px] mx-auto">
            <ManagementCard2
              {...managementTeam2.find((p) => p.position === 3)}
              textColor="text-[#01385F]"
            />
          </div>
          <div className="max-w-[240px] min-h-[340px] mx-auto">
            <ManagementCard2
              {...managementTeam2.find((p) => p.position === 2)}
              textColor="text-[#01385F]"
            />
          </div>

          {/* กลางล่าง: ผอ.กองคลัง (position 4) */}
          <div className="col-span-2 flex justify-center max-w-[260px] min-h-[360px] mx-auto my-1">
            <ManagementCard2
              {...managementTeam2.find((p) => p.position === 4)}
              textColor="text-[#01385F]"
            />
          </div>

          {/* แถวล่าง: ซ้าย (position 2), ขวา (position 6) */}
          <div className="max-w-[240px] min-h-[340px] mx-auto">
            <ManagementCard2
              {...managementTeam2.find((p) => p.position === 5)}
              textColor="text-[#01385F]"
            />
          </div>
          <div className="max-w-[240px] min-h-[340px] mx-auto">
            <ManagementCard2
              {...managementTeam2.find((p) => p.position === 6)}
              textColor="text-[#01385F]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
