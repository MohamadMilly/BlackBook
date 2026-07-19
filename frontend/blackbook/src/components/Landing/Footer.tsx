export function LandingFooter() {
  return (
    <footer className="flex flex-col mt-12 px-4 py-6 min-h-50 bg-black border-t border-neutral-700/80">
      <div className="w-15 h-15">
        <img
          className="object-cover"
          src="/BlackBook_logo.png"
          alt="BlackBook Logo"
        />
      </div>
      <p className="text-xs text-neutral-400 text-center mt-auto">
        &copy; 2026 BlackBook. All rights reserved.
      </p>
    </footer>
  );
}
