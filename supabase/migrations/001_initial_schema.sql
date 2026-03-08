-- ============================================
-- 001_initial_schema.sql
-- Full schema, RLS, storage, and seed data
-- ============================================

-- ======================
-- TRIGGER FUNCTION
-- ======================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ======================
-- SLUG GENERATION
-- ======================
CREATE OR REPLACE FUNCTION generate_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := LOWER(REGEXP_REPLACE(REGEXP_REPLACE(NEW.title, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ======================
-- TABLES
-- ======================

-- Portfolio Items
CREATE TABLE portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL DEFAULT '',
  description TEXT,
  category TEXT NOT NULL DEFAULT 'bridal',
  cover_image_url TEXT,
  images TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER portfolio_items_updated_at
  BEFORE UPDATE ON portfolio_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER portfolio_items_generate_slug
  BEFORE INSERT ON portfolio_items
  FOR EACH ROW EXECUTE FUNCTION generate_slug();

-- Services
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  price_note TEXT,
  duration TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Testimonials
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  content TEXT NOT NULL,
  service_type TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Inquiries
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service_interest TEXT,
  preferred_date DATE,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER inquiries_updated_at
  BEFORE UPDATE ON inquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Site Settings
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  type TEXT DEFAULT 'text' CHECK (type IN ('text', 'rich_text', 'image', 'json')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ======================
-- ROW LEVEL SECURITY
-- ======================

-- Portfolio Items
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published portfolio items"
  ON portfolio_items FOR SELECT
  USING (is_published = true);

CREATE POLICY "Authenticated users have full access to portfolio items"
  ON portfolio_items FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Services
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active services"
  ON services FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users have full access to services"
  ON services FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Testimonials
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published testimonials"
  ON testimonials FOR SELECT
  USING (is_published = true);

CREATE POLICY "Authenticated users have full access to testimonials"
  ON testimonials FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Inquiries
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert inquiries"
  ON inquiries FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users have full access to inquiries"
  ON inquiries FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Site Settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view site settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users have full access to site settings"
  ON site_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ======================
-- STORAGE
-- ======================

INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view media"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'media');

CREATE POLICY "Authenticated users can upload media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'media');

CREATE POLICY "Authenticated users can update media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'media');

CREATE POLICY "Authenticated users can delete media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'media');

-- ======================
-- SEED DATA
-- ======================

-- Site Settings
INSERT INTO site_settings (key, value, type) VALUES
  ('hero_title', 'Artistry That Enhances Your Natural Beauty', 'text'),
  ('hero_subtitle', 'Professional makeup artist specializing in bridal, editorial, and special occasion looks', 'text'),
  ('hero_image', NULL, 'image'),
  ('about_title', 'About Me', 'text'),
  ('about_bio', 'With over 10 years of experience in the beauty industry, I specialize in creating stunning, personalized looks for every occasion. From elegant bridal makeup to high-fashion editorial shoots, I bring passion, precision, and artistry to every client interaction.', 'rich_text'),
  ('about_image', NULL, 'image'),
  ('contact_email', 'hello@example.com', 'text'),
  ('contact_phone', '(555) 123-4567', 'text'),
  ('contact_location', 'Los Angeles, CA', 'text'),
  ('social_instagram', 'https://instagram.com', 'text'),
  ('social_facebook', 'https://facebook.com', 'text'),
  ('social_tiktok', 'https://tiktok.com', 'text'),
  ('footer_text', '© 2025 Makeup Artist. All rights reserved.', 'text');

-- Services
INSERT INTO services (name, description, price, price_note, duration, category, display_order, is_active) VALUES
  ('Bridal Makeup', 'Full glam bridal look including trial session, day-of application, and touch-up kit. Designed to photograph beautifully and last all day.', 350.00, 'Includes trial session', '2-3 hours', 'bridal', 1, true),
  ('Bridal Party Makeup', 'Beautiful, coordinated looks for bridesmaids, mother of the bride/groom, and other members of the bridal party.', 120.00, 'Per person', '45 minutes', 'bridal', 2, true),
  ('Editorial & Photo Shoot', 'High-fashion and creative makeup for magazine editorials, lookbooks, and professional photo shoots.', 250.00, 'Half day rate', '1-2 hours', 'editorial', 3, true),
  ('Special Occasion', 'Glamorous makeup for galas, proms, anniversaries, birthdays, and other special events.', 150.00, NULL, '1 hour', 'special', 4, true),
  ('Makeup Lesson', 'One-on-one personalized makeup lesson tailored to your skill level, face shape, and lifestyle needs.', 200.00, 'Includes product list', '1.5 hours', 'education', 5, true);

-- Testimonials
INSERT INTO testimonials (client_name, content, service_type, rating, is_featured, is_published) VALUES
  ('Sarah M.', 'She made me feel like the most beautiful version of myself on my wedding day. The makeup lasted through tears, dancing, and the entire celebration. I could not have asked for a more talented and kind artist!', 'Bridal Makeup', 5, true, true),
  ('Jessica L.', 'Absolutely stunning work for our magazine shoot. She understood the creative direction immediately and brought looks to life that exceeded our expectations. A true professional.', 'Editorial', 5, true, true),
  ('Amanda R.', 'I booked her for my 30th birthday gala and received compliments all night long. She listened to exactly what I wanted and delivered perfection. Will be booking again for every special occasion!', 'Special Occasion', 5, true, true);

-- Portfolio Items
INSERT INTO portfolio_items (title, slug, description, category, cover_image_url, images, is_featured, display_order, is_published) VALUES
  ('Romantic Garden Wedding', 'romantic-garden-wedding', 'A soft, romantic bridal look with dewy skin, rose-toned lips, and fluttery lashes — perfect for this gorgeous outdoor garden ceremony.', 'bridal', NULL, '{}', true, 1, true),
  ('Editorial Beauty for Vogue', 'editorial-beauty-for-vogue', 'Bold, high-fashion editorial look featuring graphic liner, sculpted cheekbones, and a statement red lip for a Vogue-inspired photo shoot.', 'editorial', NULL, '{}', true, 2, true),
  ('Sunset Gala Glam', 'sunset-gala-glam', 'A glamorous evening look with smoky eyes, luminous skin, and a nude lip — designed to shine under the golden hour light at an exclusive rooftop gala.', 'special', NULL, '{}', true, 3, true);
