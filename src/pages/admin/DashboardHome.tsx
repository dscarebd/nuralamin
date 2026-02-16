import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FolderOpen, Briefcase, DollarSign, Link2 } from "lucide-react";

export default function DashboardHome() {
  const { data: projects } = useQuery({ queryKey: ["projects"], queryFn: async () => { const { data } = await supabase.from("projects").select("id"); return data ?? []; }});
  const { data: experiences } = useQuery({ queryKey: ["experiences"], queryFn: async () => { const { data } = await supabase.from("experiences").select("id"); return data ?? []; }});
  const { data: plans } = useQuery({ queryKey: ["pricing_plans"], queryFn: async () => { const { data } = await supabase.from("pricing_plans").select("id"); return data ?? []; }});
  const { data: socials } = useQuery({ queryKey: ["social_links"], queryFn: async () => { const { data } = await supabase.from("social_links").select("id"); return data ?? []; }});

  const stats = [
    { label: "Projects", count: projects?.length ?? 0, icon: FolderOpen, color: "text-primary" },
    { label: "Experiences", count: experiences?.length ?? 0, icon: Briefcase, color: "text-emerald-500" },
    { label: "Pricing Plans", count: plans?.length ?? 0, icon: DollarSign, color: "text-amber-500" },
    { label: "Social Links", count: socials?.length ?? 0, icon: Link2, color: "text-purple-500" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-5">
            <div className="flex items-center gap-3">
              <s.icon className={`h-8 w-8 ${s.color}`} />
              <div>
                <p className="text-2xl font-bold text-foreground">{s.count}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
