

# Content Protection Plan

## Summary

Protect all public pages from copying images, text, and icons -- **except** individual blog post pages (`/blog/:slug`) where users can copy images and text. Also block browser DevTools (inspect mode) across the entire public site including blog posts. Admin pages remain completely unprotected.

## Protection Rules

| Page | Copy Text | Copy Images | Right-Click | DevTools |
|------|-----------|-------------|-------------|----------|
| Home `/` | Blocked | Blocked | Blocked | Blocked |
| Portfolio `/portfolio` | Blocked | Blocked | Blocked | Blocked |
| Portfolio Detail `/portfolio/:id` | Blocked | Blocked | Blocked | Blocked |
| Blog listing `/blog` | Blocked | Blocked | Blocked | Blocked |
| Blog post `/blog/:slug` | Allowed | Allowed | Allowed | Blocked |
| Pricing `/pricing` | Blocked | Blocked | Blocked | Blocked |
| Policy pages | Blocked | Blocked | Blocked | Blocked |
| Admin `/abdullah/*` | No protection at all | | | |

## Changes

### 1. New Component: `src/components/ContentProtection.tsx`

A wrapper component that applies protection based on current route:

- **Copy/Select protection** (all public pages except `/blog/:slug`):
  - Disable right-click context menu
  - Block `copy` and `cut` events
  - Block Ctrl/Cmd+C, Ctrl/Cmd+X, Ctrl/Cmd+A shortcuts
  - Apply `user-select: none` CSS to prevent text selection
  - Apply `-webkit-user-drag: none` to prevent image dragging

- **DevTools protection** (all public pages including blog posts):
  - Block F12, Ctrl/Cmd+Shift+I, Ctrl/Cmd+Shift+J, Ctrl/Cmd+U (view source)
  - These are client-side deterrents -- not foolproof but effective against casual users

### 2. CSS Updates: `src/index.css`

Add a `.content-protected` class:
```css
.content-protected {
  user-select: none;
  -webkit-user-select: none;
}
.content-protected img {
  -webkit-user-drag: none;
  pointer-events: none;
}
```

### 3. Integration: `src/App.tsx`

Wrap the public layout section with `<ContentProtection>` so it covers all non-admin routes. The component internally checks the route and applies the right level of protection.

## Technical Notes

- Route detection uses `useLocation()` from React Router
- Blog post pages are identified by checking if the path matches `/blog/` followed by a slug segment
- All event listeners are cleaned up on unmount or route change via `useEffect` cleanup
- This is a **client-side deterrent** -- determined users with technical knowledge can still bypass it, but it effectively prevents casual copying

