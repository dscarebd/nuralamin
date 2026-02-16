import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Tag, ArrowRight, Pin, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [search, setSearch] = useState("");

  const searchLower = search.toLowerCase();
  const matchesSearch = (post: typeof posts[0]) =>
    !search ||
    post.title.toLowerCase().includes(searchLower) ||
    (post.tags ?? []).some((t) => t.toLowerCase().includes(searchLower));

  const featuredPosts = posts.filter((p) => p.is_featured && matchesSearch(p));
  const regularPosts = (activeCategory
    ? posts.filter((p) => p.category_id === activeCategory && !p.is_featured)
    : posts.filter((p) => !p.is_featured)
  ).filter(matchesSearch);

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:px-8">
      <div className="mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
          <h1 className="text-2xl font-bold text-foreground">Blog</h1>
          <p className="text-sm text-muted-foreground">Insights, tutorials, and updates</p>
        </motion.div>

        {/* Search bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or tags..."
            className="pl-9"
          />
        </div>

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
        ) : posts.length === 0 ? (
          <div className="rounded-xl border bg-card p-12 text-center">
            <p className="text-muted-foreground">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <>
            {/* Featured posts */}
            {featuredPosts.length > 0 && !activeCategory && (
              <motion.div className="mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                <div className="mb-4 flex items-center gap-2">
                  <Pin className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">Featured</h2>
                </div>
                <div className={featuredPosts.length === 1 ? "grid gap-6" : "grid gap-6 md:grid-cols-2"}>
                  {featuredPosts.map((post) => {
                    const category = categories.find((c) => c.id === post.category_id);
                    return (
                      <Link key={post.id} to={`/blog/${post.slug}`} className="group block">
                        <div className="overflow-hidden rounded-xl border-2 border-primary/20 bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-[0_8px_30px_-8px_hsl(var(--primary)/0.3)]">
                          {post.cover_image_url && (
                            <div className="relative h-52 overflow-hidden md:h-64">
                              <img src={post.cover_image_url} alt={post.title} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                              <div className="absolute bottom-0 left-0 right-0 p-5">
                                {category && (
                                  <Badge variant="secondary" className="mb-2 bg-primary/20 text-primary backdrop-blur-sm">
                                    {category.name}
                                  </Badge>
                                )}
                                <h2 className="text-xl font-bold text-foreground transition-colors group-hover:text-primary line-clamp-2">{post.title}</h2>
                              </div>
                            </div>
                          )}
                          {!post.cover_image_url && (
                            <div className="p-5">
                              {category && (
                                <Badge variant="secondary" className="mb-2 bg-primary/10 text-primary">{category.name}</Badge>
                              )}
                              <h2 className="text-xl font-bold text-foreground transition-colors group-hover:text-primary line-clamp-2">{post.title}</h2>
                            </div>
                          )}
                          <div className="px-5 pb-5">
                            {post.excerpt && <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                {post.published_at && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(post.published_at).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                              <ArrowRight className="h-4 w-4 text-primary opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Regular posts */}
            {regularPosts.length > 0 && (
              <motion.div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" variants={stagger} initial="hidden" animate="visible">
                {regularPosts.map((post) => {
                  const category = categories.find((c) => c.id === post.category_id);
                  return (
                    <motion.div key={post.id} variants={fadeUp}>
                      <Link to={`/blog/${post.slug}`} className="group block">
                        <div className="overflow-hidden rounded-xl border border-border/60 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-[0_8px_30px_-8px_hsl(var(--primary)/0.25)]">
                          {post.cover_image_url && (
                            <div className="relative h-44 overflow-hidden">
                              <img src={post.cover_image_url} alt={post.title} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                            </div>
                          )}
                          <div className="p-5">
                            {category && (
                              <Badge variant="secondary" className="mb-2 bg-primary/10 text-primary">{category.name}</Badge>
                            )}
                            <h2 className="mb-2 text-lg font-bold text-foreground transition-colors group-hover:text-primary line-clamp-2">{post.title}</h2>
                            {post.excerpt && <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>}
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
          </>
        )}
      </div>
    </div>
  );
}
