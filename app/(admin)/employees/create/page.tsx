"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";

export default function CreateEmployeePage() {
  const router = useRouter();

  // Chặn chưa login
  useEffect(() => {
    if (!isLoggedIn()) router.push("/login");
  }, [router]);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [positionId, setPositionId] = useState("");

  const [departments, setDepartments] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [error, setError] = useState("");

  // Load dropdown data
  useEffect(() => {
    fetch("/api/departments").then(r => r.json()).then(setDepartments);
    fetch("/api/positions").then(r => r.json()).then(setPositions);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !departmentId || !positionId) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const res = await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: fullName,
        email,
        department_id: Number(departmentId),
        position_id: Number(positionId),
      }),
    });

    if (!res.ok) {
      setError("Tạo nhân viên thất bại");
      return;
    }

    // Thành công → quay về danh sách
    router.push("/employees");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">
        Thêm nhân viên
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow space-y-5"
      >
        {/* FULL NAME */}
        <div>
          <label className="block mb-1 text-sm">Họ và tên</label>
          <input
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder="Nguyễn Văn A"
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="block mb-1 text-sm">Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="a@gmail.com"
          />
        </div>

        {/* DEPARTMENT */}
        <div>
          <label className="block mb-1 text-sm">Phòng ban</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={departmentId}
            onChange={e => setDepartmentId(e.target.value)}
          >
            <option value="">-- Chọn phòng ban --</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* POSITION */}
        <div>
          <label className="block mb-1 text-sm">Chức vụ</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={positionId}
            onChange={e => setPositionId(e.target.value)}
          >
            <option value="">-- Chọn chức vụ --</option>
            {positions.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {/* ACTIONS */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Lưu
          </button>

          <button
            type="button"
            onClick={() => router.push("/employees")}
            className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
