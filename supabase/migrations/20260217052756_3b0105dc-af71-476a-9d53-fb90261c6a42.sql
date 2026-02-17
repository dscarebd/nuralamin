
ALTER TABLE public.blog_posts ADD COLUMN gallery_images text[] DEFAULT '{}';
ALTER TABLE public.projects ADD COLUMN gallery_images text[] DEFAULT '{}';
