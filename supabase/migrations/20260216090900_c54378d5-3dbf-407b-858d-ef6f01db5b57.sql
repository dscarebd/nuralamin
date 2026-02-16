
-- Create storage bucket for uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true);

-- Allow public read access
CREATE POLICY "Public can view uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'uploads');

-- Allow authenticated admins to upload
CREATE POLICY "Admins can upload files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'uploads' AND has_role(auth.uid(), 'admin'::app_role));

-- Allow authenticated admins to update
CREATE POLICY "Admins can update files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'uploads' AND has_role(auth.uid(), 'admin'::app_role));

-- Allow authenticated admins to delete
CREATE POLICY "Admins can delete files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'uploads' AND has_role(auth.uid(), 'admin'::app_role));
