import { Link, useLocation } from "react-router-dom";

export default function FloatingFooter() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className={`${isHome ? "lg:sticky lg:bottom-0" : ""} z-50 w-full px-4 pb-3 md:px-8`}>
      <footer className="mx-auto flex flex-col items-center gap-2 rounded-2xl border border-border bg-background/70 px-4 py-3 shadow-lg shadow-black/5 backdrop-blur-xl md:px-6 max-w-5xl">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <Link to="/privacy-policy" className="text-sm text-muted-foreground transition-colors hover:text-primary">
            Privacy Policy
          </Link>
          <span className="text-sm text-muted-foreground/40">•</span>
          <Link to="/terms-of-service" className="text-sm text-muted-foreground transition-colors hover:text-primary">
            Terms of Service
          </Link>
          <span className="text-sm text-muted-foreground/40">•</span>
          <Link to="/refund-policy" className="text-sm text-muted-foreground transition-colors hover:text-primary">
            Refund Policy
          </Link>
        </div>
        <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-3">
          <span className="text-sm text-muted-foreground text-center">
            NUR AL AMIN © 2017 – 2026. All Rights Reserved.
          </span>
          <span className="hidden sm:inline text-sm text-muted-foreground/40">•</span>
          <span className="text-sm text-muted-foreground text-center">
            Developed by <span className="font-semibold text-foreground">NUR AL AMIN</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
