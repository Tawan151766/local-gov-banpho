"use client";
import React from "react";

export default function AuthorityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-[#0383AA] mb-4 text-center">
            อำนาจหน้าที่ของเทศบาลตำบลบ้านโพธิ์
          </h1>
          <div className="text-center text-sm text-gray-500 mb-4">
            ตามพระราชบัญญัติเทศบาล พ.ศ. ๒๔๙๖ แก้ไขเพิ่มเติมถึง (ฉบับที่ ๑๔) พ.ศ. ๒๕๖๒
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="prose max-w-none">
            <p className="mb-6 text-gray-700 leading-relaxed">
              เทศบาลตำบลบ้านโพธิ์มีอำนาจหน้าที่ในการบริหารงาน ภายใต้บังคับแห่งพระราชบัญญัติเทศบาล 
              พ.ศ. ๒๔๙๖ แก้ไขเพิ่มเติมถึง (ฉบับที่ ๑๔) พ.ศ. ๒๕๖๒ มาตรา ๕๐ และมาตรา ๕๑ ดังนี้
            </p>

            <h3 className="text-xl font-semibold text-[#0383AA] mb-4">
              มาตรา ๕๐ หน้าที่หลักของเทศบาล
            </h3>
            
            <ul className="list-disc pl-6 space-y-2 mb-6 text-black">
              <li>รักษาความสงบเรียบร้อยของประชาชน</li>
              <li>ให้มีและบำรุงทางบกและทางน้ำ</li>
              <li>รักษาความสะอาดของถนน หรือทางเดิน และที่สาธารณะ รวมทั้งการกำจัดมูลฝอยและสิ่งปฏิกูล</li>
              <li>ป้องกันและระงับโรคติดต่อ</li>
              <li>ให้มีเครื่องใช้ในการดับเพลิง</li>
              <li>ให้ราษฎรได้รับการศึกษาอบรม</li>
              <li>ส่งเสริมการพัฒนาสตรี เด็ก เยาวชน ผู้สูงอายุ และผู้พิการ</li>
              <li>บำรุงศิลปะ จารีตประเพณี ภูมิปัญญาท้องถิ่น และวัฒนธรรมอันดีของท้องถิ่น</li>
              <li>หน้าที่อื่นตามที่กฎหมายบัญญัติให้เป็นหน้าที่ของเทศบาล</li>
            </ul>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h4 className="font-semibold text-[#0383AA] mb-2">หลักการปฏิบัติงาน</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                การปฏิบัติงานตามอำนาจหน้าที่ของเทศบาลต้องเป็นไปเพื่อประโยชน์สุขของประชาชน 
                โดยใช้วิธีการบริหารกิจการบ้านเมืองที่ดี และให้คำนึงถึงการมีส่วนร่วมของประชาชน
                ในการจัดทำแผนพัฒนาเทศบาล การจัดทำงบประมาณ การจัดซื้อจัดจ้าง การตรวจสอบ 
                การประเมินผลการปฏิบัติงาน และการเปิดเผยข้อมูลข่าวสาร
              </p>
            </div>

            <h3 className="text-xl font-semibold text-[#0383AA] mb-4">
              มาตรา ๕๑ กิจการที่เทศบาลอาจทำได้
            </h3>
            
            <ul className="list-disc pl-6 space-y-2 mb-6 text-black">
              <li>ให้มีน้ำสะอาดหรือการประปา</li>
              <li>ให้มีโรงฆ่าสัตว์</li>
              <li>ให้มีตลาด ท่าเทียบเรือ และท่าข้าม</li>
              <li>ให้มีสุสานและฌาปนกิจสถาน</li>
              <li>บำรุงและส่งเสริมการทำมาหากินของราษฎร</li>
              <li>ให้มีและบำรุงสถานที่ทำการพิทักษ์รักษาคนเจ็บไข้</li>
              <li>ให้มีและบำรุงการไฟฟ้าหรือแสงสว่างโดยวิธีอื่น</li>
              <li>ให้มีและบำรุงทางระบายน้ำ</li>
              <li>เทศพาณิชย์</li>
            </ul>
          </div>
        </div>

        {/* Additional Authority Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold text-[#0383AA] mb-4">
            อำนาจหน้าที่ตามพระราชบัญญัติกำหนดแผนและขั้นตอนการกระจายอำนาจ
          </h3>
          <div className="text-center text-sm text-gray-500 mb-4">
            พ.ศ. ๒๕๔๒ แก้ไขเพิ่มเติมถึง (ฉบับที่ ๒) พ.ศ. ๒๕๔๙ มาตรา ๑๖
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">การพัฒนาและบริการพื้นฐาน</h4>
              <ul className="list-disc pl-4 space-y-1 text-sm text-gray-700">
                <li>การจัดทำแผนพัฒนาท้องถิ่นของตนเอง</li>
                <li>การจัดให้มีและบำรุงรักษาทางบก ทางน้ำ และทางระบายน้ำ</li>
                <li>การจัดให้มีและควบคุมตลาด ท่าเทียบเรือ ท่าข้าม และที่จอดรถ</li>
                <li>การสาธารณูปโภคและการก่อสร้างอื่น ๆ</li>
                <li>การสาธารณูปการ</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">การส่งเสริมเศรษฐกิจและสังคม</h4>
              <ul className="list-disc pl-4 space-y-1 text-sm text-gray-700">
                <li>การส่งเสริม การฝึก และประกอบอาชีพ</li>
                <li>การพาณิชย์ และการส่งเสริมการลงทุน</li>
                <li>การส่งเสริมการท่องเที่ยว</li>
                <li>การจัดการศึกษา</li>
                <li>การสังคมสงเคราะห์ และการพัฒนาคุณภาพชีวิต</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Detailed Authority List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-[#0383AA] mb-4">
            รายละเอียดอำนาจหน้าที่เพิ่มเติม
          </h3>
          
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">การพัฒนาสังคม</h4>
                <ul className="list-disc pl-4 space-y-1 text-sm text-gray-700">
                  <li>การพัฒนาคุณภาพชีวิตเด็ก สตรี คนชรา และผู้ด้อยโอกาส</li>
                  <li>การบำรุงรักษาศิลปะ จารีตประเพณี ภูมิปัญญาท้องถิ่น</li>
                  <li>การส่งเสริมประชาธิปไตย ความเสมอภาค และสิทธิเสรีภาพ</li>
                  <li>การส่งเสริมการมีส่วนร่วมของราษฎรในการพัฒนาท้องถิ่น</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">การจัดการสิ่งแวดล้อม</h4>
                <ul className="list-disc pl-4 space-y-1 text-sm text-gray-700">
                  <li>การรักษาความสะอาดและความเป็นระเบียบเรียบร้อย</li>
                  <li>การกำจัดมูลฝอย สิ่งปฏิกูล และน้ำเสีย</li>
                  <li>การจัดการ การบำรุงรักษา และการใช้ประโยชน์จากป่าไม้</li>
                  <li>การจัดการทรัพยากรธรรมชาติและสิ่งแวดล้อม</li>
                </ul>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">การสาธารณสุขและความปลอดภัย</h4>
                <ul className="list-disc pl-4 space-y-1 text-sm text-gray-700">
                  <li>การสาธารณสุข การอนามัยครอบครัว และการรักษาพยาบาล</li>
                  <li>การป้องกันและบรรเทาสาธารณภัย</li>
                  <li>การรักษาความสงบเรียบร้อย</li>
                  <li>การส่งเสริมและสนับสนุนการป้องกันและรักษาความปลอดภัย</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">การควบคุมและกำกับดูแล</h4>
                <ul className="list-disc pl-4 space-y-1 text-sm text-gray-700">
                  <li>การควบคุมการเลี้ยงสัตว์</li>
                  <li>การจัดให้มีและควบคุมการฆ่าสัตว์</li>
                  <li>การควบคุมอาคาร</li>
                  <li>การผังเมือง การขนส่ง และการวิศวกรรมจราจร</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}