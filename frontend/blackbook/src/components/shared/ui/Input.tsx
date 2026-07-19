import type { ChangeEvent, ComponentPropsWithoutRef } from "react";

type InputProps = {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
} & ComponentPropsWithoutRef<"input">;

export function Input({ onChange, className = "", ...props }: InputProps) {
  return (
    <input
      {...props}
      onChange={onChange}
      className={`w-full bg-neutral-950 text-white placeholder-neutral-500 text-sm rounded-lg border border-neutral-800 px-3.5 py-2.5 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${className}`}
    />
  );
}
