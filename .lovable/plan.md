
# Admin Panel for Portfolio Website

## Overview
Build a fully functional admin panel backed by Supabase database, allowing you to manage all website content (profile info, social links, experience, portfolio projects, pricing plans) through a dashboard UI -- similar to WordPress.

## What You'll Get

### 1. Supabase Backend Setup
- **Authentication**: Email/password login for admin access
- **Database tables** for all dynamic content:
  - `profile` -- name, title, about text, phone, email, location, photo URL
  - `social_links` -- platform, URL, display order
  - `experiences` -- title, company, period, description, display order
  - `projects` -- title, category, description, tech stack, image, link, budget, date
  - `pricing_plans` -- name, price, description, features, popular flag, order
  - `site_settings` -- footer text, CTA text, and other misc settings
- **RLS policies**: Only authenticated admin can read/write; public can read
- **Seed data**: Pre-populate tables with your current hardcoded content

### 2. Admin Panel UI (`/admin`)
- **Login page** (`/admin/login`) -- email/password form
- **Dashboard layout** with sidebar navigation:
  - **Profile** -- Edit name, title, about, contact info, photo
  - **Social Links** -- Add/edit/delete/reorder social media links
  - **Experience** -- Add/edit/delete/reorder work experience entries
  - **Portfolio** -- Add/edit/delete projects with image upload
  - **Pricing** -- Edit plan names, prices, features, toggle popular
  - **Settings** -- Footer text, CTA text, Telegram link
- Each section has inline editing with save/cancel
- Toast notifications on save

### 3. Frontend Updates
- Replace all hardcoded data arrays in `ProfileSidebar`, `MainContent`, `Portfolio`, and `Pricing` with data fetched from Supabase using TanStack Query
- Loading skeletons while data loads
- Graceful fallback if database is empty

## Technical Details

### New Files (~15 files)
```text
src/integrations/supabase/        -- Supabase client setup
src/contexts/AuthContext.tsx       -- Auth state management
src/pages/admin/Login.tsx          -- Admin login page
src/pages/admin/Dashboard.tsx      -- Admin dashboard layout
src/pages/admin/ProfileEditor.tsx  -- Profile editing
src/pages/admin/SocialEditor.tsx   -- Social links editor
src/pages/admin/ExperienceEditor.tsx
src/pages/admin/ProjectsEditor.tsx
src/pages/admin/PricingEditor.tsx
src/pages/admin/SettingsEditor.tsx
src/components/admin/AdminSidebar.tsx
src/components/admin/ProtectedRoute.tsx
src/hooks/useProfile.ts           -- Data hooks for each table
src/hooks/useProjects.ts
src/hooks/usePricing.ts
(+ Supabase migrations)
```

### Modified Files
- `src/App.tsx` -- Add admin routes
- `src/components/ProfileSidebar.tsx` -- Fetch data from Supabase
- `src/components/MainContent.tsx` -- Fetch data from Supabase
- `src/pages/Portfolio.tsx` -- Fetch data from Supabase
- `src/pages/Pricing.tsx` -- Fetch data from Supabase

### Database Schema

```text
profile
  id, name, title, about, phone, email, location,
  photo_url, company_name, company_url, company2_name,
  company2_url, profile_url

social_links
  id, platform, url, display_order

experiences
  id, title, company, period, description, display_order

projects
  id, title, category, description, tech (text[]),
  image_url, link, budget, date, display_order

pricing_plans
  id, name, icon, price, unit, description,
  features (text[]), popular, display_order

site_settings
  id, key, value
```

### Implementation Order
1. Enable Supabase Cloud on the project
2. Create all database tables and seed with current data
3. Set up authentication and RLS policies
4. Build admin login page
5. Build admin dashboard with sidebar navigation
6. Build each editor section (profile, socials, experience, projects, pricing)
7. Update public-facing pages to read from database
8. Test end-to-end
