import { useCallback, useMemo, useState, type ReactNode } from "react";
import { AuthContext } from "../contexts/authContext";
import type { UserJwtPayload } from "@app/types";
import { useQueryClient } from "@tanstack/react-query";

const rawUser = localStorage.getItem("user");
const storedUser = rawUser ? JSON.parse(rawUser) : null;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserJwtPayload | null>(storedUser);
  const queryClient = useQueryClient();
  const login = useCallback(
    ({
      user,
      accessToken,
      refreshToken,
    }: {
      user: UserJwtPayload;
      accessToken: string;
      refreshToken: string;
    }) => {
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    },
    [],
  );
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    queryClient.clear();
  }, []);

  const contextValue = useMemo(
    () => ({
      logout,
      login,
      user,
    }),
    [logout, user, login],
  );
  return <AuthContext value={contextValue}>{children}</AuthContext>;
}
