import type { LoginResponseBody } from "@app/types";
import { apiClient } from "../../../api/api";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../../contexts/authContext";
import { useNavigate } from "react-router";

const loginByGoogle = async (idToken: string): Promise<LoginResponseBody> => {
  const response = await apiClient.post("/auth/google", { idToken: idToken });

  return response.data;
};

export function useGoogleLogin() {
  const { login: loginInStorage } = useAuth();
  const navigate = useNavigate();
  return useMutation({
    mutationKey: ["login", "google"],
    mutationFn: loginByGoogle,

    onSuccess: (data) => {
      loginInStorage(data);
      navigate("/app/me");
    },
  });
}
