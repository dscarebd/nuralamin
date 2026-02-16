import { useLocation } from "react-router-dom";

export default function FloatingFooter() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className={`${isHome ? "lg:sticky lg:bottom-0" : ""} z-50 w-full px-4 pb-3 md:px-8`}>
      <footer className="mx-auto flex h-14 max-w-5xl items-center justify-between rounded-2xl border border-border bg-background/70 px-4 shadow-lg shadow-black/5 backdrop-blur-xl md:px-6">
        <span className="text-xs text-muted-foreground">
          NUR AL AMIN © 2017 – 2026. All Rights Reserved.
        </span>
        <span className="text-xs text-muted-foreground">
          Developed by <span className="font-semibold text-foreground">NUR AL AMIN</span>
        </span>
      </footer>
    </div>
  );
}
