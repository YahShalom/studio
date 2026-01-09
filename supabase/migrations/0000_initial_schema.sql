-- Initial Schema for Exclusive Fashions Ltd

-- 1. Extensions
create extension if not exists "uuid-ossp" with schema "extensions";

-- 2. Enums
create type "public"."media_type" as enum ('image', 'video');
create type "public"."user_role" as enum ('staff', 'owner');


-- 3. Tables
create table "public"."categories" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone not null default now(),
    "name" text not null,
    "slug" text not null,
    "sort_order" smallint
);
alter table "public"."categories" enable row level security;
CREATE UNIQUE INDEX categories_pkey ON public.categories USING btree (id);
CREATE UNIQUE INDEX categories_slug_key ON public.categories USING btree (slug);
alter table "public"."categories" add constraint "categories_pkey" PRIMARY KEY using index "categories_pkey";
alter table "public"."categories" add constraint "categories_slug_key" UNIQUE using index "categories_slug_key";


create table "public"."inquiries" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone not null default now(),
    "name" text not null,
    "contact" text not null,
    "message" text not null
);
alter table "public"."inquiries" enable row level security;
CREATE UNIQUE INDEX inquiries_pkey ON public.inquiries USING btree (id);
alter table "public"."inquiries" add constraint "inquiries_pkey" PRIMARY KEY using index "inquiries_pkey";


create table "public"."product_media" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone not null default now(),
    "product_id" uuid not null,
    "type" public.media_type not null,
    "url" text not null,
    "sort_order" smallint not null default '0'::smallint
);
alter table "public"."product_media" enable row level security;
CREATE UNIQUE INDEX product_media_pkey ON public.product_media USING btree (id);
alter table "public"."product_media" add constraint "product_media_pkey" PRIMARY KEY using index "product_media_pkey";
alter table "public"."product_media" add constraint "product_media_product_id_fkey" FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;
alter table "public"."product_media" validate constraint "product_media_product_id_fkey";


create table "public"."products" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone not null default now(),
    "name" text not null,
    "slug" text not null,
    "description" text,
    "price_ttd" numeric not null,
    "category_id" uuid not null,
    "is_new" boolean not null default false,
    "on_sale" boolean not null default false,
    "in_stock" boolean not null default true,
    "featured" boolean not null default false,
    "tags" text[],
    "sizes" text[],
    "colors" text[]
);
alter table "public"."products" enable row level security;
CREATE UNIQUE INDEX products_pkey ON public.products USING btree (id);
CREATE UNIQUE INDEX products_slug_key ON public.products USING btree (slug);
alter table "public"."products" add constraint "products_pkey" PRIMARY KEY using index "products_pkey";
alter table "public"."products" add constraint "products_slug_key" UNIQUE using index "products_slug_key";
alter table "public"."products" add constraint "products_category_id_fkey" FOREIGN KEY (category_id) REFERENCES categories(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;
alter table "public"."products" validate constraint "products_category_id_fkey";


create table "public"."profiles" (
    "id" uuid not null,
    "role" text not null default 'staff'::text
);
alter table "public"."profiles" enable row level security;
CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);
alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";
alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;
alter table "public"."profiles" validate constraint "profiles_id_fkey";


create table "public"."site_settings" (
    "id" integer not null,
    "site_name" text not null default 'Exclusive Fashions Ltd'::text,
    "tagline" text not null default 'Your one-stop shop for trendy footwear, bags, and accessories.'::text,
    "location_1_name" text not null default 'High Street Branch'::text,
    "location_1_address" text not null default '116–118 High Street, San Fernando, Trinidad'::text,
    "location_1_gmaps_url" text not null default 'https://maps.google.com'::text,
    "location_2_name" text not null default 'Carlton Centre Branch'::text,
    "location_2_address" text not null default 'Carlton Centre, 61 St. James Street, San Fernando, Trinidad'::text,
    "location_2_gmaps_url" text not null default 'https://maps.google.com'::text,
    "phone_number" text not null default '1-868-123-4567'::text,
    "whatsapp_number" text not null default '18681234567'::text,
    "instagram_handle" text not null default 'exclusive_fashion_ltd_'::text,
    "opening_hours" text not null default 'Mon - Sat: 9am - 5pm'::text,
    "announcement_banner" text,
    "payments_enabled" boolean not null default false
);
alter table "public"."site_settings" enable row level security;
CREATE UNIQUE INDEX site_settings_pkey ON public.site_settings USING btree (id);
alter table "public"."site_settings" add constraint "site_settings_pkey" PRIMARY KEY using index "site_settings_pkey";
alter table "public"."site_settings" add constraint "site_settings_id_check" CHECK ((id = 1)) not valid;
alter table "public"."site_settings" validate constraint "site_settings_id_check";

-- Insert initial settings
insert into public.site_settings (id) values (1);


-- 4. Functions
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

create or replace function public.get_user_role(user_id uuid)
returns text
language plpgsql
as $$
declare
  user_role text;
begin
  select role into user_role from public.profiles where id = user_id;
  return user_role;
end;
$$;


-- 5. Triggers
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 6. RLS Policies
-- PROFILES
create policy "Allow individual read access" on public.profiles for select using (auth.uid() = id);
create policy "Allow individual update access" on public.profiles for update using (auth.uid() = id);
create policy "Allow owner full access" on public.profiles for all using ((get_user_role(auth.uid()) = 'owner'::text));

-- CATEGORIES
create policy "Allow public read access" on public.categories for select using (true);
create policy "Allow owner full access" on public.categories for all using ((get_user_role(auth.uid()) = 'owner'::text));

-- PRODUCTS
create policy "Allow public read access" on public.products for select using (true);
create policy "Allow owner full access" on public.products for all using ((get_user_role(auth.uid()) = 'owner'::text));

-- PRODUCT MEDIA
create policy "Allow public read access" on public.product_media for select using (true);
create policy "Allow owner full access" on public.product_media for all using ((get_user_role(auth.uid()) = 'owner'::text));

-- INQUIRIES
create policy "Allow all to insert" on public.inquiries for insert with check (true);
create policy "Allow owner full access" on public.inquiries for all using ((get_user_role(auth.uid()) = 'owner'::text));

-- SITE SETTINGS
create policy "Allow public read access" on public.site_settings for select using (true);
create policy "Allow owner full access" on public.site_settings for all using ((get_user_role(auth.uid()) = 'owner'::text));
