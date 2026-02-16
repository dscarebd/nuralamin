import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Clock, Zap, Rocket, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import ThemeToggle from "@/components/ThemeToggle";
import { usePricingPlans, useSiteSettings } from "@/hooks/usePublicData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = { Clock, Zap, Rocket };

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" as const },
  }),
};

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  contact_id: z.string().trim().min(1, "WhatsApp or Telegram ID is required").max(100),
  project_details: z.string().trim().min(1, "Project details are required").max(2000),
  project_links: z.string().trim().max(500).optional(),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Pricing() {
  const { data: dbPlans = [] } = usePricingPlans();
  const { data: settings } = useSiteSettings();
  const { toast } = useToast();

  const [selectedPlan, setSelectedPlan] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [thankYouOpen, setThankYouOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState<ContactForm | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const telegramUrl = settings?.telegram_url ?? "https://t.me/nuralamin_official";
  const ctaText = settings?.cta_text ?? "Need a custom solution?";
  const ctaDesc = settings?.cta_description ?? "Every project is unique. Let's discuss your specific requirements and find the perfect plan.";

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", contact_id: "", project_details: "", project_links: "" },
  });

  const openForm = (planName: string) => {
    setSelectedPlan(planName);
    form.reset();
    setFormOpen(true);
  };

  const onSubmit = async (data: ContactForm) => {
    setSubmitting(true);
    const { error } = await supabase.from("contact_requests").insert({
      name: data.name,
      contact_id: data.contact_id,
      project_details: data.project_details,
      project_links: data.project_links || null,
      plan_name: selectedPlan,
    });
    setSubmitting(false);

    if (error) {
      toast({ title: "Error", description: "Failed to submit. Please try again.", variant: "destructive" });
      return;
    }

    setSubmittedData(data);
    setFormOpen(false);
    setThankYouOpen(true);
  };

  const buildTelegramLink = () => {
    if (!submittedData) return telegramUrl;
    const msg = [
      `Hi, I'm ${submittedData.name}.`,
      `I'm interested in the "${selectedPlan}" plan.`,
      ``,
      `📋 Project Details:`,
      submittedData.project_details,
      submittedData.project_links ? `\n🔗 Links: ${submittedData.project_links}` : "",
      ``,
      `📞 Contact: ${submittedData.contact_id}`,
    ].join("\n");
    return `https://t.me/nuralamin_official?text=${encodeURIComponent(msg)}`;
  };

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
                <Button
                  onClick={() => openForm(plan.name)}
                  className={`w-full rounded-xl ${plan.popular ? "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90" : ""}`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  Get Started
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

      {/* Contact Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Get Started with {selectedPlan}</DialogTitle>
            <DialogDescription>Fill in your details and we'll get back to you shortly.</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" placeholder="Your full name" {...form.register("name")} />
              {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_id">WhatsApp or Telegram ID *</Label>
              <Input id="contact_id" placeholder="@username or phone number" {...form.register("contact_id")} />
              {form.formState.errors.contact_id && <p className="text-xs text-destructive">{form.formState.errors.contact_id.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="project_details">Project Details *</Label>
              <Textarea id="project_details" placeholder="Describe your project..." rows={4} {...form.register("project_details")} />
              {form.formState.errors.project_details && <p className="text-xs text-destructive">{form.formState.errors.project_details.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="project_links">Project Links (optional)</Label>
              <Input id="project_links" placeholder="Reference URLs, designs, etc." {...form.register("project_links")} />
            </div>
            <Button type="submit" className="w-full gap-2" disabled={submitting}>
              <Send className="h-4 w-4" /> {submitting ? "Submitting..." : "Submit Request"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Thank You Dialog */}
      <Dialog open={thankYouOpen} onOpenChange={setThankYouOpen}>
        <DialogContent className="sm:max-w-sm text-center">
          <DialogHeader>
            <DialogTitle className="text-center">🎉 Thank You!</DialogTitle>
            <DialogDescription className="text-center">
              Your request has been submitted successfully. We'll review your details soon!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <Button asChild className="w-full gap-2">
              <a href={buildTelegramLink()} target="_blank" rel="noopener noreferrer">
                <Send className="h-4 w-4" /> Contact on Telegram
              </a>
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setThankYouOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
