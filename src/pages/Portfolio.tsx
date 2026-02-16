import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import imgEcommerce from "@/assets/project-ecommerce.jpg";
import imgTaskapp from "@/assets/project-taskapp.jpg";
import imgPortfolio from "@/assets/project-portfolio.jpg";
import imgRestaurant from "@/assets/project-restaurant.jpg";
import imgFitness from "@/assets/project-fitness.jpg";
import imgLms from "@/assets/project-lms.jpg";

const projects = [
  {
    title: "E-Commerce Platform",
    category: "Web Application",
    description: "A full-featured e-commerce platform built with React and Node.js, featuring product management, cart system, and payment integration.",
    tech: ["React", "Node.js", "MongoDB", "Stripe"],
    link: "#",
    image: imgEcommerce,
    budget: "$5,000",
    date: "2025",
  },
  {
    title: "Task Management App",
    category: "Mobile App",
    description: "A cross-platform task management application built with React Native, featuring real-time sync, push notifications, and team collaboration.",
    tech: ["React Native", "Firebase", "TypeScript"],
    link: "#",
    image: imgTaskapp,
    budget: "$3,500",
    date: "2025",
  },
  {
    title: "Portfolio Website Builder",
    category: "SaaS Product",
    description: "A drag-and-drop portfolio builder that allows creatives to showcase their work with custom themes and domains.",
    tech: ["Next.js", "PostgreSQL", "Tailwind CSS"],
    link: "#",
    image: imgPortfolio,
    budget: "$4,200",
    date: "2024",
  },
  {
    title: "Restaurant Ordering System",
    category: "Web Application",
    description: "An online ordering system for restaurants with real-time order tracking, menu management, and delivery integration.",
    tech: ["React", "Express", "Socket.io", "MySQL"],
    link: "#",
    image: imgRestaurant,
    budget: "$6,000",
    date: "2024",
  },
  {
    title: "Fitness Tracker App",
    category: "Mobile App",
    description: "A health and fitness tracking app with workout plans, progress charts, and social features for motivation.",
    tech: ["React Native", "GraphQL", "AWS"],
    link: "#",
    image: imgFitness,
    budget: "$4,800",
    date: "2024",
  },
  {
    title: "Learning Management System",
    category: "Web Application",
    description: "An LMS platform with video courses, quizzes, certificates, and student progress analytics for educational institutions.",
    tech: ["Next.js", "Supabase", "Tailwind CSS"],
    link: "#",
    image: imgLms,
    budget: "$7,500",
    date: "2023",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

function ProjectCard({ project, onClick }: { project: typeof projects[0]; onClick: () => void }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition-shadow hover:shadow-[0_4px_24px_-4px_hsl(var(--primary)/0.2)]"
    >
      <div className="absolute inset-x-0 top-0 z-10 h-[2px] scale-x-0 bg-gradient-to-r from-transparent via-primary to-transparent transition-transform duration-300 group-hover:scale-x-100" />
      <div className="relative h-40 overflow-hidden">
        <img src={project.image} alt={project.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-card/40 to-transparent" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="mb-2 w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
          {project.category}
        </span>
        <h3 className="mb-1 text-base font-bold text-foreground">{project.title}</h3>
        <p className="mb-4 flex-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span key={t} className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              {t}
            </span>
          ))}
        </div>
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          View Project <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </motion.div>
  );
}

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex items-center gap-4"
        >
          <Button asChild variant="outline" size="icon" className="rounded-full">
            <a href="/">
              <ArrowLeft className="h-4 w-4" />
            </a>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Portfolio</h1>
            <p className="text-sm text-muted-foreground">Projects I've built and contributed to</p>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {projects.map((project, i) => (
            <ProjectCard key={i} project={project} onClick={() => setSelectedProject(project)} />
          ))}
        </motion.div>

        {/* Project Detail Dialog */}
        <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
          <DialogContent className="max-w-5xl animate-enter overflow-hidden p-0">
            {selectedProject && (
              <div className="flex flex-col sm:flex-row">
                {/* Left: Image */}
                <div className="sm:w-1/2">
                  <div className="h-full w-full overflow-hidden">
                    <img
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                {/* Right: Details */}
                <div className="flex flex-1 flex-col gap-5 p-6 sm:p-8">
                  <DialogHeader className="space-y-3">
                    <DialogTitle className="text-2xl font-extrabold uppercase tracking-tight text-foreground">
                      {selectedProject.title}
                    </DialogTitle>
                    <DialogDescription className="text-sm leading-relaxed">
                      {selectedProject.description}
                    </DialogDescription>
                  </DialogHeader>

                  {/* Metadata rows */}
                  <div className="space-y-3 border-t border-border pt-4 text-sm">
                    <div className="flex gap-6">
                      <span className="w-24 shrink-0 font-semibold text-foreground">Category</span>
                      <span className="text-muted-foreground">{selectedProject.category}</span>
                    </div>
                    <div className="flex gap-6">
                      <span className="w-24 shrink-0 font-semibold text-foreground">Date</span>
                      <span className="text-muted-foreground">{selectedProject.date}</span>
                    </div>
                    <div className="flex gap-6">
                      <span className="w-24 shrink-0 font-semibold text-foreground">Budget</span>
                      <span className="text-muted-foreground">{selectedProject.budget}</span>
                    </div>
                    <div className="flex gap-6">
                      <span className="w-24 shrink-0 font-semibold text-foreground">Tech Stack</span>
                      <span className="text-muted-foreground">{selectedProject.tech.join(", ")}</span>
                    </div>
                  </div>

                  <Button asChild size="lg" className="mt-auto w-full">
                    <a href={selectedProject.link} target="_blank" rel="noopener noreferrer">
                      View Project <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 rounded-xl border bg-card p-8 text-center"
        >
          <h2 className="mb-2 text-xl font-bold text-foreground">Interested in working together?</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            I'm always open to new projects and collaborations. Let's build something great.
          </p>
          <div className="flex justify-center gap-3">
            <Button asChild>
              <a href="mailto:hey@nuralamin.com">Get in Touch</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/">Back to Profile</a>
            </Button>
          </div>
        </motion.div>

        <footer className="py-8 text-center text-xs text-muted-foreground">
          NUR AL AMIN © 2017 – 2026. All Rights Reserved.
        </footer>
      </div>
    </div>
  );
}
