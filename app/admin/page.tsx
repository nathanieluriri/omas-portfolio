"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRefreshToken } from "./lib/auth";

export default function AdminGate() {
  const router = useRouter();

  useEffect(() => {
    const token = getRefreshToken();
    if (token) {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/admin/login");
    }
  }, [router]);

  return null;
}
