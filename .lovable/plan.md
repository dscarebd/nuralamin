

## Preloader System for Instant Page Transitions

### Problem
When users navigate between pages, images take time to load, causing a jarring experience. Data is already prefetched, but images are not.

### Solution
Add a splash/loading screen that appears when the user first visits. Behind the scenes, all data AND images from every page will be preloaded. Once everything is ready, the app reveals itself. After that, switching pages feels instant.

### How It Works

1. **SplashScreen Component** (`src/components/SplashScreen.tsx`)
   - A full-screen loading overlay with the site logo and a progress bar
   - Fades out smoothly once everything is loaded

2. **Image Preloader Hook** (`src/hooks/useImagePreloader.ts`)
   - Waits for all prefetched data to be available (profile, projects, blog posts, pricing plans)
   - Collects every image URL from the data: profile photo, project thumbnails, project gallery images, blog cover images, blog gallery images
   - Also includes static assets (header logo, header icon, company logos)
   - Uses `new Image()` to preload each one in parallel
   - Tracks progress (0-100%) for the progress bar
   - Returns `ready` state when all images are loaded (or after a timeout safety net of ~8 seconds)

3. **Integration in AppLayout** (`src/App.tsx`)
   - Show the SplashScreen while loading
   - Once ready, fade it out and show the actual app
   - Only shows on first visit (not on page refreshes within the session)

### What Gets Preloaded
- Profile photo
- Header logo and icon
- Company logos (An-Nur Digital, Quran Insight)
- All project cover images and gallery images
- All blog post cover images and gallery images
- All pricing plan icons (if any image-based)

### Technical Details

**SplashScreen**: Uses framer-motion for a smooth fade-out animation. Shows the header logo centered with a progress indicator below it.

**useImagePreloader**: 
- Reads from React Query cache using the same query keys as `usePrefetchData`
- Creates `Image` objects for each URL and listens to `onload`/`onerror`
- Tracks loaded count vs total to compute progress percentage
- Has a max wait timeout (~8s) so users aren't stuck if an image fails
- Marks as ready when all images load OR timeout is reached

**AppLayout changes**:
- Calls `useImagePreloader()` which returns `{ ready, progress }`
- Renders `<SplashScreen>` when `!ready`, passing `progress`
- Uses `AnimatePresence` for smooth transition from splash to content

### Files to Create
- `src/components/SplashScreen.tsx`
- `src/hooks/useImagePreloader.ts`

### Files to Modify
- `src/App.tsx` (integrate preloader into AppLayout)

