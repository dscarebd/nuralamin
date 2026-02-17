
## Blog Post Popup (Portfolio-Style Dialog)

Currently, clicking a blog card navigates to a separate `/blog/:slug` page. This plan will change it to open a **popup dialog** matching the portfolio's style -- with the cover image on top, content below, and metadata displayed cleanly.

### What Changes

**1. Blog listing page (`src/pages/Blog.tsx`)**
- Add state to track the selected blog post (like portfolio's `selectedProject`)
- Change `<Link>` wrappers on blog cards to `onClick` handlers that set the selected post
- Add a `Dialog` component at the bottom (matching the portfolio pattern) that shows:
  - Cover image (full-width, aspect-video)
  - Title, category badge, published date, and tags
  - Full HTML content rendered via `dangerouslySetInnerHTML`
  - A "Read on page" link for users who want the full-page view

**2. Keep the standalone BlogPost page**
- The `/blog/:slug` route and `BlogPost.tsx` will remain functional for direct links and SEO
- The dialog will include a subtle link to the full page as a fallback

### Dialog Layout (mirrors Portfolio)

```text
+----------------------------------+
|  [Cover Image - aspect-video]    |
+----------------------------------+
|  Category Badge                  |
|  Title (large, bold)             |
|  Date  |  Tags                   |
|----------------------------------|
|  Full blog content (scrollable)  |
|                                  |
|  [Read Full Post button]         |
+----------------------------------+
```

### Technical Details

- Reuse the same `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription` components already used in Portfolio
- Set `max-w-2xl` on DialogContent (same as portfolio)
- Add `ScrollArea` or `max-h-[70vh] overflow-y-auto` for long blog content inside the dialog
- Featured post cards and regular post cards will both use `onClick` instead of `<Link>`
- The dialog content will use the same premium styling: gradient overlay on image, clean metadata section with border separator
