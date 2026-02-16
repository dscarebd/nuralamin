import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Clock, Zap, Rocket, Send, User, MessageCircle, FileText, Link2, PartyPopper, DollarSign } from "lucide-react";
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
const iconColorMap: Record<string, { bg: string; text: string }> = {
  Clock: { bg: "bg-sky-500", text: "text-white" },
  Zap: { bg: "bg-amber-500", text: "text-white" },
  Rocket: { bg: "bg-rose-500", text: "text-white" },
};

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
  budget: z.string().trim().min(1, "Budget is required"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Pricing() {
  const { data: dbPlans = [] } = usePricingPlans();
  const { data: settings } = useSiteSettings();
  const { toast } = useToast();

  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectedPlanPrice, setSelectedPlanPrice] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [thankYouOpen, setThankYouOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState<ContactForm | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const hasSubmitted = useRef(false);

  const notifyTelegram = useCallback(async (data: Record<string, string | undefined>, status: "submitted" | "not_requested") => {
    try {
      await supabase.functions.invoke("notify-telegram", {
        body: { ...data, status },
      });
    } catch (e) {
      console.error("Telegram notification failed:", e);
    }
  }, []);

  const telegramUrl = settings?.telegram_url ?? "https://t.me/nuralamin_official";
  const ctaText = settings?.cta_text ?? "Need a custom solution?";
  const ctaDesc = settings?.cta_description ?? "Every project is unique. Let's discuss your specific requirements and find the perfect plan.";

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", contact_id: "", project_details: "", project_links: "", budget: "" },
  });

  const parsePrice = (price: string) => {
    const num = parseInt(price.replace(/[^0-9]/g, ""), 10);
    return isNaN(num) ? 0 : num;
  };

  const openForm = (planName: string, planPrice: string) => {
    setSelectedPlan(planName);
    const minBudget = parsePrice(planPrice);
    setSelectedPlanPrice(minBudget);
    form.reset({ name: "", contact_id: "", project_details: "", project_links: "", budget: "" });
    hasSubmitted.current = false;
    setFormOpen(true);
  };

  const handleFormClose = (open: boolean) => {
    if (!open && !hasSubmitted.current) {
      const values = form.getValues();
      const hasData = Object.values(values).some((v) => v?.trim());
      if (hasData) {
        notifyTelegram(
          { name: values.name, contact_id: values.contact_id, project_details: values.project_details, project_links: values.project_links, plan_name: selectedPlan, budget: values.budget },
          "not_requested"
        );
      }
    }
    setFormOpen(open);
  };

  const onSubmit = async (data: ContactForm) => {
    const budgetNum = parseInt(data.budget.replace(/[^0-9]/g, ""), 10);
    if (isNaN(budgetNum) || budgetNum < selectedPlanPrice) {
      form.setError("budget", { message: `Budget must be at least $${selectedPlanPrice}` });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("contact_requests").insert({
      name: data.name,
      contact_id: data.contact_id,
      project_details: data.project_details,
      project_links: data.project_links || null,
      plan_name: selectedPlan,
      budget: `$${budgetNum}`,
    });
    setSubmitting(false);

    if (error) {
      toast({ title: "Error", description: "Failed to submit. Please try again.", variant: "destructive" });
      return;
    }

    hasSubmitted.current = true;
    notifyTelegram(
      { name: data.name, contact_id: data.contact_id, project_details: data.project_details, project_links: data.project_links, plan_name: selectedPlan, budget: `$${budgetNum}` },
      "submitted"
    );

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
      `💰 Budget: ${submittedData.budget}`,
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
                  {(() => {
                    const colors = iconColorMap[plan.icon ?? ""] ?? { bg: "bg-primary/15", text: "text-primary" };
                    return (
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors.bg}`}>
                        <Icon className={`h-5 w-5 ${colors.text}`} />
                      </div>
                    );
                  })()}
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
                  onClick={() => openForm(plan.name, plan.price)}
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
      <Dialog open={formOpen} onOpenChange={handleFormClose}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-2xl">
          <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-transparent px-6 pt-6 pb-4">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Get Started with {selectedPlan}</DialogTitle>
              <DialogDescription className="text-xs">Fill in your details and we'll get back to you shortly.</DialogDescription>
            </DialogHeader>
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3 px-6 pb-6 pt-2">
            <div className="rounded-xl border bg-muted/30 p-4">
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15"><User className="h-5 w-5 text-amber-500" /></div>
                <Label htmlFor="name" className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Name *</Label>
              </div>
              <Input id="name" placeholder="Your full name" className="ml-12 w-[calc(100%-3rem)] rounded-lg border border-input bg-background" {...form.register("name")} />
              {form.formState.errors.name && <p className="ml-12 text-xs text-destructive mt-1">{form.formState.errors.name.message}</p>}
            </div>
            <div className="rounded-xl border bg-muted/30 p-4">
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15"><MessageCircle className="h-5 w-5 text-emerald-500" /></div>
                <Label htmlFor="contact_id" className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">WhatsApp or Telegram ID *</Label>
              </div>
              <Input id="contact_id" placeholder="@username or phone number" className="ml-12 w-[calc(100%-3rem)] rounded-lg border border-input bg-background" {...form.register("contact_id")} />
              {form.formState.errors.contact_id && <p className="ml-12 text-xs text-destructive mt-1">{form.formState.errors.contact_id.message}</p>}
            </div>
            <div className="rounded-xl border bg-muted/30 p-4">
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/15"><FileText className="h-5 w-5 text-violet-500" /></div>
                <Label htmlFor="project_details" className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Project Details *</Label>
              </div>
              <Textarea id="project_details" placeholder="Describe your project..." rows={3} className="ml-12 w-[calc(100%-3rem)] rounded-lg border border-input bg-background resize-none" {...form.register("project_details")} />
              {form.formState.errors.project_details && <p className="ml-12 text-xs text-destructive mt-1">{form.formState.errors.project_details.message}</p>}
            </div>
            <div className="rounded-xl border bg-muted/30 p-4">
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/15"><Link2 className="h-5 w-5 text-sky-500" /></div>
                <Label htmlFor="project_links" className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Project Links (optional)</Label>
              </div>
              <Input id="project_links" placeholder="Reference URLs, designs, etc." className="ml-12 w-[calc(100%-3rem)] rounded-lg border border-input bg-background" {...form.register("project_links")} />
            </div>
            <div className="rounded-xl border bg-muted/30 p-4">
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-500/15"><DollarSign className="h-5 w-5 text-rose-500" /></div>
                <Label htmlFor="budget" className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Budget * (min ${selectedPlanPrice})</Label>
              </div>
              <Input id="budget" type="number" min={selectedPlanPrice} placeholder={`Minimum $${selectedPlanPrice}`} className="ml-12 w-[calc(100%-3rem)] rounded-lg border border-input bg-background" {...form.register("budget")} />
              {form.formState.errors.budget && <p className="ml-12 text-xs text-destructive mt-1">{form.formState.errors.budget.message}</p>}
            </div>
            <Button type="submit" className="mt-2 w-full gap-2 rounded-xl" disabled={submitting}>
              <Send className="h-4 w-4" /> {submitting ? "Submitting..." : "Submit Request"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Thank You Dialog */}
      <Dialog open={thankYouOpen} onOpenChange={setThankYouOpen}>
        <DialogContent className="sm:max-w-sm p-0 overflow-hidden rounded-2xl text-center">
          <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-transparent px-6 pt-8 pb-4">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15"><PartyPopper className="h-8 w-8 text-emerald-500" /></div>
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-bold">Thank You!</DialogTitle>
              <DialogDescription className="text-center">
                Your request has been submitted successfully. We'll review your details soon!
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="space-y-3 px-6 pb-6 pt-2">
            <Button asChild className="w-full gap-2 rounded-xl">
              <a href={buildTelegramLink()} target="_blank" rel="noopener noreferrer">
                <Send className="h-4 w-4" /> Contact on Telegram
              </a>
            </Button>
            <Button variant="outline" className="w-full rounded-xl" onClick={() => setThankYouOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
