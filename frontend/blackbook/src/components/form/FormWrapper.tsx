import type { JSX, ReactNode } from "react";

export function FormWrapper({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <main className="h-screen w-full overflow-y-auto flex justify-center px-4 py-12">
      <section className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl p-8 shadow-2xl my-auto">
        {children}
      </section>
    </main>
  );
}
// my auto is better than items-center , because items-center always tries to center the center of the card in the center of the screen
// but , my-auto when the form is taller than the screen , it makes the margin top and bottom 0
