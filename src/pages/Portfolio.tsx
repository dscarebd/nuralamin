import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "E-Commerce Platform",
    category: "Web Application",
    description: "A full-featured e-commerce platform built with React and Node.js, featuring product management, cart system, and payment integration.",
    tech: ["React", "Node.js", "MongoDB", "Stripe"],
    link: "#",
  },
  {
    title: "Task Management App",
    category: "Mobile App",
    description: "A cross-platform task management application built with React Native, featuring real-time sync, push notifications, and team collaboration.",
    tech: ["React Native", "Firebase", "TypeScript"],
    link: "#",
  },
  {
    title: "Portfolio Website Builder",
    category: "SaaS Product",
    description: "A drag-and-drop portfolio builder that allows creatives to showcase their work with custom themes and domains.",
    tech: ["Next.js", "PostgreSQL", "Tailwind CSS"],
    link: "#",
  },
  {
    title: "Restaurant Ordering System",
    category: "Web Application",
    description: "An online ordering system for restaurants with real-time order tracking, menu management, and delivery integration.",
    tech: ["React", "Express", "Socket.io", "MySQL"],
    link: "#",
  },
  {
    title: "Fitness Tracker App",
    category: "Mobile App",
    description: "A health and fitness tracking app with workout plans, progress charts, and social features for motivation.",
    tech: ["React Native", "GraphQL", "AWS"],
    link: "#",
  },
  {
    title: "Learning Management System",
    category: "Web Application",
    description: "An LMS platform with video courses, quizzes, certificates, and student progress analytics for educational institutions.",
    tech: ["Next.js", "Supabase", "Tailwind CSS"],
    link: "#",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Portfolio() {
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
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card p-5 transition-shadow hover:shadow-[0_4px_24px_-4px_hsl(var(--primary)/0.2)]"
            >
              <div className="absolute inset-x-0 top-0 h-[2px] scale-x-0 bg-gradient-to-r from-transparent via-primary to-transparent transition-transform duration-300 group-hover:scale-x-100" />
              <span className="mb-2 w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                {project.category}
              </span>
              <h3 className="mb-1 text-base font-bold text-foreground">{project.title}</h3>
              <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">{project.description}</p>
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
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                View Project <ExternalLink className="h-3 w-3" />
              </a>
            </motion.div>
          ))}
        </motion.div>

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
          © 2026 NUR AL AMIN
        </footer>
      </div>
    </div>
  );
}
