export function NotificationCount({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="absolute top-0 right-0 -translate-y-1/2 flex items-center justify-center w-5 h-5 bg-red-600 text-white text-xs font-medium rounded-full leading-none">
      {count}
    </span>
  );
}
