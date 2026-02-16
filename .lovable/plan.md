
## Fix: Footer Still Appears Sticky on Portfolio/Pricing Pages

### Problem
The `FloatingFooter` component is placed **outside** the scrollable container (`<div className="flex-1 overflow-auto">`) in `App.tsx` (line 73). Because of this, it always sits at the bottom of the viewport like a fixed element -- the `sticky` vs non-sticky class change has no visible effect since the footer is never part of the scrolling flow.

### Solution
Move the `FloatingFooter` **inside** the scrollable container so that on non-home pages it naturally appears at the end of the content after scrolling.

### Technical Details

**File: `src/App.tsx`**
- Move `<FloatingFooter />` from outside the scrollable div (line 73) to inside it (after the `AnimatePresence` block, around line 71)
- This way, on the home page the `sticky bottom-0` class keeps it pinned at the bottom of the scroll container
- On portfolio/pricing pages, the footer will sit at the end of the content and only appear when the user scrolls down

```text
Before:
  <div className="flex-1 overflow-auto">
    <AnimatePresence>...</AnimatePresence>
  </div>
  <FloatingFooter />       <-- outside scroll area (always visible)

After:
  <div className="flex-1 overflow-auto">
    <AnimatePresence>...</AnimatePresence>
    <FloatingFooter />     <-- inside scroll area (scrolls with content)
  </div>
```
