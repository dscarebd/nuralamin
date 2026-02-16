

# Contact Request System for Pricing Page

## Overview
When visitors click "Get Started" on any pricing plan, a popup form will collect their details. After submission, the data is saved to the database (visible in admin panel), and a thank-you popup appears with a "Contact on Telegram" button that opens Telegram with all submitted details pre-filled.

## How It Works

1. **User clicks "Get Started"** on any pricing plan
2. **A popup form appears** asking for:
   - Name (required)
   - WhatsApp or Telegram ID (required)
   - Project details (required)
   - Project links (optional)
   - The selected plan name is auto-attached
3. **User submits** -- data is saved to the database
4. **Thank you popup appears** with:
   - A success message
   - A "Contact on Telegram" button
5. **Clicking the Telegram button** opens `https://t.me/nuralamin_official` with a pre-filled message containing all the submitted info (name, contact, project details, links, selected plan)

## Admin Panel
- New "Requests" section in the admin sidebar (with an Inbox icon)
- Shows a list of all contact requests with name, contact info, plan, date, and project details
- Admin can view full details and delete entries

## Technical Details

### 1. Database -- New `contact_requests` table
- `id` (uuid, primary key)
- `name` (text, not null)
- `contact_id` (text, not null) -- WhatsApp/Telegram ID
- `project_details` (text, not null)
- `project_links` (text, nullable)
- `plan_name` (text, not null) -- which plan they clicked
- `created_at` (timestamp)

RLS policies:
- Public can INSERT (anyone can submit)
- Public can SELECT with no restriction (so the form can confirm) -- or restrict to admin only
- Admins can SELECT and DELETE

### 2. Pricing Page Changes (`src/pages/Pricing.tsx`)
- Replace direct Telegram link on "Get Started" buttons with dialog trigger
- Add a contact form dialog component with validation (using zod + react-hook-form)
- Add a thank-you dialog that appears after successful submission
- The Telegram button constructs a URL like:
  ```
  https://t.me/nuralamin_official?text=Hi, I'm [Name]...
  ```
  with all form details URL-encoded

### 3. New Admin Page (`src/pages/admin/RequestsEditor.tsx`)
- Table/list view of all contact requests
- Shows name, contact, plan, date
- Expandable details view
- Delete button for cleanup

### 4. Admin Sidebar Update (`src/components/admin/AdminSidebar.tsx`)
- Add "Requests" nav item with Inbox icon pointing to `/admin/requests`

### 5. Router Update (`src/App.tsx`)
- Add route for `/admin/requests`

