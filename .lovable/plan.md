

## Fix: White Screen on Page Navigation

### Problem
All internal navigation links use plain HTML `<a href="...">` tags, which trigger a **full browser page reload**. This causes the white flash because the entire app is destroyed and rebuilt from scratch each time you click "Hire Me" or "Back to Profile."

### Solution
Replace all internal `<a href="...">` tags with React Router's `<Link>` component, which performs instant **client-side navigation** -- no reload, no white screen. Then wrap routes with Framer Motion's `AnimatePresence` for smooth fade transitions.

### Changes

**1. `src/App.tsx`** -- Add animated route transitions
- Import `AnimatePresence` from framer-motion and `useLocation` from react-router-dom
- Wrap `<Routes>` with `<AnimatePresence mode="wait">` keyed by location
- Wrap each route's element with a motion wrapper for fade-in/fade-out

**2. `src/components/ProfileSidebar.tsx`** -- Fix "Hire Me" button
- Replace `<a href="/portfolio">` with `<Link to="/portfolio">` from react-router-dom
- This makes the "Hire Me" button navigate instantly without a reload

**3. `src/pages/Portfolio.tsx`** -- Fix back buttons
- Replace `<a href="/">` (back arrow) with `<Link to="/">`
- Replace `<a href="/">Back to Profile</a>` with `<Link to="/">Back to Profile</Link>`
- Both navigation points will now be instant client-side transitions

**4. `src/pages/NotFound.tsx`** -- Fix "Return to Home" link
- Replace `<a href="/">` with `<Link to="/">`

### Result
- Zero white screen flashes
- Instant page switches with a subtle fade transition
- No new dependencies needed (framer-motion and react-router-dom are already installed)
