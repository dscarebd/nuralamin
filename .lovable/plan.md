

## Change Portfolio Dialog Layout to Top-Bottom (Stacked)

Currently the project detail dialog uses a side-by-side layout (image left, details right) on desktop. Based on your reference screenshot, you'd like to switch to a stacked layout where the image is on top and the details are below.

### Changes

**`src/pages/Portfolio.tsx`**
- Change the dialog inner layout from `flex-col sm:flex-row` to just `flex-col` so the image always sits above the details
- Remove the `sm:w-1/2` constraint on the image section so it spans full width
- Limit the image height (e.g., `max-h-72`) so it doesn't take too much vertical space
- Keep the details section below with its current metadata and button styling
- Adjust dialog max-width if needed for a cleaner vertical presentation

