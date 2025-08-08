import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const data = await req.json();
    // กำหนดอีเมลปลายทางที่ต้องการรับข้อมูล
    const toEmail = "admin@banphocity.go.th"; // เปลี่ยนเป็นอีเมลจริงที่ต้องการ

    // สร้าง transporter สำหรับส่งอีเมล (ตัวอย่างใช้ Gmail)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // สร้างเนื้อหาอีเมล
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: toEmail,
      subject: "แจ้งคำร้องขอรับบริการจัดเก็บขยะใหม่",
      html: `
        <h2>แจ้งคำร้องขอรับบริการจัดเก็บขยะ</h2>
        <p><b>ชื่อผู้ยื่น:</b> ${data.name || "-"}</p>
        <p><b>เบอร์โทร:</b> ${data.phone || "-"}</p>
        <p><b>ที่อยู่:</b> ${data.address || "-"}</p>
        <p><b>รายละเอียด:</b> ${data.details || "-"}</p>
        <p><b>วันที่ยื่น:</b> ${data.date || new Date().toLocaleString()}</p>
      `,
    };

    // ส่งอีเมล
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "ส่งข้อมูลสำเร็จ" });
  } catch (error) {
    console.error("Send waste-collection email error:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการส่งอีเมล" },
      { status: 500 }
    );
  }
}
