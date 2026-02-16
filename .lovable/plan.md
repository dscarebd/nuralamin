

## Fix: Footer Appearing Sticky on Mobile/Tablet

### Root Cause
In `App.tsx`, the layout structure is:

```text
<div className="flex h-screen flex-col">
  <FloatingHeader />
  <div className="flex-1 overflow-auto">   <-- scrollable area
    <Routes>...</Routes>
  </div>
  <FloatingFooter />                        <-- OUTSIDE scroll area
</div>
```

Because the footer is outside the scrollable container, it always stays pinned at the bottom of the viewport regardless of CSS classes. The `sticky` removal had no visible effect.

### Solution
Move `<FloatingFooter />` **inside** the scrollable container so it becomes part of the content flow on mobile/tablet.

**File: `src/App.tsx`**
- Move `<FloatingFooter />` from after the scrollable div to inside it (after `AnimatePresence`)
- This way on mobile/tablet it scrolls with content
- On desktop home page, the `lg:sticky lg:bottom-0` class keeps it pinned at the bottom of the scroll area

```text
After fix:
<div className="flex h-screen flex-col">
  <FloatingHeader />
  <div className="flex-1 overflow-auto">
    <AnimatePresence>...</AnimatePresence>
    <FloatingFooter />                    <-- INSIDE scroll area
  </div>
</div>
```

No other files need changes.
