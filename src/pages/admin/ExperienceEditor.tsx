import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Save } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";

import SortableItem from "@/components/admin/SortableItem";
import { useReorder } from "@/hooks/useReorder";

export default function ExperienceEditor() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const { data: experiences = [], isLoading } = useQuery({
    queryKey: ["experiences"],
    queryFn: async () => {
      const { data } = await supabase.from("experiences").select("*").order("display_order");
      return data ?? [];
    },
  });

  const [editing, setEditing] = useState<Record<string, { title: string; company: string; period: string; description: string }>>({});
  const reorderMutation = useReorder("experiences", "experiences");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = experiences.findIndex((e) => e.id === active.id);
    const newIndex = experiences.findIndex((e) => e.id === over.id);
    const reordered = arrayMove(experiences, oldIndex, newIndex);
    reorderMutation.mutate(reordered.map((item, i) => ({ id: item.id, display_order: i + 1 })));
  };

  const startEdit = (exp: typeof experiences[0]) => {
    setEditing({ ...editing, [exp.id]: { title: exp.title, company: exp.company, period: exp.period, description: exp.description ?? "" } });
  };

  const saveMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof editing[string] }) => {
      const { error } = await supabase.from("experiences").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, { id }) => { qc.invalidateQueries({ queryKey: ["experiences"] }); setEditing((e) => { const n = { ...e }; delete n[id]; return n; }); toast({ title: "Saved!" }); },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("experiences").insert({ title: "New Role", company: "Company", period: "2025", display_order: experiences.length + 1 });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["experiences"] }); toast({ title: "Added!" }); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("experiences").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["experiences"] }); toast({ title: "Deleted!" }); },
  });

  if (isLoading) return <div className="animate-pulse text-muted-foreground">Loading...</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Experience</h1>
        <Button onClick={() => addMutation.mutate()} className="gap-2"><Plus className="h-4 w-4" /> Add</Button>
      </div>
      <div className="max-w-2xl space-y-4">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={experiences.map((e) => e.id)} strategy={verticalListSortingStrategy}>
            {experiences.map((exp) => {
              const ed = editing[exp.id];
              return (
                <SortableItem key={exp.id} id={exp.id}>
                  <div className="rounded-r-xl border border-l-0 bg-card p-4 space-y-3">
                    {ed ? (
                      <>
                        <Input value={ed.title} onChange={(e) => setEditing({ ...editing, [exp.id]: { ...ed, title: e.target.value } })} placeholder="Title" />
                        <Input value={ed.company} onChange={(e) => setEditing({ ...editing, [exp.id]: { ...ed, company: e.target.value } })} placeholder="Company" />
                        <Input value={ed.period} onChange={(e) => setEditing({ ...editing, [exp.id]: { ...ed, period: e.target.value } })} placeholder="Period" />
                        <Textarea value={ed.description} onChange={(e) => setEditing({ ...editing, [exp.id]: { ...ed, description: e.target.value } })} placeholder="Description" rows={3} />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => saveMutation.mutate({ id: exp.id, data: ed })} className="gap-1"><Save className="h-3 w-3" /> Save</Button>
                          <Button size="sm" variant="outline" onClick={() => setEditing((e) => { const n = { ...e }; delete n[exp.id]; return n; })}>Cancel</Button>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-start justify-between">
                        <div onClick={() => startEdit(exp)} className="cursor-pointer flex-1">
                          <h3 className="font-semibold text-foreground">{exp.title}</h3>
                          <p className="text-sm text-muted-foreground">{exp.company} · {exp.period}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{exp.description}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(exp.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    )}
                  </div>
                </SortableItem>
              );
            })}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
