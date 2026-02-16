

## Fix: Remove Bottom Gap in Project Detail Popup

### Problem
The dialog's inner container has a `sm:min-h-[420px]` minimum height, but since the image uses `object-contain` (no cropping), it doesn't fill that height, leaving a visible gap at the bottom.

### Solution
Remove the `sm:min-h-[420px]` constraint so the dialog sizes itself naturally based on the image and content. The image will dictate the left column height, and the right column will match it.

### Technical Details

**File: `src/pages/Portfolio.tsx`**

- Change the inner flex container from:
  ```
  className="flex flex-col sm:flex-row sm:min-h-[420px]"
  ```
  to:
  ```
  className="flex flex-col sm:flex-row"
  ```

This single change removes the forced minimum height, eliminating the bottom gap while keeping the two-column layout intact.
