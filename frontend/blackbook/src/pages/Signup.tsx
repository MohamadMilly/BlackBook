import {
  useCallback,
  useMemo,
  useState,
  type ChangeEvent,
  type SubmitEvent,
} from "react";
import { Button } from "../components/shared/ui/Button";
import { Link } from "react-router";
import { Input } from "../components/shared/ui/Input";
import { useSignup } from "../hooks/api/auth/useSignup";
import type { ResponseError } from "@app/types";
import { useMarkFieldsInValid } from "../hooks/utils/useMarkFieldsInvalid";
import { ErrorsList } from "../components/form/ErrorsList";
import { FormWrapper } from "../components/form/FormWrapper";
import { getServerAndValidationErrors } from "../shared/utils/getServerAndValidationError";

type SignUpInDataType = {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  confirmPassword: string;
};

export function SignUpPage() {
  const [signUpData, setSignUpData] = useState<SignUpInDataType>({
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const { mutate: signUp, isPending, error } = useSignup();

  const errors: ResponseError[] = useMemo(
    () => getServerAndValidationErrors(error),
    [error],
  );
  useMarkFieldsInValid(errors);

  const handleSignUpDataChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>, key: keyof SignUpInDataType) => {
      setSignUpData((prev) => ({ ...prev, [key]: e.target.value }));
    },
    [],
  );
  const handleSignupSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    signUp(signUpData);
  };
  return (
    <FormWrapper>
      <div className="space-y-2 text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Create an account
        </h2>
        <p className="text-sm text-neutral-400">
          Enter your details below to get started
        </p>
      </div>

      <form
        onSubmit={handleSignupSubmit}
        action="/login"
        method="POST"
        className="space-y-5"
      >
        <ErrorsList errors={errors} />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="firstname"
              className="required-label text-sm font-medium text-neutral-300"
            >
              First Name
            </label>
            <Input
              onChange={(e) => handleSignUpDataChange(e, "firstname")}
              id="firstname"
              name="firstname"
              type="text"
              required
              placeholder="Mohammed"
              value={signUpData["firstname"]}
              className="user-invalid:border-red-600"
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="lastname"
              className="required-label text-sm font-medium text-neutral-300"
            >
              Last Name
            </label>
            <Input
              onChange={(e) => handleSignUpDataChange(e, "lastname")}
              id="lastname"
              name="lastname"
              type="text"
              required
              placeholder="Milly"
              value={signUpData["lastname"]}
              className="user-invalid:border-red-600"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="username"
            className="required-label text-sm font-medium text-neutral-300"
          >
            Username
          </label>
          <Input
            onChange={(e) => handleSignUpDataChange(e, "username")}
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            placeholder="Enter your username"
            value={signUpData["username"]}
            className="user-invalid:border-red-600"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="required-label text-sm font-medium text-neutral-300"
          >
            Password
          </label>
          <Input
            onChange={(e) => handleSignUpDataChange(e, "password")}
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            value={signUpData["password"]}
            className="user-invalid:border-red-600"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="confirmPassword"
            className="required-label text-sm font-medium text-neutral-300"
          >
            Confirm Password
          </label>
          <Input
            onChange={(e) => handleSignUpDataChange(e, "confirmPassword")}
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            placeholder="••••••••"
            value={signUpData["confirmPassword"]}
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
        Already have an account?{" "}
        <Link
          to="/log-in"
          className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
        >
          Log in
        </Link>
      </p>
    </FormWrapper>
  );
}
