import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ContentProtection({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/abdullah");
  const isBlogPost = /^\/blog\/.+/.test(location.pathname);
  const shouldBlockCopy = !isAdmin && !isBlogPost;
  const shouldBlockDevTools = !isAdmin;

  useEffect(() => {
    if (!shouldBlockDevTools && !shouldBlockCopy) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // DevTools blocking (all public pages)
      if (shouldBlockDevTools) {
        if (
          e.key === "F12" ||
          ((e.ctrlKey || e.metaKey) && e.shiftKey && ["I", "i", "J", "j", "C", "c"].includes(e.key)) ||
          ((e.ctrlKey || e.metaKey) && e.key === "u")
        ) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
      }

      // Copy blocking (non-blog-post pages)
      if (shouldBlockCopy) {
        if ((e.ctrlKey || e.metaKey) && ["c", "C", "x", "X", "a", "A"].includes(e.key)) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    const preventEvent = (e: Event) => e.preventDefault();

    document.addEventListener("keydown", handleKeyDown, true);

    if (shouldBlockCopy) {
      document.addEventListener("contextmenu", preventEvent, true);
      document.addEventListener("copy", preventEvent, true);
      document.addEventListener("cut", preventEvent, true);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      if (shouldBlockCopy) {
        document.removeEventListener("contextmenu", preventEvent, true);
        document.removeEventListener("copy", preventEvent, true);
        document.removeEventListener("cut", preventEvent, true);
      }
    };
  }, [shouldBlockCopy, shouldBlockDevTools]);

  return (
    <div className={shouldBlockCopy ? "content-protected" : ""}>
      {children}
    </div>
  );
}
