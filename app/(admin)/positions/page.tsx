"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";

type Position = {
  id: number;
  name: string;
  base_salary?: number | null;
};

export default function PositionsPage() {
  const router = useRouter();

  // 🔒 Chặn chưa login
  useEffect(() => {
    if (!isLoggedIn()) router.push("/login");
  }, [router]);

  const [data, setData] = useState<Position[]>([]);
  const [name, setName] = useState("");
  const [salary, setSalary] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editSalary, setEditSalary] = useState("");

  const load = () =>
    fetch("/api/positions").then(r => r.json()).then(setData);

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    if (!name) return alert("Nhập tên chức vụ");

    await fetch("/api/positions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        base_salary: salary ? Number(salary) : null,
      }),
    });

    setName("");
    setSalary("");
    load();
  };

  const del = async (id: number) => {
    if (!confirm("Xóa chức vụ này?")) return;
    await fetch(`/api/positions?id=${id}`, { method: "DELETE" });
    load();
  };

  const startEdit = (p: Position) => {
    setEditId(p.id);
    setEditName(p.name);
    setEditSalary(p.base_salary?.toString() || "");
  };

  const save = async () => {
    if (!editId) return;

    await fetch(`/api/positions?id=${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editName,
        base_salary: editSalary ? Number(editSalary) : null,
      }),
    });

    setEditId(null);
    setEditName("");
    setEditSalary("");
    load();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Quản lý chức vụ
        </h1>

        <button
          onClick={() => {
            localStorage.removeItem("user");
            router.push("/login");
          }}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* ADD */}
      <div className="bg-white p-4 rounded shadow mb-6 flex gap-4">
        <input
          placeholder="Tên chức vụ"
          className="border px-3 py-2 rounded w-1/3 focus:outline-none focus:ring"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <input
          placeholder="Lương cơ bản"
          className="border px-3 py-2 rounded w-1/3 focus:outline-none focus:ring"
          value={salary}
          onChange={e => setSalary(e.target.value)}
        />

        <button
          onClick={add}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Thêm
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Tên chức vụ</th>
              <th className="px-4 py-3">Lương cơ bản</th>
              <th className="px-4 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {data.map(p => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{p.id}</td>

                <td className="px-4 py-2">
                  {editId === p.id ? (
                    <input
                      className="border px-2 py-1 rounded"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                    />
                  ) : (
                    p.name
                  )}
                </td>

                <td className="px-4 py-2">
                  {editId === p.id ? (
                    <input
                      className="border px-2 py-1 rounded"
                      value={editSalary}
                      onChange={e => setEditSalary(e.target.value)}
                    />
                  ) : (
                    p.base_salary ?? "-"
                  )}
                </td>

                <td className="px-4 py-2 space-x-3">
                  {editId === p.id ? (
                    <>
                      <button
                        onClick={save}
                        className="text-green-600 hover:underline"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="text-gray-500 hover:underline"
                      >
                        Hủy
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(p)}
                        className="text-blue-600 hover:underline"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => del(p.id)}
                        className="text-red-600 hover:underline"
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
