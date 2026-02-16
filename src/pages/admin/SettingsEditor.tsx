import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function SettingsEditor() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const { data: settings = [], isLoading } = useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("*");
      return data ?? [];
    },
  });

  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    const map: Record<string, string> = {};
    settings.forEach((s) => { map[s.key] = s.value ?? ""; });
    setForm(map);
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      for (const [key, value] of Object.entries(form)) {
        const existing = settings.find((s) => s.key === key);
        if (existing) {
          await supabase.from("site_settings").update({ value }).eq("id", existing.id);
        } else {
          await supabase.from("site_settings").insert({ key, value });
        }
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["site_settings"] }); toast({ title: "Settings saved!" }); },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  if (isLoading) return <div className="animate-pulse text-muted-foreground">Loading...</div>;

  const settingFields = [
    { key: "footer_text", label: "Footer Text" },
    { key: "cta_text", label: "CTA Title" },
    { key: "cta_description", label: "CTA Description" },
    { key: "telegram_url", label: "Telegram URL" },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Site Settings</h1>
        <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
          {saveMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
      <div className="max-w-2xl space-y-4 rounded-xl border bg-card p-6">
        {settingFields.map(({ key, label }) => (
          <div key={key} className="space-y-1.5">
            <Label>{label}</Label>
            <Input value={form[key] ?? ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
          </div>
        ))}
      </div>
    </div>
  );
}
