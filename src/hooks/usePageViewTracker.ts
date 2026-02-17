import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

function getVisitorId(): string {
  const key = "visitor_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export function usePageViewTracker() {
  const location = useLocation();
  const lastTracked = useRef("");

  useEffect(() => {
    // Skip admin routes
    if (location.pathname.startsWith("/admin")) return;

    const path = location.pathname;
    if (path === lastTracked.current) return;
    lastTracked.current = path;

    const visitorId = getVisitorId();

    supabase.from("page_views").insert({
      page_path: path,
      visitor_id: visitorId,
      user_agent: navigator.userAgent,
      referrer: document.referrer || null,
    }).then(() => {});
  }, [location.pathname]);
}
