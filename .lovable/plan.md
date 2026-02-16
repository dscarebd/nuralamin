

## Fix Header Width to Match Portfolio Content

**Problem**: The header card appears wider than the portfolio page content because the header wrapper has no horizontal padding, while the portfolio page has `px-4 md:px-8` padding. Both use `max-w-5xl`, but the portfolio content is inset by its padding, making it narrower.

**Solution**: Add matching horizontal padding (`px-4 md:px-8`) back to the header's outer wrapper div so the header card aligns exactly with the content below.

### Changes

**File: `src/components/FloatingHeader.tsx`** (line 26)
- Change: `<div className="sticky top-0 z-50 w-full pt-3">`
- To: `<div className="sticky top-0 z-50 w-full px-4 pt-3 md:px-8">`

This restores the horizontal padding that was removed in the previous edit, ensuring the header and page content share the same effective width.
