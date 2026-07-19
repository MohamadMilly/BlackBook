import { useCallback, useState, type ChangeEvent } from "react";
import { Button } from "../components/shared/ui/Button";
import { Link } from "react-router";
import { Input } from "../components/shared/ui/Input";

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

  const handleSignUpDataChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>, key: keyof SignUpInDataType) => {
      setSignUpData((prev) => ({ ...prev, [key]: e.target.value }));
    },
    [],
  );

  return (
    <main className="min-h-screen flex sm:items-center justify-center px-4 py-12">
      <section className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl p-8 shadow-2xl">
        <div className="space-y-2 text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Create an account
          </h2>
          <p className="text-sm text-neutral-400">
            Enter your details below to get started
          </p>
        </div>

        <form action="/login" method="POST" className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="firstname"
                className="text-sm font-medium text-neutral-300"
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
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="lastname"
                className="text-sm font-medium text-neutral-300"
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
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="username"
              className="text-sm font-medium text-neutral-300"
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
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-neutral-300"
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
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-neutral-300"
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
            />
          </div>

          <Button
            onClick={() => {}}
            type="submit"
            className="w-full mt-2 py-2.5! rounded-lg shadow-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
          >
            Submit
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
      </section>
    </main>
  );
}
