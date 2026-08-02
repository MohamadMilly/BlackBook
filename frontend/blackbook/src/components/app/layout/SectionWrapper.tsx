import type { JSX, ReactNode } from "react";

type SectionWrapperProps = {
  children: ReactNode;
  title: string;
  className?: string;
};

export function SectionWrapper({
  children,
  title,
  className = "",
}: SectionWrapperProps): JSX.Element {
  return (
    <section className="max-w-5xl w-full mx-auto md:px-4 px-3 md:py-6 py-3 col-start-1 col-end-2 md:col-start-2 md:col-end-3 row-start-2 row-end-3 h-full flex flex-col min-h-0">
      <h2 className="md:text-4xl text-3xl font-bold mb-4 shrink-0">{title}</h2>

      <div className={`flex-1 overflow-y-auto scrollbar-custom ${className}`}>
        {children}
      </div>
    </section>
  );
}
