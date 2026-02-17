import { motion } from "framer-motion";
import { ArrowLeft, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
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
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground">Last updated: February 17, 2026</p>
          </div>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">1. Introduction</h2>
            <p>
              Welcome to NUR AL AMIN's portfolio website. Your privacy is important to us. This Privacy Policy explains how we collect,
              use, disclose, and safeguard your information when you visit our website. Please read this policy carefully.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">2. Information We Collect</h2>
            <p className="mb-2">We may collect the following types of information:</p>
            <ul className="ml-4 list-disc space-y-1.5">
              <li><strong className="text-foreground">Personal Information:</strong> Name, email address, phone number, and other contact details you provide through our contact forms or service requests.</li>
              <li><strong className="text-foreground">Project Information:</strong> Details about your project requirements, budget, and preferences shared during consultations.</li>
              <li><strong className="text-foreground">Usage Data:</strong> Information about how you interact with our website, including pages visited, time spent, and browser information.</li>
              <li><strong className="text-foreground">Cookies:</strong> Small data files stored on your device to enhance your browsing experience.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">3. How We Use Your Information</h2>
            <ul className="ml-4 list-disc space-y-1.5">
              <li>To respond to your inquiries and service requests</li>
              <li>To provide and maintain our services</li>
              <li>To improve our website and user experience</li>
              <li>To send project updates and relevant communications</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">4. Data Sharing</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share your data only with trusted
              service providers who assist us in operating our website and conducting our business, provided they agree to keep
              this information confidential.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized
              access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">6. Your Rights</h2>
            <p className="mb-2">You have the right to:</p>
            <ul className="ml-4 list-disc space-y-1.5">
              <li>Access, update, or delete your personal information</li>
              <li>Opt out of receiving communications from us</li>
              <li>Request a copy of the data we hold about you</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">7. Cookies</h2>
            <p>
              Our website uses cookies to enhance your experience. You can choose to disable cookies through your browser settings,
              though this may affect the functionality of certain features on our website.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
              We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">9. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us through our{" "}
              <Link to="/pricing" className="font-medium text-primary hover:underline">contact page</Link>.
            </p>
          </section>
        </div>
      </motion.article>
    </div>
  );
}
