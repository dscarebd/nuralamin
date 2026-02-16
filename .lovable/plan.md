

## Project Detail Popup

When a user clicks on any project card, a dialog/popup will open showing the full project details in a clean layout.

### What will change

**File: `src/pages/Portfolio.tsx`**

1. Remove the click-to-expand description behavior (remove `expanded` state and `onClick` on description)
2. Lift state to the parent `Portfolio` component with a `selectedProject` state (stores the clicked project or `null`)
3. Make the entire card clickable (via `onClick` on the card) to set the selected project
4. Add a `Dialog` component (already available in the project) that opens when `selectedProject` is set, displaying:
   - Large project image at the top
   - Category badge
   - Project title
   - Full description text (no truncation)
   - Tech stack tags
   - "View Project" link button
   - Close button (built into Dialog)

### Technical Details

- Import `Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription` from `@/components/ui/dialog`
- The `ProjectCard` will accept an `onClick` prop instead of managing its own expanded state
- Description on the card stays truncated at 2 lines (no toggle)
- The dialog will use `max-w-2xl` for a comfortable reading width
- The card's "View Project" link click will use `e.stopPropagation()` to prevent opening the dialog when clicking the link directly

