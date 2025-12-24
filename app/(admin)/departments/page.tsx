"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";

type Department = {
  id: number;
  name: string;
  description?: string;
};

export default function DepartmentsPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) router.push("/login");
  }, [router]);

  const [data, setData] = useState<Department[]>([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const load = () =>
    fetch("/api/departments").then(r => r.json()).then(setData);

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    await fetch("/api/departments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description: desc }),
    });
    setName("");
    setDesc("");
    load();
  };

  const del = async (id: number) => {
    if (!confirm("Xóa phòng ban?")) return;
    await fetch(`/api/departments?id=${id}`, { method: "DELETE" });
    load();
  };

  const save = async () => {
    await fetch(`/api/departments?id=${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName, description: editDesc }),
    });
    setEditId(null);
    load();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-semibold mb-6">Quản lý phòng ban</h1>

      {/* ADD */}
      <div className="bg-white p-4 rounded shadow mb-6 flex gap-3">
        <input
          placeholder="Tên phòng ban"
          className="border px-3 py-2 rounded w-1/3"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          placeholder="Mô tả"
          className="border px-3 py-2 rounded w-1/3"
          value={desc}
          onChange={e => setDesc(e.target.value)}
        />
        <button
          onClick={add}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Thêm
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Tên</th>
              <th className="px-4 py-3">Mô tả</th>
              <th className="px-4 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {data.map(d => (
              <tr key={d.id} className="border-t">
                <td className="px-4 py-2">{d.id}</td>
                <td className="px-4 py-2">
                  {editId === d.id ? (
                    <input
                      className="border px-2 py-1"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                    />
                  ) : (
                    d.name
                  )}
                </td>
                <td className="px-4 py-2">
                  {editId === d.id ? (
                    <input
                      className="border px-2 py-1"
                      value={editDesc}
                      onChange={e => setEditDesc(e.target.value)}
                    />
                  ) : (
                    d.description
                  )}
                </td>
                <td className="px-4 py-2 space-x-2">
                  {editId === d.id ? (
                    <>
                      <button onClick={save} className="text-green-600">
                        Lưu
                      </button>
                      <button onClick={() => setEditId(null)} className="text-gray-500">
                        Hủy
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditId(d.id);
                          setEditName(d.name);
                          setEditDesc(d.description || "");
                        }}
                        className="text-blue-600"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => del(d.id)}
                        className="text-red-600"
                      >
                        Xóa
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
