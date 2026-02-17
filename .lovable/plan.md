

## Fix: Cards Overlapping Footer on Desktop Home

### Problem
On the desktop home page, both the ProfileSidebar and MainContent cards extend to the full height of their container. However, the FloatingHeader sits inside the same container, pushing the cards down so their bottom portions get hidden behind the footer.

### Solution
Restructure the desktop home layout so the header and content area are in a flex column. The header takes its natural height, and the Index page fills only the remaining space. Both cards will be internally scrollable.

### Changes

**1. `src/App.tsx`** -- Make the content wrapper a flex column on desktop home, so the header and route content stack properly:
- Add `lg:flex lg:flex-col` to the content wrapper when on home page
- Give the route's `motion.div` a `lg:flex-1 lg:min-h-0` instead of `lg:h-full` so it fills remaining space after the header

**2. `src/pages/Index.tsx`** -- Replace `lg:h-full` with `lg:flex-1 lg:min-h-0` on the outer div so it properly fills the remaining flex space without overflowing.

### Technical Details

The root cause is that `h-full` means "100% of parent height," but the parent also contains the header. Using `flex-1` with `min-h-0` in a flex column ensures the content takes exactly the remaining space after the header, preventing overflow.

No content will be removed or shrunk -- both cards will simply stop at the footer boundary and scroll internally to show all content.

