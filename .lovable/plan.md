

## Fix Header Left-Side Gap on Portfolio Page

**Root Cause**: In `App.tsx`, the `FloatingHeader` is rendered outside the scrollable `<div className="flex-1 overflow-auto">`, while the page content is inside it. On desktop, the scrollbar reduces the available width for the content area but not the header, causing both `max-w-5xl` containers to center at slightly different positions.

**Solution**: Move the `FloatingHeader` inside the scrollable container. Since the header uses `sticky` positioning, it will still stick to the top of the scroll area -- same visual behavior, but now it shares the same available width as the content, so both align perfectly.

### Changes

**File: `src/App.tsx`** (lines 61-64)

Move `<FloatingHeader />` from outside the scrollable div to inside it:

```text
Before:
  <FloatingHeader />
  <div className="flex-1 overflow-auto">
    ...content...

After:
  <div className="flex-1 overflow-auto">
    <FloatingHeader />
    ...content...
```

This is a single-line move with no other changes needed. The `sticky top-0 z-50` classes on the header already handle staying visible at the top of any scroll container.
