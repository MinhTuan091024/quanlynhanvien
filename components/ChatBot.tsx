"use client";
import { useState } from "react";

type Msg = {
  from: "user" | "bot";
  text: string;
};

const knowledge = [
  {
    keywords: ["thêm", "nhân viên", "create"],
    answer:
      "Bạn vào Nhân viên → bấm “Thêm nhân viên” → nhập thông tin → Lưu.",
  },
  {
    keywords: ["sửa", "cập nhật"],
    answer:
      "Bạn chọn nhân viên cần sửa → bấm “Sửa” → chỉnh thông tin → Lưu.",
  },
  {
    keywords: ["xóa", "delete"],
    answer:
      "Bạn bấm “Xóa” tại nhân viên cần xóa và xác nhận.",
  },
  {
    keywords: ["phòng ban", "department"],
    answer:
      "Phòng ban dùng để phân loại nhân viên theo bộ phận.",
  },
  {
    keywords: ["chức vụ", "position", "lương"],
    answer:
      "Chức vụ thể hiện vai trò và mức lương cơ bản của nhân viên.",
  },
  {
    keywords: ["đăng nhập", "login"],
    answer:
      "Bạn cần đăng nhập để truy cập hệ thống quản lý.",
  },
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { from: "bot", text: "Xin chào 👋 Tôi có thể hỗ trợ gì cho bạn?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const getAnswer = (q: string) => {
    const question = q.toLowerCase();
    for (const item of knowledge) {
      if (item.keywords.some(k => question.includes(k))) {
        return item.answer;
      }
    }
    return "Xin lỗi, tôi chưa hiểu. Bạn có thể hỏi lại rõ hơn không?";
  };

  const send = () => {
    if (!input.trim()) return;

    const userMsg: Msg = { from: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const reply = getAnswer(userMsg.text);
      setMessages(prev => [...prev, { from: "bot", text: reply }]);
      setTyping(false);
    }, 700);
  };

  return (
    <>
      {/* NÚT MỞ CHATBOT */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 w-14 h-14 rounded-full bg-blue-600 text-white text-2xl shadow-lg hover:bg-blue-700"
        >
          🤖
        </button>
      )}

      {/* CHAT WINDOW */}
      {open && (
        <div className="fixed bottom-5 right-5 w-80 bg-white rounded-lg shadow-xl flex flex-col">
          {/* HEADER */}
          <div className="flex justify-between items-center bg-blue-600 text-white px-4 py-2 rounded-t-lg">
            <span className="font-semibold">Trợ lý ảo</span>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 p-3 space-y-2 overflow-y-auto text-sm bg-gray-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.from === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-lg max-w-[80%] ${
                    m.from === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {typing && (
              <div className="text-gray-400 italic">
                Bot đang trả lời…
              </div>
            )}
          </div>

          {/* INPUT */}
          <div className="flex border-t">
            <input
              className="flex-1 px-3 py-2 text-sm outline-none"
              placeholder="Nhập câu hỏi..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
            />
            <button
              onClick={send}
              className="px-4 text-blue-600 font-semibold"
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  );
}
