import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import SortableItem from "@/components/admin/SortableItem";
import { useReorder } from "@/hooks/useReorder";

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
  const reorderMutation = useReorder("social_links", "social_links");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = links.findIndex((l) => l.id === active.id);
    const newIndex = links.findIndex((l) => l.id === over.id);
    const reordered = arrayMove(links, oldIndex, newIndex);
    reorderMutation.mutate(reordered.map((item, i) => ({ id: item.id, display_order: i + 1 })));
  };

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
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
            {links.map((link) => (
              <SortableItem key={link.id} id={link.id}>
                <div className="flex items-center gap-3 rounded-r-lg border border-l-0 bg-card p-3">
                  <Input defaultValue={link.platform} className="w-32" onBlur={(e) => updateMutation.mutate({ id: link.id, platform: e.target.value, url: link.url })} />
                  <Input defaultValue={link.url} className="flex-1" onBlur={(e) => updateMutation.mutate({ id: link.id, platform: link.platform, url: e.target.value })} />
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(link.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
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
