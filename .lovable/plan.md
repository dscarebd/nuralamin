

## Add Work Progress Status to Contact Requests

### Overview
Add a status tracking system to contact requests so you can mark each request as Approved, Rejected, Working, or Delivered -- giving you a clear view of work progress right from the admin panel.

### What You'll See
- A new "Status" column in the requests table showing color-coded badges (e.g., green for Approved, red for Rejected, blue for Working, purple for Delivered)
- A dropdown in each row to quickly change the status
- The detail dialog will also show the current status
- Filter tabs at the top to view requests by status (All, Pending, Approved, Working, Delivered, Rejected)

### Technical Details

**1. Database Migration**
- Add a `status` column to the `contact_requests` table with a default value of `'pending'`
- Type: `text` with allowed values: `pending`, `approved`, `rejected`, `working`, `delivered`

```sql
ALTER TABLE public.contact_requests
ADD COLUMN status text NOT NULL DEFAULT 'pending';
```

**2. Update `src/pages/admin/RequestsEditor.tsx`**
- Add the `status` field to the `ContactRequest` interface
- Add filter tabs (All / Pending / Approved / Working / Delivered / Rejected) above the table
- Add a "Status" column to the table showing a color-coded Badge component
- Add a Select dropdown in the Actions column (or inline) to change status
- Create a mutation to update the status in the database
- Show the status badge in the detail dialog as well

**3. Status Badge Colors**
| Status | Color |
|---|---|
| Pending | Gray/muted |
| Approved | Green |
| Rejected | Red |
| Working | Blue |
| Delivered | Purple |

**4. Files Modified**
- `src/pages/admin/RequestsEditor.tsx` -- main changes (filter tabs, status column, dropdown, detail view)
- One database migration for the new column

