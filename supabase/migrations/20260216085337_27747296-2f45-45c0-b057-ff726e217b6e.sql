
-- Fix RESTRICTIVE policies by dropping and recreating as PERMISSIVE

-- experiences
DROP POLICY "Public can read experiences" ON public.experiences;
DROP POLICY "Admins can manage experiences" ON public.experiences;
CREATE POLICY "Public can read experiences" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Admins can manage experiences" ON public.experiences FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- pricing_plans
DROP POLICY "Public can read pricing_plans" ON public.pricing_plans;
DROP POLICY "Admins can manage pricing_plans" ON public.pricing_plans;
CREATE POLICY "Public can read pricing_plans" ON public.pricing_plans FOR SELECT USING (true);
CREATE POLICY "Admins can manage pricing_plans" ON public.pricing_plans FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- profile
DROP POLICY "Public can read profile" ON public.profile;
DROP POLICY "Admins can insert profile" ON public.profile;
DROP POLICY "Admins can update profile" ON public.profile;
DROP POLICY "Admins can delete profile" ON public.profile;
CREATE POLICY "Public can read profile" ON public.profile FOR SELECT USING (true);
CREATE POLICY "Admins can insert profile" ON public.profile FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update profile" ON public.profile FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete profile" ON public.profile FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- projects
DROP POLICY "Public can read projects" ON public.projects;
DROP POLICY "Admins can manage projects" ON public.projects;
CREATE POLICY "Public can read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Admins can manage projects" ON public.projects FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- site_settings
DROP POLICY "Public can read site_settings" ON public.site_settings;
DROP POLICY "Admins can manage site_settings" ON public.site_settings;
CREATE POLICY "Public can read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage site_settings" ON public.site_settings FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- social_links
DROP POLICY "Public can read social_links" ON public.social_links;
DROP POLICY "Admins can manage social_links" ON public.social_links;
CREATE POLICY "Public can read social_links" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "Admins can manage social_links" ON public.social_links FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- user_roles (also fix)
DROP POLICY "Admins can view roles" ON public.user_roles;
CREATE POLICY "Admins can view roles" ON public.user_roles FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
