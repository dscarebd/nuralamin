
## Blog Dialog: Match Portfolio Popup Style

The user wants the blog popup dialog to have the same rounded corners, padding, and scroll behavior as the portfolio popup -- where the image and metadata card stays fixed and only the blog content scrolls.

### Changes

**`src/pages/Blog.tsx`** (Dialog section, lines 224-296)
- Add `rounded-lg` with top/bottom padding to the dialog's inner image container so corners are visible
- Make the dialog a fixed-height layout where the cover image and metadata (title, category, date, tags) remain fixed/static
- Only the blog content section scrolls (`overflow-y-auto` with `max-h`)
- The "Read Full Post" button stays pinned at the bottom, outside the scroll area
- Add `rounded-lg` to the image inside the dialog to match the portfolio's rounded look

### Layout Structure

```text
+--------------------------------------------+
|  [Cover Image - rounded-lg, aspect-video]  |  <- Fixed
+--------------------------------------------+
|  Category Badge                            |  <- Fixed
|  TITLE (bold, uppercase)                   |
|  Excerpt                                   |
|  ----------------------------------------  |
|  Date / Category / Tags (metadata)         |
|  ----------------------------------------  |
|  Blog content (SCROLLABLE ONLY THIS PART)  |  <- Scrolls
|  ...                                       |
|  ----------------------------------------  |
|  [Read Full Post] button                   |  <- Fixed
+--------------------------------------------+
```

### Technical Details

- The `DialogContent` already has `p-0` and `max-w-2xl` which is correct
- Add `rounded-lg` to the image wrapper and use `overflow-hidden rounded-t-lg` for the top image
- Wrap only the `dangerouslySetInnerHTML` content div in a scrollable container with `max-h-[40vh] overflow-y-auto` (already partially done, just needs refinement)
- Keep the metadata section and button outside the scroll container so they stay fixed
- Add consistent padding (`p-6 sm:p-8`) matching the portfolio dialog
- The image gets rounded top corners via `rounded-t-lg` on the container, matching the dialog's overall `rounded-lg`
