

# Fix: RLS Policies Blocking Public Data

## Problem
All RLS policies on every table were created as **RESTRICTIVE** instead of **PERMISSIVE**. In PostgreSQL:
- **PERMISSIVE** (default): Access is granted if ANY policy passes
- **RESTRICTIVE**: Access is granted only if ALL policies pass

Since the "Admins can manage" policy fails for unauthenticated visitors, the "Public can read" policy is effectively blocked -- making the entire site appear empty.

## Solution
Drop all existing RLS policies and recreate them as **PERMISSIVE** (the default). This is a single database migration affecting all 6 tables:
- `profile`
- `social_links`
- `experiences`
- `projects`
- `pricing_plans`
- `site_settings`

No code changes are needed -- the frontend hooks are correct. Once the policies are fixed, data will immediately appear on the site.

## Technical Details

### Database Migration (1 migration)
For each table, the migration will:
1. Drop the existing RESTRICTIVE "Public can read" policy
2. Drop the existing RESTRICTIVE "Admins can manage" policy  
3. Recreate both as PERMISSIVE policies

Example pattern per table:
```text
DROP POLICY "Public can read X" ON public.X;
DROP POLICY "Admins can manage X" ON public.X;

CREATE POLICY "Public can read X" ON public.X
  FOR SELECT USING (true);  -- PERMISSIVE by default

CREATE POLICY "Admins can manage X" ON public.X
  FOR ALL USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));
```

The `profile` table has separate INSERT/UPDATE/DELETE policies that will also be recreated as PERMISSIVE.

### What This Fixes
- Experience section will show all 4 entries
- Profile sidebar will show name, title, contact info
- Portfolio projects will display
- Pricing plans will appear
- All site settings (footer text, etc.) will load

### No Data Was Lost
All your content (experiences, profile, projects, pricing) is safely stored in the database. Only the access rules need fixing.

