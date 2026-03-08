import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useBlogPosts, useBlogCategories } from "@/hooks/usePublicData";
import ImageLightbox from "@/components/ImageLightbox";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: posts = [], isLoading } = useBlogPosts();
  const { data: categories = [] } = useBlogCategories();

  const post = posts.find((p) => p.slug === slug);
  const category = post ? categories.find((c) => c.id === post.category_id) : null;
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const allImages = post ? [post.cover_image_url, ...(post.gallery_images ?? [])].filter(Boolean) as string[] : [];
  const hasMultiple = allImages.length > 1;

  useEffect(() => {
    if (!carouselApi) return;
    const onSelect = () => setCurrentSlide(carouselApi.selectedScrollSnap());
    onSelect();
    carouselApi.on("select", onSelect);
    return () => { carouselApi.off("select", onSelect); };
  }, [carouselApi]);

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
      <SEOHead
        title={`${post.title} - NUR AL AMIN Blog`}
        description={post.excerpt || `Read "${post.title}" on NUR AL AMIN's blog.`}
        ogImage={post.cover_image_url || undefined}
        ogType="article"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt || "",
          image: post.cover_image_url || undefined,
          datePublished: post.published_at || post.created_at,
          author: { "@type": "Person", name: "NUR AL AMIN" },
          url: `https://nuralamin.lovable.app/blog/${post.slug}`,
        }}
      />
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

        {allImages.length > 0 && (
          <div className="mb-8 overflow-hidden rounded-xl border border-border/60">
            {hasMultiple ? (
              <Carousel setApi={setCarouselApi} plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]} className="w-full">
                <CarouselContent>
                  {allImages.map((url, i) => (
                    <CarouselItem key={i}>
                      <div className="w-full cursor-pointer overflow-hidden" onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}>
                        <img src={url} alt={`${post.title} ${i + 1}`} className="w-full h-auto object-contain transition-transform hover:scale-105" />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-3 top-1/2 h-10 w-10 -translate-y-1/2 border-none bg-black/40 text-white hover:bg-black/60" />
                <CarouselNext className="right-3 top-1/2 h-10 w-10 -translate-y-1/2 border-none bg-black/40 text-white hover:bg-black/60" />
                <div className="flex justify-center gap-1.5 py-3">
                  {allImages.map((_, i) => (
                    <button key={i} onClick={() => carouselApi?.scrollTo(i)}
                      className={`h-2 rounded-full transition-all ${currentSlide === i ? "w-5 bg-primary" : "w-2 bg-muted-foreground/30"}`} />
                  ))}
                </div>
              </Carousel>
            ) : (
              <div className="w-full cursor-pointer overflow-hidden" onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}>
                <img src={allImages[0]} alt={post.title} className="w-full h-auto object-contain transition-transform hover:scale-105" />
              </div>
            )}
          </div>
        )}

        <ImageLightbox images={allImages} currentIndex={lightboxIndex} open={lightboxOpen} onClose={() => setLightboxOpen(false)} onIndexChange={setLightboxIndex} />
        <div
          className="prose prose-lg dark:prose-invert max-w-none text-foreground"
          dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
        />
      </motion.article>
    </div>
  );
}
