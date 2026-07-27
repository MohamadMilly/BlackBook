import { LoaderCircle } from "lucide-react";

export function Spinner({
  className = "",
  size,
}: {
  className?: string;
  size: number;
}) {
  return (
    <div className={`${className} text-blue-600`}>
      <LoaderCircle size={size} className="animate-spin" />
    </div>
  );
}
