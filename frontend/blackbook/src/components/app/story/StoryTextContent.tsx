export function StoryTextContent({
  title,
  content,
}: {
  title: string | null;
  content: string;
}) {
  return (
    <div className="max-h-[25vh] overflow-y-auto my-3 scrollbar-custom">
      {title && (
        <h3
          dir="auto"
          className="text-lg font-bold tracking-tight leading-tight"
        >
          {title}
        </h3>
      )}

      <p
        dir="auto"
        className="text-sm font-normal text-neutral-200 leading-relaxed wrap-break-word"
      >
        {content}
      </p>
    </div>
  );
}
