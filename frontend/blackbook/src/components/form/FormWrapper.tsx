import type { JSX, ReactNode } from "react";

export function FormWrapper({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <main className="min-h-screen flex sm:items-center justify-center px-4 py-12">
      <section className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl p-8 shadow-2xl">
        {children}
      </section>
    </main>
  );
}
