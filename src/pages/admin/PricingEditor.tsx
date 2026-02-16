import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Save, Star } from "lucide-react";

type PlanForm = { name: string; price: string; unit: string; description: string; features: string; popular: boolean };

export default function PricingEditor() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const { data: plans = [], isLoading } = useQuery({
    queryKey: ["pricing_plans"],
    queryFn: async () => {
      const { data } = await supabase.from("pricing_plans").select("*").order("display_order");
      return data ?? [];
    },
  });

  const [editing, setEditing] = useState<Record<string, PlanForm>>({});

  const startEdit = (p: typeof plans[0]) => {
    setEditing({ ...editing, [p.id]: { name: p.name, price: p.price, unit: p.unit ?? "", description: p.description ?? "", features: (p.features ?? []).join("\n"), popular: p.popular ?? false } });
  };

  const saveMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PlanForm }) => {
      const { error } = await supabase.from("pricing_plans").update({
        name: data.name, price: data.price, unit: data.unit, description: data.description,
        features: data.features.split("\n").map((f) => f.trim()).filter(Boolean), popular: data.popular,
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, { id }) => { qc.invalidateQueries({ queryKey: ["pricing_plans"] }); setEditing((e) => { const n = { ...e }; delete n[id]; return n; }); toast({ title: "Saved!" }); },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("pricing_plans").insert({ name: "New Plan", price: "$0", display_order: plans.length + 1 });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["pricing_plans"] }); toast({ title: "Added!" }); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("pricing_plans").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["pricing_plans"] }); toast({ title: "Deleted!" }); },
  });

  if (isLoading) return <div className="animate-pulse text-muted-foreground">Loading...</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Pricing Plans</h1>
        <Button onClick={() => addMutation.mutate()} className="gap-2"><Plus className="h-4 w-4" /> Add Plan</Button>
      </div>
      <div className="max-w-2xl space-y-4">
        {plans.map((plan) => {
          const ed = editing[plan.id];
          return (
            <div key={plan.id} className="rounded-xl border bg-card p-4 space-y-3">
              {ed ? (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <Input value={ed.name} onChange={(e) => setEditing({ ...editing, [plan.id]: { ...ed, name: e.target.value } })} placeholder="Name" />
                    <Input value={ed.price} onChange={(e) => setEditing({ ...editing, [plan.id]: { ...ed, price: e.target.value } })} placeholder="Price" />
                    <Input value={ed.unit} onChange={(e) => setEditing({ ...editing, [plan.id]: { ...ed, unit: e.target.value } })} placeholder="Unit" />
                  </div>
                  <Input value={ed.description} onChange={(e) => setEditing({ ...editing, [plan.id]: { ...ed, description: e.target.value } })} placeholder="Description" />
                  <Textarea value={ed.features} onChange={(e) => setEditing({ ...editing, [plan.id]: { ...ed, features: e.target.value } })} placeholder="Features (one per line)" rows={4} />
                  <div className="flex items-center gap-3">
                    <Button size="sm" variant={ed.popular ? "default" : "outline"} onClick={() => setEditing({ ...editing, [plan.id]: { ...ed, popular: !ed.popular } })} className="gap-1">
                      <Star className="h-3 w-3" /> {ed.popular ? "Popular" : "Not Popular"}
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => saveMutation.mutate({ id: plan.id, data: ed })} className="gap-1"><Save className="h-3 w-3" /> Save</Button>
                    <Button size="sm" variant="outline" onClick={() => setEditing((e) => { const n = { ...e }; delete n[plan.id]; return n; })}>Cancel</Button>
                  </div>
                </>
              ) : (
                <div className="flex items-start justify-between">
                  <div onClick={() => startEdit(plan)} className="cursor-pointer flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{plan.name}</h3>
                      {plan.popular && <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] text-primary-foreground">Popular</span>}
                    </div>
                    <p className="text-sm text-muted-foreground">{plan.price}{plan.unit} · {(plan.features ?? []).length} features</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(plan.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
