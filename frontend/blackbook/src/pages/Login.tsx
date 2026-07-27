import {
  useCallback,
  useMemo,
  useState,
  type ChangeEvent,
  type SubmitEvent,
} from "react";
import { Button } from "../components/shared/ui/Button";
import { Link, useNavigate } from "react-router";
import { Input } from "../components/shared/ui/Input";
import { useLogin } from "../hooks/api/auth/useLogin";
import type { ResponseError } from "@app/types";
import { useMarkFieldsInValid } from "../hooks/utils/useMarkFieldsInvalid";
import { ErrorsList } from "../components/form/ErrorsList";
import { FormWrapper } from "../components/form/FormWrapper";
import { getServerAndValidationErrors } from "../shared/utils/getServerAndValidationError";

type LogInDataType = {
  username: string;
  password: string;
};

export function LoginPage() {
  const [logInData, setLogInData] = useState<LogInDataType>({
    username: "",
    password: "",
  });
  const { mutate: login, isPending, error } = useLogin();
  const navigate = useNavigate();
  const errors: ResponseError[] = useMemo(() => {
    return getServerAndValidationErrors(error);
  }, [error]);
  console.log(errors);
  useMarkFieldsInValid(errors);

  const handleLogInDataChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>, key: keyof LogInDataType) => {
      setLogInData((prev) => ({ ...prev, [key]: e.target.value }));
    },
    [],
  );

  const handleLoginSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(logInData, {
      onSuccess: () => navigate("/app/me"),
    });
  };

  return (
    <FormWrapper>
      <div className="space-y-2 text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Welcome back
        </h2>
        <p className="text-sm text-neutral-400">
          Enter your credentials to access your account
        </p>
      </div>

      <form
        onSubmit={handleLoginSubmit}
        action="/login"
        method="POST"
        className="space-y-5"
      >
        <ErrorsList errors={errors} />
        <div className="space-y-1.5">
          <label
            htmlFor="username"
            className="text-sm font-medium text-neutral-300 required-label"
          >
            <span>Username</span>
          </label>
          <Input
            onChange={(e) => handleLogInDataChange(e, "username")}
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            placeholder="Enter your username"
            className="user-invalid:border-red-600"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium text-neutral-300 required-label"
            >
              <span>Password</span>
            </label>
          </div>
          <Input
            onChange={(e) => handleLogInDataChange(e, "password")}
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className="user-invalid:border-red-600"
          />
        </div>

        <Button
          disabled={isPending}
          type="submit"
          className="w-full mt-2 py-2.5! rounded-lg shadow-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
        >
          {isPending ? "Submitting" : "Submit"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-neutral-400">
        Don't have an account?{" "}
        <Link
          to={"/sign-up"}
          className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
        >
          Sign up
        </Link>
      </p>
    </FormWrapper>
  );
}
