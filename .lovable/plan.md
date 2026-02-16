

## Make Home Page Non-Scrollable with Fixed Header and Footer

The goal is to make the entire home page fit within the viewport height on desktop, with the header at the top and footer at the bottom. The two cards (sidebar and main content) should fill the space between them, and only their internal content should scroll.

### Changes Required

**1. `src/App.tsx` — Create a flex column layout for the home page**
- Wrap the layout in a full-height flex column (`h-screen flex flex-col`) so header, content, and footer each take their natural or remaining space.
- The route content area gets `flex-1 overflow-hidden` to fill remaining space.

**2. `src/pages/Index.tsx` — Fill available space instead of screen height**
- Change from `lg:h-screen` to `h-full` so it fills the flex-1 container instead of the full viewport.
- Remove `min-h-screen` and use `h-full overflow-hidden` on desktop.
- Adjust padding to account for header/footer already providing spacing.

**3. `src/components/ProfileSidebar.tsx` — Ensure internal scrolling**
- Add `overflow-y-auto` to the aside so sidebar content scrolls if it overflows.

**4. `src/components/MainContent.tsx` — Already has overflow-y-auto (no change needed)**

### Technical Details

**App.tsx** (for non-admin routes):
```
<div className="flex h-screen flex-col">
  <FloatingHeader />
  <div className="flex-1 overflow-hidden">
    {/* Routes */}
  </div>
  <FloatingFooter />
</div>
```

**Index.tsx**:
```
<div className="h-full bg-background px-4 py-4 md:px-8 overflow-hidden">
  <div className="mx-auto grid h-full max-w-5xl gap-8 lg:grid-cols-[320px_1fr]">
    <div className="h-full overflow-hidden">
      <ProfileSidebar />
    </div>
    <div className="h-full overflow-hidden">
      <MainContent />
    </div>
  </div>
</div>
```

**ProfileSidebar.tsx**:
- Add `overflow-y-auto` to the aside element so content scrolls within the card.

This ensures the page never scrolls as a whole — only the card contents scroll independently.
