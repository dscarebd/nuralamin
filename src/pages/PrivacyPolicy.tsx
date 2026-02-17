import { motion } from "framer-motion";
import { ArrowLeft, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/usePublicData";

const DEFAULT_CONTENT = `
<h2>1. Introduction</h2>
<p>Welcome to NUR AL AMIN's portfolio website. Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.</p>

<h2>2. Information We Collect</h2>
<p>We may collect the following types of information:</p>
<ul>
<li><strong>Personal Information:</strong> Name, email address, phone number, and other contact details you provide through our contact forms or service requests.</li>
<li><strong>Project Information:</strong> Details about your project requirements, budget, and preferences shared during consultations.</li>
<li><strong>Usage Data:</strong> Information about how you interact with our website, including pages visited, time spent, and browser information.</li>
<li><strong>Cookies:</strong> Small data files stored on your device to enhance your browsing experience.</li>
</ul>

<h2>3. How We Use Your Information</h2>
<ul>
<li>To respond to your inquiries and service requests</li>
<li>To provide and maintain our services</li>
<li>To improve our website and user experience</li>
<li>To send project updates and relevant communications</li>
<li>To comply with legal obligations</li>
</ul>

<h2>4. Data Sharing</h2>
<p>We do not sell, trade, or rent your personal information to third parties. We may share your data only with trusted service providers who assist us in operating our website and conducting our business, provided they agree to keep this information confidential.</p>

<h2>5. Data Security</h2>
<p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.</p>

<h2>6. Your Rights</h2>
<p>You have the right to:</p>
<ul>
<li>Access, update, or delete your personal information</li>
<li>Opt out of receiving communications from us</li>
<li>Request a copy of the data we hold about you</li>
<li>Withdraw consent at any time</li>
</ul>

<h2>7. Cookies</h2>
<p>Our website uses cookies to enhance your experience. You can choose to disable cookies through your browser settings, though this may affect the functionality of certain features on our website.</p>

<h2>8. Changes to This Policy</h2>
<p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.</p>

<h2>9. Contact Us</h2>
<p>If you have any questions about this Privacy Policy, please contact us through our contact page.</p>
`;

export default function PrivacyPolicy() {
  const { data: settings } = useSiteSettings();
  const content = settings?.privacy_policy_content || DEFAULT_CONTENT;
  const lastUpdated = settings?.privacy_policy_date || "February 17, 2026";

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
