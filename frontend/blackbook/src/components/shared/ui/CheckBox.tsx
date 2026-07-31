import React, { useId } from "react";
import type { JSX } from "react";

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
}

export function Checkbox({
  label,
  description,
  className = "",
  disabled,
  ...props
}: CheckboxProps): JSX.Element {
  const generatedId = useId();
  const id = props.id || generatedId;

  return (
    <div
      className={`flex flex-col gap-1.5 ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    >
      <div className="flex items-start gap-3">
        <div className="relative flex items-center h-5">
          <input
            {...props}
            id={id}
            type="checkbox"
            disabled={disabled}
            className={`
              peer appearance-none shrink-0 w-5 h-5 rounded-md bg-neutral-700 cursor-pointer
              transition-all duration-200 ease-in-out
              /* Focus ring states */
              focus:outline-none 
              /* Checked background and border styling */
              checked:bg-blue-600 checked:border-blue-600
              /* Hover styles */
              hover:border-slate-400 checked:hover:bg-blue-700 checked:hover:border-blue-700
              /* Error styling conditions */
              
              ${className}
            `}
          />

          {/* Custom SVG Checkmark Icon linked via Tailwind peer utility */}
          <svg
            className="absolute inset-0 w-5 h-5 p-0.5 pointer-events-none text-white scale-50 opacity-0 peer-checked:scale-100 peer-checked:opacity-100 transition-all duration-200 ease-in-out"
            xmlns="http://w3.org"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {label && (
          <div className="flex flex-col select-none">
            <label
              htmlFor={id}
              className="text-sm text-neutral-100 cursor-pointer"
            >
              {label}
            </label>
            {description && (
              <span className="text-xs text-slate-500 mt-0.5">
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
