import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Menu, Send } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NavLink } from "@/components/NavLink";
import ThemeToggle from "@/components/ThemeToggle";
import { useProfile } from "@/hooks/usePublicData";
import headerIcon from "@/assets/header-icon.png";
import headerLogo from "@/assets/header-logo.png";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Pricing", to: "/pricing" },
];

export default function FloatingHeader() {
  const { data: profile } = useProfile();
  const [open, setOpen] = useState(false);

  const name = profile?.name ?? "NUR AL AMIN";
  const photo = profile?.photo_url || headerIcon;

  return (
    <div className="sticky top-0 z-50 w-full px-4 pt-3 md:px-8">
      <header className="mx-auto flex h-16 max-w-5xl items-center justify-between rounded-2xl border border-border bg-background/70 px-3 shadow-lg shadow-black/5 backdrop-blur-xl md:px-5">
        {/* Left: Avatar + Name */}
        <NavLink to="/" className="flex items-center gap-2.5">
          <img src={headerLogo} alt={name} className="h-[50px] dark:invert" />
        </NavLink>

        {/* Right: Desktop nav + Theme toggle + mobile menu */}
        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                activeClassName="bg-primary/10 text-primary"
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <ThemeToggle />

          {/* Mobile hamburger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-64 flex-col">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <img src={headerLogo} alt={name} className="h-[40px] dark:invert" />
                </SheetTitle>
              </SheetHeader>
              <Separator className="my-3" />
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    className="rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    activeClassName="bg-primary/10 text-primary"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              {/* Contact card */}
              <div className="mt-auto rounded-lg border border-border bg-secondary/50 p-4">
                <p className="mb-3 text-sm font-medium text-foreground">Need any help?</p>
                <Button asChild size="sm" className="w-full gap-2">
                  <a href="https://t.me/nuralamin_official" target="_blank" rel="noopener noreferrer">
                    <Send className="h-4 w-4" />
                    Chat on Telegram
                  </a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </div>
  );
}
