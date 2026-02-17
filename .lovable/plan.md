

## Update Brand Colors to Purple Theme

### What Changes
Replace the current blue primary color scheme with a purple/violet theme matching your brand identity from the image.

### Color Palette (extracted from image)
- **Primary**: Deep purple/violet (~265 deg hue, rich saturation)
- **Dark mode background**: Deep navy-purple tones
- **Accents**: Lighter purple for highlights and badges

### Files to Modify

**1. `src/index.css`** -- Update all CSS custom properties:

**Light mode:**
- `--primary`: Change from blue (213 94% 48%) to purple (~265 84% 55%)
- `--accent`: Match primary purple
- `--ring`: Match primary purple
- `--sidebar-primary` and `--sidebar-ring`: Match primary purple

**Dark mode:**
- `--primary`: Lighter purple for dark backgrounds (~265 84% 65%)
- `--background`: Shift to a deep navy-purple (260 40% 10%)
- `--card`: Slightly lighter navy-purple
- `--secondary`, `--muted`: Purple-tinted dark tones
- `--border`, `--input`: Purple-tinted borders
- `--accent`, `--ring`: Match dark mode primary
- All sidebar variables: Match the purple scheme

### What Stays the Same
- Light mode background stays white/near-white
- Destructive (red) color stays unchanged
- Border radius, animations, typography -- all unchanged
- No component code changes needed since everything uses CSS variables

### Result
Every button, link, badge, progress bar, sidebar highlight, and accent across the entire site will shift from blue to purple, matching your brand.

