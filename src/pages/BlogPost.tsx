import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBlogPosts, useBlogCategories } from "@/hooks/usePublicData";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: posts = [], isLoading } = useBlogPosts();
  const { data: categories = [] } = useBlogCategories();

  const post = posts.find((p) => p.slug === slug);
  const category = post ? categories.find((c) => c.id === post.category_id) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background px-4 py-8 md:px-8">
        <div className="mx-auto max-w-3xl animate-pulse space-y-4">
          <div className="h-6 w-32 rounded bg-muted" />
          <div className="h-8 w-3/4 rounded bg-muted" />
          <div className="h-64 rounded-xl bg-muted" />
          <div className="space-y-2">
            <div className="h-4 rounded bg-muted" />
            <div className="h-4 w-5/6 rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background px-4 py-8 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-2xl font-bold text-foreground">Post not found</h1>
          <Button asChild variant="outline">
            <Link to="/blog"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:px-8">
      <motion.article
        className="mx-auto max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button asChild variant="ghost" size="sm" className="mb-6 gap-1">
          <Link to="/blog"><ArrowLeft className="h-4 w-4" /> Back to Blog</Link>
        </Button>

        {category && (
          <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary">
            {category.name}
          </Badge>
        )}

        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
          {post.title}
        </h1>

        <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {post.published_at && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(post.published_at).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </span>
          )}
          {(post.tags ?? []).length > 0 && (
            <div className="flex items-center gap-1.5">
              <Tag className="h-4 w-4" />
              <div className="flex flex-wrap gap-1">
                {(post.tags ?? []).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {post.cover_image_url && (
          <div className="mb-8 overflow-hidden rounded-xl">
            <img src={post.cover_image_url} alt={post.title} className="w-full object-cover" />
          </div>
        )}

        <div
          className="prose prose-sm dark:prose-invert max-w-none text-foreground"
          dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
        />

        {(post.gallery_images ?? []).length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-bold text-foreground">Gallery</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {(post.gallery_images ?? []).map((url, i) => (
                <img key={i} src={url} alt={`Gallery ${i + 1}`} className="w-full rounded-xl object-cover" />
              ))}
            </div>
          </div>
        )}
      </motion.article>
    </div>
  );
}
