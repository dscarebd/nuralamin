

## Portfolio Popup: Image Carousel/Slider

Replace the current thumbnail-button gallery in the portfolio dialog with a proper image carousel/slider using the existing Embla Carousel component.

### What Changes

**`src/pages/Portfolio.tsx`** - Dialog image section (lines 133-155)

Currently the dialog shows a single main image with small thumbnail buttons below. This will be replaced with:

1. A full-width carousel that includes the main project image + all gallery images as slides
2. Left/right arrow navigation buttons overlaid on the image area
3. Dot indicators at the bottom of the carousel showing the current slide
4. The thumbnail row is removed entirely -- navigation happens via arrows and dots

### Implementation Details

- Import `Carousel`, `CarouselContent`, `CarouselItem`, `CarouselPrevious`, `CarouselNext` from the existing `@/components/ui/carousel`
- Build an `allImages` array: `[mainImage, ...galleryImages]`
- If only one image exists (no gallery), show it as a plain image (no carousel controls)
- If multiple images exist, wrap them in the Carousel component with:
  - `CarouselPrevious` and `CarouselNext` repositioned inside the image area (not outside) using custom classes like `left-2 top-1/2` and `right-2 top-1/2`
  - Semi-transparent background on arrows for visibility over images
  - Optional: dot indicators below the carousel showing which slide is active
- Remove the `activeImage` state since the carousel handles its own slide tracking
- Each slide shows an `aspect-video` image, same as the current main image

### UI Result

The dialog will look like the reference screenshot: a large image area with left/right arrows to slide between the main image and gallery images, followed by the project title, description, details, and "View Project" button below.

