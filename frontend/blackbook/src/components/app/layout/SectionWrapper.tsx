import type { JSX, ReactNode } from "react";

type SectionWrapperProps = {
  children: ReactNode;
  title: string;
};

export function SectionWrapper({
  children,
  title,
}: SectionWrapperProps): JSX.Element {
  return (
    <section className="max-w-5xl w-full mx-auto px-4 py-6 col-start-2 col-end-3 row-start-2 row-end-3 h-full flex flex-col min-h-0">
      <h2 className="md:text-4xl text-3xl font-bold mb-4 shrink-0">{title}</h2>

      <div className="flex-1 overflow-y-auto pr-2 scrollbar-custom">
        {children}
      </div>
    </section>
  );
}
