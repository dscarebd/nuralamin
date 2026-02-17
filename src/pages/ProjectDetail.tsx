import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Calendar, DollarSign, Tag, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useProject } from "@/hooks/usePublicData";
import imgEcommerce from "@/assets/project-ecommerce.jpg";
import imgTaskapp from "@/assets/project-taskapp.jpg";
import imgPortfolio from "@/assets/project-portfolio.jpg";
import imgRestaurant from "@/assets/project-restaurant.jpg";
import imgFitness from "@/assets/project-fitness.jpg";
import imgLms from "@/assets/project-lms.jpg";
import { Skeleton } from "@/components/ui/skeleton";

const fallbackImages: Record<string, string> = {
  "E-Commerce Platform": imgEcommerce,
  "Task Management App": imgTaskapp,
  "Portfolio Website Builder": imgPortfolio,
  "Restaurant Ordering System": imgRestaurant,
  "Fitness Tracker App": imgFitness,
  "Learning Management System": imgLms,
};

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading } = useProject(id);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);

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
        <div className="mx-auto max-w-4xl space-y-6">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="aspect-video w-full rounded-xl" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <h1 className="mb-4 text-2xl font-bold text-foreground">Project Not Found</h1>
        <Button asChild variant="outline"><Link to="/portfolio">Back to Portfolio</Link></Button>
      </div>
    );
  }

  const mainImg = project.image_url || fallbackImages[project.title] || imgEcommerce;
  const allImages = [mainImg, ...(project.gallery_images ?? [])];
  const hasMultiple = allImages.length > 1;

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Back button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
          <Button asChild variant="ghost" size="sm" className="mb-6 gap-1.5 text-muted-foreground hover:text-foreground">
            <Link to="/portfolio"><ArrowLeft className="h-4 w-4" /> Back to Portfolio</Link>
          </Button>
        </motion.div>

        {/* Image section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="mb-8 overflow-hidden rounded-xl border border-border/60">
          {hasMultiple ? (
            <Carousel setApi={setCarouselApi} plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]} className="w-full">
              <CarouselContent>
                {allImages.map((url, i) => (
                  <CarouselItem key={i}>
                    <div className="aspect-video w-full overflow-hidden">
                      <img src={url} alt={`${project.title} ${i + 1}`} className="h-full w-full object-cover" />
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
            <div className="aspect-video w-full overflow-hidden">
              <img src={mainImg} alt={project.title} className="h-full w-full object-cover" />
            </div>
          )}
        </motion.div>

        {/* Project info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6">
          <div>
            <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {project.category}
            </span>
            <h1 className="mt-2 text-3xl font-extrabold uppercase tracking-tight text-foreground md:text-4xl">
              {project.title}
            </h1>
          </div>

          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            {project.description}
          </p>

          {/* Details grid */}
          <div className="grid gap-4 rounded-xl border border-border/60 bg-card p-6 sm:grid-cols-2">
            {project.date && (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Date</p>
                  <p className="text-sm font-semibold text-foreground">{project.date}</p>
                </div>
              </div>
            )}
            {project.budget && (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Budget</p>
                  <p className="text-sm font-semibold text-foreground">{project.budget}</p>
                </div>
              </div>
            )}
            {project.category && (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Tag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Category</p>
                  <p className="text-sm font-semibold text-foreground">{project.category}</p>
                </div>
              </div>
            )}
            {project.tech && project.tech.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Layers className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Tech Stack</p>
                  <p className="text-sm font-semibold text-foreground">{project.tech.join(", ")}</p>
                </div>
              </div>
            )}
          </div>

          {/* Tech badges */}
          {project.tech && project.tech.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span key={t} className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground">
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 pb-8">
            {project.link && (
              <Button asChild size="lg" className="flex-1 sm:flex-none">
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  View Live Project <ExternalLink className="ml-1.5 h-4 w-4" />
                </a>
              </Button>
            )}
            <Button asChild variant="outline" size="lg" className="flex-1 sm:flex-none">
              <Link to="/portfolio">Back to Portfolio</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
