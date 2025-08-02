"use client";

import { useState } from "react";
import Link from "next/link";

import React from "react";

export default function QADetailPage({ params }) {
  const { id } = React.use(params);
  const idNum = parseInt(id);
  // For demo, use local data. Replace with API fetch for production.
  const initialQuestions = {
    1: {
      id: 1,
      title: "การเก็บค่าธรรมเนียมหนังสือรับรอง",
      author: "จิราภรณ์",
      date: "2023-04-26 17:27:04",
      content:
        "สอบถามค่ะ ปีนี้ทางเทศบาลยังยกเว้นการเก็บค่าธรรมเนียมหนังสือรับรองการเเจ้งสะสมอาหารอยู่ไหมคะ",
      ip: "110.169.9.33",
      comments: [
        {
          id: 1,
          author: "แอดมิน",
          date: "2023-04-26 18:28:09",
          ip: "110.169.9.33",
          content:
            "ไม่ยกเว้นค่ะ\nห้วงระยะเวลาการยกเว้นการจัดเก็บค่าธรรมเนียม ตั้งเเต่วันที่ 14 พฤศจิกายน 2564 ถึง 13 พฤศจิกายน 2565 ค่ะ",
        },
      ],
    },
  };
  const question = initialQuestions[idNum];
  const [commentForm, setCommentForm] = useState({
    author: "",
    email: "",
    content: "",
  });
  const [comments, setComments] = useState(question.comments || []);

  // Simulate IP
  const getFakeIP = () => "110.169.9.33";

  const handleCommentChange = (e) => {
    const { name, value } = e.target;
    setCommentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentForm.author || !commentForm.content) return;
    setComments((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        author: commentForm.author,
        date: new Date().toISOString().replace("T", " ").substring(0, 19),
        ip: getFakeIP(),
        content: commentForm.content,
      },
    ]);
    setCommentForm({ author: "", email: "", content: "" });
  };

  if (!question) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="text-red-500">ไม่พบกระทู้ที่ต้องการ</div>
        <Link href="/citizen/qa" className="text-blue-600 underline">
          กลับหน้ากระดานสนทนา
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white w-full h-screen">
      <div className="max-w-3xl mx-auto py-8 px-4 bg-white">
        <Link href="/citizen/qa" className="text-xs text-gray-500 mb-2 block">
          &larr; กลับไปหน้ารวมกระทู้
        </Link>
        <h2 className="text-lg font-bold text-blue-800 mb-1">
          {question.title}
        </h2>
        <div className="text-sm text-gray-600 mb-2">
          โดย : {question.author} | เมื่อ : {question.date} | IP : (
          {question.ip})
        </div>
        <div className="mb-2 text-gray-800">{question.content}</div>
        <div className="mt-4">
          <h3 className="font-semibold mb-2">ความคิดเห็น</h3>
          <div className="space-y-4">
            {comments.length === 0 && (
              <div className="text-gray-400">ยังไม่มีความคิดเห็น</div>
            )}
            {comments.map((c) => (
              <div key={c.id} className="border-t pt-2">
                <div className="text-sm text-gray-600">
                  โดย : {c.author} | ตอบเมื่อ : {c.date} | IP : ({c.ip})
                </div>
                <div className="text-gray-800 mb-1">{c.content}</div>
                <div className="text-xs text-gray-400">
                  ความคิดเห็นที่ : {c.id}
                </div>
              </div>
            ))}
          </div>
          <form
            className="bg-gray-50 rounded p-2 mt-4"
            onSubmit={handleSubmitComment}
          >
            <div className="mb-2">
              <label className="block text-sm mb-1">ชื่อ/Username</label>
              <input
                name="author"
                value={commentForm.author}
                onChange={handleCommentChange}
                className="w-full border px-2 py-1 rounded"
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm mb-1">อีเมลล์</label>
              <input
                name="email"
                value={commentForm.email}
                onChange={handleCommentChange}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm mb-1">
                รายละเอียดความคิดเห็น
              </label>
              <textarea
                name="content"
                value={commentForm.content}
                onChange={handleCommentChange}
                className="w-full border px-2 py-1 rounded"
                rows={3}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
            >
              ส่งความคิดเห็น
            </button>
          </form>
        </div>
        <div className="mt-8 text-xs text-gray-500">
          ข้อความที่ท่านได้อ่าน เกิดจากการเขียนโดยสาธารณชน
          และส่งขึ้นมาแบบอัตโนมัติ
          เจ้าของเว็บบอร์ดไม่รับผิดชอบต่อข้อความใดๆทั้งสิ้น
          เพราะไม่สามารถระบุได้ว่าเป็นความจริงหรือชื่อผู้เขียนที่ได้เห็นคือชื่อจริง
          ผู้อ่านจึงควรใช้วิจารณญาณในการกลั่นกรอง และถ้าท่านพบเห็นข้อความใด
          ที่ขัดต่อกฎหมายและศีลธรรม หรือเป็นการกลั่นแกล้งเพื่อให้เกิดความเสียหาย
          ต่อบุคคล หรือหน่วยงานใด กรุณาส่ง email มาที่ office@banphocity.go.th
          เพื่อให้ผู้ควบคุมระบบทราบและทำการลบข้อความนั้น ออกจากระบบต่อไป
        </div>
      </div>
    </div>
  );
}
