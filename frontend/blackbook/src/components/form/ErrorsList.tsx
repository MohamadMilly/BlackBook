import type { ResponseError } from "@app/types";

export function ErrorsList({ errors }: { errors: ResponseError[] }) {
  if (errors.length === 0) return null;
  return (
    <div>
      <ul className="text-sm bg-red-500/10 p-2 rounded-lg border border-red-600">
        {errors.map((err, index) => {
          return <li key={index}> - {err.message}</li>;
        })}
      </ul>
    </div>
  );
}
