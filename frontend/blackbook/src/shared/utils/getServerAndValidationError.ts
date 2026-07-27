import type { ResponseError } from "@app/types";
import type { AxiosError } from "axios";

export function getServerAndValidationErrors(
  rawErrorData: AxiosError<{ errors: ResponseError[] } | ResponseError> | null,
): ResponseError[] {
  const errorData = rawErrorData?.response?.data;
  return Array.isArray(errorData?.errors)
    ? errorData.errors
    : typeof rawErrorData === "object" && rawErrorData !== null
      ? [rawErrorData.response?.data as ResponseError]
      : [];
}
