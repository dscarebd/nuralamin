import { Phone, Mail, MapPin } from "lucide-react";

const contactItems = [
  { icon: Phone, label: "Mobile", value: "+880 1XXX-XXXXXX", href: "tel:+8801XXXXXXXXX" },
  { icon: Mail, label: "Email", value: "shariful@logohut.com", href: "mailto:shariful@logohut.com" },
  { icon: MapPin, label: "Location", value: "Dhaka, Bangladesh", href: "#" },
];

const experiences = [
  {
    title: "Senior Brand Designer",
    company: "LogoHut Creative Agency",
    period: "2023 — Present",
    description: "Leading brand identity projects for international clients, creating comprehensive visual systems.",
  },
  {
    title: "Brand Designer",
    company: "Creative Studio BD",
    period: "2021 — 2023",
    description: "Designed brand identities, logos, and marketing materials for diverse clientele across industries.",
  },
  {
    title: "Junior Graphic Designer",
    company: "DesignWorks Agency",
    period: "2019 — 2021",
    description: "Created visual content for social media, print materials, and web projects.",
  },
  {
    title: "Freelance Designer",
    company: "Self-Employed",
    period: "2017 — 2019",
    description: "Started freelancing with logo design and branding projects for local businesses.",
  },
];

export default function MainContent() {
  return (
    <main className="flex flex-col gap-8">
      {/* Contact Cards */}
      <section className="grid gap-3 sm:grid-cols-3">
        {contactItems.map((c) => (
          <a
            key={c.label}
            href={c.href}
            className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-secondary"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <c.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{c.label}</p>
              <p className="truncate text-sm font-medium text-foreground">{c.value}</p>
            </div>
          </a>
        ))}
      </section>

      {/* About */}
      <section className="rounded-xl border bg-card p-6">
        <h2 className="mb-3 text-lg font-semibold text-foreground">About</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          I'm Shariful Islam, a passionate Brand Designer based in Dhaka, Bangladesh. With over 7 years of
          experience in graphic design and branding, I specialize in creating unique and memorable brand
          identities that help businesses stand out. My approach combines creative thinking with strategic
          design to deliver impactful visual solutions.
        </p>
      </section>

      {/* Experience Timeline */}
      <section className="rounded-xl border bg-card p-6">
        <h2 className="mb-6 text-lg font-semibold text-foreground">Experience</h2>
        <div className="relative space-y-8 pl-6 before:absolute before:left-[7px] before:top-2 before:h-[calc(100%-2rem)] before:w-px before:bg-border">
          {experiences.map((exp, i) => (
            <div key={i} className="relative">
              {/* Timeline dot */}
              <div className="absolute -left-6 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-primary bg-background" />
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-foreground">{exp.title}</h3>
                <p className="text-xs text-muted-foreground">{exp.company}</p>
                <span className="mt-1 w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {exp.period}
                </span>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-muted-foreground">
        © 2026 Shariful Islam
      </footer>
    </main>
  );
}
