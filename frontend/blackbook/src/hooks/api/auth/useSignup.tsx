import type {
  ResponseError,
  SignUpRequestBody,
  SignUpResponseBody,
} from "@app/types";
import { apiClient } from "../../../api/api";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNotifications } from "../../../contexts/NotificationsContext";

const signup = async ({
  firstname,
  lastname,
  username,
  password,
  confirmPassword,
}: SignUpRequestBody): Promise<SignUpResponseBody> => {
  const response = await apiClient.post("/auth/signup", {
    firstname,
    lastname,
    username,
    password,
    confirmPassword,
  });

  return response.data;
};

export function useSignup() {
  const { add } = useNotifications();
  return useMutation<
    SignUpResponseBody,
    AxiosError<{ errors: ResponseError[] } | ResponseError>,
    SignUpRequestBody
  >({
    mutationKey: ["signup"],
    mutationFn: signup,
    onSuccess: () => {
      add("Account created successfully.", "SUCCESS");
    },
  });
}
