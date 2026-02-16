import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await supabase.from("profile").select("*").maybeSingle();
      return data;
    },
  });
}

export function useSocialLinks() {
  return useQuery({
    queryKey: ["social_links"],
    queryFn: async () => {
      const { data } = await supabase.from("social_links").select("*").order("display_order");
      return data ?? [];
    },
  });
}

export function useExperiences() {
  return useQuery({
    queryKey: ["experiences"],
    queryFn: async () => {
      const { data } = await supabase.from("experiences").select("*").order("display_order");
      return data ?? [];
    },
  });
}

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await supabase.from("projects").select("*").order("display_order");
      return data ?? [];
    },
  });
}

export function usePricingPlans() {
  return useQuery({
    queryKey: ["pricing_plans"],
    queryFn: async () => {
      const { data } = await supabase.from("pricing_plans").select("*").order("display_order");
      return data ?? [];
    },
  });
}

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("*");
      const map: Record<string, string> = {};
      (data ?? []).forEach((s) => { map[s.key] = s.value ?? ""; });
      return map;
    },
  });
}
