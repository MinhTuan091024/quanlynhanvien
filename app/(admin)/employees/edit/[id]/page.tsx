"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";

export default function EditEmployeePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // Chặn chưa login
  useEffect(() => {
    if (!isLoggedIn()) router.push("/login");
  }, [router]);

  // STATE LUÔN LÀ STRING (CONTROLLED)
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [positionId, setPositionId] = useState("");

  const [departments, setDepartments] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [error, setError] = useState("");

  // Load dropdown
  useEffect(() => {
    fetch("/api/departments").then(r => r.json()).then(setDepartments);
    fetch("/api/positions").then(r => r.json()).then(setPositions);
  }, []);

  // LOAD EMPLOYEE – CHẶN UNDEFINED
  useEffect(() => {
    if (!id) return;

    fetch(`/api/employees?id=${id}`)
      .then(r => r.json())
      .then(data => {
        setFullName(data?.full_name ?? "");
        setEmail(data?.email ?? "");
        setDepartmentId(
          data?.department_id ? String(data.department_id) : ""
        );
        setPositionId(
          data?.position_id ? String(data.position_id) : ""
        );
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !departmentId || !positionId) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const res = await fetch(`/api/employees?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: fullName,
        email,
        department_id: Number(departmentId),
        position_id: Number(positionId),
      }),
    });

    if (!res.ok) {
      setError("Cập nhật nhân viên thất bại");
      return;
    }

    router.push("/employees");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">
        Cập nhật nhân viên
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
