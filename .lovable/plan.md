

## Instant Page Switching with Data Prefetching

**Problem**: When switching between pages (Home, Portfolio, Pricing), content takes time to load because each page independently fetches its data from the backend only when visited.

**Solution**: Prefetch all page data on initial app load so it's already cached when navigating. Combined with keeping the existing page transitions smooth, this makes page switches feel instant.

### How It Works

React Query (already in use) caches fetched data. By triggering all data fetches once on app startup, every subsequent page visit reads from the in-memory cache -- no loading delay.

### Changes

**1. Create `src/hooks/usePrefetchData.ts` (new file)**
- A custom hook that calls `queryClient.prefetchQuery()` for all public data queries: profile, social links, experiences, projects, pricing plans, and site settings.
- Runs once on app mount using `useEffect`.

**2. Update `src/App.tsx`**
- Call `usePrefetchData()` inside `AppLayout` so all data is fetched in the background as soon as the app loads.

**3. Update `src/hooks/usePublicData.ts`**
- Add `staleTime: 1000 * 60 * 5` (5 minutes) to all query hooks so React Query serves cached data instantly instead of refetching on every page navigation.

### Technical Details

The prefetch hook will look like:

```typescript
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function usePrefetchData() {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    // Prefetch all public data queries in parallel
    queryClient.prefetchQuery({ queryKey: ["profile"], queryFn: ... });
    queryClient.prefetchQuery({ queryKey: ["social_links"], queryFn: ... });
    queryClient.prefetchQuery({ queryKey: ["experiences"], queryFn: ... });
    queryClient.prefetchQuery({ queryKey: ["projects"], queryFn: ... });
    queryClient.prefetchQuery({ queryKey: ["pricing_plans"], queryFn: ... });
    queryClient.prefetchQuery({ queryKey: ["site_settings"], queryFn: ... });
  }, []);
}
```

Each `useQuery` hook in `usePublicData.ts` will get `staleTime: 5 * 60 * 1000` so cached results are served immediately without triggering background refetches during normal browsing.

