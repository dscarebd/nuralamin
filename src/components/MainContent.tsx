import { Phone, Mail, MapPin } from "lucide-react";

const experiences = [
  {
    title: "Brand Designer",
    company: "American Visa Consulting",
    period: "Jan 2026 — Present",
    description: "Redesigned the brand identity to establish trust and create strong, lasting recognition for an American visa consulting company. Created a memorable brand presence that encourages clients to choose the company for US visa consultation.",
  },
  {
    title: "Brand Designer",
    company: "Marsus Group",
    period: "Jan 2024 — Dec 2025",
    description: "Played a key role in branding 19 sister companies by creating logos, visual systems, and brand guidelines. Delivered end-to-end branding solutions, from logo to full brand guidelines.",
  },
  {
    title: "Brand Designer",
    company: "Ducky Memories",
    period: "Jun 2023 — Dec 2023",
    description: "Designed complete brand identity systems from logo concept to final execution.",
  },
  {
    title: "Brand Designer",
    company: "Sharif Logo Hut",
    period: "Nov 2021 — Present",
    description: "Freelance Brand Designer with 300+ branding projects completed for clients worldwide since 2021. Specialized in logo design and full brand identity development.",
  },
];

export default function MainContent() {
  return (
    <main className="flex flex-col gap-6">
      {/* Contact Cards */}
      <section className="grid gap-3 grid-cols-2">
        <a
          href="tel:01754392770"
          className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-secondary"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Phone className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Mobile</p>
            <p className="text-sm font-semibold text-foreground">01754392770</p>
          </div>
        </a>
        <a
          href="mailto:sharif.logohut@gmail.com"
          className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-secondary"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Mail className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Email</p>
            <p className="text-sm font-semibold text-foreground truncate">sharif.logohut@gmail.com</p>
          </div>
        </a>
        <div className="col-span-2 flex items-center gap-3 rounded-xl border bg-card p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MapPin className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Location</p>
            <p className="text-sm font-semibold text-foreground">Uttara, Dhaka, Bangladesh</p>
          </div>
        </div>
      </section>

      {/* About */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">About</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Assalamu Alaykum, I'm Shariful Islam — a Brand Designer with over 5 years of experience. I work full-time, so communication with me is always easy and responsive. Design is not just my job, it's my passion. I truly enjoy bringing ideas to life and telling your brand's story the right way. I focus on long-term collaboration and always aim to deliver results that satisfy and build trust.
        </p>
      </section>

      <div className="h-px bg-border" />

      {/* Experience */}
      <section>
        <h2 className="mb-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Experience</h2>
        <div className="relative space-y-8 pl-6 before:absolute before:left-[5px] before:top-2 before:h-[calc(100%-2rem)] before:w-px before:bg-border">
          {experiences.map((exp, i) => (
            <div key={i} className="relative">
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
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-muted-foreground">
        © 2026 Shariful Islam
      </footer>
    </main>
  );
}
