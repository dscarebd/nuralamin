
-- Drop and recreate ALL policies as PERMISSIVE

-- experiences
DROP POLICY IF EXISTS "Public can read experiences" ON public.experiences;
DROP POLICY IF EXISTS "Admins can manage experiences" ON public.experiences;
CREATE POLICY "Public can read experiences" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Admins can manage experiences" ON public.experiences FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- pricing_plans
DROP POLICY IF EXISTS "Public can read pricing_plans" ON public.pricing_plans;
DROP POLICY IF EXISTS "Admins can manage pricing_plans" ON public.pricing_plans;
CREATE POLICY "Public can read pricing_plans" ON public.pricing_plans FOR SELECT USING (true);
CREATE POLICY "Admins can manage pricing_plans" ON public.pricing_plans FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- profile
DROP POLICY IF EXISTS "Public can read profile" ON public.profile;
DROP POLICY IF EXISTS "Admins can insert profile" ON public.profile;
DROP POLICY IF EXISTS "Admins can update profile" ON public.profile;
DROP POLICY IF EXISTS "Admins can delete profile" ON public.profile;
CREATE POLICY "Public can read profile" ON public.profile FOR SELECT USING (true);
CREATE POLICY "Admins can insert profile" ON public.profile FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update profile" ON public.profile FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete profile" ON public.profile FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- projects
DROP POLICY IF EXISTS "Public can read projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can manage projects" ON public.projects;
CREATE POLICY "Public can read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Admins can manage projects" ON public.projects FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- site_settings
DROP POLICY IF EXISTS "Public can read site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can manage site_settings" ON public.site_settings;
CREATE POLICY "Public can read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage site_settings" ON public.site_settings FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- social_links
DROP POLICY IF EXISTS "Public can read social_links" ON public.social_links;
DROP POLICY IF EXISTS "Admins can manage social_links" ON public.social_links;
CREATE POLICY "Public can read social_links" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "Admins can manage social_links" ON public.social_links FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- user_roles
DROP POLICY IF EXISTS "Admins can view roles" ON public.user_roles;
CREATE POLICY "Admins can view roles" ON public.user_roles FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
