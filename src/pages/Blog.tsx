import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Tag, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBlogPosts, useBlogCategories } from "@/hooks/usePublicData";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Blog() {
  const { data: posts = [], isLoading } = useBlogPosts();
  const { data: categories = [] } = useBlogCategories();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory
    ? posts.filter((p) => p.category_id === activeCategory)
    : posts;

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:px-8">
      <div className="mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
          <h1 className="text-2xl font-bold text-foreground">Blog</h1>
          <p className="text-sm text-muted-foreground">Insights, tutorials, and updates</p>
        </motion.div>

        {/* Category filters */}
        {categories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <Button
              variant={activeCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(null)}
              className="rounded-full"
            >
              All
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat.id)}
                className="rounded-full"
              >
                {cat.name}
              </Button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-xl border bg-card p-4">
                <div className="mb-4 h-40 rounded-lg bg-muted" />
                <div className="mb-2 h-4 w-3/4 rounded bg-muted" />
                <div className="h-3 w-1/2 rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border bg-card p-12 text-center">
            <p className="text-muted-foreground">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <motion.div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" variants={stagger} initial="hidden" animate="visible">
            {filtered.map((post) => {
              const category = categories.find((c) => c.id === post.category_id);
              return (
                <motion.div key={post.id} variants={fadeUp}>
                  <Link to={`/blog/${post.slug}`} className="group block">
                    <div className="overflow-hidden rounded-xl border border-border/60 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-[0_8px_30px_-8px_hsl(var(--primary)/0.25)]">
                      {post.cover_image_url && (
                        <div className="relative h-44 overflow-hidden">
                          <img
                            src={post.cover_image_url}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                          />
                        </div>
                      )}
                      <div className="p-5">
                        {category && (
                          <Badge variant="secondary" className="mb-2 bg-primary/10 text-primary">
                            {category.name}
                          </Badge>
                        )}
                        <h2 className="mb-2 text-lg font-bold text-foreground transition-colors group-hover:text-primary line-clamp-2">
                          {post.title}
                        </h2>
                        {post.excerpt && (
                          <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {post.published_at && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(post.published_at).toLocaleDateString()}
                              </span>
                            )}
                            {(post.tags ?? []).length > 0 && (
                              <span className="flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                {(post.tags ?? []).length}
                              </span>
                            )}
                          </div>
                          <ArrowRight className="h-4 w-4 text-primary opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
