import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Starting EGP API request...");

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout

    // Fetch data from external EGP API
    const response = await fetch(
      "https://egp.sosmartsolution.com/api.php?deptsub=1509900857",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(
      "Successfully fetched EGP data, count:",
      data.data?.length || "unknown"
    );

    // Return the data with CORS headers
    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    console.error("EGP API proxy error:", error.message);
    console.error("Error code:", error.code);
    console.error("Error response:", error.response?.status);

    // Return comprehensive EGP fallback data when external API fails
    const fallbackData = {
      success: true,
      data: [
        {
          deptsub_id: "1509900857",
          announce_type: "15",
          title:
            "ประกวดราคาจ้างก่อสร้างโครงการก่อสร้างอาคารสำนักงานเทศบาลตำบลบ้านโพธิ์ ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
          link: "https://process5.gprocurement.go.th/egp-upload-service/v1/downloadFileTest?fileId=85ee437146634121aa32686ccf7df250",
          pub_date: "2025-08-04",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "D0",
          title:
            "ประกวดราคาจ้างก่อสร้างโครงการก่อสร้างอาคารสำนักงานเทศบาลตำบลบ้านโพธิ์ ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
          link: "https://process5.gprocurement.go.th/egp-template-service/dwnt/view-pdf-file?templateId=db7c27d6-0e09-4bad-8406-e6261687771b",
          pub_date: "2025-08-04",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W1",
          title:
            "จ้างเหมารถยนต์โดยสารปรับอากาศแบบมาตรฐาน ม๔(ข) ขนาดไม่น้อยกว่า ๔๔ ที่นั่ง จำนวน ๑ คัน โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68079475717&templateType=W2&temp_Announ=D&temp_itemNo=1&seqNo=2",
          pub_date: "2025-07-31",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title: "ซื้อวัสดุยานพาหนะและขนส่ง จำนวน ๒ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68079483156&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-07-30",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "ซื้อสารส้มก้อนรวมค่าขนส่ง  บรรจุถุงละ ๒๕ กิโลกรัม  จำนวน  ๗  ตัน โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68079454277&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-07-30",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "B0",
          title:
            "ประกวดราคาจ้างก่อสร้างโครงการก่อสร้างอาคารสำนักงานเทศบาลตำบลบ้านโพธิ์ ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
          link: "https://process5.gprocurement.go.th/egp-upload-service/v1/downloadFileTest?fileId=00eb0ed957094c72819988f36fbc9ce4",
          pub_date: "2025-07-25",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W1",
          title: "ซื้อวัสดุก่อสร้าง จำนวน ๒๖ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68079334130&templateType=W2&temp_Announ=D&temp_itemNo=1&seqNo=2",
          pub_date: "2025-07-24",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "ซื้อคลอรีนน้ำ ๑๐ %  (๑๐๐๐ กก/IBC)  จำนวน  ๒,๐๐๐  กิโลกรัม โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68079068301&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-07-09",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างจัดทำป้ายไวนิลประกาศผลรวมคะแนนการเลือกตั้งสมาชิกสภาเทศบาลตำบลบ้านโพธิ์ เขตเลือกตั้งที่ ๒ ใหม่ จำนวน ๑ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68069566101&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-06-30",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างซ่อมบำรุงรักษารถบรรทุกขยะอัดท้าย ชนิด ๖ ล้อ หมายเลขทะเบียน ๘๒-๙๙๑๘ ฉะเชิงเทรา รหัสครุภัณฑ์ ๐๑๑-๕๙-๐๐๐๓ จำนวน ๑ คัน โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68069604267&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-06-30",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "ซื้อวัสดุโครงการอบรมเจ้าพนักงานผู้ดำเนินการเลือกตั้งประจำหน่วยเลือกตั้ง (การเลือกตั้งสมาชิกสภาเทศบาลตำบลบ้านโพธิ์ เขตเลือกตั้งที่ ๒ ใหม่) จำนวน ๒๗ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68069550941&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-06-27",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "ซื้อวัสดุอุปกรณ์ประจำหน่วยเลือกตั้ง จำนวน ๒๖ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68069558534&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-06-27",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างเหมาแม็คโครขุดซ่อมท่อเมนประปา  บริเวณถนนเทศบาล ๑๐ ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68069230994&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-06-24",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "P0",
          title: "จัดซื้ออาหารเสริม (นม) เดือนมิถุนายน - ตุลาคม ๒๕๖๘",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=M68060007097&templateType=P0&temp_Announ=P&temp_itemNo=&seqNo=",
          pub_date: "2025-06-11",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "ซื้อวัสดุวิทยาศาสตร์หรือการแพทย์ จำนวน ๓ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68069068232&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-06-10",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างซ่อมบำรุงรถยนต์บรรทุก (ดีเซล) หมายเลขทะเบียน กบ-๕๖๘๒ ฉะเชิงเทรา หมายเลขครุภัณฑ์ ๐๐๑-๖๒-๐๐๐๒ จำนวน ๑ คัน โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68059431409&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-05-27",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "ซื้อน้ำดื่มประจำเดือนพฤษภาคม ๒๕๖๘ จำนวน ๔ ถัง โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68059417345&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-05-23",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "ซื้อสารส้มก้อนรวมค่าขนส่ง  (บรรจุถุงละ ๒๕ กิโลกรัม)  จำนวน  ๗ ตัน โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68059278873&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-05-23",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "ประกวดราคาซื้อจัดซื้อรถยนต์บรรทุกน้ำอเนกประสงค์ ชนิด ๖ ล้อ กำลังแรงม้าไม่น้อยกว่า ๑๗๐ แรงม้า ความจุน้ำ ไม่น้อยกว่า ๔,๐๐๐ ลิตร จำนวน ๑ คัน ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
          link: "https://process5.gprocurement.go.th/egp-template-service/dwnt/view-pdf-file?templateId=b819e81f-68be-481a-bf67-8b5a4e5d524f",
          pub_date: "2025-05-16",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title: "ซื้อวัสดุงานบ้านงานครัว จำนวน ๑ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68049454807&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-05-01",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title: "จ้างจัดทำป้ายไวนิล จำนวน ๖ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68049412372&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-04-25",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างก่อสร้างโครงการถนนลูกรังเลียบคลองหลอดยอ หมู่ที่ ๒ ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา จำนวน ๑ งาน โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68049242042&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-04-22",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "ซื้อครุภัณฑ์สำนักงาน (โต๊ะทำงาน จำนวน ๒ ตัว, เก้าอี้ จำนวน ๒ ตัว) จำนวน ๔ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68049278670&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-04-22",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title: "จ้างทำป้ายไวนิล จำนวน ๒ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68049175673&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-04-21",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "15",
          title:
            "ประกวดราคาซื้อจัดซื้อรถยนต์บรรทุกน้ำอเนกประสงค์ ชนิด ๖ ล้อ กำลังแรงม้าไม่น้อยกว่า ๑๗๐ แรงม้า ความจุน้ำ ไม่น้อยกว่า ๔,๐๐๐ ลิตร จำนวน ๑ คัน ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
          link: "https://process5.gprocurement.go.th/egp-upload-service/v1/downloadFileTest?fileId=006a9a413f954eff8f6e50df424f6077",
          pub_date: "2025-04-08",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "D0",
          title:
            "ประกวดราคาซื้อจัดซื้อรถยนต์บรรทุกน้ำอเนกประสงค์ ชนิด ๖ ล้อ กำลังแรงม้าไม่น้อยกว่า ๑๗๐ แรงม้า ความจุน้ำ ไม่น้อยกว่า ๔,๐๐๐ ลิตร จำนวน ๑ คัน ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
          link: "https://process5.gprocurement.go.th/egp-template-service/dwnt/view-pdf-file?templateId=eaf30e30-c838-4721-88b5-904f2199ea27",
          pub_date: "2025-04-08",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "ซื้อครุภัณพ์คอมพิวเตอร์หรืออิเล็กทรอนิกส์ (เครื่องคอมพิวเตอร์,เครื่องพิมพ์,เครื่องสำรองไฟ) จำนวน ๓ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68049119317&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-04-08",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W1",
          title:
            "จ้างออกแบบแปลนอาคารป้องกันและบรรเทาสาธารณภัย เทศบาลตำบลบ้านโพธิ์ หมู่ที่ ๑ ตำบลบ้านโพธิ์ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68039436999&templateType=W2&temp_Announ=D&temp_itemNo=1&seqNo=2",
          pub_date: "2025-03-27",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title: "จ้างจัดทำป้ายไวนิล จำนวน ๑ ป้าย โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68039329645&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-03-20",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W1",
          title: "ซื้อวัสดุยานพาหนะและขนส่ง จำนวน ๒ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68039206644&templateType=W2&temp_Announ=D&temp_itemNo=1&seqNo=2",
          pub_date: "2025-03-18",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title: "ซื้อวัสดุเครื่องแต่งกาย จำนวน ๒ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68039218923&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-03-12",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "ซื้อสารส้มก้อนรวมค่าขนส่ง บรรจุถุงละ ๒๕ กิโลกรัม จำนวน ๗ ตัน โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68039222180&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-03-12",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W1",
          title: "จ้างเหมาเจาะสำรวจชั้นดิน จำนวน ๓ หลุม โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68029490475&templateType=W2&temp_Announ=D&temp_itemNo=1&seqNo=2",
          pub_date: "2025-03-12",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "ซื้อคลอรีนน้ำ ๑๐ %  (๑๐๐๐ nn/IBC) จำนวน  ๒,๐๐๐  กิโลกรัม โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68039178165&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-03-10",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างเหมาสูบน้ำดิบเข้าบ่อกักเก็บน้ำดิบ ประปาเทศบาล จำนวน ๑ บ่่อ หมู่ที่ ๑ ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68039010532&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-03-03",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title: "ซื้อวัสดุคอมพิวเตอร์ จำนวน ๖ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68029457602&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-02-28",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title: "ซื้อวัสดุสำนักงาน จำนวน ๒๖ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68029503101&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-02-28",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title: "ซื้อวัสดุไฟฟ้าและวิทยุ  จำนวน ๑ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68029320283&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-02-27",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title: "ซื้อวัสดุก่อสร้าง  จำนวน ๙ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68019398191&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-02-21",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างซ่อมรถนั่งสองตอนท้ายบรรทุก หมายเลขทะเบียน กข-๓๐๗๒ ฉะเชิงเทรา โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68029224430&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-02-18",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "ซื้อคลอรีนน้ำ  ๑๐%  (๑๐๐๐ nn/IBC)  จำนวน  ๒,๐๐๐ กิโลกรัม โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68029130701&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-02-18",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "P0",
          title: "โครงการก่อสร้างอาคารสำนักงานเทศบาลตำบลบ้านโพธิ์",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=M68020011474&templateType=P0&temp_Announ=P&temp_itemNo=&seqNo=",
          pub_date: "2025-02-17",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "ซื้อครุภัณฑ์โฆษณาและแผยแพร่ (เครื่องมัลติมีเดียโปรเจคเตอร์ ระดับ XGA) จำนวน ๑ เครื่อง โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68029226631&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-02-17",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างซ่อมรถฟาร์มแทรกเตอร์ ติดตั้งเครื่องตัดหญ้าไหล่ทาง หมายเลขทะเบียน ตค-๑๖๔๖ ฉะเชิงเทรา จำนวน ๑ คัน โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68029196898&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-02-14",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างเหมาซ่อมแซมท่อสูบน้ำดิบผลิตน้ำประปา หมู่ที่ ๓ พร้อมล้างหอถังสูง หมายเลขครุภัณฑ์ ๑๐๘-๖๕-๐๐๐๓ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68029229037&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-02-14",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "P0",
          title:
            "จัดซื้อรถยนต์บรรทุกน้ำอเนกประสงค์ ชนิด ๖ ล้อ กำลังแรงม้าไม่น้อยกว่า ๑๗๐ แรงม้า ความจุน้ำ ไม่น้อยกว่า ๔,๐๐๐ ลิตร จำนวน ๑ คัน",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=M68020003889&templateType=P0&temp_Announ=P&temp_itemNo=&seqNo=",
          pub_date: "2025-02-10",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างโครงการขยายท่อเมนประปาบริเวณถนน  ๓๑๒๒  (ดอนสีนนท์ - บ้านโพธิ์)   และถนนเทศบาลตำบลบ้านโพธิ์ ๑๗ หมู่ที่ ๑ ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา   โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68029082733&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-02-10",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างเหมาจัดทำป้ายไวนิลขึงโครงไม้พร้อมติดตั้ง จำนวน ๖ ป้าย โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68029093540&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-02-06",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title: "ซื้อวัสดุก่อสร้าง จำนวน ๖ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68019276581&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-01-23",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title: "ซื้อวัสดุคอมพิวเตอร์ จำนวน ๑๑ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68019295777&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-01-17",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title: "ซื้อวัสดุสำนักงาน จำนวน ๒๔ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68019143744&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-01-16",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title: "ซื้อวัสดุไฟฟ้าและวิทยุ จำนวน ๑๒ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68019248299&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-01-15",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title: "ซื้อวัสดุสำนักงาน จำนวน ๑๑ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68019388631&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-01-15",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างซ่อมเครื่องถ่ายเอกสาร หมายเลขครุภัณฑ์ ๔๑๗-๖๐-๐๐๐๕ จำนวน ๑ เครื่อง โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68019123413&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-01-13",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "ซื้อสารส้มก้อนรวมค่าขนส่ง   บรรจุถุงละ ๒๕ กิโลกรัม  จำนวน  ๗ ตัน โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68019064174&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-01-10",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างซ่อมแซมมอเตอร์ปั๊มขนาด ๒๐ แรงม้า  พร้อมอุปกรณ์ติดตั้งระบบประปาหมู่ที่ ๑  หมายเลขครุภัณฑ์   ๑๐๘-๔๖-๐๐๐๑ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68019058425&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-01-09",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "ซื้อคลอรีนน้ำ ๑๐ %  (๑๐๐๐ nn/IBC)  จำนวน  ๒,๐๐๐  กิโลกรัม โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67129437351&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-01-07",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างซ่อมบำรุงรักษาครุภัณฑ์งานบ้านงานครัว จำนวน 3 รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67129390496&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2025-01-03",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างซ่อมบำรุง รถยนต์บรรทุก (ดีเซล) หมายเลขทะเบียน กบ-5682 ฉะเชิงเทรา จำนวน 1 คัน โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67129493491&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-12-26",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างเหมาบริการกำจัดขยะมูลฝอย ประจำปีงบประมาณ ๒๕๖๘ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67129488779&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-12-26",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W1",
          title: "ซื้อวัสดุไฟฟ้าและวิทยุ จำนวน ๓ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67129245743&templateType=W2&temp_Announ=D&temp_itemNo=1&seqNo=2",
          pub_date: "2024-12-18",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "ซื้อวัสดุคอมพิวเตอร์ หมึกเครื่องปริ้นเตอร์ RICOH และ หมึกเครื่องปริ้นเตอร์ EPSON จำนวน ๘ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67129231954&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-12-16",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างซ่อมกล้องโทรทัศน์วงจรปิด (CCTV) หมายเลขครุภัณฑ์ ๔๘๒-๖๑-๐๐๐๖ จำนวน ๑ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67129177020&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-12-13",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "ซื้อชุดกีฬาพร้อมอุปกรณ์ โครงการจัดส่งนักกีฬาเข้าร่วมแข่งขันระดับจังหวัด ประจำปี ๒๕๖๗ จำนวน ๓ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67129222310&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-12-13",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "ประกวดราคาจ้างก่อสร้างโครงการติดตั้งสัญญาณไฟจราจร(ไฟเขียว-ไฟแดง) หมู่ที่ 1 ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
          link: "https://process5.gprocurement.go.th/egp-template-service/dwnt/view-pdf-file?templateId=a8ccc7d9-37f3-4795-ba2e-34f63d709834",
          pub_date: "2024-12-12",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างเหมาถางป่าและขุดตอ (ขนาดกลาง) วัชพืชบริเวณรอบและในบ่อประปาเทศบาลตำบลบ้านโพธิ์ หมู่ที่ ๑ ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์   คิดเป็นพื้นที่โดยประมาณ ๔,๖๘๕ ตารางเมตร โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67119540963&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-12-03",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title: "ซื้อวัสดุคอมพิวเตอร์ จำนวน ๔ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67119529232&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-12-03",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "ซื้อคลอรีนน้ำ ๑๐ %  (๑๐๐๐ nn/IBC) จำนวน  ๒,๐๐๐  กิโลกรัม โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67119418799&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-11-29",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างเหมาซ่อมแซมตู้คอนโทรลไฟสาธารณะบริเวณหน้าที่ว่าการอำเภอบ้านโพธิ์ จำนวน ๑ ชุด โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67119447938&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-11-25",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "15",
          title:
            "ประกวดราคาจ้างก่อสร้างโครงการติดตั้งสัญญาณไฟจราจร(ไฟเขียว-ไฟแดง) หมู่ที่ 1 ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
          link: "https://process5.gprocurement.go.th/egp-upload-service/v1/downloadFileTest?fileId=c0de6ebe9db84fe4be8e4898cd3095bd",
          pub_date: "2024-11-08",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "D0",
          title:
            "ประกวดราคาจ้างก่อสร้างโครงการติดตั้งสัญญาณไฟจราจร(ไฟเขียว-ไฟแดง) หมู่ที่ 1 ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
          link: "https://process5.gprocurement.go.th/egp-template-service/dwnt/view-pdf-file?templateId=9c5c62da-02ea-4a95-befa-a373772fc682",
          pub_date: "2024-11-08",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างจัดทำอาหารสำหรับเจ้าหน้าที่ขบวนแห่หลวงพระพุทธโสธรทางน้ำและเจ้าหน้าที่ที่เกี่ยวข้อง จำนวน ๑๓๙ กล่อง และจ้างทำภัตตาหารเพลสำหรับถวายพระสงฆ์ จำนวน ๒ ชุด โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67119149378&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-11-08",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "ซื้อวัสดุคอมพิวเตอร์ (TONER BROTHER TN-๒๖๙  BK) จำนวน  ๒  กล่อง โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67109375378&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-11-06",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "ซื้อวัสดุอุปกรณ์ในการจัดสถานที่ จำนวน ๑๑ รายการ และซื้อวัสดุอุปกรณ์สำหรับตกแต่งโต๊ะหมู่บูชา จำนวน ๒ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67119091957&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-11-06",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "ซื้อไข่ไก่ต้ม ดอกไม้ ธูปเทียน และผลไม้ ๕ อย่างพร้อมน้ำ และพวงมาลัยสำหรับคล้องเชิงเทียนและกระถางธูป โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67119030727&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-11-04",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "ซื้อคลอรีนน้ำ ๑๐% (๑๐๐๐ กิโลกรัม/IBC)  จำนวน ๒,๐๐๐ กิโลกรัม โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67109269453&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-10-25",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "ซื้อโครงการจัดซื้ออาหารเสริม นม  ให้กับนักเรียนโรงเรียนวัดสนามจันทร์และเด็กเล็กของศูนย์พัฒนาเด็กเล็กเทศบาลตำบลบ้านโพธิ์ เดือนพฤศจิกายน ๒๕๖๗ ถึงเดือนพฤษภาคม ๒๕๖๘ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67109282523&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-10-24",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "ซื้อสารส้มก้อนรวมค่าขนส่ง บรรจุถุงละ ๒๕ กิโลกรัม  จำนวน ๗  ตัน โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67109245898&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-10-22",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "P0",
          title:
            "โครงการจัดซื้ออาหารเสริม(นม) ให้กับนักเรียนโรงเรียนวัดสนามจันทร์และเด็กเล็กของศูนย์พัฒนาเด็กเล็กเทศบาลตำบลบ้านโพธิ์ เดือนพฤศจิกายน 2567-พฤษภาคม 2568",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=M67100022085&templateType=P0&temp_Announ=P&temp_itemNo=&seqNo=",
          pub_date: "2024-10-18",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "P0",
          title:
            "โครงการปรับปรุงถนนผิวจราจรแอสฟัลท์ติกคอนกรีต(Overlay) ถนนสายเทศบาลบ้านโพธิ์ 1 และ 6 หมู่ที่ 1 ตำบลบ้านโพธิ์",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=M67100021491&templateType=P0&temp_Announ=P&temp_itemNo=&seqNo=",
          pub_date: "2024-10-18",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title: "ซื้อวัสดุงานบ้านงานครัว จำนวน ๒ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67099437117&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-09-19",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างเหมาเปลี่ยนท่อเมนประปาบริเวณตึกอาคารพาณิชย์   ข้างบริเวณไปรษณีย์ไทยสาขาบ้านโพธิ์  อำเภอบ้านโพธิ์  จังหวัดฉะเชิงเทรา โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67099395595&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-09-18",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title: "ซื้อวัสดุสำนักงาน จำนวน ๑๔ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67099353502&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-09-16",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "ซื้อครุภัณฑ์คอมพิวเตอร์หรืออิเล็กทรอนิกส์ จำนวน ๑ เครื่อง โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67099165963&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-09-12",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างเช่ารถยนต์โดยสารปรับอากาศแบบมาตรฐาน ม.๔(ข) ขนาดไม่เกิน ๔๕ ที่นั่ง จำนวน ๑ คัน โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67099091535&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-09-06",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างซ่อมปั๊มจ่ายสารเคมี (ปั๊มคลอรีน) ๑๒๐L/hr หมายเลขครุภัณฑ์ ๑๐๘-๔๖-๐๐๐๑ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67089644061&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-09-03",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างเหมาสูบน้ำดิบออกจากบ่อกักเก็บน้ำดิบ ประปาเทศบาล หมู่ที่ ๓  รวมพื้นที่โดยประมาณ ๑๖ ไร่ ระดับน้ำที่สูบออก ๑.๕๐ เมตร หรือคิดเป็นปริมาตรน้ำ ๓๘,๔๐๐ ลูกบาศก์เมตร โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67089667922&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-08-30",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "ซื้อผ้าอ้อมผู้ใหญ่ ในโครงการสนับสนุนผ้าอ้อมผู้ใหญ่ และแผ่นรองซับการขับถ่ายสำหรับบุคคลที่มีภาวะพึ่งพิงและบุคคลที่มีภาวะปัญหาการกลั้นปัสสาวะหรืออุจจาระไม่ได้ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67089662399&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-08-30",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างบำรุงรักษาและซ่อมแซมรถบรรทุกน้ำดับเพลิง หมายเลขทะเบียน บว-๘๙๕๖ ฉะเชิงเทรา โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67089584849&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-08-29",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างบำรุงรักษาซ่อมเเซมและปรับปรุงครุภัณฑ์ รถบรรทุกขยะ หมายเลขทะเบียน ๘๒-๙๙๑๘ ฉะเชิงเทรา โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67089579477&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-08-28",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W1",
          title: "ซื้อวัสดุก่อสร้าง จำนวน ๒๐ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67089264260&templateType=W2&temp_Announ=D&temp_itemNo=1&seqNo=2",
          pub_date: "2024-08-22",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "ซื้อเครื่องตัดหญ้า แบบเข็น จำนวน ๑ เครื่อง โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67089332477&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-08-16",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title: "ซื้อวัสดุยานพาหนะเเละขนส่ง จำนวน ๓ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67089022479&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-08-14",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title: "ซื้อวัสดุอื่นๆ (มิเตอร์น้ำ) โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67089092222&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-08-09",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W1",
          title: "ซื้อวัสดุอื่นๆ (มิเตอร์น้ำ) โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67089092222&templateType=W2&temp_Announ=D&temp_itemNo=1&seqNo=2",
          pub_date: "2024-08-09",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "ซื้อวัสดุอุปกรณ์ โครงการ ๑ อปท. ๑ สวนสมุนไพรฯ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67079660913&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-08-06",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "ซื้อใบเสร็จรับเงินค่าน้ำประปา ขนาด ๕.๕ นิ้ว x ๙ นิ้ว ๒ ชั้น ตีนัมเบอร์ ๒ ตำแหน่ง (บรรจุ ๒,๐๐๐ ชุด/กล่อง) จำนวน ๓๐,๐๐๐ ชุด โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67079302338&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-07-24",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title: "ซื้อวัสดุก่อสร้าง จำนวน ๑๖ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67069526500&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=3",
          pub_date: "2024-07-16",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W1",
          title: "ซื้อวัสดุก่อสร้าง จำนวน ๑๖ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67069526500&templateType=W2&temp_Announ=D&temp_itemNo=1&seqNo=2",
          pub_date: "2024-07-12",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างซ่อมบำรุงรถบรรทุกน้ำดับเพลิง หมายเลขทะเบียน บว-๘๙๕๖ ฉะเชิงเทรา โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67079231669&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-07-11",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างซ่อมรถกระเช้าไฟฟ้า หมายเลขทะเบียน ๘๑-๙๘๑๖  โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67079133238&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-07-10",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title: "ซื้อวัสดุคอมพิวเตอร์ จำนวน ๑ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67069594993&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-07-09",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title: "ซื้อวัสดุคอมพิวเตอร์ จำนวน ๖ รายการ  โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67079076851&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-07-05",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "ซื้อครุภัณฑ์คอมพิิวเตอร์หรืออิเล็กทรอนิกส์ (เครื่องพิมพ์ Multifunction เลเซอร์ หรือ LEDสี)  โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67079048283&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-07-04",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title: "ซื้อวัสดุสำนักงาน จำนวน ๒๒ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67079045407&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-07-04",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title: "ซื้อวัสดุงานบ้านงานครัว จำนวน ๕ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67069408422&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-06-24",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างบำรุงรักษาและปรับปรุงครุภัณฑ์ รถบรรทุกน้ำ หมายเลขทะเบียน ๘๑-๔๓๓๙ ฉะเชิงเทรา โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67069190328&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-06-17",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างเหมาขุดลอกท่อระบายน้ำถนนเทศบาลบ้านโพธิ์ ๗, ถนนเทศบาลบ้านโพธิ์ ๑๐/๑ และถนนเทศบาลบ้านโพธิ์ ๑๐/๒ หมู่ที่ ๑ ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67069247498&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-06-14",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title: "ซื้อวัสดุคอมพิวเตอร์ จำนวน ๑๑ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67069115195&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-06-14",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างซ่อมแซมบำรุงรักษารถจักรยานยนต์ หมายเลขทะเบียน กษว ๗๐๖ หมายเลขครุภัณฑ์ ๐๒๔ ๕๒ ๐๐๐๔ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67069151994&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-06-13",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title: "ซื้อวัสดุคอมพิวเตอร์ จำนวน ๖ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67069152316&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-06-13",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title: "ซื้อครุภัณฑ์สำนักงาน (โต๊ะพลาสติก) โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67069176480&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-06-12",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title: "ซื้อวัสดุไฟฟ้าและวิทยุ จำนวณ ๒ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67069163473&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-06-11",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างซ่อมบำรุงรถบรรทุกขยะ หมายเลขทะเบียน ๘๒-๙๙๑๘ ฉะเชิงเทรา โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67059560813&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-05-31",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างซ่อมรถฟาร์มแทรกเตอร์ ติดตั้งเครื่องตัดหญ้าไหล่ทาง หมายเลขทะเบียน ตค- ๑๖๔๖ ฉะเชิงเทรา  โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67059421546&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-05-28",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "P0",
          title:
            "โครงการจัดซื้ออาหารเสริม (นม) ให้กับนักเรียนโรงเรียนวัดสนามจันทร์และเด็กเล็กของศูนย์พัฒนาเด็กเล็กเทศบาลตำบลบ้านโพธิ์ เดือนพฤษภาคม 2567",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=M67050012233&templateType=P0&temp_Announ=P&temp_itemNo=&seqNo=",
          pub_date: "2024-05-14",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างซ่อมบำรุงเครื่องปริ้นเตอร์ KYOCERA ๒๑๓๕ หมายเลขครุภัณฑ์ ๔๘๖-๕๘-๐๐๑๑ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67049469930&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-05-08",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างเหมาขนย้ายดินปรับพื้นที่บริเวณกำแพงกันดินบ่อกักเก็บน้ำประปาเทศบาล หมู่ที่ ๑ ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67049383794&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-05-01",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title: "ซื้อวัสดุคอมพิวเตอร์  จำนวน  ๑ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67049200892&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-04-23",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างซ่อมแซมเพลาที่เชื่อมระหว่างมอเตอร์กับปั๊มหอยโข่งที่ใช้สูบน้ำดิบสำหรับผลิตน้ำประปา หมายเลขครุภัณฑ์ ๑๐๘-๔๖-๐๐๐๑ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67049065014&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-04-10",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "15",
          title:
            "ประกวดราคาจ้างก่อสร้างโครงการก่อสร้างสะพานคอนกรีตเสริมเหล็กข้ามคลองหลอดยอ หมู่ที่ ๒ ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
          link: "https://process5.gprocurement.go.th/egp-upload-service/v1/downloadFileTest?fileId=8bfd1aa00b5345ca90635cf2677764f3",
          pub_date: "2024-04-03",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "D0",
          title:
            "ประกวดราคาจ้างก่อสร้างโครงการก่อสร้างสะพานคอนกรีตเสริมเหล็กข้ามคลองหลอดยอ หมู่ที่ ๒ ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
          link: "https://process5.gprocurement.go.th/egp-template-service/dwnt/view-pdf-file?templateId=80c2b42a-c1d4-4d22-96c1-8f77bbc4fb49",
          pub_date: "2024-04-03",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "ซื้อวัคซีนป้องกันโรคพิษสุนัขบ้า (พร้อมเข็ม+ไซริงค์+สมุด+ป้าย) จำนวน ๔๐๐ ชุด โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67039408625&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-03-22",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title: "ซื้อวัสดุไฟฟ้าและวิทยุ จำนวน ๑ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67039259524&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-03-18",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title: "ซื้อกรองโซล่า  จำนวน ๑ ลูก โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67039014395&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-03-06",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title: "ซื้อวัสดุสำนักงาน จำนวน ๑๒ รายการ  โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67029482904&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-03-01",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างเหมาสูบน้ำดิบเข้าบ่อกักเก็บน้ำดิบ ประปาเทศบาล หมู่ที่ ๑ และบ่อกักเก็บน้ำดิบ ประปาเทศบาล หมู่ที่ ๓ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67029441842&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-02-28",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W1",
          title: "ซื้อวัสดุสำนักงาน จำนวน ๑๓ รายการ  โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67019481122&templateType=W2&temp_Announ=D&temp_itemNo=1&seqNo=2",
          pub_date: "2024-02-21",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างซ่อมบำรุงเครื่องสูบน้ำ หมายเลขครุภัณฑ์ ๑๘๙-๖๔-๐๐๐๖ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67029239271&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-02-19",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างเหมาซ่อมบำรุงรถบรรทุกขยะ หมายเลขทะเบียน ๘๒-๙๙๑๘ ฉะเชิงเทรา โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67029211901&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-02-15",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title: "ซื้อวัสดุคอมพิวเตอร์ จำนวน ๕ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67029123417&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-02-12",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "ประกวดราคาซื้อโครงการจัดซื้อครุภัณฑ์ยานพาหนะและขนส่ง รถบรรทุก (ดีเซล) แบบธรรมดา ขนาด ๑ ตัน จำนวน ๑ คัน ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
          link: "https://process5.gprocurement.go.th/egp-template-service/dwnt/view-pdf-file?templateId=1b197d20-fb7a-4336-bf33-2f8c67d6fdc3",
          pub_date: "2024-02-12",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title: "ซื้อวัสดุไฟฟ้าและวิทยุ จำนวน ๓ รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67029027225&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-02-07",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title: "ซื้อวัสดุยานพาหนะและขนส่ง จำนวน 2 รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67029014835&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-02-06",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "ซื้อแบตเตอรี่เครื่องสูบน้ำ หมายเลขครุภัณฑ์ 189-64-0006 จำนวน 1 ลูก โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67019418600&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-01-24",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title: "ซื้อวัสดุคอมพิวเตอร์ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67019401050&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-01-24",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W1",
          title: "ซื้อวัสดุคอมพิวเตอร์ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67019401050&templateType=W2&temp_Announ=D&temp_itemNo=1&seqNo=2",
          pub_date: "2024-01-24",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title: "ซื้อวัสดุยานพาหนะและขนส่ง โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67019345323&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-01-22",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างซ่อมบำรุงรถบรรทุกขยะ หมายเลขทะเบียน 82-9918 ฉะเชิงเทรา โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67019302571&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-01-19",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title: "ซื้อวัสดุไฟฟ้าและวิทยุ จำนวน1 รายการ โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67019289911&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-01-17",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "15",
          title:
            "ประกวดราคาซื้อโครงการจัดซื้อครุภัณฑ์ยานพาหนะและขนส่ง รถบรรทุก (ดีเซล) แบบธรรมดา ขนาด ๑ ตัน จำนวน ๑ คัน ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
          link: "https://process5.gprocurement.go.th/egp-upload-service/v1/downloadFileTest?fileId=009e26e6f7094b8dadaed38ec47bf70f",
          pub_date: "2024-01-12",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "D0",
          title:
            "ประกวดราคาซื้อโครงการจัดซื้อครุภัณฑ์ยานพาหนะและขนส่ง รถบรรทุก (ดีเซล) แบบธรรมดา ขนาด ๑ ตัน จำนวน ๑ คัน ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
          link: "https://process5.gprocurement.go.th/egp-template-service/dwnt/view-pdf-file?templateId=e5184ae8-1e4c-4ec4-b238-f71e227226a4",
          pub_date: "2024-01-12",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "W0",
          title:
            "จ้างเหมาทำฝาตะแกรงเหล็กท่อระบายน้ำ จำนวน ๑ ชุด โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=67019038601&templateType=W2&temp_Announ=A&temp_itemNo=0&seqNo=1",
          pub_date: "2024-01-09",
        },
        {
          deptsub_id: "1509900857",
          announce_type: "B0",
          title:
            "ประกวดราคาซื้อโครงการจัดซื้อครุภัณฑ์ยานพาหนะและขนส่ง รถบรรทุก (ดีเซล) แบบธรรมดา ขนาด ๑ ตัน จำนวน ๑ คัน ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
          link: "https://process5.gprocurement.go.th/egp-upload-service/v1/downloadFileTest?fileId=95cb952fa7284834950ddfa453b612cc",
          pub_date: "2024-01-02",
        },
      ],
    };

    console.log("Returning fallback EGP data due to API error");

    return NextResponse.json(fallbackData, {
      status: 200, // ส่ง status 200 แทน error status
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json",
      },
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
