-- ล้างข้อมูลเก่าออกทั้งหมดเพื่อความสะอาด (ป้องกันข้อมูลซ้ำซ้อน)
TRUNCATE TABLE recipes, products, ingredients CASCADE;

-- 1. สร้างฐานข้อมูลวัตถุดิบ (Ingredients)
INSERT INTO ingredients (name, unit, cost_per_unit, stock_quantity, low_stock_threshold) VALUES
('ข้าวสาร', 'kg', 40, 50, 10),
('เนื้อหมู', 'kg', 150, 20, 5),
('เนื้อไก่', 'kg', 80, 20, 5),
('ขนมปังเบอร์เกอร์', 'piece', 10, 100, 20),
('ขนมปังแผ่น', 'piece', 3, 100, 20),
('มันฝรั่งแช่แข็ง', 'kg', 80, 30, 5),
('กะทิ', 'l', 60, 10, 2),
('แป้ง', 'kg', 30, 20, 5),
('น้ำตาล', 'kg', 25, 20, 5),
('ผงชา', 'kg', 200, 5, 1),
('มะนาว', 'piece', 3, 100, 20),
('โซดา', 'bottle', 10, 100, 20),
('มะละกอ', 'kg', 20, 10, 3),
('น้ำอัดลมขวด', 'bottle', 12, 100, 24),
('น้ำดื่มขวด', 'bottle', 5, 100, 24),
('ไส้กรอกอีสานดิบ', 'kg', 120, 10, 2),
('ลูกชุบสำเร็จรูป', 'box', 25, 50, 10),
('เนื้อเฉาก๊วย', 'kg', 40, 10, 2),
('ข้าวเหนียว', 'kg', 45, 20, 5),
('มะม่วงสุก', 'piece', 20, 30, 10);

-- 2. สร้างเมนูสินค้า (Products) พร้อมดึง URL รูปภาพจาก Cloud ที่อัปโหลดไว้
INSERT INTO products (name, price, category, image) VALUES
('ข้าวผัดอเมริกัน', 89, 'Main Course', 'https://ggjbslgdroldfwevukbw.supabase.co/storage/v1/object/public/product_images/american-fried-rice.jpg'),
('บัวลอย', 35, 'Desserts', 'https://ggjbslgdroldfwevukbw.supabase.co/storage/v1/object/public/product_images/bua-loi.jpg'),
('นักเก็ตไก่', 59, 'Snacks', 'https://ggjbslgdroldfwevukbw.supabase.co/storage/v1/object/public/product_images/chicken-nuggets.jpg'),
('ไก่ป๊อป', 49, 'Snacks', 'https://ggjbslgdroldfwevukbw.supabase.co/storage/v1/object/public/product_images/chicken-pop.jpg'),
('ไอศกรีมกะทิ', 40, 'Desserts', 'https://ggjbslgdroldfwevukbw.supabase.co/storage/v1/object/public/product_images/coconut-ice-cream.jpg'),
('เบอร์เกอร์ไก่กรอบ', 89, 'Main Course', 'https://ggjbslgdroldfwevukbw.supabase.co/storage/v1/object/public/product_images/crispy-chicken-burger.jpg'),
('เฟรนช์ฟรายส์', 49, 'Snacks', 'https://ggjbslgdroldfwevukbw.supabase.co/storage/v1/object/public/product_images/french-fries.jpg'),
('เฉาก๊วยนมสด', 35, 'Desserts', 'https://ggjbslgdroldfwevukbw.supabase.co/storage/v1/object/public/product_images/grass-jelly.jpg'),
('ขนมปังปิ้งเนยนม', 35, 'Snacks', 'https://ggjbslgdroldfwevukbw.supabase.co/storage/v1/object/public/product_images/grilled-bread.jpg'),
('ไส้กรอกอีสาน', 50, 'Snacks', 'https://ggjbslgdroldfwevukbw.supabase.co/storage/v1/object/public/product_images/isan-sausage.jpg'),
('แดงมะนาวโซดา', 45, 'Drinks', 'https://ggjbslgdroldfwevukbw.supabase.co/storage/v1/object/public/product_images/lemon-soda.jpg'),
('ชามะนาว', 40, 'Drinks', 'https://ggjbslgdroldfwevukbw.supabase.co/storage/v1/object/public/product_images/lemon-tea.jpg'),
('ลูกชุบ', 40, 'Desserts', 'https://ggjbslgdroldfwevukbw.supabase.co/storage/v1/object/public/product_images/luk-chup.jpg'),
('ข้าวเหนียวมะม่วง', 80, 'Desserts', 'https://ggjbslgdroldfwevukbw.supabase.co/storage/v1/object/public/product_images/mango-sticky-rice.jpg'),
('เบอร์เกอร์หมู', 99, 'Main Course', 'https://ggjbslgdroldfwevukbw.supabase.co/storage/v1/object/public/product_images/pork-burger.jpg'),
('น้ำอัดลม', 20, 'Drinks', 'https://ggjbslgdroldfwevukbw.supabase.co/storage/v1/object/public/product_images/soft-drink.jpg'),
('ส้มตำไทย', 50, 'Main Course', 'https://ggjbslgdroldfwevukbw.supabase.co/storage/v1/object/public/product_images/somtam-thai.jpg'),
('ข้าวยำไก่แซ่บ', 69, 'Main Course', 'https://ggjbslgdroldfwevukbw.supabase.co/storage/v1/object/public/product_images/spicy-thai-fried-chicken.jpg'),
('ข้าวเหนียวหมูทอด', 45, 'Main Course', 'https://ggjbslgdroldfwevukbw.supabase.co/storage/v1/object/public/product_images/sticky-rice-fried-pork.jpg'),
('น้ำเปล่า', 15, 'Drinks', 'https://ggjbslgdroldfwevukbw.supabase.co/storage/v1/object/public/product_images/water.jpg');

