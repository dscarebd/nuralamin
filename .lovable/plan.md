

## Multi-Image Upload for Blog and Portfolio

Add the ability for admins to upload multiple images per blog post and portfolio project, with a gallery displayed in the popup dialogs.

### Database Changes

Add a `gallery_images` column (text array, nullable) to both tables:
- `blog_posts.gallery_images` -- text[] DEFAULT '{}'
- `projects.gallery_images` -- text[] DEFAULT '{}'

### New Component: MultiImageUpload

Create `src/components/admin/MultiImageUpload.tsx`:
- Accepts `value: string[]` and `onChange: (urls: string[]) => void`
- Shows a grid of uploaded image thumbnails with individual remove (X) buttons
- An "Add Image" button that triggers file upload (reuses the same upload logic as ImageUpload)
- Supports both file upload and pasting a URL
- Uses the existing `uploads` storage bucket with the specified folder

### Admin Editor Changes

**BlogEditor.tsx:**
- Add `gallery_images: string[]` to `BlogPostForm`
- Add `<MultiImageUpload>` below the cover image field, labeled "Gallery Images"
- Save/load the array to/from the database

**ProjectsEditor.tsx:**
- Add `gallery_images: string[]` to `ProjectForm`
- Add `<MultiImageUpload>` below the existing single image field, labeled "Gallery Images"
- Save/load the array to/from the database

### Public Dialog Changes

**Portfolio.tsx** (project dialog):
- After the main project image, if `gallery_images` has items, show a horizontal scrollable row of thumbnails
- Clicking a thumbnail swaps the main displayed image

**Blog.tsx** (blog post dialog):
- After the cover image inside the scrollable area, show the gallery images as a grid (2 columns)
- Each image is clickable to view larger (or just displayed inline)

### Technical Details

- Migration: single SQL adding both columns
- MultiImageUpload component: grid layout, upload to `uploads` bucket, drag-and-drop not required (simple click-to-add)
- Gallery display: simple horizontal scroll in portfolio, vertical grid in blog
- No changes to the standalone BlogPost page (it can also show gallery if desired)
