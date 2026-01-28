"use client";

import { useEffect, useState } from "react";
import type { UserOut } from "../../../lib/types";
import { getMe } from "../lib/apiClient";

export default function useAdminUser() {
  const [user, setUser] = useState<UserOut | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const response = await getMe();
        if (isMounted) setUser(response);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  return { user, loading };
}
