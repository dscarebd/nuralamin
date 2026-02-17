import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/usePublicData";

const DEFAULT_CONTENT = `
<h2>1. Overview</h2>
<p>We are committed to delivering high-quality work and ensuring client satisfaction. This Refund Policy outlines the conditions under which refunds may be issued for our web development and digital services.</p>

<h2>2. Deposit & Advance Payments</h2>
<ul>
<li>Deposits paid to initiate a project are <strong>non-refundable</strong> once work has commenced</li>
<li>If the project has not yet started, a full refund of the deposit may be requested within 48 hours of payment</li>
</ul>

<h2>3. Eligible Refund Scenarios</h2>
<p>A partial or full refund may be considered in the following cases:</p>
<ul>
<li><strong>Non-delivery:</strong> If we fail to deliver the agreed-upon work within the specified timeline without prior communication</li>
<li><strong>Significant deviation:</strong> If the delivered work significantly deviates from the agreed scope and cannot be corrected through revisions</li>
<li><strong>Mutual agreement:</strong> Both parties agree to cancel the project before completion</li>
</ul>

<h2>4. Non-Refundable Situations</h2>
<ul>
<li>Change of mind after work has been completed and approved</li>
<li>Delays caused by the client's failure to provide required materials or feedback</li>
<li>Scope changes or additional feature requests beyond the original agreement</li>
<li>Third-party costs (hosting, domains, licenses) already incurred on the client's behalf</li>
<li>Work completed for milestones that have been approved</li>
</ul>

<h2>5. Refund Process</h2>
<ol>
<li>Submit a refund request via our contact channels with a detailed explanation</li>
<li>We will review your request within <strong>5 business days</strong></li>
<li>If approved, the refund will be processed within <strong>7–14 business days</strong> through the original payment method</li>
<li>Partial refunds will be calculated based on the percentage of work completed</li>
</ol>

<h2>6. Cancellation by Client</h2>
<p>If a client wishes to cancel an ongoing project, they are responsible for payment of all work completed up to the cancellation date. Any remaining balance for undelivered work will be refunded.</p>

<h2>7. Cancellation by Us</h2>
<p>In rare cases where we are unable to continue a project, we will provide a full refund for any undelivered work and assist with a smooth transition to another provider if needed.</p>

<h2>8. Disputes</h2>
<p>We encourage open communication to resolve any disputes before formal action. If a resolution cannot be reached, both parties agree to seek mediation before pursuing other legal remedies.</p>

<h2>9. Contact Us</h2>
<p>To request a refund or discuss any concerns, please reach out through our contact page.</p>
`;

export default function RefundPolicy() {
  const { data: settings } = useSiteSettings();
  const content = settings?.refund_policy_content || DEFAULT_CONTENT;
  const lastUpdated = settings?.refund_policy_date || "February 17, 2026";

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:px-8">
      <motion.article
        className="mx-auto max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button asChild variant="ghost" size="sm" className="mb-6 gap-1.5 text-muted-foreground hover:text-foreground">
          <Link to="/"><ArrowLeft className="h-4 w-4" /> Back to Home</Link>
        </Button>

        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <RotateCcw className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Refund Policy</h1>
            <p className="text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
          </div>
        </div>

        <div
          className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </motion.article>
    </div>
  );
}