-- 3. ผูกสูตรอาหาร (Recipes) ตัดสต๊อกอัตโนมัติ
INSERT INTO recipes (product_id, ingredient_id, quantity_required) VALUES
((SELECT id FROM products WHERE name = 'ข้าวผัดอเมริกัน'), (SELECT id FROM ingredients WHERE name = 'ข้าวสาร'), 0.2),
((SELECT id FROM products WHERE name = 'ข้าวผัดอเมริกัน'), (SELECT id FROM ingredients WHERE name = 'เนื้อไก่'), 0.1),

((SELECT id FROM products WHERE name = 'บัวลอย'), (SELECT id FROM ingredients WHERE name = 'แป้ง'), 0.05),
((SELECT id FROM products WHERE name = 'บัวลอย'), (SELECT id FROM ingredients WHERE name = 'กะทิ'), 0.1),
((SELECT id FROM products WHERE name = 'บัวลอย'), (SELECT id FROM ingredients WHERE name = 'น้ำตาล'), 0.05),

((SELECT id FROM products WHERE name = 'นักเก็ตไก่'), (SELECT id FROM ingredients WHERE name = 'เนื้อไก่'), 0.15),
((SELECT id FROM products WHERE name = 'ไก่ป๊อป'), (SELECT id FROM ingredients WHERE name = 'เนื้อไก่'), 0.12),

((SELECT id FROM products WHERE name = 'เบอร์เกอร์ไก่กรอบ'), (SELECT id FROM ingredients WHERE name = 'ขนมปังเบอร์เกอร์'), 1),
((SELECT id FROM products WHERE name = 'เบอร์เกอร์ไก่กรอบ'), (SELECT id FROM ingredients WHERE name = 'เนื้อไก่'), 0.15),

((SELECT id FROM products WHERE name = 'เบอร์เกอร์หมู'), (SELECT id FROM ingredients WHERE name = 'ขนมปังเบอร์เกอร์'), 1),
((SELECT id FROM products WHERE name = 'เบอร์เกอร์หมู'), (SELECT id FROM ingredients WHERE name = 'เนื้อหมู'), 0.15),

((SELECT id FROM products WHERE name = 'เฟรนช์ฟรายส์'), (SELECT id FROM ingredients WHERE name = 'มันฝรั่งแช่แข็ง'), 0.2),

((SELECT id FROM products WHERE name = 'เฉาก๊วยนมสด'), (SELECT id FROM ingredients WHERE name = 'เนื้อเฉาก๊วย'), 0.1),

((SELECT id FROM products WHERE name = 'ขนมปังปิ้งเนยนม'), (SELECT id FROM ingredients WHERE name = 'ขนมปังแผ่น'), 2),

((SELECT id FROM products WHERE name = 'ไส้กรอกอีสาน'), (SELECT id FROM ingredients WHERE name = 'ไส้กรอกอีสานดิบ'), 0.2),

((SELECT id FROM products WHERE name = 'แดงมะนาวโซดา'), (SELECT id FROM ingredients WHERE name = 'โซดา'), 1),
((SELECT id FROM products WHERE name = 'แดงมะนาวโซดา'), (SELECT id FROM ingredients WHERE name = 'มะนาว'), 1),

((SELECT id FROM products WHERE name = 'ชามะนาว'), (SELECT id FROM ingredients WHERE name = 'ผงชา'), 0.01),
((SELECT id FROM products WHERE name = 'ชามะนาว'), (SELECT id FROM ingredients WHERE name = 'มะนาว'), 1),

((SELECT id FROM products WHERE name = 'ข้าวเหนียวมะม่วง'), (SELECT id FROM ingredients WHERE name = 'ข้าวเหนียว'), 0.15),
((SELECT id FROM products WHERE name = 'ข้าวเหนียวมะม่วง'), (SELECT id FROM ingredients WHERE name = 'มะม่วงสุก'), 1),
((SELECT id FROM products WHERE name = 'ข้าวเหนียวมะม่วง'), (SELECT id FROM ingredients WHERE name = 'กะทิ'), 0.05),

((SELECT id FROM products WHERE name = 'ส้มตำไทย'), (SELECT id FROM ingredients WHERE name = 'มะละกอ'), 0.15),
((SELECT id FROM products WHERE name = 'ส้มตำไทย'), (SELECT id FROM ingredients WHERE name = 'มะนาว'), 1),

((SELECT id FROM products WHERE name = 'ข้าวยำไก่แซ่บ'), (SELECT id FROM ingredients WHERE name = 'ข้าวสาร'), 0.15),
((SELECT id FROM products WHERE name = 'ข้าวยำไก่แซ่บ'), (SELECT id FROM ingredients WHERE name = 'เนื้อไก่'), 0.15),

((SELECT id FROM products WHERE name = 'ข้าวเหนียวหมูทอด'), (SELECT id FROM ingredients WHERE name = 'ข้าวเหนียว'), 0.15),
((SELECT id FROM products WHERE name = 'ข้าวเหนียวหมูทอด'), (SELECT id FROM ingredients WHERE name = 'เนื้อหมู'), 0.15),

((SELECT id FROM products WHERE name = 'น้ำอัดลม'), (SELECT id FROM ingredients WHERE name = 'น้ำอัดลมขวด'), 1),

((SELECT id FROM products WHERE name = 'น้ำเปล่า'), (SELECT id FROM ingredients WHERE name = 'น้ำดื่มขวด'), 1),

((SELECT id FROM products WHERE name = 'ลูกชุบ'), (SELECT id FROM ingredients WHERE name = 'ลูกชุบสำเร็จรูป'), 1);
