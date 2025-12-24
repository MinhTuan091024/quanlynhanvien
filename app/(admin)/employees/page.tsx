"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";

type Employee = {
  id: number;
  full_name: string;
  email: string;
  departments: { name: string };
  positions: { name: string };
};

export default function EmployeesPage() {
  const router = useRouter();

  // Chặn chưa login
  useEffect(() => {
    if (!isLoggedIn()) router.push("/login");
  }, [router]);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);

  const [departmentId, setDepartmentId] = useState("");
  const [positionId, setPositionId] = useState("");

  const loadEmployees = () => {
    const params = new URLSearchParams();
    if (departmentId) params.append("department_id", departmentId);
    if (positionId) params.append("position_id", positionId);

    fetch(`/api/employees?${params.toString()}`)
      .then(res => res.json())
      .then(setEmployees);
  };

  useEffect(() => {
    fetch("/api/departments").then(r => r.json()).then(setDepartments);
    fetch("/api/positions").then(r => r.json()).then(setPositions);
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [departmentId, positionId]);

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa nhân viên này?")) return;

    await fetch(`/api/employees?id=${id}`, {
      method: "DELETE",
    });

    loadEmployees();
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Quản lý nhân viên
        </h1>

        <button
          onClick={() => router.push("/employees/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Thêm nhân viên
        </button>
      </div>

      {/* FILTER */}
      <div className="bg-white p-4 rounded shadow mb-6 flex gap-4">
        <select
          className="border rounded px-3 py-2 w-1/4"
          value={departmentId}
          onChange={e => setDepartmentId(e.target.value)}
        >
          <option value="">Tất cả phòng ban</option>
          {departments.map((d: any) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          className="border rounded px-3 py-2 w-1/4"
          value={positionId}
          onChange={e => setPositionId(e.target.value)}
        >
          <option value="">Tất cả chức vụ</option>
          {positions.map((p: any) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Họ tên</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phòng ban</th>
              <th className="px-4 py-3">Chức vụ</th>
              <th className="px-4 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr
                key={emp.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-4 py-3">{emp.id}</td>
                <td className="px-4 py-3">{emp.full_name}</td>
                <td className="px-4 py-3">{emp.email}</td>
                <td className="px-4 py-3">
                  {emp.departments?.name}
                </td>
                <td className="px-4 py-3">
                  {emp.positions?.name}
                </td>
                <td className="px-4 py-3 space-x-3">
                  <button
                    onClick={() =>
                      router.push(`/employees/edit/${emp.id}`)
                    }
                    className="text-blue-600 hover:underline"
                  >
                    Sửa
                  </button>

                  <button
                    onClick={() => handleDelete(emp.id)}
                    className="text-red-600 hover:underline"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}

            {employees.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-6 text-gray-500"
                >
                  Không có nhân viên
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
