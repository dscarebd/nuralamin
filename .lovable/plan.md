

## Add Card Style to Right Side Content

The left sidebar already has a card wrapper (`rounded-2xl border bg-card p-8`), but the right side (MainContent) has no card container -- it's just raw content. This creates a visual imbalance as seen in the screenshot.

### Changes

**`src/components/MainContent.tsx`**
- Wrap the entire `<main>` content in a card-style container with `rounded-2xl border bg-card p-8` to match the left sidebar's appearance
- This gives both sides a consistent card look with matching border, background, and padding

### Technical Detail

The wrapper `<main>` element will get these classes added:
```
rounded-2xl border bg-card p-8
```

This matches the sidebar's existing `rounded-2xl border bg-card p-8` classes exactly, ensuring visual consistency in both light and dark modes.

