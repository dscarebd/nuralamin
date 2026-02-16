import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "@/components/admin/ImageUpload";

export default function ProfileEditor() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await supabase.from("profile").select("*").maybeSingle();
      return data;
    },
  });

  const [form, setForm] = useState({
    name: "", title: "", about: "", phone: "", email: "", location: "",
    company_name: "", company_url: "", company2_name: "", company2_url: "", profile_url: "", photo_url: "",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name ?? "", title: profile.title ?? "", about: profile.about ?? "",
        phone: profile.phone ?? "", email: profile.email ?? "", location: profile.location ?? "",
        company_name: profile.company_name ?? "", company_url: profile.company_url ?? "",
        company2_name: profile.company2_name ?? "", company2_url: profile.company2_url ?? "",
        profile_url: profile.profile_url ?? "", photo_url: profile.photo_url ?? "",
      });
    }
  }, [profile]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (profile) {
        const { error } = await supabase.from("profile").update(form).eq("id", profile.id);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["profile"] }); toast({ title: "Profile saved!" }); },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  if (isLoading) return <div className="animate-pulse text-muted-foreground">Loading...</div>;

  const field = (label: string, key: keyof typeof form, type = "text") => (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {key === "about" ? (
        <Textarea value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} rows={4} />
      ) : (
        <Input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
      )}
    </div>
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Edit Profile</h1>
        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
      <div className="max-w-2xl space-y-4 rounded-xl border bg-card p-6">
        <div className="space-y-1.5">
          <Label>Profile Photo</Label>
          <ImageUpload
            value={form.photo_url}
            onChange={(url) => setForm({ ...form, photo_url: url })}
            folder="profile"
          />
        </div>
        {field("Name", "name")}
        {field("Title", "title")}
        {field("About", "about")}
        {field("Phone", "phone")}
        {field("Email", "email", "email")}
        {field("Location", "location")}
        {field("Company Name", "company_name")}
        {field("Company URL", "company_url", "url")}
        {field("Company 2 Name", "company2_name")}
        {field("Company 2 URL", "company2_url", "url")}
        {field("Profile URL", "profile_url", "url")}
      </div>
    </div>
  );
}
