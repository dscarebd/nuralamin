import { useState } from "react";
import { Download, Facebook, Instagram, Send, Youtube, MessageCircle, Share2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { downloadVCard } from "@/lib/vcard";
import profilePhoto from "@/assets/profile-photo.jpg";

const socials = [
  { icon: Facebook, href: "https://facebook.com/nuralamin", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com/nuralamin", label: "Instagram" },
  { icon: Send, href: "https://t.me/nuralamin", label: "Telegram" },
  { icon: Youtube, href: "https://youtube.com/@nuralamin", label: "YouTube" },
  { icon: MessageCircle, href: "https://wa.me/8801825668550", label: "WhatsApp" },
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
