-- 0000_initial_schema.sql

-- 1. Extensions
-- No new extensions needed for this schema.

-- 2. Enums
CREATE TYPE public.media_type AS ENUM ('image', 'video');
CREATE TYPE public.user_role AS ENUM ('staff', 'owner');

-- 3. Tables

-- Profiles table to store user roles
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role public.user_role NOT NULL DEFAULT 'staff'
);
COMMENT ON TABLE public.profiles IS 'Stores user-specific data like roles.';

-- Categories table
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    sort_order INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.categories IS 'Stores product categories.';

-- Products table
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    price_ttd NUMERIC(10, 2) NOT NULL,
    category_id UUID NOT NULL REFERENCES public.categories(id),
    tags TEXT[],
    colors TEXT[],
    sizes TEXT[],
    featured BOOLEAN NOT NULL DEFAULT false,
    is_new BOOLEAN NOT NULL DEFAULT true,
    on_sale BOOLEAN NOT NULL DEFAULT false,
    in_stock BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.products IS 'Stores individual product details.';
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_featured ON public.products(featured);

-- Product Media table
CREATE TABLE public.product_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    type public.media_type NOT NULL,
    url TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.product_media IS 'Stores image and video URLs for products.';
CREATE INDEX idx_product_media_product_id ON public.product_media(product_id);

-- Inquiries table (from contact form)
CREATE TABLE public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    contact TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.inquiries IS 'Stores messages submitted through the contact form.';

-- Site Settings table (singleton)
CREATE TABLE public.site_settings (
    id INT PRIMARY KEY DEFAULT 1,
    site_name TEXT NOT NULL DEFAULT 'Exclusive Fashions Ltd',
    tagline TEXT NOT NULL DEFAULT 'Your one-stop shop for trendy footwear, bags, and accessories.',
    location_1_name TEXT NOT NULL DEFAULT 'High Street Branch',
    location_1_address TEXT NOT NULL DEFAULT '116–118 High Street, San Fernando, Trinidad',
    location_1_gmaps_url TEXT NOT NULL DEFAULT 'https://maps.google.com',
    location_2_name TEXT NOT NULL DEFAULT 'Carlton Centre Branch',
    location_2_address TEXT NOT NULL DEFAULT 'Carlton Centre, 61 St. James Street, San Fernando, Trinidad',
    location_2_gmaps_url TEXT NOT NULL DEFAULT 'https://maps.google.com',
    phone_number TEXT NOT NULL DEFAULT '1-868-123-4567',
    whatsapp_number TEXT NOT NULL DEFAULT '18681234567',
    instagram_handle TEXT NOT NULL DEFAULT 'exclusive_fashion_ltd_',
    opening_hours TEXT NOT NULL DEFAULT 'Mon - Sat: 9am - 5pm',
    announcement_banner TEXT,
    payments_enabled BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT singleton_check CHECK (id = 1)
);
COMMENT ON TABLE public.site_settings IS 'Stores global site configuration as a single row.';

-- 4. Helper Functions and Triggers

-- Function to create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (new.id, 'staff');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to get a user's role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS public.user_role AS $$
DECLARE
  user_role public.user_role;
BEGIN
  SELECT role INTO user_role FROM public.profiles WHERE id = user_id;
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 5. Row Level Security (RLS)

-- Enable RLS for all relevant tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for `profiles`
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (get_user_role(auth.uid()) IN ('staff', 'owner'));
CREATE POLICY "Owners can update any profile role" ON public.profiles
  FOR UPDATE USING (get_user_role(auth.uid()) = 'owner') WITH CHECK (get_user_role(auth.uid()) = 'owner');

-- RLS Policies for `categories`, `products`, `product_media`
-- Public read access
CREATE POLICY "Public can read all categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public can read all products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public can read all product media" ON public.product_media FOR SELECT USING (true);
-- Admin write access
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL
  USING (get_user_role(auth.uid()) IN ('staff', 'owner'));
CREATE POLICY "Admins can manage products" ON public.products FOR ALL
  USING (get_user_role(auth.uid()) IN ('staff', 'owner'));
CREATE POLICY "Admins can manage product media" ON public.product_media FOR ALL
  USING (get_user_role(auth.uid()) IN ('staff', 'owner'));

-- RLS Policies for `inquiries`
CREATE POLICY "Anyone can submit an inquiry" ON public.inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all inquiries" ON public.inquiries FOR SELECT
  USING (get_user_role(auth.uid()) IN ('staff', 'owner'));
CREATE POLICY "Admins can delete inquiries" ON public.inquiries FOR DELETE
  USING (get_user_role(auth.uid()) IN ('staff', 'owner'));

-- RLS Policies for `site_settings`
CREATE POLICY "Public can read site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Owners can update site settings" ON public.site_settings FOR UPDATE
  USING (get_user_role(auth.uid()) = 'owner');

-- 6. Seed Data

-- Insert default site settings
INSERT INTO public.site_settings (id) VALUES (1);

-- Insert categories
INSERT INTO public.categories (name, slug, sort_order) VALUES
('Heels', 'heels', 1),
('Sandals', 'sandals', 2),
('Sneakers', 'sneakers', 3),
('Bags', 'bags', 4),
('Accessories', 'accessories', 5);

-- Note: Seed data for products is extensive and will be handled by the application logic
-- or a separate seeding script to keep this schema file clean.
-- The user can add products via the admin panel.
