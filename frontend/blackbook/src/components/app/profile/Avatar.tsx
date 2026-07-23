import type { JSX } from "react/jsx-runtime";

type AvatarProps = {
  avatarUrl: string;
  size: number;
  className?: string;
};

export function Avatar({
  avatarUrl,
  size,
  className = "",
}: AvatarProps): JSX.Element {
  return (
    <div
      className={`rounded-full overflow-hidden ${className}`}
      style={{
        width: size + "px",
        height: size + "px",
      }}
    >
      <img
        className="object-cover w-full h-full"
        src={
          avatarUrl ??
          "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
        }
        alt="Avatar"
      />
    </div>
  );
}
