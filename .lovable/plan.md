
## Reduce Bottom Gap in Sidebar Card

The sidebar card currently has `pb-4` bottom padding, which leaves visible empty space below the "View My Portfolio" button (especially after removing the phone number). 

### Change
- In `src/components/ProfileSidebar.tsx`, reduce the bottom padding from `pb-4` to `pb-2` on the `<aside>` element.

### Technical Detail
Change the class on line 77 from:
`px-8 pt-8 pb-4` to `px-8 pt-8 pb-2`
