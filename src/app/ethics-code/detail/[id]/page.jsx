"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

export default function EthicsCodeDetailPage({ params }) {
  const router = useRouter();
  const [ethicsData, setEthicsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");

  // Unwrap params using React.use() for Next.js 15+
  const resolvedParams = use(params);
  const ethicsId = resolvedParams?.id;

  // Shared mock data from the main ethics codes page
  const mockData = {
    ethics_codes: [
      {
        id: 1,
        title: "ประมวลจริยธรรมพนักงานส่วนท้องถิ่น ประจำปี 2568",
        files: [
          {
            id: 1,
            name: "ประมวลจริยธรรมพนักงานส่วนท้องถิ่น_2568.pdf",
            type: "application/pdf",
            size: "2.5 MB",
            path: "https://www.banphocity.go.th/news/doc_download/a_240425_143212.pdf"
          }
        ],
        create_date: "2024-01-15T00:00:00.000Z"
      },
      {
        id: 2,
        title: "ประมวลจริยธรรมสมาชิกสภาท้องถิ่น ประจำปี 2568",
        files: [
          {
            id: 2,
            name: "ประมวลจริยธรรมสมาชิกสภาท้องถิ่น_2568.pdf",
            type: "application/pdf",
            size: "2.5 MB",
            path: "https://www.banphocity.go.th/news/doc_download/a_240425_143236.pdf"
          }
        ],
        create_date: "2024-02-10T00:00:00.000Z"
      },
      {
        id: 3,
        title: "ประมวลจริยธรรมผู้บริหารท้องถิ่น ประจำปี 2568",
        files: [
          {
            id: 3,
            name: "ประมวลจริยธรรมผู้บริหารท้องถิ่น_2568.pdf",
            type: "application/pdf",
            size: "2.5 MB",
            path: "https://www.banphocity.go.th/news/doc_download/a_240425_143255.pdf"
          }
        ],
        create_date: "2024-03-05T00:00:00.000Z"
      },
      {
        id: 4,
        title: "ประมวลจริยธรรมสมาชิกสภาท้องถิ่น",
        files: [
          {
            id: 4,
            name: "ประมวลจริยธรรมสมาชิกสภาท้องถิ่น.pdf",
            type: "application/pdf",
            size: "2.5 MB",
            path: "https://www.banphocity.go.th/news/doc_download/a_210223_161349.pdf"
          }
        ],
        create_date: "2024-04-12T00:00:00.000Z"
      },
      {
        id: 5,
        title: "ประมวลจริยธรรมผู้บริหารท้องถิ่น",
        files: [
          {
            id: 5,
            name: "ประมวลจริยธรรมผู้บริหารท้องถิ่น.pdf",
            type: "application/pdf",
            size: "2.5 MB",
            path: "https://www.banphocity.go.th/news/doc_download/a_210223_161425.pdf"
          }
        ],
        create_date: "2024-05-20T00:00:00.000Z"
      },
      {
        id: 6,
        title: "ประกาศคณะกรรมการมาตรฐานการบริหารงานบุคคลส่วนท้องถิ่น เรื่อง ประมวลจริยธรรมพนักงานส่วนท้องถิ่น",
        files: [
          {
            id: 6,
            name: "ประกาศคณะกรรมการมาตรฐานการบริหารงานบุคคลส่วนท้องถิ่น.pdf",
            type: "application/pdf",
            size: "2.5 MB",
            path: "https://www.banphocity.go.th/news/doc_download/a_210223_161306.pdf"
          }
        ],
        create_date: "2024-06-18T00:00:00.000Z"
      }
    ]
  };

  // Function to determine category and generate detailed structure from basic data
  const generateDetailedStructure = (basicEthicsCode) => {
    if (!basicEthicsCode) return null;

    // Determine category based on title
    const getCategory = (title) => {
      if (title.includes("พนักงาน")) return "จริยธรรมพนักงาน";
      if (title.includes("สมาชิกสภา")) return "จริยธรรมสมาชิกสภา";
      if (title.includes("ผู้บริหาร")) return "จริยธรรมผู้บริหาร";
      if (title.includes("ประกาศคณะกรรมการ")) return "ประกาศคณะกรรมการ";
      return "จริยธรรมทั่วไป";
    };

    // Generate description based on category
    const getDescription = (category, title) => {
      switch (category) {
        case "จริยธรรมพนักงาน":
          return "ประมวลจริยธรรมสำหรับพนักงานส่วนท้องถิ่น เพื่อให้การปฏิบัติงานเป็นไปอย่างมีประสิทธิภาพ โปร่งใส และเป็นประโยชน์ต่อส่วนรวม รวมทั้งการยึดมั่นในหลักคุณธรรม จริยธรรม และความซื่อสัตย์สุจริต";
        case "จริยธรรมสมาชิกสภา":
          return "จรรยาบรรณสำหรับสมาชิกสภาท้องถิ่น เพื่อการปฏิบัติหน้าที่ในการพิจารณาข้อบัญญัติ การควบคุมการปฏิบัติงานของฝ่ายบริหาร และการแสดงความคิดเห็นต่อประชาชนอย่างมีหลักการและยุติธรรม";
        case "จริยธรรมผู้บริหาร":
          return "หลักจรรยาบรรณและแนวทางการปฏิบัติสำหรับผู้บริหารระดับสูงในองค์กรปกครองส่วนท้องถิ่น เพื่อการบริหารงานที่มีธรรมาภิบาล มีความโปร่งใส และเป็นประโยชน์สูงสุดต่อประชาชน";
        case "ประกาศคณะกรรมการ":
          return "ประกาศและข้อกำหนดจากคณะกรรมการมาตรฐานการบริหารงานบุคคลส่วนท้องถิ่น เกี่ยวกับประมวลจริยธรรมและแนวทางการปฏิบัติที่พนักงานส่วนท้องถิ่นต้องยึดถือปฏิบัติ";
        default:
          return "ประมวลจริยธรรมและข้อปฏิบัติสำหรับบุคลากรในองค์กรปกครองส่วนท้องถิ่น เพื่อการทำงานที่มีประสิทธิภาพและเป็นประโยชน์ต่อส่วนรวม";
      }
    };

    // Generate sections based on category
    const generateSections = (category, files) => {
      const baseSections = [
        {
          id: 1,
          title: "หลักการทั่วไป",
          content: "หลักการพื้นฐานในการปฏิบัติงานที่ต้องยึดมั่นในความซื่อสัตย์ สุจริต โปร่งใส และเป็นธรรม รวมทั้งการให้ความสำคัญกับผลประโยชน์ส่วนรวมเป็นหลัก",
          files: files.slice(0, 1)
        }
      ];

      switch (category) {
        case "จริยธรรมพนักงาน":
          return [
            ...baseSections,
            {
              id: 2,
              title: "จรรยาบรรณในการปฏิบัติงาน",
              content: "พนักงานส่วนท้องถิ่นต้องปฏิบัติงานด้วยความซื่อสัตย์สุจริต ไม่เอาเปรียบตำแหน่งหน้าที่ ไม่รับสินบนหรือของขวัญที่มีมูลค่าเกินกว่าที่กฎหมายกำหนด และต้องให้ความสำคัญกับผลประโยชน์ส่วนรวมเป็นหลัก",
              files: files.length > 1 ? files.slice(1, 2) : []
            },
            {
              id: 3,
              title: "การป้องกันการทุจริต",
              content: "กำหนดมาตรการป้องกันการทุจริตและประพฤติมิชอบ รวมถึงแนวทางการรายงานการกระทำที่ไม่เหมาะสม และขั้นตอนการดำเนินการกับผู้กระทำผิด",
              files: []
            },
            {
              id: 4,
              title: "จริยธรรมในการให้บริการ",
              content: "หลักเกณฑ์การให้บริการประชาชนอย่างเป็นธรรม ไม่เลือกปฏิบัติ มีความเสมอภาค และให้ความสำคัญกับความพึงพอใจของผู้รับบริการ",
              files: []
            }
          ];

        case "จริยธรรมสมาชิกสภา":
          return [
            ...baseSections,
            {
              id: 2,
              title: "หน้าที่และความรับผิดชอบ",
              content: "สมาชิกสภาท้องถิ่นต้องปฏิบัติหน้าที่ในการพิจารณาข้อบัญญัติ การควบคุมการปฏิบัติงานของฝ่ายบริหาร และการแสดงความคิดเห็นต่อประชาชนอย่างมีหลักการ",
              files: files.length > 1 ? files.slice(1, 2) : []
            },
            {
              id: 3,
              title: "การมีส่วนร่วมของประชาชน",
              content: "การส่งเสริมและสนับสนุนให้ประชาชนเข้ามามีส่วนร่วมในการบริหารงานท้องถิ่น รับฟังความคิดเห็น และตอบสนองความต้องการของชุมชน",
              files: []
            }
          ];

        case "จริยธรรมผู้บริหาร":
          return [
            ...baseSections,
            {
              id: 2,
              title: "หลักธรรมาภิบาล",
              content: "หลักการบริหารงานที่มีธรรมาภิบาล ครอบคลุมหลักนิติธรรม หลักความโปร่งใส หลักความรับผิดชอบ หลักความเป็นธรรม หลักการมีส่วนร่วม และหลักความคุ้มค่า",
              files: files.length > 1 ? files.slice(1, 2) : []
            },
            {
              id: 3,
              title: "ความรับผิดชอบต่อสังคม",
              content: "การแสดงความรับผิดชอบต่อสังคมและชุมชน การสร้างการมีส่วนร่วมของประชาชน และการตอบสนองความต้องการของท้องถิ่น",
              files: []
            },
            {
              id: 4,
              title: "การบริหารความเสี่ยง",
              content: "การบริหารจัดการความเสี่ยงในการปฏิบัติงาน การป้องกันปัญหา และการเตรียมพร้อมรับมือกับสถานการณ์ต่างๆ ที่อาจเกิดขึ้น",
              files: []
            }
          ];

        case "ประกาศคณะกรรมการ":
          return [
            ...baseSections,
            {
              id: 2,
              title: "ข้อกำหนดและแนวทางปฏิบัติ",
              content: "ข้อกำหนดและแนวทางการปฏิบัติตามที่คณะกรรมการมาตรฐานการบริหารงานบุคคลส่วนท้องถิ่นกำหนด เพื่อให้การปฏิบัติงานเป็นไปในทิศทางเดียวกัน",
              files: files.length > 1 ? files.slice(1, 2) : []
            },
            {
              id: 3,
              title: "การติดตามและประเมินผล",
              content: "กระบวนการติดตามและประเมินผลการปฏิบัติตามประมวลจริยธรรม รวมถึงการปรับปรุงและพัฒนาอย่างต่อเนื่อง",
              files: []
            }
          ];

        default:
          return baseSections;
      }
    };

    const category = getCategory(basicEthicsCode.title);
    const sections = generateSections(category, basicEthicsCode.files || []);

    return {
      id: basicEthicsCode.id,
      title: basicEthicsCode.title,
      category: category,
      description: getDescription(category, basicEthicsCode.title),
      effective_date: basicEthicsCode.create_date,
      version: basicEthicsCode.title.includes("2568") ? "2.1" : "1.5",
      created_at: basicEthicsCode.create_date,
      updated_at: new Date(new Date(basicEthicsCode.create_date).getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days later
      sections: sections
    };
  };

  useEffect(() => {
    if (ethicsId) {
      fetchEthicsDetail();
    }
  }, [ethicsId]);

  const fetchEthicsDetail = async () => {
    try {
      setLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Find the basic ethics code data by ID
      const basicEthicsCode = mockData.ethics_codes.find(
        (code) => code.id === parseInt(ethicsId)
      );

      if (basicEthicsCode) {
        // Generate detailed structure from basic data
        const detailedData = generateDetailedStructure(basicEthicsCode);
        setEthicsData(detailedData);
        
        // Auto expand first section for better UX
        if (detailedData.sections && detailedData.sections.length > 0) {
          setExpandedSections(new Set([detailedData.sections[0].id]));
        }
      } else {
        throw new Error("ไม่พบข้อมูลประมวลจริยธรรม");
      }
    } catch (error) {
      console.error("Error fetching ethics detail:", error);
      setError(error.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "ไม่ระบุวันที่";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "วันที่ไม่ถูกต้อง";

      const thaiMonths = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
      ];

      const day = date.getDate();
      const month = thaiMonths[date.getMonth()];
      const year = date.getFullYear() + 543;

      return `${day} ${month} ${year}`;
    } catch (error) {
      console.error("Date formatting error:", error);
      return "วันที่ไม่ถูกต้อง";
    }
  };

  const handleDownload = async (filePath, fileName) => {
    try {
      const link = document.createElement("a");
      link.href = filePath;
      link.download = fileName || filePath.split("/").pop();
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download error:", error);
      alert("เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์");
    }
  };

  const getFileIcon = (fileType) => {
    if (!fileType) return "📎";

    const type = fileType.toLowerCase();
    const iconMap = {
      pdf: "📄",
      image: "🖼️",
      jpg: "🖼️",
      jpeg: "🖼️",
      png: "🖼️",
      gif: "🖼️",
      video: "🎥",
      mp4: "🎥",
      avi: "🎥",
      doc: "📝",
      docx: "📝",
      word: "📝",
      excel: "📊",
      xls: "📊",
      xlsx: "📊",
      powerpoint: "📊",
      ppt: "📊",
      pptx: "📊",
    };

    for (const [key, icon] of Object.entries(iconMap)) {
      if (type.includes(key)) return icon;
    }

    return "📎";
  };

  const getEthicsColor = (category) => {
    const colorMap = {
      "จริยธรรมพนักงาน": "#28a745",
      "จริยธรรมสมาชิกสภา": "#6f42c1", 
      "จริยธรรมผู้บริหาร": "#dc3545",
      "ประกาศคณะกรรมการ": "#fd7e14",
      "จริยธรรมทั่วไป": "#01bdcc",
      "ป้องกันทุจริต": "#ffc107",
      "การบริการ": "#6f42c1",
      "การใช้ทรัพยากร": "#fd7e14",
      "ความปลอดภัยข้อมูล": "#20c997",
    };

    return colorMap[category] || "#01bdcc";
  };

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(sectionId)) {
        newExpanded.delete(sectionId);
      } else {
        newExpanded.add(sectionId);
      }
      return newExpanded;
    });
  };

  const expandAll = () => {
    const allSections = new Set(ethicsData?.sections?.map((s) => s.id) || []);
    setExpandedSections(allSections);
  };

  const collapseAll = () => {
    setExpandedSections(new Set());
  };

  // Filter sections based on search term
  const filteredSections =
    ethicsData?.sections?.filter(
      (section) =>
        section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.content.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Loading state with skeleton
  if (loading) {
    return (
      <div
        className="w-full min-h-screen py-8 px-2 md:px-8 flex flex-col items-center bg-transparent"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(239, 228, 212, 0.6) 0%, rgba(1, 189, 204, 0.6) 100%), url("/image/Boat.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="w-full max-w-6xl">
          <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 animate-pulse backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="h-8 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className="w-full min-h-screen py-8 px-2 md:px-8 flex flex-col items-center bg-transparent"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(239, 228, 212, 0.6) 0%, rgba(1, 189, 204, 0.6) 100%), url("/image/Boat.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="w-full max-w-6xl">
          <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-8 text-center backdrop-blur-sm">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              เกิดข้อผิดพลาด
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                ย้อนกลับ
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-[#01bdcc] text-white rounded-lg hover:bg-[#01a5b3] transition-colors focus:outline-none focus:ring-2 focus:ring-[#01bdcc]"
              >
                ลองใหม่
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-screen py-8 px-2 md:px-8 flex flex-col items-center bg-transparent"
      style={{
        backgroundImage:
          'linear-gradient(180deg, rgba(239, 228, 212, 0.6) 0%, rgba(1, 189, 204, 0.6) 100%), url("/image/Boat.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Back Button */}
      <div className="w-full max-w-6xl mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-90 rounded-lg shadow-md hover:bg-opacity-100 transition-all backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="ย้อนกลับ"
        >
          <span className="text-[#01385f]">← ย้อนกลับ</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-6xl">
        <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg overflow-hidden backdrop-blur-sm">
          {/* Header */}
          <div
            className="p-6"
            style={{
              background: `linear-gradient(135deg, ${getEthicsColor(
                ethicsData?.category
              )} 0%, ${getEthicsColor(ethicsData?.category)}dd 100%)`,
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
                  <span className="text-[#01385f] font-bold text-xl">🏛️</span>
                </div>
                <div>
                  <h1 className="text-white text-xl md:text-2xl font-bold drop-shadow">
                    {ethicsData?.title}
                  </h1>
                  <p className="text-white opacity-90">
                    {ethicsData?.category}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-right">
                <div className="text-white text-sm opacity-90">
                  เวอร์ชัน: {ethicsData?.version}
                </div>
                <div className="text-white text-sm opacity-90">
                  มีผลตั้งแต่: {formatDate(ethicsData?.effective_date)}
                </div>
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 md:p-8">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ค้นหาในหัวข้อ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </span>
              </div>
            </div>

            {/* Ethics Info */}
            <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <h2 className="text-2xl font-bold text-[#01385f] mb-3">
                {ethicsData?.title}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {ethicsData?.description}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                <span className="bg-white px-3 py-1 rounded-full">
                  📄 {filteredSections.length} หัวข้อ
                </span>
                <span className="bg-white px-3 py-1 rounded-full">
                  📎{" "}
                  {filteredSections.reduce(
                    (acc, s) => acc + (s.files?.length || 0),
                    0
                  )}{" "}
                  ไฟล์
                </span>
                <span className="bg-white px-3 py-1 rounded-full">
                  🏛️ องค์การบริหารส่วนตำบล
                </span>
              </div>
              <div
                className="inline-block px-4 py-2 rounded-full text-white text-sm font-medium shadow-md"
                style={{
                  backgroundColor: getEthicsColor(ethicsData?.category),
                }}
              >
                {ethicsData?.category}
              </div>
            </div>

            {/* Control Buttons */}
            {filteredSections.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-6">
                <button
                  onClick={expandAll}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  ▼ ขยายทั้งหมด
                </button>
                <button
                  onClick={collapseAll}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  ▲ ย่อทั้งหมด
                </button>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    ✕ ล้างการค้นหา
                  </button>
                )}
              </div>
            )}

            {/* Search Results Info */}
            {searchTerm && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  พบ {filteredSections.length} หัวข้อจากการค้นหา "{searchTerm}"
                </p>
              </div>
            )}

            {/* Sections */}
            <div className="space-y-4">
              {filteredSections.length > 0 ? (
                filteredSections.map((section) => (
                  <div
                    key={section.id}
                    className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Section Header */}
                    <div
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-colors"
                      onClick={() => toggleSection(section.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleSection(section.id);
                        }
                      }}
                      aria-expanded={expandedSections.has(section.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-blue-600 text-lg">🏛️</span>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              {section.title}
                            </h3>
                            <div className="text-sm text-gray-500">
                              {section.files?.length || 0} ไฟล์
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-medium">
                            หัวข้อ {section.id}
                          </span>
                          <span className="text-gray-400 text-xl">
                            {expandedSections.has(section.id) ? "−" : "+"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Section Content */}
                    {expandedSections.has(section.id) && (
                      <div className="p-6 bg-white border-t border-gray-200">
                        {/* Section Description */}
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-gray-700 leading-relaxed">
                            {section.content}
                          </p>
                        </div>

                        {/* Section Files */}
                        {section.files && section.files.length > 0 ? (
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                              <span>📎</span>
                              ไฟล์เอกสาร ({section.files.length} ไฟล์)
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {section.files.map((file) => {
                                const fileName =
                                  file.name ||
                                  file.path?.split("/").pop() ||
                                  `ไฟล์ ${file.id}`;
                                return (
                                  <div
                                    key={file.id}
                                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-r from-white to-gray-50"
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <span className="text-2xl">
                                          {getFileIcon(file.type)}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                          <p
                                            className="font-medium text-gray-800 truncate"
                                            title={fileName}
                                          >
                                            {fileName}
                                          </p>
                                          <div className="text-xs text-gray-500">
                                            <span>{file.size}</span>
                                            <span className="mx-1">•</span>
                                            <span>
                                              {formatDate(file.created_at || ethicsData.created_at)}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="ml-3 flex flex-col gap-2">
                                        <button
                                          onClick={() =>
                                            handleDownload(file.path, fileName)
                                          }
                                          className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          aria-label={`ดาวน์โหลด ${fileName}`}
                                        >
                                          ดาวน์โหลด
                                        </button>
                                        <button
                                          onClick={() =>
                                            window.open(
                                              file.path,
                                              "_blank",
                                              "noopener,noreferrer"
                                            )
                                          }
                                          className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-green-500"
                                          aria-label={`ดูไฟล์ ${fileName}`}
                                        >
                                          ดูไฟล์
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <span className="text-4xl">📭</span>
                            <p className="text-lg mt-2">ไม่มีไฟล์ในหัวข้อนี้</p>
                            <p className="text-sm mt-1">
                              กรุณาเพิ่มไฟล์ในระบบจัดการ
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <span className="text-6xl">{searchTerm ? "🔍" : "🏛️"}</span>
                  <p className="text-xl mt-4">
                    {searchTerm
                      ? "ไม่พบผลการค้นหา"
                      : "ไม่มีหัวข้อในประมวลจริยธรรมนี้"}
                  </p>
                  <p className="text-sm mt-1">
                    {searchTerm
                      ? "ลองใช้คำค้นหาอื่น"
                      : "กรุณาเพิ่มหัวข้อในระบบจัดการ"}
                  </p>
                </div>
              )}
            </div>

            {/* Summary Statistics */}
            {ethicsData?.sections && ethicsData.sections.length > 0 && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">สรุปสถิติ</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {ethicsData.sections.length}
                    </div>
                    <div className="text-sm text-gray-600">หัวข้อทั้งหมด</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {ethicsData.sections.reduce((acc, s) => acc + (s.files?.length || 0), 0)}
                    </div>
                    <div className="text-sm text-gray-600">ไฟล์ทั้งหมด</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {ethicsData.sections.filter(s => s.files && s.files.length > 0).length}
                    </div>
                    <div className="text-sm text-gray-600">หัวข้อที่มีไฟล์</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {ethicsData.version}
                    </div>
                    <div className="text-sm text-gray-600">เวอร์ชันปัจจุบัน</div>
                  </div>
                </div>
              </div>
            )}

            {/* Implementation Status */}
            <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">สถานะการใช้งาน</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-green-600 text-xl">✅</span>
                  <div>
                    <div className="text-sm text-gray-600">สถานะ</div>
                    <div className="font-medium text-green-600">มีผลบังคับใช้</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-blue-600 text-xl">📅</span>
                  <div>
                    <div className="text-sm text-gray-600">วันที่มีผลบังคับใช้</div>
                    <div className="font-medium text-gray-800">{formatDate(ethicsData?.effective_date)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-purple-600 text-xl">📝</span>
                  <div>
                    <div className="text-sm text-gray-600">เวอร์ชันล่าสุด</div>
                    <div className="font-medium text-gray-800">v{ethicsData?.version}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Information */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">ข้อมูลเพิ่มเติม</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-gray-600">หน่วยงานที่รับผิดชอบ:</span>
                  <span className="ml-2 text-gray-800">องค์การบริหารส่วนตำบลบ้านโพธิ์</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-600">ขอบเขตการใช้:</span>
                  <span className="ml-2 text-gray-800">
                    {ethicsData?.category === "จริยธรรมพนักงาน" ? "พนักงานส่วนตำบลทุกระดับ" :
                     ethicsData?.category === "จริยธรรมสมาชิกสภา" ? "สมาชิกสภาท้องถิ่นทุกคน" :
                     ethicsData?.category === "จริยธรรมผู้บริหาร" ? "ผู้บริหารระดับสูง" : 
                     "บุคลากรในองค์กร"}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-600">การทบทวน:</span>
                  <span className="ml-2 text-gray-800">ทุก 2 ปี หรือเมื่อมีความจำเป็น</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-600">ติดต่อสอบถาม:</span>
                  <span className="ml-2 text-gray-800">กองการเจ้าหน้าที่ โทร. 0-XXXX-XXXX</span>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-500">
                อัพเดทล่าสุด: {formatDate(ethicsData?.updated_at)}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                  aria-label="พิมพ์เอกสาร"
                >
                  🖨️ พิมพ์
                </button>
                <button
                  onClick={() => router.push("/ethics-code")}
                  className="px-4 py-2 bg-[#01bdcc] text-white rounded-lg hover:bg-[#01a5b3] transition-colors focus:outline-none focus:ring-2 focus:ring-[#01bdcc]"
                >
                  กลับหน้าหลัก
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}