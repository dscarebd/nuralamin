import { motion } from "framer-motion";

const experiences = [
  {
    title: "Full Stack Developer",
    company: "Freelance / Self-Employed",
    period: "Jan 2024 — Present",
    description: "Building custom websites and mobile applications for clients worldwide. Specializing in React, Next.js, React Native, and full-stack solutions with modern UI/UX practices.",
  },
  {
    title: "Web Developer",
    company: "Tech Solutions BD",
    period: "Jun 2022 — Dec 2023",
    description: "Developed and maintained responsive web applications using React and Node.js. Collaborated with cross-functional teams to deliver scalable and performant digital products.",
  },
  {
    title: "Junior Web Developer",
    company: "Digital Agency",
    period: "Jan 2021 — May 2022",
    description: "Built interactive front-end interfaces and integrated REST APIs. Gained hands-on experience with JavaScript, TypeScript, and modern front-end frameworks.",
  },
  {
    title: "Freelance Developer",
    company: "Self-Employed",
    period: "Jun 2019 — Dec 2020",
    description: "Started freelancing with WordPress sites and custom landing pages. Gradually transitioned to full-stack development with React and Node.js.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function MainContent() {
  return (
    <main className="flex h-full flex-col gap-6 overflow-y-auto rounded-2xl border bg-card p-8 scrollbar-thin">
      {/* About */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">About</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Assalamu Alaykum, I'm Nur Al Amin — a Website and App Developer with over 5 years of experience. I work full-time, so communication with me is always easy and responsive. Development is not just my job, it's my passion. I truly enjoy turning ideas into functional, beautiful digital products. I focus on long-term collaboration and always aim to deliver clean, scalable code that satisfies and builds trust.
        </p>
      </motion.section>

      <div className="h-px bg-border" />

      {/* Experience */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={stagger}
      >
        <motion.h2 variants={fadeUp} className="mb-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Experience</motion.h2>
        <div className="relative space-y-8 pl-6 before:absolute before:left-[5px] before:top-2 before:h-[calc(100%-2rem)] before:w-px before:bg-border">
          {experiences.map((exp, i) => (
            <motion.div key={i} className="relative" variants={fadeUp}>
              <div className="absolute -left-6 top-1.5 h-3 w-3 rounded-full bg-primary" />
              <div className="flex flex-col gap-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{exp.title}</h3>
                    <p className="text-xs text-muted-foreground">{exp.company}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-primary/15 px-3 py-1 text-[11px] font-medium text-primary">
                    {exp.period}
                  </span>
                </div>
                <div className="mt-2 rounded-lg border bg-secondary/50 p-3">
                  <p className="text-sm leading-relaxed text-muted-foreground">{exp.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-6 text-center text-xs text-muted-foreground"
      >
        NUR AL AMIN © 2017 – 2026. All Rights Reserved.
      </motion.footer>
    </main>
  );
}
