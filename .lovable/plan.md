

# Fix: Portfolio Page Empty Due to Expired JWT

## Problem
The portfolio page shows no projects even though 6 projects exist in the database. The Supabase client is sending an expired JWT token in the Authorization header, causing PostgREST to reject the request with a 401 error before RLS policies are evaluated.

This affects any logged-in user whose session token expires while browsing public pages.

## Solution
Add error handling in the `useProjects` hook (and other public data hooks) to retry without authentication when a 401 error occurs. This ensures public pages always work regardless of auth state.

## Technical Changes

### 1. Update `src/hooks/usePublicData.ts`
For each public query function (`useProfile`, `useSocialLinks`, `useExperiences`, `useProjects`, `usePricingPlans`, `useSiteSettings`):

- Add `retry` logic or catch 401 errors
- On 401, call `supabase.auth.signOut()` to clear the stale session, then retry the query
- Alternatively, set `useQuery` options with `retry: 2` so TanStack Query retries after the token auto-refresh kicks in

The simplest and most robust approach: wrap each query function to detect a 401 response and trigger a session refresh:

```typescript
// In each query function, check for errors:
const { data, error } = await supabase.from("projects").select("*").order("display_order");
if (error?.code === "PGRST303") {
  // JWT expired - clear stale session so next request uses anon key
  await supabase.auth.signOut();
  const { data: retryData } = await supabase.from("projects").select("*").order("display_order");
  return retryData ?? [];
}
return data ?? [];
```

### 2. Why This Works
- Public tables have a permissive RLS policy `USING (true)` for SELECT
- Anonymous (no JWT) requests work fine since PostgREST uses the anon role
- The issue only occurs when an expired JWT is sent -- PostgREST rejects it before evaluating policies
- Clearing the stale session makes subsequent requests use the anon key only

### 3. Files Changed
- `src/hooks/usePublicData.ts` -- Add 401 error handling with session cleanup and retry for all 6 hooks

