import { useCallback, useState, type ChangeEvent } from "react";
import { Button } from "../components/shared/ui/Button";
import { Link } from "react-router";
import { Input } from "../components/shared/ui/Input";

type LogInDataType = {
  username: string;
  password: string;
};

export function LoginPage() {
  const [logInData, setLogInData] = useState<LogInDataType>({
    username: "",
    password: "",
  });
  const handleLogInDataChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>, key: keyof LogInDataType) => {
      setLogInData((prev) => ({ ...prev, [key]: e.target.value }));
    },
    [],
  );
  
  return (
    <main className="min-h-screen flex sm:items-center justify-center px-4 py-12">
      <section className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl p-8 shadow-2xl">
        <div className="space-y-2 text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Welcome back
          </h2>
          <p className="text-sm text-neutral-400">
            Enter your credentials to access your account
          </p>
        </div>

        <form action="/login" method="POST" className="space-y-5">
          <div className="space-y-1.5">
            <label
              htmlFor="username"
              className="text-sm font-medium text-neutral-300"
            >
              Username
            </label>
            <Input
              onChange={(e) => handleLogInDataChange(e, "username")}
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              placeholder="Enter your username"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-medium text-neutral-300"
              >
                Password
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
          Don't have an account?{" "}
          <Link
            to={"/sign-up"}
            className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            Sign up
          </Link>
        </p>
      </section>
    </main>
  );
}
