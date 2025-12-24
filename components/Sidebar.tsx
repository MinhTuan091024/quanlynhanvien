"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menu = [
    { name: "Nhân viên", href: "/employees" },
    { name: "Phòng ban", href: "/departments" },
    { name: "Chức vụ", href: "/positions" },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen flex flex-col">
      <div className="p-6 text-xl font-semibold border-b border-gray-700">
        Employee Admin
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menu.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-2 rounded ${
              pathname === item.href
                ? "bg-blue-600"
                : "hover:bg-gray-700"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <button
        onClick={() => {
          localStorage.removeItem("user");
          router.push("/login");
        }}
        className="m-4 px-4 py-2 bg-red-500 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
