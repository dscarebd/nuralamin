

## Pricing: Mobile-Only Tabs for Each Plan

### What Changes
On mobile, the 3 pricing cards will be shown one at a time using a tabbed toggle (same style as the Portfolio page tabs). On desktop, the existing 3-column grid layout remains unchanged.

### How It Works
- 3 tabs: **Hourly**, **Project Based**, **Monthly Retainer** (matching the plan names from the database)
- Tabs are full-width with equal 1/3 splits on mobile (same style as Portfolio's 50/50 tabs)
- On desktop (sm and above), the tabs are hidden and all 3 cards show in the normal grid
- Default active tab: first plan (Hourly)

### Technical Details

**File: `src/pages/Pricing.tsx`**

1. Import `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` from `@/components/ui/tabs`
2. Import `useIsMobile` from `@/hooks/use-mobile`
3. On mobile: wrap the plans section in a `Tabs` component with 3 triggers, each `TabsContent` rendering a single plan card
4. On desktop: render the existing grid of all plans as-is (hidden on mobile)
5. The `TabsList` gets `w-full sm:hidden` classes, and each `TabsTrigger` gets `flex-1` for equal widths
6. The desktop grid gets `hidden sm:grid` to only show on larger screens

No database or backend changes needed.
