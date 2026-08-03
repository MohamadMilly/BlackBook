import type { AxiosError } from "axios";
import type { ResponseError } from "@app/types";

export function getErrorMessage(
  error: AxiosError<{ errors: ResponseError[] } | ResponseError> | null,
): string {
  const errorData = error?.response?.data;

  if (!errorData) {
    return "An unexpected error occurred.";
  }

  if ("errors" in errorData && Array.isArray(errorData.errors)) {
    return errorData.errors[0]?.message ?? "An unexpected error occurred.";
  }

  if (
    "message" in errorData &&
    typeof errorData.message === "string" &&
    errorData.message.length > 0
  ) {
    return errorData.message;
  }

  return "An unexpected error occurred.";
}
