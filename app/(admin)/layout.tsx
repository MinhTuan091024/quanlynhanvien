"use client";

import ChatBot from "@/components/ChatBot";
import Sidebar from "@/components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-100 p-6">
        {children}
        <ChatBot/>
      </main>
    </div>
  );
}
