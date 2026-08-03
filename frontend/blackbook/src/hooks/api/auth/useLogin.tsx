import type {
  LoginRequestBody,
  LoginResponseBody,
  ResponseError,
} from "@app/types";
import { apiClient } from "../../../api/api";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useAuth } from "../../../contexts/authContext";
import { useNavigate } from "react-router";
import { useNotifications } from "../../../contexts/NotificationsContext";

export const login = async ({
  username,
  password,
}: LoginRequestBody): Promise<LoginResponseBody> => {
  const response = await apiClient.post("/auth/login", {
    username,
    password,
  });
  return response.data;
};

export function useLogin() {
  const { login: loginInStorage } = useAuth();
  const navigate = useNavigate();
  const { add } = useNotifications();
  return useMutation<
    LoginResponseBody,
    AxiosError<{ errors: ResponseError[] } | ResponseError>,
    LoginRequestBody
  >({
    mutationFn: login,
    mutationKey: ["login"],
    onSuccess: (data) => {
      loginInStorage(data);
      add("Logged in successfully.", "SUCCESS");
      navigate("/app/me");
    },
  });
}
