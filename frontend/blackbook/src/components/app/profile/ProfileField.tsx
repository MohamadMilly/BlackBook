import type { ReactNode } from "react";
import { ProfileFieldSkeleton } from "./skeleton/ProfileFieldSkeleton";

type ProfileFieldProps = {
  fieldKey: string;
  value: string | number;
  icon: ReactNode;
  isLoading: boolean;
};

export function ProfileField({
  fieldKey,
  value,
  icon,
  isLoading,
}: ProfileFieldProps) {
  if (isLoading) return <ProfileFieldSkeleton />;
  return (
    <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-neutral-700 transition-colors duration-200">
      <dt className="flex items-center gap-1.5 text-xs font-medium text-neutral-400 tracking-wide uppercase select-none">
        <span className="text-neutral-500 text-sm">{icon}</span>
        <span>{fieldKey}</span>
      </dt>
      <dd className="mt-1 text-sm font-medium text-neutral-200 hover:text-white hover:underline underline-offset-4 decoration-neutral-500 transition-colors">
        {value}
      </dd>
    </div>
  );
}
