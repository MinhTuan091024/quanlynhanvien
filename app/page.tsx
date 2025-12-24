"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn()) {
      router.push("/employees");
    } else {
      router.push("/login");
    }
  }, []);

  return null;
}
