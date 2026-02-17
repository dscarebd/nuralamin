
-- Create page_views table to track visitor analytics
CREATE TABLE public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  visitor_id text NOT NULL,
  user_agent text,
  referrer text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert page views (public tracking)
CREATE POLICY "Anyone can insert page_views"
ON public.page_views
FOR INSERT
WITH CHECK (true);

-- Only admins can read page views
CREATE POLICY "Admins can read page_views"
ON public.page_views
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete page views
CREATE POLICY "Admins can delete page_views"
ON public.page_views
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Index for fast querying by date and page
CREATE INDEX idx_page_views_created_at ON public.page_views (created_at DESC);
CREATE INDEX idx_page_views_page_path ON public.page_views (page_path);
CREATE INDEX idx_page_views_visitor_id ON public.page_views (visitor_id);
