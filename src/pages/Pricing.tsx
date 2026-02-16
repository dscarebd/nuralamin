import { motion } from "framer-motion";
import { ArrowLeft, Check, Clock, Zap, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { usePricingPlans, useSiteSettings } from "@/hooks/usePublicData";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = { Clock, Zap, Rocket };

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function Pricing() {
  const { data: dbPlans = [] } = usePricingPlans();
  const { data: settings } = useSiteSettings();

  const telegramUrl = settings?.telegram_url ?? "https://t.me/nuralamin_official";
  const ctaText = settings?.cta_text ?? "Need a custom solution?";
  const ctaDesc = settings?.cta_description ?? "Every project is unique. Let's discuss your specific requirements and find the perfect plan.";

  return (
    <div className="min-h-screen bg-background px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex items-center justify-between">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link to="/"><ArrowLeft className="h-4 w-4" /> Back</Link>
          </Button>
          <ThemeToggle />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Pricing & Services</h1>
          <p className="mt-3 text-muted-foreground">Flexible plans tailored to your project needs. Let's build something amazing together.</p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dbPlans.map((plan, i) => {
            const Icon = iconMap[plan.icon ?? ""] ?? Clock;
            return (
              <motion.div key={plan.id} custom={i} variants={fadeUp} initial="hidden" animate="visible"
                className={`group relative flex flex-col rounded-2xl border bg-card p-6 transition-shadow hover:shadow-lg ${plan.popular ? "border-primary shadow-[0_0_30px_-8px_hsl(var(--primary)/0.3)]" : "border-border"}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">Most Popular</div>
                )}
                <div className="mb-4 flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${plan.popular ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">{plan.name}</h2>
                </div>
                <div className="mb-2 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">/Start From</span>
                </div>
                <p className="mb-6 text-sm text-muted-foreground">{plan.description}</p>
                <ul className="mb-8 flex flex-1 flex-col gap-3">
                  {(plan.features ?? []).map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {feature}
                    </li>
                  ))}
                </ul>
                <Button asChild className={`w-full rounded-xl ${plan.popular ? "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90" : ""}`} variant={plan.popular ? "default" : "outline"}>
                  <a href={telegramUrl} target="_blank" rel="noopener noreferrer">Get Started</a>
                </Button>
              </motion.div>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }} className="mt-12 rounded-2xl border bg-card p-8 text-center">
          <h3 className="text-xl font-bold text-foreground">{ctaText}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{ctaDesc}</p>
          <Button asChild className="mt-4 gap-2 rounded-xl">
            <a href={telegramUrl} target="_blank" rel="noopener noreferrer">Let's Talk</a>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
