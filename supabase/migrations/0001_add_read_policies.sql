-- 0001_add_read_policies.sql

-- Allow public read access to site_settings
CREATE POLICY "Allow public read access to site settings"
ON public.site_settings
FOR SELECT
USING (true);

-- Allow public read access to products
CREATE POLICY "Allow public read access to products"
ON public.products
FOR SELECT
USING (true);

-- Allow public read access to product_media
CREATE POLICY "Allow public read access to product media"
ON public.product_media
FOR SELECT
USING (true);

-- Allow public read access to categories
CREATE POLICY "Allow public read access to categories"
ON public.categories
FOR SELECT
USING (true);
