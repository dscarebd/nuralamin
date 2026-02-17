import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function RefundPolicy() {
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
            <p className="text-sm text-muted-foreground">Last updated: February 17, 2026</p>
          </div>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">1. Overview</h2>
            <p>
              We are committed to delivering high-quality work and ensuring client satisfaction. This Refund Policy outlines
              the conditions under which refunds may be issued for our web development and digital services.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">2. Deposit & Advance Payments</h2>
            <ul className="ml-4 list-disc space-y-1.5">
              <li>Deposits paid to initiate a project are <strong className="text-foreground">non-refundable</strong> once work has commenced</li>
              <li>If the project has not yet started, a full refund of the deposit may be requested within 48 hours of payment</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">3. Eligible Refund Scenarios</h2>
            <p className="mb-2">A partial or full refund may be considered in the following cases:</p>
            <ul className="ml-4 list-disc space-y-1.5">
              <li><strong className="text-foreground">Non-delivery:</strong> If we fail to deliver the agreed-upon work within the specified timeline without prior communication</li>
              <li><strong className="text-foreground">Significant deviation:</strong> If the delivered work significantly deviates from the agreed scope and cannot be corrected through revisions</li>
              <li><strong className="text-foreground">Mutual agreement:</strong> Both parties agree to cancel the project before completion</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">4. Non-Refundable Situations</h2>
            <ul className="ml-4 list-disc space-y-1.5">
              <li>Change of mind after work has been completed and approved</li>
              <li>Delays caused by the client's failure to provide required materials or feedback</li>
              <li>Scope changes or additional feature requests beyond the original agreement</li>
              <li>Third-party costs (hosting, domains, licenses) already incurred on the client's behalf</li>
              <li>Work completed for milestones that have been approved</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">5. Refund Process</h2>
            <ul className="ml-4 list-decimal space-y-1.5">
              <li>Submit a refund request via our contact channels with a detailed explanation</li>
              <li>We will review your request within <strong className="text-foreground">5 business days</strong></li>
              <li>If approved, the refund will be processed within <strong className="text-foreground">7–14 business days</strong> through the original payment method</li>
              <li>Partial refunds will be calculated based on the percentage of work completed</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">6. Cancellation by Client</h2>
            <p>
              If a client wishes to cancel an ongoing project, they are responsible for payment of all work completed up to the
              cancellation date. Any remaining balance for undelivered work will be refunded.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">7. Cancellation by Us</h2>
            <p>
              In rare cases where we are unable to continue a project, we will provide a full refund for any undelivered work
              and assist with a smooth transition to another provider if needed.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">8. Disputes</h2>
            <p>
              We encourage open communication to resolve any disputes before formal action. If a resolution cannot be reached,
              both parties agree to seek mediation before pursuing other legal remedies.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">9. Contact Us</h2>
            <p>
              To request a refund or discuss any concerns, please reach out through our{" "}
              <Link to="/pricing" className="font-medium text-primary hover:underline">contact page</Link>.
            </p>
          </section>
        </div>
      </motion.article>
    </div>
  );
}
