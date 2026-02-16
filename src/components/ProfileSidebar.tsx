import { useState } from "react";
import { Download, Facebook, Instagram, Send, Youtube, Share2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { downloadVCard } from "@/lib/vcard";
import profilePhoto from "@/assets/profile-photo.jpg";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const socials = [
  { icon: Facebook, href: "https://facebook.com/nuralamin", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com/nuralamin", label: "Instagram" },
  { icon: Send, href: "https://t.me/nuralamin", label: "Telegram" },
  { icon: Youtube, href: "https://youtube.com/@nuralamin", label: "YouTube" },
  { icon: WhatsAppIcon, href: "https://wa.me/8801825668550", label: "WhatsApp" },
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
    <aside className="flex flex-col items-center gap-6 rounded-2xl border bg-card p-8">
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

      {/* Save Contact */}
      <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" className="w-full">
        <Button onClick={downloadVCard} className="w-full gap-2 rounded-xl">
          <Download className="h-4 w-4" />
          Save Contact
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
            className="flex h-10 w-10 items-center justify-center rounded-full border bg-secondary text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <s.icon className="h-4 w-4" />
          </a>
        ))}
      </motion.div>

      {/* QR Section */}
      <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible" className="flex w-full flex-col items-center gap-3 rounded-xl border bg-secondary p-4">
        <p className="text-xs font-medium text-muted-foreground">Scan to Connect</p>
        <div className="rounded-lg bg-foreground p-2">
          <QRCodeSVG value={PROFILE_URL} size={100} bgColor="hsl(210,40%,98%)" fgColor="hsl(222,47%,11%)" />
        </div>
        <button
          onClick={() => setQrOpen(true)}
          className="flex items-center gap-1.5 text-xs text-primary hover:underline"
        >
          <Share2 className="h-3 w-3" />
          Share Profile
        </button>
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
