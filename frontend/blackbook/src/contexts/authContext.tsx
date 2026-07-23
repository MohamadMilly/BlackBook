import type { UserJwtPayload } from "@app/types";
import { useContext, createContext } from "react";

type AuthContextType = {
  user: UserJwtPayload | null;
  login: ({
    accessToken,
    refreshToken,
    user,
  }: {
    accessToken: string;
    refreshToken: string;
    user: UserJwtPayload;
  }) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const contextData = useContext(AuthContext);
  if (!contextData) {
    throw new Error("Should use the context inside its provider");
  }

  return contextData;
};
