import { useState } from "react";
import { Briefcase, Facebook, Instagram, Send, Youtube, Phone, Mail, MapPin, Share2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { downloadVCard } from "@/lib/vcard";
import ThemeToggle from "@/components/ThemeToggle";
import profilePhoto from "@/assets/profile-photo.jpg";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const socials = [
  { icon: Facebook, href: "https://facebook.com/nuralamin", label: "Facebook", hoverBg: "hover:bg-[#1877F2]" },
  { icon: Instagram, href: "https://instagram.com/nuralamin", label: "Instagram", hoverBg: "hover:bg-gradient-to-br hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF]" },
  { icon: Send, href: "https://t.me/nuralamin", label: "Telegram", hoverBg: "hover:bg-[#26A5E4]" },
  { icon: Youtube, href: "https://youtube.com/@nuralamin", label: "YouTube", hoverBg: "hover:bg-[#FF0000]" },
  { icon: WhatsAppIcon, href: "https://wa.me/8801825668550", label: "WhatsApp", hoverBg: "hover:bg-[#25D366]" },
];

const PROFILE_URL = "https://mycardbd.app/shariflogohut";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function ProfileSidebar() {
  const [qrOpen, setQrOpen] = useState(false);

  return (
    <aside className="relative flex h-full flex-col items-center gap-6 rounded-2xl border bg-card p-8">
      <ThemeToggle className="absolute right-3 top-3" />
      {/* Profile Photo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="rounded-full bg-gradient-to-br from-primary to-accent p-1"
      >
        <Avatar className="h-32 w-32">
          <AvatarImage src={profilePhoto} alt="NUR AL AMIN" />
          <AvatarFallback className="text-2xl">NA</AvatarFallback>
        </Avatar>
      </motion.div>

      {/* Name & Title */}
      <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" className="text-center">
        <h1 className="text-2xl font-bold text-foreground">NUR AL AMIN</h1>
        <p className="text-sm text-muted-foreground">Website and App Developer</p>
      </motion.div>

      {/* Hire Me */}
      <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" className="w-full">
        <Button asChild className="w-full gap-2 rounded-xl">
          <Link to="/portfolio">
            <Briefcase className="h-4 w-4" />
            Hire Me
          </Link>
        </Button>
      </motion.div>

      {/* Social Icons */}
      <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="flex items-center gap-3">
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className={`flex h-10 w-10 items-center justify-center rounded-full border bg-secondary text-muted-foreground transition-all duration-300 hover:text-white hover:border-transparent ${s.hoverBg}`}
          >
            <s.icon className="h-4 w-4" />
          </a>
        ))}
      </motion.div>

      {/* Contact Cards */}
      <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible" className="flex w-full flex-col gap-3">
        <a
          href="tel:01825668550"
          className="group relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-xl border border-border/60 bg-secondary p-3 transition-shadow hover:shadow-[0_-2px_20px_-4px_rgba(34,197,94,0.25)]"
        >
          <div className="absolute inset-x-0 top-0 h-[2px] scale-x-0 bg-gradient-to-r from-transparent via-emerald-400 to-transparent transition-transform duration-300 group-hover:scale-x-100" />
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
            <Phone className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Mobile</p>
            <p className="text-xs font-semibold text-foreground">01825668550</p>
          </div>
        </a>
        <a
          href="mailto:hey@nuralamin.com"
          className="group relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-xl border border-border/60 bg-secondary p-3 transition-shadow hover:shadow-[0_-2px_20px_-4px_rgba(239,68,68,0.25)]"
        >
          <div className="absolute inset-x-0 top-0 h-[2px] scale-x-0 bg-gradient-to-r from-transparent via-red-400 to-transparent transition-transform duration-300 group-hover:scale-x-100" />
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-red-400">
            <Mail className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Email</p>
            <p className="text-xs font-semibold text-foreground truncate">hey@nuralamin.com</p>
          </div>
        </a>
        <div className="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-border/60 bg-secondary p-3 transition-shadow hover:shadow-[0_-2px_20px_-4px_rgba(249,115,22,0.25)]">
          <div className="absolute inset-x-0 top-0 h-[2px] scale-x-0 bg-gradient-to-r from-transparent via-orange-400 to-transparent transition-transform duration-300 group-hover:scale-x-100" />
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500/15 text-orange-400">
            <MapPin className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Location</p>
            <p className="text-xs font-semibold text-foreground">Uttara, Dhaka, Bangladesh</p>
          </div>
        </div>
        <a
          href="https://annurdigital.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-xl border border-border/60 bg-secondary p-3 transition-shadow hover:shadow-[0_-2px_20px_-4px_rgba(99,102,241,0.25)]"
        >
          <div className="absolute inset-x-0 top-0 h-[2px] scale-x-0 bg-gradient-to-r from-transparent via-indigo-400 to-transparent transition-transform duration-300 group-hover:scale-x-100" />
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-400">
            <Briefcase className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Founder</p>
            <p className="text-xs font-semibold text-foreground">An-Nur Digital</p>
          </div>
        </a>
        <a
          href="https://quraninsight.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-xl border border-border/60 bg-secondary p-3 transition-shadow hover:shadow-[0_-2px_20px_-4px_rgba(20,184,166,0.25)]"
        >
          <div className="absolute inset-x-0 top-0 h-[2px] scale-x-0 bg-gradient-to-r from-transparent via-teal-400 to-transparent transition-transform duration-300 group-hover:scale-x-100" />
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-500/15 text-teal-400">
            <Briefcase className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Founder</p>
            <p className="text-xs font-semibold text-foreground">Quran Insight</p>
          </div>
        </a>
      </motion.div>

      {/* View Portfolio */}
      <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible" className="w-full">
        <Button asChild variant="outline" className="w-full gap-2 rounded-xl">
          <Link to="/portfolio">
            <Briefcase className="h-4 w-4" />
            View My Portfolio
          </Link>
        </Button>
      </motion.div>

      {/* QR Modal */}
      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="max-w-xs border bg-card">
          <DialogHeader>
            <DialogTitle>Share Profile</DialogTitle>
            <DialogDescription>Scan the QR code or share the link below.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="rounded-lg bg-foreground p-3">
              <QRCodeSVG value={PROFILE_URL} size={200} bgColor="hsl(210,40%,98%)" fgColor="hsl(222,47%,11%)" />
            </div>
            <p className="text-xs text-muted-foreground break-all">{PROFILE_URL}</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(PROFILE_URL);
              }}
            >
              Copy Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
