interface InlinePanelProps {
  isOpen: boolean;
  children: React.ReactNode;
  float?: boolean;
}

export function InlinePanel({
  isOpen,
  children,
  float = false,
}: InlinePanelProps) {
  return (
    <aside
      className={`fixed right-0 top-0 z-600 bg-black ${float ? "" : "md:static"} transition-all duration-300 ease-in-out shrink-0 -col-end-1 row-start-2 row-end-3 min-h-0
        ${isOpen ? "h-full w-81 opacity-100 visible border-l border-l-neutral-800" : "h-full w-0 opacity-0 invisible overflow-hidden border-l-0"}`}
    >
      <div className={"w-[320px] p-4 h-full"}>{children}</div>
    </aside>
  );
}
