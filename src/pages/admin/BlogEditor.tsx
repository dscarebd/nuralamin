import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Save, PenLine, Eye, EyeOff, FolderPlus, X } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type BlogPostForm = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  category_id: string;
  tags: string;
  is_published: boolean;
  is_featured: boolean;
};

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function BlogEditor() {
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["admin_blog_posts"],
    queryFn: async () => {
      const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["blog_categories"],
    queryFn: async () => {
      const { data } = await supabase.from("blog_categories").select("*").order("display_order");
      return data ?? [];
    },
  });

  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<BlogPostForm>({
    title: "", slug: "", excerpt: "", content: "", cover_image_url: "", category_id: "", tags: "", is_published: false, is_featured: false,
  });
  const [newCategory, setNewCategory] = useState("");
  const [catDialogOpen, setCatDialogOpen] = useState(false);

  const startEdit = (post: typeof posts[0]) => {
    setEditing(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? "",
      content: post.content ?? "",
      cover_image_url: post.cover_image_url ?? "",
      category_id: post.category_id ?? "",
      tags: (post.tags ?? []).join(", "),
      is_published: post.is_published,
      is_featured: post.is_featured,
    });
  };

  const saveMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BlogPostForm }) => {
      const { error } = await supabase.from("blog_posts").update({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || null,
        content: data.content || null,
        cover_image_url: data.cover_image_url || null,
        category_id: data.category_id || null,
        tags: data.tags.split(",").map((t) => t.trim()).filter(Boolean),
        is_published: data.is_published,
        is_featured: data.is_featured,
        published_at: data.is_published ? new Date().toISOString() : null,
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin_blog_posts"] });
      qc.invalidateQueries({ queryKey: ["blog_posts"] });
      setEditing(null);
      toast({ title: "Post saved!" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const slug = `new-post-${Date.now()}`;
      const { error } = await supabase.from("blog_posts").insert({
        title: "New Post",
        slug,
        display_order: posts.length + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin_blog_posts"] });
      toast({ title: "Post created!" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin_blog_posts"] });
      qc.invalidateQueries({ queryKey: ["blog_posts"] });
      toast({ title: "Post deleted!" });
    },
  });

  const addCategoryMutation = useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase.from("blog_categories").insert({
        name,
        slug: slugify(name),
        display_order: categories.length + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blog_categories"] });
      setNewCategory("");
      setCatDialogOpen(false);
      toast({ title: "Category added!" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blog_categories"] });
      toast({ title: "Category deleted!" });
    },
  });

  if (isLoading) return <div className="animate-pulse text-muted-foreground">Loading...</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Blog Posts</h1>
        <div className="flex gap-2">
          <Dialog open={catDialogOpen} onOpenChange={setCatDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2"><FolderPlus className="h-4 w-4" /> Categories</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Manage Categories</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category name"
                  />
                  <Button
                    onClick={() => newCategory.trim() && addCategoryMutation.mutate(newCategory.trim())}
                    disabled={!newCategory.trim()}
                  >
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between rounded-lg border p-3">
                      <span className="text-sm font-medium">{cat.name}</span>
                      <Button variant="ghost" size="icon" onClick={() => deleteCategoryMutation.mutate(cat.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  {categories.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No categories yet</p>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={() => addMutation.mutate()} className="gap-2"><Plus className="h-4 w-4" /> New Post</Button>
        </div>
      </div>

      <div className="max-w-3xl space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="rounded-xl border bg-card">
            {editing === post.id ? (
              <div className="space-y-4 p-5">
                <Input
                  value={form.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setForm({ ...form, title, slug: slugify(title) });
                  }}
                  placeholder="Post title"
                  className="text-lg font-bold"
                />
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Slug</Label>
                    <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="post-slug" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Category</Label>
                    <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Excerpt</Label>
                  <Textarea
                    value={form.excerpt}
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    placeholder="Short description..."
                    rows={2}
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Cover Image</Label>
                  <ImageUpload
                    value={form.cover_image_url}
                    onChange={(url) => setForm({ ...form, cover_image_url: url })}
                    folder="blog"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Tags (comma separated)</Label>
                  <Input
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="react, tutorial, web dev"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Content</Label>
                  <RichTextEditor
                    value={form.content}
                    onChange={(html) => setForm({ ...form, content: html })}
                  />
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={form.is_published}
                      onCheckedChange={(checked) => setForm({ ...form, is_published: checked })}
                    />
                    <Label className="text-sm">{form.is_published ? "Published" : "Draft"}</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={form.is_featured}
                      onCheckedChange={(checked) => setForm({ ...form, is_featured: checked })}
                    />
                    <Label className="text-sm">{form.is_featured ? "Featured" : "Not Featured"}</Label>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => saveMutation.mutate({ id: post.id, data: form })} className="gap-1">
                    <Save className="h-3 w-3" /> Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4">
                <div className="flex-1 cursor-pointer" onClick={() => startEdit(post)}>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{post.title}</h3>
                    {post.is_published ? (
                      <Eye className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {post.slug} · {post.is_published ? "Published" : "Draft"}
                    {post.published_at && ` · ${new Date(post.published_at).toLocaleDateString()}`}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(post)}>
                    <PenLine className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(post.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
        {posts.length === 0 && (
          <div className="rounded-xl border bg-card p-12 text-center">
            <p className="text-muted-foreground">No posts yet. Click "New Post" to create one.</p>
          </div>
        )}
      </div>
    </div>
  );
}
