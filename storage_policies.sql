-- อนุญาตให้ทุกคนสามารถดูรูปได้
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'product_images');

-- อนุญาตให้แอปของเราอัปโหลดรูปได้โดยไม่ต้องล็อกอิน (Anonymous)
CREATE POLICY "Public Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product_images');

-- อนุญาตให้อัปเดตรูปเดิมได้
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE WITH CHECK (bucket_id = 'product_images');

-- อนุญาตให้ลบรูปได้
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING (bucket_id = 'product_images');
