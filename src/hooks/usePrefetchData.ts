import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function usePrefetchData() {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["profile"],
      queryFn: async () => {
        const { data } = await supabase.from("profile").select("*").maybeSingle();
        return data;
      },
    });
    queryClient.prefetchQuery({
      queryKey: ["social_links"],
      queryFn: async () => {
        const { data } = await supabase.from("social_links").select("*").order("display_order");
        return data ?? [];
      },
    });
    queryClient.prefetchQuery({
      queryKey: ["experiences"],
      queryFn: async () => {
        const { data } = await supabase.from("experiences").select("*").order("display_order");
        return data ?? [];
      },
    });
    queryClient.prefetchQuery({
      queryKey: ["projects"],
      queryFn: async () => {
        const { data } = await supabase.from("projects").select("*").order("display_order");
        return data ?? [];
      },
    });
    queryClient.prefetchQuery({
      queryKey: ["pricing_plans"],
      queryFn: async () => {
        const { data } = await supabase.from("pricing_plans").select("*").order("display_order");
        return data ?? [];
      },
    });
    queryClient.prefetchQuery({
      queryKey: ["site_settings"],
      queryFn: async () => {
        const { data } = await supabase.from("site_settings").select("*");
        const map: Record<string, string> = {};
        (data ?? []).forEach((s) => { map[s.key] = s.value ?? ""; });
        return map;
      },
    });
  }, [queryClient]);
}
