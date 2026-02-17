

## Fix: Blog Full Page Gallery, Portfolio Gallery, and View Project Button

Three bugs to fix from the recent multi-image upload feature:

### Issue 1: Blog Full Page Missing Gallery Images
**File:** `src/pages/BlogPost.tsx`

The full blog post page (`/blog/:slug`) never renders `gallery_images`. It only shows the cover image and content. Need to add a gallery section after the content, displaying images in a 2-column grid (same as the blog popup dialog does).

### Issue 2: Portfolio Popup Not Showing Gallery
**File:** `src/pages/Portfolio.tsx`

The portfolio dialog uses `(selectedProject as any).gallery_images` with a type cast, but the `Project` type already has `gallery_images` as optional. The data from `useProjects()` returns the DB type which includes `gallery_images`. The issue is that the local `Project` type definition (line 26-37) has `gallery_images` as optional, which should be fine. Let me check if the data is actually being fetched -- the `useProjects` hook uses `select("*")` so `gallery_images` should come through. The dialog code at line 131 casts to `any` unnecessarily but should still work. This might be a data issue (no gallery images uploaded for projects yet), but the code structure looks correct. Will clean up the type cast regardless.

### Issue 3: "View Project" Button Not Working in Portfolio Popup
**File:** `src/pages/Portfolio.tsx` (line 167-169)

The "View Project" button wraps an `<a>` tag. If `selectedProject.link` is `null`, the href becomes `"#"` which navigates nowhere meaningful. But the bigger issue is likely that clicking the button area triggers the dialog close. The `Button asChild` with a link should work. Need to verify the button renders correctly -- possibly the dialog's `onOpenChange` intercepts the click. Will ensure proper `target="_blank"` behavior and that the link opens in a new tab.

### Changes

**`src/pages/BlogPost.tsx`:**
- After the content `div` (line 94-97), add a gallery images section
- Render `post.gallery_images` in a 2-column responsive grid with rounded corners
- Only show if gallery_images array has items

**`src/pages/Portfolio.tsx`:**
- Remove `(selectedProject as any)` casts -- use the proper type since `gallery_images` is already in the `Project` type
- Ensure the "View Project" button link works by adding `onClick` with `e.stopPropagation()` or using proper anchor behavior
- Make the dialog scrollable (add `max-h-[85vh]` and `overflow-y-auto`) to match blog dialog style, since gallery images could make the dialog taller than the viewport
