
# Floating Header for All Pages

## Overview
Add a persistent floating header/navbar that appears on every page (Home, Portfolio, Pricing, etc.) showing your logo/avatar, name, page navigation links, and the theme toggle. The header will be sticky at the top with a glassmorphism (frosted glass) effect.

## What It Will Look Like

- A slim, rounded floating bar pinned to the top of every page
- Left side: your profile photo (small avatar) + name "NUR AL AMIN"
- Center/Right: navigation links -- Home, Portfolio, Pricing
- Far right: Theme toggle (sun/moon)
- Glassmorphism background (blurred, semi-transparent) so content scrolls behind it
- Active page link is highlighted

## Technical Details

### 1. Create `src/components/FloatingHeader.tsx` (new file)
- Fetches profile data (name, photo) from the `useProfile` hook
- Shows avatar + name on the left
- Navigation links (Home `/`, Portfolio `/portfolio`, Pricing `/pricing`) in the center
- Theme toggle on the right
- On mobile: collapse nav links into a hamburger menu using the existing Sheet component
- Uses `sticky top-0` with `backdrop-blur-xl bg-background/70` for the floating glass effect
- Uses `NavLink` component to highlight the active route

### 2. Update `src/App.tsx`
- Import and render `FloatingHeader` above the `AnimatedRoutes` component so it appears on all public pages
- Exclude the header from admin routes (`/admin/*`) since they have their own sidebar

### 3. Update `src/pages/Index.tsx`
- Remove the `ThemeToggle` from ProfileSidebar (since it's now in the header)
- Add top padding to account for the floating header

### 4. Update `src/components/ProfileSidebar.tsx`
- Remove the `ThemeToggle` button from the sidebar (moved to header)

### 5. Update `src/pages/Portfolio.tsx`
- Remove the back button + ThemeToggle from the top (replaced by the header nav)
- Add top padding to account for the floating header

### 6. Update `src/pages/Pricing.tsx`
- Remove any standalone ThemeToggle / back button (replaced by the header)
- Add top padding

### Files Changed
- **New:** `src/components/FloatingHeader.tsx`
- **Edit:** `src/App.tsx` -- add FloatingHeader
- **Edit:** `src/components/ProfileSidebar.tsx` -- remove ThemeToggle
- **Edit:** `src/pages/Index.tsx` -- adjust spacing
- **Edit:** `src/pages/Portfolio.tsx` -- remove duplicate header controls
- **Edit:** `src/pages/Pricing.tsx` -- remove duplicate header controls
