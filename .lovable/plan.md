

## Blog Page Redesign: List Layout with Full Image View

### Problem
Current blog page uses a grid layout (2-3 columns) with `object-cover` on fixed-height containers, which crops tall/portrait images. The user wants to display full images without cropping.

### Design Approach
Switch from grid cards to a **vertical list layout** where each post is a horizontal card (image left, content right on desktop; stacked on mobile). The image will use `object-contain` or natural aspect ratio so nothing gets cropped.

### Changes (single file: `src/pages/Blog.tsx`)

**Featured Posts Section:**
- Replace the 2-column grid with a single-column stack
- Each featured post: horizontal layout with image on the left (max-width ~280px) showing full image, content on the right
- On mobile: stack vertically, image on top at full width with natural aspect ratio

**Regular Posts Section:**
- Replace `grid sm:grid-cols-2 lg:grid-cols-3` with a single-column list (`flex flex-col gap-6`)
- Each post card: horizontal row layout — image thumbnail on the left (fixed width ~200-240px, natural height), title/excerpt/meta on the right
- On mobile: stack vertically, full-width image with natural aspect ratio
- Remove `h-44` fixed height constraint; use `w-full` with no height restriction so portrait images display fully
- Change `object-cover` to `object-contain` or remove height constraints entirely

**Dialog** — no changes needed, it already works fine.

**Key CSS patterns:**
- List item: `flex flex-col sm:flex-row gap-4` with image `sm:w-60 shrink-0 rounded-lg overflow-hidden` and natural aspect ratio
- Image: `w-full h-auto object-cover rounded-lg` (no fixed height, so tall images show fully)

