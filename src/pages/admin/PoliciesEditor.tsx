import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Shield, FileText, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const POLICY_KEYS = [
  { key: "privacy_policy_content", label: "Privacy Policy", icon: Shield },
  { key: "terms_of_service_content", label: "Terms of Service", icon: FileText },
  { key: "refund_policy_content", label: "Refund Policy", icon: RotateCcw },
] as const;

const DATE_KEYS = [
  { key: "privacy_policy_date", label: "Privacy Policy" },
  { key: "terms_of_service_date", label: "Terms of Service" },
  { key: "refund_policy_date", label: "Refund Policy" },
] as const;

export default function PoliciesEditor() {
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
      const allKeys = [...POLICY_KEYS.map(p => p.key), ...DATE_KEYS.map(d => d.key)];
      for (const key of allKeys) {
        const value = form[key] ?? "";
        const existing = settings.find((s) => s.key === key);
        if (existing) {
          await supabase.from("site_settings").update({ value }).eq("id", existing.id);
        } else {
          await supabase.from("site_settings").insert({ key, value });
        }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site_settings"] });
      toast({ title: "Policies saved!" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  if (isLoading) return <div className="animate-pulse text-muted-foreground">Loading...</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Policy Pages</h1>
        <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
          {saveMutation.isPending ? "Saving..." : "Save All Policies"}
        </Button>
      </div>

      <Tabs defaultValue="privacy_policy_content" className="space-y-4">
        <TabsList className="w-full justify-start">
          {POLICY_KEYS.map(({ key, label, icon: Icon }) => (
            <TabsTrigger key={key} value={key} className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon className="h-3.5 w-3.5" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {POLICY_KEYS.map(({ key, label }, idx) => (
          <TabsContent key={key} value={key}>
            <div className="space-y-4 rounded-xl border bg-card p-6">
              <div className="space-y-1.5">
                <Label>Last Updated Date</Label>
                <Input
                  value={form[DATE_KEYS[idx].key] ?? ""}
                  onChange={(e) => setForm({ ...form, [DATE_KEYS[idx].key]: e.target.value })}
                  placeholder="e.g. February 17, 2026"
                />
              </div>
              <div className="space-y-1.5">
                <Label>{label} Content</Label>
                <p className="text-xs text-muted-foreground">
                  Use the rich text editor to format your policy. Use headings for sections and lists for items.
                </p>
                <RichTextEditor
                  value={form[key] ?? ""}
                  onChange={(html) => setForm({ ...form, [key]: html })}
                />
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
