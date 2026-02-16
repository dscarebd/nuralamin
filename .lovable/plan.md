

## Problem

The floating header is rendered outside the Index page (in `App.tsx`), but the Index page sets `lg:h-screen` (100vh). This means the page content takes 100% of the viewport height AND the header adds extra height on top, causing both cards to overflow beyond the screen.

Additionally, the `py-8` (32px top and bottom padding) on the Index page wastes vertical space since the header already provides top spacing.

## Solution

Make two targeted changes:

1. **`src/pages/Index.tsx`** -- Change the outer container height from `lg:h-screen` (100vh) to a calculated height that subtracts the header space. Also reduce top padding since the header already provides spacing.
   - Replace `lg:h-screen` with `lg:h-[calc(100vh-60px)]` to account for the sticky header (~48px height + 12px top padding)
   - Change `py-8` to `pb-8 pt-4` to reduce top padding (header already provides spacing above)

2. **`src/components/ProfileSidebar.tsx`** -- Reduce the avatar size slightly (from `h-32 w-32` to `h-28 w-28`) to save vertical space in the sidebar card.

## Technical Details

- The floating header is `h-12` (48px) with `pt-3` (12px) padding = ~60px total
- Using `calc(100vh - 60px)` ensures the grid fills exactly the remaining viewport
- Reducing top padding from 32px to 16px saves another 16px
- Smaller avatar saves ~16px more, helping the sidebar fit without scrolling

