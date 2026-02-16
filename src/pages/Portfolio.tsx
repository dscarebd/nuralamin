import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useProjects, useSiteSettings } from "@/hooks/usePublicData";
import imgEcommerce from "@/assets/project-ecommerce.jpg";
import imgTaskapp from "@/assets/project-taskapp.jpg";
import imgPortfolio from "@/assets/project-portfolio.jpg";
import imgRestaurant from "@/assets/project-restaurant.jpg";
import imgFitness from "@/assets/project-fitness.jpg";
import imgLms from "@/assets/project-lms.jpg";

// Fallback images map
const fallbackImages: Record<string, string> = {
  "E-Commerce Platform": imgEcommerce,
  "Task Management App": imgTaskapp,
  "Portfolio Website Builder": imgPortfolio,
  "Restaurant Ordering System": imgRestaurant,
  "Fitness Tracker App": imgFitness,
  "Learning Management System": imgLms,
};

type Project = {
  id: string;
  title: string;
  category: string | null;
  description: string | null;
  tech: string[] | null;
  image_url: string | null;
  link: string | null;
  budget: string | null;
  date: string | null;
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const image = project.image_url || fallbackImages[project.title] || imgEcommerce;

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={onClick}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-[0_8px_30px_-8px_hsl(var(--primary)/0.25)]"
    >
      <div className="absolute inset-x-0 top-0 z-10 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-primary via-primary/80 to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100" />
      <div className="relative h-40 overflow-hidden">
        <img src={image} alt={project.title} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="mb-2 w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary transition-colors duration-300 group-hover:bg-primary/20">
          {project.category}
        </span>
        <h3 className="mb-1 text-base font-bold text-foreground transition-colors duration-300 group-hover:text-primary">{project.title}</h3>
        <p className="mb-4 flex-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{project.description}</p>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {(project.tech ?? []).map((t) => (
            <span key={t} className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground transition-colors duration-300 group-hover:bg-primary/10 group-hover:text-primary/80">{t}</span>
          ))}
        </div>
        <a href={project.link ?? "#"} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 text-xs font-medium text-primary transition-all duration-300 hover:underline group-hover:translate-x-1">
          View Project <ExternalLink className="h-3 w-3 transition-transform duration-300 group-hover:rotate-12" />
        </a>
      </div>
    </motion.div>
  );
}

export default function Portfolio() {
  const { data: dbProjects = [] } = useProjects();
  const { data: settings } = useSiteSettings();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const websiteProjects = dbProjects.filter((p) => p.category !== "Mobile App");
  const mobileProjects = dbProjects.filter((p) => p.category === "Mobile App");

  const telegramUrl = settings?.telegram_url ?? "https://t.me/nuralamin_official";
  const footerText = settings?.footer_text ?? "NUR AL AMIN © 2017 – 2026. All Rights Reserved.";

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:px-8">
      <Tabs defaultValue="website" className="mx-auto max-w-5xl">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-2xl font-bold text-foreground">My Portfolio</h1>
            <p className="text-sm text-muted-foreground">Projects I've built and contributed to</p>
          </motion.div>

          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="website" className="flex-1 sm:flex-initial data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Website</TabsTrigger>
            <TabsTrigger value="mobile" className="flex-1 sm:flex-initial data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Mobile App</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="website">
          <motion.div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" variants={stagger} initial="hidden" animate="visible">
            {websiteProjects.map((project) => (
              <ProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="mobile">
          <motion.div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" variants={stagger} initial="hidden" animate="visible">
            {mobileProjects.map((project) => (
              <ProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
            ))}
          </motion.div>
        </TabsContent>

        <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
          <DialogContent className="max-w-2xl animate-enter overflow-hidden p-0">
            {selectedProject && (
              <div className="flex flex-col">
                <div className="aspect-video w-full overflow-hidden">
                  <img src={selectedProject.image_url || fallbackImages[selectedProject.title] || imgEcommerce} alt={selectedProject.title} className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-1 flex-col gap-5 p-6 sm:p-8">
                  <DialogHeader className="space-y-3">
                    <DialogTitle className="text-2xl font-extrabold uppercase tracking-tight text-foreground">{selectedProject.title}</DialogTitle>
                    <DialogDescription className="text-sm leading-relaxed">{selectedProject.description}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 border-t border-border pt-4 text-sm">
                    <div className="flex gap-6"><span className="w-24 shrink-0 font-semibold text-foreground">Category</span><span className="text-muted-foreground">{selectedProject.category}</span></div>
                    <div className="flex gap-6"><span className="w-24 shrink-0 font-semibold text-foreground">Date</span><span className="text-muted-foreground">{selectedProject.date}</span></div>
                    <div className="flex gap-6"><span className="w-24 shrink-0 font-semibold text-foreground">Budget</span><span className="text-muted-foreground">{selectedProject.budget}</span></div>
                    <div className="flex gap-6"><span className="w-24 shrink-0 font-semibold text-foreground">Tech Stack</span><span className="text-muted-foreground">{(selectedProject.tech ?? []).join(", ")}</span></div>
                  </div>
                  <Button asChild size="lg" className="mt-auto w-full">
                    <a href={selectedProject.link ?? "#"} target="_blank" rel="noopener noreferrer">View Project <ExternalLink className="ml-1 h-4 w-4" /></a>
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-16 rounded-xl border bg-card p-8 text-center">
          <h2 className="mb-2 text-xl font-bold text-foreground">Interested in working together?</h2>
          <p className="mb-6 text-sm text-muted-foreground">I'm always open to new projects and collaborations. Let's build something great.</p>
          <div className="flex justify-center gap-3">
            <Button asChild>
              <a href={telegramUrl} target="_blank" rel="noopener noreferrer">
                <svg className="mr-1.5 h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                Get in Touch
              </a>
            </Button>
            <Button asChild variant="outline"><Link to="/">Back to Profile</Link></Button>
          </div>
        </motion.div>

        
      </Tabs>
    </div>
  );
}
