import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Save } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import MultiImageUpload from "@/components/admin/MultiImageUpload";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import SortableItem from "@/components/admin/SortableItem";
import { useReorder } from "@/hooks/useReorder";

type ProjectForm = { title: string; category: string; description: string; tech: string; image_url: string; gallery_images: string[]; link: string; budget: string; date: string };

export default function ProjectsEditor() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await supabase.from("projects").select("*").order("display_order");
      return data ?? [];
    },
  });

  const [editing, setEditing] = useState<Record<string, ProjectForm>>({});
  const reorderMutation = useReorder("projects", "projects");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = projects.findIndex((p) => p.id === active.id);
    const newIndex = projects.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(projects, oldIndex, newIndex);
    reorderMutation.mutate(reordered.map((item, i) => ({ id: item.id, display_order: i + 1 })));
  };

  const startEdit = (p: typeof projects[0]) => {
    setEditing({ ...editing, [p.id]: { title: p.title, category: p.category ?? "", description: p.description ?? "", tech: (p.tech ?? []).join(", "), image_url: p.image_url ?? "", gallery_images: (p as any).gallery_images ?? [], link: p.link ?? "", budget: p.budget ?? "", date: p.date ?? "" } });
  };

  const saveMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProjectForm }) => {
      const { error } = await supabase.from("projects").update({
        title: data.title, category: data.category, description: data.description,
        tech: data.tech.split(",").map((t) => t.trim()).filter(Boolean),
        image_url: data.image_url || null, gallery_images: data.gallery_images, link: data.link, budget: data.budget, date: data.date,
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, { id }) => { qc.invalidateQueries({ queryKey: ["projects"] }); setEditing((e) => { const n = { ...e }; delete n[id]; return n; }); toast({ title: "Saved!" }); },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("projects").insert({ title: "New Project", display_order: projects.length + 1 });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["projects"] }); toast({ title: "Added!" }); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["projects"] }); toast({ title: "Deleted!" }); },
  });

  if (isLoading) return <div className="animate-pulse text-muted-foreground">Loading...</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Portfolio Projects</h1>
        <Button onClick={() => addMutation.mutate()} className="gap-2"><Plus className="h-4 w-4" /> Add Project</Button>
      </div>
      <div className="max-w-2xl space-y-4">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={projects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
            {projects.map((p) => {
              const ed = editing[p.id];
              return (
                <SortableItem key={p.id} id={p.id}>
                  <div className="rounded-r-xl border border-l-0 bg-card p-4 space-y-3">
                    {ed ? (
                      <>
                        <div className="grid grid-cols-2 gap-3">
                          <Input value={ed.title} onChange={(e) => setEditing({ ...editing, [p.id]: { ...ed, title: e.target.value } })} placeholder="Title" />
                          <Input value={ed.category} onChange={(e) => setEditing({ ...editing, [p.id]: { ...ed, category: e.target.value } })} placeholder="Category" />
                        </div>
                        <Textarea value={ed.description} onChange={(e) => setEditing({ ...editing, [p.id]: { ...ed, description: e.target.value } })} placeholder="Description" rows={3} />
                        <Input value={ed.tech} onChange={(e) => setEditing({ ...editing, [p.id]: { ...ed, tech: e.target.value } })} placeholder="Tech (comma separated)" />
                        <div className="space-y-1.5">
                          <ImageUpload
                            value={ed.image_url}
                            onChange={(url) => setEditing({ ...editing, [p.id]: { ...ed, image_url: url } })}
                            folder="projects"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <MultiImageUpload
                            value={ed.gallery_images}
                            onChange={(urls) => setEditing({ ...editing, [p.id]: { ...ed, gallery_images: urls } })}
                            folder="projects"
                          />
                        </div>
                        <Input value={ed.link} onChange={(e) => setEditing({ ...editing, [p.id]: { ...ed, link: e.target.value } })} placeholder="Project Link" />
                        <div className="grid grid-cols-2 gap-3">
                          <Input value={ed.budget} onChange={(e) => setEditing({ ...editing, [p.id]: { ...ed, budget: e.target.value } })} placeholder="Budget" />
                          <Input value={ed.date} onChange={(e) => setEditing({ ...editing, [p.id]: { ...ed, date: e.target.value } })} placeholder="Date" />
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => saveMutation.mutate({ id: p.id, data: ed })} className="gap-1"><Save className="h-3 w-3" /> Save</Button>
                          <Button size="sm" variant="outline" onClick={() => setEditing((e) => { const n = { ...e }; delete n[p.id]; return n; })}>Cancel</Button>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-start justify-between">
                        <div onClick={() => startEdit(p)} className="cursor-pointer flex-1">
                          <h3 className="font-semibold text-foreground">{p.title}</h3>
                          <p className="text-sm text-muted-foreground">{p.category} · {p.date} · {p.budget}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(p.id)}>
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
