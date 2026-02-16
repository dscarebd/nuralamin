import { useLocation } from "react-router-dom";

export default function FloatingFooter() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className={`${isHome ? "lg:sticky lg:bottom-0" : ""} z-50 w-full px-4 pb-3 md:px-8`}>
      <footer className="mx-auto flex h-auto flex-col items-center gap-1 rounded-2xl border border-border bg-background/70 px-4 py-3 shadow-lg shadow-black/5 backdrop-blur-xl sm:h-14 sm:flex-row sm:justify-between sm:gap-0 sm:py-0 md:px-6 max-w-5xl">
        <span className="text-xs text-muted-foreground text-center">
          NUR AL AMIN © 2017 – 2026. All Rights Reserved.
        </span>
        <span className="text-xs text-muted-foreground text-center">
          Developed by <span className="font-semibold text-foreground">NUR AL AMIN</span>
        </span>
      </footer>
    </div>
  );
}
