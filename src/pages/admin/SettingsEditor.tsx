import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Trash2, UserPlus, Shield } from "lucide-react";

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
    if (!Array.isArray(settings)) return;
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

  // Admin management
  const [newAdminEmail, setNewAdminEmail] = useState("");

  const { data: admins = [], isLoading: adminsLoading } = useQuery({
    queryKey: ["admin_list"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("manage-admins", {
        body: { action: "list" },
      });
      if (error) throw error;
      return data.admins as { user_id: string; email: string; is_caller: boolean }[];
    },
  });

  const addAdminMutation = useMutation({
    mutationFn: async (email: string) => {
      const { data, error } = await supabase.functions.invoke("manage-admins", {
        body: { action: "add", email },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin_list"] });
      setNewAdminEmail("");
      toast({ title: "Admin added!" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const removeAdminMutation = useMutation({
    mutationFn: async (user_id: string) => {
      const { data, error } = await supabase.functions.invoke("manage-admins", {
        body: { action: "remove", user_id },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin_list"] });
      toast({ title: "Admin removed" });
    },
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

      <div className="max-w-2xl space-y-6">
        {/* Site Settings */}
        <div className="space-y-4 rounded-xl border bg-card p-6">
          {settingFields.map(({ key, label }) => (
            <div key={key} className="space-y-1.5">
              <Label>{label}</Label>
              <Input value={form[key] ?? ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
            </div>
          ))}
        </div>

        {/* Admin Management */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
            <Shield className="h-5 w-5" /> Admin Management
          </h2>

          {/* Add admin */}
          <div className="mb-4 flex gap-2">
            <Input
              placeholder="Enter email to add as admin"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              className="flex-1"
            />
            <Button
              size="sm"
              className="gap-1.5"
              disabled={!newAdminEmail.trim() || addAdminMutation.isPending}
              onClick={() => addAdminMutation.mutate(newAdminEmail.trim())}
            >
              <UserPlus className="h-4 w-4" />
              {addAdminMutation.isPending ? "Adding..." : "Add"}
            </Button>
          </div>

          {/* Admin list */}
          {adminsLoading ? (
            <p className="text-sm text-muted-foreground">Loading admins...</p>
          ) : admins.length === 0 ? (
            <p className="text-sm text-muted-foreground">No admins found.</p>
          ) : (
            <div className="divide-y divide-border rounded-lg border">
              {admins.map((admin) => (
                <div key={admin.user_id} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{admin.email}</span>
                    {admin.is_caller && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">You</span>
                    )}
                  </div>
                  {!admin.is_caller && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive"
                      disabled={removeAdminMutation.isPending}
                      onClick={() => removeAdminMutation.mutate(admin.user_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
