
## Reduce Card Heights Without Changing Content

Reduce the outer padding of both cards to make them shorter, while keeping all content sizes unchanged.

### Changes

**1. `src/components/ProfileSidebar.tsx`**
- Reduce vertical padding from `py-3` to `py-2` (keeps `px-5` and `gap-2.5` as-is)

**2. `src/components/MainContent.tsx`**
- Reduce padding from `p-6` (24px all sides) to `px-6 py-4` (less vertical padding)
- Reduce footer padding from `py-6` to `py-3`

**3. `src/pages/Index.tsx`**
- Reduce outer vertical padding from `py-8` to `py-6`
- Reduce gap between the two cards from `gap-8` to `gap-6`

These changes only affect spacing/padding around the cards, not the content inside them.
