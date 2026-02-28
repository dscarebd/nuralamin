
# AI-Powered Blog Post Generator for Projects

## Summary

Add an "AI Generate Blog" feature to the admin Blog Editor that creates complete, SEO-optimized blog posts for each of your 6 portfolio projects. Uses Lovable AI (Gemini) to generate professional content including title, excerpt, tags, and full HTML blog content.

## How It Works

1. Admin clicks "Generate from Project" button in the Blog Editor
2. A dialog shows all 6 projects to pick from
3. On selection, AI generates a complete blog post with:
   - Catchy title (e.g., "Building Quran Insight: An AI-Powered Islamic Learning Platform")
   - SEO excerpt (2-3 sentences)
   - Full rich HTML content (~800-1200 words) covering features, tech stack, challenges, and impact
   - Relevant tags auto-generated
4. The generated post is inserted as a draft -- you can review, edit, and publish

## Changes

### 1. New Edge Function: `supabase/functions/generate-blog/index.ts`

- Accepts project data (title, description, tech, link, category)
- Calls Lovable AI Gateway with a detailed system prompt to write a professional project showcase blog post
- Returns structured output: title, slug, excerpt, content (HTML), and tags
- Uses `google/gemini-3-flash-preview` for fast, quality generation
- Handles rate limits (429) and payment errors (402) gracefully

### 2. Update: `src/pages/admin/BlogEditor.tsx`

- Add a "Generate from Project" button next to the existing "New Post" button
- Opens a dialog listing all 6 projects from the database
- On project selection, calls the edge function and creates a new draft blog post with AI-generated content
- Shows a loading state during generation
- The post opens in edit mode so you can review and tweak before publishing

### 3. Update: `supabase/config.toml`

- Register the new `generate-blog` edge function with `verify_jwt = false`

## What the AI Will Generate

For each project, the blog post will include:
- An engaging introduction about the project's purpose
- Key features breakdown
- Technology stack discussion
- Development challenges and solutions
- Impact and future plans
- A call-to-action linking to the live project

## Technical Notes

- Uses the pre-configured `LOVABLE_API_KEY` (no new API keys needed)
- Content is generated as clean HTML compatible with the existing RichTextEditor
- Posts are created as drafts so you have full control before publishing
- The cover image defaults to the project's existing image
- You can regenerate or manually edit any part after generation
