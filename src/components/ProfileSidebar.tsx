import { useState } from "react";
import { Download, Facebook, Instagram, Send, MessageCircle, Share2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { downloadVCard } from "@/lib/vcard";
import profilePhoto from "@/assets/profile-photo.jpg";

const socials = [
  { icon: Facebook, href: "https://facebook.com/shariflogohut", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com/shariflogohut", label: "Instagram" },
  { icon: Send, href: "https://t.me/shariflogohut", label: "Telegram" },
  { icon: MessageCircle, href: "https://wa.me/8801XXXXXXXXX", label: "WhatsApp" },
];

const PROFILE_URL = "https://mycardbd.app/shariflogohut";

export default function ProfileSidebar() {
  const [qrOpen, setQrOpen] = useState(false);

  return (
    <aside className="flex flex-col items-center gap-6 rounded-2xl border bg-card p-8">
      {/* Profile Photo */}
      <div className="rounded-full bg-gradient-to-br from-primary to-accent p-1">
        <Avatar className="h-32 w-32">
          <AvatarImage src={profilePhoto} alt="Shariful Islam" />
          <AvatarFallback className="text-2xl">SI</AvatarFallback>
        </Avatar>
      </div>

      {/* Name & Title */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Shariful Islam</h1>
        <p className="text-sm text-muted-foreground">Brand Designer</p>
      </div>

      {/* Save Contact */}
      <Button onClick={downloadVCard} className="w-full gap-2 rounded-xl">
        <Download className="h-4 w-4" />
        Save Contact
      </Button>

      {/* Social Icons */}
      <div className="flex items-center gap-3">
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
        <span className="flex h-10 w-10 items-center justify-center rounded-full border bg-secondary text-xs font-semibold text-muted-foreground">
          +5
        </span>
      </div>

      {/* QR Section */}
      <div className="flex w-full flex-col items-center gap-3 rounded-xl border bg-secondary p-4">
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
      </div>

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
                const canvas = document.querySelector<HTMLElement>(".qr-download canvas");
                // fallback: copy link
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
