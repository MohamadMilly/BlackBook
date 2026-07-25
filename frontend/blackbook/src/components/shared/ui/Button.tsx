import type { ComponentPropsWithoutRef, ReactNode } from "react";
import buttonSoundEffect from "../../../assests/audio/button_soundeffect.mp3";
type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
} & ComponentPropsWithoutRef<"button">;

export function Button({
  children,
  onClick,
  className = "",
  ...props
}: ButtonProps) {
  const handleClickWithSound = () => {
    const likeButtonAudio = new Audio(buttonSoundEffect);
    likeButtonAudio.play().catch((err) => {
      console.error("Error playing sound: ", err);
    });
    if (typeof onClick === "function") {
      onClick();
    }
  };
  return (
    <button
      onClick={handleClickWithSound}
      className={`flex items-center justify-center px-3.5 py-1.5 text-xs sm:text-base font-semibold tracking-wide capitalize text-white bg-neutral-800 hover:bg-black border border-white/10 shadow-[0_0_0_1px_rgba(0,0,0,1),0_1px_2px_rgba(0,0,0,0.05),0_0_12px_rgba(37,99,235,0.2)] hover:shadow-[0_0_0_1px_rgba(0,0,0,1),0_1px_2px_rgba(0,0,0,0.05),0_0_20px_rgba(37,99,235,0.45)] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-800 focus-visible:outline-none transition-all duration-150 active:scale-95 cursor-pointer select-none rounded-md ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
