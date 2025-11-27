import { useState, useEffect } from "react";
import { getCurrentUser } from "./auth";

export function useUser() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      const currentUser = await getCurrentUser();
      if (currentUser) setUser({ username: currentUser.username });
      else setUser(null);
      setLoading(false);
    }
    fetchUser();
  }, []);

  return { user, setUser, loading };
}
