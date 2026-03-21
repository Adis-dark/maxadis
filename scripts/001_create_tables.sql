-- Max_Adis Database Schema
-- Tables for products, courses, orders, and messages

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('cartes', 'capteurs', 'moteurs', 'composants', 'kits', 'outils')),
  price INTEGER NOT NULL,
  tag TEXT,
  status TEXT DEFAULT 'stock' CHECK (status IN ('stock', 'rupture', 'precommande')),
  badge TEXT,
  description TEXT,
  images TEXT[],
  specs JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses (formations) table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tag TEXT,
  price TEXT,
  level TEXT DEFAULT 'Debutant' CHECK (level IN ('Debutant', 'Intermediaire', 'Avance')),
  duration TEXT,
  modules TEXT,
  summary TEXT,
  link TEXT,
  bg_class TEXT DEFAULT 'bg-gradient-to-br from-red-500 to-orange-600',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders (commandes) table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  telephone TEXT NOT NULL,
  ville TEXT,
  mode TEXT CHECK (mode IN ('Livraison', 'Retrait')),
  produits TEXT NOT NULL,
  total TEXT NOT NULL,
  statut TEXT DEFAULT 'Recue' CHECK (statut IN ('Recue', 'En preparation', 'En livraison', 'Livree', 'Annulee')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages (contact) table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Products policies: public read, authenticated write
CREATE POLICY "products_select_all" ON products FOR SELECT USING (true);
CREATE POLICY "products_insert_auth" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "products_update_auth" ON products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "products_delete_auth" ON products FOR DELETE USING (auth.role() = 'authenticated');

-- Courses policies: public read, authenticated write
CREATE POLICY "courses_select_all" ON courses FOR SELECT USING (true);
CREATE POLICY "courses_insert_auth" ON courses FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "courses_update_auth" ON courses FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "courses_delete_auth" ON courses FOR DELETE USING (auth.role() = 'authenticated');

-- Orders policies: public insert, authenticated read/update
CREATE POLICY "orders_insert_all" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_select_auth" ON orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "orders_update_auth" ON orders FOR UPDATE USING (auth.role() = 'authenticated');

-- Messages policies: public insert, authenticated read/update/delete
CREATE POLICY "messages_insert_all" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "messages_select_auth" ON messages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "messages_update_auth" ON messages FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "messages_delete_auth" ON messages FOR DELETE USING (auth.role() = 'authenticated');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_orders_statut ON orders(statut);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);
