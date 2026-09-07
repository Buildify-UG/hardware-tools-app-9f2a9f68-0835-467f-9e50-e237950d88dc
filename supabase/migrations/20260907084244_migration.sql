CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price INTEGER NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  image VARCHAR(10),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO products (name, category, price, stock, image) VALUES
  ('हथौड़ा 2kg', 'हाथ के उपकरण', 450, 25, '🔨'),
  ('स्क्रूड्राइवर सेट', 'हाथ के उपकरण', 320, 40, '🔧'),
  ('ड्रिल मशीन', 'विद्युत उपकरण', 3500, 8, '⚙️'),
  ('कोण लोहा 2x2 inch', 'हार्डवेयर', 85, 150, '📦'),
  ('बोल्ट & नट असॉर्टेड', 'हार्डवेयर', 180, 200, '🔩'),
  ('पेंच (विभिन्न आकार)', 'हार्डवेयर', 120, 300, '📌'),
  ('चेन 10mm', 'मशीनरी', 650, 12, '⛓️'),
  ('बेयरिंग SKF', 'मशीनरी', 1200, 5, '⭕');

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON products FOR SELECT TO anon USING (true);

CREATE POLICY "Allow all for authenticated" ON products FOR ALL TO authenticated USING (true) WITH CHECK (true);