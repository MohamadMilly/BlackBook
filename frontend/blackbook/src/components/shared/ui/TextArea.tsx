import { useRef, type ChangeEvent, type ComponentPropsWithoutRef } from "react";

type TextAreaProps = {
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
} & ComponentPropsWithoutRef<"textarea">;

export function TextArea({
  onChange,
  className = "",
  ...props
}: TextAreaProps) {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const onChangeWithAutoExpand = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const textareaEl = textAreaRef.current;
    if (textareaEl) {
      textareaEl.style.height = "auto";
      textareaEl.style.height =
        Math.min(
          textareaEl.scrollHeight,
          parseInt(textareaEl.style.maxHeight),
        ) + "px";
    }
    onChange(e);
  };
  return (
    <textarea
      className={`w-full bg-neutral-950 text-white placeholder-neutral-500 text-sm rounded-lg border border-neutral-800 px-3.5 py-2.5 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20  ${className}`}
      ref={textAreaRef}
      onChange={onChangeWithAutoExpand}
      {...props}
    ></textarea>
  );
}
