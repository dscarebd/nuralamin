

## Make Header Card Bigger

The header bar currently has a fixed height of `h-14` (56px), which looks small compared to the content cards below. The plan is to increase its size for better visual balance.

### Changes

**File: `src/components/FloatingHeader.tsx`**

1. Increase header height from `h-14` (56px) to `h-16` (64px)
2. Increase the avatar size from `h-8 w-8` to `h-9 w-9` to match the larger header
3. Increase horizontal padding from `px-4 md:px-6` to `px-5 md:px-8` for more breathing room

These are small CSS-only tweaks -- no structural or backend changes needed.

