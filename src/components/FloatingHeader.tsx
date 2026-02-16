import { useState } from "react";
import { Menu } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NavLink } from "@/components/NavLink";
import ThemeToggle from "@/components/ThemeToggle";
import { useProfile } from "@/hooks/usePublicData";
import profilePhoto from "@/assets/profile-photo.jpg";
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
  const photo = profile?.photo_url || profilePhoto;

  return (
    <div className="sticky top-0 z-50 w-full px-4 pt-3 md:px-8">
      <header className="mx-auto flex h-14 max-w-5xl items-center justify-between rounded-2xl border border-border bg-background/70 px-4 shadow-lg shadow-black/5 backdrop-blur-xl md:px-6">
        {/* Left: Avatar + Name */}
        <NavLink to="/" className="flex items-center gap-2.5">
          <Avatar className="h-8 w-8">
            <AvatarImage src={photo} alt={name} />
            <AvatarFallback className="text-xs">{name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <img src={headerLogo} alt={name} className="h-[46px] dark:invert" />
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
            <SheetContent side="right" className="w-64">
              <SheetHeader>
                <SheetTitle className="text-left">Navigation</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-2">
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
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </div>
  );
}
