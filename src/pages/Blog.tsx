import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Calendar, Tag, ArrowRight, Pin, Search, ExternalLink, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useBlogPosts, useBlogCategories } from "@/hooks/usePublicData";
import ImageLightbox from "@/components/ImageLightbox";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  category_id: string | null;
  tags: string[] | null;
  is_featured: boolean;
  is_published: boolean;
  published_at: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
};

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
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);

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

  const selectedCategory = selectedPost ? categories.find((c) => c.id === selectedPost.category_id) : null;

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:px-8">
      <SEOHead
        title="Blog - NUR AL AMIN | Web Dev Insights & Tutorials"
        description="Read insights, tutorials, and updates on web development, app design, and digital trends by NUR AL AMIN."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "NUR AL AMIN Blog",
          description: "Web development insights, tutorials, and industry updates.",
          url: "https://nuralamin.lovable.app/blog",
        }}
      />
      <div className="mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Blog</h1>
            <p className="text-sm text-muted-foreground">Insights, tutorials, and updates</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or tags..."
              className="pl-9"
            />
          </div>
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
          <div className="flex flex-col gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex flex-col sm:flex-row gap-4 rounded-xl border bg-card p-4">
                <div className="sm:w-60 shrink-0 h-40 rounded-lg bg-muted" />
                <div className="flex-1 space-y-3 py-2">
                  <div className="h-4 w-3/4 rounded bg-muted" />
                  <div className="h-3 w-1/2 rounded bg-muted" />
                  <div className="h-3 w-1/3 rounded bg-muted" />
                </div>
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
                <div className="flex flex-col gap-5">
                  {featuredPosts.map((post) => {
                    const category = categories.find((c) => c.id === post.category_id);
                    return (
                      <div key={post.id} onClick={() => setSelectedPost(post)} className="group block cursor-pointer">
                        <div className="flex flex-col sm:flex-row gap-0 overflow-hidden rounded-xl border border-border/60 bg-card transition-all duration-300 hover:border-primary/30">
                          {post.cover_image_url && (
                            <div className="sm:w-72 shrink-0 overflow-hidden">
                              <img src={post.cover_image_url} alt={post.title} className="w-full h-auto object-contain transition-transform duration-700 ease-out group-hover:scale-105" />
                            </div>
                          )}
                          <div className="flex flex-1 flex-col justify-center p-5">
                            {category && (
                              <Badge variant="secondary" className="mb-2 w-fit bg-primary/20 text-primary">
                                {category.name}
                              </Badge>
                            )}
                            <h2 className="text-xl font-bold text-foreground transition-colors group-hover:text-primary line-clamp-2">{post.title}</h2>
                            {post.excerpt && <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>}
                            <div className="mt-3 flex items-center justify-between">
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
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Regular posts */}
            {regularPosts.length > 0 && (
              <motion.div className="flex flex-col gap-5" variants={stagger} initial="hidden" animate="visible">
                {regularPosts.map((post) => {
                  const category = categories.find((c) => c.id === post.category_id);
                  return (
                    <motion.div key={post.id} variants={fadeUp}>
                      <div onClick={() => setSelectedPost(post)} className="group block cursor-pointer">
                        <div className="flex flex-col sm:flex-row gap-0 overflow-hidden rounded-xl border border-border/60 bg-card transition-all duration-300 hover:border-primary/30">
                          {post.cover_image_url && (
                            <div className="sm:w-60 shrink-0 overflow-hidden">
                              <img src={post.cover_image_url} alt={post.title} className="w-full h-auto object-contain transition-transform duration-700 ease-out group-hover:scale-105" />
                            </div>
                          )}
                          <div className="flex flex-1 flex-col justify-center p-5">
                            {category && (
                              <Badge variant="secondary" className="mb-2 w-fit bg-primary/10 text-primary">{category.name}</Badge>
                            )}
                            <h2 className="mb-2 text-xl font-bold text-foreground transition-colors group-hover:text-primary line-clamp-2">{post.title}</h2>
                            {post.excerpt && <p className="mb-2 text-base text-muted-foreground line-clamp-2">{post.excerpt}</p>}
                            {post.content && (
                              <div
                                className="mb-3 text-sm text-muted-foreground/80 line-clamp-3 prose-headings:hidden"
                                dangerouslySetInnerHTML={{ __html: post.content.replace(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi, '') }}
                              />
                            )}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                {post.published_at && (
                                  <span className="flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5" />
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
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Blog Post Dialog - Portfolio Style */}
      <Dialog open={!!selectedPost} onOpenChange={(open) => !open && setSelectedPost(null)}>
        <DialogContent className="max-w-2xl animate-enter overflow-hidden rounded-lg p-0">
          {selectedPost && (
            <div className="flex max-h-[85vh] flex-col">
              <div className="min-h-0 flex-1 overflow-y-auto">
                {selectedPost.cover_image_url && (() => {
                  const blogImages = [selectedPost.cover_image_url, ...((selectedPost as any).gallery_images ?? [])].filter(Boolean) as string[];
                  return (
                    <div className="p-3 pb-0">
                      <div className="w-full cursor-pointer overflow-hidden rounded-lg" onClick={() => { setLightboxImages(blogImages); setLightboxIndex(0); setLightboxOpen(true); }}>
                        <img src={selectedPost.cover_image_url} alt={selectedPost.title} className="w-full h-auto object-contain transition-transform hover:scale-105" />
                      </div>
                    </div>
                  );
                })()}
                <div className="flex flex-col gap-3 p-6 pb-0 sm:px-8">
                  <DialogHeader className="space-y-3">
                    {selectedCategory && (
                      <Badge variant="secondary" className="w-fit bg-primary/10 text-primary">
                        {selectedCategory.name}
                      </Badge>
                    )}
                    <DialogTitle className="text-2xl font-extrabold uppercase tracking-tight text-foreground">
                      {selectedPost.title}
                    </DialogTitle>
                    {selectedPost.excerpt && (
                      <DialogDescription className="text-base leading-relaxed">
                        {selectedPost.excerpt}
                      </DialogDescription>
                    )}
                  </DialogHeader>

                  <div className="space-y-3 border-t border-border pt-4 text-base">
                    {selectedPost.published_at && (
                      <div className="flex gap-6">
                        <span className="w-24 shrink-0 font-semibold text-foreground">Date</span>
                        <span className="text-muted-foreground">{new Date(selectedPost.published_at).toLocaleDateString()}</span>
                      </div>
                    )}
                    {selectedCategory && (
                      <div className="flex gap-6">
                        <span className="w-24 shrink-0 font-semibold text-foreground">Category</span>
                        <span className="text-muted-foreground">{selectedCategory.name}</span>
                      </div>
                    )}
                    {(selectedPost.tags ?? []).length > 0 && (
                      <div className="flex gap-6">
                        <span className="w-24 shrink-0 font-semibold text-foreground">Tags</span>
                        <div className="flex flex-wrap gap-1.5">
                          {(selectedPost.tags ?? []).map((tag) => (
                            <span key={tag} className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {selectedPost.content && (
                  <div className="border-t border-border mx-6 sm:mx-8 mt-3 pt-4 pb-2">
                    <div
                      className="prose prose-base max-w-none text-foreground prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground"
                      dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                    />
                  </div>
                )}

                {((selectedPost as any).gallery_images ?? []).length > 0 && (
                  <div className="mx-6 sm:mx-8 mt-3 grid grid-cols-2 gap-2">
                    {((selectedPost as any).gallery_images as string[]).map((url, i) => {
                      const blogImages = [selectedPost.cover_image_url, ...((selectedPost as any).gallery_images ?? [])].filter(Boolean) as string[];
                      return (
                        <div key={i} className="cursor-pointer overflow-hidden rounded-lg" onClick={() => { setLightboxImages(blogImages); setLightboxIndex(i + (selectedPost.cover_image_url ? 1 : 0)); setLightboxOpen(true); }}>
                          <img src={url} alt={`Gallery ${i + 1}`} className="h-full w-full object-cover transition-transform hover:scale-105" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="shrink-0 border-t border-border p-6 pt-3 sm:px-8">
                <Button asChild size="lg" className="w-full">
                  <Link to={`/blog/${selectedPost.slug}`}>
                    Read Full Post <ExternalLink className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <ImageLightbox images={lightboxImages} currentIndex={lightboxIndex} open={lightboxOpen} onClose={() => setLightboxOpen(false)} onIndexChange={setLightboxIndex} />
    </div>
  );
}
