"use client";

import { useState } from "react";
import Link from "next/link";

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

export default function QAPage() {
  const [qt, setQt] = useState(initialQuestions);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    author: "",
    email: "",
    content: "",
    ip: "",
  });
  const [detailId, setDetailId] = useState(null);
  const [commentForm, setCommentForm] = useState({
    author: "",
    email: "",
    content: "",
  });

  // Simulate IP
  const getFakeIP = () => "110.169.9.33";

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCommentChange = (e) => {
    const { name, value } = e.target;
    setCommentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitQuestion = (e) => {
    e.preventDefault();
    if (!form.title || !form.author || !form.content) return;
    const newId = Object.keys(qt).length + 1;
    setQt((prev) => ({
      ...prev,
      [newId]: {
        id: newId,
        title: form.title,
        author: form.author,
        date: new Date().toISOString().replace("T", " ").substring(0, 19),
        content: form.content,
        ip: getFakeIP(),
        comments: [],
      },
    }));
    setForm({ title: "", author: "", email: "", content: "", ip: "" });
    setShowForm(false);
  };

  const handleShowDetail = (id) => {
    setDetailId(id);
    setCommentForm({ author: "", email: "", content: "" });
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentForm.author || !commentForm.content || !detailId) return;
    setQt((prev) => ({
      ...prev,
      [detailId]: {
        ...prev[detailId],
        comments: [
          ...prev[detailId].comments,
          {
            id: prev[detailId].comments.length + 1,
            author: commentForm.author,
            date: new Date().toISOString().replace("T", " ").substring(0, 19),
            ip: getFakeIP(),
            content: commentForm.content,
          },
        ],
      },
    }));
    setCommentForm({ author: "", email: "", content: "" });
  };

  return (
    <div className="bg-white w-full h-screen">
      <div className="max-w-3xl mx-auto py-8 px-4 ">
        <h1 className="text-2xl font-bold mb-6 text-blue-900">กระดานสนทนา</h1>
        <div className="mb-4 flex gap-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => setShowForm(true)}
          >
            ตั้งคำถามใหม่
          </button>
          <button
            className="bg-gray-200 px-4 py-2 rounded"
            onClick={() => setShowForm(false)}
          >
            คำถามทั้งหมด
          </button>
        </div>

        {showForm && (
          <form
            className="bg-white rounded shadow p-4 mb-6"
            onSubmit={handleSubmitQuestion}
          >
            <h2 className="text-lg font-semibold mb-2">ตั้งคำถามใหม่</h2>
            <div className="mb-2">
              <label className="block text-sm mb-1">หัวข้อคำถาม</label>
              <input
                name="title"
                value={form.title}
                onChange={handleFormChange}
                className="w-full border px-2 py-1 rounded"
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm mb-1">ชื่อ/Username</label>
              <input
                name="author"
                value={form.author}
                onChange={handleFormChange}
                className="w-full border px-2 py-1 rounded"
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm mb-1">อีเมลล์</label>
              <input
                name="email"
                value={form.email}
                onChange={handleFormChange}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm mb-1">รายละเอียดคำถาม</label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleFormChange}
                className="w-full border px-2 py-1 rounded"
                rows={4}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
            >
              ส่งคำถาม
            </button>
          </form>
        )}

        <div className="space-y-8">
          {Object.values(qt).map((q) => (
            <div key={q.id} className="bg-white rounded shadow p-4">
              <Link href={`/citizen/qa/${q.id}`}>
                <h2 className="text-lg font-bold text-blue-800 mb-1 cursor-pointer">
                  {q.title}
                </h2>
              </Link>
              <div className="text-sm text-gray-600 mb-2">
                โดย : {q.author} | เมื่อ : {q.date} | IP : ({q.ip})
              </div>
              <div className="mb-2 text-gray-800">{q.content}</div>
              <Link
                href={`/citizen/qa/${q.id}`}
                className="text-blue-600 text-sm underline"
              >
                ดูรายละเอียด/แสดงความคิดเห็น
              </Link>
            </div>
          ))}
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
