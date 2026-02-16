import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase.from("profile").select("*").maybeSingle();
      if (error?.message?.includes("JWT")) {
        await supabase.auth.signOut();
        const { data: r } = await supabase.from("profile").select("*").maybeSingle();
        return r;
      }
      return data;
    },
  });
}

export function useSocialLinks() {
  return useQuery({
    queryKey: ["social_links"],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase.from("social_links").select("*").order("display_order");
      if (error?.message?.includes("JWT")) {
        await supabase.auth.signOut();
        const { data: r } = await supabase.from("social_links").select("*").order("display_order");
        return r ?? [];
      }
      return data ?? [];
    },
  });
}

export function useExperiences() {
  return useQuery({
    queryKey: ["experiences"],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase.from("experiences").select("*").order("display_order");
      if (error?.message?.includes("JWT")) {
        await supabase.auth.signOut();
        const { data: r } = await supabase.from("experiences").select("*").order("display_order");
        return r ?? [];
      }
      return data ?? [];
    },
  });
}

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").order("display_order");
      if (error?.message?.includes("JWT")) {
        await supabase.auth.signOut();
        const { data: r } = await supabase.from("projects").select("*").order("display_order");
        return r ?? [];
      }
      return data ?? [];
    },
  });
}

export function usePricingPlans() {
  return useQuery({
    queryKey: ["pricing_plans"],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase.from("pricing_plans").select("*").order("display_order");
      if (error?.message?.includes("JWT")) {
        await supabase.auth.signOut();
        const { data: r } = await supabase.from("pricing_plans").select("*").order("display_order");
        return r ?? [];
      }
      return data ?? [];
    },
  });
}

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site_settings"],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*");
      if (error?.message?.includes("JWT")) {
        await supabase.auth.signOut();
        const { data: r } = await supabase.from("site_settings").select("*");
        const map: Record<string, string> = {};
        (r ?? []).forEach((s) => { map[s.key] = s.value ?? ""; });
        return map;
      }
      const map: Record<string, string> = {};
      (data ?? []).forEach((s) => { map[s.key] = s.value ?? ""; });
      return map;
    },
  });
}
