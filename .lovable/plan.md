

## Add Founder Detail Cards to Profile Sidebar

Add two new contact-style cards below the existing Location card in the sidebar, matching the same design pattern (icon, label, value, hover glow).

### Changes

**`src/components/ProfileSidebar.tsx`**
- Add two new cards after the Location card inside the existing contact cards `motion.div`:
  1. **"Founder: An-Nur Digital"** -- uses a `Briefcase` icon with a blue/indigo color scheme and matching hover glow
  2. **"Founder: Quran Insight"** -- uses a `Briefcase` icon with a teal/cyan color scheme and matching hover glow
- Each card follows the exact same structure as the phone/email/location cards:
  - Rounded icon circle on the left
  - Small uppercase label ("Founder")
  - Bold value text ("An-Nur Digital" / "Quran Insight")
  - Top accent line on hover
  - Colored shadow on hover

