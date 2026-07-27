export function Header() {
  return (
    <header className="flex items-center col-start-1 col-end-2 grid-rows-1 grid-row-2 md:col-start-2 md:col-end-4 bg-neutral-900 border-b border-neutral-800 px-3 py-1">
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
