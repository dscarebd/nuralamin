import { motion } from "framer-motion";
import { useExperiences, useProfile, useSiteSettings } from "@/hooks/usePublicData";

const defaultExperiences = [
  { id: "1", title: "Full Stack Developer", company: "Freelance / Self-Employed", period: "Jan 2024 — Present", description: "Building custom websites and mobile applications for clients worldwide." },
  { id: "2", title: "Web Developer", company: "Tech Solutions BD", period: "Jun 2022 — Dec 2023", description: "Developed and maintained responsive web applications using React and Node.js." },
  { id: "3", title: "Junior Web Developer", company: "Digital Agency", period: "Jan 2021 — May 2022", description: "Built interactive front-end interfaces and integrated REST APIs." },
  { id: "4", title: "Freelance Developer", company: "Self-Employed", period: "Jun 2019 — Dec 2020", description: "Started freelancing with WordPress sites and custom landing pages." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function MainContent() {
  const { data: dbExperiences = [] } = useExperiences();
  const { data: profile } = useProfile();
  const { data: settings } = useSiteSettings();

  const experiences = dbExperiences.length > 0 ? dbExperiences : defaultExperiences;
  const about = profile?.about ?? "Assalamu Alaykum, I'm Nur Al Amin — a Website and App Developer with over 5 years of experience. I work full-time, so communication with me is always easy and responsive. Development is not just my job, it's my passion. I truly enjoy turning ideas into functional, beautiful digital products. I focus on long-term collaboration and always aim to deliver clean, scalable code that satisfies and builds trust.";
  const footerText = settings?.footer_text ?? "NUR AL AMIN © 2017 – 2026. All Rights Reserved.";

  return (
    <main className="flex h-full flex-col gap-6 overflow-y-auto rounded-2xl border bg-card p-8 scrollbar-thin">
      <motion.section variants={fadeUp} initial="hidden" animate="visible">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">About</h2>
        <div className="prose dark:prose-invert max-w-none text-base leading-relaxed text-muted-foreground" dangerouslySetInnerHTML={{ __html: about }} />
      </motion.section>

      <div className="h-px bg-border" />

      <motion.section initial="hidden" animate="visible" variants={stagger}>
        <motion.h2 variants={fadeUp} className="mb-6 text-sm font-semibold uppercase tracking-widest text-muted-foreground">Experience</motion.h2>
        <div className="relative space-y-8 pl-6 before:absolute before:left-[5px] before:top-2 before:h-[calc(100%-2rem)] before:w-px before:bg-border">
          {experiences.map((exp, i) => (
            <motion.div key={exp.id ?? i} className="relative" variants={fadeUp}>
              <div className="absolute -left-6 top-1.5 h-3 w-3 rounded-full bg-primary" />
              <div className="flex flex-col gap-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2">
                  <div className="order-2 sm:order-1">
                    <h3 className="text-base font-bold text-foreground">{exp.title}</h3>
                    <p className="text-sm text-muted-foreground">{exp.company}</p>
                  </div>
                  <span className="order-1 sm:order-2 shrink-0 self-start rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">{exp.period}</span>
                </div>
                <div className="mt-2 rounded-lg border bg-secondary/50 p-3">
                  <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed text-muted-foreground" dangerouslySetInnerHTML={{ __html: exp.description ?? "" }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

    </main>
  );
}
