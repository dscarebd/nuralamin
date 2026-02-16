

## Portfolio: Two Sections (Website and Mobile App)

### What Changes
The portfolio page will be reorganized into two tabbed sections using the existing Tabs component:
- **Website** tab: shows projects with categories "Web Application" and "SaaS Product"
- **Mobile App** tab: shows projects with category "Mobile App"

### How It Works
- Uses the existing `category` field from the database to filter projects
- Tabs component (already available in the project) provides the section switching
- Both tabs show the same card grid layout with the same modal detail view
- The "All" default view is removed in favor of the two explicit sections

### Technical Details

**File: `src/pages/Portfolio.tsx`**
1. Import `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` from `@/components/ui/tabs`
2. Split `dbProjects` into two arrays:
   - `websiteProjects` -- category includes "Web Application" or "SaaS Product" (or anything not "Mobile App")
   - `mobileProjects` -- category is "Mobile App"
3. Wrap the project grid in a `Tabs` component with two `TabsContent` sections, each rendering its own filtered grid of `ProjectCard` components
4. Default active tab: "website"

No database changes needed -- the existing `category` column already distinguishes project types.

