import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

export default function SocialEditor() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const { data: links = [], isLoading } = useQuery({
    queryKey: ["social_links"],
    queryFn: async () => {
      const { data } = await supabase.from("social_links").select("*").order("display_order");
      return data ?? [];
    },
  });

  const [newPlatform, setNewPlatform] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const addMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("social_links").insert({ platform: newPlatform, url: newUrl, display_order: links.length + 1 });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["social_links"] }); setNewPlatform(""); setNewUrl(""); toast({ title: "Link added!" }); },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("social_links").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["social_links"] }); toast({ title: "Link deleted!" }); },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, platform, url }: { id: string; platform: string; url: string }) => {
      const { error } = await supabase.from("social_links").update({ platform, url }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["social_links"] }); toast({ title: "Saved!" }); },
  });

  if (isLoading) return <div className="animate-pulse text-muted-foreground">Loading...</div>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Social Links</h1>
      <div className="max-w-2xl space-y-4">
        {links.map((link) => (
          <div key={link.id} className="flex items-center gap-3 rounded-lg border bg-card p-3">
            <Input defaultValue={link.platform} className="w-32" onBlur={(e) => updateMutation.mutate({ id: link.id, platform: e.target.value, url: link.url })} />
            <Input defaultValue={link.url} className="flex-1" onBlur={(e) => updateMutation.mutate({ id: link.id, platform: link.platform, url: e.target.value })} />
            <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(link.id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
        <div className="flex items-center gap-3 rounded-lg border border-dashed bg-card p-3">
          <Input placeholder="Platform" value={newPlatform} onChange={(e) => setNewPlatform(e.target.value)} className="w-32" />
          <Input placeholder="URL" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} className="flex-1" />
          <Button size="icon" onClick={() => addMutation.mutate()} disabled={!newPlatform || !newUrl}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
