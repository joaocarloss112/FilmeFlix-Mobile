// lib/useAuth.ts
import { useState, useEffect } from "react";
import { getCurrentUser, logout } from "./auth"; // seu auth.ts

export function useAuth() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const current = await getCurrentUser();
      setUser(current);
      setLoading(false);
    }
    loadUser();
  }, []);

  const signOut = async () => {
    await logout();
    setUser(null);
  };

  return { user, setUser, loading, signOut };
}
