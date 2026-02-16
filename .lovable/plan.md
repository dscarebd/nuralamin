

# Instant Telegram Notifications for Contact Requests

## Overview
Two types of Telegram notifications will be sent to the admin:

1. **Submitted Request** -- When a visitor completes and submits the form, admin gets a Telegram message with all details.
2. **Abandoned Form ("Not Requested")** -- When a visitor fills in some info but closes the form without submitting, admin still gets a Telegram message with whatever was filled in, marked with a "Not Requested" warning.

## Setup Required From You

You need to create a Telegram bot and provide two pieces of information:

1. **Telegram Bot Token** -- Open Telegram, search for [@BotFather](https://t.me/BotFather), send `/newbot`, follow the steps, and copy the token it gives you (looks like `123456:ABC-DEF...`).
2. **Your Telegram Chat ID** -- Open Telegram, search for [@userinfobot](https://t.me/userinfobot), start a chat with it, and it will reply with your numeric ID.

I will securely store both so they are never exposed in your code.

## How Abandoned Form Detection Works

- When the user closes the dialog (clicks X, clicks outside, or presses Escape) **without submitting**, the system checks if any fields were filled in.
- If at least one field has content, a "Not Requested" notification is sent to Telegram with whatever info was entered.
- If the form is completely empty, no notification is sent (they just opened and closed it).

## Technical Details

### 1. Secrets to Store
- `TELEGRAM_BOT_TOKEN` -- Bot API token from BotFather
- `TELEGRAM_CHAT_ID` -- Your numeric Telegram chat ID

### 2. New Backend Function: `notify-telegram`
- Accepts: name, contact_id, project_details, project_links, plan_name, budget, and a `status` field ("submitted" or "not_requested")
- Formats a clean message with all available details
- Adds a clear label at the top:
  - Submitted: "New Contact Request!"
  - Not Requested: "Abandoned Form (Not Requested)"
- Sends via Telegram Bot API (`sendMessage` endpoint)
- JWT verification disabled (called from public pricing page)

### 3. Pricing Page Changes (`src/pages/Pricing.tsx`)
- **On successful submit**: Call `notify-telegram` with status "submitted" (non-blocking, runs in background)
- **On dialog close without submit**: Check if any form fields have content. If yes, call `notify-telegram` with status "not_requested" and whatever partial data was entered. Use the dialog's `onOpenChange` handler to detect closure.
- Add a `hasSubmitted` ref to distinguish between closing after submit vs. abandoning.

### 4. Config Update (`supabase/config.toml`)
- Add `[functions.notify-telegram]` with `verify_jwt = false`

### 5. Message Format Examples

**Submitted:**
```
New Contact Request!

Name: John Doe
Contact: @johndoe
Plan: Project Based
Budget: $500

Project Details:
I need an e-commerce website...

Links: https://example.com
```

**Abandoned (Not Requested):**
```
Abandoned Form (Not Requested)

Plan: Project Based
Name: John
Contact: (not provided)
Budget: (not provided)

Project Details:
I need a...
```

