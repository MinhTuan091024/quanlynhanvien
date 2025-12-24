"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Login failed");
      return;
    }

    localStorage.setItem("user", JSON.stringify(data.user));
    router.push("/employees");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-semibold text-center mb-6">
          Đăng nhập hệ thống
        </h1>

        <div className="mb-4">
          <label className="block text-sm mb-1">Username</label>
          <input
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
