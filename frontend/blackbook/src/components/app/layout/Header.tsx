export function Header() {
  return (
    <header className="flex items-center col-start-2 col-end-3 bg-neutral-900 border-b border-neutral-800 px-3 py-1">
      <div className="h-7.5">
        <img
          className="h-full w-auto object-cover"
          src="/BlackBook_logo.png"
          alt="BlackBook logo"
        />
      </div>
    </header>
  );
}
