"use client";
import Link from "next/link";
import {
  RestOutlined,
  DeleteOutlined,
  EditOutlined,
  CarOutlined,
} from "@ant-design/icons";
import { GlassWater, Trash } from "lucide-react";

export default function EServicePage() {
  const services = [
    {
      id: 1,
      title: "แบบคำร้องขอสนับสนุนน้ำอุปโภค-บริโภค",
      description: "ยื่นคำร้องขอรับการสนับสนุนน้ำสะอาดสำหรับการอุปโภคและบริโภค",
      icon: <GlassWater style={{ fontSize: 40 }} />,
      color: "from-blue-500 to-blue-600",
      link: "/e-service/water-support-request",
    },
    {
      id: 2,
      title: "แบบขอรับถังขยะมูลฝอย และสิ่งปฏิกูล",
      description: "ยื่นคำร้องขอรับถังขยะสำหรับจัดเก็บขยะมูลฝอยและสิ่งปฏิกูล",
      icon: <DeleteOutlined style={{ fontSize: 40 }} />,
      color: "from-green-500 to-green-600",
      link: "/e-service/wastebin-request-form",
    },
    {
      id: 3,
      title: "คำร้องทั่วไป",
      description: "ยื่นคำร้องขอรับบริการหรือแจ้งเรื่องราวต่างๆ แก่เทศบาล",
      icon: <EditOutlined style={{ fontSize: 40 }} />,
      color: "from-purple-500 to-purple-600",
      link: "/e-service/general-request",
    },
    {
      id: 4,
      title: "คำร้องขอรับบริการจัดเก็บขยะ",
      description: "ยื่นคำร้องขอรับบริการจัดเก็บขยะจากเทศบาล",
      icon: <RestOutlined style={{ fontSize: 40 }} />,
      color: "from-orange-500 to-orange-600",
      link: "/e-service/waste-collection",
    },
  ];

  return (
    <div
      className="w-full min-h-screen py-8 px-2 md:px-8 flex flex-col items-center bg-transparent"
      style={{
        backgroundImage:
          'linear-gradient(180deg, rgba(239, 228, 212, 0.6) 0%, rgba(1, 189, 204, 0.6) 100%), url("/image/Boat.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Header Section */}
      <div className="w-full max-w-[1268px] flex flex-col gap-4 mb-8">
        <div className="bg-gradient-to-r from-[#03bdca] to-[#01bdcc] rounded-[36px] shadow-lg w-full flex flex-col md:flex-row items-center px-6 py-6 relative backdrop-blur-sm">
          <div className="bg-white rounded-full shadow-md w-32 h-16 flex items-center justify-center mb-4 md:mb-0 md:absolute md:left-6 md:top-1/2 md:-translate-y-1/2 border-2 border-[#01bdcc]">
            <span className="text-[#01385f] font-bold text-xl tracking-wide">
              E-Service
            </span>
          </div>
          <div className="flex-1 flex flex-wrap flex-row items-center justify-center gap-6 md:gap-12 md:ml-40">
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              บริการออนไลน์
            </span>
            <span className="text-white font-semibold text-lg md:text-2xl drop-shadow-lg">
              Electronic Service
            </span>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="w-full max-w-[1268px]">
        <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-[#01385f] text-center mb-8">
            เลือกบริการที่ต้องการ
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <Link
                key={service.id}
                href={service.link}
                className={`block p-6 rounded-xl shadow-md cursor-pointer transform hover:scale-105 transition-all duration-200 bg-gradient-to-br ${service.color} text-white`}
              >
                <div className="text-center">
                  <div className="mb-4 flex justify-center">{service.icon}</div>
                  <h3 className="text-lg font-semibold mb-3">
                    {service.title}
                  </h3>
                  <p className="text-sm opacity-90 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="mt-4">
                    <span className="inline-block bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm font-medium">
                      คลิกเพื่อยื่นคำร้อง →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Information */}
      <div className="w-full max-w-[1268px] mt-8">
        <div className="bg-white bg-opacity-90 rounded-2xl shadow-md p-6 backdrop-blur-sm text-center">
          <h4 className="text-lg font-semibold text-[#01385f] mb-2">
            บริการออนไลน์ E-Service
          </h4>
          <p className="text-gray-600 text-sm">
            เทศบาลตำบลบ้านโพธิ์ มุ่งมั่นให้บริการประชาชนด้วยระบบดิจิทัล
            เพื่อความสะดวก รวดเร็ว และโปร่งใส
          </p>
        </div>
      </div>
    </div>
  );
}
