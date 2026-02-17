import { motion } from "framer-motion";
import { ArrowLeft, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function TermsOfService() {
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
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Terms of Service</h1>
            <p className="text-sm text-muted-foreground">Last updated: February 17, 2026</p>
          </div>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">1. Acceptance of Terms</h2>
            <p>
              By accessing and using this website and our services, you agree to be bound by these Terms of Service. If you do not
              agree to these terms, please do not use our website or services.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">2. Services</h2>
            <p>
              NUR AL AMIN provides web development, mobile app development, and related digital services. The specific scope,
              deliverables, timeline, and pricing for each project will be agreed upon before work begins.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">3. Client Responsibilities</h2>
            <ul className="ml-4 list-disc space-y-1.5">
              <li>Provide accurate and complete project requirements</li>
              <li>Supply necessary content, assets, and feedback in a timely manner</li>
              <li>Review and approve deliverables within the agreed timeframe</li>
              <li>Make payments according to the agreed schedule</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">4. Intellectual Property</h2>
            <p>
              Upon full payment, the client receives ownership of the final deliverables. We retain the right to showcase the work
              in our portfolio unless otherwise agreed. Any pre-existing intellectual property, frameworks, or tools used remain
              the property of their respective owners.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">5. Payment Terms</h2>
            <ul className="ml-4 list-disc space-y-1.5">
              <li>Payment terms will be outlined in the project agreement</li>
              <li>A deposit may be required before work begins</li>
              <li>Late payments may result in project delays or suspension</li>
              <li>All prices are quoted in the agreed currency</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">6. Project Timeline</h2>
            <p>
              Estimated timelines are provided in good faith but may vary depending on project complexity, client feedback response
              times, and scope changes. We will communicate any significant delays promptly.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">7. Revisions</h2>
            <p>
              The number of revision rounds included will be specified in the project agreement. Additional revisions beyond the
              agreed scope may incur extra charges.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">8. Limitation of Liability</h2>
            <p>
              We shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services
              or website. Our total liability shall not exceed the amount paid for the specific service in question.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">9. Termination</h2>
            <p>
              Either party may terminate a project with written notice. In the event of termination, the client is responsible for
              payment of all work completed up to the termination date.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">10. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated date.
              Continued use of our services constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">11. Contact</h2>
            <p>
              For questions about these Terms of Service, please reach out via our{" "}
              <Link to="/pricing" className="font-medium text-primary hover:underline">contact page</Link>.
            </p>
          </section>
        </div>
      </motion.article>
    </div>
  );
}
